"use client";

import Link from "next/link";

export function PublicHeader() {
  return (
    <header className="grain border-b border-steel-200 bg-white">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-5 py-4 md:px-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-600">
            Inventario
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-steel-900 md:text-3xl">
            Rollos
          </h1>
        </div>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 rounded-sm border border-steel-300 bg-steel-50 px-4 py-2 text-sm font-semibold text-steel-700 transition-colors hover:border-accent-500 hover:text-accent-700"
        >
          <i className="pi pi-lock text-xs" />
          Acceso operador
        </Link>
      </div>
    </header>
  );
}
