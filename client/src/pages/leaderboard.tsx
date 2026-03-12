import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { queryClient } from "@/lib/queryClient";
import { Link } from "wouter";
import { 
  Trophy, Medal, Crown, Star, ArrowLeft, 
  Gamepad2, User, Zap
} from "lucide-react";

interface LeaderboardEntry {
  id: string;
  userId: string;
  gameType: string;
  score: number;
  level: number | null;
  crystalsCollected: number | null;
  playTime: number | null;
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    profileImageUrl: string | null;
  };
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

function getRankIcon(rank: number) {
  switch (rank) {
    case 1:
      return <Crown className="w-6 h-6 text-yellow-400" />;
    case 2:
      return <Medal className="w-6 h-6 text-gray-300" />;
    case 3:
      return <Medal className="w-6 h-6 text-amber-600" />;
    default:
      return <span className="text-lg font-bold text-gray-400">#{rank}</span>;
  }
}

function getRankStyle(rank: number): string {
  switch (rank) {
    case 1:
      return "bg-gradient-to-r from-yellow-900/50 to-yellow-700/30 border-yellow-500/50";
    case 2:
      return "bg-gradient-to-r from-gray-800/50 to-gray-700/30 border-gray-400/50";
    case 3:
      return "bg-gradient-to-r from-amber-900/50 to-amber-700/30 border-amber-600/50";
    default:
      return "bg-slate-900/80 border-purple-500/30";
  }
}

export default function Leaderboard() {
  const { user, isAuthenticated } = useAuth() as {
    user: { id?: string; firstName?: string } | null;
    isAuthenticated: boolean;
  };

  const { data: leaderboard, isLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: ["/api/leaderboard/resonance_raiders", { limit: 100 }]
  });

  const { data: userBestScore } = useQuery<{ score: number }>({
    queryKey: ["/api/leaderboard/resonance_raiders/user"],
    enabled: isAuthenticated
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="animate-pulse text-purple-400">Loading cosmic rankings...</div>
      </div>
    );
  }

  const userRank = isAuthenticated && user?.id
    ? (leaderboard || []).findIndex(e => e.userId === user.id) + 1
    : 0;

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

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/">
          <Button variant="ghost" className="text-purple-400 hover:text-purple-300 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return Home
          </Button>
        </Link>

        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Trophy className="w-16 h-16 text-yellow-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Resonance Raiders</h1>
          <p className="text-xl text-purple-300">Cosmic Leaderboard</p>
        </div>

        {isAuthenticated && userBestScore && (
          <Card className="bg-gradient-to-r from-purple-900/50 to-cyan-900/30 border-purple-500/50 mb-6">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-xl font-bold text-white">
                  {(user?.firstName || "Y")[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Your Best Score</p>
                  <p className="text-2xl font-bold text-white">{userBestScore.score?.toLocaleString() || 0}</p>
                </div>
              </div>
              {userRank > 0 && (
                <div className="text-right">
                  <p className="text-gray-400 text-sm">Your Rank</p>
                  <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                    #{userRank}
                  </p>
                </div>
              )}
              <Link href="/resonance-raiders">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Gamepad2 className="w-4 h-4 mr-2" />
                  Play Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        <div className="space-y-3">
          {(leaderboard || []).map((entry, index) => {
            const rank = index + 1;
            const isCurrentUser = isAuthenticated && user?.id === entry.userId;
            
            return (
              <Card 
                key={entry.id} 
                className={`${getRankStyle(rank)} ${isCurrentUser ? 'ring-2 ring-purple-400' : ''} transition-all hover:scale-[1.01]`}
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-10 flex justify-center">
                    {getRankIcon(rank)}
                  </div>

                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-lg font-bold text-white">
                    {(entry.user?.firstName || "?")[0].toUpperCase()}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">
                        {entry.user?.firstName || "Anonymous Traveler"}
                      </span>
                      {isCurrentUser && (
                        <Badge className="bg-purple-600 text-xs">You</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      {entry.level && (
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          Level {entry.level}
                        </span>
                      )}
                      {entry.crystalsCollected && (
                        <span className="flex items-center gap-1">
                          <Zap className="w-3 h-3 text-cyan-400" />
                          {entry.crystalsCollected} crystals
                        </span>
                      )}
                      {entry.playTime && (
                        <span>{formatTime(entry.playTime)}</span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                      {entry.score.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400">points</div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {(!leaderboard || leaderboard.length === 0) && (
            <div className="text-center py-16">
              <Gamepad2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No scores yet! Be the first to claim the top spot.</p>
              <Link href="/resonance-raiders">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Gamepad2 className="w-4 h-4 mr-2" />
                  Play Resonance Raiders
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
