import { CrmApiError, type CrmAdapter } from "@/lib/crm/types";

/**
 * Stub: implementar cuando el cliente confirme Inmovilla.
 * TODO(cliente): confirmar credenciales y endpoints
 */
export const inmovillaAdapter: CrmAdapter = {
  name: "inmovilla",
  async fetchProperties() {
    throw new CrmApiError(
      "Adaptador Inmovilla pendiente de configuración del cliente",
      { code: "unsupported", retryable: false },
    );
  },
  async fetchProperty() {
    throw new CrmApiError(
      "Adaptador Inmovilla pendiente de configuración del cliente",
      { code: "unsupported", retryable: false },
    );
  },
  async pushLead() {
    throw new CrmApiError(
      "pushLead Inmovilla pendiente de configuración del cliente",
      { code: "unsupported", retryable: false },
    );
  },
};
