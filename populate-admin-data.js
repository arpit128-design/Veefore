import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.DATABASE_URL;
if (!uri) {
  console.error('DATABASE_URL not found');
  process.exit(1);
}

// Define simple schemas for this script
const ContentSchema = new mongoose.Schema({
  title: String,
  description: String,
  type: String,
  platform: String,
  status: String,
  workspaceId: Number,
  scheduledFor: Date,
  caption: String,
  createdAt: { type: Date, default: Date.now }
});

const NotificationSchema = new mongoose.Schema({
  title: String,
  message: String,
  type: String,
  isActive: Boolean,
  targetUsers: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const ContentModel = mongoose.model('Content', ContentSchema);
const NotificationModel = mongoose.model('Notification', NotificationSchema);

async function populateAdminData() {
  try {
    await mongoose.connect(uri);
    console.log('[ADMIN DATA] Connected to MongoDB');
    
    // Create sample notifications
    const notifications = [
      {
        title: 'System Maintenance Scheduled',
        message: 'Platform maintenance will occur on Sunday 2AM-4AM EST',
        type: 'maintenance',
        isActive: true,
        targetUsers: 'all',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'New Feature: Advanced Analytics',
        message: 'Enhanced analytics dashboard with real-time insights now available',
        type: 'announcement',
        isActive: true,
        targetUsers: 'premium',
        createdAt: new Date(Date.now() - 86400000),
        updatedAt: new Date(Date.now() - 86400000)
      },
      {
        title: 'Security Alert',
        message: 'Suspicious login attempts detected. Please verify your account',
        type: 'alert',
        isActive: false,
        targetUsers: 'affected',
        createdAt: new Date(Date.now() - 172800000),
        updatedAt: new Date(Date.now() - 172800000)
      }
    ];
    
    // Insert notifications
    const notifResult = await db.collection('notifications').insertMany(notifications);
    console.log(`[ADMIN DATA] Created ${notifResult.insertedCount} notifications`);
    
    // Create sample content entries
    const content = [
      {
        title: 'Instagram Post: Tech Trends 2025',
        description: 'AI-generated content about emerging technology trends',
        type: 'post',
        platform: 'instagram',
        status: 'published',
        workspaceId: 1,
        createdAt: new Date(),
        scheduledFor: null,
        caption: 'Exploring the future of technology #TechTrends #AI #Innovation'
      },
      {
        title: 'LinkedIn Article: Business Growth',
        description: 'Professional article about business scaling strategies',
        type: 'article',
        platform: 'linkedin',
        status: 'scheduled',
        workspaceId: 2,
        createdAt: new Date(Date.now() - 3600000),
        scheduledFor: new Date(Date.now() + 86400000),
        caption: 'Key strategies for sustainable business growth in 2025'
      },
      {
        title: 'Twitter Thread: Marketing Tips',
        description: 'Thread about digital marketing best practices',
        type: 'thread',
        platform: 'twitter',
        status: 'draft',
        workspaceId: 1,
        createdAt: new Date(Date.now() - 7200000),
        scheduledFor: null,
        caption: 'Essential marketing tips every startup should know'
      },
      {
        title: 'YouTube Short: Product Demo',
        description: 'Short video demonstrating platform features',
        type: 'video',
        platform: 'youtube',
        status: 'published',
        workspaceId: 3,
        createdAt: new Date(Date.now() - 10800000),
        scheduledFor: null,
        caption: 'Quick demo of our latest features #ProductDemo #SaaS'
      }
    ];
    
    // Insert content
    const contentResult = await db.collection('content').insertMany(content);
    console.log(`[ADMIN DATA] Created ${contentResult.insertedCount} content items`);
    
    // Update user collection to ensure we have sample users
    const users = await db.collection('users').find({}).toArray();
    console.log(`[ADMIN DATA] Found ${users.length} existing users`);
    
    if (users.length === 0) {
      const sampleUsers = [
        {
          username: 'demo_user_1',
          email: 'demo1@veefore.com',
          displayName: 'Demo User One',
          plan: 'premium',
          credits: 150,
          lastLogin: new Date(),
          isActive: true,
          createdAt: new Date(Date.now() - 2592000000), // 30 days ago
          firebaseUid: 'demo_uid_1'
        },
        {
          username: 'demo_user_2',
          email: 'demo2@veefore.com',
          displayName: 'Demo User Two',
          plan: 'free',
          credits: 25,
          lastLogin: new Date(Date.now() - 86400000), // 1 day ago
          isActive: true,
          createdAt: new Date(Date.now() - 1296000000), // 15 days ago
          firebaseUid: 'demo_uid_2'
        },
        {
          username: 'demo_user_3',
          email: 'demo3@veefore.com',
          displayName: 'Demo User Three',
          plan: 'business',
          credits: 500,
          lastLogin: new Date(Date.now() - 604800000), // 7 days ago
          isActive: true,
          createdAt: new Date(Date.now() - 5184000000), // 60 days ago
          firebaseUid: 'demo_uid_3'
        }
      ];
      
      const userResult = await db.collection('users').insertMany(sampleUsers);
      console.log(`[ADMIN DATA] Created ${userResult.insertedCount} sample users`);
    }
    
    console.log('[ADMIN DATA] Successfully populated admin panel data');
    
  } catch (error) {
    console.error('[ADMIN DATA] Error:', error);
  } finally {
    await client.close();
  }
}

populateAdminData();