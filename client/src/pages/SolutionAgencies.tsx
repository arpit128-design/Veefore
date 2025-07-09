import { motion } from 'framer-motion';
import { 
  Users, 
  Bot, 
  Calendar, 
  BarChart3, 
  Shield,
  Globe,
  Zap,
  CheckCircle,
  ArrowRight,
  Star,
  TrendingUp,
  Target,
  Clock,
  FileText,
  Settings,
  DollarSign,
  MessageSquare,
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { useEffect } from 'react';

const features = [
  {
    icon: <Users className="h-8 w-8" />,
    title: "Client Management",
    description: "Efficiently manage multiple client accounts with dedicated workspaces and permissions.",
    benefits: ["Unlimited client accounts", "Role-based access control", "Client billing integration", "Workspace isolation"]
  },
  {
    icon: <FileText className="h-8 w-8" />,
    title: "White-label Reports",
    description: "Generate professional, branded reports that showcase your expertise to clients.",
    benefits: ["Custom branding", "Automated report generation", "Performance insights", "Client-ready presentations"]
  },
  {
    icon: <Settings className="h-8 w-8" />,
    title: "Team Permissions",
    description: "Control what your team can access and do across different client accounts.",
    benefits: ["Granular permissions", "Team collaboration tools", "Activity tracking", "Approval workflows"]
  },
  {
    icon: <Target className="h-8 w-8" />,
    title: "Bulk Operations",
    description: "Scale your operations with bulk content creation, scheduling, and management.",
    benefits: ["Batch content creation", "Multi-client scheduling", "Template libraries", "Automated workflows"]
  },
  {
    icon: <DollarSign className="h-8 w-8" />,
    title: "Client Billing",
    description: "Transparent billing system with usage tracking and automated invoicing.",
    benefits: ["Usage-based billing", "Automated invoicing", "Client cost tracking", "Profit margin analysis"]
  },
  {
    icon: <BarChart3 className="h-8 w-8" />,
    title: "Campaign Management",
    description: "Organize and track campaigns across multiple clients and platforms.",
    benefits: ["Campaign tracking", "Performance comparison", "ROI measurement", "Client reporting"]
  }
];

const testimonials = [
  {
    name: "Marcus Thompson",
    company: "Digital Growth Agency",
    role: "Founder & CEO",
    clients: "45+ Clients",
    content: "VeeFore transformed our agency operations. We went from managing 15 clients to 45+ with the same team size. The white-label reports alone saved us 20 hours per week.",
    rating: 5,
    results: "3x Client Growth"
  },
  {
    name: "Lisa Chen",
    company: "Social Media Experts",
    role: "Operations Director",
    clients: "30+ Clients",
    content: "The team permission system is incredible. We can give clients access to their data without compromising other accounts. Our client satisfaction scores increased by 40%.",
    rating: 5,
    results: "+40% Client Satisfaction"
  },
  {
    name: "David Rodriguez",
    company: "Creative Collective",
    role: "Agency Owner",
    clients: "25+ Clients",
    content: "Client billing used to be a nightmare. Now it's completely automated and transparent. We've increased our profit margins by 35% with better cost tracking.",
    rating: 5,
    results: "+35% Profit Margins"
  }
];

const caseStudies = [
  {
    agency: "Stellar Marketing Agency",
    challenge: "Managing 20+ client accounts across multiple platforms was overwhelming",
    solution: "Implemented VeeFore's agency solution with team permissions and white-label reporting",
    results: [
      "Increased client capacity from 20 to 60+ accounts",
      "Reduced report generation time by 80%",
      "Improved team productivity by 250%",
      "Increased monthly recurring revenue by 400%"
    ],
    timeframe: "8 months",
    teamSize: "12 people"
  },
  {
    agency: "Growth Partners Digital",
    challenge: "Clients wanted more transparency and detailed reporting",
    solution: "Deployed custom white-label reports and client portal access",
    results: [
      "100% client retention rate",
      "30% increase in average contract value",
      "50% reduction in client meetings",
      "Automated 90% of reporting processes"
    ],
    timeframe: "6 months",
    teamSize: "8 people"
  }
];

const pricingTiers = [
  {
    name: "Agency Starter",
    price: "$199",
    period: "month",
    description: "Perfect for growing agencies",
    features: [
      "Up to 25 client accounts",
      "5 team members",
      "Basic white-label reports",
      "Standard integrations",
      "Email support"
    ],
    highlighted: false
  },
  {
    name: "Agency Pro",
    price: "$399",
    period: "month",
    description: "Most popular for established agencies",
    features: [
      "Up to 100 client accounts",
      "15 team members",
      "Advanced white-label reports",
      "All integrations + API access",
      "Priority support + account manager",
      "Custom branding",
      "Advanced analytics"
    ],
    highlighted: true
  },
  {
    name: "Agency Enterprise",
    price: "Custom",
    period: "month",
    description: "Unlimited scale for large agencies",
    features: [
      "Unlimited client accounts",
      "Unlimited team members",
      "Custom white-label solutions",
      "Dedicated infrastructure",
      "24/7 dedicated support",
      "Custom integrations",
      "SLA guarantees"
    ],
    highlighted: false
  }
];

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

export default function SolutionAgencies() {
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
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
              <Users className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
            For Agencies
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Scale your agency operations with powerful client management tools, white-label reporting, and team collaboration features. 
            Manage multiple client accounts efficiently while maintaining the highest level of service quality.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
              <Users className="h-4 w-4 mr-1" />
              Multi-Client
            </Badge>
            <Badge variant="secondary" className="bg-violet-500/20 text-violet-300 border-violet-500/30">
              <FileText className="h-4 w-4 mr-1" />
              White-Label
            </Badge>
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
              <Shield className="h-4 w-4 mr-1" />
              Enterprise Security
            </Badge>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20"
          {...fadeInUp}
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">2,500+</div>
            <div className="text-gray-400">Agencies Using VeeFore</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-violet-400 mb-2">500%</div>
            <div className="text-gray-400">Avg. Client Capacity Increase</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">$50M+</div>
            <div className="text-gray-400">Client Revenue Managed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">80%</div>
            <div className="text-gray-400">Time Savings on Reports</div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          className="mb-20"
          {...fadeInUp}
        >
          <h2 className="text-3xl font-bold text-center mb-12">
            Built for <span className="text-purple-400">Agency Success</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-gray-700 hover:border-purple-500/50 transition-all duration-300 h-full">
                  <CardHeader>
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 bg-gradient-to-r from-purple-500 to-violet-600 rounded-lg text-white">
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
                          <CheckCircle className="h-4 w-4 text-purple-500 flex-shrink-0" />
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
            Agency <span className="text-purple-400">Success Stories</span>
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {caseStudies.map((study, index) => (
              <motion.div
                key={study.agency}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className="bg-gradient-to-br from-purple-900/20 to-violet-900/20 border-purple-500/50 h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <CardTitle className="text-white">{study.agency}</CardTitle>
                        <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                          <span>Team: {study.teamSize}</span>
                          <span>Timeline: {study.timeframe}</span>
                        </div>
                      </div>
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
            What <span className="text-purple-400">Agency Owners</span> Are Saying
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
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-600 rounded-full flex items-center justify-center text-white font-bold">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-medium text-white">{testimonial.name}</div>
                        <div className="text-sm text-gray-400">{testimonial.role}</div>
                        <div className="text-xs text-purple-400">{testimonial.company}</div>
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
                    <div className="mt-3 text-xs text-purple-400">{testimonial.clients}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Pricing Section */}
        <motion.div 
          className="mb-20"
          {...fadeInUp}
        >
          <h2 className="text-3xl font-bold text-center mb-8">Choose Your <span className="text-purple-400">Agency Plan</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className={`relative ${tier.highlighted 
                  ? 'bg-gradient-to-br from-purple-900/20 to-violet-900/20 border-purple-500/50' 
                  : 'bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-gray-700'
                } h-full`}>
                  {tier.highlighted && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-purple-500 text-white">Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-white">{tier.name}</CardTitle>
                    <p className="text-gray-400 text-sm">{tier.description}</p>
                    <div className="text-4xl font-bold text-purple-400">
                      {tier.price}
                      {tier.price !== "Custom" && <span className="text-lg text-gray-400">/{tier.period}</span>}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {tier.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center space-x-2 text-gray-300">
                          <CheckCircle className="h-5 w-5 text-purple-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full ${tier.highlighted 
                        ? 'bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700' 
                        : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      {tier.price === "Custom" ? "Contact Sales" : "Start Free Trial"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          className="text-center bg-gradient-to-r from-purple-900/20 to-violet-900/20 rounded-2xl p-12 border border-purple-500/20"
          {...fadeInUp}
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Scale Your Agency?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of agencies that are already using VeeFore to manage more clients, deliver better results, and increase profitability.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Link href="/signup">
              <Button size="lg" className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700">
                Start Agency Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10">
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