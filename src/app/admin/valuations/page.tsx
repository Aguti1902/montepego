import { ValuationAgentForm } from "@/components/admin/valuation-agent-form";
import { AdminPageHeader, AdminStatPill } from "@/components/admin/admin-shell";
import { listValuations } from "@/lib/db/queries/valuations";
import { formatPrice } from "@/lib/utils";

const statusLabel: Record<string, string> = {
  pending: "Pendiente",
  reviewed: "Revisada",
  contacted: "Contactada",
};

export default async function AdminValuationsPage() {
  const valuations = await listValuations();
  const pending = valuations.filter((v) => v.status === "pending").length;
  const reviewed = valuations.filter((v) => v.status === "reviewed").length;
  const contacted = valuations.filter((v) => v.status === "contacted").length;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <AdminPageHeader
        title="Valoraciones"
        description={`${valuations.length} solicitudes · ${pending} pendientes de revisión agente.`}
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <AdminStatPill label="Pendientes" value={pending} tone="gold" />
        <AdminStatPill label="Revisadas" value={reviewed} tone="sea" />
        <AdminStatPill label="Contactadas" value={contacted} tone="success" />
      </div>

      <div className="space-y-3">
        {valuations.map((item) => (
          <article
            key={item.id}
            className="rounded-2xl bg-white p-5 shadow-[0_10px_30px_rgba(26,34,44,0.05)] ring-1 ring-black/5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-medium">{item.name}</h2>
                <p className="text-sm text-muted-foreground">{item.address}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.email}
                  {item.phone ? ` · ${item.phone}` : ""}
                </p>
              </div>
              <span className="rounded-full bg-limestone px-3 py-1 text-xs font-medium uppercase tracking-wide">
                {statusLabel[item.status] ?? item.status}
              </span>
            </div>
            <p className="mt-3 text-sm">
              {item.propertyType}
              {item.bedrooms != null ? ` · ${item.bedrooms} hab` : ""}
              {item.builtArea != null ? ` · ${item.builtArea} m²` : ""}
              {item.condition ? ` · ${item.condition}` : ""}
            </p>
            <p className="mt-2 tabular text-sm font-medium text-sea-deep">
              IA:{" "}
              {item.aiEstimateMin != null && item.aiEstimateMax != null
                ? `${formatPrice(item.aiEstimateMin, "es")} – ${formatPrice(item.aiEstimateMax, "es")}`
                : "Pendiente"}
            </p>
            {item.aiReasoning ? (
              <p className="mt-2 text-sm text-muted-foreground">
                {item.aiReasoning}
              </p>
            ) : null}
            <ValuationAgentForm
              valuationId={item.id}
              agentEstimate={item.agentEstimate}
              agentNotes={item.agentNotes}
              status={item.status}
            />
          </article>
        ))}
      </div>
    </div>
  );
}
