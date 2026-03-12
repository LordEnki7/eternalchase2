import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  User, Trophy, BookOpen, Gamepad2, Users, Star
} from "lucide-react";

export default function QuickLinks() {
  const { isAuthenticated } = useAuth();
  const [location] = useLocation();

  const links = [
    { href: "/profile", label: "My Profile", icon: User, requiresAuth: true },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy, requiresAuth: false },
    { href: "/community", label: "Community Lore", icon: Users, requiresAuth: false },
    { href: "/resonance-raiders", label: "Play Game", icon: Gamepad2, requiresAuth: false },
  ];

  const visibleLinks = links.filter(link => !link.requiresAuth || isAuthenticated);

  if (location === "/profile" || location === "/leaderboard" || location === "/community") {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-40 flex gap-2">
      {visibleLinks.map(link => {
        const Icon = link.icon;
        return (
          <Link key={link.href} href={link.href}>
            <Button
              variant="outline"
              size="sm"
              className="bg-slate-900/80 border-purple-500/30 text-purple-300 hover:bg-purple-900/50 hover:text-white backdrop-blur-sm"
            >
              <Icon className="w-4 h-4 mr-1" />
              <span className="hidden md:inline">{link.label}</span>
            </Button>
          </Link>
        );
      })}
    </div>
  );
}
