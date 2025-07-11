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
import veeforeLogo from '@/assets/veefore-logo.png';
// VeeFore logo will be text-based
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
  { id: 'entertainment', name: 'Entertainment' },
  { id: 'consulting', name: 'Consulting' },
  { id: 'marketing', name: 'Marketing & Advertising' },
  { id: 'nonprofit', name: 'Non-profit' }
];

const primaryGoals = [
  { id: 'increase-followers', name: 'Increase followers' },
  { id: 'drive-sales', name: 'Drive sales' },
  { id: 'build-brand', name: 'Build brand awareness' },
  { id: 'generate-leads', name: 'Generate leads' },
  { id: 'customer-engagement', name: 'Customer engagement' },
  { id: 'thought-leadership', name: 'Thought leadership' }
];

const targetAudiences = [
  { id: 'b2b', name: 'B2B' },
  { id: 'b2c', name: 'B2C' },
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
  { id: 'authoritative', name: 'Authoritative' }
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
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [userNavigatedManually, setUserNavigatedManually] = useState(false);
  const [preferences, setPreferences] = useState({
    businessName: '',
    industry: '',
    primaryGoals: [] as string[],
    targetAudience: '',
    postingFrequency: '',
    brandVoice: ''
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
      return;
    }
    // If user is authenticated but not onboarded, check email verification status
    // Only auto-skip verification step if user hasn't manually navigated
    if (user && !user.isOnboarded && user.isEmailVerified && !userNavigatedManually) {
      if (currentStep === 0) {
        setCurrentStep(2); // Skip to plan selection since auth and email verification are done
      } else if (currentStep === 1) {
        // User is on verification step but already verified - skip to plan selection
        setCurrentStep(2);
      }
    }
  }, [user, currentStep, setLocation, userNavigatedManually]); // Add currentStep to dependencies

  // Handle back to home navigation
  const handleBackToHome = () => {
    setLocation('/');
  };

  // Step progression logic
  const nextStep = () => {
    // Security check: If on email verification step (step 1), ensure email is verified before proceeding
    if (currentStep === 1 && user && !user.isEmailVerified) {
      toast({
        title: "Email verification required",
        description: "Please verify your email address before proceeding",
        variant: "destructive"
      });
      return;
    }
    
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setUserNavigatedManually(true); // Mark that user navigated manually
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
      const response = await fetch('/api/auth/send-verification-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, firstName: data.fullName })
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
        // Handle different error responses
        let errorMessage = 'Failed to send verification email';
        try {
          const errorResponse = await response.json();
          if (errorResponse.message) {
            errorMessage = errorResponse.message;
          }
        } catch (parseError) {
          // If can't parse JSON, check if it's HTML
          const textResponse = await response.text();
          if (textResponse.includes('<!DOCTYPE')) {
            errorMessage = 'Server error - please try again later';
          }
        }
        throw new Error(errorMessage);
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
        
        // Mark as Google user and go to Step 2 (verification) but automatically skip it
        setIsGoogleUser(true);
        setCurrentStep(1);
        
        // Automatically proceed to Step 3 after a brief delay to show Step 2
        setTimeout(() => {
          setCurrentStep(2);
        }, 1500);
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
          otp: verificationCode
        })
      });

      if (response.ok) {
        nextStep();
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
        
        // Navigate to dashboard without toast to prevent interference
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
    <div className="h-screen bg-green-50 flex overflow-hidden">
      {/* Left Side - Mascot/Illustration - Fixed */}
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
            {/* VeeFore Logo Mascot */}
            <div className="text-white text-8xl">
              <img 
                src={veeforeLogo} 
                alt="VeeFore Logo" 
                className="w-32 h-32 object-contain"
              />
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

      {/* Right Side - Form - Scrollable */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col h-screen overflow-hidden">
        {/* Header - Mobile Only */}
        <div className="lg:hidden px-8 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center space-x-2 hover:opacity-80">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <img 
                    src={veeforeLogo} 
                    alt="VeeFore Logo" 
                    className="w-5 h-5 object-contain"
                  />
                </div>
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
          {user && !user.isOnboarded && currentStep === 2 && user.isEmailVerified && (
            <div className="mb-3 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <span className="font-medium">Welcome back!</span> Since you're already signed in and verified, we've skipped the signup and email verification steps.
              </p>
            </div>
          )}
          {user && !user.isOnboarded && currentStep === 1 && !user.isEmailVerified && (
            <div className="mb-3 p-3 bg-orange-50 rounded-lg">
              <p className="text-sm text-orange-700">
                <span className="font-medium">Email verification required!</span> Please verify your email address to continue with the secure signup process.
              </p>
            </div>
          )}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Content - Scrollable */}
        <div className="flex-1 px-8 py-8 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
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
                  {/* Show special message for already verified users */}
                  {user && user.isEmailVerified && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-center mb-2">
                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <p className="text-sm text-green-800">
                        <span className="font-medium">Email already verified!</span>
                        <br />
                        Your email address <span className="font-medium">{user.email}</span> has been verified. You can continue to the next step.
                      </p>
                      <Button
                        onClick={() => setCurrentStep(2)}
                        className="mt-3 bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 h-auto"
                      >
                        Continue to Plan Selection
                      </Button>
                    </div>
                  )}
                  
                  <div className="mb-8">
                    <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      {isGoogleUser ? (
                        <div className="relative">
                          <Mail className="w-8 h-8 text-white" />
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                            <Check className="w-2 h-2 text-white" />
                          </div>
                        </div>
                      ) : (
                        <Mail className="w-8 h-8 text-white" />
                      )}
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {user && user.isEmailVerified ? 'Email Verified' : isGoogleUser ? 'Verifying your Google account' : 'Verify your email'}
                    </h1>
                    <p className="text-gray-600">
                      {user && user.isEmailVerified ? (
                        <>
                          Your email address has been successfully verified.
                          <br />
                          You can now proceed to select your plan.
                        </>
                      ) : isGoogleUser ? (
                        <>
                          Your Google account{' '}
                          <span className="font-medium">{signupData?.email}</span>
                          <br />is being automatically verified...
                        </>
                      ) : (
                        <>
                          We've sent a 6-digit verification code to<br />
                          <span className="font-medium">{signupData?.email}</span>
                        </>
                      )}
                    </p>
                  </div>

                  {/* Only show verification form if user needs to verify */}
                  {!(user && user.isEmailVerified) && (
                    <>
                      {isGoogleUser ? (
                        <div className="flex items-center justify-center mb-6">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                          <span className="ml-3 text-sm text-gray-600">Auto-verifying Google account...</span>
                        </div>
                      ) : (
                        <>
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
                        </>
                      )}
                    </>
                  )}
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
              >
                <div className="max-w-2xl mx-auto">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      Tell us about your business
                    </h1>
                    <p className="text-gray-600">
                      Help us customize VeeFore to match your needs and goals
                    </p>
                  </div>

                  <Card className="bg-white shadow-lg border-0">
                    <CardContent className="p-8">
                      <div className="space-y-6">
                        {/* Business Basics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Business Name
                            </label>
                            <Input
                              value={preferences.businessName}
                              onChange={(e) => setPreferences(prev => ({ ...prev, businessName: e.target.value }))}
                              placeholder="Your business name"
                              className="h-11 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Industry
                            </label>
                            <select
                              value={preferences.industry}
                              onChange={(e) => setPreferences(prev => ({ ...prev, industry: e.target.value }))}
                              className="w-full h-11 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white text-gray-900"
                            >
                              <option value="">Select industry</option>
                              {industries.map(industry => (
                                <option key={industry.id} value={industry.id}>{industry.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Primary Goals */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            What are your primary goals? (Select all that apply)
                          </label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {primaryGoals.map((goal) => (
                              <label key={goal.id} className="flex items-center space-x-3 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={preferences.primaryGoals.includes(goal.id)}
                                  onChange={(e) => {
                                    setPreferences(prev => ({
                                      ...prev,
                                      primaryGoals: e.target.checked
                                        ? [...prev.primaryGoals, goal.id]
                                        : prev.primaryGoals.filter(id => id !== goal.id)
                                    }));
                                  }}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <span className="text-sm text-gray-700">{goal.name}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Target Audience */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Who is your target audience?
                          </label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {targetAudiences.map((audience) => (
                              <button
                                key={audience.id}
                                onClick={() => setPreferences(prev => ({ ...prev, targetAudience: audience.id }))}
                                className={`p-3 rounded-lg border-2 text-sm transition-all ${
                                  preferences.targetAudience === audience.id
                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                                }`}
                              >
                                {audience.name}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Posting Frequency */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            How often do you plan to post?
                          </label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {postingFrequencies.map((freq) => (
                              <button
                                key={freq.id}
                                onClick={() => setPreferences(prev => ({ ...prev, postingFrequency: freq.id }))}
                                className={`p-3 rounded-lg border-2 text-sm transition-all ${
                                  preferences.postingFrequency === freq.id
                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                                }`}
                              >
                                {freq.name}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Brand Voice */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            What's your brand voice?
                          </label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {brandVoices.map((voice) => (
                              <button
                                key={voice.id}
                                onClick={() => setPreferences(prev => ({ ...prev, brandVoice: voice.id }))}
                                className={`p-3 rounded-lg border-2 text-sm transition-all ${
                                  preferences.brandVoice === voice.id
                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                                }`}
                              >
                                {voice.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-8 border-t border-gray-200 mt-8">
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
                          disabled={isLoading}
                          className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          {isLoading ? 'Setting up...' : 'Complete Setup'}
                          <CheckCircle className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

