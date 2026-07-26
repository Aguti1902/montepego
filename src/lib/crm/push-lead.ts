import { markLeadCrmPushed } from "@/lib/db/queries/leads";
import { getCrmAdapter } from "./index";
import { CrmApiError, type LeadPayload } from "./types";

export type PushLeadOutcome = {
  ok: boolean;
  crmId?: string;
  mocked?: boolean;
  skipped?: boolean;
  error?: string;
};

/**
 * Empuja un lead al CRM activo y marca crm_pushed_at.
 * Nunca tumba el flujo web: errores se registran y se devuelven.
 */
export async function pushLeadToCrm(
  leadId: string,
  payload: LeadPayload,
): Promise<PushLeadOutcome> {
  const adapter = getCrmAdapter();

  try {
    const result = await adapter.pushLead(payload);
    await markLeadCrmPushed(leadId);

    return {
      ok: true,
      crmId: result.crmId,
      mocked: result.mocked ?? adapter.name === "mock",
    };
  } catch (error) {
    if (error instanceof CrmApiError && error.code === "unsupported") {
      console.info(
        `[crm] pushLead no soportado en ${adapter.name}: ${error.message}`,
      );
      return { ok: false, skipped: true, error: error.message };
    }

    const message =
      error instanceof Error ? error.message : "Error desconocido al empujar lead";
    console.error("[crm] pushLead falló", message);
    return { ok: false, error: message };
  }
}
