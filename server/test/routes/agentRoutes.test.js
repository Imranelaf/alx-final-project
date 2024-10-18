import request from 'supertest';
import express from 'express';
import agentRoutes from '../../routes/agentRoutes.js';
import * as agentController from '../../controllers/agent/agentController.js';
import authenticateJWT from '../../middleware/auth/authMiddleware.js';
import * as roleMiddleware from '../../middleware/auth/roleMiddleware.js';
import * as validation from '../../middleware/validation/validateObjectId.js';

// Create an Express application to test
const app = express();
app.use(express.json());  // Enable JSON request parsing
app.use('/api/agents', agentRoutes);

// Mock the controller and middleware functions
jest.mock('../../controllers/agent/agentController.js');
jest.mock('../../middleware/auth/authMiddleware.js');
jest.mock('../../middleware/auth/roleMiddleware.js');
jest.mock('../../middleware/validation/validateObjectId.js');

describe('Agent Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();  // Clear mocks before each test
  });

  describe('GET /api/agents', () => {
    it('should fetch all agents', async () => {
      const mockAgents = [{ _id: '1', firstName: 'John' }];
      agentController.getAgentsByFilter.mockResolvedValue(mockAgents);

      const res = await request(app).get('/api/agents');

      expect(res.status).toBe(200);
      expect(agentController.getAgentsByFilter).toHaveBeenCalled();
    });
  });

  describe('GET /api/agents/:id', () => {
    it('should get an agent by ID', async () => {
      const mockAgent = { _id: '1', firstName: 'John' };
      agentController.getAgentById.mockResolvedValue(mockAgent);
      validation.validateObjectId.mockImplementation((req, res, next) => next());

      const res = await request(app).get('/api/agents/1');

      expect(res.status).toBe(200);
      expect(agentController.getAgentById).toHaveBeenCalledWith(expect.anything(), expect.anything(), expect.anything());
      expect(validation.validateObjectId).toHaveBeenCalled();
    });
  });

  describe('PATCH /api/agents/:id/status', () => {
    it('should update the agent status (Admin only)', async () => {
      agentController.updateAgentStatus.mockResolvedValue({ success: true });
      authenticateJWT.mockImplementation((req, res, next) => next());
      roleMiddleware.checkIsAdmin.mockImplementation((req, res, next) => next());
      validation.validateObjectId.mockImplementation((req, res, next) => next());

      const res = await request(app)
        .patch('/api/agents/1/status')
        .send({ agentStatus: 'active' });

      expect(res.status).toBe(200);
      expect(agentController.updateAgentStatus).toHaveBeenCalled();
      expect(authenticateJWT).toHaveBeenCalled();
      expect(roleMiddleware.checkIsAdmin).toHaveBeenCalled();
    });
  });

  describe('PUT /api/agents/:id', () => {
    it('should update an agent (Admin or the agent themselves)', async () => {
      agentController.updateAgent.mockResolvedValue({ success: true });
      authenticateJWT.mockImplementation((req, res, next) => next());
      roleMiddleware.checkIsAgentSelfOrAdmin.mockImplementation((req, res, next) => next());
      validation.validateObjectId.mockImplementation((req, res, next) => next());

      const res = await request(app)
        .put('/api/agents/1')
        .send({ firstName: 'Updated' });

      expect(res.status).toBe(200);
      expect(agentController.updateAgent).toHaveBeenCalled();
      expect(authenticateJWT).toHaveBeenCalled();
      expect(roleMiddleware.checkIsAgentSelfOrAdmin).toHaveBeenCalled();
    });
  });

  describe('DELETE /api/agents/:id', () => {
    it('should delete an agent (Admin or the agent themselves)', async () => {
      agentController.deleteAgent.mockResolvedValue({ success: true });
      authenticateJWT.mockImplementation((req, res, next) => next());
      roleMiddleware.checkIsAgentSelfOrAdmin.mockImplementation((req, res, next) => next());
      validation.validateObjectId.mockImplementation((req, res, next) => next());

      const res = await request(app).delete('/api/agents/1');

      expect(res.status).toBe(200);
      expect(agentController.deleteAgent).toHaveBeenCalled();
      expect(authenticateJWT).toHaveBeenCalled();
      expect(roleMiddleware.checkIsAgentSelfOrAdmin).toHaveBeenCalled();
    });
  });
});
