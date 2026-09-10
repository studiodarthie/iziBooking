-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "couponId" TEXT,
ADD COLUMN     "discountAmount" DOUBLE PRECISION;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "Coupon"("id") ON DELETE SET NULL ON UPDATE CASCADE;
