import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/config/site";
import { siteConfig } from "@/config/site";
import { ContactForm } from "@/components/forms/contact-form";
import { PageHero } from "@/components/layout/page-hero";
import { montePegoMedia } from "@/lib/media/site";
import { buildPageMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Contact" });
  return buildPageMetadata({
    locale: locale as Locale,
    title: t("title"),
    description: t("intro"),
    href: { pathname: "/contact" },
  });
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Contact");

  return (
    <>
      <PageHero
        title={t("title")}
        intro={t("intro")}
        image={montePegoMedia.about[2] ?? montePegoMedia.hero}
        eyebrow={t("eyebrow")}
      />
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl text-ink">{t("office")}</h2>
          <p className="mt-4 text-muted-foreground">
            {siteConfig.contact.address}
          </p>
          <p className="mt-3 tabular text-ink">
            {siteConfig.contact.phones.join(" · ")}
          </p>
          <a
            className="mt-2 block text-sea-deep hover:underline"
            href={`mailto:${siteConfig.contact.email}`}
          >
            {siteConfig.contact.email}
          </a>
          <a
            className="mt-4 inline-block text-sm font-medium text-sea-deep hover:underline"
            href={`https://wa.me/${siteConfig.contact.whatsapp.replace("+", "")}`}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp {siteConfig.contact.whatsappDisplay}
          </a>
          <p className="mt-8 text-sm text-muted-foreground">{t("hours")}</p>
        </div>
        <div className="surface-soft p-6 md:p-8">
          <ContactForm />
        </div>
      </div>
    </>
  );
}
