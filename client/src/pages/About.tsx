import { motion } from 'framer-motion';
import { Shield, Users, Target, Lightbulb, Globe, Award, Star, TrendingUp, Brain, Zap, Heart, Rocket, Building, Eye, ArrowLeft, Database, Settings, Clock, Mail, Phone, FileText, CheckCircle } from 'lucide-react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';

export default function About() {
  const [, setLocation] = useLocation();

  const tableOfContents = [
    { id: "introduction", title: "1. Introduction" },
    { id: "mission", title: "2. Our Mission" },
    { id: "vision", title: "3. Our Vision" },
    { id: "values", title: "4. Core Values" },
    { id: "technology", title: "5. Technology Stack" },
    { id: "team", title: "6. Our Team" },
    { id: "achievements", title: "7. Key Achievements" },
    { id: "future", title: "8. Future Plans" },
    { id: "company", title: "9. Company Information" },
    { id: "stats", title: "10. Platform Statistics" },
    { id: "partnerships", title: "11. Partnerships" },
    { id: "awards", title: "12. Awards & Recognition" },
    { id: "contact", title: "13. Contact Information" }
  ];

  const companyStats = [
    { number: "2025", label: "Founded", icon: <Building className="w-6 h-6" /> },
    { number: "15+", label: "AI Tools", icon: <Brain className="w-6 h-6" /> },
    { number: "99.9%", label: "Uptime", icon: <Zap className="w-6 h-6" /> },
    { number: "24/7", label: "AI Support", icon: <Heart className="w-6 h-6" /> }
  ];

  const coreValues = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-First Innovation",
      description: "We harness the power of artificial intelligence to transform how content creators engage with their audiences.",
      details: [
        "GPT-4o integration for intelligent content analysis",
        "DALL-E 3 powered visual content generation", 
        "Machine learning algorithms for trend prediction",
        "Advanced analytics with predictive insights"
      ]
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Privacy & Security",
      description: "Your data is sacred. We implement enterprise-grade security measures to protect every piece of information.",
      details: [
        "End-to-end encryption for all data transmission",
        "GDPR and CCPA compliance standards",
        "SOC 2 Type II security certifications",
        "Zero data sharing with third parties"
      ]
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Accessibility",
      description: "Breaking down barriers to social media success for creators worldwide, regardless of budget or technical expertise.",
      details: [
        "Multi-language support and localization",
        "Affordable pricing for emerging creators",
        "Educational resources and tutorials",
        "24/7 customer support across time zones"
      ]
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Results-Driven",
      description: "Every feature is designed to deliver measurable improvements in engagement, reach, and content performance.",
      details: [
        "Real-time performance tracking and analytics",
        "A/B testing capabilities for optimization",
        "ROI calculation and business intelligence",
        "Actionable insights and recommendations"
      ]
    }
  ];

  const technologyStack = [
    {
      category: "AI & Machine Learning",
      items: [
        "OpenAI GPT-4o for content analysis and generation",
        "DALL-E 3 for professional image and thumbnail creation",
        "TensorFlow for predictive analytics",
        "Custom neural networks for sentiment analysis",
        "Natural language processing for social listening"
      ]
    },
    {
      category: "Backend Infrastructure",
      items: [
        "Node.js and Express.js for scalable APIs",
        "MongoDB Atlas for reliable data storage",
        "Redis for high-performance caching",
        "WebSocket connections for real-time updates",
        "Automated backup and disaster recovery"
      ]
    },
    {
      category: "Frontend Experience",
      items: [
        "React with TypeScript for type-safe development",
        "Tailwind CSS for responsive design",
        "Framer Motion for smooth animations",
        "Progressive Web App capabilities",
        "Cross-platform mobile optimization"
      ]
    },
    {
      category: "Security & Compliance",
      items: [
        "Firebase Authentication for secure user management",
        "OAuth 2.0 integration with social platforms",
        "SSL/TLS encryption for data protection",
        "Regular security audits and penetration testing",
        "GDPR and CCPA compliance frameworks"
      ]
    }
  ];

  const teamMembers = [
    {
      role: "Engineering Team",
      description: "World-class developers building the future of social media management",
      skills: ["Full-stack development", "AI/ML integration", "Cloud architecture", "Security engineering"]
    },
    {
      role: "AI Research Team",
      description: "Cutting-edge researchers pushing the boundaries of artificial intelligence",
      skills: ["Machine learning", "Natural language processing", "Computer vision", "Predictive analytics"]
    },
    {
      role: "Product Team",
      description: "User-focused designers and product managers creating intuitive experiences",
      skills: ["User experience design", "Product strategy", "Market research", "User testing"]
    },
    {
      role: "Growth Team",
      description: "Marketing and business development experts driving platform adoption",
      skills: ["Digital marketing", "Partnership development", "Content strategy", "Community building"]
    }
  ];

  const achievements = [
    {
      title: "AI Innovation Leader",
      description: "First platform to integrate DALL-E 3 for professional thumbnail generation",
      metrics: "15+ AI-powered tools launched in 2025"
    },
    {
      title: "Multi-Platform Integration",
      description: "Seamless connectivity with Instagram, YouTube, Twitter, and LinkedIn",
      metrics: "99.9% API uptime and reliability"
    },
    {
      title: "Enterprise-Grade Security",
      description: "SOC 2 Type II certification and GDPR compliance",
      metrics: "Zero security breaches since launch"
    },
    {
      title: "Global Reach",
      description: "Supporting creators and businesses worldwide",
      metrics: "24/7 multilingual customer support"
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
              About Veefore
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Empowering creators and businesses with AI-powered social media management solutions from VEEFED TECHNOLOGIES PRIVATE LIMITED
            </p>
            <div className="mt-4 flex items-center justify-center gap-4 text-sm text-white/50">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Founded: 2025
              </span>
              <span className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                Headquarters: India
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
              href="#mission"
              className="flex flex-col items-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10 group"
            >
              <Target className="w-6 h-6 text-green-400 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm text-white/70 group-hover:text-white text-center">Mission</span>
            </a>
            
            <a
              href="#values"
              className="flex flex-col items-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10 group"
            >
              <Heart className="w-6 h-6 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm text-white/70 group-hover:text-white text-center">Values</span>
            </a>
            
            <a
              href="#technology"
              className="flex flex-col items-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10 group"
            >
              <Zap className="w-6 h-6 text-orange-400 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm text-white/70 group-hover:text-white text-center">Technology</span>
            </a>
            
            <a
              href="#team"
              className="flex flex-col items-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10 group"
            >
              <Users className="w-6 h-6 text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm text-white/70 group-hover:text-white text-center">Team</span>
            </a>
            
            <a
              href="#achievements"
              className="flex flex-col items-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10 group"
            >
              <Award className="w-6 h-6 text-red-400 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm text-white/70 group-hover:text-white text-center">Achievements</span>
            </a>
            
            <a
              href="#company"
              className="flex flex-col items-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10 group"
            >
              <Building className="w-6 h-6 text-yellow-400 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm text-white/70 group-hover:text-white text-center">Company</span>
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
                Veefore is a cutting-edge AI-powered social media management platform developed by 
                <strong className="text-white"> VEEFED TECHNOLOGIES PRIVATE LIMITED</strong>. Our mission is to democratize 
                access to professional-grade social media tools, empowering creators and businesses worldwide to achieve 
                unprecedented levels of engagement and growth.
              </p>
              
              <p className="text-white/80 leading-relaxed">
                Founded in 2025, Veefore combines the latest advances in artificial intelligence with intuitive design 
                to create a platform that's both powerful and accessible. We believe that every creator deserves the tools 
                to tell their story effectively and reach their audience authentically.
              </p>
              
              <div className="grid md:grid-cols-4 gap-4 mt-8">
                {companyStats.map((stat, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-6 border border-white/10 text-center">
                    <div className="flex justify-center mb-3 text-blue-400">
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{stat.number}</div>
                    <div className="text-sm text-white/60">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Mission */}
          <motion.section
            id="mission"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
          >
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-8 h-8 text-green-400" />
              <h2 className="text-3xl font-bold">2. Our Mission</h2>
            </div>
            
            <div className="space-y-6">
              <p className="text-white/80 leading-relaxed text-lg">
                To empower every content creator and business with AI-driven tools that simplify social media management 
                while maximizing reach, engagement, and authentic connection with audiences worldwide.
              </p>
              
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
                <h3 className="font-semibold text-green-400 mb-4">What We Stand For</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-white mb-2">Democratization</h4>
                    <p className="text-white/70 text-sm">Making professional social media tools accessible to creators of all sizes and budgets</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-2">Innovation</h4>
                    <p className="text-white/70 text-sm">Continuously pushing the boundaries of what's possible with AI and social media</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-2">Authenticity</h4>
                    <p className="text-white/70 text-sm">Helping creators maintain their unique voice while optimizing for maximum impact</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-2">Results</h4>
                    <p className="text-white/70 text-sm">Delivering measurable improvements in engagement, reach, and business outcomes</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Core Values */}
          <motion.section
            id="values"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
          >
            <div className="flex items-center gap-3 mb-6">
              <Heart className="w-8 h-8 text-purple-400" />
              <h2 className="text-3xl font-bold">4. Core Values</h2>
            </div>
            
            <div className="space-y-6">
              <p className="text-white/80 leading-relaxed">
                Our values guide every decision we make, from product development to customer support. 
                They reflect our commitment to creating a platform that truly serves our users' needs.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                {coreValues.map((value, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-purple-400">{value.icon}</div>
                      <h3 className="text-xl font-semibold text-purple-400">{value.title}</h3>
                    </div>
                    <p className="text-white/70 mb-4">{value.description}</p>
                    <ul className="space-y-2">
                      {value.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start gap-2 text-sm text-white/60">
                          <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Technology Stack */}
          <motion.section
            id="technology"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
          >
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-8 h-8 text-orange-400" />
              <h2 className="text-3xl font-bold">5. Technology Stack</h2>
            </div>
            
            <div className="space-y-6">
              <p className="text-white/80 leading-relaxed">
                Veefore is built on a foundation of cutting-edge technologies, ensuring scalability, reliability, 
                and performance that meets the demands of modern social media management.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                {technologyStack.map((tech, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <h3 className="font-semibold mb-3 text-orange-400">{tech.category}</h3>
                    <ul className="space-y-2 text-sm text-white/80">
                      {tech.items.map((item, itemIndex) => (
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

          {/* Team */}
          <motion.section
            id="team"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
          >
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-8 h-8 text-cyan-400" />
              <h2 className="text-3xl font-bold">6. Our Team</h2>
            </div>
            
            <div className="space-y-6">
              <p className="text-white/80 leading-relaxed">
                Our diverse team of experts brings together decades of experience in artificial intelligence, 
                social media, and user experience design to create a platform that truly understands your needs.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                {teamMembers.map((member, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <h3 className="font-semibold mb-2 text-cyan-400">{member.role}</h3>
                    <p className="text-white/70 text-sm mb-4">{member.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {member.skills.map((skill, skillIndex) => (
                        <span 
                          key={skillIndex} 
                          className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Achievements */}
          <motion.section
            id="achievements"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
          >
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-8 h-8 text-red-400" />
              <h2 className="text-3xl font-bold">7. Key Achievements</h2>
            </div>
            
            <div className="space-y-6">
              <p className="text-white/80 leading-relaxed">
                Since our launch in 2025, we've achieved significant milestones that demonstrate our commitment 
                to innovation and user satisfaction.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                {achievements.map((achievement, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <h3 className="font-semibold mb-2 text-red-400">{achievement.title}</h3>
                    <p className="text-white/70 text-sm mb-3">{achievement.description}</p>
                    <div className="bg-red-500/10 border border-red-500/20 rounded px-3 py-1">
                      <span className="text-red-400 text-xs font-medium">{achievement.metrics}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

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
              We'd love to hear from you! Whether you have questions about our platform, need support, or want to explore partnership opportunities, please reach out:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <Mail className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Email Support</h3>
                <p className="text-white/60 text-sm">support@veefore.com</p>
                <p className="text-white/60 text-sm">hello@veefore.com</p>
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
                onClick={() => setLocation('/terms-of-service')}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                Terms of Service
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
            This information is current as of July 2, 2025, and reflects our ongoing commitment to innovation and excellence.
          </p>
          <p className="text-sm text-white/40">
            © 2025 Veefore — A product of VEEFED TECHNOLOGIES PRIVATE LIMITED
          </p>
        </motion.div>
      </div>
    </div>
  );
}