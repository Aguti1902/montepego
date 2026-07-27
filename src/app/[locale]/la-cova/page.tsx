import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/config/site";
import { PageHero } from "@/components/layout/page-hero";
import { montePegoMedia } from "@/lib/media/site";
import { buildPageMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "LaCova" });
  return buildPageMetadata({
    locale: locale as Locale,
    title: t("title"),
    description: t("intro"),
    href: { pathname: "/la-cova" },
  });
}

export default async function LaCovaPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("LaCova");
  const gallery = montePegoMedia.laCova.slice(0, 6);

  return (
    <>
      <PageHero
        title={t("title")}
        intro={t("intro")}
        image={gallery[0] ?? montePegoMedia.hero}
        eyebrow="Gastrobar"
      />
      <div className="mx-auto max-w-3xl px-4 py-16">
        <p className="text-lg leading-relaxed text-foreground">{t("body1")}</p>
        <p className="mt-4 text-muted-foreground">{t("body2")}</p>
      </div>
      <div className="mx-auto grid max-w-6xl gap-3 px-4 pb-16 sm:grid-cols-2 lg:grid-cols-3">
        {gallery.map((src) => (
          <div key={src} className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={src}
              alt="La Cova"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 50vw, 33vw"
            />
          </div>
        ))}
      </div>
    </>
  );
}
