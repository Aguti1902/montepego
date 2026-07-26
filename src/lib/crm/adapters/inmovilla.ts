import type { CrmAdapter } from "@/lib/crm/types";

/**
 * Stub: implementar cuando el cliente confirme Inmovilla.
 * TODO(cliente): confirmar credenciales y endpoints
 */
export const inmovillaAdapter: CrmAdapter = {
  name: "inmovilla",
  async fetchProperties() {
    throw new Error("Adaptador Inmovilla pendiente de configuración del cliente");
  },
  async fetchProperty() {
    throw new Error("Adaptador Inmovilla pendiente de configuración del cliente");
  },
};
