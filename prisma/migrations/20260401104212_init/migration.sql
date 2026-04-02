-- CreateTable
CREATE TABLE "UserMaster" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "UserMaster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyMaster" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gst" TEXT,
    "brand" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "CompanyMaster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupCompanyMaster" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "GroupCompanyMaster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserActivity" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserMapping" (
    "userId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserMapping_pkey" PRIMARY KEY ("userId","companyId")
);

-- CreateTable
CREATE TABLE "CompanyMapping" (
    "companyId" TEXT NOT NULL,
    "groupCompanyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyMapping_pkey" PRIMARY KEY ("companyId","groupCompanyId")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserMaster_email_key" ON "UserMaster"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyMaster_gst_key" ON "CompanyMaster"("gst");

-- CreateIndex
CREATE INDEX "UserActivity_userId_idx" ON "UserActivity"("userId");

-- CreateIndex
CREATE INDEX "UserMapping_companyId_idx" ON "UserMapping"("companyId");

-- CreateIndex
CREATE INDEX "CompanyMapping_groupCompanyId_idx" ON "CompanyMapping"("groupCompanyId");
