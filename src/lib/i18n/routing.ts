import { defineRouting } from "next-intl/routing";
import { siteConfig } from "@/config/site";

export const routing = defineRouting({
  locales: [...siteConfig.locales],
  defaultLocale: siteConfig.defaultLocale,
  localePrefix: "always",
  pathnames: {
    "/": "/",
    "/properties": {
      en: "/properties",
      nl: "/woningen",
      de: "/immobilien",
      fr: "/proprietes",
      pl: "/nieruchomosci",
      es: "/propiedades",
    },
    "/property/[slug]": {
      en: "/property/[slug]",
      nl: "/woning/[slug]",
      de: "/immobilie/[slug]",
      fr: "/propriete/[slug]",
      pl: "/nieruchomosc/[slug]",
      es: "/propiedad/[slug]",
    },
    "/sell": {
      en: "/sell",
      nl: "/verkopen",
      de: "/verkaufen",
      fr: "/vendre",
      pl: "/sprzedaj",
      es: "/vender",
    },
    "/about": {
      en: "/about",
      nl: "/over-ons",
      de: "/uber-uns",
      fr: "/a-propos",
      pl: "/o-nas",
      es: "/nosotros",
    },
    "/services": {
      en: "/services",
      nl: "/diensten",
      de: "/dienstleistungen",
      fr: "/services",
      pl: "/uslugi",
      es: "/servicios",
    },
    "/la-cova": "/la-cova",
    "/monte-pego": "/monte-pego",
    "/contact": {
      en: "/contact",
      nl: "/contact",
      de: "/kontakt",
      fr: "/contact",
      pl: "/kontakt",
      es: "/contacto",
    },
    "/legal-notice": {
      en: "/legal-notice",
      nl: "/juridische-kennisgeving",
      de: "/impressum",
      fr: "/mentions-legales",
      pl: "/nota-prawna",
      es: "/aviso-legal",
    },
    "/privacy-policy": {
      en: "/privacy-policy",
      nl: "/privacybeleid",
      de: "/datenschutz",
      fr: "/politique-de-confidentialite",
      pl: "/polityka-prywatnosci",
      es: "/politica-de-privacidad",
    },
    "/cookies-policy": {
      en: "/cookies-policy",
      nl: "/cookiebeleid",
      de: "/cookie-richtlinie",
      fr: "/politique-cookies",
      pl: "/polityka-cookies",
      es: "/politica-de-cookies",
    },
  },
});

export type AppPathnames = keyof typeof routing.pathnames;
