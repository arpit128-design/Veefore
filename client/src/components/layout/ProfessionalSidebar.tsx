import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogOverlay } from "@/components/ui/dialog";
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
  MessageCircle,
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
  Rocket,
  Edit,
  Megaphone,
  Link as LinkIcon,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: string;
  isActive?: boolean;
}

interface MobileNavItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  isActive?: boolean;
  badge?: string;
  onClick?: () => void;
}

// Mobile Navigation Item Component
function MobileNavItem({ icon: Icon, label, href, isActive, badge, onClick }: MobileNavItemProps) {
  return (
    <Link href={href} onClick={onClick}>
      <div className={cn(
        "flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 cursor-pointer",
        isActive 
          ? "bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 text-blue-700" 
          : "hover:bg-gray-50 text-gray-700"
      )}>
        <Icon className={cn(
          "w-5 h-5",
          isActive ? "text-blue-600" : "text-gray-500"
        )} />
        <span className="flex-1 font-medium">{label}</span>
        {badge && (
          <span className={cn(
            "px-2 py-1 text-xs font-medium rounded-full",
            isActive 
              ? "bg-blue-100 text-blue-700" 
              : "bg-gray-100 text-gray-600"
          )}>
            {badge}
          </span>
        )}
      </div>
    </Link>
  );
}

// Custom Mobile Scheduler Popup with backdrop blur
interface MobileSchedulerPopupProps {
  schedulerOptions: any[];
  setIsMobileMenuOpen?: (open: boolean) => void;
  location: string;
}

function MobileSchedulerPopup({ schedulerOptions, setIsMobileMenuOpen, location }: MobileSchedulerPopupProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOptionClick = (option: any) => {
    option.action();
    setIsOpen(false);
    if (setIsMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <motion.div
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        <Button
          variant="ghost"
          onClick={() => setIsOpen(true)}
          className={cn(
            "w-full justify-start h-11 px-3 text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent transition-all duration-200 group",
            (location === "/scheduler" || location === "/professional-scheduler") && "bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-blue-200 shadow-sm"
          )}
        >
          <Calendar className={cn(
            "h-4 w-4 mr-3 transition-colors duration-200",
            (location === "/scheduler" || location === "/professional-scheduler")
              ? "text-blue-600" 
              : "text-slate-500 group-hover:text-slate-700"
          )} />
          <span className="text-sm font-medium flex-1 text-left">Scheduler</span>
          <ChevronDown className="w-3 h-3 text-gray-500 ml-auto" />
        </Button>
      </motion.div>

      {/* Custom Popup Overlay */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          {/* Backdrop with blur */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
            style={{
              background: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          />
          
          {/* Popup Content */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ 
              duration: 0.3,
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
            className="relative max-w-sm w-full rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 z-10 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>

            {/* Content */}
            <div className="p-2">
              {schedulerOptions.map((option, optionIndex) => (
                <motion.div 
                  key={optionIndex}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    duration: 0.3,
                    delay: optionIndex * 0.1,
                    type: "spring",
                    stiffness: 400,
                    damping: 25
                  }}
                >
                  <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleOptionClick(option)}
                    className="w-full p-4 text-left rounded-lg hover:bg-white/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {option.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900 text-sm">
                            {option.title}
                          </h4>
                          {option.badge && (
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              option.badge === 'New' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {option.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                  {optionIndex < schedulerOptions.length - 1 && (
                    <hr className="my-1 border-gray-200" />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}

interface ProfessionalSidebarProps {
  onAnalyticsToggle?: () => void;
  isMobileMenuOpen?: boolean;
  setIsMobileMenuOpen?: (open: boolean) => void;
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

export function ProfessionalSidebar({ onAnalyticsToggle, isMobileMenuOpen, setIsMobileMenuOpen }: ProfessionalSidebarProps = {}) {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  const credits = 0; // Will be dynamically loaded

  // Generate initials from username
  const getInitials = (username: string) => {
    if (!username) return "AK";
    return username.slice(0, 2).toUpperCase();
  };

  // Scheduler dropdown options
  const schedulerOptions = [
    {
      title: 'Post',
      description: 'Create and publish content',
      icon: <Edit className="w-4 h-4 text-gray-600" />,
      action: () => setLocation('/create-post'),
    },
    {
      title: 'Content with AI',
      description: 'AI-powered content generation',
      icon: <Sparkles className="w-4 h-4 text-purple-600" />,
      action: () => setLocation('/content-studio'),
    },
    {
      title: 'DM automation',
      description: 'Automated direct messaging',
      icon: <Bot className="w-4 h-4 text-blue-600" />,
      action: () => setLocation('/automation'),
    },
    {
      title: 'Ad',
      description: 'Create advertisement campaigns',
      icon: <Megaphone className="w-4 h-4 text-purple-600" />,
      action: () => setLocation('/scheduler'),
    },
    {
      title: 'Automated boost',
      description: 'Auto-boost high performing content',
      icon: <TrendingUp className="w-4 h-4 text-green-600" />,
      badge: 'New',
      action: () => setLocation('/scheduler'),
    },
    {
      title: 'Hootbio',
      description: 'Bio link management',
      icon: <LinkIcon className="w-4 h-4 text-emerald-600" />,
      badge: 'Upgrade',
      action: () => setLocation('/scheduler'),
    },
  ];

  const handleNavClick = () => {
    if (setIsMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen?.(false)}
        />
      )}

      {/* Desktop Sidebar - Only shown on large screens (lg:1024px+) */}
      <aside className="hidden lg:flex bg-white border-r border-slate-200 w-72 h-full flex-col overflow-hidden shadow-sm veefore-sidebar">
        <SidebarContent 
          location={location}
          user={user}
          credits={credits}
          getInitials={getInitials}
          schedulerOptions={schedulerOptions}
          onAnalyticsToggle={onAnalyticsToggle}
          onNavClick={handleNavClick}
        />
      </aside>

      {/* Mobile Sidebar - Full Featured with Better Design */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-slate-200 shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Rocket className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-lg font-bold text-gray-900">VeeFore</h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen?.(false)}
              className="text-gray-500 hover:text-gray-700 hover:bg-white/50 rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Mobile Content - Full SidebarContent */}
          <div className="flex-1 overflow-y-auto">
            <SidebarContent 
              location={location}
              user={user}
              credits={credits}
              getInitials={getInitials}
              schedulerOptions={schedulerOptions}
              onAnalyticsToggle={onAnalyticsToggle}
              onNavClick={handleNavClick}
              isMobile={true}
              setIsMobileMenuOpen={setIsMobileMenuOpen}
            />
          </div>
        </div>
      </aside>
    </>
  );
}

interface SidebarContentProps {
  location: string;
  user: any;
  credits: number;
  getInitials: (username: string) => string;
  schedulerOptions: any[];
  onAnalyticsToggle?: () => void;
  onNavClick: () => void;
  isMobile?: boolean;
  setIsMobileMenuOpen?: (open: boolean) => void;
}

function SidebarContent({ 
  location, 
  user, 
  credits, 
  getInitials, 
  schedulerOptions, 
  onAnalyticsToggle, 
  onNavClick, 
  isMobile = false,
  setIsMobileMenuOpen 
}: SidebarContentProps) {
  return (
    <div className="h-full overflow-y-auto overflow-x-hidden veefore-sidebar-scroll">
      {/* User Profile Header - Now scrollable */}
      <div className="p-6 border-b border-slate-100 veefore-sidebar-header">
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
      
      {/* Navigation Area - Now part of the scrollable content */}
      <div className="px-6 pb-6 veefore-sidebar-nav">
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
          {/* Desktop Dropdown - Hidden on mobile */}
          <div className="hidden lg:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start h-11 px-3 text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent transition-all duration-200 group",
                      (location === "/scheduler" || location === "/professional-scheduler") && "bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-blue-200 shadow-sm"
                    )}
                  >
                    <Calendar className={cn(
                      "h-4 w-4 mr-3 transition-colors duration-200",
                      (location === "/scheduler" || location === "/professional-scheduler")
                        ? "text-blue-600" 
                        : "text-slate-500 group-hover:text-slate-700"
                    )} />
                    <span className="text-sm font-medium flex-1 text-left">Scheduler</span>
                    <ChevronDown className="w-3 h-3 text-gray-500 ml-auto" />
                  </Button>
                </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-72 bg-white shadow-xl border border-gray-200 rounded-xl p-2" side="right" align="start">
                {schedulerOptions.map((option, optionIndex) => (
                  <div key={optionIndex}>
                    <DropdownMenuItem 
                      className="flex items-start gap-3 p-4 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        option.action();
                      }}
                    >
                      <div className="mt-1">
                        {option.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900 text-sm">
                            {option.title}
                          </h4>
                          {option.badge && (
                            <Badge 
                              variant={option.badge === 'New' ? 'default' : 'secondary'} 
                              className={`text-xs h-5 px-2 ${
                                option.badge === 'New' 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-blue-100 text-blue-700'
                              }`}
                            >
                              {option.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {option.description}
                        </p>
                      </div>
                    </DropdownMenuItem>
                    {optionIndex < schedulerOptions.length - 1 && (
                      <DropdownMenuSeparator className="my-1 bg-gray-100" />
                    )}
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Custom Popup - Shown on mobile */}
          <div className="lg:hidden">
            <MobileSchedulerPopup
              schedulerOptions={schedulerOptions}
              setIsMobileMenuOpen={setIsMobileMenuOpen}
              location={location}
            />
          </div>
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
            icon={Target}
            label="Post Automation"
            href="/post-automation"
            isActive={location === "/post-automation"}
            badge="New"
          />
          <SidebarItem
            icon={MessageCircle}
            label="Comment to DM"
            href="/comment-to-dm-automation"
            isActive={location === "/comment-to-dm-automation"}
            badge="Pro"
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
    </div>
  );
}