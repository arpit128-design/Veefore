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
  X,
  Rocket,
  Sparkles,
  TrendingUp,
  Shield,
  Palette,
  BarChart3,
  Bot,
  Calendar,
  Target,
  ArrowRight
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 rounded-3xl opacity-50"></div>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200 z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Section */}
            <div className="relative z-10 text-center pt-12 pb-8 px-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
                className="w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
              >
                <Sparkles className="w-12 h-12 text-white" />
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4"
              >
                Welcome to VeeFore!
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-lg text-gray-600 leading-relaxed max-w-md mx-auto"
              >
                Your AI-powered social media workspace is ready. Let's explore what you can achieve with your {currentPlan.name} plan.
              </motion.p>
            </div>

            {/* Plan Benefits Card */}
            <div className="relative z-10 mx-8 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg border border-gray-200"
              >
                <div className="flex items-center justify-center mb-6">
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-md ${
                    currentPlan.color === 'gray' ? 'bg-gradient-to-br from-gray-100 to-gray-200' :
                    currentPlan.color === 'blue' ? 'bg-gradient-to-br from-blue-100 to-blue-200' :
                    currentPlan.color === 'purple' ? 'bg-gradient-to-br from-purple-100 to-purple-200' :
                    'bg-gradient-to-br from-emerald-100 to-emerald-200'
                  }`}>
                    <span className="text-4xl">{currentPlan.icon}</span>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-center text-gray-900 mb-3">
                  {currentPlan.name} Plan Activated
                </h3>
                
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full flex items-center space-x-2 shadow-lg">
                    <Zap className="w-5 h-5" />
                    <span className="text-xl font-bold">{currentPlan.credits} AI Credits</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentPlan.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
                      className="flex items-center text-sm text-gray-700 bg-white/70 rounded-lg px-4 py-3 shadow-sm"
                    >
                      <CheckCircle className="w-4 h-4 text-green-600 mr-3 flex-shrink-0" />
                      <span className="font-medium">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* AI Tools Showcase */}
            <div className="relative z-10 mx-8 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200"
              >
                <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Bot className="w-6 h-6 mr-2 text-indigo-600" />
                  15+ AI Tools at Your Fingertips
                </h4>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {[
                    { icon: Palette, name: "AI Content Generator", desc: "Create engaging posts" },
                    { icon: TrendingUp, name: "Trend Analyzer", desc: "Stay ahead of trends" },
                    { icon: BarChart3, name: "Analytics Suite", desc: "Track performance" },
                    { icon: Calendar, name: "Smart Scheduler", desc: "Perfect timing" },
                    { icon: Target, name: "ROI Calculator", desc: "Measure success" },
                    { icon: Shield, name: "Content Protection", desc: "Secure your work" }
                  ].map((tool, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + index * 0.1, duration: 0.3 }}
                      className="bg-white/80 rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <tool.icon className="w-8 h-8 mx-auto mb-2 text-indigo-600" />
                      <h5 className="font-semibold text-xs text-gray-900 mb-1">{tool.name}</h5>
                      <p className="text-xs text-gray-600">{tool.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Quick Start Guide */}
            <div className="relative z-10 mx-8 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200"
              >
                <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Rocket className="w-6 h-6 mr-2 text-emerald-600" />
                  Quick Start Guide
                </h4>
                
                <div className="space-y-3">
                  {[
                    { step: 1, title: "Connect Instagram", desc: "Link your social accounts for seamless publishing" },
                    { step: 2, title: "Create AI Content", desc: "Generate your first post with our AI tools" },
                    { step: 3, title: "Schedule & Analyze", desc: "Set up automated posting and track results" },
                    { step: 4, title: "Scale & Optimize", desc: "Use advanced features to grow your audience" }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.0 + index * 0.1, duration: 0.3 }}
                      className="flex items-center bg-white/80 rounded-xl p-4 shadow-sm"
                    >
                      <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-sm mr-4">
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-900 mb-1">{item.title}</h5>
                        <p className="text-sm text-gray-600">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Action Buttons */}
            <div className="relative z-10 p-8 pt-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="space-y-4"
              >
                <Button
                  onClick={onClose}
                  className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <span>Start Creating Amazing Content</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
                
                <p className="text-center text-sm text-gray-500">
                  This welcome guide will only appear once. You can access help anytime from the sidebar.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}