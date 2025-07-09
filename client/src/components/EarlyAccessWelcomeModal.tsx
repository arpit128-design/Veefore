import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gift, Star, Zap, Crown, Sparkles } from 'lucide-react';

interface EarlyAccessWelcomeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClaim: () => void;
  userEmail?: string;
}

export function EarlyAccessWelcomeModal({ open, onOpenChange, onClaim, userEmail }: EarlyAccessWelcomeModalProps) {
  const [isClaimingReward, setIsClaimingReward] = useState(false);

  const handleClaimReward = async () => {
    setIsClaimingReward(true);
    try {
      await onClaim();
    } finally {
      setIsClaimingReward(false);
    }
  };

  const handleModalClose = (isOpen: boolean) => {
    if (!isOpen && userEmail) {
      // Mark modal as dismissed when closed
      const modalKey = `welcome-modal-dismissed-${userEmail}`;
      localStorage.setItem(modalKey, 'true');
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleModalClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-0 p-0 overflow-hidden">
        <div className="relative h-full max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <motion.div
              className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
              animate={{
                rotate: [360, 0],
                scale: [1.2, 1, 1.2],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 p-8 min-h-full">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, ease: "backOut" }}
                className="mx-auto mb-4"
              >
                <div className="relative">
                  <Crown className="w-16 h-16 text-yellow-400 mx-auto" />
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 w-16 h-16 text-yellow-400/50 mx-auto"
                  >
                    <Sparkles className="w-16 h-16" />
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <Badge className="mb-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 text-sm font-semibold">
                  🎉 EARLY ACCESS APPROVED
                </Badge>
                <DialogTitle className="text-3xl font-bold text-white mb-2">
                  Welcome to VeeFore!
                </DialogTitle>
                <p className="text-slate-300 text-lg">
                  You're part of our exclusive early access program
                </p>
              </motion.div>
            </div>

            {/* Welcome Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="space-y-6 mb-8"
            >
              {/* Early Access Benefits */}
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-blue-500/20">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  Your Early Access Benefits
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-slate-300">Starter plan trial (1 month)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-slate-300">Priority support</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-slate-300">Beta feature access</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-slate-300">Exclusive community</span>
                  </div>
                </div>
              </div>

              {/* Starter Plan Trial Offer */}
              <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl p-6 border border-green-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-green-500 to-blue-500 p-3 rounded-full">
                      <Crown className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">Starter Plan Trial</h3>
                      <p className="text-slate-300">Full access to Starter plan features for 1 month</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-400">1 Month</div>
                    <div className="text-sm text-slate-400">Free Trial</div>
                  </div>
                </div>
              </div>

              {/* Feature Highlights */}
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-400" />
                  What You Can Do
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-full w-fit mx-auto mb-2">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-semibold text-white mb-1">AI Content</h4>
                    <p className="text-sm text-slate-400">Generate viral content with 15+ AI tools</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-gradient-to-r from-green-500 to-blue-500 p-3 rounded-full w-fit mx-auto mb-2">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-semibold text-white mb-1">Automation</h4>
                    <p className="text-sm text-slate-400">Automate posting and engagement</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full w-fit mx-auto mb-2">
                      <Star className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-semibold text-white mb-1">Analytics</h4>
                    <p className="text-sm text-slate-400">Track performance and growth</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Action Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="text-center"
            >
              <Button
                onClick={handleClaimReward}
                disabled={isClaimingReward}
                className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 relative overflow-hidden group"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Crown className="w-5 h-5" />
                  {isClaimingReward ? 'Activating Trial...' : 'Activate Starter Plan Trial'}
                </span>
              </Button>
              <p className="text-sm text-slate-400 mt-3">
                One-time early access benefit • Full starter plan access for 1 month
              </p>
            </motion.div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}