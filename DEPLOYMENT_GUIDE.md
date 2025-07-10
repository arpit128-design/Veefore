# VeeFore Deployment Guide

## Production Deployment Configuration

This guide provides complete instructions for deploying VeeFore to production environments after migrating from the Replit development environment.

### Prerequisites

- Node.js 18+
- MongoDB Atlas account and connection string
- All required API keys and environment variables
- Docker (optional, for containerized deployment)

### Environment Setup

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd veefore
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

   Essential variables:
   - `DATABASE_URL`: MongoDB connection string
   - `NODE_ENV=production`
   - `PORT=5000`
   - `OPENAI_API_KEY`: OpenAI API key
   - `SENDGRID_API_KEY`: SendGrid API key
   - `FIREBASE_*`: Firebase configuration
   - `INSTAGRAM_*`: Instagram API credentials
   - `STRIPE_*`: Payment processing keys

### Build Process

1. **Build the Application**
   ```bash
   npm run build
   ```

   This command:
   - Builds the client React application (`npm run build:client`)
   - Builds the server Express application (`npm run build:server`)
   - Creates production-ready files in `/dist` directory

2. **Verify Build**
   ```bash
   npm start
   ```

   The application should start on the configured port (default: 5000).

### Deployment Options

#### 1. Vercel Deployment

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

   Configuration is handled by `vercel.json`:
   - Routes API calls to serverless functions
   - Serves static files from `/dist/public`
   - Handles SPA routing

#### 2. Docker Deployment

1. **Build Docker Image**
   ```bash
   docker build -t veefore:latest .
   ```

2. **Run Container**
   ```bash
   docker run -p 5000:5000 --env-file .env veefore:latest
   ```

   The `Dockerfile` includes:
   - Multi-stage build for optimization
   - Production-only dependencies
   - Health check endpoint
   - Non-root user for security

#### 3. Traditional VPS Deployment

1. **Transfer Files**
   ```bash
   # Upload built application to server
   scp -r dist/ user@server:/path/to/app/
   scp -r node_modules/ user@server:/path/to/app/
   scp package.json user@server:/path/to/app/
   ```

2. **Start with Process Manager**
   ```bash
   # Using PM2
   pm2 start dist/index.js --name veefore
   pm2 save
   pm2 startup
   ```

### Production Considerations

#### 1. Server Configuration

The server is configured to handle both development and production environments:

- **Development**: Uses Vite dev server with HMR
- **Production**: Serves static files from `/dist/public`
- **Fallback**: Graceful degradation when Vite imports fail

#### 2. Database Connection

- Uses MongoDB Atlas with connection pooling
- Automatic reconnection on connection loss
- Proper error handling and logging

#### 3. API Security

- JWT token validation
- Rate limiting implementation
- Input validation on all endpoints
- CORS configuration for production domains

#### 4. Static File Serving

- Gzip compression enabled
- Cache headers for static assets
- SPA routing support for client-side navigation

### Health Monitoring

The application includes a health check endpoint at `/api/health` that returns:

```json
{
  "status": "healthy",
  "timestamp": "2025-07-10T12:38:23.000Z",
  "environment": "production",
  "uptime": 3600,
  "version": "1.0.0",
  "services": {
    "database": "connected",
    "server": "running"
  }
}
```

### Troubleshooting

#### Common Issues

1. **Vite Import Errors**
   - The server gracefully falls back to static file serving
   - Check console logs for Vite-related errors
   - Ensure `dist/public` directory exists after build

2. **Database Connection Issues**
   - Verify MongoDB Atlas connection string
   - Check IP whitelist settings
   - Ensure database user has proper permissions

3. **API Key Configuration**
   - Verify all required environment variables are set
   - Check API key permissions and quotas
   - Use secrets management for sensitive keys

#### Debugging Steps

1. **Check Application Logs**
   ```bash
   # Docker
   docker logs <container-id>
   
   # PM2
   pm2 logs veefore
   
   # Direct
   node dist/index.js
   ```

2. **Test Health Endpoint**
   ```bash
   curl https://your-domain.com/api/health
   ```

3. **Verify Database Connection**
   ```bash
   # Check MongoDB connection
   mongosh "your-connection-string"
   ```

### Performance Optimization

1. **Static Asset Optimization**
   - Images compressed and optimized
   - CSS/JS minification and bundling
   - CDN integration for media files

2. **Database Optimization**
   - Proper indexing on frequently queried fields
   - Connection pooling
   - Query optimization

3. **API Optimization**
   - Response caching for static data
   - Pagination for large datasets
   - Rate limiting to prevent abuse

### Security Checklist

- [ ] All API keys stored in environment variables
- [ ] HTTPS enforced in production
- [ ] CORS properly configured
- [ ] Input validation on all endpoints
- [ ] Rate limiting implemented
- [ ] Database access restricted by IP
- [ ] Authentication tokens properly validated
- [ ] Sensitive data encrypted at rest

### Post-Deployment Verification

1. **Functionality Testing**
   - User registration and authentication
   - Social media integrations
   - AI feature functionality
   - Payment processing

2. **Performance Testing**
   - Load testing with realistic traffic
   - Database performance monitoring
   - API response time analysis

3. **Security Testing**
   - API endpoint security audit
   - Authentication bypass testing
   - Input validation testing

### Support

For deployment issues:
1. Check the troubleshooting section above
2. Review application logs for specific error messages
3. Verify all environment variables are properly configured
4. Test individual API endpoints using the health check pattern

The application is designed to be production-ready with proper error handling, graceful degradation, and comprehensive monitoring capabilities.