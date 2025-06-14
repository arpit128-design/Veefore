import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Shield, Database, Eye, Users, Lock, Globe, Calendar, Mail, ArrowLeft } from "lucide-react";
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
    id: "cookies",
    title: "Cookies & Tracking",
    icon: Globe,
    content: [
      "Essential Cookies: We use cookies necessary for basic site functionality and security.",
      "Analytics Cookies: These help us understand how users interact with our platform.",
      "Preference Cookies: We store your settings and preferences for a better experience.",
      "Third-Party Cookies: Some integrations may use their own cookies with your consent.",
      "Cookie Control: You can manage cookie preferences through your browser settings."
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
  },
  {
    id: "contact",
    title: "Contact & Updates",
    icon: Mail,
    content: [
      "Data Protection Officer: Contact our DPO at privacy@veefore.com for data-related inquiries.",
      "Policy Updates: We'll notify you of material changes via email and platform notifications.",
      "Support: Our support team is available to answer privacy-related questions.",
      "Complaints: You have the right to file complaints with relevant data protection authorities.",
      "Response Time: We aim to respond to all privacy requests within 30 days."
    ]
  }
];

export default function PrivacyPolicy() {
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

    sections.forEach((section) => {
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
        {sections.map((section, index) => (
          <motion.button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={`group relative p-3 rounded-xl transition-all duration-300 backdrop-blur-sm block ${
              activeSection === section.id
                ? 'bg-electric-cyan/20 border border-electric-cyan/50'
                : 'bg-space-gray-800/30 border border-space-gray-600/30 hover:bg-space-gray-700/50'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <section.icon className={`w-5 h-5 ${
              activeSection === section.id ? 'text-electric-cyan' : 'text-asteroid-silver group-hover:text-white'
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
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-electric-cyan to-blue-500 rounded-full mb-6"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Shield className="w-10 h-10 text-white" />
            </motion.div>
            
            <h1 className="text-5xl font-bold font-orbitron bg-gradient-to-r from-electric-cyan via-blue-400 to-electric-cyan bg-clip-text text-transparent mb-4">
              Privacy Policy
            </h1>
            
            <p className="text-xl text-asteroid-silver max-w-2xl mx-auto leading-relaxed">
              Your privacy is important to us. This policy explains how we collect, 
              use, and protect your personal information when you use VeeFore.
            </p>
            
            <motion.p
              className="text-sm text-space-gray-400 mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Last Updated: June 15, 2025
            </motion.p>
          </motion.div>

          {/* Privacy Summary */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="content-card holographic border-space-gray-600/50 bg-space-gray-800/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-xl font-orbitron">
                  <Shield className="h-6 w-6 text-electric-cyan" />
                  <span>Privacy at a Glance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-white mb-3">What We Collect</h4>
                    <ul className="space-y-2 text-sm text-asteroid-silver">
                      <li>• Account information and social media data</li>
                      <li>• Usage analytics and device information</li>
                      <li>• Communication data for support</li>
                      <li>• Essential cookies for functionality</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-3">How We Protect You</h4>
                    <ul className="space-y-2 text-sm text-asteroid-silver">
                      <li>• End-to-end encryption for all data</li>
                      <li>• Strict access controls and regular audits</li>
                      <li>• Data minimization principles</li>
                      <li>• Full transparency and user control</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Content Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
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
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-electric-cyan/20 to-blue-500/20 flex items-center justify-center">
                          <section.icon className="w-5 h-5 text-electric-cyan" />
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
            <Card className="content-card holographic border-electric-cyan/30 bg-gradient-to-r from-electric-cyan/10 to-blue-500/10 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-electric-cyan/20 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-electric-cyan" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-electric-cyan mb-4 font-orbitron">
                      Questions or Legal Concerns?
                    </h3>
                    <p className="text-asteroid-silver mb-6 leading-relaxed">
                      If you have questions about these terms or need to report a legal concern, our legal and 
                      support teams are here to help. We're committed to transparency and fair treatment of all users.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <Button className="bg-electric-cyan hover:bg-electric-cyan/80 text-space-gray-900 font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105">
                        <Phone className="w-4 h-4 mr-2" />
                        Contact Legal Team
                      </Button>
                      <Button variant="outline" className="border-electric-cyan/50 text-electric-cyan hover:bg-electric-cyan/10 px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105">
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