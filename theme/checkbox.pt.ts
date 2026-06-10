import type { CheckboxPassThroughOptions } from "primereact/checkbox";
import { classNames } from "primereact/utils";

/** Oculta el input nativo; solo se muestra la caja estilizada (evita doble check). */
export const checkboxPt: CheckboxPassThroughOptions = {
  root: {
    className: "relative inline-flex shrink-0 cursor-pointer items-center justify-center",
  },
  input: {
    className:
      "absolute left-0 top-0 m-0 h-4 w-4 cursor-pointer opacity-0",
  },
  box: ({ context }: { context?: { checked?: boolean } }) => ({
    className: classNames(
      "pointer-events-none flex h-4 w-4 items-center justify-center rounded-[3px] border-2 transition-colors",
      {
        "border-accent-600 bg-accent-600 text-white": context?.checked,
        "border-steel-300 bg-white": !context?.checked,
      }
    ),
  }),
  icon: { className: "h-2.5 w-2.5 text-[10px] text-white" },
};
