import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, Shield, Eye, Database, Lock, Globe, Users, FileText, Mail, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Section {
  id: string;
  title: string;
  icon: any;
  content: string[];
}

const privacySections: Section[] = [
  {
    id: "information-collection",
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
    id: "data-usage",
    title: "How We Use Your Data",
    icon: Eye,
    content: [
      "Service Provision: We use your data to provide VeeFore's core features including content analytics, automation rules, and performance insights.",
      "Platform Improvement: Analytics help us understand user behavior and improve our AI algorithms and user experience.",
      "Communication: We use your contact information to send important updates, security notifications, and respond to support requests.",
      "Personalization: Your usage patterns help us customize the platform experience and provide relevant recommendations.",
      "Security: We monitor for suspicious activity and protect your account from unauthorized access."
    ]
  },
  {
    id: "data-sharing",
    title: "Data Sharing & Third Parties",
    icon: Users,
    content: [
      "Social Media Platforms: We share data with Instagram, YouTube, and TikTok only as necessary to provide our services through their official APIs.",
      "Service Providers: We work with trusted third-party providers for hosting, analytics, and payment processing who are bound by strict confidentiality agreements.",
      "Legal Requirements: We may disclose information if required by law, court order, or to protect our rights and users' safety.",
      "Business Transfers: In the event of a merger or acquisition, user data may be transferred as part of business assets.",
      "No Data Sales: We never sell your personal information to third parties for marketing or commercial purposes."
    ]
  },
  {
    id: "data-security",
    title: "Data Security & Protection",
    icon: Shield,
    content: [
      "Encryption: All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption standards.",
      "Access Controls: We implement strict access controls and authentication mechanisms to protect your data from unauthorized access.",
      "Regular Audits: Our security practices undergo regular audits and penetration testing to identify and address vulnerabilities.",
      "Data Minimization: We only collect and retain data that is necessary for providing our services.",
      "Incident Response: We have comprehensive incident response procedures in place to handle any potential security breaches."
    ]
  },
  {
    id: "user-rights",
    title: "Your Rights & Controls",
    icon: Lock,
    content: [
      "Data Access: You can request a copy of all personal data we have about you at any time.",
      "Data Correction: You can update or correct your personal information through your account settings.",
      "Data Deletion: You can request deletion of your account and associated data, subject to legal retention requirements.",
      "Data Portability: You can export your data in a machine-readable format.",
      "Opt-Out Options: You can control marketing communications and certain data processing activities through your preferences."
    ]
  },
  {
    id: "cookies",
    title: "Cookies & Tracking",
    icon: Globe,
    content: [
      "Essential Cookies: We use necessary cookies for authentication, security, and core platform functionality.",
      "Analytics Cookies: We use cookies to understand how users interact with our platform and improve the user experience.",
      "Third-Party Cookies: Some features may use third-party cookies from social media platforms and analytics providers.",
      "Cookie Controls: You can manage cookie preferences through your browser settings or our cookie consent banner.",
      "Do Not Track: We respect Do Not Track signals and provide options to limit tracking."
    ]
  },
  {
    id: "retention",
    title: "Data Retention",
    icon: Calendar,
    content: [
      "Account Data: We retain your account information as long as your account is active.",
      "Analytics Data: Historical analytics data is retained for up to 2 years to provide trend analysis and insights.",
      "Communication Records: Support communications are retained for 3 years for quality assurance and legal compliance.",
      "Deleted Accounts: When you delete your account, most data is removed within 30 days, except for legal retention requirements.",
      "Backup Systems: Data in backup systems may be retained for up to 90 days for disaster recovery purposes."
    ]
  },
  {
    id: "updates",
    title: "Policy Updates",
    icon: FileText,
    content: [
      "Notification Process: We will notify you of any material changes to this privacy policy via email and platform notifications.",
      "Review Period: You will have 30 days to review changes before they take effect.",
      "Continued Use: Continued use of VeeFore after the effective date constitutes acceptance of the updated policy.",
      "Version History: Previous versions of this policy are available upon request.",
      "Contact Information: You can always contact us with questions about policy changes or your data rights."
    ]
  }
];

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState<string>("");
  const [expandedSection, setExpandedSection] = useState<string>("");
  const { scrollYProgress } = useScroll();
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.6]);

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

    privacySections.forEach((section) => {
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
    <div className="min-h-screen bg-cosmic-void text-white relative overflow-hidden">
      {/* Animated Background */}
      <motion.div 
        className="fixed inset-0 z-0"
        style={{ y: backgroundY, opacity }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-cosmic-void via-space-gray-800 to-cosmic-void" />
        <div className="stars absolute inset-0">
          {[...Array(100)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Navigation Sidebar */}
      <motion.div 
        className="fixed left-6 top-1/2 transform -translate-y-1/2 z-20 hidden lg:block"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <nav className="space-y-3">
          {privacySections.map((section, index) => (
            <motion.button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === section.id
                  ? "bg-nebula-purple/30 border border-nebula-purple/50 text-nebula-purple"
                  : "bg-space-gray-800/50 border border-transparent text-asteroid-silver hover:text-white hover:bg-space-gray-700/50"
              }`}
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 + index * 0.1 }}
            >
              <section.icon className="h-4 w-4" />
              <span className="text-sm font-medium hidden xl:block">{section.title}</span>
            </motion.button>
          ))}
        </nav>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 lg:ml-72">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-nebula-purple to-solar-gold mb-6"
            whileHover={{ scale: 1.1, rotate: 5 }}
            animate={{ 
              boxShadow: [
                "0 0 20px rgba(139, 92, 246, 0.3)",
                "0 0 40px rgba(139, 92, 246, 0.5)",
                "0 0 20px rgba(139, 92, 246, 0.3)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Shield className="h-10 w-10 text-white" />
          </motion.div>
          
          <motion.h1 
            className="text-5xl font-bold bg-gradient-to-r from-nebula-purple via-solar-gold to-cosmic-cyan bg-clip-text text-transparent mb-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Privacy Policy
          </motion.h1>
          
          <motion.p 
            className="text-xl text-asteroid-silver max-w-2xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Your privacy and data security are fundamental to everything we do at VeeFore. 
            This policy explains how we collect, use, and protect your information.
          </motion.p>
          
          <motion.div 
            className="mt-6 text-sm text-asteroid-silver"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </motion.div>
        </motion.div>

        {/* Sections */}
        <div className="space-y-8">
          {privacySections.map((section, index) => (
            <motion.div
              key={section.id}
              id={section.id}
              initial={{ y: 100, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
            >
              <Card className="content-card holographic border-space-gray-600/50 bg-space-gray-900/50 backdrop-blur-sm">
                <CardHeader 
                  className="cursor-pointer"
                  onClick={() => setExpandedSection(expandedSection === section.id ? "" : section.id)}
                >
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <motion.div
                        className="w-12 h-12 rounded-lg bg-gradient-to-r from-nebula-purple to-solar-gold flex items-center justify-center"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        animate={activeSection === section.id ? { 
                          boxShadow: [
                            "0 0 20px rgba(139, 92, 246, 0.3)",
                            "0 0 40px rgba(139, 92, 246, 0.5)",
                            "0 0 20px rgba(139, 92, 246, 0.3)"
                          ]
                        } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <section.icon className="h-6 w-6 text-white" />
                      </motion.div>
                      <span className="text-xl font-semibold text-white">{section.title}</span>
                    </div>
                    <motion.div
                      animate={{ rotate: expandedSection === section.id ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="h-6 w-6 text-asteroid-silver" />
                    </motion.div>
                  </CardTitle>
                </CardHeader>
                
                <motion.div
                  initial={false}
                  animate={{ 
                    height: expandedSection === section.id ? "auto" : 0,
                    opacity: expandedSection === section.id ? 1 : 0 
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      {section.content.map((paragraph, pIndex) => (
                        <motion.p
                          key={pIndex}
                          className="text-asteroid-silver leading-relaxed"
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: pIndex * 0.1 }}
                        >
                          <strong className="text-white">{paragraph.split(':')[0]}:</strong>
                          {paragraph.includes(':') ? paragraph.split(':').slice(1).join(':') : paragraph}
                        </motion.p>
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
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Card className="content-card holographic border-cosmic-cyan/50 bg-gradient-to-r from-cosmic-cyan/10 to-nebula-purple/10">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3 text-cosmic-cyan">
                <Mail className="h-6 w-6" />
                <span>Questions About Your Privacy?</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-asteroid-silver mb-6">
                If you have any questions about this Privacy Policy or how we handle your data, 
                please don't hesitate to contact our privacy team. We're here to help ensure 
                your data is protected and your privacy rights are respected.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  className="bg-gradient-to-r from-cosmic-cyan to-nebula-purple hover:from-cosmic-cyan/80 hover:to-nebula-purple/80 text-white"
                  onClick={() => window.location.href = 'mailto:privacy@veefore.com'}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Privacy Team
                </Button>
                <Button 
                  variant="outline" 
                  className="border-cosmic-cyan/50 text-cosmic-cyan hover:bg-cosmic-cyan/10"
                  onClick={() => window.location.href = '/settings'}
                >
                  Manage Data Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}