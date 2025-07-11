import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Users, CreditCard, Trophy, TrendingUp } from "lucide-react";

export function ReferralStats() {
  const { user, token } = useAuth();

  const { data: referralData } = useQuery({
    queryKey: ['referrals', user?.id],
    queryFn: () => fetch('/api/referrals', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(res => res.json()),
    enabled: !!user?.id && !!token
  });

  const stats = [
    {
      title: "Total Referrals",
      value: referralData?.stats?.totalReferrals || 0,
      change: "+12 this month",
      icon: Users,
      gradient: "from-electric-cyan to-nebula-purple",
      color: "text-electric-cyan"
    },
    {
      title: "Paid Subscribers",
      value: referralData?.stats?.activePaid || 0,
      change: "+8 this month",
      icon: CreditCard,
      gradient: "from-solar-gold to-purple-500",
      color: "text-solar-gold"
    },
    {
      title: "Global Rank",
      value: "#7",
      change: "↑3 positions",
      icon: Trophy,
      gradient: "from-nebula-purple to-pink-500",
      color: "text-nebula-purple"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="content-card holographic">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.gradient} flex items-center justify-center`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-sm text-asteroid-silver">{stat.title}</div>
              </div>
            </div>
            <div className="text-sm text-green-400">{stat.change}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
