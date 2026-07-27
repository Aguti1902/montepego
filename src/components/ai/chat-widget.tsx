"use client";

import { MessageCircle, Send, X } from "lucide-react";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ChatWidgetProps = {
  locale?: string;
  context?: "public" | "admin" | "portal";
  className?: string;
  defaultOpen?: boolean;
};

export function ChatWidget({
  locale = "en",
  context = "public",
  className,
  defaultOpen = false,
}: ChatWidgetProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [input, setInput] = useState("");
  const [pending, startTransition] = useTransition();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        context === "admin"
          ? "Asistente del panel. Pregúntame por leads, textos o el proceso de sync."
          : "Hola — soy el asistente de MontePego Life. ¿Buscas casa, vender o servicios del residencial?",
    },
  ]);
  const [links, setLinks] = useState<string[]>([]);

  function send() {
    const content = input.trim();
    if (content.length < 2) return;
    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setInput("");
    startTransition(async () => {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, locale, context }),
      });
      const data = (await response.json()) as {
        reply?: string;
        suggestedLinks?: string[];
      };
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            data.reply ??
            "No he podido responder ahora. Llámanos o escribe a info@montepegolife.com.",
        },
      ]);
      setLinks(data.suggestedLinks ?? []);
    });
  }

  return (
    <div className={cn("fixed bottom-5 right-5 z-50", className)}>
      {open ? (
        <div className="mb-3 flex h-[min(520px,70vh)] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-[1.75rem] border border-white/60 bg-white/95 shadow-[0_24px_60px_rgba(26,34,44,0.22)] backdrop-blur-xl">
          <div className="flex items-center justify-between bg-gradient-to-r from-sea-deep to-[#3a6aa3] px-4 py-3.5 text-white">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
                <MessageCircle className="h-4 w-4" aria-hidden />
              </span>
              <div>
                <p className="text-sm font-semibold">MontePego Life</p>
                <p className="text-[11px] text-white/75">Asistente</p>
              </div>
            </div>
            <button
              type="button"
              className="rounded-full p-2 text-white/80 hover:bg-white/10 hover:text-white"
              onClick={() => setOpen(false)}
              aria-label="Cerrar chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={cn(
                  "max-w-[90%] px-3.5 py-2.5 text-sm leading-relaxed",
                  message.role === "user"
                    ? "ml-auto rounded-[1.25rem] rounded-br-md bg-sea-deep text-white"
                    : "rounded-[1.25rem] rounded-bl-md bg-[#eef2f7] text-ink",
                )}
              >
                {message.content}
              </div>
            ))}
            {links.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {links.map((href) => {
                  const path = href.startsWith("/") ? href : `/${href}`;
                  return (
                    <a
                      key={href}
                      href={`/${locale}${path}`}
                      className="rounded-full bg-limestone px-3 py-1 text-xs text-sea-deep"
                      onClick={() => setOpen(false)}
                    >
                      {path}
                    </a>
                  );
                })}
              </div>
            ) : null}
          </div>
          <form
            className="flex gap-2 border-t border-border/70 p-3"
            onSubmit={(event) => {
              event.preventDefault();
              send();
            }}
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu mensaje…"
              disabled={pending}
            />
            <Button
              type="submit"
              size="icon"
              disabled={pending || input.trim().length < 2}
              aria-label="Enviar"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="animate-float flex h-14 w-14 items-center justify-center rounded-full bg-sea-deep text-white shadow-[0_14px_34px_rgba(44,85,138,0.4)] transition hover:scale-105 hover:bg-[#244872]"
        aria-label={open ? "Cerrar chat" : "Abrir chat"}
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}
