import { Fish, FishData } from '../data/fishTypes';
import {
  getRandomArrayElement,
  getRandomInt,
  getRandomRarity,
  randomNormal,
  sleep,
} from '../util';
import fishJson from '../data/fish.json';

export default class FishingService {
  userCurrentFish = new Map();

  connectedUsers = new Map();

  /**
   *
   * @param userId
   * @param low
   * @param high
   * @returns
   */
  async getFish(userId: number, low: number, high: number) {
    const secondsUntilNextFish = getRandomInt(low, high);
    await sleep(secondsUntilNextFish * 1000);
    if (!this.getCurrentFish(userId)) {
      const rarity = getRandomRarity();
      const fishCollection = fishJson as FishData;
      const fish: Fish = getRandomArrayElement(
        fishCollection[rarity as keyof FishData]
      );
      const length = Math.floor(
        randomNormal(fish.lengthRangeInCm[0], fish.lengthRangeInCm[1])
      );

      const expirationDate = Date.now() + fish.secondsFishable * 1000;
      const fishInstance = {
        ...fish,
        length,
        expirationDate,
      };
      this.userCurrentFish.set(userId, fishInstance);
      return fishInstance;
    }
    return null;
  }

  /**
   *
   * @param userId
   * @returns
   */
  collectFish(userId: number) {
    const collectedFish = this.userCurrentFish.get(userId);
    if (collectedFish) {
      this.userCurrentFish.delete(userId);
      return collectedFish;
    }
    return null;
  }

  /**
   *
   * @param userId
   * @returns
   */
  getCurrentFish(userId: number) {
    const currentFishInstance = this.userCurrentFish.get(userId) || null;
    if (
      currentFishInstance &&
      currentFishInstance.expirationDate < Date.now()
    ) {
      this.userCurrentFish.delete(userId);
      return null;
    }
    return currentFishInstance;
  }

  /**
   *
   * @param userId
   * @param socketId
   * @returns
   */
  getLastConnectedSocketId(userId: number, socketId: number) {
    const lastSocketId = this.connectedUsers.get(userId) || null;
    this.connectedUsers.set(userId, socketId);
    return lastSocketId;
  }
}
