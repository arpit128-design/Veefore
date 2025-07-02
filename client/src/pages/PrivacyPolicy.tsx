import { motion } from 'framer-motion';
import { Shield, ArrowLeft } from 'lucide-react';
import { useLocation, Link } from 'wouter';
import { Button } from '@/components/ui/button';

export function PrivacyPolicy() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => setLocation('/')}
            className="mb-4 text-white/60 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-blue-400" />
            <h1 className="text-4xl font-bold">Privacy Policy</h1>
          </div>
          
          <p className="text-white/60">
            Last updated: July 02, 2025
          </p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="prose prose-invert max-w-none"
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
              <p className="text-white/80 leading-relaxed">
                This Privacy Policy describes how VEEFED TECHNOLOGIES PRIVATE LIMITED ("we," "our," or "us") 
                collects, uses, and protects your information when you use the Veefore platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
              <div className="text-white/80 leading-relaxed space-y-3">
                <p>We collect information you provide directly to us, including:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Account information (email, name, profile details)</li>
                  <li>Content you create and upload to our platform</li>
                  <li>Social media account connections and associated data</li>
                  <li>Payment and billing information</li>
                  <li>Communications with our support team</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
              <div className="text-white/80 leading-relaxed space-y-3">
                <p>We use the information we collect to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide and improve our AI-powered content creation services</li>
                  <li>Manage your account and provide customer support</li>
                  <li>Process payments and maintain billing records</li>
                  <li>Send important updates about our services</li>
                  <li>Analyze usage patterns to enhance platform performance</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
              <p className="text-white/80 leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal 
                information against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
              <p className="text-white/80 leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us through our 
                support channels within the Veefore platform.
              </p>
            </section>

            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-sm text-white/40 text-center">
                © 2025 Veefore — A product of VEEFED TECHNOLOGIES PRIVATE LIMITED
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}