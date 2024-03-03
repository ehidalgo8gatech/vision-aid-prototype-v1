/*
  Warnings:

  - A unique constraint covering the columns `[trainingTypeId,value]` on the table `Training_Sub_Type` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Training_Sub_Type_value_key` ON `Training_Sub_Type`;

-- CreateIndex
CREATE UNIQUE INDEX `Training_Sub_Type_trainingTypeId_value_key` ON `Training_Sub_Type`(`trainingTypeId`, `value`);
