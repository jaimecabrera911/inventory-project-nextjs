"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { classNames } from "primereact/utils";

const navItems = [
  { href: "/products/upload", label: "Importar inventario", icon: "pi-upload" },
  { href: "/products/settings", label: "Cuenta", icon: "pi-user-edit" },
];

export function OperatorShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.removeItem("login");
    router.push("/products");
  };

  return (
    <div className="flex min-h-screen bg-steel-50">
      <aside className="grain flex w-64 shrink-0 flex-col border-r border-steel-200 bg-steel-800 text-white">
        <div className="border-b border-steel-700 px-5 py-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-accent-500">
            Área operador
          </p>
          <p className="mt-1 text-lg font-bold">Inventario</p>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={classNames(
                "flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-accent-600 text-white"
                  : "text-steel-300 hover:bg-steel-700 hover:text-white"
              )}
            >
              <i className={`pi ${item.icon}`} />
              {item.label}
            </Link>
          ))}

          <Link
            href="/products"
            target="_blank"
            className="mt-2 flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-medium text-steel-400 transition-colors hover:bg-steel-700 hover:text-white"
          >
            <i className="pi pi-external-link" />
            Ver inventario público
          </Link>
        </nav>

        <div className="border-t border-steel-700 p-3">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-medium text-steel-300 transition-colors hover:bg-steel-700 hover:text-white"
          >
            <i className="pi pi-sign-out" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-6xl px-5 py-8 md:px-10">{children}</div>
      </main>
    </div>
  );
}
