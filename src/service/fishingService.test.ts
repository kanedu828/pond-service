import FishingService from './fishingService';
import { Fish } from '../data/fishTypes';
import * as util from '../util';

const fishingService = new FishingService();

const mockFish: Fish = {
  id: 1,
  name: 'test fish',
  description: 'test fish',
  lengthRangeInCm: [1, 3],
  expRewarded: 1,
  rarity: 'rare',
  secondsFishable: 1,
};

jest.spyOn(util, 'getRandomArrayElement').mockReturnValue(mockFish);
jest.spyOn(util, 'getRandomInt').mockReturnValue(1);
jest.spyOn(util, 'sleep').mockResolvedValue(null);
jest.spyOn(util, 'randomNormal').mockReturnValue(2);
jest.spyOn(util, 'getRandomRarity').mockReturnValue('rare');
jest.spyOn(Date, 'now').mockReturnValue(0);

test('Test get fish when user does not have current fish', async () => {
  const expectedResult = {
    ...mockFish,
    expirationDate: 1000,
    length: 2,
  };
  const fish = await fishingService.getFish(1, 1, 2);
  expect(fish).toStrictEqual(expectedResult);
});

test('Test get fish when user does have current fish', async () => {
  await fishingService.getFish(1, 1, 2);
  const fish = await fishingService.getFish(1, 1, 2);
  expect(fish).toBe(null);
});

test('Test collectFish if user has fish', () => {
  const mockFishInstance = {
    ...mockFish,
    length: 2,
    expirationDate: 1000,
  };
  fishingService.userCurrentFish.set(1, mockFishInstance);
  const result = fishingService.collectFish(1);
  expect(result).toStrictEqual(mockFishInstance);
  expect(fishingService.userCurrentFish.get(1)).toBe(undefined);
});

test('Test collectFish if user has no fish', () => {
  const result = fishingService.collectFish(1);
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
  const result = fishingService.getLastConnectedSocketId(1, 1);
  expect(result).toBe(null);
});

test('Test getLastConnectedSocketId with existing socket io', () => {
  fishingService.connectedUsers.set(1, 1);
  const result = fishingService.getLastConnectedSocketId(1, 1);
  expect(result).toBe(1);
});
