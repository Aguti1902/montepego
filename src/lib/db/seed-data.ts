/**
 * Datos semilla para:
 * - arranque local sin DATABASE_URL
 * - adaptador CRM `mock` (simula la API externa)
 * - tests de sync/sanitize
 *
 * NO son una segunda fuente de negocio en staging/prod.
 * Con DATABASE_URL + sync (`/api/sync`), la cartera sale del CRM → BD.
 */
import type { FeatureSlug } from "@/config/site";

export type SeedProperty = {
  reference: string;
  slug: string;
  status: "available" | "reserved" | "sold" | "draft" | "withdrawn";
  type: "villa" | "apartment" | "plot" | "townhouse" | "commercial";
  price: number;
  bedrooms: number;
  bathrooms: number;
  builtArea: number | null;
  plotArea: number | null;
  features: FeatureSlug[];
  isFeatured: boolean;
  elevation: number;
  orientation: string;
  viewRelation: string;
  latitude: string;
  longitude: string;
  titles: Record<string, string>;
  descriptions: Record<string, string>;
  coverPlaceholder: string;
};

const locales = ["en", "nl", "de", "fr", "pl", "es"] as const;

function multi(
  en: string,
  others?: Partial<Record<(typeof locales)[number], string>>,
): Record<string, string> {
  const base: Record<string, string> = { en };
  for (const locale of locales) {
    base[locale] = others?.[locale] ?? en;
  }
  return base;
}

export const seedProperties: SeedProperty[] = [
  {
    reference: "1505",
    slug: "renovated-villa-panoramic-views-1505",
    status: "available",
    type: "villa",
    price: 495000,
    bedrooms: 3,
    bathrooms: 2,
    builtArea: 170,
    plotArea: 1600,
    features: ["pool", "sea_view", "mountain_view", "garage", "renovated", "terrace"],
    isFeatured: true,
    elevation: 185,
    orientation: "South",
    viewRelation: "sea & mountain",
    latitude: "38.8421000",
    longitude: "0.0189000",
    titles: multi("Renovated Villa with Panoramic Views", {
      es: "Villa reformada con vistas panorámicas",
      nl: "Gerenoveerde villa met panoramisch uitzicht",
      de: "Renovierte Villa mit Panoramablick",
      fr: "Villa rénovée avec vues panoramiques",
      pl: "Odnowiona willa z panoramicznym widokiem",
    }),
    descriptions: multi(
      "A carefully renovated villa in Monte Pego with open views to the sea and the Segària ridge. Bright living spaces, private pool and a generous plot for Mediterranean living.",
      {
        es: "Villa reformada con cuidado en Monte Pego, con vistas abiertas al mar y a la sierra de Segària. Espacios luminosos, piscina privada y parcela generosa.",
        nl: "Zorgvuldig gerenoveerde villa in Monte Pego met open uitzicht op zee en de Segària. Lichte woonruimtes, privézwembad en ruim perceel.",
        de: "Sorgfältig renovierte Villa in Monte Pego mit freiem Blick aufs Meer und die Segària. Helle Wohnräume, privater Pool und großzügiges Grundstück.",
        fr: "Villa soigneusement rénovée à Monte Pego avec vue ouverte sur la mer et la Segària. Espaces lumineux, piscine privée et grand terrain.",
        pl: "Starannie odnowiona willa w Monte Pego z otwartym widokiem na morze i Segària. Jasne wnętrza, prywatny basen i duża działka.",
      },
    ),
    coverPlaceholder: "/placeholders/villa-1505.svg",
  },
  {
    reference: "1532",
    slug: "charming-villa-panoramic-views-1532",
    status: "available",
    type: "villa",
    price: 380000,
    bedrooms: 2,
    bathrooms: 2,
    builtArea: 173,
    plotArea: 580,
    features: ["pool", "mountain_view", "terrace", "garden", "air_conditioning"],
    isFeatured: true,
    elevation: 160,
    orientation: "South-East",
    viewRelation: "mountain",
    latitude: "38.8405000",
    longitude: "0.0201000",
    titles: multi("Charming Villa with Panoramic Views", {
      es: "Encantadora villa con vistas panorámicas",
      nl: "Charmante villa met panoramisch uitzicht",
      de: "Charmante Villa mit Panoramablick",
      fr: "Villa charmante avec vues panoramiques",
      pl: "Urokliwa willa z panoramicznym widokiem",
    }),
    descriptions: multi(
      "A charming two-bedroom villa with panoramic mountain views, easy single-level living and a quiet corner of Monte Pego.",
    ),
    coverPlaceholder: "/placeholders/villa-1532.svg",
  },
  {
    reference: "1530",
    slug: "elegant-villa-sea-mountain-views-1530",
    status: "available",
    type: "villa",
    price: 540000,
    bedrooms: 1,
    bathrooms: 1,
    builtArea: 265,
    plotArea: 900,
    features: ["pool", "sea_view", "mountain_view", "garage", "solar"],
    isFeatured: true,
    elevation: 210,
    orientation: "South",
    viewRelation: "sea & mountain",
    latitude: "38.8442000",
    longitude: "0.0175000",
    titles: multi("Elegant Villa with Sea & Mountain Views", {
      es: "Elegante villa con vistas al mar y a la montaña",
      nl: "Elegante villa met zee- en bergzicht",
      de: "Elegante Villa mit Meer- und Bergblick",
      fr: "Villa élégante avec vue mer et montagne",
      pl: "Elegancka willa z widokiem na morze i góry",
    }),
    descriptions: multi(
      "An elegant villa oriented to capture both sea and mountain light. Generous built area on a manageable plot, ideal as a refined second home.",
    ),
    coverPlaceholder: "/placeholders/villa-1530.svg",
  },
  {
    reference: "1528",
    slug: "peaceful-oasis-private-pool-1528",
    status: "available",
    type: "villa",
    price: 750000,
    bedrooms: 5,
    bathrooms: 3,
    builtArea: 329,
    plotArea: 2621,
    features: [
      "pool",
      "guest_apartment",
      "garage",
      "garden",
      "mountain_view",
      "fireplace",
    ],
    isFeatured: true,
    elevation: 145,
    orientation: "South-West",
    viewRelation: "mountain",
    latitude: "38.8398000",
    longitude: "0.0220000",
    titles: multi("Peaceful Oasis with Private Pool and Guest Apartments", {
      es: "Oasis tranquilo con piscina privada y apartamentos de invitados",
      nl: "Vredige oase met privézwembad en gastenappartementen",
      de: "Ruhige Oase mit Pool und Gästeapartments",
      fr: "Oasis paisible avec piscine privée et appartements d'amis",
      pl: "Spokojna oaza z basenem i apartamentami gościnnymi",
    }),
    descriptions: multi(
      "A peaceful family compound with guest apartments, a large private pool and room to gather. Perfect for those who want space without leaving the residencial.",
    ),
    coverPlaceholder: "/placeholders/villa-1528.svg",
  },
  {
    reference: "1496",
    slug: "exclusive-modern-residence-1496",
    status: "available",
    type: "villa",
    price: 1449000,
    bedrooms: 4,
    bathrooms: 3,
    builtArea: null,
    plotArea: 858,
    features: [
      "pool",
      "sea_view",
      "mountain_view",
      "garage",
      "air_conditioning",
      "solar",
      "alarm",
    ],
    isFeatured: true,
    elevation: 230,
    orientation: "South",
    viewRelation: "sea & mountain",
    latitude: "38.8455000",
    longitude: "0.0162000",
    titles: multi("Exclusive Modern Residence with Panoramic Views", {
      es: "Residencia moderna exclusiva con vistas panorámicas",
      nl: "Exclusieve moderne residentie met panoramisch uitzicht",
      de: "Exklusive moderne Residenz mit Panoramablick",
      fr: "Résidence moderne exclusive avec vues panoramiques",
      pl: "Ekskluzywna nowoczesna rezydencja z panoramicznym widokiem",
    }),
    descriptions: multi(
      "A modern high-end residence with commanding panoramic views. Contemporary lines, strong privacy and the best of Monte Pego's elevated plots.",
    ),
    coverPlaceholder: "/placeholders/villa-1496.svg",
  },
  {
    reference: "1512",
    slug: "elegant-mediterranean-villa-1512",
    status: "available",
    type: "villa",
    price: 875000,
    bedrooms: 5,
    bathrooms: 4,
    builtArea: 427,
    plotArea: 1099,
    features: [
      "pool",
      "sea_view",
      "garage",
      "terrace",
      "garden",
      "furnished",
      "heating",
    ],
    isFeatured: true,
    elevation: 175,
    orientation: "South-East",
    viewRelation: "sea",
    latitude: "38.8412000",
    longitude: "0.0195000",
    titles: multi("Elegant Mediterranean Villa", {
      es: "Elegante villa mediterránea",
      nl: "Elegante mediterrane villa",
      de: "Elegante mediterrane Villa",
      fr: "Villa méditerranéenne élégante",
      pl: "Elegancka willa śródziemnomorska",
    }),
    descriptions: multi(
      "A generous Mediterranean villa with five bedrooms, sea glimpses and outdoor living designed for long seasons in the Costa Blanca sun.",
    ),
    coverPlaceholder: "/placeholders/villa-1512.svg",
  },
  {
    reference: "1452",
    slug: "bright-villa-private-pool-1452",
    status: "sold",
    type: "villa",
    price: 400000,
    bedrooms: 3,
    bathrooms: 2,
    builtArea: null,
    plotArea: 1100,
    features: ["pool", "garden", "terrace"],
    isFeatured: false,
    elevation: 150,
    orientation: "South",
    viewRelation: "mountain",
    latitude: "38.8389000",
    longitude: "0.0211000",
    titles: multi("Bright Villa with Private Pool and Sunny Flat Plot", {
      es: "Villa luminosa con piscina privada y parcela llana",
      nl: "Lichte villa met privézwembad en vlak perceel",
      de: "Helle Villa mit Pool und ebenem Grundstück",
      fr: "Villa lumineuse avec piscine privée et terrain plat",
      pl: "Jasna willa z basenem i płaską działką",
    }),
    descriptions: multi(
      "Sold. Kept in the catalogue to validate archival behaviour for sold properties.",
    ),
    coverPlaceholder: "/placeholders/villa-1452.svg",
  },
  {
    reference: "1456",
    slug: "newly-refurbished-flat-1456",
    status: "draft",
    type: "apartment",
    price: 199000,
    bedrooms: 2,
    bathrooms: 1,
    builtArea: null,
    plotArea: null,
    features: ["terrace", "renovated"],
    isFeatured: false,
    elevation: 120,
    orientation: "East",
    viewRelation: "residential",
    latitude: "38.8375000",
    longitude: "0.0230000",
    titles: multi("Newly Refurbished Flat", {
      es: "Piso recién reformado",
      nl: "Nieuw gerenoveerd appartement",
      de: "Frisch renovierte Wohnung",
      fr: "Appartement fraîchement rénové",
      pl: "Świeżo wyremontowane mieszkanie",
    }),
    descriptions: multi(
      "Draft property used to test CRM sanitation: missing area figures must not be published as 0 m².",
    ),
    coverPlaceholder: "/placeholders/apartment-1456.svg",
  },
];
