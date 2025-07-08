import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Crown, Zap, Shield, Star, Plus, History, CheckCircle, ArrowRight, AlertCircle, Sparkles, Infinity } from 'lucide-react';

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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <div className="text-white text-lg">Loading subscription data...</div>
          </div>
        </div>
      </div>
    );
  }

  const currentPlan = subscription?.plan || 'free';
  const currentCredits = subscription?.credits || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">VeeFore</span> Plan
          </h1>
          <p className="text-gray-300 text-xl max-w-3xl mx-auto">
            Unlock powerful AI-driven content creation tools with flexible plans designed for creators of all sizes
          </p>
        </div>

        {/* Current Plan Status */}
        <div className="mb-12">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-2xl">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Current Plan</h2>
                  <div className="flex items-center gap-4">
                    <Badge className="bg-purple-500/20 text-purple-200 text-lg px-4 py-2">
                      {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)} Plan
                    </Badge>
                    <div className="text-gray-300">
                      {formatPrice(currentCredits)} credits available
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white mb-1">
                    ₹{formatPrice(planData?.plans[currentPlan]?.price || 0)}/month
                  </div>
                  <div className="text-sm text-gray-300">Credits remaining</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-full p-2 border border-white/20">
            <span className={`px-4 py-2 rounded-full transition-all duration-300 ${!isYearly ? 'text-white bg-purple-500' : 'text-gray-300'}`}>
              Monthly
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-purple-500"
            />
            <span className={`px-4 py-2 rounded-full transition-all duration-300 ${isYearly ? 'text-white bg-purple-500' : 'text-gray-300'}`}>
              Yearly
              <Badge className="ml-2 bg-green-500/20 text-green-200">Save 20%</Badge>
            </span>
          </div>
        </div>

        {/* Subscription Plans */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Subscription Plans</h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Choose the perfect plan for your content creation needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {planData?.plans && Object.values(planData.plans).map((plan: any) => {
              const isCurrentPlan = currentPlan === plan.id;
              const price = isYearly ? (plan.yearlyPrice || plan.price * 10) : plan.price;
              
              return (
                <Card key={plan.id} className={`relative bg-white/10 backdrop-blur-sm border transition-all duration-300 hover:scale-105 ${
                  plan.popular 
                    ? 'border-purple-400 shadow-lg shadow-purple-400/20' 
                    : isCurrentPlan 
                    ? 'border-green-400 shadow-lg shadow-green-400/20'
                    : 'border-white/20 hover:border-purple-300/50'
                }`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-purple-500 text-white font-semibold">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  {isCurrentPlan && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-green-500 text-white font-semibold">
                        Current Plan
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                      plan.id === 'free' ? 'bg-gradient-to-br from-gray-400 to-gray-600' :
                      plan.id === 'starter' ? 'bg-gradient-to-br from-blue-400 to-blue-600' :
                      plan.id === 'pro' ? 'bg-gradient-to-br from-purple-400 to-purple-600' :
                      'bg-gradient-to-br from-yellow-400 to-yellow-600'
                    }`}>
                      {plan.id === 'free' ? <Shield className="w-8 h-8 text-white" /> :
                       plan.id === 'starter' ? <Star className="w-8 h-8 text-white" /> :
                       plan.id === 'pro' ? <Zap className="w-8 h-8 text-white" /> :
                       <Crown className="w-8 h-8 text-white" />}
                    </div>
                    <CardTitle className="text-white text-2xl">{plan.name}</CardTitle>
                    <p className="text-gray-300 text-sm">{plan.description}</p>
                    <div className="text-4xl font-bold text-white">
                      ₹{formatPrice(price)}
                    </div>
                    <div className="text-sm text-gray-300">
                      {isYearly ? 'per year' : 'per month'}
                    </div>
                    <div className="text-sm text-gray-300">
                      {formatPrice(plan.credits)} Monthly Credits
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-8">
                      {plan.features?.slice(0, 6).map((feature: string, index: number) => (
                        <li key={index} className="flex items-start text-gray-300 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                      {plan.features?.length > 6 && (
                        <li className="flex items-center text-gray-400 text-sm">
                          <Plus className="w-4 h-4 mr-3" />
                          <span>+{plan.features.length - 6} more features</span>
                        </li>
                      )}
                    </ul>
                    
                    <Button
                      onClick={() => plan.id === 'free' ? null : handleUpgrade(plan.id)}
                      disabled={isUpgrading || isCreatingOrder || isCurrentPlan || plan.id === 'free'}
                      className={`w-full h-12 text-base font-medium transition-all duration-300 ${
                        isCurrentPlan
                          ? 'bg-green-600 hover:bg-green-700 cursor-not-allowed'
                          : plan.id === 'free'
                          ? 'bg-gray-600 hover:bg-gray-700 cursor-not-allowed'
                          : plan.popular
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                          : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                      }`}
                    >
                      {isCurrentPlan ? 'Current Plan' : 
                       plan.id === 'free' ? 'Free Plan' :
                       isUpgrading ? 'Processing...' : 'Upgrade Now'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Credit Packages */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Need More Credits?</h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Purchase additional credits to supercharge your content creation without changing your plan
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {planData?.creditPackages?.map((pack: any) => (
              <Card key={pack.id} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 group">
                <CardHeader className="text-center pb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white text-xl">{pack.name}</CardTitle>
                  <div className="text-3xl font-bold text-white">
                    ₹{formatPrice(pack.price)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className="text-2xl font-bold text-white">{formatPrice(pack.totalCredits)}</div>
                    <div className="text-sm text-gray-300">Total Credits</div>
                  </div>
                  
                  <Button
                    onClick={() => handleCreditPurchase(pack.id)}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold h-12 transition-all duration-300"
                  >
                    Purchase Credits
                    <Plus className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Transaction History */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Transaction History</h2>
            <p className="text-gray-300 text-lg">
              Track your subscription changes and credit purchases
            </p>
          </div>
          
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-2xl">
            <CardContent className="p-8">
              {creditLoading ? (
                <div className="text-center py-12">
                  <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <div className="text-gray-300">Loading transaction history...</div>
                </div>
              ) : creditHistory?.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <div className="text-gray-300 text-lg">No transactions yet</div>
                  <p className="text-gray-400 text-sm mt-2">Your subscription and credit purchase history will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {creditHistory?.map((transaction: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-6 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors duration-200">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === 'credit_purchase' ? 'bg-yellow-500/20' :
                          transaction.type === 'subscription' ? 'bg-purple-500/20' :
                          'bg-blue-500/20'
                        }`}>
                          {transaction.type === 'credit_purchase' ? <Plus className="w-5 h-5 text-yellow-400" /> :
                           transaction.type === 'subscription' ? <Crown className="w-5 h-5 text-purple-400" /> :
                           <Zap className="w-5 h-5 text-blue-400" />}
                        </div>
                        <div>
                          <div className="text-white font-medium">{transaction.description}</div>
                          <div className="text-gray-400 text-sm">{new Date(transaction.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-medium ${
                          transaction.amount > 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {transaction.amount > 0 ? '+' : ''}{formatPrice(transaction.amount)}
                        </div>
                        <div className="text-gray-400 text-sm capitalize">{transaction.type}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}