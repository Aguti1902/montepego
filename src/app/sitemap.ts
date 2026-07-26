import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { seedProperties } from "@/lib/db/seed-data";
import { absoluteUrl, buildLocaleAlternates } from "@/lib/seo/metadata";
import { getPathname } from "@/lib/i18n/navigation";

const staticPaths = [
  "/",
  "/properties",
  "/sell",
  "/about",
  "/services",
  "/la-cova",
  "/monte-pego",
  "/contact",
  "/legal-notice",
  "/privacy-policy",
  "/cookies-policy",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const pathname of staticPaths) {
    for (const locale of siteConfig.locales) {
      const href =
        pathname === "/"
          ? ({ pathname: "/" } as const)
          : ({ pathname } as const);
      const path = getPathname({ locale, href });
      entries.push({
        url: absoluteUrl(path),
        lastModified: new Date(),
        alternates: {
          languages: buildLocaleAlternates(href),
        },
      });
    }
  }

  for (const property of seedProperties.filter(
    (p) => p.status === "available" || p.status === "reserved",
  )) {
    for (const locale of siteConfig.locales) {
      const href = {
        pathname: "/property/[slug]" as const,
        params: { slug: property.slug },
      };
      const path = getPathname({ locale, href });
      entries.push({
        url: absoluteUrl(path),
        lastModified: new Date(),
        alternates: {
          languages: buildLocaleAlternates(href),
        },
      });
    }
  }

  return entries;
}
