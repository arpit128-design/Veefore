import { motion } from 'framer-motion';
import { 
  BrainCircuit, 
  Sparkles, 
  Wand2, 
  Target, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  PlayCircle,
  Clock,
  Users,
  TrendingUp,
  Lightbulb,
  Settings,
  PenTool,
  ImageIcon,
  Video,
  Hash,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { useEffect } from 'react';

export default function FeatureAIContent() {
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

  const capabilities = [
    {
      icon: <PenTool className="w-6 h-6" />,
      title: "Smart Caption Generation",
      description: "AI analyzes your brand voice, audience preferences, and trending topics to create compelling captions that drive engagement.",
      features: ["Brand voice matching", "Tone adaptation", "Audience-specific language", "Trending topic integration"]
    },
    {
      icon: <Hash className="w-6 h-6" />,
      title: "Intelligent Hashtag Research",
      description: "Discover high-performing hashtags tailored to your content, industry, and target audience for maximum reach.",
      features: ["Real-time trending analysis", "Competitor hashtag insights", "Niche-specific recommendations", "Performance tracking"]
    },
    {
      icon: <ImageIcon className="w-6 h-6" />,
      title: "AI Image Creation",
      description: "Generate stunning visuals using advanced AI models like DALL-E 3, perfectly aligned with your content strategy.",
      features: ["Multiple art styles", "Brand consistency", "Custom prompts", "High-resolution output"]
    },
    {
      icon: <Video className="w-6 h-6" />,
      title: "Video Content Generation",
      description: "Create engaging video content with AI-powered editing, effects, and optimization for each social platform.",
      features: ["Automatic editing", "Platform optimization", "Effect generation", "Music integration"]
    }
  ];

  const benefits = [
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Save 90% Time",
      description: "Reduce content creation time from hours to minutes",
      metric: "90% faster"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Boost Engagement",
      description: "AI-optimized content shows 300% higher engagement rates",
      metric: "300% increase"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Expand Reach",
      description: "Intelligent hashtags and timing increase organic reach",
      metric: "500% growth"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Perfect Targeting",
      description: "AI learns your audience to create perfectly targeted content",
      metric: "95% accuracy"
    }
  ];

  const useCases = [
    {
      title: "Content Creators",
      description: "Generate endless content ideas and execute them flawlessly",
      example: "A fitness influencer uses AI to create 30 workout posts with engaging captions in under 10 minutes"
    },
    {
      title: "Small Businesses",
      description: "Professional content without hiring expensive agencies",
      example: "A local restaurant creates mouth-watering food posts with perfect descriptions and trending hashtags"
    },
    {
      title: "Marketing Agencies",
      description: "Scale content production for multiple clients efficiently",
      example: "An agency manages 50+ client accounts with consistent, high-quality AI-generated content"
    }
  ];

  return (
    <div className="min-h-screen bg-space-navy text-white overflow-hidden relative">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-space-navy via-purple-900/20 to-blue-900/20" />
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
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
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <BrainCircuit className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">VeeFore</span>
              </div>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link href="/features">
                <Button variant="ghost" className="text-gray-300 hover:text-white">← Back to Features</Button>
              </Link>
              <Link href="/auth">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
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
              className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-r from-blue-500 to-purple-600 text-white mb-8"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              <BrainCircuit className="w-10 h-10" />
            </motion.div>
            
            <Badge className="mb-6 bg-blue-500/20 text-blue-300 border-blue-500/30 text-lg px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Content Creation
            </Badge>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
              Create Engaging Content with{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Advanced AI
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Transform your social media strategy with AI that understands your brand voice, creates compelling content, 
              and generates viral-worthy posts in seconds. Say goodbye to creative blocks forever.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/auth">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-10 py-6">
                  Start Creating Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/watch-demo">
                <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800 text-lg px-10 py-6">
                  <PlayCircle className="mr-2 w-5 h-5" />
                  Watch Demo
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Feature Image/GIF Placeholder */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop&crop=center"
                alt="AI Content Creation Dashboard"
                className="w-full h-96 object-cover rounded-xl"
              />
              <div className="absolute top-12 right-12 bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                Live Demo
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section className="relative z-10 py-24 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Powerful AI Capabilities
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our advanced AI doesn't just generate content—it understands your brand, analyzes trends, 
              and creates content that resonates with your specific audience.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
          >
            {capabilities.map((capability, index) => (
              <motion.div key={index} variants={scaleIn}>
                <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all duration-300 h-full">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                        {capability.icon}
                      </div>
                      <CardTitle className="text-2xl text-white">{capability.title}</CardTitle>
                    </div>
                    <CardDescription className="text-gray-300 text-lg leading-relaxed">
                      {capability.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {capability.features.map((feature, i) => (
                        <div key={i} className="flex items-center text-gray-300">
                          <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                          <span>{feature}</span>
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

      {/* Benefits Section */}
      <section className="relative z-10 py-24">
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
              See the dramatic impact AI content creation has on your social media performance
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
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6">
                  {benefit.icon}
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
                  {benefit.metric}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{benefit.title}</h3>
                <p className="text-gray-300">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="relative z-10 py-24 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Perfect for Every Creator
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              See how different types of creators use AI content generation to transform their social media presence
            </p>
          </motion.div>

          <motion.div 
            className="space-y-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
          >
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8"
                variants={scaleIn}
                whileHover={{ scale: 1.02 }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">{useCase.title}</h3>
                    <p className="text-gray-300 text-lg mb-6">{useCase.description}</p>
                    <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
                      <p className="text-blue-300 italic">"{useCase.example}"</p>
                    </div>
                  </div>
                  <div className="relative">
                    <img 
                      src={`https://images.unsplash.com/photo-${index === 0 ? '1571019613454-1cb2f99b2d8b' : index === 1 ? '1556909114-f6e7ad7d3136' : '1552664730-d307ca884978'}?w=600&h=400&fit=crop&crop=center`}
                      alt={useCase.title}
                      className="w-full h-64 object-cover rounded-xl"
                    />
                  </div>
                </div>
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
              Ready to Transform Your Content?
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Join thousands of creators who've revolutionized their social media with AI-powered content creation
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/auth">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-10 py-6">
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