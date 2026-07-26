import { and, desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { propertyOverrides } from "@/lib/db/schema";

export async function listOverrides(propertyId: string) {
  const db = getDb();
  return db
    .select()
    .from(propertyOverrides)
    .where(eq(propertyOverrides.propertyId, propertyId))
    .orderBy(desc(propertyOverrides.createdAt));
}

export async function upsertOverride(input: {
  propertyId: string;
  field: string;
  value: unknown;
  reason?: string;
  createdBy?: string;
}) {
  const db = getDb();
  const existing = await db
    .select()
    .from(propertyOverrides)
    .where(
      and(
        eq(propertyOverrides.propertyId, input.propertyId),
        eq(propertyOverrides.field, input.field),
      ),
    )
    .limit(1);

  if (existing[0]) {
    const [row] = await db
      .update(propertyOverrides)
      .set({
        value: input.value,
        reason: input.reason,
        createdBy: input.createdBy,
      })
      .where(eq(propertyOverrides.id, existing[0].id))
      .returning();
    return row;
  }

  const [row] = await db
    .insert(propertyOverrides)
    .values({
      propertyId: input.propertyId,
      field: input.field,
      value: input.value,
      reason: input.reason,
      createdBy: input.createdBy,
    })
    .returning();
  return row;
}
