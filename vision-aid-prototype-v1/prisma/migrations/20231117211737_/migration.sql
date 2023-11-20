/*
  Warnings:

  - You are about to alter the column `deleted` on the `beneficiary` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `TinyInt`.

*/
-- AlterTable
ALTER TABLE `beneficiary` MODIFY `deleted` BOOLEAN NULL DEFAULT false;
