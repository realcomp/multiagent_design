import { cn } from "@/lib/utils";

export type VerdictValue =
  | "support"
  | "support_with_modifications"
  | "insufficient_evidence"
  | "oppose"
  | "requires_user_data";

interface VerdictLabelProps {
  verdict: VerdictValue | null;
}

const verdictConfig: Record<VerdictValue, { label: string; text: string; dot: string }> = {
  support: {
    label: "поддерживает",
    text: "text-status-success",
    dot: "bg-status-success",
  },
  support_with_modifications: {
    label: "поддерживает с изменениями",
    text: "text-status-warning",
    dot: "bg-status-warning",
  },
  insufficient_evidence: {
    label: "недостаточно данных",
    text: "text-ink-muted",
    dot: "bg-ink-subtle",
  },
  oppose: {
    label: "не поддерживает",
    text: "text-status-failure",
    dot: "bg-status-failure",
  },
  requires_user_data: {
    label: "нужны данные пользователя",
    text: "text-status-warning",
    dot: "bg-status-warning",
  },
};

export function VerdictLabel({ verdict }: VerdictLabelProps) {
  if (verdict === null) return <span className="font-mono text-meta text-ink-subtle">—</span>;

  const config = verdictConfig[verdict];
  return (
    <span className={cn("inline-flex max-w-full items-center gap-1.5 text-label font-medium", config.text)}>
      <span className={cn("size-1.5 shrink-0 rounded-[2px]", config.dot)} />
      <span className="truncate">{config.label}</span>
    </span>
  );
}
