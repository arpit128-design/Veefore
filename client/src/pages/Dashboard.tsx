import { StatsCard } from "@/components/dashboard/StatsCard";
import { PlatformAnalytics } from "@/components/dashboard/PlatformAnalytics";
import { ContentStudio } from "@/components/dashboard/ContentStudio";
import { DailySuggestions } from "@/components/dashboard/DailySuggestions";
import { ContentPerformance } from "@/components/dashboard/ContentPerformance";
import { useAuth } from "@/hooks/useAuth";
import { Eye, Heart, Users, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour12: false,
    timeZone: 'UTC',
    hour: '2-digit',
    minute: '2-digit'
  });

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
          value="2.4M"
          change={{ value: "+12.5% from last week", isPositive: true }}
          icon={<Eye className="text-xl" />}
          gradient="from-electric-cyan to-nebula-purple"
        />
        <StatsCard
          title="Engagement"
          value="156K"
          change={{ value: "+8.3% from last week", isPositive: true }}
          icon={<Heart className="text-xl" />}
          gradient="from-solar-gold to-red-500"
        />
        <StatsCard
          title="New Followers"
          value="1,247"
          change={{ value: "+15.7% from last week", isPositive: true }}
          icon={<Users className="text-xl" />}
          gradient="from-nebula-purple to-pink-500"
        />
        <StatsCard
          title="Content Score"
          value="94%"
          change={{ value: "+5.1% from last week", isPositive: true }}
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
