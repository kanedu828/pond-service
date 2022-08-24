import { Request, Response } from 'express';
import { Profile } from 'passport-google-oauth20';
import FishDao from '../dao/fishDao';
import PondUserDao from '../dao/pondUserDao';
import { Fish } from '../data/fishTypes';
import PondUser from '../models/pondUserModel';
import PondUserService from '../service/pondUserService';
import fishJson from '../data/fish.json';
import { binarySearch } from '../util';

class PondUserController {
  pondUserService: PondUserService;

  constructor(pondUserDao: PondUserDao, fishDao: FishDao) {
    this.pondUserService = new PondUserService(pondUserDao, fishDao);
  }

  /**
   *
   * @param req
   * @param profile
   * @returns pondUser
   */
  async getOrCreatePondUser(profile: Profile) {
    try {
      const email = profile.emails?.[0].value ?? null;
      if (!email) {
        throw new Error('Google Id does not have an associated email');
      } else {
        const pondUser = await this.pondUserService.getOrCreatePondUser(
          profile.id,
          email
        );
        return pondUser;
      }
    } catch (err) {
      console.error(err);
    }
    return null;
  }

  /**
   *
   * @param req
   * @param res
   */
  async getPondUser(req: Request, res: Response): Promise<void> {
    try {
      const pondUser = await this.pondUserService.getPondUser(req.body.id);
      res.status(200).json(pondUser);
    } catch (err) {
      console.error(err);
    }
  }

  /**
   *
   * @param id
   * @returns
   */
  async getPondUserById(id: number) {
    try {
      const pondUser = await this.pondUserService.getPondUser(id);
      return pondUser;
    } catch (err) {
      console.error(err);
    }
    return null;
  }

  async getUserFish(req: Request, res: Response): Promise<void> {
    const user: PondUser = req.user as PondUser;
    if (!user) {
      res.status(401);
    }
    try {
      const userFish = await this.pondUserService.getUserFish(user.id);
      userFish.map(fish => {
        const fishIndex = binarySearch<Fish>(
          fishJson,
          fish.id,
          (element: Fish) => element.id
        );
        const fishData: Fish = fishJson[fishIndex];
        return {
          ...fish,
          ...fishData,
        };
      });
      res.json(userFish);
    } catch (err) {
      console.error(err);
      res.status(400);
    }
  }
}

export default PondUserController;
