import FishingService from './fishingService';
import { Fish } from '../data/fishTypes';
import * as util from '../util';
import PondUserDao from '../dao/pondUserDao';
import FishDao from '../dao/fishDao';

const mockUser = {
  id: 1,
  username: 'test-user',
  email: 'test@example.com',
  googleId: 'my-google-id',
  exp: 1,
  location: 'Pond',
};

jest.mock('../dao/pondUserDao');

const mockPondUserDao: jest.Mocked<PondUserDao> = {
  db: jest.fn(),
  getPondUser: jest.fn().mockResolvedValue(mockUser),
  insertPondUser: jest.fn(),
  updatePondUser: jest.fn(),
  incrementPondUserExp: jest.fn(),
};

jest.mock('../dao/fishDao');

const mockFishDao: jest.Mocked<FishDao> = {
  db: jest.fn(),
  getFish: jest.fn(),
  insertFish: jest.fn(),
  updateFish: jest.fn(),
};

const fishingService = new FishingService(mockPondUserDao, mockFishDao);

const mockFish: Fish = {
  id: 1,
  name: 'test fish',
  description: 'test fish',
  lengthRangeInCm: [1, 3],
  expRewarded: 1,
  rarity: 'rare',
  secondsFishable: 1,
  pond: 'Pond'
};

jest.spyOn(util, 'getRandomArrayElement').mockReturnValue(mockFish);
jest.spyOn(util, 'getRandomInt').mockReturnValue(1);
jest.spyOn(util, 'sleep').mockResolvedValue(null);
jest.spyOn(util, 'randomNormal').mockReturnValue(2);
jest.spyOn(util, 'getRandomRarity').mockReturnValue('rare');
jest.spyOn(Date, 'now').mockReturnValue(0);

beforeEach(() => {
  fishingService.userCurrentFish.delete(1);
  fishingService.nextFishDue.delete(1);
});

test('Test pollFish if user already has a fish', async () => {
  const mockFishInstance = {
    ...mockFish,
    length: 2,
    expirationDate: 1000,
  };
  fishingService.userCurrentFish.set(1, mockFishInstance);
  const result = await fishingService.pollFish(1, 1, 2);
  expect(result).toStrictEqual(mockFishInstance);
});

test('Test pollFish if fish due time is expired', async () => {
  fishingService.nextFishDue.set(1, -999999);
  const result = await fishingService.pollFish(1, 1, 2);
  expect(fishingService.nextFishDue.get(1)).toBe(1000);
  expect(result).toBe(null);
});

test('Test pollFish if fish is due on time', async () => {
  fishingService.nextFishDue.set(1, -1);
  const result = await fishingService.pollFish(1, 1, 2);
  const mockFishInstance = {
    ...mockFish,
    length: 2,
    expirationDate: 1000,
  };
  expect(result).toStrictEqual(mockFishInstance);
});

test('Test get fish when user does not have current fish', async () => {
  const expectedResult = {
    ...mockFish,
    expirationDate: 1000,
    length: 2,
  };
  const fish = await fishingService.getFish(1, 1, 1, 2);
  expect(fish).toStrictEqual(expectedResult);
});

test('Test get fish when user does have current fish', async () => {
  const mockFishInstance = {
    ...mockFish,
    length: 2,
    expirationDate: 1000,
  };
  fishingService.userCurrentFish.set(1, mockFishInstance);
  const fish = await fishingService.getFish(1, 1, 1, 2);
  expect(fish).toBe(fishingService.userCurrentFish.get(1));
});

test('Test get fish when user has invalid location', async () => {
  mockPondUserDao.getPondUser = jest.fn().mockResolvedValueOnce({
    id: 1,
    username: 'test-user',
    email: 'test@example.com',
    googleId: 'my-google-id',
    exp: 1,
    location: 'asdfasdf',
  });
  const expectedResult = {
    ...mockFish,
    expirationDate: 1000,
    length: 2,
  };
  const fish = await fishingService.getFish(1, 1, 1, 2);
  expect(fish).toStrictEqual(expectedResult);
});

test('Test collectFish if user has fish', async () => {
  const mockFishInstance = {
    ...mockFish,
    length: 2,
    expirationDate: 1000,
  };
  fishingService.userCurrentFish.set(1, mockFishInstance);
  const result = await fishingService.collectFish(1);
  expect(result).toStrictEqual(mockFishInstance);
  expect(fishingService.userCurrentFish.get(1)).toBe(undefined);
});

test('Test collectFish if user has no fish', async () => {
  const result = await fishingService.collectFish(1);
  expect(result).toBe(null);
});

test('Test getCurrentFish when user has non expired fish', () => {
  const mockFishInstance = {
    ...mockFish,
    length: 2,
    expirationDate: 1000,
  };
  fishingService.userCurrentFish.set(1, mockFishInstance);
  const result = fishingService.getCurrentFish(1);
  expect(result).toStrictEqual(mockFishInstance);
});

test('Test getCurrentFish when user has expired fish', () => {
  const mockFishInstance = {
    ...mockFish,
    length: 2,
    expirationDate: -1000,
  };
  fishingService.userCurrentFish.set(1, mockFishInstance);
  const result = fishingService.getCurrentFish(1);
  expect(result).toBe(null);
});

test('Test getCurrentFish when user has no fish', () => {
  const result = fishingService.getCurrentFish(1);
  expect(result).toBe(null);
});

test('Test getLastConnectedSocketId does not have existing socket id', () => {
  const result = fishingService.updateConnectedSocketId(1, 1);
  expect(result).toBe(null);
});

test('Test getLastConnectedSocketId with existing socket io', () => {
  fishingService.connectedUsers.set(1, 1);
  const result = fishingService.updateConnectedSocketId(1, 1);
  expect(result).toBe(1);
});
