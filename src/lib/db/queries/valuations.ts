import { desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { valuations } from "@/lib/db/schema";
import { demoValuations } from "@/lib/db/admin-demo-data";
import type { ValuationInput } from "@/lib/db/types";

export type ValuationRecord = typeof valuations.$inferSelect;

const memoryValuations: ValuationRecord[] = [...demoValuations];

function hasDatabase() {
  return Boolean(process.env.DATABASE_URL);
}

export async function createValuation(
  input: ValuationInput,
): Promise<ValuationRecord> {
  const values = {
    name: input.name,
    email: input.email,
    phone: input.phone,
    address: input.address,
    propertyType: input.propertyType,
    bedrooms: input.bedrooms,
    builtArea: input.builtArea,
    plotArea: input.plotArea,
    condition: input.condition,
    photos: input.photos ?? [],
    status: "pending" as const,
  };

  if (!hasDatabase()) {
    const row: ValuationRecord = {
      id: crypto.randomUUID(),
      ...values,
      phone: values.phone ?? null,
      bedrooms: values.bedrooms ?? null,
      builtArea: values.builtArea ?? null,
      plotArea: values.plotArea ?? null,
      condition: values.condition ?? null,
      aiEstimateMin: null,
      aiEstimateMax: null,
      aiReasoning: null,
      agentEstimate: null,
      agentNotes: null,
      createdAt: new Date(),
    };
    memoryValuations.unshift(row);
    return row;
  }

  const db = getDb();
  const [row] = await db.insert(valuations).values(values).returning();
  return row;
}

export async function listValuations(): Promise<ValuationRecord[]> {
  if (!hasDatabase()) return memoryValuations;
  const db = getDb();
  return db.select().from(valuations).orderBy(desc(valuations.createdAt));
}

export async function updateValuationEstimate(
  id: string,
  data: {
    aiEstimateMin?: number;
    aiEstimateMax?: number;
    aiReasoning?: string;
    agentEstimate?: number;
    agentNotes?: string;
    status?: ValuationRecord["status"];
  },
): Promise<ValuationRecord | null> {
  if (!hasDatabase()) {
    const idx = memoryValuations.findIndex((v) => v.id === id);
    if (idx < 0) return null;
    memoryValuations[idx] = {
      ...memoryValuations[idx],
      ...data,
      aiEstimateMin: data.aiEstimateMin ?? memoryValuations[idx].aiEstimateMin,
      aiEstimateMax: data.aiEstimateMax ?? memoryValuations[idx].aiEstimateMax,
      aiReasoning: data.aiReasoning ?? memoryValuations[idx].aiReasoning,
      agentEstimate: data.agentEstimate ?? memoryValuations[idx].agentEstimate,
      agentNotes: data.agentNotes ?? memoryValuations[idx].agentNotes,
      status: data.status ?? memoryValuations[idx].status,
    };
    return memoryValuations[idx];
  }

  const db = getDb();
  const [row] = await db
    .update(valuations)
    .set(data)
    .where(eq(valuations.id, id))
    .returning();
  return row ?? null;
}

export async function updateValuationAgent(
  id: string,
  data: {
    agentEstimate?: number | null;
    agentNotes?: string;
    status?: ValuationRecord["status"];
  },
): Promise<ValuationRecord | null> {
  if (!hasDatabase()) {
    const idx = memoryValuations.findIndex((v) => v.id === id);
    if (idx < 0) return null;
    memoryValuations[idx] = {
      ...memoryValuations[idx],
      agentEstimate:
        data.agentEstimate !== undefined
          ? data.agentEstimate
          : memoryValuations[idx].agentEstimate,
      agentNotes: data.agentNotes ?? memoryValuations[idx].agentNotes,
      status: data.status ?? memoryValuations[idx].status,
    };
    return memoryValuations[idx];
  }

  const db = getDb();
  const [row] = await db
    .update(valuations)
    .set(data)
    .where(eq(valuations.id, id))
    .returning();
  return row ?? null;
}
