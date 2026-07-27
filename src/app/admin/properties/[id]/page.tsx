import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAdminProperty } from "@/lib/db/queries/admin-properties";
import { listMediaForProperty } from "@/lib/db/queries/admin-media";
import { PropertyEditor } from "@/components/admin/property-editor";
import { PropertyOverview } from "@/components/admin/property-overview";
import { MediaManager } from "@/components/admin/media-manager";
import { AdminCard } from "@/components/admin/admin-shell";
import { formatPrice } from "@/lib/utils";

type Props = { params: Promise<{ id: string }> };

export default async function AdminPropertyDetailPage({ params }: Props) {
  const { id } = await params;
  const data = await getAdminProperty(id);
  if (!data.property) notFound();

  const { property, overrides, translations } = data;
  const media = await listMediaForProperty(property.id);
  const overridden = new Set(overrides.map((o) => o.field));

  const fields = [
    { field: "price", label: "Precio (€)", value: property.price },
    { field: "bedrooms", label: "Dormitorios", value: property.bedrooms },
    { field: "bathrooms", label: "Baños", value: property.bathrooms },
    { field: "builtArea", label: "m² construidos", value: property.builtArea },
    { field: "plotArea", label: "m² parcela", value: property.plotArea },
    { field: "terraceArea", label: "m² terraza", value: property.terraceArea },
    { field: "yearBuilt", label: "Año construcción", value: property.yearBuilt },
    {
      field: "energyRating",
      label: "Certificado energético",
      value: property.energyRating,
    },
    { field: "elevation", label: "Cota (m)", value: property.elevation },
    {
      field: "orientation",
      label: "Orientación",
      value: property.orientation,
    },
    {
      field: "viewRelation",
      label: "Relación con la vista",
      value: property.viewRelation,
    },
  ].map((item) => ({
    ...item,
    overridden: overridden.has(item.field),
  }));

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <Link
        href="/admin/properties"
        className="inline-flex items-center gap-2 text-sm font-medium text-sea-deep hover:underline"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Volver a propiedades
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm uppercase tracking-wide text-muted-foreground">
            Ref. {property.reference}
          </p>
          <h1 className="font-display text-2xl break-words sm:text-3xl">{property.title}</h1>
          <p className="mt-2 tabular text-lg text-sea-deep">
            {formatPrice(property.price, "es")}
          </p>
        </div>
        <Link
          href={`/property/${property.slug}`}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-limestone px-4 py-2 text-sm text-sea-deep hover:bg-[#e4dccf] sm:w-auto"
          target="_blank"
        >
          Ver en web →
        </Link>
      </div>

      <PropertyOverview
        property={property}
        overrides={overrides}
        translations={translations}
        mediaCount={media.length}
      />

      <AdminCard>
        <h2 className="font-display text-xl">Descripción (ES)</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          {property.description}
        </p>
      </AdminCard>

      <AdminCard>
        <h2 className="font-display text-xl">Medios</h2>
        <div className="mt-4">
          <MediaManager items={media} propertyId={property.id} />
        </div>
      </AdminCard>

      <PropertyEditor
        propertyId={property.id}
        status={property.status}
        isFeatured={property.isFeatured}
        fields={fields}
        translations={translations}
        features={property.features}
      />
    </div>
  );
}
