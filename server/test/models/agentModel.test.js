import mongoose from 'mongoose';
import { connect, clearDatabase, closeDatabase } from '../setup/dbHandler.js';
import Agent from '../../models/Agent.js';

describe('Agent Model Basic Data Validation', () => {
  // Connect to in-memory MongoDB before running any tests
  beforeAll(async () => await connect());

  // Clear the database after each test
  afterEach(async () => await clearDatabase());

  // Close the in-memory database after all tests
  afterAll(async () => await closeDatabase());

  test('should validate and save an agent with valid data', async () => {
    const validAgent = {
      username: 'testagent',
      email: 'agent@example.com',
      password: 'Password123!',
      firstName: 'Test',
      lastName: 'Agent',
      phoneNumber: '+1234567890',
      licenseNumber: 'ABC123',
      agency: 'Test Agency',
    };

    const agent = new Agent(validAgent);
    const savedAgent = await agent.save();

    expect(savedAgent._id).toBeDefined();
    expect(savedAgent.email).toBe(validAgent.email);
    expect(savedAgent.username).toBe(validAgent.username);
  });
});
