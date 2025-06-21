import { motion } from 'framer-motion';
import { 
  Camera, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  Users, 
  Target, 
  CheckCircle, 
  ArrowRight,
  PlayCircle,
  Heart,
  BarChart3,
  Zap,
  PenTool,
  Calendar,
  MessageSquare,
  Star,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { useEffect } from 'react';

export default function SolutionContentCreators() {
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

  const creatorFeatures = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "AI Content Creation",
      description: "Generate endless creative content ideas and captions that match your unique voice and style.",
      features: ["Brand voice matching", "Viral content ideas", "Caption generation", "Hashtag optimization"]
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Smart Scheduling",
      description: "Post at optimal times when your audience is most active, automatically across all platforms.",
      features: ["Optimal timing AI", "Cross-platform posting", "Content calendar", "Bulk scheduling"]
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Creator Analytics",
      description: "Track your growth, engagement, and content performance with creator-focused insights.",
      features: ["Growth tracking", "Engagement metrics", "Content performance", "Audience insights"]
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Audience Engagement",
      description: "Never miss a comment or DM with intelligent engagement tools and auto-responses.",
      features: ["Auto DM responses", "Comment management", "Fan interaction", "Community building"]
    }
  ];

  const benefits = [
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Save 15+ Hours Weekly",
      description: "Automate content creation and posting to focus on what you love",
      metric: "15+ hours saved"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "3x More Engagement",
      description: "AI-optimized content drives significantly higher engagement rates",
      metric: "300% increase"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Grow Your Following",
      description: "Smart strategies help you gain authentic followers faster",
      metric: "500% growth"
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Monetize Better",
      description: "Track and optimize your content for better monetization",
      metric: "400% ROI"
    }
  ];

  const creatorStories = [
    {
      name: "Sarah Johnson",
      platform: "Instagram & TikTok",
      followers: "250K",
      niche: "Lifestyle & Travel",
      story: "VeeFore helped me grow from 10K to 250K followers in just 8 months. The AI content suggestions are incredible - they understand my voice perfectly and help me create viral content consistently.",
      results: ["10x follower growth", "$50K monthly income", "Brand partnerships with Nike, Adobe"]
    },
    {
      name: "Mike Chen",
      platform: "YouTube & Twitter",
      followers: "500K",
      niche: "Tech Reviews",
      story: "As a tech reviewer, I need to post consistently across platforms. VeeFore's scheduling and cross-platform optimization saved me 20 hours per week while doubling my engagement.",
      results: ["20 hours saved weekly", "2x engagement rate", "YouTube Partner Program"]
    },
    {
      name: "Emma Rodriguez",
      platform: "Instagram & Pinterest",
      followers: "180K",
      niche: "Food & Recipes",
      story: "The AI generates amazing recipe captions and suggests the perfect posting times. My food content now reaches 5x more people, and I've launched my own cookbook!",
      results: ["5x reach increase", "Cookbook launch", "Food Network feature"]
    }
  ];

  const platforms = [
    { name: "Instagram", features: ["Stories", "Reels", "Posts", "IGTV"] },
    { name: "TikTok", features: ["Videos", "Sounds", "Effects", "Trends"] },
    { name: "YouTube", features: ["Videos", "Shorts", "Community", "Live"] },
    { name: "Twitter", features: ["Tweets", "Threads", "Spaces", "Fleets"] },
    { name: "Pinterest", features: ["Pins", "Boards", "Stories", "Ideas"] },
    { name: "LinkedIn", features: ["Posts", "Articles", "Stories", "Live"] }
  ];

  return (
    <div className="min-h-screen bg-space-navy text-white overflow-hidden relative">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-space-navy via-pink-900/20 to-rose-900/20" />
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-pink-400 rounded-full opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
              rotate: [0, 180, 360],
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
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg flex items-center justify-center">
                  <Camera className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">VeeFore</span>
              </div>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" className="text-gray-300 hover:text-white">← Back to Home</Button>
              </Link>
              <Link href="/solutions">
                <Button variant="ghost" className="text-gray-300 hover:text-white">All Solutions</Button>
              </Link>
              <Link href="/auth">
                <Button className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700">
                  Start Creating
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
              className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-r from-pink-500 to-rose-600 text-white mb-8"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              <Camera className="w-10 h-10" />
            </motion.div>
            
            <Badge className="mb-6 bg-pink-500/20 text-pink-300 border-pink-500/30 text-lg px-4 py-2">
              <Heart className="w-4 h-4 mr-2" />
              For Content Creators
            </Badge>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
              Create, Grow, and{' '}
              <span className="bg-gradient-to-r from-pink-400 to-rose-500 bg-clip-text text-transparent">
                Monetize
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Join thousands of successful content creators who use VeeFore to streamline their workflow, 
              grow their audience, and turn their passion into a thriving business with AI-powered tools.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/auth">
                <Button size="lg" className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-lg px-10 py-6">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/watch-demo">
                <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800 text-lg px-10 py-6">
                  <PlayCircle className="mr-2 w-5 h-5" />
                  Watch Creator Demo
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Creator showcase image */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700">
              <img 
                src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&h=600&fit=crop&crop=center"
                alt="Content Creator Dashboard"
                className="w-full h-96 object-cover rounded-xl"
              />
              <div className="absolute top-12 right-12 bg-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                Creator Mode
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
              Create Everywhere Your Audience Is
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Reach your audience across all major platforms with content optimized for each platform's unique format and algorithm
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
                <h3 className="text-xl font-bold text-white mb-4">{platform.name}</h3>
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

      {/* Creator Features */}
      <section className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Built for Creators, By Creators
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Every feature designed specifically to help content creators grow their audience and build their brand
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
          >
            {creatorFeatures.map((feature, index) => (
              <motion.div key={index} variants={scaleIn}>
                <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all duration-300 h-full">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg flex items-center justify-center text-white">
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

      {/* Success Stories */}
      <section className="relative z-10 py-24 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Real Creator Success Stories
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              See how creators like you have transformed their content strategy and grown their audience with VeeFore
            </p>
          </motion.div>

          <motion.div 
            className="space-y-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
          >
            {creatorStories.map((story, index) => (
              <motion.div
                key={index}
                className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8"
                variants={scaleIn}
                whileHover={{ scale: 1.02 }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                  <div className="lg:col-span-2">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {story.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{story.name}</h3>
                        <p className="text-pink-400">{story.platform} • {story.followers} followers</p>
                        <p className="text-gray-400">{story.niche}</p>
                      </div>
                    </div>
                    <p className="text-gray-300 text-lg mb-6 italic">"{story.story}"</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-6">
                    <h4 className="text-white font-semibold mb-4">Results Achieved:</h4>
                    <div className="space-y-2">
                      {story.results.map((result, i) => (
                        <div key={i} className="flex items-center text-green-400">
                          <Star className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="text-sm">{result}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
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
              Transform Your Creator Journey
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              See the measurable impact VeeFore has on your content creation workflow and growth
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
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6">
                  {benefit.icon}
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-rose-500 bg-clip-text text-transparent mb-2">
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
              Ready to Level Up Your Content?
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Join over 50,000 creators who've transformed their content strategy and grown their audience with VeeFore
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/auth">
                <Button size="lg" className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-lg px-10 py-6">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800 text-lg px-10 py-6">
                  Talk to Creator Success Team
                </Button>
              </Link>
            </div>
            
            <p className="text-gray-400 mt-8">
              ✓ 14-day free trial • ✓ No credit card required • ✓ Creator-focused support
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}