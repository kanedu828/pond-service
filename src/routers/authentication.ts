import { Router, Request, Response } from 'express';
import passport from 'passport';

const router: any = Router();

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: 'http://127.0.0.1:3000',
    failureRedirect: '/auth/failure',
  })
);

router.get('/failure', (_req: Request, res: Response) => {
  res.json({ authenticated: false });
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

router.get('/good', (req: Request, res: Response) => {
  if (req.user) {
    console.log('True');
    res.json({ authenticated: true });
  } else {
    console.log('false');
    res.json({ authenticated: false });
  }
});

export default router;
