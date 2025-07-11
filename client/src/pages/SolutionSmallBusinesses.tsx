import { motion } from 'framer-motion';
import { 
  Building, 
  BarChart3, 
  Users, 
  Calendar, 
  TrendingUp,
  MessageSquare,
  Target,
  Zap,
  CheckCircle,
  ArrowRight,
  Star,
  Shield,
  Clock,
  Globe,
  DollarSign,
  Play,
  ShoppingCart,
  Megaphone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { useEffect } from 'react';

const features = [
  {
    icon: <BarChart3 className="h-8 w-8" />,
    title: "Business Analytics",
    description: "Track ROI, customer acquisition costs, and revenue attribution from social media campaigns.",
    benefits: ["Revenue tracking", "Customer journey mapping", "Cost per acquisition", "Lifetime value analysis"]
  },
  {
    icon: <Target className="h-8 w-8" />,
    title: "Audience Targeting",
    description: "Reach your ideal customers with precision targeting and lookalike audience creation.",
    benefits: ["Demographic targeting", "Interest-based segments", "Behavioral analytics", "Custom audiences"]
  },
  {
    icon: <Calendar className="h-8 w-8" />,
    title: "Campaign Management",
    description: "Plan, execute, and optimize marketing campaigns across multiple social platforms.",
    benefits: ["Campaign scheduling", "A/B testing", "Performance optimization", "Budget allocation"]
  },
  {
    icon: <MessageSquare className="h-8 w-8" />,
    title: "Customer Engagement",
    description: "Build relationships with automated responses and community management tools.",
    benefits: ["Auto customer service", "Review management", "Community building", "Lead nurturing"]
  },
  {
    icon: <ShoppingCart className="h-8 w-8" />,
    title: "E-commerce Integration",
    description: "Connect your online store and track social commerce performance seamlessly.",
    benefits: ["Product catalog sync", "Social shopping", "Conversion tracking", "Abandoned cart recovery"]
  },
  {
    icon: <Megaphone className="h-8 w-8" />,
    title: "Brand Monitoring",
    description: "Monitor brand mentions, competitor activity, and industry trends in real-time.",
    benefits: ["Mention tracking", "Sentiment analysis", "Competitor insights", "Crisis management"]
  }
];

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Marketing Director",
    company: "Green Valley Organics",
    industry: "Food & Beverage",
    revenue: "$2.3M",
    image: "/api/placeholder/64/64",
    content: "VeeFore helped us increase online sales by 340% in 8 months. The ROI tracking shows exactly which social posts drive revenue.",
    rating: 5,
    results: "+340% sales growth"
  },
  {
    name: "Michael Chen",
    role: "Founder",
    company: "TechStart Solutions",
    industry: "B2B Software",
    revenue: "$1.8M",
    image: "/api/placeholder/64/64",
    content: "We went from 500 to 25K LinkedIn followers and generated $500K in leads. The B2B targeting features are incredibly powerful.",
    rating: 5,
    results: "+4900% follower growth"
  },
  {
    name: "Amanda Rodriguez",
    role: "Owner",
    company: "Bella Fashion Boutique",
    industry: "Retail",
    revenue: "$950K",
    image: "/api/placeholder/64/64",
    content: "Social commerce integration doubled our online revenue. Customers can now shop directly from our Instagram posts.",
    rating: 5,
    results: "+200% online revenue"
  }
];

const pricing = {
  plan: "Business Pro",
  price: "$49",
  period: "month",
  features: [
    "Multi-platform management",
    "Advanced analytics & ROI tracking",
    "Customer engagement automation",
    "E-commerce integration",
    "Brand monitoring & alerts",
    "Campaign management tools",
    "Priority support & training"
  ]
};

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

export default function SolutionSmallBusinesses() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-space-black text-white">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-space-black via-cosmic-void to-space-black">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 border-b border-white/10 bg-space-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">VeeFore</span>
              </div>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost">← Back to Home</Button>
              </Link>
              <Link href="/solutions">
                <Button variant="ghost">All Solutions</Button>
              </Link>
              <Link href="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-20">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
              <Building className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            For Small Businesses
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Grow your business with professional social media management tools designed for small businesses. 
            Track ROI, engage customers, and scale your brand across all social platforms with data-driven insights.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
              <TrendingUp className="h-4 w-4 mr-1" />
              Growth Focused
            </Badge>
            <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
              <DollarSign className="h-4 w-4 mr-1" />
              ROI Tracking
            </Badge>
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
              <Users className="h-4 w-4 mr-1" />
              Customer Focus
            </Badge>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20"
          {...fadeInUp}
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">250%</div>
            <div className="text-gray-400">Avg. Revenue Growth</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-cyan-400 mb-2">50K+</div>
            <div className="text-gray-400">Small Businesses</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">$2.5B+</div>
            <div className="text-gray-400">Revenue Generated</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">4.2x</div>
            <div className="text-gray-400">Average ROI</div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          className="mb-20"
          {...fadeInUp}
        >
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything Your Business <span className="text-blue-400">Needs to Grow</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-gray-700 hover:border-blue-500/50 transition-all duration-300 h-full">
                  <CardHeader>
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg text-white">
                        {feature.icon}
                      </div>
                      <CardTitle className="text-white">{feature.title}</CardTitle>
                    </div>
                    <CardDescription className="text-gray-300">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-center space-x-2 text-sm text-gray-400">
                          <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Video Demo Section */}
        <motion.div 
          className="mb-20 text-center"
          {...fadeInUp}
        >
          <h2 className="text-3xl font-bold mb-8">See How Small Businesses Grow with VeeFore</h2>
          <div className="relative max-w-4xl mx-auto">
            <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-700 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="h-8 w-8 text-white ml-1" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Business Growth Success Stories</h3>
                <p className="text-gray-400">Watch how small businesses achieve 250% growth</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div 
          className="mb-20"
          {...fadeInUp}
        >
          <h2 className="text-3xl font-bold text-center mb-12">
            What <span className="text-blue-400">Business Owners</span> Are Saying
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.company}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-gray-700 h-full">
                  <CardHeader>
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-medium text-white">{testimonial.name}</div>
                        <div className="text-sm text-gray-400">{testimonial.role} • {testimonial.company}</div>
                        <div className="text-xs text-blue-400">{testimonial.industry} • {testimonial.revenue} revenue</div>
                      </div>
                    </div>
                    <div className="flex space-x-1 mb-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-blue-400 fill-current" />
                      ))}
                    </div>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                      {testimonial.results}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 italic">"{testimonial.content}"</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Pricing Section */}
        <motion.div 
          className="mb-20 text-center"
          {...fadeInUp}
        >
          <h2 className="text-3xl font-bold mb-8">Perfect Plan for <span className="text-blue-400">Growing Businesses</span></h2>
          <div className="max-w-md mx-auto">
            <Card className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-blue-500/50">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Building className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-white">{pricing.plan}</CardTitle>
                <div className="text-4xl font-bold text-blue-400">
                  {pricing.price}<span className="text-lg text-gray-400">/{pricing.period}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {pricing.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2 text-gray-300">
                      <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700">
                  Start Growing Today
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          className="text-center bg-gradient-to-r from-blue-900/20 to-cyan-900/20 rounded-2xl p-12 border border-blue-500/20"
          {...fadeInUp}
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Grow Your Business?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of small businesses already using VeeFore to increase revenue and build stronger customer relationships.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Link href="/signup">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10">
                Watch Demo
                <Play className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}