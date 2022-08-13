import { NextFunction, Request, Response } from 'express';

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (req.user) {
    next();
  } else {
    next(new Error('unauthorized'));
  }
};