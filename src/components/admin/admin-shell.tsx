import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type AdminPageHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function AdminPageHeader({
  title,
  description,
  actions,
}: AdminPageHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl md:text-4xl">{title}</h1>
        {description ? (
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function AdminCard({
  className,
  children,
  id,
}: {
  className?: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <div
      id={id}
      className={cn(
        "rounded-[1.5rem] bg-white p-5 shadow-[0_12px_36px_rgba(26,34,44,0.05)] ring-1 ring-black/5 md:p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}

export type AdminTone =
  | "default"
  | "sea"
  | "gold"
  | "cream"
  | "warning"
  | "success";

const toneStyles: Record<
  AdminTone,
  { box: string; label: string }
> = {
  default: {
    box: "bg-[#e8eef5] text-ink ring-1 ring-sea-deep/10",
    label: "text-sea-deep/70",
  },
  sea: {
    box: "bg-[#dce8f5] text-ink ring-1 ring-sea-deep/15",
    label: "text-sea-deep/80",
  },
  gold: {
    box: "bg-[#f5ead8] text-ink ring-1 ring-sun-clay/20",
    label: "text-[#8a6828]",
  },
  cream: {
    box: "bg-limestone text-ink ring-1 ring-sun-clay/15",
    label: "text-sea-deep/70",
  },
  warning: {
    box: "bg-[#f5ead8] text-[#7a5a20] ring-1 ring-sun-clay/25",
    label: "text-[#8a6828]",
  },
  success: {
    box: "bg-[#e4ede3] text-rosemary ring-1 ring-rosemary/20",
    label: "text-rosemary/80",
  },
};

export function adminToneBox(tone: AdminTone = "default") {
  return toneStyles[tone].box;
}

export function AdminStatPill({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string | number;
  tone?: AdminTone;
}) {
  const styles = toneStyles[tone];
  return (
    <div className={cn("rounded-2xl px-4 py-3.5", styles.box)}>
      <p className={cn("text-xs font-medium", styles.label)}>{label}</p>
      <p className="mt-1 tabular text-2xl font-semibold">{value}</p>
    </div>
  );
}
