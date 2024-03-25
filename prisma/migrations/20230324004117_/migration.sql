/*
  Warnings:

  - Made the column `mDVIRequired` on table `Beneficiary_Mirror` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Beneficiary_Mirror` MODIFY `id` INTEGER NOT NULL,
    MODIFY `mDVIRequired` BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE `Computer_Training_Mirror` MODIFY `id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Counselling_Education_Mirror` MODIFY `id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Mobile_Training_Mirror` MODIFY `id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Orientation_Mobility_Training_Mirror` MODIFY `id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Vision_Enhancement_Mirror` MODIFY `id` INTEGER NOT NULL;
