/*
  Warnings:

  - The primary key for the `CompanyMaster` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `id` on the `CompanyMaster` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "ltree";

-- AlterTable
ALTER TABLE "CompanyMaster" DROP CONSTRAINT "CompanyMaster_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "CompanyMaster_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "OrgStructure" (
    "id" UUID NOT NULL,
    "nodeName" TEXT NOT NULL,
    "nodeType" TEXT NOT NULL,
    "nodePath" ltree NOT NULL,
    "companyId" UUID NOT NULL,
    "parentId" UUID,

    CONSTRAINT "OrgStructure_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "node_path_gist_idx" ON "OrgStructure" USING GIST ("nodePath");

-- AddForeignKey
ALTER TABLE "OrgStructure" ADD CONSTRAINT "OrgStructure_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "CompanyMaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgStructure" ADD CONSTRAINT "OrgStructure_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "OrgStructure"("id") ON DELETE SET NULL ON UPDATE CASCADE;
