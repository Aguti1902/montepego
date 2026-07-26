import { getTranslations, setRequestLocale } from "next-intl/server";
import { PropertyCard } from "@/components/property/property-card";
import { seedProperties } from "@/lib/db/seed-data";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function PropertiesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Properties");

  const list = seedProperties.filter(
    (p) => p.status === "available" || p.status === "reserved",
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-4xl text-ink">{t("title")}</h1>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((property) => (
          <PropertyCard
            key={property.reference}
            property={property}
            locale={locale}
          />
        ))}
      </div>
    </div>
  );
}
