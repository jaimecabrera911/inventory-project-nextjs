"use client";

import { Button } from "primereact/button";
import { classNames } from "primereact/utils";

type WeightCalculatorBarProps = {
  selectedCount: number;
  totalWeightKg: number;
  onClearSelection: () => void;
  className?: string;
};

export function WeightCalculatorBar({
  selectedCount,
  totalWeightKg,
  onClearSelection,
  className,
}: WeightCalculatorBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div
      className={classNames(
        "flex flex-col gap-3 border border-accent-300 bg-accent-600 px-4 py-3 text-white sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div className="flex items-center gap-2.5">
        <i className="pi pi-check-square text-lg" aria-hidden />
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-accent-200">
            Calculadora de peso
          </p>
          <p className="text-sm font-medium">
            {selectedCount}{" "}
            {selectedCount === 1 ? "rollo seleccionado" : "rollos seleccionados"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 sm:gap-4">
        <span className="font-mono-tech text-2xl font-bold tabular-nums">
          {totalWeightKg.toLocaleString("es-CO")} kg
        </span>
        <Button
          type="button"
          label="Quitar selección"
          icon="pi pi-times"
          text
          className="!text-white hover:!bg-accent-700"
          onClick={onClearSelection}
        />
      </div>
    </div>
  );
}
