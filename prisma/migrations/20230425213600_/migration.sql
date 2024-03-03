/*
  Warnings:

  - You are about to drop the column `typeOfCounselling` on the `Computer_Training` table. All the data in the column will be lost.
  - You are about to drop the column `typeOfCounselling` on the `Mobile_Training` table. All the data in the column will be lost.
  - You are about to drop the column `typeOfCounselling` on the `Orientation_Mobility_Training` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Computer_Training` DROP COLUMN `typeOfCounselling`,
    ADD COLUMN `typeOfTraining` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Mobile_Training` DROP COLUMN `typeOfCounselling`,
    ADD COLUMN `typeOfTraining` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Orientation_Mobility_Training` DROP COLUMN `typeOfCounselling`,
    ADD COLUMN `typeOfTraining` VARCHAR(191) NULL;
