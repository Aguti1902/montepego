"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/lib/i18n/navigation";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/properties" as const, key: "properties" as const },
  { href: "/sell" as const, key: "sell" as const },
  { href: "/about" as const, key: "about" as const },
  { href: "/services" as const, key: "services" as const },
  { href: "/la-cova" as const, key: "laCova" as const },
  { href: "/monte-pego" as const, key: "montePego" as const },
  { href: "/contact" as const, key: "contact" as const },
];

export function SiteHeader() {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();

  return (
    <header className="border-b border-border/80 bg-limestone/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4">
        <Link href="/" className="font-display text-2xl tracking-tight text-sea-deep">
          MontePego Life
        </Link>
        <nav className="hidden items-center gap-5 lg:flex" aria-label="Primary">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm text-ink/80 transition-colors hover:text-sea-deep",
                pathname.startsWith(item.href) && "text-sea-deep",
              )}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 text-xs tabular text-muted-foreground">
          {siteConfig.locales.map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => {
                router.replace(
                  // next-intl tipa pathnames dinámicos; el pathname actual ya incluye el slug resuelto
                  pathname as "/",
                  { locale: code },
                );
              }}
              className={cn(
                "uppercase tracking-wide hover:text-sea-deep",
                code === locale && "font-semibold text-sea-deep",
              )}
              lang={code}
            >
              {code}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
