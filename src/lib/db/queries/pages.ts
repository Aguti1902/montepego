import { and, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { pages, pageTranslations } from "@/lib/db/schema";
import {
  demoPages,
  type DemoPage,
  type DemoPageTranslation,
} from "@/lib/db/admin-demo-data";

function hasDatabase() {
  return Boolean(process.env.DATABASE_URL);
}

let memoryPages: DemoPage[] = structuredClone(demoPages);

export type AdminPageListItem = {
  id: string;
  slug: string;
  label: string;
  updatedAt: Date;
  localesReady: number;
  localesTotal: number;
};

export async function listAdminPages(): Promise<AdminPageListItem[]> {
  if (!hasDatabase()) {
    return memoryPages.map((page) => ({
      id: page.id,
      slug: page.slug,
      label: page.label,
      updatedAt: page.updatedAt,
      localesReady: page.translations.filter((t) => t.body.trim().length > 20)
        .length,
      localesTotal: 6,
    }));
  }

  const db = getDb();
  const rows = await db.select().from(pages);
  const result: AdminPageListItem[] = [];

  for (const row of rows) {
    const translations = await db
      .select()
      .from(pageTranslations)
      .where(eq(pageTranslations.pageId, row.id));
    result.push({
      id: row.id,
      slug: row.slug,
      label: row.slug,
      updatedAt: row.updatedAt,
      localesReady: translations.filter((t) => t.body.trim().length > 20).length,
      localesTotal: 6,
    });
  }

  return result;
}

export async function getAdminPage(slug: string): Promise<DemoPage | null> {
  if (!hasDatabase()) {
    return memoryPages.find((p) => p.slug === slug) ?? null;
  }

  const db = getDb();
  const [row] = await db.select().from(pages).where(eq(pages.slug, slug)).limit(1);
  if (!row) return null;

  const translations = await db
    .select()
    .from(pageTranslations)
    .where(eq(pageTranslations.pageId, row.id));

  return {
    id: row.id,
    slug: row.slug,
    label: row.slug,
    updatedAt: row.updatedAt,
    translations: translations.map((t) => ({
      locale: t.locale,
      title: t.title,
      body: t.body,
      seoTitle: t.seoTitle ?? t.title,
      seoDescription: t.seoDescription ?? "",
      updatedAt: t.updatedAt,
    })),
  };
}

export async function savePageTranslation(input: {
  slug: string;
  locale: string;
  title: string;
  body: string;
  seoTitle: string;
  seoDescription: string;
}): Promise<{ ok: boolean }> {
  const now = new Date();

  if (!hasDatabase()) {
    const page = memoryPages.find((p) => p.slug === input.slug);
    if (!page) return { ok: false };
    const idx = page.translations.findIndex((t) => t.locale === input.locale);
    const next: DemoPageTranslation = {
      locale: input.locale,
      title: input.title,
      body: input.body,
      seoTitle: input.seoTitle,
      seoDescription: input.seoDescription,
      updatedAt: now,
    };
    if (idx >= 0) page.translations[idx] = next;
    else page.translations.push(next);
    page.updatedAt = now;
    memoryPages = [...memoryPages];
    return { ok: true };
  }

  const db = getDb();
  const [row] = await db
    .select()
    .from(pages)
    .where(eq(pages.slug, input.slug))
    .limit(1);
  if (!row) return { ok: false };

  const existing = await db
    .select()
    .from(pageTranslations)
    .where(
      and(
        eq(pageTranslations.pageId, row.id),
        eq(pageTranslations.locale, input.locale),
      ),
    )
    .limit(1);

  if (existing[0]) {
    await db
      .update(pageTranslations)
      .set({
        title: input.title,
        body: input.body,
        seoTitle: input.seoTitle,
        seoDescription: input.seoDescription,
        updatedAt: now,
      })
      .where(
        and(
          eq(pageTranslations.pageId, row.id),
          eq(pageTranslations.locale, input.locale),
        ),
      );
  } else {
    await db.insert(pageTranslations).values({
      pageId: row.id,
      locale: input.locale,
      title: input.title,
      body: input.body,
      seoTitle: input.seoTitle,
      seoDescription: input.seoDescription,
    });
  }

  await db.update(pages).set({ updatedAt: now }).where(eq(pages.id, row.id));
  return { ok: true };
}
