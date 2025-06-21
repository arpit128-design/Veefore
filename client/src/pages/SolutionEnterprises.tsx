import { motion } from 'framer-motion';
import { 
  Shield, 
  Building, 
  Settings, 
  Users, 
  Lock, 
  Globe, 
  CheckCircle, 
  ArrowRight,
  PlayCircle,
  Award,
  BarChart3,
  Zap,
  Star,
  Clock,
  DollarSign,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { useEffect } from 'react';

export default function SolutionEnterprises() {
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

  const enterpriseFeatures = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Enterprise Security",
      description: "Bank-level security with advanced compliance features for highly regulated industries.",
      features: ["SOC 2 Type II compliance", "GDPR compliance", "SSO integration", "Advanced encryption"]
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Custom Integrations",
      description: "Seamlessly integrate with your existing enterprise systems and workflows.",
      features: ["API access", "CRM integration", "Custom workflows", "Data synchronization"]
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Advanced Team Management",
      description: "Sophisticated user management with granular permissions and organizational controls.",
      features: ["Role-based access", "Department management", "Approval hierarchies", "Audit trails"]
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Enterprise Analytics",
      description: "Advanced reporting and analytics with custom dashboards and business intelligence.",
      features: ["Custom reports", "Data export", "Business intelligence", "Performance monitoring"]
    }
  ];

  const benefits = [
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "$10M+ Revenue Impact",
      description: "Enterprise clients see massive revenue impact from social media",
      metric: "$10M+ impact"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "99.9% Uptime",
      description: "Enterprise-grade reliability with guaranteed uptime SLAs",
      metric: "99.9% uptime"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "200+ Hours Saved",
      description: "Massive time savings across enterprise teams monthly",
      metric: "200+ hours saved"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "1000+ Team Members",
      description: "Support for unlimited team members across departments",
      metric: "Unlimited scale"
    }
  ];

  const enterpriseClients = [
    {
      name: "Global Tech Corporation",
      industry: "Technology",
      employees: "50,000+",
      regions: "Global (50+ countries)",
      story: "VeeFore's enterprise platform enabled us to manage social media across all our global brands while maintaining compliance with international regulations. The ROI was immediate.",
      results: ["Global brand consistency", "$25M social commerce revenue", "50+ country compliance"]
    },
    {
      name: "Fortune 500 Retailer",
      industry: "Retail",
      employees: "100,000+",
      regions: "North America",
      story: "Managing social media for 500+ retail locations was a nightmare until VeeFore. Now we have centralized control with local customization capabilities.",
      results: ["500+ locations managed", "300% engagement increase", "40% operational cost reduction"]
    },
    {
      name: "International Financial Services",
      industry: "Financial Services",
      employees: "25,000+",
      regions: "Global (30+ countries)",
      story: "Compliance was our biggest challenge. VeeFore's enterprise security and audit features allow us to maintain our social presence while meeting all regulatory requirements.",
      results: ["Full regulatory compliance", "Zero security incidents", "150% brand awareness growth"]
    }
  ];

  const complianceFeatures = [
    {
      title: "Data Security",
      items: ["End-to-end encryption", "Data residency controls", "Secure API access", "Regular security audits"]
    },
    {
      title: "Compliance Standards",
      items: ["SOC 2 Type II", "GDPR", "CCPA", "HIPAA ready"]
    },
    {
      title: "Access Controls",
      items: ["Single Sign-On (SSO)", "Multi-factor authentication", "Role-based permissions", "IP restrictions"]
    },
    {
      title: "Audit & Monitoring",
      items: ["Activity logs", "Compliance reporting", "Real-time monitoring", "Alert systems"]
    }
  ];

  const integrations = [
    "Salesforce", "Microsoft Dynamics", "SAP", "Oracle", "HubSpot", "Marketo",
    "Adobe Experience Cloud", "Google Analytics", "Tableau", "Power BI",
    "Slack", "Microsoft Teams", "ServiceNow", "Workday"
  ];

  const enterpriseSizes = [
    {
      size: "Mid-Market",
      employees: "500-5,000 employees",
      features: ["Multi-department support", "Advanced analytics", "Integration support", "Dedicated CSM"]
    },
    {
      size: "Enterprise",
      employees: "5,000-25,000 employees",
      features: ["Custom workflows", "Advanced security", "API access", "Priority support"]
    },
    {
      size: "Global Enterprise",
      employees: "25,000+ employees",
      features: ["Global deployment", "Custom integrations", "Compliance features", "Executive support"]
    }
  ];

  return (
    <div className="min-h-screen bg-space-navy text-white overflow-hidden relative">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-space-navy via-green-900/20 to-emerald-900/20" />
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-5 h-5 bg-green-400 rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.1, 0.4, 0.1],
              scale: [1, 1.5, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: Math.random() * 8 + 6,
              repeat: Infinity,
              delay: Math.random() * 5,
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
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
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
              <Link href="/contact">
                <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                  Contact Sales
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
              className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-r from-green-500 to-emerald-600 text-white mb-8"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              <Shield className="w-10 h-10" />
            </motion.div>
            
            <Badge className="mb-6 bg-green-500/20 text-green-300 border-green-500/30 text-lg px-4 py-2">
              <Building className="w-4 h-4 mr-2" />
              For Enterprises
            </Badge>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
              Enterprise-Grade{' '}
              <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                Social Media Platform
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Secure, scalable, and compliant social media management for global enterprises. 
              Advanced security, custom integrations, and dedicated support for mission-critical operations.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/contact">
                <Button size="lg" className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-lg px-10 py-6">
                  Contact Sales Team
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/watch-demo">
                <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800 text-lg px-10 py-6">
                  <PlayCircle className="mr-2 w-5 h-5" />
                  Watch Enterprise Demo
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Enterprise dashboard preview */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop&crop=center"
                alt="Enterprise Social Media Platform"
                className="w-full h-96 object-cover rounded-xl"
              />
              <div className="absolute top-12 right-12 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                Enterprise Platform
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enterprise Sizes */}
      <section className="relative z-10 py-24 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Scales to Any Enterprise Size
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              From mid-market companies to global enterprises, VeeFore adapts to your organizational needs
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
          >
            {enterpriseSizes.map((size, index) => (
              <motion.div
                key={index}
                className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 hover:border-slate-600 transition-all duration-300"
                variants={scaleIn}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <h3 className="text-2xl font-bold text-white mb-2">{size.size}</h3>
                <p className="text-green-400 mb-6">{size.employees}</p>
                <div className="space-y-3">
                  {size.features.map((feature, i) => (
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

      {/* Enterprise Features */}
      <section className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Enterprise-Grade Features
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Built for the most demanding enterprise requirements with security, compliance, and scalability
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
          >
            {enterpriseFeatures.map((feature, index) => (
              <motion.div key={index} variants={scaleIn}>
                <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all duration-300 h-full">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-white">
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

      {/* Compliance & Security */}
      <section className="relative z-10 py-24 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Security & Compliance First
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Built to meet the strictest enterprise security and compliance requirements
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
          >
            {complianceFeatures.map((category, index) => (
              <motion.div
                key={index}
                className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 hover:border-slate-600 transition-all duration-300"
                variants={scaleIn}
                whileHover={{ scale: 1.05 }}
              >
                <h3 className="text-lg font-bold text-white mb-4">{category.title}</h3>
                <div className="space-y-2">
                  {category.items.map((item, i) => (
                    <div key={i} className="flex items-center text-gray-300">
                      <Shield className="w-3 h-3 text-green-400 mr-2 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Integrations */}
      <section className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Enterprise System Integrations
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Seamlessly integrate with your existing enterprise technology stack
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
          >
            {integrations.map((integration, index) => (
              <motion.div
                key={index}
                className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 text-center hover:border-slate-600 transition-all duration-300"
                variants={scaleIn}
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-white font-medium text-sm">{integration}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Enterprise Success Stories */}
      <section className="relative z-10 py-24 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Trusted by Global Enterprises
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              See how global enterprises have transformed their social media operations with VeeFore
            </p>
          </motion.div>

          <motion.div 
            className="space-y-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
          >
            {enterpriseClients.map((client, index) => (
              <motion.div
                key={index}
                className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8"
                variants={scaleIn}
                whileHover={{ scale: 1.02 }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                  <div className="lg:col-span-2">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white">
                        <Building className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{client.name}</h3>
                        <p className="text-green-400">{client.industry}</p>
                        <p className="text-gray-400">{client.employees} • {client.regions}</p>
                      </div>
                    </div>
                    <p className="text-gray-300 text-lg mb-6 italic">"{client.story}"</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-6">
                    <h4 className="text-white font-semibold mb-4">Enterprise Results:</h4>
                    <div className="space-y-2">
                      {client.results.map((result, i) => (
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
      <section className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Enterprise Impact Metrics
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              See the measurable impact VeeFore has on enterprise operations and business outcomes
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
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6">
                  {benefit.icon}
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mb-2">
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
              Ready for Enterprise Transformation?
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Join Fortune 500 companies using VeeFore to manage their global social media operations securely and efficiently
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/contact">
                <Button size="lg" className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-lg px-10 py-6">
                  Contact Sales Team
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/watch-demo">
                <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800 text-lg px-10 py-6">
                  Schedule Enterprise Demo
                </Button>
              </Link>
            </div>
            
            <p className="text-gray-400 mt-8">
              ✓ Custom enterprise deployment • ✓ Dedicated support team • ✓ SLA guarantees
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}