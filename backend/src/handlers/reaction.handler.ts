import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { isAuthenticated } from '../middlewares/auth.middleware';
import { prisma } from '../prisma';
import { publicProcedure, router } from './trpc.handler';

export const reactionRouter = router({
  comment: publicProcedure.input(z.object({ id: z.number(), emote: z.string().min(1) })).mutation(async req => {
    const data = req.input;
    try {
      let comment = await prisma.postComment.findFirst({
        where: { id: data.id },
        include: {
          reactions: {
            include: {
              users: true
            }
          }
        }
      });

      if (!comment)
        throw {
          status: 404,
          error: 'Comment not found'
        };
      let reaction = comment?.reactions.find((el: any) => el.emote == data.emote);
      if (!reaction) {
        reaction = await prisma.postCommentReaction.create({
          data: {
            count: 0,
            ts: new Date(),
            emote: data.emote,
            commentId: data.id
          },
          include: {
            users: true
          }
        });
      }
      let user = reaction?.users.find((el: any) => el.userId == req.ctx.user.id);
      if (user) {
        await prisma.postCommentReaction.update({
          where: { id: reaction.id },
          data: {
            count: reaction.count - 1,
            users: {
              delete: {
                reactionId_userId: {
                  userId: req.ctx.user.id,
                  reactionId: reaction.id
                }
              }
            }
          }
        });
      } else {
        await prisma.postCommentReaction.update({
          where: { id: reaction.id },
          data: {
            count: reaction.count + 1,
            users: {
              create: {
                userId: req.ctx.user.id
              }
            }
          }
        });
      }
      return prisma.postCommentReaction.findMany({
        where: {
          commentId: data.id,
          count: {
            gt: 0
          }
        },
        include: {
          users: {
            include: {
              user: true
            }
          }
        }
      });
    } catch (error) {
      throw new TRPCError({ code: 'BAD_REQUEST' });
    }
  })
});

export type ReactionRouter = typeof reactionRouter;
