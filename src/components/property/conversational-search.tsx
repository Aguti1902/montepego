"use client";

import { useState, useTransition } from "react";
import { useLocale } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/i18n/navigation";
import { formatPrice } from "@/lib/utils";

type Result = {
  slug: string;
  title: string;
  price: number;
  reference: string;
};

export function ConversationalSearch() {
  const locale = useLocale();
  const [query, setQuery] = useState("");
  const [pending, startTransition] = useTransition();
  const [results, setResults] = useState<Result[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    startTransition(async () => {
      setMessage(null);
      const response = await fetch("/api/ai/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, locale }),
      });
      const data = (await response.json()) as {
        results?: Result[];
        nearest?: Result[];
        message?: string;
      };
      if (data.results && data.results.length > 0) {
        setResults(data.results);
      } else {
        setResults(data.nearest ?? []);
        setMessage(data.message ?? "No results");
      }
    });
  }

  return (
    <div className="space-y-4">
      <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Villa with pool under €500,000…"
          aria-label="Conversational search"
          className="h-12"
        />
        <Button type="submit" disabled={pending || query.trim().length < 2}>
          {pending ? "…" : "Ask AI"}
        </Button>
      </form>
      {message ? (
        <p className="text-sm text-muted-foreground">{message}</p>
      ) : null}
      <ul className="space-y-2">
        {results.map((item) => (
          <li key={item.slug}>
            <Link
              href={{ pathname: "/property/[slug]", params: { slug: item.slug } }}
              className="text-sm text-sea-deep hover:underline"
            >
              {item.reference} — {item.title} · {formatPrice(item.price, locale)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
