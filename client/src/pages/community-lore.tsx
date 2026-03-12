import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { queryClient } from "@/lib/queryClient";
import { Link } from "wouter";
import { useState } from "react";
import { 
  BookOpen, ArrowLeft, Heart, Star, User,
  PenTool, Sparkles, MessageSquare, ThumbsUp
} from "lucide-react";

interface LoreEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  category: string;
  status: string;
  upvotes: number | null;
  featured: boolean | null;
  createdAt: string | null;
}

const CATEGORIES = [
  { value: "character_theory", label: "Character Theories" },
  { value: "world_building", label: "World Building" },
  { value: "fan_art_description", label: "Fan Art Description" },
  { value: "alternate_ending", label: "Alternate Endings" },
];

function getCategoryLabel(value: string): string {
  return CATEGORIES.find(c => c.value === value)?.label || value;
}

function getCategoryColor(category: string): string {
  switch (category) {
    case "character_theory":
      return "bg-purple-600";
    case "world_building":
      return "bg-cyan-600";
    case "fan_art_description":
      return "bg-pink-600";
    case "alternate_ending":
      return "bg-orange-600";
    default:
      return "bg-gray-600";
  }
}

export default function CommunityLore() {
  const { isAuthenticated } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const { data: lore, isLoading } = useQuery<LoreEntry[]>({
    queryKey: ["/api/lore"]
  });

  const submitMutation = useMutation({
    mutationFn: async (loreData: { title: string; content: string; category: string }) => {
      const response = await fetch("/api/lore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loreData),
        credentials: "include"
      });
      if (!response.ok) throw new Error("Failed to submit lore");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lore"] });
      setIsDialogOpen(false);
      setNewTitle("");
      setNewContent("");
      setNewCategory("");
    }
  });

  const upvoteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/lore/${id}/upvote`, {
        method: "POST",
        credentials: "include"
      });
      if (!response.ok) throw new Error("Failed to upvote");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lore"] });
    }
  });

  const handleSubmit = () => {
    if (!newTitle.trim() || !newContent.trim() || !newCategory) return;
    submitMutation.mutate({ title: newTitle, content: newContent, category: newCategory });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="animate-pulse text-purple-400">Loading cosmic lore...</div>
      </div>
    );
  }

  const featuredLore = (lore || []).filter(l => l.featured);
  const regularLore = (lore || []).filter(l => !l.featured);

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
            Return Home
          </Button>
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <BookOpen className="w-10 h-10 text-purple-400" />
              Community Lore
            </h1>
            <p className="text-gray-400">Share your theories, stories, and cosmic discoveries</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-purple-600 hover:bg-purple-700"
                disabled={!isAuthenticated}
              >
                <PenTool className="w-4 h-4 mr-2" />
                Submit Your Lore
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-purple-500/50 max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  Share Your Cosmic Knowledge
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <Input
                  placeholder="Title of your lore entry..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="bg-slate-800 border-purple-500/50"
                />
                <Select value={newCategory} onValueChange={setNewCategory}>
                  <SelectTrigger className="bg-slate-800 border-purple-500/50">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-purple-500/50">
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Textarea
                  placeholder="Share your theory, story, or discovery..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="bg-slate-800 border-purple-500/50 min-h-[200px]"
                />
                <Button
                  onClick={handleSubmit}
                  disabled={submitMutation.isPending || !newTitle || !newContent || !newCategory}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {submitMutation.isPending ? "Submitting..." : "Submit for Review"}
                </Button>
                <p className="text-gray-400 text-sm text-center">
                  Your submission will be reviewed before appearing publicly. Earn +25 XP!
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {!isAuthenticated && (
          <Card className="bg-purple-900/30 border-purple-500/30 mb-6">
            <CardContent className="p-4 flex items-center justify-between">
              <p className="text-gray-300">Sign in to submit your own cosmic lore and earn XP!</p>
              <Link href="/">
                <Button variant="outline" className="border-purple-500/50">
                  Sign In
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {featuredLore.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-400" />
              Featured Lore
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featuredLore.map(entry => (
                <Card key={entry.id} className="bg-gradient-to-br from-yellow-900/30 to-purple-900/30 border-yellow-500/50">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={getCategoryColor(entry.category)}>
                        {getCategoryLabel(entry.category)}
                      </Badge>
                      <Badge className="bg-yellow-600">Featured</Badge>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{entry.title}</h3>
                    <p className="text-gray-300 text-sm line-clamp-3">{entry.content}</p>
                    <div className="flex items-center justify-between mt-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => upvoteMutation.mutate(entry.id)}
                        className="text-pink-400 hover:text-pink-300"
                      >
                        <Heart className="w-4 h-4 mr-1" />
                        {entry.upvotes || 0}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">All Lore Entries</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {regularLore.map(entry => (
              <Card key={entry.id} className="bg-slate-900/80 border-purple-500/30 hover:border-purple-400/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getCategoryColor(entry.category)}>
                      {getCategoryLabel(entry.category)}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{entry.title}</h3>
                  <p className="text-gray-300 text-sm line-clamp-4">{entry.content}</p>
                  <div className="flex items-center justify-between mt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => upvoteMutation.mutate(entry.id)}
                      className="text-pink-400 hover:text-pink-300"
                    >
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      {entry.upvotes || 0}
                    </Button>
                    {entry.createdAt && (
                      <span className="text-gray-500 text-xs">
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {(!lore || lore.length === 0) && (
              <div className="col-span-full text-center py-16">
                <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">No lore entries yet! Be the first to share your cosmic knowledge.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
