import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Zap, Shield, Star, Plus, History, CheckCircle, ArrowRight } from 'lucide-react';
import { SpaceBackground } from '@/components/layout/SpaceBackground';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { formatNumber } from '@/lib/utils';

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
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  // Fetch subscription data with explicit authentication
  const { data: subscription, isLoading: subscriptionLoading } = useQuery<SubscriptionData>({
    queryKey: ['/api/subscription'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/subscription');
      const data = await response.json();
      console.log('[NEW SUBSCRIPTION] Loaded subscription data:', data);
      return data;
    },
    retry: 3,
    staleTime: 30000,
  });

  // Fetch pricing plans
  const { data: pricingData, isLoading: pricingLoading } = useQuery<PlanData>({
    queryKey: ['/api/subscription/plans'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/subscription/plans');
      const data = await response.json();
      console.log('[NEW SUBSCRIPTION] Loaded pricing data:', data);
      return data;
    },
    retry: 2,
    staleTime: 60000,
  });

  // Fetch credit transactions
  const { data: creditTransactions, isLoading: transactionsLoading } = useQuery<CreditTransaction[]>({
    queryKey: ['/api/credit-transactions'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/credit-transactions');
      const data = await response.json();
      console.log('[NEW SUBSCRIPTION] Loaded credit transactions:', data.length, 'transactions');
      return data;
    },
    retry: 2,
    staleTime: 30000,
  });

  // Calculate authentic credit balance
  const authenticCredits = subscription?.credits || 0;
  const transactionCredits = creditTransactions?.reduce((total, tx) => total + tx.amount, 0) || 0;
  const displayCredits = authenticCredits > 0 ? authenticCredits : transactionCredits;

  console.log('[NEW SUBSCRIPTION] Credit calculation:', {
    authenticCredits,
    transactionCredits,
    displayCredits,
    subscriptionLoaded: !!subscription,
    transactionsLoaded: !!creditTransactions
  });

  const currentPlan = subscription?.plan || 'free';
  const planInfo = pricingData?.plans?.[currentPlan] || {
    id: 'free',
    name: 'Free Forever',
    description: 'Perfect for getting started',
    price: 0,
    credits: 60,
    features: ['Basic Features', 'Limited Analytics', '1 Social Account']
  };

  // Credit purchase mutation
  const purchaseCreditsMutation = useMutation({
    mutationFn: (packageId: string) => apiRequest('POST', '/api/credits/purchase', { packageId }),
    onSuccess: () => {
      toast({ title: "Credits Purchased", description: "Your credits have been added!" });
      queryClient.invalidateQueries({ queryKey: ['/api/subscription'] });
      queryClient.invalidateQueries({ queryKey: ['/api/credit-transactions'] });
    },
    onError: (error: any) => {
      toast({ title: "Purchase Failed", description: error.message, variant: "destructive" });
    },
  });

  if (subscriptionLoading || pricingLoading) {
    return (
      <div className="min-h-screen bg-space-navy text-white flex items-center justify-center">
        <SpaceBackground />
        <div className="relative z-10 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-electric-cyan border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-asteroid-silver">Loading your subscription...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-space-navy text-white p-8">
      <SpaceBackground />
      
      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
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
              {/* Plan Info */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-electric-cyan/20 to-nebula-purple/20 border border-electric-cyan/30 flex items-center justify-center">
                  <Crown className="w-8 h-8 text-electric-cyan" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{planInfo.name}</h3>
                <p className="text-asteroid-silver">
                  {currentPlan === 'free' ? 'Free forever' : `₹${planInfo.price}/month`}
                </p>
              </div>

              {/* Credits */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-electric-cyan/20 border border-electric-cyan/30 flex items-center justify-center">
                  <Zap className="w-8 h-8 text-electric-cyan" />
                </div>
                <h3 className="text-2xl font-bold text-electric-cyan mb-2">
                  {formatNumber(displayCredits)}
                </h3>
                <p className="text-asteroid-silver">Credits remaining</p>
              </div>

              {/* Status */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-green-400 mb-2">
                  {subscription?.status === 'active' ? 'Active' : 'Inactive'}
                </h3>
                <p className="text-asteroid-silver">Plan status</p>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
              {pricingData?.plans && Object.values(pricingData.plans).map((plan) => (
                <Card key={plan.id} className={`content-card relative ${plan.popular ? 'border-electric-cyan holographic' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-electric-cyan text-space-navy font-semibold">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-white">{plan.name}</CardTitle>
                    <div className="text-3xl font-bold text-electric-cyan">
                      {typeof plan.price === 'number' ? `₹${plan.price}` : plan.price}
                      {typeof plan.price === 'number' && <span className="text-sm text-asteroid-silver">/month</span>}
                    </div>
                    <p className="text-asteroid-silver text-sm">{plan.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{formatNumber(plan.credits)}</div>
                      <div className="text-xs text-asteroid-silver">Monthly Credits</div>
                    </div>
                    <div className="space-y-2">
                      {plan.features.slice(0, 6).map((feature: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                          <span className="text-sm text-asteroid-silver">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Button 
                      className={`w-full ${currentPlan === plan.id ? 'bg-gray-600 cursor-not-allowed' : 'btn-primary'}`}
                      disabled={currentPlan === plan.id}
                    >
                      {currentPlan === plan.id ? 'Current Plan' : 'Upgrade'}
                      {currentPlan !== plan.id && <ArrowRight className="w-4 h-4 ml-2" />}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Credits Tab */}
          <TabsContent value="credits" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Credit Packages */}
              <Card className="content-card holographic">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-electric-cyan">
                    <Zap className="w-5 h-5" />
                    Credit Packages
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {pricingData?.creditPackages?.map((pkg) => (
                    <div key={pkg.id} className="flex justify-between items-center p-4 rounded-lg bg-cosmic-void/20 border border-asteroid-silver/10">
                      <div>
                        <div className="font-semibold text-white">{pkg.name}</div>
                        <div className="text-sm text-asteroid-silver">
                          {formatNumber(pkg.totalCredits)} credits
                          {pkg.savings && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              Save {pkg.savings}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        onClick={() => purchaseCreditsMutation.mutate(pkg.id)}
                        disabled={purchaseCreditsMutation.isPending}
                        className="btn-primary"
                      >
                        ₹{pkg.price}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Transaction History */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pricingData?.addons && Object.values(pricingData.addons).map((addon) => (
                <Card key={addon.id} className="content-card">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">{addon.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-electric-cyan">
                        ₹{addon.price}
                      </div>
                      <div className="text-xs text-asteroid-silver">/{addon.interval}</div>
                    </div>
                    <Button className="w-full btn-primary">
                      Add to Plan
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* FAQ Section */}
        <Card className="content-card">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-white">
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-white">What are credits?</h3>
                <p className="text-asteroid-silver text-sm">
                  Credits are used for AI features like content generation, image creation, and analytics. 
                  Each feature consumes different amounts of credits based on complexity.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-white">Can I change plans anytime?</h3>
                <p className="text-asteroid-silver text-sm">
                  Yes! You can upgrade or downgrade your plan at any time. 
                  Changes take effect immediately.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}