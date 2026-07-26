import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { PropertyCard } from "@/components/property/property-card";
import { seedProperties } from "@/lib/db/seed-data";
import { cn } from "@/lib/utils";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Home");

  const featured = seedProperties
    .filter((p) => p.isFeatured && p.status === "available")
    .slice(0, 6);

  return (
    <>
      <section className="relative isolate min-h-[78vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(120deg, rgba(9,77,136,0.55), rgba(27,34,41,0.35)), url('/placeholders/hero-monte-pego.svg')",
          }}
        />
        <div className="relative mx-auto flex min-h-[78vh] max-w-6xl flex-col justify-end px-4 pb-16 pt-28">
          <p className="font-display text-5xl leading-tight text-white md:text-6xl lg:text-7xl">
            MontePego Life
          </p>
          <h1 className="mt-4 max-w-2xl text-xl text-white/95 md:text-2xl">
            {t("headline")}
          </h1>
          <p className="mt-3 max-w-xl text-base text-white/85">{t("subhead")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
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
        <h2 className="font-display text-3xl text-ink">{t("featured")}</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((property) => (
            <PropertyCard
              key={property.reference}
              property={property}
              locale={locale}
            />
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="font-display text-3xl text-ink">
              {t("moreThanAgency")}
            </h2>
            <p className="mt-4 text-muted-foreground">{t("moreThanAgencyBody")}</p>
            <div className="mt-6">
              <Link
                href="/services"
                className="text-sm font-medium text-sea-deep hover:underline"
              >
                {t("searchCta")} →
              </Link>
            </div>
          </div>
          <div className="border-l-2 border-rosemary/50 pl-6">
            <h3 className="font-display text-2xl text-ink">{t("valuationCta")}</h3>
            <p className="mt-3 text-muted-foreground">{t("valuationBody")}</p>
            <div className="mt-5">
              <Link href="/sell" className={buttonVariants()}>
                {t("valuationCta")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
