/*
  Warnings:

  - You are about to drop the `Libro` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Reseña" DROP CONSTRAINT "Reseña_libroId_fkey";

-- DropTable
DROP TABLE "public"."Libro";
