import PondUserService from './pondUserService';
import PondUserDao from '../dao/pondUserDao';
import FishDao from '../dao/fishDao';

const mockUser = {
  id: 123,
  username: 'test-user',
  email: 'test@example.com',
  google_id: 'my-google-id',
  exp: 1,
  location: 'default',
};

jest.mock('../dao/pondUserDao');

const mockPondUserDao: jest.Mocked<PondUserDao> = {
  db: jest.fn(),
  getPondUser: jest.fn(),
  insertPondUser: jest.fn(),
  updatePondUser: jest.fn(),
  incrementPondUserExp: jest.fn(),
};

const mockFishDao: jest.Mocked<FishDao> = {
  db: jest.fn(),
  getFish: jest.fn(),
  updateFish: jest.fn(),
  insertFish: jest.fn(),
};

const pondUserService = new PondUserService(mockPondUserDao, mockFishDao);

test('Test getPondUser when id exists', async () => {
  mockPondUserDao.getPondUser.mockResolvedValueOnce(mockUser);
  const results = await pondUserService.getPondUser(123);
  expect(results).toBe(mockUser);
});

test('Test getOrCreatePondUser when id exists', async () => {
  const expectedUser = {
    id: 123,
    username: 'test-user',
    email: 'test@example.com',
    googleId: 'my-google-id',
    exp: 1,
    location: 'default',
  };
  mockPondUserDao.getPondUser.mockResolvedValueOnce(mockUser);
  mockPondUserDao.insertPondUser.mockResolvedValueOnce(mockUser);
  const results = await pondUserService.getOrCreatePondUser(
    'my-google-id',
    'test@example.com'
  );
  expect(results).toStrictEqual(expectedUser);
  expect(mockPondUserDao.insertPondUser).toHaveBeenCalledTimes(0);
});

test('Test getOrCreatePondUser when id does not exist', async () => {
  const expectedUser = {
    id: 123,
    username: 'test-user',
    email: 'test@example.com',
    googleId: 'my-google-id',
    exp: 1,
    location: 'default',
  };
  mockPondUserDao.getPondUser.mockResolvedValueOnce(null);
  mockPondUserDao.insertPondUser.mockResolvedValueOnce(mockUser);
  const results = await pondUserService.getOrCreatePondUser(
    'my-google-id',
    'test@example.com'
  );
  expect(results).toStrictEqual(expectedUser);
  expect(mockPondUserDao.insertPondUser).toHaveBeenCalledTimes(1);
});

test('Test getUserFish', async () => {
  const fishArray = [
    {
      id: 1,
      pond_user_id: 1,
      length: 10,
      count: 5,
    },
    {
      id: 2,
      pond_user_id: 1,
      length: 5,
      count: 2,
    },
  ];
  mockFishDao.getFish.mockResolvedValueOnce(fishArray);
  const results = await pondUserService.getUserFish(1);
  expect(results).toBe(fishArray);
});
