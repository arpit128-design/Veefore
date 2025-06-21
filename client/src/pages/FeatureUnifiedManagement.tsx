import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Users, 
  Shield, 
  Zap, 
  Bell, 
  Settings, 
  CheckCircle, 
  ArrowRight,
  PlayCircle,
  Globe,
  Clock,
  Target,
  Activity,
  AlertTriangle,
  Filter,
  UserCheck,
  MessageCircle,
  Inbox
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { useEffect } from 'react';

export default function FeatureUnifiedManagement() {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  const managementFeatures = [
    {
      icon: <Inbox className="w-6 h-6" />,
      title: "Unified Inbox for All Platforms",
      description: "Manage comments, DMs, mentions, and messages from all social platforms in one centralized, easy-to-use inbox.",
      features: ["All platforms in one place", "Smart message categorization", "Priority filtering", "Quick response templates"]
    },
    {
      icon: <UserCheck className="w-6 h-6" />,
      title: "AI-Powered Comment Moderation",
      description: "Automatically detect and filter spam, inappropriate content, and negative comments while highlighting important interactions.",
      features: ["Spam detection", "Sentiment analysis", "Auto-moderation rules", "Custom filters"]
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Smart DM Automation & Routing",
      description: "Intelligent direct message handling with automatic responses, conversation routing, and customer service integration.",
      features: ["Automated responses", "Conversation routing", "CRM integration", "Response templates"]
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Team Collaboration Tools",
      description: "Assign conversations to team members, track response times, and collaborate efficiently on customer interactions.",
      features: ["Team assignment", "Response tracking", "Collaboration notes", "Performance metrics"]
    }
  ];

  const platforms = [
    { name: "Instagram", color: "bg-pink-500", features: ["Posts", "Stories", "DMs", "Comments"] },
    { name: "Facebook", color: "bg-blue-600", features: ["Posts", "Pages", "Messages", "Comments"] },
    { name: "Twitter", color: "bg-blue-400", features: ["Tweets", "DMs", "Mentions", "Replies"] },
    { name: "LinkedIn", color: "bg-blue-700", features: ["Posts", "Messages", "Comments", "InMail"] },
    { name: "TikTok", color: "bg-black", features: ["Videos", "Comments", "DMs", "Mentions"] },
    { name: "YouTube", color: "bg-red-600", features: ["Comments", "Community", "Messages", "Live Chat"] }
  ];

  const benefits = [
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Save 20+ Hours Weekly",
      description: "Streamline all social media management into one efficient workflow",
      metric: "20+ hours saved"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "95% Response Rate",
      description: "Never miss important customer interactions with centralized management",
      metric: "95% response rate"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "10x Team Efficiency",
      description: "Team collaboration tools increase productivity by 10x",
      metric: "10x more efficient"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "99% Spam Blocked",
      description: "AI moderation blocks 99% of spam and inappropriate content",
      metric: "99% protection"
    }
  ];

  const automationFeatures = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Auto-Responses",
      description: "Set up intelligent auto-replies for common questions and inquiries"
    },
    {
      icon: <Filter className="w-6 h-6" />,
      title: "Smart Message Filtering",
      description: "Automatically categorize and prioritize messages based on importance"
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: "Crisis Alert System",
      description: "Get instant notifications for potential PR issues or viral negative content"
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: "Performance Tracking",
      description: "Monitor response times, team performance, and customer satisfaction"
    }
  ];

  const workflowSteps = [
    {
      step: "1",
      title: "Messages Flow In",
      description: "All messages from every platform arrive in your unified inbox",
      icon: <Inbox className="w-6 h-6" />
    },
    {
      step: "2",
      title: "AI Categorization",
      description: "Smart AI automatically categorizes and prioritizes incoming messages",
      icon: <Settings className="w-6 h-6" />
    },
    {
      step: "3",
      title: "Team Assignment",
      description: "Messages are routed to the right team member based on expertise",
      icon: <Users className="w-6 h-6" />
    },
    {
      step: "4",
      title: "Smart Response",
      description: "Send personalized responses or use AI-generated replies",
      icon: <MessageSquare className="w-6 h-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-space-navy text-white overflow-hidden relative">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-space-navy via-orange-900/20 to-red-900/20" />
        {[...Array(45)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-orange-400 rounded-full opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.8, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: Math.random() * 6 + 4,
              repeat: Infinity,
              delay: Math.random() * 3,
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
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">VeeFore</span>
              </div>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link href="/features">
                <Button variant="ghost" className="text-gray-300 hover:text-white">← Back to Features</Button>
              </Link>
              <Link href="/auth">
                <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
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
              className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-r from-orange-500 to-red-600 text-white mb-8"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              <MessageSquare className="w-10 h-10" />
            </motion.div>
            
            <Badge className="mb-6 bg-orange-500/20 text-orange-300 border-orange-500/30 text-lg px-4 py-2">
              <Users className="w-4 h-4 mr-2" />
              Unified Social Media Management
            </Badge>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
              Manage Everything from{' '}
              <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                One Dashboard
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Centralize all your social media interactions, automate responses, moderate content, and collaborate with your team 
              from one powerful dashboard that handles every platform seamlessly.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/auth">
                <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-lg px-10 py-6">
                  Start Managing
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/watch-demo">
                <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800 text-lg px-10 py-6">
                  <PlayCircle className="mr-2 w-5 h-5" />
                  See Management Demo
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Management Dashboard Preview */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700">
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop&crop=center"
                alt="Unified Management Dashboard"
                className="w-full h-96 object-cover rounded-xl"
              />
              <div className="absolute top-12 right-12 bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                Live Management
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Platform Integration */}
      <section className="relative z-10 py-24 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              All Platforms, One Interface
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Manage every social media platform from a single, unified dashboard that brings all your interactions together
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

      {/* Management Workflow */}
      <section className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Streamlined Management Workflow
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              See how our unified system transforms chaotic social media management into an organized, efficient process
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
          >
            {workflowSteps.map((step, index) => (
              <motion.div
                key={index}
                className="text-center relative"
                variants={scaleIn}
              >
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
                <p className="text-gray-300">{step.description}</p>
                
                {index < workflowSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full">
                    <ArrowRight className="w-6 h-6 text-orange-400 mx-auto" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Core Features */}
      <section className="relative z-10 py-24 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Powerful Management Features
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to manage your social media presence professionally and efficiently
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
          >
            {managementFeatures.map((feature, index) => (
              <motion.div key={index} variants={scaleIn}>
                <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all duration-300 h-full">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center text-white">
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

      {/* Automation Features */}
      <section className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Smart Automation Features
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Let AI handle routine tasks while you focus on building meaningful relationships with your audience
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
          >
            {automationFeatures.map((feature, index) => (
              <motion.div
                key={index}
                className="text-center p-8 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-all duration-300"
                variants={scaleIn}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="relative z-10 py-24 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Measurable Results
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              See the impact unified management has on your productivity and customer engagement
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
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6">
                  {benefit.icon}
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-2">
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
              Ready to Unify Your Social Media?
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Join thousands of businesses who've streamlined their social media management with our unified platform
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/auth">
                <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-lg px-10 py-6">
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