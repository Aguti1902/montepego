import type { ReactNode } from "react";
import { AdminCard } from "@/components/admin/admin-shell";
import { cn } from "@/lib/utils";

export type ChartPoint = {
  label: string;
  value: number;
  color?: string;
};

type AdminChartCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function AdminChartCard({
  title,
  description,
  children,
  className,
}: AdminChartCardProps) {
  return (
    <AdminCard className={className}>
      <h2 className="font-display text-xl">{title}</h2>
      {description ? (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      ) : null}
      <div className="mt-5">{children}</div>
    </AdminCard>
  );
}

type GroupedBarChartProps = {
  primary: ChartPoint[];
  secondary: ChartPoint[];
  primaryLabel: string;
  secondaryLabel: string;
  primaryColor?: string;
  secondaryColor?: string;
};

export function AdminGroupedBarChart({
  primary,
  secondary,
  primaryLabel,
  secondaryLabel,
  primaryColor = "#2c558a",
  secondaryColor = "#b88c40",
}: GroupedBarChartProps) {
  const max = Math.max(
    1,
    ...primary.map((p) => p.value),
    ...secondary.map((p) => p.value),
  );

  return (
    <div>
      <div className="flex h-52 items-end gap-1 sm:gap-1.5">
        {primary.map((point, index) => {
          const secondaryPoint = secondary[index];
          const primaryHeight = (point.value / max) * 100;
          const secondaryHeight = ((secondaryPoint?.value ?? 0) / max) * 100;

          return (
            <div
              key={`${point.label}-${index}`}
              className="flex min-w-0 flex-1 flex-col items-center gap-2"
            >
              <div className="flex h-44 w-full items-end justify-center gap-0.5 sm:gap-1">
                <div
                  className="w-[46%] rounded-t-lg transition-all"
                  style={{
                    height: `${primaryHeight}%`,
                    minHeight: point.value > 0 ? "6px" : 0,
                    backgroundColor: primaryColor,
                    opacity: 0.88,
                  }}
                  title={`${primaryLabel}: ${point.value}`}
                />
                <div
                  className="w-[46%] rounded-t-lg transition-all"
                  style={{
                    height: `${secondaryHeight}%`,
                    minHeight: (secondaryPoint?.value ?? 0) > 0 ? "6px" : 0,
                    backgroundColor: secondaryColor,
                    opacity: 0.88,
                  }}
                  title={`${secondaryLabel}: ${secondaryPoint?.value ?? 0}`}
                />
              </div>
              <span className="w-full truncate text-center text-[10px] text-muted-foreground sm:text-[11px]">
                {point.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: primaryColor }}
          />
          {primaryLabel}
        </span>
        <span className="inline-flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: secondaryColor }}
          />
          {secondaryLabel}
        </span>
      </div>
    </div>
  );
}

type HorizontalBarChartProps = {
  data: ChartPoint[];
  emptyLabel?: string;
};

export function AdminHorizontalBarChart({
  data,
  emptyLabel = "Sin datos",
}: HorizontalBarChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const max = Math.max(1, ...data.map((item) => item.value));

  if (total === 0) {
    return <p className="text-sm text-muted-foreground">{emptyLabel}</p>;
  }

  return (
    <div className="space-y-3">
      {data.map((item) => {
        const width = (item.value / max) * 100;
        const pct = Math.round((item.value / total) * 100);

        return (
          <div key={item.label}>
            <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
              <span className="text-ink/80">{item.label}</span>
              <span className="tabular text-muted-foreground">
                {item.value}{" "}
                <span className="text-xs">({pct}%)</span>
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-[#e8eef5]">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${width}%`,
                  backgroundColor: item.color ?? "#2c558a",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

type DonutChartProps = {
  data: ChartPoint[];
  centerLabel?: string;
  centerValue?: string | number;
};

export function AdminDonutChart({
  data,
  centerLabel,
  centerValue,
}: DonutChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  if (total === 0) {
    return <p className="text-sm text-muted-foreground">Sin datos</p>;
  }

  let cursor = 0;
  const gradient = data
    .map((item) => {
      const pct = (item.value / total) * 100;
      const start = cursor;
      cursor += pct;
      return `${item.color ?? "#2c558a"} ${start}% ${cursor}%`;
    })
    .join(", ");

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-center sm:gap-10">
      <div className="relative h-40 w-40 shrink-0">
        <div
          className="absolute inset-0 rounded-full"
          style={{ background: `conic-gradient(${gradient})` }}
        />
        <div className="absolute inset-[18%] flex flex-col items-center justify-center rounded-full bg-white text-center">
          {centerValue != null ? (
            <p className="tabular text-2xl font-semibold text-ink">
              {centerValue}
            </p>
          ) : null}
          {centerLabel ? (
            <p className="text-[11px] text-muted-foreground">{centerLabel}</p>
          ) : null}
        </div>
      </div>
      <ul className="w-full max-w-xs space-y-2.5">
        {data.map((item) => (
          <li
            key={item.label}
            className="flex items-center justify-between gap-3 text-sm"
          >
            <span className="inline-flex min-w-0 items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: item.color ?? "#2c558a" }}
              />
              <span className="truncate text-ink/80">{item.label}</span>
            </span>
            <span className="tabular text-muted-foreground">{item.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AdminChartLegend({
  items,
  className,
}: {
  items: { label: string; value: number; color: string }[];
  className?: string;
}) {
  return (
    <div className={cn("mt-4 grid gap-2 sm:grid-cols-2", className)}>
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center justify-between rounded-xl bg-[#f6f8fb] px-3 py-2 text-sm"
        >
          <span className="inline-flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            {item.label}
          </span>
          <span className="tabular font-medium">{item.value}</span>
        </div>
      ))}
    </div>
  );
}
