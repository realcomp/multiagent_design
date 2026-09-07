import { Activity, Boxes, CircleHelp, GitBranch, LogOut } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex h-16 max-w-[1480px] items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5" aria-label="AI Review Board">
              <span className="relative flex size-7 items-center justify-center rounded-[7px] bg-brand text-white">
                <span className="absolute size-3.5 rounded-[4px] border-2 border-white/90" />
                <span className="absolute size-1.5 rounded-full bg-white" />
              </span>
              <span className="text-body font-semibold text-ink">AI Review Board</span>
            </Link>
            <nav className="hidden items-center gap-1 md:flex" aria-label="Основная навигация">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  cn(
                    "inline-flex items-center gap-2 border-b-2 px-3 py-[22px] text-label font-medium transition-colors",
                    isActive ? "border-brand text-ink" : "border-transparent text-ink-muted hover:text-ink",
                  )
                }
              >
                <Activity className="size-3.5" /> Запуски
              </NavLink>
              <NavLink
                to="/trace"
                className={({ isActive }) =>
                  cn(
                    "inline-flex items-center gap-2 border-b-2 px-3 py-[22px] text-label font-medium transition-colors",
                    isActive ? "border-brand text-ink" : "border-transparent text-ink-muted hover:text-ink",
                  )
                }
              >
                <GitBranch className="size-3.5" /> Трассировка
              </NavLink>
              <NavLink
                to="/components"
                className={({ isActive }) =>
                  cn(
                    "inline-flex items-center gap-2 border-b-2 px-3 py-[22px] text-label font-medium transition-colors",
                    isActive ? "border-brand text-ink" : "border-transparent text-ink-muted hover:text-ink",
                  )
                }
              >
                <Boxes className="size-3.5" /> Компоненты
              </NavLink>
            </nav>
          </div>
          <div className="flex items-center gap-4 text-label">
            <button type="button" className="hidden items-center gap-1.5 text-ink-muted transition-colors hover:text-ink sm:flex">
              <CircleHelp className="size-3.5" /> Помощь
            </button>
            <span className="hidden h-4 w-px bg-line-strong sm:block" />
            <span className="text-meta text-ink-muted">real310@gmail.com</span>
            <button type="button" className="inline-flex items-center gap-1.5 text-ink-muted transition-colors hover:text-ink">
              <LogOut className="size-3.5" /> Выйти
            </button>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
