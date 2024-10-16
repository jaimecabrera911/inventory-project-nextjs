-- CreateTable
CREATE TABLE "Producto" (
    "id" SERIAL NOT NULL,
    "rollo" TEXT NOT NULL,
    "calibre" TEXT NOT NULL,
    "ral" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "pesoKg" DOUBLE PRECISION NOT NULL,
    "importador" TEXT,
    "observaciones" TEXT,
    "fechaIngreso" TIMESTAMP(3),
    "estado" TEXT NOT NULL,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_username_key" ON "Usuario"("username");
