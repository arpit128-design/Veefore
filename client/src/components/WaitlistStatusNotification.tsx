import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Clock, AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WaitlistStatusNotificationProps {
  isOnWaitlist: boolean;
  hasEarlyAccess: boolean;
  userEmail?: string;
  onClose: () => void;
  show: boolean;
}

export function WaitlistStatusNotification({
  isOnWaitlist,
  hasEarlyAccess,
  userEmail,
  onClose,
  show
}: WaitlistStatusNotificationProps) {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    setIsVisible(show);
  }, [show]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation to complete
  };

  if (!isOnWaitlist) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-white/20 shadow-2xl max-w-md w-full mx-4 relative overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-60" />

            <div className="relative z-10 p-8">
              <div className="text-center space-y-6">
                {/* Status Icon */}
                <div className="flex justify-center">
                  {hasEarlyAccess ? (
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                      <Clock className="w-8 h-8 text-white" />
                    </div>
                  )}
                </div>

                {/* Status Title */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {hasEarlyAccess ? 'Early Access Granted!' : 'You\'re on the Waitlist!'}
                  </h2>
                  <p className="text-white/70 text-lg">
                    {hasEarlyAccess 
                      ? 'Welcome to VeeFore! You can now sign in and start creating amazing content.' 
                      : 'Early access is launching soon. We\'ll notify you when it\'s ready!'
                    }
                  </p>
                </div>

                {/* User Email */}
                {userEmail && (
                  <div className="bg-black/30 rounded-lg p-3 border border-white/10">
                    <p className="text-white/80 text-sm font-medium">
                      Registered: {userEmail}
                    </p>
                  </div>
                )}

                {/* Action Button */}
                <Button
                  onClick={handleClose}
                  className={`w-full py-3 font-semibold relative overflow-hidden ${
                    hasEarlyAccess 
                      ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600' 
                      : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'
                  }`}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="relative z-10">
                    {hasEarlyAccess ? 'Continue to Sign In' : 'Got it!'}
                  </span>
                </Button>

                {/* Additional Info */}
                <div className="text-center space-y-2">
                  <p className="text-white/50 text-sm">
                    {hasEarlyAccess 
                      ? 'You can now access all VeeFore features and start building your content empire.' 
                      : 'Share VeeFore with friends to help us grow and launch faster!'
                    }
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}