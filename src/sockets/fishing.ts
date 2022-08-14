import FishingController from '../controller/fishingController';

const fishingSocket = (io: any, fishingController: FishingController) => {
  io.on('connection', async (socket: any) => {
    const userId = socket.request.user.id;

    const lastConnectedSocketId = fishingController.getLastConnectedSocketId(
      userId,
      socket.id
    );
    if (lastConnectedSocketId) {
      io.sockets.sockets.get(lastConnectedSocketId)?.disconnect();
    }

    const currentFish = fishingController.getCurrentFish(userId);
    if (currentFish) {
      socket.emit('new-fish', currentFish);
    }

    console.log(`${socket.id} has connected`);
    socket.on('collect-fish', () => {
      console.log('Fished!');
    });

    socket.on('collect-fish', () => {
      const collectedFish = fishingController.collectFish(userId);
    });

    while (true) {
      const fishInstance = await fishingController.getFish(userId, 10, 30);
      if (fishInstance) {
        socket.emit('new-fish', fishInstance);
      }
    }
  });
};

export default fishingSocket;
