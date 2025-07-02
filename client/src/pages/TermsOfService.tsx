import { motion } from 'framer-motion';
import { FileText, ArrowLeft } from 'lucide-react';
import { useLocation, Link } from 'wouter';
import { Button } from '@/components/ui/button';

export function TermsOfService() {
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
            <FileText className="w-8 h-8 text-purple-400" />
            <h1 className="text-4xl font-bold">Terms of Service</h1>
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
              <h2 className="text-2xl font-semibold mb-4">Agreement to Terms</h2>
              <p className="text-white/80 leading-relaxed">
                By accessing and using Veefore, operated by VEEFED TECHNOLOGIES PRIVATE LIMITED, 
                you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Use License</h2>
              <div className="text-white/80 leading-relaxed space-y-3">
                <p>Permission is granted to temporarily use Veefore for personal, non-commercial transitory viewing only. This includes the license to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Access and use the AI-powered content creation tools</li>
                  <li>Create, edit, and manage social media content</li>
                  <li>Connect your social media accounts for analytics and posting</li>
                  <li>Use automation features within the scope of your subscription</li>
                  <li>Download and save content created on the platform</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Restrictions</h2>
              <div className="text-white/80 leading-relaxed space-y-3">
                <p>You are specifically restricted from all of the following:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Selling, sublicensing and/or otherwise commercializing any platform material</li>
                  <li>Using this platform in any way that is or may be damaging to this platform</li>
                  <li>Using this platform contrary to applicable laws and regulations</li>
                  <li>Engaging in any data mining, data harvesting, data extracting or any other similar activity</li>
                  <li>Using this platform to engage in any advertising or marketing</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Content Ownership</h2>
              <p className="text-white/80 leading-relaxed">
                You retain ownership of all content you create using our platform. We do not claim 
                ownership over your content, but you grant us a license to process and store your 
                content to provide our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Disclaimer</h2>
              <p className="text-white/80 leading-relaxed">
                The information on this platform is provided on an "as is" basis. To the fullest 
                extent permitted by law, this Company excludes all representations, warranties, 
                conditions and terms related to our platform and the use of this platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
              <p className="text-white/80 leading-relaxed">
                In no event shall VEEFED TECHNOLOGIES PRIVATE LIMITED, nor any of its officers, 
                directors and employees, be held liable for anything arising out of or in any way 
                connected with your use of this platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
              <p className="text-white/80 leading-relaxed">
                If you have any questions about these Terms of Service, please contact us through 
                our support channels within the Veefore platform.
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