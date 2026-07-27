import { defineRouting } from "next-intl/routing";
import { siteConfig } from "@/config/site";

/**
 * Pathnames estables en todos los idiomas.
 * (Las URLs traducidas de next-intl provocaban bucles 307 en este stack Next 16.)
 */
export const routing = defineRouting({
  locales: [...siteConfig.locales],
  defaultLocale: siteConfig.defaultLocale,
  localePrefix: "always",
  pathnames: {
    "/": "/",
    "/properties": "/properties",
    "/property/[slug]": "/property/[slug]",
    "/sell": "/sell",
    "/about": "/about",
    "/services": "/services",
    "/la-cova": "/la-cova",
    "/monte-pego": "/monte-pego",
    "/contact": "/contact",
    "/legal-notice": "/legal-notice",
    "/privacy-policy": "/privacy-policy",
    "/cookies-policy": "/cookies-policy",
  },
});

export type AppPathnames = keyof typeof routing.pathnames;
