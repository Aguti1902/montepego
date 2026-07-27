import Link from "next/link";
import type { DemoActivity } from "@/lib/db/admin-demo-data";
import { AdminCard, adminToneBox } from "@/components/admin/admin-shell";
import { cn } from "@/lib/utils";

const kindLabel: Record<DemoActivity["kind"], string> = {
  lead: "Lead",
  valuation: "Valoración",
  sync: "CRM",
  property: "Propiedad",
  ai: "Asistente",
  content: "Web",
};

export function ActivityFeed({ items }: { items: DemoActivity[] }) {
  return (
    <AdminCard>
      <h2 className="font-display text-xl">Actividad reciente</h2>
      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <li key={item.id}>
            {item.href ? (
              <Link
                href={item.href}
                className={cn(
                  "flex items-start justify-between gap-3 rounded-xl px-3 py-2.5 hover:opacity-90",
                  adminToneBox("cream"),
                )}
              >
                <ActivityRow item={item} />
              </Link>
            ) : (
              <div className="flex items-start justify-between gap-3 rounded-xl px-3 py-2.5">
                <ActivityRow item={item} />
              </div>
            )}
          </li>
        ))}
      </ul>
    </AdminCard>
  );
}

function ActivityRow({ item }: { item: DemoActivity }) {
  return (
    <>
      <div>
        <p className="min-w-0 text-sm font-medium text-ink">{item.title}</p>
        <p className="min-w-0 text-xs text-muted-foreground">{item.detail}</p>
      </div>
      <div className="shrink-0 text-right">
        <span className="rounded-full bg-limestone px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-ink/60">
          {kindLabel[item.kind]}
        </span>
        <p className="mt-1 text-[11px] tabular text-muted-foreground">
          {item.at.toLocaleDateString("es-ES", {
            day: "numeric",
            month: "short",
          })}
        </p>
      </div>
    </>
  );
}
