import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Crown, Rocket, Star } from "lucide-react";
import { SpaceBackground } from "@/components/layout/SpaceBackground";

// Load Stripe with fallback for development
const stripeKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_demo_key_for_development';
const stripePromise = loadStripe(stripeKey);

function SubscribeForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/dashboard',
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome to VeeFore Pro!",
        description: "Your subscription is now active. Enjoy unlimited AI content creation!",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={!stripe}
        className="w-full bg-gradient-to-r from-electric-cyan to-nebula-purple hover:opacity-90 h-12"
      >
        <Crown className="w-5 h-5 mr-2" />
        Subscribe to Pro
      </Button>
    </form>
  );
}

export default function Subscribe() {
  const [clientSecret, setClientSecret] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("pro");

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "$0",
      period: "/month",
      credits: "50 credits",
      features: [
        "50 credits per month",
        "Basic AI content generation",
        "1 workspace",
        "Standard support",
        "Basic analytics"
      ],
      icon: <Rocket className="h-8 w-8" />,
      gradient: "from-space-gray to-asteroid-silver",
      disabled: true
    },
    {
      id: "pro",
      name: "Pro",
      price: "$29",
      period: "/month",
      credits: "150 credits",
      features: [
        "150 credits per month",
        "Advanced AI content generation",
        "3 workspaces",
        "Priority support",
        "Advanced analytics",
        "Scheduler automation",
        "Custom AI personalities"
      ],
      icon: <Zap className="h-8 w-8" />,
      gradient: "from-electric-cyan to-nebula-purple",
      popular: true
    },
    {
      id: "agency",
      name: "Agency",
      price: "$99",
      period: "/month",
      credits: "300 credits",
      features: [
        "300 credits per month",
        "Premium AI content generation",
        "Unlimited workspaces",
        "24/7 dedicated support",
        "White-label options",
        "Team collaboration",
        "API access",
        "Custom integrations"
      ],
      icon: <Crown className="h-8 w-8" />,
      gradient: "from-solar-gold to-orange-500"
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "Custom",
      period: "",
      credits: "5000+ credits",
      features: [
        "Custom credit allocation",
        "Enterprise AI models",
        "Unlimited everything",
        "Dedicated account manager",
        "Custom development",
        "SLA guarantees",
        "Advanced security",
        "On-premise deployment"
      ],
      icon: <Star className="h-8 w-8" />,
      gradient: "from-nebula-purple to-pink-500"
    }
  ];

  useEffect(() => {
    if (selectedPlan !== "free") {
      // Create subscription when plan is selected
      apiRequest("POST", "/api/get-or-create-subscription")
        .then((res) => res.json())
        .then((data) => {
          setClientSecret(data.clientSecret);
        })
        .catch((error) => {
          console.error("Subscription creation error:", error);
        });
    }
  }, [selectedPlan]);

  return (
    <div className="min-h-screen bg-space-navy text-white">
      <SpaceBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-orbitron font-bold neon-text text-electric-cyan mb-4">
            Choose Your Mission
          </h1>
          <p className="text-xl text-asteroid-silver max-w-2xl mx-auto">
            Unlock the full power of AI-driven content creation with our galactic subscription plans
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`content-card holographic relative cursor-pointer transition-all duration-300 ${
                selectedPlan === plan.id ? 'ring-2 ring-electric-cyan' : ''
              } ${plan.popular ? 'scale-105' : ''}`}
              onClick={() => !plan.disabled && setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-electric-cyan text-space-navy">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${plan.gradient} flex items-center justify-center mx-auto mb-4`}>
                  {plan.icon}
                </div>
                <CardTitle className="text-2xl font-orbitron font-semibold">
                  {plan.name}
                </CardTitle>
                <div className="space-y-1">
                  <div className="text-3xl font-bold">
                    {plan.price}
                    <span className="text-lg text-asteroid-silver">{plan.period}</span>
                  </div>
                  <div className="text-sm text-blue-400">{plan.credits}</div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3 text-sm">
                      <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {plan.id === "free" ? (
                  <Button disabled className="w-full" variant="outline">
                    Current Plan
                  </Button>
                ) : plan.id === "enterprise" ? (
                  <Button 
                    variant="outline" 
                    className="w-full glassmorphism"
                    onClick={() => window.open('mailto:contact@veefore.com', '_blank')}
                  >
                    Contact Sales
                  </Button>
                ) : (
                  <Button
                    className={`w-full bg-gradient-to-r ${plan.gradient} hover:opacity-90`}
                    disabled={selectedPlan !== plan.id}
                  >
                    {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Payment Form */}
        {clientSecret && selectedPlan !== "free" && selectedPlan !== "enterprise" && (
          <Card className="content-card holographic max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-orbitron font-semibold neon-text text-electric-cyan">
                Complete Your Subscription
              </CardTitle>
              <p className="text-center text-asteroid-silver">
                You're subscribing to the {plans.find(p => p.id === selectedPlan)?.name} plan
              </p>
            </CardHeader>
            <CardContent>
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <SubscribeForm />
              </Elements>
            </CardContent>
          </Card>
        )}

        {/* Features Comparison */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-orbitron font-bold text-nebula-purple mb-8">
            Why Choose VeeFore?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-electric-cyan to-blue-500 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Creation</h3>
              <p className="text-asteroid-silver">
                Generate high-quality content using advanced AI models trained on millions of successful posts
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-nebula-purple to-purple-500 flex items-center justify-center mx-auto mb-4">
                <Crown className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Multi-Platform Support</h3>
              <p className="text-asteroid-silver">
                Create and schedule content for Instagram, X, YouTube, TikTok, and more from one platform
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-solar-gold to-orange-500 flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-Time Analytics</h3>
              <p className="text-asteroid-silver">
                Track performance with detailed analytics and get AI-powered insights for optimization
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-3xl font-orbitron font-bold neon-text text-blue-400 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <Card className="content-card holographic">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">How do credits work?</h3>
                <p className="text-asteroid-silver">
                  Credits are used for AI content generation. Different content types require different amounts: 
                  videos (25 credits), reels (15 credits), posts (10 credits), captions (5 credits), and thumbnails (8 credits).
                </p>
              </CardContent>
            </Card>
            <Card className="content-card holographic">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Can I change my plan anytime?</h3>
                <p className="text-asteroid-silver">
                  Yes! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
                </p>
              </CardContent>
            </Card>
            <Card className="content-card holographic">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Do unused credits roll over?</h3>
                <p className="text-asteroid-silver">
                  Unused credits from your monthly allocation expire at the end of each billing cycle. However, bonus credits from referrals never expire.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
