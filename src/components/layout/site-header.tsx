"use client";

import Image from "next/image";
import { ChevronDown, Menu, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
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

const localeLabels: Record<string, string> = {
  en: "English",
  nl: "Nederlands",
  de: "Deutsch",
  fr: "Français",
  pl: "Polski",
  es: "Español",
};

export function SiteHeader() {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!langRef.current?.contains(event.target as Node)) {
        setLangOpen(false);
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setLangOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-40">
      <div className="pointer-events-auto mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 pt-4">
        <div className="flex w-full items-center justify-between gap-3 rounded-full border border-white/50 bg-white/85 px-3 py-2 shadow-[0_10px_40px_rgba(26,34,44,0.1)] backdrop-blur-xl md:px-4">
          <Link href="/" className="relative flex h-10 w-[150px] shrink-0 items-center">
            <Image
              src="/brand/logo.png"
              alt="MontePego Life"
              width={150}
              height={40}
              className="h-9 w-auto object-contain"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Primary">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-2.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.06em] text-ink/65 transition-colors hover:bg-limestone hover:text-sea-deep",
                  pathname.startsWith(item.href) && "bg-limestone text-sea-deep",
                )}
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="relative" ref={langRef}>
              <button
                type="button"
                onClick={() => setLangOpen((value) => !value)}
                className="inline-flex h-9 items-center gap-1.5 rounded-full bg-limestone/90 px-3 text-xs font-semibold uppercase tracking-wide text-sea-deep"
                aria-expanded={langOpen}
                aria-haspopup="listbox"
              >
                {locale}
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 transition",
                    langOpen && "rotate-180",
                  )}
                />
              </button>
              {langOpen ? (
                <ul
                  role="listbox"
                  className="absolute right-0 z-50 mt-2 min-w-[10.5rem] overflow-hidden rounded-2xl border border-border/80 bg-white py-1 shadow-[0_16px_40px_rgba(26,34,44,0.14)]"
                >
                  {siteConfig.locales.map((code) => (
                    <li key={code} role="option" aria-selected={code === locale}>
                      <button
                        type="button"
                        lang={code}
                        onClick={() => {
                          router.replace(pathname as "/", { locale: code });
                          setLangOpen(false);
                        }}
                        className={cn(
                          "flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-limestone",
                          code === locale && "bg-limestone/70 font-semibold text-sea-deep",
                        )}
                      >
                        <span>{localeLabels[code] ?? code}</span>
                        <span className="text-[11px] uppercase text-muted-foreground">
                          {code}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-sea-deep text-white xl:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label="Menu"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {open ? (
        <nav className="pointer-events-auto mx-auto mt-2 max-w-6xl px-4 xl:hidden">
          <div className="rounded-[1.25rem] border border-white/70 bg-white/95 px-3 py-3 shadow-lg backdrop-blur-xl">
            <div className="flex flex-col gap-0.5">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-sm font-medium text-ink hover:bg-limestone"
                >
                  {t(item.key)}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
