/**
 * This file is used to initialize all the routes in the application.
 */

import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import propertyRoutes from './propertyRoutes.js';
import faqRoutes from './faqRoutes.js';


const initRoutes = (app) => {
  app.use('/api/auth', authRoutes);             // Authentication routes
  app.use('/api/users', userRoutes);            // User-related routes
  app.use('/api/properties', propertyRoutes);   // Property routes
  app.use('/api/faqs', faqRoutes);
};

export default initRoutes;
