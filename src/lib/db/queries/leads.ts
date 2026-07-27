import { desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { demoLeads } from "@/lib/db/admin-demo-data";
import type { LeadInput } from "@/lib/db/types";

export type LeadRecord = typeof leads.$inferSelect;

const memoryLeads: LeadRecord[] = [...demoLeads];

function hasDatabase() {
  return Boolean(process.env.DATABASE_URL);
}

export async function createLead(input: LeadInput): Promise<LeadRecord> {
  const values = {
    name: input.name,
    email: input.email,
    phone: input.phone,
    locale: input.locale,
    message: input.message,
    source: input.source ?? ("form" as const),
    propertyId: input.propertyId,
    budgetMin: input.budgetMin,
    budgetMax: input.budgetMax,
    preferences: input.preferences,
    status: "new" as const,
  };

  if (!hasDatabase()) {
    const row: LeadRecord = {
      id: crypto.randomUUID(),
      ...values,
      phone: values.phone ?? null,
      message: values.message ?? null,
      propertyId: values.propertyId ?? null,
      budgetMin: values.budgetMin ?? null,
      budgetMax: values.budgetMax ?? null,
      preferences: values.preferences ?? null,
      aiSummary: null,
      aiScore: null,
      notes: null,
      crmPushedAt: null,
      createdAt: new Date(),
    };
    memoryLeads.unshift(row);
    return row;
  }

  const db = getDb();
  const [row] = await db.insert(leads).values(values).returning();
  return row;
}

export async function listLeads(): Promise<LeadRecord[]> {
  if (!hasDatabase()) {
    return memoryLeads;
  }
  const db = getDb();
  return db.select().from(leads).orderBy(desc(leads.createdAt));
}

export async function updateLeadStatus(
  id: string,
  status: LeadRecord["status"],
): Promise<LeadRecord | null> {
  if (!hasDatabase()) {
    const idx = memoryLeads.findIndex((l) => l.id === id);
    if (idx < 0) return null;
    memoryLeads[idx] = { ...memoryLeads[idx], status };
    return memoryLeads[idx];
  }
  const db = getDb();
  const [row] = await db
    .update(leads)
    .set({ status })
    .where(eq(leads.id, id))
    .returning();
  return row ?? null;
}

export async function updateLeadNotes(
  id: string,
  notes: string,
): Promise<LeadRecord | null> {
  if (!hasDatabase()) {
    const idx = memoryLeads.findIndex((l) => l.id === id);
    if (idx < 0) return null;
    memoryLeads[idx] = { ...memoryLeads[idx], notes };
    return memoryLeads[idx];
  }
  const db = getDb();
  const [row] = await db
    .update(leads)
    .set({ notes })
    .where(eq(leads.id, id))
    .returning();
  return row ?? null;
}

export async function markLeadCrmPushed(id: string): Promise<void> {
  if (!hasDatabase()) {
    const idx = memoryLeads.findIndex((l) => l.id === id);
    if (idx >= 0) {
      memoryLeads[idx] = { ...memoryLeads[idx], crmPushedAt: new Date() };
    }
    return;
  }

  const db = getDb();
  await db
    .update(leads)
    .set({ crmPushedAt: new Date() })
    .where(eq(leads.id, id));
}
