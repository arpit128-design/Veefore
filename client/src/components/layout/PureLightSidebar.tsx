import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { 
  LayoutDashboard,
  Calendar,
  BarChart3,
  Settings,
  Zap,
  MessageSquare,
  Users,
  CreditCard,
  Plus,
  Menu,
  X,
  Rocket,
  Globe,
  TrendingUp,
  Brain,
  Film,
  Target,
  Share2,
  UserPlus,
  HelpCircle,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWorkspaceContext } from '@/hooks/useWorkspace';

const PureLightSidebar: React.FC = () => {
  const [location, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['create']);
  const { currentWorkspace } = useWorkspaceContext();

  // Close sidebar on mobile when navigating
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const isActive = (path: string) => {
    return location === path || location.startsWith(path + '/');
  };

  const navigationItems = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
      badge: null
    }
  ];

  const createPlanItems = [
    {
      id: 'content-studio',
      title: 'Content Studio',
      icon: Film,
      path: '/content-studio',
      badge: null
    },
    {
      id: 'scheduler',
      title: 'Scheduler',
      icon: Calendar,
      path: '/scheduler',
      badge: null
    },
    {
      id: 'ai-features',
      title: 'AI Features',
      icon: Brain,
      path: '/ai-features',
      badge: '15+'
    }
  ];

  const analyticsItems = [
    {
      id: 'analytics',
      title: 'Analytics',
      icon: BarChart3,
      path: '/analytics',
      badge: null
    },
    {
      id: 'performance',
      title: 'Performance',
      icon: TrendingUp,
      path: '/performance',
      badge: null
    }
  ];

  const automationItems = [
    {
      id: 'automation',
      title: 'Automation',
      icon: Zap,
      path: '/automation',
      badge: null
    },
    {
      id: 'messages',
      title: 'Messages',
      icon: MessageSquare,
      path: '/messages',
      badge: null
    }
  ];

  const teamItems = [
    {
      id: 'workspaces',
      title: 'Workspaces',
      icon: Users,
      path: '/workspaces',
      badge: null
    },
    {
      id: 'team',
      title: 'Team',
      icon: UserPlus,
      path: '/team',
      badge: null
    }
  ];

  const settingsItems = [
    {
      id: 'integrations',
      title: 'Integrations',
      icon: Globe,
      path: '/integrations',
      badge: null
    },
    {
      id: 'subscription',
      title: 'Subscription',
      icon: CreditCard,
      path: '/subscription',
      badge: null
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: Settings,
      path: '/settings',
      badge: null
    }
  ];

  const renderNavItem = (item: any, isSubItem = false) => (
    <button
      key={item.id}
      onClick={() => setLocation(item.path)}
      className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all duration-200 hover:shadow-sm ${
        isSubItem ? 'ml-4' : ''
      }`}
      style={{
        backgroundColor: isActive(item.path) ? 'rgb(37, 99, 235)' : 'rgb(255, 255, 255)',
        color: isActive(item.path) ? 'rgb(255, 255, 255)' : 'rgb(15, 23, 42)',
        border: isActive(item.path) ? '1px solid rgb(37, 99, 235)' : '1px solid rgb(226, 232, 240)'
      }}
    >
      <div className="flex items-center gap-3">
        <item.icon 
          className="w-5 h-5 flex-shrink-0" 
          style={{ 
            color: isActive(item.path) ? 'rgb(255, 255, 255)' : 'rgb(100, 116, 139)' 
          }}
        />
        <span className="font-medium text-sm">
          {item.title}
        </span>
      </div>
      {item.badge && (
        <Badge 
          variant="secondary"
          className="text-xs"
          style={{
            backgroundColor: isActive(item.path) ? 'rgba(255, 255, 255, 0.2)' : 'rgb(241, 245, 249)',
            color: isActive(item.path) ? 'rgb(255, 255, 255)' : 'rgb(37, 99, 235)'
          }}
        >
          {item.badge}
        </Badge>
      )}
    </button>
  );

  const renderSection = (title: string, items: any[], sectionId: string) => {
    const isExpanded = expandedSections.includes(sectionId);
    
    return (
      <div key={sectionId}>
        <button
          onClick={() => toggleSection(sectionId)}
          className="w-full flex items-center justify-between p-2 rounded-lg transition-all duration-200 hover:bg-gray-50"
          style={{
            backgroundColor: 'rgb(255, 255, 255)',
            color: 'rgb(71, 85, 105)',
            border: '1px solid transparent'
          }}
        >
          <span className="text-xs font-semibold uppercase tracking-wider">
            {title}
          </span>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
        
        {isExpanded && (
          <div className="mt-2 space-y-1">
            {items.map(item => renderNavItem(item))}
          </div>
        )}
      </div>
    );
  };

  const sidebarContent = (
    <div 
      className="h-full flex flex-col border-r"
      style={{ 
        backgroundColor: 'rgb(255, 255, 255)',
        borderColor: 'rgb(226, 232, 240)'
      }}
    >
      {/* Header */}
      <div 
        className="p-4 border-b"
        style={{ borderColor: 'rgb(226, 232, 240)' }}
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'rgb(37, 99, 235)' }}
          >
            <Rocket 
              className="w-5 h-5" 
              style={{ color: 'rgb(255, 255, 255)' }}
            />
          </div>
          <div className="flex-1">
            <h1 
              className="font-bold text-lg"
              style={{ color: 'rgb(15, 23, 42)' }}
            >
              VeeFore
            </h1>
          </div>
          {/* Mobile close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100"
          >
            <X className="w-5 h-5" style={{ color: 'rgb(100, 116, 139)' }} />
          </button>
        </div>
      </div>

      {/* Workspace Info */}
      {currentWorkspace && (
        <div 
          className="p-4 border-b"
          style={{ borderColor: 'rgb(226, 232, 240)' }}
        >
          <div 
            className="p-3 rounded-lg border"
            style={{ 
              backgroundColor: 'rgb(248, 250, 252)',
              borderColor: 'rgb(226, 232, 240)'
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div 
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium"
                style={{ 
                  backgroundColor: 'rgb(37, 99, 235)',
                  color: 'rgb(255, 255, 255)'
                }}
              >
                {currentWorkspace.name.charAt(0).toUpperCase()}
              </div>
              <h3 
                className="font-medium text-sm"
                style={{ color: 'rgb(15, 23, 42)' }}
              >
                {currentWorkspace.name}
              </h3>
            </div>
            
            <div className="flex items-center justify-between">
              <span 
                className="text-xs"
                style={{ color: 'rgb(100, 116, 139)' }}
              >
                Credits
              </span>
              <Button
                size="sm"
                variant="outline"
                className="h-6 px-2 text-xs"
                style={{
                  backgroundColor: 'rgb(255, 255, 255)',
                  borderColor: 'rgb(226, 232, 240)',
                  color: 'rgb(15, 23, 42)'
                }}
              >
                Buy
              </Button>
            </div>
            
            <div className="mt-2">
              <div className="flex justify-between items-center mb-1">
                <span 
                  className="text-xs"
                  style={{ color: 'rgb(100, 116, 139)' }}
                >
                  0 of 300 monthly credits used
                </span>
              </div>
              <div 
                className="w-full h-1.5 rounded-full"
                style={{ backgroundColor: 'rgb(226, 232, 240)' }}
              >
                <div 
                  className="h-1.5 rounded-full"
                  style={{ 
                    backgroundColor: 'rgb(37, 99, 235)',
                    width: '0%'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-6">
          {/* Main Navigation */}
          <div className="space-y-1">
            {navigationItems.map(item => renderNavItem(item))}
          </div>

          {/* Sections */}
          {renderSection('Create & Plan', createPlanItems, 'create')}
          {renderSection('Analytics', analyticsItems, 'analytics')}
          {renderSection('Automation', automationItems, 'automation')}
          {renderSection('Team', teamItems, 'team')}
          {renderSection('Settings', settingsItems, 'settings')}
        </div>
      </div>

      {/* Footer */}
      <div 
        className="p-4 border-t"
        style={{ borderColor: 'rgb(226, 232, 240)' }}
      >
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => setLocation('/help')}
          style={{
            backgroundColor: 'rgb(255, 255, 255)',
            borderColor: 'rgb(226, 232, 240)',
            color: 'rgb(100, 116, 139)'
          }}
        >
          <HelpCircle className="w-4 h-4 mr-2" />
          Help & Support
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md shadow-lg"
        style={{
          backgroundColor: 'rgb(255, 255, 255)',
          border: '1px solid rgb(226, 232, 240)'
        }}
      >
        <Menu className="w-5 h-5" style={{ color: 'rgb(100, 116, 139)' }} />
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 lg:w-64 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {sidebarContent}
      </div>
    </>
  );
};

export default PureLightSidebar;