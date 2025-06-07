import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { formatNumber } from '@/lib/utils';
import { 
  Crown, 
  CreditCard, 
  Calendar, 
  TrendingUp, 
  Zap, 
  Shield, 
  Star,
  Plus,
  Gift,
  History,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface UserSubscription {
  id?: string;
  plan: string;
  status: string;
  credits?: number;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  priceId?: string;
  subscriptionId?: string;
  canceledAt?: string;
  trialEnd?: string;
}

interface CreditTransaction {
  id: string;
  amount: number;
  purpose: string;
  status: string;
  createdAt: string;
  metadata?: any;
}

interface PricingData {
  plans: Record<string, any>;
  creditPackages: Array<{
    id: string;
    name: string;
    baseCredits: number;
    bonusCredits: number;
    totalCredits: number;
    price: number;
    popular?: boolean;
  }>;
  addons: Record<string, any>;
}

export default function Subscription() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch user subscription
  const { data: subscription, isLoading: subscriptionLoading } = useQuery({
    queryKey: ['/api/subscription'],
    queryFn: () => apiRequest('GET', '/api/subscription').then(res => res.json()),
  });

  // Fetch pricing data from correct endpoint
  const { data: pricingData, isLoading: pricingLoading } = useQuery<PricingData>({
    queryKey: ['/api/subscription/plans'],
    queryFn: () => apiRequest('GET', '/api/subscription/plans').then(res => res.json()),
  });

  // Fetch credit transactions with enhanced authentication
  const { data: creditTransactions, isLoading: transactionsLoading, error: transactionsError } = useQuery<CreditTransaction[]>({
    queryKey: ['/api/credit-transactions'],
    queryFn: async () => {
      try {
        // Get fresh Firebase token
        const { auth } = await import('../lib/firebase');
        let token = localStorage.getItem('veefore_auth_token');
        
        if (auth?.currentUser) {
          const freshToken = await auth.currentUser.getIdToken(true);
          if (freshToken && freshToken.split('.').length === 3) {
            localStorage.setItem('veefore_auth_token', freshToken);
            token = freshToken;
          }
        }
        
        const response = await fetch('/api/credit-transactions', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch transactions: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('[CREDIT TRANSACTIONS] Successfully loaded:', data.length, 'transactions');
        return data;
      } catch (error) {
        console.error('[CREDIT TRANSACTIONS] Error:', error);
        throw error;
      }
    },
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 60000,
  });

  const userSubscription = subscription as UserSubscription;
  const currentPlan = userSubscription?.plan || 'free';
  const [addonPurchasing, setAddonPurchasing] = useState(false);

  // Handle add-on purchase
  const handleAddonPurchase = async (addonId: string) => {
    if (addonPurchasing) return;
    
    setAddonPurchasing(true);
    
    try {
      // Create Razorpay order for addon
      const orderResponse = await apiRequest('POST', '/api/razorpay/create-addon-order', {
        addonId
      });
      const orderData = await orderResponse.json();
      
      if (!orderData.orderId) {
        throw new Error('Failed to create order');
      }

      // Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: orderData.amount * 100,
          currency: 'INR',
          name: 'VeeFore',
          description: `${orderData.addon.name} Purchase`,
          order_id: orderData.orderId,
          handler: async (response: any) => {
            try {
              // Verify payment on backend
              await apiRequest('POST', '/api/razorpay/verify-payment', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                type: 'addon',
                packageId: addonId
              });

              toast({
                title: "Add-on Purchased!",
                description: `${orderData.addon.name} has been added to your account.`,
              });

              // Refresh user data
              queryClient.invalidateQueries({ queryKey: ['/api/user'] });
              queryClient.invalidateQueries({ queryKey: ['/api/subscription'] });
              queryClient.invalidateQueries({ queryKey: ['/api/credit-transactions'] });
            } catch (error) {
              console.error('Payment verification failed:', error);
              toast({
                title: "Payment Verification Failed",
                description: "Please contact support if amount was deducted.",
                variant: "destructive",
              });
            }
          },
          modal: {
            ondismiss: () => {
              console.log('Payment modal dismissed');
            }
          },
          theme: {
            color: '#8B5CF6'
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      };
    } catch (error: any) {
      console.error('Add-on purchase error:', error);
      toast({
        title: "Purchase Failed",
        description: error.message || "Failed to initiate add-on purchase",
        variant: "destructive",
      });
    } finally {
      setAddonPurchasing(false);
    }
  };
  
  // Calculate credits from transactions as fallback if subscription API fails
  const calculatedCredits = creditTransactions?.reduce((total, transaction) => {
    return total + transaction.amount;
  }, 0) || 0;
  
  // Force display of server-calculated credits with explicit casting
  const currentCredits = Number(subscription?.credits) || calculatedCredits || 0;

  // Debug logging
  console.log('[SUBSCRIPTION DEBUG] Raw subscription object:', subscription);
  console.log('[SUBSCRIPTION DEBUG] Subscription credits property:', subscription?.credits);
  console.log('[SUBSCRIPTION DEBUG] Current credits calculated:', currentCredits);
  console.log('[SUBSCRIPTION DEBUG] Data status:', {
    subscription: !!subscription,
    pricingData: !!pricingData,
    creditTransactions: !!creditTransactions,
    currentCredits,
    calculatedCredits,
    subscriptionLoading,
    pricingLoading,
    transactionsLoading,
    subscriptionCredits: userSubscription?.credits,
    transactionCount: creditTransactions?.length,
    rawSubscriptionCredits: subscription?.credits
  });

  const planData = pricingData?.plans?.[currentPlan] || {
    id: 'free',
    name: 'Free Forever',
    description: 'Perfect for getting started with social media management',
    price: 0,
    credits: 60,
    features: [
      '1 Workspace',
      '1 Social Account per Platform',
      'Basic Scheduling',
      'Limited Analytics',
      'Chrome Extension (Limited)',
      'Watermarked Content',
      '7-day Calendar View'
    ]
  };

  // Credit purchase mutation
  const purchaseCreditsMutation = useMutation({
    mutationFn: (packageId: string) => {
      return apiRequest('POST', '/api/credits/purchase', { packageId });
    },
    onSuccess: () => {
      toast({
        title: "Credits Purchased",
        description: "Your credits have been added to your account!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/subscription'] });
      queryClient.invalidateQueries({ queryKey: ['/api/credit-transactions'] });
    },
    onError: (error: any) => {
      toast({
        title: "Purchase Failed",
        description: error.message || "Failed to purchase credits",
        variant: "destructive",
      });
    },
  });

  const handleCreditPurchase = (packageId: string) => {
    toast({
      title: "Coming Soon",
      description: "Credit packages will be available soon!",
    });
  };

  const handlePlanUpgrade = () => {
    window.location.href = '/pricing';
  };

  // Test function to create sample transactions
  const seedTransactionsMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/seed-credit-transactions');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Sample Transactions Created",
        description: "Credit transaction history has been populated with sample data",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/credit-transactions'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create sample transactions",
        variant: "destructive",
      });
    },
  });

  if (subscriptionLoading || pricingLoading) {
    return (
      <div className="min-h-screen bg-space-navy text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin w-8 h-8 border-4 border-electric-cyan border-t-transparent rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show content even if transactions are loading
  if (!subscription || !pricingData) {
    return (
      <div className="min-h-screen bg-space-navy text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-electric-cyan border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-asteroid-silver">Loading subscription data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-space-navy text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-electric-cyan via-nebula-purple to-solar-gold bg-clip-text text-transparent">
            Your Subscription
          </h1>
          <p className="text-asteroid-silver text-lg">
            Manage your plan, credits, and add-ons
          </p>
          

        </div>

        {/* Current Plan Overview */}
        <Card className="content-card holographic">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-electric-cyan/20 to-nebula-purple/20 border border-electric-cyan/30 flex items-center justify-center">
                  <Crown className="w-8 h-8 text-electric-cyan" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{planData.name}</h3>
                <p className="text-asteroid-silver">
                  {currentPlan === 'free' ? 'Free forever' : `₹${planData.price}/month`}
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-electric-cyan/20 border border-electric-cyan/30 flex items-center justify-center">
                  <Zap className="w-8 h-8 text-electric-cyan" />
                </div>
                <h3 className="text-2xl font-bold text-electric-cyan mb-2">
                  {subscriptionLoading ? 'Loading...' : formatNumber(currentCredits)} credits
                </h3>
                <p className="text-asteroid-silver">Credits remaining</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-green-400 mb-2">
                  {userSubscription?.status === 'active' ? 'Active' : 'Inactive'}
                </h3>
                <p className="text-asteroid-silver">
                  {userSubscription?.currentPeriodEnd 
                    ? `Renews ${new Date(userSubscription.currentPeriodEnd).toLocaleDateString()}`
                    : 'No renewal date'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 glassmorphism">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Plans
            </TabsTrigger>
            <TabsTrigger value="credits" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Credits
            </TabsTrigger>
            <TabsTrigger value="addons" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add-ons
            </TabsTrigger>
          </TabsList>

          {/* Plans Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="content-card holographic">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-electric-cyan">
                  <Crown className="w-5 h-5" />
                  Current Plan Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-white">Plan Features</h4>
                    <div className="space-y-2">
                      {planData.features?.slice(0, 5).map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-asteroid-silver">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-white">Billing Information</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-asteroid-silver">Status:</span>
                        <Badge variant={userSubscription?.status === 'active' ? 'default' : 'secondary'}>
                          {userSubscription?.status || 'Inactive'}
                        </Badge>
                      </div>
                      {userSubscription?.currentPeriodEnd && (
                        <div className="flex justify-between">
                          <span className="text-asteroid-silver">Next billing:</span>
                          <span className="text-white">{new Date(userSubscription.currentPeriodEnd).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-cosmic-void/30">
                  <Button onClick={handlePlanUpgrade} className="w-full md:w-auto glassmorphism">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Upgrade Plan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Credits Tab */}
          <TabsContent value="credits" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Credit Packages */}
              <Card className="content-card holographic">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-electric-cyan">
                    <Zap className="w-5 h-5" />
                    Buy More Credits
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {pricingData?.creditPackages?.map((pkg) => (
                    <div key={pkg.id} className="p-4 rounded-lg bg-cosmic-void/30 border border-electric-cyan/20">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-white">{pkg.name}</h4>
                        {pkg.popular && (
                          <Badge className="bg-solar-gold/20 text-solar-gold">Popular</Badge>
                        )}
                      </div>
                      <div className="text-sm text-asteroid-silver mb-3">
                        {formatNumber(pkg.baseCredits)} credits + {formatNumber(pkg.bonusCredits)} bonus = {formatNumber(pkg.totalCredits)} total
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-electric-cyan">₹{pkg.price}</span>
                        <Button 
                          size="sm" 
                          onClick={() => handleCreditPurchase(pkg.id)}
                          className="glassmorphism"
                        >
                          Buy Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Credit History */}
              <Card className="content-card holographic">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-nebula-purple">
                    <History className="w-5 h-5" />
                    Recent Transactions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {transactionsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin w-6 h-6 border-2 border-electric-cyan border-t-transparent rounded-full"></div>
                    </div>
                  ) : creditTransactions && creditTransactions.length > 0 ? (
                    <div className="space-y-3">
                      {creditTransactions.slice(0, 5).map((transaction) => (
                        <div key={transaction.id} className="flex justify-between items-center p-3 rounded-lg bg-cosmic-void/20">
                          <div>
                            <div className="text-sm font-medium text-white">{transaction.description}</div>
                            <div className="text-xs text-asteroid-silver">
                              {new Date(transaction.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-medium ${transaction.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {transaction.amount > 0 ? '+' : ''}{formatNumber(transaction.amount)}
                            </div>
                            <div className="text-xs text-asteroid-silver capitalize">
                              {transaction.type}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-asteroid-silver">
                      No transactions yet
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Add-ons Tab */}
          <TabsContent value="addons" className="space-y-6">
            <Card className="content-card holographic">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-solar-gold">
                  <Sparkles className="w-5 h-5" />
                  Available Add-ons
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pricingData?.addons && Object.entries(pricingData.addons).map(([key, addon]: [string, any]) => (
                    <div key={key} className="p-6 rounded-lg bg-cosmic-void/30 border border-solar-gold/20">
                      <div className="text-center space-y-4">
                        <div className="w-12 h-12 mx-auto rounded-full bg-solar-gold/20 border border-solar-gold/30 flex items-center justify-center">
                          <Gift className="w-6 h-6 text-solar-gold" />
                        </div>
                        <h3 className="font-semibold text-white">{addon.name}</h3>
                        <p className="text-sm text-asteroid-silver">{addon.benefit || addon.description}</p>
                        <div className="text-lg font-bold text-solar-gold">₹{addon.price}/month</div>
                        <Button 
                          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                          onClick={() => handleAddonPurchase(key)}
                          disabled={addonPurchasing}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          {addonPurchasing ? "Processing..." : "Purchase Now"}
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {(!pricingData?.addons || Object.keys(pricingData.addons).length === 0) && (
                    <div className="col-span-full text-center py-12 text-asteroid-silver">
                      <Sparkles className="w-12 h-12 mx-auto mb-4 text-solar-gold/50" />
                      <h3 className="text-lg font-medium mb-2">Add-ons Coming Soon</h3>
                      <p>Powerful add-ons will be available to enhance your VeeFore experience.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}