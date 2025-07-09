# 🚀 VeeFore Vercel Deployment Guide

## 📋 Prerequisites

- Vercel account connected to your GitHub repository
- MongoDB Atlas database
- Firebase project with Authentication enabled
- Required API keys (OpenAI, Razorpay, etc.)

## 🔧 Project Structure for Vercel

```
veefore/
├── client/          # React frontend
│   ├── src/
│   ├── dist/        # Build output
│   ├── package.json
│   └── vite.config.ts
├── server/          # Node.js backend
│   ├── src/
│   ├── dist/        # Build output
│   └── package.json
├── shared/          # Shared TypeScript types
├── vercel.json      # Vercel configuration
└── package.json     # Root package.json
```

## ⚙️ Vercel Configuration

### 1. Build Settings

**Build Command:**
```bash
npm run build:client
```

**Output Directory:**
```
client/dist
```

**Install Command:**
```bash
npm install && cd client && npm install && cd ../server && npm install
```

**Root Directory:**
```
./
```

### 2. Environment Variables

Add these in your Vercel dashboard:

**Client Environment Variables:**
```bash
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
VITE_FIREBASE_APP_ID=your-firebase-app-id
VITE_RAZORPAY_KEY_ID=rzp_live_your_key_id
VITE_STRIPE_PUBLIC_KEY=pk_live_your_stripe_public_key
VITE_API_URL=https://your-vercel-app.vercel.app
```

**Server Environment Variables:**
```bash
NODE_ENV=production
DATABASE_URL=mongodb+srv://...
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
OPENAI_API_KEY=sk-your-openai-api-key
RAZORPAY_KEY_ID=rzp_live_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
SENDGRID_API_KEY=SG.your-sendgrid-api-key
JWT_SECRET=your-production-jwt-secret
```

### 3. Function Configuration

**Maximum Duration:** 30 seconds
**Memory:** 1024 MB
**Runtime:** Node.js 18.x

## 🚀 Deployment Steps

### 1. Connect Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Select "Framework Preset": Other

### 2. Configure Build Settings

```json
{
  "buildCommand": "npm run build:client",
  "outputDirectory": "client/dist",
  "installCommand": "npm install && cd client && npm install && cd ../server && npm install",
  "devCommand": "npm run dev:client"
}
```

### 3. Add Environment Variables

Navigate to Project Settings → Environment Variables and add all required variables.

### 4. Deploy

Click "Deploy" and Vercel will:
1. Install dependencies
2. Build the client-side React app
3. Deploy the static frontend
4. Configure serverless functions for the API

## 🔄 API Routes Configuration

Vercel will automatically handle API routes through the `vercel.json` configuration:

```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/server/src/index.ts"
    }
  ]
}
```

## 📱 Testing Your Deployment

1. **Frontend Test:**
   ```
   https://your-app.vercel.app/
   ```

2. **API Health Check:**
   ```
   https://your-app.vercel.app/api/health
   ```

3. **Authentication Test:**
   ```
   https://your-app.vercel.app/api/user
   ```

## 🔧 Performance Optimization

### 1. Enable Caching
```bash
# Add to vercel.json
"headers": [
  {
    "source": "/(.*)",
    "headers": [
      {
        "key": "Cache-Control",
        "value": "public, max-age=31536000, immutable"
      }
    ]
  }
]
```

### 2. Optimize Images
```bash
# Enable Vercel Image Optimization
"images": {
  "domains": ["your-domain.com"],
  "formats": ["image/webp", "image/avif"]
}
```

### 3. Bundle Analysis
```bash
# Run bundle analyzer
npm run build:client -- --analyze
```

## 🚨 Common Issues & Solutions

### 1. Build Timeouts
- **Problem:** Build takes too long
- **Solution:** Optimize dependencies and use `npm ci` instead of `npm install`

### 2. Memory Issues
- **Problem:** Out of memory during build
- **Solution:** Increase Vercel function memory to 1024MB

### 3. API Route 404s
- **Problem:** API routes not found
- **Solution:** Ensure `vercel.json` routing is correct

### 4. Environment Variables
- **Problem:** Variables not loading
- **Solution:** Check variable names have `VITE_` prefix for client-side

## 📊 Monitoring & Analytics

### 1. Vercel Analytics
```bash
# Add to client/package.json
"@vercel/analytics": "^1.0.0"
```

### 2. Error Tracking
```bash
# Add Sentry for error tracking
"@sentry/nextjs": "^7.0.0"
```

### 3. Performance Monitoring
```bash
# Add Web Vitals tracking
"web-vitals": "^3.0.0"
```

## 🔒 Security Configuration

### 1. Content Security Policy
```javascript
// Add to vercel.json
"headers": [
  {
    "source": "/(.*)",
    "headers": [
      {
        "key": "Content-Security-Policy",
        "value": "default-src 'self'; script-src 'self' 'unsafe-inline';"
      }
    ]
  }
]
```

### 2. HTTPS Redirect
```javascript
// Automatic with Vercel
"redirects": [
  {
    "source": "/(.*)",
    "destination": "https://your-domain.com/$1",
    "permanent": true
  }
]
```

## 🎯 Production Checklist

- [ ] All environment variables configured
- [ ] Database connection tested
- [ ] Firebase authentication working
- [ ] Payment gateway integration tested
- [ ] Email service configured
- [ ] Domain configured (if custom)
- [ ] SSL certificate active
- [ ] Error tracking enabled
- [ ] Performance monitoring enabled
- [ ] Backup strategy in place

## 🆘 Troubleshooting

### Build Errors
```bash
# Check build logs in Vercel dashboard
# Common fixes:
npm run clean
npm run build:client
```

### Runtime Errors
```bash
# Check function logs in Vercel
# Enable debug logging:
DEBUG=* npm start
```

### Database Issues
```bash
# Test MongoDB connection
# Check whitelist IPs in MongoDB Atlas
```

## 📞 Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- [VeeFore Support](mailto:support@veefore.com)

---

**🎉 Congratulations! Your VeeFore application is now deployed on Vercel with optimal performance and scalability.**