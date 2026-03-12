import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SubscriptionModal } from "@/components/SubscriptionModal";
import { Sparkles, Crown, Book, Headphones, Users, Globe, Rocket, Heart } from "lucide-react";

export default function Landing() {
  const [showSubscription, setShowSubscription] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
          <div className="absolute top-40 right-32 w-1 h-1 bg-blue-400 rounded-full animate-pulse" />
          <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse" />
          <div className="absolute top-60 left-1/2 w-1 h-1 bg-cyan-400 rounded-full animate-pulse" />
        </div>
        
        <div className="relative container mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                <Sparkles className="w-4 h-4 mr-2" />
                Sci-Fi Romance Thriller
              </Badge>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.href = "/young-adult"}
                className="border-amber-400/50 text-amber-300 hover:bg-amber-500/10"
              >
                <Book className="w-4 h-4 mr-2" />
                Young Adult Section
              </Button>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Eternal Chase
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Enter a universe where love transcends dimensions and every choice shapes the cosmic balance. 
              Experience the complete trilogy that's captivating readers across the galaxy.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                size="lg" 
                onClick={() => window.location.href = "/api/login"}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-4"
              >
                <Crown className="w-5 h-5 mr-2" />
                Sign In to Access Premium
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => setShowSubscription(true)}
                className="border-purple-400/50 text-purple-300 hover:bg-purple-500/10 text-lg px-8 py-4"
              >
                <Rocket className="w-5 h-5 mr-2" />
                Explore Premium Features
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Unlock the Complete Universe
          </h2>
          <p className="text-xl text-gray-300">
            Premium subscription gives you unlimited access to the entire Eternal Chase experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-500/30 hover:border-purple-400/50 transition-colors">
            <CardHeader>
              <Book className="w-12 h-12 text-purple-400 mb-4" />
              <CardTitle className="text-xl text-purple-300">Complete Trilogy</CardTitle>
              <CardDescription className="text-gray-300">
                All three books in the Eternal Chase series with unlimited reading access
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-blue-500/30 hover:border-blue-400/50 transition-colors">
            <CardHeader>
              <Headphones className="w-12 h-12 text-blue-400 mb-4" />
              <CardTitle className="text-xl text-blue-300">Premium Audiobooks</CardTitle>
              <CardDescription className="text-gray-300">
                Professional narration bringing characters to life with immersive audio experience
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-pink-900/20 to-purple-900/20 border-pink-500/30 hover:border-pink-400/50 transition-colors">
            <CardHeader>
              <Users className="w-12 h-12 text-pink-400 mb-4" />
              <CardTitle className="text-xl text-pink-300">Character Deep-Dives</CardTitle>
              <CardDescription className="text-gray-300">
                Exclusive character backgrounds, relationships, and cosmic lore content
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border-cyan-500/30 hover:border-cyan-400/50 transition-colors">
            <CardHeader>
              <Globe className="w-12 h-12 text-cyan-400 mb-4" />
              <CardTitle className="text-xl text-cyan-300">Cosmic Universe</CardTitle>
              <CardDescription className="text-gray-300">
                Interactive galactic maps, timeline exploration, and universe building content
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border-yellow-500/30 hover:border-yellow-400/50 transition-colors">
            <CardHeader>
              <Crown className="w-12 h-12 text-yellow-400 mb-4" />
              <CardTitle className="text-xl text-yellow-300">Ad-Free Experience</CardTitle>
              <CardDescription className="text-gray-300">
                Uninterrupted reading and listening experience without any advertisements
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-red-900/20 to-pink-900/20 border-red-500/30 hover:border-red-400/50 transition-colors">
            <CardHeader>
              <Heart className="w-12 h-12 text-red-400 mb-4" />
              <CardTitle className="text-xl text-red-300">Romance Focused</CardTitle>
              <CardDescription className="text-gray-300">
                Deep emotional connections and romantic storylines that span across dimensions
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Pricing Card */}
        <div className="max-w-md mx-auto">
          <Card className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border-purple-500/50">
            <CardHeader className="text-center">
              <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30 mx-auto">
                <Sparkles className="w-4 h-4 mr-2" />
                Premium Access
              </Badge>
              <CardTitle className="text-3xl font-bold text-white">$9.99/month</CardTitle>
              <CardDescription className="text-gray-300">
                Cancel anytime • Unlimited access • Premium support
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg py-6"
                onClick={() => window.location.href = "/api/login"}
              >
                <Crown className="w-5 h-5 mr-2" />
                Sign In & Subscribe
              </Button>
              <p className="text-center text-sm text-gray-400 mt-4">
                Sign in with your Replit account to get started
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <SubscriptionModal 
        isOpen={showSubscription} 
        onClose={() => setShowSubscription(false)} 
      />
    </div>
  );
}