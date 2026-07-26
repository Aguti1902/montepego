import { getTranslations, setRequestLocale } from "next-intl/server";
import { SimplePage } from "@/components/layout/simple-page";

type Props = { params: Promise<{ locale: string }> };

export default async function LaCovaPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("LaCova");
  return <SimplePage locale={locale} title={t("title")} intro={t("intro")} />;
}
