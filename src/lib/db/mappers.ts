import type { FeatureSlug } from "@/config/site";
import type { SeedProperty } from "./seed-data";
import type { ResolvedMedia, ResolvedProperty } from "./types";
import { applyOverrides, type OverrideRecord } from "./apply-overrides";

const FEATURE_SET = new Set<string>([
  "pool",
  "sea_view",
  "mountain_view",
  "garage",
  "guest_apartment",
  "terrace",
  "garden",
  "air_conditioning",
  "heating",
  "fireplace",
  "solar",
  "renovated",
  "furnished",
  "alarm",
]);

export function asFeatures(value: unknown): FeatureSlug[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is FeatureSlug => FEATURE_SET.has(String(item)));
}

export function seedToResolved(
  seed: SeedProperty,
  locale: string,
): ResolvedProperty {
  const title = seed.titles[locale] ?? seed.titles.en;
  const description = seed.descriptions[locale] ?? seed.descriptions.en;
  const media: ResolvedMedia[] = [
    {
      id: `seed-media-${seed.reference}`,
      kind: "photo",
      storagePath: seed.coverPlaceholder,
      width: 1600,
      height: 1067,
      sortOrder: 0,
      alt: `${title} — MontePego Life`,
      isCover: true,
      aiRoomType: "facade",
    },
  ];

  return {
    id: `seed-${seed.reference}`,
    crmId: `mock-${seed.reference}`,
    reference: seed.reference,
    slug: seed.slug,
    status: seed.status,
    type: seed.type,
    price: seed.price,
    priceVisible: true,
    bedrooms: seed.bedrooms,
    bathrooms: seed.bathrooms,
    builtArea: seed.builtArea,
    plotArea: seed.plotArea,
    terraceArea: null,
    yearBuilt: null,
    energyRating: null,
    latitude: seed.latitude,
    longitude: seed.longitude,
    locationPrecision: "approximate",
    features: seed.features,
    elevation: seed.elevation,
    orientation: seed.orientation,
    viewRelation: seed.viewRelation,
    isFeatured: seed.isFeatured,
    publishedAt:
      seed.status === "available" || seed.status === "reserved"
        ? new Date("2026-01-15")
        : seed.status === "sold"
          ? new Date("2025-11-01")
          : null,
    soldAt: seed.status === "sold" ? new Date("2025-11-01") : null,
    overriddenFields: [],
    title,
    description,
    seoTitle: title,
    seoDescription: description.slice(0, 155),
    coverUrl: seed.coverPlaceholder,
    media,
  };
}

type RawPropertyRow = {
  id: string;
  crmId: string | null;
  reference: string;
  slug: string;
  status: ResolvedProperty["status"];
  type: ResolvedProperty["type"];
  price: number;
  priceVisible: boolean;
  bedrooms: number;
  bathrooms: number;
  builtArea: number | null;
  plotArea: number | null;
  terraceArea: number | null;
  yearBuilt: number | null;
  energyRating: string | null;
  latitude: string | null;
  longitude: string | null;
  locationPrecision: ResolvedProperty["locationPrecision"];
  features: unknown;
  elevation: number | null;
  orientation: string | null;
  viewRelation: string | null;
  isFeatured: boolean;
  publishedAt: Date | null;
  soldAt: Date | null;
};

export function mapPropertyWithOverrides(
  row: RawPropertyRow,
  overrides: OverrideRecord[],
  translation: {
    title: string;
    description: string;
    seoTitle: string | null;
    seoDescription: string | null;
  },
  media: ResolvedMedia[],
): ResolvedProperty {
  const base = {
    price: row.price,
    priceVisible: row.priceVisible,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    builtArea: row.builtArea,
    plotArea: row.plotArea,
    terraceArea: row.terraceArea,
    yearBuilt: row.yearBuilt,
    energyRating: row.energyRating,
    latitude: row.latitude,
    longitude: row.longitude,
    locationPrecision: row.locationPrecision,
    features: asFeatures(row.features),
    elevation: row.elevation,
    orientation: row.orientation,
    viewRelation: row.viewRelation,
    isFeatured: row.isFeatured,
    status: row.status,
    type: row.type,
    slug: row.slug,
  };

  const merged = applyOverrides(base, overrides);
  const overriddenFields = [...new Set(overrides.map((o) => o.field))];
  const cover =
    media.find((m) => m.isCover) ??
    media.find((m) => m.kind === "photo") ??
    null;

  return {
    id: row.id,
    crmId: row.crmId,
    reference: row.reference,
    slug: String(merged.slug ?? row.slug),
    status: merged.status as ResolvedProperty["status"],
    type: merged.type as ResolvedProperty["type"],
    price: Number(merged.price),
    priceVisible: Boolean(merged.priceVisible),
    bedrooms: Number(merged.bedrooms),
    bathrooms: Number(merged.bathrooms),
    builtArea:
      merged.builtArea == null ? null : Number(merged.builtArea),
    plotArea: merged.plotArea == null ? null : Number(merged.plotArea),
    terraceArea:
      merged.terraceArea == null ? null : Number(merged.terraceArea),
    yearBuilt: merged.yearBuilt == null ? null : Number(merged.yearBuilt),
    energyRating:
      merged.energyRating == null ? null : String(merged.energyRating),
    latitude: merged.latitude == null ? null : String(merged.latitude),
    longitude: merged.longitude == null ? null : String(merged.longitude),
    locationPrecision:
      merged.locationPrecision as ResolvedProperty["locationPrecision"],
    features: asFeatures(merged.features),
    elevation: merged.elevation == null ? null : Number(merged.elevation),
    orientation:
      merged.orientation == null ? null : String(merged.orientation),
    viewRelation:
      merged.viewRelation == null ? null : String(merged.viewRelation),
    isFeatured: Boolean(merged.isFeatured),
    publishedAt: row.publishedAt,
    soldAt: row.soldAt,
    overriddenFields,
    title: translation.title,
    description: translation.description,
    seoTitle: translation.seoTitle,
    seoDescription: translation.seoDescription,
    coverUrl: cover?.storagePath ?? null,
    media,
  };
}
