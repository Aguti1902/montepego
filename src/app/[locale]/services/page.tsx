import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/config/site";
import { PageHero } from "@/components/layout/page-hero";
import { montePegoMedia } from "@/lib/media/site";
import { buildPageMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ locale: string }> };

const serviceKeys = [
  "reception",
  "security",
  "parcels",
  "maintenance",
  "community",
] as const;

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Services" });
  return buildPageMetadata({
    locale: locale as Locale,
    title: t("title"),
    description: t("intro"),
    href: { pathname: "/services" },
  });
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Services");

  return (
    <>
      <PageHero
        title={t("title")}
        intro={t("intro")}
        image={montePegoMedia.services[1] ?? montePegoMedia.hero}
        eyebrow={t("eyebrow")}
      />
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {serviceKeys.map((key, index) => (
            <article key={key} className="border-t border-sun-clay/50 pt-5">
              <p className="text-xs tabular text-muted-foreground">
                0{index + 1}
              </p>
              <h2 className="font-display mt-2 text-2xl text-ink">
                {t(`${key}Title`)}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {t(`${key}Body`)}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {montePegoMedia.services.slice(0, 6).map((src) => (
            <div key={src} className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={src}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
