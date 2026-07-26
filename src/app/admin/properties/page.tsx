import Link from "next/link";
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

export default async function AdminPropertiesPage() {
  const properties = await listAdminProperties();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl">Propiedades</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Edita fichas, overrides y estado. Los campos manuales ganan sobre el
          CRM.
        </p>
      </div>
      <div className="overflow-x-auto border border-border bg-card">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="px-3 py-2">Ref.</th>
              <th className="px-3 py-2">Título</th>
              <th className="px-3 py-2">Estado</th>
              <th className="px-3 py-2">Precio</th>
              <th className="px-3 py-2">m²</th>
              <th className="px-3 py-2">Overrides</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {properties.map((property) => (
              <tr key={property.id} className="border-b border-border/70">
                <td className="px-3 py-2 tabular">{property.reference}</td>
                <td className="px-3 py-2">
                  {property.title}
                  {property.isFeatured ? (
                    <Badge className="ml-2" variant="accent">
                      Destacada
                    </Badge>
                  ) : null}
                </td>
                <td className="px-3 py-2">
                  {statusLabel[property.status] ?? property.status}
                </td>
                <td className="px-3 py-2 tabular">
                  {formatPrice(property.price, "es")}
                </td>
                <td className="px-3 py-2 tabular">
                  {property.builtArea ?? "—"} / {property.plotArea ?? "—"}
                </td>
                <td className="px-3 py-2 tabular">{property.overrideCount}</td>
                <td className="px-3 py-2 text-right">
                  <Link
                    href={`/admin/properties/${property.id}`}
                    className="text-sea-deep hover:underline"
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
  );
}
