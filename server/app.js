import express from 'express';
import connectDB from './config/db.js';
import applyGlobalMiddleware from './middleware/globalMiddlewares.js';
import errorHandler from './middleware/errorMiddleware.js';  
import initRoutes from './routes/initRoutes.js';

// Connect to the database
connectDB();

// Initialize the app
const app = express();

// Apply global middlewares (e.g., JSON parsing, CORS)
applyGlobalMiddleware(app);

// Initialize all routes
initRoutes(app);

// Error handling middleware
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
