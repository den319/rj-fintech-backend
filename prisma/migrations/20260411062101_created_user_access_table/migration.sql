-- CreateEnum
CREATE TYPE "AccessType" AS ENUM ('PRIMARY', 'SECONDARY');

-- CreateTable
CREATE TABLE "UserAccess" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "nodeId" UUID NOT NULL,
    "roleCode" TEXT NOT NULL,
    "isGlobalAccess" BOOLEAN NOT NULL DEFAULT false,
    "accessType" "AccessType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserAccess_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserAccess" ADD CONSTRAINT "UserAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserMaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAccess" ADD CONSTRAINT "UserAccess_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "CompanyMaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAccess" ADD CONSTRAINT "UserAccess_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "OrgStructure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAccess" ADD CONSTRAINT "UserAccess_roleCode_fkey" FOREIGN KEY ("roleCode") REFERENCES "Role"("roleCode") ON DELETE RESTRICT ON UPDATE CASCADE;
