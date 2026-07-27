import { and, desc, eq, isNotNull, notInArray } from "drizzle-orm";
import { getDb } from "@/lib/db";
import {
  properties,
  propertyMedia,
  propertyOverrides,
  propertyTranslations,
  syncLogs,
} from "@/lib/db/schema";
import { slugify } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { getCrmAdapter } from "./index";
import { sanitizeCrmProperty, type SanitizedProperty } from "./sanitize";

export type SyncResult = {
  logId: string;
  status: "success" | "partial" | "failed";
  propertiesCreated: number;
  propertiesUpdated: number;
  propertiesArchived: number;
  warnings: string[];
  error?: string;
};

async function upsertFromSanitized(
  item: SanitizedProperty,
  counters: { created: number; updated: number },
  allWarnings: string[],
) {
  const db = getDb();
  allWarnings.push(...item.warnings);

  const [existing] = await db
    .select()
    .from(properties)
    .where(eq(properties.crmId, item.crmId))
    .limit(1);

  const overrideRows = existing
    ? await db
        .select()
        .from(propertyOverrides)
        .where(eq(propertyOverrides.propertyId, existing.id))
    : [];
  const overridden = new Set(overrideRows.map((o) => o.field));

  const field = <T,>(name: string, incoming: T, current: T): T =>
    overridden.has(name) ? current : incoming;

  const next = {
    crmId: item.crmId,
    reference: item.reference,
    slug: existing?.slug ?? slugify(`${item.title}-${item.reference}`),
    status: item.status,
    type: item.type,
    price: field("price", item.price, existing?.price ?? item.price),
    bedrooms: field(
      "bedrooms",
      item.bedrooms,
      existing?.bedrooms ?? item.bedrooms,
    ),
    bathrooms: field(
      "bathrooms",
      item.bathrooms,
      existing?.bathrooms ?? item.bathrooms,
    ),
    builtArea: field(
      "builtArea",
      item.builtArea,
      existing?.builtArea ?? null,
    ),
    plotArea: field("plotArea", item.plotArea, existing?.plotArea ?? null),
    terraceArea: field(
      "terraceArea",
      item.terraceArea,
      existing?.terraceArea ?? null,
    ),
    yearBuilt: field(
      "yearBuilt",
      item.yearBuilt,
      existing?.yearBuilt ?? null,
    ),
    energyRating: item.energyRating,
    latitude: item.latitude,
    longitude: item.longitude,
    features: item.features,
    publishedAt:
      item.publishable && item.status !== "draft"
        ? (existing?.publishedAt ?? new Date())
        : null,
    soldAt: item.status === "sold" ? (existing?.soldAt ?? new Date()) : null,
    crmSyncedAt: new Date(),
    crmRaw: item.crmRaw,
    updatedAt: new Date(),
  };

  if (existing) {
    await db.update(properties).set(next).where(eq(properties.id, existing.id));
    counters.updated += 1;
    return existing.id;
  }

  const [created] = await db.insert(properties).values(next).returning();
  counters.created += 1;

  await db.insert(propertyTranslations).values(
    siteConfig.locales.map((locale) => ({
      propertyId: created.id,
      locale,
      title: item.title,
      description: item.description || item.title,
      source: "manual" as const,
      reviewed: locale === "en",
    })),
  );

  if (item.photos.length > 0) {
    await db.insert(propertyMedia).values(
      item.photos.map((photo, index) => ({
        propertyId: created.id,
        kind: "photo" as const,
        storagePath: photo.url,
        sortOrder: photo.sortOrder ?? index,
        isCover: photo.isCover || index === 0,
        altTranslations: { en: item.title },
      })),
    );
  }

  return created.id;
}

export async function runCrmSync(since?: Date): Promise<SyncResult> {
  if (!process.env.DATABASE_URL) {
    const adapter = getCrmAdapter();
    const raw = await adapter.fetchProperties(since);
    const warnings = raw.flatMap((item) => sanitizeCrmProperty(item).warnings);
    return {
      logId: "memory-sync",
      status: warnings.length ? "partial" : "success",
      propertiesCreated: 0,
      propertiesUpdated: raw.length,
      propertiesArchived: 0,
      warnings,
    };
  }

  const db = getDb();
  const [log] = await db
    .insert(syncLogs)
    .values({ status: "failed", startedAt: new Date() })
    .returning();

  const counters = { created: 0, updated: 0 };
  const warnings: string[] = [];

  try {
    const adapter = getCrmAdapter();
    const rawItems = await adapter.fetchProperties(since);
    const seenCrmIds: string[] = [];

    for (const raw of rawItems) {
      const sanitized = sanitizeCrmProperty(raw);
      seenCrmIds.push(sanitized.crmId);
      await upsertFromSanitized(sanitized, counters, warnings);
    }

    let archived = 0;
    if (seenCrmIds.length > 0) {
      const disappearing = await db
        .update(properties)
        .set({ status: "withdrawn", updatedAt: new Date() })
        .where(
          and(
            isNotNull(properties.crmId),
            notInArray(properties.crmId, seenCrmIds),
          ),
        )
        .returning({ id: properties.id });
      archived = disappearing.length;
    }

    const status = warnings.length > 0 ? ("partial" as const) : ("success" as const);

    await db
      .update(syncLogs)
      .set({
        finishedAt: new Date(),
        status,
        propertiesCreated: counters.created,
        propertiesUpdated: counters.updated,
        propertiesArchived: archived,
        warnings,
      })
      .where(eq(syncLogs.id, log.id));

    return {
      logId: log.id,
      status,
      propertiesCreated: counters.created,
      propertiesUpdated: counters.updated,
      propertiesArchived: archived,
      warnings,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    await db
      .update(syncLogs)
      .set({
        finishedAt: new Date(),
        status: "failed",
        error: message,
        warnings,
        propertiesCreated: counters.created,
        propertiesUpdated: counters.updated,
      })
      .where(eq(syncLogs.id, log.id));

    return {
      logId: log.id,
      status: "failed",
      propertiesCreated: counters.created,
      propertiesUpdated: counters.updated,
      propertiesArchived: 0,
      warnings,
      error: message,
    };
  }
}

export async function getLatestSyncLog() {
  if (!process.env.DATABASE_URL) {
    const { demoSyncLog } = await import("@/lib/db/admin-demo-data");
    return demoSyncLog;
  }
  const db = getDb();
  const [row] = await db
    .select()
    .from(syncLogs)
    .orderBy(desc(syncLogs.startedAt))
    .limit(1);
  return row ?? null;
}
