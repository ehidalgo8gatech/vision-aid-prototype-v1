/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Landing_Page` will be added. If there are existing duplicate values, this will fail.
  - Made the column `userId` on table `Landing_Page` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Landing_Page` MODIFY `userId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Landing_Page_userId_key` ON `Landing_Page`(`userId`);
