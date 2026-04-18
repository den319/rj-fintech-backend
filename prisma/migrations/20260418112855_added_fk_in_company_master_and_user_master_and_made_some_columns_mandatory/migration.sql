/*
  Warnings:

  - Made the column `gst` on table `CompanyMaster` required. This step will fail if there are existing NULL values in that column.
  - Made the column `brand` on table `CompanyMaster` required. This step will fail if there are existing NULL values in that column.
  - Made the column `employeeId` on table `UserMapping` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `UserMaster` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "UserMaster_email_idx";

-- DropIndex
DROP INDEX "UserMaster_id_idx";

-- AlterTable
ALTER TABLE "CompanyMaster" ALTER COLUMN "gst" SET NOT NULL,
ALTER COLUMN "brand" SET NOT NULL;

-- AlterTable
ALTER TABLE "UserMapping" ALTER COLUMN "employeeId" SET NOT NULL;

-- AlterTable
ALTER TABLE "UserMaster" ALTER COLUMN "phone" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "UserActivity" ADD CONSTRAINT "UserActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserMaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyMapping" ADD CONSTRAINT "CompanyMapping_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "CompanyMaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyMapping" ADD CONSTRAINT "CompanyMapping_groupCompanyId_fkey" FOREIGN KEY ("groupCompanyId") REFERENCES "GroupCompanyMaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
