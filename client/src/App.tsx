import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { LanguageProvider } from "@/hooks/use-language";
import { GlobalAudioProvider } from '@/hooks/useGlobalAudio';
import DynamicThemeController from '@/components/DynamicThemeController';
import Home from "@/pages/home";
import Landing from "./pages/landing";
import YoungAdult from "@/pages/young-adult";
import ResonanceRaiders from "@/pages/resonance-raiders";
import ResonanceRaidersSimple from "@/pages/resonance-raiders-simple";
import ResonanceRaidersRebuilt from "@/pages/resonance-raiders-rebuilt";
import Shop from "@/pages/shop";
import Trilogy from "@/pages/trilogy";
import Bookstore from "@/pages/bookstore";
import Checkout from "@/pages/checkout";
import PurchaseSuccess from "@/pages/purchase-success";
import AdminDashboard from "@/pages/admin";
import CosmicProfile from "@/pages/cosmic-profile";
import Leaderboard from "@/pages/leaderboard";
import CommunityLore from "@/pages/community-lore";
import DailySignal from "@/components/DailySignal";
import MobileNav from "@/components/MobileNav";
import SkipToContent from "@/components/SkipToContent";
import NotFound from "@/pages/not-found";

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {/* In freemium model, don't block on auth loading - let users access content */}
      <Route path="/" component={Home} />
      <Route path="/trilogy" component={Trilogy} />
      <Route path="/young-adult" component={YoungAdult} />
      <Route path="/resonance-raiders" component={ResonanceRaidersRebuilt} />
      <Route path="/resonance-raiders-old" component={ResonanceRaiders} />
      <Route path="/resonance-raiders-test" component={ResonanceRaidersSimple} />
      <Route path="/shop" component={Shop} />
      <Route path="/bookstore" component={Bookstore} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/purchase-success" component={PurchaseSuccess} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/profile" component={CosmicProfile} />
      <Route path="/leaderboard" component={Leaderboard} />
      <Route path="/community" component={CommunityLore} />
      <Route path="/landing" component={Landing} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <GlobalAudioProvider>
          <TooltipProvider>
            <SkipToContent />
            <Toaster />
            <Router />
            <MobileNav />
            <DynamicThemeController />
            <DailySignal />
          </TooltipProvider>
        </GlobalAudioProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
