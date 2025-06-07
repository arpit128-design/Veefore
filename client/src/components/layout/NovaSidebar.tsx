import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Calendar, 
  BarChart3, 
  Settings, 
  Sparkles, 
  Users, 
  FileText,
  Zap,
  Globe,
  Instagram,
  Youtube,
  Twitter,
  Facebook,
  Linkedin,
  Video
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: string;
  platforms?: string[];
}

const navigationItems: NavItem[] = [
  {
    label: "Command Center",
    icon: <LayoutDashboard className="w-5 h-5" />,
    path: "/dashboard",
    badge: "Live"
  },
  {
    label: "Analytics Hub",
    icon: <BarChart3 className="w-5 h-5" />,
    path: "/analytics",
    platforms: ["instagram", "youtube", "twitter", "facebook", "linkedin", "tiktok"]
  },
  {
    label: "Content Studio",
    icon: <FileText className="w-5 h-5" />,
    path: "/content",
    badge: "AI"
  },
  {
    label: "Mission Control",
    icon: <Calendar className="w-5 h-5" />,
    path: "/scheduler"
  },
  {
    label: "AI Laboratory",
    icon: <Sparkles className="w-5 h-5" />,
    path: "/suggestions",
    badge: "Beta"
  },
  {
    label: "Team Bridge",
    icon: <Users className="w-5 h-5" />,
    path: "/team"
  },
  {
    label: "System Config",
    icon: <Settings className="w-5 h-5" />,
    path: "/settings"
  }
];

const platformIcons = {
  instagram: <Instagram className="w-4 h-4" />,
  youtube: <Youtube className="w-4 h-4" />,
  twitter: <Twitter className="w-4 h-4" />,
  facebook: <Facebook className="w-4 h-4" />,
  linkedin: <Linkedin className="w-4 h-4" />,
  tiktok: <Video className="w-4 h-4" />
};

export function NovaSidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  return (
    <div className="nova-sidebar fixed left-0 top-0 h-screen w-72 z-40 flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-electric-cyan/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-electric-cyan to-cosmic-purple flex items-center justify-center animate-nova-glow">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-electric-cyan to-solar-gold bg-clip-text text-transparent">
              VeeFore
            </h1>
            <p className="text-xs text-muted-foreground">Nova Edition</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-electric-cyan/10">
        <div className="flex items-center gap-3 p-3 rounded-xl nova-glass">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cosmic-purple to-nebula-pink flex items-center justify-center">
            <span className="text-sm font-bold text-white">
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {user?.username || "User"}
            </p>
            <p className="text-xs text-muted-foreground">
              {user?.plan || "Free"} Plan
            </p>
          </div>
          <Badge className="bg-quantum-green/20 text-quantum-green border-quantum-green/30 text-xs">
            Online
          </Badge>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navigationItems.map((item) => {
          const isActive = location === item.path;
          
          return (
            <div key={item.path} className="space-y-1">
              <Link href={item.path}>
                <Button
                  variant="ghost"
                  className={`
                    nova-nav-item w-full justify-start gap-3 h-12 p-3
                    ${isActive 
                      ? 'bg-gradient-to-r from-electric-cyan/20 to-cosmic-purple/20 text-electric-cyan border border-electric-cyan/30' 
                      : 'text-muted-foreground hover:text-foreground'
                    }
                  `}
                >
                  <div className={`
                    flex-shrink-0 
                    ${isActive ? 'text-electric-cyan animate-nova-pulse' : ''}
                  `}>
                    {item.icon}
                  </div>
                  <span className="flex-1 text-left font-medium">
                    {item.label}
                  </span>
                  {item.badge && (
                    <Badge className={`
                      text-xs px-2 py-0.5
                      ${item.badge === 'Live' 
                        ? 'bg-quantum-green/20 text-quantum-green border-quantum-green/30 animate-nova-pulse' 
                        : item.badge === 'AI'
                        ? 'bg-cosmic-purple/20 text-cosmic-purple border-cosmic-purple/30'
                        : 'bg-solar-gold/20 text-solar-gold border-solar-gold/30'
                      }
                    `}>
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              </Link>
              
              {/* Platform Sub-items for Analytics */}
              {item.platforms && isActive && (
                <div className="ml-8 space-y-1 mt-2">
                  {item.platforms.map((platform) => (
                    <Link key={platform} href={`${item.path}/${platform}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start gap-2 h-8 text-xs text-muted-foreground hover:text-foreground nova-nav-item"
                      >
                        {platformIcons[platform as keyof typeof platformIcons]}
                        <span className="capitalize">{platform}</span>
                      </Button>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-electric-cyan/10">
        <div className="nova-glass p-3 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-electric-cyan animate-nova-glow" />
            <span className="text-sm font-medium text-foreground">System Status</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">API Health</span>
              <span className="text-quantum-green">Optimal</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Data Sync</span>
              <span className="text-electric-cyan">Real-time</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}