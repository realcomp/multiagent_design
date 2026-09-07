import { cn } from "@/lib/utils";

export type ConfidenceLevel = "low" | "medium" | "high";

interface ConfidenceIndicatorProps {
  level: ConfidenceLevel | null;
  showLabel?: boolean;
}

const labels: Record<ConfidenceLevel, string> = {
  low: "низкая",
  medium: "средняя",
  high: "высокая",
};

export function ConfidenceIndicator({ level, showLabel = true }: ConfidenceIndicatorProps) {
  if (level === null) return <span className="font-mono text-meta text-ink-subtle">—</span>;

  const filledBars = level === "low" ? 1 : level === "medium" ? 2 : 3;
  const color = level === "low" ? "bg-confidence-low" : level === "medium" ? "bg-confidence-medium" : "bg-confidence-high";

  return (
    <div className="flex items-center gap-2" title={`Уверенность: ${labels[level]}`}>
      <span className="flex items-end gap-[2px]" aria-hidden="true">
        {[1, 2, 3].map((bar) => (
          <span key={bar} className={cn("w-1 rounded-[1px]", bar <= filledBars ? color : "bg-line-strong")} style={{ height: 5 + bar * 3 }} />
        ))}
      </span>
      {showLabel ? <span className="text-label text-ink-muted">{labels[level]}</span> : null}
    </div>
  );
}
