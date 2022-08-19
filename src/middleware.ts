import { NextFunction, Request, Response } from 'express';
import { Strategy } from 'passport-google-oauth20';
import passport from 'passport';
import PondUser from './models/pondUserModel';
import PondUserController from './controller/pondUserController';

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (req.user) {
    next();
  } else {
    next(new Error('unauthorized'));
  }
};

export const setupAuth = (pondUserController: PondUserController) => {
  // user is type any because I am getting "User does not have id property"
  // when declared as Express.User
  passport.serializeUser((user, done) => {
    const pondUser = user as PondUser;
    done(null, pondUser.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    const user = await pondUserController.getPondUserById(id);
    done(null, user);
  });

  passport.use(
    new Strategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID ?? '',
        clientSecret: process?.env?.GOOGLE_CLIENT_SECRET ?? '',
        callbackURL: `${process?.env?.URL ?? ''}/auth/google/callback`,
        passReqToCallback: true,
      },
      async (request, _accessToken, _refreshToken, profile, done) => {
        const pondUser = await pondUserController.getOrCreatePondUser(profile);
        done(null, pondUser || undefined);
      }
    )
  );
};
