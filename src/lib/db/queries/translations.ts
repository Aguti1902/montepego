import { and, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { propertyTranslations } from "@/lib/db/schema";

export async function listTranslations(propertyId: string) {
  const db = getDb();
  return db
    .select()
    .from(propertyTranslations)
    .where(eq(propertyTranslations.propertyId, propertyId));
}

export async function upsertTranslation(input: {
  propertyId: string;
  locale: string;
  title: string;
  description: string;
  seoTitle?: string;
  seoDescription?: string;
  source?: "manual" | "ai_generated" | "ai_translated";
  reviewed?: boolean;
  reviewedBy?: string;
}) {
  const db = getDb();
  const existing = await db
    .select()
    .from(propertyTranslations)
    .where(
      and(
        eq(propertyTranslations.propertyId, input.propertyId),
        eq(propertyTranslations.locale, input.locale),
      ),
    )
    .limit(1);

  const values = {
    title: input.title,
    description: input.description,
    seoTitle: input.seoTitle,
    seoDescription: input.seoDescription,
    source: input.source ?? ("manual" as const),
    reviewed: input.reviewed ?? false,
    reviewedBy: input.reviewedBy,
    updatedAt: new Date(),
  };

  if (existing[0]) {
    const [row] = await db
      .update(propertyTranslations)
      .set(values)
      .where(
        and(
          eq(propertyTranslations.propertyId, input.propertyId),
          eq(propertyTranslations.locale, input.locale),
        ),
      )
      .returning();
    return row;
  }

  const [row] = await db
    .insert(propertyTranslations)
    .values({
      propertyId: input.propertyId,
      locale: input.locale,
      ...values,
    })
    .returning();
  return row;
}

export async function markTranslationReviewed(
  propertyId: string,
  locale: string,
  reviewedBy?: string,
) {
  const db = getDb();
  const [row] = await db
    .update(propertyTranslations)
    .set({
      reviewed: true,
      reviewedBy,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(propertyTranslations.propertyId, propertyId),
        eq(propertyTranslations.locale, locale),
      ),
    )
    .returning();
  return row ?? null;
}
