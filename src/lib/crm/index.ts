import { getCrmConfig } from "./config";
import { mockCrmAdapter } from "./adapters/mock";
import { egoCrmAdapter } from "./adapters/ego";
import { inmovillaAdapter } from "./adapters/inmovilla";
import { resalesAdapter } from "./adapters/resales";
import type { CrmAdapter, CrmAdapterName } from "./types";

const adapters: Record<CrmAdapterName, CrmAdapter> = {
  mock: mockCrmAdapter,
  ego: egoCrmAdapter,
  inmovilla: inmovillaAdapter,
  resales: resalesAdapter,
  optima: {
    name: "optima",
    fetchProperties: async () => {
      const { CrmApiError } = await import("./types");
      throw new CrmApiError("Adaptador Optima pendiente", {
        code: "unsupported",
        retryable: false,
      });
    },
    fetchProperty: async () => {
      const { CrmApiError } = await import("./types");
      throw new CrmApiError("Adaptador Optima pendiente", {
        code: "unsupported",
        retryable: false,
      });
    },
    pushLead: async () => {
      const { CrmApiError } = await import("./types");
      throw new CrmApiError("pushLead Optima pendiente", {
        code: "unsupported",
        retryable: false,
      });
    },
  },
  witei: {
    name: "witei",
    fetchProperties: async () => {
      const { CrmApiError } = await import("./types");
      throw new CrmApiError("Adaptador Witei pendiente", {
        code: "unsupported",
        retryable: false,
      });
    },
    fetchProperty: async () => {
      const { CrmApiError } = await import("./types");
      throw new CrmApiError("Adaptador Witei pendiente", {
        code: "unsupported",
        retryable: false,
      });
    },
    pushLead: async () => {
      const { CrmApiError } = await import("./types");
      throw new CrmApiError("pushLead Witei pendiente", {
        code: "unsupported",
        retryable: false,
      });
    },
  },
};

/**
 * Adaptador activo. El front no debe importar esto en componentes cliente.
 * Flujo: CRM API → adaptador → sanitize → BD → UI.
 */
export function getCrmAdapter(): CrmAdapter {
  const { adapter } = getCrmConfig();
  return adapters[adapter] ?? mockCrmAdapter;
}

export * from "./types";
export * from "./sanitize";
export * from "./config";
export * from "./push-lead";
