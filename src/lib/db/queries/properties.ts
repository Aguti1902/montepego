import { and, asc, desc, eq, gte, inArray, lte, sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import {
  properties,
  propertyMedia,
  propertyOverrides,
  propertyTranslations,
} from "@/lib/db/schema";
import { seedProperties } from "@/lib/db/seed-data";
import { mapPropertyWithOverrides, seedToResolved } from "@/lib/db/mappers";
import type {
  PropertyListFilters,
  ResolvedMedia,
  ResolvedProperty,
} from "@/lib/db/types";

/**
 * Con DATABASE_URL: lee la cartera sincronizada del CRM (overrides aplicados).
 * Sin DATABASE_URL: fallback a seed-data solo para demos/local (no es la fuente de prod).
 */
function hasDatabase() {
  return Boolean(process.env.DATABASE_URL);
}

function filterSeed(
  locale: string,
  filters: PropertyListFilters,
): ResolvedProperty[] {
  let list = seedProperties.map((p) => seedToResolved(p, locale));

  const statuses =
    filters.status ??
    (filters.includeSold
      ? (["available", "reserved", "sold"] as const)
      : (["available", "reserved"] as const));

  list = list.filter((p) => statuses.includes(p.status));

  if (filters.featuredOnly) {
    list = list.filter((p) => p.isFeatured);
  }
  if (filters.type?.length) {
    list = list.filter((p) => filters.type!.includes(p.type));
  }
  if (filters.minPrice != null) {
    list = list.filter((p) => p.price >= filters.minPrice!);
  }
  if (filters.maxPrice != null) {
    list = list.filter((p) => p.price <= filters.maxPrice!);
  }
  if (filters.bedrooms != null) {
    list = list.filter((p) => p.bedrooms >= filters.bedrooms!);
  }
  if (filters.features?.length) {
    list = list.filter((p) =>
      filters.features!.every((f) => p.features.includes(f as never)),
    );
  }
  if (filters.q) {
    const q = filters.q.toLowerCase();
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.reference.includes(q) ||
        p.description.toLowerCase().includes(q),
    );
  }

  switch (filters.sort) {
    case "price_asc":
      list.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      list.sort((a, b) => b.price - a.price);
      break;
    case "oldest":
      list.sort(
        (a, b) =>
          (a.publishedAt?.getTime() ?? 0) - (b.publishedAt?.getTime() ?? 0),
      );
      break;
    case "newest":
    default:
      list.sort(
        (a, b) =>
          (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0),
      );
  }

  return list;
}

async function loadMedia(
  propertyId: string,
  locale: string,
): Promise<ResolvedMedia[]> {
  const db = getDb();
  const rows = await db
    .select()
    .from(propertyMedia)
    .where(eq(propertyMedia.propertyId, propertyId))
    .orderBy(asc(propertyMedia.sortOrder));

  return rows.map((row) => ({
    id: row.id,
    kind: row.kind,
    storagePath: row.storagePath,
    width: row.width,
    height: row.height,
    sortOrder: row.sortOrder,
    alt: row.altTranslations?.[locale] ?? row.altTranslations?.en ?? "",
    isCover: row.isCover,
    aiRoomType: row.aiRoomType,
  }));
}

async function resolveRow(
  row: typeof properties.$inferSelect,
  locale: string,
): Promise<ResolvedProperty | null> {
  const db = getDb();
  const [translation] = await db
    .select()
    .from(propertyTranslations)
    .where(
      and(
        eq(propertyTranslations.propertyId, row.id),
        eq(propertyTranslations.locale, locale),
        eq(propertyTranslations.reviewed, true),
      ),
    )
    .limit(1);

  const fallback =
    translation ??
    (
      await db
        .select()
        .from(propertyTranslations)
        .where(
          and(
            eq(propertyTranslations.propertyId, row.id),
            eq(propertyTranslations.locale, "en"),
            eq(propertyTranslations.reviewed, true),
          ),
        )
        .limit(1)
    )[0];

  if (!fallback) return null;

  const overrides = await db
    .select({
      field: propertyOverrides.field,
      value: propertyOverrides.value,
    })
    .from(propertyOverrides)
    .where(eq(propertyOverrides.propertyId, row.id));

  const media = await loadMedia(row.id, locale);

  return mapPropertyWithOverrides(
    {
      ...row,
      latitude: row.latitude,
      longitude: row.longitude,
    },
    overrides,
    {
      title: fallback.title,
      description: fallback.description,
      seoTitle: fallback.seoTitle,
      seoDescription: fallback.seoDescription,
    },
    media,
  );
}

export async function listProperties(filters: PropertyListFilters): Promise<{
  items: ResolvedProperty[];
  total: number;
  page: number;
  pageSize: number;
}> {
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 12;

  if (!hasDatabase()) {
    const all = filterSeed(filters.locale, filters);
    const start = (page - 1) * pageSize;
    return {
      items: all.slice(start, start + pageSize),
      total: all.length,
      page,
      pageSize,
    };
  }

  try {
    const db = getDb();
    const statuses =
      filters.status ??
      (filters.includeSold
        ? (["available", "reserved", "sold"] as const)
        : (["available", "reserved"] as const));

    const conditions = [
      inArray(properties.status, [...statuses]),
      sql`${properties.publishedAt} is not null`,
    ];

    if (filters.featuredOnly) {
      conditions.push(eq(properties.isFeatured, true));
    }
    if (filters.type?.length) {
      conditions.push(inArray(properties.type, filters.type));
    }
    if (filters.minPrice != null) {
      conditions.push(gte(properties.price, filters.minPrice));
    }
    if (filters.maxPrice != null) {
      conditions.push(lte(properties.price, filters.maxPrice));
    }
    if (filters.bedrooms != null) {
      conditions.push(gte(properties.bedrooms, filters.bedrooms));
    }

    const orderBy =
      filters.sort === "price_asc"
        ? asc(properties.price)
        : filters.sort === "price_desc"
          ? desc(properties.price)
          : filters.sort === "oldest"
            ? asc(properties.publishedAt)
            : desc(properties.publishedAt);

    const rows = await db
      .select()
      .from(properties)
      .where(and(...conditions))
      .orderBy(orderBy);

    const resolved: ResolvedProperty[] = [];
    for (const row of rows) {
      const item = await resolveRow(row, filters.locale);
      if (!item) continue;
      if (
        filters.features?.length &&
        !filters.features.every((f) => item.features.includes(f as never))
      ) {
        continue;
      }
      if (filters.q) {
        const q = filters.q.toLowerCase();
        if (
          !item.title.toLowerCase().includes(q) &&
          !item.reference.includes(q) &&
          !item.description.toLowerCase().includes(q)
        ) {
          continue;
        }
      }
      resolved.push(item);
    }

    const start = (page - 1) * pageSize;
    return {
      items: resolved.slice(start, start + pageSize),
      total: resolved.length,
      page,
      pageSize,
    };
  } catch {
    const all = filterSeed(filters.locale, filters);
    const start = (page - 1) * pageSize;
    return {
      items: all.slice(start, start + pageSize),
      total: all.length,
      page,
      pageSize,
    };
  }
}

export async function getPropertyBySlug(
  slug: string,
  locale: string,
): Promise<ResolvedProperty | null> {
  if (!hasDatabase()) {
    const seed = seedProperties.find((p) => p.slug === slug);
    return seed ? seedToResolved(seed, locale) : null;
  }

  try {
    const db = getDb();
    const [row] = await db
      .select()
      .from(properties)
      .where(eq(properties.slug, slug))
      .limit(1);
    if (!row) {
      const seed = seedProperties.find((p) => p.slug === slug);
      return seed ? seedToResolved(seed, locale) : null;
    }
    return resolveRow(row, locale);
  } catch {
    const seed = seedProperties.find((p) => p.slug === slug);
    return seed ? seedToResolved(seed, locale) : null;
  }
}

export async function getFeaturedProperties(
  locale: string,
  limit = 6,
): Promise<ResolvedProperty[]> {
  const { items } = await listProperties({
    locale,
    featuredOnly: true,
    status: ["available"],
    pageSize: limit,
    sort: "newest",
  });
  return items;
}

export async function getSimilarProperties(
  property: ResolvedProperty,
  locale: string,
  limit = 3,
): Promise<ResolvedProperty[]> {
  const { items } = await listProperties({
    locale,
    type: [property.type],
    status: ["available"],
    pageSize: 20,
  });
  return items.filter((p) => p.id !== property.id).slice(0, limit);
}
