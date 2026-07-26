// Datos pendientes de confirmación por el cliente.
// TODO(cliente): confirmar

export const PENDING_TEAM = [
  {
    id: "pending-1",
    name: "Equipo MontePego", // TODO(cliente): confirmar nombres del equipo
    role: "Agente",
  },
] as const;

/**
 * CRM: la cartera real entra por API vía adaptador (`CRM_ADAPTER`).
 * Preferir variables de entorno CRM_* sobre este objeto.
 * Proveedor previsto: eGO Real Estate (https://www.egorealestate.com).
 */
export const PENDING_CRM = {
  provider: "mock" as const, // TODO(cliente): poner CRM_ADAPTER=ego + token
  // No guardar secretos aquí: usar CRM_API_URL / CRM_API_KEY en .env.local
} as const;

export const PENDING_WHATSAPP_BUSINESS = {
  phoneNumberId: "", // TODO(cliente): confirmar
  accessToken: "", // TODO(cliente): confirmar
};

export const PENDING_PORTAL_FEEDS = {
  idealistaEnabled: false, // TODO(cliente): confirmar acceso a feeds
  fotocasaEnabled: false,
  kyeroEnabled: true,
};
