import PondUserService from './pondUserService';
import PondUserDao from '../dao/pondUserDao';

const mockUser = {
  id: 123,
  username: 'test-user',
  email: 'test@example.com',
  googleId: 'my-google-id',
  exp: 0,
};

jest.mock('../dao/pondUserDao');

const mockPondUserDao: jest.Mocked<PondUserDao> = {
  db: jest.fn(),
  getPondUserById: jest.fn(),
  getPondUserByGoogleId: jest.fn(),
  insertPondUser: jest.fn(),
  updatePondUser: jest.fn(),
};

const pondUserService = new PondUserService(mockPondUserDao);

test('Test getPondUser when id exists', async () => {
  mockPondUserDao.getPondUserById.mockResolvedValueOnce(mockUser);
  const results = await pondUserService.getPondUser(123);
  expect(results).toBe(mockUser);
});

test('Test getOrCreatePondUser when id exists', async () => {
  mockPondUserDao.getPondUserByGoogleId.mockResolvedValueOnce(mockUser);
  mockPondUserDao.insertPondUser.mockResolvedValueOnce(mockUser);
  const results = await pondUserService.getOrCreatePondUser(
    'my-google-id',
    'test@example.com'
  );
  expect(results).toBe(mockUser);
  expect(mockPondUserDao.insertPondUser).toHaveBeenCalledTimes(0);
});

test('Test getOrCreatePondUser when id does not exist', async () => {
  mockPondUserDao.getPondUserByGoogleId.mockResolvedValueOnce(null);
  mockPondUserDao.insertPondUser.mockResolvedValueOnce(mockUser);
  const results = await pondUserService.getOrCreatePondUser(
    'my-google-id',
    'test@example.com'
  );
  expect(results).toBe(mockUser);
  expect(mockPondUserDao.insertPondUser).toHaveBeenCalledTimes(1);
});
