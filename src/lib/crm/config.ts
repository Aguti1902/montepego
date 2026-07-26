import type { CrmAdapterName, CrmConfig } from "./types";

const ADAPTERS: CrmAdapterName[] = [
  "mock",
  "ego",
  "inmovilla",
  "resales",
  "optima",
  "witei",
];

function asAdapter(value: string | undefined): CrmAdapterName {
  if (value && ADAPTERS.includes(value as CrmAdapterName)) {
    return value as CrmAdapterName;
  }
  return "mock";
}

/**
 * Config CRM desde env. Sin secretos en el cliente.
 * CRM_ADAPTER=mock → simula la API con datos semilla (tests/demo).
 * Staging/prod: CRM_ADAPTER=ego (u otro) + CRM_API_URL + CRM_API_KEY.
 */
export function getCrmConfig(): CrmConfig {
  const timeoutRaw = Number(process.env.CRM_TIMEOUT_MS ?? "15000");
  const retriesRaw = Number(process.env.CRM_MAX_RETRIES ?? "2");

  return {
    adapter: asAdapter(process.env.CRM_ADAPTER),
    baseUrl: (process.env.CRM_API_URL ?? "").replace(/\/$/, ""),
    apiKey: process.env.CRM_API_KEY ?? process.env.CRM_API_TOKEN ?? "",
    timeoutMs: Number.isFinite(timeoutRaw) ? timeoutRaw : 15_000,
    maxRetries: Number.isFinite(retriesRaw) ? Math.max(0, retriesRaw) : 2,
  };
}

export function crmConfigIsLive(config: CrmConfig = getCrmConfig()): boolean {
  return (
    config.adapter !== "mock" &&
    config.baseUrl.length > 0 &&
    config.apiKey.length > 0
  );
}
