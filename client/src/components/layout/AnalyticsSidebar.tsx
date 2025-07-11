import React from 'react';
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
  ChevronUp,
  FileText,
  Target,
  Zap,
  Activity
} from 'lucide-react';

interface AnalyticsSidebarProps {
  onBackToMain: () => void;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const AnalyticsSidebar: React.FC<AnalyticsSidebarProps> = ({ 
  onBackToMain, 
  currentPage, 
  onPageChange 
}) => {
  const [dataInsightsOpen, setDataInsightsOpen] = React.useState(true);

  const isActive = (page: string) => currentPage === page;

  const sidebarItems = [
    {
      label: 'Overview',
      icon: BarChart3,
      page: '/analytics',
      isActive: isActive('/analytics')
    },
    {
      label: 'Social Insights',
      icon: TrendingUp,
      page: '/social-insights',
      isActive: isActive('/social-insights'),
      isHighlighted: true
    },
    {
      label: 'Performance Analytics',
      icon: Activity,
      page: '/performance-analytics',
      isActive: isActive('/performance-analytics')
    },
    {
      label: 'Advanced Analytics',
      icon: Zap,
      page: '/advanced-analytics',
      isActive: isActive('/advanced-analytics')
    },
    {
      label: 'Content Performance',
      icon: FileText,
      page: '/content-performance-analytics',
      isActive: isActive('/content-performance-analytics')
    }
  ];

  const dataInsightsItems = [
    {
      label: 'Post Performance',
      icon: Activity,
      page: 'post-performance',
      isActive: isActive('post-performance')
    },
    {
      label: 'Best Times to Post',
      icon: Clock,
      page: 'best-times',
      isActive: isActive('best-times')
    },
    {
      label: 'Industry Benchmarks',
      icon: Building2,
      page: 'industry',
      isActive: isActive('industry')
    },
    {
      label: 'Competitive Analysis',
      icon: Target,
      page: 'competitive',
      isActive: isActive('competitive')
    },
    {
      label: 'Advertising Performance',
      icon: Zap,
      page: 'advertising',
      isActive: isActive('advertising')
    }
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 veefore-sidebar">
      {/* Modern Header */}
      <div className="veefore-sidebar-header p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">
            Analytics
          </h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBackToMain}
            className="text-gray-500 hover:text-gray-700 hover:bg-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="veefore-sidebar-nav p-4 space-y-2">
        {sidebarItems.map((item) => (
          <Button
            key={item.page}
            variant="ghost"
            onClick={() => onPageChange(item.page)}
            className={`w-full justify-start text-left font-normal transition-all duration-200 ${
              item.isActive
                ? 'bg-gradient-to-r from-cyan-50 to-purple-50 text-cyan-700 border-l-4 border-cyan-500 font-semibold'
                : item.isHighlighted
                ? 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 hover:bg-purple-100'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <item.icon className={`mr-3 h-4 w-4 ${
              item.isActive ? 'text-cyan-600' : item.isHighlighted ? 'text-purple-600' : 'text-gray-500'
            }`} />
            {item.label}
          </Button>
        ))}

        {/* Data & Insights Section */}
        <div className="mt-6">
          <Button
            variant="ghost"
            onClick={() => setDataInsightsOpen(!dataInsightsOpen)}
            className="w-full justify-between text-left font-semibold text-gray-800 hover:bg-gray-100 uppercase text-xs tracking-wide"
          >
            <span>Data & Insights ({dataInsightsItems.length})</span>
            {dataInsightsOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>

          {dataInsightsOpen && (
            <div className="mt-2 space-y-1 ml-2 border-l border-gray-200 pl-3">
              {dataInsightsItems.map((item) => (
                <Button
                  key={item.page}
                  variant="ghost"
                  onClick={() => onPageChange(item.page)}
                  className={`w-full justify-start text-left font-normal text-sm transition-all duration-200 ${
                    item.isActive
                      ? 'bg-gradient-to-r from-cyan-50 to-purple-50 text-cyan-700 border-l-2 border-cyan-500 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                  }`}
                >
                  <item.icon className={`mr-3 h-3 w-3 ${
                    item.isActive ? 'text-cyan-600' : 'text-gray-400'
                  }`} />
                  {item.label}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <Button
            variant="ghost"
            onClick={() => onPageChange('settings')}
            className={`w-full justify-start text-left font-normal transition-all duration-200 ${
              isActive('settings')
                ? 'bg-gradient-to-r from-cyan-50 to-purple-50 text-cyan-700 border-l-4 border-cyan-500 font-semibold'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <Settings className={`mr-3 h-4 w-4 ${
              isActive('settings') ? 'text-cyan-600' : 'text-gray-500'
            }`} />
            Analytics Settings
          </Button>
        </div>
      </div>

      {/* Help Section */}
      <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="text-center">
          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
            Help & Resources
          </p>
          <p className="text-xs text-gray-600 mb-3">
            Need help understanding your data? Check out our analytics guide.
          </p>
          <Button 
            size="sm" 
            variant="outline" 
            className="w-full text-xs bg-white border-gray-300 hover:bg-gray-50"
          >
            View Guide
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSidebar;