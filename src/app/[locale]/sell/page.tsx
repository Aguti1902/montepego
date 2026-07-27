import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/config/site";
import { PageHero } from "@/components/layout/page-hero";
import { ValuationForm } from "@/components/forms/valuation-form";
import { montePegoMedia } from "@/lib/media/site";
import { buildPageMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ locale: string }> };

const steps = ["step1", "step2", "step3", "step4"] as const;

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Sell" });
  return buildPageMetadata({
    locale: locale as Locale,
    title: t("title"),
    description: t("intro"),
    href: { pathname: "/sell" },
  });
}

export default async function SellPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Sell");

  return (
    <>
      <PageHero
        title={t("title")}
        intro={t("intro")}
        image={montePegoMedia.sell[0] ?? montePegoMedia.hero}
        eyebrow={t("eyebrow")}
      />
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl text-ink">{t("processTitle")}</h2>
          <ol className="mt-8 space-y-6">
            {steps.map((key, index) => (
              <li key={key} className="flex gap-4">
                <span className="font-display text-2xl text-sun-clay">
                  0{index + 1}
                </span>
                <div>
                  <h3 className="font-medium text-ink">{t(`${key}Title`)}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t(`${key}Body`)}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <div className="relative mt-10 aspect-[16/10] overflow-hidden">
            <Image
              src={montePegoMedia.sell[1] ?? montePegoMedia.hero}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
        <div className="surface-soft p-6 md:p-8">
          <h2 className="font-display text-2xl text-ink">
            {t("valuationTitle")}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{t("disclaimer")}</p>
          <div className="mt-6">
            <ValuationForm />
          </div>
        </div>
      </div>
    </>
  );
}
