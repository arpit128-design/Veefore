import { motion } from 'framer-motion';
import { 
  Star, 
  ArrowRight,
  Quote,
  Zap,
  Users,
  TrendingUp,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'wouter';

const reviews = [
  {
    name: "Sarah Chen",
    role: "Content Creator",
    company: "@sarahcreates",
    rating: 5,
    content: "VeeFore completely transformed my content workflow. The AI suggestions are spot-on, and I've seen a 400% increase in engagement since I started using it.",
    avatar: "SC",
    platform: "Instagram",
    followers: "150K"
  },
  {
    name: "Marcus Rodriguez", 
    role: "Marketing Director",
    company: "TechFlow Solutions",
    rating: 5,
    content: "Managing multiple client accounts used to be a nightmare. VeeFore's team collaboration features and analytics have made us 10x more efficient.",
    avatar: "MR",
    platform: "Multi-platform",
    followers: "500K+"
  },
  {
    name: "Emily Foster",
    role: "Small Business Owner", 
    company: "Foster's Bakery",
    rating: 5,
    content: "As a small business owner, I don't have time to manage social media all day. VeeFore's automation saves me 15+ hours per week while growing my audience.",
    avatar: "EF",
    platform: "Facebook & Instagram", 
    followers: "25K"
  },
  {
    name: "David Kim",
    role: "YouTube Creator",
    company: "@davidtech",
    rating: 5,
    content: "The cross-platform scheduling is amazing. I can plan my entire content calendar across YouTube, Twitter, and Instagram in one place. Game changer!",
    avatar: "DK",
    platform: "YouTube",
    followers: "2M"
  },
  {
    name: "Lisa Thompson",
    role: "Agency Founder",
    company: "Social Impact Agency",
    rating: 5,
    content: "We manage 50+ client accounts with VeeFore. The white-label reporting and team permissions make it perfect for agencies. Our clients love the insights.",
    avatar: "LT",
    platform: "Agency",
    followers: "10M+ managed"
  },
  {
    name: "Alex Patel",
    role: "E-commerce Brand",
    company: "Patel Fashion",
    rating: 5,
    content: "ROI tracking is incredible. We can see exactly which social posts drive sales. VeeFore helped us increase our social commerce revenue by 250%.",
    avatar: "AP",
    platform: "Instagram & TikTok",
    followers: "75K"
  }
];

const stats = [
  { value: "4.9", label: "Average Rating", icon: <Star className="h-6 w-6" /> },
  { value: "10K+", label: "Happy Customers", icon: <Users className="h-6 w-6" /> },
  { value: "50M+", label: "Posts Managed", icon: <TrendingUp className="h-6 w-6" /> },
  { value: "99.9%", label: "Customer Satisfaction", icon: <Award className="h-6 w-6" /> }
];

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

export default function Reviews() {
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
              <Link href="/features">
                <Button variant="ghost">Features</Button>
              </Link>
              <Link href="/pricing">
                <Button variant="ghost">Pricing</Button>
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
          <Badge className="mb-6 bg-violet-500/20 text-violet-300 border-violet-500/30">
            Customer Reviews
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-violet-200 to-purple-300 bg-clip-text text-transparent">
            Loved by Creators
            <br />
            <span className="text-violet-400">Worldwide</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Join thousands of content creators, businesses, and agencies who trust VeeFore 
            to power their social media success.
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          className="grid md:grid-cols-4 gap-8 mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="w-16 h-16 bg-violet-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 text-violet-400">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Reviews Grid */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="bg-space-gray/30 border-violet-500/20 backdrop-blur-sm hover:bg-space-gray/40 transition-all duration-300 h-full">
                <CardHeader>
                  <div className="flex items-center space-x-4 mb-4">
                    <Avatar>
                      <AvatarFallback className="bg-violet-500/20 text-violet-300">
                        {review.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-semibold text-white">{review.name}</div>
                      <div className="text-sm text-gray-400">{review.role}</div>
                      <div className="text-sm text-violet-400">{review.company}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <Quote className="h-6 w-6 text-violet-400/50 mb-2" />
                    <p className="text-gray-300 mb-4 italic">"{review.content}"</p>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>{review.platform}</span>
                      <span>{review.followers} followers</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Rating Summary */}
        <motion.div 
          className="bg-gradient-to-r from-violet-500/10 to-purple-600/10 rounded-2xl p-12 border border-violet-500/20 mb-20"
          {...fadeInUp}
        >
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="text-6xl font-bold text-white">4.9</div>
              <div>
                <div className="flex items-center space-x-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                <div className="text-gray-400">out of 5 stars</div>
              </div>
            </div>
            <p className="text-xl text-gray-300 mb-8">
              Based on 10,000+ verified customer reviews
            </p>
            <div className="space-y-2">
              {[
                { stars: 5, percentage: 87 },
                { stars: 4, percentage: 11 },
                { stars: 3, percentage: 2 },
                { stars: 2, percentage: 0 },
                { stars: 1, percentage: 0 }
              ].map((rating, index) => (
                <div key={index} className="flex items-center space-x-4 max-w-md mx-auto">
                  <div className="flex items-center space-x-1 w-16">
                    <span className="text-sm text-gray-400">{rating.stars}</span>
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  </div>
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${rating.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-400 w-12">{rating.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          className="text-center"
          {...fadeInUp}
        >
          <h2 className="text-3xl font-bold mb-4">Join Our Happy Customers</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Experience why thousands of creators and businesses choose VeeFore for their social media success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth">
              <Button size="lg" className="bg-violet-600 hover:bg-violet-700">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/features">
              <Button size="lg" variant="outline">
                Explore Features
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}