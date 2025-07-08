import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { ArrowLeft, Lock, Star, Users, CheckCircle, Mail, Bell, Sparkles, Zap, Calendar, Trophy, Shield, Heart, FileText, BarChart3, Share2, ImageIcon, Languages, Target, Globe, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Feature data mapping
const featureData = {
  'ai-thumbnails': {
    title: 'AI Thumbnails',
    icon: <ImageIcon className="w-12 h-12" />,
    description: 'Generate stunning, click-worthy thumbnails using advanced AI technology',
    benefits: [
      'DALL-E 3 powered image generation',
      'Professional YouTube thumbnail styles',
      'Customizable text overlays and effects',
      'High CTR optimization',
      'Instant generation in seconds'
    ],
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/20'
  },
  'thumbnails-pro': {
    title: 'Thumbnails Pro',
    icon: <Sparkles className="w-12 h-12" />,
    description: 'Professional-grade thumbnail creation with advanced editing capabilities',
    benefits: [
      '7-stage thumbnail creation process',
      'Canvas editor with drag-and-drop',
      'Multiple export formats',
      'Collaboration tools',
      'Style matching AI'
    ],
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20'
  },
  'content-repurpose': {
    title: 'Content Repurpose',
    icon: <Languages className="w-12 h-12" />,
    description: 'Transform your content across multiple platforms and formats',
    benefits: [
      'Cross-platform content adaptation',
      'Multiple format conversions',
      'Automated resizing and optimization',
      'Content scheduling integration',
      'Performance tracking'
    ],
    color: 'text-teal-400',
    bgColor: 'bg-teal-500/10',
    borderColor: 'border-teal-500/20'
  },
  'legal-assistant': {
    title: 'Legal Assistant',
    icon: <FileText className="w-12 h-12" />,
    description: 'AI-powered legal guidance and contract generation for creators',
    benefits: [
      'Contract template generation',
      'Legal compliance checking',
      'Copyright protection guidance',
      'Terms of service creation',
      'Multi-jurisdiction support'
    ],
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-500/10',
    borderColor: 'border-indigo-500/20'
  },
  'content-theft-detection': {
    title: 'Content Theft Detection',
    icon: <Shield className="w-12 h-12" />,
    description: 'Protect your content with advanced plagiarism detection',
    benefits: [
      'Real-time content monitoring',
      'Automated theft alerts',
      'Legal action recommendations',
      'Evidence collection tools',
      'Copyright protection suite'
    ],
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20'
  },
  'emotion-analysis': {
    title: 'Emotion Analysis',
    icon: <Heart className="w-12 h-12" />,
    description: 'Understand audience emotions and optimize content accordingly',
    benefits: [
      'Plutchik emotion wheel analysis',
      'Sentiment scoring',
      'Audience mood tracking',
      'Content optimization suggestions',
      'Engagement prediction'
    ],
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/20'
  },
  'gamification': {
    title: 'Gamification',
    icon: <Trophy className="w-12 h-12" />,
    description: 'Boost engagement with game-like features and rewards',
    benefits: [
      'Achievement systems',
      'Leaderboards and rankings',
      'Reward mechanisms',
      'Progress tracking',
      'Community challenges'
    ],
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20'
  },
  'a/b-testing': {
    title: 'A/B Testing',
    icon: <BarChart3 className="w-12 h-12" />,
    description: 'Data-driven testing strategies with statistical analysis',
    benefits: [
      'Variant performance testing',
      'Statistical significance analysis',
      'Automated result reporting',
      'Optimization recommendations',
      'ROI impact measurement'
    ],
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20'
  },
  'affiliate-engine': {
    title: 'Affiliate Engine',
    icon: <Share2 className="w-12 h-12" />,
    description: 'Discover and manage affiliate opportunities with smart tracking',
    benefits: [
      'Affiliate opportunity discovery',
      'Commission tracking',
      'Performance analytics',
      'Automated link management',
      'Revenue optimization'
    ],
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20'
  }
};

export default function FeaturePreview() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [featureName, setFeatureName] = useState('');

  useEffect(() => {
    // Extract feature name from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const feature = urlParams.get('feature') || '';
    setFeatureName(feature);
  }, []);

  const feature = featureData[featureName] || {
    title: 'Coming Soon',
    icon: <Zap className="w-12 h-12" />,
    description: 'This feature is currently in development',
    benefits: ['Enhanced functionality', 'Better user experience', 'Advanced capabilities'],
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20'
  };

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Here you would normally send the data to your backend
      // For now, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSubmitted(true);
      setEmail('');
      setFeedback('');
    } catch (error) {
      console.error('Error submitting to waitlist:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            onClick={() => setLocation('/dashboard')}
            variant="ghost"
            className="mb-6 text-white/70 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </motion.div>

        {/* Feature Preview Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className={`bg-white/5 backdrop-blur-sm border ${feature.borderColor} p-8 text-center`}>
            <div className="flex flex-col items-center">
              {/* Feature Icon */}
              <div className={`${feature.bgColor} rounded-full p-6 mb-6 border ${feature.borderColor}`}>
                <div className={feature.color}>
                  {feature.icon}
                </div>
              </div>

              {/* Lock Badge */}
              <Badge variant="outline" className="mb-4 border-orange-500/50 text-orange-400">
                <Lock className="w-3 h-3 mr-1" />
                Coming Soon
              </Badge>

              {/* Feature Title */}
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                {feature.title}
              </h1>

              {/* Feature Description */}
              <p className="text-lg text-white/70 mb-8 max-w-2xl">
                {feature.description}
              </p>

              {/* Benefits List */}
              <div className="grid md:grid-cols-2 gap-4 mb-8 w-full max-w-2xl">
                {feature.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-white/80">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* Coming Soon Info */}
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-6 mb-8 border border-blue-500/30">
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  <span className="font-semibold text-blue-400">Development Status</span>
                </div>
                <p className="text-white/80 text-sm">
                  This feature is currently in active development. Join our waitlist to be the first to know when it's ready!
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Waitlist Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-white/5 backdrop-blur-sm border border-white/10 p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                <Bell className="w-6 h-6 text-blue-400" />
                Join the Waitlist
              </h2>
              <p className="text-white/70">
                Be the first to access {feature.title} when it launches. Get priority access and exclusive updates.
              </p>
            </div>

            {!isSubmitted ? (
              <form onSubmit={handleWaitlistSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white/5 border-white/20 text-white placeholder-white/50"
                  />
                </div>

                <div>
                  <label htmlFor="feedback" className="block text-sm font-medium text-white/80 mb-2">
                    What would you like to see in {feature.title}? (Optional)
                  </label>
                  <Textarea
                    id="feedback"
                    placeholder="Tell us what features or improvements you'd like to see..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="bg-white/5 border-white/20 text-white placeholder-white/50 min-h-[100px]"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Joining Waitlist...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Join the Waitlist
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <div className="text-center">
                <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-6 mb-6">
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-green-400 mb-2">You're on the list!</h3>
                  <p className="text-white/80">
                    Thanks for joining the waitlist for {feature.title}. We'll notify you as soon as it's ready.
                  </p>
                </div>
                
                <Button
                  onClick={() => setLocation('/dashboard')}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Return to Dashboard
                </Button>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-3 gap-6"
        >
          <Card className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 text-center">
            <Users className="w-8 h-8 text-blue-400 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Priority Access</h3>
            <p className="text-white/70 text-sm">
              Waitlist members get early access before public release
            </p>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 text-center">
            <Star className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Exclusive Updates</h3>
            <p className="text-white/70 text-sm">
              Get behind-the-scenes development updates and sneak peeks
            </p>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 text-center">
            <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Shape the Future</h3>
            <p className="text-white/70 text-sm">
              Your feedback helps us build features that truly matter to you
            </p>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 pt-8 border-t border-white/10 text-center"
        >
          <p className="text-sm text-white/40">
            Have questions about this feature? Contact us at{' '}
            <a href="mailto:support@veefore.com" className="text-blue-400 hover:text-blue-300">
              support@veefore.com
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}