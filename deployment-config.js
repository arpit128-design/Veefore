#!/usr/bin/env node

/**
 * VeeFore Deployment Configuration
 * 
 * This file contains all deployment-specific configurations and fixes
 * for production deployment issues.
 */

export const deploymentConfig = {
  // Production environment variables
  production: {
    NODE_ENV: 'production',
    PORT: 5000,
    HOST: '0.0.0.0'
  },
  
  // Build configuration
  build: {
    client: {
      command: 'npx vite build',
      outputDir: 'dist/public',
      env: { NODE_ENV: 'production' }
    },
    server: {
      command: 'npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist',
      externals: [
        './vite',
        'vite', 
        '@replit/vite-plugin-cartographer',
        '@replit/vite-plugin-runtime-error-modal'
      ],
      outputFile: 'dist/index.js'
    }
  },
  
  // Static file serving configuration
  static: {
    publicDir: 'dist/public',
    fallback: 'index.html',
    routes: ['/', '/dashboard', '/login', '/signup', '/analytics', '/scheduler', '/content', '/create-post']
  },
  
  // Health check configuration
  health: {
    endpoint: '/api/health',
    timeout: 30000,
    checks: ['database', 'server', 'static-files']
  },
  
  // Error handling
  errors: {
    viteImportFail: 'Vite modules not available in production - using static serving',
    buildDirMissing: 'Build directory not found - run build command first',
    serverStartFail: 'Server failed to start - check environment variables'
  },
  
  // Required environment variables for production
  requiredEnvVars: [
    'DATABASE_URL',
    'FIREBASE_PROJECT_ID',
    'FIREBASE_PRIVATE_KEY',
    'FIREBASE_CLIENT_EMAIL',
    'OPENAI_API_KEY',
    'STRIPE_SECRET_KEY',
    'SENDGRID_API_KEY',
    'INSTAGRAM_CLIENT_ID',
    'INSTAGRAM_CLIENT_SECRET'
  ]
};

// Deployment validation function
export function validateDeployment() {
  const missing = [];
  
  // Check required environment variables
  deploymentConfig.requiredEnvVars.forEach(envVar => {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  });
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing);
    return false;
  }
  
  // Check build directory exists
  const fs = require('fs');
  const path = require('path');
  
  if (!fs.existsSync(deploymentConfig.static.publicDir)) {
    console.error('❌ Build directory not found:', deploymentConfig.static.publicDir);
    return false;
  }
  
  console.log('✅ Deployment validation passed');
  return true;
}

export default deploymentConfig;