/**
 * Contrato del borde CRM.
 * El front nunca habla con el CRM: solo sync/server → adaptador → API externa.
 */

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
  source?: string;
};

export type CrmAdapterName =
  | "mock"
  | "ego"
  | "inmovilla"
  | "resales"
  | "optima"
  | "witei";

export type CrmConfig = {
  adapter: CrmAdapterName;
  baseUrl: string;
  apiKey: string;
  timeoutMs: number;
  maxRetries: number;
};

export type CrmPushLeadResult = {
  crmId: string;
  mocked?: boolean;
};

export interface CrmAdapter {
  name: CrmAdapterName;
  /** Descarga cartera desde la API del CRM (o mock). */
  fetchProperties(since?: Date): Promise<RawCrmProperty[]>;
  fetchProperty(crmId: string): Promise<RawCrmProperty | null>;
  /**
   * Empuja un lead al CRM. Obligatorio en el contrato:
   * si el proveedor no lo soporta aún, el adaptador lanza CrmApiError
   * o devuelve un resultado mocked documentado.
   */
  pushLead(lead: LeadPayload): Promise<CrmPushLeadResult>;
}

export class CrmApiError extends Error {
  readonly code: "auth" | "network" | "timeout" | "http" | "parse" | "unsupported";
  readonly status?: number;
  readonly retryable: boolean;

  constructor(
    message: string,
    options: {
      code: CrmApiError["code"];
      status?: number;
      retryable?: boolean;
      cause?: unknown;
    },
  ) {
    super(message, { cause: options.cause });
    this.name = "CrmApiError";
    this.code = options.code;
    this.status = options.status;
    this.retryable = options.retryable ?? false;
  }
}
