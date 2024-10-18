// test/routes/userRoutes.test.js
import request from 'supertest';
import express from 'express';
import userRoutes from '../../routes/userRoutes.js';
import * as userController from '../../controllers/user/userController.js';
import * as authMiddleware from '../../middleware/auth/authMiddleware.js';
import * as roleMiddleware from '../../middleware/auth/roleMiddleware.js';

// Mock the middleware
jest.mock('../../middleware/auth/authMiddleware.js');
jest.mock('../../middleware/auth/roleMiddleware.js');

// Mock the controller functions
jest.mock('../../controllers/user/userController.js');

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

describe('User Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/users/', () => {
    it('should return users filtered by query params', async () => {
      const mockUsers = [{ _id: '1', name: 'John' }, { _id: '2', name: 'Jane' }];
      userController.getUsersByFilter.mockResolvedValue(mockUsers);

      const res = await request(app).get('/api/users');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockUsers);
      expect(userController.getUsersByFilter).toHaveBeenCalled();
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return a user by ID', async () => {
      const mockUser = { _id: '1', name: 'John' };
      userController.getUserById.mockResolvedValue(mockUser);

      const res = await request(app).get('/api/users/1');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockUser);
      expect(userController.getUserById).toHaveBeenCalledWith(expect.anything(), expect.anything(), expect.anything());
    });

    it('should return 404 if user is not found', async () => {
      userController.getUserById.mockRejectedValue({ status: 404, message: 'User not found' });

      const res = await request(app).get('/api/users/999');

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('User not found');
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update user if authenticated and authorized', async () => {
      const mockUpdatedUser = { _id: '1', name: 'Updated John' };
      userController.updateUser.mockResolvedValue(mockUpdatedUser);
      authMiddleware.default.mockImplementation((req, res, next) => next());
      roleMiddleware.checkIsUserSelfOrAdmin.mockImplementation((req, res, next) => next());

      const res = await request(app)
        .put('/api/users/1')
        .send({ name: 'Updated John' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockUpdatedUser);
      expect(userController.updateUser).toHaveBeenCalledWith(expect.anything(), expect.anything(), expect.anything());
    });

    it('should return 403 if not authorized', async () => {
      authMiddleware.default.mockImplementation((req, res, next) => next());
      roleMiddleware.checkIsUserSelfOrAdmin.mockImplementation((req, res, next) => res.status(403).json({ message: 'Unauthorized' }));

      const res = await request(app)
        .put('/api/users/1')
        .send({ name: 'Updated John' });

      expect(res.status).toBe(403);
      expect(res.body.message).toBe('Unauthorized');
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete user if authenticated and authorized', async () => {
      userController.deleteUser.mockResolvedValue({});
      authMiddleware.default.mockImplementation((req, res, next) => next());
      roleMiddleware.checkIsUserSelfOrAdmin.mockImplementation((req, res, next) => next());

      const res = await request(app).delete('/api/users/1');

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('User deleted successfully!');
      expect(userController.deleteUser).toHaveBeenCalledWith(expect.anything(), expect.anything(), expect.anything());
    });

    it('should return 403 if not authorized', async () => {
      authMiddleware.default.mockImplementation((req, res, next) => next());
      roleMiddleware.checkIsUserSelfOrAdmin.mockImplementation((req, res, next) => res.status(403).json({ message: 'Unauthorized' }));

      const res = await request(app).delete('/api/users/1');

      expect(res.status).toBe(403);
      expect(res.body.message).toBe('Unauthorized');
    });
  });

  describe('POST /api/users/:userId/add-property', () => {
    it('should add property to user', async () => {
      const mockUser = { _id: '1', properties: ['property1'] };
      userController.addPropertyToUser.mockResolvedValue(mockUser);
      authMiddleware.default.mockImplementation((req, res, next) => next());
      roleMiddleware.checkIsUserSelfOrAdmin.mockImplementation((req, res, next) => next());

      const res = await request(app)
        .post('/api/users/1/add-property')
        .send({ propertyId: 'property1' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockUser);
    });
  });

  describe('PUT /api/users/:userId/remove-property', () => {
    it('should remove property from user', async () => {
      const mockUser = { _id: '1', properties: [] };
      userController.removePropertyFromUser.mockResolvedValue(mockUser);
      authMiddleware.default.mockImplementation((req, res, next) => next());
      roleMiddleware.checkIsUserSelfOrAdmin.mockImplementation((req, res, next) => next());

      const res = await request(app)
        .put('/api/users/1/remove-property')
        .send({ propertyId: 'property1' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockUser);
    });
  });
});
