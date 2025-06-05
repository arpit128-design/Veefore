import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SpaceBackground } from "@/components/layout/SpaceBackground";
import { loginWithGoogle, handleRedirect } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function Auth() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Check for referral code in URL
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');
    if (ref) {
      setReferralCode(ref);
    }

    // Handle redirect result from Google auth
    handleRedirect().then((result) => {
      if (result?.user) {
        toast({
          title: "Welcome to VeeFore!",
          description: "Successfully signed in to your galactic command center.",
        });
        setLocation('/dashboard');
      }
    }).catch((error) => {
      if (error.message) {
        toast({
          title: "Authentication Failed",
          description: error.message,
          variant: "destructive",
        });
      }
    });
  }, [setLocation, toast]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Failed to sign in with Google",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-space-navy text-white overflow-hidden relative">
      <SpaceBackground />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          {/* Logo and Title */}
          <div className="text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-electric-cyan to-nebula-purple animate-pulse-glow mx-auto"></div>
            <h1 className="text-4xl font-orbitron font-bold neon-text text-electric-cyan">
              VeeFore
            </h1>
            <p className="text-asteroid-silver text-lg">
              AI-Powered Content Creation Platform
            </p>
            <p className="text-sm text-asteroid-silver">
              Join the galactic network of content creators
            </p>
          </div>

          {/* Auth Card */}
          <Card className="content-card holographic">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-orbitron font-semibold neon-text text-electric-cyan">
                Initialize Systems
              </CardTitle>
              <p className="text-asteroid-silver">
                Sign in to access your mission control
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Referral Code Input */}
              {referralCode && (
                <div className="p-4 rounded-lg bg-solar-gold/10 border border-solar-gold/30">
                  <div className="flex items-center space-x-2 mb-2">
                    <i className="fas fa-gift text-solar-gold"></i>
                    <span className="font-medium text-solar-gold">Referral Bonus</span>
                  </div>
                  <p className="text-sm text-asteroid-silver">
                    You'll receive <span className="text-solar-gold font-medium">100 free credits</span> when you sign up!
                  </p>
                  <div className="mt-2">
                    <Label htmlFor="referral" className="text-xs">Referral Code</Label>
                    <Input
                      id="referral"
                      value={referralCode}
                      readOnly
                      className="glassmorphism font-mono text-sm mt-1"
                    />
                  </div>
                </div>
              )}

              {/* Google Sign In */}
              <Button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full bg-gradient-to-r from-electric-cyan to-nebula-purple hover:opacity-90 transition-opacity h-12"
              >
                {loading ? (
                  <>
                    <LoadingSpinner className="w-5 h-5 mr-3" />
                    Initializing...
                  </>
                ) : (
                  <>
                    <i className="fab fa-google text-xl mr-3"></i>
                    Continue with Google
                  </>
                )}
              </Button>

              {/* Features Preview */}
              <div className="space-y-3 pt-4 border-t border-electric-cyan/20">
                <div className="text-center text-sm font-medium text-electric-cyan mb-3">
                  🚀 What awaits you in VeeFore:
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-brain text-nebula-purple"></i>
                    <span>AI Content Studio</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-calendar text-solar-gold"></i>
                    <span>Smart Scheduler</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-chart-line text-green-400"></i>
                    <span>Growth Analytics</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-magic text-electric-cyan"></i>
                    <span>AI Suggestions</span>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <p className="text-xs text-asteroid-silver text-center">
                By signing in, you agree to our{" "}
                <a href="#" className="text-electric-cyan hover:underline">Terms of Service</a>{" "}
                and{" "}
                <a href="#" className="text-electric-cyan hover:underline">Privacy Policy</a>
              </p>
            </CardContent>
          </Card>

          {/* Bottom Info */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-4 text-sm text-asteroid-silver">
              <span>✨ Free 50 credits</span>
              <span>•</span>
              <span>🎯 AI-powered</span>
              <span>•</span>
              <span>🚀 Multi-platform</span>
            </div>
            <p className="text-xs text-asteroid-silver">
              Join thousands of creators using AI to scale their content
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
