import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Eye, 
  Target, 
  Users, 
  DollarSign, 
  CheckCircle, 
  ArrowRight,
  PlayCircle,
  PieChart,
  LineChart,
  Activity,
  Zap,
  Globe,
  Calendar,
  Filter,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { useEffect } from 'react';

export default function FeatureAnalytics() {
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

  const analyticsFeatures = [
    {
      icon: <Activity className="w-6 h-6" />,
      title: "Real-Time Performance Tracking",
      description: "Monitor your social media performance with live data updates, instant notifications, and real-time engagement metrics.",
      features: ["Live engagement tracking", "Instant performance alerts", "Real-time follower growth", "Immediate trend detection"]
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Competitor Benchmark Analysis",
      description: "Compare your performance against competitors and industry leaders to identify opportunities and stay ahead of the curve.",
      features: ["Competitor performance tracking", "Industry benchmarking", "Market share analysis", "Growth comparison tools"]
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Predictive Engagement Forecasting",
      description: "Use AI-powered predictions to forecast engagement rates, optimal posting times, and content performance before publishing.",
      features: ["AI engagement predictions", "Content performance forecasting", "Optimal timing predictions", "Trend forecasting"]
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "ROI Calculation & Reporting",
      description: "Track the return on investment of your social media efforts with detailed financial analytics and conversion tracking.",
      features: ["Revenue attribution", "Conversion tracking", "Cost per acquisition", "ROI reporting"]
    }
  ];

  const metrics = [
    {
      icon: <Eye className="w-8 h-8" />,
      title: "500% More Insights",
      description: "Advanced analytics reveal 5x more actionable insights than basic tools",
      metric: "500% deeper insights"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "3x Better Performance",
      description: "Data-driven decisions lead to 3x better content performance",
      metric: "3x improvement"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "95% Accuracy",
      description: "AI predictions achieve 95% accuracy in forecasting engagement",
      metric: "95% accurate"
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "400% ROI Boost",
      description: "Advanced analytics drive 400% improvement in marketing ROI",
      metric: "400% ROI increase"
    }
  ];

  const dashboardFeatures = [
    {
      title: "Engagement Analytics",
      description: "Track likes, comments, shares, and saves across all platforms",
      metrics: ["Engagement rate", "Reach growth", "Audience interaction", "Viral coefficient"]
    },
    {
      title: "Audience Insights",
      description: "Understand your audience demographics, interests, and behavior patterns",
      metrics: ["Demographics", "Interest analysis", "Activity patterns", "Growth trends"]
    },
    {
      title: "Content Performance",
      description: "Analyze which content types, topics, and formats perform best",
      metrics: ["Top performers", "Content categories", "Format analysis", "Trending topics"]
    },
    {
      title: "Revenue Tracking",
      description: "Monitor conversions, sales, and revenue generated from social media",
      metrics: ["Conversion rates", "Sales attribution", "Revenue growth", "Customer LTV"]
    }
  ];

  const reportingTools = [
    {
      icon: <PieChart className="w-6 h-6" />,
      title: "Visual Reports",
      description: "Beautiful, easy-to-understand visual reports for stakeholders"
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Scheduled Reports",
      description: "Automated daily, weekly, and monthly report delivery"
    },
    {
      icon: <Filter className="w-6 h-6" />,
      title: "Custom Filters",
      description: "Filter data by date range, platform, content type, and more"
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "Export Options",
      description: "Export reports in PDF, Excel, PowerPoint, and other formats"
    }
  ];

  return (
    <div className="min-h-screen bg-space-navy text-white overflow-hidden relative">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-space-navy via-green-900/20 to-blue-900/20" />
        {[...Array(60)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-green-400 rounded-full opacity-50"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 2, 1],
              y: [0, -30, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 3,
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
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">VeeFore</span>
              </div>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link href="/features">
                <Button variant="ghost" className="text-gray-300 hover:text-white">← Back to Features</Button>
              </Link>
              <Link href="/auth">
                <Button className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700">
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
              className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-r from-green-500 to-blue-600 text-white mb-8"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              <BarChart3 className="w-10 h-10" />
            </motion.div>
            
            <Badge className="mb-6 bg-green-500/20 text-green-300 border-green-500/30 text-lg px-4 py-2">
              <TrendingUp className="w-4 h-4 mr-2" />
              Advanced Analytics & Insights
            </Badge>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
              Unlock Deep Insights with{' '}
              <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                AI Analytics
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Transform data into actionable insights with advanced analytics that track performance, predict trends, 
              analyze competitors, and measure ROI across all your social media platforms.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/auth">
                <Button size="lg" className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-lg px-10 py-6">
                  Start Analyzing
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/watch-demo">
                <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800 text-lg px-10 py-6">
                  <PlayCircle className="mr-2 w-5 h-5" />
                  See Analytics Demo
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Analytics Dashboard Preview */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700">
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop&crop=center"
                alt="Advanced Analytics Dashboard"
                className="w-full h-96 object-cover rounded-xl"
              />
              <div className="absolute top-12 right-12 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                Live Analytics
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dashboard Features */}
      <section className="relative z-10 py-24 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Comprehensive Analytics Dashboard
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Get a complete view of your social media performance with detailed metrics and insights
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
          >
            {dashboardFeatures.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 hover:border-slate-600 transition-all duration-300"
                variants={scaleIn}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 text-lg mb-6">{feature.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  {feature.metrics.map((metric, i) => (
                    <div key={i} className="bg-slate-700/50 rounded-lg p-3 text-center">
                      <div className="text-green-400 font-semibold">{metric}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Core Analytics Features */}
      <section className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Advanced Analytics Features
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Go beyond basic metrics with AI-powered analytics that provide deep insights and predictions
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
          >
            {analyticsFeatures.map((feature, index) => (
              <motion.div key={index} variants={scaleIn}>
                <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all duration-300 h-full">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center text-white">
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

      {/* Reporting Tools */}
      <section className="relative z-10 py-24 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Professional Reporting Tools
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Create beautiful reports and share insights with stakeholders using our advanced reporting suite
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
          >
            {reportingTools.map((tool, index) => (
              <motion.div
                key={index}
                className="text-center p-8 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-all duration-300"
                variants={scaleIn}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6">
                  {tool.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{tool.title}</h3>
                <p className="text-gray-300">{tool.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Performance Metrics */}
      <section className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Proven Results
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              See how advanced analytics transform social media performance for businesses and creators
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
          >
            {metrics.map((metric, index) => (
              <motion.div
                key={index}
                className="text-center p-8 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-all duration-300"
                variants={scaleIn}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6">
                  {metric.icon}
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-2">
                  {metric.metric}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{metric.title}</h3>
                <p className="text-gray-300">{metric.description}</p>
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
              Ready to Unlock Your Data's Potential?
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Join thousands of data-driven creators and businesses who make smarter decisions with advanced analytics
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/auth">
                <Button size="lg" className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-lg px-10 py-6">
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