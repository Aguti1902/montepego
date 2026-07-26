import { PENDING_CRM } from "@/config/pending";
import { mockCrmAdapter } from "./adapters/mock";
import { inmovillaAdapter } from "./adapters/inmovilla";
import { resalesAdapter } from "./adapters/resales";
import type { CrmAdapter } from "./types";

const adapters: Record<string, CrmAdapter> = {
  mock: mockCrmAdapter,
  inmovilla: inmovillaAdapter,
  resales: resalesAdapter,
};

export function getCrmAdapter(): CrmAdapter {
  const name = process.env.CRM_ADAPTER ?? PENDING_CRM.provider;
  return adapters[name] ?? mockCrmAdapter;
}

export * from "./types";
export * from "./sanitize";
