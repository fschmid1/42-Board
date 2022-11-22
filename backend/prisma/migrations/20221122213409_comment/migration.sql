/*
  Warnings:

  - Added the required column `text` to the `PostComment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `PostComment` ADD COLUMN `text` VARCHAR(191) NOT NULL;
