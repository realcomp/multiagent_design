"use client";

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
        <p className="text-label font-semibold text-brand">404 / Not found</p>
        <h1 className="mt-3 text-body font-semibold text-ink">Страница не найдена</h1>
        <p className="mt-2 text-body-sm text-ink-muted">Проверьте адрес или вернитесь к списку запусков.</p>
        <Link to="/" className="mt-6 inline-flex h-9 items-center border border-line-strong px-3 text-label font-semibold text-ink hover:border-brand hover:text-brand">Вернуться к запускам</Link>
      </div>
    </div>
  );
};

export default NotFound;
