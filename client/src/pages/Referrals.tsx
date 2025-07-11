import { ReferralStats } from "@/components/referrals/ReferralStats";
import { NetworkMap } from "@/components/referrals/NetworkMap";
import { Leaderboard } from "@/components/referrals/Leaderboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Copy, Share2, Gift } from "lucide-react";

export default function Referrals() {
  const { user, token } = useAuth();
  const { toast } = useToast();

  const { data: referralData } = useQuery({
    queryKey: ['referrals', user?.id],
    queryFn: () => fetch('/api/referrals', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(res => res.json()),
    enabled: !!user?.id && !!token
  });

  const copyReferralLink = async () => {
    if (user?.referralCode) {
      const referralUrl = `${window.location.origin}/signup?ref=${user.referralCode}`;
      try {
        await navigator.clipboard.writeText(referralUrl);
        toast({
          title: "Copied!",
          description: "Referral link copied to clipboard.",
        });
      } catch (error) {
        toast({
          title: "Copy Failed",
          description: "Failed to copy referral link.",
          variant: "destructive",
        });
      }
    }
  };

  const shareOnTwitter = () => {
    if (user?.referralCode) {
      const referralUrl = `${window.location.origin}/signup?ref=${user.referralCode}`;
      const text = "Check out VeeFore - the AI-powered content creation platform that's revolutionizing social media! 🚀";
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(referralUrl)}`;
      window.open(twitterUrl, '_blank');
    }
  };

  const referralUrl = user?.referralCode ? `${window.location.origin}/signup?ref=${user.referralCode}` : '';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-orbitron font-bold neon-text text-solar-gold">
          Galactic Network
        </h2>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-asteroid-silver">Total earned:</div>
          <div className="text-xl font-mono text-solar-gold">
            {referralData?.stats?.totalEarned || 0} credits
          </div>
        </div>
      </div>

      {/* Referral Stats */}
      <ReferralStats />

      {/* Referral Link and Network Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Referral Link */}
        <Card className="content-card holographic">
          <CardHeader>
            <CardTitle className="text-xl font-orbitron font-semibold neon-text text-electric-cyan">
              Your Referral Portal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm text-asteroid-silver mb-2">Referral Link</Label>
              <div className="flex items-center space-x-2">
                <Input
                  value={referralUrl}
                  readOnly
                  className="glassmorphism font-mono text-sm"
                />
                <Button
                  onClick={copyReferralLink}
                  size="icon"
                  className="bg-electric-cyan text-space-navy hover:bg-opacity-90"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={shareOnTwitter}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:opacity-90"
              >
                <i className="fab fa-x-twitter mr-2"></i>
                Share on X
              </Button>
              <Button
                variant="outline"
                className="glassmorphism"
                onClick={() => toast({
                  title: "Coming Soon",
                  description: "Instagram story sharing will be available soon!",
                })}
              >
                <i className="fab fa-instagram mr-2"></i>
                Share Story
              </Button>
            </div>

            <Card className="bg-cosmic-blue border-electric-cyan/30">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-3 flex items-center">
                  <Gift className="h-4 w-4 mr-2 text-blue-500" />
                  Rewards Structure
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Free signup:</span>
                    <Badge variant="outline" className="text-blue-500 border-blue-500/50">
                      100 credits
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Pro subscription:</span>
                    <Badge variant="outline" className="text-blue-500 border-blue-500/50">
                      500 credits + 10%/month
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Agency subscription:</span>
                    <Badge variant="outline" className="text-blue-500 border-blue-500/50">
                      1000 credits + 15%/month
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Network Map */}
        <NetworkMap />
      </div>

      {/* Leaderboard and Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Leaderboard />

        {/* Achievement Badges */}
        <Card className="content-card holographic">
          <CardHeader>
            <CardTitle className="text-xl font-orbitron font-semibold neon-text text-nebula-purple">
              Achievement Constellation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-cosmic-blue border border-blue-500/50 text-center">
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <i className="fas fa-rocket text-xl text-white"></i>
                </div>
                <div className="font-medium text-sm text-blue-500">First Launch</div>
                <div className="text-xs text-asteroid-silver mt-1">Gained your first referral</div>
                <div className="text-xs text-green-400 mt-2">✓ Unlocked</div>
              </div>

              <div className="p-4 rounded-lg bg-cosmic-blue border border-electric-cyan/50 text-center">
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-r from-electric-cyan to-blue-500 flex items-center justify-center">
                  <i className="fas fa-users text-xl text-white"></i>
                </div>
                <div className="font-medium text-sm text-electric-cyan">Meteor Ambassador</div>
                <div className="text-xs text-asteroid-silver mt-1">Reached 25 referrals</div>
                <div className="text-xs text-green-400 mt-2">✓ Unlocked</div>
              </div>

              <div className="p-4 rounded-lg bg-cosmic-blue border border-nebula-purple/50 text-center">
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-r from-nebula-purple to-purple-500 flex items-center justify-center">
                  <i className="fas fa-star text-xl text-white"></i>
                </div>
                <div className="font-medium text-sm text-nebula-purple">Cosmic Ambassador</div>
                <div className="text-xs text-asteroid-silver mt-1">Reach 50 referrals</div>
                <div className="text-xs text-gray-500 mt-2">
                  {referralData?.stats?.totalReferrals || 0}/50 progress
                </div>
              </div>

              <div className="p-4 rounded-lg bg-cosmic-blue border border-gray-600/30 text-center opacity-50">
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gray-600 flex items-center justify-center">
                  <i className="fas fa-crown text-xl text-gray-400"></i>
                </div>
                <div className="font-medium text-sm text-gray-400">Nova Influencer</div>
                <div className="text-xs text-gray-500 mt-1">Reach 100 referrals</div>
                <div className="text-xs text-gray-500 mt-2">🔒 Locked</div>
              </div>
            </div>

            <Card className="mt-6 bg-gradient-to-r from-electric-cyan/10 to-nebula-purple/10 border border-electric-cyan/30">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Gift className="h-5 w-5 text-electric-cyan" />
                  <span className="font-medium">Next Reward</span>
                </div>
                <div className="text-sm text-asteroid-silver">
                  {50 - (referralData?.stats?.totalReferrals || 0)} more referrals to unlock Cosmic Ambassador and earn 500 bonus credits!
                </div>
                <div className="w-full bg-space-gray rounded-full h-2 mt-3">
                  <div 
                    className="bg-electric-cyan h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${Math.min(((referralData?.stats?.totalReferrals || 0) / 50) * 100, 100)}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
