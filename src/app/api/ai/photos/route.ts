import { NextResponse } from "next/server";
import { z } from "zod";
import { completeJson } from "@/lib/ai/client";
import {
  PHOTOS_PROMPT_VERSION,
  photosSystemPrompt,
} from "@/lib/ai/prompts/photos";

const bodySchema = z.object({
  imageUrl: z.string().min(1),
  propertyReference: z.string().optional(),
});

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos no válidos" }, { status: 400 });
  }

  const fallback = {
    roomType: "facade",
    qualityScore: 7.5,
    suggestCover: true,
    blurRequired: false,
    alt: {
      en: "Property photo in Monte Pego",
      nl: "Woningfoto in Monte Pego",
      de: "Immobilienfoto in Monte Pego",
      fr: "Photo du bien à Monte Pego",
      pl: "Zdjęcie nieruchomości w Monte Pego",
      es: "Foto de la propiedad en Monte Pego",
    },
  };

  const result = await completeJson<typeof fallback>({
    module: `photos:${PHOTOS_PROMPT_VERSION}`,
    system: photosSystemPrompt,
    user: JSON.stringify(parsed.data),
    fallback,
  });

  return NextResponse.json({
    ...result.data,
    costUsd: result.costUsd,
    mocked: result.mocked,
  });
}
