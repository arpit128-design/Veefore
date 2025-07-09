import { motion } from 'framer-motion';
import { 
  Play, 
  Clock, 
  Users,
  Star,
  ArrowRight,
  Zap,
  CheckCircle,
  Calendar,
  BarChart3,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';

const demoFeatures = [
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: "AI Content Generation",
    description: "See how AI creates engaging posts tailored to your brand voice"
  },
  {
    icon: <Calendar className="h-6 w-6" />,
    title: "Smart Scheduling",
    description: "Watch automatic scheduling find the perfect times to post"
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: "Real-time Analytics",
    description: "Explore detailed insights and performance tracking"
  },
  {
    icon: <MessageSquare className="h-6 w-6" />,
    title: "Auto DM Responses",
    description: "See intelligent automation handle customer conversations"
  }
];

const demoStats = [
  { value: "15 min", label: "Demo Duration" },
  { value: "50K+", label: "Users Watched" },
  { value: "4.9/5", label: "Demo Rating" },
  { value: "Live", label: "Interactive Demo" }
];

const testimonials = [
  {
    name: "Sarah Martinez",
    role: "Content Creator",
    company: "@sarahcreates",
    quote: "The demo showed me exactly how VeeFore could save me hours each week. The AI features are incredible!",
    avatar: "SM"
  },
  {
    name: "Mike Chen",
    role: "Marketing Director", 
    company: "TechFlow",
    quote: "After watching the demo, I knew this was the solution our team needed. Implementation was seamless.",
    avatar: "MC"
  },
  {
    name: "Lisa Park",
    role: "Agency Owner",
    company: "Social Impact",
    quote: "The demo convinced me immediately. The multi-client management features are exactly what we needed.",
    avatar: "LP"
  }
];

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

export default function WatchDemo() {
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
          <Badge className="mb-6 bg-violet-500/20 text-violet-300 border-violet-500/30">
            Interactive Demo
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-violet-200 to-purple-300 bg-clip-text text-transparent">
            See VeeFore in
            <br />
            <span className="text-violet-400">Action</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Watch our 15-minute interactive demo to see how VeeFore can transform your social media 
            workflow and help you grow your audience faster than ever.
          </p>
        </motion.div>

        {/* Demo Video Section */}
        <motion.div 
          className="mb-20"
          {...fadeInUp}
        >
          <Card className="bg-space-gray/30 border-violet-500/20 backdrop-blur-sm overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-violet-500/20 to-purple-600/20 flex items-center justify-center relative">
              <div className="text-center">
                <div className="w-24 h-24 bg-violet-600 rounded-full flex items-center justify-center mx-auto mb-6 hover:bg-violet-700 transition-colors cursor-pointer group">
                  <Play className="h-12 w-12 text-white ml-1 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">VeeFore Platform Demo</h3>
                <p className="text-gray-300 mb-4">See how easy it is to manage all your social media in one place</p>
                <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>15 minutes</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>50K+ views</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span>4.9/5 rating</span>
                  </div>
                </div>
              </div>
              
              {/* Demo overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">Interactive Demo Available</div>
                        <div className="text-gray-300 text-sm">Click to start your personalized tour</div>
                      </div>
                      <Button size="sm" className="bg-violet-600 hover:bg-violet-700">
                        Start Demo
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Demo Stats */}
        <motion.div 
          className="grid md:grid-cols-4 gap-8 mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {demoStats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="text-3xl font-bold text-violet-400 mb-2">{stat.value}</div>
              <div className="text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* What You'll See */}
        <motion.div 
          className="mb-20"
          {...fadeInUp}
        >
          <h2 className="text-3xl font-bold mb-12 text-center text-white">What You'll See in the Demo</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {demoFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-space-gray/30 border-violet-500/20 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-violet-500/20 rounded-lg flex items-center justify-center text-violet-400 flex-shrink-0">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                        <p className="text-gray-300">{feature.description}</p>
                      </div>
                    </div>
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
          <h2 className="text-3xl font-bold mb-12 text-center text-white">What People Say About Our Demo</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-space-gray/30 border-violet-500/20 backdrop-blur-sm h-full">
                  <CardHeader>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-violet-500/20 rounded-full flex items-center justify-center text-violet-300 font-semibold">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-white">{testimonial.name}</div>
                        <div className="text-sm text-gray-400">{testimonial.role}</div>
                        <div className="text-sm text-violet-400">{testimonial.company}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 italic">"{testimonial.quote}"</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          className="text-center bg-gradient-to-r from-violet-500/10 to-purple-600/10 rounded-2xl p-12 border border-violet-500/20"
          {...fadeInUp}
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Social Media?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            After watching the demo, start your free trial and experience the power of AI-driven 
            social media management for yourself.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-violet-600 hover:bg-violet-700">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo Now
            </Button>
            <Link href="/signup">
              <Button size="lg" variant="outline">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}