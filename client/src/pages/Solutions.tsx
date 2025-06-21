import { motion } from 'framer-motion';
import { 
  Camera, 
  Building, 
  Users, 
  Briefcase,
  ArrowRight,
  CheckCircle,
  Zap,
  Target,
  TrendingUp,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';

const solutions = [
  {
    icon: <Camera className="h-12 w-12" />,
    title: "For Content Creators",
    description: "Streamline your content creation workflow with AI-powered tools designed for individual creators.",
    color: "from-pink-500 to-rose-600",
    features: [
      "AI Content Generation",
      "Automated Scheduling", 
      "Performance Analytics",
      "Engagement Tracking",
      "Brand Voice Training",
      "Hashtag Optimization"
    ],
    cta: "Learn More",
    href: "/solutions/creators"
  },
  {
    icon: <Building className="h-12 w-12" />,
    title: "For Small Businesses", 
    description: "Grow your business with professional social media management tools that scale with you.",
    color: "from-blue-500 to-cyan-600",
    features: [
      "Multi-Platform Management",
      "Customer Engagement",
      "Brand Monitoring", 
      "ROI Tracking",
      "Team Collaboration",
      "Lead Generation"
    ],
    cta: "Learn More",
    href: "/solutions/business"
  },
  {
    icon: <Users className="h-12 w-12" />,
    title: "For Agencies",
    description: "Manage multiple client accounts with advanced team collaboration and white-label reporting.",
    color: "from-purple-500 to-violet-600",
    features: [
      "Client Management",
      "White-label Reports",
      "Team Permissions",
      "Bulk Operations",
      "Client Billing",
      "Campaign Management"
    ],
    cta: "Learn More", 
    href: "/solutions/agencies"
  },
  {
    icon: <Briefcase className="h-12 w-12" />,
    title: "For Enterprise",
    description: "Enterprise-grade social media management with advanced security and custom integrations.",
    color: "from-green-500 to-emerald-600",
    features: [
      "Advanced Security",
      "Custom Integrations",
      "Dedicated Support",
      "SLA Guarantees",
      "Advanced Analytics",
      "Compliance Tools"
    ],
    cta: "Contact Sales",
    href: "/contact"
  }
];

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

export default function Solutions() {
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
            Tailored Solutions
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-violet-200 to-purple-300 bg-clip-text text-transparent">
            Solutions Built for
            <br />
            <span className="text-violet-400">Your Success</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Whether you're a content creator, small business, agency, or enterprise, 
            we have the perfect solution tailored to your unique needs and workflows.
          </p>
        </motion.div>

        {/* Solutions Grid */}
        <motion.div 
          className="grid md:grid-cols-2 gap-8 mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {solutions.map((solution, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="bg-space-gray/30 border-violet-500/20 backdrop-blur-sm hover:bg-space-gray/40 transition-all duration-300 h-full">
                <CardHeader>
                  <div className={`w-16 h-16 rounded-lg bg-gradient-to-r ${solution.color} flex items-center justify-center mb-4 text-white`}>
                    {solution.icon}
                  </div>
                  <CardTitle className="text-2xl text-white mb-2">{solution.title}</CardTitle>
                  <CardDescription className="text-gray-300 text-base">
                    {solution.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-4">Key Features:</h4>
                    <ul className="space-y-2 mb-6">
                      {solution.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-300">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link href={solution.href}>
                    <Button className={`w-full bg-gradient-to-r ${solution.color} hover:opacity-90`}>
                      {solution.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          className="grid md:grid-cols-4 gap-8 mb-20"
          {...fadeInUp}
        >
          {[
            { icon: <Users className="h-8 w-8" />, stat: "50K+", label: "Active Users" },
            { icon: <Globe className="h-8 w-8" />, stat: "8+", label: "Platforms" },
            { icon: <TrendingUp className="h-8 w-8" />, stat: "300%", label: "Avg Growth" },
            { icon: <Target className="h-8 w-8" />, stat: "99.9%", label: "Uptime" }
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-violet-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 text-violet-400">
                {item.icon}
              </div>
              <div className="text-3xl font-bold text-white mb-2">{item.stat}</div>
              <div className="text-gray-400">{item.label}</div>
            </div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          className="text-center bg-gradient-to-r from-violet-500/10 to-purple-600/10 rounded-2xl p-12 border border-violet-500/20"
          {...fadeInUp}
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Choose the solution that fits your needs and start transforming your social media presence today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth">
              <Button size="lg" className="bg-violet-600 hover:bg-violet-700">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline">
                Contact Sales
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}