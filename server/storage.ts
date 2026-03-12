import { 
  users, newsletters, purchases, 
  userProgress, achievements, userAchievements, userProfiles,
  leaderboards, communityLore, quests, userQuests,
  starMapNodes, userStarMapProgress, dailySignals, userDailySignals,
  seasonalEvents, userSeasonalEvents, subscriptionPlans,
  agents, agentAssignments, agentJobs, executionRuns, agentMemory,
  type User, type InsertUser, type Newsletter, type InsertNewsletter, 
  type Purchase, type InsertPurchase, type UpsertUser,
  type UserProgress, type InsertUserProgress,
  type Achievement, type InsertAchievement,
  type UserAchievement, type InsertUserAchievement,
  type UserProfile, type InsertUserProfile,
  type Leaderboard, type InsertLeaderboard,
  type CommunityLore, type InsertCommunityLore,
  type Quest, type InsertQuest,
  type UserQuest, type InsertUserQuest,
  type StarMapNode, type InsertStarMapNode,
  type DailySignal, type InsertDailySignal,
  type SeasonalEvent, type InsertSeasonalEvent,
  type UserSeasonalEvent, type InsertUserSeasonalEvent,
  type SubscriptionPlan, type InsertSubscriptionPlan,
  type Agent, type InsertAgent,
  type AgentJob, type InsertAgentJob,
  type ExecutionRun, type InsertExecutionRun,
  type AgentMemory, type InsertAgentMemory,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (required for authentication)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserSubscription(userId: string, stripeCustomerId: string, stripeSubscriptionId: string, status: string): Promise<User | undefined>;
  
  subscribeNewsletter(newsletter: InsertNewsletter): Promise<Newsletter>;
  getNewsletterByEmail(email: string): Promise<Newsletter | undefined>;
  getAllNewsletters(): Promise<Newsletter[]>;
  getAllNewsletterSubscribers(): Promise<Newsletter[]>;
  
  createPurchase(purchase: InsertPurchase): Promise<Purchase>;
  getPurchasesByEmail(email: string): Promise<Purchase[]>;
  getAllPurchases(): Promise<Purchase[]>;
  updatePurchaseStatus(id: string, status: string, transactionId?: string): Promise<Purchase | undefined>;
  updatePurchaseStatusByTransactionId(transactionId: string, status: string): Promise<Purchase | undefined>;

  // User Profile & Progression
  getUserProfile(userId: string): Promise<UserProfile | undefined>;
  createUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | undefined>;
  addUserXp(userId: string, xp: number): Promise<UserProfile | undefined>;

  // User Progress
  getUserProgress(userId: string): Promise<UserProgress[]>;
  updateUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  getProgressByContent(userId: string, contentType: string, contentId: string): Promise<UserProgress | undefined>;

  // Achievements
  getAllAchievements(): Promise<Achievement[]>;
  getUserAchievements(userId: string): Promise<(UserAchievement & { achievement: Achievement })[]>;
  unlockAchievement(userId: string, achievementId: string): Promise<UserAchievement>;

  // Leaderboards
  getTopLeaderboard(gameType: string, limit: number): Promise<(Leaderboard & { user: User })[]>;
  submitScore(entry: InsertLeaderboard): Promise<Leaderboard>;
  getUserBestScore(userId: string, gameType: string): Promise<Leaderboard | undefined>;

  // Community Lore
  getCommunityLore(status?: string): Promise<CommunityLore[]>;
  submitLore(lore: InsertCommunityLore): Promise<CommunityLore>;
  updateLoreStatus(id: string, status: string): Promise<CommunityLore | undefined>;
  upvoteLore(id: string): Promise<CommunityLore | undefined>;

  // Quests
  getActiveQuests(): Promise<Quest[]>;
  getUserQuests(userId: string): Promise<(UserQuest & { quest: Quest })[]>;
  startQuest(userId: string, questId: string): Promise<UserQuest>;
  updateQuestProgress(userId: string, questId: string, progress: object): Promise<UserQuest | undefined>;
  completeQuest(userId: string, questId: string): Promise<UserQuest | undefined>;

  // Star Map
  getAllStarMapNodes(): Promise<StarMapNode[]>;
  getUserStarMapProgress(userId: string): Promise<{ node: StarMapNode; discovered: boolean; unlocked: boolean }[]>;
  discoverNode(userId: string, nodeId: string): Promise<void>;
  unlockNode(userId: string, nodeId: string): Promise<void>;

  // Daily Signals
  getTodaySignal(): Promise<DailySignal | undefined>;
  claimDailySignal(userId: string, signalId: string): Promise<{ claimed: boolean; streak: number }>;
  getUserStreak(userId: string): Promise<number>;

  // Seasonal Events
  getActiveEvents(): Promise<SeasonalEvent[]>;
  joinEvent(userId: string, eventId: string): Promise<UserSeasonalEvent>;
  updateEventProgress(userId: string, eventId: string, points: number, milestone?: string): Promise<UserSeasonalEvent | undefined>;

  // AI Agent Command Center
  getAllAgents(): Promise<Agent[]>;
  getAgent(id: string): Promise<Agent | undefined>;
  createAgent(agent: InsertAgent): Promise<Agent>;
  updateAgentStatus(id: string, status: string): Promise<Agent | undefined>;
  seedDefaultAgents(): Promise<void>;

  getAllAgentJobs(): Promise<AgentJob[]>;
  createAgentJob(job: InsertAgentJob): Promise<AgentJob>;
  approveAgentJob(id: string, approved: boolean, note?: string): Promise<AgentJob | undefined>;

  getAllExecutionRuns(): Promise<(ExecutionRun & { agent: Agent })[]>;
  createExecutionRun(run: InsertExecutionRun): Promise<ExecutionRun>;
  completeExecutionRun(id: string, updates: Partial<ExecutionRun>): Promise<ExecutionRun | undefined>;

  getAllAgentMemory(): Promise<AgentMemory[]>;
  addAgentMemory(memory: InsertAgentMemory): Promise<AgentMemory>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async createDevUser(): Promise<User> {
    const devUserData = {
      id: 'dev-user-123',
      email: 'dev@example.com',
      firstName: 'Development',
      lastName: 'User',
      profileImageUrl: 'https://avatars.githubusercontent.com/u/1?v=4'
    };
    
    const [user] = await db
      .insert(users)
      .values(devUserData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...devUserData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserSubscription(userId: string, stripeCustomerId: string, stripeSubscriptionId: string, status: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({
        stripeCustomerId,
        stripeSubscriptionId,
        subscriptionStatus: status,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user || undefined;
  }

  async subscribeNewsletter(insertNewsletter: InsertNewsletter): Promise<Newsletter> {
    const [newsletter] = await db
      .insert(newsletters)
      .values(insertNewsletter)
      .onConflictDoUpdate({
        target: newsletters.email,
        set: {
          cosmicAlignment: insertNewsletter.cosmicAlignment,
          language: insertNewsletter.language,
        },
      })
      .returning();
    return newsletter;
  }

  async getNewsletterByEmail(email: string): Promise<Newsletter | undefined> {
    const [newsletter] = await db.select().from(newsletters).where(eq(newsletters.email, email));
    return newsletter || undefined;
  }

  async getAllNewsletters(): Promise<Newsletter[]> {
    return await db.select().from(newsletters);
  }

  async getAllNewsletterSubscribers(): Promise<Newsletter[]> {
    return await db.select().from(newsletters);
  }

  async createPurchase(insertPurchase: InsertPurchase): Promise<Purchase> {
    const [purchase] = await db
      .insert(purchases)
      .values(insertPurchase)
      .returning();
    return purchase;
  }

  async getPurchasesByEmail(email: string): Promise<Purchase[]> {
    return await db.select().from(purchases).where(eq(purchases.email, email));
  }

  async getAllPurchases(): Promise<Purchase[]> {
    return await db.select().from(purchases);
  }

  async updatePurchaseStatus(id: string, status: string, transactionId?: string): Promise<Purchase | undefined> {
    const updateData: any = { status };
    if (transactionId) {
      updateData.transactionId = transactionId;
    }
    
    const [purchase] = await db
      .update(purchases)
      .set(updateData)
      .where(eq(purchases.id, id))
      .returning();
    return purchase || undefined;
  }

  async updatePurchaseStatusByTransactionId(transactionId: string, status: string): Promise<Purchase | undefined> {
    const [purchase] = await db
      .update(purchases)
      .set({ status })
      .where(eq(purchases.transactionId, transactionId))
      .returning();
    return purchase || undefined;
  }

  // ============================================
  // USER PROFILE & PROGRESSION
  // ============================================

  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));
    return profile || undefined;
  }

  async createUserProfile(profile: InsertUserProfile): Promise<UserProfile> {
    const [newProfile] = await db
      .insert(userProfiles)
      .values(profile)
      .onConflictDoUpdate({
        target: userProfiles.userId,
        set: { ...profile, updatedAt: new Date() }
      })
      .returning();
    return newProfile;
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | undefined> {
    const [profile] = await db
      .update(userProfiles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(userProfiles.userId, userId))
      .returning();
    return profile || undefined;
  }

  async addUserXp(userId: string, xp: number): Promise<UserProfile | undefined> {
    const profile = await this.getUserProfile(userId);
    if (!profile) return undefined;
    
    const newXp = (profile.totalXp || 0) + xp;
    const newLevel = Math.floor(newXp / 1000) + 1;
    
    const [updated] = await db
      .update(userProfiles)
      .set({ 
        totalXp: newXp, 
        level: newLevel,
        updatedAt: new Date() 
      })
      .where(eq(userProfiles.userId, userId))
      .returning();
    return updated || undefined;
  }

  // ============================================
  // USER PROGRESS
  // ============================================

  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return await db.select().from(userProgress).where(eq(userProgress.userId, userId));
  }

  async updateUserProgress(progress: InsertUserProgress): Promise<UserProgress> {
    const existing = await this.getProgressByContent(progress.userId, progress.contentType, progress.contentId);
    
    if (existing) {
      const [updated] = await db
        .update(userProgress)
        .set({ 
          progressPercent: progress.progressPercent,
          completed: progress.completed,
          lastAccessedAt: new Date()
        })
        .where(eq(userProgress.id, existing.id))
        .returning();
      return updated;
    }
    
    const [newProgress] = await db.insert(userProgress).values(progress).returning();
    return newProgress;
  }

  async getProgressByContent(userId: string, contentType: string, contentId: string): Promise<UserProgress | undefined> {
    const [progress] = await db
      .select()
      .from(userProgress)
      .where(and(
        eq(userProgress.userId, userId),
        eq(userProgress.contentType, contentType),
        eq(userProgress.contentId, contentId)
      ));
    return progress || undefined;
  }

  // ============================================
  // ACHIEVEMENTS
  // ============================================

  async getAllAchievements(): Promise<Achievement[]> {
    return await db.select().from(achievements);
  }

  async getUserAchievements(userId: string): Promise<(UserAchievement & { achievement: Achievement })[]> {
    const results = await db
      .select()
      .from(userAchievements)
      .innerJoin(achievements, eq(userAchievements.achievementId, achievements.id))
      .where(eq(userAchievements.userId, userId));
    
    return results.map(r => ({
      ...r.user_achievements,
      achievement: r.achievements
    }));
  }

  async unlockAchievement(userId: string, achievementId: string): Promise<UserAchievement> {
    const [achievement] = await db
      .insert(userAchievements)
      .values({ userId, achievementId })
      .onConflictDoNothing()
      .returning();
    return achievement;
  }

  // ============================================
  // LEADERBOARDS
  // ============================================

  async getTopLeaderboard(gameType: string, limit: number): Promise<(Leaderboard & { user: User })[]> {
    const results = await db
      .select()
      .from(leaderboards)
      .innerJoin(users, eq(leaderboards.userId, users.id))
      .where(eq(leaderboards.gameType, gameType))
      .orderBy(desc(leaderboards.score))
      .limit(limit);
    
    return results.map(r => ({
      ...r.leaderboards,
      user: r.users
    }));
  }

  async submitScore(entry: InsertLeaderboard): Promise<Leaderboard> {
    const existing = await this.getUserBestScore(entry.userId, entry.gameType);
    
    if (existing && existing.score >= entry.score) {
      return existing;
    }
    
    if (existing) {
      const [updated] = await db
        .update(leaderboards)
        .set({ 
          score: entry.score,
          level: entry.level,
          crystalsCollected: entry.crystalsCollected,
          playTime: entry.playTime,
          metadata: entry.metadata,
          achievedAt: new Date()
        })
        .where(eq(leaderboards.id, existing.id))
        .returning();
      return updated;
    }
    
    const [newEntry] = await db.insert(leaderboards).values(entry).returning();
    return newEntry;
  }

  async getUserBestScore(userId: string, gameType: string): Promise<Leaderboard | undefined> {
    const [entry] = await db
      .select()
      .from(leaderboards)
      .where(and(
        eq(leaderboards.userId, userId),
        eq(leaderboards.gameType, gameType)
      ))
      .orderBy(desc(leaderboards.score))
      .limit(1);
    return entry || undefined;
  }

  // ============================================
  // COMMUNITY LORE
  // ============================================

  async getCommunityLore(status?: string): Promise<CommunityLore[]> {
    if (status) {
      return await db.select().from(communityLore).where(eq(communityLore.status, status)).orderBy(desc(communityLore.createdAt));
    }
    return await db.select().from(communityLore).orderBy(desc(communityLore.createdAt));
  }

  async submitLore(lore: InsertCommunityLore): Promise<CommunityLore> {
    const [newLore] = await db.insert(communityLore).values(lore).returning();
    return newLore;
  }

  async updateLoreStatus(id: string, status: string): Promise<CommunityLore | undefined> {
    const [updated] = await db
      .update(communityLore)
      .set({ status, updatedAt: new Date() })
      .where(eq(communityLore.id, id))
      .returning();
    return updated || undefined;
  }

  async upvoteLore(id: string): Promise<CommunityLore | undefined> {
    const [updated] = await db
      .update(communityLore)
      .set({ upvotes: sql`${communityLore.upvotes} + 1` })
      .where(eq(communityLore.id, id))
      .returning();
    return updated || undefined;
  }

  // ============================================
  // QUESTS
  // ============================================

  async getActiveQuests(): Promise<Quest[]> {
    const now = new Date();
    return await db
      .select()
      .from(quests)
      .where(sql`(${quests.startsAt} IS NULL OR ${quests.startsAt} <= ${now}) AND (${quests.endsAt} IS NULL OR ${quests.endsAt} >= ${now})`);
  }

  async getUserQuests(userId: string): Promise<(UserQuest & { quest: Quest })[]> {
    const results = await db
      .select()
      .from(userQuests)
      .innerJoin(quests, eq(userQuests.questId, quests.id))
      .where(eq(userQuests.userId, userId));
    
    return results.map(r => ({
      ...r.user_quests,
      quest: r.quests
    }));
  }

  async startQuest(userId: string, questId: string): Promise<UserQuest> {
    const [quest] = await db
      .insert(userQuests)
      .values({ userId, questId, status: 'active', progress: {} })
      .returning();
    return quest;
  }

  async updateQuestProgress(userId: string, questId: string, progress: object): Promise<UserQuest | undefined> {
    const [updated] = await db
      .update(userQuests)
      .set({ progress })
      .where(and(
        eq(userQuests.userId, userId),
        eq(userQuests.questId, questId)
      ))
      .returning();
    return updated || undefined;
  }

  async completeQuest(userId: string, questId: string): Promise<UserQuest | undefined> {
    const [updated] = await db
      .update(userQuests)
      .set({ status: 'completed', completedAt: new Date() })
      .where(and(
        eq(userQuests.userId, userId),
        eq(userQuests.questId, questId)
      ))
      .returning();
    return updated || undefined;
  }

  // ============================================
  // STAR MAP
  // ============================================

  async getAllStarMapNodes(): Promise<StarMapNode[]> {
    return await db.select().from(starMapNodes);
  }

  async getUserStarMapProgress(userId: string): Promise<{ node: StarMapNode; discovered: boolean; unlocked: boolean }[]> {
    const nodes = await this.getAllStarMapNodes();
    const progress = await db
      .select()
      .from(userStarMapProgress)
      .where(eq(userStarMapProgress.userId, userId));
    
    const progressMap = new Map(progress.map(p => [p.nodeId, p]));
    
    return nodes.map(node => ({
      node,
      discovered: progressMap.get(node.id)?.discovered || false,
      unlocked: progressMap.get(node.id)?.unlocked || false
    }));
  }

  async discoverNode(userId: string, nodeId: string): Promise<void> {
    await db
      .insert(userStarMapProgress)
      .values({ userId, nodeId, discovered: true, discoveredAt: new Date() })
      .onConflictDoUpdate({
        target: [userStarMapProgress.userId, userStarMapProgress.nodeId],
        set: { discovered: true, discoveredAt: new Date() }
      });
  }

  async unlockNode(userId: string, nodeId: string): Promise<void> {
    await db
      .insert(userStarMapProgress)
      .values({ userId, nodeId, discovered: true, unlocked: true, discoveredAt: new Date(), unlockedAt: new Date() })
      .onConflictDoUpdate({
        target: [userStarMapProgress.userId, userStarMapProgress.nodeId],
        set: { unlocked: true, unlockedAt: new Date() }
      });
  }

  // ============================================
  // DAILY SIGNALS
  // ============================================

  async getTodaySignal(): Promise<DailySignal | undefined> {
    const today = new Date().toISOString().split('T')[0];
    const [signal] = await db
      .select()
      .from(dailySignals)
      .where(eq(dailySignals.signalDate, today));
    return signal || undefined;
  }

  async claimDailySignal(userId: string, signalId: string): Promise<{ claimed: boolean; streak: number }> {
    const existing = await db
      .select()
      .from(userDailySignals)
      .where(and(
        eq(userDailySignals.userId, userId),
        eq(userDailySignals.signalId, signalId)
      ));
    
    if (existing.length > 0) {
      return { claimed: false, streak: existing[0].streakCount || 1 };
    }

    const currentStreak = await this.getUserStreak(userId);
    const newStreak = currentStreak + 1;
    
    await db.insert(userDailySignals).values({
      userId,
      signalId,
      streakCount: newStreak
    });
    
    return { claimed: true, streak: newStreak };
  }

  async getUserStreak(userId: string): Promise<number> {
    const [latest] = await db
      .select()
      .from(userDailySignals)
      .where(eq(userDailySignals.userId, userId))
      .orderBy(desc(userDailySignals.claimedAt))
      .limit(1);
    return latest?.streakCount || 0;
  }

  // ============================================
  // SEASONAL EVENTS
  // ============================================

  async getActiveEvents(): Promise<SeasonalEvent[]> {
    return await db.select().from(seasonalEvents).where(eq(seasonalEvents.isActive, true));
  }

  async joinEvent(userId: string, eventId: string): Promise<UserSeasonalEvent> {
    const [event] = await db
      .insert(userSeasonalEvents)
      .values({ userId, eventId, points: 0, milestones: [] })
      .onConflictDoNothing()
      .returning();
    return event;
  }

  async updateEventProgress(userId: string, eventId: string, points: number, milestone?: string): Promise<UserSeasonalEvent | undefined> {
    const [existing] = await db
      .select()
      .from(userSeasonalEvents)
      .where(and(
        eq(userSeasonalEvents.userId, userId),
        eq(userSeasonalEvents.eventId, eventId)
      ));
    
    if (!existing) return undefined;

    const currentMilestones = (existing.milestones as string[]) || [];
    const newMilestones = milestone && !currentMilestones.includes(milestone)
      ? [...currentMilestones, milestone]
      : currentMilestones;

    const [updated] = await db
      .update(userSeasonalEvents)
      .set({ 
        points: (existing.points || 0) + points,
        milestones: newMilestones
      })
      .where(and(
        eq(userSeasonalEvents.userId, userId),
        eq(userSeasonalEvents.eventId, eventId)
      ))
      .returning();
    return updated || undefined;
  }

  // ============================================
  // AI AGENT COMMAND CENTER
  // ============================================

  async getAllAgents(): Promise<Agent[]> {
    return await db.select().from(agents).orderBy(agents.createdAt);
  }

  async getAgent(id: string): Promise<Agent | undefined> {
    const [agent] = await db.select().from(agents).where(eq(agents.id, id));
    return agent || undefined;
  }

  async createAgent(agent: InsertAgent): Promise<Agent> {
    const [created] = await db.insert(agents).values(agent).returning();
    return created;
  }

  async updateAgentStatus(id: string, status: string): Promise<Agent | undefined> {
    const [updated] = await db
      .update(agents)
      .set({ status, lastActiveAt: new Date() })
      .where(eq(agents.id, id))
      .returning();
    return updated || undefined;
  }

  async seedDefaultAgents(): Promise<void> {
    const existing = await db.select().from(agents);
    if (existing.length > 0) return;

    const defaultAgents: InsertAgent[] = [
      {
        agentName: "Ecosystem Orchestrator",
        role: "orchestrator",
        description: "Coordinates all agents, generates daily executive briefs, and prioritizes high-impact actions across the Eternal Chase platform.",
        capabilities: ["coordinate_agents", "generate_reports", "prioritize_tasks", "strategic_analysis", "daily_briefing"],
        assignedUnit: "ecosystem",
        status: "active",
      },
      {
        agentName: "Growth Engine",
        role: "growth",
        description: "Tracks user signups, XP progression, engagement streaks, and identifies opportunities to grow the Eternal Chase community.",
        capabilities: ["user_analytics", "engagement_tracking", "growth_campaigns", "funnel_analysis", "retention_strategies"],
        assignedUnit: "growth",
        status: "active",
      },
      {
        agentName: "Revenue Generator",
        role: "revenue",
        description: "Monitors audiobook sales, merchandise revenue, Resonance Pass subscriptions, and identifies new monetization opportunities.",
        capabilities: ["sales_monitoring", "subscription_analysis", "pricing_optimization", "revenue_forecasting", "upsell_identification"],
        assignedUnit: "revenue",
        status: "active",
      },
      {
        agentName: "Community Guardian",
        role: "community",
        description: "Monitors community lore submissions, leaderboard health, daily signal streaks, and maintains a positive cosmic community.",
        capabilities: ["content_moderation", "leaderboard_monitoring", "community_health", "lore_quality_review", "engagement_signals"],
        assignedUnit: "community",
        status: "active",
      },
      {
        agentName: "Development Scout",
        role: "development",
        description: "Identifies feature improvements, UI/UX opportunities, performance issues, and new feature ideas based on user behavior.",
        capabilities: ["feature_research", "ux_analysis", "performance_monitoring", "competitor_analysis", "roadmap_planning"],
        assignedUnit: "dev",
        status: "active",
      },
      {
        agentName: "Memory Keeper",
        role: "memory",
        description: "Stores successful strategies, lessons learned, and insights so all other agents can make smarter decisions over time.",
        capabilities: ["insight_storage", "pattern_recognition", "knowledge_retrieval", "strategy_archiving", "cross_agent_sharing"],
        assignedUnit: "ecosystem",
        status: "active",
      },
    ];

    for (const agent of defaultAgents) {
      await db.insert(agents).values(agent).onConflictDoNothing();
    }
  }

  async getAllAgentJobs(): Promise<AgentJob[]> {
    return await db.select().from(agentJobs).orderBy(desc(agentJobs.createdAt));
  }

  async createAgentJob(job: InsertAgentJob): Promise<AgentJob> {
    const [created] = await db.insert(agentJobs).values(job).returning();
    return created;
  }

  async approveAgentJob(id: string, approved: boolean, note?: string): Promise<AgentJob | undefined> {
    const [updated] = await db
      .update(agentJobs)
      .set({
        approvalStatus: approved ? "approved" : "rejected",
        approvalNote: note || null,
        approvedAt: new Date(),
      })
      .where(eq(agentJobs.id, id))
      .returning();
    return updated || undefined;
  }

  async getAllExecutionRuns(): Promise<(ExecutionRun & { agent: Agent })[]> {
    const runs = await db
      .select()
      .from(executionRuns)
      .leftJoin(agents, eq(executionRuns.agentId, agents.id))
      .orderBy(desc(executionRuns.startTime))
      .limit(50);

    return runs.map(r => ({
      ...r.execution_runs,
      agent: r.agents as Agent,
    }));
  }

  async createExecutionRun(run: InsertExecutionRun): Promise<ExecutionRun> {
    const [created] = await db.insert(executionRuns).values(run).returning();
    return created;
  }

  async completeExecutionRun(id: string, updates: Partial<ExecutionRun>): Promise<ExecutionRun | undefined> {
    const [updated] = await db
      .update(executionRuns)
      .set({ ...updates, endTime: new Date() })
      .where(eq(executionRuns.id, id))
      .returning();
    return updated || undefined;
  }

  async getAllAgentMemory(): Promise<AgentMemory[]> {
    return await db
      .select()
      .from(agentMemory)
      .orderBy(desc(agentMemory.relevanceScore))
      .limit(100);
  }

  async addAgentMemory(memory: InsertAgentMemory): Promise<AgentMemory> {
    const [created] = await db.insert(agentMemory).values(memory).returning();
    return created;
  }
}

export const storage = new DatabaseStorage();
