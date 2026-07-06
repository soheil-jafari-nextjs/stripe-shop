/*
  Warnings:

  - The values [PAYPAL] on the enum `PaymentGateway` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PaymentGateway_new" AS ENUM ('STRIPE');
ALTER TABLE "Transaction" ALTER COLUMN "paymentGateway" TYPE "PaymentGateway_new" USING ("paymentGateway"::text::"PaymentGateway_new");
ALTER TYPE "PaymentGateway" RENAME TO "PaymentGateway_old";
ALTER TYPE "PaymentGateway_new" RENAME TO "PaymentGateway";
DROP TYPE "public"."PaymentGateway_old";
COMMIT;
