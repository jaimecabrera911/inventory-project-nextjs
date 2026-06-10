"use client";

import { classNames } from "primereact/utils";

const ROW_COUNT = 15;

const COLUMNS = [
  { key: "check", label: "", width: "3rem", type: "checkbox" as const },
  { key: "rollo", label: "Rollo", width: "7rem", type: "mono" as const, bone: "w-[4.5rem]" },
  { key: "calibre", label: "Calibre", width: "8rem", type: "mono" as const, bone: "w-24" },
  { key: "ral", label: "RAL", width: "4.5rem", type: "mono" as const, bone: "w-10" },
  { key: "color", label: "Color", width: "6rem", type: "text" as const, bone: "w-14" },
  { key: "peso", label: "Peso kg", width: "5.5rem", type: "mono" as const, bone: "w-12" },
  { key: "ingreso", label: "Ingreso", width: "6.5rem", type: "mono" as const, bone: "w-16" },
  { key: "importador", label: "Importador", width: "7rem", type: "text" as const, bone: "w-16" },
  { key: "obs", label: "Observaciones", width: "11rem", type: "text" as const, bone: "w-36" },
  { key: "estado", label: "Estado", width: "7rem", type: "tag" as const },
] as const;

function Shimmer({
  className,
  delayMs = 0,
}: {
  className?: string;
  delayMs?: number;
}) {
  return (
    <span
      className={classNames("skeleton-shimmer inline-block rounded-sm", className)}
      style={{ "--shimmer-delay": `${delayMs}ms` } as React.CSSProperties}
      aria-hidden
    />
  );
}

function HeaderCell({ label }: { label: string }) {
  if (!label) return null;

  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-steel-700">
      {label}
      <Shimmer className="h-2 w-2 rounded-full opacity-80" />
    </span>
  );
}

function CellContent({
  type,
  bone,
  rowIndex,
}: {
  type: (typeof COLUMNS)[number]["type"];
  bone?: string;
  rowIndex: number;
}) {
  const delay = (rowIndex % 7) * 45;

  if (type === "checkbox") {
    return <Shimmer className="mx-auto block h-4 w-4 rounded-[3px]" delayMs={delay} />;
  }

  if (type === "tag") {
    return <Shimmer className="block h-5 w-[4.25rem] rounded-sm" delayMs={delay} />;
  }

  return (
    <Shimmer
      className={classNames("block h-3", bone, type === "mono" && "font-mono-tech")}
      delayMs={delay}
    />
  );
}

function FilterSkeleton({ label }: { label: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10px] font-bold uppercase tracking-wider text-steel-500">{label}</span>
      <div className="flex h-[2.375rem] items-center rounded-sm border border-steel-300 bg-white px-3">
        <Shimmer className="h-3 w-16" />
        <Shimmer className="ml-auto h-3 w-3 rounded-sm" />
      </div>
    </div>
  );
}

export function InventoryTableSkeleton() {
  return (
    <section
      className="inventory-shell overflow-hidden rounded-sm border border-steel-200 bg-white shadow-sm"
      aria-busy="true"
      aria-label="Cargando inventario"
    >
      {/* Toolbar — misma estructura que InventoryToolbar */}
      <div className="border-b border-steel-200 bg-steel-50 px-4 py-4 md:px-5">
        <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-600">
              Consulta
            </p>
            <div className="mt-1 flex items-center gap-2 text-sm text-steel-600">
              <Shimmer className="h-5 w-14" />
              <span>rollos registrados</span>
            </div>
          </div>

          <div className="relative w-full lg:max-w-sm">
            <i
              aria-hidden
              className="pi pi-search pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-sm text-steel-300"
            />
            <div className="h-[2.375rem] w-full rounded-sm border border-steel-300 bg-white pl-9 pr-3 pt-2.5">
              <Shimmer className="block h-3 w-40 max-w-full" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] xl:items-end">
          <FilterSkeleton label="Estado" />
          <FilterSkeleton label="Calibre" />
          <FilterSkeleton label="Color" />
          <div className="flex h-[2.375rem] items-center justify-center rounded-sm border border-steel-300 bg-white px-4 sm:justify-start">
            <Shimmer className="h-3 w-28" />
          </div>
        </div>
      </div>

      {/* Tabla — gridlines + filas como DataTable */}
      <div className="inventory-scroll">
        <table className="inventory-grid inventory-grid--skeleton w-full min-w-[72rem] border-collapse text-sm">
          <thead className="bg-steel-100">
            <tr>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className="border border-steel-200 px-3 py-2.5 text-left align-middle"
                  style={{ minWidth: col.width, width: col.width }}
                >
                  <HeaderCell label={col.label} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: ROW_COUNT }).map((_, rowIndex) => (
              <tr
                key={rowIndex}
                className={classNames(
                  "border-b border-steel-100",
                  rowIndex % 2 === 1 && "bg-steel-50/60"
                )}
              >
                {COLUMNS.map((col) => (
                  <td
                    key={col.key}
                    className="border border-steel-200 px-3 py-2 align-middle"
                    style={{ minWidth: col.width, height: "2.5rem" }}
                  >
                    <CellContent
                      type={col.type}
                      bone={"bone" in col ? col.bone : undefined}
                      rowIndex={rowIndex}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginador */}
      <div className="inventory-paginator flex flex-wrap items-center gap-1 border-t border-steel-200 bg-white px-4 py-2.5">
        {Array.from({ length: 2 }).map((_, i) => (
          <Shimmer key={`nav-${i}`} className="h-8 w-8 rounded-sm" delayMs={i * 60} />
        ))}
        {Array.from({ length: 5 }).map((_, i) => (
          <Shimmer
            key={`page-${i}`}
            className={classNames("h-8 rounded-sm", i === 0 ? "w-8 bg-accent-100" : "w-8")}
            delayMs={i * 40}
          />
        ))}
        {Array.from({ length: 2 }).map((_, i) => (
          <Shimmer key={`nav2-${i}`} className="h-8 w-8 rounded-sm" delayMs={i * 60} />
        ))}
        <div className="ml-2 flex h-8 items-center gap-1 rounded-sm border border-steel-200 bg-white px-2">
          <Shimmer className="h-3 w-6" />
          <Shimmer className="h-3 w-3" />
        </div>
        <Shimmer className="ml-auto h-4 w-44 max-w-[50%]" />
      </div>
    </section>
  );
}
