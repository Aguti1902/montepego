import { getTranslations, setRequestLocale } from "next-intl/server";
import { SimplePage } from "@/components/layout/simple-page";

type Props = { params: Promise<{ locale: string }> };

export default async function SellPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Sell");

  return (
    <SimplePage locale={locale} title={t("title")} intro={t("intro")}>
      <h2 className="font-display text-2xl">{t("valuationTitle")}</h2>
      <p className="text-sm text-muted-foreground">{t("disclaimer")}</p>
    </SimplePage>
  );
}
