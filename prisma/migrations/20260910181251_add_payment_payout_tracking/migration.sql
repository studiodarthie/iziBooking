-- CreateEnum
CREATE TYPE "PayoutStatus" AS ENUM ('NOT_APPLICABLE', 'PENDING', 'PAID');

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "collectedByPlatform" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "commissionAmount" DOUBLE PRECISION,
ADD COLUMN     "payoutAt" TIMESTAMP(3),
ADD COLUMN     "payoutNote" TEXT,
ADD COLUMN     "payoutStatus" "PayoutStatus" NOT NULL DEFAULT 'NOT_APPLICABLE';

-- CreateIndex
CREATE UNIQUE INDEX "Payment_reference_key" ON "Payment"("reference");
