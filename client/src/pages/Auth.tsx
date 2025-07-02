import { useState, useEffect, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useLocation, Link } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Rocket, 
  Mail, 
  Phone, 
  Lock, 
  Eye,
  EyeOff,
  User,
  Sparkles,
  Star,
  ChevronLeft,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signInWithCustomToken, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { SpaceBackground } from '@/components/ui/space-background';

// Form schemas
const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const signUpSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignInForm = z.infer<typeof signInSchema>;
type SignUpForm = z.infer<typeof signUpSchema>;

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

export default function Auth() {
  const [, setLocation] = useLocation();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [signupData, setSignupData] = useState<SignUpForm | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [developmentOtp, setDevelopmentOtp] = useState<string | null>(null);
  const { toast } = useToast();

  const signInForm = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' }
  });

  const signUpForm = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: '', password: '', confirmPassword: '', firstName: '', lastName: '' }
  });

  const currentForm = isSignUp ? signUpForm : signInForm;

  // Handle email/password authentication
  const handleEmailAuth = async (data: SignInForm | SignUpForm) => {
    setIsLoading(true);
    try {
      if (isSignUp) {
        const signUpData = data as SignUpForm;
        
        // Send verification email using our custom endpoint
        const response = await fetch('/api/auth/send-verification-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: signUpData.email,
            firstName: signUpData.firstName,
            lastName: signUpData.lastName,
            password: signUpData.password
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Failed to send verification email');
        }

        // Capture OTP for development testing
        if (result.developmentOtp) {
          setDevelopmentOtp(result.developmentOtp);
        }

        toast({
          title: "Verification Email Sent!",
          description: "Please check your email and enter the verification code to complete signup."
        });

        // Store signup data for verification step
        setSignupData(signUpData);
        setShowVerification(true);
        
      } else {
        const signInData = data as SignInForm;
        await signInWithEmailAndPassword(auth, signInData.email, signInData.password);
        toast({
          title: "Welcome Back!",
          description: "Signing you in to VeeFore..."
        });
      }
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message || "Failed to authenticate. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle email verification
  const handleVerification = async () => {
    if (!signupData || !verificationCode) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: signupData.email,
          otp: verificationCode,
          password: signupData.password,
          firstName: signupData.firstName,
          lastName: signupData.lastName
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Verification failed');
      }

      const result = await response.json();
      
      toast({
        title: "Email Verified!",
        description: "Your account has been created successfully. Signing you in..."
      });

      // Create Firebase user and automatically sign in after successful verification
      try {
        // First create the Firebase user
        const userCredential = await createUserWithEmailAndPassword(auth, signupData.email, signupData.password);
        
        // Update the user's display name
        if (userCredential.user && signupData.firstName) {
          await updateProfile(userCredential.user, {
            displayName: `${signupData.firstName} ${signupData.lastName || ''}`.trim()
          });
        }
        
        toast({
          title: "Welcome to VeeFore!",
          description: "Account created and signed in successfully."
        });
        
        // Navigation will be handled by Firebase auth state change
      } catch (firebaseError: any) {
        console.error('Firebase user creation error:', firebaseError);
        
        // If Firebase creation fails, try to sign in with existing user
        try {
          await signInWithEmailAndPassword(auth, signupData.email, signupData.password);
          
          toast({
            title: "Welcome to VeeFore!",
            description: "Successfully signed in to your account."
          });
        } catch (signInError: any) {
          // If both fail, show manual sign-in form
          setShowVerification(false);
          setSignupData(null);
          setVerificationCode('');
          setIsSignUp(false);
          
          toast({
            title: "Account Created Successfully!",
            description: "Please sign in with your email and password to continue."
          });
        }
      }

    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid verification code. Please try again.",
        variant: "destructive"
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
      provider.addScope('email');
      provider.addScope('profile');
      
      const result = await signInWithPopup(auth, provider);
      
      if (result.user) {
        toast({
          title: "Welcome to VeeFore!",
          description: "Successfully signed in with Google."
        });
      }
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      
      // Handle user cancellation gracefully
      if (error.code === 'auth/popup-closed-by-user') {
        toast({
          title: "Sign-in cancelled",
          description: "You can try again anytime.",
          variant: "default"
        });
      } else {
        toast({
          title: "Google Sign-In Error",
          description: error.message || "Failed to sign in with Google. Please try again.",
          variant: "destructive"
        });
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-space-navy text-white overflow-hidden relative flex items-center justify-center">
      <SpaceBackground />
      
      {/* Floating particles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <FloatingParticle 
          key={i} 
          delay={i * 0.5} 
          size={Math.random() > 0.5 ? 2 : 3}
          color={['blue', 'purple', 'pink'][Math.floor(Math.random() * 3)]}
        />
      ))}

      {/* Background glow effects */}
      <motion.div 
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div 
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.4, 0.7, 0.4]
        }}
        transition={{ duration: 10, repeat: Infinity, delay: 2 }}
      />

      <div className="max-w-md w-full mx-4 relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-block mb-4"
            animate={{ 
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              scale: { duration: 3, repeat: Infinity }
            }}
          >
            <div className="w-20 h-20 flex items-center justify-center relative">
              <img 
                src="/veefore-logo.png" 
                alt="VeeFore Logo" 
                className="w-16 h-16 object-contain relative z-10"
              />
              
              {/* Orbital rings */}
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
            {isSignUp ? 'Join the AI-Powered Social Galaxy' : 'Welcome Back to Your Galaxy'}
          </motion.p>
        </motion.div>

        {/* Auth Form */}
        <AuthCard>
          <AnimatePresence mode="wait">
            {showVerification ? (
              <motion.div
                key="verification"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
              >
                <div className="space-y-6">
                  <div className="text-center">
                    <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Verify Your Email
                    </h3>
                    <p className="text-white/70 text-sm">
                      We've sent a 6-digit verification code to {signupData?.email}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Development OTP Display - Only visible in development */}
                    {developmentOtp && (
                      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span className="text-yellow-400 text-sm font-medium">Development Mode</span>
                        </div>
                        <p className="text-yellow-300 text-sm mt-2">
                          For testing: Your OTP code is <span className="font-mono font-bold text-lg text-yellow-200">{developmentOtp}</span>
                        </p>
                      </div>
                    )}

                    <div>
                      <label className="text-sm font-medium text-white/80">Verification Code</label>
                      <Input
                        type="text"
                        placeholder="000000"
                        maxLength={6}
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                        className="text-center text-2xl tracking-widest bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-blue-400 focus:bg-white/10 transition-all duration-300"
                      />
                    </div>

                    <Button
                      onClick={handleVerification}
                      disabled={isLoading || verificationCode.length !== 6}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-3 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          <span>Verifying...</span>
                        </div>
                      ) : (
                        'Verify Email'
                      )}
                    </Button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowVerification(false);
                        setSignupData(null);
                        setVerificationCode('');
                      }}
                      className="w-full text-white/70 hover:text-white text-sm transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 inline mr-1" />
                      Back to Sign Up
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={isSignUp ? 'signup' : 'signin'}
                initial={{ opacity: 0, x: isSignUp ? 100 : -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isSignUp ? -100 : 100 }}
                transition={{ duration: 0.5 }}
              >
                <div className="space-y-6">
                  {/* Toggle buttons */}
                <div className="flex bg-white/5 rounded-lg p-1">
                  <button
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 ${
                      !isSignUp 
                        ? 'bg-blue-500 text-white shadow-lg' 
                        : 'text-white/70 hover:text-white'
                    }`}
                    onClick={() => setIsSignUp(false)}
                  >
                    Sign In
                  </button>
                  <button
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 ${
                      isSignUp 
                        ? 'bg-blue-500 text-white shadow-lg' 
                        : 'text-white/70 hover:text-white'
                    }`}
                    onClick={() => setIsSignUp(true)}
                  >
                    Sign Up
                  </button>
                </div>

                <form 
                  onSubmit={currentForm.handleSubmit(handleEmailAuth)} 
                  className="space-y-4"
                >
                  {isSignUp && (
                    <div className="grid grid-cols-2 gap-4">
                      <AnimatedInput
                        icon={User}
                        label="First Name"
                        placeholder="John"
                        {...signUpForm.register('firstName')}
                        error={signUpForm.formState.errors.firstName?.message}
                      />
                      <AnimatedInput
                        icon={User}
                        label="Last Name"
                        placeholder="Doe"
                        {...signUpForm.register('lastName')}
                        error={signUpForm.formState.errors.lastName?.message}
                      />
                    </div>
                  )}

                  <AnimatedInput
                    icon={Mail}
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    {...(isSignUp ? signUpForm.register('email') : signInForm.register('email'))}
                    error={isSignUp ? signUpForm.formState.errors.email?.message : signInForm.formState.errors.email?.message}
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
                        {...(isSignUp ? signUpForm.register('password') : signInForm.register('password'))}
                      />
                      <button
                        type="button"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {(isSignUp ? signUpForm.formState.errors.password : signInForm.formState.errors.password) && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center space-x-2 text-red-400 text-sm"
                      >
                        <AlertCircle className="w-4 h-4" />
                        <span>{(isSignUp ? signUpForm.formState.errors.password : signInForm.formState.errors.password)?.message}</span>
                      </motion.div>
                    )}
                  </div>

                  {isSignUp && (
                    <AnimatedInput
                      icon={Lock}
                      label="Confirm Password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      {...signUpForm.register('confirmPassword')}
                      error={signUpForm.formState.errors.confirmPassword?.message}
                    />
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 font-semibold shadow-xl shadow-blue-500/25 relative overflow-hidden group"
                    disabled={isLoading}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    
                    <span className="relative z-10 flex items-center justify-center">
                      {isLoading ? (
                        <motion.div
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                      ) : (
                        <>
                          {isSignUp ? 'Create Account' : 'Sign In'}
                          <Sparkles className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform" />
                        </>
                      )}
                    </span>
                  </Button>
                </form>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-space-navy text-white/60">or continue with</span>
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
                    {isSignUp ? 'Sign up with Google' : 'Sign in with Google'}
                  </span>
                </Button>

                {/* Back to landing */}
                <div className="text-center pt-4">
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
            </motion.div>
            )}
          </AnimatePresence>
        </AuthCard>

        {/* Footer */}
        <motion.div 
          className="text-center mt-8 text-white/40 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <p>Join thousands of creators transforming their social media</p>
          <div className="flex items-center justify-center gap-6 mt-4">
            <Link href="/privacy-policy">
              <motion.span
                whileHover={{ scale: 1.05, color: "#ffffff" }}
                className="text-xs text-white/40 hover:text-white transition-colors cursor-pointer"
              >
                Privacy Policy
              </motion.span>
            </Link>
            <Link href="/terms-of-service">
              <motion.span
                whileHover={{ scale: 1.05, color: "#ffffff" }}
                className="text-xs text-white/40 hover:text-white transition-colors cursor-pointer"
              >
                Terms of Service
              </motion.span>
            </Link>
          </div>
          <div className="mt-4 pt-3 border-t border-white/10">
            <p className="text-xs text-white/30">
              © 2025 Veefore — A product of VEEFED TECHNOLOGIES PRIVATE LIMITED
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}