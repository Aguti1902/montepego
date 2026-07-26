import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { siteConfig } from "@/config/site";

export async function SiteFooter() {
  const t = await getTranslations("Footer");
  const legal = await getTranslations("Legal");
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-border bg-[#e6e0d6]">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:flex-row md:justify-between">
        <div>
          <p className="font-display text-xl text-sea-deep">MontePego Life</p>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            {t("address")}
          </p>
          <p className="mt-2 text-sm tabular">
            {siteConfig.contact.phones.join(" · ")}
          </p>
          <a
            className="text-sm text-sea-deep hover:underline"
            href={`mailto:${siteConfig.contact.email}`}
          >
            {siteConfig.contact.email}
          </a>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <Link href="/legal-notice">{legal("legalNotice")}</Link>
          <Link href="/privacy-policy">{legal("privacy")}</Link>
          <Link href="/cookies-policy">{legal("cookies")}</Link>
        </div>
      </div>
      <div className="border-t border-border/70 px-4 py-4 text-center text-xs text-muted-foreground">
        © {year} MontePego Life. {t("rights")}.
      </div>
    </footer>
  );
}
