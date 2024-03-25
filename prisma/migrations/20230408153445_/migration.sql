-- AlterTable
ALTER TABLE `Beneficiary_Mirror` ADD COLUMN `hospitalName` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Computer_Training_Mirror` ADD COLUMN `hospitalName` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Counselling_Education_Mirror` ADD COLUMN `hospitalName` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Mobile_Training_Mirror` ADD COLUMN `hospitalName` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Orientation_Mobility_Training_Mirror` ADD COLUMN `hospitalName` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Vision_Enhancement_Mirror` ADD COLUMN `hospitalName` VARCHAR(191) NULL;
