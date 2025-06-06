import mongoose from "mongoose";
import { IStorage } from "./storage";
import {
  User, Workspace, SocialAccount, Content, Analytics, AutomationRule,
  Suggestion, CreditTransaction, Referral, Subscription, Payment, Addon,
  InsertUser, InsertWorkspace, InsertSocialAccount, InsertContent,
  InsertAutomationRule, InsertAnalytics, InsertSuggestion,
  InsertCreditTransaction, InsertReferral, InsertSubscription, InsertPayment, InsertAddon
} from "@shared/schema";

// MongoDB Schemas
const UserSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  displayName: String,
  avatar: String,
  credits: { type: Number, default: 50 },
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
  isActive: { type: Boolean, default: true },
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

const AutomationRuleSchema = new mongoose.Schema({
  workspaceId: { type: mongoose.Schema.Types.Mixed, required: true },
  name: { type: String, required: true },
  trigger: { type: String, required: true },
  action: { type: String, required: true },
  conditions: mongoose.Schema.Types.Mixed,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const SuggestionSchema = new mongoose.Schema({
  workspaceId: { type: mongoose.Schema.Types.Mixed, required: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  platform: String,
  confidence: { type: Number, default: 0.8 },
  isUsed: { type: Boolean, default: false },
  expiresAt: Date,
  createdAt: { type: Date, default: Date.now }
});

const CreditTransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.Mixed, required: true },
  amount: { type: Number, required: true },
  type: { type: String, required: true },
  description: { type: String, required: true },
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
  createdAt: { type: Date, default: Date.now }
});

// MongoDB Models
const UserModel = mongoose.model('User', UserSchema);
const WorkspaceModel = mongoose.model('Workspace', WorkspaceSchema);
const SocialAccountModel = mongoose.model('SocialAccount', SocialAccountSchema);
const ContentModel = mongoose.model('Content', ContentSchema);
const AnalyticsModel = mongoose.model('Analytics', AnalyticsSchema);
const AutomationRuleModel = mongoose.model('AutomationRule', AutomationRuleSchema);
const SuggestionModel = mongoose.model('Suggestion', SuggestionSchema);
const CreditTransactionModel = mongoose.model('CreditTransaction', CreditTransactionSchema);
const ReferralModel = mongoose.model('Referral', ReferralSchema);
const SubscriptionModel = mongoose.model('Subscription', SubscriptionSchema);
const PaymentModel = mongoose.model('Payment', PaymentSchema);
const AddonModel = mongoose.model('Addon', AddonSchema);

export class MongoStorage implements IStorage {
  private isConnected = false;

  async connect() {
    if (this.isConnected) return;
    
    try {
      await mongoose.connect(process.env.MONGODB_URI!);
      this.isConnected = true;
      console.log('Connected to MongoDB Atlas');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw error;
    }
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    await this.connect();
    const user = await UserModel.findOne({ _id: id });
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
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    const savedUser = await user.save();
    return this.convertUser(savedUser);
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

  async updateUserCredits(id: number, credits: number): Promise<User> {
    return this.updateUser(id, { credits });
  }

  async updateUserStripeInfo(id: number, stripeCustomerId: string, stripeSubscriptionId?: string): Promise<User> {
    return this.updateUser(id, { stripeCustomerId, stripeSubscriptionId });
  }

  // Workspace operations
  async getWorkspace(id: number | string): Promise<Workspace | undefined> {
    await this.connect();
    // Handle both numeric IDs and ObjectId strings
    const query = typeof id === 'string' && id.length === 24 ? { _id: id } : { _id: id };
    const workspace = await WorkspaceModel.findOne(query);
    return workspace ? this.convertWorkspace(workspace) : undefined;
  }

  async getWorkspacesByUserId(userId: number | string): Promise<Workspace[]> {
    await this.connect();
    const workspaces = await WorkspaceModel.find({ userId });
    return workspaces.map(this.convertWorkspace);
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

  async updateWorkspace(id: number, updates: Partial<Workspace>): Promise<Workspace> {
    await this.connect();
    const workspace = await WorkspaceModel.findOneAndUpdate(
      { _id: id },
      { ...updates, updatedAt: new Date() },
      { new: true }
    );
    if (!workspace) throw new Error('Workspace not found');
    return this.convertWorkspace(workspace);
  }

  async deleteWorkspace(id: number): Promise<void> {
    await this.connect();
    await WorkspaceModel.findOneAndDelete({ _id: id });
  }

  // Helper methods for data conversion
  private convertUser(mongoUser: any): User {
    return {
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
      isOnboarded: mongoUser.isOnboarded || false,
      createdAt: mongoUser.createdAt,
      updatedAt: mongoUser.updatedAt
    };
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
  async getSocialAccount(id: number): Promise<SocialAccount | undefined> {
    await this.connect();
    const account = await SocialAccountModel.findOne({ _id: id });
    return account ? this.convertSocialAccount(account) : undefined;
  }

  async getSocialAccountsByWorkspace(workspaceId: any): Promise<SocialAccount[]> {
    await this.connect();
    // Handle both string ObjectIds and numeric IDs
    const accounts = await SocialAccountModel.find({ workspaceId: workspaceId.toString() });
    return accounts.map(account => this.convertSocialAccount(account));
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
    
    const contentData = {
      workspaceId: content.workspaceId.toString(),
      type: content.type,
      title: content.title,
      description: content.description,
      contentData: content.contentData || {},
      platform: content.platform,
      status: content.scheduledAt ? 'scheduled' : 'ready',
      scheduledAt: content.scheduledAt,
      creditsUsed: content.creditsUsed || 0,
      prompt: content.prompt
    };

    const contentDoc = new ContentModel(contentData);
    const saved = await contentDoc.save();
    
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

  async getAutomationRules(workspaceId: number): Promise<AutomationRule[]> {
    return [];
  }

  async getActiveAutomationRules(): Promise<AutomationRule[]> {
    return [];
  }

  async createAutomationRule(rule: InsertAutomationRule): Promise<AutomationRule> {
    throw new Error('Not implemented');
  }

  async updateAutomationRule(id: number, updates: Partial<AutomationRule>): Promise<AutomationRule> {
    throw new Error('Not implemented');
  }

  async deleteAutomationRule(id: number): Promise<void> {
    // Implementation needed
  }

  async getSuggestions(workspaceId: number, type?: string): Promise<Suggestion[]> {
    return [];
  }

  async getValidSuggestions(workspaceId: number): Promise<Suggestion[]> {
    return [];
  }

  async createSuggestion(suggestion: InsertSuggestion): Promise<Suggestion> {
    throw new Error('Not implemented');
  }

  async markSuggestionUsed(id: number): Promise<Suggestion> {
    throw new Error('Not implemented');
  }

  async getCreditTransactions(userId: number, limit?: number): Promise<CreditTransaction[]> {
    return [];
  }

  async createCreditTransaction(transaction: InsertCreditTransaction): Promise<CreditTransaction> {
    throw new Error('Not implemented');
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
  async getUserAddons(userId: number): Promise<Addon[]> {
    await this.connect();
    const addons = await AddonModel.find({ userId, isActive: true });
    return addons.map(addon => this.convertAddon(addon));
  }

  async createAddon(insertAddon: InsertAddon): Promise<Addon> {
    await this.connect();
    const addon = new AddonModel(insertAddon);
    await addon.save();
    return this.convertAddon(addon);
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
      createdAt: doc.createdAt || null
    };
  }
}