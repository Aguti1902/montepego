export const siteConfig = {
  name: "MontePego Life",
  brandBlue: "#094D88",
  contact: {
    address:
      "Edificio Rosario, Avd. Internacional Nº1, Monte Pego, 03780, Pego, Alicante, España",
    phones: ["96 557 25 07", "96 557 14 58"],
    email: "info@montepegolife.com",
    whatsapp: "+34662306461",
    whatsappDisplay: "+34 662 306 461",
    instagram: "@montepegolife",
  },
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
