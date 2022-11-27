-- DropForeignKey
ALTER TABLE `PostVote` DROP FOREIGN KEY `PostVote_postId_fkey`;

-- DropForeignKey
ALTER TABLE `PostVote` DROP FOREIGN KEY `PostVote_userId_fkey`;

-- AddForeignKey
ALTER TABLE `PostVote` ADD CONSTRAINT `PostVote_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PostVote` ADD CONSTRAINT `PostVote_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
