/*
  Warnings:

  - Added the required column `extraInformation` to the `Counselling_Education` table without a default value. This is not possible if the table is not empty.
  - Added the required column `extraInformation` to the `Orientation_Mobility_Training` table without a default value. This is not possible if the table is not empty.
  - Added the required column `extraInformation` to the `Vision_Enhancement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Counselling_Education` ADD COLUMN `extraInformation` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `Orientation_Mobility_Training` ADD COLUMN `extraInformation` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `Vision_Enhancement` ADD COLUMN `extraInformation` TEXT NOT NULL;
