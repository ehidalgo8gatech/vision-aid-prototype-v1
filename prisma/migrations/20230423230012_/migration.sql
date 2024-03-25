-- CreateTable
CREATE TABLE `Low_Vision_Evaluation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `beneficiaryId` VARCHAR(191) NOT NULL,
    `diagnosis` VARCHAR(191) NULL,
    `date` DATETIME(3) NULL,
    `sessionNumber` INTEGER NULL,
    `distanceVisualAcuityRE` VARCHAR(191) NULL,
    `distanceVisualAcuityLE` VARCHAR(191) NULL,
    `distanceBinocularVisionBE` VARCHAR(191) NULL,
    `nearVisualAcuityRE` VARCHAR(191) NULL,
    `nearVisualAcuityLE` VARCHAR(191) NULL,
    `nearBinocularVisionBE` VARCHAR(191) NULL,
    `recommendation` VARCHAR(191) NULL,
    `extraInformation` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
