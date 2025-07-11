import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Crown, Medal, Award, Trophy } from "lucide-react";

interface LeaderboardUser {
  id: number;
  username: string;
  displayName?: string;
  avatar?: string;
  referralCount: number;
  rank: number;
  badge: string;
}

export function Leaderboard() {
  const { user } = useAuth();

  const { data: leaderboard } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => fetch('/api/leaderboard').then(res => res.json())
  });

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-4 w-4 text-blue-500" />;
      case 2: return <Medal className="h-4 w-4 text-asteroid-silver" />;
      case 3: return <Award className="h-4 w-4 text-purple-500" />;
      default: return <Trophy className="h-4 w-4 text-space-gray" />;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1: return "bg-gradient-to-r from-blue-500 to-cyan-500 text-space-navy";
      case 2: return "bg-gradient-to-r from-asteroid-silver to-gray-400 text-space-navy";
      case 3: return "bg-gradient-to-r from-purple-500 to-pink-500 text-white";
      default: return "bg-space-gray text-white";
    }
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "Nova Influencer": return "text-blue-500";
      case "Cosmic Ambassador": return "text-electric-cyan";
      case "Stellar Navigator": return "text-nebula-purple";
      case "Meteor Ambassador": return "text-green-400";
      default: return "text-asteroid-silver";
    }
  };

  // Mock leaderboard data if real data isn't available
  const mockLeaderboard: LeaderboardUser[] = [
    {
      id: 1,
      username: "GalaxyCommander",
      displayName: "Galaxy Commander",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
      referralCount: 156,
      rank: 1,
      badge: "Nova Influencer"
    },
    {
      id: 2,
      username: "StarCaptain",
      displayName: "Star Captain",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=32&h=32&fit=crop&crop=face",
      referralCount: 134,
      rank: 2,
      badge: "Cosmic Ambassador"
    },
    {
      id: 3,
      username: "MeteorExplorer",
      displayName: "Meteor Explorer",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
      referralCount: 98,
      rank: 3,
      badge: "Stellar Navigator"
    }
  ];

  const displayLeaderboard = leaderboard || mockLeaderboard;
  const currentUserRank = 7; // This would come from the API
  const currentUserReferrals = user?.totalReferrals || 47;

  return (
    <Card className="content-card holographic">
      <CardHeader>
        <CardTitle className="text-xl font-orbitron font-semibold neon-text text-green-400">
          Galactic Leaderboard
        </CardTitle>
        <p className="text-sm text-asteroid-silver">Top referrers in the VeeFore universe</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {displayLeaderboard.slice(0, 10).map((leaderUser: LeaderboardUser) => (
            <div
              key={leaderUser.id}
              className={`flex items-center space-x-4 p-3 rounded-lg transition-colors ${
                leaderUser.rank <= 3 
                  ? 'bg-gradient-to-r from-electric-cyan/10 to-nebula-purple/10 border border-electric-cyan/30' 
                  : 'bg-cosmic-blue hover:bg-space-gray'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getRankBadgeColor(leaderUser.rank)}`}>
                {leaderUser.rank}
              </div>
              
              <Avatar className="w-8 h-8">
                <AvatarImage src={leaderUser.avatar} alt={leaderUser.username} />
                <AvatarFallback className="bg-gradient-to-r from-electric-cyan to-nebula-purple text-xs">
                  {leaderUser.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="font-medium">@{leaderUser.username}</div>
                <div className={`text-xs ${getBadgeColor(leaderUser.badge)}`}>
                  {leaderUser.badge}
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-bold text-blue-500">{leaderUser.referralCount}</div>
                <div className="text-xs text-asteroid-silver">referrals</div>
              </div>
              
              <div className="flex items-center">
                {getRankIcon(leaderUser.rank)}
              </div>
            </div>
          ))}

          {/* Current User Position */}
          {currentUserRank > 10 && (
            <>
              <div className="border-t border-electric-cyan/30 my-4"></div>
              <div className="flex items-center space-x-4 p-3 rounded-lg bg-electric-cyan/10 border border-electric-cyan/30">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-electric-cyan to-nebula-purple flex items-center justify-center text-sm font-bold text-white">
                  {currentUserRank}
                </div>
                
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user?.avatar} alt={user?.username} />
                  <AvatarFallback className="bg-gradient-to-r from-electric-cyan to-nebula-purple">
                    {user?.username?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="font-medium text-electric-cyan">You (@{user?.username})</div>
                  <div className="text-xs text-electric-cyan">Meteor Ambassador</div>
                </div>
                
                <div className="text-right">
                  <div className="font-bold text-electric-cyan">{currentUserReferrals}</div>
                  <div className="text-xs text-electric-cyan">referrals</div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Leaderboard Insights */}
        <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-nebula-purple/10 to-electric-cyan/10 border border-nebula-purple/30">
          <div className="flex items-center space-x-2 mb-2">
            <Trophy className="h-4 w-4 text-nebula-purple" />
            <span className="font-medium text-nebula-purple">Leaderboard Insights</span>
          </div>
          <div className="text-sm text-asteroid-silver space-y-1">
            <div>• Top 1% of referrers earn an average of 2,500 credits monthly</div>
            <div>• Most successful referrers share content regularly on social media</div>
            <div>• Referral conversion rate increases by 40% with personalized messages</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
