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
      <h2 className="font-display text-lg sm:text-xl">{title}</h2>
      {description ? (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      ) : null}
      <div className="mt-5">{children}</div>
    </AdminCard>
  );
}

type TrendChartProps = {
  primary: ChartPoint[];
  secondary: ChartPoint[];
  primaryLabel: string;
  secondaryLabel: string;
  primaryColor?: string;
  secondaryColor?: string;
};

function buildTrendPath(
  values: number[],
  count: number,
  yMax: number,
  padL: number,
  padT: number,
  plotW: number,
  plotH: number,
) {
  return values
    .map((value, index) => {
      const x =
        count <= 1
          ? padL + plotW / 2
          : padL + (index / (count - 1)) * plotW;
      const y = padT + plotH - (value / yMax) * plotH;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

function niceYMax(max: number) {
  if (max <= 1) return 2;
  if (max <= 3) return 4;
  if (max <= 5) return 6;
  return Math.ceil(max * 1.15);
}

/** Gráfica de tendencia: eje X horizontal (días) y eje Y vertical (conteo). */
export function AdminGroupedBarChart({
  primary,
  secondary,
  primaryLabel,
  secondaryLabel,
  primaryColor = "#2c558a",
  secondaryColor = "#b88c40",
}: TrendChartProps) {
  const primaryValues = primary.map((p) => p.value);
  const secondaryValues = secondary.map((p) => p.value);
  const rawMax = Math.max(1, ...primaryValues, ...secondaryValues);
  const yMax = niceYMax(rawMax);
  const count = primary.length;

  const width = 100;
  const height = 52;
  const padL = 12;
  const padR = 3;
  const padT = 5;
  const padB = 14;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;

  const primaryPath = buildTrendPath(
    primaryValues,
    count,
    yMax,
    padL,
    padT,
    plotW,
    plotH,
  );
  const secondaryPath = buildTrendPath(
    secondaryValues,
    count,
    yMax,
    padL,
    padT,
    plotW,
    plotH,
  );

  const yTicks = Array.from({ length: yMax + 1 }, (_, value) => value);
  const primaryPoints = primaryValues.map((value, index) => {
    const x =
      count <= 1 ? padL + plotW / 2 : padL + (index / (count - 1)) * plotW;
    const y = padT + plotH - (value / yMax) * plotH;
    return { x, y, value, label: primary[index]?.label ?? "" };
  });
  const secondaryPoints = secondaryValues.map((value, index) => {
    const x =
      count <= 1 ? padL + plotW / 2 : padL + (index / (count - 1)) * plotW;
    const y = padT + plotH - (value / yMax) * plotH;
    return { x, y, value };
  });

  return (
    <div className="-mx-1 overflow-x-auto px-1 sm:mx-0 sm:overflow-visible sm:px-0">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-40 min-w-[280px] w-full max-w-full sm:h-48"
        role="img"
        aria-label={`${primaryLabel} y ${secondaryLabel} por día`}
      >
        {yTicks.map((tick) => {
          const y = padT + plotH - (tick / yMax) * plotH;
          return (
            <g key={tick}>
              <text
                x={padL - 1.2}
                y={y + 0.9}
                textAnchor="end"
                fontSize="2.4"
                className="fill-muted-foreground"
              >
                {tick}
              </text>
              <line
                x1={padL}
                y1={y}
                x2={width - padR}
                y2={y}
                stroke="#e2e8f0"
                strokeWidth="0.35"
              />
            </g>
          );
        })}

          <line
            x1={padL}
            y1={padT + plotH}
            x2={width - padR}
            y2={padT + plotH}
            stroke="#cbd5e1"
            strokeWidth="0.45"
          />

          <path
            d={primaryPath}
            fill="none"
            stroke={primaryColor}
            strokeWidth="1.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={secondaryPath}
            fill="none"
            stroke={secondaryColor}
            strokeWidth="1.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {primaryPoints.map((point, index) =>
            point.value > 0 ? (
              <circle
                key={`p-${index}`}
                cx={point.x}
                cy={point.y}
                r="1.1"
                fill={primaryColor}
              >
                <title>{`${point.label} · ${primaryLabel}: ${point.value}`}</title>
              </circle>
            ) : null,
          )}
          {secondaryPoints.map((point, index) =>
            point.value > 0 ? (
              <circle
                key={`s-${index}`}
                cx={point.x}
                cy={point.y}
                r="1.1"
                fill={secondaryColor}
              >
                <title>{`${primary[index]?.label ?? ""} · ${secondaryLabel}: ${point.value}`}</title>
              </circle>
            ) : null,
          )}

          {primary.map((point, index) => {
            const x =
              count <= 1
                ? padL + plotW / 2
                : padL + (index / (count - 1)) * plotW;
            const showLabel =
              count <= 7 || index % 3 === 0 || index === count - 1;
            if (!showLabel) return null;
            return (
              <text
                key={`label-${index}`}
                x={x}
                y={height - 3}
                textAnchor="middle"
                className="fill-muted-foreground"
                fontSize="2.6"
              >
                {point.label}
              </text>
            );
          })}
      </svg>

      <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-2">
          <span
            className="h-0.5 w-5 rounded-full"
            style={{ backgroundColor: primaryColor }}
          />
          {primaryLabel}
        </span>
        <span className="inline-flex items-center gap-2">
          <span
            className="h-0.5 w-5 rounded-full"
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
      <ul className="w-full space-y-2.5 sm:max-w-xs">
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
