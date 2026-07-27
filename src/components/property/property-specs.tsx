import {
  Bath,
  BedDouble,
  Calendar,
  Compass,
  Home,
  Layers,
  MapPin,
  Mountain,
  Ruler,
  Zap,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { ResolvedProperty } from "@/lib/db/types";
import { cn } from "@/lib/utils";

type PropertySpecsProps = {
  property: ResolvedProperty;
  locale: string;
  className?: string;
  compact?: boolean;
};

export async function PropertySpecs({
  property,
  locale,
  className,
  compact = false,
}: PropertySpecsProps) {
  const t = await getTranslations("Property");
  const tp = await getTranslations("Properties");
  const tt = await getTranslations("PropertyTypes");

  const items = [
    {
      icon: Home,
      label: t("type"),
      value: tt(property.type),
      show: true,
    },
    {
      icon: BedDouble,
      label: tp("bedrooms"),
      value: String(property.bedrooms),
      show: property.bedrooms > 0,
    },
    {
      icon: Bath,
      label: t("bathrooms"),
      value: String(property.bathrooms),
      show: property.bathrooms > 0,
    },
    {
      icon: Ruler,
      label: tp("built"),
      value: `${property.builtArea} m²`,
      show: property.builtArea != null,
    },
    {
      icon: Layers,
      label: tp("plot"),
      value: `${property.plotArea} m²`,
      show: property.plotArea != null,
    },
    {
      icon: Ruler,
      label: t("terrace"),
      value: `${property.terraceArea} m²`,
      show: property.terraceArea != null,
    },
    {
      icon: Calendar,
      label: t("yearBuilt"),
      value: String(property.yearBuilt),
      show: property.yearBuilt != null,
    },
    {
      icon: Zap,
      label: t("energyRating"),
      value: property.energyRating ?? "",
      show: Boolean(property.energyRating),
    },
    {
      icon: Mountain,
      label: t("elevation"),
      value: `${property.elevation} m`,
      show: property.elevation != null,
    },
    {
      icon: Compass,
      label: t("orientation"),
      value: property.orientation ?? "",
      show: Boolean(property.orientation),
    },
    {
      icon: MapPin,
      label: t("views"),
      value: property.viewRelation ?? "",
      show: Boolean(property.viewRelation),
    },
  ].filter((item) => item.show);

  if (items.length === 0) return null;

  return (
    <section className={cn(className)}>
      <h2 className="font-display text-2xl">{t("keyFacts")}</h2>
      <dl
        className={cn(
          "mt-4 grid gap-3",
          compact ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3",
        )}
      >
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="flex items-start gap-3 rounded-2xl bg-white/75 px-4 py-3 ring-1 ring-black/[0.04]"
            >
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sea-deep/10 text-sea-deep">
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              <div className="min-w-0">
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  {item.label}
                </dt>
                <dd className="tabular text-sm font-medium text-ink">
                  {item.value}
                </dd>
              </div>
            </div>
          );
        })}
      </dl>
    </section>
  );
}
