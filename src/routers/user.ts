import { Router, Request, Response } from 'express';
import PondUserController from '../controller/pondUserController';
import { isLoggedIn } from '../middleware';

const getUserRouter = (pondUserController: PondUserController) => {
  const router: any = Router();

  router.use(isLoggedIn);

  router.get('/', (req: Request, res: Response) => {
    res.json(req.user);
  });

  return router;
};

export default getUserRouter;
