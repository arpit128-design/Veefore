import { motion } from 'framer-motion';
import { 
  Bot, 
  Calendar, 
  BarChart3, 
  MessageSquare, 
  Users, 
  Zap, 
  Shield, 
  Globe,
  BrainCircuit,
  Palette,
  Target,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';

const features = [
  {
    icon: <Bot className="h-8 w-8" />,
    title: "AI Content Generation",
    description: "Create engaging posts, captions, and hashtags with advanced AI that understands your brand voice and audience preferences.",
    category: "AI Powered",
    benefits: ["50+ content templates", "Brand voice training", "Multi-language support"]
  },
  {
    icon: <Calendar className="h-8 w-8" />,
    title: "Smart Scheduling",
    description: "Automatically schedule your content at optimal times based on your audience's activity patterns and engagement data.",
    category: "Automation",
    benefits: ["Optimal timing AI", "Bulk scheduling", "Cross-platform posting"]
  },
  {
    icon: <BarChart3 className="h-8 w-8" />,
    title: "Advanced Analytics",
    description: "Get deep insights into your social media performance with real-time analytics and actionable recommendations.",
    category: "Analytics",
    benefits: ["Real-time metrics", "Competitor analysis", "ROI tracking"]
  },
  {
    icon: <MessageSquare className="h-8 w-8" />,
    title: "Auto DM Responses",
    description: "Intelligent automated responses to direct messages that maintain authentic conversations with your audience.",
    category: "Engagement",
    benefits: ["Context-aware replies", "24/7 availability", "Custom response rules"]
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "Team Collaboration",
    description: "Seamlessly collaborate with your team members with role-based permissions and approval workflows.",
    category: "Collaboration",
    benefits: ["Role management", "Approval workflows", "Team analytics"]
  },
  {
    icon: <Globe className="h-8 w-8" />,
    title: "Multi-Platform Support",
    description: "Manage Instagram, YouTube, Twitter, LinkedIn, Facebook, and TikTok from one unified dashboard.",
    category: "Integration",
    benefits: ["8+ platforms", "Unified inbox", "Cross-posting"]
  }
];

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

export default function Features() {
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
            All Features
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-violet-200 to-purple-300 bg-clip-text text-transparent">
            Powerful Features for
            <br />
            <span className="text-violet-400">Social Media Success</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Everything you need to create, schedule, analyze, and optimize your social media presence 
            with cutting-edge AI technology.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="bg-space-gray/30 border-violet-500/20 backdrop-blur-sm hover:bg-space-gray/40 transition-all duration-300 h-full">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-violet-500/20 rounded-lg text-violet-400">
                      {feature.icon}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {feature.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-300">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-400">
                        <ArrowRight className="h-4 w-4 mr-2 text-violet-400" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          className="text-center bg-gradient-to-r from-violet-500/10 to-purple-600/10 rounded-2xl p-12 border border-violet-500/20"
          {...fadeInUp}
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Social Media?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of creators and businesses who have revolutionized their social media strategy with VeeFore.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth">
              <Button size="lg" className="bg-violet-600 hover:bg-violet-700">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline">
                View Pricing
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}