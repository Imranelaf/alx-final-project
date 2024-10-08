import express from 'express';
import connectDB from './config/db.js';

// Connect to the database
connectDB();

// Initialize the app
const app = express();

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
