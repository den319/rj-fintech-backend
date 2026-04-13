/*
  Warnings:

  - You are about to drop the column `token` on the `UserActivity` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[selector]` on the table `UserActivity` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `selector` to the `UserActivity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `validator` to the `UserActivity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserActivity" DROP COLUMN "token",
ADD COLUMN     "selector" TEXT NOT NULL,
ADD COLUMN     "validator" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserActivity_selector_key" ON "UserActivity"("selector");

-- CreateIndex
CREATE INDEX "UserActivity_selector_idx" ON "UserActivity"("selector");
