import { Fragment } from "react";
import { ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ColumnPriority = "high" | "medium" | "low";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  priority?: ColumnPriority;
  numeric?: boolean;
  className?: string;
  render: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  expandedRowId?: string | null;
  onToggleRow?: (rowId: string) => void;
  renderExpanded?: (row: T) => React.ReactNode;
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
}

function priorityClass(priority: ColumnPriority = "high") {
  if (priority === "low") return "hidden lg:table-cell";
  if (priority === "medium") return "hidden sm:table-cell";
  return "";
}

export function DataTable<T>({
  columns,
  rows,
  getRowId,
  expandedRowId,
  onToggleRow,
  renderExpanded,
  loading = false,
  emptyTitle = "Нет данных",
  emptyDescription = "Здесь пока ничего нет.",
  className,
}: DataTableProps<T>) {
  const expandable = Boolean(onToggleRow && renderExpanded);

  return (
    <div className={cn("overflow-hidden border border-line bg-surface", className)}>
      <table className="w-full table-fixed border-collapse">
        <thead className="sticky top-0 z-10 bg-surface-muted">
          <tr className="border-b border-line">
            {expandable ? <th className="w-9 px-2 py-2.5" aria-label="Раскрыть строку" /> : null}
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  "px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-subtle",
                  column.numeric && "text-right",
                  priorityClass(column.priority),
                  column.className,
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 5 }).map((_, rowIndex) => (
              <tr key={`loading-${rowIndex}`} className="border-b border-line last:border-0">
                {expandable ? <td className="px-2 py-4" /> : null}
                {columns.map((column, columnIndex) => (
                  <td key={column.key} className={cn("px-3 py-4", priorityClass(column.priority))}>
                    <div
                      className={cn(
                        "h-3 animate-pulse rounded-sm bg-surface-muted-strong",
                        columnIndex === 0 ? "w-4/5" : "ml-auto w-1/2",
                      )}
                    />
                  </td>
                ))}
              </tr>
            ))
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (expandable ? 1 : 0)}>
                <div className="flex min-h-[236px] flex-col items-center justify-center px-6 text-center">
                  <div className="mb-3 flex size-9 items-center justify-center rounded-lg border border-line-strong bg-surface-muted text-ink-subtle">
                    <span className="size-2 rounded-full bg-ink-subtle" />
                  </div>
                  <p className="text-sm font-semibold text-ink">{emptyTitle}</p>
                  <p className="mt-1 max-w-xs text-xs leading-5 text-ink-muted">{emptyDescription}</p>
                </div>
              </td>
            </tr>
          ) : (
            rows.map((row) => {
              const rowId = getRowId(row);
              const isExpanded = expandedRowId === rowId;
              return (
                <Fragment key={rowId}>
                  <tr
                    key={rowId}
                    className={cn(
                      "group border-b border-line align-middle transition-colors last:border-0 hover:bg-blue-50/35",
                      isExpanded && "bg-blue-50/45",
                    )}
                  >
                    {expandable ? (
                      <td className="w-9 px-2 py-3">
                        <button
                          type="button"
                          className="flex size-5 items-center justify-center rounded text-ink-subtle transition-colors hover:bg-surface-muted-strong hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                          aria-label={isExpanded ? "Свернуть строку" : "Развернуть строку"}
                          aria-expanded={isExpanded}
                          onClick={() => onToggleRow?.(rowId)}
                        >
                          {isExpanded ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
                        </button>
                      </td>
                    ) : null}
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={cn(
                          "px-3 py-3 text-xs text-ink-muted",
                          column.numeric && "text-right",
                          priorityClass(column.priority),
                          column.className,
                        )}
                      >
                        {column.render(row)}
                      </td>
                    ))}
                  </tr>
                  {isExpanded ? (
                    <tr className="border-b border-line bg-surface-muted/55">
                      <td colSpan={columns.length + 1} className="px-4 py-4 sm:px-10">
                        {renderExpanded?.(row)}
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              );
            })
          )}
        </tbody>
      </table>
      {loading ? (
        <div className="sr-only" role="status">
          <Loader2 className="animate-spin" /> Загрузка данных
        </div>
      ) : null}
    </div>
  );
}
