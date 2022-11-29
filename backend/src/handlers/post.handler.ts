import { Router } from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware';
import { prisma } from '../prisma';

export const router = Router();

router.use('/', isAuthenticated);

router.get('/', async (req, res, next) => {
  const search = req.query.search;
  const size = Number(req.query.pageSize) || 12;
  const page = Number(req.query.page) || 1;
  let orderQuery: any;
  let query = {};
  const pageQuery = {
    skip: size * (page - 1),
    take: size
  };
  if (req.query.sortByTs) {
    orderQuery = {
      orderBy: {
        ts: 'desc'
      }
    };
  } else {
    orderQuery = {
      orderBy: {
        voteScore: 'desc'
      }
    };
  }
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
        },
        {
          tags: {
            some: {
              value: { contains: search }
            }
          }
        }
      ]
    };
  }
  try {
    const result = await prisma.$transaction([
      prisma.post.count({
        where: query
      }),
      prisma.post.findMany({
        where: query,
        ...orderQuery,
        ...pageQuery,
        include: {
          user: true,
          tags: true
        }
      })
    ]);
    res.send({ total: result[0], result: result[1] });
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
        comments: {
          include: {
            user: true,
            reactions: {
              where: { count: { gt: 0 } },
              include: {
                users: {
                  include: {
                    user: true
                  }
                }
              }
            }
          }
        },
        reactions: { include: { user: true } },
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

// router.delete('/:id', async (req, res, next) => {
//   try {
//     const post = await prisma.post.findFirst({ where: { id: Number(req.params.id) } });
//     if (!post)
//       throw {
//         status: 404,
//         error: 'Post not found'
//       };

//     res.send(await prisma.post.delete({ where: { id: Number(req.params.id) } }));
//   } catch (error) {
//     next(error);
//   }
// });
