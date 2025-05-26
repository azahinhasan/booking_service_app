/*
  Warnings:

  - You are about to drop the column `bookingUid` on the `service_bookings` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "service_bookings_bookingUid_key";

-- AlterTable
ALTER TABLE "service_bookings" DROP COLUMN "bookingUid",
ADD COLUMN     "emailSent" BOOLEAN DEFAULT false;
