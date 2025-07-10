#!/usr/bin/env node

/**
 * Production Build Script for VeeFore
 * 
 * This script handles production builds by:
 * 1. Building the client with Vite
 * 2. Building the server with esbuild excluding Vite dependencies
 * 3. Handling production-specific optimizations
 * 4. Creating dist directory and ensuring proper file structure
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

async function buildProduction() {
  console.log('🚀 Starting VeeFore production build...');
  
  try {
    // Step 1: Clean existing dist directory
    console.log('🧹 Cleaning dist directory...');
    if (fs.existsSync('dist')) {
      fs.rmSync('dist', { recursive: true, force: true });
    }
    
    // Step 2: Build client with Vite
    console.log('🔨 Building client with Vite...');
    process.env.NODE_ENV = 'production';
    await execAsync('npx vite build');
    
    // Step 3: Build server with esbuild (excluding Vite)
    console.log('🔧 Building server with esbuild...');
    await execAsync(`npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist --external:./vite --external:vite --external:@replit/vite-plugin-cartographer --external:@replit/vite-plugin-runtime-error-modal`);
    
    // Step 4: Create production package.json
    console.log('📦 Creating production package.json...');
    const productionPackageJson = {
      name: "veefore-production",
      version: "1.0.0",
      type: "module",
      main: "index.js",
      scripts: {
        start: "NODE_ENV=production node index.js"
      },
      dependencies: {
        // Only include production dependencies
        "express": "^4.21.2",
        "mongoose": "^8.16.2",
        "mongodb": "^6.17.0",
        "jsonwebtoken": "^9.0.2",
        "bcryptjs": "^3.0.2",
        "multer": "^2.0.1",
        "firebase-admin": "^13.4.0",
        "openai": "^5.9.0",
        "stripe": "^18.3.0",
        "razorpay": "^2.9.6",
        "@sendgrid/mail": "^8.1.5",
        "sharp": "^0.34.3",
        "canvas": "^2.11.2",
        "jimp": "^1.6.0",
        "puppeteer": "^24.12.1",
        "fluent-ffmpeg": "^2.1.3",
        "fabric": "^6.7.0",
        "nodemailer": "^7.0.5",
        "axios": "^1.10.0",
        "dotenv": "^16.6.1",
        "zod": "^3.25.76",
        "date-fns": "^3.6.0",
        "ws": "^8.18.3"
      }
    };
    
    fs.writeFileSync('dist/package.json', JSON.stringify(productionPackageJson, null, 2));
    
    // Step 5: Create .env template for production
    console.log('📝 Creating .env template...');
    const envTemplate = `# VeeFore Production Environment Variables
NODE_ENV=production
PORT=5000

# MongoDB
DATABASE_URL=mongodb://localhost:27017/veefore

# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="your-private-key"
FIREBASE_CLIENT_EMAIL=your-client-email

# OpenAI
OPENAI_API_KEY=your-openai-key

# Stripe
STRIPE_SECRET_KEY=your-stripe-secret-key

# SendGrid
SENDGRID_API_KEY=your-sendgrid-key

# Instagram
INSTAGRAM_CLIENT_ID=your-instagram-client-id
INSTAGRAM_CLIENT_SECRET=your-instagram-client-secret

# Other API Keys
ANTHROPIC_API_KEY=your-anthropic-key
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
`;
    
    fs.writeFileSync('dist/.env.template', envTemplate);
    
    // Step 6: Create deployment README
    console.log('📚 Creating deployment README...');
    const deploymentReadme = `# VeeFore Production Deployment

## Quick Start

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Set up environment variables:
   \`\`\`bash
   cp .env.template .env
   # Edit .env with your actual values
   \`\`\`

3. Start the application:
   \`\`\`bash
   npm start
   \`\`\`

## Environment Variables

Copy \`.env.template\` to \`.env\` and fill in your actual values:

- \`DATABASE_URL\`: MongoDB connection string
- \`FIREBASE_*\`: Firebase authentication credentials
- \`OPENAI_API_KEY\`: OpenAI API key for AI features
- \`STRIPE_SECRET_KEY\`: Stripe payment processing
- \`SENDGRID_API_KEY\`: Email service
- \`INSTAGRAM_*\`: Instagram API credentials
- And more...

## Health Check

The application exposes a health check endpoint at \`/api/health\`.

## Port

The application runs on port 5000 by default.
`;
    
    fs.writeFileSync('dist/README.md', deploymentReadme);
    
    // Step 7: Verify build success
    console.log('✅ Verifying build...');
    const distFiles = fs.readdirSync('dist');
    console.log('📁 Build output files:');
    distFiles.forEach(file => {
      console.log(`  - ${file}`);
    });
    
    // Check if index.js exists
    if (!fs.existsSync('dist/index.js')) {
      throw new Error('Server build failed - index.js not found');
    }
    
    // Check if public directory exists
    if (!fs.existsSync('dist/public')) {
      throw new Error('Client build failed - public directory not found');
    }
    
    console.log('🎉 Production build completed successfully!');
    console.log('');
    console.log('📦 To deploy:');
    console.log('  1. Upload the dist/ directory to your server');
    console.log('  2. Install dependencies: npm install');
    console.log('  3. Set up environment variables');
    console.log('  4. Start the application: npm start');
    console.log('');
    console.log('🏥 Health check: http://localhost:5000/api/health');
    
  } catch (error) {
    console.error('❌ Production build failed:', error);
    process.exit(1);
  }
}

buildProduction();