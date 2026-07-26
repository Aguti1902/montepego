import { PENDING_CRM, PENDING_PORTAL_FEEDS } from "@/config/pending";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl">Ajustes</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Usuarios, roles, feeds y claves. Sin tecnicismos en la interfaz.
        </p>
      </div>
      <section className="border border-border bg-card p-4 text-sm">
        <h2 className="font-medium">CRM</h2>
        <p className="mt-2 text-muted-foreground">
          Adaptador activo: {PENDING_CRM.provider} (cambiar con CRM_ADAPTER)
        </p>
      </section>
      <section className="border border-border bg-card p-4 text-sm">
        <h2 className="font-medium">Feeds a portales</h2>
        <ul className="mt-2 space-y-1 text-muted-foreground">
          <li>Idealista: {PENDING_PORTAL_FEEDS.idealistaEnabled ? "Sí" : "No"}</li>
          <li>Fotocasa: {PENDING_PORTAL_FEEDS.fotocasaEnabled ? "Sí" : "No"}</li>
          <li>Kyero: {PENDING_PORTAL_FEEDS.kyeroEnabled ? "Sí" : "No"}</li>
        </ul>
      </section>
    </div>
  );
}
