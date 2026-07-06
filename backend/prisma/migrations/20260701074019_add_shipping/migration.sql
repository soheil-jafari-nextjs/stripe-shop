-- CreateEnum
CREATE TYPE "ShippingStatus" AS ENUM ('PENDING', 'SHIPPED', 'DELIVERED');

-- CreateTable
CREATE TABLE "Shipping" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "trackingCode" TEXT,
    "status" "ShippingStatus" NOT NULL,
    "orderId" TEXT NOT NULL,

    CONSTRAINT "Shipping_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Shipping_orderId_key" ON "Shipping"("orderId");

-- AddForeignKey
ALTER TABLE "Shipping" ADD CONSTRAINT "Shipping_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
