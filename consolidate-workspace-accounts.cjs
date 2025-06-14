/**
 * Consolidate Workspace Accounts - Fix Multiple @arpit9996363 Accounts
 * 
 * This script consolidates duplicate Instagram accounts and ensures proper
 * workspace assignment to fix the metrics display issue.
 */

const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

// Social account schema
const socialAccountSchema = new mongoose.Schema({
  workspaceId: { type: mongoose.Schema.Types.Mixed, required: true },
  platform: { type: String, required: true },
  username: { type: String, required: true },
  followersCount: { type: Number, default: 0 },
  mediaCount: { type: Number, default: 0 },
  totalLikes: { type: Number, default: 0 },
  totalComments: { type: Number, default: 0 },
  totalReach: { type: Number, default: 0 },
  avgEngagement: { type: Number, default: 0 },
  accessToken: { type: String },
  refreshToken: { type: String },
  tokenExpiresAt: { type: Date },
  instagramUserId: { type: String },
  lastSyncAt: { type: Date },
  updatedAt: { type: Date, default: Date.now }
}, {
  collection: 'socialaccounts'
});

const SocialAccountModel = mongoose.model('SocialAccount', socialAccountSchema);

// Workspace schema
const workspaceSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  isDefault: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  collection: 'workspaces'
});

const WorkspaceModel = mongoose.model('Workspace', workspaceSchema);

async function consolidateWorkspaceAccounts() {
  try {
    console.log('🔧 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      dbName: 'veeforedb'
    });
    console.log('✅ Connected to MongoDB');

    // Find all @arpit9996363 Instagram accounts
    const arpitAccounts = await SocialAccountModel.find({
      username: 'arpit9996363',
      platform: 'instagram'
    });

    console.log(`📊 Found ${arpitAccounts.length} @arpit9996363 Instagram accounts`);

    if (arpitAccounts.length > 1) {
      // Keep the account with the most recent token data
      const primaryAccount = arpitAccounts.find(acc => acc.accessToken && acc.refreshToken) || arpitAccounts[0];
      const duplicateAccounts = arpitAccounts.filter(acc => acc._id.toString() !== primaryAccount._id.toString());

      console.log(`🎯 Primary account ID: ${primaryAccount._id}`);
      console.log(`🗑️ Removing ${duplicateAccounts.length} duplicate accounts...`);

      // Remove duplicate accounts
      for (const duplicate of duplicateAccounts) {
        console.log(`   → Removing duplicate: ${duplicate._id} (workspace: ${duplicate.workspaceId})`);
        await SocialAccountModel.deleteOne({ _id: duplicate._id });
      }

      // Ensure primary account is in the correct workspace (cvfbf)
      const cvfbfWorkspace = await WorkspaceModel.findOne({ name: 'cvfbf' });
      if (cvfbfWorkspace && primaryAccount.workspaceId !== cvfbfWorkspace._id.toString()) {
        console.log(`🔄 Moving primary account to cvfbf workspace: ${cvfbfWorkspace._id}`);
        await SocialAccountModel.updateOne(
          { _id: primaryAccount._id },
          { 
            workspaceId: cvfbfWorkspace._id.toString(),
            updatedAt: new Date()
          }
        );
      }
    }

    // Find all @rahulc1020 Instagram accounts
    const rahulAccounts = await SocialAccountModel.find({
      username: 'rahulc1020',
      platform: 'instagram'
    });

    console.log(`📊 Found ${rahulAccounts.length} @rahulc1020 Instagram accounts`);

    if (rahulAccounts.length > 1) {
      // Keep the account with the most recent token data
      const primaryRahulAccount = rahulAccounts.find(acc => acc.accessToken && acc.refreshToken) || rahulAccounts[0];
      const duplicateRahulAccounts = rahulAccounts.filter(acc => acc._id.toString() !== primaryRahulAccount._id.toString());

      console.log(`🎯 Primary Rahul account ID: ${primaryRahulAccount._id}`);
      console.log(`🗑️ Removing ${duplicateRahulAccounts.length} duplicate Rahul accounts...`);

      // Remove duplicate accounts
      for (const duplicate of duplicateRahulAccounts) {
        console.log(`   → Removing duplicate: ${duplicate._id} (workspace: ${duplicate.workspaceId})`);
        await SocialAccountModel.deleteOne({ _id: duplicate._id });
      }

      // Ensure primary account is in the correct workspace (My VeeFore Workspace)
      const myWorkspace = await WorkspaceModel.findOne({ 
        name: 'My VeeFore Workspace',
        _id: '684402c2fd2cd4eb6521b386'
      });
      
      if (myWorkspace && primaryRahulAccount.workspaceId !== myWorkspace._id.toString()) {
        console.log(`🔄 Moving primary Rahul account to My VeeFore Workspace: ${myWorkspace._id}`);
        await SocialAccountModel.updateOne(
          { _id: primaryRahulAccount._id },
          { 
            workspaceId: myWorkspace._id.toString(),
            updatedAt: new Date()
          }
        );
      }
    }

    // Verify final state
    console.log('\n📈 Final workspace state:');
    
    const finalCvfbfAccounts = await SocialAccountModel.find({ 
      workspaceId: { $regex: '68449f3852d33d75b31ce737' }
    });
    console.log(`cvfbf workspace: ${finalCvfbfAccounts.length} accounts`);
    finalCvfbfAccounts.forEach(acc => {
      console.log(`  • @${acc.username} (${acc.platform}) - ${acc.followersCount} followers`);
    });

    const finalMyWorkspaceAccounts = await SocialAccountModel.find({ 
      workspaceId: { $regex: '684402c2fd2cd4eb6521b386' }
    });
    console.log(`My VeeFore Workspace: ${finalMyWorkspaceAccounts.length} accounts`);
    finalMyWorkspaceAccounts.forEach(acc => {
      console.log(`  • @${acc.username} (${acc.platform}) - ${acc.followersCount} followers`);
    });

    console.log('\n🎯 Workspace account consolidation completed!');
    
  } catch (error) {
    console.error('❌ Error consolidating workspace accounts:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📤 Disconnected from MongoDB');
  }
}

consolidateWorkspaceAccounts();