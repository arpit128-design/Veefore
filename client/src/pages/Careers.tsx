import { motion } from 'framer-motion';
import { 
  MapPin, 
  Clock, 
  Users,
  ArrowRight,
  Zap,
  Code,
  Palette,
  TrendingUp,
  Globe,
  Heart,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';

const jobs = [
  {
    title: "Senior Full Stack Engineer",
    department: "Engineering",
    location: "San Francisco, CA",
    type: "Full-time",
    icon: <Code className="h-6 w-6" />,
    description: "Build scalable AI-powered social media tools used by millions of creators worldwide.",
    requirements: ["5+ years React/Node.js", "AI/ML experience", "Social media APIs"],
    level: "Senior"
  },
  {
    title: "AI/ML Engineer", 
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    icon: <Zap className="h-6 w-6" />,
    description: "Develop cutting-edge AI models for content generation and social media optimization.",
    requirements: ["PhD in CS/ML", "Python/TensorFlow", "NLP experience"],
    level: "Senior"
  },
  {
    title: "Product Designer",
    department: "Design",
    location: "New York, NY",
    type: "Full-time", 
    icon: <Palette className="h-6 w-6" />,
    description: "Design intuitive interfaces that empower creators to build their social media presence.",
    requirements: ["5+ years product design", "Figma expertise", "SaaS experience"],
    level: "Mid-Senior"
  },
  {
    title: "Growth Marketing Manager",
    department: "Marketing",
    location: "Remote",
    type: "Full-time",
    icon: <TrendingUp className="h-6 w-6" />,
    description: "Drive user acquisition and retention through data-driven marketing campaigns.",
    requirements: ["3+ years growth marketing", "B2B SaaS", "Analytics tools"],
    level: "Mid-Level"
  },
  {
    title: "Customer Success Manager",
    department: "Customer Success",
    location: "San Francisco, CA",
    type: "Full-time",
    icon: <Users className="h-6 w-6" />,
    description: "Help creators and businesses maximize their success with VeeFore platform.",
    requirements: ["2+ years customer success", "SaaS experience", "Creator economy knowledge"],
    level: "Mid-Level"
  },
  {
    title: "DevOps Engineer",
    department: "Engineering", 
    location: "Remote",
    type: "Full-time",
    icon: <Globe className="h-6 w-6" />,
    description: "Scale our infrastructure to support millions of users across global platforms.",
    requirements: ["AWS/GCP expertise", "Kubernetes", "CI/CD pipelines"],
    level: "Senior"
  }
];

const benefits = [
  {
    icon: <Heart className="h-8 w-8" />,
    title: "Health & Wellness",
    description: "Comprehensive health, dental, and vision insurance plus wellness stipend"
  },
  {
    icon: <Globe className="h-8 w-8" />,
    title: "Remote First",
    description: "Work from anywhere with flexible hours and home office setup budget"
  },
  {
    icon: <TrendingUp className="h-8 w-8" />,
    title: "Growth & Learning",
    description: "$2,000 annual learning budget and conference attendance support"
  },
  {
    icon: <Star className="h-8 w-8" />,
    title: "Equity & Bonuses",
    description: "Competitive equity package and performance-based bonuses"
  }
];

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

export default function Careers() {
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
              <Link href="/about">
                <Button variant="ghost">About</Button>
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
            Join Our Team
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-violet-200 to-purple-300 bg-clip-text text-transparent">
            Build the Future of
            <br />
            <span className="text-violet-400">Social Media</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Join a passionate team of creators, engineers, and innovators who are democratizing 
            social media success through cutting-edge AI technology.
          </p>
        </motion.div>

        {/* Benefits Section */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="bg-space-gray/30 border-violet-500/20 backdrop-blur-sm text-center h-full">
                <CardHeader>
                  <div className="w-16 h-16 bg-violet-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 text-violet-400">
                    {benefit.icon}
                  </div>
                  <CardTitle className="text-white">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">{benefit.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Open Positions */}
        <motion.div 
          className="mb-20"
          {...fadeInUp}
        >
          <h2 className="text-3xl font-bold mb-12 text-center text-white">Open Positions</h2>
          <div className="space-y-6">
            {jobs.map((job, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-space-gray/30 border-violet-500/20 backdrop-blur-sm hover:bg-space-gray/40 transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="w-12 h-12 bg-violet-500/20 rounded-lg flex items-center justify-center text-violet-400">
                            {job.icon}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white">{job.title}</h3>
                            <div className="flex items-center space-x-4 text-gray-400">
                              <span>{job.department}</span>
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {job.location}
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {job.type}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-gray-300 mb-4">{job.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge className="bg-violet-500/20 text-violet-300 border-violet-500/30">
                            {job.level}
                          </Badge>
                          {job.requirements.map((req, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {req}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <Button className="bg-violet-600 hover:bg-violet-700 ml-6">
                        Apply Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Company Culture */}
        <motion.div 
          className="grid md:grid-cols-2 gap-12 mb-20"
          {...fadeInUp}
        >
          <div>
            <h2 className="text-3xl font-bold mb-6 text-white">Why VeeFore?</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                We're not just building a product – we're democratizing social media success. 
                Every day, we help creators and businesses transform their online presence and 
                build sustainable careers.
              </p>
              <p>
                Our team values innovation, authenticity, and impact. We believe the best work 
                happens when talented people have the freedom to create, experiment, and grow.
              </p>
              <p>
                Join us in building the future of social media technology that empowers millions 
                of creators worldwide.
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-violet-400">50+</div>
                <div className="text-gray-400 text-sm">Team Members</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-violet-400">15+</div>
                <div className="text-gray-400 text-sm">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-violet-400">4.9/5</div>
                <div className="text-gray-400 text-sm">Glassdoor Rating</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-violet-500/20 to-purple-600/20 rounded-2xl p-8 border border-violet-500/20">
            <h3 className="text-2xl font-bold mb-6 text-white">Our Values</h3>
            <div className="space-y-4">
              <div>
                <div className="font-semibold text-violet-300 mb-1">Creator-First Mindset</div>
                <div className="text-gray-300 text-sm">Everything we build starts with understanding creator needs</div>
              </div>
              <div>
                <div className="font-semibold text-violet-300 mb-1">Innovation & Excellence</div>
                <div className="text-gray-300 text-sm">We push boundaries and deliver exceptional quality</div>
              </div>
              <div>
                <div className="font-semibold text-violet-300 mb-1">Transparency & Trust</div>
                <div className="text-gray-300 text-sm">Open communication and honest feedback culture</div>
              </div>
              <div>
                <div className="font-semibold text-violet-300 mb-1">Global Impact</div>
                <div className="text-gray-300 text-sm">Building tools that empower creators worldwide</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          className="text-center bg-gradient-to-r from-violet-500/10 to-purple-600/10 rounded-2xl p-12 border border-violet-500/20"
          {...fadeInUp}
        >
          <h2 className="text-3xl font-bold mb-4">Don't See the Perfect Role?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            We're always looking for exceptional talent. Send us your resume and tell us 
            how you'd like to contribute to democratizing social media success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-violet-600 hover:bg-violet-700">
                Send Your Resume
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline">
                Learn More About Us
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}