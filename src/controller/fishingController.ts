import FishDao from '../dao/fishDao';
import PondUserDao from '../dao/pondUserDao';
import FishingService from '../service/fishingService';

class FishingController {
  fishingService: FishingService;

  constructor (pondUserDao: PondUserDao, fishDao: FishDao) {
    this.fishingService = new FishingService(pondUserDao, fishDao)
  }

  /**
   *
   * @param userId
   * @param low
   * @param high
   * @returns
   */
  async getFish(userId: number, low: number, high: number) {
    try {
      return await this.fishingService.getFish(userId, low, high);
    } catch (err) {
      console.error(err);
    }
    return null;
  }

  /**
   *
   * @param userId
   * @returns
   */
  async collectFish(userId: number) {
    try {
      return await this.fishingService.collectFish(userId);
    } catch (err) {
      console.error(err);
    }
    return null;
  }

  getCurrentFish(userId: number) {
    try {
      return this.fishingService.getCurrentFish(userId);
    } catch (err) {
      console.error(err);
    }
    return null;
  }

  getLastConnectedSocketId(userId: number, socketId: number) {
    try {
      return this.fishingService.getLastConnectedSocketId(userId, socketId);
    } catch (err) {
      console.log(err);
    }
    return null;
  }
}

export default FishingController;
