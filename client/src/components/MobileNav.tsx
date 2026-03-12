import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";
import {
  Menu, Home, User, Trophy, Users, Gamepad2, BookOpen
} from "lucide-react";

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const [location] = useLocation();

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/profile", label: "My Profile", icon: User, requiresAuth: true },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
    { href: "/community", label: "Community Lore", icon: Users },
    { href: "/resonance-raiders", label: "Play Game", icon: Gamepad2 },
    { href: "/young-adult", label: "Young Adult Stories", icon: BookOpen },
  ];

  const visibleLinks = navLinks.filter(link => !link.requiresAuth || isAuthenticated);

  return (
    <div className="md:hidden fixed top-4 left-4 z-50">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="bg-slate-900/90 border-purple-500/30 text-purple-300 hover:bg-purple-900/50 backdrop-blur-sm"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent 
          side="left" 
          className="w-72 bg-slate-900/95 border-purple-500/30 backdrop-blur-xl"
        >
          <SheetTitle className="text-purple-300 font-bold text-lg mb-6">
            Eternal Chase
          </SheetTitle>
          
          <nav className="flex flex-col gap-2" role="navigation" aria-label="Main navigation">
            {visibleLinks.map(link => {
              const Icon = link.icon;
              const isActive = location === link.href;
              
              return (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={`w-full justify-start gap-3 ${
                      isActive 
                        ? "bg-purple-900/50 text-white" 
                        : "text-purple-300 hover:text-white hover:bg-purple-900/30"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                    <span>{link.label}</span>
                  </Button>
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 pt-6 border-t border-purple-500/20">
            {isAuthenticated ? (
              <a href="/api/logout">
                <Button
                  variant="outline"
                  className="w-full border-purple-500/30 text-purple-300 hover:bg-purple-900/30"
                  onClick={() => setOpen(false)}
                >
                  Sign Out
                </Button>
              </a>
            ) : (
              <a href="/api/login">
                <Button
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() => setOpen(false)}
                >
                  Sign In
                </Button>
              </a>
            )}
          </div>

          <div className="absolute bottom-6 left-6 right-6">
            <p className="text-xs text-purple-400/60 text-center">
              Eternal Chase Trilogy
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
