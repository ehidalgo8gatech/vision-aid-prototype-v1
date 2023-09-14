-- AlterTable
ALTER TABLE `Comprehensive_Low_Vision_Evaluation` ADD COLUMN `costSpectacle` INTEGER NULL,
    ADD COLUMN `costToBeneficiarySpectacle` INTEGER NULL,
    ADD COLUMN `dispensedDateSpectacle` DATETIME(3) NULL,
    ADD COLUMN `dispensedSpectacle` VARCHAR(191) NULL,
    ADD COLUMN `recommendationSpectacle` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Low_Vision_Evaluation` ADD COLUMN `recommendationSpectacle` VARCHAR(191) NULL;
