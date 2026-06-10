"use client";

import { primePT } from "@/theme/passthrough";
import "@/theme/locale-es";
import { PrimeReactProvider } from "primereact/api";
import { ToastProvider } from "./ToastProvider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <PrimeReactProvider value={{ unstyled: true, pt: primePT, ripple: false }}>
      <ToastProvider>{children}</ToastProvider>
    </PrimeReactProvider>
  );
}
