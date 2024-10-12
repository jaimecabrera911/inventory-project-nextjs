"use client";

import LogoutButton from "@/components/Logout";
import { useEffect, useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const login = sessionStorage.getItem("login");
    if (!login) {
      window.location.href = "/login";
    }
    setLoading(false);
  }, []);

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="radial-progress animate-spin text-primary"></div>
        </div>
      ) : (
        <>
          <LogoutButton />
          {children}
        </>
      )}
    </div>
  );
}
