# VeeFore - AI-Powered Social Media Management Platform

## Overview

VeeFore is a comprehensive social media management platform that leverages AI to automate content creation, scheduling, and engagement across multiple social platforms. The system features a modern web interface built with React/TypeScript and a robust Node.js backend with MongoDB storage.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React hooks and context
- **Build Tool**: Vite for fast development and optimized builds
- **UI Components**: Custom component library with consistent design system

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Firebase Auth integration
- **Email Service**: SendGrid SMTP for email verification and notifications
- **File Storage**: Local file system with HTTP redirects to external CDN

### Data Storage Solutions
- **Primary Database**: MongoDB Atlas for user data, content, and configurations
- **Schema Design**: Flexible document-based storage with proper indexing
- **Data Models**: Users, Workspaces, Content, Social Accounts, Automation Rules
- **Backup Strategy**: MongoDB Atlas built-in backup and replication

## Key Components

### User Management System
- **Multi-tenant Architecture**: Workspace-based organization with team collaboration
- **Email Verification**: 6-digit OTP system with 15-minute expiry
- **Credit System**: Usage-based billing with transaction tracking
- **Role-based Access**: Owner, admin, and member roles with granular permissions

### Content Management
- **AI Content Generation**: Integration with AI services for automated content creation
- **Multi-platform Support**: Instagram, Facebook, Twitter, LinkedIn scheduling
- **Content Types**: Posts, Stories, Reels, and Videos with platform-specific optimization
- **Scheduling System**: Advanced timezone-aware scheduling with IST to UTC conversion

### Social Media Integration
- **Instagram Business API**: Direct integration for posting and analytics
- **OAuth Flow**: Secure platform authentication with token management
- **Webhook Processing**: Real-time message and interaction handling
- **Analytics Sync**: Automated engagement metrics and reach data collection

### Automation Engine
- **Rule-based Triggers**: DM automation, keyword responses, and scheduled actions
- **AI-powered Responses**: Contextual reply generation with personality settings
- **Time-based Restrictions**: IST timezone support with day/hour filtering
- **Duplicate Prevention**: Smart rule management to prevent conflicting automations

### Email Service
- **SMTP Configuration**: SendGrid integration for reliable email delivery
- **Template System**: Branded email templates for verification and notifications
- **OTP Generation**: Secure 6-digit verification codes with expiry tracking
- **Welcome Sequences**: Automated onboarding email flows

## Data Flow

### User Registration & Onboarding
1. User provides email and basic information
2. System generates unique username and creates user record
3. Email verification OTP sent via SendGrid
4. User verifies email and account is activated
5. Default workspace created with initial credits

### Content Creation & Publishing
1. User creates content through AI generation or manual input
2. Content saved to MongoDB with metadata and scheduling info
3. Scheduler service processes queued content at designated times
4. Instagram API publishes content with fallback strategies
5. Analytics data synced back to update engagement metrics

### DM Automation Workflow
1. Instagram webhook receives incoming message
2. System checks active automation rules for workspace
3. AI processes message context and generates appropriate response
4. Time and keyword restrictions validated before sending
5. Response delivered through Instagram API with tracking

## External Dependencies

### Third-party Services
- **MongoDB Atlas**: Cloud database hosting and management
- **SendGrid**: Email delivery service for verification and notifications
- **Instagram Business API**: Social media posting and messaging
- **Firebase**: Authentication and user session management
- **Runway ML**: AI video generation capabilities (in development)

### Development Tools
- **Drizzle Kit**: Database migration and schema management
- **shadcn/ui**: Pre-built UI component library
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: Type-safe development environment

## Deployment Strategy

### Production Environment
- **Platform**: Replit hosting with automatic deployment
- **Database**: MongoDB Atlas cluster with connection pooling
- **File Serving**: HTTP redirects to external CDN for media files
- **Environment Variables**: Secure configuration for API keys and secrets

### Development Workflow
- **Local Development**: MongoDB connection with hot reloading
- **Database Migrations**: Automated schema updates via Drizzle
- **Testing**: Manual testing with real Instagram API integration
- **Monitoring**: Console logging and error tracking

## Changelog

- July 01, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.