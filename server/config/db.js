/**
 * This file is responsible for connecting to the MongoDB database using Mongoose.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

// Function to connect to MongoDB using the latest Mongoose standards
const mongoURI = process.env.MONGODB_URI;
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1); // Exit with failure
  }
};

export default connectDB;
