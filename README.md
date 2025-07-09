# VeeFore - AI-Powered Social Media Management Platform

## 🚀 App Overview

**VeeFore** is a comprehensive AI-powered social media content intelligence platform designed to automate content creation, scheduling, and engagement across multiple social platforms. Built with a space-themed design, it features 15+ production-grade AI tools with a sophisticated subscription and credit-based access system.

**Target Users:**
- Content creators and influencers
- Social media managers
- Marketing agencies
- Brands and businesses
- Digital marketing professionals

## ✨ Features

### 🎨 AI Content Generation Suite (15+ Tools)
- **Creative Brief Generator** - AI-powered content strategy and planning
- **AI Image Generator** - DALL-E 3 integration for professional visuals
- **AI Thumbnail Maker Pro** - 7-stage professional YouTube thumbnail creation
- **Video Shortener AI** - Content optimization and editing
- **Content Repurposer** - Multi-platform content adaptation
- **Hashtag Generator** - Trending hashtag research and suggestions
- **Hook/CTA Generator** - Engaging content hooks and calls-to-action
- **Trend Intelligence Engine** - Real-time trend analysis and viral prediction
- **Viral Predictor AI** - Content viral potential scoring
- **Social Listening Engine** - Brand monitoring and sentiment analysis
- **Content Theft Detection** - Plagiarism detection with legal recommendations
- **Emotion Analysis AI** - Psychological content analysis using Plutchik's Wheel
- **ROI Calculator AI** - Campaign performance and ROI analysis
- **A/B Testing AI** - Data-driven testing strategies
- **Persona-Based Suggestions** - Brand persona analysis and content strategy

### 📱 Social Media Management
- **Multi-Platform Support** - Instagram, YouTube, Twitter/X, LinkedIn
- **Advanced Scheduler** - Timezone-aware content scheduling (IST to UTC)
- **Direct Publishing** - Real-time content posting with media optimization
- **Analytics Dashboard** - Real-time engagement metrics and insights
- **Auto-Sync Service** - Automatic follower and engagement data synchronization

### 🤖 Automation Engine
- **Auto DM Responses** - AI-powered contextual message replies
- **Auto Comment Management** - Intelligent comment moderation and responses
- **Rule-Based Triggers** - Custom automation rules with time restrictions
- **Anti-Spam Protection** - Smart spam detection and prevention
- **Conversation Memory** - Context-aware conversation tracking

### 💳 Subscription & Credit System
- **4-Tier Plans** - Free (₹0, 20 credits), Starter (₹699, 300 credits), Pro (₹1499, 1100 credits), Business (₹2199, 2000 credits)
- **Credit Packages** - Additional credit purchases (100-5000 credits)
- **Feature Access Control** - Plan-based feature restrictions and unlocking
- **Workspace Limits** - Scalable workspace management (1-8 workspaces)
- **Team Collaboration** - Member limits and role-based access

### 🏢 Team & Workspace Management
- **Multi-Workspace Support** - Organized project management
- **Team Invitations** - Collaborative workspace access
- **Role-Based Permissions** - Owner, admin, and member roles
- **Workspace Switching** - Seamless project navigation

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and optimized builds
- **Tailwind CSS** with shadcn/ui components
- **Framer Motion** for smooth animations
- **Wouter** for client-side routing
- **TanStack Query** for state management and caching
- **React Hook Form** with Zod validation

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **JWT Authentication** with Firebase Admin SDK
- **Multer** for file uploads
- **Sharp** for image processing
- **FFmpeg** for video processing

### AI Services
- **OpenAI GPT-4o** - Text generation and analysis
- **DALL-E 3** - Image generation
- **Google Gemini** - Additional AI capabilities
- **Anthropic Claude** - Advanced text analysis
- **TensorFlow.js** - Client-side ML processing

### Social Media APIs
- **Instagram Business API** - Content posting and analytics
- **YouTube Data API v3** - Video management and analytics
- **Twitter API v2** - Tweet posting and engagement
- **LinkedIn API** - Professional content sharing

### Payment & Email
- **Razorpay** - Payment gateway for Indian market
- **Stripe** - International payment processing
- **SendGrid** - Email delivery and verification
- **Nodemailer** - Email service integration

### Development Tools
- **ESBuild** - Fast bundling for production
- **Drizzle ORM** - Type-safe database operations
- **Zod** - Runtime type validation
- **Prettier** & **ESLint** - Code formatting and linting

## 📁 Folder Structure

```
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/            # Application pages/routes
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Client-side utilities
│   │   └── utils/            # Helper functions
│   ├── public/               # Static assets
│   └── index.html            # HTML template
├── server/                   # Backend Node.js application
│   ├── routes/               # API route handlers
│   ├── middleware/           # Express middleware
│   ├── public/               # Static file serving
│   ├── *-service.ts          # Business logic services
│   ├── *-ai.ts              # AI integration modules
│   ├── firebase-admin.ts     # Firebase Admin SDK setup
│   ├── mongodb-storage.ts    # MongoDB data layer
│   ├── pricing-config.ts     # Subscription configuration
│   └── index.ts             # Server entry point
├── shared/                   # Shared TypeScript types
│   └── schema.ts            # Database schema definitions
├── uploads/                  # File upload storage
├── drizzle.config.ts        # Database configuration
├── package.json             # Dependencies and scripts
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite build configuration
```

## 🔑 Environment Variables

### Backend Environment Variables (server/.env)
```bash
# MongoDB Database
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Firebase Authentication
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"..."}
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_APP_ID=your-firebase-app-id

# AI Services
OPENAI_API_KEY=sk-your-openai-api-key
GOOGLE_API_KEY=your-google-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key
RUNWAY_API_KEY=your-runway-api-key
PERPLEXITY_API_KEY=your-perplexity-api-key

# Social Media APIs
INSTAGRAM_ACCESS_TOKEN=your-instagram-access-token
INSTAGRAM_APP_ID=your-instagram-app-id
INSTAGRAM_APP_SECRET=your-instagram-app-secret
YOUTUBE_API_KEY=your-youtube-api-key
TWITTER_API_KEY=your-twitter-api-key
TWITTER_API_SECRET=your-twitter-api-secret
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret

# Payment Gateways
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
STRIPE_SECRET_KEY=sk_test_your_stripe_secret
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key

# Email Services
SENDGRID_API_KEY=SG.your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
NODEMAILER_USER=your-email@gmail.com
NODEMAILER_PASS=your-app-password

# Server Configuration
PORT=5000
NODE_ENV=development
JWT_SECRET=your-jwt-secret-key
SESSION_SECRET=your-session-secret-key

# Domain Configuration (for production)
DOMAIN=https://yourdomain.com
BASE_URL=https://yourdomain.com
```

### Frontend Environment Variables (client/.env)
```bash
# Firebase (client-side)
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
VITE_FIREBASE_APP_ID=your-firebase-app-id

# Payment (client-side)
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key

# API Configuration
VITE_API_URL=http://localhost:5000
```

## 🤖 AI Integrations

### OpenAI GPT-4o Integration
- **Implementation**: `server/ai-*.ts` files
- **Triggers**: Frontend buttons → Backend API routes → OpenAI API
- **Usage**: Content generation, trend analysis, creative briefs
- **Input**: User prompts, content data, brand information
- **Output**: Generated text, suggestions, analysis results
- **Credit Cost**: 3-8 credits per request

### DALL-E 3 Image Generation
- **Implementation**: `server/thumbnail-dalle-generator.ts`
- **Triggers**: AI Image Generator, Thumbnail Maker Pro
- **Usage**: Professional thumbnail creation, visual content
- **Input**: Text prompts, style preferences, dimensions
- **Output**: High-quality images (1024x1024, 1280x720)
- **Credit Cost**: 8 credits per image

### Google Gemini API
- **Implementation**: `server/content-recommendation-service.ts`
- **Triggers**: Content recommendations, trend analysis
- **Usage**: Content strategy suggestions, market analysis
- **Input**: Industry data, user preferences, content history
- **Output**: Personalized recommendations, trending topics
- **Credit Cost**: 4-6 credits per request

### Runway ML Video Generation
- **Implementation**: `server/runway-video-service.ts`
- **Triggers**: Video generation features (in development)
- **Usage**: AI-powered video creation and editing
- **Input**: Text prompts, style parameters, duration
- **Output**: Generated video files
- **Credit Cost**: 15-30 credits per video

## 📱 Social Media Integrations

### Instagram Business API
- **SDK**: Meta Graph API v18.0
- **Implementation**: `server/instagram-*.ts` files
- **OAuth Flow**: `server/instagram-oauth.ts`
- **Scopes**: `instagram_basic`, `instagram_content_publish`, `instagram_manage_messages`
- **Features**: Post creation, story publishing, DM automation, analytics
- **Webhook**: Real-time message processing at `/webhook/instagram`

### YouTube Data API v3
- **Implementation**: `server/youtube-service.ts`
- **OAuth Flow**: Google OAuth 2.0
- **Scopes**: `youtube.readonly`, `youtube.upload`, `youtube.force-ssl`
- **Features**: Video upload, channel analytics, comment management
- **API Calls**: Channel statistics, video metadata, subscriber data

### Twitter API v2
- **Implementation**: `server/twitter-service.ts` (in development)
- **OAuth Flow**: Twitter OAuth 2.0
- **Scopes**: `tweet.read`, `tweet.write`, `users.read`
- **Features**: Tweet posting, engagement analytics, trend monitoring

### LinkedIn API
- **Implementation**: `server/linkedin-service.ts` (in development)
- **OAuth Flow**: LinkedIn OAuth 2.0
- **Scopes**: `r_liteprofile`, `r_emailaddress`, `w_member_social`
- **Features**: Professional content sharing, network analytics

## 💳 Payment System

### Razorpay Integration (Primary)
- **Implementation**: `server/razorpay-service.ts`
- **Frontend**: `client/src/pages/Subscription.tsx`
- **Flow**: 
  1. Frontend calls `/api/razorpay/create-order`
  2. Backend creates Razorpay order
  3. Frontend opens Razorpay payment dialog
  4. Payment success triggers webhook
  5. Backend verifies payment signature
  6. Credits/subscription updated in database

### Stripe Integration (Secondary)
- **Implementation**: `server/stripe-service.ts`
- **Frontend**: `client/src/pages/Subscribe.tsx`
- **Webhooks**: Payment success, subscription updates
- **Features**: International payments, subscription management

### Payment Flow
```
User clicks "Purchase" → 
Frontend requests order creation → 
Backend creates payment order → 
Payment gateway processes → 
Webhook verification → 
Database updated → 
User receives credits/subscription
```

## 🎯 Credit & Subscription System

### Credit System
- **Free Plan**: 20 credits/month
- **Starter Plan**: 300 credits/month
- **Pro Plan**: 1100 credits/month
- **Business Plan**: 2000 credits/month
- **Additional Packages**: 100-5000 credits available for purchase

### Credit Usage
- **AI Image Generation**: 8 credits
- **Content Generation**: 3-6 credits
- **Video Processing**: 15-30 credits
- **Trend Analysis**: 4-5 credits
- **Social Media Publishing**: 2-3 credits

### Subscription Features
- **Free**: 1 social account, 1 workspace, basic AI tools
- **Starter**: 2 social accounts, full automation, 24 AI images/month
- **Pro**: 1 social account per workspace, 2 workspaces, 2 team members, advanced AI tools
- **Business**: 4 social accounts per workspace, unlimited workspaces (up to 8), 3 team members, full feature access

### Plan Enforcement
- **Implementation**: `server/plan-enforcement-middleware.ts`
- **Access Control**: Feature-based restrictions with upgrade prompts
- **Workspace Limits**: Automatic enforcement during creation
- **Team Limits**: Member invitation restrictions

## 🚀 Running the App Locally

### Prerequisites
- Node.js 18+ and npm
- MongoDB database (local or Atlas)
- Firebase project with Authentication enabled
- Required API keys (OpenAI, Razorpay, etc.)

### Step-by-Step Setup

1. **Clone the repository**
```bash
git clone <your-repository-url>
cd veefore
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Create .env file in the root directory
cp .env.example .env

# Edit .env with your actual API keys and configuration
nano .env
```

4. **Configure Firebase**
- Create a Firebase project at https://console.firebase.google.com
- Enable Authentication with Email/Password
- Generate a service account key
- Add the service account JSON to `FIREBASE_SERVICE_ACCOUNT_KEY`

5. **Set up MongoDB**
- Create a MongoDB Atlas cluster or use local MongoDB
- Create a database named `veeforedb`
- Add connection string to `DATABASE_URL`

6. **Configure payment gateways**
- Sign up for Razorpay (Indian market) or Stripe (international)
- Add test keys to environment variables
- Configure webhooks for payment processing

7. **Add AI service keys**
- OpenAI API key for GPT-4o and DALL-E 3
- Google API key for Gemini and YouTube
- Other AI service keys as needed

8. **Start the development server**
```bash
npm run dev
```

9. **Access the application**
- Frontend: http://localhost:5000
- Backend API: http://localhost:5000/api

### Build for Production
```bash
npm run build
npm run start
```

## 🌐 Deployment Recommendations

### Vercel Deployment
1. **Connect repository to Vercel**
2. **Set environment variables** in Vercel dashboard
3. **Configure build settings**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### Railway Deployment
1. **Connect GitHub repository**
2. **Add environment variables** in Railway dashboard
3. **Configure start command**: `npm run start`
4. **Set up domain** and SSL certificates

### Render Deployment
1. **Create new Web Service**
2. **Connect repository** and set environment variables
3. **Configure build and start commands**
4. **Set up database** and Redis (if needed)

### Environment Variables for Production
- Set `NODE_ENV=production`
- Use production API keys (remove `test_` prefixes)
- Configure production domain in `DOMAIN` and `BASE_URL`
- Set up proper CORS origins
- Configure webhook URLs for payment gateways

### Performance Optimizations
- Enable Redis for caching (optional)
- Set up CDN for static assets
- Configure rate limiting for API endpoints
- Set up monitoring and logging
- Configure auto-scaling for high traffic

## 📧 Email Configuration

### SendGrid Setup
- Create SendGrid account and verify domain
- Generate API key with mail send permissions
- Configure sender authentication
- Set up email templates for verification

### Nodemailer Backup
- Configure Gmail App Password or SMTP server
- Set up email templates and styling
- Configure rate limiting for email sending

## 🔐 Security Configuration

### Authentication
- Firebase Admin SDK for token verification
- JWT tokens for API authentication
- Session management with secure cookies
- Password hashing with bcrypt

### API Security
- Rate limiting on all endpoints
- Input validation with Zod schemas
- CORS configuration for production
- Helmet.js for security headers

### Data Protection
- Environment variable encryption
- Database connection security
- Payment data encryption
- User data anonymization options

## 📊 Monitoring & Analytics

### Application Monitoring
- Console logging with structured format
- Error tracking and alerting
- Performance metrics collection
- User activity analytics

### Database Monitoring
- MongoDB Atlas monitoring dashboard
- Query performance optimization
- Connection pool monitoring
- Backup and restore procedures

## 🧹 Cleanup Instructions for Cursor IDE Migration

### Files to Delete (Replit-specific)
```bash
# Remove these files when moving to Cursor IDE
rm -rf .replit
rm -rf .config/
rm -rf .nix/
rm -f replit.nix
rm -f .replit.nix

# Remove Replit-specific packages from package.json
# @replit/vite-plugin-cartographer
# @replit/vite-plugin-runtime-error-modal
```

### Code Changes Required
1. **Update port configuration**:
   - Change `const PORT = process.env.PORT || 5000` to `const PORT = 5000`
   - Remove Replit-specific domain logic

2. **Update Vite configuration**:
   - Remove `@replit/vite-plugin-cartographer` and `@replit/vite-plugin-runtime-error-modal`
   - Update `vite.config.ts` to remove Replit plugins

3. **Update package.json**:
   - Remove Replit-specific dependencies
   - Update scripts if needed for local development

### Setting Up in Cursor IDE
1. **Install Cursor IDE** from https://cursor.sh
2. **Open project** in Cursor IDE
3. **Install recommended extensions**:
   - TypeScript and JavaScript Language Features
   - Tailwind CSS IntelliSense
   - ES7+ React/Redux/React-Native snippets
   - Prettier - Code formatter
   - ESLint

4. **Configure workspace settings**:
   - Set up TypeScript path mapping
   - Configure Prettier formatting
   - Set up ESLint rules

5. **Set up debugging**:
   - Configure Node.js debugging for backend
   - Set up React debugging for frontend
   - Add breakpoints and debugging configuration

## 📄 License

MIT License - see LICENSE file for details

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🆘 Support

For support, email support@veefore.com or join our Discord community.

## 📞 Contact

- Website: https://veefore.com
- Email: contact@veefore.com
- Twitter: @VeeForeApp
- LinkedIn: /company/veefore

---

**Made with ❤️ by VEEFED TECHNOLOGIES PRIVATE LIMITED**