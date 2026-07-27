import { desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { syncLogs } from "@/lib/db/schema";
import { demoSyncLogs } from "@/lib/db/admin-demo-data";

function hasDatabase() {
  return Boolean(process.env.DATABASE_URL);
}

let memoryLogs = [...demoSyncLogs];

export async function listSyncLogs(limit = 20) {
  if (!hasDatabase()) {
    return memoryLogs.slice(0, limit);
  }
  const db = getDb();
  return db
    .select()
    .from(syncLogs)
    .orderBy(desc(syncLogs.startedAt))
    .limit(limit);
}

export async function getLatestSyncLog() {
  const logs = await listSyncLogs(1);
  return logs[0] ?? null;
}

export async function markSyncWarningsReviewed(id: string) {
  if (!hasDatabase()) {
    memoryLogs = memoryLogs.map((log) =>
      log.id === id ? { ...log, warningsReviewed: true } : log,
    );
    return { ok: true };
  }
  const db = getDb();
  await db
    .update(syncLogs)
    .set({ warningsReviewed: true })
    .where(eq(syncLogs.id, id));
  return { ok: true };
}
