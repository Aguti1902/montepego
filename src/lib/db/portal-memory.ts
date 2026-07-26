export type MemoryParcel = {
  id: string;
  carrier: string;
  trackingCode: string;
  description: string;
  status: "received" | "notified" | "collected";
  receivedAt: string;
};

export type MemoryIncident = {
  id: string;
  title: string;
  description: string;
  status: "open" | "in_progress" | "resolved";
  createdAt: string;
};

export type MemoryReservation = {
  id: string;
  partySize: number;
  reservedFor: string;
  notes: string;
  status: "requested" | "confirmed" | "cancelled";
};

export const memoryPortal = {
  parcels: [
    {
      id: "parcel-1",
      carrier: "Correos",
      trackingCode: "PQ123456ES",
      description: "Paquete mediano",
      status: "received" as const,
      receivedAt: new Date().toISOString(),
    },
  ] satisfies MemoryParcel[],
  incidents: [
    {
      id: "incident-1",
      title: "Farola apagada",
      description: "Farola junto al acceso sur sin luz desde anoche.",
      status: "open" as const,
      createdAt: new Date().toISOString(),
    },
  ] satisfies MemoryIncident[],
  reservations: [] as MemoryReservation[],
  ownerStats: {
    reference: "1505",
    title: "Renovated Villa with Panoramic Views",
    status: "available",
    enquiries: 4,
    views: 128,
  },
};
