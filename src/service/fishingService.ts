import { Fish } from '../data/fishTypes';
import {
  binarySearch,
  getRandomArrayElement,
  getRandomInt,
  getRandomRarity,
  randomNormal,
  sleep,
} from '../util';
import fishJson from '../data/fish.json';
import pondJson from '../data/ponds.json';
import PondUserDao from '../dao/pondUserDao';
import FishDao from '../dao/fishDao';

interface FishInstance {
  id: number;
  name: string;
  description: string;
  lengthRangeInCm: number[];
  expRewarded: number;
  rarity: string;
  secondsFishable: number;
  length: number;
  expirationDate: number;
}

export default class FishingService {
  readonly userCurrentFish = new Map<number, FishInstance>();

  readonly connectedUsers = new Map<number, number>();

  readonly nextFishDue = new Map<number, number>();

  readonly pondUserDao: PondUserDao;

  readonly fishDao: FishDao;

  constructor(pondUserDao: PondUserDao, fishDao: FishDao) {
    this.pondUserDao = pondUserDao;
    this.fishDao = fishDao;
  }

  /**
   *
   * @param location
   * @returns
   */
  static generateFish(location: string) {
    const rarity = getRandomRarity();
    const pond = pondJson.find(element => element.name === location);
    if (!pond) {
      throw new Error(`Pond ${location} does not exist.`);
    }
    const availableFish = pond.availableFish.map(fishId => {
      const fishIndex = binarySearch(
        fishJson,
        fishId,
        (element: Fish) => element.id
      );
      return fishJson[fishIndex];
    });
    const fishOfRarity = availableFish.filter(
      element => element && element.rarity === rarity && element.active
    );
    const fish: Fish = getRandomArrayElement(fishOfRarity || []);

    const length = Math.floor(
      randomNormal(fish.lengthRangeInCm[0], fish.lengthRangeInCm[1])
    );

    const expirationDate = Date.now() + fish.secondsFishable * 1000;
    const fishInstance: FishInstance = {
      ...fish,
      length,
      expirationDate,
    };
    return fishInstance;
  }

  /**
   *
   * @param userId
   * @param low
   * @param high
   * @returns
   */
  async getFish(userId: number, socketId: number, low: number, high: number) {
    const secondsUntilNextFish = getRandomInt(low, high);
    await sleep(secondsUntilNextFish * 1000);
    const currentFish = this.getCurrentFish(userId);
    if (!currentFish) {
      const user = await this.pondUserDao.getPondUser({
        id: userId,
      });
      let { location } = user;

      if (!(location in fishJson)) {
        // If user does not have a valid location, reset to the deafult location
        this.pondUserDao.updatePondUser({ id: userId }, { location: 'Pond' });
        location = 'Pond';
      }
      const fishInstance = FishingService.generateFish(location);
      // This is needed because extra sessions are still active even after logging out/disconnecting
      // This causes client to recieve fish earlier by refreshing page.
      if (socketId === this.getConnectSocketId(userId)) {
        this.userCurrentFish.set(userId, fishInstance);
      }
      return fishInstance;
    }
    return currentFish;
  }

  /**
   *
   * @param userId
   */
  async pollFish(userId: number, low: number, high: number) {
    if (!this.getCurrentFish(userId)) {
      const fishDue = this.nextFishDue.get(userId);
      if (!fishDue || Date.now() > fishDue + 120000) {
        const secondsUntilNextFish = getRandomInt(low, high);
        this.nextFishDue.set(userId, Date.now() + secondsUntilNextFish * 1000);
      } else if (Date.now() > fishDue) {
        const user = await this.pondUserDao.getPondUser({
          id: userId,
        });
        let { location } = user;
        if (!(location in fishJson)) {
          // If user does not have a valid location, reset to the deafult location
          this.pondUserDao.updatePondUser({ id: userId }, { location: 'Pond' });
          location = 'Pond';
        }
        const fishInstance = FishingService.generateFish(location);
        this.userCurrentFish.set(userId, fishInstance);
        this.nextFishDue.delete(userId);
      }
    }
    return this.getCurrentFish(userId);
  }

  /**
   *
   * @param userId
   * @returns
   */
  async collectFish(userId: number) {
    const collectedFish: FishInstance | null = this.getCurrentFish(userId);
    if (collectedFish) {
      const fishQuery = await this.fishDao.getFish({
        fish_id: collectedFish.id,
        pond_user_id: userId,
      });
      if (fishQuery.length > 0) {
        const sameFish = fishQuery[0];
        await this.fishDao.updateFish(
          {
            fish_id: collectedFish.id,
            pond_user_id: userId,
          },
          {
            count: sameFish.count + 1,
            length: Math.max(collectedFish.length, sameFish.length),
          }
        );
      } else {
        await this.fishDao.insertFish({
          fish_id: collectedFish.id,
          pond_user_id: userId,
          length: collectedFish.length,
          count: 1,
        });
      }
      await this.pondUserDao.incrementPondUserExp(
        userId,
        collectedFish.expRewarded
      );

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
  updateConnectedSocketId(userId: number, socketId: number) {
    const lastSocketId = this.connectedUsers.get(userId) || null;
    this.connectedUsers.set(userId, socketId);
    return lastSocketId;
  }

  getConnectSocketId(userId: number) {
    return this.connectedUsers.get(userId) || null;
  }
}
