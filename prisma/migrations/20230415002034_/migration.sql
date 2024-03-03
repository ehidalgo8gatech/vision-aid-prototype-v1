-- CreateTable
CREATE TABLE `Comprehensive_Low_Vision_Evaluation` (
    `beneficiaryId` VARCHAR(191) NOT NULL,
    `distanceVisualAcuityRE` VARCHAR(191) NOT NULL,
    `distanceVisualAcuityLE` VARCHAR(191) NOT NULL,
    `nearVisualAcuityRE` VARCHAR(191) NOT NULL,
    `nearVisualAcuityLE` VARCHAR(191) NOT NULL,
    `recommendations` VARCHAR(191) NOT NULL,
    `extraInformation` TEXT NOT NULL,

    PRIMARY KEY (`beneficiaryId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Comprehensive_Low_Vision_Evaluation_Mirror` (
    `id` INTEGER NOT NULL,
    `extraInformationRequired` TEXT NOT NULL,
    `hospitalName` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
