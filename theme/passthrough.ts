import type { PrimeReactPTOptions } from "primereact/api";
import { classNames } from "primereact/utils";
import { checkboxPt } from "./checkbox.pt";

const inputBase =
  "w-full rounded-sm border border-steel-300 bg-white px-3 py-2 text-sm text-steel-900 placeholder:text-steel-400 focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500";

const pagBtn =
  "inline-flex h-8 shrink-0 items-center justify-center rounded-sm border border-steel-200 bg-white text-sm font-medium text-steel-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400/40";
const pagBtnHover = "enabled:hover:border-steel-300 enabled:hover:bg-steel-50";
const pagBtnDisabled =
  "disabled:cursor-not-allowed disabled:border-steel-100 disabled:bg-steel-50 disabled:text-steel-300";
const pagIcon =
  "pointer-events-none flex h-3.5 w-3.5 items-center justify-center [&_svg]:h-full [&_svg]:w-full";

export const primePT = {
  button: {
    root: ({ props }: { props?: { text?: boolean; outlined?: boolean; severity?: string } }) => ({
      className: classNames(
        "inline-flex items-center justify-center gap-2 rounded-sm px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500/40 disabled:cursor-not-allowed disabled:opacity-50",
        {
          "bg-accent-600 text-white hover:bg-accent-700": !props?.text && !props?.outlined && !props?.severity,
          "border border-steel-300 bg-white text-steel-800 hover:bg-steel-50": props?.outlined,
          "bg-transparent text-steel-600 hover:bg-steel-100": props?.text,
          "bg-red-600 text-white hover:bg-red-700": props?.severity === "danger" && !props?.outlined && !props?.text,
        }
      ),
    }),
  },
  inputtext: {
    root: { className: inputBase },
  },
  password: {
    root: { className: "relative w-full" },
    input: { className: inputBase },
    panel: { className: "mt-1 rounded-sm border border-steel-200 bg-white p-2 text-xs shadow-lg" },
  },
  datatable: {
    root: { className: "text-sm" },
    table: { className: "w-full border-collapse text-sm" },
    wrapper: { className: "overflow-auto" },
    thead: { className: "bg-steel-100" },
    headerRow: { className: "border-b border-steel-300" },
    bodyRow: ({ context }: { context?: { selected?: boolean; index?: number } }) => ({
      className: classNames("border-b border-steel-100 transition-colors", {
        "bg-accent-50/50": context?.selected,
        "hover:bg-steel-50": !context?.selected,
        "bg-steel-50/60": !context?.selected && context?.index !== undefined && context.index % 2 === 1,
      }),
    }),
    emptyMessage: { className: "px-4 py-10 text-center text-steel-500" },
    loadingOverlay: { className: "bg-white/70" },
  },
  column: {
    headerCell: {
      className:
        "whitespace-nowrap border-b border-steel-300 bg-steel-100 px-3 py-2.5 text-left align-middle text-[11px] font-bold uppercase tracking-wider text-steel-700",
    },
    bodyCell: {
      className: "whitespace-nowrap border-b border-steel-100 px-3 py-2 align-middle text-sm text-steel-800",
    },
    sortIcon: { className: "ml-1.5 inline-block text-[10px] text-steel-400" },
    sortBadge: { className: "ml-1 rounded bg-steel-200 px-1 text-[10px] text-steel-600" },
  },
  paginator: {
    root: {
      className:
        "inventory-paginator flex flex-wrap items-center gap-0.5 border-t border-steel-200 bg-white px-4 py-2.5",
    },
    left: { className: "mr-2 flex items-center" },
    pages: { className: "inventory-pag-pages inline-flex items-center gap-0.5" },
    end: { className: "ml-2 flex items-center" },
    current: {
      className:
        "ml-auto whitespace-nowrap pl-3 text-xs font-medium uppercase tracking-wide tabular-nums text-steel-600",
    },
    firstPageButton: {
      className: classNames(pagBtn, pagBtnHover, pagBtnDisabled, "h-8 w-8"),
    },
    prevPageButton: {
      className: classNames(pagBtn, pagBtnHover, pagBtnDisabled, "h-8 w-8"),
    },
    nextPageButton: {
      className: classNames(pagBtn, pagBtnHover, pagBtnDisabled, "h-8 w-8"),
    },
    lastPageButton: {
      className: classNames(pagBtn, pagBtnHover, pagBtnDisabled, "h-8 w-8"),
    },
    firstPageIcon: { className: pagIcon },
    prevPageIcon: { className: pagIcon },
    nextPageIcon: { className: pagIcon },
    lastPageIcon: { className: pagIcon },
    pageButton: ({ context }: { context?: { active?: boolean } }) => ({
      className: classNames(
        "inventory-pag-page inline-flex h-8 min-w-[2rem] shrink-0 items-center justify-center rounded-sm border px-2 text-sm font-semibold tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/40",
        context?.active
          ? "inventory-pag-page--active border-[var(--accent-600)] bg-[var(--accent-600)] text-white"
          : "border-steel-200 bg-white text-steel-800 hover:border-steel-300 hover:bg-steel-50"
      ),
    }),
    RPPDropdown: {
      root: {
        className:
          "inventory-rpp ml-2 inline-flex h-8 min-w-[4rem] items-stretch overflow-hidden rounded-sm border border-steel-200 bg-white",
      },
      input: {
        className:
          "flex min-w-0 flex-1 items-center px-2.5 font-mono-tech text-sm font-semibold tabular-nums text-steel-800",
      },
      trigger: {
        className:
          "flex w-7 shrink-0 items-center justify-center border-l border-steel-200 text-steel-500",
      },
      dropdownIcon: { className: "text-[10px]" },
      panel: { className: "mt-1 rounded-sm border border-steel-200 bg-white shadow-lg" },
      wrapper: { className: "max-h-48 overflow-y-auto" },
      list: { className: "m-0 list-none p-1" },
      item: ({ context }: { context?: { selected?: boolean } }) => ({
        className: classNames("cursor-pointer rounded-sm px-3 py-2 text-sm tabular-nums", {
          "bg-accent-50 font-semibold text-accent-800": context?.selected,
          "text-steel-800 hover:bg-steel-100": !context?.selected,
        }),
      }),
    },
  },
  tag: {
    root: ({ props }: { props?: { severity?: string } }) => ({
      className: classNames(
        "inline-flex items-center rounded-sm border px-2 py-0.5 text-xs font-semibold uppercase tracking-wide",
        {
          "border-emerald-500 text-emerald-700 bg-emerald-50": props?.severity === "success",
          "border-amber-500 text-amber-700 bg-amber-50": props?.severity === "warning",
          "border-red-500 text-red-700 bg-red-50": props?.severity === "danger",
          "border-steel-400 text-steel-600 bg-steel-50": !props?.severity || props?.severity === "secondary",
        }
      ),
    }),
  },
  toast: {
    root: { className: "w-96 opacity-95" },
    message: ({ props }: { props?: { message?: { severity?: string } } }) => ({
      className: classNames("mb-2 flex rounded-sm border shadow-lg", {
        "border-emerald-200 bg-emerald-50": props?.message?.severity === "success",
        "border-red-200 bg-red-50": props?.message?.severity === "error",
        "border-amber-200 bg-amber-50": props?.message?.severity === "warn",
        "border-steel-200 bg-white": props?.message?.severity === "info",
      }),
    }),
    content: { className: "flex flex-1 items-start gap-3 p-3" },
    summary: { className: "text-sm font-bold text-steel-900" },
    detail: { className: "text-sm text-steel-600" },
  },
  fileupload: {
    root: { className: "rounded-sm border-2 border-dashed border-steel-300 bg-steel-50 p-6" },
    buttonbar: { className: "mb-3 flex gap-2" },
    content: { className: "text-sm text-steel-600" },
  },
  multiselect: {
    root: {
      className:
        "relative flex w-full items-stretch overflow-hidden rounded-sm border border-steel-300 bg-white transition-colors hover:border-steel-400",
    },
    labelContainer: {
      className: "flex min-h-[2.375rem] min-w-0 flex-1 items-center pl-3 pr-2",
    },
    label: { className: "flex-1 truncate text-sm text-steel-800" },
    clearIcon: {
      className:
        "flex w-8 shrink-0 cursor-pointer items-center justify-center border-l border-steel-200 text-steel-400 hover:bg-steel-100 hover:text-steel-700",
    },
    trigger: {
      className:
        "flex w-8 shrink-0 cursor-pointer items-center justify-center border-l border-steel-200 text-steel-500",
    },
    triggerIcon: { className: "hidden" },
    dropdownIcon: { className: "pointer-events-none flex items-center justify-center" },
    panel: { className: "mt-1 rounded-sm border border-steel-200 bg-white shadow-lg" },
    closeButton: { className: "hidden" },
    closeIcon: { className: "hidden" },
    headerCheckboxContainer: { className: "hidden" },
    wrapper: { className: "max-h-56 overflow-y-auto" },
    list: { className: "m-0 list-none p-1.5" },
    item: ({ context }: { context?: { selected?: boolean } }) => ({
      className: classNames(
        "flex cursor-pointer items-center gap-2.5 rounded-sm px-2.5 py-2 text-sm",
        context?.selected ? "bg-accent-50 text-accent-900" : "text-steel-800 hover:bg-steel-100"
      ),
    }),
    checkboxContainer: { className: "flex shrink-0 items-center" },
    checkbox: checkboxPt,
  },
  checkbox: checkboxPt,
  progressspinner: {
    root: { className: "inline-block" },
    spinner: { className: "h-10 w-10 animate-spin text-accent-600" },
  },
  skeleton: {
    root: { className: "animate-pulse rounded-sm bg-steel-200" },
  },
} as PrimeReactPTOptions;
