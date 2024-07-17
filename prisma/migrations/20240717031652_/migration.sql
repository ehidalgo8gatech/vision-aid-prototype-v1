-- AlterTable
ALTER TABLE `User` ADD COLUMN `lastUpdate` VARCHAR(191) NULL,
    ADD COLUMN `lastUpdateDate` DATETIME(3) NULL;
