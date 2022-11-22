import { Router } from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware';
import { prisma } from '../prisma';

export const router = Router();

router.use('/', isAuthenticated);

router.get('/', async (req, res, next) => {
  const search = req.query.search;
  let query = {};
  if (search) {
    query = {
      OR: [
        {
          name: { contains: search }
        },
        {
          content: { contains: search }
        },
        {
          user: {
            username: {
              contains: search
            }
          }
        }
      ]
    };
  }
  try {
    if (req.query.sortByTs) {
      res.send(
        await prisma.post.findMany({
          where: query,
          orderBy: {
            ts: 'desc'
          },
          include: {
            user: true,
            tags: true
          }
        })
      );
    } else {
      res.send(
        await prisma.post.findMany({
          where: query,
          orderBy: {
            voteScore: 'desc'
          },
          include: {
            user: true,
            tags: true
          }
        })
      );
    }
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const post = await prisma.post.findFirst({
      where: { id: Number(req.params.id) },
      include: {
        user: true,
        comments: true,
        reactions: true,
        tags: true
      }
    });
    if (!post)
      throw {
        status: 404,
        error: 'Post not found'
      };
    res.send(post);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const data = {
      name: req.body.name,
      content: req.body.content,
      tags: req.body.tags as string[],
      user: req.user
    };
    const post = await prisma.post.create({
      data: {
        content: data.content,
        name: data.name,
        ts: new Date(),
        userId: (req.user as any).id ?? 0,
        tags: {
          createMany: {
            data: data.tags.map(tag => ({ value: tag })),
            skipDuplicates: true
          }
        }
      },
      include: {
        user: true,
        comments: true,
        reactions: true,
        tags: true
      }
    });
    res.send(post);
  } catch (error) {
    next(error);
  }
});

router.patch('/', async (req, res, next) => {
  try {
    let post = await prisma.post.findFirst({
      where: { id: Number(req.body.id ?? '0'), userId: (req.user as any).id },
      include: { tags: true }
    });
    if (!post)
      throw {
        status: 400,
        error: 'Post not found'
      };
    const data = {
      name: req.body.name,
      content: req.body.content,
      tags: req.body.tags
    };
    await prisma.post.update({
      where: {
        id: req.body.id
      },
      data: {
        name: data.name,
        content: data.content,
        tags: {
          createMany: {
            data: data.tags.map((tag: string) => ({ value: tag })),
            skipDuplicates: true
          }
        }
      }
    });
    post = await prisma.post.findFirst({
      where: { id: post.id },
      include: {
        user: true,
        comments: true,
        reactions: true,
        tags: true
      }
    });
    res.send(post);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const post = await prisma.post.findFirst({ where: { id: Number(req.params.id) } });
    if (!post)
      throw {
        status: 404,
        error: 'Post not found'
      };

    res.send(await prisma.post.delete({ where: { id: Number(req.params.id) } }));
  } catch (error) {
    next(error);
  }
});
