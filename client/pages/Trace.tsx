"use client";

import { useState } from "react";
import { ArrowLeft, AlertTriangle, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { DataTable, type DataTableColumn } from "@/components/review/DataTable";
import { MetricCell } from "@/components/review/MetricCell";
import { StatusBadge, type AgentRunStatus } from "@/components/review/StatusBadge";
import { cn } from "@/lib/utils";

interface AgentRun {
  id: string;
  role: string;
  attempt: number;
  model: string;
  promptVersion: string;
  profile: string;
  status: AgentRunStatus;
  inputTokens: string;
  outputTokens: string;
  cost: string;
  latency: string;
  failure?: {
    kind: string;
    errors: string[];
    response: Record<string, unknown>;
  };
  input: string;
  output: string;
}

const agentStatusLabels: Record<AgentRunStatus, string> = {
  succeeded: "успешно",
  failed: "ошибка",
  running: "выполняется",
};

const verdictLabels: Record<string, string> = {
  support: "поддерживает",
  support_with_modifications: "поддерживает с изменениями",
  insufficient_evidence: "недостаточно данных",
  oppose: "не поддерживает",
  requires_user_data: "нужны данные пользователя",
};

const runs: AgentRun[] = [
  {
    id: "agent-run-framer-1",
    role: "framer",
    attempt: 1,
    model: "anthropic/claude-sonnet-5",
    promptVersion: "1.0.0",
    profile: "cheap",
    status: "succeeded",
    inputTokens: "2 992",
    outputTokens: "2 816",
    cost: "$0.0341",
    latency: "34 426",
    input: "Сформулируй проверяемую гипотезу из задачи пользователя.",
    output: "Добавление загрузки документов и платной модели монетизации должно повысить ценность сервиса при сохранении независимой проверки гипотез.",
  },
  {
    id: "agent-run-context-check-3",
    role: "context_check",
    attempt: 3,
    model: "anthropic/claude-sonnet-5",
    promptVersion: "1.0.0",
    profile: "cheap",
    status: "failed",
    inputTokens: "17 509",
    outputTokens: "1 825",
    cost: "$0.0533",
    latency: "22 696",
    failure: {
      kind: "schema_mismatch",
      errors: [
        "/arguments/0: must have required property 'claim'",
        "/arguments/0/evidence: must be an array",
        "/verdict: must be equal to one of the allowed values",
      ],
      response: { verdict: "support_with_modifications", evidence: "недостаточно данных" },
    },
    input: "Проверь контекст и наличие данных для оценки гипотезы.",
    output: "{\"verdict\":\"support_with_modifications\",\"evidence\":\"недостаточно данных\"}",
  },
  {
    id: "agent-run-advocate-1",
    role: "advocate",
    attempt: 1,
    model: "anthropic/claude-sonnet-5",
    promptVersion: "1.0.0",
    profile: "cheap",
    status: "succeeded",
    inputTokens: "5 790",
    outputTokens: "3 835",
    cost: "$0.0499",
    latency: "52 653",
    input: "Найди аргументы в пользу предложенной гипотезы.",
    output: "Документы расширяют контекст, а прозрачная тарификация создаёт понятный путь к монетизации.",
  },
  {
    id: "agent-run-skeptic-1",
    role: "skeptic",
    attempt: 1,
    model: "anthropic/claude-sonnet-5",
    promptVersion: "1.0.0",
    profile: "cheap",
    status: "succeeded",
    inputTokens: "5 792",
    outputTokens: "3 445",
    cost: "$0.0460",
    latency: "46 597",
    input: "Найди аргументы против предложенной гипотезы и её риски.",
    output: "Платный барьер может снизить конверсию, а загрузка документов потребует отдельной модели приватности и хранения.",
  },
  {
    id: "agent-run-alternatives-3",
    role: "alternatives",
    attempt: 3,
    model: "anthropic/claude-sonnet-5",
    promptVersion: "1.0.0",
    profile: "cheap",
    status: "failed",
    inputTokens: "17 074",
    outputTokens: "7 074",
    cost: "$0.1049",
    latency: "103 389",
    failure: {
      kind: "schema_mismatch",
      errors: [
        "/arguments/0: must have required property 'claim'",
        "/arguments/1/source: must be string",
      ],
      response: { alternatives: [{ title: "Партнёрская модель" }], source: null },
    },
    input: "Предложи альтернативные направления развития и способы проверить их.",
    output: "{\"alternatives\":[{\"title\":\"Партнёрская модель\"}],\"source\":null}",
  },
  {
    id: "agent-run-claim-extractor-3",
    role: "claim_extractor",
    attempt: 3,
    model: "anthropic/claude-sonnet-5",
    promptVersion: "1.0.0",
    profile: "cheap",
    status: "failed",
    inputTokens: "23 702",
    outputTokens: "12 000",
    cost: "$0.1674",
    latency: "114 546",
    failure: {
      kind: "schema_mismatch",
      errors: [
        "/claims/0: must have required property 'claim'",
        "/claims/0/confidence: must be number",
      ],
      response: { claims: [{ text: "Расширить сервис документами", confidence: "high" }] },
    },
    input: "Извлеки утверждения, на которых строится итоговая рекомендация.",
    output: "{\"claims\":[{\"text\":\"Расширить сервис документами\",\"confidence\":\"high\"}]}",
  },
];

export default function Trace() {
  const [expandedRowId, setExpandedRowId] = useState<string | null>(runs[1].id);

  const columns: DataTableColumn<AgentRun>[] = [
    {
      key: "role",
      header: "Роль",
      priority: "high",
      className: "w-[140px]",
      render: (run) => <span className="font-mono text-body-sm text-ink">{run.role}</span>,
    },
    {
      key: "attempt",
      header: "Попытка",
      priority: "high",
      numeric: true,
      className: "w-[84px]",
      render: (run) => <AttemptCell attempt={run.attempt} />,
    },
    {
      key: "model",
      header: "Модель",
      priority: "medium",
      className: "w-[220px]",
      render: (run) => <span className="font-mono text-meta text-ink-muted">{run.model}</span>,
    },
    {
      key: "promptVersion",
      header: "Версия prompt",
      priority: "low",
      className: "w-[112px]",
      render: (run) => <span className="font-mono text-meta text-ink-muted">{run.promptVersion}</span>,
    },
    {
      key: "profile",
      header: "Профиль",
      priority: "low",
      className: "w-[88px]",
      render: (run) => <span className="font-mono text-meta text-ink-muted">{run.profile}</span>,
    },
    {
      key: "status",
      header: "Статус",
      priority: "high",
      className: "w-[198px]",
      render: (run) => (
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={run.status} label={agentStatusLabels[run.status]} compact />
          {run.failure ? <span className="font-mono text-meta text-status-failure">{run.failure.kind}</span> : null}
        </div>
      ),
    },
    {
      key: "inputTokens",
      header: "Токены in",
      priority: "medium",
      numeric: true,
      className: "w-[100px]",
      render: (run) => <MetricCell value={run.inputTokens} />,
    },
    {
      key: "outputTokens",
      header: "Токены out",
      priority: "medium",
      numeric: true,
      className: "w-[100px]",
      render: (run) => <MetricCell value={run.outputTokens} />,
    },
    {
      key: "cost",
      header: "Стоимость",
      priority: "high",
      numeric: true,
      className: "w-[98px]",
      render: (run) => <MetricCell value={run.cost} />,
    },
    {
      key: "latency",
      header: "Латентность",
      priority: "medium",
      numeric: true,
      className: "w-[112px]",
      render: (run) => <MetricCell value={run.latency} unit="мс" />,
    },
  ];

  return (
    <div className="mx-auto max-w-[1480px] px-5 py-7 sm:px-8 lg:py-9">
      <Link to="/" className="mb-5 inline-flex items-center gap-1.5 text-body-sm text-ink-muted transition-colors hover:text-brand">
        <ArrowLeft className="size-4" /> К run
      </Link>

      <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h1 className="text-title font-semibold text-ink">Трассировка</h1>
            <span className="font-mono text-meta text-ink-muted">d9e5e1c7-2d02-4af9-b2de-fda4a1dd041b</span>
          </div>
          <p className="mt-1.5 max-w-3xl text-body-sm text-ink-muted">Поток выполнения ролей для одного запуска: модели, попытки, токены, стоимость и ошибки схемы.</p>
        </div>
        <StatusBadge status="running" label="выполняется" />
      </div>

      <SummaryStrip />

      <div className="mb-3 mt-7 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-subtitle font-semibold text-ink">Попытки агентов</h2>
          <p className="mt-1 text-body-sm text-ink-muted">Показаны 6 из 7 ролей. Следующая роль появится после завершения текущего шага.</p>
        </div>
        <span className="font-mono text-meta text-ink-subtle">agent_runs · 6 записей</span>
      </div>

      <DataTable
        columns={columns}
        rows={runs}
        getRowId={(run) => run.id}
        expandedRowId={expandedRowId}
        onToggleRow={(rowId) => setExpandedRowId(expandedRowId === rowId ? null : rowId)}
        emptyTitle="Попыток пока нет"
        emptyDescription="Роли ещё не начали выполнение для этого запуска."
        renderExpanded={(run) => <TraceExpanded run={run} />}
      />

      <div className="mt-4 flex flex-col justify-between gap-2 text-meta text-ink-subtle sm:flex-row sm:items-center">
        <span>Запуск выполняется · новые попытки появятся автоматически</span>
        <span className="font-mono">UTC+3 · обновлено только что</span>
      </div>
    </div>
  );
}

function SummaryStrip() {
  return (
    <div className="grid grid-cols-2 divide-x divide-y divide-line border-y border-line bg-surface sm:grid-cols-3 lg:grid-cols-6 lg:divide-y-0">
      <SummaryMetric label="Стоимость" value="$0.4557" />
      <SummaryMetric label="Токены in" value="72 859" unit="in" />
      <SummaryMetric label="Токены out" value="30 995" unit="out" />
      <SummaryMetric label="Общее время" value="374 307" unit="мс" />
      <SummaryMetric label="Роли" value="6 / 7" secondary="одна в работе" />
      <SummaryMetric label="Ошибки" value="3" secondary="попытки" tone="failure" />
      <div className="col-span-2 flex min-w-0 items-center justify-between gap-4 px-4 py-3.5 sm:col-span-3 lg:col-span-6 lg:border-t lg:border-line lg:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="text-label text-ink-subtle">Вердикт</span>
          <span className="truncate text-body-sm font-medium text-ink">{verdictLabels.support_with_modifications}</span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="text-label text-ink-subtle">Уверенность</span>
          <ConfidenceIndicator />
        </div>
      </div>
    </div>
  );
}

function SummaryMetric({ label, value, unit, secondary, tone = "neutral" }: { label: string; value: string; unit?: string; secondary?: string; tone?: "neutral" | "failure" }) {
  return (
    <div className="min-w-0 px-4 py-3.5 sm:px-5">
      <div className="flex items-center gap-2">
        <span className={cn("size-1.5 rounded-full", tone === "failure" ? "bg-status-failure" : "bg-ink-subtle")} />
        <span className="truncate text-label text-ink-subtle">{label}</span>
      </div>
      <MetricCell value={value} unit={unit} secondary={secondary} className="mt-1.5" />
    </div>
  );
}

function ConfidenceIndicator() {
  return (
    <div className="flex items-center gap-2" title="Уверенность: средняя">
      <span className="flex items-end gap-[2px]" aria-hidden="true">
        {[1, 2, 3].map((bar) => <span key={bar} className={cn("w-1 rounded-[1px]", bar <= 2 ? "bg-confidence-medium" : "bg-line-strong")} style={{ height: 5 + bar * 3 }} />)}
      </span>
      <span className="text-label text-ink">средняя</span>
    </div>
  );
}

function AttemptCell({ attempt }: { attempt: number }) {
  if (attempt === 1) return <span className="font-mono text-meta text-ink-muted">1</span>;
  return (
    <span className="inline-flex items-center gap-1 rounded-[4px] border border-status-warning/30 bg-status-warning-soft px-1.5 py-1 font-mono text-meta text-status-warning" title={`Повторная попытка: ${attempt}`}>
      <RotateCcw className="size-3" /> {attempt}
    </span>
  );
}

function TraceExpanded({ run }: { run: AgentRun }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.7fr)]">
      <div className="min-w-0">
        {run.failure ? (
          <div className="border border-status-failure/25 bg-status-failure-soft p-4">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-status-failure" />
              <div className="min-w-0">
                <h3 className="text-subtitle font-semibold text-ink">Причина ошибки</h3>
                <p className="mt-1 text-body-sm text-ink-muted">Тип ошибки: <span className="font-mono text-meta text-status-failure">{run.failure.kind}</span></p>
              </div>
            </div>
            <ul className="mt-3 space-y-1.5 border-t border-status-failure/20 pt-3">
              {run.failure.errors.map((error) => <li key={error} className="font-mono text-meta text-ink">{error}</li>)}
            </ul>
          </div>
        ) : (
          <div className="border border-status-success/25 bg-status-success-soft p-4">
            <h3 className="text-subtitle font-semibold text-ink">Результат роли</h3>
            <p className="mt-1 text-body-sm text-ink-muted">Вызов завершился успешно и передал результат следующей роли.</p>
          </div>
        )}
      </div>
      <div className="min-w-0 space-y-2">
        <details className="border border-line bg-surface">
          <summary className="cursor-pointer px-3 py-2.5 text-body-sm font-medium text-ink hover:bg-surface-muted">Сырой ответ модели</summary>
          <pre className="border-t border-line bg-surface-muted p-3 font-mono text-meta leading-relaxed text-ink-muted whitespace-pre-wrap break-words">{JSON.stringify(run.failure?.response ?? { output: run.output }, null, 2)}</pre>
        </details>
        <details className="border border-line bg-surface">
          <summary className="cursor-pointer px-3 py-2.5 text-body-sm font-medium text-ink hover:bg-surface-muted">Вход и выход агента</summary>
          <div className="grid gap-3 border-t border-line bg-surface-muted p-3">
            <div><p className="text-label text-ink-subtle">Вход</p><p className="mt-1 text-body-sm leading-relaxed text-ink">{run.input}</p></div>
            <div><p className="text-label text-ink-subtle">Выход</p><p className="mt-1 text-body-sm leading-relaxed text-ink">{run.output}</p></div>
          </div>
        </details>
      </div>
    </div>
  );
}
