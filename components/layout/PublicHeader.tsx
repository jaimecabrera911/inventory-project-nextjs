"use client";

import Image from "next/image";
import Link from "next/link";

export function PublicHeader() {
  return (
    <header className="grain border-b border-steel-200 bg-white">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-5 py-3.5 md:px-10 md:py-4">
        <div className="flex min-w-0 items-center gap-3.5 md:gap-5">
          <Link
            href="/products"
            className="shrink-0 transition-opacity hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
            aria-label="Todo Hierros — Inventario de rollos"
          >
            <Image
              src="/logo.png"
              alt="Todo Hierros"
              width={220}
              height={56}
              className="h-9 w-auto object-contain sm:h-10 md:h-11"
              priority
            />
          </Link>

          <div className="min-w-0 border-l border-steel-200 pl-3.5 md:pl-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-accent-600">
              Inventario
            </p>
            <h1 className="truncate text-lg font-bold tracking-tight text-steel-900 sm:text-xl md:text-2xl">
              Rollos
            </h1>
          </div>
        </div>

        <Link
          href="/login"
          className="inline-flex shrink-0 items-center gap-2 rounded-sm border border-steel-300 bg-steel-50 px-4 py-2 text-sm font-semibold text-steel-700 transition-colors hover:border-accent-500 hover:text-accent-700"
        >
          <i className="pi pi-lock text-xs" />
          <span className="hidden sm:inline">Acceso operador</span>
          <span className="sm:hidden">Operador</span>
        </Link>
      </div>
    </header>
  );
}
