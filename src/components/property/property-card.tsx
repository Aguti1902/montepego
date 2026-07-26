import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { ElevationStrip } from "@/components/property/elevation-strip";
import { formatPrice } from "@/lib/utils";
import type { SeedProperty } from "@/lib/db/seed-data";

type PropertyCardProps = {
  property: SeedProperty;
  locale: string;
};

export async function PropertyCard({ property, locale }: PropertyCardProps) {
  const t = await getTranslations("Properties");
  const common = await getTranslations("Common");
  const title = property.titles[locale] ?? property.titles.en;

  return (
    <article className="group flex flex-col overflow-hidden border border-border bg-card">
      <Link href={{ pathname: "/property/[slug]", params: { slug: property.slug } }}>
        <div className="relative aspect-[3/2] overflow-hidden bg-muted">
          <Image
            src={property.coverPlaceholder}
            alt={title}
            fill
            className="object-cover transition-opacity duration-300 group-hover:opacity-95"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          {property.status === "sold" && (
            <Badge variant="sold" className="absolute left-3 top-3">
              {t("sold")}
            </Badge>
          )}
          {property.status === "reserved" && (
            <Badge variant="reserved" className="absolute left-3 top-3">
              {t("reserved")}
            </Badge>
          )}
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {t("ref")} {property.reference}
          </p>
          <p className="tabular text-lg font-medium text-sea-deep">
            {formatPrice(property.price, locale)}
          </p>
        </div>
        <h3 className="font-display text-xl leading-snug text-ink">
          <Link
            href={{ pathname: "/property/[slug]", params: { slug: property.slug } }}
            className="hover:text-sea-deep"
          >
            {title}
          </Link>
        </h3>
        <p className="tabular text-sm text-muted-foreground">
          {property.bedrooms} bed · {property.bathrooms} bath
          {property.builtArea != null ? ` · ${property.builtArea} m²` : ""}
          {property.plotArea != null ? ` · ${property.plotArea} m² plot` : ""}
        </p>
        <ElevationStrip
          elevation={property.elevation}
          orientation={property.orientation}
          viewRelation={property.viewRelation}
        />
        <Link
          href={{ pathname: "/property/[slug]", params: { slug: property.slug } }}
          className="mt-auto pt-2 text-sm font-medium text-sea-deep hover:underline"
        >
          {property.type === "villa" ? common("viewVilla") : common("viewHome")}
        </Link>
      </div>
    </article>
  );
}
