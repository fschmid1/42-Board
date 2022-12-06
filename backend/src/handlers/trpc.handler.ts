import { inferAsyncReturnType, initTRPC } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import { postRouter } from './post.handler';
import { voteRouter } from './vote.handler';

export const createContext = ({ req, res }: trpcExpress.CreateExpressContextOptions) => {
  const getUser = () => {
    return req.user as any;
  };

  return {
    req,
    res,
    user: getUser()
  };
};
type Context = inferAsyncReturnType<typeof createContext>;
const t = initTRPC.context<Context>().create();

export const router = t.router;
export const middleware = t.middleware;
export const publicProcedure = t.procedure;

export const appRouter = router({
  posts: postRouter,
  vote: voteRouter
});

export type AppRouter = typeof appRouter;
