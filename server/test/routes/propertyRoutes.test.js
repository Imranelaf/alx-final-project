import request from 'supertest';
import express from 'express';
import propertyRoutes from '../../routes/propertyRoutes.js';
import * as propertyController from '../../controllers/property/propertiesController.js';
import * as authMiddleware from '../../middleware/auth/authMiddleware.js';
import * as roleMiddleware from '../../middleware/auth/roleMiddleware.js';
import * as validationMiddleware from '../../middleware/validation/validateObjectId.js';

// Create a new express app to test
const app = express();
app.use(express.json());
app.use('/api/properties', propertyRoutes);

// Mock the middleware and controller functions
jest.mock('../../controllers/property/propertiesController.js');
jest.mock('../../middleware/auth/authMiddleware.js');
jest.mock('../../middleware/auth/roleMiddleware.js');
jest.mock('../../middleware/validation/validateObjectId.js');

describe('Property Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/properties/', () => {
    it('should create a new property', async () => {
      const mockProperty = { _id: '1', title: 'Test Property' };
      propertyController.createProperty.mockResolvedValue(mockProperty);
      authMiddleware.default.mockImplementation((req, res, next) => next());
      roleMiddleware.checkRoleToCreateProperty.mockImplementation((req, res, next) => next());

      const res = await request(app)
        .post('/api/properties')
        .send({ title: 'Test Property', price: 100000 });

      expect(res.status).toBe(200); // Assuming success status code 200
      expect(propertyController.createProperty).toHaveBeenCalled();
    });
  });

  describe('GET /api/properties/:id', () => {
    it('should get a property by ID', async () => {
      const mockProperty = { _id: '1', title: 'Test Property' };
      propertyController.getPropertyById.mockResolvedValue(mockProperty);
      validationMiddleware.validateObjectId.mockImplementation((req, res, next) => next());

      const res = await request(app).get('/api/properties/1');

      expect(res.status).toBe(200);
      expect(propertyController.getPropertyById).toHaveBeenCalledWith(expect.anything(), expect.anything(), expect.anything());
      expect(res.body).toEqual(mockProperty);
    });
  });

  describe('PUT /api/properties/:id', () => {
    it('should update a property', async () => {
      const mockUpdatedProperty = { _id: '1', title: 'Updated Property' };
      propertyController.updateProperty.mockResolvedValue(mockUpdatedProperty);
      authMiddleware.default.mockImplementation((req, res, next) => next());
      roleMiddleware.checkIsAdminOrOwnerOrAgent.mockImplementation((req, res, next) => next());
      validationMiddleware.validateObjectId.mockImplementation((req, res, next) => next());

      const res = await request(app)
        .put('/api/properties/1')
        .send({ title: 'Updated Property' });

      expect(res.status).toBe(200);
      expect(propertyController.updateProperty).toHaveBeenCalledWith(expect.anything(), expect.anything(), expect.anything());
      expect(res.body).toEqual(mockUpdatedProperty);
    });
  });

  describe('DELETE /api/properties/:id', () => {
    it('should delete a property', async () => {
      propertyController.deleteProperty.mockResolvedValue({});
      authMiddleware.default.mockImplementation((req, res, next) => next());
      roleMiddleware.checkIsAdminOrOwnerOrAgent.mockImplementation((req, res, next) => next());
      validationMiddleware.validateObjectId.mockImplementation((req, res, next) => next());

      const res = await request(app).delete('/api/properties/1');

      expect(res.status).toBe(200); // Assuming successful deletion
      expect(propertyController.deleteProperty).toHaveBeenCalled();
    });
  });

  describe('GET /api/properties/', () => {
    it('should get properties by filter', async () => {
      const mockProperties = [{ _id: '1', title: 'Test Property' }];
      propertyController.getPropertiesByFilter.mockResolvedValue(mockProperties);

      const res = await request(app).get('/api/properties').query({ price: 100000 });

      expect(res.status).toBe(200);
      expect(propertyController.getPropertiesByFilter).toHaveBeenCalled();
      expect(res.body).toEqual(mockProperties);
    });
  });
});
