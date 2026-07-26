import { NextResponse } from "next/server";
import { z } from "zod";
import { completeJson } from "@/lib/ai/client";
import {
  LEADS_PROMPT_VERSION,
  leadSummarySystemPrompt,
} from "@/lib/ai/prompts/leads";
import { getDb } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { listLeads } from "@/lib/db/queries/leads";

const bodySchema = z.object({
  leadId: z.string().min(1),
});

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos no válidos" }, { status: 400 });
  }

  const all = await listLeads();
  const lead = all.find((l) => l.id === parsed.data.leadId);
  if (!lead) {
    return NextResponse.json({ error: "Lead no encontrado" }, { status: 404 });
  }

  const ai = await completeJson<{ summary: string; score: number }>({
    module: `leads:${LEADS_PROMPT_VERSION}`,
    system: leadSummarySystemPrompt,
    user: JSON.stringify({
      name: lead.name,
      message: lead.message,
      source: lead.source,
      budgetMin: lead.budgetMin,
      budgetMax: lead.budgetMax,
      preferences: lead.preferences,
    }),
    fallback: {
      summary: lead.message?.slice(0, 180) || "Lead sin mensaje detallado.",
      score: lead.source === "valuation" ? 80 : 55,
    },
  });

  if (process.env.DATABASE_URL && !lead.id.includes("memory")) {
    try {
      const db = getDb();
      await db
        .update(leads)
        .set({
          aiSummary: ai.data.summary,
          aiScore: ai.data.score,
        })
        .where(eq(leads.id, lead.id));
    } catch {
      // memoria / sin BD
    }
  }

  return NextResponse.json({
    leadId: lead.id,
    summary: ai.data.summary,
    score: ai.data.score,
    costUsd: ai.costUsd,
    mocked: ai.mocked,
  });
}
