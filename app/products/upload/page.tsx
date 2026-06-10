"use client";

import { useAppToast } from "@/components/providers/ToastProvider";
import { Product } from "@/models/product.model";
import { uploadProducts } from "@/services/product.service";
import { parse } from "csv-parse/browser/esm";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { FileUpload, FileUploadHandlerEvent } from "primereact/fileupload";
import { useMemo, useState } from "react";

const UploadFile = () => {
  const [data, setData] = useState<Record<string, string>[]>([]);
  const [saving, setSaving] = useState(false);
  const { showToast } = useAppToast();

  const handleUpload = (event: FileUploadHandlerEvent) => {
    const file = event.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const csvData = e.target?.result as string;
      parse(
        csvData,
        {
          columns: true,
          trim: true,
          delimiter: ";",
          cast: (value) => (value === "null" ? null : value),
        },
        (err, records) => {
          if (err) {
            showToast({
              severity: "error",
              summary: "Error al leer CSV",
              detail: "Verifica el formato del archivo.",
              life: 5000,
            });
          } else {
            setData(records as Record<string, string>[]);
            showToast({
              severity: "success",
              summary: "Archivo cargado",
              detail: `${records.length} filas listas para revisar.`,
              life: 3000,
            });
          }
        }
      );
    };
    reader.readAsText(file);
  };

  const columns = useMemo(() => {
    if (data.length === 0) return [];
    return Object.keys(data[0]).map((key) => ({
      field: key,
      header: key.charAt(0).toUpperCase() + key.slice(1),
    }));
  }, [data]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const products = data as unknown as Product[];
      const formatProducts = products.map((product) => {
        const formatted = { ...product };
        if (formatted.fechaIngreso == null || formatted.fechaIngreso === "") {
          formatted.fechaIngreso = null;
        } else {
          formatted.fechaIngreso = new Date(formatted.fechaIngreso.toString());
        }
        formatted.pesoKg = parseFloat(formatted.pesoKg.toString());
        return formatted;
      });

      await uploadProducts(formatProducts);
      showToast({
        severity: "success",
        summary: "Inventario actualizado",
        detail: `${formatProducts.length} rollos guardados correctamente.`,
        life: 4000,
      });
      setData([]);
    } catch (error) {
      showToast({
        severity: "error",
        summary: "Error al guardar",
        detail: String(error),
        life: 5000,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-600">
          Carga
        </p>
        <h1 className="mt-1 text-2xl font-bold text-steel-900">Importar inventario CSV</h1>
        <p className="mt-2 text-sm text-steel-500">
          Sube un archivo delimitado por punto y coma. Al guardar, se reemplaza el inventario completo.
        </p>
      </div>

      <FileUpload
        mode="basic"
        name="csv"
        accept=".csv,text/csv"
        maxFileSize={10000000}
        customUpload
        uploadHandler={handleUpload}
        chooseLabel="Seleccionar CSV"
        className="mb-8"
      />

      {data.length > 0 && (
        <div className="overflow-hidden rounded-sm border border-steel-200 bg-white">
          <div className="border-b border-steel-200 bg-steel-50 px-4 py-3">
            <h2 className="text-sm font-semibold text-steel-800">
              Vista previa — {data.length} filas
            </h2>
          </div>
          <DataTable
            value={data}
            paginator
            rows={10}
            rowsPerPageOptions={[10, 25, 50]}
            size="small"
            scrollable
            scrollHeight="400px"
          >
            {columns.map((col) => (
              <Column key={col.field} field={col.field} header={col.header} />
            ))}
          </DataTable>

          <div className="flex justify-end border-t border-steel-200 bg-steel-50 px-4 py-4">
            <Button
              label="Guardar inventario"
              icon="pi pi-save"
              loading={saving}
              onClick={handleSave}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadFile;
