import { notFound } from "next/navigation";
import { getAdminProperty } from "@/lib/db/queries/admin-properties";
import { PropertyEditor } from "@/components/admin/property-editor";

type Props = { params: Promise<{ id: string }> };

export default async function AdminPropertyDetailPage({ params }: Props) {
  const { id } = await params;
  const data = await getAdminProperty(id);
  if (!data.property) notFound();

  const { property, overrides, translations } = data;
  const overridden = new Set(overrides.map((o) => o.field));

  const fields = [
    { field: "price", label: "Precio (€)", value: property.price },
    { field: "bedrooms", label: "Dormitorios", value: property.bedrooms },
    { field: "bathrooms", label: "Baños", value: property.bathrooms },
    { field: "builtArea", label: "m² construidos", value: property.builtArea },
    { field: "plotArea", label: "m² parcela", value: property.plotArea },
    {
      field: "orientation",
      label: "Orientación",
      value: property.orientation,
    },
  ].map((item) => ({
    ...item,
    overridden: overridden.has(item.field),
  }));

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-wide text-muted-foreground">
          Ref. {property.reference}
        </p>
        <h1 className="font-display text-3xl">{property.title}</h1>
      </div>
      <PropertyEditor
        propertyId={property.id}
        status={property.status}
        isFeatured={property.isFeatured}
        fields={fields}
        translations={translations}
      />
    </div>
  );
}
