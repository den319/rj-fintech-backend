/*
  Warnings:

  - You are about to drop the column `roleCode` on the `UserMapping` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserMapping" DROP CONSTRAINT "UserMapping_roleCode_fkey";

-- AlterTable
ALTER TABLE "UserMapping" DROP COLUMN "roleCode";
