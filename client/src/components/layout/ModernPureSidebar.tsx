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
  ChevronRight,
  Sparkles,
  PenTool,
  Camera,
  Mic,
  Image,
  Video,
  FileText,
  Grid3x3,
  List,
  Search,
  Bell,
  Star,
  Shield,
  Palette,
  Headphones
} from 'lucide-react';
import { useWorkspaceContext } from '@/hooks/useWorkspace';

const ModernPureSidebar: React.FC = () => {
  const [location, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['create', 'manage']);
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

  const navigationSections = [
    {
      id: 'main',
      title: 'Dashboard',
      items: [
        {
          title: 'Overview',
          path: '/dashboard',
          icon: LayoutDashboard,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50'
        },
        {
          title: 'Analytics',
          path: '/analytics',
          icon: BarChart3,
          color: 'text-emerald-600',
          bgColor: 'bg-emerald-50'
        }
      ]
    },
    {
      id: 'create',
      title: 'Create Content',
      expandable: true,
      items: [
        {
          title: 'Content Studio',
          path: '/content-studio',
          icon: PenTool,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50'
        },
        {
          title: 'AI Image Generator',
          path: '/thumbnail-ai-maker',
          icon: Image,
          color: 'text-pink-600',
          bgColor: 'bg-pink-50'
        },
        {
          title: 'Video Creator',
          path: '/video-creator',
          icon: Video,
          color: 'text-red-600',
          bgColor: 'bg-red-50'
        },
        {
          title: 'AI Writing Assistant',
          path: '/ai-writing',
          icon: FileText,
          color: 'text-indigo-600',
          bgColor: 'bg-indigo-50'
        }
      ]
    },
    {
      id: 'manage',
      title: 'Content Management',
      expandable: true,
      items: [
        {
          title: 'Scheduler',
          path: '/scheduler',
          icon: Calendar,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50'
        },
        {
          title: 'Content Library',
          path: '/content-library',
          icon: Grid3x3,
          color: 'text-cyan-600',
          bgColor: 'bg-cyan-50'
        },
        {
          title: 'Post Management',
          path: '/post-management',
          icon: List,
          color: 'text-teal-600',
          bgColor: 'bg-teal-50'
        }
      ]
    },
    {
      id: 'automation',
      title: 'Automation',
      expandable: true,
      items: [
        {
          title: 'Automation Hub',
          path: '/automation',
          icon: Zap,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50'
        },
        {
          title: 'DM Automation',
          path: '/dm-automation-list',
          icon: MessageSquare,
          color: 'text-amber-600',
          bgColor: 'bg-amber-50'
        },
        {
          title: 'Smart Replies',
          path: '/smart-replies',
          icon: Brain,
          color: 'text-violet-600',
          bgColor: 'bg-violet-50'
        }
      ]
    },
    {
      id: 'insights',
      title: 'AI Insights',
      expandable: true,
      items: [
        {
          title: 'Growth Suggestions',
          path: '/suggestions',
          icon: TrendingUp,
          color: 'text-emerald-600',
          bgColor: 'bg-emerald-50'
        },
        {
          title: 'Trend Analysis',
          path: '/trend-calendar',
          icon: Target,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50'
        },
        {
          title: 'Competitor Analysis',
          path: '/competitor-analysis',
          icon: Search,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50'
        }
      ]
    },
    {
      id: 'business',
      title: 'Business',
      items: [
        {
          title: 'Team Management',
          path: '/team',
          icon: Users,
          color: 'text-indigo-600',
          bgColor: 'bg-indigo-50'
        },
        {
          title: 'Workspaces',
          path: '/workspaces',
          icon: Globe,
          color: 'text-cyan-600',
          bgColor: 'bg-cyan-50'
        },
        {
          title: 'Billing',
          path: '/subscription',
          icon: CreditCard,
          color: 'text-green-600',
          bgColor: 'bg-green-50'
        }
      ]
    },
    {
      id: 'account',
      title: 'Account',
      items: [
        {
          title: 'Settings',
          path: '/settings',
          icon: Settings,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50'
        },
        {
          title: 'Integrations',
          path: '/integrations',
          icon: Share2,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50'
        },
        {
          title: 'Help Center',
          path: '/help',
          icon: HelpCircle,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50'
        }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 w-12 h-12 rounded-xl bg-white shadow-lg flex items-center justify-center border border-gray-200"
        style={{ backgroundColor: 'rgb(255, 255, 255)' }}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-gray-600" />
        ) : (
          <Menu className="w-6 h-6 text-gray-600" />
        )}
      </button>

      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40 w-80 h-screen
        transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        transition-transform duration-300 ease-in-out
        flex flex-col border-r border-gray-200
      `}
      style={{ backgroundColor: 'rgb(255, 255, 255)' }}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
              <Rocket className="w-7 h-7 text-white" />
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-bold text-gray-900">VeeFore</h1>
              <p className="text-sm text-gray-500">Social Media Hub</p>
            </div>
          </div>
        </div>

        {/* Workspace Selector */}
        {currentWorkspace && (
          <div className="p-4 border-b border-gray-100">
            <div className="rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{currentWorkspace.name}</h3>
                  <p className="text-sm text-gray-600">{currentWorkspace.credits || 0} credits</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
                  <Star className="w-4 h-4 text-yellow-500" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {navigationSections.map((section) => (
            <div key={section.id}>
              {section.expandable ? (
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between text-left p-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <span>{section.title}</span>
                  {expandedSections.includes(section.id) ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              ) : (
                <h3 className="text-sm font-semibold text-gray-700 px-2 mb-2">
                  {section.title}
                </h3>
              )}

              {(!section.expandable || expandedSections.includes(section.id)) && (
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => {
                        setLocation(item.path);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center p-3 rounded-xl text-left transition-all duration-200 group ${
                        isActive(item.path)
                          ? `${item.bgColor} ${item.color} shadow-sm`
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isActive(item.path) 
                          ? 'bg-white shadow-sm' 
                          : 'bg-transparent group-hover:bg-white group-hover:shadow-sm'
                      }`}>
                        <item.icon className={`w-5 h-5 ${
                          isActive(item.path) ? item.color : 'text-gray-500 group-hover:text-gray-700'
                        }`} />
                      </div>
                      <span className="ml-3 font-medium">{item.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
          <div className="rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="ml-3 flex-1">
                <h4 className="font-semibold text-gray-900 text-sm">Upgrade to Pro</h4>
                <p className="text-xs text-gray-600">Unlock premium features</p>
              </div>
            </div>
            <button 
              className="w-full mt-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold py-2 px-4 rounded-lg hover:shadow-lg transition-all duration-200"
              onClick={() => setLocation('/pricing')}
            >
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModernPureSidebar;