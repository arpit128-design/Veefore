import express from 'express';
import cors from 'cors';
import { registerRoutes } from './routes-simple';
import { MongoStorage } from './mongodb-storage';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize storage
const storage = new MongoStorage();

async function startServer() {
  try {
    await storage.connect();
    console.log('Connected to MongoDB Atlas - veeforedb database');
    
    const server = await registerRoutes(app, storage);
    console.log('VeeFore API server started successfully');
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();