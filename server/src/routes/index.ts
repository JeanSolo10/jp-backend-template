import express from 'express';
import userRoutes from './userRoutes.js';

// setup routes for each model here
export default function registerRoutes(app: express.Application) {
  app.use('/api/users', userRoutes());
}
