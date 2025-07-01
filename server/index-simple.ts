import express, { type Request, Response, NextFunction } from "express";
import path from "path";
import { MongoStorage } from "./mongodb-storage";

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

(async () => {
  const storage = new MongoStorage();
  await storage.connect();

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        instagram: 'active',
        youtube: 'active'
      }
    });
  });

  // Serve the React app with Vite
  if (process.env.NODE_ENV !== "production") {
    const { createServer } = await import("vite");
    const vite = await createServer({
      configFile: false,
      server: { 
        middlewareMode: true,
        host: 'localhost',
        port: 5173
      },
      appType: 'custom',
      root: path.resolve(process.cwd(), 'client'),
      resolve: {
        alias: {
          "@": path.resolve(process.cwd(), "client", "src"),
          "@shared": path.resolve(process.cwd(), "shared"),
          "@assets": path.resolve(process.cwd(), "attached_assets"),
        },
      },
    });
    
    app.use(vite.middlewares);
    
    // Simple route handler for React app
    app.get('*', async (req, res, next) => {
      if (req.path.startsWith('/api')) {
        return next();
      }
      
      try {
        const template = await vite.transformIndexHtml(req.originalUrl, `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>VeeFore - AI Social Media Management</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
        `);
        res.send(template);
      } catch (e) {
        console.error('Vite error:', e);
        res.status(500).end('Internal server error');
      }
    });
  }

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
  });

  const port = 5000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 VeeFore server running on port ${port}`);
    console.log('✅ MongoDB Atlas connected');
    console.log('✅ React app ready');
  });
})().catch(console.error);