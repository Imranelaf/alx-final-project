import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

// Connect to the in-memory database
export const connect = async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true, 
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.error('Error connecting to in-memory database:', error);
  }
};

// Clear all test data after every test
export const clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    if (Object.prototype.hasOwnProperty.call(collections, key)) {
      const collection = collections[key];
      await collection.deleteMany(); // clear the collection
    }
  }
};

// Remove and close the database and server
export const closeDatabase = async () => {
  try {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  } catch (error) {
    console.error('Error closing in-memory database:', error);
  }
};
