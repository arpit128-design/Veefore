import { motion } from 'framer-motion';
import { 
  Camera, 
  Bot, 
  Calendar, 
  BarChart3, 
  Heart,
  Users,
  Zap,
  CheckCircle,
  ArrowRight,
  Star,
  TrendingUp,
  Target,
  Clock,
  Globe,
  Sparkles,
  Play,
  ImageIcon,
  Video,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { useEffect } from 'react';

const features = [
  {
    icon: <Bot className="h-8 w-8" />,
    title: "AI Content Generation",
    description: "Create viral-worthy posts, captions, and hashtags tailored to your niche and audience.",
    benefits: ["50+ content templates", "Niche-specific prompts", "Trending hashtag suggestions", "Multi-language support"]
  },
  {
    icon: <Calendar className="h-8 w-8" />,
    title: "Smart Scheduling",
    description: "Post at optimal times when your audience is most active for maximum engagement.",
    benefits: ["Audience activity analysis", "Best time recommendations", "Bulk scheduling", "Cross-platform posting"]
  },
  {
    icon: <BarChart3 className="h-8 w-8" />,
    title: "Creator Analytics",
    description: "Deep insights into your content performance and audience growth patterns.",
    benefits: ["Engagement rate tracking", "Follower growth analysis", "Content performance metrics", "Competitor insights"]
  },
  {
    icon: <MessageSquare className="h-8 w-8" />,
    title: "Auto DM Responses",
    description: "Never miss a fan message with intelligent automated responses that feel personal.",
    benefits: ["Context-aware replies", "Custom response templates", "24/7 availability", "Brand voice consistency"]
  },
  {
    icon: <Video className="h-8 w-8" />,
    title: "Video Content Tools",
    description: "Create engaging video content with AI-powered editing and optimization tools.",
    benefits: ["Auto video editing", "Trending effects", "Music suggestions", "Format optimization"]
  },
  {
    icon: <Heart className="h-8 w-8" />,
    title: "Engagement Optimization",
    description: "Boost your reach and engagement with data-driven content optimization.",
    benefits: ["Engagement prediction", "Content scoring", "Trend analysis", "Viral potential assessment"]
  }
];

const testimonials = [
  {
    name: "Emma Rodriguez",
    handle: "@emmalifestyle",
    platform: "Instagram",
    followers: "250K",
    image: "/api/placeholder/64/64",
    content: "VeeFore helped me grow from 50K to 250K followers in just 6 months! The AI content suggestions are incredible and always on-trend.",
    rating: 5
  },
  {
    name: "Jake Thompson",
    handle: "@jaketech",
    platform: "YouTube",
    followers: "180K",
    image: "/api/placeholder/64/64",
    content: "The scheduling feature is a game-changer. I can plan my entire month of content in one sitting. My engagement has increased by 150%!",
    rating: 5
  },
  {
    name: "Sophia Chen",
    handle: "@sophiafitness",
    platform: "TikTok",
    followers: "500K",
    image: "/api/placeholder/64/64",
    content: "As a fitness influencer, VeeFore's AI understands my niche perfectly. It creates content that resonates with my audience every time.",
    rating: 5
  }
];

const pricing = {
  plan: "Creator Pro",
  price: "$19",
  period: "month",
  features: [
    "Unlimited AI content generation",
    "Smart scheduling for 5 platforms",
    "Advanced analytics dashboard",
    "Auto DM responses",
    "Video editing tools",
    "Priority support",
    "Custom brand voice training"
  ]
};

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

export default function SolutionContentCreators() {
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
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl flex items-center justify-center">
              <Camera className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
            For Content Creators
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Streamline your content creation workflow with AI-powered tools designed specifically for individual creators. 
            Create viral content, grow your audience, and monetize your passion with intelligent automation.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Badge variant="secondary" className="bg-pink-500/20 text-pink-300 border-pink-500/30">
              <Sparkles className="h-4 w-4 mr-1" />
              AI-Powered
            </Badge>
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
              <TrendingUp className="h-4 w-4 mr-1" />
              Growth Focused
            </Badge>
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
              <Clock className="h-4 w-4 mr-1" />
              Time Saving
            </Badge>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20"
          {...fadeInUp}
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-pink-400 mb-2">10M+</div>
            <div className="text-gray-400">Posts Created</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-rose-400 mb-2">150%</div>
            <div className="text-gray-400">Avg. Growth Increase</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">500K+</div>
            <div className="text-gray-400">Creators Using VeeFore</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">20hrs</div>
            <div className="text-gray-400">Saved Per Week</div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          className="mb-20"
          {...fadeInUp}
        >
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything You Need to <span className="text-pink-400">Go Viral</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-gray-700 hover:border-pink-500/50 transition-all duration-300 h-full">
                  <CardHeader>
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg text-white">
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
                          <CheckCircle className="h-4 w-4 text-pink-500 flex-shrink-0" />
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
          <h2 className="text-3xl font-bold mb-8">See VeeFore in Action</h2>
          <div className="relative max-w-4xl mx-auto">
            <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-700 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="h-8 w-8 text-white ml-1" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Watch Demo Video</h3>
                <p className="text-gray-400">See how creators are using VeeFore to grow their audience</p>
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
            What <span className="text-pink-400">Creators</span> Are Saying
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.handle}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-gray-700 h-full">
                  <CardHeader>
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-600 rounded-full flex items-center justify-center text-white font-bold">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-medium text-white">{testimonial.name}</div>
                        <div className="text-sm text-gray-400">{testimonial.handle} • {testimonial.followers} followers</div>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-blue-400 fill-current" />
                      ))}
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

        {/* Pricing Section */}
        <motion.div 
          className="mb-20 text-center"
          {...fadeInUp}
        >
          <h2 className="text-3xl font-bold mb-8">Perfect Plan for <span className="text-pink-400">Creators</span></h2>
          <div className="max-w-md mx-auto">
            <Card className="bg-gradient-to-br from-pink-900/20 to-rose-900/20 border-pink-500/50">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-white">{pricing.plan}</CardTitle>
                <div className="text-4xl font-bold text-pink-400">
                  {pricing.price}<span className="text-lg text-gray-400">/{pricing.period}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {pricing.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2 text-gray-300">
                      <CheckCircle className="h-5 w-5 text-pink-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700">
                  Start Creating Today
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          className="text-center bg-gradient-to-r from-pink-900/20 to-rose-900/20 rounded-2xl p-12 border border-pink-500/20"
          {...fadeInUp}
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Go Viral?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of creators who are already using VeeFore to grow their audience and create amazing content.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Link href="/signup">
              <Button size="lg" className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="border-pink-500/50 text-pink-400 hover:bg-pink-500/10">
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