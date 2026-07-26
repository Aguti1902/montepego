import { getTranslations, setRequestLocale } from "next-intl/server";
import { SimplePage } from "@/components/layout/simple-page";

type Props = { params: Promise<{ locale: string }> };

export default async function CookiesPolicyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Legal");
  return (
    <SimplePage
      locale={locale}
      title={t("cookies")}
      intro="Information about cookies used for analytics and essential site operation."
    />
  );
}
