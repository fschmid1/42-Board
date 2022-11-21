-- AlterTable
ALTER TABLE `Post` MODIFY `ts` BIGINT NOT NULL;

-- AlterTable
ALTER TABLE `PostComment` MODIFY `ts` BIGINT NOT NULL;

-- AlterTable
ALTER TABLE `PostCommentReaction` MODIFY `ts` BIGINT NOT NULL;

-- AlterTable
ALTER TABLE `PostReaction` MODIFY `ts` BIGINT NOT NULL;
