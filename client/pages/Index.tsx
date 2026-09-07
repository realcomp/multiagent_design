"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, ChevronDown, Filter, Plus, Search, SlidersHorizontal } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/review/DataTable";
import { MetricCell } from "@/components/review/MetricCell";
import { PipelineProgress, type PipelineStep } from "@/components/review/PipelineProgress";
import { StatusBadge, type RunStatus } from "@/components/review/StatusBadge";
import { cn } from "@/lib/utils";

interface Run {
  id: string;
  date: string;
  task: string;
  status: RunStatus;
  verdict: "requires_user_data" | "insufficient_evidence" | "—";
  confidence: "низкая" | "средняя" | "высокая" | "—";
  profile: "cheap" | "debug" | "mock";
  cost: string;
  progress?: { current: string; next: string; failed?: string };
}

const pipelineNames = ["framer", "context_check", "advocate", "skeptic", "alternatives", "claim_extractor", "judge"];

const runs: Run[] = [
  {
    id: "d9e5e1c7-2d02-4af9-b2de-fda4a1dd041b",
    date: "07.09.2026, 03:34:39",
    task: "Предложи мне вектора для развития сервиса. Я думаю, что можно добавить в него загрузку документов, добавить «платность» в формате «первые два прогона на недорогих моделях бесплатно, а далее — по тарифу x2 от реальной стоимости».",
    status: "running",
    verdict: "—",
    confidence: "—",
    profile: "cheap",
    cost: "$0.29",
    progress: { current: "claim_extractor", next: "judge" },
  },
  {
    id: "7bd2a4de-5b9a-47a4-b0b7-a8e8a31db742",
    date: "06.09.2026, 20:41:28",
    task: "Мне 53 года, у меня уже есть сын, жене 35 лет, была одна неудачная прервавшаяся беременность. Как лучше планировать следующий шаг?",
    status: "completed",
    verdict: "requires_user_data",
    confidence: "низкая",
    profile: "cheap",
    cost: "$0.54",
  },
  {
    id: "1a9c5e0b-6b9c-4ad5-a839-9375e56de1fd",
    date: "06.09.2026, 20:27:56",
    task: "Во что лучше вложить 100000 шекелей сроком на три года?",
    status: "completed",
    verdict: "requires_user_data",
    confidence: "низкая",
    profile: "debug",
    cost: "$0.15",
  },
  {
    id: "2df4f532-7701-4102-9e13-1f5a53ba235e",
    date: "06.09.2026, 20:16:30",
    task: "Во что лучше вложить 100000 шекелей сроком на три года?",
    status: "partial",
    verdict: "—",
    confidence: "—",
    profile: "debug",
    cost: "$0.14",
  },
  {
    id: "1f1e39cc-1e9c-4f34-bd54-e93b99f0a1a3",
    date: "06.09.2026, 19:47:03",
    task: "Во что лучше вложить 100000 шекелей сроком на три года?",
    status: "partial",
    verdict: "—",
    confidence: "—",
    profile: "debug",
    cost: "$0.08",
  },
  {
    id: "9f70d002-b3ce-4a7d-bb5a-1a19b6d88c84",
    date: "06.09.2026, 19:46:11",
    task: "Во что лучше вложить 100000 шекелей сроком на три года?",
    status: "completed",
    verdict: "insufficient_evidence",
    confidence: "низкая",
    profile: "mock",
    cost: "$0.00",
  },
  {
    id: "e78a9e48-9c9a-42c1-bb58-1a2c8b6f4d21",
    date: "06.09.2026, 19:05:32",
    task: "Во что лучше вложить 100000 шекелей сроком на три года?",
    status: "running",
    verdict: "—",
    confidence: "—",
    profile: "debug",
    cost: "$0.09",
    progress: { current: "advocate", next: "skeptic" },
  },
  {
    id: "8df92e8b-2b09-4493-b33c-6fb6fc7bb0a1",
    date: "06.09.2026, 18:57:58",
    task: "Во что лучше вложить 100000 шекелей сроком на три года?",
    status: "partial",
    verdict: "—",
    confidence: "—",
    profile: "debug",
    cost: "$0.13",
  },
  {
    id: "5f2a4b01-aab0-4c52-a83e-ef4ad6d8a6f8",
    date: "06.09.2026, 12:05:05",
    task: "Во что лучше вложить 100000 шекелей сроком на три года?",
    status: "partial",
    verdict: "—",
    confidence: "—",
    profile: "debug",
    cost: "$0.14",
  },
  {
    id: "3dcb47bd-1c54-4b28-b1b8-a7cb54ba5d6e",
    date: "06.09.2026, 04:46:47",
    task: "Падение конверсии в онбординге вызвано новым шагом подтверждения телефона",
    status: "completed",
    verdict: "—",
    confidence: "—",
    profile: "mock",
    cost: "$0.00",
  },
];

const runStatusLabels: Record<RunStatus, string> = {
  running: "выполняется",
  completed: "завершён",
  partial: "частично",
  failed: "провален",
  waiting_for_user: "ждёт ответа",
  resuming: "возобновляется",
};

const filters = [
  { key: "all", label: "все" },
  { key: "running", label: "выполняется" },
  { key: "waiting_for_user", label: "ждёт ответа" },
  { key: "completed", label: "завершён" },
  { key: "partial", label: "частично" },
  { key: "failed", label: "провален" },
] as const;

export default function Index() {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]["key"]>("all");
  const [expandedRowId, setExpandedRowId] = useState<string | null>(runs[0].id);
  const [search, setSearch] = useState("");
  const [showNewRun, setShowNewRun] = useState(false);

  const visibleRuns = useMemo(() => {
    return runs.filter((run) => {
      const matchesFilter = activeFilter === "all" || run.status === activeFilter;
      const matchesSearch = `${run.task} ${run.profile} ${run.verdict}`.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, search]);

  const counts = useMemo(() => Object.fromEntries(filters.map((filter) => [filter.key, filter.key === "all" ? runs.length : runs.filter((run) => run.status === filter.key).length])), []);

  const columns: DataTableColumn<Run>[] = [
    {
      key: "date",
      header: "Дата",
      priority: "low",
      className: "w-[154px]",
      render: (run) => <span className="font-mono text-meta text-ink-subtle">{run.date}</span>,
    },
    {
      key: "task",
      header: "Задача",
      priority: "high",
      className: "w-[min(40vw,460px)]",
      render: (run) => (
        <div className="min-w-0">
          <p className="line-clamp-2 text-body font-medium text-ink">{run.task}</p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Статус",
      priority: "medium",
      className: "w-[126px]",
      render: (run) => <StatusBadge status={run.status} label={runStatusLabels[run.status]} compact />,
    },
    {
      key: "verdict",
      header: "Вердикт",
      priority: "medium",
      className: "w-[154px]",
      render: (run) => <Verdict value={run.verdict} />,
    },
    {
      key: "confidence",
      header: "Уверенность",
      priority: "medium",
      className: "w-[122px]",
      render: (run) => <Confidence value={run.confidence} />,
    },
    {
      key: "cost",
      header: "Стоимость",
      priority: "high",
      numeric: true,
      className: "w-[92px]",
      render: (run) => <MetricCell value={run.cost} />,
    },
  ];

  return (
    <div className="mx-auto max-w-[1480px] px-5 py-7 sm:px-8 lg:py-9">
      <div className="mb-7 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <h1 className="text-title font-semibold text-ink">Запуски</h1>
          <p className="mt-1.5 max-w-2xl text-body-sm text-ink-muted">Все проверки гипотез и решений в одном месте. Откройте строку, чтобы увидеть ход пайплайна.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowNewRun((value) => !value)}
          className="inline-flex h-9 items-center justify-center gap-2 self-start rounded-md bg-brand px-3.5 text-label font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 lg:self-auto"
        >
          <Plus className="size-3.5" /> Новый run
        </button>
      </div>

      {showNewRun ? (
        <div className="mb-6 border border-brand/25 bg-brand-soft p-4 sm:p-5">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div><p className="text-subtitle font-semibold text-ink">Новая проверка</p><p className="mt-1 text-body-sm text-ink-muted">Опишите гипотезу, которую нужно проверить несколькими независимыми ролями.</p></div>
            <button type="button" className="inline-flex h-8 shrink-0 items-center justify-center gap-2 rounded-md border border-brand/30 bg-surface px-3 text-label font-semibold text-brand hover:bg-brand-soft"><ArrowUpRight className="size-3.5" /> Открыть форму</button>
          </div>
        </div>
      ) : null}

      <div className="mb-6 grid grid-cols-2 divide-x divide-line border-y border-line bg-surface sm:grid-cols-4">
        <Summary label="Всего запусков" value={`${runs.length}`} detail="за последнее время" />
        <Summary label="Выполняются" value={`${runs.filter((run) => run.status === "running").length}`} detail="требуют внимания" tone="blue" />
        <Summary label="Завершены" value={`${runs.filter((run) => run.status === "completed").length}`} detail="с финальным ответом" tone="green" />
        <Summary label="Средняя стоимость" value="$0.16" detail="на один запуск" />
      </div>

      <div className="mb-3 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex max-w-full items-center gap-1 overflow-x-auto border-b border-line pb-px" role="tablist" aria-label="Фильтр по статусу">
          {filters.map((filter) => {
            const active = activeFilter === filter.key;
            return <button key={filter.key} type="button" role="tab" aria-selected={active} onClick={() => setActiveFilter(filter.key)} className={cn("flex shrink-0 items-center gap-1.5 border-b-2 px-2.5 py-2 text-label transition-colors", active ? "border-brand font-semibold text-brand" : "border-transparent text-ink-muted hover:border-line-strong hover:text-ink")}><span>{filter.label}</span><span className={cn("font-mono text-meta", active ? "text-brand" : "text-ink-subtle")}>{counts[filter.key]}</span></button>;
          })}
        </div>
        <div className="flex items-center gap-2">
          <label className="relative block min-w-0 flex-1 sm:w-56 sm:flex-none"><Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-ink-subtle" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Поиск запусков" className="h-8 w-full border border-line-strong bg-surface pl-8 pr-3 text-label text-ink outline-none placeholder:text-ink-subtle focus:border-brand focus:ring-1 focus:ring-brand" /></label>
          <button type="button" className="inline-flex h-8 items-center gap-1.5 border border-line-strong bg-surface px-2.5 text-label text-ink-muted hover:border-brand hover:text-brand"><SlidersHorizontal className="size-3.5" /> <span className="hidden sm:inline">Фильтры</span></button>
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={visibleRuns}
        getRowId={(run) => run.id}
        expandedRowId={expandedRowId}
        onToggleRow={(rowId) => setExpandedRowId(expandedRowId === rowId ? null : rowId)}
        emptyTitle={search ? "Ничего не найдено" : "Запусков пока нет"}
        emptyDescription={search ? "Измените запрос или выберите другой фильтр." : "Создайте первый run, чтобы начать проверку гипотезы."}
        renderExpanded={(run) => <RunExpanded run={run} />}
      />

      <div className="mt-4 flex flex-col justify-between gap-2 text-meta text-ink-subtle sm:flex-row sm:items-center"><span>Показано {visibleRuns.length} из {runs.length} запусков</span><span className="font-mono">Обновлено только что · UTC+3</span></div>
    </div>
  );
}

function Summary({ label, value, detail, tone = "neutral" }: { label: string; value: string; detail: string; tone?: "neutral" | "blue" | "green" }) {
  return <div className="min-w-0 px-4 py-3.5 sm:px-5"><div className="flex items-center gap-2"><span className={cn("size-1.5 rounded-full", tone === "blue" ? "bg-brand" : tone === "green" ? "bg-status-success" : "bg-ink-subtle")} /><span className="truncate text-label text-ink-subtle">{label}</span></div><p className="mt-1.5 font-mono text-body font-medium text-ink">{value}</p><p className="mt-0.5 truncate text-meta text-ink-subtle">{detail}</p></div>;
}

function Verdict({ value }: { value: Run["verdict"] }) {
  if (value === "—") return <span className="font-mono text-meta text-ink-subtle">—</span>;
  const label = value === "requires_user_data" ? "нужны данные" : "недостаточно данных";
  return <span className={cn("inline-flex max-w-full items-center gap-1.5 text-label font-medium", value === "requires_user_data" ? "text-status-warning" : "text-ink-muted")}><span className={cn("size-1.5 shrink-0 rounded-[2px]", value === "requires_user_data" ? "bg-status-warning" : "bg-ink-subtle")} /><span className="truncate">{label}</span></span>;
}

function Confidence({ value }: { value: Run["confidence"] }) {
  if (value === "—") return <span className="font-mono text-meta text-ink-subtle">—</span>;
  const level = value === "низкая" ? 1 : value === "средняя" ? 2 : 3;
  const color = value === "низкая" ? "bg-confidence-low" : value === "средняя" ? "bg-confidence-medium" : "bg-confidence-high";
  return <div className="flex items-center gap-2" title={`Уверенность: ${value}`}><span className="flex items-end gap-[2px]" aria-hidden="true">{[1, 2, 3].map((bar) => <span key={bar} className={cn("w-1 rounded-[1px]", bar <= level ? color : "bg-line-strong")} style={{ height: 5 + bar * 3 }} />)}</span><span className="text-label text-ink-muted">{value}</span></div>;
}

function RunExpanded({ run }: { run: Run }) {
  const steps: PipelineStep[] = pipelineNames.map((name) => {
    if (run.status === "completed") return { name, state: "done" };
    if (run.progress?.failed === name) return { name, state: "failed" };
    if (run.progress?.current === name) return { name, state: "running" };
    if (run.progress && pipelineNames.indexOf(name) < pipelineNames.indexOf(run.progress.current)) return { name, state: "done" };
    return { name, state: "pending" };
  });
  return <div className="grid gap-4 lg:grid-cols-[1fr_280px] lg:items-start"><div><div className="mb-3 flex items-center justify-between gap-3"><div><p className="text-subtitle font-semibold text-ink-subtle">Прогресс пайплайна</p><p className="mt-1 text-body-sm text-ink-muted">Каждая роль выполняется отдельным вызовом модели.</p></div><span className="font-mono text-meta text-ink-subtle">7 ролей</span></div><PipelineProgress steps={steps} currentStep={run.progress?.current} nextStep={run.progress?.next} /></div><div className="border-l border-line pl-0 lg:pl-4"><p className="text-subtitle font-semibold text-ink-subtle">Метаданные</p><dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-meta"><div><dt className="text-ink-subtle">profile</dt><dd className="mt-0.5 font-mono text-ink">{run.profile}</dd></div><div><dt className="text-ink-subtle">стоимость</dt><dd className="mt-0.5 font-mono text-ink">{run.cost}</dd></div><div className="col-span-2"><dt className="text-ink-subtle">run_id</dt><dd className="mt-0.5 truncate font-mono text-meta text-ink-muted">{run.id}</dd></div></dl></div></div>;
}
