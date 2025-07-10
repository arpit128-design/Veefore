import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { 
  LayoutDashboard, 
  PenTool, 
  Calendar, 
  BarChart3, 
  Lightbulb,
  Zap,
  MessageSquare,
  Settings,
  Users,
  Briefcase,
  CreditCard,
  ChevronDown,
  ChevronRight,
  Target,
  TrendingUp,
  Bot,
  Sparkles,
  Home,
  Palette,
  Send,
  TrendingDown,
  DollarSign,
  Bell,
  User,
  LogOut,
  Search,
  Plus,
  Activity,
  Shield,
  Globe,
  Star,
  Rocket
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: string;
  isActive?: boolean;
}

interface ProfessionalSidebarProps {
  onAnalyticsToggle?: () => void;
}

function SidebarItem({ icon: Icon, label, href, badge, isActive }: SidebarItemProps) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start h-11 px-3 text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent transition-all duration-200 group",
            isActive && "bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-blue-200 shadow-sm"
          )}
        >
          <Icon className={cn(
            "h-4 w-4 mr-3 transition-colors duration-200",
            isActive 
              ? "text-blue-600" 
              : "text-slate-500 group-hover:text-slate-700"
          )} />
          <span className="text-sm font-medium flex-1 text-left">{label}</span>
          {badge && (
            <Badge 
              variant="secondary" 
              className={cn(
                "ml-2 text-xs h-5 px-2 font-medium",
                isActive 
                  ? "bg-blue-100 text-blue-700" 
                  : "bg-slate-200 text-slate-600 group-hover:bg-slate-300"
              )}
            >
              {badge}
            </Badge>
          )}
        </Button>
      </motion.div>
    </Link>
  );
}

interface SidebarSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function SidebarSection({ title, children, defaultOpen = true }: SidebarSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-6">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-700 transition-colors duration-200 group"
        whileHover={{ x: 2 }}
        transition={{ duration: 0.2 }}
      >
        <span>{title}</span>
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight className="h-3 w-3" />
        </motion.div>
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="space-y-1 mt-2"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ProfessionalSidebar({ onAnalyticsToggle }: ProfessionalSidebarProps = {}) {
  const [location] = useLocation();
  const { user } = useAuth();
  const credits = 0; // Will be dynamically loaded

  // Generate initials from username
  const getInitials = (username: string) => {
    if (!username) return "AK";
    return username.slice(0, 2).toUpperCase();
  };

  return (
    <aside className="bg-white border-r border-slate-200 w-72 h-full flex flex-col overflow-hidden shadow-sm veefore-sidebar">
      {/* User Profile Header */}
      <div className="flex-shrink-0 p-6 border-b border-slate-100 veefore-sidebar-header">
        {/* User Profile Section */}
        <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-4 border border-slate-200">
          <div className="flex items-center space-x-3 mb-3">
            <Avatar className="h-10 w-10 ring-2 ring-blue-100">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-semibold">
                {getInitials(user?.username || "Anonymous")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{user?.username || "Anonymous"}</p>
              <p className="text-xs text-slate-500">Starter Plan</p>
            </div>
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-slate-400 hover:text-slate-600">
              <Bell className="h-3 w-3" />
            </Button>
          </div>

          {/* Enhanced Credits Display */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Sparkles className="h-3 w-3 text-white" />
              </div>
              <span className="text-sm font-medium text-slate-700">Credits</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-blue-600">{credits}</span>
              <Button size="sm" variant="outline" className="h-6 px-2 text-xs">
                <Plus className="h-3 w-3 mr-1" />
                Buy
              </Button>
            </div>
          </div>
          
          <div className="mt-2 bg-slate-200 rounded-full h-1.5">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full h-1.5 w-0"></div>
          </div>
          <p className="text-xs text-slate-500 mt-1">0 of 300 monthly credits used</p>
        </div>
      </div>
      
      {/* Independent Scrollable Navigation Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 pb-6 veefore-sidebar-nav">
        {/* Main Navigation */}
        <div className="space-y-1 mb-6">
          <SidebarItem
            icon={LayoutDashboard}
            label="Dashboard"
            href="/dashboard"
            isActive={location === "/" || location === "/dashboard"}
          />
        </div>

        {/* Content Creation */}
        <SidebarSection title="Create & Plan">
          <SidebarItem
            icon={PenTool}
            label="Content Studio"
            href="/content-studio"
            isActive={location === "/content-studio"}
          />
          <SidebarItem
            icon={Calendar}
            label="Scheduler"
            href="/scheduler"
            isActive={location === "/scheduler" || location === "/professional-scheduler"}
          />
          <SidebarItem
            icon={Sparkles}
            label="AI Features"
            href="/ai-features"
            isActive={location === "/ai-features"}
            badge="15+"
          />
        </SidebarSection>

        {/* Analytics & Insights */}
        <SidebarSection title="Analytics">
          {onAnalyticsToggle ? (
            <motion.div
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant="ghost"
                onClick={onAnalyticsToggle}
                className="w-full justify-start h-11 px-3 text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent transition-all duration-200 group"
              >
                <BarChart3 className="h-4 w-4 mr-3 transition-colors duration-200 text-slate-500 group-hover:text-slate-700" />
                <span className="text-sm font-medium flex-1 text-left">Analytics Dashboard</span>
              </Button>
            </motion.div>
          ) : (
            <>
              <SidebarItem
                icon={BarChart3}
                label="Analytics"
                href="/analytics"
                isActive={location === "/analytics"}
              />
              <SidebarItem
                icon={TrendingUp}
                label="Performance"
                href="/content-recommendations"
                isActive={location === "/content-recommendations"}
              />
              <SidebarItem
                icon={Target}
                label="Competitor Analysis"
                href="/competitor-analysis"
                isActive={location === "/competitor-analysis"}
              />
            </>
          )}
        </SidebarSection>

        {/* Automation & Engagement */}
        <SidebarSection title="Automation">
          <SidebarItem
            icon={Zap}
            label="Automation Rules"
            href="/automation"
            isActive={location === "/automation"}
          />
          <SidebarItem
            icon={MessageSquare}
            label="Messages"
            href="/conversations"
            isActive={location === "/conversations" || location === "/messages"}
            badge="3"
          />
          <SidebarItem
            icon={Bot}
            label="AI Assistant"
            href="/suggestions"
            isActive={location === "/suggestions"}
          />
        </SidebarSection>

        {/* Business Tools */}
        <SidebarSection title="Business">
          <SidebarItem
            icon={CreditCard}
            label="Billing & Subscription"
            href="/subscription"
            isActive={location === "/subscription"}
          />
          <SidebarItem
            icon={Briefcase}
            label="Workspaces"
            href="/workspaces"
            isActive={location === "/workspaces"}
          />
          <SidebarItem
            icon={Users}
            label="Team"
            href="/team"
            isActive={location === "/team"}
          />
        </SidebarSection>

        {/* Settings & Support */}
        <div className="mt-auto pt-6 space-y-2">
          <Separator className="mb-4" />
          
          <SidebarItem
            icon={Settings}
            label="Settings"
            href="/settings"
            isActive={location === "/settings"}
          />
          
          <motion.div 
            className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Star className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Upgrade Plan</p>
                <p className="text-xs text-slate-600">Get unlimited credits</p>
              </div>
            </div>
            <Button size="sm" className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
              Upgrade Now
            </Button>
          </motion.div>

          {/* Quick Actions */}
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" className="flex-1 h-8">
              <Search className="h-3 w-3 mr-1" />
              Search
            </Button>
            <Button size="sm" variant="outline" className="flex-1 h-8">
              <Activity className="h-3 w-3 mr-1" />
              Activity
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}