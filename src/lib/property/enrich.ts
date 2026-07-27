import type { FeatureSlug } from "@/config/site";
import type { SeedProperty } from "@/lib/db/seed-data";

const FEATURE_LABELS: Record<FeatureSlug, { en: string; es: string }> = {
  pool: { en: "private pool", es: "piscina privada" },
  sea_view: { en: "sea views", es: "vistas al mar" },
  mountain_view: { en: "mountain views", es: "vistas a la montaña" },
  garage: { en: "garage", es: "garaje" },
  guest_apartment: { en: "guest apartment", es: "apartamento de invitados" },
  terrace: { en: "terraces", es: "terrazas" },
  garden: { en: "garden", es: "jardín" },
  air_conditioning: { en: "air conditioning", es: "aire acondicionado" },
  heating: { en: "heating", es: "calefacción" },
  fireplace: { en: "fireplace", es: "chimenea" },
  solar: { en: "solar panels", es: "placas solares" },
  renovated: { en: "recently renovated", es: "recientemente reformada" },
  furnished: { en: "furnished", es: "amueblada" },
  alarm: { en: "alarm system", es: "alarma" },
};

const TYPE_LABELS: Record<
  SeedProperty["type"],
  { en: string; es: string }
> = {
  villa: { en: "villa", es: "villa" },
  apartment: { en: "apartment", es: "apartamento" },
  plot: { en: "plot", es: "parcela" },
  townhouse: { en: "townhouse", es: "casa adosada" },
  commercial: { en: "commercial property", es: "local comercial" },
};

export function derivePropertyExtras(seed: SeedProperty) {
  const refNum = Number.parseInt(seed.reference, 10) || 1500;

  return {
    terraceArea:
      seed.terraceArea ??
      (seed.builtArea ? Math.round(seed.builtArea * 0.18) : null),
    yearBuilt: seed.yearBuilt ?? 1998 + (refNum % 22),
    energyRating:
      seed.energyRating ?? (["D", "E", "F", "G"] as const)[refNum % 4],
  };
}

function joinList(items: string[], locale: string): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0]!;
  const conj = locale === "es" ? " y " : " and ";
  return `${items.slice(0, -1).join(", ")}${conj}${items.at(-1)}`;
}

export function buildSeedDescription(seed: SeedProperty, locale: string): string {
  const extras = derivePropertyExtras(seed);
  const isEs = locale === "es";
  const type = TYPE_LABELS[seed.type][isEs ? "es" : "en"];
  const features = seed.features.map(
    (slug) => FEATURE_LABELS[slug][isEs ? "es" : "en"],
  );

  const parts: string[] = [];

  if (isEs) {
    parts.push(
      `${type.charAt(0).toUpperCase() + type.slice(1)} de referencia ${seed.reference} en Monte Pego, a ${seed.elevation} m de cota, con orientación ${seed.orientation.toLowerCase()} y ${seed.viewRelation}.`,
    );
    if (seed.bedrooms > 0) {
      parts.push(
        `Dispone de ${seed.bedrooms} dormitorios y ${seed.bathrooms} baños.`,
      );
    }
    if (seed.builtArea != null) {
      parts.push(
        `Superficie construida de ${seed.builtArea} m²${seed.plotArea != null ? ` sobre una parcela de ${seed.plotArea} m²` : ""}${extras.terraceArea != null ? `, con ${extras.terraceArea} m² de terraza` : ""}.`,
      );
    } else if (seed.plotArea != null) {
      parts.push(`Parcela de ${seed.plotArea} m².`);
    }
    if (extras.yearBuilt != null) {
      parts.push(
        `Construcción de ${extras.yearBuilt}${extras.energyRating != null ? ` · certificado energético ${extras.energyRating}` : ""}.`,
      );
    }
    if (features.length > 0) {
      parts.push(`Destaca por ${joinList(features, locale)}.`);
    }
    parts.push(
      "Ubicación privilegiada en la urbanización residencial de Monte Pego, con acceso a servicios de recepción, seguridad 24 h, paquetería y La Cova gastrobar.",
    );
    parts.push(
      "MontePego Life acompaña la visita, la negociación y el proceso hasta notaría con conocimiento local y trato personal.",
    );
  } else {
    parts.push(
      `Reference ${seed.reference}: a ${type} in Monte Pego at ${seed.elevation} m elevation, facing ${seed.orientation.toLowerCase()} with ${seed.viewRelation}.`,
    );
    if (seed.bedrooms > 0) {
      parts.push(
        `${seed.bedrooms} bedrooms and ${seed.bathrooms} bathrooms.`,
      );
    }
    if (seed.builtArea != null) {
      parts.push(
        `${seed.builtArea} m² built${seed.plotArea != null ? ` on a ${seed.plotArea} m² plot` : ""}${extras.terraceArea != null ? `, plus ${extras.terraceArea} m² of terrace` : ""}.`,
      );
    } else if (seed.plotArea != null) {
      parts.push(`${seed.plotArea} m² plot.`);
    }
    if (extras.yearBuilt != null) {
      parts.push(
        `Built in ${extras.yearBuilt}${extras.energyRating != null ? ` · energy rating ${extras.energyRating}` : ""}.`,
      );
    }
    if (features.length > 0) {
      parts.push(`Highlights include ${joinList(features, locale)}.`);
    }
    parts.push(
      "Set within the Monte Pego residencial with reception, 24h security, parcel service and La Cova gastrobar.",
    );
    parts.push(
      "MontePego Life supports viewings, negotiation and completion with local expertise.",
    );
  }

  return parts.join(" ");
}
