"use client";

import { useState } from "react";
import { DataTable, type DataTableColumn } from "@/components/review/DataTable";
import { MetricCell } from "@/components/review/MetricCell";
import { PipelineProgress, type PipelineStep } from "@/components/review/PipelineProgress";
import { StatusBadge, type StatusBadgeStatus } from "@/components/review/StatusBadge";

const pipelineSteps: PipelineStep[] = [
  { name: "framer", state: "done" },
  { name: "context_check", state: "done" },
  { name: "advocate", state: "running" },
  { name: "skeptic", state: "pending" },
  { name: "alternatives", state: "pending" },
  { name: "claim_extractor", state: "failed" },
  { name: "judge", state: "pending" },
];

const statusStates: Array<{ status: StatusBadgeStatus; label: string }> = [
  { status: "completed", label: "завершён" },
  { status: "succeeded", label: "успешно" },
  { status: "failed", label: "ошибка" },
  { status: "running", label: "выполняется" },
  { status: "waiting_for_user", label: "ждёт ответа" },
  { status: "resuming", label: "возобновляется" },
  { status: "partial", label: "частично" },
];

interface SpecimenRow {
  id: string;
  name: string;
  status: string;
}

const specimenColumns: DataTableColumn<SpecimenRow>[] = [
  { key: "name", header: "Пример", priority: "high", render: (row) => <span className="font-medium text-ink">{row.name}</span> },
  { key: "status", header: "Статус", priority: "medium", render: (row) => <span className="font-mono text-meta text-ink-muted">{row.status}</span> },
  { key: "value", header: "Значение", priority: "low", numeric: true, render: () => <MetricCell value="$0.29" secondary="34 426 мс" /> },
];

export default function Components() {
  const [expandedRowId, setExpandedRowId] = useState<string | null>("status");

  return (
    <div className="mx-auto max-w-[1480px] px-5 py-8 sm:px-8 lg:py-10">
      <div className="mb-8 max-w-2xl">
        <p className="mb-2 text-label font-semibold text-brand">Design system / v1.0</p>
        <h1 className="text-title font-semibold text-ink">Основа интерфейса</h1>
        <p className="mt-2 text-body-sm text-ink-muted">Общие токены и примитивы для Runs, Trace и Run detail. Спокойная плотность данных, явные состояния, машинные значения без визуального шума.</p>
      </div>

      <section className="mb-8" aria-labelledby="tokens-heading">
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            <h2 id="tokens-heading" className="text-subtitle font-semibold text-ink">Токены</h2>
          </div>
          <span className="hidden text-meta text-ink-subtle sm:block">8px spacing scale · light theme</span>
        </div>
        <div className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-surface p-4">
            <p className="token-label">Семантические статусы</p>
            <div className="mt-3 space-y-2 text-body-sm">
              <TokenSwatch name="success" className="bg-status-success" />
              <TokenSwatch name="failure" className="bg-status-failure" />
              <TokenSwatch name="pending" className="bg-status-pending" />
              <TokenSwatch name="warning" className="bg-status-warning" />
              <TokenSwatch name="neutral" className="bg-ink-subtle" />
            </div>
          </div>
          <div className="bg-surface p-4">
            <p className="token-label">Уверенность</p>
            <div className="mt-3 space-y-2 text-body-sm">
              <TokenSwatch name="низкая" className="bg-confidence-low" />
              <TokenSwatch name="средняя" className="bg-confidence-medium" />
              <TokenSwatch name="высокая" className="bg-confidence-high" />
            </div>
          </div>
          <div className="bg-surface p-4">
            <p className="token-label">Типографика</p>
            <div className="mt-3 space-y-3">
              <div><p className="text-body font-semibold text-ink">Prose / 18</p><p className="mt-0.5 text-meta text-ink-subtle">Inter · 600</p></div>
              <div><p className="font-mono text-body-sm text-ink">$0.0341 · 34 426 мс</p><p className="mt-0.5 text-meta text-ink-subtle">IBM Plex Mono · 500</p></div>
            </div>
          </div>
          <div className="bg-surface p-4">
            <p className="token-label">Ритм</p>
            <div className="mt-3 flex items-end gap-3">
              {[1, 2, 3, 4, 5].map((step) => <div key={step} className="flex flex-col items-center gap-1"><span className="block bg-brand/80" style={{ height: step * 8, width: 8 }} /><span className="font-mono text-meta text-ink-subtle">{step * 8}</span></div>)}
            </div>
          </div>
        </div>
      </section>

      <section className="mb-8" aria-labelledby="primitives-heading">
        <div className="mb-3">
          <h2 id="primitives-heading" className="text-subtitle font-semibold text-ink">Общие примитивы</h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <ShowcaseCard title="StatusBadge" description="Статус читается цветом, геометрией и текстом.">
            <div className="flex flex-wrap gap-2">
              {statusStates.map(({ status, label }) => <StatusBadge key={`${status}-${label}`} status={status} label={label} />)}
            </div>
          </ShowcaseCard>
          <ShowcaseCard title="MetricCell" description="Компактные значения для cost, tokens и latency.">
            <div className="grid grid-cols-3 divide-x divide-line border border-line bg-surface-muted">
              <MetricCell value="$0.0341" secondary="стоимость" className="p-3" />
              <MetricCell value="2 992" unit="in" secondary="токены" className="p-3" />
              <MetricCell value="34 426" unit="мс" secondary="латентность" className="p-3" />
            </div>
          </ShowcaseCard>
          <ShowcaseCard title="PipelineProgress" description="Текущий и следующий шаг всегда видны рядом с цепочкой.">
            <PipelineProgress steps={pipelineSteps} currentStep="advocate" nextStep="skeptic" />
          </ShowcaseCard>
          <ShowcaseCard title="DataTable" description="Плотные строки, sticky header, приоритеты колонок и раскрытие.">
            <DataTable
              columns={specimenColumns}
              rows={[{ id: "status", name: "Результат проверки", status: "succeeded" }]}
              getRowId={(row) => row.id}
              expandedRowId={expandedRowId}
              onToggleRow={(rowId) => setExpandedRowId(expandedRowId === rowId ? null : rowId)}
              renderExpanded={() => <p className="text-body-sm text-ink-muted">Раскрытая область для input/output роли или дополнительного контекста.</p>}
            />
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div>
                <p className="mb-1.5 text-meta text-ink-subtle">loading</p>
                <DataTable columns={specimenColumns} rows={[]} getRowId={(row) => row.id} loading />
              </div>
              <div>
                <p className="mb-1.5 text-meta text-ink-subtle">empty</p>
                <DataTable columns={specimenColumns} rows={[]} getRowId={(row) => row.id} emptyTitle="Нет запусков" emptyDescription="Состояние пустого результата без данных." />
              </div>
            </div>
          </ShowcaseCard>
        </div>
      </section>

      <div className="border-t border-line pt-5 text-body-sm text-ink-subtle">Эти компоненты не завязаны на данные Runs и готовы к использованию в следующих экранах.</div>
    </div>
  );
}

function TokenSwatch({ name, className }: { name: string; className: string }) {
  return <div className="flex items-center gap-2"><span className={`size-3 rounded-[3px] ${className}`} /><span className="text-meta text-ink-muted">{name}</span></div>;
}

function ShowcaseCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return <div className="border border-line bg-surface p-4 sm:p-5"><div className="mb-4 flex items-start justify-between gap-4"><div><h3 className="text-subtitle font-semibold text-ink">{title}</h3><p className="mt-1 text-body-sm text-ink-muted">{description}</p></div><span className="rounded-[3px] border border-line-strong px-1.5 py-1 text-meta text-ink-subtle">shared</span></div>{children}</div>;
}
