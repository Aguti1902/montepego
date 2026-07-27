import type { ReactNode } from "react";
import { AdminCard } from "@/components/admin/admin-shell";
import type { FeatureSlug } from "@/config/site";
import type { ResolvedProperty } from "@/lib/db/types";
import { formatPrice } from "@/lib/utils";

const FEATURE_LABELS: Record<FeatureSlug, string> = {
  pool: "Piscina",
  sea_view: "Vistas al mar",
  mountain_view: "Vistas montaña",
  garage: "Garaje",
  guest_apartment: "Apto. invitados",
  terrace: "Terraza",
  garden: "Jardín",
  air_conditioning: "Aire acondicionado",
  heating: "Calefacción",
  fireplace: "Chimenea",
  solar: "Placas solares",
  renovated: "Reformada",
  furnished: "Amueblada",
  alarm: "Alarma",
};

const TYPE_LABELS: Record<ResolvedProperty["type"], string> = {
  villa: "Villa",
  apartment: "Apartamento",
  plot: "Parcela",
  townhouse: "Adosada",
  commercial: "Comercial",
};

const STATUS_LABELS: Record<ResolvedProperty["status"], string> = {
  available: "Publicada",
  reserved: "Reservada",
  sold: "Vendida",
  draft: "Sin publicar",
  withdrawn: "Retirada",
};

type Props = {
  property: ResolvedProperty;
  overrides: Array<{ field: string; reason: string | null }>;
  translations: Array<{ locale: string; reviewed: boolean; source: string }>;
  mediaCount: number;
};

function SpecSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-sea-deep/70">
        {title}
      </h3>
      <dl className="mt-2 divide-y divide-border/50 rounded-xl bg-[#f8fafc] ring-1 ring-black/[0.04]">
        {children}
      </dl>
    </div>
  );
}

function SpecRow({
  label,
  value,
  overridden,
}: {
  label: string;
  value: React.ReactNode;
  overridden?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-3 py-2 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="flex items-center gap-2 text-right font-medium tabular">
        <span>{value}</span>
        {overridden ? (
          <span className="rounded-full bg-rosemary/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-rosemary">
            Manual
          </span>
        ) : null}
      </dd>
    </div>
  );
}

export function PropertyOverview({
  property,
  overrides,
  translations,
  mediaCount,
}: Props) {
  const overridden = new Set(overrides.map((o) => o.field));
  const pendingTranslations = translations.filter((t) => !t.reviewed).length;

  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
      <AdminCard>
        <h2 className="font-display text-xl">Ficha técnica</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <SpecSection title="Publicación">
            <SpecRow label="Referencia" value={property.reference} />
            <SpecRow label="Estado" value={STATUS_LABELS[property.status]} overridden={overridden.has("status")} />
            <SpecRow label="Tipo" value={TYPE_LABELS[property.type]} overridden={overridden.has("type")} />
            <SpecRow label="Precio" value={formatPrice(property.price, "es")} overridden={overridden.has("price")} />
            <SpecRow label="CRM ID" value={property.crmId ?? "—"} />
          </SpecSection>

          <SpecSection title="Vivienda">
            <SpecRow label="Dormitorios" value={property.bedrooms} overridden={overridden.has("bedrooms")} />
            <SpecRow label="Baños" value={property.bathrooms} overridden={overridden.has("bathrooms")} />
            <SpecRow label="m² construidos" value={property.builtArea ?? "—"} overridden={overridden.has("builtArea")} />
            <SpecRow label="m² parcela" value={property.plotArea ?? "—"} overridden={overridden.has("plotArea")} />
            <SpecRow label="m² terraza" value={property.terraceArea ?? "—"} overridden={overridden.has("terraceArea")} />
            <SpecRow label="Año" value={property.yearBuilt ?? "—"} overridden={overridden.has("yearBuilt")} />
            <SpecRow label="Cert. energético" value={property.energyRating ?? "—"} overridden={overridden.has("energyRating")} />
          </SpecSection>

          <SpecSection title="Entorno">
            <SpecRow label="Cota" value={property.elevation != null ? `${property.elevation} m` : "—"} overridden={overridden.has("elevation")} />
            <SpecRow label="Orientación" value={property.orientation ?? "—"} overridden={overridden.has("orientation")} />
            <SpecRow label="Vistas" value={property.viewRelation ?? "—"} overridden={overridden.has("viewRelation")} />
          </SpecSection>

          <SpecSection title="Mapa">
            <SpecRow
              label="Coordenadas"
              value={
                property.latitude && property.longitude
                  ? `${property.latitude}, ${property.longitude}`
                  : "—"
              }
            />
            <SpecRow
              label="Precisión"
              value={
                property.locationPrecision === "exact"
                  ? "Exacta"
                  : property.locationPrecision === "approximate"
                    ? "Aproximada"
                    : "Oculta"
              }
            />
          </SpecSection>
        </div>
      </AdminCard>

      <div className="space-y-4">
        <AdminCard>
          <h2 className="font-display text-xl">Características</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {property.features.length > 0 ? (
              property.features.map((slug) => (
                <li
                  key={slug}
                  className="rounded-full bg-limestone px-3 py-1 text-sm text-sea-deep"
                >
                  {FEATURE_LABELS[slug]}
                </li>
              ))
            ) : (
              <li className="text-sm text-muted-foreground">
                Sin características registradas
              </li>
            )}
          </ul>
        </AdminCard>

        <AdminCard>
          <h2 className="font-display text-xl">Estado editorial</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Destacada</dt>
              <dd>{property.isFeatured ? "Sí" : "No"}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Fotos / medios</dt>
              <dd className="tabular">{mediaCount}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Traducciones pendientes</dt>
              <dd className="tabular">{pendingTranslations}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Overrides activos</dt>
              <dd className="tabular">{overrides.length}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Publicada</dt>
              <dd>
                {property.publishedAt
                  ? property.publishedAt.toLocaleDateString("es-ES")
                  : "—"}
              </dd>
            </div>
            {property.soldAt ? (
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Vendida</dt>
                <dd>{property.soldAt.toLocaleDateString("es-ES")}</dd>
              </div>
            ) : null}
          </dl>
          {overrides.length > 0 ? (
            <div className="mt-4 border-t border-border/60 pt-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Overrides
              </p>
              <ul className="mt-2 space-y-1 text-sm">
                {overrides.map((item) => (
                  <li key={item.field}>
                    <span className="font-medium">{item.field}</span>
                    {item.reason ? (
                      <span className="text-muted-foreground">
                        {" "}
                        — {item.reason}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </AdminCard>
      </div>
    </div>
  );
}
