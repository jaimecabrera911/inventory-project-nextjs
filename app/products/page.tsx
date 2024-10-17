"use client"

import ProductTable from "@/components/ProductTable"

const ProductPage =  () => {

  return (
    <div className="p-5 md:p-10 lg:p-20">
      <h1 className="text-2xl font-bold mb-10">📦Inventario de Rollos</h1>
      <ProductTable />
    </div>
  )
}

export default ProductPage