import FishingService from '../service/fishingService';

class FishingController {
  fishingService: FishingService = new FishingService();

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
  collectFish(userId: number) {
    try {
      return this.fishingService.collectFish(userId);
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
