"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, CircleAlert, FlaskConical, Lightbulb, Minus, Plus, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";
import { ConfidenceIndicator, type ConfidenceLevel } from "@/components/review/ConfidenceIndicator";
import { MetricCell } from "@/components/review/MetricCell";
import { PipelineProgress, type PipelineStep } from "@/components/review/PipelineProgress";
import { StatusBadge } from "@/components/review/StatusBadge";
import { VerdictLabel, type VerdictValue } from "@/components/review/VerdictLabel";
import { cn } from "@/lib/utils";

interface Argument {
  localId: string;
  claim: string;
  reasoning: string;
  importance: "high" | "medium" | "low";
  criterionIds: string[];
  verificationHint: string;
}

const runId = "d9e5e1c7-2d02-4af9-b2de-fda4a1dd041b";

const advocateArguments: Argument[] = [
  {
    localId: "ARG-S-001",
    claim: "Загрузка документов превращает общий диалог в инструмент работы с конкретным контекстом пользователя.",
    reasoning: "Сейчас ценность сервиса ограничена тем, что пользователь успел пересказать в задаче. Документы дадут агентам фактическую базу для проверки гипотез и позволят разбирать решения, где важны детали, история и несколько независимых источников.",
    importance: "high",
    criterionIds: ["CRT-001", "CRT-003"],
    verificationHint: "false",
  },
  {
    localId: "ARG-S-002",
    claim: "Модель первых бесплатных прогонов снижает барьер для знакомства с многоагентной проверкой.",
    reasoning: "Пользователю проще оценить качество результата на собственном вопросе, если первый опыт не требует оплаты. Ограничение по числу бесплатных прогонов одновременно оставляет понятную точку перехода к платному тарифу.",
    importance: "high",
    criterionIds: ["CRT-002", "CRT-004"],
    verificationHint: "false",
  },
  {
    localId: "ARG-S-003",
    claim: "Прозрачная наценка поверх стоимости моделей может быть понятнее подписки с фиксированной ценой.",
    reasoning: "Сервис показывает стоимость каждого запуска и использованных моделей, поэтому связь между потреблением и ценой можно объяснить прямо в интерфейсе. Это особенно подходит технической аудитории, которая хочет понимать, за что именно платит.",
    importance: "medium",
    criterionIds: ["CRT-002"],
    verificationHint: "true",
  },
  {
    localId: "ARG-S-004",
    claim: "Документы создают естественный повод возвращаться к сервису для повторной проверки решений.",
    reasoning: "Если результат связан с рабочим документом, пользователь может обновить входные данные и запустить ревью заново. Такой сценарий формирует повторное использование без превращения продукта в обычный чат.",
    importance: "medium",
    criterionIds: ["CRT-003"],
    verificationHint: "false",
  },
  {
    localId: "ARG-S-005",
    claim: "Набор альтернатив помогает продукту отличаться от одиночного ответа одной модели.",
    reasoning: "Даже при одинаковом качестве отдельных моделей последовательность ролей, явный спор и отдельный блок альтернатив дают пользователю более полезную структуру для принятия решения.",
    importance: "low",
    criterionIds: ["CRT-001"],
    verificationHint: "false",
  },
  {
    localId: "ARG-S-006",
    claim: "Показывая стоимость и reasoning, сервис может завоевать доверие аналитиков и продуктовых менеджеров.",
    reasoning: "Целевая аудитория привыкла проверять источники, допущения и ограничения. Наблюдаемая цепочка исполнения делает результат проверяемым и оставляет место для профессионального несогласия.",
    importance: "low",
    criterionIds: ["CRT-004"],
    verificationHint: "false",
  },
  {
    localId: "ARG-S-007",
    claim: "Платный доступ к более дорогим моделям может стать понятным расширением базового сценария.",
    reasoning: "Пользователь начинает с дешёвого профиля, видит пользу от независимой проверки, а затем может осознанно выбирать более дорогой режим для критичных решений.",
    importance: "low",
    criterionIds: ["CRT-002", "CRT-004"],
    verificationHint: "true",
  },
];

const skepticArguments: Argument[] = [
  {
    localId: "ARG-O-001",
    claim: "Загрузка документов добавляет сложный контур приватности и может остановить внедрение раньше монетизации.",
    reasoning: "Документы могут содержать персональные, финансовые или коммерческие данные. До запуска функции потребуются ограничения форматов, политика хранения, удаление и понятное объяснение того, какие модели видят содержимое.",
    importance: "high",
    criterionIds: ["CRT-005", "CRT-006"],
    verificationHint: "false",
  },
  {
    localId: "ARG-O-002",
    claim: "Наценка x2 может выглядеть несправедливой, если пользователь не понимает объём работы системы.",
    reasoning: "Стоимость моделей не является для большинства людей понятной единицей ценности. Если результат окажется спорным, пользователь воспримет стоимость всех параллельных вызовов как переплату, а не как независимую проверку.",
    importance: "high",
    criterionIds: ["CRT-002", "CRT-004"],
    verificationHint: "false",
  },
  {
    localId: "ARG-O-003",
    claim: "Два бесплатных запуска могут быть недостаточны для формирования устойчивой привычки.",
    reasoning: "Пользователь может потратить бесплатные попытки на любопытство или тестовый вопрос и уйти до того, как поймёт ценность. Количество прогонов само по себе не объясняет правильный момент для конверсии.",
    importance: "medium",
    criterionIds: ["CRT-002"],
    verificationHint: "false",
  },
  {
    localId: "ARG-O-004",
    claim: "Более длинный reasoning не гарантирует более точного решения.",
    reasoning: "Несколько агентов могут убедительно повторить одну и ту же ошибочную предпосылку. Без независимых источников и измеримых критериев продукт рискует создавать ощущение строгости вместо реальной проверки.",
    importance: "medium",
    criterionIds: ["CRT-001", "CRT-003"],
    verificationHint: "false",
  },
  {
    localId: "ARG-O-005",
    claim: "Сценарий загрузки документов расширяет поддержку, хранение и обработку ошибок.",
    reasoning: "Помимо LLM-вызовов появятся проблемы OCR, таблиц, больших файлов и повреждённых форматов. Каждая ошибка в этом слое будет восприниматься как ошибка всего ревью.",
    importance: "medium",
    criterionIds: ["CRT-005"],
    verificationHint: "false",
  },
  {
    localId: "ARG-O-006",
    claim: "Дешёвый профиль может недостаточно хорошо работать на сложных документах.",
    reasoning: "Если первые бесплатные результаты будут поверхностными, пользователь сделает вывод о продукте до того, как увидит более дорогие модели. Тарифная лестница не исправит плохой первый опыт.",
    importance: "low",
    criterionIds: ["CRT-001", "CRT-002"],
    verificationHint: "true",
  },
  {
    localId: "ARG-O-007",
    claim: "Пользователь может не захотеть платить за рекомендацию без измеримого результата.",
    reasoning: "Для продуктовых решений важно показать, что изменилось после ревью: скорость, конверсия, риск или качество решения. Без такого критерия сервис останется полезным, но необязательным инструментом.",
    importance: "low",
    criterionIds: ["CRT-003", "CRT-004"],
    verificationHint: "false",
  },
];

const pipelineSteps: PipelineStep[] = [
  { name: "framer", state: "done" },
  { name: "context_check", state: "failed" },
  { name: "advocate", state: "done" },
  { name: "skeptic", state: "done" },
  { name: "alternatives", state: "running" },
  { name: "claim_extractor", state: "pending" },
  { name: "judge", state: "pending" },
];

export default function RunDetail() {
  return (
    <div className="mx-auto max-w-[1200px] px-5 py-7 sm:px-8 lg:py-10">
      <Link to="/" className="mb-7 inline-flex items-center gap-1.5 text-body-sm text-ink-muted transition-colors hover:text-brand">
        <ArrowLeft className="size-4" /> К списку запусков
      </Link>

      <section className="border-b border-line pb-9" aria-labelledby="task-heading">
        <p className="mb-3 text-label font-semibold text-ink-subtle">Задача</p>
        <h1 id="task-heading" className="max-w-[72ch] text-title font-semibold leading-tight text-ink">
          Предложи мне вектора для развития сервиса. Я думаю, что можно добавить в него загрузку документов, добавить «платность» в формате «первые два прогона на недорогих моделях бесплатно, а далее — по тарифу x2 от реальной стоимости». Пользователь закачивает средства себе на депозит и при прогонах тратит деньги оттуда. Возможно, что-то еще в технической части, подумай.
        </h1>
        <p className="mt-5 font-mono text-meta text-ink-subtle">run_id · {runId}</p>
      </section>

      <div className="mt-6 border border-status-warning/25 bg-status-warning-soft px-4 py-3.5" role="status">
        <div className="flex items-start gap-3">
          <CircleAlert className="mt-0.5 size-4 shrink-0 text-status-warning" />
          <p className="text-body-sm text-ink">Прогон на профиле «debug»: отладочный, содержательной ценности не имеет.</p>
        </div>
      </div>

      <section className="mt-10 border-b border-line pb-9" aria-labelledby="progress-heading">
        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-label font-semibold text-ink-subtle">Состояние запуска</p>
            <h2 id="progress-heading" className="mt-1 text-subtitle font-semibold text-ink">Проверка выполняется</h2>
          </div>
          <StatusBadge status="running" label="выполняется" />
        </div>
        <div className="bg-surface p-4 sm:p-5">
          <PipelineProgress steps={pipelineSteps} currentStep="alternatives" nextStep="claim_extractor" />
        </div>
        <div className="mt-3 flex items-start gap-2 border-l-2 border-status-failure bg-status-failure-soft px-3 py-2.5">
          <ShieldAlert className="mt-0.5 size-4 shrink-0 text-status-failure" />
          <p className="text-body-sm text-ink-muted">Роль <span className="font-mono text-meta text-ink">context_check</span> завершилась с ошибкой схемы, но запуск продолжается по доступным результатам.</p>
        </div>
      </section>

      <section className="mt-10 border-b border-line pb-10" aria-labelledby="verdict-heading">
        <div className="flex flex-col gap-5 border border-line bg-surface p-5 sm:p-7 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-[72ch]">
            <p className="text-label font-semibold text-ink-subtle">Предварительный вердикт</p>
            <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-3">
              <h2 id="verdict-heading" className="text-subtitle font-semibold text-ink">Результат проверки</h2>
              <VerdictLabel verdict="support_with_modifications" />
              <ConfidenceIndicator level="medium" />
            </div>
            <p className="mt-4 text-body leading-relaxed text-ink">Идея выглядит перспективной как следующий слой продукта, но её нельзя запускать только через тарифную механику. Сначала нужно подтвердить, что пользователи готовы доверять сервису документы и понимают пользу независимого ревью настолько, чтобы платить за каждый запуск.</p>
          </div>
          <div className="grid shrink-0 grid-cols-2 gap-5 border-l border-line pl-5">
            <MetricCell value="$0.29" secondary="стоимость" />
            <MetricCell value="5 / 7" secondary="роли готовы" />
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-8 border-b border-line pb-10 lg:grid-cols-2" aria-labelledby="hypothesis-heading">
        <ArticleBlock icon={<Lightbulb className="size-4" />} title="Переформулированная гипотеза" headingId="hypothesis-heading">
          Добавление безопасной загрузки документов и платной модели с двумя бесплатными прогонами увеличит повторное использование сервиса и конверсию в оплату, если пользователь видит прозрачную стоимость и понимает, какую дополнительную уверенность дают независимые роли.
        </ArticleBlock>
        <ArticleBlock icon={<FlaskConical className="size-4" />} title="Вопрос для решения" headingId="decision-heading">
          Готовы ли целевые пользователи загружать рабочие документы и платить за многоагентное ревью, когда система показывает стоимость, ограничения и проверяемые основания рекомендации?
        </ArticleBlock>
      </section>

      <section className="mt-10 border-b border-line pb-10" aria-labelledby="adversarial-heading">
        <div className="mb-6 max-w-[72ch]">
          <p className="text-label font-semibold text-ink-subtle">Независимая проверка</p>
          <h2 id="adversarial-heading" className="mt-1 text-subtitle font-semibold text-ink">Аргументы за и против</h2>
          <p className="mt-2 text-body leading-relaxed text-ink-muted">Каждая сторона разбирает гипотезу отдельно. Карточки показывают исходное утверждение, ход рассуждения и критерии, по которым его можно проверить.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <ArgumentColumn position="support" title="За" subtitle="advocate" arguments={advocateArguments} />
          <ArgumentColumn position="oppose" title="Против" subtitle="skeptic" arguments={skepticArguments} />
        </div>
      </section>

      <section className="mt-10 grid gap-8 border-b border-line pb-10 lg:grid-cols-[1.1fr_0.9fr]" aria-labelledby="alternatives-heading">
        <div>
          <p className="text-label font-semibold text-ink-subtle">Другие направления</p>
          <h2 id="alternatives-heading" className="mt-1 text-subtitle font-semibold text-ink">Альтернативы</h2>
          <div className="mt-4 space-y-3">
            <Alternative title="Платный пакет проверки" text="Продавать не отдельный запуск, а пакет из нескольких ревью с общей историей и сравнением версий." />
            <Alternative title="Командный workspace" text="Сделать совместную работу с источниками, аргументами и решениями главным платным сценарием." />
            <Alternative title="Отчёт для принятия решения" text="Сначала проверить спрос на экспорт структурированного отчёта без хранения исходных документов." />
          </div>
        </div>
        <div className="border border-line bg-surface-muted p-5">
          <p className="text-label font-semibold text-ink-subtle">Что проверить первым</p>
          <h3 className="mt-1 text-subtitle font-semibold text-ink">Тест на готовность платить</h3>
          <p className="mt-3 max-w-[52ch] text-body leading-relaxed text-ink-muted">Дать десяти пользователям один и тот же сценарий: загрузить документ, получить ревью и выбрать цену следующего запуска до показа результата. Сравнить оплату с готовностью поделиться документом.</p>
        </div>
      </section>

      <section className="mt-10 grid gap-8 border-b border-line pb-10 lg:grid-cols-2" aria-labelledby="unknowns-heading">
        <div>
          <p className="text-label font-semibold text-ink-subtle">Ограничения результата</p>
          <h2 id="unknowns-heading" className="mt-1 text-subtitle font-semibold text-ink">Критические неизвестные</h2>
          <ul className="mt-4 space-y-3">
            <Unknown text="Какие типы документов пользователи готовы передавать внешней модели?" />
            <Unknown text="Какая доля результата должна быть проверяема по источникам, а не только по reasoning?" />
            <Unknown text="Будет ли депозит понятнее пользователю, чем оплата каждого запуска?" />
            <Unknown text="Какой минимальный выигрыш в качестве оправдывает ожидание и стоимость семи ролей?" />
          </ul>
        </div>
        <div className="border border-status-success/25 bg-status-success-soft p-5">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-status-success" />
            <div>
              <p className="text-label font-semibold text-status-success">Рекомендованное действие</p>
              <h3 className="mt-1 text-subtitle font-semibold text-ink">Провести concierge-тест</h3>
              <p className="mt-3 max-w-[52ch] text-body leading-relaxed text-ink">Не начинать с полноценного хранилища. Вручную обработать ограниченный набор документов, показать пользователю стоимость каждого прогона и измерить повторный запуск, оплату и готовность рекомендовать сценарий.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="mt-8 flex flex-col gap-4 border border-line bg-surface px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="font-mono text-meta text-ink-muted">{runId}</span>
          <span className="font-mono text-meta text-ink-subtle">profile · debug</span>
          <MetricCell value="$0.29" secondary="стоимость" />
        </div>
        <Link to="/trace" className="inline-flex items-center gap-2 text-body-sm font-medium text-brand transition-colors hover:text-brand-dark">Открыть Trace <ArrowRight className="size-4" /></Link>
      </footer>
    </div>
  );
}

function ArticleBlock({ icon, title, headingId, children }: { icon: React.ReactNode; title: string; headingId: string; children: React.ReactNode }) {
  return (
    <article className="max-w-[72ch]">
      <div className="flex items-center gap-2 text-brand">{icon}<h2 id={headingId} className="text-subtitle font-semibold text-ink">{title}</h2></div>
      <p className="mt-3 text-body leading-relaxed text-ink">{children}</p>
    </article>
  );
}

function ArgumentColumn({ position, title, subtitle, arguments: argumentList }: { position: "support" | "oppose"; title: string; subtitle: string; arguments: Argument[] }) {
  const [showAll, setShowAll] = useState(false);
  const visibleArguments = showAll ? argumentList : argumentList.filter((argument) => argument.importance === "high");
  const hiddenCount = argumentList.length - visibleArguments.length;
  const support = position === "support";

  return (
    <div className={cn("min-w-0 border-t-4 p-4 sm:p-5", support ? "border-status-success bg-status-success-soft/45" : "border-status-failure bg-status-failure-soft/45")}>
      <div className="mb-4 flex items-end justify-between gap-3 border-b border-line/70 pb-3">
        <div><h3 className="text-subtitle font-semibold text-ink">{title}</h3><p className="mt-0.5 font-mono text-meta text-ink-muted">{subtitle} · {argumentList.length} аргументов</p></div>
        <span className={cn("text-label font-semibold", support ? "text-status-success" : "text-status-failure")}>{support ? "поддержка" : "возражение"}</span>
      </div>
      <div className="space-y-3">
        {visibleArguments.map((argument) => <ArgumentCard key={argument.localId} argument={argument} position={position} />)}
      </div>
      {hiddenCount > 0 ? <button type="button" onClick={() => setShowAll(true)} className="mt-4 inline-flex items-center gap-1.5 text-body-sm font-medium text-ink-muted hover:text-ink"><Plus className="size-4" /> показать ещё {hiddenCount}</button> : showAll ? <button type="button" onClick={() => setShowAll(false)} className="mt-4 inline-flex items-center gap-1.5 text-body-sm font-medium text-ink-muted hover:text-ink"><Minus className="size-4" /> свернуть менее важные</button> : null}
      <div className="mt-6 border-t border-line/70 pt-4">
        <p className="text-label font-semibold text-ink-subtle">Слабые места стороны</p>
        <ul className="mt-2 space-y-2 text-body-sm leading-relaxed text-ink-muted">
          {(support ? ["Ценность загрузки документов требует проверки на реальных сценариях.", "Переход от бесплатного опыта к депозиту пока не подтверждён.", "Неизвестно, какая часть аудитории готова делиться рабочими файлами.", "Не проверено, возвращаются ли пользователи к ревью после первого результата.", "Неясно, какой формат отчёта помогает принять решение быстрее."] : ["Сложность приватности может задержать запуск функции.", "Стоимость семи ролей сложно объяснить без измеримого эффекта.", "Качество дешёвого профиля на документах не проверено.", "Не измерена точность извлечения фактов из разных форматов.", "Не определён безопасный срок хранения исходных документов."]).map((point) => <li key={point} className="flex gap-2"><span className="mt-2 size-1 shrink-0 rounded-full bg-ink-subtle" />{point}</li>)}
        </ul>
      </div>
    </div>
  );
}

function ArgumentCard({ argument, position }: { argument: Argument; position: "support" | "oppose" }) {
  return (
    <article className="border border-line bg-surface p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono text-meta text-ink-subtle">{argument.localId}</span>
        <span className={cn("text-label font-medium", argument.importance === "high" ? (position === "support" ? "text-status-success" : "text-status-failure") : "text-ink-muted")}>{argument.importance === "high" ? "важно" : argument.importance}</span>
      </div>
      <h4 className="text-body font-semibold leading-relaxed text-ink">{argument.claim}</h4>
      <p className="mt-2 text-body leading-relaxed text-ink-muted">{argument.reasoning}</p>
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-3">
        {argument.criterionIds.map((criterion) => <span key={criterion} className="rounded-[3px] border border-line-strong px-1.5 py-1 font-mono text-meta text-ink-muted">{criterion}</span>)}
        <span className="font-mono text-meta text-ink-subtle">проверка · {argument.verificationHint}</span>
      </div>
    </article>
  );
}

function Alternative({ title, text }: { title: string; text: string }) {
  return <article className="border-l-2 border-brand bg-brand-soft px-4 py-3"><h3 className="text-body font-semibold text-ink">{title}</h3><p className="mt-1 text-body leading-relaxed text-ink-muted">{text}</p></article>;
}

function Unknown({ text }: { text: string }) {
  return <li className="flex max-w-[65ch] gap-3 text-body leading-relaxed text-ink"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-status-warning" />{text}</li>;
}
