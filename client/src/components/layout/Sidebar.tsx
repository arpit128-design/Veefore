import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Rocket, Brain, Calendar, BarChart3, Sparkles, 
  Globe, Users, Share2, Settings, Link as LinkIcon, X, CreditCard, PlayCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const navigationItems = [
  { href: "/dashboard", icon: Rocket, label: "Dashboard", color: "text-electric-cyan" },
  { href: "/content-studio", icon: Brain, label: "Content Studio", color: "text-nebula-purple" },
  { href: "/scheduler", icon: Calendar, label: "Scheduler", color: "text-solar-gold" },
  { href: "/analyzer", icon: BarChart3, label: "Analyzer", color: "text-green-400" },
  { href: "/suggestions", icon: Sparkles, label: "AI Suggestions", color: "text-electric-cyan" },
  { href: "/content-recommendations", icon: PlayCircle, label: "Content Feed", color: "text-purple-400" },
  { href: "/workspaces", icon: Globe, label: "Workspaces", color: "text-nebula-purple" },
  { href: "/team", icon: Users, label: "Team", color: "text-blue-400" },
  { href: "/integrations", icon: LinkIcon, label: "Integrations", color: "text-pink-500" },
  { href: "/subscription", icon: CreditCard, label: "Subscription", color: "text-yellow-400" },
  { href: "/referrals", icon: Share2, label: "Referrals", color: "text-solar-gold" },
  { href: "/settings", icon: Settings, label: "Settings", color: "text-asteroid-silver" },
];

export function Sidebar() {
  const [location] = useLocation();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // Main navigation items for mobile footer (first 4)
  const mainNavItems = navigationItems.slice(0, 4);
  // Remaining items for "more" menu
  const moreNavItems = navigationItems.slice(4);

  // Close more menu when location changes
  useEffect(() => {
    setShowMoreMenu(false);
  }, [location]);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-16 md:top-20 bottom-0 w-64 glassmorphism z-40 overflow-y-auto hidden md:block">
        <nav className="p-6 space-y-4">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const isActive = location === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 p-3 rounded-lg transition-all group particle-trail",
                    isActive 
                      ? "holographic bg-opacity-50" 
                      : "hover:bg-cosmic-blue"
                  )}
                >
                  <item.icon className={cn("h-5 w-5 group-hover:animate-pulse", item.color)} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </aside>

      {/* Mobile Footer Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        {/* More Menu Overlay */}
        {showMoreMenu && (
          <div className="absolute bottom-16 left-0 right-0 glassmorphism mx-4 mb-2 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">More</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMoreMenu(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {moreNavItems.map((item) => {
                const isActive = location === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-2 p-3 rounded-lg transition-all group",
                      isActive 
                        ? "holographic bg-opacity-50" 
                        : "hover:bg-cosmic-blue"
                    )}
                    onClick={() => setShowMoreMenu(false)}
                  >
                    <item.icon className={cn("h-4 w-4", item.color)} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer Navigation Bar */}
        <nav className="glassmorphism border-t border-electric-cyan/20">
          <div className="grid grid-cols-5 h-16">
            {/* Main 4 navigation items */}
            {mainNavItems.map((item) => {
              const isActive = location === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center space-y-1 transition-all group",
                    isActive 
                      ? "holographic bg-opacity-30" 
                      : "hover:bg-cosmic-blue"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", item.color)} />
                  <span className="text-xs font-medium truncate">{item.label.split(' ')[0]}</span>
                </Link>
              );
            })}

            {/* More button */}
            <Button
              variant="ghost"
              className={cn(
                "flex flex-col items-center justify-center space-y-1 h-full rounded-none transition-all",
                showMoreMenu 
                  ? "holographic bg-opacity-30" 
                  : "hover:bg-cosmic-blue"
              )}
              onClick={() => setShowMoreMenu(!showMoreMenu)}
            >
              <Settings className="h-5 w-5 text-asteroid-silver" />
              <span className="text-xs font-medium">More</span>
            </Button>
          </div>
        </nav>
      </div>
    </>
  );
}
