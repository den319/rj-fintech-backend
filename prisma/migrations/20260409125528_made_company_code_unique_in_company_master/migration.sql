/*
  Warnings:

  - A unique constraint covering the columns `[companyCode]` on the table `CompanyMaster` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CompanyMaster_companyCode_key" ON "CompanyMaster"("companyCode");
