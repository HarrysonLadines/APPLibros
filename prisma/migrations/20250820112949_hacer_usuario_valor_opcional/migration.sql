/*
  Warnings:

  - Changed the type of `tipo` on the `Voto` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "public"."Voto" DROP CONSTRAINT "Voto_usuarioId_fkey";

-- AlterTable
ALTER TABLE "public"."Voto" DROP COLUMN "tipo",
ADD COLUMN     "tipo" TEXT NOT NULL,
ALTER COLUMN "valor" DROP NOT NULL,
ALTER COLUMN "usuarioId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Voto" ADD CONSTRAINT "Voto_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
