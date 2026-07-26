import { memoryPortal } from "@/lib/db/portal-memory";
import { formatPrice } from "@/lib/utils";

export default function OwnerPortalPage() {
  const stats = memoryPortal.ownerStats;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl">Portal del propietario</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Seguimiento de tu vivienda en comercialización.
        </p>
      </div>
      <section className="border border-border bg-card p-5">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Ref. {stats.reference}
        </p>
        <h2 className="mt-1 font-display text-2xl">{stats.title}</h2>
        <p className="mt-2 text-sm">Estado: {stats.status}</p>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-muted-foreground">Consultas</dt>
            <dd className="tabular text-2xl text-sea-deep">{stats.enquiries}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Visitas web</dt>
            <dd className="tabular text-2xl text-sea-deep">{stats.views}</dd>
          </div>
        </dl>
        <p className="mt-4 text-sm text-muted-foreground">
          Precio de referencia en cartera: {formatPrice(495000, "es")}
        </p>
      </section>
    </div>
  );
}
