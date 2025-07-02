import { motion } from 'framer-motion';
import { FileText, ArrowLeft, Scale, Shield, Users, CreditCard, AlertTriangle, CheckCircle, Globe, Eye } from 'lucide-react';
import { useLocation, Link } from 'wouter';
import { Button } from '@/components/ui/button';

export function TermsOfService() {
  const [, setLocation] = useLocation();

  const sections = [
    {
      id: "agreement",
      title: "Agreement to Terms",
      icon: <Scale className="w-6 h-6" />,
      content: `By accessing and using Veefore, operated by VEEFED TECHNOLOGIES PRIVATE LIMITED, 
      you accept and agree to be bound by the terms and provision of this agreement. If you do not 
      agree to these terms, you should not use this platform.`,
      subsections: [
        {
          title: "Acceptance of Terms",
          items: [
            "These terms constitute a legally binding agreement between you and VEEFED TECHNOLOGIES PRIVATE LIMITED",
            "By creating an account, you confirm you are legally able to enter into contracts",
            "You must be at least 13 years old to use our services",
            "If you are under 18, you confirm you have parental consent",
            "Business users confirm they have authority to bind their organization"
          ]
        }
      ]
    },
    {
      id: "service-description",
      title: "Service Description",
      icon: <Globe className="w-6 h-6" />,
      content: "Veefore is an AI-powered social media management platform that provides content creation, scheduling, analytics, and automation tools.",
      subsections: [
        {
          title: "Platform Features",
          items: [
            "AI-powered content generation and optimization",
            "Multi-platform social media scheduling and publishing",
            "Advanced analytics and performance insights",
            "Automated engagement and response management",
            "Team collaboration and workspace management",
            "Thumbnail generation and design tools"
          ]
        },
        {
          title: "Service Availability",
          items: [
            "Services are provided on a subscription basis",
            "We strive for 99.9% uptime but cannot guarantee uninterrupted service",
            "Planned maintenance will be announced in advance when possible",
            "Emergency maintenance may occur without prior notice",
            "Features may be added, modified, or discontinued with notice"
          ]
        }
      ]
    },
    {
      id: "user-accounts",
      title: "User Accounts and Registration",
      icon: <Users className="w-6 h-6" />,
      content: "You must create an account to access our services. You are responsible for maintaining the security of your account.",
      subsections: [
        {
          title: "Account Requirements",
          items: [
            "Provide accurate and complete registration information",
            "Maintain and promptly update your account information",
            "Keep your password secure and confidential",
            "Notify us immediately of any unauthorized access",
            "You are responsible for all activities under your account"
          ]
        },
        {
          title: "Account Termination",
          items: [
            "You may terminate your account at any time",
            "We may suspend or terminate accounts for terms violations",
            "Terminated accounts may have data deleted after 30 days",
            "Refunds are subject to our refund policy",
            "We reserve the right to refuse service to anyone"
          ]
        }
      ]
    },
    {
      id: "acceptable-use",
      title: "Acceptable Use Policy",
      icon: <Shield className="w-6 h-6" />,
      content: "You agree to use our platform responsibly and in compliance with all applicable laws and regulations.",
      subsections: [
        {
          title: "Permitted Uses",
          items: [
            "Create and manage social media content for legitimate purposes",
            "Use AI tools for content generation and optimization",
            "Collaborate with team members on social media strategies",
            "Analyze and improve your social media performance",
            "Access educational resources and platform documentation"
          ]
        },
        {
          title: "Prohibited Activities",
          items: [
            "Upload illegal, harmful, or offensive content",
            "Violate any social media platform's terms of service",
            "Engage in spam, harassment, or abusive behavior",
            "Attempt to hack, reverse engineer, or exploit our systems",
            "Share copyrighted content without proper authorization",
            "Use the platform for illegal activities or fraud",
            "Create fake accounts or impersonate others",
            "Distribute malware or malicious code"
          ]
        }
      ]
    },
    {
      id: "content-ownership",
      title: "Content Ownership and License",
      icon: <FileText className="w-6 h-6" />,
      content: "You retain ownership of content you create. By using our platform, you grant us certain rights to process and store your content.",
      subsections: [
        {
          title: "Your Content Rights",
          items: [
            "You retain all ownership rights to content you create",
            "You are responsible for ensuring you have rights to uploaded content",
            "You must not upload content that infringes others' rights",
            "You can export and delete your content at any time",
            "We do not claim ownership over your creative work"
          ]
        },
        {
          title: "License to Us",
          items: [
            "You grant us a license to store, process, and display your content",
            "This license allows us to provide AI analysis and optimization",
            "We may use anonymized data for service improvement",
            "License is limited to providing our services to you",
            "License terminates when you delete content or close your account"
          ]
        }
      ]
    },
    {
      id: "payment-terms",
      title: "Payment and Billing",
      icon: <CreditCard className="w-6 h-6" />,
      content: "Our services operate on a credit-based system with various subscription plans available.",
      subsections: [
        {
          title: "Billing and Payments",
          items: [
            "Subscriptions are billed in advance on a recurring basis",
            "Credits are consumed based on usage of AI features",
            "All fees are non-refundable except as required by law",
            "Prices may change with 30 days notice to existing subscribers",
            "Failed payments may result in service suspension",
            "You authorize us to charge your payment method automatically"
          ]
        },
        {
          title: "Refund Policy",
          items: [
            "Refunds are available within 14 days of initial purchase",
            "Refunds for unused credits may be provided at our discretion",
            "Annual subscriptions may receive prorated refunds",
            "Refunds exclude payment processing fees",
            "Refund requests must be submitted through official channels"
          ]
        }
      ]
    },
    {
      id: "intellectual-property",
      title: "Intellectual Property Rights",
      icon: <Eye className="w-6 h-6" />,
      content: "We respect intellectual property rights and expect our users to do the same.",
      subsections: [
        {
          title: "Our Rights",
          items: [
            "Veefore platform and software are our intellectual property",
            "Our trademarks, logos, and branding are protected",
            "AI models and algorithms are proprietary technology",
            "Documentation and educational content are copyrighted",
            "Users may not copy, modify, or distribute our platform"
          ]
        },
        {
          title: "DMCA Compliance",
          items: [
            "We respond to valid DMCA takedown notices",
            "Copyright holders may report infringement to legal@veefore.com",
            "Users who repeatedly infringe may have accounts terminated",
            "We provide counter-notification procedures per DMCA",
            "We maintain a copyright infringement policy"
          ]
        }
      ]
    },
    {
      id: "disclaimers",
      title: "Disclaimers and Limitations",
      icon: <AlertTriangle className="w-6 h-6" />,
      content: "Our services are provided 'as is' with certain limitations on warranties and liability.",
      subsections: [
        {
          title: "Service Disclaimers",
          items: [
            "Services are provided 'as is' without warranties of any kind",
            "We do not guarantee specific results from using our platform",
            "AI-generated content may not always meet your expectations",
            "Third-party integrations are subject to external service availability",
            "We are not responsible for content published to social media platforms"
          ]
        },
        {
          title: "Limitation of Liability",
          items: [
            "Our liability is limited to the amount paid for services",
            "We are not liable for indirect, consequential, or punitive damages",
            "We are not responsible for loss of data, profits, or business",
            "Force majeure events are excluded from liability",
            "Some jurisdictions may not allow these limitations"
          ]
        }
      ]
    },
    {
      id: "third-party-services",
      title: "Third-Party Integrations",
      icon: <Globe className="w-6 h-6" />,
      content: "Our platform integrates with various social media platforms and third-party services.",
      subsections: [
        {
          title: "Social Media Platforms",
          items: [
            "Integrations are subject to third-party platform terms",
            "Platform API changes may affect functionality",
            "We are not responsible for third-party platform policies",
            "Access tokens may expire and require re-authorization",
            "Publishing failures may occur due to platform restrictions"
          ]
        },
        {
          title: "External Services",
          items: [
            "AI services (OpenAI, Google) have their own terms",
            "Payment processors have separate privacy policies",
            "Analytics providers may collect additional data",
            "We select reputable partners but cannot guarantee their service",
            "External service outages may impact our functionality"
          ]
        }
      ]
    },
    {
      id: "data-protection",
      title: "Data Protection and Privacy",
      icon: <Shield className="w-6 h-6" />,
      content: "We are committed to protecting your privacy and personal data in accordance with applicable laws.",
      subsections: [
        {
          title: "Data Handling",
          items: [
            "We process data in accordance with our Privacy Policy",
            "GDPR rights are available to EU users",
            "CCPA rights are available to California residents",
            "Data is encrypted in transit and at rest",
            "We conduct regular security audits and assessments"
          ]
        },
        {
          title: "Data Retention",
          items: [
            "Account data is retained while your account is active",
            "Deleted data is purged within 30 days unless legally required",
            "Backup data may be retained for disaster recovery",
            "Analytics data may be anonymized and retained longer",
            "Legal compliance may require extended retention periods"
          ]
        }
      ]
    },
    {
      id: "modifications",
      title: "Terms Modification",
      icon: <FileText className="w-6 h-6" />,
      content: "We may update these terms from time to time. Continued use constitutes acceptance of any changes.",
      subsections: [
        {
          title: "Change Process",
          items: [
            "Material changes will be communicated via email or platform notice",
            "Changes become effective 30 days after notice unless sooner required by law",
            "Continued use after changes constitutes acceptance",
            "If you disagree with changes, you may terminate your account",
            "We will maintain an archive of previous terms versions"
          ]
        }
      ]
    },
    {
      id: "governing-law",
      title: "Governing Law and Disputes",
      icon: <Scale className="w-6 h-6" />,
      content: "These terms are governed by applicable laws and disputes will be resolved through designated procedures.",
      subsections: [
        {
          title: "Legal Framework",
          items: [
            "These terms are governed by the laws of India",
            "Disputes will be subject to the jurisdiction of Indian courts",
            "International users acknowledge Indian law applies",
            "If any provision is invalid, the rest remains in effect",
            "These terms constitute the entire agreement between parties"
          ]
        },
        {
          title: "Dispute Resolution",
          items: [
            "We encourage resolving disputes through customer support first",
            "Mediation may be required before litigation",
            "Class action lawsuits are waived where legally permitted",
            "Individual arbitration may be required in some jurisdictions",
            "You retain rights that cannot be waived under applicable law"
          ]
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen text-white">
      <div className="absolute inset-0"></div>
      
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
              <div className="p-3 rounded-full bg-purple-500/20">
                <FileText className="w-10 h-10 text-purple-400" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Terms of Service
              </h1>
            </div>
            
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Please read these terms carefully before using our platform. They govern your use of Veefore services.
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {sections.map((section, index) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="flex items-center gap-2 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm"
                >
                  {section.icon}
                  <span className="truncate">{section.title}</span>
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
              <h2 className="text-2xl font-semibold">Need Help or Have Questions?</h2>
            </div>
            
            <p className="text-white/80 mb-6 max-w-2xl mx-auto">
              If you have any questions about these Terms of Service or need assistance, 
              please contact us through our support channels within the Veefore platform.
            </p>
            
            <div className="space-y-2 text-sm text-white/60">
              <p>VEEFED TECHNOLOGIES PRIVATE LIMITED</p>
              <p>Email: legal@veefore.com</p>
              <p>Support: support@veefore.com</p>
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