/*
  Warnings:

  - You are about to drop the column `endTime` on the `technician_availabilities` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `technician_availabilities` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "technician_availabilities" DROP COLUMN "endTime",
DROP COLUMN "startTime",
ADD COLUMN     "date" TIMESTAMP(3),
ADD COLUMN     "slots" TEXT[];
