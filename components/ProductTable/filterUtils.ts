import { Product } from "@/models/product.model";
import { FilterMatchMode } from "primereact/api";
import { DataTableFilterMeta } from "primereact/datatable";

const GLOBAL_FIELDS: (keyof Product)[] = [
  "rollo",
  "calibre",
  "ral",
  "color",
  "importador",
  "observaciones",
];

function normalizeToken(value: string) {
  return value.trim().toLowerCase();
}

export function getFilterValues(
  filters: DataTableFilterMeta,
  field: string
): string[] | null {
  const entry = filters[field] as { value: unknown } | undefined;
  const raw = entry?.value;

  if (raw == null) return null;

  if (Array.isArray(raw)) {
    const values = raw.map((item) => String(item).trim()).filter(Boolean);
    return values.length ? values : null;
  }

  if (typeof raw === "string" && raw.trim()) {
    return [raw.trim()];
  }

  return null;
}

function matchesInFilter(value: string, selected: string[] | null) {
  if (!selected?.length) return true;
  const normalized = normalizeToken(value);
  return selected.some((item) => normalizeToken(item) === normalized);
}

export function matchesToolbarFilters(
  product: Product,
  filters: DataTableFilterMeta,
  excludeFields: string[] = []
) {
  if (!excludeFields.includes("global")) {
    const globalEntry = filters.global as { value: string | null } | undefined;
    const query = globalEntry?.value?.trim().toLowerCase();
    if (query) {
      const haystack = GLOBAL_FIELDS.map((field) => String(product[field] ?? ""))
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(query)) return false;
    }
  }

  if (!excludeFields.includes("estado")) {
    if (!matchesInFilter(product.estado, getFilterValues(filters, "estado"))) return false;
  }

  if (!excludeFields.includes("calibre")) {
    if (!matchesInFilter(product.calibre, getFilterValues(filters, "calibre"))) return false;
  }

  if (!excludeFields.includes("color")) {
    if (!matchesInFilter(product.color, getFilterValues(filters, "color"))) return false;
  }

  return true;
}

function uniqueSorted(values: string[]) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b, "es"));
}

export function getCalibreOptions(products: Product[], filters: DataTableFilterMeta) {
  const pool = products.filter((p) => matchesToolbarFilters(p, filters, ["calibre", "color"]));
  return uniqueSorted(pool.map((p) => p.calibre));
}

export function getColorOptions(products: Product[], filters: DataTableFilterMeta) {
  const pool = products.filter((p) => matchesToolbarFilters(p, filters, ["color"]));
  return uniqueSorted(pool.map((p) => p.color));
}

export function sanitizeFilters(products: Product[], filters: DataTableFilterMeta) {
  const calibreOptions = getCalibreOptions(products, filters);
  const colorOptions = getColorOptions(products, filters);

  const calibreSelected = getFilterValues(filters, "calibre");
  const colorSelected = getFilterValues(filters, "color");

  const nextCalibre = calibreSelected?.filter((v) => calibreOptions.includes(v)) ?? null;
  const nextColor = colorSelected?.filter((v) => colorOptions.includes(v)) ?? null;

  return {
    ...filters,
    calibre: {
      value: nextCalibre?.length ? nextCalibre : null,
      matchMode: FilterMatchMode.IN,
    },
    color: {
      value: nextColor?.length ? nextColor : null,
      matchMode: FilterMatchMode.IN,
    },
  };
}
