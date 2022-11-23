import { Router } from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware';
import { prisma } from '../prisma';

export const router = Router();

router.use('/', isAuthenticated);

router.post('/', async (req, res, next) => {
  try {
    let post = await prisma.post.findFirst({ where: { id: (req.body as any).id } });
    if (!post)
      throw {
        status: 400,
        error: 'Post not found'
      };
    const data = {
      text: req.body.text,
      votes: [],
      voteScore: 0,
      reactions: [],
      ts: new Date().getTime(),
      replies: []
    };
    const comment = await prisma.postComment.create({
      data: {
        postId: post.id,
        ts: new Date(),
        userId: (req.user as any).id,
        text: data.text
      }
    });
    res.send(comment);
  } catch (error) {
    next(error);
  }
});

router.patch('/', async (req, res, next) => {
  try {
    let post = await prisma.postComment.findFirst({ where: { userId: (req.user as any).id, id: req.body.id } });
    if (!post)
      throw {
        status: 400,
        error: 'Post not found'
      };
    const data = {
      text: req.body.text
    };
    await prisma.postComment.update({ where: { id: req.body.id }, data });
    res.send({ success: true });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const post = await prisma.postComment.findFirst({ where: { id, userId: (req.user as any).id } });
    if (!post)
      throw {
        status: 404,
        error: 'Post not found'
      };
    await prisma.postComment.delete({ where: { id } });
    res.send({ success: true });
  } catch (error) {
    next(error);
  }
});
