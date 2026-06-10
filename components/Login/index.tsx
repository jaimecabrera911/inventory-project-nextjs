"use client";

import { useAppToast } from "@/components/providers/ToastProvider";
import { login } from "@/services/login.service";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { useState } from "react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useAppToast();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(username, password);
      sessionStorage.setItem("login", username);
      showToast({
        severity: "success",
        summary: "Sesión iniciada",
        detail: "Redirigiendo al área de carga…",
        life: 2500,
      });
      router.push("/products/upload");
    } catch {
      showToast({
        severity: "error",
        summary: "Error al iniciar sesión",
        detail: "Usuario o contraseña incorrectos.",
        life: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grain flex min-h-screen items-center justify-center bg-steel-100 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            href="/products"
            className="mx-auto mb-6 inline-block transition-opacity hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
            aria-label="Todo Hierros — Volver al inventario"
          >
            <Image
              src="/logo.png"
              alt="Todo Hierros"
              width={220}
              height={56}
              className="mx-auto h-10 w-auto object-contain sm:h-11"
              priority
            />
          </Link>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-600">
            Área operador
          </p>
          <h1 className="mt-2 text-3xl font-bold text-steel-900">Iniciar sesión</h1>
          <p className="mt-2 text-sm text-steel-500">
            Acceso restringido para carga de inventario
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="rounded-sm border border-steel-200 bg-white p-8 shadow-sm"
        >
          <div className="mb-5">
            <label htmlFor="username" className="mb-1.5 block text-sm font-semibold text-steel-700">
              Usuario
            </label>
            <InputText
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ingresa tu usuario"
              className="w-full"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-steel-700">
              Contraseña
            </label>
            <Password
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              className="w-full"
              inputClassName="w-full"
              feedback={false}
              toggleMask
              required
            />
          </div>

          <Button
            type="submit"
            label="Iniciar sesión"
            icon="pi pi-sign-in"
            loading={loading}
            className="w-full justify-center"
          />
        </form>

        <p className="mt-6 text-center text-sm text-steel-500">
          <Link href="/products" className="font-medium text-accent-600 hover:text-accent-700">
            ← Volver al inventario público
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
