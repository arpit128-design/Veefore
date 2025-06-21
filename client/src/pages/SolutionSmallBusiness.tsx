import { motion } from 'framer-motion';
import { 
  Building, 
  TrendingUp, 
  Users, 
  Target, 
  Shield, 
  DollarSign, 
  CheckCircle, 
  ArrowRight,
  PlayCircle,
  BarChart3,
  Calendar,
  MessageSquare,
  Globe,
  Zap,
  Star,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { useEffect } from 'react';

export default function SolutionSmallBusiness() {
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

  const businessFeatures = [
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Multi-Platform Management",
      description: "Manage all your business social accounts from one dashboard with unified brand messaging.",
      features: ["Unified brand voice", "Cross-platform posting", "Centralized management", "Brand consistency"]
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Customer Engagement",
      description: "Build stronger relationships with customers through intelligent engagement and response tools.",
      features: ["Smart customer responses", "Engagement tracking", "Community building", "Customer insights"]
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Business Analytics",
      description: "Track ROI, conversions, and business metrics that matter for growth and profitability.",
      features: ["ROI tracking", "Conversion analytics", "Sales attribution", "Performance reporting"]
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Lead Generation",
      description: "Turn social media followers into customers with advanced lead generation and nurturing tools.",
      features: ["Lead capture forms", "Automated follow-ups", "Customer funnels", "Conversion optimization"]
    }
  ];

  const benefits = [
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "300% ROI Increase",
      description: "Businesses see average 300% improvement in social media ROI",
      metric: "300% ROI boost"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "5x Lead Generation",
      description: "Generate 5x more qualified leads through optimized social presence",
      metric: "5x more leads"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "20+ Hours Saved",
      description: "Save over 20 hours weekly on social media management tasks",
      metric: "20+ hours saved"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Customer Growth",
      description: "Grow your customer base with targeted social media strategies",
      metric: "400% growth"
    }
  ];

  const businessStories = [
    {
      name: "Bella's Boutique",
      industry: "Fashion Retail",
      location: "Austin, TX",
      story: "VeeFore transformed our social media from a time sink into our biggest sales driver. We went from posting randomly to having a strategic, automated presence that drives real revenue.",
      results: ["$150K monthly revenue from social", "40% of sales from social media", "80% reduction in time spent on social"]
    },
    {
      name: "TechFix Solutions",
      industry: "IT Services",
      location: "Seattle, WA",
      story: "As a B2B service company, we struggled with social media. VeeFore's business tools helped us generate qualified leads and establish thought leadership in our industry.",
      results: ["500% increase in qualified leads", "Thought leadership recognition", "50 new enterprise clients"]
    },
    {
      name: "Green Garden Cafe",
      industry: "Food & Beverage",
      location: "Portland, OR",
      story: "Our local cafe needed to compete with big chains. VeeFore's local business features helped us build a loyal community and increase foot traffic by 200%.",
      results: ["200% increase in foot traffic", "15K local followers", "Featured in local media 20+ times"]
    }
  ];

  const businessSizes = [
    {
      title: "Startups & Solopreneurs",
      description: "Get professional social media presence from day one",
      features: ["Quick setup", "Template library", "Growth strategies", "Budget-friendly"]
    },
    {
      title: "Growing Businesses",
      description: "Scale your social media as your business grows",
      features: ["Team collaboration", "Advanced analytics", "Lead generation", "Customer support"]
    },
    {
      title: "Established SMBs",
      description: "Optimize and automate your existing social strategy",
      features: ["Process automation", "ROI optimization", "Competitor analysis", "Advanced reporting"]
    }
  ];

  const industries = [
    "Retail & E-commerce", "Restaurants & Food", "Professional Services", 
    "Healthcare", "Real Estate", "Fitness & Wellness", "Beauty & Salon",
    "Home Services", "Education", "Non-profit", "Local Services", "Manufacturing"
  ];

  return (
    <div className="min-h-screen bg-space-navy text-white overflow-hidden relative">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-space-navy via-blue-900/20 to-cyan-900/20" />
        {[...Array(35)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-blue-400 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.3, 1],
              y: [0, -25, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 4,
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
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                  <Building className="w-5 h-5 text-white" />
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
                <Button className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700">
                  Start Growing
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
              className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-r from-blue-500 to-cyan-600 text-white mb-8"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              <Building className="w-10 h-10" />
            </motion.div>
            
            <Badge className="mb-6 bg-blue-500/20 text-blue-300 border-blue-500/30 text-lg px-4 py-2">
              <TrendingUp className="w-4 h-4 mr-2" />
              For Small Businesses
            </Badge>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
              Grow Your Business with{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
                Smart Social Media
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Transform your social media into a powerful business growth engine. Generate leads, drive sales, 
              and build lasting customer relationships with professional-grade tools designed for small businesses.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/auth">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-lg px-10 py-6">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/watch-demo">
                <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800 text-lg px-10 py-6">
                  <PlayCircle className="mr-2 w-5 h-5" />
                  Watch Business Demo
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Business dashboard preview */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop&crop=center"
                alt="Business Social Media Dashboard"
                className="w-full h-96 object-cover rounded-xl"
              />
              <div className="absolute top-12 right-12 bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                Business Mode
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Business Sizes */}
      <section className="relative z-10 py-24 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Perfect for Every Stage of Growth
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Whether you're just starting or scaling up, VeeFore adapts to your business needs
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
          >
            {businessSizes.map((size, index) => (
              <motion.div
                key={index}
                className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 hover:border-slate-600 transition-all duration-300"
                variants={scaleIn}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <h3 className="text-2xl font-bold text-white mb-4">{size.title}</h3>
                <p className="text-gray-300 mb-6">{size.description}</p>
                <div className="space-y-3">
                  {size.features.map((feature, i) => (
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

      {/* Business Features */}
      <section className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Business-Focused Features
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to turn social media into a revenue-generating business asset
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
          >
            {businessFeatures.map((feature, index) => (
              <motion.div key={index} variants={scaleIn}>
                <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all duration-300 h-full">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center text-white">
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

      {/* Industry Coverage */}
      <section className="relative z-10 py-24 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Trusted Across Industries
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              VeeFore works for businesses in every industry with customized strategies and templates
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
          >
            {industries.map((industry, index) => (
              <motion.div
                key={index}
                className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 text-center hover:border-slate-600 transition-all duration-300"
                variants={scaleIn}
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-white font-medium">{industry}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Business Success Stories */}
      <section className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Real Business Success Stories
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              See how small businesses like yours have grown revenue and customers with VeeFore
            </p>
          </motion.div>

          <motion.div 
            className="space-y-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
          >
            {businessStories.map((story, index) => (
              <motion.div
                key={index}
                className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8"
                variants={scaleIn}
                whileHover={{ scale: 1.02 }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                  <div className="lg:col-span-2">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-white">
                        <Building className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{story.name}</h3>
                        <p className="text-blue-400">{story.industry}</p>
                        <p className="text-gray-400">{story.location}</p>
                      </div>
                    </div>
                    <p className="text-gray-300 text-lg mb-6 italic">"{story.story}"</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-6">
                    <h4 className="text-white font-semibold mb-4">Business Results:</h4>
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
      <section className="relative z-10 py-24 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Measurable Business Results
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              See the real impact VeeFore has on your business growth and profitability
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
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6">
                  {benefit.icon}
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent mb-2">
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
              Ready to Grow Your Business?
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Join thousands of successful small businesses using VeeFore to drive real revenue from social media
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/auth">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-lg px-10 py-6">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800 text-lg px-10 py-6">
                  Schedule Business Demo
                </Button>
              </Link>
            </div>
            
            <p className="text-gray-400 mt-8">
              ✓ 14-day free trial • ✓ No credit card required • ✓ Business support included
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}