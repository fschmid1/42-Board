/*
  Warnings:

  - Added the required column `count` to the `PostCommentReaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `PostCommentReaction` ADD COLUMN `count` INTEGER NOT NULL;
