import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLocation, Link } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useWorkspaceContext } from '@/hooks/useWorkspace';
import { apiRequest } from '@/lib/queryClient';
import veeforeLogo from "@assets/output-onlinepngtools_1752061059889.png";
import { 
  Eye, 
  EyeOff, 
  User, 
  Mail, 
  Check, 
  X, 
  ArrowLeft, 
  ArrowRight,
  Rocket,
  Instagram,
  Building,
  Camera,
  Video,
  FileText,
  Users,
  Heart,
  Gamepad2,
  Music,
  Plane,
  GraduationCap,
  Utensils,
  Shirt,
  Dumbbell,
  Code,
  Car,
  Home,
  ShoppingCart,
  Baby,
  PawPrint,
  Star,
  Sparkles,
  Target,
  TrendingUp,
  Palette,
  MessageSquare,
  CheckCircle,
  Crown,
  Zap,
  Globe,
  Shield,
  Briefcase,
  Timer,
  BarChart3,
  BrainCircuit,
  Send
} from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const signUpSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character')
});

type SignUpForm = z.infer<typeof signUpSchema>;

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    monthlyPrice: 0,
    yearlyPrice: 0,
    period: 'Forever',
    description: 'Perfect for getting started',
    credits: 20,
    features: [
      '20 AI credits per month',
      '1 workspace',
      '1 social account',
      'Basic AI content generator',
      'Community support'
    ],
    popular: false,
    color: 'gray'
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 699,
    monthlyPrice: 699,
    yearlyPrice: 699 * 12 * 0.7, // 30% discount
    period: 'month',
    description: 'Ideal for individual creators',
    credits: 300,
    features: [
      '300 AI credits per month',
      '1 workspace',
      '2 social accounts',
      'All AI tools access',
      'Priority support',
      'Advanced analytics'
    ],
    popular: true,
    color: 'blue'
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 1499,
    monthlyPrice: 1499,
    yearlyPrice: 1499 * 12 * 0.7,
    period: 'month',
    description: 'Best for growing businesses',
    credits: 1100,
    features: [
      '1,100 AI credits per month',
      '2 workspaces',
      '1 social account per workspace',
      'AI Thumbnail Maker Pro',
      'Competitor analysis',
      'Team collaboration (2 members)',
      'Advanced automation'
    ],
    popular: false,
    color: 'purple'
  },
  {
    id: 'business',
    name: 'Business',
    price: 2199,
    monthlyPrice: 2199,
    yearlyPrice: 2199 * 12 * 0.7,
    period: 'month',
    description: 'For agencies and enterprises',
    credits: 2000,
    features: [
      '2,000 AI credits per month',
      '8 workspaces',
      '4 social accounts per workspace',
      'All premium features',
      'Team collaboration (3 members)',
      'Priority support',
      'Advanced analytics',
      'API access'
    ],
    popular: false,
    color: 'emerald'
  }
];

const niches = [
  { id: 'lifestyle', name: 'Lifestyle', icon: Heart },
  { id: 'fashion', name: 'Fashion', icon: Shirt },
  { id: 'fitness', name: 'Fitness', icon: Dumbbell },
  { id: 'food', name: 'Food', icon: Utensils },
  { id: 'travel', name: 'Travel', icon: Plane },
  { id: 'tech', name: 'Tech', icon: Code },
  { id: 'business', name: 'Business', icon: Briefcase },
  { id: 'education', name: 'Education', icon: GraduationCap },
  { id: 'entertainment', name: 'Entertainment', icon: Gamepad2 },
  { id: 'music', name: 'Music', icon: Music },
  { id: 'automotive', name: 'Automotive', icon: Car },
  { id: 'home', name: 'Home & Garden', icon: Home },
  { id: 'shopping', name: 'Shopping', icon: ShoppingCart },
  { id: 'parenting', name: 'Parenting', icon: Baby },
  { id: 'pets', name: 'Pets', icon: PawPrint }
];

export default function SignUpWithOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [signupData, setSignupData] = useState<SignUpForm | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [developmentOtp, setDevelopmentOtp] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [preferences, setPreferences] = useState({
    selectedNiches: [] as string[],
    contentTypes: [] as string[],
    tone: '',
    businessName: '',
    description: ''
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { currentWorkspace } = useWorkspaceContext();

  const form = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { fullName: '', email: '', password: '' }
  });

  const watchedPassword = form.watch('password');

  const { data: socialAccounts = [] } = useQuery({
    queryKey: ['/api/social-accounts'],
    enabled: currentStep === 3
  });

  const { data: workspaces = [] } = useQuery({
    queryKey: ['/api/workspaces'],
    enabled: !!user
  });

  // Check if user is already authenticated and onboarded
  useEffect(() => {
    if (user && user.isOnboarded) {
      setLocation('/dashboard');
    }
  }, [user, setLocation]);

  // Step progression logic
  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Step 1: Sign Up
  const handleSignUp = async (data: SignUpForm) => {
    setIsLoading(true);
    setSignupData(data);

    try {
      // Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      
      // Send verification email
      const response = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.developmentOtp) {
          setDevelopmentOtp(result.developmentOtp);
        }
        nextStep();
        toast({
          title: "Verification email sent!",
          description: "Please check your email and enter the verification code."
        });
      } else {
        throw new Error('Failed to send verification email');
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast({
        title: "Sign up failed",
        description: error.message || "An error occurred during sign up",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Google Sign Up
  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      if (result.user) {
        setSignupData({
          fullName: result.user.displayName || '',
          email: result.user.email || '',
          password: '' // Not needed for Google sign up
        });
        
        // Skip email verification for Google users
        setCurrentStep(2);
      }
    } catch (error: any) {
      console.error('Google sign-up error:', error);
      toast({
        title: "Google sign up failed",
        description: error.message || "An error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify Email
  const handleVerifyEmail = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: signupData?.email,
          code: verificationCode
        })
      });

      if (response.ok) {
        nextStep();
        toast({
          title: "Email verified!",
          description: "Now choose your plan to continue."
        });
      } else {
        throw new Error('Invalid verification code');
      }
    } catch (error: any) {
      toast({
        title: "Verification failed",
        description: error.message || "Please check your code and try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Select Plan
  const handlePlanSelection = async () => {
    if (!selectedPlan) {
      toast({
        title: "Plan selection required",
        description: "Please select a plan to continue",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/select-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          planId: selectedPlan,
          billingPeriod: billingPeriod
        })
      });

      if (response.ok) {
        nextStep();
        toast({
          title: "Plan selected!",
          description: "Now let's connect your social accounts."
        });
      } else {
        throw new Error('Failed to select plan');
      }
    } catch (error: any) {
      toast({
        title: "Plan selection failed",
        description: error.message || "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Step 4: Connect Social Accounts
  const handleInstagramConnect = () => {
    localStorage.setItem('onboarding_current_step', '4');
    localStorage.setItem('onboarding_returning_from_oauth', 'true');
    window.location.href = '/api/instagram/auth';
  };

  // Step 5: Complete Onboarding
  const handleCompleteOnboarding = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/user/complete-onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferences })
      });

      if (response.ok) {
        localStorage.setItem('onboarding_just_completed', 'true');
        queryClient.invalidateQueries({ queryKey: ['/api/user'] });
        toast({
          title: "Welcome to VeeFore!",
          description: "Your account has been set up successfully."
        });
        setLocation('/dashboard');
      } else {
        throw new Error('Failed to complete onboarding');
      }
    } catch (error: any) {
      toast({
        title: "Setup failed",
        description: error.message || "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { id: 'signup', title: 'Sign Up', icon: User },
    { id: 'verify', title: 'Verify Email', icon: Mail },
    { id: 'plan', title: 'Choose Plan', icon: Crown },
    { id: 'connect', title: 'Connect Social', icon: Instagram },
    { id: 'personalize', title: 'Personalize', icon: Sparkles }
  ];

  return (
    <div className="min-h-screen bg-green-50 flex">
      {/* Left Side - Mascot/Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-green-100 items-center justify-center p-8">
        <div className="text-center">
          <div className="w-80 h-80 bg-red-500 rounded-full flex items-center justify-center mb-8 mx-auto relative">
            {/* VeeFore Rocket Mascot */}
            <div className="text-white text-8xl">
              <Rocket className="w-32 h-32" />
            </div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="w-24 h-3 bg-red-400 rounded-full opacity-50"></div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Launch Your Social Media Success
          </h2>
          <p className="text-gray-600 text-lg">
            Join thousands of creators using AI to grow their social media presence
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center space-x-2 hover:opacity-80">
                <img src={veeforeLogo} alt="VeeFore" className="w-8 h-8 object-contain" />
                <span className="text-xl font-bold text-gray-900">VeeFore</span>
              </Link>
            </div>
            <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm">
              Back to Home
            </Link>
          </div>
        </div>

        {/* Step Progress */}
        <div className="px-8 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep + 1} of {steps.length}
            </span>
            {currentStep > 0 && (
              <Button
                onClick={prevStep}
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            )}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 px-8 py-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            {/* Step 1: Sign Up */}
            {currentStep === 0 && (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="max-w-md mx-auto">
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      Let's create your account
                    </h1>
                    <p className="text-gray-600">
                      Sign up with social and add your first social account in one step
                    </p>
                  </div>

                  {/* Social Login Options */}
                  <div className="flex justify-center space-x-4 mb-6">
                    <Button
                      onClick={handleGoogleSignUp}
                      variant="outline"
                      size="lg"
                      className="w-12 h-12 rounded-lg border-2 border-gray-300 hover:border-blue-500 p-0"
                      disabled={isLoading}
                    >
                      <FcGoogle className="w-6 h-6" />
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-12 h-12 rounded-lg border-2 border-gray-300 hover:border-blue-500 p-0"
                      disabled
                    >
                      <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">f</span>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-12 h-12 rounded-lg border-2 border-gray-300 hover:border-blue-500 p-0"
                      disabled
                    >
                      <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">in</span>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-12 h-12 rounded-lg border-2 border-gray-300 hover:border-blue-500 p-0"
                      disabled
                    >
                      <X className="w-6 h-6" />
                    </Button>
                  </div>

                  <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-white px-2 text-gray-500">or</span>
                    </div>
                  </div>

                  <form onSubmit={form.handleSubmit(handleSignUp)} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full name
                      </label>
                      <Input
                        {...form.register('fullName')}
                        className="w-full h-12 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500"
                      />
                      {form.formState.errors.fullName && (
                        <p className="text-red-500 text-sm mt-1">
                          {form.formState.errors.fullName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business email address
                      </label>
                      <p className="text-xs text-gray-500 mb-2">
                        Note that you will be required to verify this email address.
                      </p>
                      <Input
                        type="email"
                        {...form.register('email')}
                        className="w-full h-12 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500"
                      />
                      {form.formState.errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {form.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          {...form.register('password')}
                          className="w-full h-12 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500 pr-10"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      
                      {watchedPassword && (
                        <div className="mt-2 text-xs text-gray-500">
                          <p className="mb-1">Passwords must contain:</p>
                          <div className="space-y-1">
                            <div className={`flex items-center space-x-2 ${watchedPassword.length >= 8 ? 'text-green-600' : 'text-red-500'}`}>
                              {watchedPassword.length >= 8 ? (
                                <Check className="w-3 h-3" />
                              ) : (
                                <X className="w-3 h-3" />
                              )}
                              <span>At least 8 characters</span>
                            </div>
                            <div className={`flex items-center space-x-2 ${/[a-z]/.test(watchedPassword) && /[A-Z]/.test(watchedPassword) ? 'text-green-600' : 'text-red-500'}`}>
                              {/[a-z]/.test(watchedPassword) && /[A-Z]/.test(watchedPassword) ? (
                                <Check className="w-3 h-3" />
                              ) : (
                                <X className="w-3 h-3" />
                              )}
                              <span>A mix of uppercase and lowercase letters</span>
                            </div>
                            <div className={`flex items-center space-x-2 ${/[0-9]/.test(watchedPassword) ? 'text-green-600' : 'text-red-500'}`}>
                              {/[0-9]/.test(watchedPassword) ? (
                                <Check className="w-3 h-3" />
                              ) : (
                                <X className="w-3 h-3" />
                              )}
                              <span>At least one number</span>
                            </div>
                            <div className={`flex items-center space-x-2 ${/[^a-zA-Z0-9]/.test(watchedPassword) ? 'text-green-600' : 'text-red-500'}`}>
                              {/[^a-zA-Z0-9]/.test(watchedPassword) ? (
                                <Check className="w-3 h-3" />
                              ) : (
                                <X className="w-3 h-3" />
                              )}
                              <span>At least one symbol</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg mt-6"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Creating account...' : 'Create my account'}
                    </Button>
                  </form>

                  <div className="text-center mt-6">
                    <p className="text-xs text-gray-500 mb-4">
                      By creating an account, you agree to our{' '}
                      <Link href="/terms-of-service" className="text-blue-600 hover:underline">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy-policy" className="text-blue-600 hover:underline">
                        Privacy Policy
                      </Link>
                    </p>
                    <p className="text-sm text-gray-600">
                      Already have an account?{' '}
                      <Link href="/signin" className="text-blue-600 hover:underline font-medium">
                        Sign in
                      </Link>
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Verify Email */}
            {currentStep === 1 && (
              <motion.div
                key="verify"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="max-w-md mx-auto text-center">
                  <div className="mb-8">
                    <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      Verify your email
                    </h1>
                    <p className="text-gray-600">
                      We've sent a 6-digit verification code to<br />
                      <span className="font-medium">{signupData?.email}</span>
                    </p>
                  </div>

                  {developmentOtp && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                      <p className="text-sm text-yellow-800">
                        <strong>Development Mode:</strong> Your verification code is: <code className="font-mono bg-yellow-100 px-1 rounded">{developmentOtp}</code>
                      </p>
                    </div>
                  )}
                  
                  <div className="mb-6">
                    <Input
                      placeholder="Enter 6-digit code"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className="w-full h-12 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500 text-center text-lg font-mono"
                      maxLength={6}
                    />
                  </div>

                  <Button
                    onClick={handleVerifyEmail}
                    className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg"
                    disabled={isLoading || verificationCode.length !== 6}
                  >
                    {isLoading ? 'Verifying...' : 'Verify Email'}
                  </Button>

                  <p className="text-sm text-gray-500 mt-4">
                    Didn't receive the code?{' '}
                    <button className="text-blue-600 hover:underline">
                      Resend code
                    </button>
                  </p>
                </div>
              </motion.div>
            )}

            {/* Step 3: Choose Plan */}
            {currentStep === 2 && (
              <motion.div
                key="plan"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-0 shadow-lg bg-white">
                  <CardHeader className="text-center pb-6">
                    <div className="w-20 h-20 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Crown className="w-10 h-10 text-white" />
                    </div>
                    <CardTitle className="text-2xl text-gray-900">
                      Choose your plan
                    </CardTitle>
                    <p className="text-gray-600 mt-2">
                      Select the plan that best fits your needs
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex justify-center">
                      <div className="bg-gray-100 rounded-lg p-1 flex">
                        <button
                          onClick={() => setBillingPeriod('monthly')}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            billingPeriod === 'monthly' 
                              ? 'bg-white text-gray-900 shadow-sm' 
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          Monthly
                        </button>
                        <button
                          onClick={() => setBillingPeriod('yearly')}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            billingPeriod === 'yearly' 
                              ? 'bg-white text-gray-900 shadow-sm' 
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          Yearly
                          <span className="ml-2 text-green-600 font-semibold">Save 30%</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {plans.map((plan) => (
                        <div
                          key={plan.id}
                          onClick={() => setSelectedPlan(plan.id)}
                          className={`relative p-6 rounded-lg border-2 cursor-pointer transition-all ${
                            selectedPlan === plan.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {plan.popular && (
                            <Badge className="absolute -top-2 left-4 bg-red-500 text-white">
                              Most Popular
                            </Badge>
                          )}
                          
                          <div className="text-center">
                            <h3 className="font-semibold text-lg text-gray-900">{plan.name}</h3>
                            <div className="mt-2">
                              <span className="text-3xl font-bold text-gray-900">
                                ₹{billingPeriod === 'yearly' ? Math.round(plan.yearlyPrice / 12) : plan.monthlyPrice}
                              </span>
                              <span className="text-gray-600 ml-1">
                                /{billingPeriod === 'yearly' ? 'month' : plan.period}
                              </span>
                            </div>
                            {billingPeriod === 'yearly' && plan.price > 0 && (
                              <p className="text-sm text-green-600 mt-1">
                                Save ₹{Math.round((plan.monthlyPrice * 12) - plan.yearlyPrice)} per year
                              </p>
                            )}
                            <p className="text-gray-600 text-sm mt-2">{plan.description}</p>
                          </div>

                          <div className="mt-4 space-y-2">
                            {plan.features.map((feature, index) => (
                              <div key={index} className="flex items-center text-sm text-gray-600">
                                <Check className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                                {feature}
                              </div>
                            ))}
                          </div>

                          {selectedPlan === plan.id && (
                            <div className="absolute inset-0 rounded-lg border-2 border-blue-500 bg-blue-50 bg-opacity-10 flex items-center justify-center">
                              <div className="bg-blue-500 text-white rounded-full p-2">
                                <Check className="w-6 h-6" />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={prevStep}
                        variant="outline"
                        className="flex-1 h-12 border-gray-300"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                      </Button>
                      <Button
                        onClick={handlePlanSelection}
                        className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={isLoading || !selectedPlan}
                      >
                        {isLoading ? 'Selecting...' : 'Continue'}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 4: Connect Social */}
            {currentStep === 3 && (
              <motion.div
                key="connect"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-0 shadow-lg bg-white">
                  <CardHeader className="text-center pb-6">
                    <div className="w-20 h-20 bg-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Instagram className="w-10 h-10 text-white" />
                    </div>
                    <CardTitle className="text-2xl text-gray-900">
                      Connect your social accounts
                    </CardTitle>
                    <p className="text-gray-600 mt-2">
                      Connect Instagram to start managing your content
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                            <Instagram className="w-5 h-5 text-pink-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">Instagram</h3>
                            <p className="text-sm text-gray-600">Connect your Instagram account</p>
                          </div>
                        </div>
                        <Button
                          onClick={handleInstagramConnect}
                          className="bg-pink-600 hover:bg-pink-700 text-white"
                        >
                          Connect
                        </Button>
                      </div>

                      {socialAccounts.length > 0 && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <h4 className="font-medium text-green-900 mb-2">Connected Accounts</h4>
                          {socialAccounts.map((account: any) => (
                            <div key={account.id} className="flex items-center space-x-2 text-sm text-green-800">
                              <Check className="w-4 h-4" />
                              <span>@{account.username}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={prevStep}
                        variant="outline"
                        className="flex-1 h-12 border-gray-300"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                      </Button>
                      <Button
                        onClick={nextStep}
                        className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {socialAccounts.length > 0 ? 'Continue' : 'Skip for now'}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 5: Personalize */}
            {currentStep === 4 && (
              <motion.div
                key="personalize"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-0 shadow-lg bg-white">
                  <CardHeader className="text-center pb-6">
                    <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-10 h-10 text-white" />
                    </div>
                    <CardTitle className="text-2xl text-gray-900">
                      Personalize your experience
                    </CardTitle>
                    <p className="text-gray-600 mt-2">
                      Tell us about your content to get better AI suggestions
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Business Name (Optional)
                      </label>
                      <Input
                        placeholder="Your business or brand name"
                        value={preferences.businessName}
                        onChange={(e) => setPreferences(prev => ({ ...prev, businessName: e.target.value }))}
                        className="h-12 border-gray-300 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        What niches are you interested in?
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {niches.map((niche) => {
                          const Icon = niche.icon;
                          const isSelected = preferences.selectedNiches.includes(niche.id);
                          
                          return (
                            <button
                              key={niche.id}
                              onClick={() => {
                                setPreferences(prev => ({
                                  ...prev,
                                  selectedNiches: isSelected
                                    ? prev.selectedNiches.filter(id => id !== niche.id)
                                    : [...prev.selectedNiches, niche.id]
                                }));
                              }}
                              className={`p-3 rounded-lg border-2 transition-all ${
                                isSelected
                                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <Icon className="w-5 h-5 mx-auto mb-1" />
                              <span className="text-xs font-medium">{niche.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Content Types
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { id: 'posts', name: 'Posts', icon: FileText },
                          { id: 'stories', name: 'Stories', icon: Camera },
                          { id: 'reels', name: 'Reels', icon: Video },
                          { id: 'live', name: 'Live', icon: Users }
                        ].map((type) => {
                          const Icon = type.icon;
                          const isSelected = preferences.contentTypes.includes(type.id);
                          
                          return (
                            <button
                              key={type.id}
                              onClick={() => {
                                setPreferences(prev => ({
                                  ...prev,
                                  contentTypes: isSelected
                                    ? prev.contentTypes.filter(id => id !== type.id)
                                    : [...prev.contentTypes, type.id]
                                }));
                              }}
                              className={`p-4 rounded-lg border-2 transition-all ${
                                isSelected
                                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <Icon className="w-6 h-6 mx-auto mb-2" />
                              <span className="text-sm font-medium">{type.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Brand Voice
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { id: 'professional', name: 'Professional' },
                          { id: 'casual', name: 'Casual' },
                          { id: 'fun', name: 'Fun & Playful' },
                          { id: 'inspirational', name: 'Inspirational' }
                        ].map((tone) => (
                          <button
                            key={tone.id}
                            onClick={() => setPreferences(prev => ({ ...prev, tone: tone.id }))}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              preferences.tone === tone.id
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <span className="text-sm font-medium">{tone.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={prevStep}
                        variant="outline"
                        className="flex-1 h-12 border-gray-300"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                      </Button>
                      <Button
                        onClick={handleCompleteOnboarding}
                        className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Setting up...' : 'Complete Setup'}
                        <Send className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <select className="text-sm border-none bg-transparent">
                <option>English</option>
              </select>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/privacy-policy" className="hover:text-gray-700">Privacy</Link>
              <Link href="/terms-of-service" className="hover:text-gray-700">Terms</Link>
              <Link href="/help" className="hover:text-gray-700">Help</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}