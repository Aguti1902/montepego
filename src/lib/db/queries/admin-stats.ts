import { listAdminProperties } from "@/lib/db/queries/admin-properties";
import { listLeads } from "@/lib/db/queries/leads";
import { listValuations } from "@/lib/db/queries/valuations";
import { getAiUsageSummary } from "@/lib/db/queries/admin-ai";
import { demoActivity, demoPortalStats } from "@/lib/db/admin-demo-data";
import { format, startOfDay, subDays } from "date-fns";
import { es } from "date-fns/locale";

const weekMs = 7 * 24 * 60 * 60 * 1000;
const chartDays = 14;

type DatedRow = { createdAt: Date };

function seriesByDay(items: DatedRow[], days = chartDays) {
  const today = startOfDay(new Date());

  return Array.from({ length: days }, (_, index) => {
    const day = subDays(today, days - 1 - index);
    const label = format(day, "d MMM", { locale: es });
    const value = items.filter(
      (item) => startOfDay(item.createdAt).getTime() === day.getTime(),
    ).length;

    return { label, value };
  });
}

const leadStatusLabels: Record<string, string> = {
  new: "Nuevos",
  contacted: "Contactados",
  qualified: "Cualificados",
  visiting: "En visita",
  closed: "Cerrados",
  lost: "Perdidos",
};

const leadStatusColors: Record<string, string> = {
  new: "#2c558a",
  contacted: "#4a7ab8",
  qualified: "#b88c40",
  visiting: "#6b9e78",
  closed: "#64748b",
  lost: "#c47a6a",
};

const portfolioColors: Record<string, string> = {
  available: "#3d7a5c",
  reserved: "#b88c40",
  sold: "#64748b",
  draft: "#94a3b8",
  withdrawn: "#c47a6a",
};

const portfolioLabels: Record<string, string> = {
  available: "En venta",
  reserved: "Reservadas",
  sold: "Vendidas",
  draft: "Sin publicar",
  withdrawn: "Retiradas",
};

export async function getAdminDashboardStats() {
  const [properties, leads, valuations, ai] = await Promise.all([
    listAdminProperties(),
    listLeads(),
    listValuations(),
    getAiUsageSummary(7),
  ]);

  const weekAgo = Date.now() - weekMs;

  const leadsThisWeek = leads.filter(
    (l) => l.createdAt.getTime() >= weekAgo,
  ).length;
  const valuationsThisWeek = valuations.filter(
    (v) => v.createdAt.getTime() >= weekAgo,
  ).length;
  const published = properties.filter((p) => p.status === "available").length;
  const reserved = properties.filter((p) => p.status === "reserved").length;
  const sold = properties.filter((p) => p.status === "sold").length;
  const draft = properties.filter((p) => p.status === "draft").length;
  const withdrawn = properties.filter((p) => p.status === "withdrawn").length;
  const featured = properties.filter((p) => p.isFeatured).length;

  const portfolioChart = (
    ["available", "reserved", "sold", "draft", "withdrawn"] as const
  )
    .map((status) => ({
      label: portfolioLabels[status],
      value:
        status === "available"
          ? published
          : status === "reserved"
            ? reserved
            : status === "sold"
              ? sold
              : status === "draft"
                ? draft
                : withdrawn,
      color: portfolioColors[status],
    }))
    .filter((item) => item.value > 0);

  const leadStatusChart = (
    [
      "new",
      "contacted",
      "qualified",
      "visiting",
      "closed",
      "lost",
    ] as const
  )
    .map((status) => ({
      label: leadStatusLabels[status],
      value: leads.filter((l) => l.status === status).length,
      color: leadStatusColors[status],
    }))
    .filter((item) => item.value > 0);

  return {
    properties: {
      total: properties.length,
      published,
      reserved,
      sold,
      draft,
      withdrawn,
      featured,
      withoutPhotos: properties.filter((p) => !p.hasPhotos).length,
      pendingTranslations: properties.reduce(
        (a, p) => a + p.pendingTranslations,
        0,
      ),
    },
    leads: {
      total: leads.length,
      new: leads.filter((l) => l.status === "new").length,
      thisWeek: leadsThisWeek,
      hot: leads.filter((l) => (l.aiScore ?? 0) >= 80).length,
    },
    valuations: {
      total: valuations.length,
      pending: valuations.filter((v) => v.status === "pending").length,
      thisWeek: valuationsThisWeek,
    },
    ai,
    activity: demoActivity,
    portals: demoPortalStats,
    charts: {
      leadsByDay: seriesByDay(leads),
      valuationsByDay: seriesByDay(valuations),
      portfolio: portfolioChart,
      leadsByStatus: leadStatusChart,
    },
  };
}
