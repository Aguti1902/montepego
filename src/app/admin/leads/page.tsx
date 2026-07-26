import { listLeads } from "@/lib/db/queries/leads";
import { setLeadStatusAction } from "../actions";

export default async function AdminLeadsPage() {
  const leads = await listLeads();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl">Leads</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Bandeja con resumen y puntuación. Prioriza los nuevos.
        </p>
      </div>
      <div className="space-y-3">
        {leads.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No hay leads todavía. Llegarán desde contacto, WhatsApp y el
            valorador.
          </p>
        ) : (
          leads.map((lead) => (
            <article
              key={lead.id}
              className="border border-border bg-card p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-medium">{lead.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {lead.email}
                    {lead.phone ? ` · ${lead.phone}` : ""}
                  </p>
                </div>
                <div className="text-right text-sm">
                  <p className="tabular">
                    Puntuación: {lead.aiScore ?? "—"}
                  </p>
                  <p className="text-muted-foreground">{lead.status}</p>
                </div>
              </div>
              {lead.aiSummary ? (
                <p className="mt-3 text-sm">{lead.aiSummary}</p>
              ) : null}
              {lead.message ? (
                <p className="mt-2 text-sm text-muted-foreground">
                  {lead.message}
                </p>
              ) : null}
              <form
                action={async () => {
                  "use server";
                  await setLeadStatusAction(lead.id, "contacted");
                }}
                className="mt-3"
              >
                <button
                  type="submit"
                  className="text-sm text-sea-deep hover:underline"
                >
                  Marcar contactado
                </button>
              </form>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
