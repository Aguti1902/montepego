// Datos pendientes de confirmación por el cliente.
// TODO(cliente): confirmar

export const PENDING_TEAM = [
  {
    id: "pending-1",
    name: "Equipo MontePego", // TODO(cliente): confirmar nombres del equipo
    role: "Agente",
  },
] as const;

export const PENDING_CRM = {
  provider: "mock" as const, // TODO(cliente): confirmar CRM (Inmovilla | Resales | Optima | Witei | Egorealestate)
  apiKey: "", // TODO(cliente): confirmar
  apiUrl: "", // TODO(cliente): confirmar
};

export const PENDING_WHATSAPP_BUSINESS = {
  phoneNumberId: "", // TODO(cliente): confirmar
  accessToken: "", // TODO(cliente): confirmar
};

export const PENDING_PORTAL_FEEDS = {
  idealistaEnabled: false, // TODO(cliente): confirmar acceso a feeds
  fotocasaEnabled: false,
  kyeroEnabled: true,
};
