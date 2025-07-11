import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Star, Rocket, Crown, ArrowRight, X } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import veeforeLogo from '@/assets/veefore-logo.png';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureType: string;
  creditsRequired: number;
  currentCredits: number;
}

export function UpgradeModal({ isOpen, onClose, featureType, creditsRequired, currentCredits }: UpgradeModalProps) {
  const { user } = useAuth();

  const { data: pricingData } = useQuery({
    queryKey: ['/api/subscription/plans'],
    queryFn: () => fetch('/api/subscription/plans').then(res => res.json()),
  });

  const formatNumber = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getFeatureDisplayName = (type: string) => {
    const names: Record<string, string> = {
      'ai-caption': 'AI Caption Generation',
      'ai-text-post': 'AI Text Post',
      'hashtag-generation': 'AI Hashtag Generation',
      'ai_suggestions': 'AI Growth Suggestions',
      'ai-image': 'AI Image Generation',
      'ai-visual': 'AI Visual Content',
      'ai-video': 'AI Video Generation',
      'ai-reel': 'AI Reel Creation',
      'video-generation': 'Video Generation',
      'reels-script': 'AI Script Generation',
    };
    return names[type] || 'AI Feature';
  };

  const creditPackages = pricingData?.creditPackages || [
    {
      id: 'starter',
      name: 'Starter Boost',
      baseCredits: 100,
      bonusCredits: 20,
      totalCredits: 120,
      price: 199,
      popular: false
    },
    {
      id: 'power',
      name: 'Power Pack',
      baseCredits: 300,
      bonusCredits: 75,
      totalCredits: 375,
      price: 499,
      popular: true
    },
    {
      id: 'ultimate',
      name: 'Ultimate Boost',
      baseCredits: 800,
      bonusCredits: 250,
      totalCredits: 1050,
      price: 999,
      popular: false
    }
  ];

  const subscriptionPlans = [
    {
      id: 'pro',
      name: 'Stellar Navigator',
      price: 999,
      credits: 500,
      features: ['500 Monthly Credits', 'Advanced Analytics', 'Priority Support', 'Custom AI Personality'],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Galactic Commander',
      price: 2999,
      credits: 2000,
      features: ['2000 Monthly Credits', 'Enterprise Analytics', '24/7 Support', 'Custom Integrations'],
      popular: false
    }
  ];

  const handleUpgrade = (planId: string) => {
    window.location.href = `/pricing?plan=${planId}`;
  };

  const handleBuyCredits = (packageId: string) => {
    window.location.href = `/subscription?tab=credits&package=${packageId}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-space-navy border border-electric-cyan/30 text-white">
        <DialogHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute -top-2 -right-2 text-asteroid-silver hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
          <DialogTitle className="text-2xl font-bold text-center text-electric-cyan mb-2">
            Insufficient Credits
          </DialogTitle>
          <div className="text-center space-y-2">
            <div className="text-asteroid-silver">
              You need <span className="text-electric-cyan font-semibold">{creditsRequired} credits</span> to use {getFeatureDisplayName(featureType)}
            </div>
            <div className="text-sm text-red-400">
              Current balance: {currentCredits} credits
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-8 mt-6">
          {/* Quick Credit Packages */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-solar-gold" />
              Quick Credit Boost
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {creditPackages.map((pkg, index) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`relative bg-cosmic-void/40 border transition-all duration-300 hover:scale-105 ${
                    pkg.popular ? 'border-electric-cyan shadow-lg shadow-electric-cyan/20' : 'border-asteroid-silver/30 hover:border-electric-cyan/50'
                  }`}>
                    {pkg.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-electric-cyan text-space-navy font-semibold">
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    <CardHeader className="text-center pb-3">
                      <CardTitle className="text-white text-lg">{pkg.name}</CardTitle>
                      <div className="text-2xl font-bold text-electric-cyan">
                        ₹{pkg.price}
                      </div>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                      <div>
                        <div className="text-lg font-semibold text-white">
                          {formatNumber(pkg.totalCredits)} Credits
                        </div>
                        <div className="text-sm text-asteroid-silver">
                          {formatNumber(pkg.baseCredits)} + {formatNumber(pkg.bonusCredits)} bonus
                        </div>
                      </div>
                      <Button
                        onClick={() => handleBuyCredits(pkg.id)}
                        className={`w-full ${
                          pkg.popular 
                            ? 'bg-electric-cyan hover:bg-electric-cyan/90 text-space-navy' 
                            : 'bg-cosmic-void border border-electric-cyan text-electric-cyan hover:bg-electric-cyan/10'
                        }`}
                      >
                        Buy Now
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Subscription Plans */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Crown className="w-5 h-5 text-solar-gold" />
              Monthly Plans with More Value
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {subscriptionPlans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Card className={`relative bg-cosmic-void/40 border transition-all duration-300 hover:scale-105 ${
                    plan.popular ? 'border-electric-cyan shadow-lg shadow-electric-cyan/20' : 'border-asteroid-silver/30 hover:border-electric-cyan/50'
                  }`}>
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-electric-cyan text-space-navy font-semibold">
                          Recommended
                        </Badge>
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-white text-xl">{plan.name}</CardTitle>
                      <div className="text-3xl font-bold text-electric-cyan">
                        ₹{plan.price}
                        <span className="text-sm text-asteroid-silver">/month</span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center py-3 bg-electric-cyan/10 rounded-lg">
                        <div className="text-2xl font-bold text-electric-cyan">
                          {formatNumber(plan.credits)} Credits/month
                        </div>
                        <div className="text-sm text-asteroid-silver">
                          Renewable monthly
                        </div>
                      </div>
                      <ul className="space-y-2">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-asteroid-silver">
                            <Star className="w-4 h-4 text-solar-gold flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button
                        onClick={() => handleUpgrade(plan.id)}
                        className={`w-full ${
                          plan.popular 
                            ? 'bg-electric-cyan hover:bg-electric-cyan/90 text-space-navy' 
                            : 'bg-cosmic-void border border-electric-cyan text-electric-cyan hover:bg-electric-cyan/10'
                        }`}
                      >
                        Upgrade Now
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Benefits Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center bg-gradient-to-r from-electric-cyan/10 to-solar-gold/10 rounded-lg p-6 border border-electric-cyan/20"
          >
            <img 
              src={veeforeLogo} 
              alt="VeeFore Logo" 
              className="w-12 h-12 object-contain mx-auto mb-4"
            />
            <h4 className="text-lg font-semibold text-white mb-2">
              Unlock Your Social Media Potential
            </h4>
            <p className="text-asteroid-silver">
              Get unlimited access to AI-powered content creation, advanced analytics, and growth strategies 
              that have helped thousands of creators build their online presence.
            </p>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}