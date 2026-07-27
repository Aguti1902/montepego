import Link from "next/link";
import { AdminStatPill } from "@/components/admin/admin-shell";
import { listAdminProperties } from "@/lib/db/queries/admin-properties";

export default async function AdminTranslationsPage() {
  const properties = await listAdminProperties();
  const pending = properties.filter((p) => p.pendingTranslations > 0);
  const totalPending = pending.reduce((a, p) => a + p.pendingTranslations, 0);
  const upToDate = properties.length - pending.length;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="font-display text-3xl md:text-4xl">Traducciones</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Revisa los textos en otros idiomas antes de publicar.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <AdminStatPill label="Pendientes" value={totalPending} tone="gold" />
        <AdminStatPill label="Fichas con avisos" value={pending.length} tone="sea" />
        <AdminStatPill label="Al día" value={upToDate} tone="success" />
      </div>
      <div className="space-y-2">
        {(pending.length ? pending : properties).map((property) => (
          <Link
            key={property.id}
            href={`/admin/properties/${property.id}`}
            className="flex items-center justify-between rounded-2xl bg-white px-4 py-3.5 text-sm shadow-[0_8px_24px_rgba(26,34,44,0.04)] ring-1 ring-black/5 hover:ring-sea-deep/30"
          >
            <span>
              <span className="tabular text-muted-foreground">
                {property.reference}
              </span>{" "}
              — {property.title}
            </span>
            <span className="rounded-full bg-limestone px-3 py-1 tabular text-xs font-medium text-ink/70">
              {property.pendingTranslations} pendientes
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
