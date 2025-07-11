import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, User, Users, Rocket, CheckCircle, Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialReferralCode?: string;
}

interface WaitlistResult {
  user: {
    id: string;
    email: string;
    name: string;
    referralCode: string;
    position: number;
    status: string;
  };
  message: string;
}

export function WaitlistModal({ isOpen, onClose, initialReferralCode = '' }: WaitlistModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [referralCode, setReferralCode] = useState(initialReferralCode);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<WaitlistResult | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Update referral code when initialReferralCode changes
  useEffect(() => {
    setReferralCode(initialReferralCode);
  }, [initialReferralCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/early-access/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          referredBy: referralCode || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
        toast({
          title: "🎉 Welcome to VeeFore!",
          description: "You've been added to our waitlist. Check your email for updates!",
        });
      } else {
        // Handle existing user cases
        if (data.existingUser) {
          toast({
            title: "Already on waitlist",
            description: `${data.existingUser.email} is already on our waitlist!`,
            variant: "default",
          });
          // Set the existing user as result to show their info
          setResult({
            user: data.existingUser,
            message: data.error
          });
        } else {
          toast({
            title: "Error joining waitlist",
            description: data.error || "Something went wrong. Please try again.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Network error",
        description: "Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyReferralCode = () => {
    if (result?.user.referralCode) {
      navigator.clipboard.writeText(result.user.referralCode);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Referral code copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareReferralLink = () => {
    const referralLink = `${window.location.origin}?ref=${result?.user.referralCode}`;
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Link copied!",
      description: "Referral link copied to clipboard",
    });
  };

  const reset = () => {
    setName('');
    setEmail('');
    setReferralCode('');
    setResult(null);
    setCopied(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Join VeeFore Waitlist</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-600 hover:text-slate-900"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {result ? (
            /* Success State */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-6"
            >
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Welcome to VeeFore!
                </h3>
                <p className="text-gray-400 text-sm">
                  You're #{result.user.position} on the waitlist
                </p>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Your referral code:</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyReferralCode}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                <div className="bg-slate-100 rounded-lg p-3 font-mono text-center text-slate-900">
                  {result.user.referralCode}
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={shareReferralLink}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Share Referral Link
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    reset();
                    onClose();
                  }}
                  className="w-full border-slate-600 text-gray-300 hover:bg-slate-800"
                >
                  Close
                </Button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                Refer friends to move up the waitlist faster!
              </p>
            </motion.div>
          ) : (
            /* Join Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-200">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1 bg-slate-800 border-slate-600 text-white placeholder-gray-400"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-200">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 bg-slate-800 border-slate-600 text-white placeholder-gray-400"
                  placeholder="Enter your email address"
                />
              </div>

              <div>
                <Label htmlFor="referralCode" className="text-sm font-medium text-gray-200">
                  Referral Code (Optional)
                </Label>
                <Input
                  id="referralCode"
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  className="mt-1 bg-slate-800 border-slate-600 text-white placeholder-gray-400"
                  placeholder="Enter referral code if you have one"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                {isLoading ? (
                  <motion.div
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  <>
                    <Users className="w-4 h-4 mr-2" />
                    Join Waitlist
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                By joining, you'll be notified when early access becomes available
              </p>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}