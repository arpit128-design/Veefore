import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Zap, Shield, Star, Plus, History, CheckCircle, ArrowRight, Sparkles, Rocket, Globe, Users, Brain } from 'lucide-react';
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

// 3D Card Component with animations
const AnimatedCard = ({ 
  children, 
  className, 
  delay = 0,
  onMouseEnter,
  onMouseLeave,
  ...props 
}: { 
  children: React.ReactNode; 
  className?: string; 
  delay?: number;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
} & React.HTMLProps<HTMLDivElement>) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      ref={cardRef}
      className={`transform transition-all duration-1000 ease-out ${
        isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
      } ${className}`}
      style={{
        background: 'linear-gradient(135deg, rgba(16, 26, 51, 0.8) 0%, rgba(34, 57, 115, 0.6) 50%, rgba(75, 20, 140, 0.4) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(98, 189, 255, 0.2)',
        borderRadius: '16px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(98, 189, 255, 0.1)',
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      {...props}
    >
      {children}
    </div>
  );
};

// Floating particles component
const FloatingParticles = () => {
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const particles = Array.from({ length: 50 }, (_, i) => {
      const particle = document.createElement('div');
      particle.className = 'absolute rounded-full opacity-20 animate-pulse';
      particle.style.width = Math.random() * 4 + 2 + 'px';
      particle.style.height = particle.style.width;
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.background = `rgba(${Math.random() > 0.5 ? '98, 189, 255' : '147, 112, 219'}, 0.6)`;
      particle.style.animationDelay = Math.random() * 3 + 's';
      particle.style.animationDuration = Math.random() * 4 + 3 + 's';
      return particle;
    });

    if (particlesRef.current) {
      particles.forEach(particle => particlesRef.current?.appendChild(particle));
    }

    return () => {
      particles.forEach(particle => particle.remove());
    };
  }, []);

  return <div ref={particlesRef} className="absolute inset-0 overflow-hidden pointer-events-none" />;
};

export default function SubscriptionEnhanced() {
  const [activeTab, setActiveTab] = useState('plans');
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch subscription data
  const { data: subscription, isLoading: subscriptionLoading } = useQuery<SubscriptionData>({
    queryKey: ['/api/subscription'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/subscription');
      return response.json();
    },
    retry: 3,
    staleTime: 30000,
  });

  // Fetch pricing plans
  const { data: pricingData, isLoading: pricingLoading } = useQuery<PlanData>({
    queryKey: ['/api/subscription/plans'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/subscription/plans');
      return response.json();
    },
    retry: 2,
    staleTime: 60000,
  });

  // Fetch credit transactions
  const { data: creditTransactions, isLoading: transactionsLoading } = useQuery<CreditTransaction[]>({
    queryKey: ['/api/credit-transactions'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/credit-transactions');
      return response.json();
    },
    retry: 2,
    staleTime: 30000,
  });

  // Razorpay payment mutation
  const razorpayPaymentMutation = useMutation({
    mutationFn: async ({ planId, packageId }: { planId?: string; packageId?: string }) => {
      const endpoint = planId ? '/api/razorpay/create-subscription' : '/api/razorpay/create-order';
      const payload = planId ? { planId } : { packageId };
      const response = await apiRequest('POST', endpoint, payload);
      return response.json();
    },
    onSuccess: (data) => {
      // Initialize Razorpay payment
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: 'VeeFore',
        description: data.description,
        order_id: data.orderId,
        handler: function (response: any) {
          toast({
            title: "Payment Successful!",
            description: "Your subscription has been activated.",
          });
          queryClient.invalidateQueries({ queryKey: ['/api/subscription'] });
          queryClient.invalidateQueries({ queryKey: ['/api/credit-transactions'] });
        },
        prefill: {
          name: '',
          email: '',
        },
        theme: {
          color: '#62BDFF',
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    },
    onError: (error: any) => {
      toast({
        title: "Payment Failed",
        description: error.message || "Unable to process payment",
        variant: "destructive",
      });
    },
  });

  const authenticCredits = subscription?.credits || 0;
  const currentPlan = subscription?.plan || 'free';
  const planInfo = pricingData?.plans?.[currentPlan] || {
    id: 'free',
    name: 'Free Forever',
    description: 'Perfect for getting started',
    price: 0,
    credits: 60,
    features: ['Basic Features', 'Limited Analytics', '1 Social Account']
  };

  const handlePlanUpgrade = (planId: string) => {
    razorpayPaymentMutation.mutate({ planId });
  };

  const handleCreditPurchase = (packageId: string) => {
    razorpayPaymentMutation.mutate({ packageId });
  };

  if (subscriptionLoading || pricingLoading) {
    return (
      <div className="min-h-screen bg-space-navy text-white flex items-center justify-center relative overflow-hidden">
        <SpaceBackground />
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 border-4 border-electric-cyan border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <div className="space-y-3">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-electric-cyan to-nebula-purple bg-clip-text text-transparent">
              Initializing Your Cosmic Experience
            </h2>
            <p className="text-asteroid-silver">Loading subscription universe...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-space-navy text-white relative overflow-hidden">
      <SpaceBackground />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-electric-cyan/20 to-nebula-purple/20 border border-electric-cyan/30 backdrop-blur-sm">
            <Sparkles className="w-5 h-5 text-electric-cyan animate-pulse" />
            <span className="text-sm font-medium text-electric-cyan">AI-Powered Social Media Management</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-electric-cyan via-nebula-purple to-solar-gold bg-clip-text text-transparent leading-tight">
            Your Subscription
          </h1>
          
          <p className="text-xl text-asteroid-silver max-w-2xl mx-auto leading-relaxed">
            Manage your cosmic journey through social media automation, AI content creation, and viral growth strategies
          </p>
        </div>

        {/* Current Plan Overview - 3D Style */}
        <AnimatedCard className="mb-12 p-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-electric-cyan/5 via-nebula-purple/5 to-solar-gold/5 rounded-2xl"></div>
          <div className="relative z-10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Current Mission Status</h2>
              <p className="text-asteroid-silver">Your active subscription and cosmic resources</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Plan Info */}
              <div className="text-center group">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-electric-cyan/20 to-nebula-purple/20 border-2 border-electric-cyan/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Crown className="w-10 h-10 text-electric-cyan group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-3">{planInfo.name}</h3>
                <p className="text-asteroid-silver text-lg">
                  {currentPlan === 'free' ? 'Free forever' : `₹${planInfo.price}/month`}
                </p>
              </div>

              {/* Credits */}
              <div className="text-center group">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-electric-cyan/20 to-solar-gold/20 border-2 border-electric-cyan/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-10 h-10 text-electric-cyan group-hover:animate-pulse" />
                </div>
                <h3 className="text-4xl font-bold bg-gradient-to-r from-electric-cyan to-solar-gold bg-clip-text text-transparent mb-3">
                  {formatNumber(authenticCredits)}
                </h3>
                <p className="text-asteroid-silver text-lg">Cosmic Credits Available</p>
              </div>

              {/* Status */}
              <div className="text-center group">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400/20 to-green-600/20 border-2 border-green-400/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-10 h-10 text-green-400 group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <h3 className="text-3xl font-bold text-green-400 mb-3">
                  {subscription?.status === 'active' ? 'Active' : 'Inactive'}
                </h3>
                <p className="text-asteroid-silver text-lg">Mission Status</p>
              </div>
            </div>
          </div>
        </AnimatedCard>

        {/* Enhanced Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-cosmic-void/80 to-deep-purple/80 backdrop-blur-sm border border-electric-cyan/20 rounded-2xl p-2 mb-8">
            <TabsTrigger 
              value="plans" 
              className="flex items-center gap-3 text-lg font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-electric-cyan/20 data-[state=active]:to-nebula-purple/20 data-[state=active]:text-electric-cyan rounded-xl"
            >
              <Star className="w-5 h-5" />
              Plans
            </TabsTrigger>
            <TabsTrigger 
              value="credits" 
              className="flex items-center gap-3 text-lg font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-electric-cyan/20 data-[state=active]:to-nebula-purple/20 data-[state=active]:text-electric-cyan rounded-xl"
            >
              <Zap className="w-5 h-5" />
              Credits
            </TabsTrigger>
            <TabsTrigger 
              value="addons" 
              className="flex items-center gap-3 text-lg font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-electric-cyan/20 data-[state=active]:to-nebula-purple/20 data-[state=active]:text-electric-cyan rounded-xl"
            >
              <Plus className="w-5 h-5" />
              Add-ons
            </TabsTrigger>
          </TabsList>

          {/* Plans Tab - Enhanced 3D Cards */}
          <TabsContent value="plans" className="space-y-8">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-white mb-4">Choose Your Cosmic Plan</h3>
              <p className="text-asteroid-silver text-lg">Unlock the power of AI-driven social media management</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {pricingData?.plans && Object.values(pricingData.plans).map((plan, index) => (
                <AnimatedCard 
                  key={plan.id} 
                  delay={index * 200}
                  className={`relative overflow-hidden group cursor-pointer transition-all duration-500 ${
                    plan.popular ? 'scale-105 z-10' : 'hover:scale-105'
                  } ${hoveredPlan === plan.id ? 'scale-110' : ''}`}
                  onMouseEnter={() => setHoveredPlan(plan.id)}
                  onMouseLeave={() => setHoveredPlan(null)}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                      <Badge className="bg-gradient-to-r from-electric-cyan to-nebula-purple text-white font-bold px-6 py-2 text-sm shadow-lg">
                        🚀 Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <div className="p-8 space-y-6">
                    {/* Plan Icon */}
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-electric-cyan/20 to-nebula-purple/20 border border-electric-cyan/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        {plan.id === 'free' && <Rocket className="w-8 h-8 text-electric-cyan" />}
                        {plan.id === 'creator' && <Brain className="w-8 h-8 text-nebula-purple" />}
                        {plan.id === 'pro' && <Globe className="w-8 h-8 text-solar-gold" />}
                        {plan.id === 'enterprise' && <Users className="w-8 h-8 text-green-400" />}
                      </div>
                      <h4 className="text-2xl font-bold text-white mb-2">{plan.name}</h4>
                      <p className="text-asteroid-silver text-sm">{plan.description}</p>
                    </div>

                    {/* Pricing */}
                    <div className="text-center">
                      <div className="text-4xl font-bold bg-gradient-to-r from-electric-cyan to-nebula-purple bg-clip-text text-transparent mb-2">
                        {typeof plan.price === 'number' ? `₹${plan.price}` : plan.price}
                        {typeof plan.price === 'number' && <span className="text-lg text-asteroid-silver">/month</span>}
                      </div>
                      <div className="text-lg font-semibold text-solar-gold">
                        {formatNumber(plan.credits)} Credits/month
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-3">
                      {plan.features.slice(0, 8).map((feature: string, featureIndex: number) => (
                        <div key={featureIndex} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                          <span className="text-sm text-asteroid-silver">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <Button 
                      onClick={() => currentPlan !== plan.id && handlePlanUpgrade(plan.id)}
                      disabled={currentPlan === plan.id || razorpayPaymentMutation.isPending}
                      className={`w-full py-4 text-lg font-semibold rounded-xl transition-all duration-300 ${
                        currentPlan === plan.id 
                          ? 'bg-gray-600 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-electric-cyan to-nebula-purple hover:from-nebula-purple hover:to-electric-cyan shadow-lg hover:shadow-electric-cyan/25'
                      }`}
                    >
                      {currentPlan === plan.id ? 'Current Plan' : 'Upgrade Now'}
                      {currentPlan !== plan.id && <ArrowRight className="w-5 h-5 ml-2" />}
                    </Button>
                  </div>
                </AnimatedCard>
              ))}
            </div>
          </TabsContent>

          {/* Credits Tab - Enhanced */}
          <TabsContent value="credits" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Credit Packages */}
              <AnimatedCard className="p-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl text-electric-cyan mb-6">
                    <Zap className="w-6 h-6" />
                    Cosmic Credit Boosters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {pricingData?.creditPackages?.map((pkg, index) => (
                    <div 
                      key={pkg.id} 
                      className="flex justify-between items-center p-6 rounded-xl bg-gradient-to-r from-cosmic-void/40 to-deep-purple/40 border border-electric-cyan/20 hover:border-electric-cyan/40 transition-all duration-300 group"
                    >
                      <div className="space-y-2">
                        <div className="font-bold text-white text-lg group-hover:text-electric-cyan transition-colors">
                          {pkg.name}
                        </div>
                        <div className="text-asteroid-silver">
                          {formatNumber(pkg.totalCredits)} credits
                          {pkg.savings && (
                            <Badge variant="secondary" className="ml-3 bg-gradient-to-r from-solar-gold/20 to-solar-gold/40 text-solar-gold border-solar-gold/30">
                              Save {pkg.savings}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        onClick={() => handleCreditPurchase(pkg.id)}
                        disabled={razorpayPaymentMutation.isPending}
                        className="bg-gradient-to-r from-electric-cyan to-nebula-purple hover:from-nebula-purple hover:to-electric-cyan px-8 py-3 rounded-xl font-semibold transition-all duration-300"
                      >
                        ₹{pkg.price}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </AnimatedCard>

              {/* Transaction History */}
              <AnimatedCard delay={300} className="p-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl text-nebula-purple mb-6">
                    <History className="w-6 h-6" />
                    Mission Log
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {transactionsLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="w-8 h-8 border-2 border-electric-cyan border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : creditTransactions && creditTransactions.length > 0 ? (
                    <div className="space-y-4 max-h-80 overflow-y-auto">
                      {creditTransactions.slice(0, 8).map((transaction) => (
                        <div key={transaction.id} className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-cosmic-void/30 to-deep-purple/30 border border-asteroid-silver/10 hover:border-electric-cyan/30 transition-all duration-300">
                          <div className="space-y-1">
                            <div className="text-sm font-medium text-white">{transaction.description}</div>
                            <div className="text-xs text-asteroid-silver">
                              {new Date(transaction.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-bold ${transaction.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
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
                    <div className="text-center py-12 text-asteroid-silver">
                      <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No mission logs yet</p>
                    </div>
                  )}
                </CardContent>
              </AnimatedCard>
            </div>
          </TabsContent>

          {/* Add-ons Tab */}
          <TabsContent value="addons" className="space-y-8">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-white mb-4">Cosmic Enhancements</h3>
              <p className="text-asteroid-silver text-lg">Supercharge your social media presence</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pricingData?.addons && Object.values(pricingData.addons).map((addon, index) => (
                <AnimatedCard key={addon.id} delay={index * 150} className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-electric-cyan/20 to-nebula-purple/20 border border-electric-cyan/30 flex items-center justify-center">
                    <Plus className="w-8 h-8 text-electric-cyan" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-4">{addon.name}</h4>
                  <div className="text-3xl font-bold bg-gradient-to-r from-electric-cyan to-nebula-purple bg-clip-text text-transparent mb-2">
                    ₹{addon.price}
                  </div>
                  <div className="text-sm text-asteroid-silver mb-6">/{addon.interval}</div>
                  <Button className="w-full bg-gradient-to-r from-electric-cyan to-nebula-purple hover:from-nebula-purple hover:to-electric-cyan rounded-xl font-semibold transition-all duration-300">
                    Add Enhancement
                  </Button>
                </AnimatedCard>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}