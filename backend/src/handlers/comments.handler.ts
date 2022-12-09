import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { prisma } from '../prisma';
import { publicProcedure, router } from './trpc.handler';

export const commentRouter = router({
  create: publicProcedure

    .input(
      z.object({
        text: z.string().min(3),
        id: z.number()
      })
    )
    .mutation(async req => {
      let post = await prisma.post.findFirst({ where: { id: req.input.id } });
      if (!post)
        throw new TRPCError({
          code: 'NOT_FOUND'
        });
      const data = {
        text: req.input.text,
        votes: [],
        voteScore: 0,
        reactions: [],
        ts: new Date().getTime(),
        replies: []
      };
      return await prisma.postComment.create({
        data: {
          postId: post.id,
          ts: new Date(),
          userId: req.ctx.user.id,
          text: data.text
        },
        include: {
          user: true
        }
      });
    }),
  update: publicProcedure

    .input(
      z.object({
        text: z.string().min(3),
        id: z.number()
      })
    )
    .mutation(async req => {
      let post = await prisma.postComment.findFirst({ where: { userId: req.ctx.user.id, id: req.input.id } });
      if (!post)
        throw new TRPCError({
          code: 'NOT_FOUND'
        });
      const data = {
        text: req.input.text
      };

      return await prisma.postComment.update({ where: { id: req.input.id }, data });
    }),
  delete: publicProcedure

    .input(
      z.object({
        id: z.number()
      })
    )
    .mutation(async req => {
      const post = await prisma.postComment.findFirst({ where: { id: req.input.id, userId: req.ctx.user.id } });
      if (!post)
        throw new TRPCError({
          code: 'NOT_FOUND'
        });
      await prisma.postComment.delete({ where: { id: req.input.id } });
      return { success: true };
    })
});

export type CommentRouter = typeof commentRouter;
