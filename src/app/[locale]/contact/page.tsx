import { getTranslations, setRequestLocale } from "next-intl/server";
import { siteConfig } from "@/config/site";
import { ContactForm } from "@/components/forms/contact-form";

type Props = { params: Promise<{ locale: string }> };

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Contact");

  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 lg:grid-cols-2">
      <div>
        <h1 className="font-display text-4xl text-ink">{t("title")}</h1>
        <p className="mt-4 text-muted-foreground">{siteConfig.contact.address}</p>
        <p className="mt-2 tabular">{siteConfig.contact.phones.join(" · ")}</p>
        <a
          className="mt-2 block text-sea-deep hover:underline"
          href={`mailto:${siteConfig.contact.email}`}
        >
          {siteConfig.contact.email}
        </a>
      </div>
      <div className="border border-border bg-card p-6">
        <ContactForm />
      </div>
    </div>
  );
}
