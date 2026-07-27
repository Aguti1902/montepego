import { NextResponse } from "next/server";
import { z } from "zod";
import { completeJson } from "@/lib/ai/client";
import { CHAT_PROMPT_VERSION, chatSystemPrompt } from "@/lib/ai/prompts/chat";
import { listProperties } from "@/lib/db/queries/properties";

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(2000),
});

const bodySchema = z.object({
  messages: z.array(messageSchema).min(1).max(20),
  locale: z.enum(["en", "nl", "de", "fr", "pl", "es"]).default("en"),
  context: z.enum(["public", "admin", "portal"]).default("public"),
});

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos no válidos" }, { status: 400 });
  }

  const { messages, locale, context } = parsed.data;
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUser) {
    return NextResponse.json({ error: "Falta mensaje" }, { status: 400 });
  }

  const featured = await listProperties({
    locale,
    featuredOnly: true,
    pageSize: 4,
  });

  const catalogHint = featured.items
    .map(
      (p) =>
        `${p.reference}: ${p.title} — €${p.price} — /${locale}/property/${p.slug}`,
    )
    .join("\n");

  const history = messages
    .slice(-8)
    .map((m) => `${m.role}: ${m.content}`)
    .join("\n");

  const fallbackReply =
    context === "admin"
      ? "Puedo ayudarte con leads, overrides y redacción. Indica la referencia o la tarea."
      : context === "portal"
        ? "En el portal puedo orientarte sobre tu vivienda y servicios del residencial. ¿Qué necesitas?"
        : "Soy el asistente de MontePego Life. Puedo ayudarte a buscar villa o apartamento, valorar tu vivienda o explicarte los servicios del residencial. ¿Qué buscas?";

  const ai = await completeJson<{
    reply: string;
    suggestedLinks: string[];
  }>({
    module: `chat:${CHAT_PROMPT_VERSION}:${context}`,
    system: `${chatSystemPrompt}\nContext: ${context}\nFeatured stock:\n${catalogHint || "(none)"}`,
    user: history,
    fallback: {
      reply: fallbackReply,
      suggestedLinks: ["/properties", "/contact", "/sell"],
    },
  });

  return NextResponse.json({
    reply: ai.data.reply,
    suggestedLinks: ai.data.suggestedLinks ?? [],
    costUsd: ai.costUsd,
    mocked: ai.mocked,
  });
}
