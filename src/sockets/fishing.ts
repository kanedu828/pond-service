import { getRandomInt, sleep } from '../util';

const fishingSocket = (io: any) => {
  io.sockets.on('connection', async (socket: any) => {
    console.log(`${socket.id} has connected`);
    while (true) {
      const secondsUntilNextFish = getRandomInt(10, 30);
      const fishableSeconds = getRandomInt(2, 10);
      await sleep(secondsUntilNextFish * 1000);
      const data = {
        success: true,
        fish: 'tuna',
        secondsSinceLastFish: secondsUntilNextFish,
        fishableSeconds,
      };
      io.to(socket.id).emit('new-fish', data);
      console.log(io.engine.clientsCount);
    }
  });
};

export default fishingSocket;
