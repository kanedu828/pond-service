import { FishData } from "../data/fishTypes";
import { getRandomArrayElement, getRandomInt, getRandomRarity, randomNormal, sleep } from "../util";
import fishJson from '../data/fish.json';

export class FishingService {

    userCurrentFish = new Map();

    connectedUsers = new Map();

    /**
     * 
     * @param low Lower interval for when a fish is found
     * @param high Higher interval for when a fish is found
     */
    async getFish(userId: number, low: number, high: number) {
        const secondsUntilNextFish = getRandomInt(low, high);
        const rarity = getRandomRarity();
        const fishCollection = fishJson as FishData;
        const fish = getRandomArrayElement(
          fishCollection[rarity as keyof FishData]
        );
        const length = Math.floor(
          randomNormal(fish.lengthRangeInCm[0], fish.lengthRangeInCm[1])
        );
        await sleep(secondsUntilNextFish * 1000);
        const expirationDate = Date.now() + fish.secondsFishable * 1000;
        const fishInstance = {
          ...fish,
          length,
          expirationDate
        };
        if (!this.getCurrentFish(userId)) {
          this.userCurrentFish.set(userId, fishInstance);
          return fishInstance;
        } else {
          return null;
        }
  
    }

    collectFish(userId: number) {
      const collectedFish = this.userCurrentFish.get(userId);
      if (collectedFish) {
        this.userCurrentFish.delete(userId);
        return collectedFish;
      } else {
        return null;
      }
    }

    getCurrentFish(userId: number) {
      const currentFishInstance = this.userCurrentFish.get(userId);
      if (currentFishInstance && currentFishInstance.expirationDate < Date.now()) {
        this.userCurrentFish.delete(userId);
        return null;
      } else {
        return currentFishInstance;
      }      
    }

    getLastConnnectedSocketId(userId: number, socketId: number) {
      const lastSocketId = this.connectedUsers.get(userId);
      this.connectedUsers.set(userId, socketId);
      return lastSocketId;
    }
}