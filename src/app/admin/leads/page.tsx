import { LeadManager } from "@/components/admin/lead-manager";
import { AdminPageHeader, AdminStatPill, adminToneBox } from "@/components/admin/admin-shell";
import { cn } from "@/lib/utils";
import { listLeads } from "@/lib/db/queries/leads";

const statusLabel: Record<string, string> = {
  new: "Nuevo",
  contacted: "Contactado",
  qualified: "Cualificado",
  visiting: "Visita",
  closed: "Cerrado",
  lost: "Perdido",
};

const sourceLabel: Record<string, string> = {
  form: "Formulario",
  whatsapp: "WhatsApp",
  valuation: "Valorador",
  property_alert: "Alerta",
  portal: "Portal",
};

export default async function AdminLeadsPage() {
  const leads = await listLeads();
  const newCount = leads.filter((l) => l.status === "new").length;
  const hotCount = leads.filter((l) => (l.aiScore ?? 0) >= 80).length;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <AdminPageHeader
        title="Leads"
        description={`${leads.length} en bandeja · ${newCount} nuevos · ${hotCount} calientes (≥80).`}
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <AdminStatPill label="Nuevos" value={newCount} tone="sea" />
        <AdminStatPill label="Calientes" value={hotCount} tone="gold" />
        <AdminStatPill
          label="En CRM"
          value={leads.filter((l) => l.crmPushedAt).length}
          tone="cream"
        />
      </div>

      <div className="space-y-3">
        {leads.map((lead) => (
          <article
            key={lead.id}
            className="rounded-2xl bg-white p-5 shadow-[0_10px_30px_rgba(26,34,44,0.05)] ring-1 ring-black/5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-medium">{lead.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {lead.email}
                  {lead.phone ? ` · ${lead.phone}` : ""}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {lead.locale.toUpperCase()} ·{" "}
                  {sourceLabel[lead.source] ?? lead.source} ·{" "}
                  {lead.createdAt.toLocaleDateString("es-ES")}
                </p>
              </div>
              <div className="text-right">
                <p className="tabular text-2xl font-medium text-sea-deep">
                  {lead.aiScore ?? "—"}
                </p>
                <p className="rounded-full bg-limestone px-2.5 py-0.5 text-xs font-medium">
                  {statusLabel[lead.status] ?? lead.status}
                </p>
              </div>
            </div>
            {lead.aiSummary ? (
              <p className={cn("mt-3 rounded-xl px-3 py-2 text-sm", adminToneBox("sea"))}>
                {lead.aiSummary}
              </p>
            ) : null}
            {lead.message ? (
              <p className="mt-2 text-sm text-muted-foreground">{lead.message}</p>
            ) : null}
            {(lead.budgetMin != null || lead.budgetMax != null) && (
              <p className="mt-2 tabular text-xs text-muted-foreground">
                Presupuesto:{" "}
                {lead.budgetMin?.toLocaleString("es-ES") ?? "—"} € –{" "}
                {lead.budgetMax?.toLocaleString("es-ES") ?? "—"} €
              </p>
            )}
            <LeadManager
              leadId={lead.id}
              status={lead.status}
              notes={lead.notes}
            />
          </article>
        ))}
      </div>
    </div>
  );
}
