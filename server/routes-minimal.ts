import type { Express, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { IStorage } from "./storage";

export async function registerRoutes(app: Express, storage: IStorage): Promise<Server> {
  // Basic health check route
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Basic user route  
  app.get('/api/user', (req, res) => {
    res.json({ message: 'User endpoint working' });
  });

  // Serve placeholder image endpoint (safe pattern)
  app.get('/api/placeholder-image', async (req, res) => {
    try {
      const width = parseInt(req.query.width as string) || 400;
      const height = parseInt(req.query.height as string) || 300;
      const text = (req.query.text as string) || 'Placeholder';
      const bgColor = (req.query.bg as string) || 'f0f0f0';
      const textColor = (req.query.color as string) || '333333';
      
      const svg = `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#${bgColor}"/>
          <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" fill="#${textColor}" text-anchor="middle" dominant-baseline="middle">
            ${text}
          </text>
        </svg>
      `;
      
      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      res.send(svg);
    } catch (error) {
      console.error('[PLACEHOLDER] Error generating image:', error);
      res.status(500).json({ error: 'Failed to generate placeholder image' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}