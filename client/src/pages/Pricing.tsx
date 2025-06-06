import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SpaceBackground } from '@/components/ui/space-background';
import { Check, Star, Zap, Crown, Rocket, Sparkles, Coins, Plus } from 'lucide-react';
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
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-60"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              scale: 0 
            }}
            animate={{ 
              y: [null, -100, null],
              scale: [0, 1, 0],
              opacity: [0, 0.8, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Cosmic Rings */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 border border-purple-500/20 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 border border-cyan-500/20 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header with 3D Effect */}
        <motion.div
          initial={{ opacity: 0, y: 50, rotateX: -20 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center mb-16 perspective-1000"
        >
          <motion.h1 
            className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              textShadow: '0 0 30px rgba(59, 130, 246, 0.5), 0 0 60px rgba(147, 51, 234, 0.3)',
              filter: 'drop-shadow(0 4px 20px rgba(59, 130, 246, 0.4))'
            }}
          >
            Choose Your VeeFore Plan
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="relative"
          >
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Unlock the full potential of AI-powered social media management with flexible pricing plans designed for creators and businesses.
            </p>
            <motion.div
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent"
              initial={{ width: 0 }}
              animate={{ width: 96 }}
              transition={{ delay: 1, duration: 0.8 }}
            />
          </motion.div>
        </motion.div>

        {/* Current Subscription Status with 3D Effect */}
        {userSubscription && (
          <motion.div
            initial={{ opacity: 0, y: 50, rotateX: -15 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-12 perspective-1000"
          >
            <motion.div
              whileHover={{ scale: 1.05, rotateY: 5 }}
              transition={{ duration: 0.3 }}
              className="relative mx-auto max-w-md"
            >
              <Card className="relative bg-gradient-to-br from-blue-900/30 via-purple-900/30 to-cyan-900/30 border-2 border-blue-500/50 backdrop-blur-sm overflow-hidden group">
                {/* Holographic Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 animate-pulse" />
                
                {/* Glowing Border Animation */}
                <motion.div
                  className="absolute inset-0 border-2 border-blue-400/30 rounded-lg"
                  animate={{ 
                    boxShadow: [
                      '0 0 20px rgba(59, 130, 246, 0.3)',
                      '0 0 40px rgba(59, 130, 246, 0.6)',
                      '0 0 20px rgba(59, 130, 246, 0.3)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                
                <CardContent className="pt-8 pb-6 text-center relative z-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                  >
                    <Badge className="mb-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-400/30 px-4 py-1">
                      Current Plan
                    </Badge>
                  </motion.div>
                  <motion.h3 
                    className="text-3xl font-bold text-white mb-2"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {userSubscription.plan}
                  </motion.h3>
                  <motion.p 
                    className="text-lg text-gray-300 mb-3"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {userSubscription.credits} credits available
                  </motion.p>
                  {userSubscription.currentPeriodEnd && (
                    <motion.p 
                      className="text-sm text-gray-400"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      Renews on {new Date(userSubscription.currentPeriodEnd).toLocaleDateString()}
                    </motion.p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}

        {/* Enhanced Pricing Tabs with 3D Effects */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-gray-900/80 via-gray-800/80 to-gray-900/80 border-2 border-gray-600/50 backdrop-blur-md rounded-xl p-2">
              <TabsTrigger 
                value="plans" 
                className="relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-500 data-[state=active]:text-white transition-all duration-300 rounded-lg hover:bg-blue-600/20"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2"
                >
                  <Rocket className="w-4 h-4" />
                  Subscription Plans
                </motion.div>
              </TabsTrigger>
              <TabsTrigger 
                value="credits" 
                className="relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-500 data-[state=active]:text-white transition-all duration-300 rounded-lg hover:bg-purple-600/20"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2"
                >
                  <Coins className="w-4 h-4" />
                  Credit Packages
                </motion.div>
              </TabsTrigger>
              <TabsTrigger 
                value="addons" 
                className="relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white transition-all duration-300 rounded-lg hover:bg-cyan-600/20"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Premium Add-ons
                </motion.div>
              </TabsTrigger>
            </TabsList>
          </motion.div>

          {/* Enhanced Subscription Plans with 3D Effects */}
          <TabsContent value="plans" className="mt-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {Object.entries(plans).map(([key, plan]: [string, any]) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 50, rotateX: -20 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ 
                    delay: Object.keys(plans).indexOf(key) * 0.15,
                    duration: 0.8,
                    ease: "easeOut"
                  }}
                  className="perspective-1000"
                >
                  <motion.div
                    whileHover={{ 
                      scale: 1.05, 
                      rotateY: 5,
                      transition: { duration: 0.3 }
                    }}
                    className="relative h-full"
                  >
                    <Card className={`h-full relative overflow-hidden border-2 backdrop-blur-md transition-all duration-500 group ${
                      plan.popular 
                        ? 'border-yellow-400/60 bg-gradient-to-br from-yellow-900/30 via-orange-900/20 to-red-900/30' 
                        : plan.id === 'free'
                          ? 'border-gray-600/50 bg-gradient-to-br from-gray-900/40 via-gray-800/30 to-gray-900/40 hover:border-blue-400/60'
                          : plan.id === 'creator'
                            ? 'border-blue-500/50 bg-gradient-to-br from-blue-900/30 via-purple-900/20 to-blue-900/30 hover:border-blue-400/80'
                            : plan.id === 'pro'
                              ? 'border-purple-500/50 bg-gradient-to-br from-purple-900/30 via-pink-900/20 to-purple-900/30 hover:border-purple-400/80'
                              : 'border-cyan-500/50 bg-gradient-to-br from-cyan-900/30 via-blue-900/20 to-cyan-900/30 hover:border-cyan-400/80'
                    }`}>
                      
                      {/* Holographic Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -skew-x-12 group-hover:animate-pulse" />
                      
                      {/* Animated Border Glow */}
                      <motion.div
                        className={`absolute inset-0 rounded-lg ${
                          plan.popular ? 'border-2 border-yellow-400/40' :
                          plan.id === 'creator' ? 'border-2 border-blue-400/40' :
                          plan.id === 'pro' ? 'border-2 border-purple-400/40' :
                          plan.id === 'enterprise' ? 'border-2 border-cyan-400/40' :
                          'border-2 border-gray-400/40'
                        }`}
                        animate={{ 
                          boxShadow: plan.popular ? [
                            '0 0 20px rgba(251, 191, 36, 0.3)',
                            '0 0 40px rgba(251, 191, 36, 0.6)',
                            '0 0 20px rgba(251, 191, 36, 0.3)'
                          ] : [
                            '0 0 20px rgba(59, 130, 246, 0.2)',
                            '0 0 30px rgba(59, 130, 246, 0.4)',
                            '0 0 20px rgba(59, 130, 246, 0.2)'
                          ]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />

                      {/* Popular Badge with 3D Effect */}
                      {plan.popular && (
                        <motion.div 
                          className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20"
                          initial={{ scale: 0, rotate: -10 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 0.5, type: "spring", bounce: 0.5 }}
                        >
                          <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-black px-6 py-2 text-sm font-bold rounded-full shadow-lg border-2 border-yellow-300">
                            <span className="flex items-center gap-1">
                              <Crown className="w-4 h-4" />
                              Most Popular
                            </span>
                          </div>
                        </motion.div>
                      )}
                      
                      <CardHeader className="text-center pb-6 pt-8 relative z-10">
                        {/* 3D Icon with Floating Animation */}
                        <motion.div 
                          className="flex justify-center mb-6"
                          animate={{ 
                            y: [0, -10, 0],
                            rotateY: [0, 360]
                          }}
                          transition={{ 
                            y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                            rotateY: { duration: 8, repeat: Infinity, ease: "linear" }
                          }}
                        >
                          <div className="relative">
                            {plan.id === 'free' && (
                              <Sparkles className="h-16 w-16 text-gray-400 drop-shadow-lg" 
                                style={{ filter: 'drop-shadow(0 0 10px rgba(156, 163, 175, 0.5))' }} />
                            )}
                            {plan.id === 'creator' && (
                              <Star className="h-16 w-16 text-blue-400 drop-shadow-lg" 
                                style={{ filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.5))' }} />
                            )}
                            {plan.id === 'pro' && (
                              <Zap className="h-16 w-16 text-purple-400 drop-shadow-lg" 
                                style={{ filter: 'drop-shadow(0 0 10px rgba(147, 51, 234, 0.5))' }} />
                            )}
                            {plan.id === 'enterprise' && (
                              <Crown className="h-16 w-16 text-yellow-400 drop-shadow-lg" 
                                style={{ filter: 'drop-shadow(0 0 10px rgba(251, 191, 36, 0.5))' }} />
                            )}
                            
                            {/* Orbital Ring */}
                            <motion.div
                              className="absolute inset-0 border-2 border-current opacity-20 rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                              style={{ width: '120%', height: '120%', top: '-10%', left: '-10%' }}
                            />
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <CardTitle className="text-3xl font-bold text-white mb-3 tracking-wide">
                            {plan.name}
                          </CardTitle>
                          <CardDescription className="text-gray-300 text-base leading-relaxed">
                            {plan.description}
                          </CardDescription>
                        </motion.div>
                      </CardHeader>

                      <CardContent className="pb-6 relative z-10">
                        {/* 3D Pricing Display */}
                        <motion.div 
                          className="text-center mb-8"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.4 }}
                        >
                          <div className="relative">
                            <div className={`text-5xl font-bold mb-2 ${
                              plan.popular ? 'text-yellow-400' : 'text-white'
                            }`}
                              style={{
                                textShadow: plan.popular ? 
                                  '0 0 20px rgba(251, 191, 36, 0.6)' : 
                                  '0 0 20px rgba(255, 255, 255, 0.3)'
                              }}
                            >
                              {plan.price === 0 ? 'Free' : `₹${plan.price}`}
                            </div>
                            {plan.price > 0 && (
                              <div className="text-gray-400 text-sm font-medium">per month</div>
                            )}
                          </div>
                        </motion.div>

                        {/* Features List with Animations */}
                        <motion.div 
                          className="space-y-4 mb-8"
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
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                                <Check className="h-3 w-3 text-green-400" />
                              </div>
                              <span className="text-gray-300">{plan.credits} monthly credits</span>
                            </div>
                          </motion.div>
                          {plan.features?.map((feature: string, index: number) => (
                            <motion.div 
                              key={index} 
                              className="flex items-center text-sm"
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.8 + index * 0.1 }}
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                                  <Check className="h-3 w-3 text-green-400" />
                                </div>
                                <span className="text-gray-300">{feature}</span>
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      </CardContent>

                      {/* Enhanced 3D Action Button */}
                      <CardFooter className="pt-0">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full"
                        >
                          <Button
                            className={`w-full py-3 px-6 rounded-xl font-semibold text-base transition-all duration-300 ${
                              userSubscription?.plan === plan.id
                                ? 'bg-gray-600 hover:bg-gray-600 cursor-not-allowed'
                                : plan.popular
                                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 shadow-lg hover:shadow-yellow-500/25'
                                : plan.id === 'creator'
                                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 shadow-lg hover:shadow-blue-500/25'
                                  : plan.id === 'pro'
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 shadow-lg hover:shadow-purple-500/25'
                                    : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 shadow-lg hover:shadow-cyan-500/25'
                            }`}
                            onClick={() => handlePlanSelect(plan.id)}
                            disabled={userSubscription?.plan === plan.id || createOrderMutation.isPending}
                          >
                            <span className="flex items-center justify-center gap-2">
                              {userSubscription?.plan === plan.id 
                                ? 'Current Plan' 
                                : plan.price === 0 
                                ? 'Get Started' 
                                : 'Upgrade Now'
                              }
                              {userSubscription?.plan !== plan.id && plan.price > 0 && (
                                <Rocket className="w-4 h-4" />
                              )}
                            </span>
                          </Button>
                        </motion.div>
                      </CardFooter>
                    </Card>
                  </motion.div>
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