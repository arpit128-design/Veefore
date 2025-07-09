import { useState, useEffect, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock, Eye, EyeOff, ChevronLeft, AlertCircle } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { WaitlistStatusNotification } from '@/components/WaitlistStatusNotification';
import { AccessRestrictedModal } from '@/components/AccessRestrictedModal';

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

type SignInForm = z.infer<typeof signInSchema>;

// Floating particles component
const FloatingParticle = ({ delay = 0, size = 4, color = "blue" }: any) => (
  <motion.div
    className={`absolute w-${size} h-${size} bg-${color}-500 rounded-full opacity-30`}
    animate={{
      y: [0, -100, 0],
      x: [0, 50, 0],
      opacity: [0.3, 0.8, 0.3],
      scale: [1, 1.2, 1]
    }}
    transition={{
      duration: 6 + delay,
      repeat: Infinity,
      delay: delay * 2,
      ease: "easeInOut"
    }}
    style={{
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`
    }}
  />
);

// 3D Card Component
const AuthCard = ({ children, ...props }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 50, rotateX: -15 }}
    animate={{ opacity: 1, y: 0, rotateX: 0 }}
    transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
    className="transform-gpu perspective-1000"
    {...props}
  >
    <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl relative overflow-hidden">
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      
      {/* Gradient border animation */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0"
        animate={{ opacity: [0, 0.3, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      
      <CardContent className="p-8 relative z-10">
        {children}
      </CardContent>
    </Card>
  </motion.div>
);

// Input with 3D effects
const AnimatedInput = forwardRef<HTMLInputElement, any>(({ icon: Icon, label, error, ...props }, ref) => (
  <motion.div 
    className="space-y-2"
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.2 }}
  >
    <label className="text-sm font-medium text-white/80">{label}</label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
        <Icon className="w-5 h-5 text-white/50" />
      </div>
      <Input
        ref={ref}
        className={`
          pl-12 bg-white/5 border-white/20 text-white placeholder:text-white/40
          focus:border-blue-400 focus:bg-white/10 transition-all duration-300
          ${error ? 'border-red-400 focus:border-red-400' : ''}
        `}
        {...props}
      />
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 mt-2 text-red-400 text-sm"
        >
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </motion.div>
      )}
    </div>
  </motion.div>
));

AnimatedInput.displayName = 'AnimatedInput';

export default function SignIn() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userWaitlistStatus, setUserWaitlistStatus] = useState<{
    isOnWaitlist: boolean;
    hasEarlyAccess: boolean;
    referralCode: string | null;
    userEmail: string | null;
  }>({ isOnWaitlist: false, hasEarlyAccess: false, referralCode: null, userEmail: null });
  const [showWaitlistNotification, setShowWaitlistNotification] = useState(false);
  const [showAccessRestrictedModal, setShowAccessRestrictedModal] = useState(false);
  const [accessRestrictedMessage, setAccessRestrictedMessage] = useState('');
  const { toast } = useToast();

  const signInForm = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' }
  });

  // Check device waitlist status on component mount
  useEffect(() => {
    async function checkDeviceWaitlistStatus() {
      try {
        const response = await fetch('/api/early-access/check-device');
        if (response.ok) {
          const data = await response.json();
          
          // Show waitlist status for any user on waitlist
          if (data.user) {
            setUserWaitlistStatus({
              isOnWaitlist: true,
              hasEarlyAccess: data.user.status === 'early_access',
              referralCode: data.user.referralCode,
              userEmail: data.user.email
            });
            
            // Pre-fill the email field
            signInForm.setValue('email', data.user.email);
            
            // Show waitlist notification only once after initial signup
            const notificationKey = `early-access-notification-dismissed-${data.user.email}`;
            const hasSeenNotification = localStorage.getItem(notificationKey);
            
            if (!hasSeenNotification) {
              setTimeout(() => {
                setShowWaitlistNotification(true);
              }, 1000);
            }
          }
        } else {
          console.log('Device not on waitlist or error checking:', await response.json().catch(() => ({})));
        }
      } catch (error) {
        console.log('Device not on waitlist or error checking:', error);
      }
    }

    checkDeviceWaitlistStatus();
  }, []);

  // Handle email/password authentication
  const handleEmailAuth = async (data: SignInForm) => {
    setIsLoading(true);
    try {
      const credential = await signInWithEmailAndPassword(auth, data.email, data.password);
      const user = credential.user;
      
      // Get Firebase ID token
      const idToken = await user.getIdToken();
      
      // Verify with backend
      const response = await fetch('/api/auth/verify-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        
        if (userData.user.isOnboarded) {
          setLocation('/dashboard');
        } else {
          setLocation('/onboarding');
        }
      } else {
        const errorData = await response.json();
        
        if (errorData.requiresWaitlist) {
          setAccessRestrictedMessage('You need to join our waitlist first to access VeeFore.');
          setShowAccessRestrictedModal(true);
        } else if (errorData.requiresApproval) {
          setAccessRestrictedMessage('Your account is pending approval. Please check your email for updates.');
          setShowAccessRestrictedModal(true);
        } else {
          toast({
            title: "Sign In Failed",
            description: errorData.message || "An error occurred during sign in",
            variant: "destructive",
          });
        }
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        title: "Sign In Failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google authentication
  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const credential = await signInWithPopup(auth, provider);
      const user = credential.user;
      
      // Get Firebase ID token
      const idToken = await user.getIdToken();
      
      // Verify with backend
      const response = await fetch('/api/auth/verify-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        
        if (userData.user.isOnboarded) {
          setLocation('/dashboard');
        } else {
          setLocation('/onboarding');
        }
      } else {
        const errorData = await response.json();
        
        if (errorData.requiresWaitlist) {
          setAccessRestrictedMessage('You need to join our waitlist first to access VeeFore.');
          setShowAccessRestrictedModal(true);
        } else if (errorData.requiresApproval) {
          setAccessRestrictedMessage('Your account is pending approval. Please check your email for updates.');
          setShowAccessRestrictedModal(true);
        } else {
          toast({
            title: "Sign In Failed",
            description: errorData.message || "An error occurred during sign in",
            variant: "destructive",
          });
        }
      }
    } catch (error: any) {
      console.error('Google sign in error:', error);
      toast({
        title: "Sign In Failed", 
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <FloatingParticle 
            key={i} 
            delay={i * 0.5} 
            size={Math.random() * 3 + 2}
            color={["blue", "purple", "pink", "indigo"][Math.floor(Math.random() * 4)]}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="w-full max-w-md relative z-10 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6"
        >
          <motion.div
            className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto relative"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute inset-0 rounded-full flex items-center justify-center">
              <motion.div 
                className="absolute inset-0 border-2 border-blue-400/30 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              />
              <motion.div 
                className="absolute inset-2 border border-purple-400/20 rounded-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </motion.div>

          <h1 className="text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              VeeFore
            </span>
          </h1>
          
          <motion.p 
            className="text-white/70 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Welcome Back to Your Galaxy
          </motion.p>
        </motion.div>

        {/* Auth Form */}
        <AuthCard>
          <div className="space-y-6">
            <form 
              onSubmit={signInForm.handleSubmit(handleEmailAuth)} 
              className="space-y-4"
            >
              <AnimatedInput
                icon={Mail}
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                {...signInForm.register('email')}
                error={signInForm.formState.errors.email?.message}
              />

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Password</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <Lock className="w-5 h-5 text-white/50" />
                  </div>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pl-12 pr-12 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-blue-400 focus:bg-white/10 transition-all duration-300"
                    {...signInForm.register('password')}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {signInForm.formState.errors.password && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-2 text-red-400 text-sm"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>{signInForm.formState.errors.password.message}</span>
                  </motion.div>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-3 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Signing In...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-slate-900 text-white/60">or continue with</span>
              </div>
            </div>

            {/* Google Sign In */}
            <Button
              type="button"
              variant="outline"
              className="w-full border-white/20 text-white hover:bg-white/10 py-3 relative overflow-hidden group"
              onClick={handleGoogleAuth}
              disabled={isLoading}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-yellow-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
              
              <span className="relative z-10 flex items-center justify-center">
                <FcGoogle className="w-5 h-5 mr-3" />
                Sign in with Google
              </span>
            </Button>

            {/* Navigation Links */}
            <div className="text-center space-y-4">
              <p className="text-white/60 text-sm">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setLocation('/signup')}
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Sign up
                </button>
              </p>
              
              <button
                type="button"
                className="text-white/60 hover:text-white text-sm flex items-center justify-center mx-auto transition-colors"
                onClick={() => setLocation('/')}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back to Home
              </button>
            </div>
          </div>
        </AuthCard>

        {/* Tagline */}
        <motion.div 
          className="text-center mt-8 text-white/40 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <p>Join thousands of creators transforming their social media</p>
        </motion.div>
      </div>

      {/* Waitlist Status Notification */}
      <WaitlistStatusNotification
        isOnWaitlist={userWaitlistStatus.isOnWaitlist}
        hasEarlyAccess={userWaitlistStatus.hasEarlyAccess}
        userEmail={userWaitlistStatus.userEmail || undefined}
        show={showWaitlistNotification}
        onClose={() => setShowWaitlistNotification(false)}
      />

      {/* Access Restricted Modal */}
      <AccessRestrictedModal
        isOpen={showAccessRestrictedModal}
        onClose={() => setShowAccessRestrictedModal(false)}
        approvedEmail={userWaitlistStatus.userEmail || 'arpitchoudhary128@gmail.com'}
        message={accessRestrictedMessage}
      />
    </div>
  );
}