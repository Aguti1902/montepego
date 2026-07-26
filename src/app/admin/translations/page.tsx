import Link from "next/link";
import { listAdminProperties } from "@/lib/db/queries/admin-properties";

export default async function AdminTranslationsPage() {
  const properties = await listAdminProperties();
  const pending = properties.filter((p) => p.pendingTranslations > 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl">Traducciones</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Pendientes de revisión: {pending.reduce((a, p) => a + p.pendingTranslations, 0)}
        </p>
      </div>
      <div className="space-y-2">
        {(pending.length ? pending : properties).map((property) => (
          <Link
            key={property.id}
            href={`/admin/properties/${property.id}`}
            className="flex items-center justify-between border border-border bg-card px-4 py-3 text-sm hover:border-sea-deep"
          >
            <span>
              {property.reference} — {property.title}
            </span>
            <span className="tabular text-muted-foreground">
              {property.pendingTranslations} pendientes
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
