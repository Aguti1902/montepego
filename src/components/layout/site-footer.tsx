import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { siteConfig } from "@/config/site";

export async function SiteFooter() {
  const t = await getTranslations("Footer");
  const legal = await getTranslations("Legal");
  const nav = await getTranslations("Nav");
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 px-4 pb-6">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-[#ebe4d8] shadow-[0_14px_40px_rgba(26,34,44,0.06)]">
        <div className="grid gap-10 px-6 py-12 md:grid-cols-[1.4fr_1fr_1fr] md:px-10">
          <div>
            <Image
              src="/brand/logo.png"
              alt="MontePego Life"
              width={160}
              height={44}
              className="h-10 w-auto object-contain"
            />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {t("tagline")}
            </p>
            <p className="mt-4 text-sm text-muted-foreground">{t("address")}</p>
            <p className="mt-2 text-sm tabular text-ink">
              {siteConfig.contact.phones.join(" · ")}
            </p>
            <a
              className="mt-1 block text-sm text-sea-deep hover:underline"
              href={`mailto:${siteConfig.contact.email}`}
            >
              {siteConfig.contact.email}
            </a>
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-sea-deep">
              {t("explore")}
            </p>
            <Link href="/properties">{nav("properties")}</Link>
            <Link href="/sell">{nav("sell")}</Link>
            <Link href="/services">{nav("services")}</Link>
            <Link href="/la-cova">{nav("laCova")}</Link>
            <Link href="/monte-pego">{nav("montePego")}</Link>
            <Link href="/about">{nav("about")}</Link>
            <Link href="/contact">{nav("contact")}</Link>
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-sea-deep">
              {t("legal")}
            </p>
            <Link href="/legal-notice">{legal("legalNotice")}</Link>
            <Link href="/privacy-policy">{legal("privacy")}</Link>
            <Link href="/cookies-policy">{legal("cookies")}</Link>
            <a
              href={`https://wa.me/${siteConfig.contact.whatsapp.replace("+", "")}`}
              className="mt-4 inline-flex w-fit rounded-full bg-sea-deep px-4 py-2 text-sm text-white hover:bg-[#244872]"
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
            </a>
          </div>
        </div>
        <div className="border-t border-border/70 px-6 py-4 text-center text-xs text-muted-foreground md:px-10">
          © {year} MontePego Life. {t("rights")}.
        </div>
      </div>
    </footer>
  );
}
