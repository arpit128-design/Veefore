import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, FileText, Database, Lock, Globe, Users, Mail, AlertTriangle } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-space-navy text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 text-electric-cyan mr-4" />
            <h1 className="text-4xl font-orbitron font-bold">Privacy Policy</h1>
          </div>
          <p className="text-asteroid-silver text-lg">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Introduction */}
        <Card className="content-card holographic mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-electric-cyan" />
              <span className="text-xl font-orbitron font-semibold">Introduction</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-asteroid-silver">
            <p>
              VeeFore ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered content creation and social media management platform.
            </p>
            <p>
              By using VeeFore, you consent to the data practices described in this policy. If you do not agree with the practices described in this policy, please do not use our services.
            </p>
          </CardContent>
        </Card>

        {/* Information We Collect */}
        <Card className="content-card holographic mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-electric-cyan" />
              <span className="text-xl font-orbitron font-semibold">Information We Collect</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Personal Information</h3>
              <ul className="space-y-2 text-asteroid-silver ml-4">
                <li className="flex items-start">
                  <span className="text-electric-cyan mr-2">•</span>
                  Account information (name, email address, username)
                </li>
                <li className="flex items-start">
                  <span className="text-electric-cyan mr-2">•</span>
                  Profile information and preferences
                </li>
                <li className="flex items-start">
                  <span className="text-electric-cyan mr-2">•</span>
                  Payment and billing information (processed securely through Stripe)
                </li>
                <li className="flex items-start">
                  <span className="text-electric-cyan mr-2">•</span>
                  Communication data when you contact us
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Social Media Data</h3>
              <ul className="space-y-2 text-asteroid-silver ml-4">
                <li className="flex items-start">
                  <span className="text-electric-cyan mr-2">•</span>
                  Social media account information (when you connect platforms)
                </li>
                <li className="flex items-start">
                  <span className="text-electric-cyan mr-2">•</span>
                  Content performance metrics and analytics
                </li>
                <li className="flex items-start">
                  <span className="text-electric-cyan mr-2">•</span>
                  Published content and scheduling data
                </li>
                <li className="flex items-start">
                  <span className="text-electric-cyan mr-2">•</span>
                  Audience insights and engagement data
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Usage Information</h3>
              <ul className="space-y-2 text-asteroid-silver ml-4">
                <li className="flex items-start">
                  <span className="text-electric-cyan mr-2">•</span>
                  Device information and IP address
                </li>
                <li className="flex items-start">
                  <span className="text-electric-cyan mr-2">•</span>
                  Browser type and operating system
                </li>
                <li className="flex items-start">
                  <span className="text-electric-cyan mr-2">•</span>
                  Pages visited and features used
                </li>
                <li className="flex items-start">
                  <span className="text-electric-cyan mr-2">•</span>
                  Time and date of access
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Information */}
        <Card className="content-card holographic mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-electric-cyan" />
              <span className="text-xl font-orbitron font-semibold">How We Use Your Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3 text-asteroid-silver">
              <li className="flex items-start">
                <span className="text-electric-cyan mr-2">•</span>
                <div>
                  <strong className="text-white">Service Provision:</strong> To provide, maintain, and improve our AI-powered content creation services
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-electric-cyan mr-2">•</span>
                <div>
                  <strong className="text-white">Content Generation:</strong> To generate personalized content recommendations and AI-assisted content creation
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-electric-cyan mr-2">•</span>
                <div>
                  <strong className="text-white">Analytics:</strong> To provide insights and analytics about your social media performance
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-electric-cyan mr-2">•</span>
                <div>
                  <strong className="text-white">Communication:</strong> To send service-related notifications and respond to inquiries
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-electric-cyan mr-2">•</span>
                <div>
                  <strong className="text-white">Security:</strong> To detect and prevent fraud, abuse, and security incidents
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-electric-cyan mr-2">•</span>
                <div>
                  <strong className="text-white">Legal Compliance:</strong> To comply with applicable laws and regulations
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card className="content-card holographic mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lock className="h-5 w-5 text-electric-cyan" />
              <span className="text-xl font-orbitron font-semibold">Data Security</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-asteroid-silver">
            <p>
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <h4 className="text-white font-medium">Technical Measures</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center">
                    <span className="text-electric-cyan mr-2">✓</span>
                    End-to-end encryption
                  </li>
                  <li className="flex items-center">
                    <span className="text-electric-cyan mr-2">✓</span>
                    Secure data transmission (HTTPS)
                  </li>
                  <li className="flex items-center">
                    <span className="text-electric-cyan mr-2">✓</span>
                    Regular security audits
                  </li>
                  <li className="flex items-center">
                    <span className="text-electric-cyan mr-2">✓</span>
                    Access controls and monitoring
                  </li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="text-white font-medium">Organizational Measures</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center">
                    <span className="text-electric-cyan mr-2">✓</span>
                    Employee training programs
                  </li>
                  <li className="flex items-center">
                    <span className="text-electric-cyan mr-2">✓</span>
                    Data access limitations
                  </li>
                  <li className="flex items-center">
                    <span className="text-electric-cyan mr-2">✓</span>
                    Incident response procedures
                  </li>
                  <li className="flex items-center">
                    <span className="text-electric-cyan mr-2">✓</span>
                    Regular security assessments
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Third-Party Services */}
        <Card className="content-card holographic mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-electric-cyan" />
              <span className="text-xl font-orbitron font-semibold">Third-Party Services</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-asteroid-silver">
            <p>
              VeeFore integrates with various third-party services to provide our functionality. These services have their own privacy policies:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-white font-medium mb-2">Social Media Platforms</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Instagram (Meta)</li>
                  <li>• Facebook (Meta)</li>
                  <li>• Twitter/X</li>
                  <li>• LinkedIn</li>
                  <li>• TikTok</li>
                  <li>• YouTube (Google)</li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-medium mb-2">Infrastructure Services</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Firebase (Google) - Authentication</li>
                  <li>• MongoDB Atlas - Database</li>
                  <li>• Stripe - Payment processing</li>
                  <li>• Google AI - Content generation</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card className="content-card holographic mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-electric-cyan" />
              <span className="text-xl font-orbitron font-semibold">Your Rights</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-asteroid-silver">
            <p>You have the following rights regarding your personal information:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-electric-cyan mr-2">•</span>
                  <strong className="text-white">Access:</strong> Request copies of your data
                </li>
                <li className="flex items-start">
                  <span className="text-electric-cyan mr-2">•</span>
                  <strong className="text-white">Rectification:</strong> Correct inaccurate data
                </li>
                <li className="flex items-start">
                  <span className="text-electric-cyan mr-2">•</span>
                  <strong className="text-white">Erasure:</strong> Request deletion of your data
                </li>
              </ul>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-electric-cyan mr-2">•</span>
                  <strong className="text-white">Portability:</strong> Export your data
                </li>
                <li className="flex items-start">
                  <span className="text-electric-cyan mr-2">•</span>
                  <strong className="text-white">Restriction:</strong> Limit processing
                </li>
                <li className="flex items-start">
                  <span className="text-electric-cyan mr-2">•</span>
                  <strong className="text-white">Objection:</strong> Opt-out of certain uses
                </li>
              </ul>
            </div>
            <p className="mt-4">
              To exercise these rights, please contact us at privacy@veefore.com
            </p>
          </CardContent>
        </Card>

        {/* Data Retention */}
        <Card className="content-card holographic mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-electric-cyan" />
              <span className="text-xl font-orbitron font-semibold">Data Retention</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-asteroid-silver">
            <p>We retain your information for as long as necessary to:</p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start">
                <span className="text-electric-cyan mr-2">•</span>
                Provide our services to you
              </li>
              <li className="flex items-start">
                <span className="text-electric-cyan mr-2">•</span>
                Comply with legal obligations
              </li>
              <li className="flex items-start">
                <span className="text-electric-cyan mr-2">•</span>
                Resolve disputes and enforce agreements
              </li>
              <li className="flex items-start">
                <span className="text-electric-cyan mr-2">•</span>
                Maintain security and prevent fraud
              </li>
            </ul>
            <p>
              When you delete your account, we will delete or anonymize your personal information within 30 days, except where retention is required by law.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="content-card holographic mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-electric-cyan" />
              <span className="text-xl font-orbitron font-semibold">Contact Us</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-asteroid-silver">
            <p>
              If you have questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-space-black/30 p-4 rounded-lg border border-asteroid-gray/20">
              <div className="space-y-2">
                <div><strong className="text-white">Email:</strong> privacy@veefore.com</div>
                <div><strong className="text-white">Data Protection Officer:</strong> dpo@veefore.com</div>
                <div><strong className="text-white">General Support:</strong> support@veefore.com</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Policy Updates */}
        <Card className="content-card holographic">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-electric-cyan" />
              <span className="text-xl font-orbitron font-semibold">Policy Updates</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-asteroid-silver">
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any material changes by:
            </p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start">
                <span className="text-electric-cyan mr-2">•</span>
                Posting the updated policy on this page
              </li>
              <li className="flex items-start">
                <span className="text-electric-cyan mr-2">•</span>
                Sending you an email notification
              </li>
              <li className="flex items-start">
                <span className="text-electric-cyan mr-2">•</span>
                Displaying a notice in our application
              </li>
            </ul>
            <p>
              Your continued use of VeeFore after any changes indicates your acceptance of the updated Privacy Policy.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}