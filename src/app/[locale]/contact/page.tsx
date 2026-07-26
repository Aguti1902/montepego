import { getTranslations, setRequestLocale } from "next-intl/server";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
      <form className="space-y-4 border border-border bg-card p-6">
        <div className="space-y-2">
          <Label htmlFor="name">{t("name")}</Label>
          <Input id="name" name="name" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">{t("email")}</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">{t("phone")}</Label>
          <Input id="phone" name="phone" type="tel" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="message">{t("message")}</Label>
          <Textarea id="message" name="message" required />
        </div>
        <Button type="submit">{t("send")}</Button>
      </form>
    </div>
  );
}
