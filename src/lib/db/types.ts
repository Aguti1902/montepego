import type { FeatureSlug } from "@/config/site";

export type PropertyStatus =
  | "available"
  | "reserved"
  | "sold"
  | "draft"
  | "withdrawn";

export type PropertyType =
  | "villa"
  | "apartment"
  | "plot"
  | "townhouse"
  | "commercial";

export type ResolvedProperty = {
  id: string;
  crmId: string | null;
  reference: string;
  slug: string;
  status: PropertyStatus;
  type: PropertyType;
  price: number;
  priceVisible: boolean;
  bedrooms: number;
  bathrooms: number;
  builtArea: number | null;
  plotArea: number | null;
  terraceArea: number | null;
  yearBuilt: number | null;
  energyRating: string | null;
  latitude: string | null;
  longitude: string | null;
  locationPrecision: "exact" | "approximate" | "hidden";
  features: FeatureSlug[];
  elevation: number | null;
  orientation: string | null;
  viewRelation: string | null;
  isFeatured: boolean;
  publishedAt: Date | null;
  soldAt: Date | null;
  overriddenFields: string[];
  title: string;
  description: string;
  seoTitle: string | null;
  seoDescription: string | null;
  coverUrl: string | null;
  media: ResolvedMedia[];
};

export type ResolvedMedia = {
  id: string;
  kind: "photo" | "floorplan" | "video" | "tour_360" | "document";
  storagePath: string;
  width: number | null;
  height: number | null;
  sortOrder: number;
  alt: string;
  isCover: boolean;
  aiRoomType: string | null;
};

export type PropertyListFilters = {
  locale: string;
  status?: PropertyStatus[];
  type?: PropertyType[];
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  features?: string[];
  featuredOnly?: boolean;
  includeSold?: boolean;
  q?: string;
  page?: number;
  pageSize?: number;
  sort?: "price_asc" | "price_desc" | "newest" | "oldest";
};

export type LeadInput = {
  name: string;
  email: string;
  phone?: string;
  locale: string;
  message?: string;
  source?: "form" | "whatsapp" | "valuation" | "property_alert" | "portal";
  propertyId?: string;
  budgetMin?: number;
  budgetMax?: number;
  preferences?: Record<string, unknown>;
};

export type ValuationInput = {
  name: string;
  email: string;
  phone?: string;
  address: string;
  propertyType: PropertyType;
  bedrooms?: number;
  builtArea?: number;
  plotArea?: number;
  condition?: string;
  photos?: string[];
};
