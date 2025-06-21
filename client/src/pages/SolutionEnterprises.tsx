import { motion } from 'framer-motion';
import { 
  Shield, 
  Bot, 
  Calendar, 
  BarChart3, 
  Globe,
  Lock,
  Zap,
  CheckCircle,
  ArrowRight,
  Star,
  TrendingUp,
  Target,
  Clock,
  Server,
  Settings,
  DollarSign,
  Users,
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { useEffect } from 'react';

const features = [
  {
    icon: <Shield className="h-8 w-8" />,
    title: "Advanced Security",
    description: "Enterprise-grade security with SOC 2 compliance, GDPR readiness, and advanced threat protection.",
    benefits: ["SOC 2 Type II compliance", "End-to-end encryption", "Advanced threat detection", "Data residency options"]
  },
  {
    icon: <Settings className="h-8 w-8" />,
    title: "Custom Integrations",
    description: "Connect with your existing enterprise systems through custom APIs and integrations.",
    benefits: ["Custom API development", "CRM integrations", "ERP connectivity", "Workflow automation"]
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "Dedicated Support",
    description: "24/7 dedicated support team with guaranteed response times and success management.",
    benefits: ["24/7 priority support", "Dedicated account manager", "Technical consulting", "Training programs"]
  },
  {
    icon: <Target className="h-8 w-8" />,
    title: "SLA Guarantees",
    description: "Service level agreements with 99.9% uptime guarantee and performance commitments.",
    benefits: ["99.9% uptime SLA", "Performance guarantees", "Disaster recovery", "Business continuity"]
  },
  {
    icon: <BarChart3 className="h-8 w-8" />,
    title: "Advanced Analytics",
    description: "Deep analytics and reporting capabilities with custom dashboards and data exports.",
    benefits: ["Custom reporting", "Data warehouse integration", "Advanced visualization", "API access"]
  },
  {
    icon: <Lock className="h-8 w-8" />,
    title: "Compliance Tools",
    description: "Built-in compliance tools for regulated industries with audit trails and documentation.",
    benefits: ["Audit trail logging", "Compliance reporting", "Data governance", "Regulatory compliance"]
  }
];

const testimonials = [
  {
    name: "Sarah Johnson",
    company: "Fortune 500 Tech Company",
    role: "VP of Digital Marketing",
    industry: "Technology",
    content: "VeeFore's enterprise solution has revolutionized how we manage our global social media presence. The security features and compliance tools are exactly what we needed.",
    rating: 5,
    results: "500+ Team Members"
  },
  {
    name: "Michael Chen",
    company: "Global Financial Services",
    role: "Chief Marketing Officer",
    industry: "Financial Services",
    content: "The compliance and security features are unmatched. We can confidently manage our social media while maintaining all regulatory requirements.",
    rating: 5,
    results: "SOC 2 Compliant"
  },
  {
    name: "Elena Rodriguez",
    company: "Healthcare Corporation",
    role: "Director of Communications",
    industry: "Healthcare",
    content: "VeeFore's dedicated support and custom integrations helped us scale our social media operations across 50+ locations seamlessly.",
    rating: 5,
    results: "50+ Locations"
  }
];

const caseStudies = [
  {
    company: "Global Technology Corporation",
    industry: "Enterprise Software",
    challenge: "Managing social media for 100+ product lines across 40+ countries",
    solution: "Custom multi-tenant architecture with advanced permissions and localization",
    results: [
      "Unified global social media strategy",
      "90% reduction in content approval time",
      "200% increase in global engagement",
      "Maintained compliance across all regions"
    ],
    timeframe: "12 months",
    scale: "40+ countries, 500+ team members"
  },
  {
    company: "International Financial Institution",
    industry: "Financial Services",
    challenge: "Strict compliance requirements while maintaining engaging social presence",
    solution: "Deployed compliance-first architecture with automated approval workflows",
    results: [
      "100% regulatory compliance maintained",
      "70% faster content approval process",
      "300% increase in social media engagement",
      "Zero compliance violations in 2 years"
    ],
    timeframe: "18 months",
    scale: "25+ countries, regulated industry"
  }
];

const securityFeatures = [
  {
    icon: <Shield className="h-6 w-6" />,
    title: "SOC 2 Type II Compliance",
    description: "Audited security controls and procedures"
  },
  {
    icon: <Lock className="h-6 w-6" />,
    title: "End-to-End Encryption",
    description: "All data encrypted in transit and at rest"
  },
  {
    icon: <Server className="h-6 w-6" />,
    title: "Private Cloud Options",
    description: "Dedicated infrastructure for your organization"
  },
  {
    icon: <Globe className="h-6 w-6" />,
    title: "Data Residency",
    description: "Control where your data is stored globally"
  }
];

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

export default function SolutionEnterprises() {
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
              <Link href="/contact">
                <Button>Contact Sales</Button>
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
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            For Enterprises
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Enterprise-grade social media management with advanced security, compliance features, and custom integrations. 
            Built for large organizations that need scale, security, and seamless integration with existing systems.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
              <Shield className="h-4 w-4 mr-1" />
              SOC 2 Compliant
            </Badge>
            <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
              <Lock className="h-4 w-4 mr-1" />
              Enterprise Security
            </Badge>
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
              <Settings className="h-4 w-4 mr-1" />
              Custom Integrations
            </Badge>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20"
          {...fadeInUp}
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">500+</div>
            <div className="text-gray-400">Enterprise Clients</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-400 mb-2">99.99%</div>
            <div className="text-gray-400">Uptime SLA</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">$1B+</div>
            <div className="text-gray-400">Enterprise Revenue Managed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">50+</div>
            <div className="text-gray-400">Countries Supported</div>
          </div>
        </motion.div>

        {/* Security Features */}
        <motion.div 
          className="mb-20"
          {...fadeInUp}
        >
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="text-green-400">Enterprise-Grade</span> Security
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {securityFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-500/50 text-center h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          className="mb-20"
          {...fadeInUp}
        >
          <h2 className="text-3xl font-bold text-center mb-12">
            Built for <span className="text-green-400">Enterprise Scale</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-gray-700 hover:border-green-500/50 transition-all duration-300 h-full">
                  <CardHeader>
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg text-white">
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
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
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
            Enterprise <span className="text-green-400">Success Stories</span>
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {caseStudies.map((study, index) => (
              <motion.div
                key={study.company}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-500/50 h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <CardTitle className="text-white">{study.company}</CardTitle>
                        <div className="text-sm text-green-400">{study.industry}</div>
                        <div className="text-xs text-gray-400 mt-1">{study.scale}</div>
                      </div>
                      <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                        {study.timeframe}
                      </Badge>
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
            What <span className="text-green-400">Enterprise Leaders</span> Are Saying
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
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-medium text-white">{testimonial.name}</div>
                        <div className="text-sm text-gray-400">{testimonial.role}</div>
                        <div className="text-xs text-green-400">{testimonial.industry}</div>
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
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Custom Solutions Section */}
        <motion.div 
          className="mb-20 bg-gradient-to-r from-green-900/20 to-emerald-900/20 rounded-2xl p-12 border border-green-500/20"
          {...fadeInUp}
        >
          <h2 className="text-3xl font-bold text-center mb-8">Custom Enterprise Solutions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">Custom</div>
              <div className="text-gray-300">Pricing</div>
              <div className="text-sm text-gray-400 mt-2">Tailored to your needs</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-emerald-400 mb-2">Dedicated</div>
              <div className="text-gray-300">Infrastructure</div>
              <div className="text-sm text-gray-400 mt-2">Private cloud options</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">24/7</div>
              <div className="text-gray-300">Support</div>
              <div className="text-sm text-gray-400 mt-2">Dedicated team</div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          className="text-center bg-gradient-to-r from-green-900/20 to-emerald-900/20 rounded-2xl p-12 border border-green-500/20"
          {...fadeInUp}
        >
          <h2 className="text-3xl font-bold mb-4">Ready for Enterprise-Grade Social Media Management?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join hundreds of enterprise organizations that trust VeeFore with their global social media operations.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Link href="/contact">
              <Button size="lg" className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                Contact Sales Team
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="border-green-500/50 text-green-400 hover:bg-green-500/10">
                Schedule Enterprise Demo
                <Calendar className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}