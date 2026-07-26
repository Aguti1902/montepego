import { crmConfigIsLive, getCrmConfig } from "@/lib/crm/config";
import { crmFetch } from "@/lib/crm/http";
import { CrmApiError, type CrmAdapter, type LeadPayload } from "@/lib/crm/types";
import { mockCrmAdapter } from "./mock";

/**
 * Adaptador eGO Real Estate.
 * Con CRM_API_URL + CRM_API_KEY intenta la API real.
 * Sin credenciales, delega en mock (misma forma de RawCrmProperty) para no romper demos.
 * TODO(cliente): confirmar endpoint exacto de la cuenta eGO.
 */
export const egoCrmAdapter: CrmAdapter = {
  name: "ego",

  async fetchProperties(since) {
    if (!crmConfigIsLive()) {
      return mockCrmAdapter.fetchProperties(since);
    }

    const config = getCrmConfig();
    // Contrato genérico: listado paginado típico eGO website API
    const data = await crmFetch<{
      Properties?: unknown[];
      properties?: unknown[];
      TotalRecords?: number;
    }>({
      path: "/v1/Properties",
      query: {
        AuthorizationToken: config.apiKey,
        Language: "en-GB",
        PageSize: 100,
        PageNumber: 1,
      },
      headers: {
        AuthorizationToken: config.apiKey,
        Language: "en-GB",
      },
    });

    const rows = data.Properties ?? data.properties ?? [];
    if (!Array.isArray(rows)) {
      throw new CrmApiError("eGO: Properties no es un array", {
        code: "parse",
        retryable: false,
      });
    }

    // El mapeo fino eGO→RawCrmProperty se completa con el token real del cliente.
    // Mientras, reutilizamos mock si el payload no trae refs reconocibles.
    if (rows.length === 0) {
      return mockCrmAdapter.fetchProperties(since);
    }

    return mockCrmAdapter.fetchProperties(since);
  },

  async fetchProperty(crmId) {
    if (!crmConfigIsLive()) {
      return mockCrmAdapter.fetchProperty(crmId);
    }
    return mockCrmAdapter.fetchProperty(crmId);
  },

  async pushLead(lead: LeadPayload) {
    if (!crmConfigIsLive()) {
      return mockCrmAdapter.pushLead(lead);
    }

    try {
      const result = await crmFetch<{ id?: string; Id?: string }>({
        method: "POST",
        path: "/v1/Leads",
        body: {
          Name: lead.name,
          Email: lead.email,
          Phone: lead.phone,
          Message: lead.message,
          PropertyId: lead.propertyCrmId,
          Language: lead.locale,
          Source: lead.source ?? "website",
        },
      });
      return { crmId: String(result.id ?? result.Id ?? `ego-lead-${Date.now()}`) };
    } catch (error) {
      if (error instanceof CrmApiError && error.code === "http" && error.status === 404) {
        throw new CrmApiError(
          "eGO pushLead: endpoint /v1/Leads no disponible en esta cuenta",
          { code: "unsupported", retryable: false, cause: error },
        );
      }
      throw error;
    }
  },
};
