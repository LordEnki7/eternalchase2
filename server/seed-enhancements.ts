import { db } from "./db";
import { achievements, quests, starMapNodes, dailySignals, seasonalEvents } from "@shared/schema";

async function seedEnhancements() {
  console.log("Seeding enhancement data...");

  // Seed Achievements
  const achievementData = [
    { id: "first_chapter", name: "First Steps", description: "Complete your first chapter", icon: "book", category: "reading", tier: "bronze", requirement: { type: "chapters_completed", count: 1 }, xpReward: 50 },
    { id: "bookworm", name: "Bookworm", description: "Complete 5 chapters", icon: "book-open", category: "reading", tier: "silver", requirement: { type: "chapters_completed", count: 5 }, xpReward: 150 },
    { id: "cosmic_reader", name: "Cosmic Reader", description: "Complete 10 chapters", icon: "star", category: "reading", tier: "gold", requirement: { type: "chapters_completed", count: 10 }, xpReward: 300 },
    { id: "trilogy_complete", name: "Trilogy Master", description: "Complete all three books", icon: "crown", category: "reading", tier: "cosmic", requirement: { type: "books_completed", count: 3 }, xpReward: 1000 },
    { id: "explorer", name: "Cosmic Explorer", description: "Discover 5 Star Map locations", icon: "map", category: "exploration", tier: "silver", requirement: { type: "nodes_discovered", count: 5 }, xpReward: 200 },
    { id: "pathfinder", name: "Pathfinder", description: "Unlock all Star Map locations", icon: "compass", category: "exploration", tier: "cosmic", requirement: { type: "nodes_unlocked", count: 10 }, xpReward: 500 },
    { id: "first_score", name: "Crystal Hunter", description: "Score 1000 points in Resonance Raiders", icon: "gamepad", category: "game", tier: "bronze", requirement: { type: "game_score", count: 1000 }, xpReward: 100 },
    { id: "high_scorer", name: "High Scorer", description: "Score 10000 points in Resonance Raiders", icon: "trophy", category: "game", tier: "gold", requirement: { type: "game_score", count: 10000 }, xpReward: 400 },
    { id: "streak_7", name: "Weekly Warrior", description: "Maintain a 7-day streak", icon: "flame", category: "community", tier: "silver", requirement: { type: "streak", count: 7 }, xpReward: 200 },
    { id: "streak_30", name: "Cosmic Dedication", description: "Maintain a 30-day streak", icon: "fire", category: "community", tier: "cosmic", requirement: { type: "streak", count: 30 }, xpReward: 1000 },
    { id: "first_lore", name: "Storyteller", description: "Submit your first community lore entry", icon: "pen", category: "community", tier: "bronze", requirement: { type: "lore_submitted", count: 1 }, xpReward: 75 },
    { id: "popular_lore", name: "Popular Voice", description: "Get 10 upvotes on a lore entry", icon: "heart", category: "community", tier: "silver", requirement: { type: "lore_upvotes", count: 10 }, xpReward: 200 },
  ];

  for (const achievement of achievementData) {
    await db.insert(achievements).values(achievement).onConflictDoNothing();
  }
  console.log("✓ Achievements seeded");

  // Seed Quests
  const questData = [
    { id: "daily_read", name: "Daily Reading", description: "Read at least one chapter today", type: "daily", requirements: [{ type: "chapter_progress", count: 1 }], rewards: { xp: 50 }, isPremium: false },
    { id: "weekly_explorer", name: "Weekly Explorer", description: "Discover 3 new Star Map locations this week", type: "weekly", requirements: [{ type: "nodes_discovered", count: 3 }], rewards: { xp: 200 }, isPremium: false },
    { id: "first_book", name: "Complete Book One", description: "Finish reading Eternal Chase: Awakening", type: "story", requirements: [{ type: "book_completed", bookId: "book1" }], rewards: { xp: 500, achievement: "first_book" }, isPremium: false },
    { id: "character_gallery", name: "Meet the Crew", description: "View all 7 character profiles", type: "exploration", requirements: [{ type: "characters_viewed", count: 7 }], rewards: { xp: 150 }, isPremium: false },
    { id: "game_master", name: "Resonance Master", description: "Score 5000 points in Resonance Raiders", type: "story", requirements: [{ type: "game_score", count: 5000 }], rewards: { xp: 300 }, isPremium: false },
  ];

  for (const quest of questData) {
    await db.insert(quests).values(quest).onConflictDoNothing();
  }
  console.log("✓ Quests seeded");

  // Seed Star Map Nodes
  const starMapData = [
    { id: "earth", name: "Earth", description: "The birthplace of humanity, now a distant memory for the cosmic travelers.", coordinates: { x: 0, y: 0, z: 0 }, nodeType: "planet", storyContent: "Earth stood as the cradle of all human dreams, its blue marble surface holding the hopes of billions before the Great Departure.", isPremium: false },
    { id: "altherra_prime", name: "Altherra Prime", description: "The central hub of Galaxy Altherra, where all paths converge.", coordinates: { x: 100, y: 50, z: 20 }, nodeType: "planet", storyContent: "Altherra Prime pulses with cosmic energy, its crystalline spires reaching toward infinity. Here, the Council of Stars convenes to shape the fate of the galaxy.", isPremium: false },
    { id: "void_station", name: "Void Station Omega", description: "A mysterious station at the edge of known space.", coordinates: { x: -80, y: 120, z: -40 }, nodeType: "station", storyContent: "Few dare to approach Void Station Omega, where reality itself seems to fray at the edges. Those who enter speak of whispers from dimensions beyond our own.", isPremium: true },
    { id: "nebula_heart", name: "The Nebula Heart", description: "A swirling cosmic phenomenon of immense power.", coordinates: { x: 200, y: -30, z: 60 }, nodeType: "anomaly", storyContent: "The Nebula Heart beats with the rhythm of creation itself, birthing new stars while consuming the old. Its beauty is matched only by its danger.", isPremium: false },
    { id: "resonance_gate", name: "Resonance Gate Alpha", description: "The first of the ancient wormhole gates.", coordinates: { x: 50, y: 80, z: -20 }, nodeType: "wormhole", storyContent: "Built by a civilization long forgotten, the Resonance Gates connect distant corners of the universe. Their secrets remain locked within crystalline cores.", isPremium: false },
    { id: "crystal_world", name: "Trisolar", description: "A world of living crystals and resonance energy.", coordinates: { x: -120, y: -60, z: 100 }, nodeType: "planet", storyContent: "Trisolar's surface shimmers with infinite facets, each crystal singing in harmony with the cosmic frequency. Here, the Resonance Raiders seek their treasures.", isPremium: false },
    { id: "shadow_realm", name: "The Shadow Realm", description: "Where light dares not venture.", coordinates: { x: -200, y: 0, z: -100 }, nodeType: "anomaly", storyContent: "In the Shadow Realm, darkness is not merely an absence of light—it is alive. The Null draws its power from this place of eternal night.", isPremium: true },
  ];

  for (const node of starMapData) {
    await db.insert(starMapNodes).values(node).onConflictDoNothing();
  }
  console.log("✓ Star Map nodes seeded");

  // Seed Today's Daily Signal
  const today = new Date().toISOString().split('T')[0];
  await db.insert(dailySignals).values({
    signalDate: today,
    title: "Cosmic Alignment Detected",
    message: "The stars have aligned in your favor today, cosmic traveler. A surge of resonance energy flows through the galaxy—seize this moment to advance your journey!",
    characterId: "aiyanna",
    bonusXp: 75
  }).onConflictDoNothing();
  console.log("✓ Daily signal seeded");

  // Seed Seasonal Event
  const eventStart = new Date();
  const eventEnd = new Date(eventStart.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days
  await db.insert(seasonalEvents).values({
    id: "starfall_festival",
    name: "Starfall Festival",
    description: "Celebrate the cosmic convergence with special challenges and rewards! Earn double XP and unlock exclusive badges.",
    theme: "starfall_festival",
    startDate: eventStart,
    endDate: eventEnd,
    rewards: {
      milestones: [
        { points: 100, reward: "50 Bonus XP" },
        { points: 500, reward: "Starfall Badge" },
        { points: 1000, reward: "Exclusive Profile Title" }
      ]
    },
    isActive: true
  }).onConflictDoNothing();
  console.log("✓ Seasonal event seeded");

  console.log("\n✨ All enhancement data seeded successfully!");
}

seedEnhancements()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Error seeding data:", err);
    process.exit(1);
  });
