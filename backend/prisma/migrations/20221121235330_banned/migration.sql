/*
  Warnings:

  - Changed the type of `ts` on the `Post` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `ts` on the `PostComment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `ts` on the `PostCommentReaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `ts` on the `PostReaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE `Post` DROP COLUMN `ts`,
    ADD COLUMN `ts` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `PostComment` DROP COLUMN `ts`,
    ADD COLUMN `ts` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `PostCommentReaction` DROP COLUMN `ts`,
    ADD COLUMN `ts` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `PostReaction` DROP COLUMN `ts`,
    ADD COLUMN `ts` DATETIME(3) NOT NULL;
