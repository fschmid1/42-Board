import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { isAuthenticated } from '../middlewares/auth.middleware';
import { prisma } from '../prisma';
import { publicProcedure, router } from './trpc.handler';

export const voteRouter = router({
  post: publicProcedure

    .input(
      z.object({
        id: z.number(),
        up: z.boolean()
      })
    )
    .mutation(async req => {
      const data = req.input;
      try {
        let post = await prisma.post.findFirst({ where: { id: data.id }, include: { votes: true } });

        if (!post)
          throw {
            status: 404,
            error: 'Post not found'
          };
        let vote = post?.votes.find((el: any) => el.userId == req.ctx.user.id);
        if (vote) {
          if (!vote.up && data.up) {
            post.voteScore += 2;
            vote.up = true;
          } else if (vote.up && !data.up) {
            post.voteScore -= 2;
            vote.up = false;
          }
        } else {
          post.voteScore += data.up ? 1 : -1;
          vote = { up: data.up, userId: req.ctx.user.id, postId: post.id, id: 0 };
        }
        await Promise.all([
          prisma.postVote.upsert({
            where: { id: vote.id },
            create: {
              up: vote.up,
              userId: vote.userId,
              postId: vote.postId
            },
            update: {
              up: vote.up
            }
          }),
          prisma.post.update({ where: { id: post.id }, data: { voteScore: post.voteScore } })
        ]);
        return { score: post.voteScore };
      } catch (error) {
        throw new TRPCError({ code: 'BAD_REQUEST' });
      }
    }),
  comment: publicProcedure

    .input(
      z.object({
        id: z.number(),
        up: z.boolean()
      })
    )
    .mutation(async req => {
      const data = req.input;
      try {
        let comment = await prisma.postComment.findFirst({ where: { id: data.id }, include: { votes: true } });

        if (!comment)
          throw {
            status: 404,
            error: 'Comment not found'
          };
        let vote = comment?.votes.find((el: any) => el.userId == req.ctx.user.id);
        if (vote) {
          if (!vote.up && data.up) {
            comment.voteScore += 2;
            vote.up = true;
          } else if (vote.up && !data.up) {
            comment.voteScore -= 2;
            vote.up = false;
          }
        } else {
          comment.voteScore += data.up ? 1 : -1;
          vote = { up: data.up, userId: req.ctx.user.id, commentId: comment.id, id: 0 };
        }
        await Promise.all([
          prisma.commentVote.upsert({
            where: { id: vote.id },
            create: {
              up: vote.up,
              userId: vote.userId,
              commentId: vote.commentId
            },
            update: {
              up: vote.up
            }
          }),
          prisma.postComment.update({ where: { id: comment.id }, data: { voteScore: comment.voteScore } })
        ]);
        return { score: comment.voteScore };
      } catch (error) {
        throw new TRPCError({ code: 'BAD_REQUEST' });
      }
    })
});

export type VoteRouter = typeof voteRouter;
