import { motion } from 'framer-motion';
import { Shield, ArrowLeft, Eye, Lock, Database, Users, Globe, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { useLocation, Link } from 'wouter';
import { Button } from '@/components/ui/button';

export function PrivacyPolicy() {
  const [, setLocation] = useLocation();

  const sections = [
    {
      id: "introduction",
      title: "Introduction",
      icon: <Shield className="w-6 h-6" />,
      content: `This Privacy Policy describes how VEEFED TECHNOLOGIES PRIVATE LIMITED ("we," "our," or "us") 
      collects, uses, and protects your information when you use the Veefore platform. We are committed to 
      protecting your privacy and ensuring transparency in how we handle your personal data.`
    },
    {
      id: "information-collection",
      title: "Information We Collect",
      icon: <Database className="w-6 h-6" />,
      content: "We collect information you provide directly to us, information we obtain automatically when you use our services, and information from third-party sources.",
      subsections: [
        {
          title: "Information You Provide",
          items: [
            "Account information (email, name, profile details)",
            "Content you create and upload to our platform",
            "Social media account connections and associated data",
            "Payment and billing information",
            "Communications with our support team",
            "Survey responses and feedback"
          ]
        },
        {
          title: "Information We Collect Automatically",
          items: [
            "Device information (IP address, browser type, operating system)",
            "Usage information (features used, time spent, click patterns)",
            "Analytics data and performance metrics",
            "Cookie and tracking technology data",
            "Location information (if permitted)"
          ]
        },
        {
          title: "Information from Third Parties",
          items: [
            "Social media platform data (when you connect accounts)",
            "Analytics from connected social media accounts",
            "Public information available through APIs",
            "Payment processor information"
          ]
        }
      ]
    },
    {
      id: "data-usage",
      title: "How We Use Your Information",
      icon: <Eye className="w-6 h-6" />,
      content: "We use the information we collect to provide, maintain, and improve our services.",
      subsections: [
        {
          title: "Primary Uses",
          items: [
            "Provide and maintain the Veefore platform services",
            "Process your social media content and analytics",
            "Generate AI-powered insights and recommendations",
            "Facilitate social media scheduling and publishing",
            "Process payments and manage your account",
            "Provide customer support and respond to inquiries"
          ]
        },
        {
          title: "Secondary Uses",
          items: [
            "Improve our services and develop new features",
            "Analyze usage patterns and platform performance",
            "Send important updates and service notifications",
            "Conduct research and analytics (anonymized data)",
            "Comply with legal obligations and prevent fraud",
            "Personalize your experience on our platform"
          ]
        }
      ]
    },
    {
      id: "data-sharing",
      title: "Data Sharing and Disclosure",
      icon: <Users className="w-6 h-6" />,
      content: "We do not sell, rent, or trade your personal information. We only share your information in limited circumstances.",
      subsections: [
        {
          title: "When We Share Information",
          items: [
            "With your explicit consent or at your direction",
            "With service providers who assist in our operations",
            "To comply with legal obligations or valid legal processes",
            "To protect our rights, property, or safety",
            "In connection with a business transaction (merger, acquisition)",
            "With connected social media platforms (as necessary for functionality)"
          ]
        },
        {
          title: "Service Providers",
          items: [
            "Cloud hosting and infrastructure providers",
            "Payment processing services",
            "Analytics and monitoring services",
            "Customer support tools",
            "AI and machine learning service providers",
            "Security and fraud prevention services"
          ]
        }
      ]
    },
    {
      id: "data-security",
      title: "Data Security",
      icon: <Lock className="w-6 h-6" />,
      content: "We implement comprehensive security measures to protect your information against unauthorized access, alteration, disclosure, or destruction.",
      subsections: [
        {
          title: "Security Measures",
          items: [
            "End-to-end encryption for sensitive data transmission",
            "Regular security audits and vulnerability assessments",
            "Multi-factor authentication for admin access",
            "Secure data centers with physical security controls",
            "Employee access controls and security training",
            "Regular backups and disaster recovery procedures"
          ]
        },
        {
          title: "Data Protection Standards",
          items: [
            "SOC 2 Type II compliance standards",
            "GDPR compliance for EU users",
            "CCPA compliance for California residents",
            "ISO 27001 security management standards",
            "Regular third-party security assessments",
            "Incident response and breach notification procedures"
          ]
        }
      ]
    },
    {
      id: "user-rights",
      title: "Your Rights and Choices",
      icon: <CheckCircle className="w-6 h-6" />,
      content: "You have several rights regarding your personal information and how we use it.",
      subsections: [
        {
          title: "Data Rights",
          items: [
            "Access: Request a copy of your personal information",
            "Rectification: Correct inaccurate or incomplete information",
            "Erasure: Request deletion of your personal information",
            "Portability: Receive your data in a machine-readable format",
            "Restriction: Limit how we process your information",
            "Objection: Object to certain types of processing"
          ]
        },
        {
          title: "Account Controls",
          items: [
            "Update your profile and account information",
            "Manage connected social media accounts",
            "Control email and notification preferences",
            "Download your data and content",
            "Delete your account and associated data",
            "Manage cookie and tracking preferences"
          ]
        }
      ]
    },
    {
      id: "international-transfers",
      title: "International Data Transfers",
      icon: <Globe className="w-6 h-6" />,
      content: "Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place.",
      subsections: [
        {
          title: "Transfer Safeguards",
          items: [
            "Standard Contractual Clauses (SCCs) for EU transfers",
            "Adequacy decisions for approved countries",
            "Binding Corporate Rules for intra-group transfers",
            "Certification programs and codes of conduct",
            "Specific authorization for sensitive transfers"
          ]
        }
      ]
    },
    {
      id: "data-retention",
      title: "Data Retention",
      icon: <FileText className="w-6 h-6" />,
      content: "We retain your information only as long as necessary to provide our services and comply with legal obligations.",
      subsections: [
        {
          title: "Retention Periods",
          items: [
            "Active account data: Retained while account is active",
            "Inactive account data: Deleted after 2 years of inactivity",
            "Financial records: Retained for 7 years for tax purposes",
            "Support communications: Retained for 3 years",
            "Analytics data: Anonymized after 24 months",
            "Legal hold data: Retained as required by law"
          ]
        }
      ]
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
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-blue-500/20">
                <Shield className="w-10 h-10 text-blue-400" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Privacy Policy
              </h1>
            </div>
            
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Your privacy is our priority. Learn how we collect, use, and protect your information.
            </p>
            
            <div className="mt-6 flex items-center justify-center gap-4 text-sm text-white/50">
              <span>Last updated: July 02, 2025</span>
              <span>•</span>
              <span>Effective date: July 02, 2025</span>
            </div>
          </div>
        </motion.div>

        {/* Quick Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold mb-4 text-center">Quick Navigation</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {sections.map((section, index) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="flex items-center gap-2 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm"
                >
                  {section.icon}
                  <span>{section.title}</span>
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Content Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.section
              key={section.id}
              id={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  {section.icon}
                </div>
                <h2 className="text-2xl font-semibold">{section.title}</h2>
              </div>
              
              <div className="text-white/80 leading-relaxed space-y-6">
                <p>{section.content}</p>
                
                {section.subsections && (
                  <div className="space-y-6">
                    {section.subsections.map((subsection, subIndex) => (
                      <div key={subIndex}>
                        <h3 className="text-lg font-medium mb-3 text-white/90">
                          {subsection.title}
                        </h3>
                        <ul className="space-y-2">
                          {subsection.items.map((item, itemIndex) => (
                            <li key={itemIndex} className="flex items-start gap-3">
                              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.section>
          ))}
        </div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm rounded-2xl p-8 border border-purple-300/20"
        >
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
              <h2 className="text-2xl font-semibold">Questions or Concerns?</h2>
            </div>
            
            <p className="text-white/80 mb-6 max-w-2xl mx-auto">
              If you have any questions about this Privacy Policy or our data practices, 
              please don't hesitate to contact us through our support channels within the Veefore platform.
            </p>
            
            <div className="space-y-2 text-sm text-white/60">
              <p>VEEFED TECHNOLOGIES PRIVATE LIMITED</p>
              <p>Email: privacy@veefore.com</p>
              <p>Data Protection Officer: dpo@veefore.com</p>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-12 pt-8 border-t border-white/10 text-center"
        >
          <p className="text-sm text-white/40">
            © 2025 Veefore — A product of VEEFED TECHNOLOGIES PRIVATE LIMITED
          </p>
        </motion.div>
      </div>
    </div>
  );
}