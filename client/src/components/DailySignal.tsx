import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { queryClient } from "@/lib/queryClient";
import { useState, useEffect } from "react";
import { Radio, Sparkles, Flame, Gift, X } from "lucide-react";

interface DailySignalData {
  id: string;
  signalDate: string;
  title: string;
  message: string;
  characterId: string | null;
  bonusXp: number | null;
}

interface ClaimResult {
  claimed: boolean;
  streak: number;
}

export default function DailySignal() {
  const { isAuthenticated } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const [showClaimed, setShowClaimed] = useState(false);
  const [animating, setAnimating] = useState(false);

  const { data: signal, isLoading } = useQuery<DailySignalData>({
    queryKey: ["/api/signals/today"]
  });

  const { data: streakData } = useQuery<{ streak: number }>({
    queryKey: ["/api/signals/streak"],
    enabled: isAuthenticated
  });

  const claimMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/signals/claim", {
        method: "POST",
        credentials: "include"
      });
      if (!response.ok) throw new Error("Failed to claim signal");
      return response.json() as Promise<ClaimResult>;
    },
    onSuccess: (data) => {
      if (data.claimed) {
        setAnimating(true);
        setTimeout(() => {
          setShowClaimed(true);
          setAnimating(false);
        }, 1000);
      }
      queryClient.invalidateQueries({ queryKey: ["/api/signals/streak"] });
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
    }
  });

  if (!isVisible || isLoading || !signal || !signal.id) {
    return null;
  }

  if (showClaimed) {
    return (
      <Card className="fixed bottom-4 right-4 z-50 bg-gradient-to-br from-purple-900/95 to-cyan-900/95 border-green-500/50 shadow-xl shadow-green-500/20 max-w-sm animate-in slide-in-from-right duration-300">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <Gift className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-green-400 font-semibold">Signal Claimed!</p>
                <p className="text-gray-300 text-sm">+{signal.bonusXp || 50} XP earned</p>
                <div className="flex items-center gap-1 mt-1">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span className="text-orange-400 text-sm font-medium">
                    {streakData?.streak || 1} day streak!
                  </span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-white -mt-1 -mr-2"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`fixed bottom-4 right-4 z-50 bg-gradient-to-br from-purple-900/95 to-slate-900/95 border-purple-500/50 shadow-xl shadow-purple-500/20 max-w-sm animate-in slide-in-from-right duration-300 ${animating ? 'scale-110 transition-transform' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center animate-pulse">
              <Radio className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <Badge className="bg-purple-600/50 text-purple-200 text-xs">
                Daily Cosmic Signal
              </Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-white -mt-1 -mr-2"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <h3 className="text-white font-semibold mb-1">{signal.title}</h3>
        <p className="text-gray-300 text-sm mb-3">{signal.message}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-400">+{signal.bonusXp || 50} XP</span>
            {(streakData?.streak || 0) > 0 && (
              <span className="text-gray-400">
                | <Flame className="w-3 h-3 inline text-orange-400" /> {streakData?.streak} day streak
              </span>
            )}
          </div>
          
          {isAuthenticated ? (
            <Button
              size="sm"
              onClick={() => claimMutation.mutate()}
              disabled={claimMutation.isPending}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {claimMutation.isPending ? "Claiming..." : "Claim"}
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="border-purple-500/50 text-purple-300"
              asChild
            >
              <a href="/">Sign in to claim</a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
