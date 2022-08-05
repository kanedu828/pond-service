import { NextFunction, Request, Response } from 'express';

export const getRandomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1) + min);

export const sleep = (milliseconds: number) =>
  new Promise(resolve => setTimeout(resolve, milliseconds));

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
};
