/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `GroupCompanyMaster` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[roleName]` on the table `Role` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "GroupCompanyMaster_code_key" ON "GroupCompanyMaster"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Role_roleName_key" ON "Role"("roleName");
