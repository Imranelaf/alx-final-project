import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import propertyRoutes from './propertyRoutes.js';
import transactionRoutes from './transactionRoutes.js';
import adminRoutes from './adminRoutes.js';
import agentRoutes from './agentRoutes.js';
import faqRoutes from './faqRoutes.js';


const initRoutes = (app) => {
  app.use('/api/auth', authRoutes);             // Authentication routes
  app.use('/api/users', userRoutes);            // User-related routes
  app.use('/api/properties', propertyRoutes);   // Property routes
  app.use('/api/transactions', transactionRoutes); // Transaction routes (buy, rent)
  app.use('/api/admin', adminRoutes);           // Admin-specific routes
  app.use('/api/agents', agentRoutes);          // Agent-specific routes
  app.use('/api/faqs', faqRoutes);              // FAQ routes
};

export default initRoutes;

