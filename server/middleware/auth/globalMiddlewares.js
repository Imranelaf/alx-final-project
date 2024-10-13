import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

// Apply all global middlewares
const applyGlobalMiddleware = (app) => {
  // Body parsers
  app.use(express.json()); // Parse JSON requests
  app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

  // CORS middleware
  app.use(cors({
    origin: process.env.CLIENT_URI, // Your frontend URL
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
  }));

  // Security middleware
  app.use(helmet()); // Secure app by setting various HTTP headers

  // Logging middleware
  app.use(morgan('dev')); // Log HTTP requests in the console (for dev environments)

  // Compression middleware
  app.use(compression()); // Compress response bodies for performance

  // Rate limiting middleware (optional but recommended)
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
  });
  app.use(limiter); // Apply rate limiter to all requests
};

export default applyGlobalMiddleware;
