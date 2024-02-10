/*
  Warnings:

  - You are about to drop the column `costSpectacle` on the `Comprehensive_Low_Vision_Evaluation` table. All the data in the column will be lost.
  - You are about to drop the column `costToBeneficiarySpectacle` on the `Comprehensive_Low_Vision_Evaluation` table. All the data in the column will be lost.
  - You are about to drop the column `dispensedDateSpectacle` on the `Comprehensive_Low_Vision_Evaluation` table. All the data in the column will be lost.
  - You are about to drop the column `dispensedSpectacle` on the `Comprehensive_Low_Vision_Evaluation` table. All the data in the column will be lost.
  - You are about to drop the column `recommendationSpectacle` on the `Comprehensive_Low_Vision_Evaluation` table. All the data in the column will be lost.
  - You are about to drop the column `recommendationSpectacle` on the `Low_Vision_Evaluation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Comprehensive_Low_Vision_Evaluation` DROP COLUMN `costSpectacle`,
    DROP COLUMN `costToBeneficiarySpectacle`,
    DROP COLUMN `dispensedDateSpectacle`,
    DROP COLUMN `dispensedSpectacle`,
    DROP COLUMN `recommendationSpectacle`,
    ADD COLUMN `costSpectacle` INTEGER NULL,
    ADD COLUMN `costToBeneficiarySpectacle` INTEGER NULL,
    ADD COLUMN `dispensedDateSpectacle` DATETIME(3) NULL,
    ADD COLUMN `dispensedSpectacle` VARCHAR(191) NULL,
    ADD COLUMN `recommendationSpectacle` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Low_Vision_Evaluation` DROP COLUMN `recommendationSpectacle`,
    ADD COLUMN `recommendationSpectacle` VARCHAR(191) NULL;
