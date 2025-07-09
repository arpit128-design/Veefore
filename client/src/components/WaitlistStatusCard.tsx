import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Copy, Share2, Users, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface WaitlistStatusCardProps {
  userEmail: string;
  userName?: string;
  status: 'waitlisted' | 'early_access';
  referralCode: string;
  position?: number;
  referralCount?: number;
}

export function WaitlistStatusCard({
  userEmail,
  userName,
  status,
  referralCode,
  position,
  referralCount = 0
}: WaitlistStatusCardProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyReferralCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Referral code copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please copy the code manually",
        variant: "destructive",
      });
    }
  };

  const shareReferralLink = async () => {
    const referralLink = `${window.location.origin}?ref=${referralCode}`;
    try {
      await navigator.clipboard.writeText(referralLink);
      toast({
        title: "Link copied!",
        description: "Referral link copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please copy the link manually",
        variant: "destructive",
      });
    }
  };

  const isEarlyAccess = status === 'early_access';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto mb-6"
    >
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            {isEarlyAccess ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-500" />
                Early Access Granted!
              </>
            ) : (
              <>
                <Clock className="w-5 h-5 text-orange-500" />
                On Waitlist
              </>
            )}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* User Info */}
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <strong>Email:</strong> {userEmail}
            </p>
            {userName && (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Name:</strong> {userName}
              </p>
            )}
            {position && (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Position:</strong> #{position}
              </p>
            )}
          </div>

          {/* Status Message */}
          <div className={`p-3 rounded-lg ${
            isEarlyAccess 
              ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200' 
              : 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200'
          }`}>
            <p className="text-sm font-medium">
              {isEarlyAccess 
                ? '🎉 You have early access! You can now sign up and start using VeeFore.'
                : '⏳ You\'re on the waitlist. Refer friends to move up in the queue!'
              }
            </p>
          </div>

          {/* Referral Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Users className="w-4 h-4" />
              Your Referral Code
            </div>
            
            <div className="flex gap-2">
              <div className="flex-1 p-2 bg-gray-100 dark:bg-gray-800 rounded border text-sm font-mono">
                {referralCode}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={copyReferralCode}
                className="px-3"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={shareReferralLink}
                className="flex-1"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Link
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const text = `Check out VeeFore - AI-powered social media management! Join using my referral code: ${referralCode}`;
                  if (navigator.share) {
                    navigator.share({
                      title: 'VeeFore - AI Social Media Management',
                      text,
                      url: `${window.location.origin}?ref=${referralCode}`
                    });
                  } else {
                    navigator.clipboard.writeText(text);
                    toast({
                      title: "Copied!",
                      description: "Share text copied to clipboard",
                    });
                  }
                }}
                className="flex-1"
              >
                <Star className="w-4 h-4 mr-2" />
                Share Text
              </Button>
            </div>

            {referralCount > 0 && (
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                You've referred {referralCount} friend{referralCount !== 1 ? 's' : ''}! 🎉
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}