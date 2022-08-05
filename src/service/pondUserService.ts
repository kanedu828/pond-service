import PondUserDao from '../dao/pondUserDao';

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
      result = await this.pondUserDao.insertPondUser(email, googleId);
    }
    return result;
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
