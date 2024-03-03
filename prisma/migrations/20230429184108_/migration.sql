-- CreateTable
CREATE TABLE `Training` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `beneficiaryId` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NULL,
    `sessionNumber` INTEGER NULL,
    `typeOfTraining` VARCHAR(191) NULL,
    `extraInformation` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
