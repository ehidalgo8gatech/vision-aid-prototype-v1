-- AlterTable
ALTER TABLE `Comprehensive_Low_Vision_Evaluation` ADD COLUMN `trainingGivenElectronic` VARCHAR(191) NULL,
    ADD COLUMN `trainingGivenNonOptical` VARCHAR(191) NULL,
    ADD COLUMN `trainingGivenOptical` VARCHAR(191) NULL,
    ADD COLUMN `trainingGivenSpectacle` VARCHAR(191) NULL;
