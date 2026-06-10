"use client";

import { checkboxPt } from "@/theme/checkbox.pt";
import { InputText } from "primereact/inputtext";
import {
  MultiSelect,
  MultiSelectChangeEvent,
  MultiSelectPassThroughOptions,
} from "primereact/multiselect";
import { classNames } from "primereact/utils";
import { useMemo, useState } from "react";

const MS_CHEVRON_ICON = (
  <i className="pi pi-chevron-down text-[11px] leading-none" aria-hidden />
);

function buildSelectPt(hasValue: boolean): MultiSelectPassThroughOptions {
  return {
    root: {
      className: classNames(
        "inventory-ms-root group relative flex w-full min-w-[10rem] items-stretch overflow-hidden rounded-sm border bg-white transition-[border-color,box-shadow]",
        hasValue
          ? "border-steel-400 shadow-[inset_3px_0_0_0_var(--accent-500)]"
          : "border-steel-300 hover:border-steel-400"
      ),
    },
    labelContainer: {
      className:
        "flex min-h-[2.375rem] min-w-0 flex-1 cursor-pointer items-center bg-transparent pl-3 pr-2",
    },
    label: {
      className: classNames(
        "block flex-1 truncate text-sm leading-tight",
        hasValue ? "font-medium text-steel-900" : "text-steel-500"
      ),
    },
    clearIcon: { className: "hidden" },
    trigger: {
      className:
        "inventory-ms-trigger flex w-8 shrink-0 cursor-pointer items-center justify-center border-l border-steel-200 text-steel-500 transition-colors group-hover:text-steel-700",
    },
    triggerIcon: { className: "hidden" },
    dropdownIcon: {
      className: "pointer-events-none flex items-center justify-center",
    },
    panel: {
      className:
        "z-50 mt-1 min-w-[var(--overlay-panel-width,14rem)] overflow-hidden rounded-sm border border-steel-200 bg-white shadow-lg",
    },
    header: { className: "border-b border-steel-200 bg-steel-50 p-0" },
    headerCheckboxContainer: { className: "hidden" },
    closeButton: { className: "hidden" },
    closeIcon: { className: "hidden" },
    wrapper: { className: "max-h-56 overflow-y-auto" },
    list: { className: "m-0 list-none p-1.5" },
    item: ({ context }: { context?: { selected?: boolean } }) => ({
      className: classNames(
        "flex cursor-pointer items-center gap-2.5 rounded-sm px-2.5 py-2 text-sm transition-colors",
        context?.selected
          ? "bg-accent-50 font-medium text-accent-900"
          : "text-steel-800 hover:bg-steel-100"
      ),
    }),
    checkboxContainer: { className: "flex shrink-0 items-center justify-center" },
    checkbox: checkboxPt,
    emptyMessage: { className: "px-3 py-4 text-center text-sm text-steel-500" },
  };
}

function PanelClearFooter({ visible, onClear }: { visible: boolean; onClear: () => void }) {
  if (!visible) return null;

  return (
    <div className="border-t border-steel-200 px-2 py-1.5">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClear();
        }}
        className="flex w-full items-center justify-center gap-1.5 rounded-sm px-2 py-2 text-xs font-semibold uppercase tracking-wide text-steel-500 transition-colors hover:bg-steel-100 hover:text-steel-800"
      >
        <i className="pi pi-times text-[10px]" aria-hidden />
        Quitar filtro
      </button>
    </div>
  );
}

type FilterMultiSelectProps = {
  value: string[] | null;
  options: string[];
  placeholder?: string;
  searchPlaceholder?: string;
  selectedItemsLabel?: string;
  onChange: (value: string[] | null) => void;
};

export function FilterMultiSelect({
  value,
  options,
  placeholder = "Todos",
  searchPlaceholder = "Buscar…",
  selectedItemsLabel = "{0} seleccionados",
  onChange,
}: FilterMultiSelectProps) {
  const [query, setQuery] = useState("");
  const hasValue = Boolean(value && value.length > 0);
  const pt = useMemo(() => buildSelectPt(hasValue), [hasValue]);

  const filteredOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((opt) => opt.toLowerCase().includes(q));
  }, [options, query]);

  const handleChange = (e: MultiSelectChangeEvent) => {
    onChange(e.value?.length ? e.value : null);
  };

  const handleClear = () => {
    onChange(null);
    setQuery("");
  };

  const searchHeader = (
    <div className="p-2">
      <div className="relative">
        <i
          aria-hidden
          className="pi pi-search pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[10px] text-steel-400"
        />
        <InputText
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full !border-steel-200 !py-2 !pl-8 !pr-7 !text-sm"
          onKeyDown={(e) => e.stopPropagation()}
        />
        {query && (
          <button
            type="button"
            aria-label="Limpiar búsqueda"
            onClick={(e) => {
              e.stopPropagation();
              setQuery("");
            }}
            className="absolute right-1.5 top-1/2 z-10 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-sm text-steel-400 hover:bg-steel-100 hover:text-steel-600"
          >
            <i className="pi pi-times text-[9px]" aria-hidden />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <MultiSelect
      value={value ?? []}
      options={filteredOptions}
      onChange={handleChange}
      onHide={() => setQuery("")}
      placeholder={placeholder}
      pt={pt}
      dropdownIcon={MS_CHEVRON_ICON}
      selectedItemsLabel={selectedItemsLabel}
      maxSelectedLabels={1}
      showSelectAll={false}
      showClear={false}
      panelHeaderTemplate={() => searchHeader}
      panelFooterTemplate={() => (
        <PanelClearFooter visible={hasValue} onClear={handleClear} />
      )}
      emptyMessage={query ? "Sin coincidencias" : "Sin opciones"}
    />
  );
}

type SimpleMultiSelectProps = {
  value: string[] | null;
  options: string[];
  placeholder?: string;
  selectedItemsLabel?: string;
  onChange: (value: string[] | null) => void;
};

export function SimpleMultiSelect({
  value,
  options,
  placeholder = "Todos",
  selectedItemsLabel = "{0} seleccionados",
  onChange,
}: SimpleMultiSelectProps) {
  const hasValue = Boolean(value && value.length > 0);
  const pt = useMemo(() => buildSelectPt(hasValue), [hasValue]);

  const handleChange = (e: MultiSelectChangeEvent) => {
    onChange(e.value?.length ? e.value : null);
  };

  return (
    <MultiSelect
      value={value ?? []}
      options={options}
      onChange={handleChange}
      placeholder={placeholder}
      pt={pt}
      dropdownIcon={MS_CHEVRON_ICON}
      selectedItemsLabel={selectedItemsLabel}
      maxSelectedLabels={1}
      showSelectAll={false}
      showClear={false}
      panelHeaderTemplate={() => null}
      panelFooterTemplate={() => (
        <PanelClearFooter visible={hasValue} onClear={() => onChange(null)} />
      )}
    />
  );
}
