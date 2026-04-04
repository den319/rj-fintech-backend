/*
  Warnings:

  - Added the required column `address` to the `CompanyMaster` table without a default value. This is not possible if the table is not empty.
  - Added the required column `legalName` to the `CompanyMaster` table without a default value. This is not possible if the table is not empty.
  - Added the required column `registeredAt` to the `CompanyMaster` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CompanyMaster" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "legalName" TEXT NOT NULL,
ADD COLUMN     "registeredAt" TIMESTAMP(3) NOT NULL;
