import mongoose from 'mongoose';
import User from '../../models/User.js';  // Adjust the path as necessary
import bcrypt from 'bcrypt';
import { MongoMemoryServer } from 'mongodb-memory-server';

// Setup in-memory MongoDB for testing
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany();  // Clear user data after each test
});

describe('User Model - Basic Tests', () => {
  it('should create a new user successfully', async () => {
    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'john@example.com',
      password: 'Password1',
    };

    const user = new User(userData);
    const savedUser = await user.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.username).toBe(userData.username);
    expect(savedUser.firstName).toBe(userData.firstName);
    expect(savedUser.lastName).toBe(userData.lastName);
  });

  it('should hash the password before saving the user', async () => {
    const userData = {
      firstName: 'Jane',
      lastName: 'Doe',
      username: 'janedoe',
      email: 'jane@example.com',
      password: 'Password1',
    };

    const user = new User(userData);
    await user.save();

    const savedUser = await User.findOne({ email: 'jane@example.com' });

    // Check that the password is hashed
    expect(savedUser.password).not.toBe(userData.password);
    // Validate the password hash
    const isPasswordMatch = await bcrypt.compare(userData.password, savedUser.password);
    expect(isPasswordMatch).toBe(true);
  });
});
