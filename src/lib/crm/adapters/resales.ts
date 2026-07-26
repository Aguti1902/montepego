import { CrmApiError, type CrmAdapter } from "@/lib/crm/types";

/**
 * Stub: implementar cuando el cliente confirme Resales Online.
 * TODO(cliente): confirmar credenciales y endpoints
 */
export const resalesAdapter: CrmAdapter = {
  name: "resales",
  async fetchProperties() {
    throw new CrmApiError(
      "Adaptador Resales pendiente de configuración del cliente",
      { code: "unsupported", retryable: false },
    );
  },
  async fetchProperty() {
    throw new CrmApiError(
      "Adaptador Resales pendiente de configuración del cliente",
      { code: "unsupported", retryable: false },
    );
  },
  async pushLead() {
    throw new CrmApiError(
      "pushLead Resales pendiente de configuración del cliente",
      { code: "unsupported", retryable: false },
    );
  },
};
