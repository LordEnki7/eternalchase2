import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import { useState } from "react";
import { 
  User as UserIcon, Star, Trophy, Flame, BookOpen, Map, Zap, 
  Crown, Target, Heart, ArrowLeft, Sparkles, Medal,
  Rocket, Shield, Award
} from "lucide-react";

interface UserProfile {
  id: string;
  userId: string;
  displayName: string | null;
  cosmicTitle: string | null;
  totalXp: number | null;
  level: number | null;
  currentStreak: number | null;
  longestStreak: number | null;
  favoriteCharacter: string | null;
  preferredLanguage: string | null;
  bio: string | null;
  badges: string[] | null;
  settings: object | null;
}

interface UserProgress {
  id: string;
  userId: string;
  contentType: string;
  contentId: string;
  progressPercent: number | null;
  completed: boolean | null;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  tier: string;
  xpReward: number | null;
}

interface UserAchievement {
  id: string;
  achievementId: string;
  achievement: Achievement;
}

interface Quest {
  id: string;
  name: string;
  description: string;
  type: string;
}

interface UserQuest {
  id: string;
  questId: string;
  status: string;
  quest: Quest;
}

const LEVEL_TITLES = [
  "Stargazer", "Cosmic Wanderer", "Void Walker", "Nebula Seeker",
  "Galaxy Traveler", "Star Commander", "Cosmic Guardian", "Void Master",
  "Celestial Champion", "Eternal Voyager"
];

function getCosmicTitle(level: number): string {
  const index = Math.min(Math.floor(level / 5), LEVEL_TITLES.length - 1);
  return LEVEL_TITLES[index];
}

function getLevelProgress(xp: number): { current: number; next: number; progress: number } {
  const xpPerLevel = 1000;
  const current = Math.floor(xp / xpPerLevel) + 1;
  const xpInCurrentLevel = xp % xpPerLevel;
  const progress = (xpInCurrentLevel / xpPerLevel) * 100;
  return { current, next: current + 1, progress };
}

export default function CosmicProfile() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth() as { 
    user: { firstName?: string; lastName?: string; email?: string } | null; 
    isAuthenticated: boolean; 
    isLoading: boolean 
  };
  const [isEditing, setIsEditing] = useState(false);
  const [editBio, setEditBio] = useState("");
  const [editDisplayName, setEditDisplayName] = useState("");

  const { data: profile, isLoading: profileLoading } = useQuery<UserProfile>({
    queryKey: ["/api/profile"],
    enabled: isAuthenticated
  });

  const { data: userProgressData } = useQuery<UserProgress[]>({
    queryKey: ["/api/progress"],
    enabled: isAuthenticated
  });

  const { data: userAchievements } = useQuery<UserAchievement[]>({
    queryKey: ["/api/achievements/user"],
    enabled: isAuthenticated
  });

  const { data: allAchievements } = useQuery<Achievement[]>({
    queryKey: ["/api/achievements"]
  });

  const { data: userQuests } = useQuery<UserQuest[]>({
    queryKey: ["/api/quests/user"],
    enabled: isAuthenticated
  });

  const { data: streak } = useQuery<{ streak: number }>({
    queryKey: ["/api/signals/streak"],
    enabled: isAuthenticated
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: Partial<UserProfile>) => {
      const response = await fetch("/api/profile", { 
        method: "PATCH", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        credentials: "include"
      });
      if (!response.ok) throw new Error("Failed to update profile");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      setIsEditing(false);
    }
  });

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="animate-pulse text-purple-400">Loading cosmic profile...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-4">Cosmic Profile</h1>
          <p className="text-gray-400 mb-6">
            Sign in to track your cosmic journey, unlock achievements, and connect with other travelers.
          </p>
          <Link href="/">
            <Button className="bg-purple-600 hover:bg-purple-700">
              Return Home to Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const levelInfo = getLevelProgress(profile?.totalXp || 0);
  const completedContent = (userProgressData || []).filter((p) => p.completed).length;
  const activeQuests = (userQuests || []).filter((q) => q.status === 'active').length;
  const unlockedAchievements = (userAchievements || []).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              width: Math.random() * 3 + 1 + "px",
              height: Math.random() * 3 + 1 + "px",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
              animationDelay: Math.random() * 3 + "s",
              animationDuration: Math.random() * 3 + 2 + "s",
              opacity: Math.random() * 0.7 + 0.3
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        <Link href="/">
          <Button variant="ghost" className="text-purple-400 hover:text-purple-300 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to Eternal Chase
          </Button>
        </Link>

        <div className="bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-4xl font-bold text-white">
                {(profile?.displayName || user?.firstName || "C")[0].toUpperCase()}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-yellow-500 rounded-full p-1">
                <Crown className="w-4 h-4 text-slate-900" />
              </div>
            </div>

            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <Input
                    value={editDisplayName}
                    onChange={(e) => setEditDisplayName(e.target.value)}
                    placeholder="Display Name"
                    className="bg-slate-800 border-purple-500/50"
                  />
                  <Textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    placeholder="Tell us about your cosmic journey..."
                    className="bg-slate-800 border-purple-500/50"
                  />
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => updateProfileMutation.mutate({ displayName: editDisplayName, bio: editBio })}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Save
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold text-white">
                      {profile?.displayName || user?.firstName || "Cosmic Traveler"}
                    </h1>
                    <Badge className="bg-purple-600">{getCosmicTitle(levelInfo.current)}</Badge>
                  </div>
                  <p className="text-gray-400 mb-3">
                    {profile?.bio || "A mysterious traveler exploring the cosmic realms..."}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditDisplayName(profile?.displayName || "");
                      setEditBio(profile?.bio || "");
                      setIsEditing(true);
                    }}
                  >
                    Edit Profile
                  </Button>
                </>
              )}
            </div>

            <div className="text-right">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                Level {levelInfo.current}
              </div>
              <div className="text-gray-400 text-sm mb-2">
                {profile?.totalXp || 0} XP Total
              </div>
              <div className="w-48">
                <Progress value={levelInfo.progress} className="h-2 bg-slate-700" />
                <div className="text-xs text-gray-500 mt-1">
                  {Math.round(levelInfo.progress)}% to Level {levelInfo.next}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-900/80 border-purple-500/30">
            <CardContent className="p-4 text-center">
              <BookOpen className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{completedContent}</div>
              <div className="text-gray-400 text-sm">Chapters Read</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/80 border-cyan-500/30">
            <CardContent className="p-4 text-center">
              <Trophy className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{unlockedAchievements}</div>
              <div className="text-gray-400 text-sm">Achievements</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/80 border-orange-500/30">
            <CardContent className="p-4 text-center">
              <Flame className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{streak?.streak || 0}</div>
              <div className="text-gray-400 text-sm">Day Streak</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/80 border-green-500/30">
            <CardContent className="p-4 text-center">
              <Target className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{activeQuests}</div>
              <div className="text-gray-400 text-sm">Active Quests</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="achievements" className="w-full">
          <TabsList className="bg-slate-900/80 border border-purple-500/30 mb-6">
            <TabsTrigger value="achievements" className="data-[state=active]:bg-purple-600">
              <Trophy className="w-4 h-4 mr-2" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="progress" className="data-[state=active]:bg-purple-600">
              <BookOpen className="w-4 h-4 mr-2" />
              Reading Progress
            </TabsTrigger>
            <TabsTrigger value="quests" className="data-[state=active]:bg-purple-600">
              <Map className="w-4 h-4 mr-2" />
              Quests
            </TabsTrigger>
            <TabsTrigger value="badges" className="data-[state=active]:bg-purple-600">
              <Medal className="w-4 h-4 mr-2" />
              Badges
            </TabsTrigger>
          </TabsList>

          <TabsContent value="achievements">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(allAchievements || []).map((achievement: any) => {
                const isUnlocked = (userAchievements || []).some(
                  (ua: any) => ua.achievementId === achievement.id
                );
                return (
                  <Card 
                    key={achievement.id}
                    className={`bg-slate-900/80 border transition-all ${
                      isUnlocked 
                        ? "border-yellow-500/50 shadow-lg shadow-yellow-500/20" 
                        : "border-gray-700/50 opacity-60"
                    }`}
                  >
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        isUnlocked 
                          ? "bg-gradient-to-br from-yellow-500 to-orange-500" 
                          : "bg-slate-700"
                      }`}>
                        {achievement.tier === "cosmic" && <Star className="w-6 h-6 text-white" />}
                        {achievement.tier === "gold" && <Trophy className="w-6 h-6 text-white" />}
                        {achievement.tier === "silver" && <Award className="w-6 h-6 text-white" />}
                        {achievement.tier === "bronze" && <Medal className="w-6 h-6 text-white" />}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{achievement.name}</h3>
                        <p className="text-gray-400 text-sm">{achievement.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={isUnlocked ? "default" : "secondary"} className="text-xs">
                            {achievement.tier}
                          </Badge>
                          <span className="text-xs text-purple-400">+{achievement.xpReward} XP</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {(!allAchievements || allAchievements.length === 0) && (
                <div className="col-span-full text-center py-12">
                  <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Achievements coming soon! Keep exploring the cosmos.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="progress">
            <div className="space-y-4">
              {(userProgressData || []).map((progress) => (
                <Card key={progress.id} className="bg-slate-900/80 border-purple-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-white capitalize">
                        {progress.contentType}: {progress.contentId}
                      </h3>
                      {progress.completed && (
                        <Badge className="bg-green-600">Completed</Badge>
                      )}
                    </div>
                    <Progress value={progress.progressPercent || 0} className="h-2" />
                    <p className="text-gray-400 text-sm mt-1">
                      {progress.progressPercent || 0}% complete
                    </p>
                  </CardContent>
                </Card>
              ))}

              {(!userProgressData || userProgressData.length === 0) && (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Start reading to track your progress!</p>
                  <Link href="/trilogy">
                    <Button className="mt-4 bg-purple-600 hover:bg-purple-700">
                      Begin Your Journey
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="quests">
            <div className="space-y-4">
              {(userQuests || []).map((userQuest: any) => (
                <Card 
                  key={userQuest.id} 
                  className={`bg-slate-900/80 border ${
                    userQuest.status === 'completed' 
                      ? 'border-green-500/50' 
                      : 'border-purple-500/30'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          userQuest.status === 'completed' 
                            ? 'bg-green-600' 
                            : 'bg-purple-600'
                        }`}>
                          {userQuest.quest?.type === 'daily' && <Zap className="w-5 h-5 text-white" />}
                          {userQuest.quest?.type === 'weekly' && <Target className="w-5 h-5 text-white" />}
                          {userQuest.quest?.type === 'story' && <BookOpen className="w-5 h-5 text-white" />}
                          {userQuest.quest?.type === 'exploration' && <Map className="w-5 h-5 text-white" />}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{userQuest.quest?.name}</h3>
                          <p className="text-gray-400 text-sm">{userQuest.quest?.description}</p>
                        </div>
                      </div>
                      <Badge className={userQuest.status === 'completed' ? 'bg-green-600' : 'bg-purple-600'}>
                        {userQuest.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {(!userQuests || userQuests.length === 0) && (
                <div className="text-center py-12">
                  <Map className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No active quests yet. Start exploring to unlock quests!</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="badges">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { id: "first_chapter", name: "First Chapter", icon: BookOpen, color: "from-blue-500 to-cyan-500", unlocked: completedContent >= 1 },
                { id: "book_worm", name: "Book Worm", icon: BookOpen, color: "from-purple-500 to-pink-500", unlocked: completedContent >= 5 },
                { id: "cosmic_reader", name: "Cosmic Reader", icon: Star, color: "from-yellow-500 to-orange-500", unlocked: completedContent >= 10 },
                { id: "streaker", name: "On Fire", icon: Flame, color: "from-orange-500 to-red-500", unlocked: (streak?.streak || 0) >= 7 },
                { id: "explorer", name: "Explorer", icon: Rocket, color: "from-cyan-500 to-blue-500", unlocked: false },
                { id: "champion", name: "Champion", icon: Trophy, color: "from-yellow-400 to-yellow-600", unlocked: unlockedAchievements >= 5 },
                { id: "guardian", name: "Guardian", icon: Shield, color: "from-emerald-500 to-green-600", unlocked: false },
                { id: "cosmic_master", name: "Cosmic Master", icon: Crown, color: "from-purple-600 to-violet-600", unlocked: levelInfo.current >= 10 },
              ].map((badge) => (
                <div
                  key={badge.id}
                  className={`relative group cursor-pointer transition-transform hover:scale-105 ${
                    !badge.unlocked && "opacity-40 grayscale"
                  }`}
                >
                  <div className={`w-full aspect-square rounded-xl bg-gradient-to-br ${badge.color} p-[3px]`}>
                    <div className="w-full h-full rounded-[10px] bg-slate-900 flex flex-col items-center justify-center p-3">
                      <badge.icon className="w-8 h-8 text-white mb-2" />
                      <span className="text-white text-xs font-medium text-center">{badge.name}</span>
                    </div>
                  </div>
                  {!badge.unlocked && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-slate-900/80 rounded-full p-2">
                        <Shield className="w-6 h-6 text-gray-500" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
