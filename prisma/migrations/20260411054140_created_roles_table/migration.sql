/*
  Warnings:

  - Added the required column `roleCode` to the `UserMapping` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Category" AS ENUM ('SYSTEM_ACCESS');

-- CreateEnum
CREATE TYPE "SubCategory" AS ENUM ('ADMIN', 'USER_ACC', 'ORG_STR', 'WORK_FLOW');

-- CreateEnum
CREATE TYPE "PermissionLevel" AS ENUM ('VIEWER', 'USER', 'MANAGER');

-- AlterTable
ALTER TABLE "UserMapping" ADD COLUMN     "roleCode" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Role" (
    "roleCode" TEXT NOT NULL,
    "roleName" TEXT NOT NULL,
    "category" "Category" NOT NULL,
    "subCategory" "SubCategory" NOT NULL,
    "permissionLevel" "PermissionLevel" NOT NULL,
    "view" BOOLEAN NOT NULL DEFAULT false,
    "modify" BOOLEAN NOT NULL DEFAULT false,
    "approve" BOOLEAN NOT NULL DEFAULT false,
    "initiate" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("roleCode")
);

-- AddForeignKey
ALTER TABLE "UserMapping" ADD CONSTRAINT "UserMapping_roleCode_fkey" FOREIGN KEY ("roleCode") REFERENCES "Role"("roleCode") ON DELETE RESTRICT ON UPDATE CASCADE;
