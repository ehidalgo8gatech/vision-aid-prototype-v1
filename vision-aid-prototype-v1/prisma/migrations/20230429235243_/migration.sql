-- AlterTable
ALTER TABLE `Comprehensive_Low_Vision_Evaluation` ADD COLUMN `costSpectical` INTEGER NULL,
    ADD COLUMN `costToBeneficiarySpectical` INTEGER NULL,
    ADD COLUMN `dispensedDateSpectical` DATETIME(3) NULL,
    ADD COLUMN `dispensedSpectical` VARCHAR(191) NULL,
    ADD COLUMN `recommendationSpectical` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Low_Vision_Evaluation` ADD COLUMN `recommendationSpectical` VARCHAR(191) NULL;
