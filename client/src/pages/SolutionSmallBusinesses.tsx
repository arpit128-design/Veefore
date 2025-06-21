import { motion } from 'framer-motion';
import { 
  Building, 
  Bot, 
  Calendar, 
  BarChart3, 
  DollarSign,
  Users,
  Zap,
  CheckCircle,
  ArrowRight,
  Star,
  TrendingUp,
  Target,
  Clock,
  Globe,
  ShoppingCart,
  MessageSquare,
  Camera,
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { useEffect } from 'react';

const features = [
  {
    icon: <BarChart3 className="h-8 w-8" />,
    title: "Multi-Platform Management",
    description: "Manage all your social media accounts from one unified dashboard.",
    benefits: ["Instagram, Facebook, LinkedIn", "Twitter, YouTube, TikTok", "Centralized content calendar", "Cross-platform analytics"]
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "Customer Engagement",
    description: "Build stronger relationships with your customers through automated engagement.",
    benefits: ["Auto-respond to comments", "DM automation", "Customer service tools", "Lead generation"]
  },
  {
    icon: <Target className="h-8 w-8" />,
    title: "Brand Monitoring",
    description: "Track mentions, reviews, and brand sentiment across all platforms.",
    benefits: ["Reputation management", "Competitor tracking", "Sentiment analysis", "Crisis alerts"]
  },
  {
    icon: <DollarSign className="h-8 w-8" />,
    title: "ROI Tracking",
    description: "Measure the real impact of your social media efforts on your bottom line.",
    benefits: ["Conversion tracking", "Sales attribution", "Revenue analytics", "Cost per acquisition"]
  },
  {
    icon: <Bot className="h-8 w-8" />,
    title: "Smart Content Creation",
    description: "Generate professional content that speaks to your target audience.",
    benefits: ["Industry-specific templates", "Brand voice consistency", "Product showcase tools", "Promotional content"]
  },
  {
    icon: <Calendar className="h-8 w-8" />,
    title: "Strategic Scheduling",
    description: "Post when your customers are most likely to engage and convert.",
    benefits: ["Optimal timing analysis", "Campaign scheduling", "Seasonal planning", "Event coordination"]
  }
];

const testimonials = [
  {
    name: "Sarah Martinez",
    company: "Bloom Boutique",
    industry: "Fashion Retail",
    followers: "25K",
    content: "VeeFore helped us increase our online sales by 300% in just 4 months. The ROI tracking feature shows exactly which posts drive purchases.",
    rating: 5,
    results: "+300% Sales Growth"
  },
  {
    name: "David Chen",
    company: "Tech Solutions Inc",
    industry: "B2B Services",
    followers: "15K",
    content: "Managing multiple client campaigns was overwhelming until we found VeeFore. Now we can handle 3x more clients with the same team.",
    rating: 5,
    results: "+200% Client Capacity"
  },
  {
    name: "Maria Rodriguez",
    company: "Healthy Eats Cafe",
    industry: "Food & Beverage",
    followers: "18K",
    content: "The automated customer service has been a game-changer. We respond to customer inquiries 24/7 and our satisfaction scores have skyrocketed.",
    rating: 5,
    results: "+150% Customer Satisfaction"
  }
];

const caseStudies = [
  {
    company: "Green Gardens Landscaping",
    industry: "Home Services",
    challenge: "Struggled to generate leads through social media",
    solution: "Implemented targeted content strategy with lead generation tools",
    results: [
      "250% increase in qualified leads",
      "40% reduction in customer acquisition cost",
      "85% of new customers from social media"
    ],
    timeframe: "6 months"
  },
  {
    company: "Artisan Coffee Roasters",
    industry: "Food & Beverage",
    challenge: "Low engagement and brand awareness",
    solution: "Created authentic brand storytelling with community building",
    results: [
      "400% increase in social media engagement",
      "200% growth in local store visits",
      "150% increase in online orders"
    ],
    timeframe: "4 months"
  }
];

const pricing = {
  plan: "Business Pro",
  price: "$49",
  period: "month",
  features: [
    "Multi-platform management (up to 10 accounts)",
    "Advanced analytics & ROI tracking",
    "Customer engagement automation",
    "Brand monitoring & reputation management",
    "Team collaboration tools",
    "Priority customer support",
    "Custom integrations",
    "White-label reporting"
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
              <Link href="/auth">
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
            Grow your business with professional social media management tools that scale with you. 
            Increase brand awareness, generate leads, and drive sales through strategic social media presence.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
              <TrendingUp className="h-4 w-4 mr-1" />
              Growth Focused
            </Badge>
            <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
              <DollarSign className="h-4 w-4 mr-1" />
              ROI Driven
            </Badge>
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
              <Users className="h-4 w-4 mr-1" />
              Customer Focused
            </Badge>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20"
          {...fadeInUp}
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">50K+</div>
            <div className="text-gray-400">Small Businesses</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-cyan-400 mb-2">250%</div>
            <div className="text-gray-400">Avg. Lead Increase</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">$2.5M</div>
            <div className="text-gray-400">Revenue Generated</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">15hrs</div>
            <div className="text-gray-400">Saved Per Week</div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          className="mb-20"
          {...fadeInUp}
        >
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything Your Business <span className="text-blue-400">Needs to Succeed</span>
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

        {/* Case Studies */}
        <motion.div 
          className="mb-20"
          {...fadeInUp}
        >
          <h2 className="text-3xl font-bold text-center mb-12">
            Real <span className="text-blue-400">Success Stories</span>
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {caseStudies.map((study, index) => (
              <motion.div
                key={study.company}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-blue-500/50 h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <CardTitle className="text-white">{study.company}</CardTitle>
                        <p className="text-blue-400 text-sm">{study.industry}</p>
                      </div>
                      <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                        {study.timeframe}
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-1">Challenge</h4>
                        <p className="text-sm text-gray-400">{study.challenge}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-1">Solution</h4>
                        <p className="text-sm text-gray-400">{study.solution}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h4 className="text-sm font-medium text-gray-300 mb-3">Results</h4>
                    <ul className="space-y-2">
                      {study.results.map((result, idx) => (
                        <li key={idx} className="flex items-center space-x-2 text-sm text-green-400">
                          <CheckCircle className="h-4 w-4 flex-shrink-0" />
                          <span>{result}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
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
                        <div className="text-sm text-gray-400">{testimonial.company}</div>
                        <div className="text-xs text-blue-400">{testimonial.industry}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <Badge variant="secondary" className="bg-green-500/20 text-green-300 text-xs">
                        {testimonial.results}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 italic">"{testimonial.content}"</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ROI Calculator Section */}
        <motion.div 
          className="mb-20 bg-gradient-to-r from-blue-900/20 to-cyan-900/20 rounded-2xl p-12 border border-blue-500/20"
          {...fadeInUp}
        >
          <h2 className="text-3xl font-bold text-center mb-8">Calculate Your Potential ROI</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">3.2x</div>
              <div className="text-gray-300">Average ROI</div>
              <div className="text-sm text-gray-400 mt-2">Based on client data</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-cyan-400 mb-2">$25K</div>
              <div className="text-gray-300">Avg. Revenue Increase</div>
              <div className="text-sm text-gray-400 mt-2">First 6 months</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">45%</div>
              <div className="text-gray-300">Cost Reduction</div>
              <div className="text-sm text-gray-400 mt-2">vs traditional marketing</div>
            </div>
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
            Join thousands of small businesses that are already using VeeFore to increase sales, engage customers, and build their brand.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Link href="/auth">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10">
                Schedule Demo
                <Calendar className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}