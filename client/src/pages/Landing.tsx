import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  ArrowRight, 
  Calendar, 
  BarChart3, 
  MessageSquare, 
  Users, 
  Zap, 
  Shield, 
  Globe, 
  TrendingUp,
  Clock,
  Target,
  Sparkles,
  Rocket,
  Star,
  CheckCircle,
  ChevronRight,
  Play,
  Instagram,
  Youtube,
  Twitter,
  Linkedin,
  Facebook
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: "easeOut" }
};

// Animated Section Component
interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

function AnimatedSection({ children, className = "", id }: AnimatedSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section
      ref={ref}
      id={id}
      initial="initial"
      animate={isInView ? "animate" : "initial"}
      variants={fadeInUp}
      className={className}
    >
      {children}
    </motion.section>
  );
}

// Hero Section
function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center opacity-10"></div>
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"
          animate={{ 
            background: [
              "linear-gradient(to right, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2))",
              "linear-gradient(to right, rgba(147, 51, 234, 0.2), rgba(59, 130, 246, 0.2))",
              "linear-gradient(to right, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2))"
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -100, -20],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="inline-flex items-center space-x-2 bg-blue-600/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-5 h-5 text-blue-400" />
            <span className="text-blue-300 font-medium">Powered by Advanced AI Technology</span>
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 space-theme-text">
            The Future of
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent block">
              Social Media AI
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            VeeFore revolutionizes content creation with intelligent automation, advanced analytics, 
            and seamless multi-platform management. Join the next generation of social media excellence.
          </p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={scaleIn}>
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg rounded-full shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 group">
                  Start Your Free Journey
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
            
            <motion.div variants={scaleIn}>
              <Button variant="outline" className="border-blue-400/50 text-blue-300 hover:bg-blue-600/20 px-8 py-4 text-lg rounded-full backdrop-blur-sm group">
                <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </motion.div>
          </motion.div>

          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <p className="text-gray-400 mb-4">Trusted by 50,000+ creators worldwide</p>
            <div className="flex justify-center space-x-8 opacity-60 mb-8">
              <Instagram className="w-8 h-8" />
              <Youtube className="w-8 h-8" />
              <Twitter className="w-8 h-8" />
              <Linkedin className="w-8 h-8" />
              <Facebook className="w-8 h-8" />
            </div>
            
            {/* Scroll Indicator */}
            <motion.div
              className="flex flex-col items-center cursor-pointer"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              onClick={() => {
                const nextSection = document.querySelector('#stats-section');
                nextSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <p className="text-gray-400 text-sm mb-2">Scroll to explore</p>
              <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
                <motion.div
                  className="w-1 h-2 bg-gray-400 rounded-full mt-2"
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// Stats Section
function StatsSection() {
  const stats = [
    { number: "500%", label: "Average engagement increase using VeeFore AI automation", company: "Content Creators Network" },
    { number: "10M+", label: "Posts created and optimized through our AI-powered platform", company: "Global Analytics" },
    { number: "90%", label: "Time saved on content creation and social media management", company: "Digital Marketing Institute" }
  ];

  return (
    <AnimatedSection id="stats-section" className="py-24 bg-gradient-to-r from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          variants={fadeInUp}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            What can VeeFore do for you?
          </h2>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={staggerContainer}
        >
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-600/10 to-purple-600/10 backdrop-blur-sm border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300"
              variants={scaleIn}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                {stat.number}
              </div>
              <p className="text-gray-300 text-lg mb-4">{stat.label}</p>
              <div className="text-sm text-gray-500 italic">{stat.company}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </AnimatedSection>
  );
}

// Features Section
function FeaturesSection() {
  const features = [
    {
      title: "AI-Powered Content Creation",
      description: "Generate high-quality posts, captions, and hashtags with our advanced AI that understands your brand voice and audience preferences.",
      icon: <Sparkles className="w-8 h-8" />,
      points: [
        "Smart caption generation with brand voice matching",
        "Trending hashtag recommendations",
        "AI image and video creation",
        "Content optimization for each platform",
        "Real-time trend analysis integration"
      ],
      image: "/api/placeholder/600/400"
    },
    {
      title: "Intelligent Scheduling & Automation",
      description: "Schedule posts across all platforms with AI-optimized timing, automated responses, and smart content distribution.",
      icon: <Calendar className="w-8 h-8" />,
      points: [
        "AI-optimized posting times for maximum reach",
        "Cross-platform content adaptation",
        "Automated response generation",
        "Bulk scheduling with smart queuing",
        "Time zone optimization for global audiences"
      ],
      image: "/api/placeholder/600/400"
    },
    {
      title: "Advanced Analytics & Insights",
      description: "Track performance across all platforms with comprehensive analytics, competitor analysis, and predictive insights.",
      icon: <BarChart3 className="w-8 h-8" />,
      points: [
        "Real-time performance tracking",
        "Competitor benchmark analysis",
        "Predictive engagement forecasting",
        "ROI calculation and reporting",
        "Custom dashboard creation"
      ],
      image: "/api/placeholder/600/400"
    },
    {
      title: "Unified Social Media Management",
      description: "Manage all your social accounts from one powerful dashboard with AI-assisted community management and engagement tools.",
      icon: <MessageSquare className="w-8 h-8" />,
      points: [
        "Unified inbox for all platforms",
        "AI-powered comment moderation",
        "Smart DM automation and routing",
        "Team collaboration tools",
        "Crisis management alerts"
      ],
      image: "/api/placeholder/600/400"
    }
  ];

  return (
    <AnimatedSection className="py-24 bg-gradient-to-br from-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          variants={fadeInUp}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Explore VeeFore features: What's in the mission control?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Create, schedule, analyze, and optimize social media content. All powered by advanced AI in one user-friendly command center.
          </p>
        </motion.div>

        <div className="space-y-24">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}
              variants={fadeInUp}
              whileInView="animate"
              initial="initial"
              viewport={{ once: true }}
            >
              <div className="flex-1 space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white">
                    {feature.icon}
                  </div>
                  <h3 className="text-3xl font-bold text-white">{feature.title}</h3>
                </div>
                
                <p className="text-lg text-gray-300 leading-relaxed">
                  {feature.description}
                </p>

                <ul className="space-y-3">
                  {feature.points.map((point, pointIndex) => (
                    <li key={pointIndex} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{point}</span>
                    </li>
                  ))}
                </ul>

                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full px-6 py-3 group">
                  Learn more
                  <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

              <div className="flex-1">
                <motion.div 
                  className="relative rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/20"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent"></div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

// Benefits Section
function BenefitsSection() {
  const benefits = [
    {
      title: "Save hours creating, posting, and analyzing content",
      description: "Schedule posts to go live anytime — even if you're fast asleep or on the beach. Plus, create content quickly with AI templates and have AI write your captions and hashtags for you. Then get the full picture with straightforward performance reports.",
      icon: <Clock className="w-12 h-12 text-blue-400" />,
      cta: "Learn more"
    },
    {
      title: "Boost engagement, reach, and follower count with less effort",
      description: "See the content that brings in the most engagement and revenue and measure how you're performing against your competitors. Plus, get personalized suggestions for how to win in your industry.",
      icon: <TrendingUp className="w-12 h-12 text-purple-400" />,
      cta: "Try it for free"
    },
    {
      title: "Deliver superior customer experience and keep your inbox organized",
      description: "Reduce the clutter and eliminate DM overwhelm with a unified social media inbox. Reply to comments and messages across platforms in one convenient hub and never leave your followers waiting with our AI chatbot add-on.",
      icon: <Target className="w-12 h-12 text-green-400" />,
      cta: "Learn more"
    },
    {
      title: "Safeguard your reputation and never miss a chance to engage",
      description: "Keep an eye on what people are saying about your brand or industry with social listening tools. Track mentions and conversations to find opportunities to engage, discover new trends, or get ahead of feedback.",
      icon: <Shield className="w-12 h-12 text-red-400" />,
      cta: "Learn more"
    }
  ];

  return (
    <AnimatedSection className="py-24 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          variants={fadeInUp}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Save time, simplify, and grow faster on social media
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            VeeFore is designed to help you manage social media faster, smarter, and with way less effort.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-16"
          variants={staggerContainer}
        >
          {benefits.map((benefit, index) => (
            <motion.div 
              key={index}
              className="space-y-6"
              variants={fadeInUp}
            >
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  {benefit.icon}
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-white leading-tight">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {benefit.description}
                  </p>
                  <Button variant="outline" className="border-blue-400/50 text-blue-300 hover:bg-blue-600/20 rounded-full group">
                    {benefit.cta}
                    <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </AnimatedSection>
  );
}

// Why VeeFore Section
function WhyVeeforeSection() {
  const reasons = [
    {
      title: "5 years and 50,000+ users",
      description: "VeeFore was built by AI pioneers, and we're still the most advanced AI-powered social media platform. Over 50,000+ creators and businesses have used VeeFore to create, optimize, and out-perform their competitors on social media.",
      icon: <Users className="w-12 h-12 text-blue-400" />,
      cta: "More about us"
    },
    {
      title: "The ultimate social media AI",
      description: "VeeFore helps you automate every part of social media management — posting, writing, messaging, and social listening. Our AI was designed by social pros for social pros.",
      icon: <Sparkles className="w-12 h-12 text-purple-400" />,
      cta: "Learn more"
    },
    {
      title: "The largest library of integrations",
      description: "Connect over 150+ integrations to bring all your favorite tools into the VeeFore dashboard. That's more than any other social media management platform (by far).",
      icon: <Globe className="w-12 h-12 text-green-400" />,
      cta: "Explore integrations"
    }
  ];

  return (
    <AnimatedSection className="py-24 bg-gradient-to-r from-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          variants={fadeInUp}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Why VeeFore?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Don't worry, we won't make you read our 5,000+ five-star reviews. A few highlights: superior AI technology, 
            top-notch security features, and the best educational resources in the industry.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={staggerContainer}
        >
          {reasons.map((reason, index) => (
            <motion.div 
              key={index}
              className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-600/10 to-purple-600/10 backdrop-blur-sm border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 group"
              variants={scaleIn}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="flex justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {reason.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {reason.title}
              </h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                {reason.description}
              </p>
              <Button variant="outline" className="border-blue-400/50 text-blue-300 hover:bg-blue-600/20 rounded-full group">
                {reason.cta}
                <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </AnimatedSection>
  );
}

// Testimonial Section
function TestimonialSection() {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Digital Marketing Director",
      company: "TechFlow Inc",
      rating: 5,
      text: "VeeFore makes my life 10x easier! I work with multiple clients and platforms, and I love that VeeFore allows me to manage everything in one place while the AI handles content creation. The option to customize my captions for each platform is incredible.",
      avatar: "/api/placeholder/80/80"
    },
    {
      name: "Marcus Rodriguez",
      role: "Content Creator",
      company: "Creator Network",
      rating: 5,
      text: "The AI content generation is absolutely mind-blowing. VeeFore understands my brand voice better than most humans! It's saved me 20+ hours per week while actually improving my engagement rates.",
      avatar: "/api/placeholder/80/80"
    },
    {
      name: "Emily Watson",
      role: "Social Media Manager",
      company: "Global Brands Co",
      rating: 5,
      text: "Managing 15+ social accounts used to be overwhelming. VeeFore's unified dashboard and AI automation have transformed how we work. Our team productivity has increased by 300%.",
      avatar: "/api/placeholder/80/80"
    }
  ];

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatedSection className="py-24 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          variants={fadeInUp}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Take it from real users: VeeFore is a must-have
          </h2>
        </motion.div>

        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex-1 text-center">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-8"
            >
              <div className="flex justify-center mb-4">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <p className="text-lg text-gray-300 mb-6 italic leading-relaxed">
                "{testimonials[currentTestimonial].text}"
              </p>
              
              <div className="flex items-center justify-center space-x-4">
                <img 
                  src={testimonials[currentTestimonial].avatar} 
                  alt={testimonials[currentTestimonial].name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-white font-semibold">{testimonials[currentTestimonial].name}</h4>
                  <p className="text-gray-400">{testimonials[currentTestimonial].role}</p>
                  <p className="text-gray-500 text-sm">{testimonials[currentTestimonial].company}</p>
                </div>
              </div>
            </motion.div>

            <div className="flex justify-center space-x-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-blue-400' : 'bg-gray-600'
                  }`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>

          <div className="ml-16 text-left">
            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <Users className="w-8 h-8 text-blue-400" />
                <span className="text-gray-300 text-lg">Our customers love us</span>
              </div>
              <p className="text-gray-400">
                See what real users have to say about VeeFore.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

// CTA Section
function CTASection() {
  return (
    <AnimatedSection className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          variants={fadeInUp}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to transform your social media presence?
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
            Join thousands of creators and businesses who have revolutionized their social media strategy with VeeFore's AI-powered platform.
          </p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            variants={staggerContainer}
          >
            <motion.div variants={scaleIn}>
              <Link href="/signup">
                <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-full shadow-2xl hover:shadow-white/20 transition-all duration-300 group">
                  Start Your Free Trial
                  <Rocket className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
            
            <motion.div variants={scaleIn}>
              <Button variant="outline" className="border-white/50 text-white hover:bg-white/10 px-8 py-4 text-lg rounded-full backdrop-blur-sm group">
                Schedule Demo
                <Calendar className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
              </Button>
            </motion.div>
          </motion.div>

          <p className="mt-8 text-blue-200 text-sm">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}

// Main Landing Page Component
export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <BenefitsSection />
      <WhyVeeforeSection />
      <TestimonialSection />
      <CTASection />
    </div>
  );
}