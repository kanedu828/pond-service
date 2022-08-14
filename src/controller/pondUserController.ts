import { Request, Response } from 'express';
import { Profile } from 'passport-google-oauth20';
import PondUserDao from '../dao/pondUserDao';
import PondUserService from '../service/pondUserService';

class PondUserController {
  pondUserService: PondUserService;

  constructor(db: any) {
    const pondUserDao = new PondUserDao(db);
    this.pondUserService = new PondUserService(pondUserDao);
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
}

export default PondUserController;
