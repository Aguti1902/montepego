export const siteConfig = {
  name: "MontePego Life",
  /** Marca real montepegolife.com (Elementor); PROJECT.md usaba #094D88 */
  brandBlue: "#2C558A",
  brandGold: "#B88C40",
  brandCream: "#F4EEE3",
  contact: {
    address:
      "Edificio Rosario, Avd. Internacional Nº1, Monte Pego, 03780, Pego, Alicante, España",
    phones: ["96 557 25 07", "96 557 14 58"],
    email: "info@montepegolife.com",
    whatsapp: "+34662306461",
    whatsappDisplay: "+34 662 306 461",
    instagram: "@montepegolife",
  },
  team: [
    { name: "Raquel", role: "Sales & client care" },
    { name: "Jorge Ivars", role: "Director" },
    { name: "Pepe Ivars", role: "Founder" },
    { name: "María", role: "Residencial services" },
    { name: "Fina", role: "Administration" },
  ] as const,
  locales: ["en", "nl", "de", "fr", "pl", "es"] as const,
  defaultLocale: "en" as const,
  mapTilesStyle: "https://tiles.openfreemap.org/styles/liberty",
} as const;

export type Locale = (typeof siteConfig.locales)[number];

export const FEATURE_SLUGS = [
  "pool",
  "sea_view",
  "mountain_view",
  "garage",
  "guest_apartment",
  "terrace",
  "garden",
  "air_conditioning",
  "heating",
  "fireplace",
  "solar",
  "renovated",
  "furnished",
  "alarm",
] as const;

export type FeatureSlug = (typeof FEATURE_SLUGS)[number];
