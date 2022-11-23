import { Router } from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware';
import { prisma } from '../prisma';

export const router = Router();

router.use('/', isAuthenticated);

router.post('/posts/', async (req, res, next) => {
  try {
    let post = await prisma.post.findFirst({ where: { id: req.body.id }, include: { votes: true } });

    if (!post)
      throw {
        status: 404,
        error: 'Post not found'
      };
    let vote = post?.votes.find((el: any) => el.userId == (req.user as any).id);
    if (vote) {
      if (!vote.up && req.body.up) {
        post.voteScore += 2;
        vote.up = true;
      } else if (vote.up && !req.body.up) {
        post.voteScore -= 2;
        vote.up = false;
      }
    } else {
      post.voteScore += req.body.up ? 1 : -1;
      vote = { up: req.body.up, userId: (req.user as any).id, postId: post.id, id: 0 };
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
    res.send({ score: post.voteScore });
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
