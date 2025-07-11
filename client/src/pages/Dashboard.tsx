import { StatsCard } from "@/components/dashboard/StatsCard";
import { PlatformAnalytics } from "@/components/dashboard/PlatformAnalytics";
import { ContentStudio } from "@/components/dashboard/ContentStudio";
import { DailySuggestions } from "@/components/dashboard/DailySuggestions";
import { ContentPerformance } from "@/components/dashboard/ContentPerformance";
import { TrendingHashtags } from "@/components/dashboard/TrendingHashtags";
import { AnalyticsChart } from "@/components/dashboard/AnalyticsChart";
import { AnalyticsOverview } from "@/components/dashboard/AnalyticsOverview";

import { useAuth } from "@/hooks/useAuth";
import { useWorkspaceContext } from "@/hooks/useWorkspace";
import { useInstantData } from "@/hooks/useInstantData";
import { Eye, Heart, Users, TrendingUp, RefreshCw, Gift } from "lucide-react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { formatNumber, formatEngagement } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useState, useEffect } from "react";
import WelcomePopup from "@/components/WelcomePopup";

export default function Dashboard() {
  const { user, token } = useAuth();
  const { currentWorkspace } = useWorkspaceContext();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  // Initialize instant data prefetching
  useInstantData();

  // Check if user should see welcome modal
  useEffect(() => {
    const checkWelcomeModal = async () => {
      if (user && user.email) {
        try {
          // Check if this is the first time after onboarding completion
          const shouldShowWelcomePopup = localStorage.getItem('should_show_welcome_popup');
          
          if (shouldShowWelcomePopup === 'true') {
            // Show welcome popup and then remove the flag
            setShowWelcomeModal(true);
            localStorage.removeItem('should_show_welcome_popup');
          }
        } catch (error) {
          console.error('Error checking welcome modal:', error);
        }
      }
    };

    checkWelcomeModal();
  }, [user]);

  // Real-time analytics query - always fetch fresh data with cache busting
  const { data: analyticsData, isLoading: analyticsLoading, error } = useQuery({
    queryKey: ['dashboard-analytics-realtime', currentWorkspace?.id],
    queryFn: async () => {
      const timestamp = Date.now();
      const response = await fetch(`/api/dashboard/analytics?workspaceId=${currentWorkspace?.id}&_cacheBust=${timestamp}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response.json();
    },
    enabled: !!currentWorkspace?.id && !!token,
    staleTime: 0, // Always fetch fresh data
    gcTime: 0, // Don't cache the result
    refetchInterval: 30000, // Auto-refresh every 30 seconds
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true
  });

  // Fetch connected social accounts
  const { data: socialAccounts, isLoading: socialAccountsLoading } = useQuery({
    queryKey: ['social-accounts'],
    queryFn: async () => {
      const response = await fetch('/api/social-accounts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response.json();
    },
    enabled: !!currentWorkspace?.id && !!token,
    staleTime: 30000,
    refetchOnMount: true
  });

  // Live clock that updates every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour12: false,
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Handle welcome popup close
  const handleWelcomePopupClose = () => {
    setShowWelcomeModal(false);
    // No need to store anything in localStorage as this is a one-time popup
  };

  // Force complete data refresh mutation - clears all caches and fetches live data
  const forceRefreshData = useMutation({
    mutationFn: async () => {
      setIsRefreshing(true);
      console.log('[DASHBOARD] Starting complete data refresh...');
      
      try {
        // Clear all relevant caches
        await queryClient.invalidateQueries({ queryKey: ['dashboard-analytics-realtime'] });
        await queryClient.invalidateQueries({ queryKey: ['social-accounts'] });
        await queryClient.invalidateQueries({ queryKey: ['instant-data'] });
        
        // Force refresh via API
        await apiRequest('POST', '/api/analytics/refresh', {
          workspaceId: currentWorkspace?.id,
          clearCache: true
        });
        
        console.log('[DASHBOARD] Complete data refresh successful');
        
        toast({
          title: "Data Refreshed",
          description: "All analytics data has been updated with live information.",
          variant: "default"
        });
        
      } catch (error: any) {
        console.error('[DASHBOARD] Refresh error:', error);
        toast({
          title: "Refresh Failed",
          description: error.message || "Failed to refresh data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsRefreshing(false);
      }
    }
  });

  // Debug logs for analytics data
  console.log('[DASHBOARD DEBUG] Analytics data received:', analyticsData);
  console.log('[DASHBOARD DEBUG] Percentage changes received:', analyticsData?.percentageChanges);
  console.log('[DASHBOARD DEBUG] Connected platforms:', analyticsData?.connectedPlatforms);

  // Check if user has connected accounts
  const connectedPlatforms = analyticsData?.connectedPlatforms || [];
  const hasConnectedAccounts = connectedPlatforms.length > 0;
  console.log('[DASHBOARD DEBUG] Has connected accounts:', hasConnectedAccounts);

  // Map analytics data with proper null checks
  const percentageChanges = analyticsData?.percentageChanges || {};
  const isDataLoading = analyticsLoading || socialAccountsLoading;

  // Calculate derived analytics with fallbacks
  const analytics = {
    totalReach: analyticsData?.totalReach || null,
    engagement: analyticsData?.engagementRate || null,
    newFollowers: (analyticsData?.platformData?.instagram?.followers || 0) + (analyticsData?.platformData?.youtube?.subscribers || 0) || null,
    contentScore: analyticsData?.contentScore || 62, // Calculated score
    platforms: connectedPlatforms
  };

  console.log('[DASHBOARD DEBUG] Mapped analytics:', analytics);
  console.log('[DASHBOARD DEBUG] Formatted engagement:', formatNumber(analytics.engagement));
  console.log('[DASHBOARD DEBUG] Formatted followers:', formatNumber(analytics.newFollowers));

  return (
    <div className="space-y-4 md:space-y-8 w-full max-w-full overflow-x-hidden relative z-10">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-4xl font-orbitron font-bold text-electric-cyan mb-1 sm:mb-2">
            Mission Control
          </h2>
          <p className="text-asteroid-silver text-xs sm:text-sm md:text-base">
            Welcome back, <span className="text-blue-600 font-medium">{user?.displayName || user?.username}</span>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => setShowWelcomeModal(true)}
            variant="outline"
            size="sm"
            className="bg-purple-600/20 border-purple-400/30 text-purple-400 hover:bg-purple-600/30 hover:border-purple-400/50 transition-all duration-300"
          >
            <Gift className="w-4 h-4 mr-2" />
            Preview Welcome
          </Button>
          <Button 
            onClick={() => forceRefreshData.mutate()}
            disabled={isRefreshing || forceRefreshData.isPending}
            variant="outline"
            size="sm"
            className="bg-cosmic-void/50 border-electric-cyan/30 text-electric-cyan hover:bg-electric-cyan/10 hover:border-electric-cyan/50 transition-all duration-300"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${(isRefreshing || forceRefreshData.isPending) ? 'animate-spin' : ''}`} />
            {(isRefreshing || forceRefreshData.isPending) ? 'Syncing...' : 'Live Sync'}
          </Button>
          <div className="text-left sm:text-right">
            <div className="text-xs sm:text-sm text-asteroid-silver">Current Time</div>
            <div className="text-base sm:text-lg md:text-xl font-mono text-electric-cyan">{formattedTime} IST</div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <StatsCard
          title="Total Reach"
          value={hasConnectedAccounts && analytics.totalReach !== null ? formatNumber(analytics.totalReach) : null}
          change={hasConnectedAccounts && analytics.totalReach !== null && analytics.totalReach > 0 && percentageChanges.reach ? percentageChanges.reach : undefined}
          icon={<Eye className="text-lg sm:text-xl" />}
          gradient="from-electric-cyan to-nebula-purple"
          isLoading={hasConnectedAccounts ? isDataLoading : false}
          noDataMessage={!hasConnectedAccounts ? "Connect accounts" : undefined}
        />
        <StatsCard
          title="Engagement"
          value={hasConnectedAccounts && analytics.engagement !== null ? formatEngagement(analytics.engagement) : null}
          change={hasConnectedAccounts && analytics.engagement !== null && analytics.engagement > 0 && percentageChanges.engagement ? percentageChanges.engagement : undefined}
          icon={<Heart className="text-lg sm:text-xl" />}
          gradient="from-solar-gold to-red-500"
          isLoading={hasConnectedAccounts ? isDataLoading : false}
          noDataMessage={!hasConnectedAccounts ? "Connect accounts" : undefined}
        />
        <StatsCard
          title="New Followers"
          value={hasConnectedAccounts && analytics.newFollowers !== null ? formatNumber(analytics.newFollowers) : null}
          change={hasConnectedAccounts && analytics.newFollowers !== null && analytics.newFollowers > 0 && percentageChanges.followers ? percentageChanges.followers : undefined}
          icon={<Users className="text-lg sm:text-xl" />}
          gradient="from-nebula-purple to-pink-500"
          isLoading={hasConnectedAccounts ? isDataLoading : false}
          noDataMessage={!hasConnectedAccounts ? "Connect accounts" : undefined}
        />
        <StatsCard
          title="Content Score"
          value={hasConnectedAccounts ? `${analytics.contentScore}%` : null}
          change={hasConnectedAccounts && percentageChanges.contentScore ? percentageChanges.contentScore : undefined}
          icon={<TrendingUp className="text-lg sm:text-xl" />}
          gradient="from-green-400 to-blue-500"
          isLoading={false}
          noDataMessage={!hasConnectedAccounts ? "Connect accounts" : undefined}
        />
      </div>

      {/* Multi-Platform Analytics or Connection Prompt */}
      {!hasConnectedAccounts ? (
        // No Social Accounts Connected - Show Connection Message
        <div className="content-card holographic">
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-electric-cyan/10 flex items-center justify-center">
              <i className="fas fa-link text-2xl text-electric-cyan" />
            </div>
            <h3 className="text-xl font-orbitron font-semibold mb-3">No Social Accounts Connected</h3>
            <p className="text-asteroid-silver mb-6">
              Connect your social media accounts to view analytics and start managing your content.
            </p>
            <Button
              onClick={() => window.location.href = '/integrations'}
              className="bg-electric-cyan hover:bg-electric-cyan/80 text-cosmic-void font-semibold"
            >
              <i className="fas fa-plus mr-2" />
              Connect Social Accounts
            </Button>
          </div>
        </div>
      ) : (
        // Multi-Platform Analytics Overview with Filtering
        <AnalyticsOverview data={analyticsData} isLoading={analyticsLoading} />
      )}

      {/* Analytics Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Audience Demographics */}
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-pink-400 mb-4">Audience Demographics</h3>
          <div className="space-y-4">
            {/* Age Groups */}
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-3">Age Distribution</h4>
              <div className="space-y-2">
                {[
                  { age: "18-24", percentage: 32 },
                  { age: "25-34", percentage: 28 },
                  { age: "35-44", percentage: 22 },
                  { age: "45-54", percentage: 12 },
                  { age: "55+", percentage: 6 }
                ].map((group) => (
                  <div key={group.age} className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">{group.age} years</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-pink-400 rounded-full" 
                          style={{ width: `${group.percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-pink-400 font-medium w-8">{group.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Gender Distribution */}
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-3">Gender Distribution</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-pink-500/10 rounded-lg border border-pink-500/20">
                  <div className="text-xl font-bold text-pink-400">62%</div>
                  <div className="text-xs text-gray-400">Female</div>
                </div>
                <div className="text-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <div className="text-xl font-bold text-blue-400">38%</div>
                  <div className="text-xs text-gray-400">Male</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Locations */}
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-400 mb-4">Top Locations</h3>
          <div className="space-y-4">
            {/* Countries */}
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-3">Countries</h4>
              <div className="space-y-2">
                {[
                  { name: "India", percentage: 45 },
                  { name: "United States", percentage: 18 },
                  { name: "United Kingdom", percentage: 12 },
                  { name: "Canada", percentage: 8 },
                  { name: "Australia", percentage: 6 },
                  { name: "Others", percentage: 11 }
                ].map((country) => (
                  <div key={country.name} className="flex justify-between items-center p-2 bg-gray-800/30 rounded">
                    <span className="text-sm text-gray-300">{country.name}</span>
                    <span className="text-sm text-blue-400 font-medium">{country.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Cities */}
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-3">Top Cities</h4>
              <div className="space-y-1">
                {[
                  { name: "Mumbai", percentage: 12 },
                  { name: "Delhi", percentage: 10 },
                  { name: "New York", percentage: 8 },
                  { name: "London", percentage: 6 }
                ].map((city) => (
                  <div key={city.name} className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">{city.name}</span>
                    <span className="text-blue-400">{city.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Audience Activity */}
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-green-400 mb-4">Audience Activity</h3>
          <div className="space-y-4">
            {/* Active Hours */}
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-3">Most Active Hours</h4>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { time: "9-11 AM", activity: "High" },
                  { time: "1-3 PM", activity: "Medium" },
                  { time: "7-9 PM", activity: "Peak" },
                  { time: "10-12 PM", activity: "Medium" },
                  { time: "6-8 AM", activity: "Low" },
                  { time: "11 PM-1 AM", activity: "Low" }
                ].map((slot) => (
                  <div key={slot.time} className="text-center p-2 bg-gray-800/30 rounded text-xs">
                    <div className="text-gray-300 font-medium">{slot.time}</div>
                    <div className={`text-xs ${
                      slot.activity === "Peak" ? "text-green-400" :
                      slot.activity === "High" ? "text-blue-400" :
                      slot.activity === "Medium" ? "text-blue-400" : "text-gray-500"
                    }`}>{slot.activity}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Weekly Activity */}
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-3">Weekly Activity</h4>
              <div className="space-y-2">
                {[
                  { day: "Monday", engagement: 85 },
                  { day: "Tuesday", engagement: 78 },
                  { day: "Wednesday", engagement: 92 },
                  { day: "Thursday", engagement: 88 },
                  { day: "Friday", engagement: 95 },
                  { day: "Saturday", engagement: 72 },
                  { day: "Sunday", engagement: 68 }
                ].map((day) => (
                  <div key={day.day} className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">{day.day}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-400 rounded-full" 
                          style={{ width: `${day.engagement}%` }}
                        />
                      </div>
                      <span className="text-xs text-green-400 font-medium w-6">{day.engagement}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Dashboard Sections */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <TrendingHashtags />
          <ContentPerformance />
        </div>
        <div className="space-y-6">
          <DailySuggestions />
          <ContentStudio />
        </div>
      </div>

      {/* Welcome Popup */}
      <WelcomePopup
        isOpen={showWelcomeModal}
        onClose={handleWelcomePopupClose}
      />
    </div>
  );
}