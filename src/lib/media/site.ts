import siteMedia from "@/lib/media/site-media.json";

export const montePegoMedia = {
  hero: siteMedia.hero as string,
  logo: "/brand/logo.png",
  logoRemote: siteMedia.logo as string,
  services: siteMedia.services as string[],
  residential: siteMedia.residential as string[],
  about: siteMedia.about as string[],
  laCova: (siteMedia.laCova as string[]).filter(
    (url) => url.startsWith("http") && !url.includes(" "),
  ),
  sell: siteMedia.sell as string[],
} as const;

export function pageHeroImage(
  page: keyof typeof montePegoMedia,
  fallbackIndex = 0,
): string {
  const value = montePegoMedia[page];
  if (typeof value === "string") return value;
  return value[fallbackIndex] ?? montePegoMedia.hero;
}
