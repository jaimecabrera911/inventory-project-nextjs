"use client";

type PaginationReportProps = {
  currentPage: number;
  totalPages: number;
  first: number;
  last: number;
  totalRecords: number;
};

export function PaginationReport({
  currentPage,
  totalPages,
  first,
  last,
  totalRecords,
}: PaginationReportProps) {
  return (
    <span
      aria-live="polite"
      className="ml-auto whitespace-nowrap pl-3 text-xs font-medium uppercase tracking-wide text-steel-600"
    >
      Página{" "}
      <span className="inventory-pag-current-page text-base">{currentPage}</span>
      <span className="text-steel-400"> / </span>
      <span className="font-mono-tech text-sm font-semibold text-steel-800">{totalPages}</span>
      <span className="mx-2 text-steel-300">·</span>
      <span className="tabular-nums">
        {first}–{last} de {totalRecords.toLocaleString("es-CO")}
      </span>
    </span>
  );
}

export const inventoryPaginatorTemplate = {
  layout:
    "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport",
  CurrentPageReport: (options: PaginationReportProps) => <PaginationReport {...options} />,
};
