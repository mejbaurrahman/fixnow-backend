/*
  Warnings:

  - A unique constraint covering the columns `[availabilityId,slot]` on the table `bookings` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slot` to the `bookings` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "bookings_availabilityId_key";

-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "slot" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "bookings_availabilityId_slot_key" ON "bookings"("availabilityId", "slot");
