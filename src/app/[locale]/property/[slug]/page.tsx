import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ElevationStrip } from "@/components/property/elevation-strip";
import { Badge } from "@/components/ui/badge";
import { seedProperties } from "@/lib/db/seed-data";
import { formatPrice } from "@/lib/utils";
import { siteConfig } from "@/config/site";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function PropertyPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Property");
  const tp = await getTranslations("Properties");

  const property = seedProperties.find((p) => p.slug === slug);
  if (!property) notFound();

  const title = property.titles[locale] ?? property.titles.en;
  const description =
    property.descriptions[locale] ?? property.descriptions.en;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        <Image
          src={property.coverPlaceholder}
          alt={title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>
      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm uppercase tracking-wide text-muted-foreground">
              {tp("ref")} {property.reference}
            </p>
            {property.status === "sold" && (
              <Badge variant="sold">{tp("sold")}</Badge>
            )}
            {property.status === "reserved" && (
              <Badge variant="reserved">{tp("reserved")}</Badge>
            )}
          </div>
          <h1 className="mt-2 font-display text-4xl text-ink">{title}</h1>
          <p className="mt-3 tabular text-2xl text-sea-deep">
            {formatPrice(property.price, locale)}
          </p>
          <ElevationStrip
            className="mt-4"
            elevation={property.elevation}
            orientation={property.orientation}
            viewRelation={property.viewRelation}
          />
          <p className="mt-4 tabular text-muted-foreground">
            {property.bedrooms} bed · {property.bathrooms} bath
            {property.builtArea != null
              ? ` · ${tp("built")} ${property.builtArea} m²`
              : ""}
            {property.plotArea != null
              ? ` · ${tp("plot")} ${property.plotArea} m²`
              : ""}
          </p>
          <h2 className="mt-8 font-display text-2xl">{t("description")}</h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-foreground/90">
            {description}
          </p>
        </div>
        <aside className="h-fit border border-border bg-card p-5 lg:sticky lg:top-6">
          <h2 className="font-display text-xl">{t("contact")}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {siteConfig.contact.phones[0]}
          </p>
          <a
            className="mt-4 inline-flex h-10 items-center justify-center rounded-[var(--radius)] bg-[#25D366] px-4 text-sm font-medium text-white"
            href={`https://wa.me/${siteConfig.contact.whatsapp.replace("+", "")}`}
            target="_blank"
            rel="noreferrer"
          >
            {t("whatsapp")}
          </a>
        </aside>
      </div>
    </div>
  );
}
