import { TRPCError } from '@trpc/server';
import { middleware } from '../handlers/trpc.handler';
import { Request, Response, NextFunction } from 'express';

export const isAuthenticated = middleware(async ({ next, ctx }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      user: ctx.user
    }
  });
});

export const isAuthenticatedRest = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) return res.status(401).send('Unautherized');
  next();
};
