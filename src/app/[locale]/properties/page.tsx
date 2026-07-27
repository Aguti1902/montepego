import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/config/site";
import { PropertyCard } from "@/components/property/property-card";
import { PropertyFilters } from "@/components/property/property-filters";
import { ConversationalSearch } from "@/components/property/conversational-search";
import { listProperties } from "@/lib/db/queries/properties";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { Link } from "@/lib/i18n/navigation";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function num(value: string | string[] | undefined) {
  if (typeof value !== "string" || value === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Properties" });
  return buildPageMetadata({
    locale: locale as Locale,
    title: t("title"),
    description: t("title"),
    href: { pathname: "/properties" },
  });
}

export default async function PropertiesPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("Properties");

  const page = num(sp.page) ?? 1;
  const { items, total, pageSize } = await listProperties({
    locale,
    minPrice: num(sp.minPrice),
    maxPrice: num(sp.maxPrice),
    bedrooms: num(sp.bedrooms),
    type:
      typeof sp.type === "string"
        ? [sp.type as "villa" | "apartment" | "plot" | "townhouse" | "commercial"]
        : undefined,
    sort:
      typeof sp.sort === "string"
        ? (sp.sort as "price_asc" | "price_desc" | "newest" | "oldest")
        : "newest",
    q: typeof sp.q === "string" ? sp.q : undefined,
    page,
    pageSize: 12,
  });

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="mx-auto max-w-6xl px-4 pb-12 pt-24">
      <h1 className="font-display text-4xl text-ink">{t("title")}</h1>
      <div className="mt-6 space-y-4">
        <ConversationalSearch />
        <Suspense fallback={null}>
          <PropertyFilters />
        </Suspense>
      </div>
      <p className="mt-4 tabular text-sm text-muted-foreground">
        {total} · {page}/{totalPages}
      </p>
      {items.length === 0 ? (
        <p className="mt-10 text-muted-foreground">{t("noResults")}</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              locale={locale}
            />
          ))}
        </div>
      )}
      {totalPages > 1 ? (
        <nav className="mt-10 flex gap-3" aria-label="Pagination">
          {page > 1 ? (
            <Link
              href={`/properties?page=${page - 1}` as "/properties"}
              className="text-sm text-sea-deep hover:underline"
            >
              ←
            </Link>
          ) : null}
          {page < totalPages ? (
            <Link
              href={`/properties?page=${page + 1}` as "/properties"}
              className="text-sm text-sea-deep hover:underline"
            >
              →
            </Link>
          ) : null}
        </nav>
      ) : null}
    </div>
  );
}
