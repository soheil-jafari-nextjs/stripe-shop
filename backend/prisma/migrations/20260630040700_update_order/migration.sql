/*
  Warnings:

  - The values [NOTPAID] on the enum `orderStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "orderStatus_new" AS ENUM ('PENDING', 'PAID', 'CANCELLED', 'EXPIRED', 'REFUNDED');
ALTER TABLE "Order" ALTER COLUMN "status" TYPE "orderStatus_new" USING ("status"::text::"orderStatus_new");
ALTER TYPE "orderStatus" RENAME TO "orderStatus_old";
ALTER TYPE "orderStatus_new" RENAME TO "orderStatus";
DROP TYPE "public"."orderStatus_old";
COMMIT;

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "price" DOUBLE PRECISION NOT NULL,
    "title" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "productId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
