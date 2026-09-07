import { Check, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type PipelineStepState = "done" | "running" | "pending" | "failed";

export interface PipelineStep {
  name: string;
  state: PipelineStepState;
}

interface PipelineProgressProps {
  steps: PipelineStep[];
  currentStep?: string;
  nextStep?: string;
  className?: string;
}

const stateStyles: Record<PipelineStepState, string> = {
  done: "border-status-success bg-status-success text-white",
  running: "border-status-running bg-status-running-soft text-status-running",
  pending: "border-line-strong bg-surface text-ink-subtle",
  failed: "border-status-failure bg-status-failure text-white",
};

export function PipelineProgress({ steps, currentStep, nextStep, className }: PipelineProgressProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-start">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          return (
            <div key={step.name} className="flex min-w-0 flex-1 items-start">
              <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
                <div className="flex w-full items-center">
                  <span className="h-px flex-1 bg-transparent" />
                  <span
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-md border text-[10px] font-bold",
                      stateStyles[step.state],
                    )}
                    title={`${step.name}: ${step.state}`}
                  >
                    {step.state === "done" ? <Check className="size-3.5" strokeWidth={2.5} /> : null}
                    {step.state === "failed" ? <X className="size-3.5" strokeWidth={2.5} /> : null}
                    {step.state === "running" ? <Loader2 className="size-3.5 animate-spin" /> : null}
                    {step.state === "pending" ? <span className="size-1.5 rounded-full bg-current" /> : null}
                  </span>
                  {!isLast ? (
                    <span className={cn("h-px flex-1", step.state === "done" ? "bg-status-success" : "bg-line-strong")} />
                  ) : (
                    <span className="h-px flex-1 bg-transparent" />
                  )}
                </div>
                <span className="max-w-[96px] truncate text-center font-mono text-[10px] text-ink-muted">
                  {step.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      {currentStep || nextStep ? (
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 border-t border-line pt-2.5 text-[11px]">
          {currentStep ? (
            <span className="text-ink-muted">
              Текущий шаг <strong className="font-mono font-medium text-status-running">{currentStep}</strong>
            </span>
          ) : null}
          {nextStep ? (
            <span className="text-ink-muted">
              Далее <strong className="font-mono font-medium text-ink">{nextStep}</strong>
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
