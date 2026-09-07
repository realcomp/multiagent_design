import { cn } from "@/lib/utils";

interface MetricCellProps {
  value: string | number;
  unit?: string;
  secondary?: string;
  className?: string;
}

export function MetricCell({ value, unit, secondary, className }: MetricCellProps) {
  return (
    <div className={cn("text-right", className)}>
      <div className="font-mono text-[13px] font-medium tabular-nums text-ink">
        {value}
        {unit ? <span className="ml-1 text-[11px] font-normal text-ink-muted">{unit}</span> : null}
      </div>
      {secondary ? <div className="mt-0.5 text-[10px] leading-tight text-ink-subtle">{secondary}</div> : null}
    </div>
  );
}
