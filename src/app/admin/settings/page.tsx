import { PENDING_PORTAL_FEEDS } from "@/config/pending";
import { crmConfigIsLive, getCrmConfig } from "@/lib/crm/config";

export default function AdminSettingsPage() {
  const crm = getCrmConfig();
  const live = crmConfigIsLive(crm);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl">Ajustes</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Usuarios, roles, feeds y claves. Sin tecnicismos en la interfaz.
        </p>
      </div>
      <section className="border border-border bg-card p-4 text-sm">
        <h2 className="font-medium">Sincronización (CRM)</h2>
        <dl className="mt-3 space-y-2 text-muted-foreground">
          <div>
            <dt className="inline font-medium text-ink">Adaptador: </dt>
            <dd className="inline tabular">{crm.adapter}</dd>
          </div>
          <div>
            <dt className="inline font-medium text-ink">Estado: </dt>
            <dd className="inline">
              {live
                ? "Conectado a API (URL y clave configuradas)"
                : "Modo simulación (mock / sin credenciales)"}
            </dd>
          </div>
          <div>
            <dt className="inline font-medium text-ink">API: </dt>
            <dd className="inline break-all">
              {crm.baseUrl || "— (usa CRM_API_URL)"}
            </dd>
          </div>
        </dl>
        <p className="mt-3 text-xs text-muted-foreground">
          La web no habla con el CRM. Los datos entran por sincronización a la
          base de datos propia.
        </p>
      </section>
      <section className="border border-border bg-card p-4 text-sm">
        <h2 className="font-medium">Feeds a portales</h2>
        <ul className="mt-2 space-y-1 text-muted-foreground">
          <li>
            Idealista: {PENDING_PORTAL_FEEDS.idealistaEnabled ? "Sí" : "No"}
          </li>
          <li>
            Fotocasa: {PENDING_PORTAL_FEEDS.fotocasaEnabled ? "Sí" : "No"}
          </li>
          <li>Kyero: {PENDING_PORTAL_FEEDS.kyeroEnabled ? "Sí" : "No"}</li>
        </ul>
      </section>
    </div>
  );
}
