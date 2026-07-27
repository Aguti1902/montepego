"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/i18n/navigation";
import { formatPrice } from "@/lib/utils";

type Result = {
  slug: string;
  title: string;
  price: number;
  reference: string;
  coverUrl: string | null;
  bedrooms: number;
  bathrooms: number;
  builtArea: number | null;
  type: string;
};

function SearchResultCard({
  item,
  locale,
}: {
  item: Result;
  locale: string;
}) {
  const cover = item.coverUrl ?? "/placeholders/hero-monte-pego.svg";

  return (
    <Link
      href={{ pathname: "/property/[slug]", params: { slug: item.slug } }}
      className="group flex flex-col overflow-hidden rounded-[1.25rem] bg-white ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(26,34,44,0.08)]"
    >
      <div className="relative aspect-[3/2] overflow-hidden bg-muted">
        <Image
          src={cover}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Ref. {item.reference}
          </p>
          <p className="tabular text-base font-medium text-sea-deep">
            {formatPrice(item.price, locale)}
          </p>
        </div>
        <h3 className="font-display text-lg leading-snug text-ink group-hover:text-sea-deep">
          {item.title}
        </h3>
        <p className="tabular text-sm text-muted-foreground">
          {item.bedrooms} bed · {item.bathrooms} bath
          {item.builtArea != null ? ` · ${item.builtArea} m²` : ""}
        </p>
      </div>
    </Link>
  );
}

export function ConversationalSearch() {
  const locale = useLocale();
  const t = useTranslations("Home");
  const [query, setQuery] = useState("");
  const [pending, startTransition] = useTransition();
  const [results, setResults] = useState<Result[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    startTransition(async () => {
      setMessage(null);
      setExplanation(null);
      const response = await fetch("/api/ai/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, locale }),
      });
      const data = (await response.json()) as {
        results?: Result[];
        nearest?: Result[];
        message?: string;
        explanation?: string;
      };
      setExplanation(data.explanation ?? null);
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
      {explanation ? (
        <p className="text-sm text-muted-foreground">{explanation}</p>
      ) : null}
      {message ? (
        <p className="text-sm font-medium text-sea-deep">{message}</p>
      ) : null}
      {results.length > 0 ? (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {t("aiSearchResults", { count: results.length })}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((item) => (
              <SearchResultCard key={item.slug} item={item} locale={locale} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
