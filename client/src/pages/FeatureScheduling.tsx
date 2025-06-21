import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Zap, 
  Globe, 
  Users, 
  Target, 
  CheckCircle, 
  ArrowRight,
  PlayCircle,
  TrendingUp,
  Settings,
  BarChart3,
  MessageSquare,
  RefreshCw,
  Bell,
  Smartphone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';

export default function FeatureScheduling() {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const scaleIn = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5 }
  };

  const features = [
    {
      icon: <Clock className="w-6 h-6" />,
      title: "AI-Optimized Timing",
      description: "Our AI analyzes your audience activity patterns across platforms to determine the perfect posting times for maximum engagement.",
      features: ["Platform-specific timing", "Audience behavior analysis", "Peak engagement detection", "Time zone optimization"]
    },
    {
      icon: <RefreshCw className="w-6 h-6" />,
      title: "Cross-Platform Adaptation",
      description: "Automatically adapt your content format, sizing, and messaging for each social media platform's unique requirements.",
      features: ["Format optimization", "Character limit adaptation", "Image sizing", "Platform-specific hashtags"]
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Automated Responses",
      description: "Set up intelligent auto-responses for comments and DMs that maintain authentic engagement while you sleep.",
      features: ["Context-aware replies", "Custom response rules", "Spam filtering", "Brand voice consistency"]
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Smart Queue Management",
      description: "Intelligent bulk scheduling with automatic spacing, duplicate detection, and content variety optimization.",
      features: ["Optimal spacing", "Content balancing", "Duplicate prevention", "Queue visualization"]
    }
  ];

  const benefits = [
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Save 15+ Hours Weekly",
      description: "Automate your entire posting schedule and reclaim your time",
      metric: "15+ hours saved"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "300% More Engagement",
      description: "AI timing optimization dramatically increases audience interaction",
      metric: "300% boost"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Reach",
      description: "Optimize posting times for audiences across multiple time zones",
      metric: "24/7 coverage"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "99% Accuracy",
      description: "Never miss a scheduled post with our reliable automation system",
      metric: "99% uptime"
    }
  ];

  const platforms = [
    { name: "Instagram", color: "bg-pink-500", features: ["Stories", "Reels", "Posts", "IGTV"] },
    { name: "Twitter", color: "bg-blue-400", features: ["Tweets", "Threads", "Polls", "Spaces"] },
    { name: "Facebook", color: "bg-blue-600", features: ["Posts", "Stories", "Events", "Pages"] },
    { name: "LinkedIn", color: "bg-blue-700", features: ["Posts", "Articles", "Videos", "Stories"] },
    { name: "TikTok", color: "bg-black", features: ["Videos", "Sounds", "Effects", "Duets"] },
    { name: "YouTube", color: "bg-red-600", features: ["Videos", "Shorts", "Community", "Live"] }
  ];

  const automationWorkflow = [
    {
      step: "1",
      title: "Create Content",
      description: "Use AI to generate or upload your content",
      icon: <Settings className="w-6 h-6" />
    },
    {
      step: "2", 
      title: "AI Analysis",
      description: "Our AI analyzes optimal posting times and audience patterns",
      icon: <BarChart3 className="w-6 h-6" />
    },
    {
      step: "3",
      title: "Smart Scheduling",
      description: "Content is automatically scheduled for peak engagement times",
      icon: <Calendar className="w-6 h-6" />
    },
    {
      step: "4",
      title: "Auto Publishing",
      description: "Posts are published automatically across all platforms",
      icon: <Zap className="w-6 h-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-space-navy text-white overflow-hidden relative">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-space-navy via-purple-900/20 to-pink-900/20" />
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-400 rounded-full opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
              y: [0, -20, 0],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.header 
        className="relative z-10 border-b border-slate-800 bg-space-navy/80 backdrop-blur-md"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">VeeFore</span>
              </div>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link href="/features">
                <Button variant="ghost" className="text-gray-300 hover:text-white">← Back to Features</Button>
              </Link>
              <Link href="/auth">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700">
                  Try Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-r from-purple-500 to-pink-600 text-white mb-8"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              <Calendar className="w-10 h-10" />
            </motion.div>
            
            <Badge className="mb-6 bg-purple-500/20 text-purple-300 border-purple-500/30 text-lg px-4 py-2">
              <Clock className="w-4 h-4 mr-2" />
              Intelligent Scheduling & Automation
            </Badge>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
              Schedule Smarter with{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                AI Automation
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Let AI handle your entire posting schedule. Our intelligent system analyzes audience behavior, 
              optimizes timing, and publishes content automatically across all platforms for maximum engagement.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/auth">
                <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-lg px-10 py-6">
                  Start Automating
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/watch-demo">
                <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800 text-lg px-10 py-6">
                  <PlayCircle className="mr-2 w-5 h-5" />
                  See It in Action
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Feature visualization */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700">
              <img 
                src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1200&h=600&fit=crop&crop=center"
                alt="Smart Scheduling Dashboard"
                className="w-full h-96 object-cover rounded-xl"
              />
              <div className="absolute top-12 right-12 bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                Auto-Schedule Active
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Platform Support */}
      <section className="relative z-10 py-24 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              All Your Platforms, One Schedule
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Schedule and automate content across every major social media platform with platform-specific optimizations
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
          >
            {platforms.map((platform, index) => (
              <motion.div
                key={index}
                className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 hover:border-slate-600 transition-all duration-300"
                variants={scaleIn}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`w-12 h-12 ${platform.color} rounded-xl flex items-center justify-center text-white font-bold`}>
                    {platform.name[0]}
                  </div>
                  <h3 className="text-xl font-bold text-white">{platform.name}</h3>
                </div>
                <div className="space-y-2">
                  {platform.features.map((feature, i) => (
                    <div key={i} className="flex items-center text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Automation Workflow */}
      <section className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              How Smart Automation Works
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              From content creation to publishing, see how our AI handles your entire social media workflow
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
          >
            {automationWorkflow.map((step, index) => (
              <motion.div
                key={index}
                className="text-center relative"
                variants={scaleIn}
              >
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
                <p className="text-gray-300">{step.description}</p>
                
                {index < automationWorkflow.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full">
                    <ArrowRight className="w-6 h-6 text-purple-400 mx-auto" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Detail */}
      <section className="relative z-10 py-24 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Advanced Scheduling Features
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Every feature designed to make your social media management effortless and effective
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={scaleIn}>
                <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all duration-300 h-full">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center text-white">
                        {feature.icon}
                      </div>
                      <CardTitle className="text-2xl text-white">{feature.title}</CardTitle>
                    </div>
                    <CardDescription className="text-gray-300 text-lg leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {feature.features.map((item, i) => (
                        <div key={i} className="flex items-center text-gray-300">
                          <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Measurable Impact
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              See the real results our intelligent scheduling delivers for your social media growth
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="text-center p-8 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-all duration-300"
                variants={scaleIn}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6">
                  {benefit.icon}
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-2">
                  {benefit.metric}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{benefit.title}</h3>
                <p className="text-gray-300">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-8">
              Ready to Automate Your Success?
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Join thousands of creators who save 15+ hours weekly with intelligent scheduling
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/auth">
                <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-lg px-10 py-6">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800 text-lg px-10 py-6">
                  Schedule Demo
                </Button>
              </Link>
            </div>
            
            <p className="text-gray-400 mt-8">
              ✓ 14-day free trial • ✓ No credit card required • ✓ Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}