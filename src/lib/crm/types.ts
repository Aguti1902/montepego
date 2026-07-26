export type RawCrmProperty = {
  crmId: string;
  reference: string;
  status?: string;
  type?: string;
  price?: unknown;
  bedrooms?: unknown;
  bathrooms?: unknown;
  builtArea?: unknown;
  plotArea?: unknown;
  terraceArea?: unknown;
  yearBuilt?: unknown;
  energyRating?: unknown;
  latitude?: unknown;
  longitude?: unknown;
  features?: unknown;
  title?: string;
  description?: string;
  photos?: Array<{
    url: string;
    sortOrder?: number;
    isCover?: boolean;
  }>;
  updatedAt?: string;
  raw?: unknown;
};

export type LeadPayload = {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  propertyCrmId?: string;
  locale?: string;
};

export interface CrmAdapter {
  name: string;
  fetchProperties(since?: Date): Promise<RawCrmProperty[]>;
  fetchProperty(crmId: string): Promise<RawCrmProperty | null>;
  pushLead?(lead: LeadPayload): Promise<{ crmId: string }>;
}
