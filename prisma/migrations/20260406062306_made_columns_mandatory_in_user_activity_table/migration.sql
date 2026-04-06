/*
  Warnings:

  - Made the column `ip` on table `UserActivity` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userAgent` on table `UserActivity` required. This step will fail if there are existing NULL values in that column.
  - Made the column `tabId` on table `UserActivity` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "UserActivity" ALTER COLUMN "ip" SET NOT NULL,
ALTER COLUMN "userAgent" SET NOT NULL,
ALTER COLUMN "tabId" SET NOT NULL;
