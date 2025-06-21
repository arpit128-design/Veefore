import { motion } from 'framer-motion';
import { 
  Mail, 
  MessageSquare, 
  Phone,
  MapPin,
  ArrowRight,
  Zap,
  Clock,
  Users,
  HeadphonesIcon,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'wouter';

const contactMethods = [
  {
    icon: <Mail className="h-8 w-8" />,
    title: "Email Support",
    description: "Get help with your account, billing, or technical issues.",
    contact: "support@veefore.com",
    responseTime: "Within 24 hours"
  },
  {
    icon: <MessageSquare className="h-8 w-8" />,
    title: "Live Chat",
    description: "Chat with our support team in real-time during business hours.",
    contact: "Available 9 AM - 6 PM PST",
    responseTime: "Usually under 5 minutes"
  },
  {
    icon: <Phone className="h-8 w-8" />,
    title: "Phone Support",
    description: "Speak directly with our team for urgent issues or enterprise sales.",
    contact: "+1 (555) 123-4567",
    responseTime: "Business hours only"
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "Enterprise Sales",
    description: "Custom solutions for large teams and enterprise customers.",
    contact: "sales@veefore.com",
    responseTime: "Within 4 hours"
  }
];

const offices = [
  {
    city: "San Francisco",
    address: "123 Tech Street, Suite 400\nSan Francisco, CA 94105",
    type: "Headquarters"
  },
  {
    city: "New York",
    address: "456 Innovation Ave, Floor 15\nNew York, NY 10001", 
    type: "East Coast Office"
  },
  {
    city: "London",
    address: "789 Digital Lane, Level 8\nLondon, UK EC1A 1AA",
    type: "European Office"
  }
];

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

export default function Contact() {
  return (
    <div className="min-h-screen bg-space-black text-white">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-space-black via-cosmic-void to-space-black">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 border-b border-white/10 bg-space-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">VeeFore</span>
              </div>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link href="/about">
                <Button variant="ghost">About</Button>
              </Link>
              <Link href="/support">
                <Button variant="ghost">Support</Button>
              </Link>
              <Link href="/auth">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-20">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Badge className="mb-6 bg-violet-500/20 text-violet-300 border-violet-500/30">
            Get In Touch
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-violet-200 to-purple-300 bg-clip-text text-transparent">
            We're Here to
            <br />
            <span className="text-violet-400">Help You Succeed</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Have questions? Need support? Want to explore enterprise solutions? 
            Our team is ready to help you achieve your social media goals.
          </p>
        </motion.div>

        {/* Contact Methods */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {contactMethods.map((method, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="bg-space-gray/30 border-violet-500/20 backdrop-blur-sm hover:bg-space-gray/40 transition-all duration-300 h-full text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-violet-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 text-violet-400">
                    {method.icon}
                  </div>
                  <CardTitle className="text-white">{method.title}</CardTitle>
                  <CardDescription className="text-gray-300">
                    {method.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-violet-400 font-medium mb-2">{method.contact}</div>
                  <div className="flex items-center justify-center text-sm text-gray-400">
                    <Clock className="h-4 w-4 mr-1" />
                    {method.responseTime}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact Form & Info */}
        <motion.div 
          className="grid md:grid-cols-2 gap-12 mb-20"
          {...fadeInUp}
        >
          {/* Contact Form */}
          <Card className="bg-space-gray/30 border-violet-500/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Send us a Message</CardTitle>
              <CardDescription className="text-gray-300">
                Fill out the form below and we'll get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">First Name</label>
                  <Input 
                    placeholder="John"
                    className="bg-space-gray/50 border-violet-500/30 text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Last Name</label>
                  <Input 
                    placeholder="Doe"
                    className="bg-space-gray/50 border-violet-500/30 text-white placeholder-gray-400"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">Email</label>
                <Input 
                  type="email"
                  placeholder="john@example.com"
                  className="bg-space-gray/50 border-violet-500/30 text-white placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Subject</label>
                <Select>
                  <SelectTrigger className="bg-space-gray/50 border-violet-500/30 text-white">
                    <SelectValue placeholder="Select a topic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="support">Technical Support</SelectItem>
                    <SelectItem value="billing">Billing Question</SelectItem>
                    <SelectItem value="feature">Feature Request</SelectItem>
                    <SelectItem value="enterprise">Enterprise Sales</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Message</label>
                <Textarea 
                  placeholder="Tell us how we can help you..."
                  rows={5}
                  className="bg-space-gray/50 border-violet-500/30 text-white placeholder-gray-400"
                />
              </div>

              <Button className="w-full bg-violet-600 hover:bg-violet-700">
                Send Message
                <Send className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Contact Info & Offices */}
          <div className="space-y-8">
            {/* Quick Contact */}
            <Card className="bg-space-gray/30 border-violet-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-white">Quick Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-violet-400" />
                  <span className="text-gray-300">support@veefore.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-violet-400" />
                  <span className="text-gray-300">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <HeadphonesIcon className="h-5 w-5 text-violet-400" />
                  <span className="text-gray-300">24/7 Chat Support</span>
                </div>
              </CardContent>
            </Card>

            {/* Office Locations */}
            <Card className="bg-space-gray/30 border-violet-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-white">Office Locations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {offices.map((office, index) => (
                  <div key={index} className="border-b border-violet-500/20 last:border-b-0 pb-4 last:pb-0">
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-violet-400 mt-1" />
                      <div>
                        <div className="font-medium text-white">{office.city}</div>
                        <Badge variant="outline" className="text-xs mb-2">
                          {office.type}
                        </Badge>
                        <div className="text-gray-300 text-sm whitespace-pre-line">
                          {office.address}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div 
          className="text-center bg-gradient-to-r from-violet-500/10 to-purple-600/10 rounded-2xl p-12 border border-violet-500/20"
          {...fadeInUp}
        >
          <h2 className="text-3xl font-bold mb-4">Looking for Quick Answers?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Check out our comprehensive help center and documentation for instant solutions 
            to common questions and setup guides.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/help">
              <Button size="lg" className="bg-violet-600 hover:bg-violet-700">
                Visit Help Center
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/docs">
              <Button size="lg" variant="outline">
                View Documentation
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}