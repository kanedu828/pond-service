import PondUserDao from '../dao/pondUserDao';
import { randomBytes } from 'crypto';
import PondUser from '../models/pondUserModel';


class PondUserService {
  pondUserDao: PondUserDao;

  constructor(pondUserDao: PondUserDao) {
    this.pondUserDao = pondUserDao;
  }

  /**
   * This takes in a googleId because this is for when a user first logs in with google oauth.
   * Cannot be queried by regular id as it does not exist yet.
   *
   * @param googleId
   * @param email
   * @returns A pond user
   */
  async getOrCreatePondUser(
    googleId: string,
    email: string
  ): Promise<Express.User> {
    let result = await this.pondUserDao.getPondUserByGoogleId(googleId);
    if (!result) {
      const randomUsername = 'guest-' + randomBytes(48).toString('hex');
      result = await this.pondUserDao.insertPondUser(email, googleId, randomUsername);
    }
    const pondUser: PondUser = {
      id: result.id,
      username: result.username,
      email: result.email,
      googleId: result.google_id
    }
    return pondUser;
  }

  /**
   * Gets pond user by id.
   *
   * @param id
   * @returns A pond user
   */
  async getPondUser(id: number): Promise<Express.User> {
    const result = await this.pondUserDao.getPondUserById(id);
    return result;
  }
}

export default PondUserService;
