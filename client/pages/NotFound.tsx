import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl items-center justify-center px-6 py-16">
      <div className="w-full border border-line bg-surface p-8">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-brand">404 / Not found</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ink">Страница не найдена</h1>
        <p className="mt-2 text-sm text-ink-muted">Проверьте адрес или вернитесь к списку запусков.</p>
        <Link to="/" className="mt-6 inline-flex h-9 items-center border border-line-strong px-3 text-xs font-semibold text-ink hover:border-brand hover:text-brand">Вернуться к запускам</Link>
      </div>
    </div>
  );
};

export default NotFound;
