/*
  Warnings:

  - Added the required column `companyCode` to the `CompanyMaster` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ieCode` to the `CompanyMaster` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CompanyMaster" ADD COLUMN     "companyCode" TEXT NOT NULL,
ADD COLUMN     "ieCode" TEXT NOT NULL;
