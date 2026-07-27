import type { ComponentType } from "react";
import {
  AirVent,
  AlarmSmoke,
  Flame,
  Flower2,
  Home,
  Mountain,
  Sofa,
  Sun,
  Thermometer,
  Umbrella,
  Waves,
  Wrench,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { FeatureSlug } from "@/config/site";
import type { ResolvedProperty } from "@/lib/db/types";
import { cn } from "@/lib/utils";

const FEATURE_ICONS: Record<FeatureSlug, ComponentType<{ className?: string }>> = {
  pool: Waves,
  sea_view: Waves,
  mountain_view: Mountain,
  garage: Home,
  guest_apartment: Home,
  terrace: Umbrella,
  garden: Flower2,
  air_conditioning: AirVent,
  heating: Thermometer,
  fireplace: Flame,
  solar: Sun,
  renovated: Wrench,
  furnished: Sofa,
  alarm: AlarmSmoke,
};

type PropertyFeaturesProps = {
  property: ResolvedProperty;
  className?: string;
  limit?: number;
};

export async function PropertyFeatures({
  property,
  className,
  limit,
}: PropertyFeaturesProps) {
  const t = await getTranslations("Property");
  const tf = await getTranslations("Features");

  const features = limit
    ? property.features.slice(0, limit)
    : property.features;

  if (features.length === 0) return null;

  return (
    <section className={cn(className)}>
      {!limit ? (
        <h2 className="font-display text-2xl">{t("features")}</h2>
      ) : null}
      <ul
        className={cn(
          "flex flex-wrap gap-2",
          !limit ? "mt-4" : undefined,
        )}
      >
        {features.map((slug) => {
          const Icon = FEATURE_ICONS[slug];
          return (
            <li
              key={slug}
              className="inline-flex items-center gap-2 rounded-full bg-limestone px-3 py-1.5 text-sm text-sea-deep"
            >
              <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
              {tf(slug)}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
