import { motion } from 'framer-motion';
import { 
  Users, 
  Shield, 
  BarChart3, 
  Target, 
  Globe, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  PlayCircle,
  Clock,
  DollarSign,
  Star,
  Building,
  Award,
  FileText,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { useEffect } from 'react';

export default function SolutionAgencies() {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const scaleIn = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5 }
  };

  const agencyFeatures = [
    {
      icon: <Building className="w-6 h-6" />,
      title: "Multi-Client Management",
      description: "Efficiently manage unlimited client accounts with organized workspaces and streamlined workflows.",
      features: ["Client workspace separation", "Bulk operations", "Account switching", "Centralized billing"]
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Team Collaboration",
      description: "Collaborate seamlessly with team members using advanced permission controls and approval workflows.",
      features: ["Role-based permissions", "Approval workflows", "Team communication", "Task assignment"]
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "White-Label Reporting",
      description: "Create professional, branded reports that showcase your agency's value to clients.",
      features: ["Custom branding", "Automated reports", "Client dashboards", "Performance insights"]
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Agency-Grade Security",
      description: "Enterprise-level security features designed specifically for agencies handling multiple client accounts.",
      features: ["2FA authentication", "Access logs", "Data encryption", "Compliance tools"]
    }
  ];

  const benefits = [
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "500% Revenue Growth",
      description: "Agencies scale revenue faster with streamlined operations",
      metric: "500% growth"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "40+ Hours Saved",
      description: "Save 40+ hours weekly across your entire team",
      metric: "40+ hours saved"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "10x Client Capacity",
      description: "Manage 10x more clients with the same team size",
      metric: "10x capacity"
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "98% Client Retention",
      description: "Improve client satisfaction and retention rates",
      metric: "98% retention"
    }
  ];

  const agencyStories = [
    {
      name: "Digital Growth Agency",
      location: "New York, NY",
      teamSize: "25 employees",
      clientCount: "150+ clients",
      story: "VeeFore transformed our agency operations. We went from managing 30 clients with constant stress to handling 150+ clients smoothly. Our team productivity increased 400% and client satisfaction is at an all-time high.",
      results: ["5x client capacity increase", "$2M annual revenue growth", "95% client retention rate"]
    },
    {
      name: "Social Impact Marketing",
      location: "Los Angeles, CA",
      teamSize: "15 employees",
      clientCount: "80+ clients",
      story: "The white-label reporting feature alone justified our investment. Clients love the professional reports, and we've reduced report creation time from 5 hours to 15 minutes per client.",
      results: ["95% time saved on reporting", "$500K new client revenue", "Industry recognition awards"]
    },
    {
      name: "Creative Collective",
      location: "Austin, TX",
      teamSize: "35 employees",
      clientCount: "200+ clients",
      story: "Managing multiple client accounts used to be a nightmare. VeeFore's multi-client dashboard and team collaboration tools made us the most efficient agency in our market.",
      results: ["200+ clients managed efficiently", "50% faster project delivery", "Best Agency Award 2024"]
    }
  ];

  const agencyServices = [
    {
      title: "Social Media Management",
      description: "Full-service social media management for all client accounts",
      tools: ["Content creation", "Scheduling", "Community management", "Performance tracking"]
    },
    {
      title: "Content Marketing",
      description: "Comprehensive content strategies and execution",
      tools: ["Content planning", "AI content generation", "Editorial calendars", "Content optimization"]
    },
    {
      title: "Paid Social Advertising",
      description: "Manage and optimize social advertising campaigns",
      tools: ["Campaign management", "Budget optimization", "Creative testing", "ROI tracking"]
    },
    {
      title: "Analytics & Reporting",
      description: "Data-driven insights and client reporting",
      tools: ["Performance analytics", "Competitive analysis", "Custom dashboards", "Automated reports"]
    }
  ];

  const teamSizes = [
    {
      size: "Solo Agencies",
      clients: "1-10 clients",
      features: ["Client management", "Basic reporting", "Content tools", "Growth support"]
    },
    {
      size: "Small Teams",
      clients: "10-50 clients",
      features: ["Team collaboration", "Workflow automation", "Advanced reporting", "Client portals"]
    },
    {
      size: "Large Agencies",
      clients: "50+ clients",
      features: ["Enterprise features", "Custom integrations", "Dedicated support", "White-label options"]
    }
  ];

  return (
    <div className="min-h-screen bg-space-navy text-white overflow-hidden relative">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-space-navy via-purple-900/20 to-indigo-900/20" />
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-purple-400 rounded-full opacity-25"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.1, 0.5, 0.1],
              scale: [1, 1.4, 1],
              rotate: [0, 360, 0],
            }}
            transition={{
              duration: Math.random() * 6 + 5,
              repeat: Infinity,
              delay: Math.random() * 4,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.header 
        className="relative z-10 border-b border-slate-800 bg-space-navy/80 backdrop-blur-md"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">VeeFore</span>
              </div>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" className="text-gray-300 hover:text-white">← Back to Home</Button>
              </Link>
              <Link href="/solutions">
                <Button variant="ghost" className="text-gray-300 hover:text-white">All Solutions</Button>
              </Link>
              <Link href="/auth">
                <Button className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700">
                  Start Agency Trial
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white mb-8"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              <Users className="w-10 h-10" />
            </motion.div>
            
            <Badge className="mb-6 bg-purple-500/20 text-purple-300 border-purple-500/30 text-lg px-4 py-2">
              <Award className="w-4 h-4 mr-2" />
              For Agencies
            </Badge>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
              Scale Your Agency with{' '}
              <span className="bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">
                Enterprise Tools
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Manage unlimited clients, streamline team workflows, and deliver exceptional results with 
              professional-grade social media management tools built specifically for agencies.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/auth">
                <Button size="lg" className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-lg px-10 py-6">
                  Start Agency Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/watch-demo">
                <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800 text-lg px-10 py-6">
                  <PlayCircle className="mr-2 w-5 h-5" />
                  Watch Agency Demo
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Agency dashboard preview */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700">
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop&crop=center"
                alt="Agency Management Dashboard"
                className="w-full h-96 object-cover rounded-xl"
              />
              <div className="absolute top-12 right-12 bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                Agency Dashboard
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Agency Sizes */}
      <section className="relative z-10 py-24 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Built for Agencies of All Sizes
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              From solo consultants to large agencies, VeeFore scales with your business
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
          >
            {teamSizes.map((team, index) => (
              <motion.div
                key={index}
                className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 hover:border-slate-600 transition-all duration-300"
                variants={scaleIn}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <h3 className="text-2xl font-bold text-white mb-2">{team.size}</h3>
                <p className="text-purple-400 mb-6">{team.clients}</p>
                <div className="space-y-3">
                  {team.features.map((feature, i) => (
                    <div key={i} className="flex items-center text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Agency Features */}
      <section className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Professional Agency Features
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to run a successful social media agency
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
          >
            {agencyFeatures.map((feature, index) => (
              <motion.div key={index} variants={scaleIn}>
                <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all duration-300 h-full">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center text-white">
                        {feature.icon}
                      </div>
                      <CardTitle className="text-2xl text-white">{feature.title}</CardTitle>
                    </div>
                    <CardDescription className="text-gray-300 text-lg leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {feature.features.map((item, i) => (
                        <div key={i} className="flex items-center text-gray-300">
                          <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Agency Services */}
      <section className="relative z-10 py-24 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Expand Your Service Offerings
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Offer comprehensive social media services with professional tools and capabilities
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
          >
            {agencyServices.map((service, index) => (
              <motion.div
                key={index}
                className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 hover:border-slate-600 transition-all duration-300"
                variants={scaleIn}
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="text-2xl font-bold text-white mb-4">{service.title}</h3>
                <p className="text-gray-300 mb-6">{service.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  {service.tools.map((tool, i) => (
                    <div key={i} className="bg-slate-700/50 rounded-lg p-3 text-center">
                      <span className="text-purple-300 text-sm font-medium">{tool}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Agency Success Stories */}
      <section className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Agency Success Stories
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              See how agencies have scaled their operations and grown revenue with VeeFore
            </p>
          </motion.div>

          <motion.div 
            className="space-y-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
          >
            {agencyStories.map((story, index) => (
              <motion.div
                key={index}
                className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8"
                variants={scaleIn}
                whileHover={{ scale: 1.02 }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                  <div className="lg:col-span-2">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white">
                        <Users className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{story.name}</h3>
                        <p className="text-purple-400">{story.location}</p>
                        <p className="text-gray-400">{story.teamSize} • {story.clientCount}</p>
                      </div>
                    </div>
                    <p className="text-gray-300 text-lg mb-6 italic">"{story.story}"</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-6">
                    <h4 className="text-white font-semibold mb-4">Agency Results:</h4>
                    <div className="space-y-2">
                      {story.results.map((result, i) => (
                        <div key={i} className="flex items-center text-green-400">
                          <Award className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="text-sm">{result}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="relative z-10 py-24 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Agency Growth Metrics
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              See the measurable impact VeeFore has on agency operations and profitability
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="text-center p-8 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-all duration-300"
                variants={scaleIn}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6">
                  {benefit.icon}
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent mb-2">
                  {benefit.metric}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{benefit.title}</h3>
                <p className="text-gray-300">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-8">
              Ready to Scale Your Agency?
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Join hundreds of successful agencies using VeeFore to manage more clients, increase efficiency, and grow revenue
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/auth">
                <Button size="lg" className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-lg px-10 py-6">
                  Start Agency Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800 text-lg px-10 py-6">
                  Request Agency Demo
                </Button>
              </Link>
            </div>
            
            <p className="text-gray-400 mt-8">
              ✓ 30-day agency trial • ✓ Dedicated onboarding • ✓ Priority support
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}