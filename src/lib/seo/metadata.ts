import type { Metadata } from "next";
import { siteConfig, type Locale } from "@/config/site";
import { getPathname } from "@/lib/i18n/navigation";
import type { AppPathnames } from "@/lib/i18n/routing";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://montepegolife.com";

export function absoluteUrl(path: string) {
  return new URL(path, siteUrl).toString();
}

type HrefInput =
  | {
      pathname: "/";
    }
  | {
      pathname: Exclude<AppPathnames, "/" | "/property/[slug]">;
    }
  | {
      pathname: "/property/[slug]";
      params: { slug: string };
    };

export function buildLocaleAlternates(href: HrefInput) {
  const languages: Record<string, string> = {};

  for (const locale of siteConfig.locales) {
    const path = getPathname({ locale, href });
    languages[locale] = absoluteUrl(path);
  }

  languages["x-default"] = languages.en;
  return languages;
}

export function buildPageMetadata(input: {
  locale: Locale;
  title: string;
  description: string;
  href: HrefInput;
  images?: string[];
}): Metadata {
  const path = getPathname({ locale: input.locale, href: input.href });
  const url = absoluteUrl(path);
  const alternates = buildLocaleAlternates(input.href);

  return {
    title: `${input.title} | ${siteConfig.name}`,
    description: input.description,
    alternates: {
      canonical: url,
      languages: alternates,
    },
    openGraph: {
      title: input.title,
      description: input.description,
      url,
      siteName: siteConfig.name,
      locale: input.locale,
      type: "website",
      images: input.images,
    },
  };
}
