import { z } from "zod";
import type { RawCrmProperty } from "./types";

export type SanitizedProperty = {
  crmId: string;
  reference: string;
  status: "available" | "reserved" | "sold" | "draft" | "withdrawn";
  type: "villa" | "apartment" | "plot" | "townhouse" | "commercial";
  price: number;
  bedrooms: number;
  bathrooms: number;
  builtArea: number | null;
  plotArea: number | null;
  terraceArea: number | null;
  yearBuilt: number | null;
  energyRating: string | null;
  latitude: string | null;
  longitude: string | null;
  features: string[];
  title: string;
  description: string;
  photos: Array<{ url: string; sortOrder: number; isCover: boolean }>;
  publishable: boolean;
  warnings: string[];
  crmRaw: unknown;
};

const permissivePropertySchema = z
  .object({
    crmId: z.string().min(1),
    reference: z.string().min(1),
    status: z.unknown().optional(),
    type: z.unknown().optional(),
    price: z.unknown().optional(),
    bedrooms: z.unknown().optional(),
    bathrooms: z.unknown().optional(),
    builtArea: z.unknown().optional(),
    plotArea: z.unknown().optional(),
    terraceArea: z.unknown().optional(),
    yearBuilt: z.unknown().optional(),
    energyRating: z.unknown().optional(),
    latitude: z.unknown().optional(),
    longitude: z.unknown().optional(),
    features: z.unknown().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    photos: z.unknown().optional(),
    raw: z.unknown().optional(),
  })
  .passthrough();

function looksLikeUrl(value: string): boolean {
  return /^https?:\/\//i.test(value.trim()) || value.includes("://");
}

export function parseNumericField(
  value: unknown,
  field: string,
  reference: string,
): { value: number | null; warning?: string } {
  if (value == null || value === "") {
    return { value: null };
  }

  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      return {
        value: null,
        warning: `Ref ${reference}: ${field} no numérico, se ignora`,
      };
    }
    if (value === 0 && (field === "builtArea" || field === "plotArea")) {
      return {
        value: null,
        warning: `Ref ${reference}: ${field} = 0, se ignora`,
      };
    }
    return { value };
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (looksLikeUrl(trimmed) || /[a-zA-Z]/.test(trimmed.replace(/[m²m2\s.,]/gi, ""))) {
      return {
        value: null,
        warning: `Ref ${reference}: ${field} contiene URL o texto no numérico, se ignora`,
      };
    }
    const normalized = trimmed.replace(/[^\d.,-]/g, "").replace(",", ".");
    const num = Number(normalized);
    if (!Number.isFinite(num)) {
      return {
        value: null,
        warning: `Ref ${reference}: ${field} no numérico, se ignora`,
      };
    }
    if (num === 0 && (field === "builtArea" || field === "plotArea")) {
      return {
        value: null,
        warning: `Ref ${reference}: ${field} = 0, se ignora`,
      };
    }
    return { value: num };
  }

  return {
    value: null,
    warning: `Ref ${reference}: ${field} inválido, se ignora`,
  };
}

function parseStatus(value: unknown): SanitizedProperty["status"] {
  const raw = String(value ?? "available").toLowerCase();
  if (raw.includes("sold") || raw.includes("vendid")) return "sold";
  if (raw.includes("reserv")) return "reserved";
  if (raw.includes("withdraw") || raw.includes("retir")) return "withdrawn";
  if (raw.includes("draft") || raw.includes("borrador")) return "draft";
  return "available";
}

function parseType(value: unknown): SanitizedProperty["type"] {
  const raw = String(value ?? "villa").toLowerCase();
  if (raw.includes("apart")) return "apartment";
  if (raw.includes("plot") || raw.includes("parcela") || raw.includes("solar"))
    return "plot";
  if (raw.includes("town") || raw.includes("adosad")) return "townhouse";
  if (raw.includes("commercial") || raw.includes("local")) return "commercial";
  return "villa";
}

function parseFeatures(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map(String).map((v) => v.toLowerCase().replace(/\s+/g, "_"));
}

function parsePhotos(value: unknown): SanitizedProperty["photos"] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item, index) => {
      if (!item || typeof item !== "object") return null;
      const photo = item as { url?: unknown; sortOrder?: unknown; isCover?: unknown };
      if (typeof photo.url !== "string" || !photo.url) return null;
      return {
        url: photo.url,
        sortOrder: typeof photo.sortOrder === "number" ? photo.sortOrder : index,
        isCover: Boolean(photo.isCover) || index === 0,
      };
    })
    .filter((p): p is SanitizedProperty["photos"][number] => p != null);
}

/**
 * Schema Zod permisivo: nunca lanza. Marca campos inválidos en warnings.
 */
export function sanitizeCrmProperty(input: RawCrmProperty): SanitizedProperty {
  const warnings: string[] = [];
  const parsed = permissivePropertySchema.safeParse(input);

  const data = parsed.success
    ? parsed.data
    : {
        crmId: String(input.crmId ?? "unknown"),
        reference: String(input.reference ?? "unknown"),
      };

  if (!parsed.success) {
    warnings.push(
      `Ref ${String(input.reference ?? "?")}: payload parcialmente inválido, se importa lo usable`,
    );
  }

  const reference = String(data.reference);
  const built = parseNumericField(data.builtArea, "builtArea", reference);
  const plot = parseNumericField(data.plotArea, "plotArea", reference);
  const terrace = parseNumericField(data.terraceArea, "terraceArea", reference);
  const year = parseNumericField(data.yearBuilt, "yearBuilt", reference);
  const bedrooms = parseNumericField(data.bedrooms, "bedrooms", reference);
  const bathrooms = parseNumericField(data.bathrooms, "bathrooms", reference);
  const lat = parseNumericField(data.latitude, "latitude", reference);
  const lng = parseNumericField(data.longitude, "longitude", reference);
  const priceParsed = parseNumericField(data.price, "price", reference);

  for (const part of [built, plot, terrace, year, bedrooms, bathrooms, lat, lng, priceParsed]) {
    if (part.warning) warnings.push(part.warning);
  }

  const photos = parsePhotos(data.photos);
  let status = parseStatus(data.status);
  let publishable = true;

  const price = priceParsed.value ?? 0;
  if (price === 0 || priceParsed.value == null) {
    status = "draft";
    publishable = false;
    warnings.push(`Ref ${reference}: price = 0 o falta → draft`);
  }

  if (photos.length === 0) {
    status = "draft";
    publishable = false;
    warnings.push(`Ref ${reference}: faltan fotos → draft`);
  }

  return {
    crmId: String(data.crmId),
    reference,
    status,
    type: parseType(data.type),
    price,
    bedrooms: bedrooms.value ?? 0,
    bathrooms: bathrooms.value ?? 0,
    builtArea: built.value,
    plotArea: plot.value,
    terraceArea: terrace.value,
    yearBuilt: year.value,
    energyRating:
      typeof data.energyRating === "string" ? data.energyRating : null,
    latitude: lat.value != null ? String(lat.value) : null,
    longitude: lng.value != null ? String(lng.value) : null,
    features: parseFeatures(data.features),
    title: data.title?.trim() || `Property ${reference}`,
    description: data.description?.trim() || "",
    photos,
    publishable,
    warnings,
    crmRaw: data.raw ?? input,
  };
}
