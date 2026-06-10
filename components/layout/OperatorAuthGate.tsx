"use client";

import { OperatorShell } from "@/components/layout/OperatorShell";
import { ProgressSpinner } from "primereact/progressspinner";
import { useEffect, useState } from "react";

export function OperatorAuthGate({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const login = sessionStorage.getItem("login");
    if (!login) {
      window.location.href = "/login";
      return;
    }
    setAuthorized(true);
    setLoading(false);
  }, []);

  if (loading || !authorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-steel-50">
        <ProgressSpinner />
      </div>
    );
  }

  return <OperatorShell>{children}</OperatorShell>;
}
