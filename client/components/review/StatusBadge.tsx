import {
  Check,
  CircleDashed,
  Clock3,
  Loader2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type RunStatus =
  | "completed"
  | "failed"
  | "running"
  | "partial"
  | "waiting_for_user"
  | "resuming";

export type AgentRunStatus = "succeeded" | "failed" | "running";
export type StatusBadgeStatus = RunStatus | AgentRunStatus;

const statusConfig: Record<
  StatusBadgeStatus,
  {
    icon: typeof Check;
    className: string;
    iconClassName?: string;
  }
> = {
  completed: {
    icon: Check,
    className: "border-status-success/30 bg-status-success-soft text-status-success",
  },
  succeeded: {
    icon: Check,
    className: "border-status-success/30 bg-status-success-soft text-status-success",
  },
  failed: {
    icon: X,
    className: "border-status-failure/30 bg-status-failure-soft text-status-failure",
  },
  running: {
    icon: Loader2,
    className: "border-status-running/30 bg-status-running-soft text-status-running",
    iconClassName: "animate-spin",
  },
  waiting_for_user: {
    icon: Clock3,
    className: "border-status-pending/30 bg-status-pending-soft text-status-pending",
  },
  resuming: {
    icon: Loader2,
    className: "border-status-running/30 bg-status-running-soft text-status-running",
    iconClassName: "animate-spin",
  },
  partial: {
    icon: CircleDashed,
    className: "border-status-warning/30 bg-status-warning-soft text-status-warning",
  },
};

interface StatusBadgeProps {
  status: StatusBadgeStatus;
  label: string;
  compact?: boolean;
  className?: string;
}

export function StatusBadge({ status, label, compact = false, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 border px-2 py-1 text-label font-semibold",
        compact ? "rounded-[4px]" : "rounded-md",
        config.className,
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex size-3.5 items-center justify-center rounded-[3px] border border-current",
          config.iconClassName,
        )}
      >
        <Icon className="size-2.5" strokeWidth={2.5} />
      </span>
      <span>{label}</span>
    </span>
  );
}
