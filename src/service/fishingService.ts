import { Fish } from '../data/fishTypes';
import {
  getRandomArrayElement,
  getRandomInt,
  getRandomRarity,
  randomNormal,
  sleep,
} from '../util';
import fishJson from '../data/fish.json';
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
  length: number,
  expirationDate: number,
};


export default class FishingService {
  userCurrentFish = new Map<number, FishInstance>();

  connectedUsers = new Map<number, number>();

  pondUserDao: PondUserDao;
  fishDao: FishDao;

  constructor(pondUserDao: PondUserDao, fishDao: FishDao) {
    this.pondUserDao = pondUserDao
    this.fishDao = fishDao;
  }

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
    const currentFish = this.getCurrentFish(userId);
    if (!currentFish) {
      const user = await this.pondUserDao.getPondUser({
        id: userId
      });
      let location = user.location  

      if (!(location in fishJson)) {
        // If user does not have a valid location, reset to the deafult location
        this.pondUserDao.updatePondUser({ id: userId }, { location: 'Pond' });
        location = 'Pond';
      }

      const pond = fishJson.ponds.find((element) => element.name === location);

      const rarity = getRandomRarity();
      const fishOfRarity = pond?.fish.filter((element) => element.rarity === rarity);
      const fish: Fish = getRandomArrayElement(
        fishOfRarity || []
      );

      const length = Math.floor(
        randomNormal(fish.lengthRangeInCm[0], fish.lengthRangeInCm[1])
      );

      const expirationDate = Date.now() + fish.secondsFishable * 1000;
      const fishInstance: FishInstance = {
        ...fish,
        length,
        expirationDate,
      };
      this.userCurrentFish.set(userId, fishInstance);
      return fishInstance;
    }
    return currentFish;
  }

  /**
   *
   * @param userId
   * @returns
   */
  async collectFish(userId: number) {
    const collectedFish: FishInstance | null = this.getCurrentFish(userId);
    if (collectedFish) {
      const sameFish = await this.fishDao.getFish({
        fish_id: collectedFish.id,
        pond_user_id: userId
      });
      if (sameFish) {
        await this.fishDao.updateFish(
          {
            fish_id: collectedFish.id,
            pond_user_id: userId
          },
          {
            count: sameFish.count + 1,
            length: Math.max(collectedFish.length, sameFish.length)
          }
        );
      } else {
        await this.fishDao.insertFish(
          {
            fish_id: collectedFish.id,
            pond_user_id: userId,
            length: collectedFish.length,
            count: 1
          }
        )
      }
      await this.pondUserDao.incrementPondUserExp(userId, collectedFish.expRewarded);
    
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
