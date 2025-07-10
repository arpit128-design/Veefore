import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: string;
  isActive?: boolean;
}

function SidebarItem({ icon: Icon, label, href, badge, isActive }: SidebarItemProps) {
  return (
    <Link href={href}>
      <Button
        variant="ghost"
        className={cn(
          "nav-link w-full justify-start",
          isActive && "active"
        )}
      >
        <Icon className="h-5 w-5" />
        <span className="text-sm font-medium">{label}</span>
        {badge && (
          <Badge variant="secondary" className="ml-auto text-xs">
            {badge}
          </Badge>
        )}
      </Button>
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
    <div className="space-y-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between text-caption px-3 py-2 h-8"
      >
        {title}
        {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </Button>
      {isOpen && (
        <div className="space-y-1 pl-2">
          {children}
        </div>
      )}
    </div>
  );
}

export function ProfessionalSidebar() {
  const [location] = useLocation();

  return (
    <aside className="professional-sidebar w-64 h-screen p-4 space-y-6 overflow-y-auto scrollbar-thin">
      {/* Main Navigation */}
      <div className="space-y-1">
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
          isActive={location === "/scheduler"}
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
      <SidebarSection title="Analytics & Insights">
        <SidebarItem
          icon={BarChart3}
          label="Analytics"
          href="/analyzer"
          isActive={location === "/analyzer"}
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
          label="Conversations"
          href="/conversations"
          isActive={location === "/conversations"}
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
          label="Subscription"
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

      {/* Settings */}
      <div className="pt-4 border-t border-border">
        <SidebarItem
          icon={Settings}
          label="Settings"
          href="/settings"
          isActive={location === "/settings"}
        />
      </div>

      {/* Credit Status */}
      <div className="mt-auto pt-4 border-t border-border">
        <div className="professional-card p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-body-small">Credits</span>
            <Badge variant="outline" className="text-xs">Pro</Badge>
          </div>
          <div className="space-y-1">
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-primary h-2 rounded-full w-3/4"></div>
            </div>
            <p className="text-xs text-muted-foreground">750 / 1,000 credits</p>
          </div>
        </div>
      </div>
    </aside>
  );
}