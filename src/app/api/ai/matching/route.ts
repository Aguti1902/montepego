import { NextResponse } from "next/server";
import { z } from "zod";
import { completeJson } from "@/lib/ai/client";
import {
  MATCHING_PROMPT_VERSION,
  matchingSystemPrompt,
} from "@/lib/ai/prompts/matching";
import { getPropertyBySlug } from "@/lib/db/queries/properties";
import { listLeads } from "@/lib/db/queries/leads";

const bodySchema = z.object({
  slug: z.string().min(1),
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

  const leads = await listLeads();
  const matches: Array<{
    leadId: string;
    email: string;
    score: number;
    reason: string;
    shouldAlert: boolean;
  }> = [];

  for (const lead of leads.slice(0, 20)) {
    const prefs = (lead.preferences ?? {}) as Record<string, unknown>;
    const ai = await completeJson<{
      score: number;
      reason: string;
      shouldAlert: boolean;
    }>({
      module: `matching:${MATCHING_PROMPT_VERSION}`,
      system: matchingSystemPrompt,
      user: JSON.stringify({
        property: {
          price: property.price,
          bedrooms: property.bedrooms,
          type: property.type,
          features: property.features,
        },
        lead: {
          budgetMin: lead.budgetMin,
          budgetMax: lead.budgetMax,
          preferences: prefs,
          message: lead.message,
        },
      }),
      fallback: {
        score:
          lead.budgetMax && property.price <= lead.budgetMax ? 75 : 40,
        reason: "Comparación básica por presupuesto y tipología.",
        shouldAlert: Boolean(
          lead.budgetMax && property.price <= lead.budgetMax,
        ),
      },
    });

    matches.push({
      leadId: lead.id,
      email: lead.email,
      score: ai.data.score,
      reason: ai.data.reason,
      shouldAlert: ai.data.shouldAlert,
    });
  }

  return NextResponse.json({
    propertyReference: property.reference,
    matches: matches.sort((a, b) => b.score - a.score),
    alertCount: matches.filter((m) => m.shouldAlert).length,
  });
}
