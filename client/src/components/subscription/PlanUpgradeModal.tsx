import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { 
  Crown, 
  Zap, 
  Star, 
  Building, 
  Check, 
  ArrowRight,
  Sparkles,
  Rocket,
  Shield,
  Compass,
  Globe
} from "lucide-react";

interface PlanUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: string;
  currentPlan: string;
  upgradeMessage: string;
  limitReached?: {
    current: number;
    max: number;
    type: string;
  };
}

const PLAN_FEATURES = {
  free: {
    name: "Free",
    price: 0,
    currency: "₹",
    interval: "forever",
    icon: Sparkles,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    limits: {
      workspaces: 1,
      credits: 50,
      socialAccounts: 1,
      scheduling: "7 days"
    },
    features: [
      "1 workspace",
      "50 monthly credits",
      "1 social account per platform",
      "Basic scheduling (7 days)",
      "Basic calendar view"
    ]
  },
  creator: {
    name: "Creator",
    price: 299,
    currency: "₹",
    interval: "month",
    icon: Crown,
    color: "text-purple-400", 
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    limits: {
      workspaces: 3,
      credits: 200,
      socialAccounts: 2,
      scheduling: "30 days"
    },
    features: [
      "3 workspaces",
      "200 monthly credits", 
      "2 social accounts per platform",
      "30-day scheduling",
      "Analytics access",
      "Watermark-free content"
    ]
  },
  pro: {
    name: "Pro", 
    price: 999,
    currency: "₹",
    interval: "month",
    icon: Rocket,
    color: "text-orange-400",
    bgColor: "bg-orange-500/10", 
    borderColor: "border-orange-500/20",
    limits: {
      workspaces: 10,
      credits: 500,
      socialAccounts: 5,
      scheduling: "90 days"
    },
    features: [
      "10 workspaces",
      "500 monthly credits",
      "5 social accounts per platform", 
      "90-day scheduling",
      "Brand voice trainer",
      "A/B testing",
      "Priority publishing"
    ]
  },
  enterprise: {
    name: "Enterprise",
    price: 2999,
    currency: "₹", 
    interval: "month",
    icon: Building,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20", 
    limits: {
      workspaces: "Unlimited",
      credits: 2000,
      socialAccounts: 10,
      scheduling: "Unlimited"
    },
    features: [
      "Unlimited workspaces",
      "2000 monthly credits",
      "10 social accounts per platform",
      "Unlimited scheduling", 
      "White label options",
      "Custom integrations",
      "Priority support",
      "Account manager"
    ]
  }
};

export default function PlanUpgradeModal({ 
  isOpen, 
  onClose, 
  feature, 
  currentPlan, 
  upgradeMessage,
  limitReached 
}: PlanUpgradeModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string>('creator');
  const [isProcessing, setIsProcessing] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);

  // Animation cycle for floating elements
  useEffect(() => {
    if (!isOpen) return;
    
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 360);
    }, 50);

    return () => clearInterval(interval);
  }, [isOpen]);

  const { data: plans } = useQuery({
    queryKey: ['subscription', 'plans'],
    queryFn: () => apiRequest('GET', '/api/subscription/plans'),
  });

  const createOrderMutation = useMutation({
    mutationFn: async (planId: string) => {
      const response = await apiRequest('POST', '/api/subscription/create-order', { planId });
      return response.json();
    },
    onSuccess: (data) => {
      // Open Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: 'VeeFore',
        description: `Upgrade to ${PLAN_FEATURES[selectedPlan as keyof typeof PLAN_FEATURES].name} Plan`,
        order_id: data.orderId,
        handler: async (response: any) => {
          try {
            await apiRequest('POST', '/api/subscription/verify-payment', {
              ...response,
              planId: selectedPlan
            });
            toast({
              title: "Upgrade Successful!",
              description: `Welcome to ${PLAN_FEATURES[selectedPlan as keyof typeof PLAN_FEATURES].name} plan!`,
            });
            onClose();
            window.location.reload(); // Refresh to update plan access
          } catch (error) {
            toast({
              title: "Payment Verification Failed",
              description: "Please contact support",
              variant: "destructive",
            });
          }
          setIsProcessing(false);
        },
        modal: {
          ondismiss: () => setIsProcessing(false)
        },
        theme: {
          color: '#0EA5E9'
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    },
    onError: (error: any) => {
      toast({
        title: "Payment Failed",
        description: error.message || "Failed to create order",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  });

  const handleUpgrade = () => {
    setIsProcessing(true);
    createOrderMutation.mutate(selectedPlan);
  };

  const getFeatureDisplayName = (feature: string) => {
    const featureMap: Record<string, string> = {
      'workspace_creation': 'create additional workspaces',
      'ai_generation': 'generate AI content',
      'social_connections': 'connect more social accounts',
      'advanced_scheduling': 'schedule content further ahead',
      'analytics': 'access analytics',
      'brand_voice': 'use brand voice trainer'
    };
    return featureMap[feature] || feature;
  };

  const currentPlanData = PLAN_FEATURES[currentPlan.toLowerCase() as keyof typeof PLAN_FEATURES];
  const CurrentIcon = currentPlanData?.icon || Sparkles;

  // Floating particles animation data
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 2
  }));

  // Debug logging for modal state
  console.log('[UPGRADE MODAL] Component props:', { isOpen, feature, currentPlan, upgradeMessage, limitReached });
  
  // Force open for debugging if needed
  const shouldShow = isOpen;
  console.log('[UPGRADE MODAL] Should show:', shouldShow);

  return (
    <Dialog open={shouldShow} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-slate-700/50 backdrop-blur-xl relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Floating Particles */}
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute rounded-full bg-gradient-to-r from-blue-400/30 to-purple-400/30"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                animation: `float ${3 + particle.delay}s ease-in-out infinite`,
                animationDelay: `${particle.delay}s`,
                transform: `translateY(${Math.sin(animationPhase * 0.01 + particle.id) * 10}px) rotate(${animationPhase + particle.id * 30}deg)`,
                transition: 'transform 0.05s ease-out'
              }}
            />
          ))}
          
          {/* Orbital Rings */}
          <div 
            className="absolute top-1/2 left-1/2 w-96 h-96 border border-blue-500/10 rounded-full"
            style={{
              transform: `translate(-50%, -50%) rotate(${animationPhase * 0.5}deg)`,
              transition: 'transform 0.05s ease-out'
            }}
          />
          <div 
            className="absolute top-1/2 left-1/2 w-80 h-80 border border-purple-500/10 rounded-full"
            style={{
              transform: `translate(-50%, -50%) rotate(${-animationPhase * 0.3}deg)`,
              transition: 'transform 0.05s ease-out'
            }}
          />
          
          {/* Gradient Waves */}
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent"
            style={{
              transform: `translateX(${Math.sin(animationPhase * 0.02) * 50}px)`,
              transition: 'transform 0.05s ease-out'
            }}
          />
        </div>

        <DialogHeader className="text-center pb-6 relative z-10">
          <div 
            className="mx-auto mb-4 p-3 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 backdrop-blur-sm"
            style={{
              transform: `scale(${1 + Math.sin(animationPhase * 0.03) * 0.1}) rotateY(${Math.sin(animationPhase * 0.02) * 15}deg)`,
              transition: 'transform 0.05s ease-out'
            }}
          >
            <Shield className="w-8 h-8 text-orange-400" />
          </div>
          <DialogTitle 
            className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent"
            style={{
              transform: `translateY(${Math.sin(animationPhase * 0.025) * 2}px)`,
              transition: 'transform 0.05s ease-out'
            }}
          >
            🚀 Unlock Cosmic Power
          </DialogTitle>
          <p 
            className="text-slate-400 text-lg"
            style={{
              transform: `translateY(${Math.sin(animationPhase * 0.025 + 1) * 2}px)`,
              transition: 'transform 0.05s ease-out'
            }}
          >
            You've reached the limits of your current galaxy
          </p>
        </DialogHeader>

        {/* Current Plan Status */}
        <div className="mb-6 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 rounded-lg ${currentPlanData?.bgColor} border ${currentPlanData?.borderColor}`}>
              <CurrentIcon className={`w-5 h-5 ${currentPlanData?.color}`} />
            </div>
            <div>
              <h3 className="font-semibold text-white">Current Plan: {currentPlanData?.name}</h3>
              <p className="text-sm text-slate-400">
                You're trying to {getFeatureDisplayName(feature)}
              </p>
            </div>
          </div>
          
          {limitReached && (
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span className="text-slate-300">
                Limit reached: {limitReached.current}/{limitReached.max} {limitReached.type}
              </span>
            </div>
          )}
        </div>

        {/* Upgrade Message */}
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
          <p className="text-blue-300 font-medium">{upgradeMessage}</p>
        </div>

        {/* Plan Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {Object.entries(PLAN_FEATURES).slice(1).map(([planKey, plan]) => {
            const Icon = plan.icon;
            const isSelected = selectedPlan === planKey;
            const isRecommended = planKey === 'creator';
            
            return (
              <Card 
                key={planKey}
                className={`relative cursor-pointer transition-all duration-500 group perspective-1000 ${
                  isSelected 
                    ? `${plan.bgColor} border-2 ${plan.borderColor} shadow-xl shadow-purple-500/20` 
                    : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600/50'
                }`}
                style={{
                  transform: isSelected 
                    ? `scale(1.05) rotateY(${Math.sin(animationPhase * 0.02) * 5}deg) rotateX(${Math.cos(animationPhase * 0.015) * 3}deg)` 
                    : 'scale(1) rotateY(0deg) rotateX(0deg)',
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.5s ease-out, box-shadow 0.3s ease-out',
                  boxShadow: isSelected 
                    ? `0 20px 40px rgba(139, 92, 246, 0.3), 0 0 20px ${plan.color.replace('text-', 'rgba(').replace('-', ', ').replace('400', '0.2)')}` 
                    : '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
                onClick={() => setSelectedPlan(planKey)}
              >
                {isRecommended && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1">
                      <Star className="w-3 h-3 mr-1" />
                      Recommended
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-3">
                  <div className={`mx-auto mb-3 p-3 rounded-xl ${plan.bgColor} border ${plan.borderColor}`}>
                    <Icon className={`w-6 h-6 ${plan.color}`} />
                  </div>
                  <CardTitle className="text-xl text-white">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold text-white">
                    {plan.currency}{plan.price}
                    <span className="text-sm text-slate-400">/{plan.interval}</span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span className="text-sm text-slate-300">{feature}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-slate-700/50">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800"
            disabled={isProcessing}
          >
            Maybe Later
          </Button>
          <Button 
            onClick={handleUpgrade}
            disabled={isProcessing}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold"
          >
            {isProcessing ? (
              "Processing..."
            ) : (
              <>
                Upgrade Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="text-center pt-4 border-t border-slate-700/50">
          <p className="text-xs text-slate-500">
            🔒 Secure payment • 💳 All cards accepted • ⚡ Instant activation
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}