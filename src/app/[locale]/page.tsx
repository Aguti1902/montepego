import Image from "next/image";
import { Suspense } from "react";
import {
  ShieldCheck,
  MapPinned,
  Languages,
  Home,
  Sparkles,
  Star,
} from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import type { Locale } from "@/config/site";
import { buttonVariants } from "@/components/ui/button";
import { PropertyCard } from "@/components/property/property-card";
import { PropertyFilters } from "@/components/property/property-filters";
import { ConversationalSearch } from "@/components/property/conversational-search";
import { listProperties } from "@/lib/db/queries/properties";
import { montePegoMedia } from "@/lib/media/site";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { cn } from "@/lib/utils";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function num(value: string | string[] | undefined) {
  if (typeof value !== "string" || value === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

const advantageIcons = [MapPinned, ShieldCheck, Languages, Home] as const;
const advantageKeys = ["local", "care", "languages", "life"] as const;
const reviewKeys = ["one", "two", "three"] as const;
const stepKeys = ["discover", "visit", "settle"] as const;

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  return buildPageMetadata({
    locale: locale as Locale,
    title: t("homeTitle"),
    description: t("homeDescription"),
    href: { pathname: "/" },
  });
}

export default async function HomePage({ params, searchParams }: Props) {
  const { locale } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("Home");
  const tProps = await getTranslations("Properties");

  const { items: properties, total } = await listProperties({
    locale,
    minPrice: num(sp.minPrice),
    maxPrice: num(sp.maxPrice),
    bedrooms: num(sp.bedrooms),
    type:
      typeof sp.type === "string"
        ? [sp.type as "villa" | "apartment" | "plot" | "townhouse" | "commercial"]
        : undefined,
    sort:
      typeof sp.sort === "string"
        ? (sp.sort as "price_asc" | "price_desc" | "newest" | "oldest")
        : "newest",
    q: typeof sp.q === "string" ? sp.q : undefined,
    pageSize: 12,
  });

  return (
    <>
      <section className="relative isolate min-h-[86vh] overflow-hidden md:min-h-[90vh]">
        <Image
          src={montePegoMedia.hero}
          alt=""
          fill
          priority
          className="animate-hero-zoom object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/45 to-transparent" />
        <div className="relative mx-auto flex min-h-[86vh] max-w-6xl flex-col justify-end px-4 pb-16 pt-28 md:min-h-[90vh]">
          <p className="animate-fade-up font-display text-5xl leading-[0.95] text-white md:text-7xl lg:text-8xl">
            MontePego Life
          </p>
          <h1 className="animate-fade-up-delay mt-5 max-w-xl text-lg text-white/95 md:text-2xl">
            {t("headline")}
          </h1>
          <p className="animate-fade-up-delay mt-3 max-w-lg text-base text-white/80">
            {t("subhead")}
          </p>
          <div className="animate-fade-up-delay mt-8 flex flex-wrap gap-3">
            <Link
              href="/properties"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-white text-sea-deep hover:bg-limestone",
              )}
            >
              {t("searchCta")}
            </Link>
            <Link
              href="/sell"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "border-white/70 bg-transparent text-white hover:bg-white/10",
              )}
            >
              {t("valuationCta")}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sun-clay">
            {t("advantagesEyebrow")}
          </p>
          <h2 className="font-display mt-2 text-3xl text-ink md:text-4xl">
            {t("advantagesTitle")}
          </h2>
          <p className="mt-3 text-muted-foreground">{t("advantagesBody")}</p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {advantageKeys.map((key, index) => {
            const Icon = advantageIcons[index];
            return (
              <div
                key={key}
                className="rounded-[1.5rem] bg-white/70 p-6 shadow-[0_12px_36px_rgba(26,34,44,0.05)] ring-1 ring-black/5"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sea-deep/10 text-sea-deep">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-4 font-display text-xl text-ink">
                  {t(`adv_${key}_title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t(`adv_${key}_body`)}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-8">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl text-ink md:text-4xl">
            {t("aiSearchTitle")}
          </h2>
          <p className="mt-3 text-muted-foreground">{t("aiSearchBody")}</p>
        </div>
        <div className="surface-soft mt-6 p-5 md:p-7">
          <div className="mb-4 flex items-center gap-2 text-sm text-sea-deep">
            <Sparkles className="h-4 w-4" aria-hidden />
            {t("aiSearchHint")}
          </div>
          <ConversationalSearch />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl text-ink md:text-4xl">
              {t("catalogTitle")}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("catalogCount", { count: total })}
            </p>
          </div>
          <Link
            href="/properties"
            className="rounded-full bg-limestone px-4 py-2 text-sm font-medium text-sea-deep hover:bg-[#e7dfd0]"
          >
            {t("viewAll")} →
          </Link>
        </div>
        <div className="mt-6">
          <Suspense fallback={null}>
            <PropertyFilters />
          </Suspense>
        </div>
        {properties.length === 0 ? (
          <p className="mt-10 text-muted-foreground">{tProps("noResults")}</p>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                locale={locale}
              />
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sun-clay">
            {t("reviewsEyebrow")}
          </p>
          <h2 className="font-display mt-2 text-3xl text-ink md:text-4xl">
            {t("reviewsTitle")}
          </h2>
          <p className="mt-3 text-muted-foreground">{t("reviewsBody")}</p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {reviewKeys.map((key) => (
            <blockquote
              key={key}
              className="flex flex-col rounded-[1.75rem] bg-gradient-to-br from-white to-limestone/60 p-6 shadow-[0_12px_36px_rgba(26,34,44,0.05)] ring-1 ring-black/5"
            >
              <div className="flex gap-1 text-sun-clay" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-ink/90">
                “{t(`review_${key}_quote`)}”
              </p>
              <footer className="mt-5 border-t border-border/70 pt-4">
                <p className="text-sm font-medium text-ink">
                  {t(`review_${key}_name`)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t(`review_${key}_meta`)}
                </p>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="rounded-[2rem] bg-sea-deep px-6 py-12 text-white md:px-12">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sun-clay">
            {t("stepsEyebrow")}
          </p>
          <h2 className="font-display mt-2 text-3xl md:text-4xl">
            {t("stepsTitle")}
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {stepKeys.map((key, index) => (
              <div key={key}>
                <p className="font-display text-4xl text-white/25">
                  0{index + 1}
                </p>
                <h3 className="mt-2 text-lg font-medium">
                  {t(`step_${key}_title`)}
                </h3>
                <p className="mt-2 text-sm text-white/75">
                  {t(`step_${key}_body`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={montePegoMedia.residential[0] ?? montePegoMedia.hero}
            alt=""
            fill
            className="object-cover opacity-20"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-limestone/55 to-transparent" />
        </div>
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-20 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sun-clay">
              {t("lifeEyebrow")}
            </p>
            <h2 className="font-display mt-3 text-3xl text-ink md:text-4xl">
              {t("moreThanAgency")}
            </h2>
            <p className="mt-4 text-muted-foreground">{t("moreThanAgencyBody")}</p>
            <div className="mt-6">
              <Link href="/services" className={buttonVariants()}>
                {t("servicesCta")}
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-[1.5rem] bg-white/80 p-6 shadow-sm ring-1 ring-black/5">
              <h3 className="font-display text-2xl text-ink">{t("valuationCta")}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t("valuationBody")}</p>
              <Link
                href="/sell"
                className="mt-3 inline-block text-sm font-medium text-sea-deep hover:underline"
              >
                {t("valuationCta")} →
              </Link>
            </div>
            <div className="rounded-[1.5rem] bg-white/80 p-6 shadow-sm ring-1 ring-black/5">
              <h3 className="font-display text-2xl text-ink">{t("laCovaTitle")}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t("laCovaBody")}</p>
              <Link
                href="/la-cova"
                className="mt-3 inline-block text-sm font-medium text-sea-deep hover:underline"
              >
                {t("laCovaTitle")} →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
