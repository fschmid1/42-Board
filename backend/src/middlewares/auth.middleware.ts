import { Request, Response, NextFunction } from 'express';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) res.status(401).send('Unautherized');
  next();
};
