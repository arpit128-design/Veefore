import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SpaceBackground } from '@/components/ui/space-background';
import { Check, Star, Zap, Crown, Rocket, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  credits: number;
  features: string[];
  popular?: boolean;
  icon: any;
  color: string;
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

export default function Pricing() {
  const [activeTab, setActiveTab] = useState('plans');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch pricing data
  const { data: pricingData, isLoading } = useQuery({
    queryKey: ['/api/pricing'],
  });

  // Fetch user subscription info
  const { data: userSubscription } = useQuery({
    queryKey: ['/api/subscription'],
  });

  // Create subscription order mutation
  const createOrderMutation = useMutation({
    mutationFn: async ({ planId, type, packageId, addonId }: any) => {
      if (type === 'subscription') {
        return apiRequest('/api/subscription/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ planId })
        });
      } else if (type === 'credits') {
        return apiRequest('/api/credits/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ packageId })
        });
      } else if (type === 'addon') {
        return apiRequest('/api/addons/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ addonId })
        });
      }
    },
    onSuccess: (orderData) => {
      // Here you would integrate with Razorpay payment gateway
      handleRazorpayPayment(orderData);
    },
    onError: (error: any) => {
      toast({
        title: "Payment Failed",
        description: error.message || "Failed to create payment order",
        variant: "destructive"
      });
    }
  });

  const handleRazorpayPayment = (orderData: any) => {
    // This would normally load Razorpay SDK and process payment
    toast({
      title: "Payment Gateway",
      description: "Razorpay integration ready. Order created successfully.",
    });
    console.log('Order data for Razorpay:', orderData);
  };

  const handlePlanSelect = (planId: string) => {
    if (userSubscription?.plan === planId) {
      toast({
        title: "Already Subscribed",
        description: `You're already on the ${planId} plan.`,
      });
      return;
    }

    createOrderMutation.mutate({ 
      planId, 
      type: 'subscription' 
    });
  };

  const handleCreditPurchase = (packageId: string) => {
    createOrderMutation.mutate({ 
      packageId, 
      type: 'credits' 
    });
  };

  const handleAddonPurchase = (addonId: string) => {
    createOrderMutation.mutate({ 
      addonId, 
      type: 'addon' 
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <SpaceBackground />
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-xl">Loading pricing information...</p>
        </div>
      </div>
    );
  }

  const plans = pricingData?.plans || {};
  const creditPackages = pricingData?.creditPackages || [];
  const addons = pricingData?.addons || {};

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <SpaceBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Choose Your VeeFore Plan
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Unlock the full potential of AI-powered social media management with flexible pricing plans designed for creators and businesses.
          </p>
        </motion.div>

        {/* Current Subscription Status */}
        {userSubscription && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-500/30 mx-auto max-w-md">
              <CardContent className="pt-6 text-center">
                <Badge className="mb-2 bg-blue-500/20 text-blue-300">Current Plan</Badge>
                <h3 className="text-2xl font-bold text-white">{userSubscription.plan}</h3>
                <p className="text-gray-300">{userSubscription.credits} credits available</p>
                {userSubscription.currentPeriodEnd && (
                  <p className="text-sm text-gray-400 mt-2">
                    Renews on {new Date(userSubscription.currentPeriodEnd).toLocaleDateString()}
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Pricing Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-900/50 border border-gray-700">
            <TabsTrigger value="plans" className="data-[state=active]:bg-blue-600">
              Subscription Plans
            </TabsTrigger>
            <TabsTrigger value="credits" className="data-[state=active]:bg-purple-600">
              Credit Packages
            </TabsTrigger>
            <TabsTrigger value="addons" className="data-[state=active]:bg-cyan-600">
              Premium Add-ons
            </TabsTrigger>
          </TabsList>

          {/* Subscription Plans */}
          <TabsContent value="plans" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(plans).map(([key, plan]: [string, any]) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Object.keys(plans).indexOf(key) * 0.1 }}
                >
                  <Card className={`h-full relative overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${
                    plan.popular 
                      ? 'border-yellow-500 bg-gradient-to-b from-yellow-900/20 to-orange-900/20' 
                      : 'border-gray-700 bg-gray-900/50 hover:border-blue-500/50'
                  }`}>
                    {plan.popular && (
                      <div className="absolute top-0 right-0 bg-yellow-500 text-black px-3 py-1 text-sm font-bold">
                        Most Popular
                      </div>
                    )}
                    
                    <CardHeader className="text-center pb-4">
                      <div className="flex justify-center mb-4">
                        {plan.id === 'free' && <Sparkles className="h-12 w-12 text-gray-400" />}
                        {plan.id === 'creator' && <Star className="h-12 w-12 text-blue-400" />}
                        {plan.id === 'pro' && <Zap className="h-12 w-12 text-purple-400" />}
                        {plan.id === 'enterprise' && <Crown className="h-12 w-12 text-yellow-400" />}
                      </div>
                      <CardTitle className="text-2xl font-bold text-white">{plan.name}</CardTitle>
                      <CardDescription className="text-gray-300">
                        {plan.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="pb-4">
                      <div className="text-center mb-6">
                        <div className="text-4xl font-bold text-white">
                          {plan.price === 0 ? 'Free' : `₹${plan.price}`}
                        </div>
                        {plan.price > 0 && (
                          <div className="text-gray-400 text-sm">per month</div>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center text-sm">
                          <Check className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                          <span>{plan.credits} monthly credits</span>
                        </div>
                        {plan.features?.map((feature: string, index: number) => (
                          <div key={index} className="flex items-center text-sm">
                            <Check className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>

                    <CardFooter>
                      <Button
                        className={`w-full ${
                          userSubscription?.plan === plan.id
                            ? 'bg-gray-600 hover:bg-gray-600 cursor-not-allowed'
                            : plan.popular
                            ? 'bg-yellow-600 hover:bg-yellow-700'
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                        onClick={() => handlePlanSelect(plan.id)}
                        disabled={userSubscription?.plan === plan.id || createOrderMutation.isPending}
                      >
                        {userSubscription?.plan === plan.id 
                          ? 'Current Plan' 
                          : plan.price === 0 
                          ? 'Get Started' 
                          : 'Upgrade Now'
                        }
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
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
                  <Card className="h-full bg-gradient-to-b from-purple-900/20 to-pink-900/20 border-purple-500/30 hover:border-purple-400 transition-all duration-300 hover:scale-105">
                    <CardHeader className="text-center">
                      <Rocket className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                      <CardTitle className="text-xl font-bold text-white">{pkg.name}</CardTitle>
                      <CardDescription className="text-gray-300">
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
                        className="w-full bg-purple-600 hover:bg-purple-700"
                        onClick={() => handleCreditPurchase(pkg.id)}
                        disabled={createOrderMutation.isPending}
                      >
                        {createOrderMutation.isPending ? 'Processing...' : 'Buy Credits'}
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
                  <Card className="h-full bg-gradient-to-b from-cyan-900/20 to-blue-900/20 border-cyan-500/30 hover:border-cyan-400 transition-all duration-300 hover:scale-105">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl font-bold text-white">{addon.name}</CardTitle>
                          <CardDescription className="text-gray-300 mt-2">
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
                        className="w-full bg-cyan-600 hover:bg-cyan-700"
                        onClick={() => handleAddonPurchase(addon.id)}
                        disabled={createOrderMutation.isPending}
                      >
                        {createOrderMutation.isPending ? 'Processing...' : 'Add to Plan'}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <h2 className="text-3xl font-bold mb-8 text-white">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-2">What are credits?</h3>
                <p className="text-gray-300 text-sm">
                  Credits are used for AI features like content generation, image creation, and analytics. Each feature has a different credit cost.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-900/50 border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-2">Can I change plans anytime?</h3>
                <p className="text-gray-300 text-sm">
                  Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}