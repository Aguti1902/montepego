import { listValuations } from "@/lib/db/queries/valuations";
import { formatPrice } from "@/lib/utils";

export default async function AdminValuationsPage() {
  const valuations = await listValuations();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl">Valoraciones</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Solicitudes del valorador con estimación orientativa de la IA.
        </p>
      </div>
      <div className="space-y-3">
        {valuations.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No hay solicitudes de valoración.
          </p>
        ) : (
          valuations.map((item) => (
            <article
              key={item.id}
              className="border border-border bg-card p-4"
            >
              <h2 className="font-medium">{item.name}</h2>
              <p className="text-sm text-muted-foreground">{item.address}</p>
              <p className="mt-2 text-sm">
                Tipo: {item.propertyType}
                {item.bedrooms != null ? ` · ${item.bedrooms} hab` : ""}
                {item.builtArea != null ? ` · ${item.builtArea} m²` : ""}
              </p>
              <p className="mt-2 tabular text-sm text-sea-deep">
                Estimación IA:{" "}
                {item.aiEstimateMin != null && item.aiEstimateMax != null
                  ? `${formatPrice(item.aiEstimateMin, "es")} – ${formatPrice(item.aiEstimateMax, "es")}`
                  : "Pendiente"}
              </p>
              {item.aiReasoning ? (
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.aiReasoning}
                </p>
              ) : null}
              <p className="mt-3 text-xs uppercase tracking-wide text-muted-foreground">
                {item.status}
              </p>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
