"use server";

import { Product } from "@/models/product.model";
import { PrismaClient } from "@prisma/client";

export const getProducts = async () => {
  const prismaClient = new PrismaClient();
  const products = await prismaClient.producto.findMany();
  return products as Product[];
};

export const uploadProducts = async (products: Product[]) => {
  const prismaClient = new PrismaClient();

  await prismaClient.producto.deleteMany({});
  await prismaClient.producto.createMany({
    data: products,
  });
};

