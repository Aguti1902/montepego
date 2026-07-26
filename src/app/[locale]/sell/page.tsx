import { getTranslations, setRequestLocale } from "next-intl/server";
import { SimplePage } from "@/components/layout/simple-page";
import { ValuationForm } from "@/components/forms/valuation-form";

type Props = { params: Promise<{ locale: string }> };

export default async function SellPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Sell");

  return (
    <SimplePage locale={locale} title={t("title")} intro={t("intro")}>
      <ValuationForm />
    </SimplePage>
  );
}
