import { NextResponse } from "next/server";
import { z } from "zod";
import { completeJson } from "@/lib/ai/client";
import { SEARCH_PROMPT_VERSION, searchSystemPrompt } from "@/lib/ai/prompts/search";
import { listProperties } from "@/lib/db/queries/properties";

const bodySchema = z.object({
  query: z.string().trim().min(2).max(500),
  locale: z.enum(["en", "nl", "de", "fr", "pl", "es"]).default("en"),
});

const filtersSchema = z.object({
  type: z
    .enum(["villa", "apartment", "plot", "townhouse", "commercial"])
    .optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  bedrooms: z.number().optional(),
  features: z.array(z.string()).optional(),
  q: z.string().optional(),
});

function toSearchResult(p: {
  id: string;
  slug: string;
  title: string;
  price: number;
  reference: string;
  coverUrl: string | null;
  bedrooms: number;
  bathrooms: number;
  builtArea: number | null;
  type: string;
}) {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    price: p.price,
    reference: p.reference,
    coverUrl: p.coverUrl,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    builtArea: p.builtArea,
    type: p.type,
  };
}

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos no válidos" }, { status: 400 });
  }

  const ai = await completeJson<{
    filters: z.infer<typeof filtersSchema>;
    explanation: string;
  }>({
    module: `search:${SEARCH_PROMPT_VERSION}`,
    system: searchSystemPrompt,
    user: parsed.data.query,
    fallback: {
      filters: { q: parsed.data.query },
      explanation: "Búsqueda textual directa sobre la cartera real.",
    },
  });

  const filters = filtersSchema.parse(ai.data.filters ?? {});
  const { items, total } = await listProperties({
    locale: parsed.data.locale,
    type: filters.type ? [filters.type] : undefined,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    bedrooms: filters.bedrooms,
    features: filters.features,
    q: filters.q,
    pageSize: 12,
  });

  if (total === 0) {
    const nearest = await listProperties({
      locale: parsed.data.locale,
      pageSize: 3,
      sort: "newest",
    });
    return NextResponse.json({
      filters,
      explanation: ai.data.explanation,
      results: [],
      nearest: nearest.items.map(toSearchResult),
      message: "No hay resultados exactos. Estas son las opciones más cercanas.",
      costUsd: ai.costUsd,
      mocked: ai.mocked,
    });
  }

  return NextResponse.json({
    filters,
    explanation: ai.data.explanation,
    results: items.map(toSearchResult),
    costUsd: ai.costUsd,
    mocked: ai.mocked,
  });
}
