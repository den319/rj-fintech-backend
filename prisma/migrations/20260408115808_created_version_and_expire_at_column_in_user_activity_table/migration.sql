/*
  Warnings:

  - Added the required column `expireAt` to the `UserActivity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `version` to the `UserActivity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserActivity" ADD COLUMN     "expireAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "version" TEXT NOT NULL;
