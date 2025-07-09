import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2, Users, TrendingUp, Star, Zap } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function EarlyAccessPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [waitlistUser, setWaitlistUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);

  // Load stats on component mount
  React.useEffect(() => {
    fetch('/api/early-access/stats')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStats(data.stats);
        }
      })
      .catch(err => console.error('Failed to load stats:', err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/early-access/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          referredBy: referralCode || null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Successfully joined the waitlist!');
        setWaitlistUser(data.user);
        setEmail('');
        setName('');
        setReferralCode('');
        
        // Refresh stats
        const statsResponse = await fetch('/api/early-access/stats');
        const statsData = await statsResponse.json();
        if (statsData.success) {
          setStats(statsData.stats);
        }
      } else {
        setError(data.error || 'Failed to join waitlist');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 pt-20">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Zap className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            VeeFore
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"> Early Access</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Join the exclusive early access program for VeeFore - the next-generation AI-powered content creation platform
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-300">Total Users</p>
                    <p className="text-2xl font-bold">{stats.totalUsers}</p>
                  </div>
                  <Users className="w-8 h-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-300">Today's Signups</p>
                    <p className="text-2xl font-bold">{stats.todaySignups}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-300">Total Referrals</p>
                    <p className="text-2xl font-bold">{stats.totalReferrals}</p>
                  </div>
                  <Star className="w-8 h-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Features */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">🚀 What's Coming</CardTitle>
              <CardDescription className="text-gray-300">
                Be among the first to experience the future of AI-powered content creation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-3"></div>
                <div>
                  <h3 className="font-semibold text-white">AI Content Generation</h3>
                  <p className="text-sm text-gray-400">Generate high-quality content across multiple platforms with advanced AI</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-3"></div>
                <div>
                  <h3 className="font-semibold text-white">Smart Scheduling</h3>
                  <p className="text-sm text-gray-400">Intelligent content scheduling with optimal timing recommendations</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-3"></div>
                <div>
                  <h3 className="font-semibold text-white">Analytics & Insights</h3>
                  <p className="text-sm text-gray-400">Deep analytics and actionable insights for content performance</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-3"></div>
                <div>
                  <h3 className="font-semibold text-white">Multi-Platform Support</h3>
                  <p className="text-sm text-gray-400">Seamless integration with Instagram, YouTube, Twitter, and more</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Side - Signup Form */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Join the Waitlist</CardTitle>
              <CardDescription className="text-gray-300">
                Get early access and exclusive benefits when we launch
              </CardDescription>
            </CardHeader>
            <CardContent>
              {waitlistUser ? (
                <div className="space-y-4">
                  <Alert className="bg-green-500/20 border-green-500/50">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <AlertDescription className="text-green-300">
                      Welcome to the VeeFore early access program!
                    </AlertDescription>
                  </Alert>
                  
                  <div className="p-4 bg-white/10 rounded-lg">
                    <h3 className="font-semibold mb-2">Your Waitlist Details:</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-400">Name:</span> {waitlistUser.name}</p>
                      <p><span className="text-gray-400">Email:</span> {waitlistUser.email}</p>
                      <p><span className="text-gray-400">Referral Code:</span> {waitlistUser.referralCode}</p>
                      <p><span className="text-gray-400">Status:</span> {waitlistUser.status}</p>
                      <p><span className="text-gray-400">Position:</span> #{waitlistUser.id}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-purple-500/20 rounded-lg">
                    <h3 className="font-semibold mb-2">Share Your Referral Code</h3>
                    <p className="text-sm text-gray-300 mb-2">
                      Invite friends and move up in the waitlist!
                    </p>
                    <div className="flex items-center space-x-2">
                      <Input
                        value={waitlistUser.referralCode}
                        readOnly
                        className="bg-white/10 border-white/20 text-white"
                      />
                      <Button
                        onClick={() => navigator.clipboard.writeText(waitlistUser.referralCode)}
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/20"
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-white">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-white">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="referral" className="text-white">Referral Code (Optional)</Label>
                    <Input
                      id="referral"
                      type="text"
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400"
                      placeholder="Enter referral code if you have one"
                    />
                  </div>

                  {error && (
                    <Alert className="bg-red-500/20 border-red-500/50">
                      <AlertCircle className="h-4 w-4 text-red-400" />
                      <AlertDescription className="text-red-300">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}

                  {message && (
                    <Alert className="bg-green-500/20 border-green-500/50">
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                      <AlertDescription className="text-green-300">
                        {message}
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3"
                  >
                    {isLoading ? 'Joining...' : 'Join Waitlist'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-400">
          <p>© 2025 Veefore — A product of VEEFED TECHNOLOGIES PRIVATE LIMITED</p>
        </div>
      </div>
    </div>
  );
}