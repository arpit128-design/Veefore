import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Crown, 
  Star, 
  Zap, 
  Rocket, 
  Check, 
  Sparkles,
  ShoppingCart
} from "lucide-react";

// Declare Razorpay for TypeScript
declare global {
  interface Window {
    Razorpay: any;
  }
}

// Interfaces
interface PricingPlan {
  id: string;
  name: string;
  price: number;
  credits: number;
  features: string[];
  popular?: boolean;
  description?: string;
}

interface CreditPackage {
  id: string;
  name: string;
  baseCredits: number;
  bonusCredits: number;
  totalCredits: number;
  price: number;
  savings?: string;
}

interface Addon {
  id: string;
  name: string;
  description: string;
  price: number;
  type: string;
}

interface UserSubscription {
  plan: string;
  credits: number;
  status: string;
  currentPeriodEnd?: string;
}

// Space Background Component
const SpaceBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-purple-900/50 to-slate-900" />
    {[...Array(100)].map((_, i) => (
      <div
        key={i}
        className="absolute w-0.5 h-0.5 bg-white rounded-full opacity-60"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 3}s`,
        }}
      />
    ))}
  </div>
);

export default function Pricing() {
  const [activeTab, setActiveTab] = useState("plans");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch pricing data
  const { data: pricingData } = useQuery({
    queryKey: ['/api/pricing'],
    queryFn: () => fetch('/api/pricing').then(res => res.json())
  });

  // Fetch user subscription
  const { data: userSubscription } = useQuery({
    queryKey: ['/api/subscription'],
    queryFn: () => apiRequest('GET', '/api/subscription'),
    retry: false
  });

  // Fetch subscription plans  
  const { data: plansData } = useQuery({
    queryKey: ['/api/subscription/plans'],
    queryFn: () => apiRequest('GET', '/api/subscription/plans')
  });

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Create subscription order mutation
  const createSubscriptionMutation = useMutation({
    mutationFn: async (planId: string) => {
      return apiRequest('POST', '/api/subscription/create-order', { planId });
    },
    onSuccess: (data: any) => {
      if (data && window.Razorpay) {
        const options = {
          key: data.key,
          amount: data.amount,
          currency: data.currency,
          name: 'VeeFore',
          description: 'Subscription Payment',
          order_id: data.orderId,
          handler: async (response: any) => {
            try {
              await apiRequest('POST', '/api/subscription/verify-payment', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });
              
              toast({
                title: "Payment Successful",
                description: "Your subscription has been activated!",
              });
              
              queryClient.invalidateQueries({ queryKey: ['/api/subscription'] });
              queryClient.invalidateQueries({ queryKey: ['/api/user'] });
            } catch (error) {
              toast({
                title: "Payment Verification Failed",
                description: "Please contact support if payment was deducted.",
                variant: "destructive",
              });
            }
          },
          prefill: {
            name: '',
            email: '',
          },
          theme: {
            color: '#6366f1',
          },
        };
        
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        toast({
          title: "Error",
          description: "Failed to initialize payment. Please try again.",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle plan selection
  const handlePlanSelect = (planId: string) => {
    const currentPlan = (userSubscription as any)?.plan || 'free';
    if (currentPlan === planId) return;
    
    if (planId === 'free') {
      toast({
        title: "Free Plan Selected",
        description: "You're now on the free plan!",
      });
      return;
    }
    
    createSubscriptionMutation.mutate(planId);
  };

  // Handle credit purchase
  const handleCreditPurchase = (packageId: string) => {
    toast({
      title: "Coming Soon",
      description: "Credit packages will be available soon!",
    });
  };

  // Handle addon purchase
  const handleAddonPurchase = (addonId: string) => {
    toast({
      title: "Coming Soon", 
      description: "Add-ons will be available soon!",
    });
  };

  const plans = pricingData?.plans || {};
  const creditPackages = pricingData?.creditPackages || [];
  const addons = pricingData?.addons || {};

  return (
    <div className="min-h-screen text-gray-900 relative overflow-hidden">
      <SpaceBackground />
      
      {/* Enhanced Cosmic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-900/20 via-blue-900/30 to-indigo-900/20 opacity-70" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-radial from-purple-500/20 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-gradient-radial from-cyan-500/20 via-transparent to-transparent rounded-full blur-3xl" />
        
        {/* Floating Stardust */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-70"
            initial={{ 
              x: Math.random() * 800, 
              y: Math.random() * 600,
              scale: 0.5 + Math.random() * 0.5
            }}
            animate={{ 
              y: [0, -50, 0],
              opacity: [0.7, 1, 0.7],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Orbital Rings */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/3 left-1/4 w-80 h-80 border border-purple-400/30 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-60 h-60 border border-cyan-400/30 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Enhanced Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
              Choose Your Cosmic Plan
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-cyan-600 to-purple-600 mx-auto rounded-full mb-6"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="max-w-5xl mx-auto mb-12"
          >
            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8">
              VeeFore is your AI-powered social media command center. Transform content creation, automate scheduling, and dominate multiple platforms with intelligent analytics and cosmic-level insights.
            </p>
            
            {/* Key Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="bg-transparent p-6 rounded-2xl border border-blue-500/30 backdrop-blur-sm"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl mb-4 mx-auto">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">AI Content Generation</h3>
                <p className="text-slate-400 text-sm">Create stunning posts, videos, and stories with advanced AI that understands your brand voice and audience.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="bg-transparent p-6 rounded-2xl border border-purple-500/30 backdrop-blur-sm"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mb-4 mx-auto">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Multi-Platform Publishing</h3>
                <p className="text-slate-400 text-sm">Seamlessly publish to Instagram, Facebook, Twitter, and more. Schedule content across all platforms from one dashboard.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="bg-transparent p-6 rounded-2xl border border-cyan-500/30 backdrop-blur-sm"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl mb-4 mx-auto">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Advanced Analytics</h3>
                <p className="text-slate-400 text-sm">Track performance, analyze audience engagement, and optimize your strategy with real-time insights and predictive analytics.</p>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-center"
          >
            <p className="text-lg text-slate-400 mb-2">Join thousands of creators and businesses scaling their social presence</p>
            <div className="flex items-center justify-center gap-8 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <span>No setup fees</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <span>24/7 support</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Current Subscription Status */}
        {userSubscription && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12 text-center"
          >
            <Card className="bg-gradient-to-r from-blue-900/30 via-purple-900/30 to-blue-900/30 border-blue-500/50 backdrop-blur-sm max-w-lg mx-auto">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-2">Current Plan</h3>
                <div className="flex items-center justify-center gap-4">
                  <Badge className="bg-blue-500/20 text-blue-300 px-4 py-2 text-base">
                    {(userSubscription as any)?.plan || 'Free'}
                  </Badge>
                  <div className="text-slate-300">
                    <span className="font-medium">{(userSubscription as any)?.credits || 0}</span> credits remaining
                  </div>
                </div>
                {(userSubscription as any)?.currentPeriodEnd && (
                  <p className="text-slate-400 text-sm mt-2">
                    Renews on {new Date((userSubscription as any).currentPeriodEnd).toLocaleDateString()}
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Stellar Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-slate-900/50 border border-slate-700/50 backdrop-blur-sm max-w-md mx-auto">
              <TabsTrigger 
                value="plans" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-300 font-medium"
              >
                <Star className="w-4 h-4 mr-2" />
                Plans
              </TabsTrigger>
              <TabsTrigger 
                value="credits" 
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-slate-300 font-medium"
              >
                <Zap className="w-4 h-4 mr-2" />
                Credits
              </TabsTrigger>
              <TabsTrigger 
                value="addons" 
                className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white text-slate-300 font-medium"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add-ons
              </TabsTrigger>
            </TabsList>

            {/* Stellar Subscription Plans */}
            <TabsContent value="plans" className="mt-16">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {Object.entries(plans).map(([key, plan]: [string, any]) => {
                  const isPopular = plan.popular;
                  
                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 60, rotateX: -15 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0 }}
                      transition={{ 
                        delay: Object.keys(plans).indexOf(key) * 0.1,
                        duration: 0.8,
                        ease: [0.25, 0.46, 0.45, 0.94]
                      }}
                      className="perspective-1000 group"
                    >
                      <motion.div
                        whileHover={{ 
                          scale: 1.02,
                          y: -8,
                          transition: { duration: 0.3, ease: "easeOut" }
                        }}
                        className="relative h-full"
                      >
                        <Card className={`
                          h-full relative overflow-hidden border-2 backdrop-blur-md transition-all duration-500 hover:scale-105 group-hover:shadow-2xl
                          ${isPopular 
                            ? 'border-amber-500/60 bg-gradient-to-br from-amber-900/30 via-orange-900/20 to-red-900/30 hover:border-amber-400/80 ring-4 ring-amber-400/20' 
                            : plan.id === 'free'
                              ? 'border-slate-500/40 bg-gradient-to-br from-slate-800/40 via-slate-700/30 to-slate-800/40 hover:border-slate-400/60'
                              : plan.id === 'creator'
                                ? 'border-blue-500/50 bg-gradient-to-br from-blue-900/40 via-cyan-900/30 to-blue-900/40 hover:border-blue-400/70'
                                : plan.id === 'pro'
                                  ? 'border-purple-500/50 bg-gradient-to-br from-purple-900/40 via-violet-900/30 to-purple-900/40 hover:border-purple-400/70'
                                  : 'border-indigo-500/50 bg-gradient-to-br from-indigo-900/40 via-blue-900/30 to-indigo-900/40 hover:border-indigo-400/70'
                          }
                        `}>
                        
                        {/* Holographic Shimmer */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -skew-x-12" />

                        {/* Popular Crown Badge */}
                        {isPopular && (
                          <motion.div 
                            className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20"
                            initial={{ scale: 0, rotate: -10 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.5, type: "spring", bounce: 0.5 }}
                          >
                            <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 text-black px-6 py-2 text-sm font-bold rounded-full shadow-lg border-2 border-amber-300">
                              <span className="flex items-center gap-2">
                                <Crown className="w-4 h-4" />
                                Most Popular
                              </span>
                            </div>
                          </motion.div>
                        )}
                        
                        <CardHeader className="text-center pb-4 pt-6 relative z-10">
                          <motion.div 
                            className="flex justify-center mb-4"
                            animate={{ 
                              y: [0, -4, 0],
                            }}
                            transition={{ 
                              y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                            }}
                          >
                            <div className="relative">
                              {plan.id === 'free' && (
                                <Sparkles className="h-12 w-12 text-gray-500 drop-shadow-sm" />
                              )}
                              {plan.id === 'creator' && (
                                <Star className="h-12 w-12 text-blue-500 drop-shadow-sm" />
                              )}
                              {plan.id === 'pro' && (
                                <Zap className="h-12 w-12 text-purple-500 drop-shadow-sm" />
                              )}
                              {plan.id === 'enterprise' && (
                                <Crown className="h-12 w-12 text-indigo-500 drop-shadow-sm" />
                              )}
                            </div>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            <CardTitle className="text-2xl font-bold text-white mb-2 tracking-wide">
                              {plan.name}
                            </CardTitle>
                            <CardDescription className="text-slate-300 text-sm leading-relaxed">
                              {plan.description || (plan.id === 'free' ? 'Perfect for getting started' :
                               plan.id === 'creator' ? 'For content creators' :
                               plan.id === 'pro' ? 'For agencies and teams' :
                               'Enterprise solutions')}
                            </CardDescription>
                          </motion.div>
                        </CardHeader>

                        <CardContent className="pb-6 relative z-10">
                          <motion.div 
                            className="text-center mb-6"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                          >
                            <div className="relative">
                              <div className={`text-3xl font-bold mb-1 ${
                                isPopular ? 'text-amber-400' : 'text-white'
                              }`}>
                                {plan.price === 0 ? 'Free' : `₹${plan.price}`}
                              </div>
                              {plan.price > 0 && (
                                <div className="text-slate-400 text-sm font-medium">per month</div>
                              )}
                            </div>
                          </motion.div>

                          <motion.div 
                            className="space-y-3 mb-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                          >
                            <motion.div 
                              className="flex items-center text-sm"
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.7 }}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                  <Check className="h-3 w-3 text-emerald-400" />
                                </div>
                                <span className="text-white font-medium">{plan.credits} monthly credits</span>
                              </div>
                            </motion.div>
                            
                            {(plan.features || [
                              plan.id === 'free' ? 'Basic AI content generation' : 'Advanced AI content generation',
                              plan.id === 'free' ? '1 social platform' : plan.id === 'creator' ? '3 social platforms' : plan.id === 'pro' ? '5 social platforms' : 'Unlimited platforms',
                              plan.id === 'free' ? 'Basic analytics' : plan.id === 'creator' ? 'Advanced analytics' : 'Premium analytics',
                              plan.id === 'enterprise' ? 'Dedicated support' : 'Community support'
                            ]).map((feature: string, index: number) => (
                              <motion.div 
                                key={index} 
                                className="flex items-center text-sm"
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.8 + index * 0.1 }}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                    <Check className="h-3 w-3 text-emerald-400" />
                                  </div>
                                  <span className="text-white">{feature}</span>
                                </div>
                              </motion.div>
                            ))}
                          </motion.div>
                        </CardContent>

                        <CardFooter className="pt-0">
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full"
                          >
                            <Button
                              className={`w-full py-4 px-6 rounded-xl font-semibold text-base transition-all duration-300 ${
                                userSubscription?.plan === plan.id
                                  ? 'bg-slate-600 hover:bg-slate-600 cursor-not-allowed text-slate-300'
                                  : isPopular
                                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 shadow-lg hover:shadow-amber-500/25 text-white'
                                  : plan.id === 'creator'
                                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 shadow-lg hover:shadow-blue-500/25 text-white'
                                    : plan.id === 'pro'
                                      ? 'bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-400 hover:to-violet-400 shadow-lg hover:shadow-purple-500/25 text-white'
                                      : 'bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-400 hover:to-blue-400 shadow-lg hover:shadow-indigo-500/25 text-white'
                              }`}
                              onClick={() => handlePlanSelect(plan.id)}
                              disabled={(userSubscription as any)?.plan === plan.id || createSubscriptionMutation.isPending}
                            >
                              <span className="flex items-center justify-center gap-2">
                                {(userSubscription as any)?.plan === plan.id 
                                  ? 'Current Plan' 
                                  : plan.price === 0 
                                  ? 'Get Started' 
                                  : 'Choose Plan'
                                }
                                {(userSubscription as any)?.plan !== plan.id && plan.price > 0 && (
                                  <Rocket className="w-4 h-4" />
                                )}
                              </span>
                            </Button>
                          </motion.div>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          {/* Credit Packages */}
          <TabsContent value="credits" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {creditPackages.map((pkg: CreditPackage, index: number) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full bg-gradient-to-b from-purple-900/20 to-pink-900/20 border-purple-500/30 hover:border-purple-400 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                    <CardHeader className="text-center">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      >
                        <Rocket className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                      </motion.div>
                      <CardTitle className="text-xl font-bold text-white">{pkg.name}</CardTitle>
                      <CardDescription className="text-slate-300">
                        {pkg.baseCredits} + {pkg.bonusCredits} bonus credits
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="text-center pb-4">
                      <div className="text-3xl font-bold text-white mb-2">
                        {pkg.totalCredits} Credits
                      </div>
                      <div className="text-2xl font-semibold text-purple-400 mb-4">
                        ₹{pkg.price}
                      </div>
                      {pkg.savings && (
                        <Badge className="bg-green-500/20 text-green-300">
                          Save {pkg.savings}
                        </Badge>
                      )}
                    </CardContent>

                    <CardFooter>
                      <Button
                        className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold py-3"
                        onClick={() => handleCreditPurchase(pkg.id)}
                        disabled={false}
                      >
                        Buy Credits
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Add-ons */}
          <TabsContent value="addons" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(addons).map(([key, addon]: [string, any]) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Object.keys(addons).indexOf(key) * 0.1 }}
                >
                  <Card className="h-full bg-gradient-to-b from-cyan-900/20 to-blue-900/20 border-cyan-500/30 hover:border-cyan-400 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl font-bold text-white">{addon.name}</CardTitle>
                          <CardDescription className="text-slate-300 mt-2">
                            {addon.description}
                          </CardDescription>
                        </div>
                        <Badge className="bg-cyan-500/20 text-cyan-300">{addon.type}</Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="pb-4">
                      <div className="text-2xl font-bold text-white">
                        ₹{addon.price}/month
                      </div>
                    </CardContent>

                    <CardFooter>
                      <Button
                        className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold py-3"
                        onClick={() => handleAddonPurchase(addon.id)}
                        disabled={false}
                      >
                        Add to Plan
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
          </Tabs>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <h2 className="text-3xl font-bold mb-8 text-white bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/50 transition-all duration-300">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-2">What are credits?</h3>
                <p className="text-slate-300 text-sm">
                  Credits are used for AI features like content generation, image creation, and analytics. Each feature has a different credit cost.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/50 transition-all duration-300">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-2">Can I change plans anytime?</h3>
                <p className="text-slate-300 text-sm">
                  Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/50 transition-all duration-300">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-2">Do you offer refunds?</h3>
                <p className="text-slate-300 text-sm">
                  We offer a 30-day money-back guarantee for all paid plans. Contact support for assistance.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/50 transition-all duration-300">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-2">How do I get support?</h3>
                <p className="text-slate-300 text-sm">
                  Enterprise users get dedicated support. Other plans have access to our community forum and email support.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}