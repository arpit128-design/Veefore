import { motion } from 'framer-motion';
import { Users, Target, Lightbulb, Globe, Shield, Award, Star, TrendingUp, Brain, Zap, Heart, Rocket, Building, Eye, ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';

export default function About() {
  const [, setLocation] = useLocation();

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
      description: "Every feature we build is designed to deliver measurable improvements in engagement and growth.",
      details: [
        "ROI tracking and performance analytics",
        "A/B testing capabilities for optimization",
        "Engagement rate improvement guarantees",
        "Data-driven strategic recommendations"
      ]
    }
  ];

  const milestones = [
    {
      year: "Early 2025",
      quarter: "Q1",
      event: "VEEFED TECHNOLOGIES PRIVATE LIMITED founded",
      description: "Company incorporated with vision to democratize AI-powered social media management",
      achievement: "Legal entity established, initial team assembled"
    },
    {
      year: "Mid 2025", 
      quarter: "Q2",
      event: "Veefore Platform Development",
      description: "Core platform architecture built with MongoDB Atlas, Node.js, and React",
      achievement: "Complete social media management infrastructure"
    },
    {
      year: "Q3 2025",
      quarter: "Q3", 
      event: "AI Integration Breakthrough",
      description: "Successfully integrated OpenAI GPT-4o and DALL-E 3 for intelligent content generation",
      achievement: "15+ production-grade AI tools launched"
    },
    {
      year: "Q4 2025",
      quarter: "Q4",
      event: "Production Launch",
      description: "Public beta launch with Instagram Business API integration and real-time analytics",
      achievement: "Meta compliance achieved, platform stability confirmed"
    }
  ];

  const techStack = [
    {
      category: "Frontend",
      technologies: ["React with TypeScript", "Tailwind CSS", "Framer Motion", "Vite Build System"],
      icon: <Eye className="w-6 h-6" />
    },
    {
      category: "Backend", 
      technologies: ["Node.js with Express", "MongoDB Atlas", "Firebase Auth", "RESTful APIs"],
      icon: <Building className="w-6 h-6" />
    },
    {
      category: "AI & ML",
      technologies: ["OpenAI GPT-4o", "DALL-E 3", "TensorFlow.js", "Custom ML Models"],
      icon: <Brain className="w-6 h-6" />
    },
    {
      category: "Integrations",
      technologies: ["Instagram Business API", "YouTube Analytics", "SendGrid Email", "Stripe Payments"],
      icon: <Globe className="w-6 h-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900/95 via-purple-900/90 to-slate-900/95 text-white">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
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
                <Rocket className="w-10 h-10 text-blue-400" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                About Veefore
              </h1>
            </div>
            
            <p className="text-white/70 text-xl max-w-4xl mx-auto leading-relaxed">
              We're <span className="text-purple-300 font-semibold">VEEFED TECHNOLOGIES PRIVATE LIMITED</span>, 
              pioneering the future of social media management through cutting-edge AI technology that 
              empowers creators, businesses, and influencers to achieve unprecedented online success.
            </p>
          </div>
        </motion.div>

        {/* Company Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {companyStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center"
              >
                <div className="flex justify-center mb-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mb-1">{stat.number}</div>
                <div className="text-white/60 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Mission & Vision */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <Target className="w-6 h-6 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold">Our Mission</h2>
              </div>
              <p className="text-white/80 leading-relaxed">
                To democratize social media success by providing creators and businesses with 
                enterprise-grade AI tools that were previously only available to large corporations. 
                We believe every voice deserves to be heard and every brand deserves to thrive 
                in the digital landscape.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Eye className="w-6 h-6 text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold">Our Vision</h2>
              </div>
              <p className="text-white/80 leading-relaxed">
                To become the global leader in AI-powered social media intelligence, where every 
                content creator has access to predictive analytics, automated optimization, and 
                intelligent insights that transform their digital presence into a thriving business.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Core Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {coreValues.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{value.title}</h3>
                </div>
                
                <p className="text-white/70 mb-6">{value.description}</p>
                
                <ul className="space-y-2">
                  {value.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-start gap-2">
                      <Star className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span className="text-white/60 text-sm">{detail}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Company Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12">Our Journey</h2>
          
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 via-purple-400 to-blue-400"></div>
            
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="relative flex items-start"
                >
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-sm mr-6">
                    {milestone.quarter}
                  </div>
                  
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-white">{milestone.event}</h3>
                      <span className="text-blue-400 font-medium">{milestone.year}</span>
                    </div>
                    <p className="text-white/70 mb-3">{milestone.description}</p>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full">
                      <Award className="w-4 h-4 text-green-400" />
                      <span className="text-green-300 text-sm">{milestone.achievement}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Technology Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12">Technology Stack</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {techStack.map((stack, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20">
                    {stack.icon}
                  </div>
                  <h3 className="text-lg font-semibold">{stack.category}</h3>
                </div>
                
                <ul className="space-y-2">
                  {stack.technologies.map((tech, techIndex) => (
                    <li key={techIndex} className="text-white/60 text-sm flex items-center gap-2">
                      <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                      {tech}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl p-8 border border-purple-300/20 text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Rocket className="w-8 h-8 text-blue-400" />
            <h2 className="text-3xl font-bold">Ready to Transform Your Social Media?</h2>
          </div>
          
          <p className="text-white/70 text-lg max-w-3xl mx-auto mb-8">
            Join the AI revolution in social media management. Experience the power of 
            enterprise-grade tools designed for creators, businesses, and influencers who 
            refuse to settle for ordinary results.
          </p>
          
          <div className="space-y-4 text-sm text-white/60">
            <p className="font-semibold text-white">VEEFED TECHNOLOGIES PRIVATE LIMITED</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <span>Email: contact@veefore.com</span>
              <span className="hidden sm:block">•</span>
              <span>Support: support@veefore.com</span>
              <span className="hidden sm:block">•</span>
              <span>Business: business@veefore.com</span>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
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