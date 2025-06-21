import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  ArrowRight,
  Zap,
  Tag,
  User,
  TrendingUp,
  MessageSquare,
  Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Link } from 'wouter';

const blogPosts = [
  {
    id: 1,
    title: "10 AI-Powered Social Media Strategies That Actually Work in 2025",
    excerpt: "Discover the latest AI trends and strategies that top content creators are using to dominate social media platforms.",
    author: "Sarah Martinez",
    authorAvatar: "SM",
    category: "AI & Automation",
    readTime: "8 min read",
    publishDate: "2025-01-15",
    featured: true,
    tags: ["AI", "Strategy", "Growth"],
    image: "/api/placeholder/600/400"
  },
  {
    id: 2,
    title: "Instagram Algorithm Update: What Creators Need to Know",
    excerpt: "Breaking down the latest Instagram algorithm changes and how to optimize your content for maximum reach.",
    author: "Mike Chen",
    authorAvatar: "MC",
    category: "Platform Updates",
    readTime: "6 min read", 
    publishDate: "2025-01-12",
    featured: false,
    tags: ["Instagram", "Algorithm", "Tips"],
    image: "/api/placeholder/600/400"
  },
  {
    id: 3,
    title: "From 0 to 100K: A Creator's Journey Using VeeFore",
    excerpt: "Real success story of how one creator grew from zero to 100K followers using VeeFore's AI-powered tools.",
    author: "Alex Rodriguez",
    authorAvatar: "AR",
    category: "Success Stories",
    readTime: "10 min read",
    publishDate: "2025-01-10",
    featured: false,
    tags: ["Success Story", "Growth", "Case Study"],
    image: "/api/placeholder/600/400"
  },
  {
    id: 4,
    title: "The Complete Guide to Cross-Platform Content Strategy",
    excerpt: "Learn how to create cohesive content that works across Instagram, TikTok, YouTube, and other platforms.",
    author: "Emma Thompson",
    authorAvatar: "ET",
    category: "Content Strategy",
    readTime: "12 min read",
    publishDate: "2025-01-08",
    featured: false,
    tags: ["Strategy", "Multi-platform", "Content"],
    image: "/api/placeholder/600/400"
  },
  {
    id: 5,
    title: "Social Media Analytics: Metrics That Actually Matter",
    excerpt: "Stop tracking vanity metrics. Here's what you should really be measuring to grow your social media presence.",
    author: "David Kim",
    authorAvatar: "DK",
    category: "Analytics",
    readTime: "7 min read",
    publishDate: "2025-01-05",
    featured: false,
    tags: ["Analytics", "Metrics", "Growth"],
    image: "/api/placeholder/600/400"
  },
  {
    id: 6,
    title: "Building an Authentic Brand Voice with AI",
    excerpt: "How to maintain authenticity while leveraging AI tools for content creation and audience engagement.",
    author: "Lisa Park",
    authorAvatar: "LP",
    category: "Branding",
    readTime: "9 min read",
    publishDate: "2025-01-03",
    featured: false,
    tags: ["Branding", "AI", "Authenticity"],
    image: "/api/placeholder/600/400"
  }
];

const categories = [
  "All Posts",
  "AI & Automation", 
  "Platform Updates",
  "Content Strategy",
  "Success Stories",
  "Analytics",
  "Branding"
];

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

export default function Blog() {
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
            VeeFore Blog
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-violet-200 to-purple-300 bg-clip-text text-transparent">
            Insights & Tips for
            <br />
            <span className="text-violet-400">Social Media Success</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Stay ahead of the curve with expert insights, platform updates, and actionable strategies 
            to grow your social media presence.
          </p>
        </motion.div>

        {/* Categories */}
        <motion.div 
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {categories.map((category, index) => (
            <Button
              key={index}
              variant={index === 0 ? "default" : "outline"}
              className={index === 0 ? "bg-violet-600 hover:bg-violet-700" : ""}
            >
              {category}
            </Button>
          ))}
        </motion.div>

        {/* Featured Post */}
        <motion.div 
          className="mb-20"
          {...fadeInUp}
        >
          {blogPosts.filter(post => post.featured).map((post) => (
            <Card key={post.id} className="bg-space-gray/30 border-violet-500/20 backdrop-blur-sm overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <div className="h-64 md:h-full bg-gradient-to-br from-violet-500/20 to-purple-600/20 flex items-center justify-center">
                    <div className="text-center">
                      <TrendingUp className="h-16 w-16 text-violet-400 mx-auto mb-4" />
                      <p className="text-gray-400">Featured Article</p>
                    </div>
                  </div>
                </div>
                <div className="md:w-1/2 p-8">
                  <Badge className="mb-4 bg-violet-500/20 text-violet-300 border-violet-500/30">
                    Featured
                  </Badge>
                  <Badge variant="outline" className="mb-4 ml-2">
                    {post.category}
                  </Badge>
                  <h2 className="text-3xl font-bold text-white mb-4">{post.title}</h2>
                  <p className="text-gray-300 mb-6">{post.excerpt}</p>
                  
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback className="bg-violet-500/20 text-violet-300">
                          {post.authorAvatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-white font-medium">{post.author}</div>
                        <div className="text-gray-400 text-sm">{post.publishDate}</div>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-400 text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      {post.readTime}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {post.tags.map((tag, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Button className="bg-violet-600 hover:bg-violet-700">
                    Read Full Article
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </motion.div>

        {/* Blog Posts Grid */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {blogPosts.filter(post => !post.featured).map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="bg-space-gray/30 border-violet-500/20 backdrop-blur-sm hover:bg-space-gray/40 transition-all duration-300 h-full">
                <CardHeader>
                  <div className="h-40 bg-gradient-to-br from-violet-500/20 to-purple-600/20 rounded-lg mb-4 flex items-center justify-center">
                    <MessageSquare className="h-12 w-12 text-violet-400" />
                  </div>
                  <Badge variant="outline" className="w-fit mb-2">
                    {post.category}
                  </Badge>
                  <CardTitle className="text-lg text-white hover:text-violet-300 transition-colors cursor-pointer line-clamp-2">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="text-gray-300 line-clamp-3">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-violet-500/20 text-violet-300 text-xs">
                          {post.authorAvatar}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-gray-400 text-sm">{post.author}</span>
                    </div>
                    <div className="flex items-center text-gray-400 text-sm">
                      <Clock className="h-3 w-3 mr-1" />
                      {post.readTime}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.slice(0, 2).map((tag, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">{post.publishDate}</span>
                    <Button size="sm" variant="ghost" className="text-violet-400 hover:text-violet-300">
                      Read More
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Newsletter Signup */}
        <motion.div 
          className="text-center bg-gradient-to-r from-violet-500/10 to-purple-600/10 rounded-2xl p-12 border border-violet-500/20"
          {...fadeInUp}
        >
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Get the latest social media insights, platform updates, and growth strategies delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 bg-space-gray/50 border border-violet-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-violet-500"
            />
            <Button className="bg-violet-600 hover:bg-violet-700">
              Subscribe
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}