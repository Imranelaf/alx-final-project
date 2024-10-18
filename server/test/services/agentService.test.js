import { 
  createNewAgent, 
  getAgentsByFilterService, 
  getAgentByIdService, 
  updateAgentService, 
  deleteAgentService,
  updateAgentStatusService
} from '../../services/agentService.js';

import Agent from '../../models/Agent.js';
import { connect, clearDatabase, closeDatabase } from '../setup/dbHandler.js';
import { ValidationError, NotFoundError, ServerError } from '../../utils/customErrors.js';

describe('Agent Service Tests', () => {
beforeAll(async () => await connect());
afterEach(async () => await clearDatabase());
afterAll(async () => await closeDatabase());

const validAgentData = {
  firstName: 'John',
  lastName: 'Doe',
  username: 'john_doe',
  email: 'john@example.com',
  phoneNumber: '+1234567890',
  agency: 'Doe Realty',
  licenseNumber: 'LIC123',
  password: 'Password123!',
  bio: 'Experienced real estate agent'
};

describe('Create New Agent', () => {
  test('should create a new agent successfully', async () => {
    const newAgent = await createNewAgent(validAgentData);
    expect(newAgent).toHaveProperty('_id');
    expect(newAgent.email).toBe(validAgentData.email);
  });

  test('should throw ServerError when required fields are missing', async () => {
    const incompleteAgentData = { username: 'missing_fields' };

    await expect(createNewAgent(incompleteAgentData))
      .rejects
      .toThrow(ServerError); // Expecting ServerError due to validation issues
  });
});

describe('Get Agents by Filter', () => {
  test('should return agents filtered by firstName', async () => {
    await createNewAgent(validAgentData);

    const filters = { firstName: 'John' };
    const agents = await getAgentsByFilterService(filters);
    expect(agents.length).toBeGreaterThan(0);
    expect(agents[0].firstName).toBe('John');
  });
});

describe('Get Agent by ID', () => {
  test('should retrieve an agent by ID', async () => {
    const newAgent = await createNewAgent(validAgentData);
    const foundAgent = await getAgentByIdService(newAgent._id);

    expect(foundAgent).toHaveProperty('_id');
    expect(foundAgent._id.toString()).toBe(newAgent._id.toString());
  });

  test('should throw NotFoundError if agent ID does not exist', async () => {
    const fakeId = '610c1f49f0d12408f854b0f1';  // Fake MongoDB ID

    await expect(getAgentByIdService(fakeId))
      .rejects
      .toThrow(NotFoundError);
  });
});

describe('Update Agent', () => {
  test('should update an agent successfully', async () => {
    const newAgent = await createNewAgent(validAgentData);
    const updates = { agency: 'Updated Agency' };

    const updatedAgent = await updateAgentService(newAgent._id, updates);
    expect(updatedAgent.agency).toBe('Updated Agency');
  });

  test('should throw NotFoundError if agent ID does not exist during update', async () => {
    const fakeId = '610c1f49f0d12408f854b0f1';
    const updates = { agency: 'Updated Agency' };

    await expect(updateAgentService(fakeId, updates))
      .rejects
      .toThrow(NotFoundError);
  });
});

describe('Delete Agent', () => {
  test('should delete an agent successfully', async () => {
    const newAgent = await createNewAgent(validAgentData);
    await deleteAgentService(newAgent._id);

    await expect(getAgentByIdService(newAgent._id))
      .rejects
      .toThrow(NotFoundError);
  });

  test('should throw NotFoundError if agent ID does not exist during deletion', async () => {
    const fakeId = '610c1f49f0d12408f854b0f1';

    await expect(deleteAgentService(fakeId))
      .rejects
      .toThrow(NotFoundError);
  });
});

describe('Update Agent Status', () => {
  test('should update agent status successfully', async () => {
    const newAgent = await createNewAgent(validAgentData);
    const updatedAgent = await updateAgentStatusService(newAgent._id, 'active');
    
    expect(updatedAgent.agentStatus).toBe('active');
  });

  test('should throw ValidationError for invalid status', async () => {
    const newAgent = await createNewAgent(validAgentData);

    await expect(updateAgentStatusService(newAgent._id, 'invalidStatus'))
      .rejects
      .toThrow(ValidationError);
  });
});
});
