/*
  Warnings:

  - You are about to drop the column `recommendations` on the `Comprehensive_Low_Vision_Evaluation` table. All the data in the column will be lost.
  - Added the required column `cost` to the `Comprehensive_Low_Vision_Evaluation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `costToBeneficiary` to the `Comprehensive_Low_Vision_Evaluation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dispensed` to the `Comprehensive_Low_Vision_Evaluation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `distanceBinocularVisionBE` to the `Comprehensive_Low_Vision_Evaluation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nearBinocularVisionBE` to the `Comprehensive_Low_Vision_Evaluation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recommendation` to the `Comprehensive_Low_Vision_Evaluation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Comprehensive_Low_Vision_Evaluation` DROP COLUMN `recommendations`,
    ADD COLUMN `cost` INTEGER NOT NULL,
    ADD COLUMN `costToBeneficiary` INTEGER NOT NULL,
    ADD COLUMN `dispensed` VARCHAR(191) NOT NULL,
    ADD COLUMN `dispensedDate` DATETIME(3) NULL,
    ADD COLUMN `distanceBinocularVisionBE` VARCHAR(191) NOT NULL,
    ADD COLUMN `nearBinocularVisionBE` VARCHAR(191) NOT NULL,
    ADD COLUMN `recommendation` VARCHAR(191) NOT NULL;
