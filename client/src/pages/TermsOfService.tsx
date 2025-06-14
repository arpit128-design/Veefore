import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, Scale, User, CreditCard, Zap, AlertTriangle, Ban, Gavel, Phone, Clock } from "lucide-react";
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
    id: "platform-usage",
    title: "Platform Usage & Features",
    icon: Zap,
    content: [
      "Service Availability: We strive for 99.9% uptime but cannot guarantee uninterrupted service availability.",
      "Feature Access: Different subscription tiers provide access to different features and usage limits.",
      "API Integrations: Our platform integrates with third-party social media APIs subject to their terms and limitations.",
      "Data Processing: We process your social media data to provide analytics, automation, and insights services.",
      "Usage Limits: Each subscription tier has specific limits on features, API calls, and data processing."
    ]
  },
  {
    id: "prohibited-activities",
    title: "Prohibited Activities",
    icon: Ban,
    content: [
      "Spam & Abuse: Do not use VeeFore to send spam, engage in harassment, or abuse other users or platforms.",
      "Unauthorized Access: Do not attempt to access accounts, data, or systems that don't belong to you.",
      "Reverse Engineering: Do not reverse engineer, decompile, or attempt to extract source code from our platform.",
      "Malicious Activity: Do not use our services for any illegal, harmful, or malicious purposes.",
      "Violation of Third-Party Terms: Do not use VeeFore in ways that violate Instagram, YouTube, or TikTok terms of service."
    ]
  },
  {
    id: "content-intellectual-property",
    title: "Content & Intellectual Property",
    icon: Gavel,
    content: [
      "Your Content: You retain ownership of content you create, but grant us license to process it for service provision.",
      "Our IP: VeeFore's technology, algorithms, and platform features are our intellectual property.",
      "Trademark Usage: You may not use VeeFore's trademarks, logos, or brand elements without permission.",
      "Copyright Respect: You must respect copyright laws and not upload or share infringing content.",
      "DMCA Compliance: We respond to valid DMCA takedown notices and may terminate accounts of repeat infringers."
    ]
  },
  {
    id: "limitation-liability",
    title: "Limitation of Liability",
    icon: AlertTriangle,
    content: [
      "Service Limitations: VeeFore is provided 'as is' without warranties of any kind, express or implied.",
      "Damage Limitation: Our liability is limited to the amount you paid for services in the 12 months preceding any claim.",
      "Indirect Damages: We are not liable for indirect, incidental, special, or consequential damages.",
      "Third-Party Actions: We are not responsible for actions taken by third-party platforms based on our service use.",
      "Data Loss: While we implement safeguards, we cannot guarantee against all forms of data loss or service interruption."
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
  },
  {
    id: "dispute-resolution",
    title: "Dispute Resolution",
    icon: Phone,
    content: [
      "Contact First: For any disputes, please contact our support team first to attempt resolution.",
      "Arbitration: Disputes that cannot be resolved through support will be subject to binding arbitration.",
      "Class Action Waiver: You waive the right to participate in class action lawsuits against VeeFore.",
      "Jurisdiction: Any legal proceedings must be brought in the courts of our operating jurisdiction.",
      "Time Limits: Claims must be brought within one year of the dispute arising or be forever barred."
    ]
  }
];

export default function TermsOfService() {
  const [activeSection, setActiveSection] = useState<string>("");
  const [expandedSection, setExpandedSection] = useState<string>("");
  const { scrollYProgress } = useScroll();
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.9, 0.7]);

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
    <div className="min-h-screen bg-cosmic-void text-white relative overflow-hidden">
      {/* Animated Background with Cosmic Elements */}
      <motion.div 
        className="fixed inset-0 z-0"
        style={{ y: backgroundY, opacity }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-cosmic-void via-space-gray-900 to-cosmic-void" />
        
        {/* Floating Geometric Shapes */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute border border-solar-gold/20 rounded-lg"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${20 + Math.random() * 40}px`,
                height: `${20 + Math.random() * 40}px`,
              }}
              animate={{
                rotate: [0, 360],
                opacity: [0.1, 0.3, 0.1],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 10 + Math.random() * 20,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>

        {/* Nebula Effect */}
        <div className="stars absolute inset-0">
          {[...Array(80)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-nebula-purple to-cosmic-cyan rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [0.5, 1.5, 0.5],
              }}
              transition={{
                duration: 3 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 3,
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
          {termsSections.map((section, index) => (
            <motion.button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === section.id
                  ? "bg-solar-gold/30 border border-solar-gold/50 text-solar-gold"
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
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-solar-gold to-cosmic-cyan mb-6"
            whileHover={{ scale: 1.1, rotate: -5 }}
            animate={{ 
              boxShadow: [
                "0 0 20px rgba(251, 191, 36, 0.3)",
                "0 0 40px rgba(251, 191, 36, 0.5)",
                "0 0 20px rgba(251, 191, 36, 0.3)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Scale className="h-10 w-10 text-white" />
          </motion.div>
          
          <motion.h1 
            className="text-5xl font-bold bg-gradient-to-r from-solar-gold via-cosmic-cyan to-nebula-purple bg-clip-text text-transparent mb-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Terms of Service
          </motion.h1>
          
          <motion.p 
            className="text-xl text-asteroid-silver max-w-2xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            These terms govern your use of VeeFore and outline the rights and responsibilities 
            of both you and VeeFore in our service relationship.
          </motion.p>
          
          <motion.div 
            className="mt-6 text-sm text-asteroid-silver"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Effective Date: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </motion.div>
        </motion.div>

        {/* Quick Summary Card */}
        <motion.div
          className="mb-12"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <Card className="content-card holographic border-cosmic-cyan/50 bg-gradient-to-r from-cosmic-cyan/5 to-nebula-purple/5">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3 text-cosmic-cyan">
                <Zap className="h-6 w-6" />
                <span>Terms Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-white mb-2">Your Rights</h4>
                  <ul className="text-asteroid-silver text-sm space-y-1">
                    <li>• Use VeeFore for business and personal social media management</li>
                    <li>• Access features according to your subscription tier</li>
                    <li>• Request data export and account deletion</li>
                    <li>• Cancel subscription at any time</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Your Responsibilities</h4>
                  <ul className="text-asteroid-silver text-sm space-y-1">
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

        {/* Sections */}
        <div className="space-y-8">
          {termsSections.map((section, index) => (
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
                        className="w-12 h-12 rounded-lg bg-gradient-to-r from-solar-gold to-cosmic-cyan flex items-center justify-center"
                        whileHover={{ scale: 1.1, rotate: -5 }}
                        animate={activeSection === section.id ? { 
                          boxShadow: [
                            "0 0 20px rgba(251, 191, 36, 0.3)",
                            "0 0 40px rgba(251, 191, 36, 0.5)",
                            "0 0 20px rgba(251, 191, 36, 0.3)"
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

        {/* Contact and Support Section */}
        <motion.div
          className="mt-16"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Card className="content-card holographic border-solar-gold/50 bg-gradient-to-r from-solar-gold/10 to-cosmic-cyan/10">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3 text-solar-gold">
                <Phone className="h-6 w-6" />
                <span>Questions or Legal Concerns?</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-asteroid-silver mb-6">
                If you have questions about these terms or need to report a legal concern, 
                our legal and support teams are here to help. We're committed to transparency 
                and fair treatment of all users.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  className="bg-gradient-to-r from-solar-gold to-cosmic-cyan hover:from-solar-gold/80 hover:to-cosmic-cyan/80 text-white"
                  onClick={() => window.location.href = 'mailto:legal@veefore.com'}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Contact Legal Team
                </Button>
                <Button 
                  variant="outline" 
                  className="border-solar-gold/50 text-solar-gold hover:bg-solar-gold/10"
                  onClick={() => window.location.href = 'mailto:support@veefore.com'}
                >
                  General Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}