import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Shield, Eye, Database, Lock, Globe, Users, FileText, Mail, Calendar, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Section {
  id: string;
  title: string;
  icon: any;
  content: string[];
}

const sections: Section[] = [
  {
    id: "info",
    title: "Information We Collect",
    icon: Database,
    content: [
      "Account Information: When you create a VeeFore account, we collect your email address, username, and profile information.",
      "Social Media Data: We access your connected social media accounts (Instagram, YouTube, TikTok) through official APIs to provide analytics and automation services.",
      "Usage Analytics: We collect information about how you use our platform, including feature usage, content creation patterns, and performance metrics.",
      "Device Information: We may collect device identifiers, browser type, and operating system for security and optimization purposes.",
      "Communication Data: When you contact our support team, we store your messages and any attached files to provide assistance."
    ]
  },
  {
    id: "usage",
    title: "How We Use Your Data",
    icon: Eye,
    content: [
      "Service Provision: We use your data to provide VeeFore's core features including analytics, content scheduling, and automation.",
      "Platform Improvement: Analytics help us understand user behavior and improve our services.",
      "Customer Support: Your communication data helps us resolve issues and provide better support.",
      "Security: We monitor for suspicious activity to protect your account and our platform.",
      "Legal Compliance: We may process data as required by applicable laws and regulations."
    ]
  },
  {
    id: "protection",
    title: "Data Protection",
    icon: Shield,
    content: [
      "Encryption: All data is encrypted in transit and at rest using industry-standard protocols.",
      "Access Control: Strict access controls ensure only authorized personnel can access your data.",
      "Regular Audits: We conduct regular security audits and vulnerability assessments.",
      "Data Minimization: We collect only the data necessary to provide our services.",
      "Secure Infrastructure: Our systems are hosted on secure, compliant cloud infrastructure."
    ]
  },
  {
    id: "sharing",
    title: "Data Sharing",
    icon: Users,
    content: [
      "Third-Party Integrations: We share data with social media platforms only as necessary for service functionality.",
      "Service Providers: Trusted third-party providers may process data on our behalf under strict confidentiality agreements.",
      "Legal Requirements: We may disclose data when required by law or to protect rights and safety.",
      "Business Transfers: In the event of a merger or acquisition, data may be transferred as part of business assets.",
      "Consent: We will obtain your explicit consent before sharing data for any other purposes."
    ]
  },
  {
    id: "rights",
    title: "Your Rights",
    icon: Lock,
    content: [
      "Access: You can request access to all personal data we hold about you.",
      "Correction: You have the right to correct inaccurate or incomplete data.",
      "Deletion: You can request deletion of your personal data, subject to legal requirements.",
      "Data Portability: You can request your data in a machine-readable format.",
      "Opt-Out: You can opt out of non-essential data processing at any time."
    ]
  },
  {
    id: "retention",
    title: "Data Retention",
    icon: Calendar,
    content: [
      "Active Accounts: We retain data for active accounts as long as you use our services.",
      "Inactive Accounts: Data for inactive accounts is deleted after 2 years of inactivity.",
      "Legal Requirements: Some data may be retained longer to comply with legal obligations.",
      "Backup Data: Backup copies are deleted within 90 days of account closure.",
      "Analytics Data: Aggregated, non-personal analytics data may be retained indefinitely."
    ]
  }
];

export default function PrivacyPolicy() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [activeNavItem, setActiveNavItem] = useState<string>("info");

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("[data-section]");
      let currentSection = "";
      
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          currentSection = section.getAttribute("data-section") || "";
        }
      });
      
      if (currentSection && currentSection !== activeNavItem) {
        setActiveNavItem(currentSection);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeNavItem]);

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(`[data-section="${sectionId}"]`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
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

      {/* Navigation Sidebar */}
      <motion.div
        className="fixed left-6 top-1/2 transform -translate-y-1/2 z-40 space-y-4"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        {sections.map((section, index) => (
          <motion.button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={`group relative p-3 rounded-xl transition-all duration-300 backdrop-blur-sm ${
              activeNavItem === section.id
                ? 'bg-solar-gold/20 border border-solar-gold/50'
                : 'bg-space-gray-800/30 border border-space-gray-600/30 hover:bg-space-gray-700/50'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <section.icon className={`w-5 h-5 ${
              activeNavItem === section.id ? 'text-solar-gold' : 'text-asteroid-silver group-hover:text-white'
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
              <Shield className="w-10 h-10 text-white" />
            </motion.div>
            
            <h1 className="text-5xl font-bold font-orbitron bg-gradient-to-r from-solar-gold via-orange-400 to-solar-gold bg-clip-text text-transparent mb-4">
              Privacy Policy
            </h1>
            
            <p className="text-xl text-asteroid-silver max-w-2xl mx-auto leading-relaxed">
              Your privacy and data security are fundamental to everything we do at VeeFore. 
              This policy explains how we collect, use, and protect your information.
            </p>
            
            <motion.p
              className="text-sm text-space-gray-400 mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Last updated: June 15, 2025
            </motion.p>
          </motion.div>

          {/* Content Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={section.id}
                data-section={section.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * index }}
              >
                <Card className="content-card holographic border-space-gray-600/50 bg-space-gray-800/30 backdrop-blur-sm">
                  <CardHeader
                    className="cursor-pointer"
                    onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
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

          {/* Footer */}
          <motion.div
            className="mt-16 pt-8 border-t border-space-gray-600/50 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <p className="text-asteroid-silver mb-4">
              For questions about this Privacy Policy, contact us at privacy@veefore.com
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm">
              <Link href="/terms-of-service">
                <span className="text-electric-cyan hover:text-white transition-colors cursor-pointer">
                  Terms of Service
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