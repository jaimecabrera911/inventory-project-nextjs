"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    sessionStorage.clear();
    router.push("/products");
  };

  return (
    <button className="btn" onClick={handleLogout}>
      Cerrar sesión
    </button>
  );
}
