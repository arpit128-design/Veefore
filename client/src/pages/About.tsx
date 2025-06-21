import { motion } from 'framer-motion';
import { 
  Rocket, 
  Target, 
  Users, 
  Award,
  ArrowRight,
  Zap,
  Globe,
  TrendingUp,
  Heart,
  Lightbulb,
  Shield,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Link } from 'wouter';

const team = [
  {
    name: "Alex Chen",
    role: "CEO & Co-Founder", 
    bio: "Former Meta engineer with 10+ years in social media technology. Passionate about democratizing AI for creators.",
    avatar: "AC",
    expertise: "AI & Product Strategy"
  },
  {
    name: "Sarah Rodriguez",
    role: "CTO & Co-Founder",
    bio: "Ex-Google AI researcher specializing in natural language processing and machine learning systems.",
    avatar: "SR", 
    expertise: "AI & Engineering"
  },
  {
    name: "Mike Thompson",
    role: "Head of Design",
    bio: "Award-winning product designer who previously led design teams at Spotify and Adobe.",
    avatar: "MT",
    expertise: "UX & Product Design"
  },
  {
    name: "Lisa Park",
    role: "VP of Marketing",
    bio: "Growth marketing expert who helped scale multiple SaaS companies from startup to IPO.",
    avatar: "LP",
    expertise: "Growth & Marketing"
  }
];

const values = [
  {
    icon: <Heart className="h-8 w-8" />,
    title: "Creator-First",
    description: "Every feature we build starts with understanding creators' real needs and challenges."
  },
  {
    icon: <Lightbulb className="h-8 w-8" />,
    title: "Innovation",
    description: "We push the boundaries of what's possible with AI and social media technology."
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: "Trust & Privacy",
    description: "Your data and content are secure. We never share or sell your information."
  },
  {
    icon: <Globe className="h-8 w-8" />,
    title: "Accessibility",
    description: "Social media success shouldn't be limited to big budgets. We make it accessible to everyone."
  }
];

const milestones = [
  {
    year: "2023",
    title: "Company Founded",
    description: "Started with a vision to democratize AI-powered social media management"
  },
  {
    year: "2024",
    title: "10K+ Users",
    description: "Reached our first major milestone with creators worldwide"
  },
  {
    year: "2024",
    title: "$5M Series A",
    description: "Raised funding to accelerate AI development and platform expansion"
  },
  {
    year: "2025",
    title: "50K+ Active Users",
    description: "Growing community of successful creators and businesses"
  }
];

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

export default function About() {
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
              <Link href="/careers">
                <Button variant="ghost">Careers</Button>
              </Link>
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
            About VeeFore
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-violet-200 to-purple-300 bg-clip-text text-transparent">
            Empowering Creators
            <br />
            <span className="text-violet-400">Worldwide</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            We're on a mission to democratize social media success by making AI-powered tools 
            accessible to creators, businesses, and agencies of all sizes.
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.div 
          className="grid md:grid-cols-2 gap-12 mb-20"
          {...fadeInUp}
        >
          <div>
            <h2 className="text-3xl font-bold mb-6 text-white">Our Mission</h2>
            <p className="text-gray-300 mb-6 text-lg">
              Social media success shouldn't be a privilege reserved for those with big budgets and large teams. 
              We believe every creator deserves access to powerful AI tools that can help them grow their audience, 
              create better content, and build sustainable businesses.
            </p>
            <p className="text-gray-300 mb-6">
              That's why we built VeeFore - to level the playing field and give independent creators the same 
              advantages that major brands have had for years.
            </p>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-violet-400">50K+</div>
                <div className="text-gray-400">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-violet-400">500M+</div>
                <div className="text-gray-400">Posts Managed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-violet-400">8+</div>
                <div className="text-gray-400">Platforms</div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-violet-500/20 to-purple-600/20 rounded-2xl p-8 border border-violet-500/20">
            <Rocket className="h-16 w-16 text-violet-400 mb-6" />
            <h3 className="text-2xl font-bold mb-4 text-white">Our Vision</h3>
            <p className="text-gray-300">
              To become the world's most trusted AI-powered social media platform, 
              helping millions of creators turn their passion into sustainable businesses 
              while maintaining authenticity and genuine connections with their audiences.
            </p>
          </div>
        </motion.div>

        {/* Values Section */}
        <motion.div 
          className="mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold mb-12 text-center text-white">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-space-gray/30 border-violet-500/20 backdrop-blur-sm text-center h-full">
                  <CardHeader>
                    <div className="w-16 h-16 bg-violet-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 text-violet-400">
                      {value.icon}
                    </div>
                    <CardTitle className="text-white">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div 
          className="mb-20"
          {...fadeInUp}
        >
          <h2 className="text-3xl font-bold mb-12 text-center text-white">Meet Our Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-space-gray/30 border-violet-500/20 backdrop-blur-sm text-center">
                  <CardHeader>
                    <Avatar className="w-20 h-20 mx-auto mb-4">
                      <AvatarFallback className="bg-violet-500/20 text-violet-300 text-lg">
                        {member.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-white">{member.name}</CardTitle>
                    <CardDescription className="text-violet-400 font-medium">
                      {member.role}
                    </CardDescription>
                    <Badge variant="outline" className="w-fit mx-auto">
                      {member.expertise}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 text-sm">{member.bio}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Timeline Section */}
        <motion.div 
          className="mb-20"
          {...fadeInUp}
        >
          <h2 className="text-3xl font-bold mb-12 text-center text-white">Our Journey</h2>
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                className="flex items-start space-x-6"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="w-16 h-16 bg-violet-500/20 rounded-full flex items-center justify-center text-violet-400 font-bold flex-shrink-0">
                  {milestone.year}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{milestone.title}</h3>
                  <p className="text-gray-300">{milestone.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          className="text-center bg-gradient-to-r from-violet-500/10 to-purple-600/10 rounded-2xl p-12 border border-violet-500/20"
          {...fadeInUp}
        >
          <h2 className="text-3xl font-bold mb-4">Join Our Mission</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Whether you're a creator looking to grow, or want to be part of our team, 
            we'd love to connect with you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth">
              <Button size="lg" className="bg-violet-600 hover:bg-violet-700">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/careers">
              <Button size="lg" variant="outline">
                View Open Positions
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}