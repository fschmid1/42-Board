/*
  Warnings:

  - You are about to drop the column `userId` on the `PostCommentReaction` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `PostCommentReaction` DROP FOREIGN KEY `PostCommentReaction_userId_fkey`;

-- AlterTable
ALTER TABLE `PostCommentReaction` DROP COLUMN `userId`;

-- CreateTable
CREATE TABLE `UserOnPostCommentReaction` (
    `reactionId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`reactionId`, `userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserOnPostCommentReaction` ADD CONSTRAINT `UserOnPostCommentReaction_reactionId_fkey` FOREIGN KEY (`reactionId`) REFERENCES `PostCommentReaction`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserOnPostCommentReaction` ADD CONSTRAINT `UserOnPostCommentReaction_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
