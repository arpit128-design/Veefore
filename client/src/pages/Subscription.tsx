import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Crown, 
  Zap, 
  Shield, 
  Star, 
  Plus, 
  History, 
  CheckCircle, 
  ArrowRight, 
  AlertCircle, 
  Sparkles, 
  Infinity,
  CreditCard,
  Wallet,
  Receipt,
  TrendingUp,
  Calendar,
  Settings,
  Download,
  Filter,
  BarChart3,
  DollarSign,
  Package,
  Users,
  Clock,
  Gift,
  Target,
  Rocket,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { formatNumber } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

// Function to format prices and credits with commas instead of K/L abbreviations
const formatPrice = (value: number): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return "0";
  }
  return new Intl.NumberFormat('en-IN').format(value);
};

interface SubscriptionData {
  id: number;
  plan: string;
  status: string;
  credits: number;
  transactionCount?: number;
  lastUpdated?: string;
}

interface PlanData {
  plans: {
    [key: string]: {
      id: string;
      name: string;
      description: string;
      price: number | string;
      credits: number;
      features: string[];
      popular?: boolean;
    };
  };
  creditPackages: Array<{
    id: string;
    name: string;
    totalCredits: number;
    price: number;
    savings?: string;
  }>;
  addons: {
    [key: string]: {
      id: string;
      name: string;
      description: string;
      price: number;
      type: string;
    };
  };
}

// Declare Razorpay for TypeScript
declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Subscription() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isYearly, setIsYearly] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      try {
        const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
        if (existingScript && existingScript.parentNode) {
          existingScript.parentNode.removeChild(existingScript);
        }
      } catch (error) {
        console.log('Script cleanup error:', error);
      }
    };
  }, []);

  // Fetch subscription data
  const { data: subscription, isLoading: subscriptionLoading } = useQuery({
    queryKey: ['/api/subscription'],
    queryFn: () => apiRequest('GET', '/api/subscription').then(res => res.json()),
  });

  // Fetch plan data
  const { data: planData, isLoading: planLoading } = useQuery<PlanData>({
    queryKey: ['/api/subscription/plans'],
    queryFn: () => apiRequest('GET', '/api/subscription/plans').then(res => res.json()),
  });

  // Fetch credit history
  const { data: creditHistory, isLoading: creditLoading } = useQuery({
    queryKey: ['/api/credit-transactions'],
    queryFn: () => apiRequest('GET', '/api/credit-transactions').then(res => res.json()),
  });

  // Upgrade subscription mutation (after payment)
  const upgradeMutation = useMutation({
    mutationFn: async (paymentData: { planId: string; paymentId: string; orderId: string; signature: string }) => {
      const response = await apiRequest('POST', '/api/razorpay/verify-payment', {
        razorpay_order_id: paymentData.orderId,
        razorpay_payment_id: paymentData.paymentId,
        razorpay_signature: paymentData.signature,
        type: 'subscription',
        planId: paymentData.planId
      });
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Subscription Upgraded',
        description: 'Your subscription has been upgraded successfully.',
      });
      // Refresh all subscription-related data
      queryClient.invalidateQueries({ queryKey: ['/api/subscription'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      queryClient.invalidateQueries({ queryKey: ['/api/credit-transactions'] });
      
      // Refetch immediately to update UI
      queryClient.refetchQueries({ queryKey: ['/api/subscription'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Upgrade Failed',
        description: error.message || 'Failed to upgrade subscription.',
        variant: 'destructive',
      });
    },
  });

  // Credit purchase mutation (with Razorpay)
  const creditPurchaseMutation = useMutation({
    mutationFn: async (paymentData: { packageId: string; paymentId: string; orderId: string; signature: string }) => {
      const response = await apiRequest('POST', '/api/razorpay/verify-payment', {
        razorpay_order_id: paymentData.orderId,
        razorpay_payment_id: paymentData.paymentId,
        razorpay_signature: paymentData.signature,
        type: 'credits',
        packageId: paymentData.packageId
      });
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Credits Purchased',
        description: 'Your credits have been added successfully.',
      });
      // Refresh all subscription-related data
      queryClient.invalidateQueries({ queryKey: ['/api/subscription'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      queryClient.invalidateQueries({ queryKey: ['/api/credit-transactions'] });
      
      // Refetch immediately to update UI
      queryClient.refetchQueries({ queryKey: ['/api/subscription'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Purchase Failed',
        description: error.message || 'Failed to purchase credits.',
        variant: 'destructive',
      });
    },
  });

  // Handle subscription upgrade
  const handleUpgrade = async (planId: string) => {
    if (isUpgrading || isCreatingOrder) return;
    
    setIsUpgrading(true);
    setIsCreatingOrder(true);
    
    try {
      // Create Razorpay order
      const orderResponse = await apiRequest('POST', '/api/razorpay/create-subscription-order', {
        planId: planId
      });
      
      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.error || 'Failed to create order');
      }
      
      const orderData = await orderResponse.json();
      
      if (!orderData.orderId) {
        throw new Error('Failed to create order');
      }

      // Initialize Razorpay payment
      const options = {
        key: orderData.keyId, // Use key from backend
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'VeeFore',
        description: orderData.description || `${planId} Subscription`,
        order_id: orderData.orderId,
        handler: function (response: any) {
          upgradeMutation.mutate({
            planId: planId,
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature
          });
        },
        prefill: {
          name: user?.displayName || '',
          email: user?.email || '',
        },
        theme: {
          color: '#3b82f6'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      
    } catch (error: any) {
      toast({
        title: 'Order Creation Failed',
        description: error.message || 'Failed to create payment order.',
        variant: 'destructive',
      });
    } finally {
      setIsUpgrading(false);
      setIsCreatingOrder(false);
    }
  };

  // Handle credit purchase
  const handleCreditPurchase = async (packageId: string) => {
    try {
      const pkg = planData?.creditPackages.find(p => p.id === packageId);
      if (!pkg) {
        toast({
          title: "Error",
          description: "Package not found",
          variant: "destructive",
        });
        return;
      }

      // Create Razorpay order
      const orderResponse = await apiRequest('POST', '/api/razorpay/create-order', {
        packageId: packageId,
        type: 'credits'
      });

      const orderData = await orderResponse.json();
      
      if (!orderData.orderId) {
        throw new Error('Failed to create payment order');
      }

      // Initialize Razorpay payment
      const options = {
        key: orderData.keyId, // Use key from backend
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'VeeFore',
        description: orderData.description || `${pkg.name} Credits`,
        order_id: orderData.orderId,
        handler: function (response: any) {
          creditPurchaseMutation.mutate({
            packageId: packageId,
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature
          });
        },
        prefill: {
          name: user?.displayName || '',
          email: user?.email || '',
        },
        theme: {
          color: '#3b82f6'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      
    } catch (error: any) {
      toast({
        title: 'Payment Failed',
        description: error.message || 'Failed to process payment.',
        variant: 'destructive',
      });
    }
  };

  if (subscriptionLoading || planLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-6"
            />
            <div className="text-gray-700 text-xl font-medium">Loading billing data...</div>
          </div>
        </div>
      </div>
    );
  }

  const currentPlan = subscription?.plan || 'free';
  const currentCredits = subscription?.credits || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Modern Design */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              Billing & Subscription
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
            Manage your subscription, track usage, and unlock premium features with our flexible billing options
          </p>
        </motion.div>

        {/* Advanced Tabs Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-2 mb-8">
              <TabsTrigger 
                value="overview" 
                className="flex items-center gap-2 text-gray-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
              >
                <BarChart3 className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="plans" 
                className="flex items-center gap-2 text-gray-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
              >
                <Package className="w-4 h-4" />
                Plans
              </TabsTrigger>
              <TabsTrigger 
                value="usage" 
                className="flex items-center gap-2 text-gray-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
              >
                <TrendingUp className="w-4 h-4" />
                Usage
              </TabsTrigger>
              <TabsTrigger 
                value="billing" 
                className="flex items-center gap-2 text-gray-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
              >
                <Receipt className="w-4 h-4" />
                Billing
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              {/* Current Plan Status Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                          <Crown className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold mb-2">Current Plan</h2>
                          <div className="flex items-center gap-3">
                            <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 text-lg px-4 py-2 rounded-full">
                              {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)} Plan
                            </Badge>
                            <div className="text-white/90 font-medium">
                              {formatPrice(currentCredits)} credits available
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-4xl font-bold mb-1">
                          ₹{formatPrice(planData?.plans[currentPlan]?.price || 0)}
                        </div>
                        <div className="text-white/90">per month</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Usage Metrics */}
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
                        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                          <Zap className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">{formatPrice(currentCredits)}</div>
                        <div className="text-gray-600 text-sm">Credits Remaining</div>
                        <Progress value={75} className="mt-3 h-2" />
                      </div>
                      
                      <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
                        <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                          <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">23</div>
                        <div className="text-gray-600 text-sm">Days Remaining</div>
                        <Progress value={65} className="mt-3 h-2" />
                      </div>
                      
                      <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
                        <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                          <Target className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">47</div>
                        <div className="text-gray-600 text-sm">AI Generations Used</div>
                        <Progress value={35} className="mt-3 h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Rocket className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">Upgrade Plan</h3>
                    <p className="text-gray-600 text-sm">Get more features and credits</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Plus className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">Buy Credits</h3>
                    <p className="text-gray-600 text-sm">Purchase additional credits</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Download className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">Download Invoice</h3>
                    <p className="text-gray-600 text-sm">Get your billing statements</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Settings className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">Billing Settings</h3>
                    <p className="text-gray-600 text-sm">Manage payment methods</p>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Plans Tab */}
            <TabsContent value="plans" className="space-y-8">
              {/* Billing Toggle */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex items-center justify-center mb-8"
              >
                <div className="flex items-center gap-4 bg-white/80 backdrop-blur-sm rounded-full p-2 border border-gray-200">
                  <span className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${!isYearly ? 'text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg' : 'text-gray-700'}`}>
                    Monthly
                  </span>
                  <Switch
                    checked={isYearly}
                    onCheckedChange={setIsYearly}
                    className="data-[state=checked]:bg-blue-500"
                  />
                  <span className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${isYearly ? 'text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg' : 'text-gray-700'}`}>
                    Annual
                    <Badge className="ml-2 bg-green-100 text-green-700 border-0">Save 25%</Badge>
                  </span>
                </div>
              </motion.div>

              {/* Modern Subscription Plans */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              >
                {planData?.plans && Object.values(planData.plans).map((plan: any, index) => {
                  const isCurrentPlan = currentPlan === plan.id;
                  const price = isYearly ? (plan.yearlyPrice || plan.price * 10) : plan.price;
                  
                  return (
                    <motion.div
                      key={plan.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 * index }}
                    >
                      <Card className={`relative bg-white/95 backdrop-blur-sm border-0 shadow-xl rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 group ${
                        plan.popular ? 'ring-2 ring-blue-500 ring-offset-4 ring-offset-gray-50' : ''
                      } ${isCurrentPlan ? 'ring-2 ring-green-500 ring-offset-4 ring-offset-gray-50' : ''}`}>
                        {plan.popular && (
                          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                            <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold px-6 py-2 rounded-full shadow-lg">
                              Most Popular
                            </Badge>
                          </div>
                        )}
                        {isCurrentPlan && (
                          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                            <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold px-6 py-2 rounded-full shadow-lg">
                              Current Plan
                            </Badge>
                          </div>
                        )}
                        
                        <div className={`h-2 w-full ${
                          plan.id === 'free' ? 'bg-gradient-to-r from-gray-400 to-gray-600' :
                          plan.id === 'starter' ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                          plan.id === 'pro' ? 'bg-gradient-to-r from-purple-400 to-purple-600' :
                          'bg-gradient-to-r from-yellow-400 to-yellow-600'
                        }`} />
                        
                        <CardHeader className="text-center p-8">
                          <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 ${
                            plan.id === 'free' ? 'bg-gradient-to-br from-gray-100 to-gray-200' :
                            plan.id === 'starter' ? 'bg-gradient-to-br from-blue-100 to-blue-200' :
                            plan.id === 'pro' ? 'bg-gradient-to-br from-purple-100 to-purple-200' :
                            'bg-gradient-to-br from-yellow-100 to-yellow-200'
                          }`}>
                            {plan.id === 'free' ? <Shield className={`w-10 h-10 text-gray-600`} /> :
                             plan.id === 'starter' ? <Star className={`w-10 h-10 text-blue-600`} /> :
                             plan.id === 'pro' ? <Zap className={`w-10 h-10 text-purple-600`} /> :
                             <Crown className={`w-10 h-10 text-yellow-600`} />}
                          </div>
                          <CardTitle className="text-gray-900 text-2xl font-bold mb-2">{plan.name}</CardTitle>
                          <p className="text-gray-600 text-sm mb-6">{plan.description}</p>
                          <div className="space-y-2">
                            <div className="text-5xl font-bold text-gray-900">
                              {plan.id === 'free' ? 'Free' : `₹${formatPrice(price)}`}
                            </div>
                            {plan.id !== 'free' && (
                              <div className="text-gray-600 text-sm">
                                {isYearly ? 'per year' : 'per month'}
                              </div>
                            )}
                            <div className="text-blue-600 font-semibold">
                              {formatPrice(plan.credits)} Monthly Credits
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="px-8 pb-8">
                          <ul className="space-y-4 mb-8">
                            {plan.features?.slice(0, 6).map((feature: string, index: number) => (
                              <li key={index} className="flex items-start text-gray-700">
                                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{feature}</span>
                              </li>
                            ))}
                            {plan.features?.length > 6 && (
                              <li className="flex items-center text-gray-500">
                                <Plus className="w-5 h-5 mr-3" />
                                <span className="text-sm">+{plan.features.length - 6} more features</span>
                              </li>
                            )}
                          </ul>
                          
                          <Button
                            onClick={() => plan.id === 'free' ? null : handleUpgrade(plan.id)}
                            disabled={isUpgrading || isCreatingOrder || isCurrentPlan || plan.id === 'free'}
                            className={`w-full h-14 text-lg font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                              isCurrentPlan
                                ? 'bg-green-500 hover:bg-green-600 text-white cursor-not-allowed'
                                : plan.id === 'free'
                                ? 'bg-gray-200 hover:bg-gray-300 text-gray-600 cursor-not-allowed'
                                : plan.popular
                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg'
                                : 'bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white'
                            }`}
                          >
                            {isCurrentPlan ? 'Current Plan' : 
                             plan.id === 'free' ? 'Free Forever' :
                             isUpgrading ? 'Processing...' : 'Get Started'}
                            {!isCurrentPlan && plan.id !== 'free' && (
                              <ArrowRight className="w-5 h-5 ml-2" />
                            )}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Credit Add-ons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-16"
              >
                <div className="text-center mb-12">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">Need Extra Credits?</h3>
                  <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                    Purchase additional credits to boost your content creation without upgrading your plan
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {planData?.creditPackages?.map((pack: any, index) => (
                    <motion.div
                      key={pack.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                    >
                      <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 group cursor-pointer">
                        <CardHeader className="text-center p-6">
                          <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                            <Gift className="w-8 h-8 text-white" />
                          </div>
                          <CardTitle className="text-gray-900 text-xl font-bold">{pack.name}</CardTitle>
                          <div className="text-3xl font-bold text-gray-900 mt-2">
                            ₹{formatPrice(pack.price)}
                          </div>
                          <div className="text-orange-600 font-semibold">
                            {formatPrice(pack.totalCredits)} Credits
                          </div>
                        </CardHeader>
                        <CardContent className="px-6 pb-6">
                          <Button
                            onClick={() => handleCreditPurchase(pack.id)}
                            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold h-12 rounded-xl transition-all duration-300 transform hover:scale-105"
                          >
                            Purchase Now
                            <Plus className="w-4 h-4 ml-2" />
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </TabsContent>

            {/* Usage Tab */}
            <TabsContent value="usage" className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Zap className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">Credits Usage</h3>
                        <p className="text-gray-600 text-sm">This month</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Used</span>
                        <span className="font-semibold text-gray-900">47</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Remaining</span>
                        <span className="font-semibold text-gray-900">{formatPrice(currentCredits)}</span>
                      </div>
                      <Progress value={35} className="h-3" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">Billing Cycle</h3>
                        <p className="text-gray-600 text-sm">Next renewal</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="text-2xl font-bold text-gray-900">23 days</div>
                      <div className="text-gray-600 text-sm">Until next billing</div>
                      <Progress value={65} className="h-3" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <Award className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">AI Generations</h3>
                        <p className="text-gray-600 text-sm">This month</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="text-2xl font-bold text-gray-900">47</div>
                      <div className="text-gray-600 text-sm">AI tools used</div>
                      <Progress value={35} className="h-3" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Billing Tab */}
            <TabsContent value="billing" className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
                  <CardHeader className="border-b border-gray-100 p-6">
                    <CardTitle className="flex items-center gap-3 text-gray-900 text-xl">
                      <Receipt className="w-6 h-6" />
                      Transaction History
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {creditLoading ? (
                      <div className="text-center py-12">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
                        />
                        <div className="text-gray-600">Loading transaction history...</div>
                      </div>
                    ) : creditHistory?.length === 0 ? (
                      <div className="text-center py-12">
                        <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <div className="text-gray-700 text-lg font-medium">No transactions yet</div>
                        <p className="text-gray-500 text-sm mt-2">Your billing history will appear here</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {creditHistory?.map((transaction: any, index: number) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 * index }}
                            className="flex items-center justify-between p-6 bg-gray-50 rounded-xl border hover:shadow-md transition-all duration-200"
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                transaction.type === 'credit_purchase' ? 'bg-orange-100' :
                                transaction.type === 'subscription' ? 'bg-purple-100' :
                                'bg-blue-100'
                              }`}>
                                {transaction.type === 'credit_purchase' ? <Plus className="w-6 h-6 text-orange-600" /> :
                                 transaction.type === 'subscription' ? <Crown className="w-6 h-6 text-purple-600" /> :
                                 <Zap className="w-6 h-6 text-blue-600" />}
                              </div>
                              <div>
                                <div className="text-gray-900 font-semibold">{transaction.description}</div>
                                <div className="text-gray-500 text-sm">{new Date(transaction.createdAt).toLocaleDateString()}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`text-xl font-bold ${
                                transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {transaction.amount > 0 ? '+' : ''}₹{formatPrice(transaction.amount)}
                              </div>
                              <div className="text-gray-500 text-sm capitalize">{transaction.type}</div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}