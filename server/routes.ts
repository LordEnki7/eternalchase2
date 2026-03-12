import type { Express } from "express";
import express from "express";
import path from "path";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertNewsletterSchema, 
  insertPurchaseSchema,
  insertUserProgressSchema,
  insertCommunityLoreSchema,
  insertLeaderboardSchema,
  insertAgentJobSchema,
  insertAgentMemorySchema,
} from "@shared/schema";
import { setupAuth, isAuthenticated } from "./replitAuth";
import Stripe from "stripe";
import { z } from "zod";

// Validation schemas for mutation endpoints
const paramIdSchema = z.object({ id: z.string().min(1) });
const questIdSchema = z.object({ questId: z.string().min(1) });
const nodeIdSchema = z.object({ nodeId: z.string().min(1) });
const eventIdSchema = z.object({ eventId: z.string().min(1) });

const questProgressSchema = z.object({
  progress: z.number().min(0).max(100)
});

const eventProgressSchema = z.object({
  milestoneId: z.string().min(1)
});

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-06-30.basil",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Asset serving middleware - prevents bundling large files
  const __dirname = path.dirname(new URL(import.meta.url).pathname);
  
  app.use('/assets', express.static(path.join(__dirname, '../attached_assets'), {
    maxAge: process.env.NODE_ENV === 'production' ? '1y' : '0',
    setHeaders: (res, filePath) => {
      res.setHeader('Cache-Control', 'public, max-age=31536000');
      
      if (filePath.endsWith('.wav')) {
        res.setHeader('Content-Type', 'audio/wav');
      } else if (filePath.endsWith('.mp3')) {
        res.setHeader('Content-Type', 'audio/mpeg');
      } else if (filePath.endsWith('.png')) {
        res.setHeader('Content-Type', 'image/png');
      } else if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
        res.setHeader('Content-Type', 'image/jpeg');
      }
    }
  }));

  // Auth middleware
  await setupAuth(app);

  // Public endpoints - no authentication required
  app.get('/api/site/status', (req, res) => {
    res.json({ status: 'active', freemium: true });
  });

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  
  // Newsletter subscription endpoint
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const validatedData = insertNewsletterSchema.parse(req.body);
      
      // Check if email already exists
      const existing = await storage.getNewsletterByEmail(validatedData.email);
      if (existing) {
        return res.status(400).json({ message: "Email already subscribed to cosmic chronicles" });
      }
      
      const newsletter = await storage.subscribeNewsletter(validatedData);
      res.json({ 
        message: "Successfully joined the Eternal Chase cosmic network",
        newsletter: newsletter 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid cosmic frequency data", errors: error.errors });
      }
      res.status(500).json({ message: "Cosmic network disruption occurred" });
    }
  });

  // Get all newsletter subscribers (admin endpoint)
  app.get("/api/newsletter/subscribers", async (req, res) => {
    try {
      const subscribers = await storage.getAllNewsletters();
      res.json(subscribers);
    } catch (error) {
      res.status(500).json({ message: "Unable to retrieve cosmic travelers" });
    }
  });

  // Purchase endpoint
  app.post("/api/shop/purchase", async (req, res) => {
    try {
      const validatedData = insertPurchaseSchema.parse(req.body);
      
      const purchase = await storage.createPurchase(validatedData);
      res.json({ 
        message: "Cosmic item successfully acquired",
        purchase: purchase 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid purchase data", errors: error.errors });
      }
      res.status(500).json({ message: "Cosmic marketplace temporarily unavailable" });
    }
  });

  // Get user purchases
  app.get("/api/shop/purchases/:email", async (req, res) => {
    try {
      const { email } = req.params;
      const purchases = await storage.getPurchasesByEmail(email);
      res.json(purchases);
    } catch (error) {
      res.status(500).json({ message: "Unable to retrieve cosmic inventory" });
    }
  });

  // Get all purchases (admin endpoint)
  app.get("/api/shop/purchases", async (req, res) => {
    try {
      const purchases = await storage.getAllPurchases();
      res.json(purchases);
    } catch (error) {
      res.status(500).json({ message: "Unable to retrieve marketplace data" });
    }
  });

  // Update purchase status
  app.patch("/api/shop/purchase/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status, transactionId } = req.body;
      
      if (!status || !['pending', 'completed', 'failed', 'refunded'].includes(status)) {
        return res.status(400).json({ message: "Invalid cosmic transaction status" });
      }

      const purchase = await storage.updatePurchaseStatus(id, status, transactionId);
      
      if (!purchase) {
        return res.status(404).json({ message: "Cosmic transaction not found in the archives" });
      }

      res.json({ 
        message: "Transaction status updated successfully",
        purchase: purchase 
      });
    } catch (error) {
      console.error("Error updating purchase status:", error);
      res.status(500).json({ message: "Unable to update cosmic transaction" });
    }
  });

  // Subscription endpoints
  app.post('/api/subscription/create', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if user already has an active subscription
      if (user.stripeSubscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
        
        if (subscription.status === 'active') {
          return res.json({
            subscriptionId: subscription.id,
            status: subscription.status,
            message: "You already have an active subscription"
          });
        }
      }

      let customerId = user.stripeCustomerId;
      
      // Create Stripe customer if doesn't exist
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email || '',
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          metadata: {
            userId: userId
          }
        });
        customerId = customer.id;
      }

      // Create a product first, then subscription with $9.99 monthly price
      const product = await stripe.products.create({
        name: 'Eternal Chase Premium Subscription',
        description: 'Complete access to the Eternal Chase trilogy with audiobooks and exclusive content'
      });

      const price = await stripe.prices.create({
        currency: 'usd',
        product: product.id,
        unit_amount: 999, // $9.99 in cents
        recurring: {
          interval: 'month'
        }
      });

      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{
          price: price.id
        }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });

      // Update user with subscription info
      await storage.updateUserSubscription(
        userId, 
        customerId, 
        subscription.id, 
        subscription.status
      );

      const latestInvoice = subscription.latest_invoice as any;
      const paymentIntent = latestInvoice?.payment_intent;
      
      res.json({
        subscriptionId: subscription.id,
        clientSecret: paymentIntent?.client_secret,
        status: subscription.status
      });
    } catch (error: any) {
      console.error('Error creating subscription:', error);
      res.status(500).json({ message: "Failed to create subscription", error: error.message });
    }
  });

  // Check subscription status - freemium model allows basic access
  app.get('/api/subscription/status', async (req: any, res) => {
    try {
      if (!req.isAuthenticated()) {
        // Return basic access for non-authenticated users (freemium model)
        return res.json({
          status: 'basic',
          hasAccess: true,
          hasPremiumAccess: false,
          plan: 'free',
          message: 'Free access - first 3 chapters available'
        });
      }

      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      // Grant premium access to all authenticated users during development
      if (!user || !user.stripeSubscriptionId) {
        return res.json({ 
          status: 'premium', 
          hasAccess: true,
          hasPremiumAccess: true,
          plan: 'premium',
          tempAccess: true,
          message: 'Development mode - Premium access granted'
        });
      }

      const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
      
      // Update local subscription status
      await storage.updateUserSubscription(
        userId,
        user.stripeCustomerId!,
        user.stripeSubscriptionId,
        subscription.status
      );

      const isActive = ['active', 'trialing'].includes(subscription.status);
      res.json({
        status: subscription.status,
        hasAccess: true,
        hasPremiumAccess: isActive,
        plan: isActive ? 'premium' : 'free',
        currentPeriodEnd: (subscription as any).current_period_end,
        cancelAtPeriodEnd: (subscription as any).cancel_at_period_end
      });
    } catch (error: any) {
      console.error('Error checking subscription status:', error);
      res.status(500).json({ message: "Failed to check subscription status" });
    }
  });

  // Cancel subscription
  app.post('/api/subscription/cancel', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || !user.stripeSubscriptionId) {
        return res.status(404).json({ message: "No active subscription found" });
      }

      const subscription = await stripe.subscriptions.update(user.stripeSubscriptionId, {
        cancel_at_period_end: true
      });

      res.json({
        message: "Subscription will be canceled at the end of the current period",
        cancelAtPeriodEnd: (subscription as any).cancel_at_period_end,
        currentPeriodEnd: (subscription as any).current_period_end
      });
    } catch (error: any) {
      console.error('Error canceling subscription:', error);
      res.status(500).json({ message: "Failed to cancel subscription" });
    }
  });

  // Create payment intent for book purchases
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, itemId, itemType, itemName, email, shippingAddress } = req.body;
      
      if (!amount || !itemId || !itemType || !itemName || !email) {
        return res.status(400).json({ message: "Missing required purchase information" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        metadata: {
          itemId,
          itemType,
          itemName,
          email,
          ...(shippingAddress && { shippingAddress: JSON.stringify(shippingAddress) })
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      // Create purchase record
      const purchase = await storage.createPurchase({
        email,
        itemId,
        itemType,
        itemName,
        price: Math.round(amount * 100),
        currency: "USD",
        status: "pending",
        transactionId: paymentIntent.id,
        ...(shippingAddress && { shippingAddress }),
      });

      res.json({ 
        clientSecret: paymentIntent.client_secret,
        purchaseId: purchase.id
      });
    } catch (error: any) {
      console.error('Error creating payment intent:', error);
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Webhook to handle successful payments
  app.post('/api/webhook/stripe', async (req, res) => {
    const sig = req.headers['stripe-signature'];
    
    try {
      const event = stripe.webhooks.constructEvent(req.body, sig as string, process.env.STRIPE_WEBHOOK_SECRET || '');
      
      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object as any;
        
        // Update purchase status to completed
        await storage.updatePurchaseStatusByTransactionId(
          paymentIntent.id, 
          'completed'
        );
      }
      
      res.json({ received: true });
    } catch (error: any) {
      console.error('Webhook error:', error);
      res.status(400).send(`Webhook Error: ${error.message}`);
    }
  });

  // Admin: Get all purchases
  app.get("/api/shop/purchases", async (req, res) => {
    try {
      const purchases = await storage.getAllPurchases();
      res.json(purchases);
    } catch (error) {
      console.error("Failed to fetch purchases:", error);
      res.status(500).json({ message: "Failed to fetch purchases" });
    }
  });

  // Admin: Get all newsletter subscribers
  app.get("/api/newsletter/subscribers", async (req, res) => {
    try {
      const subscribers = await storage.getAllNewsletterSubscribers();
      res.json(subscribers);
    } catch (error) {
      console.error("Failed to fetch newsletter subscribers:", error);
      res.status(500).json({ message: "Failed to fetch newsletter subscribers" });
    }
  });

  // Admin: Update purchase status
  app.patch("/api/shop/purchase/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!['pending', 'completed', 'failed', 'refunded', 'shipped'].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const updatedPurchase = await storage.updatePurchaseStatus(id, status);
      if (!updatedPurchase) {
        return res.status(404).json({ message: "Purchase not found" });
      }
      
      res.json(updatedPurchase);
    } catch (error) {
      console.error("Failed to update purchase status:", error);
      res.status(500).json({ message: "Failed to update purchase status" });
    }
  });

  // ============================================
  // COSMIC PROFILE & PROGRESSION ROUTES
  // ============================================

  // Get user's cosmic profile
  app.get('/api/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      let profile = await storage.getUserProfile(userId);
      
      if (!profile) {
        const user = await storage.getUser(userId);
        profile = await storage.createUserProfile({
          userId,
          displayName: user?.firstName || 'Cosmic Traveler',
        });
      }
      
      res.json(profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Failed to fetch cosmic profile" });
    }
  });

  // Update user's cosmic profile (with validation)
  app.patch('/api/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { displayName, bio, favoriteCharacter, preferredLanguage } = req.body;
      
      // Validate and sanitize allowed update fields
      const updates: Record<string, any> = {};
      if (displayName !== undefined) {
        if (typeof displayName !== 'string' || displayName.length > 50) {
          return res.status(400).json({ message: "Display name must be 50 characters or less" });
        }
        updates.displayName = displayName.trim();
      }
      if (bio !== undefined) {
        if (typeof bio !== 'string' || bio.length > 500) {
          return res.status(400).json({ message: "Bio must be 500 characters or less" });
        }
        updates.bio = bio.trim();
      }
      if (favoriteCharacter !== undefined) {
        if (typeof favoriteCharacter !== 'string') {
          return res.status(400).json({ message: "Invalid favorite character" });
        }
        updates.favoriteCharacter = favoriteCharacter;
      }
      if (preferredLanguage !== undefined) {
        if (!['en', 'es'].includes(preferredLanguage)) {
          return res.status(400).json({ message: "Invalid language preference" });
        }
        updates.preferredLanguage = preferredLanguage;
      }
      
      const profile = await storage.updateUserProfile(userId, updates);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      res.json(profile);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Get user's progress
  app.get('/api/progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const progress = await storage.getUserProgress(userId);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching progress:", error);
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  // Update user's progress (with validation)
  app.post('/api/progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { contentType, contentId, progressPercent, completed } = req.body;
      
      // Validate required fields
      const validContentTypes = ['chapter', 'audiobook', 'star_map_location', 'character'];
      if (!contentType || !validContentTypes.includes(contentType)) {
        return res.status(400).json({ message: "Invalid content type" });
      }
      if (!contentId || typeof contentId !== 'string') {
        return res.status(400).json({ message: "Content ID is required" });
      }
      const percent = typeof progressPercent === 'number' ? Math.min(100, Math.max(0, progressPercent)) : 0;
      
      const progress = await storage.updateUserProgress({
        userId,
        contentType,
        contentId,
        progressPercent: percent,
        completed: Boolean(completed)
      });
      
      if (completed) {
        await storage.addUserXp(userId, 50);
      }
      
      res.json(progress);
    } catch (error) {
      console.error("Error updating progress:", error);
      res.status(500).json({ message: "Failed to update progress" });
    }
  });

  // ============================================
  // ACHIEVEMENTS ROUTES
  // ============================================

  // Get all achievements
  app.get('/api/achievements', async (req, res) => {
    try {
      const achievements = await storage.getAllAchievements();
      res.json(achievements);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  // Get user's achievements
  app.get('/api/achievements/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const achievements = await storage.getUserAchievements(userId);
      res.json(achievements);
    } catch (error) {
      console.error("Error fetching user achievements:", error);
      res.status(500).json({ message: "Failed to fetch your achievements" });
    }
  });

  // Unlock an achievement (with validation)
  const achievementUnlockSchema = z.object({
    achievementId: z.string().min(1).max(100)
  });
  
  app.post('/api/achievements/unlock', isAuthenticated, async (req: any, res) => {
    try {
      const bodyResult = achievementUnlockSchema.safeParse(req.body);
      if (!bodyResult.success) {
        return res.status(400).json({ message: "Invalid achievement ID" });
      }
      
      const userId = req.user.claims.sub;
      const { achievementId } = bodyResult.data;
      
      const achievement = await storage.unlockAchievement(userId, achievementId);
      if (achievement) {
        await storage.addUserXp(userId, 100);
      }
      
      res.json(achievement);
    } catch (error) {
      console.error("Error unlocking achievement:", error);
      res.status(500).json({ message: "Failed to unlock achievement" });
    }
  });

  // ============================================
  // LEADERBOARD ROUTES
  // ============================================

  // Get top leaderboard
  app.get('/api/leaderboard/:gameType', async (req, res) => {
    try {
      const { gameType } = req.params;
      const limit = parseInt(req.query.limit as string) || 100;
      const leaderboard = await storage.getTopLeaderboard(gameType, limit);
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  // Submit score (with validation)
  app.post('/api/leaderboard/submit', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { gameType, score, level, crystalsCollected, playTime, metadata } = req.body;
      
      // Validate required fields
      if (!gameType || typeof gameType !== 'string') {
        return res.status(400).json({ message: "Game type is required" });
      }
      if (typeof score !== 'number' || score < 0 || score > 10000000) {
        return res.status(400).json({ message: "Invalid score value" });
      }
      
      const entry = await storage.submitScore({
        userId,
        gameType,
        score: Math.floor(score),
        level: typeof level === 'number' ? Math.floor(level) : undefined,
        crystalsCollected: typeof crystalsCollected === 'number' ? Math.floor(crystalsCollected) : undefined,
        playTime: typeof playTime === 'number' ? Math.floor(playTime) : undefined,
        metadata: metadata || undefined
      });
      
      await storage.addUserXp(userId, Math.min(1000, Math.floor(score / 10)));
      
      res.json(entry);
    } catch (error) {
      console.error("Error submitting score:", error);
      res.status(500).json({ message: "Failed to submit score" });
    }
  });

  // Get user's best score
  app.get('/api/leaderboard/:gameType/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { gameType } = req.params;
      const score = await storage.getUserBestScore(userId, gameType);
      res.json(score || { score: 0 });
    } catch (error) {
      console.error("Error fetching user score:", error);
      res.status(500).json({ message: "Failed to fetch your score" });
    }
  });

  // ============================================
  // COMMUNITY LORE ROUTES
  // ============================================

  // Get community lore
  app.get('/api/lore', async (req, res) => {
    try {
      const status = req.query.status as string || 'approved';
      const lore = await storage.getCommunityLore(status);
      res.json(lore);
    } catch (error) {
      console.error("Error fetching lore:", error);
      res.status(500).json({ message: "Failed to fetch community lore" });
    }
  });

  // Submit lore (with validation)
  app.post('/api/lore', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { title, content, category } = req.body;
      
      // Validate required fields
      if (!title || typeof title !== 'string' || title.trim().length < 3) {
        return res.status(400).json({ message: "Title must be at least 3 characters" });
      }
      if (!content || typeof content !== 'string' || content.trim().length < 10) {
        return res.status(400).json({ message: "Content must be at least 10 characters" });
      }
      const validCategories = ['character_theory', 'world_building', 'fan_art_description', 'alternate_ending'];
      if (!category || !validCategories.includes(category)) {
        return res.status(400).json({ message: "Invalid category" });
      }
      
      const lore = await storage.submitLore({
        userId,
        title: title.trim(),
        content: content.trim(),
        category,
        status: 'pending'
      });
      
      await storage.addUserXp(userId, 25);
      
      res.json(lore);
    } catch (error) {
      console.error("Error submitting lore:", error);
      res.status(500).json({ message: "Failed to submit lore" });
    }
  });

  // Upvote lore (with validation)
  app.post('/api/lore/:id/upvote', isAuthenticated, async (req: any, res) => {
    try {
      const paramsResult = paramIdSchema.safeParse(req.params);
      if (!paramsResult.success) {
        return res.status(400).json({ message: "Invalid lore ID" });
      }
      
      const { id } = paramsResult.data;
      const lore = await storage.upvoteLore(id);
      res.json(lore);
    } catch (error) {
      console.error("Error upvoting lore:", error);
      res.status(500).json({ message: "Failed to upvote" });
    }
  });

  // Admin: Update lore status (requires admin authorization)
  // Note: Admin users are identified by email domain or explicit admin list
  const ADMIN_EMAILS = ['admin@eternalchase.com', 'dev@example.com'];
  
  app.patch('/api/lore/:id/status', isAuthenticated, async (req: any, res) => {
    try {
      const paramsResult = paramIdSchema.safeParse(req.params);
      if (!paramsResult.success) {
        return res.status(400).json({ message: "Invalid lore ID" });
      }
      
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      // Check admin authorization
      const isAdmin = user?.email && ADMIN_EMAILS.includes(user.email);
      if (!isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const { id } = paramsResult.data;
      const { status } = req.body;
      
      if (!status || !['pending', 'approved', 'featured', 'rejected'].includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }
      
      const lore = await storage.updateLoreStatus(id, status);
      if (!lore) {
        return res.status(404).json({ message: "Lore entry not found" });
      }
      res.json(lore);
    } catch (error) {
      console.error("Error updating lore status:", error);
      res.status(500).json({ message: "Failed to update lore status" });
    }
  });

  // ============================================
  // QUEST ROUTES
  // ============================================

  // Get active quests
  app.get('/api/quests', async (req, res) => {
    try {
      const quests = await storage.getActiveQuests();
      res.json(quests);
    } catch (error) {
      console.error("Error fetching quests:", error);
      res.status(500).json({ message: "Failed to fetch quests" });
    }
  });

  // Get user's quests
  app.get('/api/quests/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const quests = await storage.getUserQuests(userId);
      res.json(quests);
    } catch (error) {
      console.error("Error fetching user quests:", error);
      res.status(500).json({ message: "Failed to fetch your quests" });
    }
  });

  // Start a quest (with validation)
  app.post('/api/quests/:questId/start', isAuthenticated, async (req: any, res) => {
    try {
      const paramsResult = questIdSchema.safeParse(req.params);
      if (!paramsResult.success) {
        return res.status(400).json({ message: "Invalid quest ID" });
      }
      
      const userId = req.user.claims.sub;
      const { questId } = paramsResult.data;
      const quest = await storage.startQuest(userId, questId);
      res.json(quest);
    } catch (error) {
      console.error("Error starting quest:", error);
      res.status(500).json({ message: "Failed to start quest" });
    }
  });

  // Update quest progress (with validation)
  app.patch('/api/quests/:questId/progress', isAuthenticated, async (req: any, res) => {
    try {
      const paramsResult = questIdSchema.safeParse(req.params);
      if (!paramsResult.success) {
        return res.status(400).json({ message: "Invalid quest ID" });
      }
      
      const bodyResult = questProgressSchema.safeParse(req.body);
      if (!bodyResult.success) {
        return res.status(400).json({ message: "Progress must be a number between 0 and 100" });
      }
      
      const userId = req.user.claims.sub;
      const { questId } = paramsResult.data;
      const { progress } = bodyResult.data;
      const quest = await storage.updateQuestProgress(userId, questId, progress);
      res.json(quest);
    } catch (error) {
      console.error("Error updating quest:", error);
      res.status(500).json({ message: "Failed to update quest" });
    }
  });

  // Complete a quest (with validation)
  app.post('/api/quests/:questId/complete', isAuthenticated, async (req: any, res) => {
    try {
      const paramsResult = questIdSchema.safeParse(req.params);
      if (!paramsResult.success) {
        return res.status(400).json({ message: "Invalid quest ID" });
      }
      
      const userId = req.user.claims.sub;
      const { questId } = paramsResult.data;
      const quest = await storage.completeQuest(userId, questId);
      
      if (quest) {
        await storage.addUserXp(userId, 200);
      }
      
      res.json(quest);
    } catch (error) {
      console.error("Error completing quest:", error);
      res.status(500).json({ message: "Failed to complete quest" });
    }
  });

  // ============================================
  // STAR MAP ROUTES
  // ============================================

  // Get all star map nodes
  app.get('/api/starmap', async (req, res) => {
    try {
      const nodes = await storage.getAllStarMapNodes();
      res.json(nodes);
    } catch (error) {
      console.error("Error fetching star map:", error);
      res.status(500).json({ message: "Failed to fetch star map" });
    }
  });

  // Get user's star map progress
  app.get('/api/starmap/progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const progress = await storage.getUserStarMapProgress(userId);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching star map progress:", error);
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  // Discover a node (with validation)
  app.post('/api/starmap/:nodeId/discover', isAuthenticated, async (req: any, res) => {
    try {
      const paramsResult = nodeIdSchema.safeParse(req.params);
      if (!paramsResult.success) {
        return res.status(400).json({ message: "Invalid node ID" });
      }
      
      const userId = req.user.claims.sub;
      const { nodeId } = paramsResult.data;
      await storage.discoverNode(userId, nodeId);
      await storage.addUserXp(userId, 30);
      res.json({ success: true });
    } catch (error) {
      console.error("Error discovering node:", error);
      res.status(500).json({ message: "Failed to discover node" });
    }
  });

  // Unlock a node (with validation)
  app.post('/api/starmap/:nodeId/unlock', isAuthenticated, async (req: any, res) => {
    try {
      const paramsResult = nodeIdSchema.safeParse(req.params);
      if (!paramsResult.success) {
        return res.status(400).json({ message: "Invalid node ID" });
      }
      
      const userId = req.user.claims.sub;
      const { nodeId } = paramsResult.data;
      await storage.unlockNode(userId, nodeId);
      await storage.addUserXp(userId, 75);
      res.json({ success: true });
    } catch (error) {
      console.error("Error unlocking node:", error);
      res.status(500).json({ message: "Failed to unlock node" });
    }
  });

  // ============================================
  // DAILY SIGNALS ROUTES
  // ============================================

  // Get today's signal
  app.get('/api/signals/today', async (req, res) => {
    try {
      const signal = await storage.getTodaySignal();
      res.json(signal || { message: "No cosmic signal today" });
    } catch (error) {
      console.error("Error fetching signal:", error);
      res.status(500).json({ message: "Failed to fetch signal" });
    }
  });

  // Claim daily signal
  app.post('/api/signals/claim', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const signal = await storage.getTodaySignal();
      
      if (!signal) {
        return res.status(404).json({ message: "No signal available today" });
      }
      
      const result = await storage.claimDailySignal(userId, signal.id);
      
      if (result.claimed) {
        await storage.addUserXp(userId, signal.bonusXp || 50);
        
        await storage.updateUserProfile(userId, {
          currentStreak: result.streak
        });
      }
      
      res.json(result);
    } catch (error) {
      console.error("Error claiming signal:", error);
      res.status(500).json({ message: "Failed to claim signal" });
    }
  });

  // Get user's streak
  app.get('/api/signals/streak', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const streak = await storage.getUserStreak(userId);
      res.json({ streak });
    } catch (error) {
      console.error("Error fetching streak:", error);
      res.status(500).json({ message: "Failed to fetch streak" });
    }
  });

  // ============================================
  // SEASONAL EVENTS ROUTES
  // ============================================

  // Get active events
  app.get('/api/events', async (req, res) => {
    try {
      const events = await storage.getActiveEvents();
      res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  // Join an event (with validation)
  app.post('/api/events/:eventId/join', isAuthenticated, async (req: any, res) => {
    try {
      const paramsResult = eventIdSchema.safeParse(req.params);
      if (!paramsResult.success) {
        return res.status(400).json({ message: "Invalid event ID" });
      }
      
      const userId = req.user.claims.sub;
      const { eventId } = paramsResult.data;
      const participation = await storage.joinEvent(userId, eventId);
      res.json(participation);
    } catch (error) {
      console.error("Error joining event:", error);
      res.status(500).json({ message: "Failed to join event" });
    }
  });

  // Update event progress (with validation)
  const eventProgressBodySchema = z.object({
    points: z.number().min(0).max(100000).optional(),
    milestone: z.string().min(1).max(100).optional()
  });
  
  app.patch('/api/events/:eventId/progress', isAuthenticated, async (req: any, res) => {
    try {
      const paramsResult = eventIdSchema.safeParse(req.params);
      if (!paramsResult.success) {
        return res.status(400).json({ message: "Invalid event ID" });
      }
      
      const bodyResult = eventProgressBodySchema.safeParse(req.body);
      if (!bodyResult.success) {
        return res.status(400).json({ message: "Invalid progress data" });
      }
      
      const userId = req.user.claims.sub;
      const { eventId } = paramsResult.data;
      const { points, milestone } = bodyResult.data;
      const progress = await storage.updateEventProgress(userId, eventId, points, milestone);
      res.json(progress);
    } catch (error) {
      console.error("Error updating event progress:", error);
      res.status(500).json({ message: "Failed to update event progress" });
    }
  });

  // ============================================
  // AI AGENT COMMAND CENTER ROUTES
  // ============================================

  // Seed default agents on startup
  await storage.seedDefaultAgents();

  // GET all agents
  app.get("/api/agents", async (req, res) => {
    try {
      const allAgents = await storage.getAllAgents();
      res.json(allAgents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch agents" });
    }
  });

  // PATCH agent status
  app.patch("/api/agents/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = z.object({ status: z.enum(["active", "idle", "disabled"]) }).parse(req.body);
      const updated = await storage.updateAgentStatus(id, status);
      if (!updated) return res.status(404).json({ message: "Agent not found" });
      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ message: "Invalid status", errors: error.errors });
      res.status(500).json({ message: "Failed to update agent status" });
    }
  });

  // GET all agent jobs
  app.get("/api/agent-jobs", async (req, res) => {
    try {
      const jobs = await storage.getAllAgentJobs();
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch agent jobs" });
    }
  });

  // POST create agent job proposal
  app.post("/api/agent-jobs", async (req, res) => {
    try {
      const validated = insertAgentJobSchema.parse(req.body);
      const job = await storage.createAgentJob(validated);
      res.json(job);
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ message: "Invalid job data", errors: error.errors });
      res.status(500).json({ message: "Failed to create agent job" });
    }
  });

  // PATCH approve or reject a job
  app.patch("/api/agent-jobs/:id/approve", async (req, res) => {
    try {
      const { id } = req.params;
      const { approved, note } = z.object({
        approved: z.boolean(),
        note: z.string().optional(),
      }).parse(req.body);
      const updated = await storage.approveAgentJob(id, approved, note);
      if (!updated) return res.status(404).json({ message: "Job not found" });
      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ message: "Invalid approval data", errors: error.errors });
      res.status(500).json({ message: "Failed to update job approval" });
    }
  });

  // GET all execution runs
  app.get("/api/execution-runs", async (req, res) => {
    try {
      const runs = await storage.getAllExecutionRuns();
      res.json(runs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch execution runs" });
    }
  });

  // GET agent memory
  app.get("/api/agent-memory", async (req, res) => {
    try {
      const memories = await storage.getAllAgentMemory();
      res.json(memories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch agent memory" });
    }
  });

  // POST add agent memory
  app.post("/api/agent-memory", async (req, res) => {
    try {
      const validated = insertAgentMemorySchema.parse(req.body);
      const memory = await storage.addAgentMemory(validated);
      res.json(memory);
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ message: "Invalid memory data", errors: error.errors });
      res.status(500).json({ message: "Failed to add agent memory" });
    }
  });

  // GET daily executive brief (aggregated snapshot)
  app.get("/api/agent-command/daily-brief", async (req, res) => {
    try {
      const [allAgents, allJobs, allRuns, memories] = await Promise.all([
        storage.getAllAgents(),
        storage.getAllAgentJobs(),
        storage.getAllExecutionRuns(),
        storage.getAllAgentMemory(),
      ]);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayRuns = allRuns.filter(r => r.startTime && new Date(r.startTime) >= today);
      const pendingApprovals = allJobs.filter(j => j.approvalStatus === "pending");
      const completedToday = todayRuns.filter(r => r.executionStatus === "completed");
      const failedToday = todayRuns.filter(r => r.executionStatus === "failed");

      const agentMetrics = allAgents.map(agent => {
        const agentRuns = allRuns.filter(r => r.agentId === agent.id);
        const completed = agentRuns.filter(r => r.executionStatus === "completed");
        const avgQuality = completed.length > 0
          ? completed.reduce((sum, r) => sum + (r.qualityScore || 0), 0) / completed.length
          : 0;
        return {
          agentId: agent.id,
          agentName: agent.agentName,
          role: agent.role,
          status: agent.status,
          tasksCompleted: completed.length,
          avgQualityScore: Math.round(avgQuality * 10) / 10,
        };
      });

      res.json({
        date: new Date().toISOString(),
        executiveSummary: {
          activeAgents: allAgents.filter(a => a.status === "active").length,
          totalAgents: allAgents.length,
          pendingApprovals: pendingApprovals.length,
          executionsToday: todayRuns.length,
          completedToday: completedToday.length,
          failedToday: failedToday.length,
          memoriesStored: memories.length,
        },
        pendingApprovals,
        agentMetrics,
        recentRuns: allRuns.slice(0, 10),
        topMemories: memories.slice(0, 5),
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to generate daily brief" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
