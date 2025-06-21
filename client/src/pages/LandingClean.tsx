import { Link } from 'wouter';
import { 
  ArrowRight, 
  CheckCircle,
  Zap,
  Target,
  Sparkles,
  BarChart3,
  MessageSquare,
  Calendar,
  Brain
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Simple Space Background Component
function SpaceBackground() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-slate-900 to-slate-900" />
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <SpaceBackground />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          <Badge className="mb-6 bg-blue-500/20 text-blue-300 border-blue-500/30 text-lg px-6 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Social Media Platform
          </Badge>
          
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight">
            Automate Your{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Social Media Success
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto">
            Transform your social media strategy with AI-powered content creation, 
            intelligent automation, and comprehensive analytics across all platforms.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 text-lg">
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button variant="outline" size="lg" className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-4 text-lg">
              Watch Demo
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-8 text-gray-400 flex-wrap">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: Brain,
      title: "AI Content Creation",
      description: "Generate engaging posts, captions, and hashtags with advanced AI that understands your brand voice and audience preferences."
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "Automatically schedule posts at optimal times for maximum engagement across Instagram, Facebook, Twitter, and LinkedIn."
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Track performance with detailed insights, engagement metrics, and competitor analysis to optimize your strategy."
    },
    {
      icon: MessageSquare,
      title: "Auto DM Responses",
      description: "Intelligent automated responses to Instagram DMs with context-aware AI that maintains authentic conversations."
    }
  ];

  return (
    <section className="py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-blue-500/20 text-blue-300 border-blue-500/30">
            <Zap className="w-3 h-3 mr-1" />
            Powerful Features
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Everything You Need to{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Dominate Social Media
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            From AI-powered content creation to advanced analytics, VeeFore provides all the tools you need to grow your social media presence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30">
                    <feature.icon className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">{feature.title}</h3>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const stats = [
    { number: "10M+", label: "Posts automated daily", company: "Platform Statistics" },
    { number: "500%", label: "Average engagement increase", company: "User Performance" },
    { number: "90%", label: "Time saved on management", company: "Efficiency Report" },
    { number: "50K+", label: "Active users trust VeeFore", company: "User Statistics" }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Trusted by{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Creators Worldwide
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join thousands of successful creators and businesses who've transformed their social media strategy with VeeFore.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6 rounded-2xl bg-slate-800/50 border border-slate-700">
              <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <div className="text-gray-300 mb-2 leading-tight">
                {stat.label}
              </div>
              <div className="text-sm text-gray-500">
                {stat.company}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SolutionsSection() {
  const solutions = [
    {
      title: "Content Creators",
      description: "Streamline your content creation workflow with AI-powered tools designed for individual creators and influencers.",
      features: ["AI Content Generation", "Automated Scheduling", "Engagement Analytics", "Brand Partnerships"],
      color: "from-pink-500 to-rose-600",
      link: "/solutions/content-creators"
    },
    {
      title: "Small Businesses", 
      description: "Grow your business presence on social media with comprehensive tools for customer engagement and lead generation.",
      features: ["Lead Generation", "Customer Support", "Local Marketing", "ROI Tracking"],
      color: "from-blue-500 to-cyan-600",
      link: "/solutions/small-business"
    },
    {
      title: "Agencies",
      description: "Manage multiple client accounts efficiently with advanced collaboration tools and white-label solutions.",
      features: ["Multi-Account Management", "Client Reporting", "Team Collaboration", "White Label"],
      color: "from-purple-500 to-indigo-600", 
      link: "/solutions/agencies"
    },
    {
      title: "Enterprises",
      description: "Scale your social media operations with enterprise-grade security, compliance, and advanced integrations.",
      features: ["Enterprise Security", "Custom Integrations", "Dedicated Support", "Compliance Tools"],
      color: "from-green-500 to-emerald-600",
      link: "/solutions/enterprises"
    }
  ];

  return (
    <section className="py-24 bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Perfect for{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Every Use Case
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Whether you're a solo creator or managing enterprise accounts, VeeFore adapts to your unique needs and workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {solutions.map((solution, index) => (
            <Card key={index} className="bg-slate-900/80 border-slate-700 hover:border-slate-600 transition-colors h-full">
              <CardContent className="p-8">
                <Link href={solution.link}>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${solution.color} bg-opacity-20`}>
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">{solution.title}</h3>
                    </div>
                    
                    <p className="text-gray-300 leading-relaxed">
                      {solution.description}
                    </p>
                    
                    <div className="space-y-3">
                      {solution.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          <span className="text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button className={`w-full bg-gradient-to-r ${solution.color} hover:opacity-90 transition-opacity mt-6`}>
                      Learn More
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <SolutionsSection />
    </div>
  );
}