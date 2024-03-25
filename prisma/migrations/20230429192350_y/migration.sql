/*
  Warnings:

  - You are about to drop the column `typeOfTraining` on the `Training` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Counselling_Education` ADD COLUMN `type` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Training` DROP COLUMN `typeOfTraining`,
    ADD COLUMN `type` VARCHAR(191) NULL;
