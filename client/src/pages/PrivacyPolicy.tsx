import { motion } from 'framer-motion';
import { Shield, Eye, Lock, Database, Users, Globe, FileText, ArrowLeft, AlertTriangle, CheckCircle, UserX, Settings, Clock, Mail } from 'lucide-react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';

export function PrivacyPolicy() {
  const [, setLocation] = useLocation();

  const tableOfContents = [
    { id: "introduction", title: "1. Introduction" },
    { id: "information-collection", title: "2. Information We Collect" },
    { id: "information-use", title: "3. How We Use Your Information" },
    { id: "information-sharing", title: "4. Information Sharing and Disclosure" },
    { id: "data-security", title: "5. Data Security and Protection" },
    { id: "data-retention", title: "6. Data Retention" },
    { id: "user-rights", title: "7. Your Rights and Choices" },
    { id: "cookies", title: "8. Cookies and Tracking Technologies" },
    { id: "third-party", title: "9. Third-Party Services" },
    { id: "international", title: "10. International Data Transfers" },
    { id: "children", title: "11. Children's Privacy" },
    { id: "updates", title: "12. Policy Updates" },
    { id: "contact", title: "13. Contact Information" }
  ];

  const dataTypes = [
    {
      category: "Account Information",
      items: [
        "Email address and username",
        "Full name and display name",
        "Profile picture and bio",
        "Account preferences and settings",
        "Subscription and billing details"
      ]
    },
    {
      category: "Content Data",
      items: [
        "Social media posts and captions",
        "Images, videos, and multimedia content",
        "Scheduled content and publishing data",
        "Analytics and performance metrics",
        "AI-generated content and thumbnails"
      ]
    },
    {
      category: "Social Media Connections",
      items: [
        "Connected social media accounts (Instagram, YouTube, etc.)",
        "OAuth tokens and authentication data",
        "Follower counts and engagement metrics",
        "Post performance and analytics data",
        "Direct message automation data"
      ]
    },
    {
      category: "Usage Information",
      items: [
        "Device information and browser type",
        "IP address and location data",
        "Page views and click patterns",
        "Feature usage and interaction data",
        "Error logs and performance metrics"
      ]
    }
  ];

  const securityMeasures = [
    {
      icon: <Lock className="w-5 h-5" />,
      title: "End-to-End Encryption",
      description: "All data transmissions are encrypted using TLS 1.3 protocol"
    },
    {
      icon: <Database className="w-5 h-5" />,
      title: "Secure Database Storage",
      description: "MongoDB Atlas with enterprise-grade security and encryption at rest"
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Access Controls",
      description: "Multi-factor authentication and role-based access permissions"
    },
    {
      icon: <Eye className="w-5 h-5" />,
      title: "Regular Security Audits",
      description: "Continuous monitoring and periodic security assessments"
    }
  ];

  const userRights = [
    {
      icon: <Eye className="w-5 h-5" />,
      title: "Right to Access",
      description: "Request a copy of all personal data we hold about you"
    },
    {
      icon: <Settings className="w-5 h-5" />,
      title: "Right to Rectification",
      description: "Correct inaccurate or incomplete personal information"
    },
    {
      icon: <UserX className="w-5 h-5" />,
      title: "Right to Erasure",
      description: "Request deletion of your personal data ('right to be forgotten')"
    },
    {
      icon: <FileText className="w-5 h-5" />,
      title: "Right to Portability",
      description: "Export your data in a structured, machine-readable format"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900/95 via-purple-900/90 to-slate-900/95 text-white">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Button
            variant="ghost"
            onClick={() => setLocation('/')}
            className="mb-6 text-white/60 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20">
                <Shield className="w-10 h-10 text-blue-400" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Privacy Policy
              </h1>
            </div>
            
            <p className="text-white/70 text-xl max-w-4xl mx-auto leading-relaxed">
              Comprehensive privacy protection for your social media management journey with{' '}
              <span className="text-purple-300 font-semibold">VEEFED TECHNOLOGIES PRIVATE LIMITED</span>
            </p>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <Clock className="w-5 h-5 text-blue-400 mx-auto mb-2" />
                <p className="text-white/60">Last Updated</p>
                <p className="text-white font-semibold">July 2, 2025</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <CheckCircle className="w-5 h-5 text-green-400 mx-auto mb-2" />
                <p className="text-white/60">Effective Date</p>
                <p className="text-white font-semibold">July 2, 2025</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <Globe className="w-5 h-5 text-purple-400 mx-auto mb-2" />
                <p className="text-white/60">Jurisdiction</p>
                <p className="text-white font-semibold">Global</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Table of Contents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12 bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <FileText className="w-6 h-6 text-blue-400" />
            Table of Contents
          </h2>
          
          <div className="grid md:grid-cols-2 gap-3">
            {tableOfContents.map((item, index) => (
              <a
                key={index}
                href={`#${item.id}`}
                className="block p-3 rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white"
              >
                {item.title}
              </a>
            ))}
          </div>
        </motion.div>

        {/* Introduction */}
        <motion.section
          id="introduction"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12 bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
        >
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-400" />
            1. Introduction
          </h2>
          
          <div className="space-y-6 text-white/80 leading-relaxed">
            <p>
              Welcome to Veefore, an AI-powered social media management platform operated by{' '}
              <span className="text-purple-300 font-semibold">VEEFED TECHNOLOGIES PRIVATE LIMITED</span>{' '}
              ("Company," "we," "our," or "us"). This Privacy Policy explains how we collect, use, 
              disclose, and safeguard your information when you use our platform, mobile applications, 
              and related services (collectively, the "Service").
            </p>
            
            <p>
              We are committed to protecting your privacy and maintaining the trust you place in us. 
              This policy applies to all users of our Service, including content creators, businesses, 
              influencers, and team members who access our platform.
            </p>
            
            <div className="bg-blue-500/10 border border-blue-300/20 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-blue-400 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-300 mb-2">Important Notice</h3>
                  <p className="text-white/70">
                    By using our Service, you consent to the collection and use of information in 
                    accordance with this Privacy Policy. If you do not agree with our policies and 
                    practices, please do not use our Service.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Information Collection */}
        <motion.section
          id="information-collection"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12 bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
        >
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Database className="w-8 h-8 text-blue-400" />
            2. Information We Collect
          </h2>
          
          <p className="text-white/80 leading-relaxed mb-8">
            We collect information to provide you with the best possible service experience. The information 
            we collect falls into several categories, each serving specific purposes to enhance your social 
            media management capabilities.
          </p>

          <div className="space-y-8">
            {dataTypes.map((category, index) => (
              <div key={index} className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold mb-4 text-purple-300">{category.category}</h3>
                <ul className="space-y-3">
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-white/70">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-yellow-500/10 border border-yellow-300/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-300 mb-3">Automatic Data Collection</h3>
            <p className="text-white/70">
              We automatically collect certain information when you access our Service, including 
              device information, usage patterns, and technical data necessary for service functionality 
              and security purposes.
            </p>
          </div>
        </motion.section>

        {/* Information Use */}
        <motion.section
          id="information-use"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12 bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
        >
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Settings className="w-8 h-8 text-blue-400" />
            3. How We Use Your Information
          </h2>
          
          <div className="space-y-6 text-white/80 leading-relaxed">
            <p>
              We use the collected information for various purposes to provide, maintain, and improve our Service. 
              Our use of your information is always guided by the principle of data minimization - we only use 
              what is necessary for the specified purposes.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-purple-300">Primary Uses</h3>
                <ul className="space-y-3">
                  {[
                    "Provide and maintain our Service",
                    "Process transactions and manage billing",
                    "Generate AI-powered content and analytics",
                    "Manage social media integrations",
                    "Provide customer support and assistance"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-white/70">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-purple-300">Secondary Uses</h3>
                <ul className="space-y-3">
                  {[
                    "Improve and optimize our algorithms",
                    "Analyze usage patterns and trends",
                    "Send important service notifications",
                    "Ensure platform security and fraud prevention",
                    "Comply with legal obligations"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span className="text-white/70">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-purple-500/10 border border-purple-300/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-300 mb-3">AI and Machine Learning</h3>
              <p className="text-white/70">
                We use your data to train and improve our AI models, including content generation, 
                analytics prediction, and automation features. All AI training is conducted with 
                appropriate privacy safeguards and data anonymization techniques.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Data Security */}
        <motion.section
          id="data-security"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12 bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
        >
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Lock className="w-8 h-8 text-blue-400" />
            5. Data Security and Protection
          </h2>
          
          <p className="text-white/80 leading-relaxed mb-8">
            We implement comprehensive security measures to protect your personal information against 
            unauthorized access, alteration, disclosure, or destruction. Our security framework follows 
            industry best practices and compliance standards.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {securityMeasures.map((measure, index) => (
              <div key={index} className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20">
                    {measure.icon}
                  </div>
                  <h3 className="text-lg font-semibold">{measure.title}</h3>
                </div>
                <p className="text-white/70">{measure.description}</p>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="bg-green-500/10 border border-green-300/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-300 mb-3">Compliance Standards</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-white font-semibold">SOC 2 Type II</p>
                  <p className="text-white/60 text-sm">Security Controls</p>
                </div>
                <div className="text-center">
                  <Globe className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-white font-semibold">GDPR Compliant</p>
                  <p className="text-white/60 text-sm">EU Data Protection</p>
                </div>
                <div className="text-center">
                  <FileText className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-white font-semibold">CCPA Compliant</p>
                  <p className="text-white/60 text-sm">California Privacy</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* User Rights */}
        <motion.section
          id="user-rights"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-12 bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
        >
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-400" />
            7. Your Rights and Choices
          </h2>
          
          <p className="text-white/80 leading-relaxed mb-8">
            You have certain rights regarding your personal information. We respect these rights and 
            provide mechanisms to exercise them easily through our platform or by contacting our 
            privacy team directly.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {userRights.map((right, index) => (
              <div key={index} className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20">
                    {right.icon}
                  </div>
                  <h3 className="text-lg font-semibold">{right.title}</h3>
                </div>
                <p className="text-white/70">{right.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-blue-500/10 border border-blue-300/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-300 mb-3">How to Exercise Your Rights</h3>
            <p className="text-white/70 mb-4">
              To exercise any of these rights, you can:
            </p>
            <ul className="space-y-2 text-white/70">
              <li className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-blue-400" />
                Access your account settings directly in the platform
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                Email our privacy team at privacy@veefore.com
              </li>
              <li className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                Submit a formal request through our privacy portal
              </li>
            </ul>
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-12 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl p-8 border border-purple-300/20"
        >
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Mail className="w-8 h-8 text-blue-400" />
            13. Contact Information
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Privacy Questions</h3>
              <div className="space-y-3 text-white/70">
                <p className="font-semibold text-white">VEEFED TECHNOLOGIES PRIVATE LIMITED</p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-400" />
                  privacy@veefore.com
                </p>
                <p className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  Data Protection Officer
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">General Support</h3>
              <div className="space-y-3 text-white/70">
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-purple-400" />
                  support@veefore.com
                </p>
                <p className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-purple-400" />
                  help.veefore.com
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-400" />
                  24/7 Support Available
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-white/5 rounded-xl border border-white/10">
            <h3 className="text-lg font-semibold mb-3">Response Timeline</h3>
            <p className="text-white/70">
              We are committed to responding to all privacy-related inquiries within 30 days. 
              For urgent matters involving data breaches or security concerns, we will respond 
              within 72 hours as required by applicable regulations.
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="pt-8 border-t border-white/10 text-center"
        >
          <p className="text-sm text-white/40 mb-4">
            This Privacy Policy is effective as of July 2, 2025, and will remain in effect except with respect to any changes in its provisions in the future.
          </p>
          <p className="text-sm text-white/40">
            © 2025 Veefore — A product of VEEFED TECHNOLOGIES PRIVATE LIMITED
          </p>
        </motion.div>
      </div>
    </div>
  );
}