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
  isEmailVerified: boolean("is_email_verified").default(false),
  emailVerificationCode: text("email_verification_code"),
  emailVerificationExpiry: timestamp("email_verification_expiry"),
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
  // Platform-specific profile data
  followersCount: integer("followers_count"),
  followingCount: integer("following_count"),
  mediaCount: integer("media_count"),
  biography: text("biography"),
  website: text("website"),
  profilePictureUrl: text("profile_picture_url"),
  // YouTube-specific data
  subscriberCount: integer("subscriber_count"),
  videoCount: integer("video_count"),
  viewCount: integer("view_count"),
  channelDescription: text("channel_description"),
  channelThumbnail: text("channel_thumbnail"),
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

// AI Thumbnail Generation System - 7 Stage Implementation
export const thumbnailProjects = pgTable("thumbnail_projects", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  workspaceId: integer("workspace_id").references(() => workspaces.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(), // Gaming, Finance, Education, etc.
  uploadedImageUrl: text("uploaded_image_url"),
  status: text("status").default("draft"), // draft, processing, completed, failed
  creditsUsed: integer("credits_used").default(0),
  stage: integer("stage").default(1), // Current stage 1-7
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Stage 2: GPT-4 Strategy Output
export const thumbnailStrategies = pgTable("thumbnail_strategies", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => thumbnailProjects.id).notNull(),
  titles: text("titles").array(), // 3 attention-grabbing texts
  ctas: text("ctas").array(), // 2 CTA badge texts
  fonts: text("fonts").array(), // Suggested font families
  colors: json("colors"), // Background, title, CTA colors
  style: text("style").notNull(), // luxury, chaos, mystery, hype
  emotion: text("emotion").notNull(), // shock, success, sadness, urgency
  hooks: text("hooks").array(), // Hook keywords
  placement: text("placement").notNull(), // Layout placement strategy
  createdAt: timestamp("created_at").defaultNow()
});

// Stage 3: Trending Analysis & Visual Matching
export const trendingThumbnails = pgTable("trending_thumbnails", {
  id: serial("id").primaryKey(),
  sourceUrl: text("source_url").notNull(),
  thumbnailUrl: text("thumbnail_url").notNull(),
  title: text("title"),
  category: text("category"),
  viewCount: integer("view_count"),
  engagement: json("engagement"), // likes, comments, shares
  visualFeatures: json("visual_features"), // CLIP/BLIP embeddings
  layoutStyle: text("layout_style"), // Z-pattern-left-face, etc.
  visualMotif: text("visual_motif"), // zoomed face + glow + red stroke
  emojis: text("emojis").array(),
  filters: text("filters").array(),
  scrapedAt: timestamp("scraped_at").defaultNow(),
  isActive: boolean("is_active").default(true)
});

export const thumbnailMatches = pgTable("thumbnail_matches", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => thumbnailProjects.id).notNull(),
  trendingThumbnailId: integer("trending_thumbnail_id").references(() => trendingThumbnails.id).notNull(),
  similarity: integer("similarity"), // 0-100 match score
  matchedFeatures: text("matched_features").array(),
  createdAt: timestamp("created_at").defaultNow()
});

// Stage 4: Layout Variants Generation
export const thumbnailVariants = pgTable("thumbnail_variants", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => thumbnailProjects.id).notNull(),
  variantNumber: integer("variant_number").notNull(), // 1-5
  layoutType: text("layout_type").notNull(), // Face left text right, Bold title top, etc.
  previewUrl: text("preview_url").notNull(), // PNG preview
  layerMetadata: json("layer_metadata"), // Editable layer data for canvas
  layoutClassification: text("layout_classification"), // High CTR - Emotion + Red
  predictedCtr: integer("predicted_ctr"), // 0-100 predicted CTR score
  composition: json("composition"), // Node.js canvas composition data
  createdAt: timestamp("created_at").defaultNow()
});

// Stage 5: Canvas Editor Sessions
export const canvasEditorSessions = pgTable("canvas_editor_sessions", {
  id: serial("id").primaryKey(),
  variantId: integer("variant_id").references(() => thumbnailVariants.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  canvasData: json("canvas_data"), // Fabric.js canvas state
  layers: json("layers"), // Background, face, text, CTA, emojis
  editHistory: json("edit_history"), // Version history
  lastSaved: timestamp("last_saved").defaultNow(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});

// Stage 6: Export History
export const thumbnailExports = pgTable("thumbnail_exports", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").references(() => canvasEditorSessions.id).notNull(),
  format: text("format").notNull(), // PNG 1280x720, PNG transparent, Instagram 1080x1080, JSON
  exportUrl: text("export_url").notNull(),
  downloadCount: integer("download_count").default(0),
  cloudStorageUrl: text("cloud_storage_url"), // S3/Cloudinary URL
  metadata: json("metadata"), // Additional export metadata
  createdAt: timestamp("created_at").defaultNow()
});

// Advanced Features - Style Library
export const thumbnailStyles = pgTable("thumbnail_styles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  styleRules: json("style_rules"), // Emotion-based layout rules
  templateData: json("template_data"), // Reusable template definition
  previewUrl: text("preview_url"),
  popularityScore: integer("popularity_score").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
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

// Thumbnail system insert schemas
export const insertThumbnailProjectSchema = createInsertSchema(thumbnailProjects).pick({
  userId: true,
  workspaceId: true,
  title: true,
  description: true,
  category: true,
  uploadedImageUrl: true,
  status: true,
  stage: true
});

export const insertThumbnailStrategySchema = createInsertSchema(thumbnailStrategies).pick({
  projectId: true,
  titles: true,
  ctas: true,
  fonts: true,
  colors: true,
  style: true,
  emotion: true,
  hooks: true,
  placement: true
});

export const insertTrendingThumbnailSchema = createInsertSchema(trendingThumbnails).pick({
  sourceUrl: true,
  thumbnailUrl: true,
  title: true,
  category: true,
  viewCount: true,
  engagement: true,
  visualFeatures: true,
  layoutStyle: true,
  visualMotif: true,
  emojis: true,
  filters: true,
  isActive: true
});

export const insertThumbnailVariantSchema = createInsertSchema(thumbnailVariants).pick({
  projectId: true,
  variantNumber: true,
  layoutType: true,
  previewUrl: true,
  layerMetadata: true,
  layoutClassification: true,
  predictedCtr: true,
  composition: true
});

export const insertCanvasEditorSessionSchema = createInsertSchema(canvasEditorSessions).pick({
  variantId: true,
  userId: true,
  canvasData: true,
  layers: true,
  editHistory: true,
  isActive: true
});

export const insertThumbnailExportSchema = createInsertSchema(thumbnailExports).pick({
  sessionId: true,
  format: true,
  exportUrl: true,
  cloudStorageUrl: true,
  metadata: true
});

export const insertThumbnailStyleSchema = createInsertSchema(thumbnailStyles).pick({
  name: true,
  category: true,
  styleRules: true,
  templateData: true,
  previewUrl: true,
  popularityScore: true,
  isActive: true
});

// Thumbnail system types
export type ThumbnailProject = typeof thumbnailProjects.$inferSelect;
export type ThumbnailStrategy = typeof thumbnailStrategies.$inferSelect;
export type TrendingThumbnail = typeof trendingThumbnails.$inferSelect;
export type ThumbnailMatch = typeof thumbnailMatches.$inferSelect;
export type ThumbnailVariant = typeof thumbnailVariants.$inferSelect;
export type CanvasEditorSession = typeof canvasEditorSessions.$inferSelect;
export type ThumbnailExport = typeof thumbnailExports.$inferSelect;
export type ThumbnailStyle = typeof thumbnailStyles.$inferSelect;

export type InsertThumbnailProject = z.infer<typeof insertThumbnailProjectSchema>;
export type InsertThumbnailStrategy = z.infer<typeof insertThumbnailStrategySchema>;
export type InsertTrendingThumbnail = z.infer<typeof insertTrendingThumbnailSchema>;
export type InsertThumbnailVariant = z.infer<typeof insertThumbnailVariantSchema>;
export type InsertCanvasEditorSession = z.infer<typeof insertCanvasEditorSessionSchema>;
export type InsertThumbnailExport = z.infer<typeof insertThumbnailExportSchema>;
export type InsertThumbnailStyle = z.infer<typeof insertThumbnailStyleSchema>;

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

// Admin Panel Tables
export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").default("admin"), // admin, superadmin
  isActive: boolean("is_active").default(true),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const adminSessions = pgTable("admin_sessions", {
  id: serial("id").primaryKey(),
  adminId: integer("admin_id").references(() => admins.id).notNull(),
  token: text("token").notNull().unique(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").default("info"), // info, success, warning, error
  isRead: boolean("is_read").default(false),
  targetUsers: text("target_users").array(), // "all", specific user IDs, or criteria
  scheduledFor: timestamp("scheduled_for"),
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").defaultNow()
});

export const popups = pgTable("popups", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  type: text("type").default("announcement"), // announcement, promotion, update
  buttonText: text("button_text"),
  buttonLink: text("button_link"),
  isActive: boolean("is_active").default(true),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  targetPages: text("target_pages").array(), // pages where popup should show
  frequency: text("frequency").default("once"), // once, daily, session
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const appSettings = pgTable("app_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  type: text("type").default("string"), // string, boolean, number, json
  category: text("category").default("general"), // general, features, branding, email
  description: text("description"),
  isPublic: boolean("is_public").default(false), // can be accessed by frontend
  updatedBy: integer("updated_by").references(() => admins.id),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  adminId: integer("admin_id").references(() => admins.id),
  action: text("action").notNull(),
  entity: text("entity"), // user, setting, notification, etc.
  entityId: text("entity_id"),
  oldValues: json("old_values"),
  newValues: json("new_values"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow()
});

export const feedbackMessages = pgTable("feedback_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  category: text("category").default("general"), // bug, feature, general, billing
  priority: text("priority").default("medium"), // low, medium, high, urgent
  status: text("status").default("open"), // open, in_progress, resolved, closed
  adminNotes: text("admin_notes"),
  assignedTo: integer("assigned_to").references(() => admins.id),
  respondedAt: timestamp("responded_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Admin Insert Schemas
export const insertAdminSchema = createInsertSchema(admins).pick({
  email: true,
  username: true,
  password: true,
  role: true,
  isActive: true
});

export const insertAdminSessionSchema = createInsertSchema(adminSessions).pick({
  adminId: true,
  token: true,
  ipAddress: true,
  userAgent: true,
  expiresAt: true
});

export const insertNotificationSchema = createInsertSchema(notifications).pick({
  userId: true,
  title: true,
  message: true,
  type: true,
  targetUsers: true,
  scheduledFor: true
});

export const insertPopupSchema = createInsertSchema(popups).pick({
  title: true,
  content: true,
  type: true,
  buttonText: true,
  buttonLink: true,
  isActive: true,
  startDate: true,
  endDate: true,
  targetPages: true,
  frequency: true
});

export const insertAppSettingSchema = createInsertSchema(appSettings).pick({
  key: true,
  value: true,
  type: true,
  category: true,
  description: true,
  isPublic: true,
  updatedBy: true
});

export const insertAuditLogSchema = createInsertSchema(auditLogs).pick({
  adminId: true,
  action: true,
  entity: true,
  entityId: true,
  oldValues: true,
  newValues: true,
  ipAddress: true,
  userAgent: true
});

export const insertFeedbackMessageSchema = createInsertSchema(feedbackMessages).pick({
  userId: true,
  subject: true,
  message: true,
  category: true,
  priority: true,
  status: true,
  adminNotes: true,
  assignedTo: true
});

// Admin Types
export type Admin = typeof admins.$inferSelect;
export type AdminSession = typeof adminSessions.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type Popup = typeof popups.$inferSelect;
export type AppSetting = typeof appSettings.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;
export type FeedbackMessage = typeof feedbackMessages.$inferSelect;

export type InsertAdmin = z.infer<typeof insertAdminSchema>;
export type InsertAdminSession = z.infer<typeof insertAdminSessionSchema>;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type InsertPopup = z.infer<typeof insertPopupSchema>;
export type InsertAppSetting = z.infer<typeof insertAppSettingSchema>;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type InsertFeedbackMessage = z.infer<typeof insertFeedbackMessageSchema>;
