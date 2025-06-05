import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Rocket, Brain, Calendar, BarChart3, Sparkles, 
  Globe, Share2, Settings 
} from "lucide-react";

const navigationItems = [
  { href: "/dashboard", icon: Rocket, label: "Dashboard", color: "text-electric-cyan" },
  { href: "/content-studio", icon: Brain, label: "Content Studio", color: "text-nebula-purple" },
  { href: "/scheduler", icon: Calendar, label: "Scheduler", color: "text-solar-gold" },
  { href: "/analyzer", icon: BarChart3, label: "Analyzer", color: "text-green-400" },
  { href: "/suggestions", icon: Sparkles, label: "AI Suggestions", color: "text-electric-cyan" },
  { href: "/workspaces", icon: Globe, label: "Workspaces", color: "text-nebula-purple" },
  { href: "/referrals", icon: Share2, label: "Referrals", color: "text-solar-gold" },
  { href: "/settings", icon: Settings, label: "Settings", color: "text-asteroid-silver" },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="fixed left-0 top-20 bottom-0 w-64 glassmorphism z-40 overflow-y-auto">
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
  );
}
