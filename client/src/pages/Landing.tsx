import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLocation } from 'wouter';
import { 
  Rocket, 
  Sparkles, 
  Star, 
  TrendingUp, 
  Instagram, 
  Calendar, 
  BarChart3, 
  Lightbulb, 
  Users, 
  Building, 
  ChevronDown,
  Play,
  ArrowRight,
  Zap,
  Globe,
  Brain,
  Target,
  Video,
  Camera,
  Palette,
  Code2,
  Shield,
  Clock,
  Heart,
  CheckCircle
} from 'lucide-react';
import { SpaceBackground } from '@/components/ui/space-background';

// Floating 3D Card Component
const FloatingCard = ({ children, delay = 0, ...props }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 100, rotateX: -15 }}
    whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
    viewport={{ once: true }}
    transition={{ 
      duration: 0.8, 
      delay,
      type: "spring",
      stiffness: 100
    }}
    whileHover={{ 
      y: -10, 
      rotateX: 5,
      scale: 1.02,
      transition: { duration: 0.3 }
    }}
    className="transform-gpu perspective-1000"
    {...props}
  >
    {children}
  </motion.div>
);

// Feature Card with 3D Hover Effects
const FeatureCard = ({ icon: Icon, title, description, gradient, delay = 0 }: any) => (
  <FloatingCard delay={delay}>
    <Card className="group bg-white/5 backdrop-blur-xl border-white/10 hover:border-white/20 transition-all duration-500 h-full overflow-hidden relative">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
      
      <CardContent className="p-8 relative z-10">
        <motion.div
          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-6 relative overflow-hidden`}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.3 }}
        >
          <Icon className="w-8 h-8 text-white relative z-10" />
          
          {/* Shimmer Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </motion.div>
        
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
          {title}
        </h3>
        
        <p className="text-white/70 leading-relaxed">
          {description}
        </p>
        
        {/* Glow Effect */}
        <motion.div
          className={`absolute -inset-1 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </CardContent>
    </Card>
  </FloatingCard>
);

// Stats Counter Animation
const StatCounter = ({ end, label, prefix = "", suffix = "" }: any) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const increment = end / 100;
      const updateCount = () => {
        setCount((prev) => {
          const next = prev + increment;
          return next >= end ? end : next;
        });
      };
      
      const interval = setInterval(updateCount, 30);
      setTimeout(() => clearInterval(interval), 3000);
    }, 500);

    return () => clearTimeout(timer);
  }, [end]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      <motion.div 
        className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {prefix}{Math.floor(count)}{suffix}
      </motion.div>
      <div className="text-white/70 text-lg">{label}</div>
    </motion.div>
  );
};

export default function Landing() {
  const [, setLocation] = useLocation();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);
  const opacity = useTransform(scrollY, [0, 200], [1, 0]);

  const features = [
    {
      icon: Brain,
      title: "AI Content Studio",
      description: "Generate viral posts, reels, and stories with advanced AI that learns from your brand voice and audience preferences.",
      gradient: "from-blue-500 to-purple-600"
    },
    {
      icon: Calendar,
      title: "Smart Scheduler",
      description: "Schedule content across all platforms with optimal timing suggestions based on audience activity patterns.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Track engagement, reach, and growth with beautiful visualizations and actionable insights from connected accounts.",
      gradient: "from-green-500 to-teal-500"
    },
    {
      icon: Lightbulb,
      title: "AI Suggestions",
      description: "Get personalized content ideas, trending hashtags, and optimization tips powered by machine learning.",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: Users,
      title: "Multi-Platform",
      description: "Manage Instagram, X (Twitter), YouTube, TikTok, and LinkedIn from one unified dashboard.",
      gradient: "from-indigo-500 to-blue-500"
    },
    {
      icon: Building,
      title: "Workspace Management",
      description: "Organize multiple brands, clients, or projects with dedicated workspaces and team collaboration tools.",
      gradient: "from-pink-500 to-rose-500"
    }
  ];

  const integrations = [
    { name: "Instagram", icon: Instagram, color: "from-pink-500 to-orange-500" },
    { name: "X (Twitter)", icon: Code2, color: "from-gray-700 to-black" },
    { name: "YouTube", icon: Video, color: "from-red-600 to-red-500" },
    { name: "TikTok", icon: Camera, color: "from-black to-gray-800" },
    { name: "LinkedIn", icon: Building, color: "from-blue-600 to-blue-700" }
  ];

  return (
    <div className="min-h-screen bg-space-navy text-white overflow-hidden">
      <SpaceBackground />
      
      {/* Navigation */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                VeeFore
              </span>
            </motion.div>
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/10"
                onClick={() => setLocation('/auth')}
              >
                Sign In
              </Button>
              <Button 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                onClick={() => setLocation('/auth')}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative pt-16">
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"
          style={{ y: y1, opacity }}
        >
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-12"
          >
            <motion.div
              className="inline-block mb-6"
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 3, repeat: Infinity }
              }}
            >
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center relative overflow-hidden">
                <Rocket className="w-12 h-12 text-white relative z-10" />
                
                {/* Orbital Rings */}
                <motion.div 
                  className="absolute inset-0 border-2 border-white/20 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                />
                <motion.div 
                  className="absolute inset-2 border border-white/10 rounded-full"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
              </div>
            </motion.div>

            <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
              <motion.span 
                className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{ backgroundSize: "200% 200%" }}
              >
                VeeFore
              </motion.span>
            </h1>
            
            <motion.h2 
              className="text-2xl md:text-4xl text-white/90 mb-8 font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              AI-Powered Social Media Galaxy
            </motion.h2>
            
            <motion.p 
              className="text-xl text-white/70 max-w-3xl mx-auto mb-12 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 1 }}
            >
              Transform your social media presence with intelligent content creation, 
              advanced analytics, and seamless multi-platform management. 
              Join thousands of creators who've revolutionized their digital strategy.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              <Button 
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-xl shadow-blue-500/25 relative overflow-hidden group"
                onClick={() => setLocation('/auth')}
              >
                {/* Shimmer Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                
                <span className="relative z-10 flex items-center">
                  Launch Your Galaxy
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
              
              <Button 
                variant="outline"
                size="lg"
                className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg backdrop-blur-sm"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown className="w-8 h-8 text-white/50" />
          </motion.div>
        </motion.div>

        {/* Floating Elements */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-4 h-4 bg-blue-500 rounded-full"
          animate={{ 
            y: [0, -20, 0],
            opacity: [0.3, 1, 0.3]
          }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{ y: y2 }}
        />
        <motion.div 
          className="absolute top-1/3 right-1/4 w-2 h-2 bg-purple-500 rounded-full"
          animate={{ 
            y: [0, -30, 0],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
          style={{ y: y1 }}
        />
        <motion.div 
          className="absolute bottom-1/3 left-1/6 w-3 h-3 bg-pink-500 rounded-full"
          animate={{ 
            y: [0, -25, 0],
            opacity: [0.4, 1, 0.4]
          }}
          transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
          style={{ y: y2 }}
        />
      </section>

      {/* Features Section */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Cosmic Features
              </span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Discover the powerful tools that make VeeFore the ultimate social media command center
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard 
                key={feature.title}
                {...feature}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Galactic Impact
              </span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Join the growing universe of creators achieving extraordinary results
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <StatCounter end={50000} label="Active Creators" suffix="+" />
            <StatCounter end={2500000} label="Posts Generated" suffix="+" />
            <StatCounter end={150} label="Average Engagement Boost" suffix="%" />
            <StatCounter end={99} label="User Satisfaction" suffix="%" />
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
                Platform Universe
              </span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Connect and manage all your social media platforms from one unified control center
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center items-center gap-8">
            {integrations.map((platform, index) => (
              <motion.div
                key={platform.name}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.1, y: -10 }}
                className="group cursor-pointer"
              >
                <Card className="bg-white/5 backdrop-blur-xl border-white/10 group-hover:border-white/20 transition-all duration-300 p-8 relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${platform.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  
                  <div className="flex flex-col items-center relative z-10">
                    <motion.div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${platform.color} flex items-center justify-center mb-4 relative overflow-hidden`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <platform.icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
                      {platform.name}
                    </h3>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <Card className="bg-gradient-to-br from-blue-500/10 to-purple-600/10 backdrop-blur-xl border-white/20 p-16 relative overflow-hidden">
              {/* Background Animation */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20"
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{ duration: 10, repeat: Infinity }}
                style={{ backgroundSize: "200% 200%" }}
              />
              
              <div className="relative z-10">
                <motion.div
                  className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-8 relative overflow-hidden"
                  animate={{ 
                    rotate: 360,
                    boxShadow: [
                      "0 0 30px rgba(59, 130, 246, 0.4)",
                      "0 0 60px rgba(147, 51, 234, 0.6)",
                      "0 0 30px rgba(59, 130, 246, 0.4)"
                    ]
                  }}
                  transition={{ 
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    boxShadow: { duration: 3, repeat: Infinity }
                  }}
                >
                  <Sparkles className="w-16 h-16 text-white" />
                </motion.div>

                <h2 className="text-5xl md:text-6xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Ready to Launch?
                  </span>
                </h2>
                
                <p className="text-xl text-white/70 max-w-2xl mx-auto mb-12">
                  Join thousands of creators who've transformed their social media strategy. 
                  Start your cosmic journey today with our comprehensive AI-powered platform.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-12 py-6 text-xl font-semibold shadow-xl shadow-blue-500/25 relative overflow-hidden group"
                    onClick={() => setLocation('/auth')}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    
                    <span className="relative z-10 flex items-center">
                      Start Free Trial
                      <Rocket className="w-6 h-6 ml-3 group-hover:translate-y-1 transition-transform" />
                    </span>
                  </Button>
                  
                  <div className="text-white/60 text-sm">
                    No credit card required • 14-day free trial
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div 
              className="flex items-center justify-center space-x-3 mb-8"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                VeeFore
              </span>
            </motion.div>
            
            <p className="text-white/60 mb-8">
              Transforming social media management with AI-powered innovation
            </p>
            
            <div className="flex items-center justify-center space-x-8 text-white/40">
              <span>© 2024 VeeFore</span>
              <span>•</span>
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}