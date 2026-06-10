"use client";

import { useAppToast } from "@/components/providers/ToastProvider";
import { changePassword } from "@/services/login.service";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { useEffect, useState } from "react";

export function ChangePasswordForm() {
  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useAppToast();

  useEffect(() => {
    const stored = sessionStorage.getItem("login");
    if (stored) setUsername(stored);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      showToast({
        severity: "warn",
        summary: "Las contraseñas no coinciden",
        detail: "Verifica la nueva contraseña y su confirmación.",
        life: 4000,
      });
      return;
    }

    setLoading(true);
    try {
      await changePassword(username, currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      showToast({
        severity: "success",
        summary: "Contraseña actualizada",
        detail: "Tu nueva contraseña ya está activa.",
        life: 4000,
      });
    } catch (error) {
      showToast({
        severity: "error",
        summary: "No se pudo cambiar la contraseña",
        detail: error instanceof Error ? error.message : String(error),
        life: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-600">
          Área operador
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-steel-900 md:text-3xl">
          Cuenta
        </h1>
        <p className="mt-2 text-sm text-steel-500">
          Actualiza la contraseña de acceso al panel de operador.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-sm border border-steel-200 bg-white p-6 shadow-sm md:p-8"
      >
        <div>
          <label htmlFor="username" className="mb-1.5 block text-sm font-semibold text-steel-700">
            Usuario
          </label>
          <InputText id="username" value={username} className="w-full" disabled />
        </div>

        <div>
          <label
            htmlFor="currentPassword"
            className="mb-1.5 block text-sm font-semibold text-steel-700"
          >
            Contraseña actual
          </label>
          <Password
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Ingresa tu contraseña actual"
            className="w-full"
            inputClassName="w-full"
            feedback={false}
            toggleMask
            required
          />
        </div>

        <div className="border-t border-steel-100 pt-5">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-steel-500">
            Nueva contraseña
          </p>

          <div className="space-y-5">
            <div>
              <label
                htmlFor="newPassword"
                className="mb-1.5 block text-sm font-semibold text-steel-700"
              >
                Nueva contraseña
              </label>
              <Password
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full"
                inputClassName="w-full"
                feedback={false}
                toggleMask
                required
                minLength={6}
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1.5 block text-sm font-semibold text-steel-700"
              >
                Confirmar nueva contraseña
              </label>
              <Password
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite la nueva contraseña"
                className="w-full"
                inputClassName="w-full"
                feedback={false}
                toggleMask
                required
                minLength={6}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-steel-100 pt-5">
          <Button
            type="submit"
            label="Actualizar contraseña"
            icon="pi pi-lock"
            loading={loading}
          />
        </div>
      </form>
    </div>
  );
}
