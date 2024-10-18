import {
    getAgentsByFilter,
    getAgentById,
    deleteAgent,
    updateAgent,
    updateAgentStatus,
  } from '../../controllers/agentController.js';
  
  import {
    getAgentsByFilterService,
    getAgentByIdService,
    deleteAgentService,
    updateAgentService,
    updateAgentStatusService,
  } from '../../services/agentService.js';
  
  import { excludeSensitiveInfo } from '../../utils/excludeSensitiveInfo.js';
  
  jest.mock('../../services/agentService.js');
  jest.mock('../../utils/excludeSensitiveInfo.js');
  
  describe('Agent Controller Basic Tests', () => {
  
    describe('getAgentsByFilter', () => {
      test('should return a list of agents', async () => {
        const req = { query: {} };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();
        const mockAgents = [{ _id: '1', username: 'agent1' }];
        getAgentsByFilterService.mockResolvedValue(mockAgents);
        excludeSensitiveInfo.mockReturnValue({ _id: '1', username: 'agent1' });
  
        await getAgentsByFilter(req, res, next);
  
        expect(getAgentsByFilterService).toHaveBeenCalledWith(req.query);
        expect(excludeSensitiveInfo).toHaveBeenCalledWith(mockAgents[0], ['password', '__v']);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          data: [{ _id: '1', username: 'agent1' }],
        });
      });
  
      test('should handle errors', async () => {
        const req = { query: {} };
        const res = { status: jest.fn(), json: jest.fn() };
        const next = jest.fn();
        const error = new Error('Error fetching agents');
        getAgentsByFilterService.mockRejectedValue(error);
  
        await getAgentsByFilter(req, res, next);
  
        expect(next).toHaveBeenCalledWith(error);
      });
    });
  
    describe('getAgentById', () => {
      test('should return agent data', async () => {
        const req = { params: { id: '1' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();
        const mockAgent = { _id: '1', username: 'agent1' };
        getAgentByIdService.mockResolvedValue(mockAgent);
        excludeSensitiveInfo.mockReturnValue({ _id: '1', username: 'agent1' });
  
        await getAgentById(req, res, next);
  
        expect(getAgentByIdService).toHaveBeenCalledWith('1');
        expect(excludeSensitiveInfo).toHaveBeenCalledWith(mockAgent, ['password', '__v']);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          data: { _id: '1', username: 'agent1' },
        });
      });
  
      test('should handle errors', async () => {
        const req = { params: { id: '1' } };
        const res = { status: jest.fn(), json: jest.fn() };
        const next = jest.fn();
        const error = new Error('Agent not found');
        getAgentByIdService.mockRejectedValue(error);
  
        await getAgentById(req, res, next);
  
        expect(next).toHaveBeenCalledWith(error);
      });
    });
  
    describe('deleteAgent', () => {
      test('should delete the agent successfully', async () => {
        const req = { params: { id: '1' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();
  
        await deleteAgent(req, res, next);
  
        expect(deleteAgentService).toHaveBeenCalledWith('1');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          message: 'Agent deleted successfully!',
        });
      });
  
      test('should handle errors', async () => {
        const req = { params: { id: '1' } };
        const res = { status: jest.fn(), json: jest.fn() };
        const next = jest.fn();
        const error = new Error('Error deleting agent');
        deleteAgentService.mockRejectedValue(error);
  
        await deleteAgent(req, res, next);
  
        expect(next).toHaveBeenCalledWith(error);
      });
    });
  
    describe('updateAgent', () => {
      test('should update the agent successfully', async () => {
        const req = { params: { id: '1' }, body: { username: 'new_username' }, user: { role: 'agent' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();
        const mockUpdatedAgent = { _id: '1', username: 'new_username' };
        updateAgentService.mockResolvedValue(mockUpdatedAgent);
        excludeSensitiveInfo.mockReturnValue(mockUpdatedAgent);
  
        await updateAgent(req, res, next);
  
        expect(updateAgentService).toHaveBeenCalledWith('1', { username: 'new_username' }, 'agent');
        expect(excludeSensitiveInfo).toHaveBeenCalledWith(mockUpdatedAgent, ['password', '__v']);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          message: 'Agent information updated successfully.',
          data: mockUpdatedAgent,
        });
      });
  
      test('should handle errors', async () => {
        const req = { params: { id: '1' }, body: {}, user: { role: 'agent' } };
        const res = { status: jest.fn(), json: jest.fn() };
        const next = jest.fn();
        const error = new Error('Error updating agent');
        updateAgentService.mockRejectedValue(error);
  
        await updateAgent(req, res, next);
  
        expect(next).toHaveBeenCalledWith(error);
      });
    });
  
    describe('updateAgentStatus', () => {
      test('should update agent status successfully', async () => {
        const req = { params: { id: '1' }, body: { agentStatus: 'active' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();
        const mockUpdatedAgent = { _id: '1', agentStatus: 'active' };
        updateAgentStatusService.mockResolvedValue(mockUpdatedAgent);
  
        await updateAgentStatus(req, res, next);
  
        expect(updateAgentStatusService).toHaveBeenCalledWith('1', 'active');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          message: 'Agent status updated to active',
          data: {
            id: mockUpdatedAgent._id,
            firstName: mockUpdatedAgent.firstName,
            lastName: mockUpdatedAgent.lastName,
            email: mockUpdatedAgent.email,
            agentStatus: mockUpdatedAgent.agentStatus,
          },
        });
      });
  
      test('should handle errors', async () => {
        const req = { params: { id: '1' }, body: { agentStatus: 'active' } };
        const res = { status: jest.fn(), json: jest.fn() };
        const next = jest.fn();
        const error = new Error('Error updating agent status');
        updateAgentStatusService.mockRejectedValue(error);
  
        await updateAgentStatus(req, res, next);
  
        expect(next).toHaveBeenCalledWith(error);
      });
    });
  
  });
  