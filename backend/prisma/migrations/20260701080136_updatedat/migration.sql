/*
  Warnings:

  - You are about to drop the column `created_at` on the `Ship` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Ship` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Ship" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
