import { createUser, authenticateUser, logoutUser } from '../../controllers/auth/userAuthController.js';
import { createNewUser } from '../../services/userServices.js';
import { generateTokenAndCookieOptions, setTokenCookie } from '../../utils/authHelpers.js';
import { excludeSensitiveInfo } from '../../utils/excludeSensitiveInfo.js';
import { clearTokenCookie } from '../../services/authService.js';
import { UnauthorizedError } from '../../utils/customErrors.js';
import passport from 'passport';

jest.mock('../../services/userServices.js');
jest.mock('../../utils/authHelpers.js');
jest.mock('../../utils/excludeSensitiveInfo.js');
jest.mock('../../services/authService.js');
jest.mock('passport');

describe('User Authentication Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a user and return success response with token', async () => {
      const req = { body: { email: 'test@example.com', password: 'password123' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();
      
      const mockUser = { _id: '123', email: 'test@example.com' };
      createNewUser.mockResolvedValue(mockUser);
      generateTokenAndCookieOptions.mockReturnValue({ token: 'mockToken', cookieOptions: {} });
      setTokenCookie.mockReturnValue(null);
      excludeSensitiveInfo.mockReturnValue({ _id: '123', email: 'test@example.com' });

      await createUser(req, res, next);

      expect(createNewUser).toHaveBeenCalledWith(req.body);
      expect(setTokenCookie).toHaveBeenCalledWith(res, 'mockToken', {});
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'User registered successfully.',
        data: { _id: '123', email: 'test@example.com' },
        token: 'mockToken'
      });
    });

    it('should handle error when user creation fails', async () => {
      const req = { body: { email: 'test@example.com', password: 'password123' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      createNewUser.mockRejectedValue(new Error('User creation failed'));

      await createUser(req, res, next);

      expect(next).toHaveBeenCalledWith(new Error('User creation failed'));
    });
  });

  describe('authenticateUser', () => {
    it('should authenticate a user and return success response with token', async () => {
      const req = { body: { email: 'test@example.com', password: 'password123' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      const mockUser = { _id: '123', email: 'test@example.com' };
      passport.authenticate.mockImplementation((strategy, options, callback) => {
        callback(null, mockUser, null);
        return jest.fn();
      });

      generateTokenAndCookieOptions.mockReturnValue({ token: 'mockToken', cookieOptions: {} });
      setTokenCookie.mockReturnValue(null);
      excludeSensitiveInfo.mockReturnValue({ _id: '123', email: 'test@example.com' });

      await authenticateUser(req, res, next);

      expect(passport.authenticate).toHaveBeenCalledWith('local', { session: false }, expect.any(Function));
      expect(setTokenCookie).toHaveBeenCalledWith(res, 'mockToken', {});
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'User logged in successfully!',
        data: { _id: '123', email: 'test@example.com' },
        token: 'mockToken'
      });
    });

    it('should return error when authentication fails', async () => {
      const req = { body: { email: 'test@example.com', password: 'wrongpassword' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      passport.authenticate.mockImplementation((strategy, options, callback) => {
        callback(null, false, { message: 'Invalid credentials' });
        return jest.fn();
      });

      await authenticateUser(req, res, next);

      expect(passport.authenticate).toHaveBeenCalledWith('local', { session: false }, expect.any(Function));
      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });
  });

  describe('logoutUser', () => {
    it('should clear the token cookie and return success response', async () => {
      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      await logoutUser(req, res, next);

      expect(clearTokenCookie).toHaveBeenCalledWith(res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'User logged out successfully.'
      });
    });

    it('should handle errors when logout fails', async () => {
      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      clearTokenCookie.mockImplementation(() => { throw new Error('Logout failed'); });

      await logoutUser(req, res, next);

      expect(next).toHaveBeenCalledWith(new Error('Logout failed'));
    });
  });
});
