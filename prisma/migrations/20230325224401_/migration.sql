/*
  Warnings:

  - You are about to drop the column `beneficiaryNameRequired` on the `Beneficiary_Mirror` table. All the data in the column will be lost.
  - You are about to drop the column `dateOfBirthRequired` on the `Beneficiary_Mirror` table. All the data in the column will be lost.
  - You are about to drop the column `genderRequired` on the `Beneficiary_Mirror` table. All the data in the column will be lost.
  - You are about to drop the column `hospitalIdRequired` on the `Beneficiary_Mirror` table. All the data in the column will be lost.
  - Made the column `beneficiaryName` on table `Beneficiary` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dateOfBirth` on table `Beneficiary` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gender` on table `Beneficiary` required. This step will fail if there are existing NULL values in that column.
  - Made the column `hospitalId` on table `Beneficiary` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Beneficiary` MODIFY `beneficiaryName` VARCHAR(191) NOT NULL,
    MODIFY `dateOfBirth` DATETIME(3) NOT NULL,
    MODIFY `gender` VARCHAR(191) NOT NULL,
    MODIFY `hospitalId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Beneficiary_Mirror` DROP COLUMN `beneficiaryNameRequired`,
    DROP COLUMN `dateOfBirthRequired`,
    DROP COLUMN `genderRequired`,
    DROP COLUMN `hospitalIdRequired`;
