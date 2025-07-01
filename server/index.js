import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.static('public'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'VeeFore API',
    message: 'Server running successfully'
  });
});

// Basic auth simulation
const mockAuth = (req, res, next) => {
  req.user = { id: 1, email: 'demo@veefore.com' };
  next();
};

// User endpoints
app.get('/api/user', mockAuth, (req, res) => {
  res.json({ 
    id: req.user.id, 
    email: req.user.email,
    firstName: 'Demo',
    lastName: 'User',
    credits: 100
  });
});

// Workspace endpoints  
app.get('/api/workspaces', mockAuth, (req, res) => {
  res.json([{
    id: 1,
    name: 'My Workspace',
    description: 'Default workspace',
    isDefault: true,
    credits: 100
  }]);
});

// Social accounts
app.get('/api/social-accounts', mockAuth, (req, res) => {
  res.json([
    {
      id: 1,
      platform: 'instagram',
      username: '@demo_account',
      isConnected: true,
      followers: 1250,
      posts: 42
    }
  ]);
});

// Analytics endpoints
app.get('/api/analytics/filtered', mockAuth, (req, res) => {
  res.json({
    followers: 1250,
    engagement: 4.2,
    reach: 8500,
    posts: 42,
    likes: 3200,
    comments: 150
  });
});

app.get('/api/dashboard/analytics', mockAuth, (req, res) => {
  res.json({
    totalFollowers: 1250,
    totalEngagement: 4.2,
    totalReach: 8500,
    totalPosts: 42,
    followersChange: 12.5,
    engagementChange: -2.1,
    reachChange: 8.3,
    postsChange: 5.0
  });
});

// Content endpoints
app.get('/api/content', mockAuth, (req, res) => {
  res.json([]);
});

app.get('/api/scheduled-content', mockAuth, (req, res) => {
  res.json([]);
});

// Serve React frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ VeeFore server running on port ${PORT}`);
  console.log('✓ API endpoints active');
  console.log('✓ Frontend served from public/');
  console.log('✓ Ready for connections');
});

export { server };