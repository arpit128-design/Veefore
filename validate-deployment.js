#!/usr/bin/env node

/**
 * Deployment Validation Script
 * Tests the production-ready configuration of VeeFore
 */

import { spawn } from 'child_process';
import { existsSync } from 'fs';
import http from 'http';

console.log('🚀 VeeFore Deployment Validation\n');

const tests = [
  {
    name: 'Environment Variables',
    test: () => {
      const required = ['DATABASE_URL', 'NODE_ENV'];
      const missing = required.filter(env => !process.env[env]);
      if (missing.length > 0) {
        throw new Error(`Missing environment variables: ${missing.join(', ')}`);
      }
      return '✅ Environment variables configured';
    }
  },
  {
    name: 'Build Directory',
    test: () => {
      if (!existsSync('./dist')) {
        throw new Error('Build directory ./dist not found. Run "npm run build" first.');
      }
      return '✅ Build directory exists';
    }
  },
  {
    name: 'Server Health Check',
    test: async () => {
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Server health check timed out'));
        }, 5000);

        http.get('http://localhost:5000/api/health', (res) => {
          clearTimeout(timeout);
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            try {
              const health = JSON.parse(data);
              if (health.status === 'healthy') {
                resolve('✅ Server health check passed');
              } else {
                reject(new Error(`Health check failed: ${health.status}`));
              }
            } catch (error) {
              reject(new Error('Invalid health check response'));
            }
          });
        }).on('error', (error) => {
          clearTimeout(timeout);
          reject(new Error(`Health check request failed: ${error.message}`));
        });
      });
    }
  },
  {
    name: 'Production Configuration',
    test: () => {
      // Check if production fallbacks are working
      const checks = [
        'vercel.json exists',
        'Dockerfile exists',
        '.dockerignore exists',
        'DEPLOYMENT_GUIDE.md exists'
      ];
      
      const files = [
        './vercel.json',
        './Dockerfile', 
        './.dockerignore',
        './DEPLOYMENT_GUIDE.md'
      ];
      
      const missing = files.filter(file => !existsSync(file));
      if (missing.length > 0) {
        throw new Error(`Missing deployment files: ${missing.join(', ')}`);
      }
      
      return '✅ Production configuration files present';
    }
  }
];

async function runValidation() {
  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      console.log(`Running: ${test.name}...`);
      const result = await test.test();
      console.log(result);
      passed++;
    } catch (error) {
      console.error(`❌ ${test.name}: ${error.message}`);
      failed++;
    }
    console.log('');
  }

  console.log(`\n📊 Validation Results:`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  
  if (failed === 0) {
    console.log('\n🎉 VeeFore is ready for production deployment!');
    console.log('\nNext steps:');
    console.log('1. Run "npm run build" to create production build');
    console.log('2. Deploy using one of the configured methods:');
    console.log('   - Vercel: "vercel --prod"');
    console.log('   - Docker: "docker build -t veefore ."');
    console.log('   - VPS: Follow DEPLOYMENT_GUIDE.md');
    process.exit(0);
  } else {
    console.log('\n⚠️  Please fix the failing tests before deployment.');
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Validation interrupted');
  process.exit(1);
});

runValidation().catch(error => {
  console.error('\n💥 Validation script error:', error.message);
  process.exit(1);
});