"use client";

import { useAppToast } from "@/components/providers/ToastProvider";
import { Product } from "@/models/product.model";
import { uploadProducts } from "@/services/product.service";
import { parse } from "csv-parse/browser/esm";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { classNames } from "primereact/utils";
import { useCallback, useMemo, useRef, useState } from "react";

const MAX_FILE_SIZE = 10_000_000;

const COLUMN_LABELS: Record<string, string> = {
  rollo: "Rollo",
  calibre: "Calibre",
  ral: "RAL",
  color: "Color",
  pesoKg: "Peso kg",
  importador: "Importador",
  observaciones: "Observaciones",
  fechaIngreso: "Ingreso",
  estado: "Estado",
};

const EXPECTED_COLUMNS = Object.keys(COLUMN_LABELS);

const STEPS = [
  { id: 1, label: "Subir", description: "Selecciona el CSV" },
  { id: 2, label: "Revisar", description: "Valida la vista previa" },
  { id: 3, label: "Guardar", description: "Actualiza inventario" },
] as const;

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getActiveStep(hasData: boolean, saving: boolean) {
  if (saving) return 3;
  if (hasData) return 2;
  return 1;
}

export function InventoryUpload() {
  const [data, setData] = useState<Record<string, string>[]>([]);
  const [fileMeta, setFileMeta] = useState<{ name: string; size: number } | null>(null);
  const [saving, setSaving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [confirmPending, setConfirmPending] = useState(false);
  const [parsing, setParsing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useAppToast();

  const activeStep = getActiveStep(data.length > 0, saving);

  const processFile = useCallback(
    (file: File) => {
      if (!file.name.toLowerCase().endsWith(".csv")) {
        showToast({
          severity: "warn",
          summary: "Formato no válido",
          detail: "Solo se admiten archivos .csv",
          life: 4000,
        });
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        showToast({
          severity: "error",
          summary: "Archivo demasiado grande",
          detail: `El máximo permitido es ${formatFileSize(MAX_FILE_SIZE)}.`,
          life: 5000,
        });
        return;
      }

      setParsing(true);
      setConfirmPending(false);

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
            setParsing(false);
            if (err) {
              showToast({
                severity: "error",
                summary: "Error al leer CSV",
                detail: "Verifica que use punto y coma (;) como separador.",
                life: 5000,
              });
              return;
            }

            if (records.length === 0) {
              showToast({
                severity: "warn",
                summary: "Archivo vacío",
                detail: "El CSV no contiene filas de datos.",
                life: 4000,
              });
              return;
            }

            setData(records as Record<string, string>[]);
            setFileMeta({ name: file.name, size: file.size });
            showToast({
              severity: "success",
              summary: "Archivo cargado",
              detail: `${records.length} filas listas para revisar.`,
              life: 3000,
            });
          }
        );
      };
      reader.onerror = () => {
        setParsing(false);
        showToast({
          severity: "error",
          summary: "No se pudo leer el archivo",
          detail: "Intenta de nuevo con otro archivo.",
          life: 5000,
        });
      };
      reader.readAsText(file);
    },
    [showToast]
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) processFile(file);
    event.target.value = "";
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleDiscard = () => {
    setData([]);
    setFileMeta(null);
    setConfirmPending(false);
  };

  const columns = useMemo(() => {
    if (data.length === 0) return [];
    return Object.keys(data[0]).map((key) => ({
      field: key,
      header: COLUMN_LABELS[key] ?? key.charAt(0).toUpperCase() + key.slice(1),
    }));
  }, [data]);

  const detectedColumns = useMemo(() => (data.length > 0 ? Object.keys(data[0]) : []), [data]);

  const missingColumns = EXPECTED_COLUMNS.filter((col) => !detectedColumns.includes(col));

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
      setFileMeta(null);
      setConfirmPending(false);
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
    <div className="space-y-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-600">
          Área operador
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-steel-900 md:text-3xl">
          Importar inventario
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-steel-500">
          Carga un archivo CSV para actualizar el inventario de rollos. Revisa la vista previa antes
          de confirmar.
        </p>
      </header>

      <ol className="grid gap-3 sm:grid-cols-3">
        {STEPS.map((step) => {
          const isComplete = activeStep > step.id;
          const isCurrent = activeStep === step.id;

          return (
            <li
              key={step.id}
              className={classNames(
                "flex items-start gap-3 rounded-sm border px-4 py-3 transition-colors",
                isCurrent
                  ? "border-accent-300 bg-accent-50/60"
                  : isComplete
                    ? "border-emerald-200 bg-emerald-50/50"
                    : "border-steel-200 bg-white"
              )}
            >
              <span
                className={classNames(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                  isCurrent
                    ? "bg-accent-600 text-white"
                    : isComplete
                      ? "bg-emerald-600 text-white"
                      : "bg-steel-200 text-steel-600"
                )}
              >
                {isComplete ? <i className="pi pi-check text-[10px]" /> : step.id}
              </span>
              <div className="min-w-0">
                <p
                  className={classNames(
                    "text-sm font-semibold",
                    isCurrent ? "text-accent-800" : isComplete ? "text-emerald-800" : "text-steel-700"
                  )}
                >
                  {step.label}
                </p>
                <p className="text-xs text-steel-500">{step.description}</p>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <section className="space-y-4">
          <div
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
            }}
            onDragEnter={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragOver={(e) => e.preventDefault()}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDragging(false);
            }}
            onDrop={handleDrop}
            onClick={() => !parsing && inputRef.current?.click()}
            className={classNames(
              "group relative cursor-pointer rounded-sm border-2 border-dashed px-6 py-10 text-center transition-all",
              isDragging
                ? "border-accent-500 bg-accent-50/80"
                : "border-steel-300 bg-white hover:border-accent-400 hover:bg-steel-50/80",
              parsing && "pointer-events-none opacity-70"
            )}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".csv,text/csv"
              className="sr-only"
              onChange={handleInputChange}
            />

            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-steel-100 text-steel-600 transition-colors group-hover:bg-accent-100 group-hover:text-accent-700">
              {parsing ? (
                <i className="pi pi-spin pi-spinner text-xl" />
              ) : (
                <i className="pi pi-upload text-xl" />
              )}
            </div>

            <p className="text-base font-semibold text-steel-900">
              {parsing ? "Procesando archivo…" : "Arrastra tu CSV aquí"}
            </p>
            <p className="mt-1 text-sm text-steel-500">
              o <span className="font-medium text-accent-600">haz clic para seleccionar</span>
            </p>
            <p className="mt-4 text-xs text-steel-400">
              .csv · separador <code className="font-mono-tech text-steel-600">;</code> · máx.{" "}
              {formatFileSize(MAX_FILE_SIZE)}
            </p>
          </div>

          {fileMeta && (
            <div className="flex flex-wrap items-center gap-3 rounded-sm border border-steel-200 bg-white px-4 py-3">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-accent-50 text-accent-700">
                  <i className="pi pi-file text-sm" />
                </span>
                <div className="min-w-0 text-left">
                  <p className="truncate text-sm font-semibold text-steel-900">{fileMeta.name}</p>
                  <p className="text-xs text-steel-500">
                    {formatFileSize(fileMeta.size)} · {data.length} filas · {columns.length} columnas
                  </p>
                </div>
              </div>
              <Button
                type="button"
                label="Cambiar archivo"
                icon="pi pi-refresh"
                outlined
                severity="secondary"
                size="small"
                onClick={() => inputRef.current?.click()}
              />
            </div>
          )}

          <div className="flex gap-3 rounded-sm border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <i className="pi pi-exclamation-triangle mt-0.5 shrink-0 text-amber-600" />
            <p>
              <span className="font-semibold">Acción irreversible:</span> al guardar se reemplaza el
              inventario completo con los datos del archivo.
            </p>
          </div>
        </section>

        <aside className="h-fit rounded-sm border border-steel-200 bg-white p-5">
          <h2 className="text-sm font-bold text-steel-900">Formato esperado</h2>
          <p className="mt-2 text-xs leading-relaxed text-steel-500">
            Primera fila con encabezados. Usa punto y coma como separador de columnas.
          </p>
          <ul className="mt-4 space-y-1.5">
            {EXPECTED_COLUMNS.map((col) => (
              <li
                key={col}
                className={classNames(
                  "font-mono-tech flex items-center gap-2 rounded-sm px-2 py-1 text-xs",
                  data.length > 0 && !detectedColumns.includes(col)
                    ? "bg-red-50 text-red-700"
                    : "bg-steel-50 text-steel-700"
                )}
              >
                <i
                  className={classNames(
                    "pi text-[10px]",
                    data.length === 0
                      ? "pi-circle text-steel-300"
                      : detectedColumns.includes(col)
                        ? "pi-check-circle text-emerald-600"
                        : "pi-times-circle text-red-500"
                  )}
                />
                {COLUMN_LABELS[col]}
              </li>
            ))}
          </ul>
          {missingColumns.length > 0 && data.length > 0 && (
            <p className="mt-3 text-xs text-red-600">
              Faltan columnas: {missingColumns.map((c) => COLUMN_LABELS[c]).join(", ")}
            </p>
          )}
        </aside>
      </div>

      {data.length > 0 && (
        <section className="overflow-hidden rounded-sm border border-steel-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-steel-200 bg-steel-50 px-4 py-3">
            <div>
              <h2 className="text-sm font-bold text-steel-900">Vista previa</h2>
              <p className="text-xs text-steel-500">
                Revisa que los datos sean correctos antes de guardar
              </p>
            </div>
            <span className="font-mono-tech rounded-sm border border-steel-200 bg-white px-2.5 py-1 text-xs font-semibold tabular-nums text-steel-700">
              {data.length} filas
            </span>
          </div>

          <DataTable
            value={data}
            paginator
            rows={10}
            rowsPerPageOptions={[10, 25, 50]}
            size="small"
            scrollable
            scrollHeight="420px"
            className="text-sm"
          >
            {columns.map((col) => (
              <Column key={col.field} field={col.field} header={col.header} />
            ))}
          </DataTable>

          <div className="space-y-3 border-t border-steel-200 bg-steel-50 px-4 py-4">
            {confirmPending && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-amber-300 bg-amber-50 px-4 py-3">
                <p className="text-sm text-amber-900">
                  ¿Confirmas reemplazar todo el inventario con{" "}
                  <span className="font-semibold">{data.length} rollos</span>?
                </p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    label="Cancelar"
                    severity="secondary"
                    outlined
                    size="small"
                    onClick={() => setConfirmPending(false)}
                  />
                  <Button
                    type="button"
                    label="Sí, guardar"
                    icon="pi pi-check"
                    size="small"
                    loading={saving}
                    onClick={handleSave}
                  />
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3">
              <Button
                type="button"
                label="Descartar"
                icon="pi pi-trash"
                severity="danger"
                outlined
                disabled={saving}
                onClick={handleDiscard}
              />
              {!confirmPending && (
                <Button
                  type="button"
                  label="Guardar inventario"
                  icon="pi pi-save"
                  loading={saving}
                  disabled={missingColumns.length > 0}
                  onClick={() => setConfirmPending(true)}
                />
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
