import { and, asc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { propertyMedia } from "@/lib/db/schema";

export async function listMedia(propertyId: string) {
  const db = getDb();
  return db
    .select()
    .from(propertyMedia)
    .where(eq(propertyMedia.propertyId, propertyId))
    .orderBy(asc(propertyMedia.sortOrder));
}

export async function addMedia(input: {
  propertyId: string;
  kind?: "photo" | "floorplan" | "video" | "tour_360" | "document";
  storagePath: string;
  width?: number;
  height?: number;
  sortOrder?: number;
  isCover?: boolean;
  altTranslations?: Record<string, string>;
  aiRoomType?: string;
  aiQualityScore?: string;
}) {
  const db = getDb();

  if (input.isCover) {
    await db
      .update(propertyMedia)
      .set({ isCover: false })
      .where(eq(propertyMedia.propertyId, input.propertyId));
  }

  const [row] = await db
    .insert(propertyMedia)
    .values({
      propertyId: input.propertyId,
      kind: input.kind ?? "photo",
      storagePath: input.storagePath,
      width: input.width,
      height: input.height,
      sortOrder: input.sortOrder ?? 0,
      isCover: input.isCover ?? false,
      altTranslations: input.altTranslations ?? {},
      aiRoomType: input.aiRoomType,
      aiQualityScore: input.aiQualityScore,
    })
    .returning();

  return row;
}

export async function reorderMedia(
  propertyId: string,
  orderedIds: string[],
) {
  const db = getDb();
  await Promise.all(
    orderedIds.map((id, index) =>
      db
        .update(propertyMedia)
        .set({ sortOrder: index })
        .where(
          and(
            eq(propertyMedia.id, id),
            eq(propertyMedia.propertyId, propertyId),
          ),
        ),
    ),
  );
}

export async function setCoverMedia(propertyId: string, mediaId: string) {
  const db = getDb();
  await db
    .update(propertyMedia)
    .set({ isCover: false })
    .where(eq(propertyMedia.propertyId, propertyId));
  const [row] = await db
    .update(propertyMedia)
    .set({ isCover: true })
    .where(
      and(
        eq(propertyMedia.id, mediaId),
        eq(propertyMedia.propertyId, propertyId),
      ),
    )
    .returning();
  return row ?? null;
}
