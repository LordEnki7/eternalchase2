import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, serial, index, jsonb, date } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ============================================
// COSMIC PROFILE & PROGRESSION SYSTEM
// ============================================

// User progress tracking for chapters and content
export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  contentType: varchar("content_type").notNull(), // 'chapter', 'audiobook', 'star_map_location', 'character'
  contentId: varchar("content_id").notNull(), // e.g., 'book1-chapter3', 'aiyanna-video'
  progressPercent: integer("progress_percent").default(0), // 0-100
  completed: boolean("completed").default(false),
  lastAccessedAt: timestamp("last_accessed_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Achievement definitions
export const achievements = pgTable("achievements", {
  id: varchar("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description").notNull(),
  icon: varchar("icon").notNull(), // icon name or URL
  category: varchar("category").notNull(), // 'reading', 'exploration', 'community', 'game', 'collector'
  tier: varchar("tier").notNull().default("bronze"), // bronze, silver, gold, cosmic
  requirement: jsonb("requirement").notNull(), // { type: 'chapters_completed', count: 5 }
  xpReward: integer("xp_reward").default(100),
  isHidden: boolean("is_hidden").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// User earned achievements
export const userAchievements = pgTable("user_achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  achievementId: varchar("achievement_id").notNull().references(() => achievements.id),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
  displayed: boolean("displayed").default(true), // user can choose to display on profile
});

// ============================================
// MEMBERSHIP & SUBSCRIPTION TIERS
// ============================================

// Subscription plans (Resonance Pass tiers)
export const subscriptionPlans = pgTable("subscription_plans", {
  id: varchar("id").primaryKey(), // 'resonance_explorer', 'resonance_voyager', 'resonance_cosmic'
  name: varchar("name").notNull(),
  description: text("description").notNull(),
  priceMonthly: integer("price_monthly").notNull(), // in cents
  priceAnnual: integer("price_annual").notNull(), // in cents
  stripePriceIdMonthly: varchar("stripe_price_id_monthly"),
  stripePriceIdAnnual: varchar("stripe_price_id_annual"),
  features: jsonb("features").notNull(), // array of feature strings
  tier: integer("tier").notNull(), // 1, 2, 3 for sorting
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Premium content access control
export const premiumContent = pgTable("premium_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contentType: varchar("content_type").notNull(), // 'chapter', 'audiobook', 'cosmetic', 'quest'
  contentId: varchar("content_id").notNull(),
  requiredPlanTier: integer("required_plan_tier").notNull().default(1), // minimum tier needed
  releaseDate: timestamp("release_date"), // for early access content
  createdAt: timestamp("created_at").defaultNow(),
});

// ============================================
// SOCIAL & COMMUNITY FEATURES
// ============================================

// Game leaderboards
export const leaderboards = pgTable("leaderboards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  gameType: varchar("game_type").notNull(), // 'resonance_raiders'
  score: integer("score").notNull(),
  level: integer("level").default(1),
  crystalsCollected: integer("crystals_collected").default(0),
  playTime: integer("play_time").default(0), // in seconds
  metadata: jsonb("metadata"), // additional game-specific data
  achievedAt: timestamp("achieved_at").defaultNow(),
});

// Community lore submissions
export const communityLore = pgTable("community_lore", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: varchar("title").notNull(),
  content: text("content").notNull(),
  category: varchar("category").notNull(), // 'character_theory', 'world_building', 'fan_art_description', 'alternate_ending'
  status: varchar("status").notNull().default("pending"), // pending, approved, featured, rejected
  upvotes: integer("upvotes").default(0),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Shareable chapter cards (track shares for analytics)
export const chapterShares = pgTable("chapter_shares", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  chapterId: varchar("chapter_id").notNull(),
  platform: varchar("platform").notNull(), // 'twitter', 'facebook', 'instagram', 'copy_link'
  sharedAt: timestamp("shared_at").defaultNow(),
});

// ============================================
// IMMERSIVE STORYTELLING
// ============================================

// Narrative quests
export const quests = pgTable("quests", {
  id: varchar("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description").notNull(),
  type: varchar("type").notNull(), // 'daily', 'weekly', 'story', 'exploration'
  requirements: jsonb("requirements").notNull(), // array of requirement objects
  rewards: jsonb("rewards").notNull(), // { xp: 500, achievement: 'quest_master', badge: 'explorer' }
  isPremium: boolean("is_premium").default(false),
  startsAt: timestamp("starts_at"),
  endsAt: timestamp("ends_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User quest progress
export const userQuests = pgTable("user_quests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  questId: varchar("quest_id").notNull().references(() => quests.id),
  status: varchar("status").notNull().default("active"), // active, completed, expired
  progress: jsonb("progress").default({}), // tracks individual requirement progress
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Star Map interactive nodes
export const starMapNodes = pgTable("star_map_nodes", {
  id: varchar("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description").notNull(),
  coordinates: jsonb("coordinates").notNull(), // { x, y, z }
  nodeType: varchar("node_type").notNull(), // 'planet', 'station', 'anomaly', 'wormhole'
  storyContent: text("story_content"), // unlockable story snippet
  isPremium: boolean("is_premium").default(false),
  requiredProgress: jsonb("required_progress"), // what user needs to unlock
  createdAt: timestamp("created_at").defaultNow(),
});

// User star map exploration
export const userStarMapProgress = pgTable("user_star_map_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  nodeId: varchar("node_id").notNull().references(() => starMapNodes.id),
  discovered: boolean("discovered").default(false),
  unlocked: boolean("unlocked").default(false),
  discoveredAt: timestamp("discovered_at"),
  unlockedAt: timestamp("unlocked_at"),
});

// ============================================
// DAILY SIGNALS & SEASONAL EVENTS
// ============================================

// Daily cosmic signals
export const dailySignals = pgTable("daily_signals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  signalDate: date("signal_date").notNull().unique(),
  title: varchar("title").notNull(),
  message: text("message").notNull(),
  characterId: varchar("character_id"), // optional: which character sends this
  bonusXp: integer("bonus_xp").default(50),
  specialReward: jsonb("special_reward"), // optional special reward
  createdAt: timestamp("created_at").defaultNow(),
});

// User daily signal claims
export const userDailySignals = pgTable("user_daily_signals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  signalId: varchar("signal_id").notNull().references(() => dailySignals.id),
  claimedAt: timestamp("claimed_at").defaultNow(),
  streakCount: integer("streak_count").default(1),
});

// Seasonal events
export const seasonalEvents = pgTable("seasonal_events", {
  id: varchar("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description").notNull(),
  theme: varchar("theme").notNull(), // 'cosmic_convergence', 'starfall_festival', 'void_awakening'
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  rewards: jsonb("rewards").notNull(), // event-specific rewards
  isActive: boolean("is_active").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// User seasonal event participation
export const userSeasonalEvents = pgTable("user_seasonal_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  eventId: varchar("event_id").notNull().references(() => seasonalEvents.id),
  points: integer("points").default(0),
  milestones: jsonb("milestones").default([]), // completed milestones
  joinedAt: timestamp("joined_at").defaultNow(),
});

// ============================================
// USER XP & LEVEL SYSTEM
// ============================================

// Extended user profile with progression
export const userProfiles = pgTable("user_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique().references(() => users.id),
  displayName: varchar("display_name"),
  cosmicTitle: varchar("cosmic_title").default("Stargazer"), // earned title
  totalXp: integer("total_xp").default(0),
  level: integer("level").default(1),
  currentStreak: integer("current_streak").default(0), // daily login streak
  longestStreak: integer("longest_streak").default(0),
  favoriteCharacter: varchar("favorite_character"),
  preferredLanguage: varchar("preferred_language").default("en"),
  bio: text("bio"),
  badges: jsonb("badges").default([]), // array of badge IDs to display
  settings: jsonb("settings").default({}), // user preferences
  lastActiveAt: timestamp("last_active_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Session storage table (required for authentication)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table with subscription support
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  subscriptionStatus: varchar("subscription_status").default("inactive"), // inactive, active, canceled, past_due
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const newsletters = pgTable("newsletters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  cosmicAlignment: text("cosmic_alignment").notNull(),
  language: text("language").notNull().default("en"),
  subscribedAt: timestamp("subscribed_at").notNull().default(sql`now()`),
});

export const purchases = pgTable("purchases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  email: text("email").notNull(),
  itemId: text("item_id").notNull(),
  itemType: text("item_type").notNull(), // hardcover_book, paperback_book, digital_book, audiobook, audiobook_bundle, digital_art, avatar, card_pack, soundtrack
  itemName: text("item_name").notNull(),
  price: integer("price").notNull(), // in cents
  currency: varchar("currency", { length: 3 }).notNull().default("USD"),
  status: varchar("status", { length: 20 }).notNull().default("pending"), // pending, completed, failed, refunded, shipped
  transactionId: varchar("transaction_id"),
  shippingAddress: jsonb("shipping_address"), // For physical books
  purchasedAt: timestamp("purchased_at").notNull().default(sql`now()`),
});

export const upsertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertNewsletterSchema = createInsertSchema(newsletters).pick({
  email: true,
  cosmicAlignment: true,
  language: true,
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  purchases: many(purchases),
}));

export const purchasesRelations = relations(purchases, ({ one }) => ({
  user: one(users, {
    fields: [purchases.userId],
    references: [users.id],
  }),
}));

export const insertPurchaseSchema = createInsertSchema(purchases).pick({
  userId: true,
  email: true,
  itemId: true,
  itemType: true,
  itemName: true,
  price: true,
  currency: true,
  status: true,
  transactionId: true,
  shippingAddress: true,
});

// Shipping address schema for physical books
export const shippingAddressSchema = z.object({
  fullName: z.string().min(1),
  streetAddress: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  zipCode: z.string().min(1),
  country: z.string().min(1).default("US"),
});

export type ShippingAddress = z.infer<typeof shippingAddressSchema>;

export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertNewsletter = z.infer<typeof insertNewsletterSchema>;
export type Newsletter = typeof newsletters.$inferSelect;

export type InsertPurchase = z.infer<typeof insertPurchaseSchema>;
export type Purchase = typeof purchases.$inferSelect;

// ============================================
// NEW INSERT SCHEMAS FOR ENHANCEMENT FEATURES
// ============================================

// User Progress
export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  createdAt: true,
  lastAccessedAt: true,
});
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserProgress = typeof userProgress.$inferSelect;

// Achievements
export const insertAchievementSchema = createInsertSchema(achievements).omit({
  createdAt: true,
});
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type Achievement = typeof achievements.$inferSelect;

// User Achievements
export const insertUserAchievementSchema = createInsertSchema(userAchievements).omit({
  id: true,
  unlockedAt: true,
});
export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;
export type UserAchievement = typeof userAchievements.$inferSelect;

// User Profiles
export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastActiveAt: true,
});
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type UserProfile = typeof userProfiles.$inferSelect;

// Subscription Plans
export const insertSubscriptionPlanSchema = createInsertSchema(subscriptionPlans).omit({
  createdAt: true,
});
export type InsertSubscriptionPlan = z.infer<typeof insertSubscriptionPlanSchema>;
export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;

// Leaderboards
export const insertLeaderboardSchema = createInsertSchema(leaderboards).omit({
  id: true,
  achievedAt: true,
});
export type InsertLeaderboard = z.infer<typeof insertLeaderboardSchema>;
export type Leaderboard = typeof leaderboards.$inferSelect;

// Community Lore
export const insertCommunityLoreSchema = createInsertSchema(communityLore).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  upvotes: true,
  featured: true,
});
export type InsertCommunityLore = z.infer<typeof insertCommunityLoreSchema>;
export type CommunityLore = typeof communityLore.$inferSelect;

// Quests
export const insertQuestSchema = createInsertSchema(quests).omit({
  createdAt: true,
});
export type InsertQuest = z.infer<typeof insertQuestSchema>;
export type Quest = typeof quests.$inferSelect;

// User Quests
export const insertUserQuestSchema = createInsertSchema(userQuests).omit({
  id: true,
  startedAt: true,
  completedAt: true,
});
export type InsertUserQuest = z.infer<typeof insertUserQuestSchema>;
export type UserQuest = typeof userQuests.$inferSelect;

// Star Map Nodes
export const insertStarMapNodeSchema = createInsertSchema(starMapNodes).omit({
  createdAt: true,
});
export type InsertStarMapNode = z.infer<typeof insertStarMapNodeSchema>;
export type StarMapNode = typeof starMapNodes.$inferSelect;

// Daily Signals
export const insertDailySignalSchema = createInsertSchema(dailySignals).omit({
  id: true,
  createdAt: true,
});
export type InsertDailySignal = z.infer<typeof insertDailySignalSchema>;
export type DailySignal = typeof dailySignals.$inferSelect;

// Seasonal Events
export const insertSeasonalEventSchema = createInsertSchema(seasonalEvents).omit({
  createdAt: true,
});
export type InsertSeasonalEvent = z.infer<typeof insertSeasonalEventSchema>;
export type SeasonalEvent = typeof seasonalEvents.$inferSelect;

// User Seasonal Events
export const insertUserSeasonalEventSchema = createInsertSchema(userSeasonalEvents).omit({
  id: true,
  joinedAt: true,
});
export type InsertUserSeasonalEvent = z.infer<typeof insertUserSeasonalEventSchema>;
export type UserSeasonalEvent = typeof userSeasonalEvents.$inferSelect;

// ============================================
// AI AGENT COMMAND CENTER SYSTEM
// ============================================

// Registry of all AI agents in the ecosystem
export const agents = pgTable("agents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  agentName: varchar("agent_name").notNull(),
  role: varchar("role").notNull(), // 'orchestrator', 'growth', 'revenue', 'community', 'development', 'memory'
  description: text("description").notNull(),
  capabilities: jsonb("capabilities").notNull(), // array of capability strings
  assignedUnit: varchar("assigned_unit").notNull(), // 'ecosystem', 'growth', 'revenue', 'community', 'dev'
  status: varchar("status").notNull().default("active"), // active, idle, disabled
  lastActiveAt: timestamp("last_active_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Task assignments linking agents to jobs
export const agentAssignments = pgTable("agent_assignments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  agentId: varchar("agent_id").notNull().references(() => agents.id),
  taskId: varchar("task_id").notNull(),
  taskType: varchar("task_type").notNull(), // 'analysis', 'report', 'action', 'research'
  priorityLevel: integer("priority_level").notNull().default(50), // 1-100
  assignedAt: timestamp("assigned_at").defaultNow(),
  dueTime: timestamp("due_time"),
  status: varchar("status").notNull().default("pending"), // pending, running, completed, failed
});

// Job definitions and proposals waiting for approval
export const agentJobs = pgTable("agent_jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  objective: text("objective").notNull(),
  category: varchar("category").notNull(), // 'opportunity', 'action', 'quick_win', 'analysis'
  priorityScore: integer("priority_score").notNull().default(50), // 1-100
  whyItMatters: text("why_it_matters").notNull(),
  expectedImpact: text("expected_impact").notNull(),
  agentsRequired: jsonb("agents_required").notNull(), // array of agent ids/names
  assetsRequired: jsonb("assets_required").notNull().default('[]'), // array of strings
  estimatedDuration: varchar("estimated_duration"),
  approvalStatus: varchar("approval_status").notNull().default("pending"), // pending, approved, rejected, auto
  approvalNote: text("approval_note"),
  approvedAt: timestamp("approved_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Execution runs track every task an agent performs
export const executionRuns = pgTable("execution_runs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  agentId: varchar("agent_id").notNull().references(() => agents.id),
  jobId: varchar("job_id").references(() => agentJobs.id),
  taskName: varchar("task_name").notNull(),
  objective: text("objective").notNull(),
  startTime: timestamp("start_time").defaultNow(),
  endTime: timestamp("end_time"),
  totalDurationMs: integer("total_duration_ms"),
  executionStatus: varchar("execution_status").notNull().default("running"), // running, completed, failed
  actionLog: jsonb("action_log").notNull().default('[]'), // array of step strings
  outputSummary: text("output_summary"),
  toolsUsed: jsonb("tools_used").notNull().default('[]'),
  outputsCreated: jsonb("outputs_created").notNull().default('[]'),
  qualityScore: integer("quality_score"), // 1-10
  objectiveMet: varchar("objective_met"), // yes, partial, no
  lessonsLearned: text("lessons_learned"),
  recommendedNextSteps: text("recommended_next_steps"),
});

// Shared memory so agents learn over time
export const agentMemory = pgTable("agent_memory", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  agentId: varchar("agent_id").references(() => agents.id),
  memoryType: varchar("memory_type").notNull(), // 'insight', 'strategy', 'result', 'warning'
  title: varchar("title").notNull(),
  content: text("content").notNull(),
  tags: jsonb("tags").notNull().default('[]'), // searchable tags
  relevanceScore: integer("relevance_score").default(50), // 1-100 how useful this is
  timesAccessed: integer("times_accessed").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at"), // null = permanent memory
});

// Insert schemas for agents
export const insertAgentSchema = createInsertSchema(agents).omit({
  id: true,
  createdAt: true,
  lastActiveAt: true,
});
export type InsertAgent = z.infer<typeof insertAgentSchema>;
export type Agent = typeof agents.$inferSelect;

export const insertAgentAssignmentSchema = createInsertSchema(agentAssignments).omit({
  id: true,
  assignedAt: true,
});
export type InsertAgentAssignment = z.infer<typeof insertAgentAssignmentSchema>;
export type AgentAssignment = typeof agentAssignments.$inferSelect;

export const insertAgentJobSchema = createInsertSchema(agentJobs).omit({
  id: true,
  createdAt: true,
  approvedAt: true,
});
export type InsertAgentJob = z.infer<typeof insertAgentJobSchema>;
export type AgentJob = typeof agentJobs.$inferSelect;

export const insertExecutionRunSchema = createInsertSchema(executionRuns).omit({
  id: true,
  startTime: true,
});
export type InsertExecutionRun = z.infer<typeof insertExecutionRunSchema>;
export type ExecutionRun = typeof executionRuns.$inferSelect;

export const insertAgentMemorySchema = createInsertSchema(agentMemory).omit({
  id: true,
  createdAt: true,
  timesAccessed: true,
});
export type InsertAgentMemory = z.infer<typeof insertAgentMemorySchema>;
export type AgentMemory = typeof agentMemory.$inferSelect;
