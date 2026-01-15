-- AlterTable
ALTER TABLE "shoppings" ADD COLUMN     "discountApplied" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "accumulatedValue" DOUBLE PRECISION NOT NULL DEFAULT 0;
