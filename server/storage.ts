import { 
  users, workspaces, socialAccounts, content, analytics, 
  automationRules, suggestions, creditTransactions, referrals,
  type User, type Workspace, type SocialAccount, type Content,
  type Analytics, type AutomationRule, type Suggestion,
  type CreditTransaction, type Referral,
  type InsertUser, type InsertWorkspace, type InsertSocialAccount,
  type InsertContent, type InsertAutomationRule, type InsertAnalytics,
  type InsertSuggestion, type InsertCreditTransaction, type InsertReferral
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByReferralCode(referralCode: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User>;
  updateUserCredits(id: number, credits: number): Promise<User>;
  updateUserStripeInfo(id: number, stripeCustomerId: string, stripeSubscriptionId?: string): Promise<User>;

  // Workspace operations
  getWorkspace(id: number): Promise<Workspace | undefined>;
  getWorkspacesByUserId(userId: number | string): Promise<Workspace[]>;
  getDefaultWorkspace(userId: number): Promise<Workspace | undefined>;
  createWorkspace(workspace: InsertWorkspace): Promise<Workspace>;
  updateWorkspace(id: number, updates: Partial<Workspace>): Promise<Workspace>;
  deleteWorkspace(id: number): Promise<void>;

  // Social account operations
  getSocialAccount(id: number): Promise<SocialAccount | undefined>;
  getSocialAccountsByWorkspace(workspaceId: number): Promise<SocialAccount[]>;
  getSocialAccountByPlatform(workspaceId: number | string, platform: string): Promise<SocialAccount | undefined>;
  createSocialAccount(account: InsertSocialAccount): Promise<SocialAccount>;
  updateSocialAccount(id: number | string, updates: Partial<SocialAccount>): Promise<SocialAccount>;
  deleteSocialAccount(id: number): Promise<void>;

  // Content operations
  getContent(id: number): Promise<Content | undefined>;
  getContentByWorkspace(workspaceId: number | string, limit?: number): Promise<Content[]>;
  getScheduledContent(workspaceId?: number | string): Promise<Content[]>;
  createContent(content: InsertContent): Promise<Content>;
  updateContent(id: number, updates: Partial<Content>): Promise<Content>;
  deleteContent(id: number): Promise<void>;

  // Analytics operations
  getAnalytics(workspaceId: number, platform?: string, days?: number): Promise<Analytics[]>;
  createAnalytics(analytics: InsertAnalytics): Promise<Analytics>;
  getLatestAnalytics(workspaceId: number, platform: string): Promise<Analytics | undefined>;

  // Automation rules
  getAutomationRules(workspaceId: number): Promise<AutomationRule[]>;
  getActiveAutomationRules(): Promise<AutomationRule[]>;
  createAutomationRule(rule: InsertAutomationRule): Promise<AutomationRule>;
  updateAutomationRule(id: number, updates: Partial<AutomationRule>): Promise<AutomationRule>;
  deleteAutomationRule(id: number): Promise<void>;

  // Suggestions
  getSuggestions(workspaceId: number, type?: string): Promise<Suggestion[]>;
  getValidSuggestions(workspaceId: number): Promise<Suggestion[]>;
  createSuggestion(suggestion: InsertSuggestion): Promise<Suggestion>;
  markSuggestionUsed(id: number): Promise<Suggestion>;

  // Credit transactions
  getCreditTransactions(userId: number, limit?: number): Promise<CreditTransaction[]>;
  createCreditTransaction(transaction: InsertCreditTransaction): Promise<CreditTransaction>;

  // Referrals
  getReferrals(referrerId: number): Promise<Referral[]>;
  getReferralStats(userId: number): Promise<{ totalReferrals: number; activePaid: number; totalEarned: number }>;
  createReferral(referral: InsertReferral): Promise<Referral>;
  confirmReferral(id: number): Promise<Referral>;
  getLeaderboard(limit?: number): Promise<Array<User & { referralCount: number }>>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private workspaces: Map<number, Workspace> = new Map();
  private socialAccounts: Map<number, SocialAccount> = new Map();
  private content: Map<number, Content> = new Map();
  private analytics: Map<number, Analytics> = new Map();
  private automationRules: Map<number, AutomationRule> = new Map();
  private suggestions: Map<number, Suggestion> = new Map();
  private creditTransactions: Map<number, CreditTransaction> = new Map();
  private referrals: Map<number, Referral> = new Map();
  
  private currentUserId: number = 1;
  private currentWorkspaceId: number = 1;
  private currentSocialAccountId: number = 1;
  private currentContentId: number = 1;
  private currentAnalyticsId: number = 1;
  private currentAutomationRuleId: number = 1;
  private currentSuggestionId: number = 1;
  private currentCreditTransactionId: number = 1;
  private currentReferralId: number = 1;

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.firebaseUid === firebaseUid);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByReferralCode(referralCode: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.referralCode === referralCode);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      id,
      credits: 50,
      plan: "free",
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      referralCode: `ref_${id}_${Date.now()}`,
      totalReferrals: 0,
      totalEarned: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async updateUserCredits(id: number, credits: number): Promise<User> {
    return this.updateUser(id, { credits });
  }

  async updateUserStripeInfo(id: number, stripeCustomerId: string, stripeSubscriptionId?: string): Promise<User> {
    return this.updateUser(id, { stripeCustomerId, stripeSubscriptionId });
  }

  // Workspace operations
  async getWorkspace(id: number): Promise<Workspace | undefined> {
    return this.workspaces.get(id);
  }

  async getWorkspacesByUserId(userId: number): Promise<Workspace[]> {
    return Array.from(this.workspaces.values()).filter(workspace => workspace.userId === userId);
  }

  async getDefaultWorkspace(userId: number): Promise<Workspace | undefined> {
    return Array.from(this.workspaces.values()).find(
      workspace => workspace.userId === userId && workspace.isDefault
    );
  }

  async createWorkspace(insertWorkspace: InsertWorkspace): Promise<Workspace> {
    const id = this.currentWorkspaceId++;
    const workspace: Workspace = {
      ...insertWorkspace,
      id,
      description: insertWorkspace.description || null,
      avatar: insertWorkspace.avatar || null,
      theme: insertWorkspace.theme || "default",
      aiPersonality: insertWorkspace.aiPersonality || null,
      credits: 0,
      isDefault: insertWorkspace.isDefault || false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.workspaces.set(id, workspace);
    return workspace;
  }

  async updateWorkspace(id: number, updates: Partial<Workspace>): Promise<Workspace> {
    const workspace = this.workspaces.get(id);
    if (!workspace) throw new Error("Workspace not found");
    
    const updatedWorkspace = { ...workspace, ...updates, updatedAt: new Date() };
    this.workspaces.set(id, updatedWorkspace);
    return updatedWorkspace;
  }

  async deleteWorkspace(id: number): Promise<void> {
    this.workspaces.delete(id);
  }

  // Social account operations
  async getSocialAccount(id: number): Promise<SocialAccount | undefined> {
    return this.socialAccounts.get(id);
  }

  async getSocialAccountsByWorkspace(workspaceId: number): Promise<SocialAccount[]> {
    return Array.from(this.socialAccounts.values()).filter(account => account.workspaceId === workspaceId);
  }

  async getSocialAccountByPlatform(workspaceId: number | string, platform: string): Promise<SocialAccount | undefined> {
    return Array.from(this.socialAccounts.values()).find(
      account => account.workspaceId.toString() === workspaceId.toString() && account.platform === platform
    );
  }

  async createSocialAccount(insertAccount: InsertSocialAccount): Promise<SocialAccount> {
    const id = this.currentSocialAccountId++;
    const account: SocialAccount = {
      ...insertAccount,
      id,
      refreshToken: insertAccount.refreshToken || null,
      expiresAt: insertAccount.expiresAt || null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.socialAccounts.set(id, account);
    return account;
  }

  async updateSocialAccount(id: number | string, updates: Partial<SocialAccount>): Promise<SocialAccount> {
    const numId = typeof id === 'string' ? parseInt(id) : id;
    const account = this.socialAccounts.get(numId);
    if (!account) throw new Error("Social account not found");
    
    const updatedAccount = { ...account, ...updates, updatedAt: new Date() };
    this.socialAccounts.set(numId, updatedAccount);
    return updatedAccount;
  }

  async deleteSocialAccount(id: number): Promise<void> {
    this.socialAccounts.delete(id);
  }

  // Content operations
  async getContent(id: number): Promise<Content | undefined> {
    return this.content.get(id);
  }

  async getContentByWorkspace(workspaceId: number | string, limit = 50): Promise<Content[]> {
    const workspaceContent = Array.from(this.content.values())
      .filter(content => content.workspaceId.toString() === workspaceId.toString())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
    
    return workspaceContent.slice(0, limit);
  }

  async getScheduledContent(workspaceId?: number | string): Promise<Content[]> {
    const allContent = Array.from(this.content.values()).filter(
      content => content.status === "scheduled" && content.scheduledAt
    );
    
    // If workspaceId is provided, filter by workspace
    const filteredContent = workspaceId 
      ? allContent.filter(content => content.workspaceId.toString() === workspaceId.toString())
      : allContent;
    
    return filteredContent.sort((a, b) => (a.scheduledAt!.getTime() - b.scheduledAt!.getTime()));
  }

  async createContent(insertContent: InsertContent): Promise<Content> {
    const id = this.currentContentId++;
    const content: Content = {
      ...insertContent,
      id,
      description: insertContent.description || null,
      contentData: insertContent.contentData || null,
      prompt: insertContent.prompt || null,
      platform: insertContent.platform || null,
      status: "draft",
      creditsUsed: insertContent.creditsUsed || 0,
      scheduledAt: insertContent.scheduledAt || null,
      publishedAt: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.content.set(id, content);
    return content;
  }

  async updateContent(id: number, updates: Partial<Content>): Promise<Content> {
    const content = this.content.get(id);
    if (!content) throw new Error("Content not found");
    
    const updatedContent = { ...content, ...updates, updatedAt: new Date() };
    this.content.set(id, updatedContent);
    return updatedContent;
  }

  async deleteContent(id: number): Promise<void> {
    this.content.delete(id);
  }

  // Analytics operations
  async getAnalytics(workspaceId: number, platform?: string, days = 30): Promise<Analytics[]> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    
    return Array.from(this.analytics.values()).filter(analytics => 
      analytics.workspaceId === workspaceId &&
      (!platform || analytics.platform === platform) &&
      analytics.date >= cutoff
    ).sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async createAnalytics(insertAnalytics: InsertAnalytics): Promise<Analytics> {
    const id = this.currentAnalyticsId++;
    const analytics: Analytics = {
      ...insertAnalytics,
      id,
      contentId: insertAnalytics.contentId || null,
      postId: insertAnalytics.postId || null,
      metrics: insertAnalytics.metrics || null,
      date: insertAnalytics.date || new Date(),
      createdAt: new Date()
    };
    this.analytics.set(id, analytics);
    return analytics;
  }

  async getLatestAnalytics(workspaceId: number, platform: string): Promise<Analytics | undefined> {
    const workspaceAnalytics = Array.from(this.analytics.values())
      .filter(analytics => analytics.workspaceId === workspaceId && analytics.platform === platform)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
    
    return workspaceAnalytics[0];
  }

  // Automation rules
  async getAutomationRules(workspaceId: number): Promise<AutomationRule[]> {
    return Array.from(this.automationRules.values()).filter(rule => rule.workspaceId === workspaceId);
  }

  async getActiveAutomationRules(): Promise<AutomationRule[]> {
    return Array.from(this.automationRules.values()).filter(rule => rule.isActive);
  }

  async createAutomationRule(insertRule: InsertAutomationRule): Promise<AutomationRule> {
    const id = this.currentAutomationRuleId++;
    const rule: AutomationRule = {
      ...insertRule,
      id,
      description: insertRule.description || null,
      trigger: insertRule.trigger || null,
      action: insertRule.action || null,
      isActive: insertRule.isActive !== undefined ? insertRule.isActive : true,
      lastRun: null,
      nextRun: insertRule.nextRun || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.automationRules.set(id, rule);
    return rule;
  }

  async updateAutomationRule(id: number, updates: Partial<AutomationRule>): Promise<AutomationRule> {
    const rule = this.automationRules.get(id);
    if (!rule) throw new Error("Automation rule not found");
    
    const updatedRule = { ...rule, ...updates, updatedAt: new Date() };
    this.automationRules.set(id, updatedRule);
    return updatedRule;
  }

  async deleteAutomationRule(id: number): Promise<void> {
    this.automationRules.delete(id);
  }

  // Suggestions
  async getSuggestions(workspaceId: number, type?: string): Promise<Suggestion[]> {
    return Array.from(this.suggestions.values()).filter(suggestion => 
      suggestion.workspaceId === workspaceId &&
      (!type || suggestion.type === type)
    ).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getValidSuggestions(workspaceId: number): Promise<Suggestion[]> {
    const now = new Date();
    return Array.from(this.suggestions.values()).filter(suggestion => 
      suggestion.workspaceId === workspaceId &&
      !suggestion.isUsed &&
      (!suggestion.validUntil || suggestion.validUntil > now)
    );
  }

  async createSuggestion(insertSuggestion: InsertSuggestion): Promise<Suggestion> {
    const id = this.currentSuggestionId++;
    const suggestion: Suggestion = {
      ...insertSuggestion,
      id,
      data: insertSuggestion.data || null,
      confidence: insertSuggestion.confidence || 0,
      isUsed: false,
      validUntil: insertSuggestion.validUntil || null,
      createdAt: new Date()
    };
    this.suggestions.set(id, suggestion);
    return suggestion;
  }

  async markSuggestionUsed(id: number): Promise<Suggestion> {
    const suggestion = this.suggestions.get(id);
    if (!suggestion) throw new Error("Suggestion not found");
    
    const updatedSuggestion = { ...suggestion, isUsed: true };
    this.suggestions.set(id, updatedSuggestion);
    return updatedSuggestion;
  }

  // Credit transactions
  async getCreditTransactions(userId: number, limit = 50): Promise<CreditTransaction[]> {
    return Array.from(this.creditTransactions.values())
      .filter(transaction => transaction.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async createCreditTransaction(insertTransaction: InsertCreditTransaction): Promise<CreditTransaction> {
    const id = this.currentCreditTransactionId++;
    const transaction: CreditTransaction = {
      ...insertTransaction,
      id,
      workspaceId: insertTransaction.workspaceId || null,
      description: insertTransaction.description || null,
      referenceId: insertTransaction.referenceId || null,
      createdAt: new Date()
    };
    this.creditTransactions.set(id, transaction);
    return transaction;
  }

  // Referrals
  async getReferrals(referrerId: number): Promise<Referral[]> {
    return Array.from(this.referrals.values()).filter(referral => referral.referrerId === referrerId);
  }

  async getReferralStats(userId: number): Promise<{ totalReferrals: number; activePaid: number; totalEarned: number }> {
    const userReferrals = await this.getReferrals(userId);
    const totalReferrals = userReferrals.length;
    
    // Count paid subscribers (users with non-free plans)
    const activePaid = userReferrals.filter(referral => {
      const referredUser = this.users.get(referral.referredId);
      return referredUser && referredUser.plan !== "free";
    }).length;
    
    const totalEarned = userReferrals.reduce((sum, referral) => sum + referral.rewardAmount, 0);
    
    return { totalReferrals, activePaid, totalEarned };
  }

  async createReferral(insertReferral: InsertReferral): Promise<Referral> {
    const id = this.currentReferralId++;
    const referral: Referral = {
      ...insertReferral,
      id,
      status: "pending",
      rewardAmount: insertReferral.rewardAmount || 0,
      createdAt: new Date(),
      confirmedAt: null
    };
    this.referrals.set(id, referral);
    return referral;
  }

  async confirmReferral(id: number): Promise<Referral> {
    const referral = this.referrals.get(id);
    if (!referral) throw new Error("Referral not found");
    
    const updatedReferral = { 
      ...referral, 
      status: "confirmed" as const, 
      confirmedAt: new Date() 
    };
    this.referrals.set(id, updatedReferral);
    return updatedReferral;
  }

  async getLeaderboard(limit = 10): Promise<Array<User & { referralCount: number }>> {
    const userReferralCounts = new Map<number, number>();
    
    // Count referrals for each user
    Array.from(this.referrals.values()).forEach(referral => {
      if (referral.status === "confirmed") {
        const count = userReferralCounts.get(referral.referrerId) || 0;
        userReferralCounts.set(referral.referrerId, count + 1);
      }
    });
    
    // Get users with their referral counts
    const usersWithCounts = Array.from(this.users.values()).map(user => ({
      ...user,
      referralCount: userReferralCounts.get(user.id) || 0
    }));
    
    // Sort by referral count and return top users
    return usersWithCounts
      .sort((a, b) => b.referralCount - a.referralCount)
      .slice(0, limit);
  }
}

import { MongoStorage } from './mongodb-storage';

// Use MongoDB Atlas if connection string is available, otherwise fallback to memory storage
export const storage = process.env.MONGODB_URI ? new MongoStorage() : new MemStorage();
