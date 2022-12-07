import { User } from '@prisma/client';
import { inferAsyncReturnType, initTRPC } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';

export const createContext = ({ req }: trpcExpress.CreateExpressContextOptions) => {
  return {
    user: req.user as User
  };
};
type Context = inferAsyncReturnType<typeof createContext>;
const t = initTRPC.context<Context>().create();

export const router = t.router;
export const middleware = t.middleware;
export const publicProcedure = t.procedure;

import { commentRouter } from './comments.handler';
import { postRouter } from './post.handler';
import { reactionRouter } from './reaction.handler';
import { voteRouter } from './vote.handler';

export const appRouter = router({
  post: postRouter,
  vote: voteRouter,
  reaction: reactionRouter,
  comment: commentRouter
});

export type AppRouter = typeof appRouter;
