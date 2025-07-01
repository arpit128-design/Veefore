import type { Express } from "express";
import { createServer, type Server } from "http";
import { IStorage } from "./storage";

export async function registerRoutes(app: Express, storage: IStorage, upload?: any): Promise<Server> {
  console.log('[ROUTES TEST] Starting minimal route registration...');
  
  // Start with minimal routes to isolate the issue
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });
  
  console.log('[ROUTES TEST] Basic health route registered');

  const httpServer = createServer(app);
  console.log('[ROUTES TEST] HTTP server created successfully');
  return httpServer;
}