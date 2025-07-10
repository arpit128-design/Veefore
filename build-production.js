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
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const execAsync = promisify(exec);

console.log('🚀 Starting VeeFore Production Build...');

async function buildProduction() {
  try {
    // Step 1: Clean previous build
    console.log('\n📁 Cleaning previous build...');
    if (fs.existsSync('dist')) {
      await execAsync('rm -rf dist');
    }
    
    // Step 2: Build client with Vite
    console.log('\n🔧 Building client with Vite...');
    await execAsync('npm run build', { cwd: 'client' });
    
    // Step 3: Create server build directory
    console.log('\n🏗️  Creating server build structure...');
    fs.mkdirSync('dist', { recursive: true });
    fs.mkdirSync('dist/server', { recursive: true });
    
    // Step 4: Build server with esbuild (excluding Vite)
    console.log('\n⚙️  Building server with esbuild...');
    
    const esbuildConfig = {
      entryPoints: ['server/index.ts'],
      bundle: true,
      platform: 'node',
      target: 'node18',
      outdir: 'dist/server',
      format: 'esm',
      sourcemap: true,
      external: [
        // Exclude Vite and development dependencies
        'vite',
        '@vitejs/plugin-react',
        '@replit/vite-plugin-cartographer',
        '@replit/vite-plugin-runtime-error-modal',
        'esbuild',
        // Keep Node.js modules external
        'fsevents',
        'lightningcss',
        'rollup'
      ],
      define: {
        'process.env.NODE_ENV': '"production"'
      },
      banner: {
        js: `
        import { createRequire } from 'module';
        const require = createRequire(import.meta.url);
        const __filename = new URL(import.meta.url).pathname;
        const __dirname = path.dirname(__filename);
        `
      }
    };
    
    // Use esbuild programmatically
    const esbuild = await import('esbuild');
    await esbuild.build(esbuildConfig);
    
    // Step 5: Copy necessary files
    console.log('\n📋 Copying configuration files...');
    
    // Copy package.json with production dependencies only
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const productionPackageJson = {
      name: packageJson.name,
      version: packageJson.version,
      type: "module",
      main: "server/index.js",
      scripts: {
        start: "node server/index.js"
      },
      dependencies: {
        // Only include production dependencies
        express: packageJson.dependencies.express,
        mongoose: packageJson.dependencies.mongoose,
        mongodb: packageJson.dependencies.mongodb,
        multer: packageJson.dependencies.multer,
        bcryptjs: packageJson.dependencies.bcryptjs,
        jsonwebtoken: packageJson.dependencies.jsonwebtoken,
        dotenv: packageJson.dependencies.dotenv,
        axios: packageJson.dependencies.axios,
        '@sendgrid/mail': packageJson.dependencies['@sendgrid/mail'],
        stripe: packageJson.dependencies.stripe,
        razorpay: packageJson.dependencies.razorpay,
        openai: packageJson.dependencies.openai,
        '@anthropic-ai/sdk': packageJson.dependencies['@anthropic-ai/sdk'],
        '@google/generative-ai': packageJson.dependencies['@google/generative-ai'],
        firebase: packageJson.dependencies.firebase,
        'firebase-admin': packageJson.dependencies['firebase-admin'],
        sharp: packageJson.dependencies.sharp,
        jimp: packageJson.dependencies.jimp,
        canvas: packageJson.dependencies.canvas,
        'fluent-ffmpeg': packageJson.dependencies['fluent-ffmpeg'],
        'ffmpeg-static': packageJson.dependencies['ffmpeg-static'],
        puppeteer: packageJson.dependencies.puppeteer,
        nodemailer: packageJson.dependencies.nodemailer,
        ws: packageJson.dependencies.ws
      }
    };
    
    fs.writeFileSync('dist/package.json', JSON.stringify(productionPackageJson, null, 2));
    
    // Copy other necessary files
    if (fs.existsSync('.env')) {
      fs.copyFileSync('.env', 'dist/.env');
    }
    
    // Create .env.example for deployment
    const envExample = `# VeeFore Production Environment Variables
NODE_ENV=production
PORT=5000

# Database
DATABASE_URL=mongodb://localhost:27017/veefore

# JWT
JWT_SECRET=your-jwt-secret-here

# Firebase
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY=your-firebase-private-key
FIREBASE_CLIENT_EMAIL=your-firebase-client-email

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Stripe
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# SendGrid
SENDGRID_API_KEY=your-sendgrid-api-key

# Instagram
INSTAGRAM_CLIENT_ID=your-instagram-client-id
INSTAGRAM_CLIENT_SECRET=your-instagram-client-secret

# Other APIs
ANTHROPIC_API_KEY=your-anthropic-api-key
GOOGLE_API_KEY=your-google-api-key
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
`;
    
    fs.writeFileSync('dist/.env.example', envExample);
    
    // Step 6: Create deployment scripts
    console.log('\n🔧 Creating deployment scripts...');
    
    // Docker deployment
    const dockerfile = `FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy built application
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \\
  CMD curl -f http://localhost:5000/api/health || exit 1

# Expose port
EXPOSE 5000

# Start application
CMD ["npm", "start"]
`;
    
    fs.writeFileSync('dist/Dockerfile', dockerfile);
    
    // Step 7: Create production validation script
    const validationScript = `#!/usr/bin/env node

/**
 * Production Deployment Validation
 * Validates that all required components are present for deployment
 */

import fs from 'fs';
import path from 'path';

console.log('🔍 Validating production build...');

const requiredFiles = [
  'package.json',
  'server/index.js',
  'public/index.html',
  '.env.example',
  'Dockerfile'
];

const requiredDirs = [
  'server',
  'public',
  'public/assets'
];

let isValid = true;

// Check required files
console.log('\\n📋 Checking required files...');
for (const file of requiredFiles) {
  if (fs.existsSync(file)) {
    console.log(\`✅ \${file}\`);
  } else {
    console.log(\`❌ \${file} - MISSING\`);
    isValid = false;
  }
}

// Check required directories
console.log('\\n📁 Checking required directories...');
for (const dir of requiredDirs) {
  if (fs.existsSync(dir)) {
    console.log(\`✅ \${dir}/\`);
  } else {
    console.log(\`❌ \${dir}/ - MISSING\`);
    isValid = false;
  }
}

// Check package.json structure
console.log('\\n📦 Validating package.json...');
try {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  if (pkg.scripts && pkg.scripts.start) {
    console.log('✅ Start script defined');
  } else {
    console.log('❌ Start script missing');
    isValid = false;
  }
  
  if (pkg.type === 'module') {
    console.log('✅ ESM modules configured');
  } else {
    console.log('❌ ESM modules not configured');
    isValid = false;
  }
  
} catch (error) {
  console.log('❌ Invalid package.json');
  isValid = false;
}

// Final validation
console.log('\\n🎯 Build Validation Result:');
if (isValid) {
  console.log('✅ Production build is valid and ready for deployment!');
  process.exit(0);
} else {
  console.log('❌ Production build has issues that need to be fixed');
  process.exit(1);
}
`;
    
    fs.writeFileSync('dist/validate-deployment.js', validationScript);
    fs.chmodSync('dist/validate-deployment.js', 0o755);
    
    // Step 8: Create startup script
    const startupScript = `#!/usr/bin/env node

/**
 * Production Startup Script
 * Handles environment setup and graceful server startup
 */

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
config();

console.log('🚀 Starting VeeFore in production mode...');
console.log('📍 Environment:', process.env.NODE_ENV || 'development');
console.log('🌐 Port:', process.env.PORT || 5000);

// Import and start the server
import('./server/index.js').then(() => {
  console.log('✅ VeeFore server started successfully');
}).catch((error) => {
  console.error('❌ Failed to start VeeFore server:', error);
  process.exit(1);
});
`;
    
    fs.writeFileSync('dist/start.js', startupScript);
    fs.chmodSync('dist/start.js', 0o755);
    
    console.log('\n✅ Production build completed successfully!');
    console.log('\n📦 Build output:');
    console.log('  - dist/package.json (production dependencies)');
    console.log('  - dist/server/index.js (bundled server)');
    console.log('  - dist/public/ (static assets)');
    console.log('  - dist/Dockerfile (container deployment)');
    console.log('  - dist/validate-deployment.js (validation script)');
    console.log('  - dist/start.js (production startup)');
    
    console.log('\n🚀 Next steps:');
    console.log('1. cd dist');
    console.log('2. npm install');
    console.log('3. node validate-deployment.js');
    console.log('4. node start.js');
    
    console.log('\n🐳 Docker deployment:');
    console.log('1. cd dist');
    console.log('2. docker build -t veefore .');
    console.log('3. docker run -p 5000:5000 veefore');
    
  } catch (error) {
    console.error('\n❌ Production build failed:', error);
    process.exit(1);
  }
}

buildProduction();