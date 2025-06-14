import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Scale, User, CreditCard, Zap, AlertTriangle, Ban, Gavel, Phone, Clock, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Section {
  id: string;
  title: string;
  icon: any;
  content: string[];
}

const termsSections: Section[] = [
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    icon: Scale,
    content: [
      "Agreement to Terms: By accessing or using VeeFore, you agree to be bound by these Terms of Service and all applicable laws and regulations.",
      "Age Requirements: You must be at least 18 years old or have parental consent to use our services.",
      "Capacity: You represent that you have the legal capacity to enter into this agreement.",
      "Updates: We may update these terms at any time, and continued use constitutes acceptance of changes.",
      "Jurisdiction: These terms are governed by the laws of the jurisdiction where VeeFore operates."
    ]
  },
  {
    id: "account-responsibilities",
    title: "Account & User Responsibilities",
    icon: User,
    content: [
      "Account Security: You are responsible for maintaining the confidentiality of your account credentials and all activities under your account.",
      "Accurate Information: You must provide accurate, current, and complete information when creating your account.",
      "Authorized Use: You may only use VeeFore for lawful purposes and in accordance with these terms.",
      "Content Responsibility: You are solely responsible for all content you create, upload, or share through our platform.",
      "Compliance: You must comply with all applicable laws, regulations, and third-party terms of service when using VeeFore."
    ]
  },
  {
    id: "subscription-billing",
    title: "Subscription & Billing",
    icon: CreditCard,
    content: [
      "Payment Terms: Subscription fees are billed in advance on a monthly or annual basis as selected during signup.",
      "Auto-Renewal: Subscriptions automatically renew unless cancelled before the renewal date.",
      "Price Changes: We may change subscription prices with 30 days' notice to existing subscribers.",
      "Refund Policy: Refunds are available within 14 days of initial purchase, subject to usage limitations.",
      "Failed Payments: Service may be suspended for failed payments until payment issues are resolved."
    ]
  },
  {
    id: "service-availability",
    title: "Service Availability & Features",
    icon: Zap,
    content: [
      "Service Uptime: We strive for 99.9% uptime but cannot guarantee uninterrupted service availability.",
      "Feature Changes: We may modify, suspend, or discontinue features with reasonable notice to users.",
      "Third-Party Dependencies: Some features rely on third-party services which may affect availability.",
      "Maintenance: Scheduled maintenance will be announced in advance when possible.",
      "Emergency Changes: We reserve the right to make immediate changes for security or legal compliance."
    ]
  },
  {
    id: "prohibited-uses",
    title: "Prohibited Uses & Content",
    icon: Ban,
    content: [
      "Illegal Activities: You may not use VeeFore for any unlawful purposes or activities.",
      "Harmful Content: Posting spam, malware, or content that violates platform policies is prohibited.",
      "Impersonation: You may not impersonate others or misrepresent your identity or affiliation.",
      "System Abuse: Attempting to interfere with, disrupt, or gain unauthorized access to our systems is forbidden.",
      "Intellectual Property: You may not infringe on copyrights, trademarks, or other intellectual property rights."
    ]
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property Rights",
    icon: Gavel,
    content: [
      "VeeFore IP: All VeeFore software, content, and materials are protected by intellectual property laws.",
      "User Content: You retain rights to your original content but grant us license to use it for service provision.",
      "License Grant: We grant you a limited, non-exclusive license to use our services for personal or business purposes.",
      "Respect Third-Party Rights: You must respect the intellectual property rights of others when using our platform.",
      "DMCA Compliance: We respond to valid DMCA takedown notices and may terminate repeat infringers."
    ]
  },
  {
    id: "limitation-liability",
    title: "Limitation of Liability",
    icon: AlertTriangle,
    content: [
      "Service Disclaimer: VeeFore is provided 'as is' without warranties of any kind, express or implied.",
      "Limitation of Damages: Our liability is limited to the amount you paid for services in the preceding 12 months.",
      "Indirect Damages: We are not liable for indirect, incidental, special, or consequential damages.",
      "User Responsibility: You are responsible for your use of the service and any consequences thereof.",
      "Legal Limitations: Some jurisdictions do not allow certain liability limitations, so these may not apply to you."
    ]
  },
  {
    id: "termination",
    title: "Termination & Suspension",
    icon: Clock,
    content: [
      "User Termination: You may terminate your account at any time through your account settings.",
      "Our Termination Rights: We may terminate or suspend accounts for violations of these terms or applicable laws.",
      "Effect of Termination: Upon termination, your access to services ceases and data may be deleted according to our retention policy.",
      "Survival: Certain provisions including payment obligations and intellectual property rights survive termination.",
      "Dispute Resolution: Termination disputes are subject to our dispute resolution procedures outlined below."
    ]
  }
];

export default function TermsOfService() {
  const [activeSection, setActiveSection] = useState<string>("");
  const [expandedSection, setExpandedSection] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    termsSections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-space-gray-900 via-space-gray-800 to-space-gray-900 text-white relative">
      {/* Fixed Background Animation Layer */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Animated background particles */}
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-electric-cyan/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Floating geometric shapes */}
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 border border-electric-cyan/20 rounded-full"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
          }}
        />
        
        <motion.div
          className="absolute top-1/3 right-20 w-24 h-24 border border-solar-gold/20"
          animate={{ 
            rotate: [45, 225, 45],
            opacity: [0.2, 0.6, 0.2]
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />

        <motion.div
          className="absolute bottom-40 left-1/4 w-16 h-16 bg-gradient-to-r from-purple-500/20 to-electric-cyan/20 rounded-full blur-xl"
          animate={{ 
            x: [-30, 30, -30], 
            y: [-20, 20, -20],
            scale: [1, 1.3, 1]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
      </div>

      {/* Back Navigation */}
      <motion.div
        className="fixed top-6 left-6 z-50"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Link href="/dashboard">
          <Button
            variant="ghost"
            size="sm"
            className="glassmorphism text-white hover:bg-white/10 border border-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
      </motion.div>

      {/* Navigation Sidebar - Fixed Vertical Layout */}
      <motion.div
        className="fixed left-6 top-1/2 transform -translate-y-1/2 z-40 flex flex-col space-y-2"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        {termsSections.map((section, index) => (
          <motion.button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={`group relative p-3 rounded-xl transition-all duration-300 backdrop-blur-sm block ${
              activeSection === section.id
                ? 'bg-solar-gold/20 border border-solar-gold/50'
                : 'bg-space-gray-800/30 border border-space-gray-600/30 hover:bg-space-gray-700/50'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <section.icon className={`w-5 h-5 ${
              activeSection === section.id ? 'text-solar-gold' : 'text-asteroid-silver group-hover:text-white'
            }`} />
            
            {/* Tooltip */}
            <div className="absolute left-full ml-4 px-3 py-1 bg-space-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
              {section.title}
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* Main Content - Centered */}
      <div className="relative z-10 max-w-4xl mx-auto px-8 py-8">
        <div className="ml-20">
          {/* Header */}
          <motion.div
            className="pt-12 pb-12 text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-solar-gold to-orange-500 rounded-full mb-6"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Scale className="w-10 h-10 text-white" />
            </motion.div>
            
            <h1 className="text-5xl font-bold font-orbitron bg-gradient-to-r from-solar-gold via-orange-400 to-solar-gold bg-clip-text text-transparent mb-4">
              Terms of Service
            </h1>
            
            <p className="text-xl text-asteroid-silver max-w-2xl mx-auto leading-relaxed">
              These terms govern your use of VeeFore and outline the rights and 
              responsibilities of both you and VeeFore in our service relationship.
            </p>
            
            <motion.p
              className="text-sm text-space-gray-400 mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Effective Date: June 15, 2025
            </motion.p>
          </motion.div>

          {/* Terms Summary */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="content-card holographic border-space-gray-600/50 bg-space-gray-800/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-xl font-orbitron">
                  <Zap className="h-6 w-6 text-solar-gold" />
                  <span>Terms Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-white mb-3">Your Rights</h4>
                    <ul className="space-y-2 text-sm text-asteroid-silver">
                      <li>• Use VeeFore for business and personal social media management</li>
                      <li>• Access features according to your subscription tier</li>
                      <li>• Request data export and account deletion</li>
                      <li>• Cancel subscription at any time</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-3">Your Responsibilities</h4>
                    <ul className="space-y-2 text-sm text-asteroid-silver">
                      <li>• Use services lawfully and ethically</li>
                      <li>• Respect intellectual property rights</li>
                      <li>• Keep account credentials secure</li>
                      <li>• Comply with social media platform terms</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Content Sections */}
          <div className="space-y-8">
            {termsSections.map((section, index) => (
              <motion.div
                key={section.id}
                id={section.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * index }}
              >
                <Card className="content-card holographic border-space-gray-600/50 bg-space-gray-800/30 backdrop-blur-sm">
                  <CardHeader
                    className="cursor-pointer"
                    onClick={() => setExpandedSection(expandedSection === section.id ? "" : section.id)}
                  >
                    <CardTitle className="flex items-center justify-between text-xl font-orbitron">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-solar-gold/20 to-electric-cyan/20 flex items-center justify-center">
                          <section.icon className="w-5 h-5 text-solar-gold" />
                        </div>
                        <span className="text-white">{section.title}</span>
                      </div>
                      <motion.div
                        animate={{ rotate: expandedSection === section.id ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="w-5 h-5 text-asteroid-silver" />
                      </motion.div>
                    </CardTitle>
                  </CardHeader>
                  
                  <motion.div
                    initial={false}
                    animate={{ height: expandedSection === section.id ? "auto" : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        {section.content.map((item, itemIndex) => (
                          <motion.div
                            key={itemIndex}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ 
                              opacity: expandedSection === section.id ? 1 : 0,
                              x: expandedSection === section.id ? 0 : -20
                            }}
                            transition={{ delay: itemIndex * 0.1 }}
                            className="flex items-start space-x-3"
                          >
                            <div className="w-2 h-2 bg-electric-cyan rounded-full mt-2 flex-shrink-0" />
                            <p className="text-asteroid-silver leading-relaxed">
                              {item}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </motion.div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Contact Section */}
          <motion.div
            className="mt-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <Card className="content-card holographic border-solar-gold/30 bg-gradient-to-r from-solar-gold/10 to-orange-500/10 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-solar-gold/20 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-solar-gold" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-solar-gold mb-4 font-orbitron">
                      Questions or Legal Concerns?
                    </h3>
                    <p className="text-asteroid-silver mb-6 leading-relaxed">
                      If you have questions about these terms or need to report a legal concern, our legal and 
                      support teams are here to help. We're committed to transparency and fair treatment of all users.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <Button className="bg-solar-gold hover:bg-solar-gold/80 text-space-gray-900 font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105">
                        <Phone className="w-4 h-4 mr-2" />
                        Contact Legal Team
                      </Button>
                      <Button variant="outline" className="border-solar-gold/50 text-solar-gold hover:bg-solar-gold/10 px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105">
                        General Support
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Footer */}
          <motion.div
            className="mt-12 pt-8 border-t border-space-gray-600/50 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <p className="text-asteroid-silver mb-4">
              For questions about these Terms of Service, contact us at legal@veefore.com
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm">
              <Link href="/privacy-policy">
                <span className="text-electric-cyan hover:text-white transition-colors cursor-pointer">
                  Privacy Policy
                </span>
              </Link>
              <span className="text-space-gray-600">•</span>
              <Link href="/dashboard">
                <span className="text-electric-cyan hover:text-white transition-colors cursor-pointer">
                  Dashboard
                </span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}