/**
 * Complete Database Reset - Remove All Users and Account Data
 * This script completely clears all user accounts and related data for a fresh start
 */

const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGODB_URI = 'mongodb+srv://veeforeuser:veeforepassword@veeforecluster.j8pko.mongodb.net/veeforedb?retryWrites=true&w=majority';
const DATABASE_NAME = 'veeforedb';

async function completeReset() {
  console.log('🔄 Starting complete database reset...');
  
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db(DATABASE_NAME);
    
    // Get all collections
    const collections = await db.listCollections().toArray();
    console.log(`📋 Found ${collections.length} collections`);
    
    // Collections to completely clear
    const collectionsToReset = [
      'users',
      'social_accounts', 
      'workspaces',
      'content',
      'scheduled_content',
      'conversations',
      'messages',
      'automation_rules',
      'notifications',
      'transactions',
      'subscriptions',
      'team_members',
      'team_invitations',
      'referrals',
      'waitlist_users',
      'early_access_users',
      'user_sessions',
      'email_verifications',
      'password_resets',
      'api_keys',
      'webhooks',
      'analytics',
      'content_analytics',
      'ai_generations',
      'thumbnail_generations',
      'roi_calculations',
      'ab_tests',
      'social_listening',
      'content_theft_reports',
      'emotion_analyses',
      'persona_suggestions',
      'legal_documents',
      'affiliate_links',
      'trend_analyses',
      'competitor_analyses',
      'gamification_data',
      'user_preferences',
      'workspace_settings',
      'integration_tokens',
      'upload_metadata'
    ];
    
    let totalDeleted = 0;
    
    // Reset each collection
    for (const collectionName of collectionsToReset) {
      try {
        const collection = db.collection(collectionName);
        const result = await collection.deleteMany({});
        console.log(`🗑️  Cleared ${collectionName}: ${result.deletedCount} documents`);
        totalDeleted += result.deletedCount;
      } catch (error) {
        console.log(`⚠️  Collection ${collectionName} not found or error: ${error.message}`);
      }
    }
    
    // Reset admin users but keep one default admin
    try {
      const adminCollection = db.collection('admin_users');
      await adminCollection.deleteMany({});
      
      // Create default admin user
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await adminCollection.insertOne({
        username: 'admin',
        email: 'admin@veefore.com',
        password: hashedPassword,
        role: 'superadmin',
        isActive: true,
        createdAt: new Date(),
        lastLogin: null
      });
      
      console.log('👤 Reset admin users and created default admin');
    } catch (error) {
      console.log(`⚠️  Admin reset error: ${error.message}`);
    }
    
    // Clear any cached data or temporary files
    console.log('\n🧹 Clearing additional data...');
    
    // Reset sequences/counters if they exist
    try {
      const countersCollection = db.collection('counters');
      await countersCollection.deleteMany({});
      console.log('🔢 Reset counters');
    } catch (error) {
      console.log('⚠️  No counters to reset');
    }
    
    // Reset any logs or temporary data
    try {
      const logsCollection = db.collection('logs');
      await logsCollection.deleteMany({});
      console.log('📝 Cleared logs');
    } catch (error) {
      console.log('⚠️  No logs to clear');
    }
    
    console.log(`\n✅ COMPLETE RESET FINISHED`);
    console.log(`📊 Total documents deleted: ${totalDeleted}`);
    console.log(`🔄 Database is now clean and ready for new users`);
    console.log(`👤 Default admin login: admin@veefore.com / admin123`);
    
  } catch (error) {
    console.error('❌ Reset failed:', error);
  } finally {
    await client.close();
    console.log('🔌 Database connection closed');
  }
}

// Execute the reset
completeReset().catch(console.error);