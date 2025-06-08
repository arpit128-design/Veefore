import React, { useState, useEffect } from 'react';
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
  Globe,
  Hash,
  Instagram,
  ArrowRight,
  Check,
  Play,
  ChevronDown,
  Crown,
  FileText,
  Youtube,
  Twitter,
  Facebook,
  Linkedin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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

const TypewriterEffect = ({ texts, speed = 100 }: { texts: string[]; speed?: number }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const text = texts[currentIndex];
    
    if (isTyping) {
      if (currentText.length < text.length) {
        const timeout = setTimeout(() => {
          setCurrentText(text.substring(0, currentText.length + 1));
        }, speed);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => setIsTyping(false), 2000);
        return () => clearTimeout(timeout);
      }
    } else {
      if (currentText.length > 0) {
        const timeout = setTimeout(() => {
          setCurrentText(currentText.substring(0, currentText.length - 1));
        }, speed / 2);
        return () => clearTimeout(timeout);
      } else {
        setCurrentIndex((prev) => (prev + 1) % texts.length);
        setIsTyping(true);
      }
    }
  }, [currentText, currentIndex, isTyping, texts, speed]);

  return (
    <span className="min-h-[1em] inline-block">
      {currentText}
      <span className="ml-1 animate-pulse">|</span>
    </span>
  );
};

const Landing = () => {
  const heroFeatures = [
    "AI-Powered Multi-Platform Content Generation",
    "Instagram • YouTube • Twitter • Facebook Automation", 
    "Real-Time Cross-Platform Analytics",
    "Automated DM & Comment Responses Across All Platforms",
    "Unified Social Media Management Dashboard",
    "Viral Hashtag Discovery Across All Networks"
  ];

  const platforms = [
    { icon: Instagram, name: "Instagram", color: "bg-gradient-to-br from-pink-500 to-orange-500" },
    { icon: Youtube, name: "YouTube", color: "bg-gradient-to-br from-red-500 to-red-600" },
    { icon: Twitter, name: "Twitter", color: "bg-gradient-to-br from-blue-400 to-blue-500" },
    { icon: Facebook, name: "Facebook", color: "bg-gradient-to-br from-blue-600 to-blue-700" },
    { icon: Linkedin, name: "LinkedIn", color: "bg-gradient-to-br from-blue-500 to-blue-600" },
    { icon: Globe, name: "More Platforms", color: "bg-gradient-to-br from-purple-500 to-purple-600" }
  ];

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Content Generation",
      subtitle: "Create Viral Content for All Platforms",
      description: "Generate high-quality posts, stories, reels, and videos optimized for Instagram, YouTube, Twitter, Facebook, and LinkedIn with our advanced AI.",
      benefits: [
        "Multi-platform content optimization",
        "Brand voice consistency across all channels",
        "Hindi, English, and Hinglish support",
        "Viral content prediction algorithms",
        "Auto-generated captions and hashtags"
      ],
      gradient: "from-purple-600 via-blue-600 to-cyan-600"
    },
    {
      icon: Globe,
      title: "Unified Multi-Platform Management",
      subtitle: "One Dashboard, All Your Social Media",
      description: "Manage Instagram, YouTube, Twitter, Facebook, LinkedIn, and more from a single powerful dashboard with real-time synchronization.",
      benefits: [
        "Unified posting across all platforms",
        "Cross-platform analytics and insights",
        "Centralized message management",
        "Platform-specific optimization",
        "Bulk content scheduling"
      ],
      gradient: "from-green-600 via-teal-600 to-blue-600"
    },
    {
      icon: Bot,
      title: "100% Automated DM & Comment Response",
      subtitle: "Never Miss a Customer Interaction",
      description: "AI responds to every DM and comment across Instagram, YouTube, Twitter, Facebook with contextual, personalized messages in multiple languages.",
      benefits: [
        "Multi-platform message automation",
        "Contextual AI conversations",
        "Lead qualification and nurturing",
        "Anti-spam and sentiment analysis",
        "Human handoff for complex queries"
      ],
      gradient: "from-orange-600 via-red-600 to-pink-600"
    },
    {
      icon: BarChart3,
      title: "Real-Time Cross-Platform Analytics",
      subtitle: "Data-Driven Social Media Intelligence",
      description: "Comprehensive analytics dashboard showing performance metrics, audience insights, and growth tracking across all connected social media platforms.",
      benefits: [
        "Unified analytics across all platforms",
        "Real-time engagement tracking",
        "Audience demographic analysis",
        "Content performance optimization",
        "ROI and conversion tracking"
      ],
      gradient: "from-blue-600 via-indigo-600 to-purple-600"
    },
    {
      icon: Hash,
      title: "Viral Hashtag Discovery Engine",
      subtitle: "Trending Hashtags Across All Networks",
      description: "AI-powered hashtag research and optimization for Instagram, YouTube, Twitter, Facebook, LinkedIn to maximize your content reach and discoverability.",
      benefits: [
        "Platform-specific hashtag recommendations",
        "Trending hashtag analysis",
        "Competitor hashtag research",
        "Hashtag performance tracking",
        "Viral potential scoring"
      ],
      gradient: "from-pink-600 via-rose-600 to-red-600"
    },
    {
      icon: Calendar,
      title: "Smart Multi-Platform Scheduling",
      subtitle: "Perfect Timing for Every Platform",
      description: "Intelligent scheduling system that posts content at optimal times for each platform, maximizing engagement across Instagram, YouTube, Twitter, Facebook, and LinkedIn.",
      benefits: [
        "Platform-specific optimal timing",
        "Bulk scheduling across networks",
        "Content calendar visualization",
        "Auto-reposting and recycling",
        "Timezone optimization"
      ],
      gradient: "from-cyan-600 via-blue-600 to-indigo-600"
    }
  ];

  const stats = [
    { label: "Cross-Platform Content Generated", value: "2M+", icon: FileText },
    { label: "Automated Interactions", value: "500K+", icon: MessageCircle },
    { label: "Businesses Automated", value: "10K+", icon: Users },
    { label: "Average Engagement Increase", value: "300%", icon: TrendingUp }
  ];

  const pricingPlans = [
    {
      name: "Free Explorer",
      price: "₹0",
      period: "/month",
      description: "Perfect for individual creators",
      features: [
        "1 Workspace",
        "Connect 1 social account",
        "Basic AI content generation",
        "Basic analytics",
        "Community support"
      ],
      popular: false,
      gradient: "from-gray-600 to-gray-700"
    },
    {
      name: "Pro Creator",
      price: "₹999",
      period: "/month",
      description: "For growing businesses and influencers",
      features: [
        "5 Workspaces",
        "Connect up to 5 social accounts",
        "Advanced AI content generation",
        "Real-time multi-platform analytics",
        "100% DM automation",
        "Comment management across platforms",
        "Smart scheduling for all networks",
        "Viral hashtag research",
        "Priority support"
      ],
      popular: true,
      gradient: "from-blue-600 to-purple-600"
    },
    {
      name: "Enterprise Agency",
      price: "₹2,999",
      period: "/month",
      description: "For agencies and large businesses",
      features: [
        "Unlimited workspaces",
        "Unlimited social accounts",
        "Enterprise AI features",
        "Advanced multi-platform analytics",
        "Unlimited automation",
        "White-label solution",
        "API access",
        "Custom integrations",
        "Dedicated account manager",
        "24/7 priority support"
      ],
      popular: false,
      gradient: "from-purple-600 to-pink-600"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(120,119,198,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(168,85,247,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[conic-gradient(from_90deg_at_50%_50%,transparent,rgba(120,119,198,0.1),transparent)]" />
      </div>

      {/* Simple Floating Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/20 rounded-full animate-pulse"
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
        <div className="relative z-10 text-center max-w-7xl mx-auto">
          {/* Hero Badge */}
          <div className="mb-8">
            <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 text-lg border-0 shadow-lg">
              <Sparkles className="w-5 h-5 mr-3" />
              The Future of Multi-Platform Social Media Automation
            </Badge>
          </div>

          {/* Main Headline */}
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            VeeFore
          </h1>

          {/* Dynamic Subtitle */}
          <div className="text-2xl md:text-4xl font-semibold mb-4 h-20 flex items-center justify-center">
            <TypewriterEffect 
              texts={heroFeatures}
              speed={80}
            />
          </div>

          {/* Platform Icons */}
          <div className="flex justify-center gap-4 mb-12 flex-wrap">
            {platforms.map((platform, index) => {
              const IconComponent = platform.icon;
              return (
                <div
                  key={platform.name}
                  className={`w-16 h-16 rounded-2xl ${platform.color} flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform duration-300`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
              );
            })}
          </div>

          {/* Description */}
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-5xl mx-auto leading-relaxed">
            Transform your entire social media presence with cutting-edge AI automation. 
            Manage Instagram, YouTube, Twitter, Facebook, LinkedIn and more from one powerful dashboard 
            with intelligent content generation and 100% automated engagement.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link href="/onboarding">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-12 py-4 text-xl font-semibold rounded-full shadow-lg shadow-purple-500/25 hover:scale-105 transition-transform duration-300"
              >
                <Rocket className="w-6 h-6 mr-3" />
                Start Free Trial
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-white/30 text-white hover:bg-white/10 px-12 py-4 text-xl font-semibold rounded-full backdrop-blur-sm hover:scale-105 transition-transform duration-300"
            >
              <Play className="w-6 h-6 mr-3" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div 
                  key={index} 
                  className="text-center hover:scale-110 transition-transform duration-300"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/20 mb-4">
                    <IconComponent className="w-8 h-8 text-blue-400" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">
                    <AnimatedCounter end={parseInt(stat.value.replace(/[^\d]/g, ''))} suffix={stat.value.replace(/[\d]/g, '')} />
                  </div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex flex-col items-center text-white/60 animate-bounce">
            <span className="text-sm mb-2">Explore Features</span>
            <ChevronDown className="w-6 h-6" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Revolutionary Features
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Advanced AI-powered tools designed to dominate every social media platform
            </p>
          </div>

          <div className="space-y-32">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              const isEven = index % 2 === 0;
              
              return (
                <div
                  key={index}
                  className={`grid lg:grid-cols-2 gap-16 items-center ${!isEven ? 'lg:grid-flow-col-dense' : ''}`}
                >
                  {/* Content */}
                  <div className={isEven ? '' : 'lg:col-start-2'}>
                    <div className="hover:scale-105 transition-transform duration-500">
                      <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-8 shadow-2xl`}>
                        <IconComponent size={40} className="text-white" />
                      </div>
                      
                      <h3 className="text-4xl font-bold mb-4 text-white">
                        {feature.title}
                      </h3>
                      
                      <p className={`text-xl font-semibold mb-6 bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}>
                        {feature.subtitle}
                      </p>
                      
                      <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                        {feature.description}
                      </p>

                      <ul className="space-y-4">
                        {feature.benefits.map((benefit, benefitIndex) => (
                          <li 
                            key={benefitIndex}
                            className="flex items-center text-lg text-gray-300"
                          >
                            <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${feature.gradient} flex items-center justify-center mr-4 flex-shrink-0`}>
                              <Check className="w-4 h-4 text-white" />
                            </div>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Visual */}
                  <div className={isEven ? 'lg:col-start-2' : 'lg:col-start-1'}>
                    <div className="relative hover:scale-105 transition-transform duration-500">
                      <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-20 rounded-3xl blur-3xl`} />
                      <div className="relative p-8 bg-gradient-to-br from-gray-900/50 to-black/50 rounded-3xl border border-gray-800 backdrop-blur-sm">
                        <div className="grid grid-cols-2 gap-6">
                          {platforms.slice(0, 4).map((platform, platformIndex) => {
                            const PlatformIcon = platform.icon;
                            return (
                              <div
                                key={platform.name}
                                className={`p-4 ${platform.color} rounded-2xl flex flex-col items-center gap-3 cursor-pointer shadow-lg hover:scale-110 transition-transform duration-300`}
                              >
                                <PlatformIcon className="w-8 h-8 text-white" />
                                <span className="text-white font-medium">{platform.name}</span>
                                <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-white rounded-full animate-pulse"
                                    style={{ width: `${60 + Math.random() * 40}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative py-32 px-4 bg-gradient-to-br from-blue-900/10 to-purple-900/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Scale your social media automation from startup to enterprise
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index} 
                className={`relative p-8 bg-gradient-to-br from-gray-900/50 to-black/50 rounded-3xl border ${
                  plan.popular 
                    ? 'border-blue-500/50 scale-105' 
                    : 'border-gray-800'
                } backdrop-blur-sm h-full hover:scale-105 transition-transform duration-500`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className={`bg-gradient-to-r ${plan.gradient} text-white px-6 py-2 border-0`}>
                      <Crown className="w-4 h-4 mr-2" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className={`text-4xl font-bold bg-gradient-to-r ${plan.gradient} bg-clip-text text-transparent`}>
                      {plan.price}
                    </span>
                    <span className="text-gray-400">{plan.period}</span>
                  </div>
                  <p className="text-gray-400">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li 
                      key={featureIndex} 
                      className="flex items-center"
                    >
                      <Check className="w-5 h-5 mr-3 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/onboarding">
                  <Button 
                    className={`w-full py-4 font-semibold rounded-xl transition-all duration-300 hover:scale-105 ${
                      plan.popular
                        ? `bg-gradient-to-r ${plan.gradient} hover:shadow-lg text-white`
                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                    }`}
                  >
                    {plan.name === 'Free Explorer' ? 'Get Started Free' : 'Start Free Trial'}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-4 bg-gradient-to-br from-purple-900/20 to-blue-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-fade-in-up">
            <h2 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Ready to Dominate All Social Media?
            </h2>
            
            <p className="text-xl text-gray-300 mb-12 leading-relaxed">
              Join thousands of businesses already using VeeFore to automate Instagram, YouTube, Twitter, 
              Facebook, LinkedIn and drive real growth with AI-powered cross-platform strategies.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/onboarding">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-12 py-4 text-xl font-semibold rounded-full shadow-lg shadow-purple-500/25 hover:scale-105 transition-transform duration-300"
                >
                  <Rocket className="w-6 h-6 mr-3" />
                  Start Your Free Trial
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-white/30 text-white hover:bg-white/10 px-12 py-4 text-xl font-semibold rounded-full backdrop-blur-sm hover:scale-105 transition-transform duration-300"
              >
                <MessageCircle className="w-6 h-6 mr-3" />
                Contact Sales
              </Button>
            </div>

            <p className="text-gray-400 mt-8">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
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
              The future of AI-powered multi-platform social media automation. Transform your digital presence 
              across Instagram, YouTube, Twitter, Facebook, LinkedIn with intelligent automation.
            </p>
          </div>

          <div className="text-center text-gray-500">
            <p>&copy; 2025 VeeFore. All rights reserved. | Made with ❤️ for the future of social media automation.</p>
          </div>
        </div>
      </footer>


    </div>
  );
};

export default Landing;