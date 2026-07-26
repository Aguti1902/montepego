import { cn } from "@/lib/utils";

type ElevationStripProps = {
  elevation?: number | null;
  orientation?: string | null;
  viewRelation?: string | null;
  className?: string;
};

export function ElevationStrip({
  elevation,
  orientation,
  viewRelation,
  className,
}: ElevationStripProps) {
  const parts = [
    elevation != null ? `${elevation} m` : null,
    orientation,
    viewRelation,
  ].filter(Boolean);

  if (parts.length === 0) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-3 border-t border-rosemary/40 pt-2 text-xs tracking-wide text-rosemary",
        className,
      )}
    >
      <span className="h-px w-6 bg-rosemary/50" aria-hidden />
      <span>{parts.join(" · ")}</span>
    </div>
  );
}
