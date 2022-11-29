<<<<<<< HEAD
=======
import { PostCommentReaction } from '@prisma/client';
>>>>>>> 3792e8781bd81ff102e9a5c1556801967e88f1f5
import { Router } from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware';
import { prisma } from '../prisma';

export const router = Router();

router.use('/', isAuthenticated);

router.post('/comments/', async (req, res, next) => {
  try {
    let comment = await prisma.postComment.findFirst({
      where: { id: req.body.id },
      include: {
<<<<<<< HEAD
        reactions: true
=======
        reactions: {
          include: {
            users: true
          }
        }
>>>>>>> 3792e8781bd81ff102e9a5c1556801967e88f1f5
      }
    });

    if (!comment)
      throw {
        status: 404,
        error: 'Comment not found'
      };
<<<<<<< HEAD
    let reaction = comment?.reactions.find((el: any) => el.userId == (req.user as any).id && el.emote == req.body.emote);
    if (reaction) {
      await prisma.postCommentReaction.delete({ where: { id: reaction.id } });
    } else {
      reaction = await prisma.postCommentReaction.create({
        data: {
          commentId: comment.id,
          userId: (req.user as any).id,
          ts: new Date(),
          emote: req.body.emote
        }
      });
    }
    res.send(reaction);
=======
    let reaction = comment?.reactions.find((el: any) => el.emote == req.body.emote);
    if (!reaction) {
      reaction = await prisma.postCommentReaction.create({
        data: {
          count: 1,
          ts: new Date(),
          emote: req.body.emote,
          commentId: req.body.id,
          users: {
            create: {
              userId: (req.user as any).id
            }
          }
        },
        include: {
          users: true
        }
      });
    }
    let user = reaction?.users.find(el => el.userId == (req.user as any).id);
    if (user) {
      await prisma.postCommentReaction.update({
        where: { id: reaction.id },
        data: {
          count: reaction.count - 1,
          users: {
            delete: {
              reactionId_userId: {
                userId: (req.user as any).id,
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
              userId: (req.user as any).id
            }
          }
        }
      });
    }
    res.send(
      await prisma.postCommentReaction.findMany({
        where: {
          commentId: req.body.id,
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
      })
    );
>>>>>>> 3792e8781bd81ff102e9a5c1556801967e88f1f5
  } catch (error) {
    next(error);
  }
});

router.post('/comments/', async (req, res, next) => {
  try {
    let comment = await prisma.postComment.findFirst({ where: { id: req.body.id }, include: { votes: true } });

    if (!comment)
      throw {
        status: 404,
        error: 'Comment not found'
      };
    let vote = comment?.votes.find((el: any) => el.userId == (req.user as any).id);
    if (vote) {
      if (!vote.up && req.body.up) {
        comment.voteScore += 2;
        vote.up = true;
      } else if (vote.up && !req.body.up) {
        comment.voteScore -= 2;
        vote.up = false;
      }
    } else {
      comment.voteScore += req.body.up ? 1 : -1;
      vote = { up: req.body.up, userId: (req.user as any).id, commentId: comment.id, id: 0 };
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
    res.send({ score: comment.voteScore });
  } catch (error) {
    next(error);
  }
});
