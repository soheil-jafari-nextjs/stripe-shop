/*
  Warnings:

  - You are about to drop the `Shipping` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ShipStatus" AS ENUM ('PENDING', 'SHIPPED', 'DELIVERED');

-- DropForeignKey
ALTER TABLE "Shipping" DROP CONSTRAINT "Shipping_orderId_fkey";

-- DropTable
DROP TABLE "Shipping";

-- DropEnum
DROP TYPE "ShippingStatus";

-- CreateTable
CREATE TABLE "Ship" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "trackingCode" TEXT,
    "status" "ShipStatus" NOT NULL,
    "orderId" TEXT NOT NULL,

    CONSTRAINT "Ship_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Ship_orderId_key" ON "Ship"("orderId");

-- AddForeignKey
ALTER TABLE "Ship" ADD CONSTRAINT "Ship_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
