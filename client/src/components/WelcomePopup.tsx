import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Gift, 
  Zap, 
  Building, 
  Users, 
  Crown, 
  CheckCircle, 
  Star,
  X 
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface WelcomePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WelcomePopup({ isOpen, onClose }: WelcomePopupProps) {
  const { data: user } = useQuery({
    queryKey: ['/api/user']
  });

  if (!isOpen || !user) return null;

  const planDetails = {
    free: {
      name: 'Free',
      credits: 20,
      features: ['20 AI credits/month', '1 workspace', '1 social account', 'Basic AI tools'],
      color: 'gray',
      icon: '🆓'
    },
    starter: {
      name: 'Starter',
      credits: 300,
      features: ['300 AI credits/month', '1 workspace', '2 social accounts', 'All AI tools', 'Priority support'],
      color: 'blue',
      icon: '🚀'
    },
    pro: {
      name: 'Pro',
      credits: 1100,
      features: ['1,100 AI credits/month', '2 workspaces', '1 social account per workspace', 'AI Thumbnail Maker Pro', 'Team collaboration (2 members)'],
      color: 'purple',
      icon: '⭐'
    },
    business: {
      name: 'Business',
      credits: 2000,
      features: ['2,000 AI credits/month', '8 workspaces', '4 social accounts per workspace', 'All premium features', 'Team collaboration (3 members)', 'API access'],
      color: 'emerald',
      icon: '👑'
    }
  };

  const currentPlan = planDetails[user.plan as keyof typeof planDetails] || planDetails.free;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                🎉 Welcome to VeeFore!
              </h2>
              <p className="text-gray-600 text-lg">
                Your account is ready! Here's what you get with your {currentPlan.name} plan:
              </p>
            </div>

            {/* Plan Benefits */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-center mb-4">
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                  currentPlan.color === 'gray' ? 'bg-gray-100' :
                  currentPlan.color === 'blue' ? 'bg-blue-100' :
                  currentPlan.color === 'purple' ? 'bg-purple-100' :
                  'bg-emerald-100'
                }`}>
                  <span className="text-3xl">{currentPlan.icon}</span>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
                {currentPlan.name} Plan Activated
              </h3>
              
              <div className="grid grid-cols-1 gap-3 mb-4">
                <div className="flex items-center justify-center space-x-2 text-lg font-semibold text-blue-600">
                  <Zap className="w-5 h-5" />
                  <span>{currentPlan.credits} AI Credits</span>
                </div>
              </div>

              <div className="space-y-2">
                {currentPlan.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Start Tips */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">🚀 Quick Start Tips</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 mr-2" />
                  <span>Connect your Instagram account in Settings</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 mr-2" />
                  <span>Try the AI Content Generator to create your first post</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 mr-2" />
                  <span>Schedule content with our AI-powered calendar</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 mr-2" />
                  <span>Explore our 15+ AI tools in the sidebar</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={onClose}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                Start Creating Content
              </Button>
              <p className="text-center text-xs text-gray-500">
                This welcome message will only show once
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}