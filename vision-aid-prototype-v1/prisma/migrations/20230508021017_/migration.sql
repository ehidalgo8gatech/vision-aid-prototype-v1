/*
  Warnings:

  - A unique constraint covering the columns `[value]` on the table `Counselling_Type` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[value]` on the table `Training_Type` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE `Training_Sub_Type` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `value` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Training_Sub_Type_value_key`(`value`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Counselling_Type_value_key` ON `Counselling_Type`(`value`);

-- CreateIndex
CREATE UNIQUE INDEX `Training_Type_value_key` ON `Training_Type`(`value`);
