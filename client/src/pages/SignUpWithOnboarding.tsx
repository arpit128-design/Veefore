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
  Send,
  Plus,
  Minus,
  CreditCard,
  Gift
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
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [preferences, setPreferences] = useState({
    selectedNiches: [] as string[],
    contentTypes: [] as string[],
    tone: '',
    businessName: '',
    description: '',
    businessType: '',
    teamSize: '',
    primaryGoal: '',
    audience: '',
    postingFrequency: '',
    brandVoice: '',
    location: '',
    industry: '',
    website: '',
    companySize: ''
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

    const selectedPlanData = plans.find(p => p.id === selectedPlan);
    
    // If it's a paid plan, show payment first
    if (selectedPlanData && selectedPlanData.price > 0) {
      setShowPayment(true);
      return;
    }

    // If it's free plan, proceed directly
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

  // Handle Payment Success
  const handlePaymentSuccess = async () => {
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
        setShowPayment(false);
        nextStep();
        toast({
          title: "Payment successful!",
          description: "Your plan has been activated. Let's connect your social accounts."
        });
      } else {
        throw new Error('Failed to confirm payment');
      }
    } catch (error: any) {
      toast({
        title: "Payment confirmation failed",
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
        // Mark onboarding as completed and show welcome popup
        localStorage.setItem('onboarding_just_completed', 'true');
        localStorage.setItem('should_show_welcome_popup', 'true');
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
      <div className="hidden lg:flex lg:w-1/2 bg-green-100 items-center justify-center p-8 relative">
        {/* Back to Home Button - Desktop Only */}
        <div className="absolute top-8 left-8">
          <Link 
            href="/" 
            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </Link>
        </div>
        
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
        {/* Header - Mobile Only */}
        <div className="lg:hidden px-8 py-6 border-b border-gray-200">
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
        <div className="px-8 py-4 lg:py-6 border-b border-gray-200">
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
          {/* Payment Modal */}
          {showPayment && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-8 max-w-md w-full">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Complete Payment
                  </h3>
                  <p className="text-gray-600">
                    Secure payment to activate your {plans.find(p => p.id === selectedPlan)?.name} plan
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Plan:</span>
                    <span className="font-semibold">{plans.find(p => p.id === selectedPlan)?.name}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Credits:</span>
                    <span className="font-semibold">{plans.find(p => p.id === selectedPlan)?.credits}/month</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span className="text-gray-900">Total:</span>
                    <span className="text-blue-600">₹{plans.find(p => p.id === selectedPlan)?.price}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handlePaymentSuccess}
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : 'Complete Payment'}
                  </Button>
                  <Button
                    onClick={() => setShowPayment(false)}
                    variant="outline"
                    className="w-full h-12 border-gray-300"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

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
                <div className="max-w-2xl mx-auto">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Crown className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Choose your plan
                    </h2>
                    <p className="text-gray-600">
                      Start with the perfect plan for your social media journey
                    </p>
                  </div>

                  <div className="space-y-4">
                    {plans.map((plan) => (
                      <div
                        key={plan.id}
                        className={`relative rounded-xl border-2 transition-all hover:shadow-md ${
                          selectedPlan === plan.id
                            ? 'border-blue-500 bg-blue-50 shadow-lg'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        {plan.popular && (
                          <div className="absolute -top-3 left-6 bg-red-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                            Most Popular
                          </div>
                        )}
                        
                        <div 
                          onClick={() => setSelectedPlan(plan.id)}
                          className="p-6 cursor-pointer"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                plan.id === 'free' ? 'bg-gray-100' :
                                plan.id === 'starter' ? 'bg-blue-100' :
                                plan.id === 'pro' ? 'bg-purple-100' :
                                'bg-orange-100'
                              }`}>
                                <span className="text-2xl font-bold text-gray-700">
                                  {plan.id === 'free' ? '🆓' :
                                   plan.id === 'starter' ? '🚀' :
                                   plan.id === 'pro' ? '⭐' : '👑'}
                                </span>
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                                <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
                                <div className="flex items-center space-x-4 mt-2">
                                  <span className="text-sm text-gray-500">
                                    {plan.features[0]} • {plan.features[1]}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                              <div className="text-right">
                                <div className="text-2xl font-bold text-gray-900">
                                  ₹{plan.monthlyPrice}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {plan.period}
                                </div>
                                {selectedPlan === plan.id && (
                                  <div className="mt-2">
                                    <div className="bg-blue-500 text-white rounded-full p-1">
                                      <Check className="w-4 h-4" />
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedPlan(expandedPlan === plan.id ? null : plan.id);
                                }}
                                className="p-2 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors"
                              >
                                {expandedPlan === plan.id ? (
                                  <Minus className="w-4 h-4 text-gray-600" />
                                ) : (
                                  <Plus className="w-4 h-4 text-gray-600" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Expanded Details */}
                        {expandedPlan === plan.id && (
                          <div className="px-6 pb-6 border-t border-gray-200 pt-4">
                            <div className="grid md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-3">All Features</h4>
                                <div className="space-y-2">
                                  {plan.features.map((feature, index) => (
                                    <div key={index} className="flex items-center text-sm text-gray-600">
                                      <Check className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                                      {feature}
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-3">What's Included</h4>
                                <div className="space-y-3 text-sm text-gray-600">
                                  <div className="flex items-center">
                                    <Zap className="w-4 h-4 text-blue-600 mr-2" />
                                    <span>{plan.credits} AI credits monthly</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Building className="w-4 h-4 text-purple-600 mr-2" />
                                    <span>
                                      {plan.id === 'free' || plan.id === 'starter' ? '1 workspace' :
                                       plan.id === 'pro' ? '2 workspaces' : '8 workspaces'}
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    <Users className="w-4 h-4 text-green-600 mr-2" />
                                    <span>
                                      {plan.id === 'free' || plan.id === 'starter' ? 'Solo account' :
                                       plan.id === 'pro' ? 'Team of 2 members' : 'Team of 3 members'}
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    <Shield className="w-4 h-4 text-orange-600 mr-2" />
                                    <span>
                                      {plan.id === 'free' ? 'Community support' : 
                                       plan.id === 'starter' ? 'Priority support' : 'Premium support'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                      You can upgrade or downgrade anytime from your account settings
                    </p>
                  </div>

                  <div className="flex gap-3 mt-8">
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
                </div>
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
                      {socialAccounts.length > 0 ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <h4 className="font-medium text-green-900 mb-3">Connected Accounts</h4>
                          {socialAccounts.map((account: any) => (
                            <div key={account.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-200">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                  <Instagram className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                  <h3 className="font-medium text-gray-900">@{account.username}</h3>
                                  <p className="text-sm text-green-600">Connected successfully</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Check className="w-5 h-5 text-green-600" />
                                <span className="text-sm text-green-600 font-medium">Connected</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
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
                className="max-w-5xl mx-auto"
              >
                <div className="bg-gradient-to-br from-green-50 to-blue-50 min-h-screen flex">
                  {/* Left side with mascot/illustration */}
                  <div className="w-1/2 flex items-center justify-center p-8">
                    <div className="w-80 h-80 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center relative">
                      <div className="w-60 h-60 bg-white rounded-full flex items-center justify-center shadow-2xl">
                        <Sparkles className="w-20 h-20 text-indigo-600" />
                      </div>
                      <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
                        <Star className="w-8 h-8 text-white" />
                      </div>
                      <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                        <Heart className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Right side with form */}
                  <div className="w-1/2 p-8 flex flex-col justify-center">
                    <div className="bg-white rounded-2xl shadow-xl p-8 max-h-[90vh] overflow-y-auto">
                      <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                          Personalize your experience
                        </h2>
                        <p className="text-gray-600">
                          Tell us about your business to get better AI suggestions
                        </p>
                      </div>

                      <div className="space-y-6">
                        {/* Business Information */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Business Name
                            </label>
                            <Input
                              placeholder="Your business or brand name"
                              value={preferences.businessName}
                              onChange={(e) => setPreferences(prev => ({ ...prev, businessName: e.target.value }))}
                              className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white text-gray-900"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Website
                            </label>
                            <Input
                              placeholder="www.yourwebsite.com"
                              value={preferences.website}
                              onChange={(e) => setPreferences(prev => ({ ...prev, website: e.target.value }))}
                              className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white text-gray-900"
                            />
                          </div>
                        </div>

                        {/* Business Type & Industry */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Business Type
                            </label>
                            <select
                              value={preferences.businessType}
                              onChange={(e) => setPreferences(prev => ({ ...prev, businessType: e.target.value }))}
                              className="h-12 w-full border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 bg-white text-gray-900"
                            >
                              <option value="">Select business type</option>
                              <option value="personal-brand">Personal Brand</option>
                              <option value="small-business">Small Business</option>
                              <option value="startup">Startup</option>
                              <option value="enterprise">Enterprise</option>
                              <option value="agency">Agency</option>
                              <option value="nonprofit">Non-profit</option>
                              <option value="ecommerce">E-commerce</option>
                              <option value="consultant">Consultant</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Industry
                            </label>
                            <select
                              value={preferences.industry}
                              onChange={(e) => setPreferences(prev => ({ ...prev, industry: e.target.value }))}
                              className="h-12 w-full border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 bg-white text-gray-900"
                            >
                              <option value="">Select industry</option>
                              <option value="technology">Technology</option>
                              <option value="healthcare">Healthcare</option>
                              <option value="finance">Finance</option>
                              <option value="retail">Retail</option>
                              <option value="education">Education</option>
                              <option value="food-beverage">Food & Beverage</option>
                              <option value="fashion">Fashion</option>
                              <option value="travel">Travel & Tourism</option>
                              <option value="fitness">Fitness & Wellness</option>
                              <option value="real-estate">Real Estate</option>
                              <option value="automotive">Automotive</option>
                              <option value="entertainment">Entertainment</option>
                            </select>
                          </div>
                        </div>

                        {/* Team Size & Company Size */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Team Size
                            </label>
                            <select
                              value={preferences.teamSize}
                              onChange={(e) => setPreferences(prev => ({ ...prev, teamSize: e.target.value }))}
                              className="h-12 w-full border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 bg-white text-gray-900"
                            >
                              <option value="">Select team size</option>
                              <option value="just-me">Just me</option>
                              <option value="2-5">2-5 people</option>
                              <option value="6-10">6-10 people</option>
                              <option value="11-25">11-25 people</option>
                              <option value="26-50">26-50 people</option>
                              <option value="51-100">51-100 people</option>
                              <option value="100+">100+ people</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Company Size
                            </label>
                            <select
                              value={preferences.companySize}
                              onChange={(e) => setPreferences(prev => ({ ...prev, companySize: e.target.value }))}
                              className="h-12 w-full border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 bg-white text-gray-900"
                            >
                              <option value="">Select company size</option>
                              <option value="1-10">1-10 employees</option>
                              <option value="11-50">11-50 employees</option>
                              <option value="51-200">51-200 employees</option>
                              <option value="201-500">201-500 employees</option>
                              <option value="501-1000">501-1000 employees</option>
                              <option value="1000+">1000+ employees</option>
                            </select>
                          </div>
                        </div>

                        {/* Primary Goal & Target Audience */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Primary Goal
                            </label>
                            <select
                              value={preferences.primaryGoal}
                              onChange={(e) => setPreferences(prev => ({ ...prev, primaryGoal: e.target.value }))}
                              className="h-12 w-full border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 bg-white text-gray-900"
                            >
                              <option value="">Select primary goal</option>
                              <option value="increase-followers">Increase followers</option>
                              <option value="drive-sales">Drive sales</option>
                              <option value="build-brand">Build brand awareness</option>
                              <option value="generate-leads">Generate leads</option>
                              <option value="customer-engagement">Customer engagement</option>
                              <option value="thought-leadership">Thought leadership</option>
                              <option value="community-building">Community building</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Target Audience
                            </label>
                            <select
                              value={preferences.audience}
                              onChange={(e) => setPreferences(prev => ({ ...prev, audience: e.target.value }))}
                              className="h-12 w-full border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 bg-white text-gray-900"
                            >
                              <option value="">Select target audience</option>
                              <option value="b2b">B2B professionals</option>
                              <option value="b2c">B2C consumers</option>
                              <option value="millennials">Millennials</option>
                              <option value="gen-z">Gen Z</option>
                              <option value="business-owners">Business owners</option>
                              <option value="entrepreneurs">Entrepreneurs</option>
                              <option value="students">Students</option>
                              <option value="parents">Parents</option>
                            </select>
                          </div>
                        </div>

                        {/* Posting Frequency & Brand Voice */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Posting Frequency
                            </label>
                            <select
                              value={preferences.postingFrequency}
                              onChange={(e) => setPreferences(prev => ({ ...prev, postingFrequency: e.target.value }))}
                              className="h-12 w-full border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 bg-white text-gray-900"
                            >
                              <option value="">Select posting frequency</option>
                              <option value="daily">Daily</option>
                              <option value="few-times-week">Few times a week</option>
                              <option value="weekly">Weekly</option>
                              <option value="bi-weekly">Bi-weekly</option>
                              <option value="monthly">Monthly</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Brand Voice
                            </label>
                            <select
                              value={preferences.brandVoice}
                              onChange={(e) => setPreferences(prev => ({ ...prev, brandVoice: e.target.value }))}
                              className="h-12 w-full border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 bg-white text-gray-900"
                            >
                              <option value="">Select brand voice</option>
                              <option value="professional">Professional</option>
                              <option value="casual">Casual & Friendly</option>
                              <option value="humorous">Humorous</option>
                              <option value="inspiring">Inspiring</option>
                              <option value="educational">Educational</option>
                              <option value="authoritative">Authoritative</option>
                              <option value="conversational">Conversational</option>
                            </select>
                          </div>
                        </div>

                        {/* Location */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Location
                          </label>
                          <Input
                            placeholder="City, Country"
                            value={preferences.location}
                            onChange={(e) => setPreferences(prev => ({ ...prev, location: e.target.value }))}
                            className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white text-gray-900"
                          />
                        </div>

                        {/* Business Description */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Business Description
                          </label>
                          <textarea
                            placeholder="Tell us about your business, products, or services..."
                            value={preferences.description}
                            onChange={(e) => setPreferences(prev => ({ ...prev, description: e.target.value }))}
                            rows={4}
                            className="w-full border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 bg-white text-gray-900 p-3"
                          />
                        </div>

                        {/* Content Types */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Content Types You're Interested In
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
                                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                                  }`}
                                >
                                  <Icon className="w-6 h-6 mx-auto mb-2" />
                                  <span className="text-sm font-medium">{type.name}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Interest Niches */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Industry Niches
                          </label>
                          <div className="grid grid-cols-5 gap-2">
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
                                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                                  }`}
                                >
                                  <Icon className="w-4 h-4 mx-auto mb-1" />
                                  <span className="text-xs font-medium">{niche.name}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-3 pt-6 border-t">
                          <Button
                            onClick={prevStep}
                            variant="outline"
                            className="flex-1 h-12 border-gray-300 text-gray-700 hover:bg-gray-50"
                          >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                          </Button>
                          <Button
                            onClick={handleCompleteOnboarding}
                            disabled={completeOnboarding.isPending}
                            className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            {completeOnboarding.isPending ? 'Setting up...' : 'Complete Setup'}
                            <CheckCircle className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Add the business types for the select dropdown
const businessTypes = [
  { id: 'personal-brand', name: 'Personal Brand' },
  { id: 'small-business', name: 'Small Business' },
  { id: 'startup', name: 'Startup' },
  { id: 'enterprise', name: 'Enterprise' },
  { id: 'agency', name: 'Agency' },
  { id: 'nonprofit', name: 'Non-profit' },
  { id: 'ecommerce', name: 'E-commerce' },
  { id: 'consultant', name: 'Consultant' }
];

const industries = [
  { id: 'technology', name: 'Technology' },
  { id: 'healthcare', name: 'Healthcare' },
  { id: 'finance', name: 'Finance' },
  { id: 'retail', name: 'Retail' },
  { id: 'education', name: 'Education' },
  { id: 'food-beverage', name: 'Food & Beverage' },
  { id: 'fashion', name: 'Fashion' },
  { id: 'travel', name: 'Travel & Tourism' },
  { id: 'fitness', name: 'Fitness & Wellness' },
  { id: 'real-estate', name: 'Real Estate' },
  { id: 'automotive', name: 'Automotive' },
  { id: 'entertainment', name: 'Entertainment' }
];

const primaryGoals = [
  { id: 'increase-followers', name: 'Increase followers' },
  { id: 'drive-sales', name: 'Drive sales' },
  { id: 'build-brand', name: 'Build brand awareness' },
  { id: 'generate-leads', name: 'Generate leads' },
  { id: 'customer-engagement', name: 'Customer engagement' },
  { id: 'thought-leadership', name: 'Thought leadership' },
  { id: 'community-building', name: 'Community building' }
];

const targetAudiences = [
  { id: 'b2b', name: 'B2B professionals' },
  { id: 'b2c', name: 'B2C consumers' },
  { id: 'millennials', name: 'Millennials' },
  { id: 'gen-z', name: 'Gen Z' },
  { id: 'business-owners', name: 'Business owners' },
  { id: 'entrepreneurs', name: 'Entrepreneurs' },
  { id: 'students', name: 'Students' },
  { id: 'parents', name: 'Parents' }
];

const postingFrequencies = [
  { id: 'daily', name: 'Daily' },
  { id: 'few-times-week', name: 'Few times a week' },
  { id: 'weekly', name: 'Weekly' },
  { id: 'bi-weekly', name: 'Bi-weekly' },
  { id: 'monthly', name: 'Monthly' }
];

const brandVoices = [
  { id: 'professional', name: 'Professional' },
  { id: 'casual', name: 'Casual & Friendly' },
  { id: 'humorous', name: 'Humorous' },
  { id: 'inspiring', name: 'Inspiring' },
  { id: 'educational', name: 'Educational' },
  { id: 'authoritative', name: 'Authoritative' },
  { id: 'conversational', name: 'Conversational' }
];