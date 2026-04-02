/*
  Warnings:

  - Made the column `token` on table `UserActivity` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "UserActivity" ALTER COLUMN "token" SET NOT NULL;
