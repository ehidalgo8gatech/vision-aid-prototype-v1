/*
  Warnings:

  - You are about to drop the column `cost` on the `Comprehensive_Low_Vision_Evaluation` table. All the data in the column will be lost.
  - You are about to drop the column `costToBeneficiary` on the `Comprehensive_Low_Vision_Evaluation` table. All the data in the column will be lost.
  - You are about to drop the column `dispensed` on the `Comprehensive_Low_Vision_Evaluation` table. All the data in the column will be lost.
  - You are about to drop the column `dispensedDate` on the `Comprehensive_Low_Vision_Evaluation` table. All the data in the column will be lost.
  - You are about to drop the column `recommendation` on the `Comprehensive_Low_Vision_Evaluation` table. All the data in the column will be lost.
  - You are about to drop the column `recommendation` on the `Low_Vision_Evaluation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Comprehensive_Low_Vision_Evaluation` DROP COLUMN `cost`,
    DROP COLUMN `costToBeneficiary`,
    DROP COLUMN `dispensed`,
    DROP COLUMN `dispensedDate`,
    DROP COLUMN `recommendation`,
    ADD COLUMN `costElectronic` INTEGER NULL,
    ADD COLUMN `costNonOptical` INTEGER NULL,
    ADD COLUMN `costOptical` INTEGER NULL,
    ADD COLUMN `costToBeneficiaryElectronic` INTEGER NULL,
    ADD COLUMN `costToBeneficiaryNonOptical` INTEGER NULL,
    ADD COLUMN `costToBeneficiaryOptical` INTEGER NULL,
    ADD COLUMN `dispensedDateElectronic` DATETIME(3) NULL,
    ADD COLUMN `dispensedDateNonOptical` DATETIME(3) NULL,
    ADD COLUMN `dispensedDateOptical` DATETIME(3) NULL,
    ADD COLUMN `dispensedElectronic` VARCHAR(191) NULL,
    ADD COLUMN `dispensedNonOptical` VARCHAR(191) NULL,
    ADD COLUMN `dispensedOptical` VARCHAR(191) NULL,
    ADD COLUMN `recommendationElectronic` VARCHAR(191) NULL,
    ADD COLUMN `recommendationNonOptical` VARCHAR(191) NULL,
    ADD COLUMN `recommendationOptical` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Low_Vision_Evaluation` DROP COLUMN `recommendation`,
    ADD COLUMN `recommendationElectronic` VARCHAR(191) NULL,
    ADD COLUMN `recommendationNonOptical` VARCHAR(191) NULL,
    ADD COLUMN `recommendationOptical` VARCHAR(191) NULL;
