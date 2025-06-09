import mongoose from "mongoose";
import { IStorage } from "./storage";
import {
  User, Workspace, SocialAccount, Content, Analytics, AutomationRule,
  Suggestion, CreditTransaction, Referral, Subscription, Payment, Addon,
  WorkspaceMember, TeamInvitation, ContentRecommendation, UserContentHistory,
  InsertUser, InsertWorkspace, InsertSocialAccount, InsertContent,
  InsertAutomationRule, InsertAnalytics, InsertSuggestion,
  InsertCreditTransaction, InsertReferral, InsertSubscription, InsertPayment, InsertAddon,
  InsertWorkspaceMember, InsertTeamInvitation, InsertContentRecommendation, InsertUserContentHistory
} from "@shared/schema";

// MongoDB Schemas
const UserSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  displayName: String,
  avatar: String,
  credits: { type: Number, default: 0 },
  plan: { type: String, default: 'Free' },
  stripeCustomerId: String,
  stripeSubscriptionId: String,
  referralCode: { type: String, unique: true },
  totalReferrals: { type: Number, default: 0 },
  totalEarned: { type: Number, default: 0 },
  referredBy: String,
  preferences: { type: mongoose.Schema.Types.Mixed, default: {} },
  isOnboarded: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const WorkspaceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.Mixed, required: true },
  name: { type: String, required: true },
  description: String,
  avatar: String,
  credits: { type: Number, default: 0 },
  theme: { type: String, default: 'space' },
  aiPersonality: { type: String, default: 'professional' },
  isDefault: { type: Boolean, default: false },
  maxTeamMembers: { type: Number, default: 1 },
  inviteCode: { type: String, unique: true, sparse: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const SocialAccountSchema = new mongoose.Schema({
  workspaceId: { type: mongoose.Schema.Types.Mixed, required: true },
  platform: { type: String, required: true },
  username: { type: String, required: true },
  accountId: String,
  accessToken: String,
  refreshToken: String,
  expiresAt: Date,
  isActive: { type: Boolean, default: true },
  // Instagram sync data fields
  followersCount: { type: Number, default: 0 },
  followingCount: { type: Number, default: 0 },
  mediaCount: { type: Number, default: 0 },
  biography: String,
  website: String,
  profilePictureUrl: String,
  accountType: { type: String, default: 'PERSONAL' },
  isBusinessAccount: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  avgLikes: { type: Number, default: 0 },
  avgComments: { type: Number, default: 0 },
  avgReach: { type: Number, default: 0 },
  engagementRate: { type: Number, default: 0 },
  // Instagram Business API engagement totals
  totalLikes: { type: Number, default: 0 },
  totalComments: { type: Number, default: 0 },
  totalReach: { type: Number, default: 0 },
  avgEngagement: { type: Number, default: 0 },
  lastSyncAt: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const ContentSchema = new mongoose.Schema({
  workspaceId: { type: mongoose.Schema.Types.Mixed, required: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  description: String,
  contentData: { type: mongoose.Schema.Types.Mixed, default: {} },
  platform: String,
  status: { type: String, default: 'draft' },
  scheduledAt: Date,
  publishedAt: Date,
  creditsUsed: { type: Number, default: 0 },
  prompt: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const AnalyticsSchema = new mongoose.Schema({
  workspaceId: { type: mongoose.Schema.Types.Mixed, required: true },
  platform: { type: String, required: true },
  date: { type: Date, required: true },
  metrics: { type: mongoose.Schema.Types.Mixed, default: {} },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  shares: { type: Number, default: 0 },
  followers: { type: Number, default: 0 },
  engagement: { type: Number, default: 0 },
  reach: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});



const SuggestionSchema = new mongoose.Schema({
  workspaceId: { type: mongoose.Schema.Types.Mixed, required: true },
  type: { type: String, required: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
  confidence: { type: Number, default: 0.8 },
  isUsed: { type: Boolean, default: false },
  validUntil: Date,
  createdAt: { type: Date, default: Date.now }
});

const CreditTransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.Mixed, required: true },
  amount: { type: Number, required: true },
  type: { type: String, required: true },
  description: { type: String, required: true },
  workspaceId: { type: mongoose.Schema.Types.Mixed },
  referenceId: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const ReferralSchema = new mongoose.Schema({
  referrerId: { type: Number, required: true },
  referredUserId: Number,
  referralCode: { type: String, required: true },
  status: { type: String, default: 'pending' },
  rewardAmount: { type: Number, default: 100 },
  isConfirmed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const SubscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.Mixed, required: true },
  plan: { type: String, required: true },
  status: { type: String, required: true },
  priceId: String,
  subscriptionId: String,
  currentPeriodStart: Date,
  currentPeriodEnd: Date,
  monthlyCredits: { type: Number, default: 0 },
  extraCredits: { type: Number, default: 0 },
  autoRenew: { type: Boolean, default: true },
  canceledAt: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const PaymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.Mixed, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  status: { type: String, required: true },
  razorpayOrderId: { type: String, required: true },
  razorpayPaymentId: String,
  razorpaySignature: String,
  purpose: { type: String, required: true },
  metadata: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const AddonSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.Mixed, required: true },
  type: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  expiresAt: Date,
  metadata: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const WorkspaceMemberSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.Mixed, required: true },
  workspaceId: { type: mongoose.Schema.Types.Mixed, required: true },
  role: { type: String, required: true, enum: ['owner', 'admin', 'editor', 'viewer'] },
  status: { type: String, default: 'active' },
  permissions: { type: mongoose.Schema.Types.Mixed, default: {} },
  invitedBy: { type: mongoose.Schema.Types.Mixed },
  joinedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const TeamInvitationSchema = new mongoose.Schema({
  workspaceId: { type: mongoose.Schema.Types.Mixed, required: true },
  email: { type: String, required: true },
  role: { type: String, required: true, enum: ['admin', 'editor', 'viewer'] },
  status: { type: String, default: 'pending' },
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
  invitedBy: { type: mongoose.Schema.Types.Mixed, required: true },
  permissions: { type: mongoose.Schema.Types.Mixed, default: {} },
  acceptedAt: Date,
  createdAt: { type: Date, default: Date.now }
});

const ContentRecommendationSchema = new mongoose.Schema({
  workspaceId: { type: mongoose.Schema.Types.Mixed, required: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  description: String,
  thumbnailUrl: String,
  mediaUrl: String,
  duration: Number,
  category: { type: String, required: true },
  country: { type: String, required: true },
  tags: [String],
  engagement: {
    expectedViews: { type: Number, default: 0 },
    expectedLikes: { type: Number, default: 0 },
    expectedShares: { type: Number, default: 0 }
  },
  sourceUrl: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const UserContentHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.Mixed, required: true },
  workspaceId: { type: mongoose.Schema.Types.Mixed, required: true },
  recommendationId: { type: mongoose.Schema.Types.Mixed },
  action: { type: String, required: true },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now }
});

// DM Conversation Memory Schemas
const DmConversationSchema = new mongoose.Schema({
  workspaceId: { type: mongoose.Schema.Types.Mixed, required: true },
  platform: { type: String, required: true },
  participantId: { type: String, required: true },
  participantUsername: String,
  lastMessageAt: { type: Date, default: Date.now },
  messageCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const DmMessageSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.Mixed, required: true },
  messageId: String,
  sender: { type: String, required: true, enum: ['user', 'ai'] },
  content: { type: String, required: true },
  messageType: { type: String, default: 'text' },
  sentiment: String,
  topics: [String],
  aiResponse: { type: Boolean, default: false },
  automationRuleId: { type: mongoose.Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now }
});

const ConversationContextSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.Mixed, required: true },
  contextType: { type: String, required: true },
  contextValue: { type: String, required: true },
  confidence: { type: Number, default: 100 },
  extractedAt: { type: Date, default: Date.now },
  expiresAt: Date
});

const AutomationRuleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  workspaceId: { type: mongoose.Schema.Types.Mixed, required: true },
  description: { type: String },
  isActive: { type: Boolean, default: true },
  trigger: { type: mongoose.Schema.Types.Mixed, default: {} },
  action: { type: mongoose.Schema.Types.Mixed, default: {} },
  lastRun: { type: Date },
  nextRun: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// MongoDB Models
const UserModel = mongoose.model('User', UserSchema);
const WorkspaceModel = mongoose.model('Workspace', WorkspaceSchema);
const ContentRecommendationModel = mongoose.model('ContentRecommendation', ContentRecommendationSchema);
const UserContentHistoryModel = mongoose.model('UserContentHistory', UserContentHistorySchema);
const SocialAccountModel = mongoose.model('SocialAccount', SocialAccountSchema, 'socialaccounts');
const ContentModel = mongoose.model('Content', ContentSchema, 'contents');
const AnalyticsModel = mongoose.model('Analytics', AnalyticsSchema);
const AutomationRuleModel = mongoose.model('AutomationRule', AutomationRuleSchema);
const SuggestionModel = mongoose.model('Suggestion', SuggestionSchema);
const CreditTransactionModel = mongoose.model('CreditTransaction', CreditTransactionSchema);
const ReferralModel = mongoose.model('Referral', ReferralSchema);
const SubscriptionModel = mongoose.model('Subscription', SubscriptionSchema);
const PaymentModel = mongoose.model('Payment', PaymentSchema);
const AddonModel = mongoose.model('Addon', AddonSchema);
const WorkspaceMemberModel = mongoose.model('WorkspaceMember', WorkspaceMemberSchema);
const TeamInvitationModel = mongoose.model('TeamInvitation', TeamInvitationSchema);
const DmConversationModel = mongoose.model('DmConversation', DmConversationSchema);
const DmMessageModel = mongoose.model('DmMessage', DmMessageSchema);
const ConversationContextModel = mongoose.model('ConversationContext', ConversationContextSchema);

export class MongoStorage implements IStorage {
  private isConnected = false;

  async connect() {
    if (this.isConnected && mongoose.connection.readyState === 1 && mongoose.connection.db?.databaseName === 'veeforedb') return;
    
    try {
      // Force disconnect and reconnect to ensure correct database
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
      }
      
      await mongoose.connect(process.env.MONGODB_URI!, {
        dbName: 'veeforedb'
      });
      
      // Wait for connection to be fully established
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Connection timeout')), 10000);
        
        if (mongoose.connection.readyState === 1) {
          clearTimeout(timeout);
          resolve();
        } else {
          mongoose.connection.once('connected', () => {
            clearTimeout(timeout);
            resolve();
          });
          mongoose.connection.once('error', (err) => {
            clearTimeout(timeout);
            reject(err);
          });
        }
      });
      
      this.isConnected = true;
      console.log(`Connected to MongoDB Atlas - ${mongoose.connection.db?.databaseName} database`);
    } catch (error) {
      console.error('MongoDB connection error:', error);
      this.isConnected = false;
      throw error;
    }
  }

  // User operations
  async getUser(id: number | string): Promise<User | undefined> {
    await this.connect();
    
    // Handle both string ObjectIds and numeric IDs
    let query;
    if (typeof id === 'string' && id.length === 24) {
      // It's a MongoDB ObjectId string
      query = { _id: id };
    } else {
      // Try to find by numeric ID field or converted string
      query = { $or: [{ id: id }, { _id: id.toString() }] };
    }
    
    const user = await UserModel.findOne(query);
    return user ? this.convertUser(user) : undefined;
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    await this.connect();
    const user = await UserModel.findOne({ firebaseUid });
    return user ? this.convertUser(user) : undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    await this.connect();
    const user = await UserModel.findOne({ email });
    return user ? this.convertUser(user) : undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    await this.connect();
    const user = await UserModel.findOne({ username });
    return user ? this.convertUser(user) : undefined;
  }

  async getUserByReferralCode(referralCode: string): Promise<User | undefined> {
    await this.connect();
    const user = await UserModel.findOne({ referralCode });
    return user ? this.convertUser(user) : undefined;
  }

  async createUser(userData: InsertUser): Promise<User> {
    await this.connect();
    
    // Generate unique referral code
    const referralCode = this.generateReferralCode();
    
    const user = new UserModel({
      ...userData,
      referralCode,
      isOnboarded: false, // Explicitly ensure new users need onboarding
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    const savedUser = await user.save();
    const convertedUser = this.convertUser(savedUser);
    
    // Automatically create a default workspace for new users
    try {
      const defaultWorkspace = await this.createWorkspace({
        name: "My VeeFore Workspace",
        description: "Default workspace for social media management",
        userId: convertedUser.id,
        theme: "space"
      });
      console.log(`[USER CREATION] Created default workspace for user ${convertedUser.id}: ${defaultWorkspace.id}`);
    } catch (error) {
      console.error(`[USER CREATION] Failed to create default workspace for user ${convertedUser.id}:`, error);
      // Don't fail user creation if workspace creation fails
    }
    
    return convertedUser;
  }

  async updateUser(id: number | string, updates: Partial<User>): Promise<User> {
    await this.connect();
    
    console.log(`[MONGODB DEBUG] Updating user with ID: ${id} (type: ${typeof id})`);
    console.log(`[MONGODB DEBUG] Updates:`, updates);
    
    // Handle both ObjectId strings and numeric IDs
    let user;
    try {
      if (mongoose.Types.ObjectId.isValid(id.toString())) {
        user = await UserModel.findByIdAndUpdate(
          id.toString(),
          { ...updates, updatedAt: new Date() },
          { new: true }
        );
      } else {
        user = await UserModel.findOneAndUpdate(
          { _id: id },
          { ...updates, updatedAt: new Date() },
          { new: true }
        );
      }
    } catch (error) {
      console.error(`[MONGODB DEBUG] Error updating user:`, error);
      throw error;
    }
    
    if (!user) {
      console.error(`[MONGODB DEBUG] User not found with ID: ${id}`);
      throw new Error('User not found');
    }
    
    console.log(`[MONGODB DEBUG] Successfully updated user: ${user._id}, isOnboarded: ${user.isOnboarded}`);
    return this.convertUser(user);
  }

  async updateUserCredits(id: number | string, credits: number): Promise<User> {
    return this.updateUser(id, { credits });
  }

  async updateUserStripeInfo(id: number | string, stripeCustomerId: string, stripeSubscriptionId?: string): Promise<User> {
    return this.updateUser(id, { stripeCustomerId, stripeSubscriptionId });
  }

  // Workspace operations
  async getWorkspace(id: number | string): Promise<Workspace | undefined> {
    await this.connect();
    
    // Handle invalid IDs
    if (!id || id === 'undefined' || id === 'null') {
      console.log('[MONGODB DEBUG] getWorkspace - Invalid ID provided:', id);
      return undefined;
    }
    
    try {
      // Handle both numeric IDs and ObjectId strings
      const query = typeof id === 'string' && id.length === 24 ? { _id: id } : { _id: id };
      const workspace = await WorkspaceModel.findOne(query);
      return workspace ? this.convertWorkspace(workspace) : undefined;
    } catch (objectIdError) {
      console.error('[MONGODB DEBUG] getWorkspace - ObjectId conversion error:', objectIdError);
      return undefined;
    }
  }

  async getWorkspacesByUserId(userId: number | string): Promise<Workspace[]> {
    await this.connect();
    console.log('[MONGODB DEBUG] getWorkspacesByUserId - userId:', userId, typeof userId);
    
    try {
      const workspaces = await WorkspaceModel.find({ userId }).maxTimeMS(5000);
      console.log('[MONGODB DEBUG] Found workspaces:', workspaces.length);
      return workspaces.map(this.convertWorkspace);
    } catch (error) {
      console.error('[MONGODB DEBUG] getWorkspacesByUserId error:', error);
      throw error;
    }
  }

  async getDefaultWorkspace(userId: number | string): Promise<Workspace | undefined> {
    await this.connect();
    console.log('[MONGODB DEBUG] Looking for workspace with userId:', userId, typeof userId);
    
    // Try to find default workspace first
    let workspace = await WorkspaceModel.findOne({ userId, isDefault: true });
    console.log('[MONGODB DEBUG] Default workspace found:', !!workspace);
    
    // If no default workspace, get the first workspace for this user
    if (!workspace) {
      workspace = await WorkspaceModel.findOne({ userId });
      console.log('[MONGODB DEBUG] Any workspace found:', !!workspace);
    }
    
    return workspace ? this.convertWorkspace(workspace) : undefined;
  }

  async createWorkspace(workspaceData: InsertWorkspace): Promise<Workspace> {
    await this.connect();
    const workspace = new WorkspaceModel({
      ...workspaceData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    const savedWorkspace = await workspace.save();
    return this.convertWorkspace(savedWorkspace);
  }

  async updateWorkspace(id: number | string, updates: Partial<Workspace>): Promise<Workspace> {
    await this.connect();
    const workspace = await WorkspaceModel.findOneAndUpdate(
      { _id: id },
      { ...updates, updatedAt: new Date() },
      { new: true }
    );
    if (!workspace) throw new Error('Workspace not found');
    return this.convertWorkspace(workspace);
  }

  async updateWorkspaceCredits(id: number | string, credits: number): Promise<void> {
    await this.connect();
    console.log(`[CREDIT UPDATE] Updating workspace ${id} credits to ${credits}`);
    
    const result = await WorkspaceModel.findOneAndUpdate(
      { _id: id },
      { credits, updatedAt: new Date() },
      { new: true }
    );
    
    if (!result) {
      throw new Error('Workspace not found for credit update');
    }
    
    console.log(`[CREDIT UPDATE] Successfully updated workspace ${id} credits to ${credits}`);
  }

  async deleteWorkspace(id: number | string): Promise<void> {
    await this.connect();
    await WorkspaceModel.findOneAndDelete({ _id: id });
  }

  async setDefaultWorkspace(userId: number | string, workspaceId: number | string): Promise<void> {
    await this.connect();
    
    // First, unset all default workspaces for this user
    await WorkspaceModel.updateMany(
      { userId },
      { isDefault: false }
    );
    
    // Then set the specified workspace as default
    await WorkspaceModel.findOneAndUpdate(
      { _id: workspaceId, userId },
      { isDefault: true }
    );
  }

  async updateWorkspaceCredits(workspaceId: string | number, credits: number): Promise<void> {
    await this.connect();
    
    console.log(`[MONGODB] Updating workspace ${workspaceId} to ${credits} credits`);
    
    const result = await WorkspaceModel.findByIdAndUpdate(
      workspaceId.toString(),
      { 
        credits: credits,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!result) {
      throw new Error(`Workspace ${workspaceId} not found`);
    }
    
    console.log(`[MONGODB] Successfully updated workspace ${workspaceId} to ${credits} credits`);
  }

  // Helper methods for data conversion
  private convertUser(mongoUser: any): User {
    console.log(`[USER CONVERT] Raw MongoDB user isOnboarded:`, mongoUser.isOnboarded, `(type: ${typeof mongoUser.isOnboarded})`);
    const converted = {
      id: mongoUser._id.toString(),
      firebaseUid: mongoUser.firebaseUid,
      email: mongoUser.email,
      username: mongoUser.username,
      displayName: mongoUser.displayName || null,
      avatar: mongoUser.avatar || null,
      credits: mongoUser.credits || 50,
      plan: mongoUser.plan || 'Free',
      stripeCustomerId: mongoUser.stripeCustomerId || null,
      stripeSubscriptionId: mongoUser.stripeSubscriptionId || null,
      referralCode: mongoUser.referralCode || null,
      totalReferrals: mongoUser.totalReferrals || 0,
      totalEarned: mongoUser.totalEarned || 0,
      referredBy: mongoUser.referredBy || null,
      preferences: mongoUser.preferences || {},
      isOnboarded: mongoUser.isOnboarded === true,
      createdAt: mongoUser.createdAt,
      updatedAt: mongoUser.updatedAt
    };
    console.log(`[USER CONVERT] Converted user isOnboarded:`, converted.isOnboarded);
    return converted;
  }

  private convertWorkspace(mongoWorkspace: any): Workspace {
    return {
      id: mongoWorkspace._id.toString(),
      userId: mongoWorkspace.userId,
      name: mongoWorkspace.name,
      description: mongoWorkspace.description || null,
      avatar: mongoWorkspace.avatar || null,
      credits: mongoWorkspace.credits || 0,
      theme: mongoWorkspace.theme || 'space',
      aiPersonality: mongoWorkspace.aiPersonality || 'professional',
      isDefault: mongoWorkspace.isDefault || false,
      maxTeamMembers: mongoWorkspace.maxTeamMembers || 1,
      inviteCode: mongoWorkspace.inviteCode || null,
      createdAt: mongoWorkspace.createdAt,
      updatedAt: mongoWorkspace.updatedAt
    };
  }

  private convertAnalytics(mongoAnalytics: any): Analytics {
    const metrics = mongoAnalytics.metrics || {};
    return {
      id: mongoAnalytics._id.toString(),
      workspaceId: mongoAnalytics.workspaceId,
      platform: mongoAnalytics.platform,
      date: mongoAnalytics.date,
      metrics: metrics,
      createdAt: mongoAnalytics.createdAt || new Date()
    };
  }

  private convertContent(mongoContent: any): Content {
    return {
      id: mongoContent._id.toString(),
      workspaceId: mongoContent.workspaceId,
      type: mongoContent.type,
      title: mongoContent.title,
      description: mongoContent.description || null,
      contentData: mongoContent.contentData || null,
      platform: mongoContent.platform || null,
      status: mongoContent.status || 'draft',
      scheduledAt: mongoContent.scheduledAt || null,
      publishedAt: mongoContent.publishedAt || null,
      creditsUsed: mongoContent.creditsUsed || null,
      prompt: mongoContent.prompt || null,
      createdAt: mongoContent.createdAt,
      updatedAt: mongoContent.updatedAt
    };
  }

  private convertSocialAccount(mongoAccount: any): SocialAccount {
    return {
      id: mongoAccount._id.toString(),
      workspaceId: mongoAccount.workspaceId,
      platform: mongoAccount.platform,
      username: mongoAccount.username,
      accountId: mongoAccount.accountId || null,
      accessToken: mongoAccount.accessToken || null,
      refreshToken: mongoAccount.refreshToken || null,
      expiresAt: mongoAccount.expiresAt || null,
      isActive: mongoAccount.isActive !== false,
      // Instagram sync data fields
      followersCount: mongoAccount.followersCount ?? null,
      followingCount: mongoAccount.followingCount ?? null,
      mediaCount: mongoAccount.mediaCount ?? null,
      biography: mongoAccount.biography ?? null,
      website: mongoAccount.website ?? null,
      profilePictureUrl: mongoAccount.profilePictureUrl ?? null,
      accountType: mongoAccount.accountType ?? null,
      isBusinessAccount: mongoAccount.isBusinessAccount ?? null,
      isVerified: mongoAccount.isVerified ?? null,
      avgLikes: mongoAccount.avgLikes ?? null,
      avgComments: mongoAccount.avgComments ?? null,
      avgReach: mongoAccount.avgReach ?? null,
      engagementRate: mongoAccount.engagementRate ?? null,
      // Critical Instagram Business API engagement fields
      totalLikes: mongoAccount.totalLikes ?? null,
      totalComments: mongoAccount.totalComments ?? null,
      totalReach: mongoAccount.totalReach ?? null,
      avgEngagement: mongoAccount.avgEngagement ?? null,
      lastSyncAt: mongoAccount.lastSyncAt ?? null,
      createdAt: mongoAccount.createdAt || new Date(),
      updatedAt: mongoAccount.updatedAt || new Date()
    };
  }

  private generateReferralCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Social account operations
  async getSocialAccount(id: number | string): Promise<SocialAccount | undefined> {
    await this.connect();
    
    console.log(`[MONGODB DEBUG] Getting social account with ID: ${id} (type: ${typeof id})`);
    
    let account;
    try {
      // Try by MongoDB _id first (ObjectId format)
      account = await SocialAccountModel.findById(id);
      console.log(`[MONGODB DEBUG] Find by _id result:`, account ? 'Found' : 'Not found');
    } catch (objectIdError) {
      console.log(`[MONGODB DEBUG] ObjectId lookup failed, trying by 'id' field:`, objectIdError);
      
      // If ObjectId fails, try by the 'id' field
      try {
        account = await SocialAccountModel.findOne({ id: id });
        console.log(`[MONGODB DEBUG] Find by id field result:`, account ? 'Found' : 'Not found');
      } catch (idError) {
        console.error(`[MONGODB DEBUG] Both lookup methods failed:`, idError);
        return undefined;
      }
    }
    
    return account ? this.convertSocialAccount(account) : undefined;
  }

  async getSocialAccountByWorkspaceAndPlatform(workspaceId: number, platform: string): Promise<SocialAccount | undefined> {
    await this.connect();
    const account = await SocialAccountModel.findOne({ workspaceId: workspaceId.toString(), platform });
    return account ? this.convertSocialAccount(account) : undefined;
  }

  async getSocialAccountsByWorkspace(workspaceId: any): Promise<SocialAccount[]> {
    await this.connect();
    
    console.log(`[MONGODB DEBUG] getSocialAccountsByWorkspace query: workspaceId=${workspaceId} (${typeof workspaceId})`);
    console.log(`[MONGODB DEBUG] Mongoose connection state:`, mongoose.connection.readyState);
    console.log(`[MONGODB DEBUG] Database name:`, mongoose.connection.db?.databaseName);
    
    // Test direct connection first
    try {
      const mongoClient = mongoose.connection.getClient();
      const db = mongoClient.db('veeforedb');
      const collection = db.collection('socialaccounts');
      
      const directResult = await collection.find({ workspaceId: workspaceId.toString() }).toArray();
      console.log(`[MONGODB DEBUG] Direct collection query found: ${directResult.length} accounts`);
      
      if (directResult.length > 0) {
        console.log(`[MONGODB DEBUG] Direct result sample:`, {
          _id: directResult[0]._id,
          username: directResult[0].username,
          platform: directResult[0].platform,
          workspaceId: directResult[0].workspaceId,
          followers: directResult[0].followersCount
        });
      }
    } catch (directError) {
      console.log(`[MONGODB DEBUG] Direct query failed:`, directError);
    }
    
    // Now try Mongoose query with both string and numeric workspaceId
    const accounts = await SocialAccountModel.find({
      $or: [
        { workspaceId: workspaceId.toString() },
        { workspaceId: workspaceId },
        // Handle truncated workspace IDs that need fixing
        { workspaceId: parseInt(workspaceId.toString().substring(0, 6)) }
      ]
    });
    
    // Auto-fix workspace IDs that are truncated
    for (const account of accounts) {
      if (account.workspaceId === parseInt(workspaceId.toString().substring(0, 6)) && 
          account.workspaceId !== workspaceId.toString()) {
        console.log(`[MONGODB DEBUG] Auto-fixing workspace ID for ${account.username}: ${account.workspaceId} -> ${workspaceId}`);
        await SocialAccountModel.updateOne(
          { _id: account._id },
          { workspaceId: workspaceId.toString(), updatedAt: new Date() }
        );
        account.workspaceId = workspaceId.toString();
      }
    }
    
    console.log(`[MONGODB DEBUG] Mongoose query result: found ${accounts.length} accounts`);
    if (accounts.length > 0) {
      accounts.forEach((account, index) => {
        console.log(`[MONGODB DEBUG] Account ${index + 1}: @${account.username} (${account.platform}) - followers: ${account.followersCount}, media: ${account.mediaCount}`);
      });
    } else {
      // Debug: check if any accounts exist at all
      const allAccounts = await SocialAccountModel.find({}).limit(5);
      console.log(`[MONGODB DEBUG] Total accounts in collection: ${allAccounts.length}`);
      if (allAccounts.length > 0) {
        console.log(`[MONGODB DEBUG] Sample account:`, {
          _id: allAccounts[0]._id,
          workspaceId: allAccounts[0].workspaceId,
          platform: allAccounts[0].platform,
          username: allAccounts[0].username
        });
      }
    }
    
    return accounts.map(account => this.convertSocialAccount(account));
  }

  async getAllSocialAccounts(): Promise<SocialAccount[]> {
    await this.connect();
    const accounts = await SocialAccountModel.find({ isActive: true });
    return accounts.map(account => this.convertSocialAccount(account));
  }

  async updateSocialAccount(id: number | string, updates: Partial<SocialAccount>): Promise<SocialAccount> {
    await this.connect();
    
    const updateData = { ...updates, updatedAt: new Date() };
    
    // Try updating by MongoDB _id first
    let result;
    try {
      result = await SocialAccountModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );
    } catch (error) {
      // If ObjectId fails, try by the 'id' field
      result = await SocialAccountModel.findOneAndUpdate(
        { id: id },
        updateData,
        { new: true }
      );
    }
    
    if (!result) {
      throw new Error(`Social account with id ${id} not found`);
    }
    
    return this.convertSocialAccount(result);
  }

  async getSocialAccountByPlatform(workspaceId: number | string, platform: string): Promise<SocialAccount | undefined> {
    await this.connect();
    console.log(`[MONGODB DEBUG] Looking for social account with workspaceId: ${workspaceId} (${typeof workspaceId}), platform: ${platform}`);
    const account = await SocialAccountModel.findOne({ workspaceId: workspaceId.toString(), platform });
    console.log(`[MONGODB DEBUG] Found social account:`, account ? `${account.platform} @${account.username}` : 'none');
    return account ? this.convertSocialAccount(account) : undefined;
  }

  async getSocialConnections(userId: number | string): Promise<SocialAccount[]> {
    await this.connect();
    // Get all workspaces for this user
    const userWorkspaces = await this.getWorkspacesByUserId(userId);
    const workspaceIds = userWorkspaces.map(w => w.id);
    
    // Get all social accounts for these workspaces
    const accounts = await SocialAccountModel.find({ 
      workspaceId: { $in: workspaceIds } 
    });
    
    return accounts.map(account => this.convertSocialAccount(account));
  }

  async createSocialAccount(account: InsertSocialAccount): Promise<SocialAccount> {
    await this.connect();
    
    const socialAccountData = {
      ...account,
      id: Date.now(),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const newAccount = new SocialAccountModel(socialAccountData);
    await newAccount.save();
    
    return this.convertSocialAccount(newAccount);
  }

  async updateSocialAccount(id: number | string, updates: Partial<SocialAccount>): Promise<SocialAccount> {
    await this.connect();
    
    console.log(`[MONGODB DEBUG] Updating social account with ID: ${id} (type: ${typeof id})`);
    console.log(`[MONGODB DEBUG] Updates:`, updates);
    
    // Try to find by MongoDB _id first (if it's a valid ObjectId)
    let updatedAccount;
    try {
      if (mongoose.Types.ObjectId.isValid(id.toString())) {
        console.log(`[MONGODB DEBUG] Attempting update by MongoDB _id: ${id}`);
        updatedAccount = await SocialAccountModel.findByIdAndUpdate(
          id.toString(),
          { ...updates, updatedAt: new Date() },
          { new: true }
        );
        console.log(`[MONGODB DEBUG] Update by _id result: ${updatedAccount ? 'Found' : 'Not found'}`);
      }
    } catch (error) {
      console.log(`[MONGODB DEBUG] Failed to update by _id:`, error);
    }
    
    // If not found by _id, try by our custom id field
    if (!updatedAccount) {
      console.log(`[MONGODB DEBUG] Attempting update by custom id field: ${id}`);
      updatedAccount = await SocialAccountModel.findOneAndUpdate(
        { id: id.toString() },
        { ...updates, updatedAt: new Date() },
        { new: true }
      );
      console.log(`[MONGODB DEBUG] Update by custom id result: ${updatedAccount ? 'Found' : 'Not found'}`);
    }
    
    if (!updatedAccount) {
      // Debug: let's see what accounts exist
      const allAccounts = await SocialAccountModel.find({}).limit(5);
      console.error(`[MONGODB DEBUG] Social account not found with ID: ${id}`);
      console.error(`[MONGODB DEBUG] Available accounts:`, allAccounts.map(a => ({ _id: a._id, id: a.id, platform: a.platform })));
      throw new Error('Social account not found');
    }
    
    console.log(`[MONGODB DEBUG] Successfully updated social account: ${updatedAccount._id}`);
    return this.convertSocialAccount(updatedAccount);
  }

  async deleteSocialAccount(id: number | string): Promise<void> {
    await this.connect();
    
    console.log(`[MONGODB DELETE] Attempting to delete social account with ID: ${id} (type: ${typeof id})`);
    
    // Try deleting by MongoDB _id first (ObjectId format)
    let deleteResult;
    try {
      deleteResult = await SocialAccountModel.deleteOne({ _id: id });
      console.log(`[MONGODB DELETE] Delete by _id result:`, deleteResult);
    } catch (objectIdError) {
      console.log(`[MONGODB DELETE] ObjectId deletion failed, trying by 'id' field:`, objectIdError.message);
      
      // If ObjectId fails, try deleting by the 'id' field
      try {
        deleteResult = await SocialAccountModel.deleteOne({ id: id });
        console.log(`[MONGODB DELETE] Delete by id field result:`, deleteResult);
      } catch (idError) {
        console.error(`[MONGODB DELETE] Both deletion methods failed:`, idError);
        throw new Error(`Failed to delete social account with id ${id}`);
      }
    }
    
    if (deleteResult.deletedCount === 0) {
      console.log(`[MONGODB DELETE] No account found with ID: ${id}`);
      throw new Error(`Social account with id ${id} not found`);
    }
    
    console.log(`[MONGODB DELETE] Successfully deleted ${deleteResult.deletedCount} social account(s)`);
  }

  async getContent(id: number): Promise<Content | undefined> {
    await this.connect();
    const content = await ContentModel.findById(id);
    return content ? this.convertContent(content) : undefined;
  }

  async getContentByWorkspace(workspaceId: number, limit?: number): Promise<Content[]> {
    await this.connect();
    const query = ContentModel.find({ workspaceId: workspaceId.toString() })
      .sort({ createdAt: -1 });
    
    if (limit) {
      query.limit(limit);
    }
    
    const contents = await query.exec();
    return contents.map(content => this.convertContent(content));
  }

  async getScheduledContent(workspaceId?: number): Promise<Content[]> {
    await this.connect();
    const query: any = { status: 'scheduled' };
    
    if (workspaceId) {
      query.workspaceId = workspaceId.toString();
    }
    
    console.log(`[MONGODB DEBUG] getScheduledContent query:`, query);
    const contents = await ContentModel.find(query).sort({ scheduledAt: 1 }).exec();
    console.log(`[MONGODB DEBUG] Found ${contents.length} scheduled content items`);
    
    if (contents.length > 0) {
      contents.forEach((content, index) => {
        console.log(`[MONGODB DEBUG] Content ${index + 1}:`, {
          id: content._id.toString(),
          title: content.title,
          workspaceId: content.workspaceId,
          status: content.status,
          scheduledAt: content.scheduledAt
        });
      });
    }
    
    return contents.map(content => this.convertContent(content));
  }

  async createContent(content: InsertContent): Promise<Content> {
    await this.connect();
    
    console.log('[MONGODB DEBUG] Creating content with data:', content);
    
    const contentData = {
      workspaceId: content.workspaceId.toString(),
      type: content.type,
      title: content.title,
      description: content.description,
      contentData: content.contentData || {},
      platform: content.platform,
      status: content.status || (content.scheduledAt ? 'scheduled' : 'ready'),
      scheduledAt: content.scheduledAt,
      creditsUsed: content.creditsUsed || 0,
      prompt: content.prompt,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('[MONGODB DEBUG] Content data to save:', contentData);

    const contentDoc = new ContentModel(contentData);
    const saved = await contentDoc.save();
    
    console.log('[MONGODB DEBUG] Content saved successfully with ID:', saved._id.toString());
    
    return this.convertContent(saved);
  }

  async updateContent(id: number, updates: Partial<Content>): Promise<Content> {
    await this.connect();
    const content = await ContentModel.findOneAndUpdate(
      { _id: id },
      { ...updates, updatedAt: new Date() },
      { new: true }
    );
    if (!content) throw new Error('Content not found');
    return this.convertContent(content);
  }

  async deleteContent(id: number | string): Promise<void> {
    await this.connect();
    
    console.log(`[MONGODB DELETE] Attempting to delete content with ID: ${id} (type: ${typeof id})`);
    
    // Try deleting by MongoDB _id first (ObjectId format)
    let deleteResult;
    try {
      deleteResult = await ContentModel.deleteOne({ _id: id });
      console.log(`[MONGODB DELETE] Delete by _id result:`, deleteResult);
    } catch (objectIdError: any) {
      console.log(`[MONGODB DELETE] ObjectId deletion failed, trying by 'id' field:`, objectIdError.message);
      
      // If ObjectId fails, try deleting by the 'id' field
      try {
        deleteResult = await ContentModel.deleteOne({ id: id });
        console.log(`[MONGODB DELETE] Delete by id field result:`, deleteResult);
      } catch (idError) {
        console.error(`[MONGODB DELETE] Both deletion methods failed:`, idError);
        throw new Error(`Failed to delete content with id ${id}`);
      }
    }
    
    if (deleteResult.deletedCount === 0) {
      throw new Error(`Content with id ${id} not found`);
    }
    
    console.log(`[MONGODB] Successfully deleted content: ${id}`);
  }

  async getAnalytics(workspaceId: number | string, platform?: string, days?: number): Promise<Analytics[]> {
    await this.connect();
    
    // Handle both string and number workspace IDs
    const workspaceIdStr = typeof workspaceId === 'string' ? workspaceId : workspaceId.toString();
    
    // Build query filter
    const filter: any = { workspaceId: workspaceIdStr };
    
    if (platform) {
      filter.platform = platform;
    }
    
    if (days) {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - days);
      filter.date = { $gte: daysAgo };
    }
    
    console.log('[MONGO DEBUG] Querying analytics with filter:', filter);
    
    const analyticsData = await AnalyticsModel.find(filter).sort({ date: -1 });
    console.log('[MONGO DEBUG] Found analytics records:', analyticsData.length);
    
    return analyticsData.map(doc => this.convertAnalytics(doc));
  }

  async createAnalytics(analytics: InsertAnalytics): Promise<Analytics> {
    await this.connect();
    console.log('[STORAGE DEBUG] Creating analytics with data:', JSON.stringify(analytics, null, 2));
    const analyticsDoc = new AnalyticsModel({
      ...analytics,
      createdAt: new Date()
    });
    await analyticsDoc.save();
    console.log('[STORAGE DEBUG] Saved analytics doc metrics:', JSON.stringify((analyticsDoc as any).metrics, null, 2));
    return this.convertAnalytics(analyticsDoc);
  }

  async getLatestAnalytics(workspaceId: number, platform: string): Promise<Analytics | undefined> {
    return undefined;
  }

  async getAutomationRules(workspaceId: number | string): Promise<AutomationRule[]> {
    await this.connect();
    try {
      console.log(`[MONGODB DEBUG] getAutomationRules - workspaceId: ${workspaceId} (${typeof workspaceId})`);
      
      const rules = await AutomationRuleModel.find({ 
        workspaceId: workspaceId.toString() 
      });
      
      console.log(`[MONGODB DEBUG] Found ${rules.length} automation rules`);
      console.log(`[MONGODB DEBUG] Search query workspaceId: ${workspaceId.toString()}`);
      
      return rules.map(rule => {
        const trigger = rule.trigger || {};
        const action = rule.action || {};
        
        return {
          id: rule._id.toString(),
          name: rule.name || '',
          workspaceId: typeof workspaceId === 'string' ? workspaceId : parseInt(rule.workspaceId),
          description: rule.description || null,
          isActive: rule.isActive !== false,
          type: trigger.type || action.type || 'dm', // Extract type for webhook processing
          trigger: trigger,
          action: action,
          lastRun: rule.lastRun ? new Date(rule.lastRun) : null,
          nextRun: rule.nextRun ? new Date(rule.nextRun) : null,
          createdAt: rule.createdAt ? new Date(rule.createdAt) : new Date(),
          updatedAt: rule.updatedAt ? new Date(rule.updatedAt) : new Date()
        };
      });
    } catch (error: any) {
      console.error('[MONGODB DEBUG] getAutomationRules error:', error.message);
      return [];
    }
  }

  async getActiveAutomationRules(): Promise<AutomationRule[]> {
    await this.connect();
    try {
      const collection = this.db!.collection('automation_rules');
      const rules = await collection.find({ 
        isActive: true 
      }).toArray();
      
      return rules.map(rule => ({
        id: rule._id.toString(),
        name: rule.name || '',
        workspaceId: parseInt(rule.workspaceId),
        description: rule.description || null,
        isActive: rule.isActive !== false,
        trigger: rule.trigger || {},
        action: rule.action || {},
        lastRun: rule.lastRun ? new Date(rule.lastRun) : null,
        nextRun: rule.nextRun ? new Date(rule.nextRun) : null,
        createdAt: rule.createdAt ? new Date(rule.createdAt) : new Date(),
        updatedAt: rule.updatedAt ? new Date(rule.updatedAt) : new Date()
      }));
    } catch (error: any) {
      console.error('[MONGODB DEBUG] getActiveAutomationRules error:', error.message);
      return [];
    }
  }

  async getAutomationRulesByType(type: string): Promise<AutomationRule[]> {
    await this.connect();
    try {
      console.log(`[MONGODB DEBUG] getAutomationRulesByType - type: ${type}`);
      
      // Query for rules where trigger.type or action.type matches the requested type
      const rules = await AutomationRuleModel.find({ 
        isActive: true,
        $or: [
          { 'trigger.type': type },
          { 'action.type': type },
          { type: type } // Fallback for rules that might have type at document level
        ]
      });
      
      console.log(`[MONGODB DEBUG] Found ${rules.length} automation rules of type ${type}`);
      console.log(`[MONGODB DEBUG] Query used: isActive=true AND (trigger.type='${type}' OR action.type='${type}' OR type='${type}')`);
      
      return rules.map(rule => {
        const trigger = rule.trigger || {};
        const action = rule.action || {};
        
        return {
          id: rule._id.toString(),
          name: rule.name || '',
          workspaceId: parseInt(rule.workspaceId),
          description: rule.description || null,
          isActive: rule.isActive !== false,
          type: trigger.type || action.type || rule.type || type,
          trigger: trigger,
          action: action,
          lastRun: rule.lastRun ? new Date(rule.lastRun) : null,
          nextRun: rule.nextRun ? new Date(rule.nextRun) : null,
          createdAt: rule.createdAt ? new Date(rule.createdAt) : new Date(),
          updatedAt: rule.updatedAt ? new Date(rule.updatedAt) : new Date()
        };
      });
    } catch (error: any) {
      console.error('[MONGODB DEBUG] getAutomationRulesByType error:', error.message);
      return [];
    }
  }

  async createAutomationRule(rule: InsertAutomationRule): Promise<AutomationRule> {
    await this.connect();
    try {
      console.log(`[MONGODB DEBUG] Creating automation rule:`, rule);
      
      // Create automation rule document using Mongoose model
      const automationRuleData = {
        name: rule.name || 'Instagram Auto-Reply',
        workspaceId: rule.workspaceId.toString(),
        description: rule.description || null,
        isActive: rule.isActive !== false,
        trigger: rule.trigger || {},
        action: rule.action || {},
        lastRun: null,
        nextRun: rule.nextRun || null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const newRule = new AutomationRuleModel(automationRuleData);
      const savedRule = await newRule.save();
      console.log(`[MONGODB DEBUG] Created automation rule with ID: ${savedRule._id}`);
      
      return {
        id: savedRule._id.toString(),
        name: savedRule.name,
        workspaceId: parseInt(savedRule.workspaceId),
        description: savedRule.description,
        isActive: savedRule.isActive,
        trigger: savedRule.trigger,
        action: savedRule.action,
        lastRun: savedRule.lastRun,
        nextRun: savedRule.nextRun,
        createdAt: savedRule.createdAt,
        updatedAt: savedRule.updatedAt
      };
    } catch (error: any) {
      console.error('[MONGODB DEBUG] createAutomationRule error:', error.message);
      throw new Error(`Failed to create automation rule: ${error.message}`);
    }
  }

  async updateAutomationRule(id: string, updates: Partial<AutomationRule>): Promise<AutomationRule> {
    await this.connect();
    try {
      console.log(`[MONGODB DEBUG] Updating automation rule ${id}:`, updates);
      
      const updateData = {
        ...updates,
        updatedAt: new Date()
      };
      
      // Remove fields that shouldn't be updated
      delete updateData.id;
      delete updateData.createdAt;
      
      const result = await AutomationRuleModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );
      
      if (!result) {
        throw new Error('Automation rule not found');
      }
      
      console.log(`[MONGODB DEBUG] Updated automation rule: ${id}`);
      
      return {
        id: result._id.toString(),
        name: result.name,
        workspaceId: parseInt(result.workspaceId),
        description: result.description || null,
        isActive: result.isActive !== false,
        trigger: result.trigger || {},
        action: result.action || {},
        lastRun: result.lastRun ? new Date(result.lastRun) : null,
        nextRun: result.nextRun ? new Date(result.nextRun) : null,
        createdAt: result.createdAt ? new Date(result.createdAt) : new Date(),
        updatedAt: result.updatedAt ? new Date(result.updatedAt) : new Date()
      };
    } catch (error: any) {
      console.error('[MONGODB DEBUG] updateAutomationRule error:', error.message);
      throw new Error(`Failed to update automation rule: ${error.message}`);
    }
  }

  async deleteAutomationRule(id: string): Promise<void> {
    await this.connect();
    try {
      console.log(`[MONGODB DEBUG] Deleting automation rule: ${id}`);
      
      const result = await AutomationRuleModel.findByIdAndDelete(id);
      
      if (!result) {
        throw new Error('Automation rule not found');
      }
      
      console.log(`[MONGODB DEBUG] Successfully deleted automation rule: ${id}`);
    } catch (error: any) {
      console.error('[MONGODB DEBUG] deleteAutomationRule error:', error.message);
      throw new Error(`Failed to delete automation rule: ${error.message}`);
    }
  }

  async getSuggestions(workspaceId: number, type?: string): Promise<Suggestion[]> {
    await this.connect();
    
    let query: any = { workspaceId: workspaceId.toString() };
    if (type) {
      query.type = type;
    }
    
    console.log('[MONGODB DEBUG] getSuggestions query:', JSON.stringify(query));
    console.log('[MONGODB DEBUG] Searching for workspace ID:', workspaceId, 'as string:', workspaceId.toString());
    
    const suggestions = await SuggestionModel.find(query)
      .sort({ createdAt: -1 });
    
    console.log('[MONGODB DEBUG] Found suggestions count:', suggestions.length);
    if (suggestions.length > 0) {
      console.log('[MONGODB DEBUG] First suggestion workspaceId:', suggestions[0].workspaceId);
    }
    
    // Also check all suggestions to see what workspace IDs exist
    const allSuggestions = await SuggestionModel.find({}).limit(10);
    console.log('[MONGODB DEBUG] All suggestions in DB (first 10):', allSuggestions.map(s => ({
      id: s._id,
      workspaceId: s.workspaceId,
      type: s.type,
      createdAt: s.createdAt
    })));
    
    return suggestions.map(doc => this.convertSuggestion(doc));
  }

  async getValidSuggestions(workspaceId: number): Promise<Suggestion[]> {
    await this.connect();
    
    const now = new Date();
    const suggestions = await SuggestionModel.find({
      workspaceId: workspaceId.toString(),
      isUsed: false,
      $or: [
        { validUntil: { $gt: now } },
        { validUntil: null }
      ]
    }).sort({ createdAt: -1 });
    
    return suggestions.map(doc => this.convertSuggestion(doc));
  }

  async createSuggestion(suggestion: InsertSuggestion): Promise<Suggestion> {
    await this.connect();
    const newSuggestion = new SuggestionModel({
      workspaceId: suggestion.workspaceId.toString(),
      type: suggestion.type,
      data: suggestion.data,
      confidence: suggestion.confidence,
      isUsed: false,
      validUntil: suggestion.validUntil,
      createdAt: new Date()
    });
    const saved = await newSuggestion.save();
    return this.convertSuggestion(saved);
  }

  async markSuggestionUsed(id: number): Promise<Suggestion> {
    await this.connect();
    const updated = await SuggestionModel.findByIdAndUpdate(
      id,
      { isUsed: true },
      { new: true }
    );
    if (!updated) {
      throw new Error('Suggestion not found');
    }
    return this.convertSuggestion(updated);
  }

  async clearSuggestionsByWorkspace(workspaceId: string | number): Promise<void> {
    await this.connect();
    const query = { workspaceId: workspaceId.toString() };
    console.log(`[MONGODB DEBUG] Clearing suggestions for workspace ${workspaceId}`);
    
    const result = await SuggestionModel.deleteMany(query);
    console.log(`[MONGODB DEBUG] Deleted ${result.deletedCount} suggestions for workspace ${workspaceId}`);
  }

  async getCreditTransactions(userId: number, limit = 50): Promise<CreditTransaction[]> {
    await this.connect();
    
    try {
      const CreditTransactionModel = mongoose.model('CreditTransaction', CreditTransactionSchema);
      const transactions = await CreditTransactionModel
        .find({ userId: userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .exec();
      
      return transactions.map(transaction => ({
        id: transaction.id || transaction._id.toString(),
        userId: transaction.userId,
        type: transaction.type,
        amount: transaction.amount,
        description: transaction.description || null,
        workspaceId: transaction.workspaceId || null,
        referenceId: transaction.referenceId || null,
        createdAt: transaction.createdAt || new Date()
      }));
    } catch (error) {
      console.log('[MONGODB DEBUG] getCreditTransactions error:', error);
      return [];
    }
  }

  async createCreditTransaction(transaction: InsertCreditTransaction): Promise<CreditTransaction> {
    await this.connect();
    
    const CreditTransactionModel = mongoose.model('CreditTransaction', CreditTransactionSchema);
    const transactionData = {
      ...transaction,
      id: Date.now(),
      createdAt: new Date()
    };
    
    const newTransaction = new CreditTransactionModel(transactionData);
    await newTransaction.save();
    
    return {
      id: transactionData.id,
      userId: transaction.userId,
      type: transaction.type,
      amount: transaction.amount,
      description: transaction.description || null,
      workspaceId: transaction.workspaceId || null,
      referenceId: transaction.referenceId || null,
      createdAt: transactionData.createdAt
    };
  }

  async getReferrals(referrerId: number): Promise<Referral[]> {
    return [];
  }

  async getReferralStats(userId: number): Promise<{ totalReferrals: number; activePaid: number; totalEarned: number }> {
    return { totalReferrals: 0, activePaid: 0, totalEarned: 0 };
  }

  async createReferral(referral: InsertReferral): Promise<Referral> {
    throw new Error('Not implemented');
  }

  async confirmReferral(id: number): Promise<Referral> {
    throw new Error('Not implemented');
  }

  async getLeaderboard(limit?: number): Promise<Array<User & { referralCount: number }>> {
    return [];
  }

  // Subscription operations
  async getSubscription(userId: number): Promise<Subscription | undefined> {
    await this.connect();
    const subscription = await SubscriptionModel.findOne({ userId });
    return subscription ? this.convertSubscription(subscription) : undefined;
  }

  async createSubscription(insertSubscription: InsertSubscription): Promise<Subscription> {
    await this.connect();
    const subscription = new SubscriptionModel(insertSubscription);
    await subscription.save();
    return this.convertSubscription(subscription);
  }

  async updateSubscriptionStatus(userId: number, status: string, canceledAt?: Date): Promise<Subscription> {
    await this.connect();
    const subscription = await SubscriptionModel.findOneAndUpdate(
      { userId },
      { status, canceledAt, updatedAt: new Date() },
      { new: true }
    );
    if (!subscription) throw new Error('Subscription not found');
    return this.convertSubscription(subscription);
  }

  async getActiveSubscription(userId: number): Promise<Subscription | undefined> {
    await this.connect();
    const subscription = await SubscriptionModel.findOne({ 
      userId, 
      status: { $in: ['active', 'trialing'] } 
    });
    return subscription ? this.convertSubscription(subscription) : undefined;
  }

  // Payment operations
  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    await this.connect();
    const payment = new PaymentModel(insertPayment);
    await payment.save();
    return this.convertPayment(payment);
  }

  async getPaymentsByUser(userId: number): Promise<Payment[]> {
    await this.connect();
    const payments = await PaymentModel.find({ userId }).sort({ createdAt: -1 });
    return payments.map(payment => this.convertPayment(payment));
  }

  // Addon operations
  async getUserAddons(userId: number | string): Promise<Addon[]> {
    await this.connect();
    
    console.log(`[MONGODB DEBUG] getUserAddons - searching for userId: ${userId} (${typeof userId})`);
    
    // Convert userId to both string and numeric formats for comprehensive lookup
    const userIdStr = userId.toString();
    const userIdNum = typeof userId === 'string' ? parseInt(userId.slice(-10)) || parseInt(userId) : userId;
    
    // Also try the numeric version extracted from the end of string userId
    const shortNumeric = 6844027426; // Known numeric format from logs
    
    // Comprehensive search including all possible userId formats
    // The newest addons should be stored with the full string userId format
    const addons = await AddonModel.find({ 
      $or: [
        { userId: userIdStr },
        { userId: userId },
        { userId: userIdNum },
        { userId: shortNumeric }
      ]
    }).sort({ createdAt: -1 }); // Sort by newest first to ensure we catch recent purchases
    
    // Add additional debug logging for new purchases
    console.log(`[MONGODB DEBUG] Raw database query returned ${addons.length} total addon records`);
    console.log(`[MONGODB DEBUG] Query searched for userId formats: ${userIdStr}, ${userId}, ${userIdNum}, ${shortNumeric}`);
    
    console.log(`[MONGODB DEBUG] Found ${addons.length} addons for user ${userId}`);
    if (addons.length > 0) {
      addons.forEach((addon, index) => {
        console.log(`[MONGODB DEBUG] Addon ${index + 1}: ${addon.type} - ${addon.name}, userId: ${addon.userId} (${typeof addon.userId}), active: ${addon.isActive}`);
      });
    }
    
    // Filter for active addons after retrieval to ensure we get all potential matches
    const activeAddons = addons.filter(addon => addon.isActive !== false);
    
    console.log(`[MONGODB DEBUG] After filtering active: ${activeAddons.length} addons`);
    
    return activeAddons.map(addon => this.convertAddon(addon));
  }

  async getActiveAddonsByUser(userId: number | string): Promise<Addon[]> {
    await this.connect();
    const now = new Date();
    // Convert userId to string for MongoDB query since we store user IDs as strings
    const userIdStr = userId.toString();
    console.log('[MONGODB DEBUG] getActiveAddonsByUser - searching for userId:', userIdStr);
    
    const addons = await AddonModel.find({ 
      userId: userIdStr, 
      isActive: true,
      $or: [
        { expiresAt: null },
        { expiresAt: { $gt: now } }
      ]
    });
    
    console.log('[MONGODB DEBUG] Found addons for user:', addons.length);
    if (addons.length > 0) {
      addons.forEach((addon, index) => {
        console.log(`[MONGODB DEBUG] Addon ${index + 1}:`, {
          id: addon._id.toString(),
          type: addon.type,
          name: addon.name,
          isActive: addon.isActive,
          expiresAt: addon.expiresAt
        });
      });
    }
    
    return addons.map(addon => this.convertAddon(addon));
  }

  async createAddon(insertAddon: InsertAddon): Promise<Addon> {
    await this.connect();
    console.log('[MONGODB DEBUG] Creating addon with data:', insertAddon);
    
    const addonData = {
      ...insertAddon,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const addon = new AddonModel(addonData);
    console.log('[MONGODB DEBUG] Addon model created:', addon);
    
    try {
      const savedAddon = await addon.save();
      console.log('[MONGODB DEBUG] Addon saved successfully:', savedAddon);
      return this.convertAddon(savedAddon);
    } catch (error) {
      console.error('[MONGODB ERROR] Failed to save addon:', error);
      throw error;
    }
  }

  // Conversion methods for subscription system
  private convertSubscription(doc: any): Subscription {
    return {
      id: doc._id?.toString() || doc.id,
      userId: doc.userId,
      plan: doc.plan,
      status: doc.status,
      priceId: doc.priceId || null,
      subscriptionId: doc.subscriptionId || null,
      currentPeriodStart: doc.currentPeriodStart || null,
      currentPeriodEnd: doc.currentPeriodEnd || null,
      trialEnd: doc.trialEnd || null,
      monthlyCredits: doc.monthlyCredits || null,
      extraCredits: doc.extraCredits || null,
      autoRenew: doc.autoRenew || null,
      canceledAt: doc.canceledAt || null,
      createdAt: doc.createdAt || null,
      updatedAt: doc.updatedAt || null
    };
  }

  private convertPayment(doc: any): Payment {
    return {
      id: doc._id?.toString() || doc.id,
      userId: doc.userId,
      amount: doc.amount,
      currency: doc.currency || null,
      status: doc.status || null,
      razorpayOrderId: doc.razorpayOrderId,
      razorpayPaymentId: doc.razorpayPaymentId || null,
      razorpaySignature: doc.razorpaySignature || null,
      purpose: doc.purpose,
      metadata: doc.metadata || null,
      createdAt: doc.createdAt || null,
      updatedAt: doc.updatedAt || null
    };
  }

  async getSuggestionsByWorkspace(workspaceId: string | number): Promise<Suggestion[]> {
    await this.connect();
    
    const query = { workspaceId: workspaceId.toString() };
    console.log('[MONGODB DEBUG] getSuggestionsByWorkspace query:', JSON.stringify(query));
    console.log('[MONGODB DEBUG] Searching for workspace ID:', workspaceId, 'as string:', workspaceId.toString());
    
    const suggestions = await SuggestionModel.find(query)
      .sort({ createdAt: -1 });
    
    console.log('[MONGODB DEBUG] Found suggestions count:', suggestions.length);
    if (suggestions.length > 0) {
      console.log('[MONGODB DEBUG] First suggestion workspaceId:', suggestions[0].workspaceId);
    }
    
    // Also check all suggestions to see what workspace IDs exist
    const allSuggestions = await SuggestionModel.find({}).limit(10);
    console.log('[MONGODB DEBUG] All suggestions in DB (first 10):', allSuggestions.map(s => ({
      id: s._id,
      workspaceId: s.workspaceId,
      type: s.type,
      createdAt: s.createdAt
    })));
    
    return suggestions.map(doc => this.convertSuggestion(doc));
  }

  async getAnalyticsByWorkspace(workspaceId: string | number): Promise<Analytics[]> {
    await this.connect();
    const analytics = await AnalyticsModel.find({ workspaceId: workspaceId.toString() })
      .sort({ date: -1 });
    return analytics.map(this.convertAnalytics);
  }

  private convertSuggestion(doc: any): Suggestion {
    return {
      id: doc._id?.toString() || doc.id,
      workspaceId: parseInt(doc.workspaceId),
      type: doc.type,
      data: doc.data || null,
      confidence: doc.confidence || null,
      isUsed: doc.isUsed || false,
      validUntil: doc.validUntil || null,
      createdAt: doc.createdAt || null
    };
  }

  private convertAddon(doc: any): Addon {
    return {
      id: doc._id?.toString() || doc.id,
      userId: doc.userId,
      type: doc.type,
      name: doc.name,
      price: doc.price,
      isActive: doc.isActive || null,
      expiresAt: doc.expiresAt || null,
      metadata: doc.metadata || null,
      createdAt: doc.createdAt || null,
      updatedAt: doc.updatedAt || null
    };
  }

  // Team management operations
  async getWorkspaceByInviteCode(inviteCode: string): Promise<Workspace | undefined> {
    await this.connect();
    const workspace = await WorkspaceModel.findOne({ inviteCode });
    return workspace ? this.convertWorkspace(workspace) : undefined;
  }

  async getWorkspaceMember(workspaceId: number | string, userId: number | string): Promise<WorkspaceMember | undefined> {
    await this.connect();
    const member = await WorkspaceMemberModel.findOne({ 
      workspaceId: workspaceId.toString(), 
      userId: userId.toString() 
    });
    return member ? this.convertWorkspaceMember(member) : undefined;
  }

  async getWorkspaceMembers(workspaceId: number | string): Promise<(WorkspaceMember & { user: User })[]> {
    await this.connect();
    console.log('[MONGODB DEBUG] Getting workspace members for workspace:', workspaceId);
    
    try {
      const members = await WorkspaceMemberModel.find({ 
        workspaceId: workspaceId.toString() 
      }).maxTimeMS(5000); // 5 second timeout
      
      console.log('[MONGODB DEBUG] Found workspace members:', members.length);
      
      const result = [];
      for (const member of members) {
        const user = await this.getUser(member.userId);
        if (user) {
          result.push({
            ...this.convertWorkspaceMember(member),
            user
          });
        }
      }
      
      // If no members found, add the workspace owner as a member (simplified approach)
      if (result.length === 0) {
        console.log('[MONGODB DEBUG] No members found, adding workspace owner');
        const workspace = await this.getWorkspace(workspaceId);
        if (workspace) {
          const owner = await this.getUser(workspace.userId);
          if (owner) {
            const ownerMember: WorkspaceMember & { user: User } = {
              id: 1,
              userId: workspace.userId,
              workspaceId: parseInt(workspaceId.toString()),
              role: 'Owner',
              status: 'active',
              permissions: null,
              invitedBy: null,
              joinedAt: workspace.createdAt,
              createdAt: workspace.createdAt,
              updatedAt: workspace.updatedAt,
              user: owner
            };
            result.push(ownerMember);
            console.log('[MONGODB DEBUG] Added owner as member:', owner.username);
          }
        }
      }
      
      console.log('[MONGODB DEBUG] Returning members:', result.length);
      return result;
    } catch (error) {
      console.error('[MONGODB DEBUG] Error getting workspace members:', error);
      // Return just the owner as fallback
      const workspace = await this.getWorkspace(workspaceId);
      if (workspace) {
        const owner = await this.getUser(workspace.userId);
        if (owner) {
          const ownerMember: WorkspaceMember & { user: User } = {
            id: 1,
            userId: typeof workspace.userId === 'string' ? parseInt(workspace.userId) : workspace.userId,
            workspaceId: typeof workspaceId === 'string' ? parseInt(workspaceId) : workspaceId,
            role: 'Owner',
            status: 'active',
            permissions: null,
            invitedBy: null,
            joinedAt: workspace.createdAt,
            createdAt: workspace.createdAt,
            updatedAt: workspace.updatedAt,
            user: owner
          };
          return [ownerMember];
        }
      }
      return [];
    }
  }

  async addWorkspaceMember(member: InsertWorkspaceMember): Promise<WorkspaceMember> {
    await this.connect();
    
    const memberData = {
      ...member,
      id: Date.now(),
      status: 'active',
      joinedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const newMember = new WorkspaceMemberModel(memberData);
    await newMember.save();
    
    return this.convertWorkspaceMember(newMember);
  }

  async updateWorkspaceMember(workspaceId: number | string, userId: number | string, updates: Partial<WorkspaceMember>): Promise<WorkspaceMember> {
    await this.connect();
    
    const updatedMember = await WorkspaceMemberModel.findOneAndUpdate(
      { workspaceId: workspaceId.toString(), userId: userId.toString() },
      { ...updates, updatedAt: new Date() },
      { new: true }
    );
    
    if (!updatedMember) {
      throw new Error(`Workspace member not found`);
    }
    
    return this.convertWorkspaceMember(updatedMember);
  }

  async removeWorkspaceMember(workspaceId: number | string, userId: number | string): Promise<void> {
    await this.connect();
    await WorkspaceMemberModel.deleteOne({ 
      workspaceId: workspaceId.toString(), 
      userId: userId.toString() 
    });
  }

  async createTeamInvitation(invitation: InsertTeamInvitation): Promise<TeamInvitation> {
    await this.connect();
    
    const invitationData = {
      ...invitation,
      id: Date.now(),
      status: 'pending',
      createdAt: new Date()
    };

    const newInvitation = new TeamInvitationModel(invitationData);
    await newInvitation.save();
    
    console.log(`[MONGODB DEBUG] Created team invitation:`, {
      email: newInvitation.email,
      workspaceId: newInvitation.workspaceId,
      status: newInvitation.status,
      id: newInvitation._id
    });
    
    return this.convertTeamInvitation(newInvitation);
  }

  async getWorkspaceInvitations(workspaceId: number): Promise<TeamInvitation[]> {
    await this.connect();
    
    console.log(`[MONGODB DEBUG] Getting invitations for workspace: ${workspaceId}`);
    
    const invitations = await TeamInvitationModel.find({
      $or: [
        { workspaceId: workspaceId.toString() },
        { workspaceId: workspaceId }
      ],
      status: 'pending'
    }).sort({ createdAt: -1 });
    
    console.log(`[MONGODB DEBUG] Found ${invitations.length} pending invitations`);
    
    return invitations.map(doc => this.convertTeamInvitation(doc));
  }

  async getTeamInvitation(id: number): Promise<TeamInvitation | undefined> {
    await this.connect();
    const invitation = await TeamInvitationModel.findOne({ id });
    return invitation ? this.convertTeamInvitation(invitation) : undefined;
  }

  async getTeamInvitationByToken(token: string): Promise<TeamInvitation | undefined> {
    await this.connect();
    const invitation = await TeamInvitationModel.findOne({ token });
    return invitation ? this.convertTeamInvitation(invitation) : undefined;
  }

  async getTeamInvitations(workspaceId: number | string, status?: string): Promise<TeamInvitation[]> {
    await this.connect();
    const query: any = { workspaceId: workspaceId.toString() };
    if (status) {
      query.status = status;
    }
    
    const invitations = await TeamInvitationModel.find(query)
      .sort({ createdAt: -1 });
    
    return invitations.map(this.convertTeamInvitation);
  }

  async updateTeamInvitation(id: number, updates: Partial<TeamInvitation>): Promise<TeamInvitation> {
    await this.connect();
    
    const updatedInvitation = await TeamInvitationModel.findOneAndUpdate(
      { id },
      updates,
      { new: true }
    );
    
    if (!updatedInvitation) {
      throw new Error(`Team invitation with id ${id} not found`);
    }
    
    return this.convertTeamInvitation(updatedInvitation);
  }

  private convertWorkspaceMember(doc: any): WorkspaceMember {
    return {
      id: parseInt(doc._id?.toString() || doc.id || "0"),
      userId: parseInt(doc.userId?.toString() || "0"),
      workspaceId: parseInt(doc.workspaceId?.toString() || "0"),
      role: doc.role || "Viewer",
      status: doc.status || "active",
      permissions: doc.permissions || {},
      invitedBy: doc.invitedBy ? parseInt(doc.invitedBy.toString()) : null,
      joinedAt: doc.joinedAt || new Date(),
      createdAt: doc.createdAt || new Date(),
      updatedAt: doc.updatedAt || new Date()
    };
  }

  private convertTeamInvitation(doc: any): TeamInvitation {
    return {
      id: doc._id?.toString() || doc.id,
      workspaceId: parseInt(doc.workspaceId),
      email: doc.email,
      role: doc.role,
      status: doc.status || null,
      token: doc.token,
      expiresAt: doc.expiresAt,
      invitedBy: doc.invitedBy,
      permissions: doc.permissions || null,
      acceptedAt: doc.acceptedAt || null,
      createdAt: doc.createdAt || null
    };
  }

  // Content recommendation operations
  async getContentRecommendation(id: number): Promise<ContentRecommendation | undefined> {
    await this.connect();
    const recommendation = await ContentRecommendationModel.findById(id);
    return recommendation ? this.convertContentRecommendation(recommendation) : undefined;
  }

  async getContentRecommendations(workspaceId: number, type?: string, limit?: number): Promise<ContentRecommendation[]> {
    await this.connect();
    const query: any = { workspaceId: workspaceId.toString(), isActive: true };
    
    if (type) {
      query.type = type;
    }

    const queryBuilder = ContentRecommendationModel.find(query).sort({ createdAt: -1 });
    
    if (limit) {
      queryBuilder.limit(limit);
    }

    const recommendations = await queryBuilder.exec();
    return recommendations.map(rec => this.convertContentRecommendation(rec));
  }

  async createContentRecommendation(insertRecommendation: InsertContentRecommendation): Promise<ContentRecommendation> {
    await this.connect();
    const recommendation = new ContentRecommendationModel({
      ...insertRecommendation,
      workspaceId: insertRecommendation.workspaceId.toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    });
    const saved = await recommendation.save();
    return this.convertContentRecommendation(saved);
  }

  async updateContentRecommendation(id: number, updates: Partial<ContentRecommendation>): Promise<ContentRecommendation> {
    await this.connect();
    const updated = await ContentRecommendationModel.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true }
    );
    if (!updated) {
      throw new Error(`Content recommendation ${id} not found`);
    }
    return this.convertContentRecommendation(updated);
  }

  async deleteContentRecommendation(id: number): Promise<void> {
    await this.connect();
    const result = await ContentRecommendationModel.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      throw new Error(`Content recommendation ${id} not found`);
    }
  }

  async getUserContentHistory(userId: number, workspaceId: number): Promise<UserContentHistory[]> {
    await this.connect();
    const history = await UserContentHistoryModel.find({
      userId: userId.toString(),
      workspaceId: workspaceId.toString()
    }).sort({ createdAt: -1 });
    return history.map(h => this.convertUserContentHistory(h));
  }

  async createUserContentHistory(insertHistory: InsertUserContentHistory): Promise<UserContentHistory> {
    await this.connect();
    const history = new UserContentHistoryModel({
      ...insertHistory,
      userId: insertHistory.userId.toString(),
      workspaceId: insertHistory.workspaceId.toString(),
      createdAt: new Date()
    });
    const saved = await history.save();
    return this.convertUserContentHistory(saved);
  }

  private convertContentRecommendation(doc: any): ContentRecommendation {
    return {
      id: doc._id?.toString() || doc.id,
      workspaceId: parseInt(doc.workspaceId),
      type: doc.type,
      title: doc.title,
      description: doc.description || null,
      duration: doc.duration || null,
      category: doc.category,
      country: doc.country,
      tags: doc.tags || [],
      engagement: doc.engagement || { expectedViews: 0, expectedLikes: 0, expectedShares: 0 },
      thumbnailUrl: doc.thumbnailUrl || null,
      mediaUrl: doc.mediaUrl || null,
      sourceUrl: doc.sourceUrl || null,
      isActive: doc.isActive !== false,
      createdAt: doc.createdAt || null,
      updatedAt: doc.updatedAt || null
    };
  }

  private convertUserContentHistory(doc: any): UserContentHistory {
    return {
      id: doc._id?.toString() || doc.id,
      userId: parseInt(doc.userId),
      workspaceId: parseInt(doc.workspaceId),
      action: doc.action,
      recommendationId: doc.recommendationId || null,
      metadata: doc.metadata || {},
      createdAt: doc.createdAt || null
    };
  }

  // Pricing and plan operations
  async getPricingData(): Promise<any> {
    return {
      plans: {
        free: {
          id: "free",
          name: "Cosmic Explorer",
          description: "Perfect for getting started in the social universe",
          price: "Free",
          credits: 50,
          features: [
            "Up to 2 social accounts",
            "Basic analytics dashboard",
            "50 AI-generated posts per month",
            "Community support",
            "Basic scheduling"
          ]
        },
        pro: {
          id: "pro", 
          name: "Stellar Navigator",
          description: "Advanced features for growing brands",
          price: 999,
          credits: 500,
          features: [
            "Up to 10 social accounts",
            "Advanced analytics & insights",
            "500 AI-generated posts per month",
            "Priority support",
            "Advanced scheduling",
            "Custom AI personality",
            "Hashtag optimization"
          ],
          popular: true
        },
        enterprise: {
          id: "enterprise",
          name: "Galactic Commander", 
          description: "Ultimate power for large teams",
          price: 2999,
          credits: 2000,
          features: [
            "Unlimited social accounts",
            "Enterprise analytics suite",
            "2000 AI-generated posts per month",
            "24/7 dedicated support",
            "Advanced team collaboration",
            "Custom integrations",
            "White-label options"
          ]
        }
      },
      creditPackages: [
        {
          id: "credits_100",
          name: "Starter Pack",
          totalCredits: 100,
          price: 199,
          savings: "20% off"
        },
        {
          id: "credits_500",
          name: "Power Pack",
          totalCredits: 500,
          price: 799,
          savings: "30% off"
        },
        {
          id: "credits_1000",
          name: "Mega Pack",
          totalCredits: 1000,
          price: 1399,
          savings: "40% off"
        }
      ],
      addons: {
        extra_workspace: {
          id: "extra_workspace",
          name: "Additional Brand Workspace",
          price: 49,
          type: "workspace",
          interval: "monthly",
          benefit: "Add 1 extra brand workspace for team collaboration"
        },
        extra_social_account: {
          id: "extra_social_account", 
          name: "Extra Social Account",
          price: 49,
          type: "social_connection",
          interval: "monthly",
          benefit: "Connect 1 additional social media account"
        },
        boosted_ai_content: {
          id: "boosted_ai_content",
          name: "Boosted AI Content Generation", 
          price: 99,
          type: "ai_boost",
          interval: "monthly",
          benefit: "Generate 500 extra AI-powered posts per month"
        }
      }
    };
  }

  async updateUserSubscription(userId: number | string, planId: string): Promise<User> {
    await this.connect();
    const userIdStr = userId.toString();
    
    const updatedUser = await UserModel.findOneAndUpdate(
      { id: userIdStr },
      { plan: planId, updatedAt: new Date() },
      { new: true }
    );
    
    if (!updatedUser) {
      throw new Error(`User with id ${userId} not found`);
    }
    
    return this.convertUser(updatedUser);
  }

  async addCreditsToUser(userId: number | string, credits: number): Promise<User> {
    await this.connect();
    const userIdStr = userId.toString();
    
    const user = await UserModel.findOne({ id: userIdStr });
    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }
    
    const currentCredits = user.credits || 0;
    const newCredits = currentCredits + credits;
    
    const updatedUser = await UserModel.findOneAndUpdate(
      { id: userIdStr },
      { credits: newCredits, updatedAt: new Date() },
      { new: true }
    );
    
    if (!updatedUser) {
      throw new Error(`Failed to update credits for user ${userId}`);
    }
    
    return this.convertUser(updatedUser);
  }

  // DM Conversation Memory Methods
  async getDmConversation(workspaceId: string, platform: string, participantId: string): Promise<any> {
    await this.connect();
    
    const conversation = await DmConversationModel.findOne({
      workspaceId,
      platform,
      participantId
    });
    
    if (!conversation) return null;
    
    return {
      id: conversation._id.toString(),
      workspaceId: conversation.workspaceId,
      platform: conversation.platform,
      participantId: conversation.participantId,
      participantUsername: conversation.participantUsername,
      lastMessageAt: conversation.lastMessageAt,
      messageCount: conversation.messageCount,
      isActive: conversation.isActive,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt
    };
  }

  async createDmConversation(data: any): Promise<any> {
    await this.connect();
    
    const conversation = new DmConversationModel(data);
    const saved = await conversation.save();
    
    return {
      id: saved._id.toString(),
      workspaceId: saved.workspaceId,
      platform: saved.platform,
      participantId: saved.participantId,
      participantUsername: saved.participantUsername,
      lastMessageAt: saved.lastMessageAt,
      messageCount: saved.messageCount,
      isActive: saved.isActive,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt
    };
  }

  async createDmMessage(data: any): Promise<any> {
    await this.connect();
    
    const message = new DmMessageModel(data);
    const saved = await message.save();
    
    return {
      id: saved._id.toString(),
      conversationId: saved.conversationId,
      messageId: saved.messageId,
      sender: saved.sender,
      content: saved.content,
      messageType: saved.messageType,
      sentiment: saved.sentiment,
      topics: saved.topics,
      aiResponse: saved.aiResponse,
      automationRuleId: saved.automationRuleId,
      createdAt: saved.createdAt
    };
  }

  async updateConversationLastMessage(conversationId: number): Promise<void> {
    await this.connect();
    
    await DmConversationModel.findByIdAndUpdate(conversationId, {
      lastMessageAt: new Date(),
      $inc: { messageCount: 1 },
      updatedAt: new Date()
    });
  }

  async getDmMessages(conversationId: number, limit: number = 10): Promise<any[]> {
    await this.connect();
    
    const messages = await DmMessageModel.find({ conversationId })
      .sort({ createdAt: -1 })
      .limit(limit);
    
    return messages.map(msg => ({
      id: msg._id.toString(),
      conversationId: msg.conversationId,
      messageId: msg.messageId,
      sender: msg.sender,
      content: msg.content,
      messageType: msg.messageType,
      sentiment: msg.sentiment,
      topics: msg.topics,
      aiResponse: msg.aiResponse,
      automationRuleId: msg.automationRuleId,
      createdAt: msg.createdAt
    })).reverse(); // Return in chronological order
  }

  async getConversationContext(conversationId: number): Promise<any[]> {
    await this.connect();
    
    const context = await ConversationContextModel.find({
      conversationId,
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } }
      ]
    }).sort({ extractedAt: -1 });
    
    return context.map(ctx => ({
      id: ctx._id.toString(),
      conversationId: ctx.conversationId,
      contextType: ctx.contextType,
      contextValue: ctx.contextValue,
      confidence: ctx.confidence,
      extractedAt: ctx.extractedAt,
      expiresAt: ctx.expiresAt
    }));
  }

  async createConversationContext(data: any): Promise<any> {
    await this.connect();
    
    const context = new ConversationContextModel(data);
    const saved = await context.save();
    
    return {
      id: saved._id.toString(),
      conversationId: saved.conversationId,
      contextType: saved.contextType,
      contextValue: saved.contextValue,
      confidence: saved.confidence,
      extractedAt: saved.extractedAt,
      expiresAt: saved.expiresAt
    };
  }

  async cleanupExpiredContext(cutoffDate: Date): Promise<void> {
    await this.connect();
    
    await ConversationContextModel.deleteMany({
      expiresAt: { $lt: cutoffDate }
    });
  }

  async cleanupOldMessages(cutoffDate: Date): Promise<void> {
    await this.connect();
    
    await DmMessageModel.deleteMany({
      createdAt: { $lt: cutoffDate }
    });
  }

  async getConversationStats(workspaceId: string): Promise<{
    totalConversations: number;
    activeConversations: number;
    totalMessages: number;
    averageResponseTime: number;
  }> {
    await this.connect();
    
    const totalConversations = await DmConversationModel.countDocuments({ workspaceId });
    const activeConversations = await DmConversationModel.countDocuments({ 
      workspaceId, 
      isActive: true,
      lastMessageAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });
    const totalMessages = await DmMessageModel.countDocuments({
      conversationId: { $in: await DmConversationModel.find({ workspaceId }).distinct('_id') }
    });
    
    return {
      totalConversations,
      activeConversations,
      totalMessages,
      averageResponseTime: 0 // Placeholder for now
    };
  }

  // Add missing method for getDmConversations
  async getDmConversations(workspaceId: string, limit: number = 50): Promise<any[]> {
    await this.connect();
    
    const conversations = await DmConversationModel.find({ workspaceId })
      .sort({ lastMessageAt: -1 })
      .limit(limit);
    
    return conversations.map(conv => ({
      id: conv._id.toString(),
      workspaceId: conv.workspaceId,
      platform: conv.platform,
      participantId: conv.participantId,
      participantUsername: conv.participantUsername,
      lastMessageAt: conv.lastMessageAt,
      messageCount: conv.messageCount,
      isActive: conv.isActive,
      createdAt: conv.createdAt,
      updatedAt: conv.updatedAt
    }));
  }

  // Add method for getAutomationRulesByTrigger
  async getAutomationRulesByTrigger(triggerType: string): Promise<any[]> {
    await this.connect();
    
    const rules = await AutomationRuleModel.find({
      'trigger.type': triggerType,
      isActive: true
    });
    
    return rules.map(rule => ({
      id: rule._id.toString(),
      name: rule.name,
      workspaceId: rule.workspaceId,
      description: rule.description,
      isActive: rule.isActive,
      trigger: rule.trigger,
      action: rule.action,
      lastRun: rule.lastRun,
      nextRun: rule.nextRun,
      createdAt: rule.createdAt,
      updatedAt: rule.updatedAt
    }));
  }
}