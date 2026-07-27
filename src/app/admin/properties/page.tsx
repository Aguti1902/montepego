import { Suspense } from "react";
import Link from "next/link";
import { AdminPageHeader, AdminStatPill } from "@/components/admin/admin-shell";
import { AdminPropertyFilters } from "@/components/admin/property-filters";
import { listAdminProperties } from "@/lib/db/queries/admin-properties";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const statusLabel: Record<string, string> = {
  available: "Publicada",
  reserved: "Reservada",
  sold: "Vendida",
  draft: "Sin publicar",
  withdrawn: "Retirada",
};

type Props = { searchParams: Promise<Record<string, string | undefined>> };

export default async function AdminPropertiesPage({ searchParams }: Props) {
  const sp = await searchParams;
  const all = await listAdminProperties();
  let properties = all;

  if (sp.q) {
    const q = sp.q.toLowerCase();
    properties = properties.filter(
      (p) =>
        p.reference.includes(q) ||
        p.title.toLowerCase().includes(q) ||
        p.slug.includes(q),
    );
  }
  if (sp.status) {
    properties = properties.filter((p) => p.status === sp.status);
  }
  if (sp.type) {
    properties = properties.filter((p) => p.type === sp.type);
  }
  if (sp.issue === "no-photos") {
    properties = properties.filter((p) => !p.hasPhotos);
  }
  if (sp.issue === "pending-tr") {
    properties = properties.filter((p) => p.pendingTranslations > 0);
  }
  if (sp.issue === "featured") {
    properties = properties.filter((p) => p.isFeatured);
  }

  const published = all.filter((p) => p.status === "available").length;
  const withoutPhotos = all.filter((p) => !p.hasPhotos).length;
  const pendingTr = all.filter((p) => p.pendingTranslations > 0).length;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <AdminPageHeader
        title="Propiedades"
        description={`${all.length} fichas en cartera.`}
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <AdminStatPill label="En venta" value={published} tone="success" />
        <AdminStatPill label="Sin fotos" value={withoutPhotos} tone="warning" />
        <AdminStatPill label="Sin traducir" value={pendingTr} tone="sea" />
      </div>

      <Suspense fallback={null}>
        <AdminPropertyFilters />
      </Suspense>

      <div className="space-y-3 md:hidden">
        {properties.map((property) => (
          <div
            key={property.id}
            className="rounded-2xl bg-white p-4 shadow-[0_12px_36px_rgba(26,34,44,0.05)] ring-1 ring-black/5"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="tabular text-sm text-muted-foreground">
                Ref. {property.reference}
              </p>
              <span className="shrink-0 text-xs font-medium text-sea-deep">
                {statusLabel[property.status] ?? property.status}
              </span>
            </div>
            <p className="mt-2 font-medium leading-snug text-ink">
              {property.title}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {property.isFeatured ? (
                <Badge className="rounded-full" variant="accent">
                  Destacada
                </Badge>
              ) : null}
              {!property.hasPhotos ? (
                <Badge className="rounded-full" variant="sold">
                  Sin fotos
                </Badge>
              ) : null}
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <p className="tabular text-lg font-medium text-sea-deep">
                {formatPrice(property.price, "es")}
              </p>
              <p className="text-xs text-muted-foreground">
                {property.builtArea ?? "—"} / {property.plotArea ?? "—"} m² ·{" "}
                {property.pendingTranslations} trad.
              </p>
            </div>
            <Link
              href={`/admin/properties/${property.id}`}
              className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-limestone px-4 text-sm font-medium text-sea-deep hover:bg-[#e4dccf] sm:w-auto"
            >
              Editar
            </Link>
          </div>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-2xl bg-white shadow-[0_12px_36px_rgba(26,34,44,0.05)] ring-1 ring-black/5 md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-left text-sm">
            <thead className="border-b border-border/80 bg-[#dce8f5]">
              <tr>
                <th className="px-4 py-3 font-medium">Ref.</th>
                <th className="px-4 py-3 font-medium">Título</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Precio</th>
                <th className="px-4 py-3 font-medium">m²</th>
                <th className="px-4 py-3 font-medium">Trad.</th>
                <th className="px-4 py-3 font-medium">Ov.</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => (
                <tr
                  key={property.id}
                  className="border-b border-border/50 last:border-0"
                >
                  <td className="px-4 py-3 tabular">{property.reference}</td>
                  <td className="px-4 py-3">
                    {property.title}
                    {property.isFeatured ? (
                      <Badge className="ml-2 rounded-full" variant="accent">
                        ★
                      </Badge>
                    ) : null}
                    {!property.hasPhotos ? (
                      <Badge className="ml-2 rounded-full" variant="sold">
                        Sin fotos
                      </Badge>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    {statusLabel[property.status] ?? property.status}
                  </td>
                  <td className="px-4 py-3 tabular">
                    {formatPrice(property.price, "es")}
                  </td>
                  <td className="px-4 py-3 tabular">
                    {property.builtArea ?? "—"} / {property.plotArea ?? "—"}
                  </td>
                  <td className="px-4 py-3 tabular">
                    {property.pendingTranslations}
                  </td>
                  <td className="px-4 py-3 tabular">{property.overrideCount}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/properties/${property.id}`}
                      className="inline-flex min-h-11 items-center rounded-full bg-limestone px-4 py-2 text-sea-deep hover:bg-[#e4dccf]"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
