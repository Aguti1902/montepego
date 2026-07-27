import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/config/site";
import { ElevationStrip } from "@/components/property/elevation-strip";
import { PropertyCard } from "@/components/property/property-card";
import { PropertyFeatures } from "@/components/property/property-features";
import { PropertyFloorplan } from "@/components/property/property-floorplan";
import { PropertyGallery } from "@/components/property/property-gallery";
import { PropertyMap } from "@/components/property/property-map";
import { PropertySpecs } from "@/components/property/property-specs";
import { Badge } from "@/components/ui/badge";
import { ContactForm } from "@/components/forms/contact-form";
import { JsonLd } from "@/components/seo/json-ld";
import {
  getPropertyBySlug,
  getSimilarProperties,
} from "@/lib/db/queries/properties";
import { formatPrice } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { buildPageMetadata, absoluteUrl } from "@/lib/seo/metadata";
import { breadcrumbJsonLd, propertyJsonLd } from "@/lib/seo/jsonld";
import { getPathname } from "@/lib/i18n/navigation";
import { seedProperties } from "@/lib/db/seed-data";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  return seedProperties.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const property = await getPropertyBySlug(slug, locale);
  if (!property) return {};
  return buildPageMetadata({
    locale: locale as Locale,
    title: property.seoTitle ?? property.title,
    description: property.seoDescription ?? property.description.slice(0, 155),
    href: { pathname: "/property/[slug]", params: { slug } },
    images: [
      absoluteUrl(`/api/og/property?slug=${encodeURIComponent(slug)}`),
    ],
  });
}

export default async function PropertyPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Property");
  const tp = await getTranslations("Properties");
  const tt = await getTranslations("PropertyTypes");

  const property = await getPropertyBySlug(slug, locale);
  if (!property) notFound();

  const similar = await getSimilarProperties(property, locale, 3);
  const path = getPathname({
    locale,
    href: { pathname: "/property/[slug]", params: { slug } },
  });

  return (
    <div className="pb-16 pt-24">
      <div className="mx-auto max-w-6xl px-4">
        <JsonLd data={propertyJsonLd(property, path)} />
        <JsonLd
          data={breadcrumbJsonLd([
            { name: "Home", path: `/${locale}` },
            { name: tp("title"), path: `/${locale}/properties` },
            { name: property.title, path },
          ])}
        />

        <div className="page-surface overflow-hidden">
          <PropertyGallery media={property.media} title={property.title} />

          <div className="p-5 md:p-8 lg:p-10">
            <div className="grid gap-10 lg:grid-cols-[1fr_320px] lg:items-start">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-sm uppercase tracking-wide text-muted-foreground">
                    {tp("ref")} {property.reference}
                  </p>
                  <span className="rounded-full bg-limestone px-3 py-1 text-xs font-medium uppercase tracking-wide text-sea-deep">
                    {tt(property.type)}
                  </span>
                  {property.status === "sold" && (
                    <Badge variant="sold">{tp("sold")}</Badge>
                  )}
                  {property.status === "reserved" && (
                    <Badge variant="reserved">{tp("reserved")}</Badge>
                  )}
                </div>
                <h1 className="mt-2 font-display text-4xl text-ink">
                  {property.title}
                </h1>
                {property.priceVisible ? (
                  <p className="mt-3 tabular text-2xl text-sea-deep">
                    {formatPrice(property.price, locale)}
                  </p>
                ) : null}
                <ElevationStrip
                  className="mt-4"
                  elevation={property.elevation}
                  orientation={property.orientation}
                  viewRelation={property.viewRelation}
                />
                <PropertySpecs
                  property={property}
                  locale={locale}
                  className="mt-10"
                />
                <h2 className="mt-10 font-display text-2xl">
                  {t("description")}
                </h2>
                <p className="mt-3 max-w-2xl leading-relaxed text-foreground/90">
                  {property.description}
                </p>
                <PropertyFeatures property={property} className="mt-8" />
                <PropertyFloorplan media={property.media} />
                <h2 className="mt-10 font-display text-2xl">{t("location")}</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t("locationHint")}
                </p>
                <div className="mt-4 overflow-hidden rounded-2xl ring-1 ring-black/5">
                  <PropertyMap
                    latitude={property.latitude}
                    longitude={property.longitude}
                    precision={property.locationPrecision}
                    label={property.title}
                  />
                </div>
              </div>

              <aside className="h-fit rounded-[1.25rem] bg-white/90 p-5 ring-1 ring-black/[0.04] lg:sticky lg:top-24">
                <PropertySpecs
                  property={property}
                  locale={locale}
                  compact
                  className="mb-6 lg:hidden"
                />
                <h2 className="mb-4 font-display text-xl">{t("contact")}</h2>
                <ContactForm
                  propertyId={
                    property.id.startsWith("seed-") ? undefined : property.id
                  }
                />
                <a
                  className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-full bg-[#25D366] px-4 text-sm font-medium text-white"
                  href={`https://wa.me/${siteConfig.contact.whatsapp.replace("+", "")}?text=${encodeURIComponent(`Ref ${property.reference}`)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t("whatsapp")}
                </a>
              </aside>
            </div>
          </div>
        </div>

        {similar.length > 0 ? (
          <section className="mt-16">
            <h2 className="font-display text-3xl">{t("similar")}</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((item) => (
                <PropertyCard key={item.id} property={item} locale={locale} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
