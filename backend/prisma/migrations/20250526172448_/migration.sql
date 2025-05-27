/*
  Warnings:

  - Added the required column `email` to the `service_bookings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "service_bookings" ADD COLUMN     "email" TEXT NOT NULL,
ALTER COLUMN "phone" DROP NOT NULL;
