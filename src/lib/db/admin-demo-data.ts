/**
 * Datos ficticios ampliados para el panel admin (modo demo sin DATABASE_URL).
 */
import type { Lead, SyncLog, Valuation } from "@/lib/db/schema";

const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(10 + (n % 5), 15, 0, 0);
  return d;
};

export const demoLeads: Lead[] = [
  {
    id: "demo-lead-1",
    name: "Emma van Dijk",
    email: "emma.vandijk@example.com",
    phone: "+31 6 12 34 56 78",
    locale: "nl",
    message:
      "We are looking for a renovated villa with pool under €450.000, preferably south orientation.",
    source: "form",
    propertyId: null,
    budgetMin: 350000,
    budgetMax: 450000,
    preferences: { bedrooms: 3, features: ["pool", "sea_view"] },
    aiSummary:
      "Compradora NL seria · presupuesto claro · prioriza piscina y orientación sur.",
    aiScore: 86,
    notes: null,
    crmPushedAt: daysAgo(1),
    status: "new",
    createdAt: daysAgo(1),
  },
  {
    id: "demo-lead-2",
    name: "Thomas Müller",
    email: "t.mueller@example.de",
    phone: "+49 170 1234567",
    locale: "de",
    message: "Interesse an Ref. 1530. Können wir diese Woche besichtigen?",
    source: "whatsapp",
    propertyId: null,
    budgetMin: 450000,
    budgetMax: 520000,
    preferences: { reference: "1530" },
    aiSummary: "Lead caliente · pide visita esta semana · ref. concreta.",
    aiScore: 92,
    notes: "Visita propuesta jueves 11:00",
    crmPushedAt: null,
    status: "new",
    createdAt: daysAgo(0),
  },
  {
    id: "demo-lead-3",
    name: "Sophie Laurent",
    email: "sophie.laurent@example.fr",
    phone: "+33 6 98 76 54 32",
    locale: "fr",
    message:
      "Nous cherchons un appartement avec vue, idéal pour 6 mois par an.",
    source: "form",
    propertyId: null,
    budgetMin: 220000,
    budgetMax: 280000,
    preferences: { type: "apartment" },
    aiSummary: "Segunda residencia · presupuesto medio · flexible en fechas.",
    aiScore: 71,
    notes: "Llamar por la tarde",
    crmPushedAt: daysAgo(3),
    status: "contacted",
    createdAt: daysAgo(4),
  },
  {
    id: "demo-lead-4",
    name: "James Wright",
    email: "james.wright@example.co.uk",
    phone: "+44 7700 900123",
    locale: "en",
    message: "Considering selling our villa on Calle Los Olivos next spring.",
    source: "valuation",
    propertyId: null,
    budgetMin: null,
    budgetMax: null,
    preferences: { intent: "sell" },
    aiSummary: "Posible captación · vendedor · timing primavera 2027.",
    aiScore: 78,
    notes: null,
    crmPushedAt: daysAgo(2),
    status: "qualified",
    createdAt: daysAgo(5),
  },
  {
    id: "demo-lead-5",
    name: "Anna Kowalska",
    email: "anna.kowalska@example.pl",
    phone: "+48 512 345 678",
    locale: "pl",
    message: "Szukamy domu z apartamentem dla gości.",
    source: "form",
    propertyId: null,
    budgetMin: 400000,
    budgetMax: 550000,
    preferences: { features: ["guest_apartment", "pool"] },
    aiSummary: "Busca villa con apartamento de invitados · presupuesto alto.",
    aiScore: 81,
    notes: null,
    crmPushedAt: null,
    status: "visiting",
    createdAt: daysAgo(8),
  },
  {
    id: "demo-lead-6",
    name: "Carlos Ruiz",
    email: "carlos.ruiz@example.es",
    phone: "+34 612 345 678",
    locale: "es",
    message: "Solo mirando por ahora, gracias.",
    source: "form",
    propertyId: null,
    budgetMin: 150000,
    budgetMax: 200000,
    preferences: {},
    aiSummary: "Exploratorio · baja urgencia · presupuesto ajustado.",
    aiScore: 34,
    notes: null,
    crmPushedAt: null,
    status: "lost",
    createdAt: daysAgo(12),
  },
  {
    id: "demo-lead-7",
    name: "Petra Janssen",
    email: "petra.j@example.nl",
    phone: "+31 6 88 77 66 55",
    locale: "nl",
    message: "Alerta: villa con vistas al mar, máximo 500k.",
    source: "property_alert",
    propertyId: null,
    budgetMin: 350000,
    budgetMax: 500000,
    preferences: { features: ["sea_view"] },
    aiSummary: "Alerta activa · compradora recurrente.",
    aiScore: 74,
    notes: "Enviar ref. 1464 y 1522",
    crmPushedAt: daysAgo(1),
    status: "contacted",
    createdAt: daysAgo(2),
  },
  {
    id: "demo-lead-8",
    name: "Hans Weber",
    email: "h.weber@example.de",
    phone: null,
    locale: "de",
    message: "Portal: pregunta por estado de la venta ref. 1452.",
    source: "portal",
    propertyId: null,
    budgetMin: null,
    budgetMax: null,
    preferences: { reference: "1452", role: "owner" },
    aiSummary: "Propietario vendedor · seguimiento desde portal.",
    aiScore: 55,
    notes: null,
    crmPushedAt: null,
    status: "closed",
    createdAt: daysAgo(20),
  },
];

export const demoValuations: Valuation[] = [
  {
    id: "demo-val-1",
    name: "Helen Brooks",
    email: "helen.brooks@example.com",
    phone: "+44 7700 900456",
    address: "Calle Los Pinos 12, Monte Pego, 03780",
    propertyType: "villa",
    bedrooms: 3,
    builtArea: 180,
    plotArea: 900,
    condition: "Good / renovated kitchen",
    photos: [],
    aiEstimateMin: 385000,
    aiEstimateMax: 425000,
    aiReasoning:
      "Comparables recientes en Monte Pego con piscina y reforma parcial sitúan el rango en 385–425k €.",
    agentEstimate: 410000,
    agentNotes: "Confirmar orientación y estado de la piscina en visita.",
    status: "pending",
    createdAt: daysAgo(1),
  },
  {
    id: "demo-val-2",
    name: "Pieter de Vries",
    email: "pieter.devries@example.nl",
    phone: "+31 6 22 33 44 55",
    address: "Av. Internacional 8, Monte Pego",
    propertyType: "apartment",
    bedrooms: 2,
    builtArea: 95,
    plotArea: null,
    condition: "Needs update",
    photos: [],
    aiEstimateMin: 210000,
    aiEstimateMax: 245000,
    aiReasoning:
      "Apartamento con vistas pero sin reforma reciente; rango conservador 210–245k €.",
    agentEstimate: null,
    agentNotes: null,
    status: "pending",
    createdAt: daysAgo(2),
  },
  {
    id: "demo-val-3",
    name: "Ingrid Hofmann",
    email: "ingrid.hofmann@example.de",
    phone: null,
    address: "Calle Las Magnolias 4, Monte Pego",
    propertyType: "villa",
    bedrooms: 4,
    builtArea: 240,
    plotArea: 1200,
    condition: "Excellent",
    photos: [],
    aiEstimateMin: 520000,
    aiEstimateMax: 575000,
    aiReasoning:
      "Villa amplia con parcela generosa y buen estado; techo del rango si las vistas son abiertas.",
    agentEstimate: 550000,
    agentNotes: "Listo para captar tras visita del viernes.",
    status: "reviewed",
    createdAt: daysAgo(6),
  },
  {
    id: "demo-val-4",
    name: "Marc Dupont",
    email: "marc.dupont@example.fr",
    phone: "+33 6 11 22 33 44",
    address: "Urbanización Monte Pego, parcela 142",
    propertyType: "plot",
    bedrooms: null,
    builtArea: null,
    plotArea: 800,
    condition: "Buildable plot",
    photos: [],
    aiEstimateMin: 95000,
    aiEstimateMax: 125000,
    aiReasoning:
      "Parcela edificable; el valor depende de la licencia y la pendiente.",
    agentEstimate: null,
    agentNotes: null,
    status: "pending",
    createdAt: daysAgo(3),
  },
  {
    id: "demo-val-5",
    name: "James Wright",
    email: "james.wright@example.co.uk",
    phone: "+44 7700 900123",
    address: "Calle Los Olivos 22, Monte Pego",
    propertyType: "villa",
    bedrooms: 3,
    builtArea: 165,
    plotArea: 780,
    condition: "Good",
    photos: [],
    aiEstimateMin: 360000,
    aiEstimateMax: 395000,
    aiReasoning: "Villa estándar en buena zona; venta prevista primavera.",
    agentEstimate: 375000,
    agentNotes: "Captación acordada — mandar dossier.",
    status: "contacted",
    createdAt: daysAgo(5),
  },
];

export const demoSyncLogs: SyncLog[] = [
  {
    id: "demo-sync-1",
    startedAt: daysAgo(0),
    finishedAt: new Date(daysAgo(0).getTime() + 42_000),
    status: "success",
    propertiesCreated: 2,
    propertiesUpdated: 26,
    propertiesArchived: 0,
    warnings: [
      "Ref. 1456: builtArea inválido en CRM, se omitió el campo",
      "Ref. 1253: sin fotos en origen",
    ],
    warningsReviewed: false,
    error: null,
  },
  {
    id: "demo-sync-2",
    startedAt: daysAgo(1),
    finishedAt: new Date(daysAgo(1).getTime() + 38_000),
    status: "partial",
    propertiesCreated: 0,
    propertiesUpdated: 28,
    propertiesArchived: 1,
    warnings: ["Ref. 1452: marcada como sold en CRM"],
    warningsReviewed: true,
    error: null,
  },
  {
    id: "demo-sync-3",
    startedAt: daysAgo(3),
    finishedAt: new Date(daysAgo(3).getTime() + 55_000),
    status: "success",
    propertiesCreated: 1,
    propertiesUpdated: 27,
    propertiesArchived: 0,
    warnings: [],
    warningsReviewed: true,
    error: null,
  },
  {
    id: "demo-sync-4",
    startedAt: daysAgo(7),
    finishedAt: null,
    status: "failed",
    propertiesCreated: 0,
    propertiesUpdated: 0,
    propertiesArchived: 0,
    warnings: [],
    warningsReviewed: true,
    error: "Timeout conectando a eGO API (simulado)",
  },
];

export const demoSyncLog = demoSyncLogs[0];

export type DemoAiUsage = {
  id: string;
  module: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  costUsd: string;
  createdAt: Date;
};

export const demoAiUsage: DemoAiUsage[] = [
  {
    id: "ai-1",
    module: "descriptions:desc-v1",
    model: "claude-sonnet-4-6",
    inputTokens: 820,
    outputTokens: 640,
    costUsd: "0.012060",
    createdAt: daysAgo(0),
  },
  {
    id: "ai-2",
    module: "search:search-v1",
    model: "claude-sonnet-4-6",
    inputTokens: 420,
    outputTokens: 180,
    costUsd: "0.003960",
    createdAt: daysAgo(0),
  },
  {
    id: "ai-3",
    module: "photos:photos-v1",
    model: "claude-sonnet-4-6",
    inputTokens: 1200,
    outputTokens: 320,
    costUsd: "0.008400",
    createdAt: daysAgo(1),
  },
  {
    id: "ai-4",
    module: "leads:score-v1",
    model: "claude-sonnet-4-6",
    inputTokens: 560,
    outputTokens: 120,
    costUsd: "0.003480",
    createdAt: daysAgo(1),
  },
  {
    id: "ai-5",
    module: "valuation:val-v1",
    model: "claude-sonnet-4-6",
    inputTokens: 980,
    outputTokens: 420,
    costUsd: "0.009240",
    createdAt: daysAgo(2),
  },
  {
    id: "ai-6",
    module: "chat:chat-v1:public",
    model: "claude-sonnet-4-6",
    inputTokens: 340,
    outputTokens: 210,
    costUsd: "0.004170",
    createdAt: daysAgo(2),
  },
  {
    id: "ai-7",
    module: "matching:match-v1",
    model: "claude-sonnet-4-6",
    inputTokens: 710,
    outputTokens: 280,
    costUsd: "0.006330",
    createdAt: daysAgo(4),
  },
  {
    id: "ai-8",
    module: "whatsapp:wa-v1",
    model: "claude-sonnet-4-6",
    inputTokens: 290,
    outputTokens: 95,
    costUsd: "0.002295",
    createdAt: daysAgo(5),
  },
];

export type DemoActivity = {
  id: string;
  at: Date;
  kind: "lead" | "valuation" | "sync" | "property" | "ai" | "content";
  title: string;
  detail: string;
  href?: string;
};

export const demoActivity: DemoActivity[] = [
  {
    id: "act-1",
    at: daysAgo(0),
    kind: "lead",
    title: "Nuevo lead: Thomas Müller",
    detail: "WhatsApp · ref. 1530 · puntuación 92",
    href: "/admin/leads",
  },
  {
    id: "act-2",
    at: daysAgo(0),
    kind: "sync",
    title: "Sincronización completada",
    detail: "2 creadas · 26 actualizadas · 2 avisos",
    href: "/admin/settings#sincronizacion",
  },
  {
    id: "act-3",
    at: daysAgo(0),
    kind: "ai",
    title: "Descripción IA generada",
    detail: "Ref. 1530 · pendiente revisión humana",
    href: "/admin/settings#asistente",
  },
  {
    id: "act-4",
    at: daysAgo(1),
    kind: "valuation",
    title: "Valoración recibida",
    detail: "Helen Brooks · villa Los Pinos 12",
    href: "/admin/valuations",
  },
  {
    id: "act-5",
    at: daysAgo(1),
    kind: "property",
    title: "Override manual",
    detail: "Ref. 1505 · precio ajustado en panel",
    href: "/admin/properties/seed-1505",
  },
  {
    id: "act-6",
    at: daysAgo(2),
    kind: "content",
    title: "Contenido actualizado",
    detail: "Página La Cova · ES",
    href: "/admin/content",
  },
  {
    id: "act-7",
    at: daysAgo(3),
    kind: "lead",
    title: "Lead contactado",
    detail: "Sophie Laurent · FR",
    href: "/admin/leads",
  },
];

export type DemoMediaItem = {
  id: string;
  propertyId: string;
  reference: string;
  title: string;
  url: string;
  sortOrder: number;
  isCover: boolean;
  aiRoomType: string | null;
  aiQualityScore: number | null;
  altEs: string;
  altEn: string;
};

export const demoMediaItems: DemoMediaItem[] = [
  {
    id: "media-1530-0",
    propertyId: "seed-1530",
    reference: "1530",
    title: "Elegant Villa with Sea & Mountain Views",
    url: "https://montepegolife.com/wp-content/uploads/2026/07/DJI_0852-scaled.jpg",
    sortOrder: 0,
    isCover: true,
    aiRoomType: "facade",
    aiQualityScore: 9.2,
    altEs: "Villa con vistas al mar y la montaña",
    altEn: "Villa with sea and mountain views",
  },
  {
    id: "media-1530-1",
    propertyId: "seed-1530",
    reference: "1530",
    title: "Elegant Villa with Sea & Mountain Views",
    url: "https://montepegolife.com/wp-content/uploads/2026/07/DJI_0848-scaled.jpg",
    sortOrder: 1,
    isCover: false,
    aiRoomType: "pool",
    aiQualityScore: 8.8,
    altEs: "Piscina y terraza",
    altEn: "Pool and terrace",
  },
  {
    id: "media-1505-0",
    propertyId: "seed-1505",
    reference: "1505",
    title: "Renovated Villa with Panoramic Views",
    url: "https://montepegolife.com/wp-content/uploads/elementor/thumbs/DJI_0852-scaled-rqe5kbw50or6bmqmb42rlazbnbn6ikpk6wepaz5pz8.jpg",
    sortOrder: 0,
    isCover: true,
    aiRoomType: "facade",
    aiQualityScore: 8.5,
    altEs: "Villa reformada con vistas panorámicas",
    altEn: "Renovated villa with panoramic views",
  },
  {
    id: "media-1464-0",
    propertyId: "seed-1464",
    reference: "1464",
    title: "Mediterranean Villa with Panoramic Sea Views",
    url: "https://montepegolife.com/wp-content/uploads/2026/06/IMG_9489-scaled.jpg",
    sortOrder: 0,
    isCover: true,
    aiRoomType: "view",
    aiQualityScore: 9.4,
    altEs: "Vistas al mar desde la terraza",
    altEn: "Sea views from the terrace",
  },
];

export type DemoUser = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "agent" | "editor";
  lastLogin: Date;
  active: boolean;
};

export const demoUsers: DemoUser[] = [
  {
    id: "user-1",
    name: "Jorge Ivars",
    email: "jorge@montepegolife.com",
    role: "admin",
    lastLogin: daysAgo(0),
    active: true,
  },
  {
    id: "user-2",
    name: "Raquel",
    email: "raquel@montepegolife.com",
    role: "agent",
    lastLogin: daysAgo(0),
    active: true,
  },
  {
    id: "user-3",
    name: "Pepe Ivars",
    email: "pepe@montepegolife.com",
    role: "admin",
    lastLogin: daysAgo(2),
    active: true,
  },
  {
    id: "user-4",
    name: "María",
    email: "maria@montepegolife.com",
    role: "editor",
    lastLogin: daysAgo(1),
    active: true,
  },
  {
    id: "user-5",
    name: "Fina",
    email: "fina@montepegolife.com",
    role: "editor",
    lastLogin: daysAgo(5),
    active: true,
  },
];

export type DemoPageTranslation = {
  locale: string;
  title: string;
  body: string;
  seoTitle: string;
  seoDescription: string;
  updatedAt: Date;
};

export type DemoPage = {
  id: string;
  slug: string;
  label: string;
  updatedAt: Date;
  translations: DemoPageTranslation[];
};

function pageTranslations(
  base: Record<
    string,
    { title: string; body: string; seoTitle?: string; seoDescription?: string }
  >,
): DemoPageTranslation[] {
  return Object.entries(base).map(([locale, value]) => ({
    locale,
    title: value.title,
    body: value.body,
    seoTitle: value.seoTitle ?? value.title,
    seoDescription:
      value.seoDescription ?? `${value.title} — MontePego Life`,
    updatedAt: daysAgo(2),
  }));
}

export const demoPages: DemoPage[] = [
  {
    id: "demo-page-about",
    slug: "about",
    label: "Nosotros",
    updatedAt: daysAgo(2),
    translations: pageTranslations({
      en: {
        title: "A family business in Monte Pego",
        body: "MontePego Life is the estate agency rooted in the residencial.",
      },
      es: {
        title: "Un negocio familiar en Monte Pego",
        body: "MontePego Life es la inmobiliaria arraigada en el residencial.",
      },
      nl: { title: "Een familiebedrijf in Monte Pego", body: "..." },
      de: { title: "Ein Familienunternehmen in Monte Pego", body: "..." },
      fr: { title: "Une entreprise familiale à Monte Pego", body: "..." },
      pl: { title: "Rodzinna firma w Monte Pego", body: "..." },
    }),
  },
  {
    id: "demo-page-services",
    slug: "services",
    label: "Servicios",
    updatedAt: daysAgo(3),
    translations: pageTranslations({
      en: { title: "Residencial services", body: "Reception, parcels, 24h security." },
      es: { title: "Servicios del residencial", body: "Recepción, paquetes, seguridad 24h." },
      nl: { title: "Diensten", body: "..." },
      de: { title: "Dienstleistungen", body: "..." },
      fr: { title: "Services", body: "..." },
      pl: { title: "Usługi", body: "..." },
    }),
  },
  {
    id: "demo-page-la-cova",
    slug: "la-cova",
    label: "La Cova",
    updatedAt: daysAgo(1),
    translations: pageTranslations({
      en: { title: "Gastrobar La Cova", body: "The neighbourhood table in Monte Pego." },
      es: { title: "Gastrobar La Cova", body: "La mesa del barrio en Monte Pego." },
      nl: { title: "Gastrobar La Cova", body: "..." },
      de: { title: "Gastrobar La Cova", body: "..." },
      fr: { title: "Gastrobar La Cova", body: "..." },
      pl: { title: "Gastrobar La Cova", body: "..." },
    }),
  },
  {
    id: "demo-page-monte-pego",
    slug: "monte-pego",
    label: "Monte Pego",
    updatedAt: daysAgo(4),
    translations: pageTranslations({
      en: { title: "Living in Monte Pego", body: "Climate, community, access." },
      es: { title: "Vivir en Monte Pego", body: "Clima, comunidad, acceso." },
      nl: { title: "Wonen in Monte Pego", body: "..." },
      de: { title: "Leben in Monte Pego", body: "..." },
      fr: { title: "Vivir à Monte Pego", body: "..." },
      pl: { title: "Życie w Monte Pego", body: "..." },
    }),
  },
  {
    id: "demo-page-legal",
    slug: "legal-notice",
    label: "Aviso legal",
    updatedAt: daysAgo(10),
    translations: pageTranslations({
      es: {
        title: "Aviso legal",
        body: "Datos identificativos de MontePego Life. Contenido legal pendiente de revisión final del cliente.",
      },
      en: { title: "Legal notice", body: "MontePego Life legal notice." },
      nl: { title: "Juridische kennisgeving", body: "..." },
      de: { title: "Impressum", body: "..." },
      fr: { title: "Mentions légales", body: "..." },
      pl: { title: "Nota prawna", body: "..." },
    }),
  },
  {
    id: "demo-page-privacy",
    slug: "privacy-policy",
    label: "Privacidad",
    updatedAt: daysAgo(10),
    translations: pageTranslations({
      es: { title: "Política de privacidad", body: "Tratamiento de datos RGPD." },
      en: { title: "Privacy policy", body: "GDPR data processing." },
      nl: { title: "Privacybeleid", body: "..." },
      de: { title: "Datenschutz", body: "..." },
      fr: { title: "Politique de confidentialité", body: "..." },
      pl: { title: "Polityka prywatności", body: "..." },
    }),
  },
  {
    id: "demo-page-cookies",
    slug: "cookies-policy",
    label: "Cookies",
    updatedAt: daysAgo(10),
    translations: pageTranslations({
      es: { title: "Política de cookies", body: "Uso de cookies en montepegolife.com." },
      en: { title: "Cookies policy", body: "Cookie usage on montepegolife.com." },
      nl: { title: "Cookiebeleid", body: "..." },
      de: { title: "Cookie-Richtlinie", body: "..." },
      fr: { title: "Politique cookies", body: "..." },
      pl: { title: "Polityka cookies", body: "..." },
    }),
  },
];

export const demoAdminMeta: Record<
  string,
  { pendingTranslations: number; overrideCount: number; hasPhotos?: boolean }
> = {
  "1505": { pendingTranslations: 2, overrideCount: 1 },
  "1530": { pendingTranslations: 3, overrideCount: 2 },
  "1464": { pendingTranslations: 1, overrideCount: 0 },
  "1498": { pendingTranslations: 4, overrideCount: 1 },
  "1456": { pendingTranslations: 0, overrideCount: 0, hasPhotos: false },
  "1253": { pendingTranslations: 1, overrideCount: 0, hasPhotos: false },
};

export type DemoPortalStats = {
  owners: number;
  residents: number;
  openIncidents: number;
  pendingParcels: number;
  laCovaBookings: number;
};

export const demoPortalStats: DemoPortalStats = {
  owners: 42,
  residents: 128,
  openIncidents: 3,
  pendingParcels: 7,
  laCovaBookings: 12,
};
