import type { CrmAdapter } from "@/lib/crm/types";

/**
 * Stub: implementar cuando el cliente confirme Resales Online.
 * TODO(cliente): confirmar credenciales y endpoints
 */
export const resalesAdapter: CrmAdapter = {
  name: "resales",
  async fetchProperties() {
    throw new Error("Adaptador Resales pendiente de configuración del cliente");
  },
  async fetchProperty() {
    throw new Error("Adaptador Resales pendiente de configuración del cliente");
  },
};
