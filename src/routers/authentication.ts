import { Router, Request, Response } from 'express';
import passport from 'passport';
import User from '../models/pondUserModel';
import { isLoggedIn } from '../util';

const router: any = Router();

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: '/auth/good',
    failureRedirect: '/auth/failure',
  })
);

router.get('/failure', (_req: Request, res: Response) => {
  res.send('Failure');
});

router.get('/logout', (req: Request, res: Response) => {
  req.session = null;
  req.logout(err => {
    if (err) {
      console.log(err);
    }
  });
  res.redirect('/');
});

router.get('/good', isLoggedIn, (req: Request, res: Response) => {
  const pondUser = req.user as User;
  res.json(pondUser);
});

export default router;
