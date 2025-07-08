import { useState } from 'react';
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
      price: number;
      type: string;
      interval: string;
    };
  };
}

interface CreditTransaction {
  id: string;
  amount: number;
  description: string;
  type: string;
  createdAt: string;
}

export default function SubscriptionNew() {
  const { toast } = useToast();
  const [isYearly, setIsYearly] = useState(false);

  // Fetch subscription data
  const { data: subscriptionData, isLoading: subscriptionLoading } = useQuery({
    queryKey: ['/api/subscription'],
    refetchInterval: 30000,
  });

  // Fetch available plans
  const { data: planData, isLoading: planLoading } = useQuery({
    queryKey: ['/api/subscription/plans'],
    refetchInterval: 30000,
  });

  // Fetch credit transaction history
  const { data: creditHistory, isLoading: creditLoading } = useQuery({
    queryKey: ['/api/credit-transactions'],
    refetchInterval: 30000,
  });

  // Create Razorpay order mutation
  const createOrderMutation = useMutation({
    mutationFn: async ({ planId, interval }: { planId: string; interval: string }) => {
      return await apiRequest('POST', '/api/subscription/create-order', { planId, interval });
    },
    onError: (error: any) => {
      toast({
        title: 'Payment Failed',
        description: error.message || 'Failed to create payment order.',
        variant: 'destructive',
      });
    },
  });

  // Upgrade subscription mutation (after payment)
  const upgradeMutation = useMutation({
    mutationFn: async (paymentData: { planId: string; paymentId: string; orderId: string; signature: string }) => {
      return await apiRequest('POST', '/api/subscription/upgrade', paymentData);
    },
    onSuccess: () => {
      toast({
        title: 'Subscription Upgraded',
        description: 'Your subscription has been upgraded successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/subscription'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Upgrade Failed',
        description: error.message || 'Failed to upgrade subscription.',
        variant: 'destructive',
      });
    },
  });

  // Purchase credits mutation
  const purchaseCreditsMutation = useMutation({
    mutationFn: async (packageId: string) => {
      return await apiRequest('POST', '/api/subscription/purchase-credits', { packageId });
    },
    onSuccess: () => {
      toast({
        title: 'Credits Purchased',
        description: 'Your credits have been added successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/subscription'] });
      queryClient.invalidateQueries({ queryKey: ['/api/credit-transactions'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Purchase Failed',
        description: error.message || 'Failed to purchase credits.',
        variant: 'destructive',
      });
    },
  });

  if (subscriptionLoading || planLoading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="text-white">Loading subscription data...</div>
      </div>
    );
  }

  const isUpgrading = upgradeMutation.isPending;
  const isPurchasing = purchaseCreditsMutation.isPending;
  const isCreatingOrder = createOrderMutation.isPending;

  // Handle secure payment upgrade
  const handleUpgrade = async (planId: string) => {
    try {
      console.log('[UPGRADE] Starting upgrade process for plan:', planId);
      
      // Check if Razorpay is loaded
      if (!(window as any).Razorpay) {
        console.error('[UPGRADE] Razorpay library not loaded');
        toast({
          title: 'Payment Error',
          description: 'Payment system is not ready. Please refresh the page.',
          variant: 'destructive',
        });
        return;
      }
      
      // Create Razorpay order
      console.log('[UPGRADE] Creating Razorpay order...');
      const orderData = await createOrderMutation.mutateAsync({ planId, interval: 'month' });
      console.log('[UPGRADE] Order created:', orderData);
      
      // Initialize Razorpay payment
      const options = {
        key: orderData.key,
        amount: orderData.amount, // Backend already returns amount in paisa
        currency: orderData.currency,
        order_id: orderData.orderId,
        name: 'VeeFore',
        description: `Upgrade to ${orderData.planName} plan`,
        theme: {
          color: '#6366f1'
        },
        handler: async (response: any) => {
          try {
            console.log('[UPGRADE] Payment successful, verifying...');
            // Verify payment and upgrade subscription
            await upgradeMutation.mutateAsync({
              planId,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature
            });
            toast({
              title: 'Upgrade Successful',
              description: `Successfully upgraded to ${orderData.planName} plan!`,
              variant: 'default',
            });
          } catch (error) {
            console.error('[UPGRADE] Payment verification failed:', error);
            toast({
              title: 'Payment Verification Failed',
              description: 'Payment completed but verification failed. Please contact support.',
              variant: 'destructive',
            });
          }
        },
        prefill: {
          name: 'VeeFore User',
          email: 'user@example.com'
        },
        notes: {
          planId,
          planName: orderData.planName
        }
      };

      console.log('[UPGRADE] Razorpay options:', options);
      
      // Load and open Razorpay payment
      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', (response: any) => {
        console.error('[UPGRADE] Payment failed:', response);
        toast({
          title: 'Payment Failed',
          description: 'Your payment could not be processed. Please try again.',
          variant: 'destructive',
        });
      });
      
      console.log('[UPGRADE] Opening Razorpay payment dialog...');
      rzp.open();
      
    } catch (error) {
      console.error('[UPGRADE] Upgrade failed:', error);
      toast({
        title: 'Upgrade Failed',
        description: 'Unable to start payment process. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Plan configurations with yearly discounts
  const planConfigs = {
    free: { icon: Zap, gradient: 'from-gray-400 to-gray-600', yearlyDiscount: 0 },
    starter: { icon: Star, gradient: 'from-blue-400 to-blue-600', yearlyDiscount: 10 },
    pro: { icon: Crown, gradient: 'from-purple-400 to-purple-600', yearlyDiscount: 15 },
    business: { icon: Shield, gradient: 'from-amber-400 to-amber-600', yearlyDiscount: 20 }
  };

  const getPrice = (plan: any) => {
    if (plan.id === 'free') return 0;
    if (isYearly) {
      const discount = planConfigs[plan.id as keyof typeof planConfigs]?.yearlyDiscount || 0;
      return Math.round(plan.price * 12 * (1 - discount / 100));
    }
    return plan.price;
  };

  const getSavings = (plan: any) => {
    if (plan.id === 'free') return 0;
    const discount = planConfigs[plan.id as keyof typeof planConfigs]?.yearlyDiscount || 0;
    return Math.round(plan.price * 12 * (discount / 100));
  };

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-purple-900/10 to-black/20 backdrop-blur-sm" />
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full mb-6">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Choose Your <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">VeeFore</span> Plan
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Unlock the full potential of AI-powered content creation with our flexible subscription plans designed for creators, agencies, and businesses.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center mb-12">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-1">
            <div className="flex items-center space-x-4 px-4 py-2">
              <span className={`text-sm font-medium transition-colors ${!isYearly ? 'text-white' : 'text-gray-400'}`}>
                Monthly
              </span>
              <Switch
                checked={isYearly}
                onCheckedChange={setIsYearly}
                className="data-[state=checked]:bg-purple-600"
              />
              <span className={`text-sm font-medium transition-colors ${isYearly ? 'text-white' : 'text-gray-400'}`}>
                Yearly
              </span>
              <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs px-2 py-1">
                Save up to 20%
              </Badge>
            </div>
          </div>
        </div>

        {/* Current Status */}
        <div className="mb-12">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-2xl">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-xl">Current Plan</h3>
                    <p className="text-gray-300 text-lg capitalize">
                      {subscriptionData?.plan || 'Free'} • {formatNumber(subscriptionData?.credits || 0)} credits remaining
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="bg-gradient-to-r from-green-500 to-green-600 text-white text-sm px-4 py-2">
                    {subscriptionData?.status || 'Active'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subscription Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {planData?.plans && Object.values(planData.plans).map((plan: any) => {
            const config = planConfigs[plan.id as keyof typeof planConfigs];
            const Icon = config?.icon || Zap;
            const isCurrentPlan = subscriptionData?.plan === plan.id;
            const isPopular = plan.id === 'pro';
            const price = getPrice(plan);
            const savings = getSavings(plan);

            return (
              <Card
                key={plan.id}
                className={`relative bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-500 group shadow-2xl ${
                  isPopular ? 'ring-2 ring-purple-400 ring-opacity-50 scale-105' : ''
                } ${isCurrentPlan ? 'ring-2 ring-green-400 ring-opacity-50' : ''}`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 text-sm font-medium">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                {isCurrentPlan && (
                  <div className="absolute -top-4 right-4">
                    <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 text-xs">
                      Current
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${config?.gradient} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-white text-2xl font-bold mb-2">{plan.name}</CardTitle>
                  <div className="mb-4">
                    <div className="text-4xl font-bold text-white">
                      ₹{formatPrice(price)}
                      {plan.id !== 'free' && (
                        <span className="text-lg font-normal text-gray-300">
                          /{isYearly ? 'year' : 'month'}
                        </span>
                      )}
                    </div>
                    {isYearly && savings > 0 && (
                      <div className="text-sm text-green-400 mt-1">
                        Save ₹{formatPrice(savings)} per year
                      </div>
                    )}
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{plan.description}</p>
                </CardHeader>
                
                <CardContent className="flex-1 px-6 pb-6">
                  <div className="text-center mb-6">
                    <div className="text-2xl font-bold text-white">{formatPrice(plan.credits)}</div>
                    <div className="text-sm text-gray-300">Monthly Credits</div>
                  </div>
                  
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
                        ? 'bg-gray-600 hover:bg-gray-700 cursor-not-allowed'
                        : plan.id === 'free'
                        ? 'bg-gray-600 hover:bg-gray-700'
                        : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-lg hover:shadow-purple-500/25'
                    }`}
                  >
                    {isCurrentPlan ? (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Current Plan
                      </>
                    ) : (
                      <>
                        {isCreatingOrder ? (
                          <>Creating Payment...</>
                        ) : isUpgrading ? (
                          <>Processing...</>
                        ) : (
                          <>
                            {plan.id === 'free' ? 'Downgrade' : 'Upgrade Now'}
                            <ArrowRight className="w-5 h-5 ml-2" />
                          </>
                        )}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
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
                    {pack.savings && (
                      <Badge className="mt-2 bg-gradient-to-r from-green-500 to-green-600 text-white">
                        {pack.savings} Savings
                      </Badge>
                    )}
                  </div>
                  <Button
                    onClick={() => purchaseCreditsMutation.mutate(pack.id)}
                    disabled={isPurchasing}
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-medium"
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
                    <div key={index} className="flex items-center justify-between p-6 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                          <History className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-white font-medium text-lg">{transaction.type}</div>
                          <div className="text-gray-300 text-sm">{transaction.description}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-semibold text-lg ${transaction.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {transaction.amount > 0 ? '+' : ''}{formatNumber(transaction.amount)} credits
                        </div>
                        <div className="text-gray-300 text-sm">{transaction.date}</div>
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