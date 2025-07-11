import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Crown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SimplePlanUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: string;
  currentPlan: string;
  upgradeMessage: string;
  limitReached?: {
    current: number;
    max: number;
    type: string;
  };
}

export default function SimplePlanUpgradeModal({
  isOpen,
  onClose,
  feature,
  currentPlan,
  upgradeMessage,
  limitReached
}: SimplePlanUpgradeModalProps) {
  console.log('[SIMPLE UPGRADE MODAL] Rendered with:', { isOpen, feature, currentPlan });

  const plans = [
    {
      id: 'creator',
      name: 'Creator Pro',
      price: 399,
      currency: 'INR',
      interval: 'month',
      icon: Star,
      color: 'from-blue-500 to-purple-600',
      features: [
        'Up to 5 workspaces',
        '500 AI credits/month',
        'Advanced analytics',
        'Priority support'
      ],
      popular: true
    },
    {
      id: 'pro',
      name: 'Professional',
      price: 999,
      currency: 'INR',
      interval: 'month',
      icon: Zap,
      color: 'from-purple-600 to-pink-600',
      features: [
        'Up to 15 workspaces',
        '2000 AI credits/month',
        'Team collaboration',
        'Custom integrations'
      ],
      popular: false
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 2499,
      currency: 'INR',
      interval: 'month',
      icon: Crown,
      color: 'from-pink-600 to-purple-500',
      features: [
        'Unlimited workspaces',
        '10000 AI credits/month',
        'White-label solutions',
        'Dedicated support'
      ],
      popular: false
    }
  ];

  if (!isOpen) {
    console.log('[SIMPLE UPGRADE MODAL] Not rendering - isOpen is false');
    return null;
  }

  console.log('[SIMPLE UPGRADE MODAL] Rendering modal content');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border border-purple-500/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Upgrade Your Plan
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Limitation */}
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <h3 className="font-semibold text-red-400 mb-2">Plan Limit Reached</h3>
            <p className="text-gray-300">{upgradeMessage}</p>
            {limitReached && (
              <p className="text-sm text-gray-400 mt-1">
                Current usage: {limitReached.current}/{limitReached.max} {limitReached.type}
              </p>
            )}
          </div>

          {/* Plans Grid */}
          <div className="grid md:grid-cols-3 gap-4">
            {plans.map((plan) => {
              const IconComponent = plan.icon;
              
              return (
                <motion.div
                  key={plan.id}
                  className={`relative rounded-xl p-6 border-2 transition-all duration-300 ${
                    plan.popular 
                      ? 'border-purple-500 bg-gradient-to-br from-purple-500/10 to-blue-500/10' 
                      : 'border-gray-700 bg-gray-800/50 hover:border-purple-500/50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                      Most Popular
                    </Badge>
                  )}
                  
                  <div className="text-center mb-4">
                    <div className={`inline-flex p-3 rounded-full bg-gradient-to-r ${plan.color} mb-3`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <div className="mt-2">
                      <span className="text-3xl font-bold">₹{plan.price}</span>
                      <span className="text-gray-400">/{plan.interval}</span>
                    </div>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600' 
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                    onClick={() => {
                      console.log(`[SIMPLE UPGRADE MODAL] Upgrade to ${plan.name} clicked`);
                      // Handle upgrade logic here
                      onClose();
                    }}
                  >
                    Upgrade to {plan.name}
                  </Button>
                </motion.div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="text-center pt-4 border-t border-gray-700">
            <p className="text-gray-400 text-sm">
              All plans include 24/7 support and 30-day money-back guarantee
            </p>
            <Button 
              variant="ghost" 
              onClick={onClose}
              className="mt-2 text-gray-400 hover:text-white"
            >
              Continue with Free Plan
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}