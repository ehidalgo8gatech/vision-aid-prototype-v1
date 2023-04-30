/*
  Warnings:

  - You are about to drop the column `costSpectical` on the `Comprehensive_Low_Vision_Evaluation` table. All the data in the column will be lost.
  - You are about to drop the column `costToBeneficiarySpectical` on the `Comprehensive_Low_Vision_Evaluation` table. All the data in the column will be lost.
  - You are about to drop the column `dispensedDateSpectical` on the `Comprehensive_Low_Vision_Evaluation` table. All the data in the column will be lost.
  - You are about to drop the column `dispensedSpectical` on the `Comprehensive_Low_Vision_Evaluation` table. All the data in the column will be lost.
  - You are about to drop the column `recommendationSpectical` on the `Comprehensive_Low_Vision_Evaluation` table. All the data in the column will be lost.
  - You are about to drop the column `recommendationSpectical` on the `Low_Vision_Evaluation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Comprehensive_Low_Vision_Evaluation` DROP COLUMN `costSpectical`,
    DROP COLUMN `costToBeneficiarySpectical`,
    DROP COLUMN `dispensedDateSpectical`,
    DROP COLUMN `dispensedSpectical`,
    DROP COLUMN `recommendationSpectical`,
    ADD COLUMN `costSpectacle` INTEGER NULL,
    ADD COLUMN `costToBeneficiarySpectacle` INTEGER NULL,
    ADD COLUMN `dispensedDateSpectacle` DATETIME(3) NULL,
    ADD COLUMN `dispensedSpectacle` VARCHAR(191) NULL,
    ADD COLUMN `recommendationSpectacle` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Low_Vision_Evaluation` DROP COLUMN `recommendationSpectical`,
    ADD COLUMN `recommendationSpectacle` VARCHAR(191) NULL;
