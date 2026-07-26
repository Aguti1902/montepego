import { siteConfig } from "@/config/site";
import type { ResolvedProperty } from "@/lib/db/types";
import { absoluteUrl } from "./metadata";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness", "RealEstateAgent"],
    name: siteConfig.name,
    url: absoluteUrl("/"),
    email: siteConfig.contact.email,
    telephone: siteConfig.contact.phones[0],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Avd. Internacional Nº1, Edificio Rosario",
      addressLocality: "Pego",
      postalCode: "03780",
      addressRegion: "Alicante",
      addressCountry: "ES",
    },
    sameAs: [`https://instagram.com/${siteConfig.contact.instagram.replace("@", "")}`],
  };
}

export function breadcrumbJsonLd(
  items: Array<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function propertyJsonLd(property: ResolvedProperty, localePath: string) {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description,
    url: absoluteUrl(localePath),
    datePosted: property.publishedAt?.toISOString(),
    offers: property.priceVisible
      ? {
          "@type": "Offer",
          price: property.price,
          priceCurrency: "EUR",
          availability:
            property.status === "available"
              ? "https://schema.org/InStock"
              : property.status === "sold"
                ? "https://schema.org/SoldOut"
                : "https://schema.org/LimitedAvailability",
        }
      : undefined,
    numberOfRooms: property.bedrooms,
    floorSize:
      property.builtArea != null
        ? {
            "@type": "QuantitativeValue",
            value: property.builtArea,
            unitCode: "MTK",
          }
        : undefined,
    image: property.coverUrl ? absoluteUrl(property.coverUrl) : undefined,
  };
}
