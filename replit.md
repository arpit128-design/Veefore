# VeeFore - AI-Powered Social Media Management Platform

## Overview

VeeFore is a comprehensive social media management platform that leverages AI to automate content creation, scheduling, and audience engagement. The platform supports multiple social media platforms with a focus on Instagram, providing features like automated posting, DM automation, analytics, and team collaboration.

## System Architecture

### Backend Architecture
- **Runtime**: Node.js 20 with Express.js framework
- **Database**: MongoDB with Mongoose ODM
- **Storage**: MongoDB Atlas for data persistence
- **Authentication**: Firebase Authentication for user management
- **Email Service**: SendGrid for transactional emails and verification
- **Payment Processing**: Stripe/Razorpay integration for subscriptions and add-ons

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Components**: Shadcn/ui component library
- **Styling**: Tailwind CSS with custom theming
- **State Management**: React hooks and context for local state

### Database Design
- **Primary Database**: MongoDB with collections for users, workspaces, content, social accounts, automation rules, and analytics
- **Schema**: Flexible document-based structure supporting multi-tenant workspaces
- **Indexing**: Optimized queries for user-workspace relationships and content scheduling

## Key Components

### 1. User Management & Authentication
- Firebase-based authentication with email verification
- Multi-tier subscription system (Free, Pro plans)
- Credit-based usage tracking
- Referral system with earning mechanisms

### 2. Workspace Management
- Multi-workspace support for organizing different brands/projects
- Team collaboration with role-based permissions
- Workspace-specific social account connections
- Credit allocation and usage tracking per workspace

### 3. Social Media Integration
- **Instagram**: Business API integration for posting, story publishing, and DM automation
- **Platform Support**: Extensible architecture for additional platforms
- **OAuth Flow**: Secure token management with refresh mechanisms
- **Rate Limiting**: API quota management and intelligent retry logic

### 4. Content Management
- AI-powered content generation using OpenAI GPT models
- Multi-format support (posts, stories, reels, videos)
- Content scheduling with timezone-aware processing
- Media file handling and storage optimization

### 5. Automation Engine
- Rule-based automation for DMs, comments, and engagement
- Time-based scheduling with IST/UTC conversion
- Webhook processing for real-time Instagram events
- Conditional logic for personalized responses

### 6. Analytics & Reporting
- Engagement metrics tracking (likes, comments, reach)
- Performance analytics per workspace and account
- Credit usage monitoring and transaction history
- Team member activity tracking

## Data Flow

### Content Publishing Flow
1. User creates content via AI generation or manual input
2. Content is validated and media URLs are processed
3. Scheduling service queues content for future publishing
4. Publishing service handles platform-specific API calls
5. Success/failure status is tracked and reported

### Automation Flow
1. Instagram webhooks trigger incoming messages/events
2. Automation engine evaluates active rules and conditions
3. AI personality generates contextual responses
4. Responses are sent via Instagram API with rate limiting
5. Conversation history is maintained for context

### Authentication Flow
1. User registers/logs in via Firebase Authentication
2. User profile is created/updated in MongoDB
3. Default workspace is created automatically
4. Email verification process ensures account security
5. JWT tokens are issued for API access

## External Dependencies

### Core Services
- **Firebase**: User authentication and session management
- **SendGrid**: Email delivery service for notifications and verification
- **OpenAI**: AI model for content generation and automation responses
- **Instagram Business API**: Social media posting and messaging
- **Stripe/Razorpay**: Payment processing for subscriptions

### Development Tools
- **MongoDB Atlas**: Cloud database hosting
- **Replit**: Development environment and hosting
- **ffmpeg**: Media processing for video content
- **yt-dlp**: Video download and processing utilities

### Third-party Integrations
- **Runway ML**: AI video generation capabilities
- **Media APIs**: Stock photo and video services
- **Analytics APIs**: Enhanced metrics and reporting

## Deployment Strategy

### Development Environment
- Replit-based development with hot reloading
- PostgreSQL 16 and Node.js 20 modules configured
- Environment variables managed through Replit secrets
- Port 5000 for backend API, external port 80

### Production Deployment
- Autoscale deployment target for dynamic resource allocation
- Build process: `npm run build` for optimization
- Start command: `npm run start` for production serving
- Health checks on designated ports

### Database Strategy
- MongoDB Atlas for production data persistence
- Connection pooling and retry logic for reliability
- Regular backups and data export capabilities
- Migration scripts for schema updates

## Changelog

```
Changelog:
- June 24, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```

## Technical Notes

### Known Issues & Fixes
- **Timezone Conversion**: IST to UTC conversion implemented for accurate scheduling
- **Instagram Publishing**: Adaptive publishing system with multiple fallback strategies
- **Duplicate Data**: Cleanup scripts available for removing mock data and duplicates
- **Credit System**: Direct MongoDB operations for credit management and transactions

### Security Considerations
- JWT token validation on all API endpoints
- Environment variable encryption for sensitive data
- Rate limiting on authentication endpoints
- Input validation and sanitization throughout

### Performance Optimizations
- Database indexing on frequently queried fields
- Lazy loading for large content collections
- Caching for frequently accessed user data
- Efficient media URL handling and redirects