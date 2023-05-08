/*
  Warnings:

  - Added the required column `trainingTypeId` to the `Training_Sub_Type` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Training_Sub_Type` ADD COLUMN `trainingTypeId` INTEGER NOT NULL;
