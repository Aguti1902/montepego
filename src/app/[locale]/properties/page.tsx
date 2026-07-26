import { getTranslations, setRequestLocale } from "next-intl/server";
import { PropertyCard } from "@/components/property/property-card";
import { listProperties } from "@/lib/db/queries/properties";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function num(value: string | string[] | undefined) {
  if (typeof value !== "string" || value === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
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
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-4xl text-ink">{t("title")}</h1>
      <p className="mt-2 tabular text-sm text-muted-foreground">
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
    </div>
  );
}
