import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, FileText, AlertTriangle, CreditCard, Shield, Users, Ban, Gavel } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-space-navy text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Scale className="w-12 h-12 text-electric-cyan mr-4" />
            <h1 className="text-4xl font-orbitron font-bold">Terms of Service</h1>
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
              Welcome to VeeFore! These Terms of Service ("Terms") govern your use of our AI-powered content creation and social media management platform. By accessing or using VeeFore, you agree to be bound by these Terms.
            </p>
            <p>
              If you do not agree to these Terms, please do not use our services. We may update these Terms from time to time, and your continued use constitutes acceptance of any changes.
            </p>
          </CardContent>
        </Card>

        {/* Service Description */}
        <Card className="content-card holographic mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-electric-cyan" />
              <span className="text-xl font-orbitron font-semibold">Our Services</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-asteroid-silver">
            <p>
              VeeFore provides an AI-powered platform for content creation and social media management, including:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-electric-cyan mr-2">•</span>
                  AI-generated content creation
                </li>
                <li className="flex items-start">
                  <span className="text-electric-cyan mr-2">•</span>
                  Social media scheduling and posting
                </li>
                <li className="flex items-start">
                  <span className="text-electric-cyan mr-2">•</span>
                  Analytics and performance tracking
                </li>
                <li className="flex items-start">
                  <span className="text-electric-cyan mr-2">•</span>
                  Multi-platform integration
                </li>
              </ul>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-electric-cyan mr-2">•</span>
                  Content optimization suggestions
                </li>
                <li className="flex items-start">
                  <span className="text-electric-cyan mr-2">•</span>
                  Audience insights and targeting
                </li>
                <li className="flex items-start">
                  <span className="text-electric-cyan mr-2">•</span>
                  Automated workflow management
                </li>
                <li className="flex items-start">
                  <span className="text-electric-cyan mr-2">•</span>
                  Collaboration tools
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* User Responsibilities */}
        <Card className="content-card holographic mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-electric-cyan" />
              <span className="text-xl font-orbitron font-semibold">Your Responsibilities</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Account Security</h3>
              <ul className="space-y-2 text-asteroid-silver ml-4">
                <li className="flex items-start">
                  <span className="text-electric-cyan mr-2">•</span>
                  Maintain the confidentiality of your account credentials
                </li>
                <li className="flex items-start">
                  <span className="text-electric-cyan mr-2">•</span>
                  Notify us immediately of any unauthorized access
                </li>
                <li className="flex items-start">
                  <span className="text-electric-cyan mr-2">•</span>
                  Use strong passwords and enable two-factor authentication
                </li>
                <li className="flex items-start">
                  <span className="text-electric-cyan mr-2">•</span>
                  You are responsible for all activities under your account
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Content Guidelines</h3>
              <ul className="space-y-2 text-asteroid-silver ml-4">
                <li className="flex items-start">
                  <span className="text-electric-cyan mr-2">•</span>
                  Ensure you have rights to all content you create or share
                </li>
                <li className="flex items-start">
                  <span className="text-electric-cyan mr-2">•</span>
                  Comply with all applicable laws and platform policies
                </li>
                <li className="flex items-start">
                  <span className="text-electric-cyan mr-2">•</span>
                  Respect intellectual property rights of others
                </li>
                <li className="flex items-start">
                  <span className="text-electric-cyan mr-2">•</span>
                  Review AI-generated content before publishing
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Prohibited Uses */}
        <Card className="content-card holographic mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Ban className="h-5 w-5 text-red-400" />
              <span className="text-xl font-orbitron font-semibold">Prohibited Uses</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-asteroid-silver">
            <p>You may not use VeeFore for any unlawful purpose or in any way that could harm our services or other users. Prohibited activities include:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">✗</span>
                  Creating harmful, abusive, or illegal content
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">✗</span>
                  Spamming or unsolicited marketing
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">✗</span>
                  Impersonating others or spreading misinformation
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">✗</span>
                  Violating intellectual property rights
                </li>
              </ul>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">✗</span>
                  Attempting to hack or disrupt our services
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">✗</span>
                  Sharing your account with unauthorized users
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">✗</span>
                  Using automated tools to access our services
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">✗</span>
                  Reverse engineering our technology
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Payment Terms */}
        <Card className="content-card holographic mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-electric-cyan" />
              <span className="text-xl font-orbitron font-semibold">Payment Terms</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Subscription Plans</h3>
              <ul className="space-y-2 text-asteroid-silver ml-4">
                <li className="flex items-start">
                  <span className="text-electric-cyan mr-2">•</span>
                  Subscription fees are billed in advance on a recurring basis
                </li>
                <li className="flex items-start">
                  <span className="text-electric-cyan mr-2">•</span>
                  All payments are processed securely through Stripe
                </li>
                <li className="flex items-start">
                  <span className="text-electric-cyan mr-2">•</span>
                  Fees are non-refundable except as required by law
                </li>
                <li className="flex items-start">
                  <span className="text-electric-cyan mr-2">•</span>
                  You can cancel your subscription at any time
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Credit System</h3>
              <ul className="space-y-2 text-asteroid-silver ml-4">
                <li className="flex items-start">
                  <span className="text-electric-cyan mr-2">•</span>
                  Credits are used for AI content generation and premium features
                </li>
                <li className="flex items-start">
                  <span className="text-electric-cyan mr-2">•</span>
                  Unused credits expire according to your plan terms
                </li>
                <li className="flex items-start">
                  <span className="text-electric-cyan mr-2">•</span>
                  Additional credits can be purchased as needed
                </li>
                <li className="flex items-start">
                  <span className="text-electric-cyan mr-2">•</span>
                  Referral bonuses and promotional credits may have different terms
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Intellectual Property */}
        <Card className="content-card holographic mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-electric-cyan" />
              <span className="text-xl font-orbitron font-semibold">Intellectual Property</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-asteroid-silver">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Your Content</h3>
              <p>
                You retain ownership of content you create using VeeFore. By using our services, you grant us a limited license to process, store, and display your content solely for the purpose of providing our services.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Our Platform</h3>
              <p>
                VeeFore and all related technology, features, and functionality are owned by us and protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, or create derivative works of our platform.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-3">AI-Generated Content</h3>
              <p>
                Content generated by our AI tools is provided "as-is" and you are responsible for reviewing and ensuring its appropriateness before use. We do not guarantee the accuracy, originality, or fitness for purpose of AI-generated content.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimers */}
        <Card className="content-card holographic mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              <span className="text-xl font-orbitron font-semibold">Disclaimers and Limitations</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-asteroid-silver">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Service Availability</h3>
              <p>
                We strive to maintain high availability but cannot guarantee uninterrupted service. We may experience downtime for maintenance, updates, or technical issues beyond our control.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Third-Party Platforms</h3>
              <p>
                Our integrations with social media platforms depend on their APIs and policies. Changes to these platforms may affect our services, and we are not responsible for issues arising from third-party platform modifications.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-3">AI Technology</h3>
              <p>
                AI-generated content may not always be accurate, appropriate, or original. You are solely responsible for reviewing and approving all content before publication.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Termination */}
        <Card className="content-card holographic mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Gavel className="h-5 w-5 text-electric-cyan" />
              <span className="text-xl font-orbitron font-semibold">Termination</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-asteroid-silver">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">By You</h3>
              <p>
                You may terminate your account at any time through your account settings. Upon termination, your access to paid features will end at the conclusion of your current billing period.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-3">By Us</h3>
              <p>
                We may suspend or terminate your account if you violate these Terms, engage in prohibited activities, or for other legitimate business reasons. We will provide reasonable notice when possible.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Effect of Termination</h3>
              <p>
                Upon termination, your right to use VeeFore ceases immediately. We may delete your account data according to our data retention policy, though some information may be retained as required by law.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="content-card holographic mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-electric-cyan" />
              <span className="text-xl font-orbitron font-semibold">Contact Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-asteroid-silver">
            <p>
              If you have questions about these Terms or need support, please contact us:
            </p>
            <div className="bg-space-black/30 p-4 rounded-lg border border-asteroid-gray/20">
              <div className="space-y-2">
                <div><strong className="text-white">General Support:</strong> support@veefore.com</div>
                <div><strong className="text-white">Legal Inquiries:</strong> legal@veefore.com</div>
                <div><strong className="text-white">Billing Questions:</strong> billing@veefore.com</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Governing Law */}
        <Card className="content-card holographic">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Scale className="h-5 w-5 text-electric-cyan" />
              <span className="text-xl font-orbitron font-semibold">Governing Law</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-asteroid-silver">
            <p>
              These Terms are governed by and construed in accordance with applicable laws. Any disputes arising from these Terms will be resolved through binding arbitration or in the appropriate courts with jurisdiction.
            </p>
            <p>
              By using VeeFore, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}