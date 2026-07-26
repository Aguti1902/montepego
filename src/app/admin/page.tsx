import Link from "next/link";
import { getLatestSyncLog } from "@/lib/crm/sync";
import { listAdminProperties } from "@/lib/db/queries/admin-properties";
import { listLeads } from "@/lib/db/queries/leads";
import { listValuations } from "@/lib/db/queries/valuations";
import { syncNowAction } from "./actions";

export default async function AdminDashboardPage() {
  const [sync, properties, leads, valuations] = await Promise.all([
    getLatestSyncLog(),
    listAdminProperties(),
    listLeads(),
    listValuations(),
  ]);

  const withoutPhotos = properties.filter((p) => !p.hasPhotos).length;
  const pendingTranslations = properties.reduce(
    (acc, p) => acc + p.pendingTranslations,
    0,
  );
  const newLeads = leads.filter((l) => l.status === "new").length;
  const syncFailed =
    sync?.status === "failed" ||
    ((sync?.warnings?.length ?? 0) > 0 && !sync?.warningsReviewed);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl">Inicio</h1>
        <p className="mt-2 text-muted-foreground">
          Resumen operativo y estado de la sincronización.
        </p>
      </div>

      {syncFailed ? (
        <div
          className="border border-destructive bg-destructive/10 px-4 py-3 text-sm text-destructive"
          role="alert"
        >
          La última sincronización tiene avisos o ha fallado. Revisa el detalle
          antes de publicar.
          {sync?.error ? ` Error: ${sync.error}` : null}
          {sync?.warnings?.length
            ? ` Avisos: ${sync.warnings.slice(0, 3).join(" · ")}`
            : null}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Leads nuevos" value={newLeads} href="/admin/leads" />
        <Stat
          label="Sin traducir"
          value={pendingTranslations}
          href="/admin/translations"
        />
        <Stat
          label="Sin fotos"
          value={withoutPhotos}
          href="/admin/properties"
        />
        <Stat
          label="Valoraciones"
          value={valuations.filter((v) => v.status === "pending").length}
          href="/admin/valuations"
        />
      </div>

      <section className="border border-border bg-card p-5">
        <h2 className="font-display text-xl">Sincronización</h2>
        {sync ? (
          <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">Estado</dt>
              <dd className="font-medium">{sync.status}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Última</dt>
              <dd className="tabular">
                {sync.startedAt.toLocaleString("es-ES")}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Creadas / actualizadas</dt>
              <dd className="tabular">
                {sync.propertiesCreated} / {sync.propertiesUpdated}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Avisos</dt>
              <dd className="tabular">{sync.warnings?.length ?? 0}</dd>
            </div>
          </dl>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            Aún no hay sincronizaciones registradas. El adaptador mock está
            activo por defecto.
          </p>
        )}
        <form action={syncNowAction} className="mt-4">
          <button
            type="submit"
            className="rounded-[var(--radius)] bg-primary px-4 py-2 text-sm text-primary-foreground"
          >
            Sincronizar ahora
          </button>
        </form>
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  href,
}: {
  label: string;
  value: number;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="border border-border bg-card p-4 hover:border-sea-deep"
    >
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 tabular text-3xl text-sea-deep">{value}</p>
    </Link>
  );
}
