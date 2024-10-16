"use client"

import ProductTable from "@/components/ProductTable"

const ProductPage =  () => {

  return (
    <div className="md:p-1 sm:p-1">
      <h1 className="text-2xl font-bold">Inventario Productos</h1>
      <ProductTable />
    </div>
  )
}

export default ProductPage