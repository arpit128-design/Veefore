import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firebaseUid: text("firebase_uid").notNull().unique(),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  displayName: text("display_name"),
  avatar: text("avatar"),
  credits: integer("credits").default(50),
  plan: text("plan").default("free"), // free, pro, agency, enterprise
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  referralCode: text("referral_code").unique(),
  referredBy: text("referred_by"),
  totalReferrals: integer("total_referrals").default(0),
  totalEarned: integer("total_earned").default(0),
  isOnboarded: boolean("is_onboarded").default(false),
  preferences: json("preferences"), // User preferences for AI personalization
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const workspaces = pgTable("workspaces", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  avatar: text("avatar"),
  theme: text("theme").default("default"),
  aiPersonality: text("ai_personality"),
  credits: integer("credits").default(0),
  isDefault: boolean("is_default").default(false),
  maxTeamMembers: integer("max_team_members").default(1), // Based on subscription
  inviteCode: text("invite_code").unique(), // For easy team invites
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Workspace team members and roles
export const workspaceMembers = pgTable("workspace_members", {
  id: serial("id").primaryKey(),
  workspaceId: integer("workspace_id").references(() => workspaces.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  role: text("role").notNull(), // owner, editor, viewer
  permissions: json("permissions"), // Custom permissions object
  invitedBy: integer("invited_by").references(() => users.id),
  joinedAt: timestamp("joined_at").defaultNow(),
  status: text("status").default("active"), // active, pending, suspended
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Team invitations
export const teamInvitations = pgTable("team_invitations", {
  id: serial("id").primaryKey(),
  workspaceId: integer("workspace_id").references(() => workspaces.id).notNull(),
  invitedBy: integer("invited_by").references(() => users.id).notNull(),
  email: text("email").notNull(),
  role: text("role").notNull(), // editor, viewer
  permissions: json("permissions"),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  status: text("status").default("pending"), // pending, accepted, expired, cancelled
  acceptedAt: timestamp("accepted_at"),
  createdAt: timestamp("created_at").defaultNow()
});

export const socialAccounts = pgTable("social_accounts", {
  id: serial("id").primaryKey(),
  workspaceId: integer("workspace_id").references(() => workspaces.id).notNull(),
  platform: text("platform").notNull(), // instagram, twitter, youtube, tiktok
  accountId: text("account_id").notNull(),
  username: text("username").notNull(),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token"),
  expiresAt: timestamp("expires_at"),
  isActive: boolean("is_active").default(true),
  // Instagram-specific profile data
  followersCount: integer("followers_count"),
  followingCount: integer("following_count"),
  mediaCount: integer("media_count"),
  biography: text("biography"),
  website: text("website"),
  profilePictureUrl: text("profile_picture_url"),
  accountType: text("account_type"), // PERSONAL, BUSINESS, CREATOR
  isBusinessAccount: boolean("is_business_account").default(false),
  isVerified: boolean("is_verified").default(false),
  // Performance metrics for AI analysis
  avgLikes: integer("avg_likes"),
  avgComments: integer("avg_comments"),
  avgReach: integer("avg_reach"),
  engagementRate: integer("engagement_rate"), // stored as percentage * 100 (e.g., 3.45% = 345)
  // Instagram Business API engagement totals
  totalLikes: integer("total_likes"),
  totalComments: integer("total_comments"),
  totalReach: integer("total_reach"),
  avgEngagement: integer("avg_engagement"), // stored as percentage * 100
  lastSyncAt: timestamp("last_sync_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const content = pgTable("content", {
  id: serial("id").primaryKey(),
  workspaceId: integer("workspace_id").references(() => workspaces.id).notNull(),
  type: text("type").notNull(), // video, reel, post, caption, thumbnail
  title: text("title").notNull(),
  description: text("description"),
  contentData: json("content_data"), // Generated content, URLs, etc.
  prompt: text("prompt"),
  platform: text("platform"),
  status: text("status").default("draft"), // draft, ready, published, scheduled
  creditsUsed: integer("credits_used").default(0),
  scheduledAt: timestamp("scheduled_at"),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  workspaceId: integer("workspace_id").references(() => workspaces.id).notNull(),
  contentId: integer("content_id").references(() => content.id),
  platform: text("platform").notNull(),
  postId: text("post_id"),
  metrics: json("metrics"), // views, likes, comments, shares, etc.
  date: timestamp("date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow()
});

export const automationRules = pgTable("automation_rules", {
  id: serial("id").primaryKey(),
  workspaceId: integer("workspace_id").references(() => workspaces.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  trigger: json("trigger"), // Trigger conditions
  action: json("action"), // Action to perform
  isActive: boolean("is_active").default(true),
  lastRun: timestamp("last_run"),
  nextRun: timestamp("next_run"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const suggestions = pgTable("suggestions", {
  id: serial("id").primaryKey(),
  workspaceId: integer("workspace_id").references(() => workspaces.id).notNull(),
  type: text("type").notNull(), // trending, audio, hashtag, content
  data: json("data"), // Suggestion content
  confidence: integer("confidence").default(0), // 0-100
  isUsed: boolean("is_used").default(false),
  validUntil: timestamp("valid_until"),
  createdAt: timestamp("created_at").defaultNow()
});

export const contentRecommendations = pgTable("content_recommendations", {
  id: serial("id").primaryKey(),
  workspaceId: integer("workspace_id").references(() => workspaces.id).notNull(),
  type: text("type").notNull(), // video, reel, audio
  title: text("title").notNull(),
  description: text("description"),
  thumbnailUrl: text("thumbnail_url"),
  mediaUrl: text("media_url"),
  duration: integer("duration"), // in seconds
  category: text("category"), // niche/interest category
  country: text("country"), // country code for regional content
  tags: json("tags"), // array of relevant tags
  engagement: json("engagement"), // likes, views, shares data
  sourceUrl: text("source_url"), // original source reference
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const userContentHistory = pgTable("user_content_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  workspaceId: integer("workspace_id").references(() => workspaces.id).notNull(),
  recommendationId: integer("recommendation_id").references(() => contentRecommendations.id),
  action: text("action").notNull(), // viewed, liked, created_similar, dismissed
  metadata: json("metadata"), // additional tracking data
  createdAt: timestamp("created_at").defaultNow()
});

export const automationLogs = pgTable("automation_logs", {
  id: serial("id").primaryKey(),
  ruleId: integer("rule_id").references(() => automationRules.id).notNull(),
  workspaceId: integer("workspace_id").references(() => workspaces.id).notNull(),
  type: text("type").notNull(), // comment, dm
  targetUserId: text("target_user_id"),
  targetUsername: text("target_username"),
  message: text("message").notNull(),
  status: text("status").notNull(), // sent, failed, pending
  errorMessage: text("error_message"),
  sentAt: timestamp("sent_at").defaultNow()
});

export const creditTransactions = pgTable("credit_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  workspaceId: integer("workspace_id").references(() => workspaces.id),
  type: text("type").notNull(), // purchase, earned, used, refund
  amount: integer("amount").notNull(),
  description: text("description"),
  referenceId: text("reference_id"), // Stripe payment intent, content ID, etc.
  createdAt: timestamp("created_at").defaultNow()
});

export const referrals = pgTable("referrals", {
  id: serial("id").primaryKey(),
  referrerId: integer("referrer_id").references(() => users.id).notNull(),
  referredId: integer("referred_id").references(() => users.id).notNull(),
  status: text("status").default("pending"), // pending, confirmed, rewarded
  rewardAmount: integer("reward_amount").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  confirmedAt: timestamp("confirmed_at")
});

export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  plan: text("plan").notNull(), // free, creator-pro, agency-suite, enterprise
  status: text("status").notNull(), // active, canceled, expired, trial
  priceId: text("price_id"), // Razorpay price ID
  subscriptionId: text("subscription_id"), // Razorpay subscription ID
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  trialEnd: timestamp("trial_end"),
  canceledAt: timestamp("canceled_at"),
  monthlyCredits: integer("monthly_credits").default(60),
  extraCredits: integer("extra_credits").default(0),
  autoRenew: boolean("auto_renew").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const creditPackages = pgTable("credit_packages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  credits: integer("credits").notNull(),
  price: integer("price").notNull(), // Price in paise/cents
  currency: text("currency").default("INR"),
  bonusPercentage: integer("bonus_percentage").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  razorpayOrderId: text("razorpay_order_id").notNull(),
  razorpayPaymentId: text("razorpay_payment_id"),
  razorpaySignature: text("razorpay_signature"),
  amount: integer("amount").notNull(),
  currency: text("currency").default("INR"),
  status: text("status").default("created"), // created, paid, failed, refunded
  purpose: text("purpose").notNull(), // subscription, credits, addon
  metadata: json("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const addons = pgTable("addons", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // workspace, social-account, ai-visual, etc.
  name: text("name").notNull(),
  price: integer("price").notNull(),
  isActive: boolean("is_active").default(true),
  expiresAt: timestamp("expires_at"),
  metadata: json("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// DM Conversation Memory System for 3-day contextual AI responses
export const dmConversations = pgTable("dm_conversations", {
  id: serial("id").primaryKey(),
  workspaceId: integer("workspace_id").references(() => workspaces.id).notNull(),
  platform: text("platform").notNull(), // instagram, twitter, etc.
  participantId: text("participant_id").notNull(), // Instagram user ID or handle
  participantUsername: text("participant_username"), // Display name for reference
  lastMessageAt: timestamp("last_message_at").defaultNow(),
  messageCount: integer("message_count").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const dmMessages = pgTable("dm_messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").references(() => dmConversations.id).notNull(),
  messageId: text("message_id"), // Platform-specific message ID
  sender: text("sender").notNull(), // 'user' or 'ai'
  content: text("content").notNull(),
  messageType: text("message_type").default("text"), // text, image, sticker, etc.
  sentiment: text("sentiment"), // positive, negative, neutral (AI analyzed)
  topics: text("topics").array(), // Extracted topics/keywords for context
  aiResponse: boolean("ai_response").default(false),
  automationRuleId: integer("automation_rule_id").references(() => automationRules.id),
  createdAt: timestamp("created_at").defaultNow()
});

// Enhanced conversation context for better AI responses
export const conversationContext = pgTable("conversation_context", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").references(() => dmConversations.id).notNull(),
  contextType: text("context_type").notNull(), // topic, preference, question, intent
  contextValue: text("context_value").notNull(),
  confidence: integer("confidence").default(100), // 0-100 confidence score
  extractedAt: timestamp("extracted_at").defaultNow(),
  expiresAt: timestamp("expires_at") // For 3-day memory cleanup
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  firebaseUid: true,
  email: true,
  username: true,
  displayName: true,
  avatar: true,
  referredBy: true
});

export const insertWorkspaceSchema = createInsertSchema(workspaces).pick({
  userId: true,
  name: true,
  description: true,
  avatar: true,
  theme: true,
  aiPersonality: true,
  isDefault: true
});

export const insertWorkspaceMemberSchema = createInsertSchema(workspaceMembers).pick({
  workspaceId: true,
  userId: true,
  role: true,
  permissions: true,
  invitedBy: true
});

export const insertTeamInvitationSchema = createInsertSchema(teamInvitations).pick({
  workspaceId: true,
  invitedBy: true,
  email: true,
  role: true,
  permissions: true,
  token: true,
  expiresAt: true
});

export const insertSocialAccountSchema = createInsertSchema(socialAccounts).pick({
  workspaceId: true,
  platform: true,
  accountId: true,
  username: true,
  accessToken: true,
  refreshToken: true,
  expiresAt: true
});

export const insertContentSchema = createInsertSchema(content).pick({
  workspaceId: true,
  type: true,
  title: true,
  description: true,
  contentData: true,
  prompt: true,
  platform: true,
  status: true,
  creditsUsed: true,
  scheduledAt: true
}).extend({
  workspaceId: z.union([z.number(), z.string()])
});

export const insertAutomationRuleSchema = createInsertSchema(automationRules).pick({
  workspaceId: true,
  name: true,
  description: true,
  trigger: true,
  action: true,
  isActive: true,
  nextRun: true
});

export const insertAnalyticsSchema = createInsertSchema(analytics).pick({
  workspaceId: true,
  contentId: true,
  platform: true,
  postId: true,
  metrics: true,
  date: true
});

export const insertSuggestionSchema = createInsertSchema(suggestions).pick({
  workspaceId: true,
  type: true,
  data: true,
  confidence: true,
  validUntil: true
});

export const insertCreditTransactionSchema = createInsertSchema(creditTransactions).pick({
  userId: true,
  workspaceId: true,
  type: true,
  amount: true,
  description: true,
  referenceId: true
});

export const insertReferralSchema = createInsertSchema(referrals).pick({
  referrerId: true,
  referredId: true,
  rewardAmount: true
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).pick({
  userId: true,
  plan: true,
  status: true,
  priceId: true,
  subscriptionId: true,
  currentPeriodStart: true,
  currentPeriodEnd: true,
  trialEnd: true,
  monthlyCredits: true,
  extraCredits: true,
  autoRenew: true
});

export const insertCreditPackageSchema = createInsertSchema(creditPackages).pick({
  name: true,
  credits: true,
  price: true,
  currency: true,
  bonusPercentage: true,
  isActive: true
});

export const insertPaymentSchema = createInsertSchema(payments).pick({
  userId: true,
  razorpayOrderId: true,
  razorpayPaymentId: true,
  razorpaySignature: true,
  amount: true,
  currency: true,
  status: true,
  purpose: true,
  metadata: true
});

export const insertAddonSchema = createInsertSchema(addons).pick({
  userId: true,
  type: true,
  name: true,
  price: true,
  isActive: true,
  expiresAt: true,
  metadata: true
});

export const insertDmConversationSchema = createInsertSchema(dmConversations).pick({
  workspaceId: true,
  platform: true,
  participantId: true,
  participantUsername: true
});

export const insertDmMessageSchema = createInsertSchema(dmMessages).pick({
  conversationId: true,
  messageId: true,
  sender: true,
  content: true,
  messageType: true,
  sentiment: true,
  topics: true,
  aiResponse: true,
  automationRuleId: true
});

export const insertConversationContextSchema = createInsertSchema(conversationContext).pick({
  conversationId: true,
  contextType: true,
  contextValue: true,
  confidence: true,
  expiresAt: true
});

// Select types
export type User = typeof users.$inferSelect;
export type Workspace = typeof workspaces.$inferSelect;
export type WorkspaceMember = typeof workspaceMembers.$inferSelect;
export type TeamInvitation = typeof teamInvitations.$inferSelect;
export type SocialAccount = typeof socialAccounts.$inferSelect;
export type Content = typeof content.$inferSelect;
export type Analytics = typeof analytics.$inferSelect;
export type AutomationRule = typeof automationRules.$inferSelect;
export type AutomationLog = typeof automationLogs.$inferSelect;
export type Suggestion = typeof suggestions.$inferSelect;
export type CreditTransaction = typeof creditTransactions.$inferSelect;
export type Referral = typeof referrals.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;
export type CreditPackage = typeof creditPackages.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type Addon = typeof addons.$inferSelect;

// Insert types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertWorkspace = z.infer<typeof insertWorkspaceSchema>;
export type InsertWorkspaceMember = z.infer<typeof insertWorkspaceMemberSchema>;
export type InsertTeamInvitation = z.infer<typeof insertTeamInvitationSchema>;
export type InsertSocialAccount = z.infer<typeof insertSocialAccountSchema>;
export type InsertContent = z.infer<typeof insertContentSchema>;
export type InsertAutomationRule = z.infer<typeof insertAutomationRuleSchema>;
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
export type InsertSuggestion = z.infer<typeof insertSuggestionSchema>;
export type InsertCreditTransaction = z.infer<typeof insertCreditTransactionSchema>;
export type InsertReferral = z.infer<typeof insertReferralSchema>;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type InsertCreditPackage = z.infer<typeof insertCreditPackageSchema>;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type InsertAddon = z.infer<typeof insertAddonSchema>;
export type DmConversation = typeof dmConversations.$inferSelect;
export type InsertDmConversation = z.infer<typeof insertDmConversationSchema>;
export type DmMessage = typeof dmMessages.$inferSelect;
export type InsertDmMessage = z.infer<typeof insertDmMessageSchema>;
export type ConversationContext = typeof conversationContext.$inferSelect;
export type InsertConversationContext = z.infer<typeof insertConversationContextSchema>;

// Content recommendations schema
export const insertContentRecommendationSchema = createInsertSchema(contentRecommendations).pick({
  workspaceId: true,
  type: true,
  title: true,
  description: true,
  thumbnailUrl: true,
  mediaUrl: true,
  duration: true,
  category: true,
  country: true,
  tags: true,
  engagement: true,
  sourceUrl: true,
  isActive: true
});

export const insertUserContentHistorySchema = createInsertSchema(userContentHistory).pick({
  userId: true,
  workspaceId: true,
  recommendationId: true,
  action: true,
  metadata: true
});

export type ContentRecommendation = typeof contentRecommendations.$inferSelect;
export type InsertContentRecommendation = z.infer<typeof insertContentRecommendationSchema>;

export type UserContentHistory = typeof userContentHistory.$inferSelect;
export type InsertUserContentHistory = z.infer<typeof insertUserContentHistorySchema>;
