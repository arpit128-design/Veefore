import React from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Building2,
  Users,
  Settings,
  ChevronLeft,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface AnalyticsSidebarProps {
  onBackToMain: () => void;
}

const AnalyticsSidebar: React.FC<AnalyticsSidebarProps> = ({ onBackToMain }) => {
  const [location] = useLocation();
  const [dataInsightsOpen, setDataInsightsOpen] = React.useState(true);

  const isActive = (path: string) => location === path;

  const sidebarItems = [
    {
      label: 'Overview',
      icon: BarChart3,
      path: '/analytics',
      isActive: isActive('/analytics')
    },
    {
      label: 'Social score and insights',
      icon: TrendingUp,
      path: '/analytics/social-score',
      isActive: isActive('/analytics/social-score'),
      isHighlighted: true
    },
    {
      label: 'All reports',
      icon: BarChart3,
      path: '/analytics/reports',
      isActive: isActive('/analytics/reports')
    }
  ];

  const dataInsightsItems = [
    {
      label: 'Post performance',
      path: '/analytics/post-performance',
      isActive: isActive('/analytics/post-performance')
    },
    {
      label: 'Best time to publish',
      path: '/analytics/best-time',
      isActive: isActive('/analytics/best-time')
    },
    {
      label: 'Industry',
      path: '/analytics/industry',
      isActive: isActive('/analytics/industry')
    },
    {
      label: 'Competitive analysis',
      path: '/analytics/competitive',
      isActive: isActive('/analytics/competitive')
    },
    {
      label: 'Advertising performance',
      path: '/analytics/advertising',
      isActive: isActive('/analytics/advertising')
    }
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Analytics</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBackToMain}
            className="text-gray-500 hover:text-gray-700"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 p-4 space-y-1">
        {sidebarItems.map((item) => (
          <Link key={item.path} href={item.path}>
            <Button
              variant="ghost"
              className={`w-full justify-start text-left font-normal ${
                item.isActive 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                  : item.isHighlighted
                  ? 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className="h-4 w-4 mr-3" />
              {item.label}
            </Button>
          </Link>
        ))}

        {/* Data & Insights Section */}
        <div className="pt-4">
          <Button
            variant="ghost"
            className="w-full justify-between text-left font-medium text-gray-900 text-xs uppercase tracking-wide mb-2"
            onClick={() => setDataInsightsOpen(!dataInsightsOpen)}
          >
            <span>DATA & INSIGHTS (5)</span>
            {dataInsightsOpen ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </Button>

          {dataInsightsOpen && (
            <div className="space-y-1 ml-4">
              {dataInsightsItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start text-left font-normal text-sm ${
                      item.isActive 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Analytics Settings */}
      <div className="p-4 border-t border-gray-200">
        <Link href="/analytics/settings">
          <Button
            variant="ghost"
            className={`w-full justify-start text-left font-normal ${
              isActive('/analytics/settings') 
                ? 'bg-blue-50 text-blue-700' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Settings className="h-4 w-4 mr-3" />
            Analytics settings
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default AnalyticsSidebar;