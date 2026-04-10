/*
  Warnings:

  - A unique constraint covering the columns `[employeeId]` on the table `UserMapping` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `reportingManagerId` to the `UserMapping` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "UserMapping" ADD COLUMN     "designation" TEXT,
ADD COLUMN     "employeeId" TEXT,
ADD COLUMN     "reportingManagerId" UUID NOT NULL,
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE';

-- CreateIndex
CREATE UNIQUE INDEX "UserMapping_employeeId_key" ON "UserMapping"("employeeId");

-- AddForeignKey
ALTER TABLE "UserMapping" ADD CONSTRAINT "UserMapping_reportingManagerId_fkey" FOREIGN KEY ("reportingManagerId") REFERENCES "UserMaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
