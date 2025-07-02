import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Trophy, Star, Zap, Target, Users, Gift, Crown, Award, TrendingUp, Calendar, CheckCircle, Flame, Sparkles, GamepadIcon } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  progress: number;
  maxProgress: number;
  completed: boolean;
  unlockedAt?: string;
  category: 'content' | 'engagement' | 'growth' | 'consistency' | 'special';
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  duration: string;
  reward: {
    points: number;
    badge?: string;
    credits?: number;
  };
  progress: number;
  maxProgress: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'expired';
  participants: number;
}

interface UserStats {
  level: number;
  totalPoints: number;
  pointsToNextLevel: number;
  currentStreak: number;
  longestStreak: number;
  completedChallenges: number;
  rank: number;
  totalUsers: number;
  badges: number;
  achievements: number;
}

interface Leaderboard {
  rank: number;
  username: string;
  level: number;
  points: number;
  badges: number;
  avatar?: string;
  isCurrentUser?: boolean;
}

export default function Gamification() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const { toast } = useToast();

  // Fetch real gamification data from API
  const { data: gamificationData, isLoading, error } = useQuery({
    queryKey: ['/api/gamification/stats'],
    queryFn: () => apiRequest('GET', '/api/gamification/stats').then(res => res.json())
  });

  const joinChallengeMutation = useMutation({
    mutationFn: (challengeId: string) => 
      apiRequest('POST', '/api/gamification/join-challenge', { challengeId }),
    onSuccess: () => {
      toast({
        title: "Challenge Joined",
        description: "You've successfully joined the challenge. Good luck!",
      });
    },
  });

  const claimRewardMutation = useMutation({
    mutationFn: (achievementId: string) =>
      apiRequest('POST', '/api/gamification/claim-reward', { achievementId }),
    onSuccess: () => {
      toast({
        title: "Reward Claimed",
        description: "Your achievement reward has been added to your account.",
      });
    },
  });

  const handleJoinChallenge = (challengeId: string) => {
    joinChallengeMutation.mutate(challengeId);
  };

  const handleClaimReward = (achievementId: string) => {
    claimRewardMutation.mutate(achievementId);
  };

  // Use real data from API with fallback for loading states
  const userStats: UserStats = gamificationData?.userStats || {
    level: 0, totalPoints: 0, pointsToNextLevel: 0, currentStreak: 0,
    longestStreak: 0, completedChallenges: 0, rank: 0, totalUsers: 0,
    badges: 0, achievements: 0
  };

  const achievements: Achievement[] = gamificationData?.achievements || [
    {
      id: '1',
      title: 'Content Creator',
      description: 'Create your first piece of content',
      icon: '🎨',
      rarity: 'common',
      points: 50,
      progress: 1,
      maxProgress: 1,
      completed: true,
      unlockedAt: '2025-01-01',
      category: 'content'
    },
    {
      id: '2',
      title: 'Viral Sensation',
      description: 'Get 10,000 views on a single post',
      icon: '🚀',
      rarity: 'epic',
      points: 500,
      progress: 8500,
      maxProgress: 10000,
      completed: false,
      category: 'engagement'
    },
    {
      id: '3',
      title: 'Consistency King',
      description: 'Post content for 30 consecutive days',
      icon: '👑',
      rarity: 'rare',
      points: 300,
      progress: 23,
      maxProgress: 30,
      completed: false,
      category: 'consistency'
    }
  ];

  const challenges: Challenge[] = gamificationData?.challenges || [
    {
      id: '1',
      title: 'January Growth Sprint',
      description: 'Gain 100 new followers this month',
      difficulty: 'medium',
      duration: '30 days',
      reward: {
        points: 500,
        badge: 'Growth Master',
        credits: 10
      },
      progress: 67,
      maxProgress: 100,
      startDate: '2025-01-01',
      endDate: '2025-01-31',
      status: 'active',
      participants: 234
    },
    {
      id: '2',
      title: 'Content Marathon',
      description: 'Create and publish 20 pieces of content',
      difficulty: 'hard',
      duration: '21 days',
      reward: {
        points: 750,
        badge: 'Content Machine',
        credits: 15
      },
      progress: 12,
      maxProgress: 20,
      startDate: '2025-01-10',
      endDate: '2025-01-31',
      status: 'active',
      participants: 156
    }
  ];

  const leaderboard: Leaderboard[] = gamificationData?.leaderboard || [
    { rank: 1, username: 'CreatorPro', level: 25, points: 5420, badges: 15 },
    { rank: 2, username: 'ViralMaster', level: 23, points: 4890, badges: 12 },
    { rank: 3, username: 'You', level: 12, points: 2450, badges: 8, isCurrentUser: true },
    { rank: 4, username: 'ContentKing', level: 18, points: 2380, badges: 10 },
    { rank: 5, username: 'TrendSetter', level: 16, points: 2210, badges: 9 }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-400 to-orange-500';
      case 'epic': return 'from-purple-400 to-pink-500';
      case 'rare': return 'from-blue-400 to-cyan-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'expert': return 'text-red-400 bg-red-900/50';
      case 'hard': return 'text-orange-400 bg-orange-900/50';
      case 'medium': return 'text-yellow-400 bg-yellow-900/50';
      default: return 'text-green-400 bg-green-900/50';
    }
  };

  // Loading and error states
  if (isLoading) {
    return (
      <div className="min-h-screen bg-transparent">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
              <p className="text-gray-300">Loading gamification data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-transparent">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-red-400">Error Loading Data</h1>
            <p className="text-gray-300">Unable to load gamification data. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent">
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-500 bg-clip-text text-transparent">
            Creator Gamification
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Level up your content creation journey with challenges, achievements, and rewards
          </p>
        </div>

        {/* User Stats Overview */}
        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center">
                  <Crown className="h-8 w-8 text-yellow-400" />
                  <span className="text-2xl font-bold ml-2">{userStats.level}</span>
                </div>
                <p className="text-sm text-gray-400">Level</p>
                <div className="space-y-1">
                  <Progress value={(userStats.totalPoints % 1000) / 10} className="h-2" />
                  <p className="text-xs text-gray-500">{userStats.pointsToNextLevel} XP to next level</p>
                </div>
              </div>

              <div className="text-center space-y-2">
                <div className="flex items-center justify-center">
                  <Flame className="h-8 w-8 text-orange-400" />
                  <span className="text-2xl font-bold ml-2">{userStats.currentStreak}</span>
                </div>
                <p className="text-sm text-gray-400">Day Streak</p>
                <p className="text-xs text-gray-500">Longest: {userStats.longestStreak} days</p>
              </div>

              <div className="text-center space-y-2">
                <div className="flex items-center justify-center">
                  <Trophy className="h-8 w-8 text-purple-400" />
                  <span className="text-2xl font-bold ml-2">#{userStats.rank}</span>
                </div>
                <p className="text-sm text-gray-400">Global Rank</p>
                <p className="text-xs text-gray-500">Top {Math.round((userStats.rank / userStats.totalUsers) * 100)}%</p>
              </div>

              <div className="text-center space-y-2">
                <div className="flex items-center justify-center">
                  <Star className="h-8 w-8 text-blue-400" />
                  <span className="text-2xl font-bold ml-2">{userStats.totalPoints}</span>
                </div>
                <p className="text-sm text-gray-400">Total Points</p>
                <p className="text-xs text-gray-500">{userStats.achievements} achievements</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="achievements" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-900/50">
            <TabsTrigger value="achievements" className="data-[state=active]:bg-purple-600">
              <Award className="h-4 w-4 mr-2" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="challenges" className="data-[state=active]:bg-pink-600">
              <Target className="h-4 w-4 mr-2" />
              Challenges
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="data-[state=active]:bg-yellow-600">
              <TrendingUp className="h-4 w-4 mr-2" />
              Leaderboard
            </TabsTrigger>
            <TabsTrigger value="rewards" className="data-[state=active]:bg-blue-600">
              <Gift className="h-4 w-4 mr-2" />
              Rewards
            </TabsTrigger>
          </TabsList>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-400" />
                  Your Achievements
                </CardTitle>
                <CardDescription>
                  Track your progress and unlock new achievements as you grow
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2 mb-4">
                  <Button
                    size="sm"
                    variant={selectedCategory === 'all' ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory('all')}
                  >
                    All
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedCategory === 'content' ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory('content')}
                  >
                    Content
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedCategory === 'engagement' ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory('engagement')}
                  >
                    Engagement
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedCategory === 'growth' ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory('growth')}
                  >
                    Growth
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {achievements.map((achievement) => (
                    <Card 
                      key={achievement.id} 
                      className={`bg-gray-800/50 border-gray-600 ${
                        achievement.completed ? 'ring-2 ring-green-500/50' : ''
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{achievement.icon}</div>
                            <div>
                              <h4 className="font-medium text-white">{achievement.title}</h4>
                              <Badge 
                                className={`text-xs bg-gradient-to-r ${getRarityColor(achievement.rarity)}`}
                              >
                                {achievement.rarity}
                              </Badge>
                            </div>
                          </div>
                          {achievement.completed && (
                            <CheckCircle className="h-5 w-5 text-green-400" />
                          )}
                        </div>

                        <p className="text-sm text-gray-300 mb-3">{achievement.description}</p>

                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>Progress</span>
                            <span>{achievement.progress}/{achievement.maxProgress}</span>
                          </div>
                          <Progress 
                            value={(achievement.progress / achievement.maxProgress) * 100} 
                            className="h-2" 
                          />
                        </div>

                        <div className="flex justify-between items-center mt-3">
                          <span className="text-sm text-blue-400">+{achievement.points} XP</span>
                          {achievement.completed && !achievement.unlockedAt && (
                            <Button 
                              size="sm" 
                              onClick={() => handleClaimReward(achievement.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Claim
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Challenges Tab */}
          <TabsContent value="challenges" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-pink-400" />
                  Active Challenges
                </CardTitle>
                <CardDescription>
                  Join challenges to earn rewards and compete with other creators
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2 mb-4">
                  <Button
                    size="sm"
                    variant={selectedDifficulty === 'all' ? 'default' : 'outline'}
                    onClick={() => setSelectedDifficulty('all')}
                  >
                    All Levels
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedDifficulty === 'easy' ? 'default' : 'outline'}
                    onClick={() => setSelectedDifficulty('easy')}
                  >
                    Easy
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedDifficulty === 'medium' ? 'default' : 'outline'}
                    onClick={() => setSelectedDifficulty('medium')}
                  >
                    Medium
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedDifficulty === 'hard' ? 'default' : 'outline'}
                    onClick={() => setSelectedDifficulty('hard')}
                  >
                    Hard
                  </Button>
                </div>

                <div className="space-y-4">
                  {challenges.map((challenge) => (
                    <Card key={challenge.id} className="bg-gray-800/50 border-gray-600">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <h4 className="font-medium text-white text-lg">{challenge.title}</h4>
                              <Badge className={getDifficultyColor(challenge.difficulty)}>
                                {challenge.difficulty}
                              </Badge>
                              <Badge variant="outline" className="text-blue-400 border-blue-400">
                                {challenge.participants} participants
                              </Badge>
                            </div>
                            <p className="text-gray-300">{challenge.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {challenge.duration}
                              </span>
                              <span>Ends: {challenge.endDate}</span>
                            </div>
                          </div>
                          <Button 
                            onClick={() => handleJoinChallenge(challenge.id)}
                            disabled={joinChallengeMutation.isPending}
                            className="bg-pink-600 hover:bg-pink-700"
                          >
                            {challenge.status === 'active' ? 'Join Challenge' : 'View Details'}
                          </Button>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span>Your Progress</span>
                            <span>{challenge.progress}/{challenge.maxProgress}</span>
                          </div>
                          <Progress 
                            value={(challenge.progress / challenge.maxProgress) * 100} 
                            className="h-3" 
                          />
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-blue-400">+{challenge.reward.points} XP</span>
                            {challenge.reward.credits && (
                              <span className="text-sm text-green-400">+{challenge.reward.credits} Credits</span>
                            )}
                            {challenge.reward.badge && (
                              <span className="text-sm text-purple-400">Badge: {challenge.reward.badge}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Users className="h-3 w-3" />
                            {challenge.participants} joined
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-yellow-400" />
                  Global Leaderboard
                </CardTitle>
                <CardDescription>
                  See how you rank against other creators worldwide
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {leaderboard.map((user, index) => (
                    <div 
                      key={user.rank}
                      className={`flex items-center justify-between p-4 rounded-lg ${
                        user.isCurrentUser 
                          ? 'bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/50' 
                          : 'bg-gray-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {index < 3 ? (
                            <Trophy className={`h-5 w-5 ${
                              index === 0 ? 'text-yellow-400' : 
                              index === 1 ? 'text-gray-300' : 'text-orange-400'
                            }`} />
                          ) : (
                            <span className="text-lg font-bold text-gray-400 w-5 text-center">
                              {user.rank}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-medium">
                            {user.username.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-white">{user.username}</p>
                            <p className="text-sm text-gray-400">Level {user.level}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-center">
                          <p className="text-blue-400 font-medium">{user.points.toLocaleString()}</p>
                          <p className="text-gray-400">Points</p>
                        </div>
                        <div className="text-center">
                          <p className="text-purple-400 font-medium">{user.badges}</p>
                          <p className="text-gray-400">Badges</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Card className="bg-gray-800/50 border-gray-600">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-yellow-400 mb-2">Season Rankings</h4>
                    <p className="text-sm text-gray-300 mb-3">
                      Current season ends in 18 days. Top 10 creators get special rewards!
                    </p>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Your season rank:</span>
                      <span className="text-yellow-400 font-medium">#3</span>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-blue-400" />
                  Rewards Shop
                </CardTitle>
                <CardDescription>
                  Spend your points and exchange rewards for platform benefits
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-blue-900/30 rounded-lg border border-blue-500/30">
                  <Sparkles className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <h3 className="font-medium text-blue-400 mb-1">Available Points</h3>
                  <p className="text-2xl font-bold text-white">{userStats.totalPoints}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: 'AI Credits Pack', cost: 500, description: '10 AI generation credits', icon: '🚀' },
                    { name: 'Premium Badge', cost: 1000, description: 'Exclusive profile badge', icon: '👑' },
                    { name: 'Analytics Boost', cost: 750, description: '7 days premium analytics', icon: '📊' },
                    { name: 'Custom Theme', cost: 1200, description: 'Unlock exclusive UI themes', icon: '🎨' },
                    { name: 'Priority Support', cost: 2000, description: '30 days priority support', icon: '🎧' },
                    { name: 'VIP Status', cost: 5000, description: 'VIP creator status for 1 month', icon: '⭐' }
                  ].map((reward, index) => (
                    <Card key={index} className="bg-gray-800/50 border-gray-600">
                      <CardContent className="p-4">
                        <div className="text-center space-y-3">
                          <div className="text-3xl">{reward.icon}</div>
                          <h4 className="font-medium text-white">{reward.name}</h4>
                          <p className="text-sm text-gray-300">{reward.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-blue-400 font-medium">{reward.cost} points</span>
                            <Button 
                              size="sm" 
                              disabled={userStats.totalPoints < reward.cost}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              {userStats.totalPoints >= reward.cost ? 'Redeem' : 'Not Enough'}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}