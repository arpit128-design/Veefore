const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// API routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'VeeFore API',
    message: 'Server is running successfully'
  });
});

app.get('/api/user', (req, res) => {
  res.json({ 
    id: 1, 
    email: 'user@example.com',
    firstName: 'Demo',
    lastName: 'User'
  });
});

app.get('/api/workspaces', (req, res) => {
  res.json([
    {
      id: 1,
      name: 'My Workspace',
      description: 'Default workspace',
      isDefault: true
    }
  ]);
});

app.get('/api/social-accounts', (req, res) => {
  res.json([]);
});

app.get('/api/analytics/filtered', (req, res) => {
  res.json({
    followers: 1250,
    engagement: 4.2,
    reach: 8500,
    posts: 42
  });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`VeeFore server running on port ${PORT}`);
  console.log('✓ API endpoints available');
  console.log('✓ Static files served from public/');
  console.log('✓ React app routing enabled');
});