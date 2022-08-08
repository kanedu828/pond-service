import { NextFunction, Request, Response } from 'express';

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
};

export const isLoggedInSocket = (socket: any, next: any) => {
  if (socket.request.user) {
    next();
  } else {
    next(new Error('unauthorized'));
  }
};
