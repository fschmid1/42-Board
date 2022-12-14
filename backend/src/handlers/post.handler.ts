import { z } from 'zod';
import { prisma } from '../prisma';
import { publicProcedure, router } from './trpc.handler';

export const postRouter = router({
  list: publicProcedure
    .input(
      z.object({
        search: z.string().optional(),
        size: z.number().default(12),
        page: z.number().default(1),
        sortByTs: z.boolean().default(false)
      })
    )
    .query(async ({ input }) => {
      let orderQuery: any;
      let query = {};
      const pageQuery = {
        skip: input.size * (input.page - 1),
        take: input.size
      };
      if (input.sortByTs) {
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
      if (input.search) {
        query = {
          OR: [
            {
              name: { contains: input.search }
            },
            {
              content: { contains: input.search }
            },
            {
              user: {
                username: {
                  contains: input.search
                }
              }
            },
            {
              tags: {
                some: {
                  value: { contains: input.search }
                }
              }
            }
          ]
        };
      }
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
      return { total: result[0], result: result[1] };
    }),
  getById: publicProcedure.input(z.object({ id: z.number() })).query(({ input }) =>
    prisma.post.findFirst({
      where: { id: input.id },
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
    })
  ),
  create: publicProcedure

    .input(
      z.object({
        name: z.string().min(3),
        content: z.string().min(5),
        tags: z.string().array()
      })
    )
    .mutation(async req => {
      const data = req.input;
      return prisma.post.create({
        data: {
          content: data.content,
          name: data.name,
          ts: new Date(),
          userId: req.ctx.user?.id ?? 0,
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
    }),
  update: publicProcedure

    .input(
      z.object({
        name: z.string().min(3),
        content: z.string().min(5),
        tags: z.string().array(),
        id: z.number()
      })
    )
    .mutation(async req => {
      const data = req.input;
      let post = await prisma.post.findFirst({
        where: { id: data.id, userId: req.ctx.user.id },
        include: { tags: true }
      });
      if (!post)
        throw {
          status: 400,
          error: 'Post not found'
        };
      await prisma.post.update({
        where: {
          id: data.id
        },
        data: {
          name: data.name,
          content: data.content,
          tags: {
            createMany: {
              data: data.tags
                .map((tag: string) => ({ value: tag }))
                .filter(el => {
                  el.value !== post?.tags.find((tag: any) => tag.value === el.value)?.value;
                })
            }
          }
        }
      });
      return prisma.post.findFirst({
        where: { id: post.id },
        include: {
          user: true,
          comments: true,
          reactions: true,
          tags: true
        }
      });
    })
});

// Export only the type of a router!
// This prevents us from importing server code on the client.
export type PostRouter = typeof postRouter;

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
