import request from 'supertest';
import express from 'express';
import authRoutes from '../../routes/authRoutes.js';
import passport from 'passport';
import * as userAuthController from '../../controllers/auth/userAuthController.js';
import * as adminAuthController from '../../controllers/auth/adminAuthController.js';
import * as agentAuthController from '../../controllers/auth/agentAuthController.js';
import * as googleOAuthController from '../../controllers/auth/googleOAuthController.js';

// Initialize an express app with the routes
const app = express();
app.use(express.json());  // Parse JSON request bodies
app.use('/api/auth', authRoutes);

// Mock controller functions
jest.mock('../../controllers/auth/userAuthController.js');
jest.mock('../../controllers/auth/adminAuthController.js');
jest.mock('../../controllers/auth/agentAuthController.js');
jest.mock('../../controllers/auth/googleOAuthController.js');
jest.mock('passport');

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/signup', () => {
    it('should create a new user', async () => {
      const mockUser = { _id: '1', username: 'johndoe', email: 'john@example.com' };
      userAuthController.createUser.mockResolvedValue(mockUser);

      const res = await request(app)
        .post('/api/auth/signup')
        .send({ username: 'johndoe', email: 'john@example.com', password: 'password' });

      expect(res.status).toBe(200); // Assuming success status 200
      expect(userAuthController.createUser).toHaveBeenCalled();
    });
  });

  describe('POST /api/auth/signin', () => {
    it('should authenticate a user', async () => {
      const mockToken = { token: 'jwt-token' };
      userAuthController.authenticateUser.mockResolvedValue(mockToken);

      const res = await request(app)
        .post('/api/auth/signin')
        .send({ email: 'john@example.com', password: 'password' });

      expect(res.status).toBe(200);
      expect(userAuthController.authenticateUser).toHaveBeenCalled();
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should log out the user', async () => {
      userAuthController.logoutUser.mockResolvedValue({ success: true });

      const res = await request(app).post('/api/auth/logout');

      expect(res.status).toBe(200);
      expect(userAuthController.logoutUser).toHaveBeenCalled();
    });
  });

  describe('GET /api/auth/google/signup', () => {
    it('should redirect to Google OAuth for signup', async () => {
      passport.authenticate.mockImplementation(() => (req, res, next) => {
        res.redirect('https://google.com');  // Simulating the redirect
      });

      const res = await request(app).get('/api/auth/google/signup');

      expect(res.status).toBe(302); // Expecting a redirect
      expect(res.headers.location).toBe('https://google.com');
    });
  });

  describe('POST /api/auth/admins/login', () => {
    it('should log in an admin', async () => {
      const mockAdminToken = { token: 'admin-jwt-token' };
      adminAuthController.loginAdmin.mockResolvedValue(mockAdminToken);

      const res = await request(app)
        .post('/api/auth/admins/login')
        .send({ email: 'admin@example.com', password: 'password' });

      expect(res.status).toBe(200);
      expect(adminAuthController.loginAdmin).toHaveBeenCalled();
    });
  });

  describe('POST /api/auth/agents/signup', () => {
    it('should register a new agent', async () => {
      const mockAgent = { _id: '2', username: 'agent007', email: 'agent@example.com' };
      agentAuthController.createAgent.mockResolvedValue(mockAgent);

      const res = await request(app)
        .post('/api/auth/agents/signup')
        .send({ username: 'agent007', email: 'agent@example.com', password: 'password' });

      expect(res.status).toBe(200);
      expect(agentAuthController.createAgent).toHaveBeenCalled();
    });
  });

  describe('POST /api/auth/agents/login', () => {
    it('should log in an agent', async () => {
      const mockAgentToken = { token: 'agent-jwt-token' };
      agentAuthController.loginAgent.mockResolvedValue(mockAgentToken);

      const res = await request(app)
        .post('/api/auth/agents/login')
        .send({ email: 'agent@example.com', password: 'password' });

      expect(res.status).toBe(200);
      expect(agentAuthController.loginAgent).toHaveBeenCalled();
    });
  });
});
