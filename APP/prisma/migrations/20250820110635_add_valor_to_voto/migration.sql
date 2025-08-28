-- CreateEnum
CREATE TYPE "public"."TipoVoto" AS ENUM ('UP', 'DOWN');

-- CreateTable
CREATE TABLE "public"."Usuario" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "fechaRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Libro" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "isbn" TEXT,
    "descripcion" TEXT,
    "portadaUrl" TEXT,
    "fechaPublicacion" TEXT,
    "paginas" INTEGER,
    "categorias" TEXT,

    CONSTRAINT "Libro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Reseña" (
    "id" SERIAL NOT NULL,
    "calificacion" INTEGER NOT NULL,
    "contenido" TEXT NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" INTEGER NOT NULL,
    "libroId" TEXT NOT NULL,

    CONSTRAINT "Reseña_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Voto" (
    "id" SERIAL NOT NULL,
    "tipo" "public"."TipoVoto" NOT NULL,
    "valor" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "reseñaId" INTEGER NOT NULL,

    CONSTRAINT "Voto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "public"."Usuario"("email");

-- AddForeignKey
ALTER TABLE "public"."Reseña" ADD CONSTRAINT "Reseña_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reseña" ADD CONSTRAINT "Reseña_libroId_fkey" FOREIGN KEY ("libroId") REFERENCES "public"."Libro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Voto" ADD CONSTRAINT "Voto_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Voto" ADD CONSTRAINT "Voto_reseñaId_fkey" FOREIGN KEY ("reseñaId") REFERENCES "public"."Reseña"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
