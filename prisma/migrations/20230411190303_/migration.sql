-- AlterTable
ALTER TABLE `Counselling_Education` ADD COLUMN `MDVI` VARCHAR(191) NULL,
    ADD COLUMN `vision` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Mobile_Training` ADD COLUMN `typeOfCounselling` VARCHAR(191) NULL,
    ADD COLUMN `vision` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Orientation_Mobility_Training` ADD COLUMN `typeOfCounselling` VARCHAR(191) NULL,
    ADD COLUMN `vision` VARCHAR(191) NULL;
