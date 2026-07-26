import { NextResponse } from "next/server";
import { valuationSchema } from "@/lib/validators/valuations";
import { completeJson } from "@/lib/ai/client";
import {
  VALUATION_PROMPT_VERSION,
  valuationSystemPrompt,
} from "@/lib/ai/prompts/valuation";
import { createValuation, updateValuationEstimate } from "@/lib/db/queries/valuations";
import { createLead } from "@/lib/db/queries/leads";

export async function POST(request: Request) {
  const parsed = valuationSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos no válidos" }, { status: 400 });
  }

  const data = parsed.data;
  const valuation = await createValuation({
    name: data.name,
    email: data.email,
    phone: data.phone || undefined,
    address: data.address,
    propertyType: data.propertyType,
    bedrooms: data.bedrooms,
    builtArea: data.builtArea,
    plotArea: data.plotArea,
    condition: data.condition || undefined,
  });

  const base = data.builtArea
    ? data.builtArea * 2200
    : data.plotArea
      ? data.plotArea * 180
      : 350000;

  const ai = await completeJson<{
    estimateMin: number;
    estimateMax: number;
    reasoning: string;
  }>({
    module: `valuation:${VALUATION_PROMPT_VERSION}`,
    system: valuationSystemPrompt,
    user: JSON.stringify(data),
    fallback: {
      estimateMin: Math.round(base * 0.9),
      estimateMax: Math.round(base * 1.15),
      reasoning:
        "Estimación orientativa basada en tipología y superficie aportadas en Monte Pego. No es una tasación oficial.",
    },
  });

  await updateValuationEstimate(valuation.id, {
    aiEstimateMin: ai.data.estimateMin,
    aiEstimateMax: ai.data.estimateMax,
    aiReasoning: ai.data.reasoning,
  });

  await createLead({
    name: data.name,
    email: data.email,
    phone: data.phone || undefined,
    locale: "en",
    message: `Valuation ${data.address}`,
    source: "valuation",
    preferences: { valuationId: valuation.id },
  });

  return NextResponse.json({
    id: valuation.id,
    estimateMin: ai.data.estimateMin,
    estimateMax: ai.data.estimateMax,
    reasoning: ai.data.reasoning,
    disclaimer:
      "Estimación orientativa. No constituye una tasación oficial.",
    costUsd: ai.costUsd,
    mocked: ai.mocked,
  });
}
