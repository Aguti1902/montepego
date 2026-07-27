import { listAdminProperties } from "@/lib/db/queries/admin-properties";
import { listLeads } from "@/lib/db/queries/leads";
import { listValuations } from "@/lib/db/queries/valuations";
import { getAiUsageSummary } from "@/lib/db/queries/admin-ai";
import { demoActivity, demoPortalStats } from "@/lib/db/admin-demo-data";

const weekMs = 7 * 24 * 60 * 60 * 1000;

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
  const sold = properties.filter((p) => p.status === "sold").length;
  const draft = properties.filter((p) => p.status === "draft").length;
  const featured = properties.filter((p) => p.isFeatured).length;

  return {
    properties: {
      total: properties.length,
      published,
      sold,
      draft,
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
  };
}
