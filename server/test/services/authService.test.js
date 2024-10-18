import { 
  authenticateAdmin, 
  authenticateAgent, 
  authenticateUserService, 
  handleGoogleOAuthSignup, 
  handleGoogleOAuthSignin 
} from '../../services/authService.js';
import Admin from '../../models/Admin.js';
import Agent from '../../models/Agent.js';
import User from '../../models/User.js';
import { UnauthorizedError, BusinessLogicError, ServerError } from '../../utils/customErrors.js';
import { connect, clearDatabase, closeDatabase } from '../setup/dbHandler.js';

describe('Auth Service Tests', () => {
  beforeAll(async () => await connect());
  afterEach(async () => await clearDatabase());
  afterAll(async () => await closeDatabase());

  const validAdminData = {
    email: 'admin@example.com',
    password: 'AdminPassword123!',
    comparePassword: jest.fn().mockResolvedValue(true),
  };

  const validAgentData = {
    email: 'agent@example.com',
    password: 'AgentPassword123!',
    comparePassword: jest.fn().mockResolvedValue(true),
  };

  const validUserData = {
    email: 'user@example.com',
    password: 'UserPassword123!',
    comparePassword: jest.fn().mockResolvedValue(true),
  };

  describe('Admin Authentication', () => {
    test('should authenticate admin successfully', async () => {
      Admin.findOne = jest.fn().mockResolvedValue(validAdminData);
      const admin = await authenticateAdmin(validAdminData.email, validAdminData.password);
      expect(admin.email).toBe(validAdminData.email);
    });

    test('should throw UnauthorizedError for invalid email', async () => {
      Admin.findOne = jest.fn().mockResolvedValue(null);
      await expect(authenticateAdmin('wrong@example.com', 'wrongPassword'))
        .rejects
        .toThrow(UnauthorizedError);
    });

    test('should throw UnauthorizedError for invalid password', async () => {
      Admin.findOne = jest.fn().mockResolvedValue(validAdminData);
      validAdminData.comparePassword.mockResolvedValue(false);

      await expect(authenticateAdmin(validAdminData.email, 'wrongPassword'))
        .rejects
        .toThrow(UnauthorizedError);
    });
  });

  describe('Agent Authentication', () => {
    test('should authenticate agent successfully', async () => {
      Agent.findOne = jest.fn().mockResolvedValue(validAgentData);
      const { agent } = await authenticateAgent(validAgentData.email, validAgentData.password);
      expect(agent.email).toBe(validAgentData.email);
    });

    test('should throw UnauthorizedError for invalid email', async () => {
      Agent.findOne = jest.fn().mockResolvedValue(null);
      await expect(authenticateAgent('wrong@example.com', 'wrongPassword'))
        .rejects
        .toThrow(UnauthorizedError);
    });

    test('should throw UnauthorizedError for invalid password', async () => {
      Agent.findOne = jest.fn().mockResolvedValue(validAgentData);
      validAgentData.comparePassword.mockResolvedValue(false);

      await expect(authenticateAgent(validAgentData.email, 'wrongPassword'))
        .rejects
        .toThrow(UnauthorizedError);
    });
  });

  describe('User Authentication', () => {
    test('should authenticate user successfully', async () => {
      User.findOne = jest.fn().mockResolvedValue(validUserData);
      const user = await authenticateUserService(validUserData.email, validUserData.password);
      expect(user.email).toBe(validUserData.email);
    });

    test('should throw UnauthorizedError for invalid email', async () => {
      User.findOne = jest.fn().mockResolvedValue(null);
      await expect(authenticateUserService('wrong@example.com', 'wrongPassword'))
        .rejects
        .toThrow(UnauthorizedError);
    });

    test('should throw UnauthorizedError for invalid password', async () => {
      User.findOne = jest.fn().mockResolvedValue(validUserData);
      validUserData.comparePassword.mockResolvedValue(false);

      await expect(authenticateUserService(validUserData.email, 'wrongPassword'))
        .rejects
        .toThrow(UnauthorizedError);
    });
  });

  describe('Google OAuth Signup', () => {
    const googleProfile = {
      googleId: 'google123',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      avatar: 'https://avatar.url',
    };

    test('should sign up new user with Google OAuth successfully', async () => {
      User.findOne = jest.fn().mockResolvedValue(null);
      User.prototype.save = jest.fn().mockResolvedValue(googleProfile);
      const newUser = await handleGoogleOAuthSignup(googleProfile);
      expect(newUser.user.email).toBe(googleProfile.email);
      expect(newUser.isExisting).toBe(false);
    });

    test('should return existing user if already signed up with Google OAuth', async () => {
      User.findOne = jest.fn().mockResolvedValue(googleProfile);
      const existingUser = await handleGoogleOAuthSignup(googleProfile);
      expect(existingUser.user.email).toBe(googleProfile.email);
      expect(existingUser.isExisting).toBe(true);
    });
  });

  describe('Google OAuth Sign-in', () => {
    const googleProfile = {
      googleId: 'google123',
      email: 'john.doe@example.com',
    };

    test('should sign in existing user successfully', async () => {
      User.findOne = jest.fn().mockResolvedValue(googleProfile);
      const user = await handleGoogleOAuthSignin(googleProfile);
      expect(user.email).toBe(googleProfile.email);
    });

    test('should throw BusinessLogicError if user not found during Google OAuth sign-in', async () => {
      User.findOne = jest.fn().mockResolvedValue(null);
      await expect(handleGoogleOAuthSignin(googleProfile))
        .rejects
        .toThrow(BusinessLogicError);
    });
  });
});
