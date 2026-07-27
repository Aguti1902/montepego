import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/config/site";
import { siteConfig } from "@/config/site";
import { PageHero } from "@/components/layout/page-hero";
import { montePegoMedia } from "@/lib/media/site";
import { buildPageMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });
  return buildPageMetadata({
    locale: locale as Locale,
    title: t("title"),
    description: t("intro"),
    href: { pathname: "/about" },
  });
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("About");

  return (
    <>
      <PageHero
        title={t("title")}
        intro={t("intro")}
        image={montePegoMedia.about[0] ?? montePegoMedia.hero}
        eyebrow="MontePego Life"
      />
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6 text-base leading-relaxed text-foreground">
          <p>{t("body1")}</p>
          <p>{t("body2")}</p>
          <p>{t("body3")}</p>
        </div>
        <div className="relative min-h-[320px] overflow-hidden">
          <Image
            src={montePegoMedia.about[1] ?? montePegoMedia.hero}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 40vw"
          />
        </div>
      </div>

      <section className="section-band">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="font-display text-3xl text-ink">{t("teamTitle")}</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">{t("teamIntro")}</p>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {siteConfig.team.map((member) => (
              <li key={member.name} className="border-l-2 border-sun-clay pl-4">
                <p className="font-display text-2xl text-ink">{member.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{member.role}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
