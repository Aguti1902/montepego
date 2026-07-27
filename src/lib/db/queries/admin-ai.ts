import { desc } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { aiUsageLogs } from "@/lib/db/schema";
import { demoAiUsage } from "@/lib/db/admin-demo-data";
import { getMemoryAiUsage } from "@/lib/ai/client";

function hasDatabase() {
  return Boolean(process.env.DATABASE_URL);
}

export type AiUsageRow = {
  id: string;
  module: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  costUsd: string;
  createdAt: Date;
};

export async function listAiUsage(limit = 50): Promise<AiUsageRow[]> {
  if (!hasDatabase()) {
    const memory = getMemoryAiUsage();
    const merged = [
      ...demoAiUsage,
      ...memory.map((row, i) => ({
        id: `mem-${i}`,
        module: row.module,
        model: row.model,
        inputTokens: row.inputTokens,
        outputTokens: row.outputTokens,
        costUsd: row.costUsd,
        createdAt: row.createdAt,
      })),
    ];
    return merged
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  const db = getDb();
  const rows = await db
    .select()
    .from(aiUsageLogs)
    .orderBy(desc(aiUsageLogs.createdAt))
    .limit(limit);

  return rows.map((row) => ({
    id: row.id,
    module: row.module,
    model: row.model,
    inputTokens: row.inputTokens,
    outputTokens: row.outputTokens,
    costUsd: row.costUsd ?? "0",
    createdAt: row.createdAt,
  }));
}

export async function getAiUsageSummary(days = 7) {
  const rows = await listAiUsage(200);
  const since = Date.now() - days * 24 * 60 * 60 * 1000;
  const recent = rows.filter((r) => r.createdAt.getTime() >= since);
  const totalCost = recent.reduce(
    (sum, r) => sum + Number.parseFloat(r.costUsd || "0"),
    0,
  );
  const byModule = recent.reduce<Record<string, number>>((acc, row) => {
    const key = row.module.split(":")[0];
    acc[key] = (acc[key] ?? 0) + Number.parseFloat(row.costUsd || "0");
    return acc;
  }, {});

  return {
    totalCalls: recent.length,
    totalCostUsd: totalCost.toFixed(4),
    byModule,
    recent: recent.slice(0, 10),
  };
}
