// Test script to identify problematic route patterns
import express from 'express';

const app = express();

// Test route patterns that might cause path-to-regexp errors
const testRoutes = [
  '/api/user',
  '/api/user/:id',
  '/api/workspaces/:id',
  '/api/content/:id',
  '/api/social-accounts/:id',
  '/api/workspaces/:workspaceId/members',
  '/api/workspaces/:workspaceId/invitations',
  '/api/workspaces/:workspaceId/invite',
  '/api/youtube/refresh-token/:accountId',
  '/api/instagram/refresh-token/:accountId'
];

console.log('Testing route patterns...');

try {
  testRoutes.forEach((route, index) => {
    console.log(`Testing route ${index + 1}: ${route}`);
    app.get(route, (req, res) => {
      res.json({ success: true });
    });
  });
  
  console.log('All test routes registered successfully!');
} catch (error) {
  console.error('Error registering routes:', error);
}