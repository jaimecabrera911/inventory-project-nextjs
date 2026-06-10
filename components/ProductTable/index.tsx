"use client";

import { Product } from "@/models/product.model";
import { getProducts } from "@/services/product.service";
import { FilterMatchMode } from "primereact/api";
import { Column } from "primereact/column";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { Tag } from "primereact/tag";
import { useEffect, useMemo, useState } from "react";
import { InventoryTableSkeleton } from "./InventoryTableSkeleton";
import { InventoryToolbar } from "./InventoryToolbar";
import { inventoryPaginatorTemplate } from "./PaginationReport";
import { WeightCalculatorBar } from "./WeightCalculatorBar";

const estadoSeverity: Record<string, "success" | "warning" | "danger" | "secondary"> = {
  activo: "success",
  destapado: "warning",
  "sin existencias": "danger",
};

const DEFAULT_FILTERS: DataTableFilterMeta = {
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  estado: { value: ["activo"], matchMode: FilterMatchMode.IN },
  calibre: { value: null, matchMode: FilterMatchMode.IN },
  color: { value: null, matchMode: FilterMatchMode.IN },
};

const ProductTable = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);
  const [filters, setFilters] = useState<DataTableFilterMeta>(DEFAULT_FILTERS);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;

    let active = true;

    getProducts()
      .then((response) => {
        if (!active) return;
        setProducts(response);
      })
      .catch(() => {
        if (!active) return;
        setProducts([]);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [hasMounted]);

  const calibreOptions = useMemo(
    () => Array.from(new Set(products.map((p) => p.calibre))).sort((a, b) => a.localeCompare(b)),
    [products]
  );

  const colorOptions = useMemo(
    () => Array.from(new Set(products.map((p) => p.color))).sort((a, b) => a.localeCompare(b)),
    [products]
  );

  const totalWeight = useMemo(
    () =>
      parseFloat(
        selectedProducts.reduce((acc, p) => acc + (p.pesoKg ?? 0), 0).toFixed(4)
      ),
    [selectedProducts]
  );

  const handleGlobalFilterChange = (value: string) => {
    setGlobalFilter(value);
    setFilters((prev) => ({
      ...prev,
      global: { value, matchMode: FilterMatchMode.CONTAINS },
    }));
  };

  const clearFilters = () => {
    setGlobalFilter("");
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      estado: { value: null, matchMode: FilterMatchMode.IN },
      calibre: { value: null, matchMode: FilterMatchMode.IN },
      color: { value: null, matchMode: FilterMatchMode.IN },
    });
  };

  const mono = (value: string) => (
    <span className="font-mono-tech text-xs font-medium tabular-nums text-steel-800">{value}</span>
  );

  const estadoBody = (row: Product) => (
    <Tag value={row.estado} severity={estadoSeverity[row.estado] ?? "secondary"} rounded={false} />
  );

  const fechaBody = (row: Product) => {
    if (!row.fechaIngreso) return <span className="text-steel-300">—</span>;
    const date = new Date(row.fechaIngreso);
    if (date.getFullYear() < 1971) return <span className="text-steel-300">—</span>;
    return (
      <span className="font-mono-tech text-xs tabular-nums text-steel-600">
        {date.toLocaleDateString("es-CO")}
      </span>
    );
  };

  const obsBody = (row: Product) => (
    <span className="block max-w-[220px] truncate text-steel-700" title={row.observaciones}>
      {row.observaciones || "—"}
    </span>
  );

  const sortHeader = (label: string) => (
    <span className="inline-flex items-center gap-1.5">{label}</span>
  );

  if (!hasMounted || isLoading) {
    return <InventoryTableSkeleton />;
  }

  return (
    <section className="inventory-shell overflow-hidden rounded-sm border border-steel-200 bg-white shadow-sm">
      <InventoryToolbar
        totalRecords={products.length}
        globalFilter={globalFilter}
        filters={filters}
        calibreOptions={calibreOptions}
        colorOptions={colorOptions}
        selectedCount={selectedProducts.length}
        totalWeightKg={totalWeight}
        onGlobalFilterChange={handleGlobalFilterChange}
        onFiltersChange={setFilters}
        onClearFilters={clearFilters}
        onClearSelection={() => setSelectedProducts([])}
      />

      <div className="inventory-scroll">
        <DataTable
          value={products}
          dataKey="id"
          paginator
          rows={15}
          rowsPerPageOptions={[10, 15, 25, 50]}
          paginatorClassName="inventory-paginator"
          paginatorTemplate={inventoryPaginatorTemplate}
          selectionMode="multiple"
          selection={selectedProducts}
          onSelectionChange={(e) => setSelectedProducts(e.value)}
          filters={filters}
          onFilter={(e) => setFilters(e.filters)}
          globalFilterFields={["rollo", "calibre", "ral", "color", "importador", "observaciones"]}
          emptyMessage="No hay rollos que coincidan con los filtros."
          stripedRows
          showGridlines
          removableSort
          sortMode="multiple"
          size="small"
          tableClassName="inventory-grid"
        >
          <Column
            selectionMode="multiple"
            headerStyle={{ width: "3rem", minWidth: "3rem" }}
            bodyStyle={{ width: "3rem", minWidth: "3rem" }}
            exportable={false}
          />
          <Column
            field="rollo"
            header={sortHeader("Rollo")}
            sortable
            style={{ minWidth: "7rem" }}
            body={(row: Product) => mono(row.rollo)}
          />
          <Column
            field="calibre"
            header={sortHeader("Calibre")}
            sortable
            style={{ minWidth: "8rem" }}
            body={(row: Product) => mono(row.calibre)}
          />
          <Column
            field="ral"
            header={sortHeader("RAL")}
            sortable
            style={{ minWidth: "4.5rem" }}
            body={(row: Product) => mono(row.ral)}
          />
          <Column field="color" header={sortHeader("Color")} sortable style={{ minWidth: "6rem" }} />
          <Column
            field="pesoKg"
            header={sortHeader("Peso kg")}
            sortable
            style={{ minWidth: "5.5rem" }}
            body={(row: Product) => mono(String(row.pesoKg))}
          />
          <Column
            field="fechaIngreso"
            header={sortHeader("Ingreso")}
            sortable
            style={{ minWidth: "6.5rem" }}
            body={fechaBody}
          />
          <Column
            field="importador"
            header={sortHeader("Importador")}
            sortable
            style={{ minWidth: "7rem" }}
          />
          <Column
            field="observaciones"
            header={sortHeader("Observaciones")}
            sortable
            style={{ minWidth: "11rem" }}
            body={obsBody}
          />
          <Column
            field="estado"
            header={sortHeader("Estado")}
            sortable
            style={{ minWidth: "7rem" }}
            body={estadoBody}
          />
        </DataTable>
      </div>

      <WeightCalculatorBar
        selectedCount={selectedProducts.length}
        totalWeightKg={totalWeight}
        onClearSelection={() => setSelectedProducts([])}
        className="rounded-none border-x-0 border-b-0 border-t border-accent-300"
      />
    </section>
  );
};

export default ProductTable;
