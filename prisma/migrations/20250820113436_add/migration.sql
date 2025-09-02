-- DropForeignKey
ALTER TABLE "public"."Reseña" DROP CONSTRAINT "Reseña_usuarioId_fkey";

-- AlterTable
ALTER TABLE "public"."Reseña" ALTER COLUMN "usuarioId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Reseña" ADD CONSTRAINT "Reseña_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
