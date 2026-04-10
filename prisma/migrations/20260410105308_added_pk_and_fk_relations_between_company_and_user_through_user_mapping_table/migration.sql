/*
  Warnings:

  - The primary key for the `CompanyMapping` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `GroupCompanyMaster` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `UserActivity` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `UserMapping` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `UserMaster` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `companyId` on the `CompanyMapping` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `groupCompanyId` on the `CompanyMapping` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `GroupCompanyMaster` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `UserActivity` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `UserActivity` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `UserMapping` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `companyId` on the `UserMapping` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `UserMaster` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "CompanyMapping" DROP CONSTRAINT "CompanyMapping_pkey",
DROP COLUMN "companyId",
ADD COLUMN     "companyId" UUID NOT NULL,
DROP COLUMN "groupCompanyId",
ADD COLUMN     "groupCompanyId" UUID NOT NULL,
ADD CONSTRAINT "CompanyMapping_pkey" PRIMARY KEY ("companyId", "groupCompanyId");

-- AlterTable
ALTER TABLE "GroupCompanyMaster" DROP CONSTRAINT "GroupCompanyMaster_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "GroupCompanyMaster_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "UserActivity" DROP CONSTRAINT "UserActivity_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" UUID NOT NULL,
ADD CONSTRAINT "UserActivity_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "UserMapping" DROP CONSTRAINT "UserMapping_pkey",
DROP COLUMN "userId",
ADD COLUMN     "userId" UUID NOT NULL,
DROP COLUMN "companyId",
ADD COLUMN     "companyId" UUID NOT NULL,
ADD CONSTRAINT "UserMapping_pkey" PRIMARY KEY ("userId", "companyId");

-- AlterTable
ALTER TABLE "UserMaster" DROP CONSTRAINT "UserMaster_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "UserMaster_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "CompanyMapping_groupCompanyId_idx" ON "CompanyMapping"("groupCompanyId");

-- CreateIndex
CREATE UNIQUE INDEX "UserActivity_userId_key" ON "UserActivity"("userId");

-- CreateIndex
CREATE INDEX "UserActivity_userId_idx" ON "UserActivity"("userId");

-- CreateIndex
CREATE INDEX "UserMapping_companyId_idx" ON "UserMapping"("companyId");

-- CreateIndex
CREATE INDEX "UserMaster_id_idx" ON "UserMaster"("id");

-- AddForeignKey
ALTER TABLE "UserMapping" ADD CONSTRAINT "UserMapping_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserMaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMapping" ADD CONSTRAINT "UserMapping_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "CompanyMaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
