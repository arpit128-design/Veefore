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
          "w-full justify-start text-slate-700 hover:bg-slate-100 hover:text-slate-900 bg-white",
          isActive && "bg-cyan-50 text-cyan-700 border-r-2 border-cyan-500"
        )}
      >
        <Icon className="h-5 w-5 mr-3" />
        <span className="text-sm font-medium">{label}</span>
        {badge && (
          <Badge variant="secondary" className="ml-auto text-xs bg-cyan-100 text-cyan-700">
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
        className="w-full justify-between text-slate-500 hover:text-slate-700 px-3 py-2 h-8 font-medium uppercase text-xs tracking-wide bg-white"
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
  const credits = 0; // Will be dynamically loaded

  return (
    <aside className="bg-white border-r border-slate-200 w-64 min-h-screen">
      <div className="p-6">
        {/* Credits display */}
        <div className="bg-slate-50 rounded-lg p-4 mb-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-700 font-medium">Credits</span>
            <span className="text-lg font-bold text-cyan-600">{credits}</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">Available for AI tools</div>
        </div>
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
        <SidebarSection title="Analytics">
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
        <div className="pt-4 border-t border-slate-200">
          <SidebarItem
            icon={Settings}
            label="Settings"
            href="/settings"
            isActive={location === "/settings"}
          />
        </div>
      </div>
    </aside>
  );
}