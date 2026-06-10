"use client";

import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { DataTableFilterMeta } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { FilterMultiSelect, SimpleMultiSelect } from "./FilterMultiSelect";
import { WeightCalculatorBar } from "./WeightCalculatorBar";

const estadoOptions = ["activo", "destapado", "sin existencias"];

type InventoryToolbarProps = {
  totalRecords: number;
  globalFilter: string;
  filters: DataTableFilterMeta;
  calibreOptions: string[];
  colorOptions: string[];
  selectedCount: number;
  totalWeightKg: number;
  onGlobalFilterChange: (value: string) => void;
  onFiltersChange: (filters: DataTableFilterMeta) => void;
  onClearFilters: () => void;
  onClearSelection: () => void;
};

export function InventoryToolbar({
  totalRecords,
  globalFilter,
  filters,
  calibreOptions,
  colorOptions,
  selectedCount,
  totalWeightKg,
  onGlobalFilterChange,
  onFiltersChange,
  onClearFilters,
  onClearSelection,
}: InventoryToolbarProps) {
  const estadoFilter = (filters.estado as { value: string[] | null })?.value ?? null;
  const calibreFilter = (filters.calibre as { value: string[] | null })?.value ?? null;
  const colorFilter = (filters.color as { value: string[] | null })?.value ?? null;

  const updateFilter = (field: string, value: string[] | null) => {
    onFiltersChange({
      ...filters,
      [field]: { value, matchMode: FilterMatchMode.IN },
    });
  };

  return (
    <div className="border-b border-steel-200 bg-steel-50 px-4 py-4 md:px-5">
      <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-600">
            Consulta
          </p>
          <p className="mt-1 text-sm text-steel-600">
            <span className="font-mono-tech text-base font-semibold text-steel-900">
              {totalRecords.toLocaleString("es-CO")}
            </span>{" "}
            rollos registrados
          </p>
        </div>

        <div className="relative w-full lg:max-w-sm">
          <i
            aria-hidden
            className="pi pi-search pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-sm text-steel-400"
          />
          <InputText
            value={globalFilter}
            onChange={(e) => onGlobalFilterChange(e.target.value)}
            placeholder="Buscar rollo, RAL, color…"
            className="w-full !py-2 !pl-9 !pr-3"
          />
        </div>
      </div>

      <WeightCalculatorBar
        selectedCount={selectedCount}
        totalWeightKg={totalWeightKg}
        onClearSelection={onClearSelection}
        className="mb-4 rounded-sm"
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] xl:items-end">
        <FilterField label="Estado">
          <SimpleMultiSelect
            value={estadoFilter}
            options={estadoOptions}
            onChange={(v) => updateFilter("estado", v)}
            placeholder="Todos"
            selectedItemsLabel="{0} estados"
          />
        </FilterField>

        <FilterField label="Calibre">
          <FilterMultiSelect
            value={calibreFilter}
            options={calibreOptions}
            onChange={(v) => updateFilter("calibre", v)}
            placeholder="Todos"
            searchPlaceholder="Buscar calibre…"
            selectedItemsLabel="{0} calibres"
          />
        </FilterField>

        <FilterField label="Color">
          <FilterMultiSelect
            value={colorFilter}
            options={colorOptions}
            onChange={(v) => updateFilter("color", v)}
            placeholder="Todos"
            searchPlaceholder="Buscar color…"
            selectedItemsLabel="{0} colores"
          />
        </FilterField>

        <Button
          type="button"
          label="Limpiar filtros"
          icon="pi pi-filter-slash"
          outlined
          severity="secondary"
          onClick={onClearFilters}
          className="w-full shrink-0 sm:w-auto"
        />
      </div>
    </div>
  );
}

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold uppercase tracking-wider text-steel-500">
        {label}
      </label>
      {children}
    </div>
  );
}
