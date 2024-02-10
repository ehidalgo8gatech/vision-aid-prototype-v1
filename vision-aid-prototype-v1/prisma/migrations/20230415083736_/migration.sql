/*
  Warnings:

  - The primary key for the `Comprehensive_Low_Vision_Evaluation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `id` to the `Comprehensive_Low_Vision_Evaluation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Comprehensive_Low_Vision_Evaluation` DROP PRIMARY KEY,
    ADD COLUMN `id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);
