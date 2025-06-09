import { 
  users, workspaces, workspaceMembers, teamInvitations, socialAccounts, content, analytics, 
  automationRules, suggestions, creditTransactions, referrals,
  subscriptions, payments, addons, contentRecommendations, userContentHistory,
  type User, type Workspace, type WorkspaceMember, type TeamInvitation, type SocialAccount, type Content,
  type Analytics, type AutomationRule, type Suggestion,
  type CreditTransaction, type Referral, type Subscription, 
  type Payment, type Addon, type ContentRecommendation, type UserContentHistory,
  type InsertUser, type InsertWorkspace, type InsertWorkspaceMember, type InsertTeamInvitation,
  type InsertSocialAccount, type InsertContent, type InsertAutomationRule, type InsertAnalytics,
  type InsertSuggestion, type InsertCreditTransaction, type InsertReferral,
  type InsertSubscription, type InsertPayment, type InsertAddon,
  type InsertContentRecommendation, type InsertUserContentHistory
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number | string): Promise<User | undefined>;
  getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByReferralCode(referralCode: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number | string, updates: Partial<User>): Promise<User>;
  updateUserCredits(id: number | string, credits: number): Promise<User>;
  updateUserStripeInfo(id: number | string, stripeCustomerId: string, stripeSubscriptionId?: string): Promise<User>;

  // Workspace operations
  getWorkspace(id: number | string): Promise<Workspace | undefined>;
  getWorkspacesByUserId(userId: number | string): Promise<Workspace[]>;
  getDefaultWorkspace(userId: number | string): Promise<Workspace | undefined>;
  getWorkspaceByInviteCode(inviteCode: string): Promise<Workspace | undefined>;
  createWorkspace(workspace: InsertWorkspace): Promise<Workspace>;
  updateWorkspace(id: number | string, updates: Partial<Workspace>): Promise<Workspace>;
  updateWorkspaceCredits(id: number | string, credits: number): Promise<void>;
  deleteWorkspace(id: number | string): Promise<void>;
  setDefaultWorkspace(userId: number | string, workspaceId: number | string): Promise<void>;

  // Team management operations
  getWorkspaceMember(workspaceId: number, userId: number): Promise<WorkspaceMember | undefined>;
  getWorkspaceMembers(workspaceId: number): Promise<(WorkspaceMember & { user: User })[]>;
  addWorkspaceMember(member: InsertWorkspaceMember): Promise<WorkspaceMember>;
  updateWorkspaceMember(workspaceId: number, userId: number, updates: Partial<WorkspaceMember>): Promise<WorkspaceMember>;
  removeWorkspaceMember(workspaceId: number, userId: number): Promise<void>;
  
  // Team invitation operations
  createTeamInvitation(invitation: InsertTeamInvitation): Promise<TeamInvitation>;
  getTeamInvitation(id: number): Promise<TeamInvitation | undefined>;
  getTeamInvitationByToken(token: string): Promise<TeamInvitation | undefined>;
  getTeamInvitations(workspaceId: number, status?: string): Promise<TeamInvitation[]>;
  getWorkspaceInvitations(workspaceId: number): Promise<TeamInvitation[]>;
  updateTeamInvitation(id: number, updates: Partial<TeamInvitation>): Promise<TeamInvitation>;

  // Social account operations
  getSocialAccount(id: number | string): Promise<SocialAccount | undefined>;
  getSocialAccountsByWorkspace(workspaceId: number | string): Promise<SocialAccount[]>;
  getAllSocialAccounts(): Promise<SocialAccount[]>;
  getSocialAccountByPlatform(workspaceId: number | string, platform: string): Promise<SocialAccount | undefined>;
  getSocialConnections(userId: number): Promise<SocialAccount[]>;
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
  getAutomationRules(workspaceId: number | string): Promise<AutomationRule[]>;
  getActiveAutomationRules(): Promise<AutomationRule[]>;
  getAutomationRulesByType(type: string): Promise<AutomationRule[]>;
  createAutomationRule(rule: InsertAutomationRule): Promise<AutomationRule>;
  updateAutomationRule(id: string, updates: Partial<AutomationRule>): Promise<AutomationRule>;
  deleteAutomationRule(id: string): Promise<void>;
  
  // Automation logs
  getAutomationLogs(workspaceId: string | number, options?: { limit?: number; type?: string }): Promise<any[]>;
  createAutomationLog(log: any): Promise<any>;
  
  // Social accounts
  getAllSocialAccounts(): Promise<SocialAccount[]>;

  // Suggestions
  getSuggestions(workspaceId: number, type?: string): Promise<Suggestion[]>;
  getSuggestionsByWorkspace(workspaceId: string | number): Promise<Suggestion[]>;
  getValidSuggestions(workspaceId: number): Promise<Suggestion[]>;
  createSuggestion(suggestion: InsertSuggestion): Promise<Suggestion>;
  markSuggestionUsed(id: number): Promise<Suggestion>;
  clearSuggestionsByWorkspace(workspaceId: string | number): Promise<void>;
  
  // Analytics by workspace
  getAnalyticsByWorkspace(workspaceId: string | number): Promise<Analytics[]>;

  // Credit transactions
  getCreditTransactions(userId: number, limit?: number): Promise<CreditTransaction[]>;
  createCreditTransaction(transaction: InsertCreditTransaction): Promise<CreditTransaction>;

  // Referrals
  getReferrals(referrerId: number): Promise<Referral[]>;
  getReferralStats(userId: number): Promise<{ totalReferrals: number; activePaid: number; totalEarned: number }>;
  createReferral(referral: InsertReferral): Promise<Referral>;
  confirmReferral(id: number): Promise<Referral>;
  getLeaderboard(limit?: number): Promise<Array<User & { referralCount: number }>>;

  // Subscription operations
  getSubscription(userId: number): Promise<Subscription | undefined>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  updateSubscriptionStatus(userId: number, status: string, canceledAt?: Date): Promise<Subscription>;

  // Payment operations
  createPayment(payment: InsertPayment): Promise<Payment>;
  getPaymentsByUser(userId: number): Promise<Payment[]>;

  // Addon operations
  getUserAddons(userId: number | string): Promise<Addon[]>;
  getActiveAddonsByUser(userId: number): Promise<Addon[]>;
  createAddon(addon: InsertAddon): Promise<Addon>;

  // Content recommendation operations
  getContentRecommendation(id: number): Promise<ContentRecommendation | undefined>;
  getContentRecommendations(workspaceId: number, type?: string, limit?: number): Promise<ContentRecommendation[]>;
  createContentRecommendation(recommendation: InsertContentRecommendation): Promise<ContentRecommendation>;
  updateContentRecommendation(id: number, updates: Partial<ContentRecommendation>): Promise<ContentRecommendation>;

  // User content history operations
  getUserContentHistory(userId: number, workspaceId: number): Promise<UserContentHistory[]>;
  createUserContentHistory(history: InsertUserContentHistory): Promise<UserContentHistory>;

  // Pricing and plan operations
  getPricingData(): Promise<any>;
  updateUserSubscription(userId: number | string, planId: string): Promise<User>;
  addCreditsToUser(userId: number | string, credits: number): Promise<User>;

  // Conversation management operations
  createDmConversation(conversation: any): Promise<any>;
  createDmMessage(message: any): Promise<any>;
  createConversationContext(context: any): Promise<any>;
  clearWorkspaceConversations(workspaceId: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private workspaces: Map<number, Workspace> = new Map();
  private workspaceMembers: Map<string, WorkspaceMember> = new Map(); // key: `${workspaceId}-${userId}`
  private teamInvitations: Map<number, TeamInvitation> = new Map();
  private socialAccounts: Map<number, SocialAccount> = new Map();
  private content: Map<number, Content> = new Map();
  private analytics: Map<number, Analytics> = new Map();
  private automationRules: Map<number, AutomationRule> = new Map();
  private suggestions: Map<number, Suggestion> = new Map();
  private creditTransactions: Map<number, CreditTransaction> = new Map();
  private referrals: Map<number, Referral> = new Map();
  private subscriptions: Map<number, Subscription> = new Map();
  private payments: Map<number, Payment> = new Map();
  private addons: Map<number, Addon> = new Map();
  private contentRecommendations: Map<number, ContentRecommendation> = new Map();
  private userContentHistory: Map<number, UserContentHistory> = new Map();
  
  private currentUserId: number = 1;
  private currentWorkspaceId: number = 1;
  private currentWorkspaceMemberId: number = 1;
  private currentTeamInvitationId: number = 1;
  private currentSocialAccountId: number = 1;
  private currentContentId: number = 1;
  private currentAnalyticsId: number = 1;
  private currentAutomationRuleId: number = 1;
  private currentSuggestionId: number = 1;
  private currentCreditTransactionId: number = 1;
  private currentReferralId: number = 1;
  private currentSubscriptionId: number = 1;
  private currentPaymentId: number = 1;
  private currentAddonId: number = 1;
  private currentContentRecommendationId: number = 1;
  private currentUserContentHistoryId: number = 1;

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
      credits: 0,
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

  async updateUser(id: number | string, updates: Partial<User>): Promise<User> {
    const numId = typeof id === 'string' ? parseInt(id) : id;
    const user = this.users.get(numId);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(numId, updatedUser);
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

  async updateWorkspaceCredits(id: number | string, credits: number): Promise<void> {
    const numericId = typeof id === 'string' ? parseInt(id) : id;
    const workspace = this.workspaces.get(numericId);
    if (!workspace) throw new Error("Workspace not found");
    
    const updatedWorkspace = { ...workspace, credits, updatedAt: new Date() };
    this.workspaces.set(numericId, updatedWorkspace);
  }

  async deleteWorkspace(id: number): Promise<void> {
    this.workspaces.delete(id);
  }

  async setDefaultWorkspace(userId: number | string, workspaceId: number | string): Promise<void> {
    const userIdNum = typeof userId === 'string' ? parseInt(userId) : userId;
    const workspaceIdNum = typeof workspaceId === 'string' ? parseInt(workspaceId) : workspaceId;
    
    // First, unset all default workspaces for this user
    for (const workspace of this.workspaces.values()) {
      if (workspace.userId === userIdNum && workspace.isDefault) {
        workspace.isDefault = false;
        workspace.updatedAt = new Date();
      }
    }
    
    // Then set the specified workspace as default
    const targetWorkspace = this.workspaces.get(workspaceIdNum);
    if (targetWorkspace && targetWorkspace.userId === userIdNum) {
      targetWorkspace.isDefault = true;
      targetWorkspace.updatedAt = new Date();
    }
  }

  async getWorkspaceByInviteCode(inviteCode: string): Promise<Workspace | undefined> {
    return Array.from(this.workspaces.values()).find(workspace => workspace.inviteCode === inviteCode);
  }

  // Team management operations
  async getWorkspaceMember(workspaceId: number, userId: number): Promise<WorkspaceMember | undefined> {
    return this.workspaceMembers.get(`${workspaceId}-${userId}`);
  }

  async getWorkspaceMembers(workspaceId: number): Promise<(WorkspaceMember & { user: User })[]> {
    const members: (WorkspaceMember & { user: User })[] = [];
    
    for (const member of this.workspaceMembers.values()) {
      if (member.workspaceId === workspaceId) {
        const user = this.users.get(member.userId);
        if (user) {
          members.push({ ...member, user });
        }
      }
    }
    
    return members;
  }

  async addWorkspaceMember(insertMember: InsertWorkspaceMember): Promise<WorkspaceMember> {
    const id = this.currentWorkspaceMemberId++;
    const member: WorkspaceMember = {
      ...insertMember,
      id,
      invitedAt: new Date(),
      joinedAt: new Date()
    };
    
    this.workspaceMembers.set(`${member.workspaceId}-${member.userId}`, member);
    return member;
  }

  async updateWorkspaceMember(workspaceId: number, userId: number, updates: Partial<WorkspaceMember>): Promise<WorkspaceMember> {
    const member = this.workspaceMembers.get(`${workspaceId}-${userId}`);
    if (!member) throw new Error("Workspace member not found");
    
    const updatedMember = { ...member, ...updates };
    this.workspaceMembers.set(`${workspaceId}-${userId}`, updatedMember);
    return updatedMember;
  }

  async removeWorkspaceMember(workspaceId: number, userId: number): Promise<void> {
    this.workspaceMembers.delete(`${workspaceId}-${userId}`);
  }

  // Team invitation operations
  async createTeamInvitation(insertInvitation: InsertTeamInvitation): Promise<TeamInvitation> {
    const id = this.currentTeamInvitationId++;
    const invitation: TeamInvitation = {
      ...insertInvitation,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.teamInvitations.set(id, invitation);
    return invitation;
  }

  async getTeamInvitation(id: number): Promise<TeamInvitation | undefined> {
    return this.teamInvitations.get(id);
  }

  async getTeamInvitationByToken(token: string): Promise<TeamInvitation | undefined> {
    return Array.from(this.teamInvitations.values()).find(invitation => invitation.token === token);
  }

  async getTeamInvitations(workspaceId: number, status?: string): Promise<TeamInvitation[]> {
    return Array.from(this.teamInvitations.values()).filter(invitation => 
      invitation.workspaceId === workspaceId && (!status || invitation.status === status)
    );
  }

  async getWorkspaceInvitations(workspaceId: number): Promise<TeamInvitation[]> {
    return this.getTeamInvitations(workspaceId, 'pending');
  }

  async updateTeamInvitation(id: number, updates: Partial<TeamInvitation>): Promise<TeamInvitation> {
    const invitation = this.teamInvitations.get(id);
    if (!invitation) throw new Error("Team invitation not found");
    
    const updatedInvitation = { ...invitation, ...updates, updatedAt: new Date() };
    this.teamInvitations.set(id, updatedInvitation);
    return updatedInvitation;
  }

  // Social account operations
  async getSocialAccount(id: number): Promise<SocialAccount | undefined> {
    return this.socialAccounts.get(id);
  }

  async getSocialAccountsByWorkspace(workspaceId: number): Promise<SocialAccount[]> {
    return Array.from(this.socialAccounts.values()).filter(account => account.workspaceId === workspaceId);
  }

  async getAllSocialAccounts(): Promise<SocialAccount[]> {
    return Array.from(this.socialAccounts.values());
  }

  async updateSocialAccount(id: number, updates: Partial<SocialAccount>): Promise<SocialAccount> {
    const account = this.socialAccounts.get(id);
    if (!account) {
      throw new Error(`Social account with id ${id} not found`);
    }
    
    const updatedAccount = { ...account, ...updates, updatedAt: new Date() };
    this.socialAccounts.set(id, updatedAccount);
    return updatedAccount;
  }

  async getSocialAccountByPlatform(workspaceId: number | string, platform: string): Promise<SocialAccount | undefined> {
    return Array.from(this.socialAccounts.values()).find(
      account => account.workspaceId.toString() === workspaceId.toString() && account.platform === platform
    );
  }

  async getSocialConnections(userId: number): Promise<SocialAccount[]> {
    const userWorkspaces = await this.getWorkspacesByUserId(userId);
    const workspaceIds = userWorkspaces.map(w => w.id);
    return Array.from(this.socialAccounts.values()).filter(
      account => workspaceIds.includes(account.workspaceId)
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
  async getAutomationRules(workspaceId: number | string): Promise<AutomationRule[]> {
    return Array.from(this.automationRules.values()).filter(rule => 
      rule.workspaceId.toString() === workspaceId.toString()
    );
  }

  async getActiveAutomationRules(): Promise<AutomationRule[]> {
    return Array.from(this.automationRules.values()).filter(rule => rule.isActive);
  }

  async getAutomationRulesByType(type: string): Promise<AutomationRule[]> {
    return Array.from(this.automationRules.values()).filter(rule => 
      rule.isActive && 
      (rule.trigger?.type === type || rule.action?.type === type)
    );
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

  async updateAutomationRule(id: string, updates: Partial<AutomationRule>): Promise<AutomationRule> {
    const numericId = parseInt(id);
    const rule = this.automationRules.get(numericId);
    if (!rule) throw new Error("Automation rule not found");
    
    const updatedRule = { ...rule, ...updates, updatedAt: new Date() };
    this.automationRules.set(numericId, updatedRule);
    return updatedRule;
  }

  async deleteAutomationRule(id: string): Promise<void> {
    const numericId = parseInt(id);
    this.automationRules.delete(numericId);
  }

  async getAutomationRulesByWorkspace(workspaceId: string | number): Promise<AutomationRule[]> {
    const wsId = typeof workspaceId === 'string' ? parseInt(workspaceId) : workspaceId;
    return Array.from(this.automationRules.values())
      .filter(rule => rule.workspaceId === wsId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getAutomationLogs(workspaceId: string | number, options?: { limit?: number; type?: string }): Promise<any[]> {
    // For now, return empty array - logs would be stored separately in a real implementation
    return [];
  }

  async createAutomationLog(log: any): Promise<any> {
    // For now, just return the log - in a real implementation, this would store to database
    return { ...log, id: Date.now(), createdAt: new Date() };
  }

  async getAllSocialAccounts(): Promise<SocialAccount[]> {
    return Array.from(this.socialAccounts.values());
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

  async getSuggestionsByWorkspace(workspaceId: string | number): Promise<Suggestion[]> {
    const wsId = typeof workspaceId === 'string' ? parseInt(workspaceId) : workspaceId;
    return Array.from(this.suggestions.values())
      .filter(suggestion => suggestion.workspaceId === wsId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async clearSuggestionsByWorkspace(workspaceId: string | number): Promise<void> {
    const wsId = typeof workspaceId === 'string' ? parseInt(workspaceId) : workspaceId;
    const suggestionIds = Array.from(this.suggestions.entries())
      .filter(([id, suggestion]) => suggestion.workspaceId === wsId)
      .map(([id]) => id);
    
    for (const id of suggestionIds) {
      this.suggestions.delete(id);
    }
  }

  async getAnalyticsByWorkspace(workspaceId: string | number): Promise<Analytics[]> {
    const wsId = typeof workspaceId === 'string' ? parseInt(workspaceId) : workspaceId;
    return Array.from(this.analytics.values())
      .filter(analytics => analytics.workspaceId === wsId)
      .sort((a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0));
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

  // Subscription operations
  async getSubscription(userId: number): Promise<Subscription | undefined> {
    return Array.from(this.subscriptions.values()).find(subscription => subscription.userId === userId);
  }

  async createSubscription(insertSubscription: InsertSubscription): Promise<Subscription> {
    const id = this.currentSubscriptionId++;
    const subscription: Subscription = {
      ...insertSubscription,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.subscriptions.set(id, subscription);
    return subscription;
  }

  async updateSubscriptionStatus(userId: number, status: string, canceledAt?: Date): Promise<Subscription> {
    const subscription = Array.from(this.subscriptions.values()).find(sub => sub.userId === userId);
    if (!subscription) throw new Error("Subscription not found");
    
    const updatedSubscription = {
      ...subscription,
      status,
      canceledAt,
      updatedAt: new Date()
    };
    this.subscriptions.set(subscription.id, updatedSubscription);
    return updatedSubscription;
  }

  // Payment operations
  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const id = this.currentPaymentId++;
    const payment: Payment = {
      ...insertPayment,
      id,
      createdAt: new Date()
    };
    this.payments.set(id, payment);
    return payment;
  }

  async getPaymentsByUser(userId: number): Promise<Payment[]> {
    return Array.from(this.payments.values()).filter(payment => payment.userId === userId);
  }

  // Addon operations
  async getUserAddons(userId: number): Promise<Addon[]> {
    return Array.from(this.addons.values()).filter(addon => addon.userId === userId && addon.isActive);
  }

  async getActiveAddonsByUser(userId: number): Promise<Addon[]> {
    const now = new Date();
    return Array.from(this.addons.values()).filter(addon => 
      addon.userId === userId && 
      addon.isActive && 
      (addon.expiresAt === null || addon.expiresAt > now)
    );
  }

  async createAddon(insertAddon: InsertAddon): Promise<Addon> {
    const id = this.currentAddonId++;
    const addon: Addon = {
      ...insertAddon,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.addons.set(id, addon);
    return addon;
  }

  // Content recommendation operations
  async getContentRecommendation(id: number): Promise<ContentRecommendation | undefined> {
    return this.contentRecommendations.get(id);
  }

  async getContentRecommendations(workspaceId: number, type?: string, limit?: number): Promise<ContentRecommendation[]> {
    let recommendations = Array.from(this.contentRecommendations.values())
      .filter(rec => rec.workspaceId === workspaceId && rec.isActive);
    
    if (type) {
      recommendations = recommendations.filter(rec => rec.type === type);
    }

    // Sort by creation date (newest first)
    recommendations.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());

    if (limit) {
      recommendations = recommendations.slice(0, limit);
    }

    return recommendations;
  }

  async createContentRecommendation(insertRecommendation: InsertContentRecommendation): Promise<ContentRecommendation> {
    const id = this.currentContentRecommendationId++;
    const recommendation: ContentRecommendation = {
      ...insertRecommendation,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.contentRecommendations.set(id, recommendation);
    return recommendation;
  }

  async updateContentRecommendation(id: number, updates: Partial<ContentRecommendation>): Promise<ContentRecommendation> {
    const existing = this.contentRecommendations.get(id);
    if (!existing) {
      throw new Error(`Content recommendation ${id} not found`);
    }

    const updated: ContentRecommendation = {
      ...existing,
      ...updates,
      updatedAt: new Date()
    };
    this.contentRecommendations.set(id, updated);
    return updated;
  }

  // User content history operations
  async getUserContentHistory(userId: number, workspaceId: number): Promise<UserContentHistory[]> {
    return Array.from(this.userContentHistory.values())
      .filter(history => history.userId === userId && history.workspaceId === workspaceId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async createUserContentHistory(insertHistory: InsertUserContentHistory): Promise<UserContentHistory> {
    const id = this.currentUserContentHistoryId++;
    const history: UserContentHistory = {
      ...insertHistory,
      id,
      createdAt: new Date()
    };
    this.userContentHistory.set(id, history);
    return history;
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
          credits: 0,
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
    const numId = typeof userId === 'string' ? parseInt(userId) : userId;
    return this.updateUser(numId, { plan: planId });
  }

  async addCreditsToUser(userId: number | string, credits: number): Promise<User> {
    const numId = typeof userId === 'string' ? parseInt(userId) : userId;
    const user = this.users.get(numId);
    if (!user) throw new Error("User not found");
    
    const newCredits = (user.credits || 0) + credits;
    return this.updateUser(numId, { credits: newCredits });
  }
}

import { MongoStorage } from './mongodb-storage';

// Use MongoDB Atlas if connection string is available, otherwise fallback to memory storage
export const storage = (process.env.MONGODB_URI || process.env.DATABASE_URL) ? new MongoStorage() : new MemStorage();
