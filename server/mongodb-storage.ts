import mongoose from "mongoose";
import { IStorage } from "./storage";
import {
  User, Workspace, SocialAccount, Content, Analytics, AutomationRule,
  Suggestion, CreditTransaction, Referral, Subscription, Payment, Addon,
  WorkspaceMember, TeamInvitation,
  InsertUser, InsertWorkspace, InsertSocialAccount, InsertContent,
  InsertAutomationRule, InsertAnalytics, InsertSuggestion,
  InsertCreditTransaction, InsertReferral, InsertSubscription, InsertPayment, InsertAddon,
  InsertWorkspaceMember, InsertTeamInvitation
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

const WorkspaceMemberSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.Mixed, required: true },
  workspaceId: { type: mongoose.Schema.Types.Mixed, required: true },
  role: { type: String, required: true, enum: ['owner', 'editor', 'viewer'] },
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
  role: { type: String, required: true, enum: ['editor', 'viewer'] },
  status: { type: String, default: 'pending' },
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
  invitedBy: { type: mongoose.Schema.Types.Mixed, required: true },
  permissions: { type: mongoose.Schema.Types.Mixed, default: {} },
  acceptedAt: Date,
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
const WorkspaceMemberModel = mongoose.model('WorkspaceMember', WorkspaceMemberSchema);
const TeamInvitationModel = mongoose.model('TeamInvitation', TeamInvitationSchema);

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

  async updateUserCredits(id: number | string, credits: number): Promise<User> {
    return this.updateUser(id, { credits });
  }

  async updateUserStripeInfo(id: number | string, stripeCustomerId: string, stripeSubscriptionId?: string): Promise<User> {
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

  async getCreditTransactions(userId: number, limit?: number): Promise<CreditTransaction[]> {
    return [];
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
      createdAt: doc.createdAt || null
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
    const members = await WorkspaceMemberModel.find({ 
      workspaceId: workspaceId.toString() 
    });
    
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
    
    // If no members found, add the workspace owner as a member
    if (result.length === 0) {
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
          result.push(ownerMember);
        }
      }
    }
    
    return result;
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
    
    return this.convertTeamInvitation(newInvitation);
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
      id: parseInt(doc._id?.toString() || doc.id),
      userId: parseInt(doc.userId),
      workspaceId: parseInt(doc.workspaceId),
      role: doc.role,
      status: doc.status || null,
      permissions: doc.permissions || null,
      invitedBy: doc.invitedBy ? parseInt(doc.invitedBy) : null,
      joinedAt: doc.joinedAt || null,
      createdAt: doc.createdAt || null,
      updatedAt: doc.updatedAt || null
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
}