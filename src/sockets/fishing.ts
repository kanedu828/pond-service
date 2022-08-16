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

    socket.on('collect-fish', async () => {
      const collectedFish = await fishingController.collectFish(userId);
      socket.emit('caught-fish', collectedFish);
    });

    while (true) {
      const fishInstance = await fishingController.getFish(userId);
      socket.emit('new-fish', fishInstance);
    }
  });
};

export default fishingSocket;
