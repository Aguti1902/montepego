import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/config/site";
import { PageHero } from "@/components/layout/page-hero";
import { montePegoMedia } from "@/lib/media/site";
import { buildPageMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ locale: string }> };

const faqKeys = ["climate", "access", "services", "secondHome"] as const;

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "MontePego" });
  return buildPageMetadata({
    locale: locale as Locale,
    title: t("title"),
    description: t("intro"),
    href: { pathname: "/monte-pego" },
  });
}

export default async function MontePegoPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("MontePego");

  return (
    <>
      <PageHero
        title={t("title")}
        intro={t("intro")}
        image={montePegoMedia.residential[0] ?? montePegoMedia.hero}
        eyebrow="Costa Blanca"
      />
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-4 text-base leading-relaxed">
          <p>{t("body1")}</p>
          <p className="text-muted-foreground">{t("body2")}</p>
        </div>
        <div className="relative min-h-[280px] overflow-hidden">
          <Image
            src={montePegoMedia.residential[1] ?? montePegoMedia.hero}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>
      <section className="section-band">
        <div className="mx-auto max-w-3xl space-y-8 px-4 py-16">
          {faqKeys.map((key) => (
            <article key={key}>
              <h2 className="font-display text-2xl text-ink">
                {t(`${key}Q`)}
              </h2>
              <p className="mt-2 text-muted-foreground">{t(`${key}A`)}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
