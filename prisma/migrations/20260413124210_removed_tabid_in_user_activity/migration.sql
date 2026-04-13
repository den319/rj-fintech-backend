/*
  Warnings:

  - You are about to drop the column `tabId` on the `UserActivity` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[token]` on the table `UserActivity` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "UserActivity" DROP COLUMN "tabId";

-- CreateIndex
CREATE UNIQUE INDEX "UserActivity_token_key" ON "UserActivity"("token");
