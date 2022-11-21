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

// router.patch('/', async (req, res, next) => {
//   try {
//     let post = await Post.findOne({ _id: req.body._id, user: req.user });
//     if (!post)
//       throw {
//         status: 400,
//         error: 'Post not found'
//       };
//     const data = {
//       name: req.body.name,
//       content: req.body.content,
//       tags: req.body.tags
//     };
//     await Post.updateOne({ _id: post._id }, data, { runValidators: true });
//     res.send({ ...post.toObject(), ...data });
//   } catch (error) {
//     next(error);
//   }
// });

// router.delete('/:id', async (req, res, next) => {
//   try {
//     const post = await Post.findOne({ _id: req.params.id });
//     if (!post)
//       throw {
//         status: 404,
//         error: 'Post not found'
//       };

//     res.send(await Post.deleteOne({ _id: post._id }));
//   } catch (error) {
//     next(error);
//   }
// });
