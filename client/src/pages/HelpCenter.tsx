import { motion } from 'framer-motion';
import { 
  Search, 
  Book, 
  MessageSquare,
  Video,
  ArrowRight,
  Zap,
  ChevronRight,
  Star,
  Clock,
  Users,
  CheckCircle,
  HelpCircle,
  FileText,
  Lightbulb
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Link } from 'wouter';

const categories = [
  {
    icon: <Book className="h-8 w-8" />,
    title: "Getting Started",
    description: "Set up your account and connect your first social media platform",
    articles: 12,
    color: "from-blue-500 to-cyan-600"
  },
  {
    icon: <Zap className="h-8 w-8" />,
    title: "AI Features",
    description: "Learn how to use AI content generation and automation tools",
    articles: 18,
    color: "from-violet-500 to-purple-600"
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "Team Management",
    description: "Collaborate with team members and manage permissions",
    articles: 8,
    color: "from-green-500 to-emerald-600"
  },
  {
    icon: <FileText className="h-8 w-8" />,
    title: "Billing & Plans",
    description: "Manage your subscription, billing, and plan upgrades",
    articles: 15,
    color: "from-orange-500 to-red-600"
  }
];

const popularArticles = [
  {
    title: "How to Connect Your Instagram Account",
    category: "Getting Started",
    readTime: "3 min",
    views: "25k",
    rating: 4.9
  },
  {
    title: "Setting Up AI Content Generation",
    category: "AI Features", 
    readTime: "5 min",
    views: "18k",
    rating: 4.8
  },
  {
    title: "Understanding Your Analytics Dashboard",
    category: "Analytics",
    readTime: "7 min",
    views: "15k",
    rating: 4.7
  },
  {
    title: "Creating Your First Automated Post",
    category: "Automation",
    readTime: "4 min",
    views: "12k",
    rating: 4.9
  },
  {
    title: "Managing Team Member Access",
    category: "Team Management",
    readTime: "6 min",
    views: "8k",
    rating: 4.6
  }
];

const quickActions = [
  {
    icon: <MessageSquare className="h-6 w-6" />,
    title: "Contact Support",
    description: "Get help from our team",
    action: "Chat Now"
  },
  {
    icon: <Video className="h-6 w-6" />,
    title: "Video Tutorials", 
    description: "Watch step-by-step guides",
    action: "Watch Now"
  },
  {
    icon: <FileText className="h-6 w-6" />,
    title: "API Documentation",
    description: "Developer resources",
    action: "View Docs"
  }
];

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

export default function HelpCenter() {
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
              <Link href="/contact">
                <Button variant="ghost">Contact</Button>
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
            Help Center
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-violet-200 to-purple-300 bg-clip-text text-transparent">
            How Can We
            <br />
            <span className="text-violet-400">Help You?</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Find answers to your questions, learn how to use VeeFore effectively, 
            and get the most out of your social media management.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input 
              placeholder="Search for help articles, features, or topics..."
              className="pl-12 pr-4 py-4 bg-space-gray/50 border-violet-500/30 text-white placeholder-gray-400 text-lg"
            />
            <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-violet-600 hover:bg-violet-700">
              Search
            </Button>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          className="grid md:grid-cols-3 gap-6 mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {quickActions.map((action, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="bg-space-gray/30 border-violet-500/20 backdrop-blur-sm hover:bg-space-gray/40 transition-all duration-300 cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-violet-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 text-violet-400">
                    {action.icon}
                  </div>
                  <h3 className="font-semibold text-white mb-2">{action.title}</h3>
                  <p className="text-gray-300 text-sm mb-4">{action.description}</p>
                  <Button variant="outline" size="sm">
                    {action.action}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Help Categories */}
        <motion.div 
          className="mb-20"
          {...fadeInUp}
        >
          <h2 className="text-3xl font-bold mb-12 text-center text-white">Browse by Category</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-space-gray/30 border-violet-500/20 backdrop-blur-sm hover:bg-space-gray/40 transition-all duration-300 cursor-pointer h-full">
                  <CardHeader className="text-center">
                    <div className={`w-16 h-16 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center mx-auto mb-4 text-white`}>
                      {category.icon}
                    </div>
                    <CardTitle className="text-white">{category.title}</CardTitle>
                    <CardDescription className="text-gray-300">
                      {category.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="flex items-center justify-center space-x-2 text-violet-400">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">{category.articles} articles</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Popular Articles */}
        <motion.div 
          className="mb-20"
          {...fadeInUp}
        >
          <h2 className="text-3xl font-bold mb-12 text-center text-white">Popular Articles</h2>
          <div className="space-y-4">
            {popularArticles.map((article, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-space-gray/30 border-violet-500/20 backdrop-blur-sm hover:bg-space-gray/40 transition-all duration-300 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-white text-lg">{article.title}</h3>
                          <Badge variant="outline" className="text-xs">
                            {article.category}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-6 text-gray-400 text-sm">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{article.readTime}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{article.views} views</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400" />
                            <span>{article.rating}</span>
                          </div>
                        </div>
                      </div>
                      
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Still Need Help */}
        <motion.div 
          className="text-center bg-gradient-to-r from-violet-500/10 to-purple-600/10 rounded-2xl p-12 border border-violet-500/20"
          {...fadeInUp}
        >
          <HelpCircle className="h-16 w-16 text-violet-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Can't find what you're looking for? Our support team is here to help you 
            get the most out of VeeFore.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-violet-600 hover:bg-violet-700">
                Contact Support
                <MessageSquare className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              Schedule a Demo
              <Video className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}