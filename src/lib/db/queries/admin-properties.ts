import { desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import {
  properties,
  propertyOverrides,
  propertyTranslations,
} from "@/lib/db/schema";
import { demoAdminMeta } from "@/lib/db/admin-demo-data";
import { seedProperties } from "@/lib/db/seed-data";
import { seedToResolved } from "@/lib/db/mappers";
import type { ResolvedProperty } from "@/lib/db/types";

export type AdminPropertyRow = {
  id: string;
  reference: string;
  slug: string;
  status: string;
  type: string;
  price: number;
  builtArea: number | null;
  plotArea: number | null;
  isFeatured: boolean;
  title: string;
  pendingTranslations: number;
  overrideCount: number;
  hasPhotos: boolean;
};

function hasDatabase() {
  return Boolean(process.env.DATABASE_URL);
}

export async function listAdminProperties(): Promise<AdminPropertyRow[]> {
  if (!hasDatabase()) {
    return seedProperties.map((seed) => {
      const resolved = seedToResolved(seed, "en");
      const meta = demoAdminMeta[resolved.reference];
      return {
        id: resolved.id,
        reference: resolved.reference,
        slug: resolved.slug,
        status: resolved.status,
        type: resolved.type,
        price: resolved.price,
        builtArea: resolved.builtArea,
        plotArea: resolved.plotArea,
        isFeatured: resolved.isFeatured,
        title: resolved.title,
        pendingTranslations: meta?.pendingTranslations ?? 0,
        overrideCount: meta?.overrideCount ?? 0,
        hasPhotos: meta?.hasPhotos ?? Boolean(resolved.coverUrl),
      };
    });
  }

  const db = getDb();
  const rows = await db.select().from(properties).orderBy(desc(properties.updatedAt));
  const result: AdminPropertyRow[] = [];

  for (const row of rows) {
    const translations = await db
      .select()
      .from(propertyTranslations)
      .where(eq(propertyTranslations.propertyId, row.id));
    const overrides = await db
      .select()
      .from(propertyOverrides)
      .where(eq(propertyOverrides.propertyId, row.id));
    const en = translations.find((t) => t.locale === "en");

    result.push({
      id: row.id,
      reference: row.reference,
      slug: row.slug,
      status: row.status,
      type: row.type,
      price: row.price,
      builtArea: row.builtArea,
      plotArea: row.plotArea,
      isFeatured: row.isFeatured,
      title: en?.title ?? row.reference,
      pendingTranslations: translations.filter((t) => !t.reviewed).length,
      overrideCount: overrides.length,
      hasPhotos: true,
    });
  }

  return result;
}

export async function getAdminProperty(id: string): Promise<{
  property: ResolvedProperty | null;
  overrides: Array<{ id: string; field: string; value: unknown; reason: string | null }>;
  translations: Array<{
    locale: string;
    title: string;
    description: string;
    reviewed: boolean;
    source: string;
  }>;
}> {
  if (!hasDatabase() || id.startsWith("seed-")) {
    const ref = id.replace("seed-", "");
    const seed = seedProperties.find((p) => p.reference === ref || p.slug === id);
    if (!seed) return { property: null, overrides: [], translations: [] };
    const property = seedToResolved(seed, "es");
    const meta = demoAdminMeta[seed.reference];
    const pending = meta?.pendingTranslations ?? 0;
    const locales = Object.keys(seed.titles);
    return {
      property,
      overrides:
        (meta?.overrideCount ?? 0) > 0
          ? [
              {
                id: `demo-ov-${seed.reference}-price`,
                field: "price",
                value: seed.price,
                reason: "Ajuste comercial demo (manual sobre CRM)",
              },
              ...(meta!.overrideCount > 1
                ? [
                    {
                      id: `demo-ov-${seed.reference}-feat`,
                      field: "isFeatured",
                      value: true,
                      reason: "Destacada en home (demo)",
                    },
                  ]
                : []),
            ]
          : [],
      translations: locales.map((locale, index) => ({
        locale,
        title: seed.titles[locale] ?? seed.titles.en,
        description: seed.descriptions[locale] ?? seed.descriptions.en,
        reviewed: index >= pending,
        source: index < pending ? "ai_translated" : "manual",
      })),
    };
  }

  const db = getDb();
  const [row] = await db.select().from(properties).where(eq(properties.id, id)).limit(1);
  if (!row) return { property: null, overrides: [], translations: [] };

  const { getPropertyBySlug } = await import("./properties");
  const property = await getPropertyBySlug(row.slug, "es");
  const overrides = await db
    .select()
    .from(propertyOverrides)
    .where(eq(propertyOverrides.propertyId, id));
  const translations = await db
    .select()
    .from(propertyTranslations)
    .where(eq(propertyTranslations.propertyId, id));

  return {
    property,
    overrides: overrides.map((o) => ({
      id: o.id,
      field: o.field,
      value: o.value,
      reason: o.reason,
    })),
    translations: translations.map((t) => ({
      locale: t.locale,
      title: t.title,
      description: t.description,
      reviewed: t.reviewed,
      source: t.source,
    })),
  };
}

export async function updatePropertyStatus(
  id: string,
  status: "available" | "reserved" | "sold" | "draft" | "withdrawn",
) {
  if (!hasDatabase() || id.startsWith("seed-")) {
    return { ok: true, memory: true };
  }
  const db = getDb();
  await db
    .update(properties)
    .set({
      status,
      publishedAt:
        status === "available" || status === "reserved" ? new Date() : null,
      soldAt: status === "sold" ? new Date() : null,
      updatedAt: new Date(),
    })
    .where(eq(properties.id, id));
  return { ok: true };
}

export async function setPropertyFeatured(id: string, isFeatured: boolean) {
  if (!hasDatabase() || id.startsWith("seed-")) {
    return { ok: true, memory: true };
  }
  const db = getDb();
  await db
    .update(properties)
    .set({ isFeatured, updatedAt: new Date() })
    .where(eq(properties.id, id));
  return { ok: true };
}
