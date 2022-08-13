
import { FishingService } from '../service/fishingService';

const fishingService = new FishingService();

const fishingSocket = (io: any) => {
  io.on('connection', async (socket: any) => {
    const userId = socket.request.user.id;

    const lastConnectedSocketId = fishingService.getLastConnnectedSocketId(userId, socket.id);
    if (lastConnectedSocketId) {
      io.sockets.sockets.get(lastConnectedSocketId)?.disconnect();
    }

    const currentFish = fishingService.getCurrentFish(userId);
    if (currentFish) {
      socket.emit('new-fish', currentFish);
    }

    console.log(`${socket.id} has connected`);
    socket.on('collect-fish', () => {
      console.log('Fished!');
    });

    socket.on('collect-fish', () => {
      const collectedFish = fishingService.collectFish(userId);
    });

    while (true) {
      const fishInstance = await fishingService.getFish(userId, 10, 30);
      if (fishInstance) {
        socket.emit('new-fish', fishInstance); 
      }
    }
  });
};

export default fishingSocket;
