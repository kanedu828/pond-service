import FishDao from '../dao/fishDao';
import PondUserDao from '../dao/pondUserDao';
import FishingService from '../service/fishingService';
import { sleep } from '../util';

class FishingController {
  fishingService: FishingService;

  constructor(pondUserDao: PondUserDao, fishDao: FishDao) {
    this.fishingService = new FishingService(pondUserDao, fishDao);
  }

  /**
   *
   * @param userId
   * @param low
   * @param high
   * @returns
   */
  async getFish(userId: number, socketId: number) {
    try {
      return await this.fishingService.getFish(userId, socketId, 10, 30);
    } catch (err) {
      console.error(err);
    }
    return null;
  }

  /**
   *
   * @param socket
   */
  async pollFish(socket: any) {
    await sleep(10000);
    const userId = socket.request.user.id;
    const currentFish = await this.fishingService.pollFish(userId, 10, 30);
    if (currentFish) {
      socket.emit('new-fish', currentFish);
    }
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

  updateConnectedSocketId(userId: number, socketId: number) {
    try {
      return this.fishingService.updateConnectedSocketId(userId, socketId);
    } catch (err) {
      console.error(err);
    }
    return null;
  }

  getConnectedSocketId(userId: number) {
    try {
      return this.fishingService.getConnectSocketId(userId);
    } catch (err) {
      console.error(err);
    }
    return null;
  }
}

export default FishingController;
