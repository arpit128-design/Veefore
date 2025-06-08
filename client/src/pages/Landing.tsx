import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Rocket, 
  Brain, 
  Users, 
  TrendingUp, 
  Bot, 
  MessageCircle, 
  BarChart3, 
  Calendar,
  Sparkles,
  Target,
  Globe,
  Hash,
  Instagram,
  ArrowRight,
  Check,
  Star,
  Play,
  ChevronDown,
  Crown,
  Infinity,
  Layers,
  Activity,
  Eye,
  FileText,
  Zap,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';

// Simple Animation Components
const AnimatedCounter = ({ end, suffix = "" }: { end: number; suffix?: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prev => {
        if (prev < end) {
          return Math.min(prev + Math.ceil(end / 100), end);
        }
        return end;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [end]);

  return <span>{count}{suffix}</span>;
};

const FadeInWhenVisible = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay }}
  >
    {children}
  </motion.div>
);

const Landing = () => {
  const [currentFeature, setCurrentFeature] = useState(0);

  const heroFeatures = [
    "AI-Powered Content Generation",
    "Instagram Business API Integration", 
    "Real-Time Analytics Dashboard",
    "Automated DM & Comment Responses",
    "Cross-Platform Management",
    "Viral Hashtag Discovery"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % heroFeatures.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const coreFeatures = [
    {
      icon: Brain,
      title: "Advanced AI Content Creation",
      description: "Generate high-quality posts, stories, and reels with cutting-edge AI that understands your brand voice and audience preferences.",
      details: [
        "GPT-4 powered content generation",
        "Brand voice customization",
        "Multi-language support (Hindi/English/Hinglish)",
        "Content optimization for virality",
        "Image and video generation"
      ],
      color: "from-purple-500 to-blue-500"
    },
    {
      icon: Instagram,
      title: "Instagram Business API Integration",
      description: "Full Instagram Business API integration with real-time data synchronization, media management, and authentic analytics.",
      details: [
        "Instagram Business API certified",
        "Real-time follower & engagement tracking",
        "Media publishing & scheduling",
        "Stories & Reels automation",
        "Hashtag performance analysis"
      ],
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: Bot,
      title: "100% DM Automation Response",
      description: "Intelligent AI responses to all direct messages with contextual understanding and personalized replies.",
      details: [
        "Contextual AI conversations",
        "Lead qualification automation",
        "Multi-language DM responses",
        "Custom response templates",
        "Human handoff triggers"
      ],
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: MessageCircle,
      title: "Smart Comment Management",
      description: "Automated comment responses with anti-spam protection and engagement optimization strategies.",
      details: [
        "Intelligent comment filtering",
        "Automated engagement responses",
        "Spam detection & blocking",
        "Sentiment analysis",
        "Community building automation"
      ],
      color: "from-orange-500 to-yellow-500"
    },
    {
      icon: BarChart3,
      title: "Real-Time Analytics Dashboard",
      description: "Comprehensive analytics with authentic Instagram Business data, growth tracking, and performance insights.",
      details: [
        "Real-time engagement metrics",
        "Follower growth analysis",
        "Content performance tracking",
        "Reach & impression analytics",
        "ROI & conversion tracking"
      ],
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Hash,
      title: "Viral Hashtag Discovery",
      description: "AI-powered hashtag research and optimization to maximize content reach and discoverability.",
      details: [
        "Trending hashtag analysis",
        "Competition research",
        "Hashtag performance tracking",
        "Niche-specific recommendations",
        "Viral potential scoring"
      ],
      color: "from-violet-500 to-purple-500"
    },
    {
      icon: Calendar,
      title: "Advanced Content Scheduling",
      description: "Smart scheduling system with optimal timing analysis and cross-platform publishing capabilities.",
      details: [
        "AI-optimized posting times",
        "Bulk content scheduling",
        "Multi-platform publishing",
        "Content calendar management",
        "Timezone optimization"
      ],
      color: "from-red-500 to-pink-500"
    },
    {
      icon: Globe,
      title: "Multi-Platform Management",
      description: "Manage multiple social media platforms from one unified dashboard with cross-platform analytics.",
      details: [
        "Instagram, YouTube, Twitter, Facebook",
        "Unified content creation",
        "Cross-platform analytics",
        "Multi-account management",
        "Platform-specific optimization"
      ],
      color: "from-lime-500 to-green-500"
    }
  ];

  const advancedFeatures = [
    { icon: Target, title: "AI Audience Targeting", description: "Advanced audience analysis and targeting for maximum engagement." },
    { icon: Crown, title: "Brand Voice AI Training", description: "Train AI to perfectly match your brand's unique voice and style." },
    { icon: Layers, title: "Content Template Library", description: "Extensive library of proven templates for posts, stories, and campaigns." },
    { icon: Activity, title: "Engagement Rate Optimization", description: "AI-driven strategies to boost engagement and build community." },
    { icon: Eye, title: "Competitor Analysis", description: "Monitor competitors and identify opportunities for growth." },
    { icon: Infinity, title: "Unlimited Content Generation", description: "Generate unlimited content with no restrictions on Pro plans." }
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "₹0",
      period: "/month",
      description: "Perfect for getting started",
      features: [
        "1 Workspace",
        "Basic AI Content Generation",
        "1 Social Account",
        "Basic Analytics",
        "Community Support"
      ],
      limitations: [
        "Limited to 10 posts/month",
        "Basic templates only",
        "No DM automation"
      ],
      popular: false
    },
    {
      name: "Pro",
      price: "₹999",
      period: "/month",
      description: "For growing businesses and creators",
      features: [
        "5 Workspaces",
        "Advanced AI Content Generation",
        "5 Social Accounts",
        "Real-time Analytics",
        "DM Automation (100 responses/day)",
        "Comment Management",
        "Content Scheduling",
        "Hashtag Research",
        "Priority Support"
      ],
      limitations: [],
      popular: true
    },
    {
      name: "Enterprise",
      price: "₹2,999",
      period: "/month",
      description: "For agencies and large businesses",
      features: [
        "Unlimited Workspaces",
        "Enterprise AI Features",
        "Unlimited Social Accounts",
        "Advanced Analytics & Reports",
        "Unlimited DM Automation",
        "White-label Solution",
        "API Access",
        "Custom Integrations",
        "Dedicated Account Manager",
        "24/7 Priority Support"
      ],
      limitations: [],
      popular: false
    }
  ];

  const stats = [
    { label: "Content Generated", value: "2M+", icon: FileText },
    { label: "DMs Automated", value: "500K+", icon: MessageCircle },
    { label: "Businesses Served", value: "10K+", icon: Users },
    { label: "Engagement Increase", value: "300%", icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[conic-gradient(from_90deg_at_50%_50%,transparent,rgba(120,119,198,0.05),transparent)]" />
      </div>

      {/* Floating Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center max-w-6xl mx-auto"
        >
          {/* Hero Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 text-lg border-0">
              <Sparkles className="w-4 h-4 mr-2" />
              The Future of Social Media Management
            </Badge>
          </motion.div>

          {/* Main Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
          >
            VeeFore
          </motion.h1>

          {/* Dynamic Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-2xl md:text-4xl font-semibold mb-4 h-16 flex items-center justify-center"
          >
            <motion.span
              key={currentFeature}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
            >
              {heroFeatures[currentFeature]}
            </motion.span>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            Transform your social media presence with cutting-edge AI technology. 
            Automate content creation, engage audiences intelligently, and scale your business 
            with authentic Instagram Business API integration.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          >
            <Link href="/onboarding">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-12 py-4 text-xl font-semibold rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-500/25"
              >
                <Rocket className="w-6 h-6 mr-3" />
                Start Free Trial
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-white/30 text-white hover:bg-white/10 px-12 py-4 text-xl font-semibold rounded-full backdrop-blur-sm"
            >
              <Play className="w-6 h-6 mr-3" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/20 mb-4">
                    <IconComponent className="w-8 h-8 text-blue-400" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">
                    <AnimatedCounter end={parseInt(stat.value.replace(/[^\d]/g, ''))} suffix={stat.value.replace(/[\d]/g, '')} />
                  </div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex flex-col items-center text-white/60"
          >
            <span className="text-sm mb-2">Scroll to explore</span>
            <ChevronDown className="w-6 h-6" />
          </motion.div>
        </motion.div>
      </section>

      {/* Core Features Section */}
      <section className="relative py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <FadeInWhenVisible>
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Powerful Features
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Discover the comprehensive suite of AI-powered tools designed to transform your social media strategy
              </p>
            </div>
          </FadeInWhenVisible>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreFeatures.map((feature, index) => (
              <FadeInWhenVisible key={index} delay={index * 0.1}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="p-8 bg-gradient-to-br from-gray-900/50 to-black/50 border-gray-800 hover:border-gray-600 transition-all duration-500 backdrop-blur-sm group h-full">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon size={32} className="text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-blue-400 transition-colors">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-300 mb-6 leading-relaxed">
                      {feature.description}
                    </p>

                    <ul className="space-y-3">
                      {feature.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-center text-sm text-gray-400">
                          <Check className="w-4 h-4 mr-3 text-green-400 flex-shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </Card>
                </motion.div>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Features Grid */}
      <section className="relative py-32 px-4 bg-gradient-to-br from-purple-900/10 to-blue-900/10">
        <div className="max-w-7xl mx-auto">
          <FadeInWhenVisible>
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Advanced Capabilities
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Next-generation features that give you the competitive edge in social media marketing
              </p>
            </div>
          </FadeInWhenVisible>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advancedFeatures.map((feature, index) => (
              <FadeInWhenVisible key={index} delay={index * 0.1}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="p-6 bg-gradient-to-br from-gray-900/30 to-black/30 border-gray-800 hover:border-gray-600 transition-all duration-300 backdrop-blur-sm group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <feature.icon size={24} className="text-white" />
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-3 text-white group-hover:text-blue-400 transition-colors">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </Card>
                </motion.div>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Business API Section */}
      <section className="relative py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeInWhenVisible>
              <div>
                <Badge className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-4 py-2 mb-6 border-0">
                  <Instagram className="w-4 h-4 mr-2" />
                  Certified Instagram Business API
                </Badge>
                
                <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  Authentic Instagram Integration
                </h2>
                
                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  Direct integration with Instagram Business API ensures 100% authentic data, 
                  real-time synchronization, and compliance with Meta's latest policies.
                </p>

                <div className="space-y-6">
                  {[
                    "Real-time follower & engagement tracking",
                    "Direct media publishing & scheduling", 
                    "Authentic reach & impression analytics",
                    "Stories & Reels automation",
                    "Hashtag performance insights",
                    "Comment & DM management"
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center mr-4 flex-shrink-0">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-lg text-gray-300">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </FadeInWhenVisible>

            <FadeInWhenVisible delay={0.3}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-2xl blur-xl" />
                <Card className="relative p-8 bg-gradient-to-br from-pink-900/20 to-purple-900/20 border-pink-500/30">
                  <div className="flex items-center mb-6">
                    <Instagram className="w-8 h-8 text-pink-400 mr-3" />
                    <span className="text-xl font-semibold">@arpit9996363</span>
                    <Badge className="ml-auto bg-green-500/20 text-green-400 border-0">Connected</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-2">
                        <AnimatedCounter end={8} />
                      </div>
                      <div className="text-gray-400">Followers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-2">
                        <AnimatedCounter end={15} />
                      </div>
                      <div className="text-gray-400">Posts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-2">
                        <AnimatedCounter end={639} />
                      </div>
                      <div className="text-gray-400">Total Reach</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-pink-400 mb-2">
                        25.83%
                      </div>
                      <div className="text-gray-400">Engagement</div>
                    </div>
                  </div>

                  <div className="text-center text-green-400 text-sm">
                    ✓ Real-time data from Instagram Business API
                  </div>
                </Card>
              </div>
            </FadeInWhenVisible>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative py-32 px-4 bg-gradient-to-br from-blue-900/10 to-purple-900/10">
        <div className="max-w-7xl mx-auto">
          <FadeInWhenVisible>
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Choose Your Plan
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Flexible pricing designed to grow with your business, from startups to enterprises
              </p>
            </div>
          </FadeInWhenVisible>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <FadeInWhenVisible key={index} delay={index * 0.2}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className={`relative p-8 transition-all duration-300 backdrop-blur-sm ${
                    plan.popular 
                      ? 'bg-gradient-to-br from-blue-900/50 to-purple-900/50 border-blue-500/50 scale-105' 
                      : 'bg-gradient-to-br from-gray-900/50 to-black/50 border-gray-800 hover:border-gray-600'
                  }`}>
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 border-0">
                          <Crown className="w-4 h-4 mr-2" />
                          Most Popular
                        </Badge>
                      </div>
                    )}

                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                      <div className="mb-4">
                        <span className="text-4xl font-bold text-blue-400">
                          {plan.price}
                        </span>
                        <span className="text-gray-400">{plan.period}</span>
                      </div>
                      <p className="text-gray-400">{plan.description}</p>
                    </div>

                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <Check className="w-5 h-5 mr-3 text-green-400 flex-shrink-0" />
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link href="/onboarding">
                      <Button 
                        className={`w-full py-4 font-semibold rounded-xl transition-all duration-300 ${
                          plan.popular
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                            : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                        }`}
                      >
                        {plan.name === 'Free' ? 'Get Started' : 'Start Free Trial'}
                      </Button>
                    </Link>
                  </Card>
                </motion.div>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-4 bg-gradient-to-br from-purple-900/20 to-blue-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <FadeInWhenVisible>
            <h2 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Ready to Transform Your Social Media?
            </h2>
            
            <p className="text-xl text-gray-300 mb-12 leading-relaxed">
              Join thousands of businesses already using VeeFore to automate their social media, 
              engage audiences intelligently, and drive real growth with AI-powered strategies.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/onboarding">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-12 py-4 text-xl font-semibold rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-500/25"
                >
                  <Rocket className="w-6 h-6 mr-3" />
                  Start Your Free Trial
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-white/30 text-white hover:bg-white/10 px-12 py-4 text-xl font-semibold rounded-full backdrop-blur-sm"
              >
                <MessageCircle className="w-6 h-6 mr-3" />
                Contact Sales
              </Button>
            </div>

            <p className="text-gray-400 mt-8">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-gray-800 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
              VeeFore
            </h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              The future of AI-powered social media management. Transform your digital presence 
              with intelligent automation and authentic engagement.
            </p>
          </div>

          <div className="text-center text-gray-500">
            <p>&copy; 2025 VeeFore. All rights reserved. | Made with ❤️ for the future of social media.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;