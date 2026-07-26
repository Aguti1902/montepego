import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/config/site";
import { SimplePage } from "@/components/layout/simple-page";
import { buildPageMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ locale: string }> };

const faqs = [
  {
    q: "What is the climate like in Monte Pego?",
    a: "Monte Pego enjoys a mild Mediterranean climate, with warm summers and gentle winters, between the Segària mountains and the Pego marshlands.",
  },
  {
    q: "How do I get to Monte Pego?",
    a: "Alicante and Valencia airports are the usual gateways. From there it is about an hour by car to the residencial, inland from Denia and Oliva.",
  },
  {
    q: "What services are available inside the residencial?",
    a: "Residents have a service centre, parcel reception, 24h security and Gastrobar La Cova, in addition to the estate agency.",
  },
  {
    q: "Is Monte Pego suitable as a second home?",
    a: "Yes. Many owners are from northern Europe and use their villa for longer stays in spring and autumn as well as summer.",
  },
];

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
    <SimplePage locale={locale} title={t("title")} intro={t("intro")}>
      <div className="space-y-6">
        {faqs.map((item) => (
          <section key={item.q}>
            <h2 className="font-display text-2xl text-ink">{item.q}</h2>
            <p className="mt-2 text-muted-foreground">{item.a}</p>
          </section>
        ))}
      </div>
    </SimplePage>
  );
}
