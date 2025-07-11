import { motion } from 'framer-motion';
import { Shield, Scale, Users, AlertTriangle, CheckCircle, FileText, ArrowLeft, Globe, Mail, Phone, Database, Settings, Clock, Eye, Lock } from 'lucide-react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';

export function TermsOfService() {
  const [, setLocation] = useLocation();

  const tableOfContents = [
    { id: "introduction", title: "1. Introduction" },
    { id: "acceptance", title: "2. Acceptance of Terms" },
    { id: "description", title: "3. Description of Service" },
    { id: "user-accounts", title: "4. User Accounts and Registration" },
    { id: "acceptable-use", title: "5. Acceptable Use Policy" },
    { id: "payment-terms", title: "6. Payment Terms" },
    { id: "intellectual-property", title: "7. Intellectual Property Rights" },
    { id: "privacy-data", title: "8. Privacy and Data Protection" },
    { id: "service-availability", title: "9. Service Availability" },
    { id: "termination", title: "10. Termination" },
    { id: "disclaimers", title: "11. Disclaimers" },
    { id: "liability", title: "12. Limitation of Liability" },
    { id: "contact", title: "13. Contact Information" }
  ];

  const serviceFeatures = [
    {
      category: "AI-Powered Tools",
      items: [
        "Advanced content generation and optimization",
        "Thumbnail creation with DALL-E 3 integration",
        "Sentiment analysis and emotion detection",
        "ROI calculation and performance analytics",
        "Social media trend analysis and prediction"
      ]
    },
    {
      category: "Social Media Management",
      items: [
        "Multi-platform content scheduling",
        "Instagram, YouTube, and Twitter integration",
        "Automated posting and engagement",
        "Analytics and performance tracking",
        "Team collaboration and workspace management"
      ]
    },
    {
      category: "Professional Services",
      items: [
        "Legal assistant and contract generation",
        "Content theft detection and protection",
        "A/B testing and optimization strategies",
        "Competitor analysis and market insights",
        "Affiliate program management"
      ]
    },
    {
      category: "Business Intelligence",
      items: [
        "Real-time social listening and monitoring",
        "Custom reporting and data visualization",
        "API access for enterprise integration",
        "Advanced security and compliance features",
        "Priority support and consultation"
      ]
    }
  ];

  const userRights = [
    {
      title: "Account Control",
      description: "Full control over your account settings, data, and preferences",
      details: [
        "Update or modify your profile information at any time",
        "Change password and security settings",
        "Manage connected social media accounts",
        "Configure notification preferences",
        "Delete your account and associated data"
      ]
    },
    {
      title: "Data Access",
      description: "Access to all your data and content stored on our platform",
      details: [
        "Download your content and analytics data",
        "Export your social media posts and schedules",
        "Access your AI-generated content history",
        "View detailed usage and billing information",
        "Request data portability to other platforms"
      ]
    },
    {
      title: "Service Customization",
      description: "Customize the platform to meet your specific needs",
      details: [
        "Configure workspace settings and permissions",
        "Set up custom automation rules and workflows",
        "Create personalized content templates",
        "Customize analytics dashboards and reports",
        "Integrate with third-party tools and services"
      ]
    },
    {
      title: "Support and Assistance",
      description: "Access to comprehensive support and resources",
      details: [
        "24/7 customer support via email and chat",
        "Access to knowledge base and documentation",
        "Video tutorials and training materials",
        "Priority support for premium subscribers",
        "Community forums and user groups"
      ]
    }
  ];

  const usageGuidelines = [
    {
      category: "Acceptable Use",
      allowed: [
        "Creating original content for personal or business use",
        "Scheduling posts across multiple social media platforms",
        "Analyzing social media performance and engagement",
        "Collaborating with team members on content projects",
        "Using AI tools for content optimization and enhancement"
      ],
      prohibited: [
        "Uploading or sharing copyrighted content without permission",
        "Creating fake accounts or impersonating others",
        "Posting spam, harassment, or inappropriate content",
        "Attempting to hack or compromise the platform",
        "Sharing account credentials with unauthorized users"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-transparent text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            onClick={() => setLocation('/dashboard')}
            variant="ghost"
            className="mb-6 text-white/70 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Terms of Service
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Legal terms and conditions governing your use of the Veefore platform operated by VEEFED TECHNOLOGIES PRIVATE LIMITED
            </p>
            <div className="mt-4 flex items-center justify-center gap-4 text-sm text-white/50">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Last Updated: July 2, 2025
              </span>
              <span className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                Effective Date: July 2, 2025
              </span>
            </div>
          </div>
        </motion.div>

        {/* Quick Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12 bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Quick Navigation</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a
              href="#introduction"
              className="flex flex-col items-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10 group"
            >
              <FileText className="w-6 h-6 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm text-white/70 group-hover:text-white text-center">Introduction</span>
            </a>
            
            <a
              href="#acceptance"
              className="flex flex-col items-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10 group"
            >
              <Scale className="w-6 h-6 text-green-400 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm text-white/70 group-hover:text-white text-center">Acceptance</span>
            </a>
            
            <a
              href="#description"
              className="flex flex-col items-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10 group"
            >
              <Settings className="w-6 h-6 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm text-white/70 group-hover:text-white text-center">Service Description</span>
            </a>
            
            <a
              href="#user-accounts"
              className="flex flex-col items-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10 group"
            >
              <Users className="w-6 h-6 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm text-white/70 group-hover:text-white text-center">User Accounts</span>
            </a>
            
            <a
              href="#acceptable-use"
              className="flex flex-col items-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10 group"
            >
              <Shield className="w-6 h-6 text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm text-white/70 group-hover:text-white text-center">Acceptable Use</span>
            </a>
            
            <a
              href="#payment-terms"
              className="flex flex-col items-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10 group"
            >
              <Database className="w-6 h-6 text-red-400 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm text-white/70 group-hover:text-white text-center">Payment Terms</span>
            </a>
            
            <a
              href="#intellectual-property"
              className="flex flex-col items-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10 group"
            >
              <Lock className="w-6 h-6 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm text-white/70 group-hover:text-white text-center">IP Rights</span>
            </a>
            
            <a
              href="#contact"
              className="flex flex-col items-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10 group"
            >
              <Phone className="w-6 h-6 text-pink-400 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm text-white/70 group-hover:text-white text-center">Contact</span>
            </a>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="space-y-8">
          
          {/* Introduction */}
          <motion.section
            id="introduction"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
          >
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-8 h-8 text-blue-400" />
              <h2 className="text-3xl font-bold">1. Introduction</h2>
            </div>
            
            <div className="space-y-6">
              <p className="text-white/80 leading-relaxed">
                Welcome to Veefore, an advanced AI-powered social media management platform operated by 
                <strong className="text-white"> VEEFED TECHNOLOGIES PRIVATE LIMITED</strong>. These Terms of Service ("Terms") 
                govern your use of our website, mobile application, and services (collectively, the "Service").
              </p>
              
              <p className="text-white/80 leading-relaxed">
                By accessing or using Veefore, you agree to be bound by these Terms. If you disagree with any part of these terms, 
                then you may not access the Service. These Terms apply to all visitors, users, and others who access or use the Service.
              </p>
              
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-blue-400" />
                  <span className="font-semibold text-blue-400">Important Notice</span>
                </div>
                <p className="text-white/80 text-sm">
                  These Terms constitute a legally binding agreement between you and VEEFED TECHNOLOGIES PRIVATE LIMITED. 
                  Please read them carefully before using our Service.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Acceptance of Terms */}
          <motion.section
            id="acceptance"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
          >
            <div className="flex items-center gap-3 mb-6">
              <Scale className="w-8 h-8 text-green-400" />
              <h2 className="text-3xl font-bold">2. Acceptance of Terms</h2>
            </div>
            
            <div className="space-y-6">
              <p className="text-white/80 leading-relaxed">
                By creating an account or using any part of the Service, you acknowledge that you have read, understood, 
                and agree to be bound by these Terms and our Privacy Policy.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <h3 className="font-semibold text-green-400">Agreement Requirements</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-white/80">
                    <li>• You must be at least 18 years old</li>
                    <li>• You have the legal capacity to enter into binding contracts</li>
                    <li>• You are not prohibited from using the Service under applicable law</li>
                    <li>• You agree to comply with all applicable laws and regulations</li>
                  </ul>
                </div>
                
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-5 h-5 text-blue-400" />
                    <h3 className="font-semibold text-blue-400">Acceptance Methods</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-white/80">
                    <li>• Creating an account on our platform</li>
                    <li>• Clicking "I agree" or similar buttons</li>
                    <li>• Using any part of the Service</li>
                    <li>• Making a purchase or subscription</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Service Description */}
          <motion.section
            id="description"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
          >
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-8 h-8 text-purple-400" />
              <h2 className="text-3xl font-bold">3. Description of Service</h2>
            </div>
            
            <div className="space-y-6">
              <p className="text-white/80 leading-relaxed">
                Veefore provides comprehensive social media management and content optimization services powered by 
                advanced artificial intelligence technology. Our platform helps users create, schedule, analyze, and 
                optimize their social media presence across multiple platforms.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                {serviceFeatures.map((feature, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <h3 className="font-semibold mb-3 text-purple-400">{feature.category}</h3>
                    <ul className="space-y-2 text-sm text-white/80">
                      {feature.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* User Accounts */}
          <motion.section
            id="user-accounts"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
          >
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-8 h-8 text-blue-400" />
              <h2 className="text-3xl font-bold">4. User Accounts and Registration</h2>
            </div>
            
            <div className="space-y-6">
              <p className="text-white/80 leading-relaxed">
                To access certain features of the Service, you must register for an account. You are responsible for 
                maintaining the confidentiality of your account credentials and for all activities that occur under your account.
              </p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {userRights.map((right, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <h3 className="font-semibold mb-3 text-blue-400">{right.title}</h3>
                    <p className="text-sm text-white/70 mb-3">{right.description}</p>
                    <ul className="space-y-1 text-xs text-white/60">
                      {right.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start gap-1">
                          <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Acceptable Use Policy */}
          <motion.section
            id="acceptable-use"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
          >
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-8 h-8 text-cyan-400" />
              <h2 className="text-3xl font-bold">5. Acceptable Use Policy</h2>
            </div>
            
            <div className="space-y-6">
              <p className="text-white/80 leading-relaxed">
                You agree to use the Service only for lawful purposes and in accordance with these Terms. You are prohibited 
                from using the Service in any way that could damage, disable, or impair the Service or interfere with any other 
                party's use of the Service.
              </p>
              
              {usageGuidelines.map((guideline, index) => (
                <div key={index} className="space-y-4">
                  <h3 className="text-xl font-semibold text-cyan-400">{guideline.category}</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <h4 className="font-semibold text-green-400">Allowed Activities</h4>
                      </div>
                      <ul className="space-y-2 text-sm text-white/80">
                        {guideline.allowed.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                        <h4 className="font-semibold text-red-400">Prohibited Activities</h4>
                      </div>
                      <ul className="space-y-2 text-sm text-white/80">
                        {guideline.prohibited.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Additional sections would continue here with similar structure... */}
          
          {/* Contact Section */}
          <motion.section
            id="contact"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mb-12 bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center justify-center gap-3">
              <Phone className="w-6 h-6 text-blue-400" />
              Contact Us
            </h2>
            
            <p className="text-white/70 mb-8 max-w-2xl mx-auto">
              If you have any questions about these Terms of Service or need legal assistance, please contact us:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <Mail className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Email Support</h3>
                <p className="text-white/60 text-sm">legal@veefore.com</p>
                <p className="text-white/60 text-sm">support@veefore.com</p>
              </div>
              
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <Globe className="w-8 h-8 text-green-400 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Company Information</h3>
                <p className="text-white/60 text-sm">VEEFED TECHNOLOGIES PRIVATE LIMITED</p>
                <p className="text-white/60 text-sm">India</p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-center gap-4">
              <Button
                onClick={() => setLocation('/privacy-policy')}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                Privacy Policy
              </Button>
              <Button
                onClick={() => setLocation('/about')}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                About Us
              </Button>
            </div>
          </motion.section>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="pt-8 border-t border-white/10 text-center"
        >
          <p className="text-sm text-white/40 mb-4">
            These Terms of Service are effective as of July 2, 2025, and will remain in effect except with respect to any changes in its provisions in the future.
          </p>
          <p className="text-sm text-white/40">
            © 2025 Veefore — A product of VEEFED TECHNOLOGIES PRIVATE LIMITED
          </p>
        </motion.div>
      </div>
    </div>
  );
}