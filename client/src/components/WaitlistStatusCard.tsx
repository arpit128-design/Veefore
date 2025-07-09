import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Clock, Copy, Share2, Users, Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useDeviceWaitlistStatus } from '@/hooks/useDeviceWaitlistStatus';

interface WaitlistStatusCardProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WaitlistStatusCard({ isOpen, onClose }: WaitlistStatusCardProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const deviceStatus = useDeviceWaitlistStatus();

  const copyReferralCode = async () => {
    if (!deviceStatus.referralCode) return;
    
    try {
      await navigator.clipboard.writeText(deviceStatus.referralCode);
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
    if (!deviceStatus.referralCode) return;
    
    const referralLink = `${window.location.origin}?ref=${deviceStatus.referralCode}`;
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

  const shareText = async () => {
    if (!deviceStatus.referralCode) return;
    
    const text = `Check out VeeFore - AI-powered social media management! Join using my referral code: ${deviceStatus.referralCode}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'VeeFore - AI Social Media Management',
          text,
          url: `${window.location.origin}?ref=${deviceStatus.referralCode}`
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(text);
        toast({
          title: "Copied!",
          description: "Share text copied to clipboard",
        });
      }
    } else {
      navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Share text copied to clipboard",
      });
    }
  };

  if (!deviceStatus.isOnWaitlist) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 shadow-2xl">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg text-white">
                    {deviceStatus.hasEarlyAccess ? (
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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* User Info */}
                <div className="space-y-2">
                  <p className="text-sm text-gray-300">
                    <strong>Email:</strong> {deviceStatus.userEmail}
                  </p>
                </div>

                {/* Status Message */}
                <div className={`p-3 rounded-lg ${
                  deviceStatus.hasEarlyAccess 
                    ? 'bg-green-900/20 text-green-200 border border-green-800/30' 
                    : 'bg-orange-900/20 text-orange-200 border border-orange-800/30'
                }`}>
                  <p className="text-sm font-medium">
                    {deviceStatus.hasEarlyAccess 
                      ? '🎉 You have early access! You can now sign up and start using VeeFore.'
                      : '⏳ You\'re on the waitlist. Refer friends to move up in the queue!'
                    }
                  </p>
                </div>

                {/* Referral Section */}
                {deviceStatus.referralCode && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
                      <Users className="w-4 h-4" />
                      Your Referral Code
                    </div>
                    
                    <div className="flex gap-2">
                      <div className="flex-1 p-2 bg-slate-800 rounded border border-slate-600 text-sm font-mono text-white">
                        {deviceStatus.referralCode}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyReferralCode}
                        className="px-3 border-slate-600 text-gray-300 hover:bg-slate-700"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={shareReferralLink}
                        className="flex-1 border-slate-600 text-gray-300 hover:bg-slate-700"
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Share Link
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={shareText}
                        className="flex-1 border-slate-600 text-gray-300 hover:bg-slate-700"
                      >
                        <Star className="w-4 h-4 mr-2" />
                        Share Text
                      </Button>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <div className="pt-2">
                  {deviceStatus.hasEarlyAccess ? (
                    <Button
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      onClick={() => {
                        window.location.href = '/auth';
                      }}
                    >
                      Start Free Trial
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full border-slate-600 text-gray-300 hover:bg-slate-700"
                      onClick={onClose}
                    >
                      Close
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}