"use client";

import { PublicHeader } from "@/components/layout/PublicHeader";
import ProductTable from "@/components/ProductTable";

const ProductPage = () => {
  return (
    <div className="min-h-screen bg-steel-50">
      <PublicHeader />
      <div className="mx-auto max-w-[1600px] px-5 py-8 md:px-10 md:py-10">
        <p className="mb-6 max-w-2xl text-sm text-steel-500">
          Consulta en tiempo real el inventario de rollos. Selecciona filas para calcular el peso total.
        </p>
        <ProductTable />
      </div>
    </div>
  );
};

export default ProductPage;
