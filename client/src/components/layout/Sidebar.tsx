import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Rocket, Brain, Calendar, BarChart3, Sparkles, Zap, Target, TrendingUp, Users, 
  Globe, Share2, Settings, Link as LinkIcon, X, CreditCard, PlayCircle, Bot, 
  MessageCircle, ImageIcon, FileText, Languages, Shield, Trophy, Heart, DollarSign,
  ChevronDown, ChevronUp
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import veeforeLogo from '@/assets/veefore-logo.png';

// Main tab structure
const mainTabs = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: Rocket,
    href: "/dashboard",
    color: "text-electric-cyan"
  },
  {
    id: "plan",
    label: "Plan",
    icon: Target,
    color: "text-purple-400",
    features: [
      { href: "/trend-calendar", icon: Calendar, label: "Trend Calendar", color: "text-purple-500" },
      { href: "/persona-suggestions", icon: Users, label: "Persona Builder", color: "text-purple-400" },
      { href: "/creative-brief", icon: FileText, label: "Creative Brief", color: "text-purple-400" },
      { href: "/competitor-analysis", icon: Users, label: "Competitor Analysis", color: "text-purple-400", locked: true },
      { href: "/social-listening", icon: Globe, label: "Social Listening", color: "text-cyan-400", locked: true }
    ]
  },
  {
    id: "create",
    label: "Create", 
    icon: Brain,
    color: "text-nebula-purple",
    features: [
      { href: "/content-studio", icon: Brain, label: "Content Studio", color: "text-nebula-purple" },
      { href: "/ai-suggestions", icon: Sparkles, label: "AI Suggestions", color: "text-electric-cyan" },
      { href: "/ai-thumbnails-pro", icon: Sparkles, label: "Thumbnails Pro", color: "text-purple-500", locked: true },
      { href: "/content-repurpose", icon: Languages, label: "Content Repurpose", color: "text-teal-400", locked: true },
      { href: "/legal-assistant", icon: FileText, label: "Legal Assistant", color: "text-indigo-400", locked: true },
      { href: "/content-theft-detection", icon: Shield, label: "Content Theft Detection", color: "text-red-500", locked: true },
      { href: "/emotion-analysis", icon: Heart, label: "Emotion Analysis", color: "text-pink-500", locked: true },
      { href: "/gamification", icon: Trophy, label: "Gamification", color: "text-purple-500", locked: true }
    ]
  },
  {
    id: "publish",
    label: "Publish",
    icon: Calendar,
    color: "text-blue-500",
    features: [
      { href: "/scheduler", icon: Calendar, label: "Scheduler", color: "text-blue-500" },
      { href: "/content-recommendations", icon: PlayCircle, label: "Content Feed", color: "text-purple-400" }
    ]
  },
  {
    id: "optimize",
    label: "Optimize",
    icon: TrendingUp,
    color: "text-green-400",
    features: [
      { href: "/analyzer", icon: BarChart3, label: "Analyzer", color: "text-green-400" },
      { href: "/ab-testing", icon: BarChart3, label: "A/B Testing", color: "text-blue-500", locked: true },
      { href: "/roi-calculator", icon: CreditCard, label: "ROI Calculator", color: "text-green-500", locked: true }
    ]
  },
  {
    id: "monetize",
    label: "Monetize",
    icon: DollarSign,
    color: "text-cyan-400",
    features: [
      { href: "/affiliate-engine", icon: Share2, label: "Affiliate Engine", color: "text-emerald-400", locked: true },
      { href: "/referrals", icon: Share2, label: "Referrals", color: "text-blue-500" },
      { href: "/subscription", icon: CreditCard, label: "Subscription", color: "text-cyan-400" }
    ]
  }
];

// Bottom navigation items (workspace management & remaining features)
const bottomNavItems = [
  { href: "/automation", icon: Bot, label: "Automation", color: "text-purple-400" },
  { href: "/conversations", icon: MessageCircle, label: "Conversations", color: "text-blue-500" },
  { href: "/integrations", icon: LinkIcon, label: "Integrations", color: "text-pink-500" },
  { href: "/workspaces", icon: Globe, label: "Workspaces", color: "text-nebula-purple" },
  { href: "/team", icon: Users, label: "Team", color: "text-blue-400" },
  { href: "/settings", icon: Settings, label: "Settings", color: "text-asteroid-silver" },
];

export function Sidebar() {
  const [location, setLocation] = useLocation();
  const [expandedTabs, setExpandedTabs] = useState<string[]>([]);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // Determine which tab should be expanded based on current location
  useEffect(() => {
    const currentPath = location;
    
    // Find which tab contains the current route
    const activeTab = mainTabs.find(tab => {
      if (tab.href === currentPath) return true;
      if (tab.features) {
        return tab.features.some(feature => feature.href === currentPath);
      }
      return false;
    });

    if (activeTab && activeTab.features) {
      setExpandedTabs(prev => 
        prev.includes(activeTab.id) ? prev : [...prev, activeTab.id]
      );
    }
  }, [location]);

  const toggleTab = (tabId: string) => {
    // For mobile: only allow one tab open at a time
    setExpandedTabs(prev => 
      prev.includes(tabId) ? [] : [tabId]
    );
    // Close more menu when opening tab
    setShowMoreMenu(false);
  };

  const isTabActive = (tab: any) => {
    if (tab.href && location === tab.href) return true;
    if (tab.features) {
      return tab.features.some((feature: any) => location === feature.href);
    }
    return false;
  };

  const isFeatureActive = (href: string) => location === href;

  // Close more menu when location changes
  useEffect(() => {
    setShowMoreMenu(false);
    setExpandedTabs([]); // Close any expanded tab overlays
  }, [location]);

  // Handle more menu toggle
  const handleMoreToggle = () => {
    setShowMoreMenu(!showMoreMenu);
    setExpandedTabs([]); // Close any open tab overlays
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-14 sm:top-16 md:top-20 bottom-0 w-56 lg:w-64 glassmorphism z-40 overflow-y-auto hidden md:block">
        <nav className="p-3 lg:p-6 space-y-2 lg:space-y-4">
          {/* Main Tabs */}
          <div className="space-y-1 lg:space-y-2">
            {mainTabs.map((tab) => {
              const isActive = isTabActive(tab);
              const isExpanded = expandedTabs.includes(tab.id);
              
              return (
                <div key={tab.id} className="space-y-1">
                  {/* Tab Header */}
                  {tab.href ? (
                    <Link
                      href={tab.href}
                      className={cn(
                        "flex items-center space-x-2 lg:space-x-3 p-2 lg:p-3 rounded-lg transition-all group particle-trail",
                        isActive 
                          ? "holographic bg-opacity-50" 
                          : "hover:bg-cosmic-blue"
                      )}
                    >
                      <tab.icon className={cn("h-4 w-4 lg:h-5 lg:w-5 group-hover:animate-pulse", tab.color)} />
                      <span className="font-medium text-sm lg:text-base">{tab.label}</span>
                    </Link>
                  ) : (
                    <button
                      onClick={() => toggleTab(tab.id)}
                      className={cn(
                        "w-full flex items-center justify-between space-x-2 lg:space-x-3 p-2 lg:p-3 rounded-lg transition-all group particle-trail",
                        isActive 
                          ? "holographic bg-opacity-50" 
                          : "hover:bg-cosmic-blue"
                      )}
                    >
                      <div className="flex items-center space-x-2 lg:space-x-3">
                        <tab.icon className={cn("h-4 w-4 lg:h-5 lg:w-5 group-hover:animate-pulse", tab.color)} />
                        <span className="font-medium text-sm lg:text-base">{tab.label}</span>
                      </div>
                      {tab.features && (
                        <div className="text-gray-400">
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </div>
                      )}
                    </button>
                  )}

                  {/* Features (if expanded) */}
                  {tab.features && isExpanded && (
                    <div className="ml-6 space-y-1">
                      {tab.features.map((feature) => {
                        const isFeatureActiveState = isFeatureActive(feature.href);
                        const isLocked = feature.locked || false;
                        const featureName = feature.label.replace(/\s+/g, '-').toLowerCase();
                        const href = isLocked ? `/feature-preview?feature=${featureName}` : feature.href;
                        
                        return (
                          <Link
                            key={feature.href}
                            href={href}
                            className={cn(
                              "flex items-center space-x-2 p-2 rounded-lg transition-all group text-sm",
                              isLocked && "locked opacity-40 cursor-pointer",
                              isFeatureActiveState 
                                ? "holographic bg-opacity-30" 
                                : "hover:bg-cosmic-blue/50"
                            )}
                          >
                            <feature.icon className={cn("h-3 w-3 lg:h-4 lg:w-4", feature.color)} />
                            <span className="font-medium">{feature.label}</span>
                            {isLocked && <span className="text-xs text-gray-400 ml-1">🔒</span>}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Navigation */}
          <div className="border-t border-electric-cyan/20 pt-4 space-y-1">
            {bottomNavItems.map((item) => {
              const isActive = location === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 lg:space-x-3 p-2 lg:p-3 rounded-lg transition-all group",
                    isActive 
                      ? "holographic bg-opacity-50" 
                      : "hover:bg-cosmic-blue"
                  )}
                >
                  <item.icon className={cn("h-4 w-4 lg:h-5 lg:w-5 group-hover:animate-pulse", item.color)} />
                  <span className="font-medium text-sm lg:text-base">{item.label}</span>
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
              {bottomNavItems.map((item) => {
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

        {/* Footer Navigation Bar - Mobile with expandable features */}
        <nav className="glassmorphism border-t border-electric-cyan/20 z-50 relative">
          <div className="grid grid-cols-5 h-16">
            {/* Main tabs for mobile */}
            {mainTabs.slice(0, 4).map((tab) => {
              const isActive = isTabActive(tab);
              const tabExpanded = expandedTabs.includes(tab.id);
              
              return (
                <Button
                  key={tab.id}
                  variant="ghost"
                  className={cn(
                    "flex flex-col items-center justify-center space-y-1 transition-all group h-full rounded-none relative",
                    isActive || tabExpanded
                      ? "holographic bg-opacity-30 border-b-2 border-electric-cyan" 
                      : "hover:bg-cosmic-blue"
                  )}
                  onClick={() => {
                    if (tab.href) {
                      // Dashboard button - navigate smoothly using setLocation
                      setLocation(tab.href);
                    } else {
                      // Other tabs - toggle overlay
                      toggleTab(tab.id);
                    }
                  }}
                >
                  <tab.icon className={cn("h-5 w-5", tab.color)} />
                  <span className="text-xs font-medium truncate">{tab.label}</span>
                  {tabExpanded && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-electric-cyan rounded-full animate-pulse" />
                  )}
                </Button>
              );
            })}

            {/* More button */}
            <Button
              variant="ghost"
              className={cn(
                "flex flex-col items-center justify-center space-y-1 h-full rounded-none transition-all relative",
                showMoreMenu 
                  ? "holographic bg-opacity-30 border-b-2 border-electric-cyan" 
                  : "hover:bg-cosmic-blue"
              )}
              onClick={handleMoreToggle}
            >
              <Settings className="h-5 w-5 text-asteroid-silver" />
              <span className="text-xs font-medium">More</span>
              {showMoreMenu && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-electric-cyan rounded-full animate-pulse" />
              )}
            </Button>
          </div>
          
          {/* Mobile expanded features overlay */}
          {expandedTabs.map(tabId => {
            const tab = mainTabs.find(t => t.id === tabId);
            if (!tab?.features) return null;
            
            return (
              <div 
                key={tabId}
                className="absolute bottom-16 left-0 right-0 backdrop-blur-xl border-t border-electric-cyan/30 p-4 max-h-60 overflow-y-auto glassmorphism z-40"
                style={{ backgroundColor: 'rgba(15, 23, 42, 0.95)' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <tab.icon className={cn("h-4 w-4", tab.color)} />
                    {tab.label} Features
                  </h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => toggleTab(tabId)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {tab.features.map((feature) => (
                    <Link
                      key={feature.href}
                      href={feature.href}
                      className={cn(
                        "flex items-center gap-2 p-2 rounded-lg transition-all group",
                        location === feature.href
                          ? "holographic text-white"
                          : "hover:bg-cosmic-blue text-asteroid-silver hover:text-white"
                      )}
                      onClick={() => setExpandedTabs([])}
                    >
                      <feature.icon className={cn("h-4 w-4 flex-shrink-0", feature.color)} />
                      <span className="text-xs truncate">{feature.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>
      </div>
    </>
  );
}
