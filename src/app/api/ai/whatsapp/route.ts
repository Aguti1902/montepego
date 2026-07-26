import { NextResponse } from "next/server";
import { z } from "zod";
import { completeJson } from "@/lib/ai/client";
import {
  WHATSAPP_PROMPT_VERSION,
  whatsappSystemPrompt,
} from "@/lib/ai/prompts/whatsapp";
import { createLead } from "@/lib/db/queries/leads";
import { listProperties } from "@/lib/db/queries/properties";
import { siteConfig } from "@/config/site";

const bodySchema = z.object({
  from: z.string().min(3),
  message: z.string().min(1),
  name: z.string().optional(),
  locale: z.enum(["en", "nl", "de", "fr", "pl", "es"]).optional(),
});

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos no válidos" }, { status: 400 });
  }

  const { items } = await listProperties({
    locale: parsed.data.locale ?? "en",
    pageSize: 8,
  });

  const catalogue = items.map((p) => ({
    reference: p.reference,
    title: p.title,
    price: p.price,
    bedrooms: p.bedrooms,
    type: p.type,
  }));

  const ai = await completeJson<{
    reply: string;
    handoff: boolean;
    locale: string;
    qualified: boolean;
  }>({
    module: `whatsapp:${WHATSAPP_PROMPT_VERSION}`,
    system: whatsappSystemPrompt,
    user: JSON.stringify({
      message: parsed.data.message,
      catalogue,
      office: siteConfig.contact,
    }),
    fallback: {
      reply: `Thanks for contacting MontePego Life. We currently have ${catalogue.length} homes available. Call ${siteConfig.contact.phones[0]} or tell us your budget and bedrooms.`,
      handoff: true,
      locale: parsed.data.locale ?? "en",
      qualified: false,
    },
  });

  await createLead({
    name: parsed.data.name ?? `WhatsApp ${parsed.data.from}`,
    email: `${parsed.data.from.replace(/\W/g, "")}@whatsapp.lead`,
    phone: parsed.data.from,
    locale: (ai.data.locale as "en") ?? "en",
    message: parsed.data.message,
    source: "whatsapp",
    preferences: {
      handoff: ai.data.handoff,
      qualified: ai.data.qualified,
      reply: ai.data.reply,
    },
  });

  return NextResponse.json({
    reply: ai.data.reply,
    handoff: ai.data.handoff,
    locale: ai.data.locale,
    costUsd: ai.costUsd,
    mocked: ai.mocked,
  });
}
