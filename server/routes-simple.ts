import { Express, Request, Response, NextFunction } from 'express';
import { Server } from 'http';
import { IStorage } from './storage';

export async function registerRoutes(app: Express, storage: IStorage): Promise<Server> {
  // Simple middleware for auth simulation
  const requireAuth = (req: any, res: Response, next: NextFunction) => {
    req.user = { id: '1', email: 'test@example.com' };
    next();
  };

  // Basic health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      service: 'VeeFore API',
      mongodb: 'connected'
    });
  });

  // Basic endpoints
  app.get('/api/user', requireAuth, (req: any, res: Response) => {
    res.json({ id: req.user.id, email: req.user.email });
  });

  app.get('/api/workspaces', requireAuth, (req: any, res: Response) => {
    res.json([]);
  });

  // Start server
  const server = app.listen(5000, '0.0.0.0', () => {
    console.log('VeeFore server running on port 5000');
  });

  return server;
}