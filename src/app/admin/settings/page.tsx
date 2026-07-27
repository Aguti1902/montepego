import Link from "next/link";
import { RefreshCw } from "lucide-react";
import { markSyncReviewedAction, syncNowAction } from "@/app/admin/actions";
import { AdminCard, AdminPageHeader, adminToneBox } from "@/components/admin/admin-shell";
import { cn } from "@/lib/utils";
import { PENDING_PORTAL_FEEDS } from "@/config/pending";
import { siteConfig } from "@/config/site";
import { crmConfigIsLive, getCrmConfig } from "@/lib/crm/config";
import { demoUsers } from "@/lib/db/admin-demo-data";
import { listSyncLogs } from "@/lib/db/queries/admin-sync";

const statusLabel: Record<string, string> = {
  success: "Correcta",
  partial: "Con avisos",
  failed: "Fallida",
};

const roleLabel: Record<string, string> = {
  admin: "Administrador",
  agent: "Agente",
  editor: "Editor",
};

export default async function AdminSettingsPage() {
  const crm = getCrmConfig();
  const live = crmConfigIsLive(crm);
  const logs = await listSyncLogs(5);

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <AdminPageHeader
        title="Ajustes"
        description="Conexión con el CRM, portales externos, equipo y opciones avanzadas. Lo del día a día está en Inicio, Propiedades y Leads."
      />

      <AdminCard id="sincronizacion">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-xl">Datos del CRM</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Las propiedades se importan desde eGO. Si cambias algo a mano en
              una ficha, ese cambio se mantiene en la siguiente importación.
            </p>
          </div>
          <form action={syncNowAction}>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-sea-deep px-4 py-2 text-sm font-medium text-white hover:bg-[#244872]"
            >
              <RefreshCw className="h-4 w-4" aria-hidden />
              Importar ahora
            </button>
          </form>
        </div>
        <dl className="mt-4 grid gap-2 sm:grid-cols-2">
          <div className={cn("rounded-xl px-3 py-2.5 text-sm", adminToneBox("sea"))}>
            <dt className="text-sea-deep/80">Estado</dt>
            <dd className="mt-0.5 font-medium">
              {live ? "Conectado al CRM" : "Modo demo (sin credenciales)"}
            </dd>
          </div>
          <div className={cn("rounded-xl px-3 py-2.5 text-sm", adminToneBox("gold"))}>
            <dt className="text-[#8a6828]">Origen</dt>
            <dd className="mt-0.5 font-medium">eGO Real Estate</dd>
          </div>
        </dl>
        {logs.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {logs.map((log, index) => (
              <li
                key={log.id}
                className={cn(
                  "rounded-xl px-3 py-2.5 text-sm",
                  adminToneBox(index % 2 === 0 ? "cream" : "sea"),
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium">
                    {statusLabel[log.status] ?? log.status} ·{" "}
                    {log.startedAt.toLocaleString("es-ES")}
                  </span>
                  <span className="text-muted-foreground tabular">
                    +{log.propertiesCreated} nuevas · {log.propertiesUpdated}{" "}
                    actualizadas
                  </span>
                </div>
                {log.warnings?.length ? (
                  <p className="mt-1 text-muted-foreground">
                    {log.warnings.slice(0, 2).join(" · ")}
                  </p>
                ) : null}
                {log.warnings?.length && !log.warningsReviewed ? (
                  <form
                    action={async () => {
                      "use server";
                      await markSyncReviewedAction(log.id);
                    }}
                    className="mt-2"
                  >
                    <button
                      type="submit"
                      className="text-xs font-medium text-sea-deep hover:underline"
                    >
                      Marcar avisos como revisados
                    </button>
                  </form>
                ) : null}
              </li>
            ))}
          </ul>
        ) : null}
      </AdminCard>

      <AdminCard id="portales">
        <h2 className="font-display text-xl">Publicar en portales</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Envío automático de la cartera a webs inmobiliarias. Solo salen
          viviendas publicadas y revisadas.
        </p>
        <ul className="mt-4 space-y-2">
          <li
            className={cn(
              "flex flex-wrap items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm",
              adminToneBox("success"),
            )}
          >
            <span>
              <strong>Kyero</strong> — activo
            </span>
            <span className="text-muted-foreground">26 viviendas</span>
          </li>
          <li className={cn("rounded-xl px-3 py-2.5 text-sm", adminToneBox("gold"))}>
            <strong>Idealista</strong> —{" "}
            {PENDING_PORTAL_FEEDS.idealistaEnabled
              ? "activo"
              : "pendiente (faltan credenciales del portal)"}
          </li>
          <li className={cn("rounded-xl px-3 py-2.5 text-sm", adminToneBox("sea"))}>
            <strong>Fotocasa</strong> —{" "}
            {PENDING_PORTAL_FEEDS.fotocasaEnabled
              ? "activo"
              : "pendiente (faltan credenciales del portal)"}
          </li>
        </ul>
        {PENDING_PORTAL_FEEDS.kyeroEnabled ? (
          <a
            href="/api/feeds/kyero"
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-block text-sm text-sea-deep hover:underline"
          >
            Ver listado Kyero →
          </a>
        ) : null}
      </AdminCard>

      <AdminCard id="asistente">
        <h2 className="font-display text-xl">Asistente inteligente</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Ayuda al equipo, pero nada se publica solo: siempre revisáis antes.
        </p>
        <ul className="mt-4 space-y-2 text-sm">
          {(
            [
              ["Descripciones", "propone textos en varios idiomas para cada vivienda."],
              ["Leads", "resume el mensaje y sugiere prioridad."],
              ["Chat web", "responde dudas de visitantes (icono abajo a la derecha)."],
              ["Valoraciones", "estimación orientativa para el agente."],
            ] as const
          ).map(([title, body], index) => (
            <li
              key={title}
              className={cn(
                "rounded-xl px-3 py-2.5",
                adminToneBox(
                  (["sea", "gold", "cream", "success"] as const)[index % 4],
                ),
              )}
            >
              <strong>{title}</strong> — {body}
            </li>
          ))}
        </ul>
      </AdminCard>

      <AdminCard id="servicios">
        <h2 className="font-display text-xl">Accesos de propietarios y residentes</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Áreas aparte del panel de la agencia. Los clientes entran con su
          usuario, no desde aquí.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/portal/owner"
            target="_blank"
            className="rounded-full bg-limestone px-4 py-2 text-sm font-medium text-sea-deep hover:bg-[#e4dccf]"
          >
            Portal propietario →
          </Link>
          <Link
            href="/portal/resident"
            target="_blank"
            className="rounded-full bg-limestone px-4 py-2 text-sm font-medium text-sea-deep hover:bg-[#e4dccf]"
          >
            Portal residente →
          </Link>
        </div>
      </AdminCard>

      <AdminCard id="equipo">
        <h2 className="font-display text-xl">Equipo con acceso</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Quién puede entrar al panel. En producción se gestiona con usuarios
          reales.
        </p>
        <ul className="mt-4 space-y-2">
          {demoUsers.map((user, index) => (
            <li
              key={user.id}
              className={cn(
                "flex flex-wrap items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm",
                adminToneBox(
                  (["sea", "gold", "cream", "success"] as const)[index % 4],
                ),
              )}
            >
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-sea-deep">
                {roleLabel[user.role] ?? user.role}
              </span>
            </li>
          ))}
        </ul>
      </AdminCard>

      <AdminCard>
        <h2 className="font-display text-xl">Oficina</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {siteConfig.contact.address}
        </p>
        <p className="mt-1 text-sm tabular">
          {siteConfig.contact.phones.join(" · ")}
        </p>
        <p className="mt-1 text-sm">{siteConfig.contact.email}</p>
      </AdminCard>
    </div>
  );
}
