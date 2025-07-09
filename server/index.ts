import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { MongoStorage } from "./mongodb-storage";
import { startSchedulerService } from "./scheduler-service";
import { AutoSyncService } from "./auto-sync-service";
import multer from "multer";
import path from "path";
import fs from "fs";

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit for videos
  fileFilter: (req, file, cb) => {
    // Accept images and videos
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed'));
    }
  }
});

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));

// Fix body parsing middleware for content creation
app.use((req, res, next) => {
  if (req.path.startsWith('/api/content') && req.method === 'POST') {
    console.log('[BODY DEBUG] Raw body:', req.body);
    console.log('[BODY DEBUG] Content-Type:', req.headers['content-type']);
    console.log('[BODY DEBUG] Content-Length:', req.headers['content-length']);
    
    // Fix double-stringified body issue
    if (req.body && typeof req.body === 'object' && req.body.body && typeof req.body.body === 'string') {
      try {
        req.body = JSON.parse(req.body.body);
        console.log('[BODY DEBUG] Fixed double-stringified body');
      } catch (parseError) {
        console.error('[BODY DEBUG] Failed to parse nested body:', parseError);
      }
    }
  }
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const storage = new MongoStorage();
  await storage.connect();
  
  // Database reset endpoint for fresh starts
  app.post('/api/admin/reset-database', async (req, res) => {
    try {
      console.log('🔄 Starting complete database reset...');
      
      // Wait for storage to be connected
      await storage.connect();
      
      let totalDeleted = 0;
      const resetResults = [];
      
      // Clear all data through the storage interface
      try {
        // Clear users
        const userResult = await storage.clearAllUsers();
        if (userResult > 0) {
          console.log(`🗑️  Cleared users: ${userResult} documents`);
          resetResults.push({ collection: 'users', deleted: userResult });
          totalDeleted += userResult;
        }
      } catch (error) {
        console.log(`⚠️  Error clearing users: ${error.message}`);
      }
      
      try {
        // Clear waitlist users
        const waitlistResult = await storage.clearAllWaitlistUsers();
        if (waitlistResult > 0) {
          console.log(`🗑️  Cleared waitlist_users: ${waitlistResult} documents`);
          resetResults.push({ collection: 'waitlist_users', deleted: waitlistResult });
          totalDeleted += waitlistResult;
        }
      } catch (error) {
        console.log(`⚠️  Error clearing waitlist_users: ${error.message}`);
      }
      
      try {
        // Clear workspaces
        const workspaceResult = await storage.clearAllWorkspaces();
        if (workspaceResult > 0) {
          console.log(`🗑️  Cleared workspaces: ${workspaceResult} documents`);
          resetResults.push({ collection: 'workspaces', deleted: workspaceResult });
          totalDeleted += workspaceResult;
        }
      } catch (error) {
        console.log(`⚠️  Error clearing workspaces: ${error.message}`);
      }
      
      try {
        // Clear social accounts
        const socialResult = await storage.clearAllSocialAccounts();
        if (socialResult > 0) {
          console.log(`🗑️  Cleared social_accounts: ${socialResult} documents`);
          resetResults.push({ collection: 'social_accounts', deleted: socialResult });
          totalDeleted += socialResult;
        }
      } catch (error) {
        console.log(`⚠️  Error clearing social_accounts: ${error.message}`);
      }
      
      try {
        // Clear content
        const contentResult = await storage.clearAllContent();
        if (contentResult > 0) {
          console.log(`🗑️  Cleared content: ${contentResult} documents`);
          resetResults.push({ collection: 'content', deleted: contentResult });
          totalDeleted += contentResult;
        }
      } catch (error) {
        console.log(`⚠️  Error clearing content: ${error.message}`);
      }
      
      console.log(`✅ DATABASE RESET COMPLETED - Total documents deleted: ${totalDeleted}`);
      
      res.json({
        success: true,
        message: 'Database reset completed successfully',
        totalDeleted,
        resetResults,
        note: 'Fresh database - ready for new accounts'
      });
      
    } catch (error) {
      console.error('❌ Database reset failed:', error);
      res.status(500).json({
        success: false,
        error: 'Database reset failed',
        message: error.message
      });
    }
  });
  
  // Start the background scheduler service
  startSchedulerService(storage);
  
  // Start the automatic Instagram sync service
  const autoSyncService = new AutoSyncService(storage);
  autoSyncService.start();
  
  const server = await registerRoutes(app, storage, upload);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    // Temporarily disable REPL_ID to prevent cartographer plugin from loading
    const originalReplId = process.env.REPL_ID;
    delete process.env.REPL_ID;
    
    try {
      await setupVite(app, server);
      console.log('[DEBUG] Vite setup completed successfully - serving React application');
    } catch (error) {
      console.error('[DEBUG] Vite setup failed:', error);
      console.log('[DEBUG] Falling back to static file serving');
      // Custom static serving as fallback
      const distPath = path.join(process.cwd(), 'dist/public');
      app.use(express.static(distPath));
      
      // Handle root route specifically to avoid path-to-regexp issues  
      app.get('/', (_req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
      
      // Handle common frontend routes
      app.get('/dashboard', (_req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
      
      app.get('/login', (_req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
      
      app.get('/signup', (_req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    } finally {
      // Restore REPL_ID
      if (originalReplId) {
        process.env.REPL_ID = originalReplId;
      }
    }
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
