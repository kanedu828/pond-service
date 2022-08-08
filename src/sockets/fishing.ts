import {
  getRandomArrayElement,
  getRandomInt,
  getRandomRarity,
  randomNormal,
  sleep,
} from '../util';
import fishJson from '../data/fish.json';
import { FishData } from '../data/fishTypes';

const fishingSocket = (io: any) => {
  io.on('connection', async (socket: any) => {
    console.log(`${socket.id} has connected`);

    socket.on('collect-fish', () => {
      console.log('Fished!');
    });

    while (true) {
      const secondsUntilNextFish = getRandomInt(10, 30);
      const rarity = getRandomRarity();
      const fishCollection = fishJson as FishData;
      const fish = getRandomArrayElement(
        fishCollection[rarity as keyof FishData]
      );
      const length = Math.floor(
        randomNormal(fish.lengthRangeInCm[0], fish.lengthRangeInCm[1])
      );
      await sleep(secondsUntilNextFish * 1000);
      const data = {
        ...fish,
        length,
      };
      socket.emit('new-fish', data);
    }
  });
};

export default fishingSocket;
