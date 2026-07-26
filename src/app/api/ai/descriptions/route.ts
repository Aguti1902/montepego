import { NextResponse } from "next/server";
import { z } from "zod";
import { completeJson } from "@/lib/ai/client";
import {
  DESCRIPTIONS_PROMPT_VERSION,
  descriptionsSystemPrompt,
} from "@/lib/ai/prompts/descriptions";
import { getPropertyBySlug } from "@/lib/db/queries/properties";
import { upsertTranslation } from "@/lib/db/queries/translations";

const bodySchema = z.object({
  slug: z.string().min(1),
  persist: z.boolean().optional(),
});

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos no válidos" }, { status: 400 });
  }

  const property = await getPropertyBySlug(parsed.data.slug, "en");
  if (!property) {
    return NextResponse.json({ error: "Propiedad no encontrada" }, { status: 404 });
  }

  const fallback = {
    locales: Object.fromEntries(
      ["en", "nl", "de", "fr", "pl", "es"].map((locale) => [
        locale,
        {
          title: property.title,
          description: property.description,
        },
      ]),
    ),
  };

  const result = await completeJson<typeof fallback>({
    module: `descriptions:${DESCRIPTIONS_PROMPT_VERSION}`,
    system: descriptionsSystemPrompt,
    user: JSON.stringify({
      reference: property.reference,
      type: property.type,
      price: property.price,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      builtArea: property.builtArea,
      plotArea: property.plotArea,
      features: property.features,
      elevation: property.elevation,
      orientation: property.orientation,
      viewRelation: property.viewRelation,
    }),
    fallback,
  });

  if (parsed.data.persist && !property.id.startsWith("seed-")) {
    for (const [locale, copy] of Object.entries(result.data.locales)) {
      await upsertTranslation({
        propertyId: property.id,
        locale,
        title: copy.title,
        description: copy.description,
        source: "ai_generated",
        reviewed: false,
      });
    }
  }

  return NextResponse.json({
    ...result.data,
    costUsd: result.costUsd,
    mocked: result.mocked,
    reviewedRequired: true,
  });
}
