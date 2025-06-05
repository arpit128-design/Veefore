import { StatsCard } from "@/components/dashboard/StatsCard";
import { PlatformAnalytics } from "@/components/dashboard/PlatformAnalytics";
import { ContentStudio } from "@/components/dashboard/ContentStudio";
import { DailySuggestions } from "@/components/dashboard/DailySuggestions";
import { ContentPerformance } from "@/components/dashboard/ContentPerformance";
import { useAuth } from "@/hooks/useAuth";
import { Eye, Heart, Users, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function Dashboard() {
  const { user } = useAuth();

  // Fetch real analytics data
  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey: ['/api/dashboard/analytics', Date.now()], // Force fresh data
    enabled: !!user,
    staleTime: 0, // Always fetch fresh data
    cacheTime: 0 // Don't cache
  });

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour12: false,
    timeZone: 'UTC',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Format numbers for display
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatPercentage = (num: number) => `${num}%`;

  // Show loading state
  if (analyticsLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin w-8 h-8 border-4 border-electric-cyan border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  // Provide default values for analytics with proper typing
  const analytics: {
    totalViews: number;
    engagement: number;
    newFollowers: number;
    contentScore: number;
    platforms: any[];
  } = analyticsData || {
    totalViews: 0,
    engagement: 0,
    newFollowers: 0,
    contentScore: 85,
    platforms: []
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-orbitron font-bold neon-text text-electric-cyan mb-2">
            Mission Control
          </h2>
          <p className="text-asteroid-silver">
            Welcome back, <span className="text-solar-gold font-medium">{user?.displayName || user?.username}</span>
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-asteroid-silver">Current Time</div>
          <div className="text-xl font-mono text-electric-cyan">{currentTime} UTC</div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Views"
          value={formatNumber(analytics.totalViews)}
          change={{ value: analytics.totalViews > 0 ? "Active data" : "No data yet", isPositive: analytics.totalViews > 0 }}
          icon={<Eye className="text-xl" />}
          gradient="from-electric-cyan to-nebula-purple"
        />
        <StatsCard
          title="Engagement"
          value={formatNumber(analytics.engagement)}
          change={{ value: analytics.engagement > 0 ? "Active data" : "No data yet", isPositive: analytics.engagement > 0 }}
          icon={<Heart className="text-xl" />}
          gradient="from-solar-gold to-red-500"
        />
        <StatsCard
          title="New Followers"
          value={formatNumber(analytics.newFollowers)}
          change={{ value: analytics.newFollowers > 0 ? "Active data" : "No data yet", isPositive: analytics.newFollowers > 0 }}
          icon={<Users className="text-xl" />}
          gradient="from-nebula-purple to-pink-500"
        />
        <StatsCard
          title="Content Score"
          value={formatPercentage(analytics.contentScore)}
          change={{ value: analytics.contentScore > 0 ? "Active data" : "No data yet", isPositive: analytics.contentScore > 0 }}
          icon={<TrendingUp className="text-xl" />}
          gradient="from-green-400 to-blue-500"
        />
      </div>

      {/* Platform Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <PlatformAnalytics
          platform="instagram"
          icon={<i className="fab fa-instagram" />}
          color="text-pink-500"
        />
        <PlatformAnalytics
          platform="twitter"
          icon={<i className="fab fa-x-twitter" />}
          color="text-white"
        />
      </div>

      {/* AI Content Studio Quick Access */}
      <ContentStudio />

      {/* Daily AI Suggestions */}
      <DailySuggestions />

      {/* Recent Content Performance */}
      <ContentPerformance />
    </div>
  );
}