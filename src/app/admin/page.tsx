import type { ComponentType } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  CameraOff,
  Languages,
  RefreshCw,
  TrendingUp,
  Users,
} from "lucide-react";
import { ActivityFeed } from "@/components/admin/activity-feed";
import {
  AdminCard,
  AdminPageHeader,
  AdminStatPill,
  adminToneBox,
} from "@/components/admin/admin-shell";
import { getAdminDashboardStats } from "@/lib/db/queries/admin-stats";
import { syncNowAction } from "./actions";
import { cn } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const stats = await getAdminDashboardStats();

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <AdminPageHeader
        title="Inicio"
        description="Lo que necesitas hoy: clientes, viviendas y avisos."
        actions={
          <form action={syncNowAction}>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-sea-deep px-5 py-2.5 text-sm font-medium text-white shadow-[0_10px_28px_rgba(44,85,138,0.28)] hover:bg-[#244872]"
            >
              <RefreshCw className="h-4 w-4" aria-hidden />
              Importar del CRM
            </button>
          </form>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashStat
          label="Leads sin revisar"
          value={stats.leads.new}
          href="/admin/leads"
          icon={Users}
          tone="sea"
        />
        <DashStat
          label="Valoraciones pendientes"
          value={stats.valuations.pending}
          href="/admin/valuations"
          icon={TrendingUp}
          tone="gold"
        />
        <DashStat
          label="Sin traducir"
          value={stats.properties.pendingTranslations}
          href="/admin/translations"
          icon={Languages}
          tone="cream"
        />
        <DashStat
          label="Sin fotos"
          value={stats.properties.withoutPhotos}
          href="/admin/properties?issue=no-photos"
          icon={CameraOff}
          tone="warning"
        />
      </div>

      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Esta semana
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <AdminStatPill
            label="Leads nuevos"
            value={stats.leads.new}
            tone="sea"
          />
          <AdminStatPill
            label="Contactos esta semana"
            value={stats.leads.thisWeek}
            tone="gold"
          />
          <AdminStatPill
            label="Valoraciones recibidas"
            value={stats.valuations.thisWeek}
            tone="cream"
          />
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <AdminCard>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl">Cartera</h2>
            <Link href="/admin/properties" className="text-sm text-sea-deep">
              Ver todas →
            </Link>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <AdminStatPill
              label="En venta"
              value={stats.properties.published}
              tone="success"
            />
            <AdminStatPill label="Destacadas" value={stats.properties.featured} tone="gold" />
            <AdminStatPill label="Vendidas" value={stats.properties.sold} tone="sea" />
            <AdminStatPill
              label="Sin publicar"
              value={stats.properties.draft}
              tone="warning"
            />
          </div>
          <Link
            href="/admin/properties"
            className={cn(
              "mt-4 flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm hover:opacity-90",
              adminToneBox("sea"),
            )}
          >
            <Building2 className="h-4 w-4 text-sea-deep" />
            Gestionar propiedades
          </Link>
        </AdminCard>

        <ActivityFeed items={stats.activity} />
      </div>
    </div>
  );
}

function DashStat({
  label,
  value,
  href,
  icon: Icon,
  tone = "sea",
}: {
  label: string;
  value: number;
  href: string;
  icon: ComponentType<{ className?: string }>;
  tone?: "sea" | "gold" | "cream" | "warning";
}) {
  const bg = {
    sea: "bg-[#dce8f5] ring-sea-deep/15 hover:bg-[#d0e0f0]",
    gold: "bg-[#f5ead8] ring-sun-clay/20 hover:bg-[#efe0c8]",
    cream: "bg-limestone ring-sun-clay/15 hover:bg-[#ebe3d4]",
    warning: "bg-[#f5ead8] ring-sun-clay/25 hover:bg-[#efe0c8]",
  };
  const iconBg = {
    sea: "bg-sea-deep/15 text-sea-deep",
    gold: "bg-sun-clay/20 text-[#8a6828]",
    cream: "bg-sea-deep/10 text-sea-deep",
    warning: "bg-sun-clay/25 text-[#8a6828]",
  };
  return (
    <Link
      href={href}
      className={cn(
        "group rounded-[1.5rem] p-5 shadow-[0_10px_28px_rgba(26,34,44,0.06)] ring-1 transition hover:-translate-y-0.5",
        bg[tone],
      )}
    >
      <div className="flex items-start justify-between">
        <span
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-2xl",
            iconBg[tone],
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100" />
      </div>
      <p className="mt-4 text-sm font-medium text-ink/70">{label}</p>
      <p className="mt-1 tabular text-3xl font-semibold">{value}</p>
    </Link>
  );
}
