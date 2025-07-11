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
  Send
} from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
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
      'Affiliate program access',
      'Team collaboration (3 members)',
      'Priority phone support',
      'Custom integrations'
    ],
    popular: false,
    color: 'orange'
  }
];

const niches = [
  { id: 'lifestyle', name: 'Lifestyle', icon: Heart, description: 'Daily life & wellness' },
  { id: 'fashion', name: 'Fashion', icon: Shirt, description: 'Style & trends' },
  { id: 'beauty', name: 'Beauty', icon: Sparkles, description: 'Makeup & skincare' },
  { id: 'food', name: 'Food', icon: Utensils, description: 'Recipes & dining' },
  { id: 'travel', name: 'Travel', icon: Plane, description: 'Adventures & places' },
  { id: 'business', name: 'Business', icon: TrendingUp, description: 'Growth & strategy' },
  { id: 'fitness', name: 'Fitness', icon: Dumbbell, description: 'Health & workouts' },
  { id: 'tech', name: 'Technology', icon: Code, description: 'Tech & innovation' },
  { id: 'education', name: 'Education', icon: GraduationCap, description: 'Learning & tutorials' },
  { id: 'entertainment', name: 'Entertainment', icon: Gamepad2, description: 'Gaming & fun content' },
  { id: 'music', name: 'Music', icon: Music, description: 'Songs & performances' },
  { id: 'photography', name: 'Photography', icon: Camera, description: 'Photos & visual art' }
];

const contentTypes = [
  { id: 'photos', name: 'Photos', icon: Camera, description: 'High-quality images' },
  { id: 'videos', name: 'Videos', icon: Video, description: 'Short-form video content' },
  { id: 'stories', name: 'Stories', icon: Users, description: 'Behind-the-scenes content' },
  { id: 'captions', name: 'Captions', icon: FileText, description: 'Engaging text content' }
];

const tones = [
  { id: 'professional', name: 'Professional', description: 'Formal and business-oriented' },
  { id: 'casual', name: 'Casual', description: 'Friendly and approachable' },
  { id: 'humorous', name: 'Humorous', description: 'Fun and entertaining' },
  { id: 'inspirational', name: 'Inspirational', description: 'Motivating and uplifting' },
  { id: 'educational', name: 'Educational', description: 'Informative and teaching' }
];

// Header Component
function Header({ currentStep }: { currentStep: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">VeeFore</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="text-blue-600 border-blue-200">
              Step {currentStep + 1} of 5
            </Badge>
            <Link href="/signin" className="text-gray-600 hover:text-blue-600 text-sm">
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Progress Bar Component
function ProgressBar({ currentStep }: { currentStep: number }) {
  const steps = [
    { label: 'Sign Up', icon: User },
    { label: 'Verify Email', icon: Mail },
    { label: 'Choose Plan', icon: Crown },
    { label: 'Connect Social', icon: Instagram },
    { label: 'Personalize', icon: Palette }
  ];

  return (
    <div className="max-w-4xl mx-auto mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          
          return (
            <div key={index} className="flex items-center">
              <div className="flex flex-col items-center">
                <motion.div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : isCompleted 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-200 text-gray-400'
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  <Icon className="w-5 h-5" />
                </motion.div>
                <span className={`text-xs font-medium ${
                  isActive || isCompleted ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {step.label}
                </span>
              </div>
              
              {index < steps.length - 1 && (
                <div className="flex-1 mx-4 mt-[-20px]">
                  <div className={`h-0.5 transition-all duration-300 ${
                    isCompleted ? 'bg-green-600' : 'bg-gray-200'
                  }`} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function SignUpIntegrated() {
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

  // Password validation indicators
  const passwordRequirements = [
    { label: 'at least 8 characters', test: (pwd: string) => pwd.length >= 8 },
    { label: 'an uppercase letter', test: (pwd: string) => /[A-Z]/.test(pwd) },
    { label: 'a lowercase letter', test: (pwd: string) => /[a-z]/.test(pwd) },
    { label: 'a number', test: (pwd: string) => /[0-9]/.test(pwd) },
    { label: 'a special character', test: (pwd: string) => /[^a-zA-Z0-9]/.test(pwd) }
  ];

  const handleEmailSignUp = async (data: SignUpForm) => {
    setIsLoading(true);
    try {
      const [firstName, ...lastNameParts] = data.fullName.split(' ');
      const lastName = lastNameParts.join(' ') || '';

      const response = await fetch('/api/auth/send-verification-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          firstName,
          lastName,
          password: data.password
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to send verification email');
      }

      setSignupData(data);
      setCurrentStep(1); // Move to verification step
      setDevelopmentOtp(result.developmentOtp);

      toast({
        title: "Verification email sent!",
        description: "Please check your email for the verification code."
      });
    } catch (error: any) {
      console.error('Sign-up error:', error);
      toast({
        title: "Sign-up failed",
        description: error.message || "Failed to create account",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setIsLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // After Google signup, move to plan selection
      setCurrentStep(2);
      toast({
        title: "Google sign-up successful!",
        description: "Please choose your subscription plan."
      });
    } catch (error: any) {
      console.error('Google sign-up error:', error);
      toast({
        title: "Google sign-up failed",
        description: error.message || "Failed to sign up with Google",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (!verificationCode.trim()) {
      toast({
        title: "Verification code required",
        description: "Please enter the 6-digit code from your email",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: signupData?.email,
          otp: verificationCode.trim()
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Store auth token
        if (result.token) {
          localStorage.setItem('veefore_auth_token', result.token);
        }

        setCurrentStep(2); // Move to plan selection
        toast({
          title: "Email verified successfully!",
          description: "Please choose your subscription plan."
        });
      } else {
        // Handle the "Email already verified" case
        if (result.message === "Email already verified") {
          toast({
            title: "Email already verified",
            description: "Your email has been verified. You can proceed to plan selection.",
            variant: "default"
          });
          
          setCurrentStep(2); // Move to plan selection
        } else {
          throw new Error(result.message || 'Failed to verify email');
        }
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      toast({
        title: "Verification failed",
        description: error.message || "Invalid verification code",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlanSelection = () => {
    if (!selectedPlan) {
      toast({
        title: "Plan selection required",
        description: "Please select a subscription plan to continue",
        variant: "destructive"
      });
      return;
    }

    setCurrentStep(3); // Move to social connection
    toast({
      title: "Plan selected!",
      description: `You've selected the ${plans.find(p => p.id === selectedPlan)?.name} plan.`
    });
  };

  // Instagram connection mutation
  const connectInstagramMutation = useMutation({
    mutationFn: async () => {
      const workspaceId = currentWorkspace?.id || workspaces[0]?.id;
      
      if (!workspaceId) {
        throw new Error('No workspace available. Please refresh the page and try again.');
      }
      
      let token = localStorage.getItem('veefore_auth_token');
      
      if (user && token) {
        if (user.firebaseUid === 'demo-user') {
          token = 'demo-token';
          localStorage.setItem('veefore_auth_token', token);
        } else {
          try {
            const { auth } = await import('@/lib/firebase');
            if (auth.currentUser) {
              const freshToken = await auth.currentUser.getIdToken(true);
              if (freshToken) {
                token = freshToken;
                localStorage.setItem('veefore_auth_token', freshToken);
              }
            }
          } catch (error) {
            console.error('Failed to get fresh token:', error);
          }
        }
      }
      
      if (!token) {
        throw new Error('Authentication token not found. Please refresh the page and try again.');
      }
      
      const response = await fetch(`/api/instagram/auth?workspaceId=${workspaceId}&source=signup`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      
      if (data.authUrl) {
        localStorage.setItem('signup_current_step', currentStep.toString());
        localStorage.setItem('signup_returning_from_oauth', 'true');
        localStorage.setItem('oauth_source', 'signup');
        window.location.href = data.authUrl;
      } else {
        throw new Error('Failed to get Instagram authorization URL');
      }
    },
    onError: (error: any) => {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect Instagram account",
        variant: "destructive"
      });
    }
  });

  const completeSignupMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('POST', '/api/user/complete-onboarding', {
        ...data,
        selectedPlan,
        billingPeriod
      });
    },
    onSuccess: () => {
      localStorage.removeItem('signup_current_step');
      localStorage.setItem('signup_just_completed', 'true');
      toast({
        title: "Welcome to VeeFore!",
        description: "Your account has been set up successfully."
      });
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      setLocation('/dashboard');
    },
    onError: (error: any) => {
      toast({
        title: "Setup Failed",
        description: error.message || "Failed to complete setup",
        variant: "destructive"
      });
    }
  });

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      completeSignupMutation.mutate(preferences);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNicheToggle = (nicheId: string) => {
    setPreferences(prev => ({
      ...prev,
      selectedNiches: prev.selectedNiches.includes(nicheId)
        ? prev.selectedNiches.filter(id => id !== nicheId)
        : [...prev.selectedNiches, nicheId]
    }));
  };

  const handleContentTypeToggle = (typeId: string) => {
    setPreferences(prev => ({
      ...prev,
      contentTypes: prev.contentTypes.includes(typeId)
        ? prev.contentTypes.filter(id => id !== typeId)
        : [...prev.contentTypes, typeId]
    }));
  };

  const renderSignUpStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto"
    >
      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto">
            <Rocket className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create your VeeFore account</h1>
            <p className="text-gray-600 mt-2">Join thousands of creators using AI to grow their social media</p>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Button
            onClick={handleGoogleSignUp}
            disabled={isLoading}
            variant="outline"
            className="w-full h-12 text-gray-700 border-gray-300 hover:bg-gray-50"
          >
            <FcGoogle className="w-5 h-5 mr-3" />
            Continue with Google
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          <form onSubmit={form.handleSubmit(handleEmailSignUp)} className="space-y-4">
            <div>
              <Input
                {...form.register('fullName')}
                placeholder="Full Name"
                className="h-12"
                disabled={isLoading}
              />
              {form.formState.errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.fullName.message}</p>
              )}
            </div>

            <div>
              <Input
                {...form.register('email')}
                type="email"
                placeholder="Email Address"
                className="h-12"
                disabled={isLoading}
              />
              {form.formState.errors.email && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div>
              <div className="relative">
                <Input
                  {...form.register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  className="h-12 pr-10"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              
              {watchedPassword && (
                <div className="mt-2 space-y-1">
                  {passwordRequirements.map((req, index) => (
                    <div key={index} className="flex items-center text-xs">
                      {req.test(watchedPassword) ? (
                        <Check className="h-3 w-3 text-green-500 mr-2" />
                      ) : (
                        <X className="h-3 w-3 text-gray-400 mr-2" />
                      )}
                      <span className={req.test(watchedPassword) ? 'text-green-600' : 'text-gray-500'}>
                        Password must contain {req.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              
              {form.formState.errors.password && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <p className="text-xs text-gray-500 text-center">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderVerificationStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto text-center"
    >
      <Card className="border-0 shadow-lg">
        <CardHeader className="space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Check your email</h2>
            <p className="text-gray-600 mt-2">
              We sent a verification code to<br />
              <span className="font-medium">{signupData?.email}</span>
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div>
            <Input
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter 6-digit code"
              className="h-12 text-center text-lg font-mono"
              maxLength={6}
              disabled={isLoading}
            />
            {developmentOtp && (
              <p className="text-xs text-blue-600 mt-2">
                Development code: {developmentOtp}
              </p>
            )}
          </div>

          <Button
            onClick={handleVerifyEmail}
            disabled={isLoading || verificationCode.length !== 6}
            className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold"
          >
            {isLoading ? 'Verifying...' : 'Verify Email'}
          </Button>

          <Button
            variant="ghost"
            onClick={handlePrevious}
            className="w-full text-gray-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sign Up
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderPlanSelectionStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose your plan</h2>
        <p className="text-lg text-gray-600">Select a plan to get started with VeeFore</p>
        
        <div className="flex items-center justify-center mt-6">
          <span className={`text-sm ${billingPeriod === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
            Monthly
          </span>
          <button
            onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
            className="mx-3 relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform ${
                billingPeriod === 'yearly' ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-sm ${billingPeriod === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
            Yearly
          </span>
          {billingPeriod === 'yearly' && (
            <Badge className="ml-2 bg-green-100 text-green-800">Save 30%</Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          const price = billingPeriod === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
          const displayPrice = billingPeriod === 'yearly' ? Math.round(price / 12) : price;
          
          return (
            <motion.div
              key={plan.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative cursor-pointer transition-all duration-200 ${
                isSelected 
                  ? 'transform scale-105' 
                  : 'hover:shadow-lg'
              }`}
            >
              <Card className={`h-full border-2 transition-all duration-200 ${
                isSelected 
                  ? 'border-blue-500 shadow-lg' 
                  : plan.popular
                    ? 'border-blue-200'
                    : 'border-gray-200 hover:border-gray-300'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-red-500 text-white">Most Popular</Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                  <div className="mt-2">
                    {plan.id === 'free' ? (
                      <div className="text-3xl font-bold text-gray-900">Free</div>
                    ) : (
                      <div>
                        <span className="text-3xl font-bold text-gray-900">₹{displayPrice}</span>
                        <span className="text-gray-500">/{billingPeriod === 'yearly' ? 'month' : 'month'}</span>
                        {billingPeriod === 'yearly' && plan.id !== 'free' && (
                          <div className="text-sm text-green-600">
                            Billed yearly (₹{plan.yearlyPrice})
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{plan.description}</p>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`w-full mt-6 ${
                      isSelected
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : plan.popular
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    }`}
                    variant={isSelected ? "default" : plan.popular ? "default" : "outline"}
                  >
                    {isSelected ? 'Selected' : plan.id === 'free' ? 'Start Free' : 'Get Started'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={handlePrevious}
          className="px-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button
          onClick={handlePlanSelection}
          disabled={!selectedPlan}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6"
        >
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );

  const renderSocialConnectionStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto text-center"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Connect your Instagram</h2>
        <p className="text-lg text-gray-600">
          Connect your Instagram Business account to start creating content with AI
        </p>
      </div>

      {Array.isArray(socialAccounts) && socialAccounts.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8"
        >
          <div className="flex items-center justify-center text-green-700 mb-3">
            <CheckCircle className="w-8 h-8 mr-3" />
            <span className="text-xl font-semibold">Instagram Connected!</span>
          </div>
          <p className="text-green-600">
            Account: @{socialAccounts[0]?.username}
          </p>
        </motion.div>
      ) : (
        <Card className="border-2 border-gray-200 hover:border-blue-200 transition-all duration-300 mb-8">
          <CardContent className="p-8">
            <div className="flex items-center space-x-6 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-orange-500 rounded-2xl flex items-center justify-center">
                <Instagram className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold text-gray-900">Instagram Business</h3>
                <p className="text-gray-600">Connect your business account to start creating</p>
                <div className="flex space-x-2 mt-2">
                  <Badge variant="outline" className="text-xs">AI Content</Badge>
                  <Badge variant="outline" className="text-xs">Auto Posting</Badge>
                  <Badge variant="outline" className="text-xs">Analytics</Badge>
                </div>
              </div>
            </div>
            
            <Button
              onClick={() => connectInstagramMutation.mutate()}
              disabled={connectInstagramMutation.isPending}
              className="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white h-12 text-lg"
            >
              {connectInstagramMutation.isPending ? 'Connecting...' : 'Connect Instagram'}
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          className="px-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button
          onClick={handleNext}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6"
        >
          {socialAccounts.length > 0 ? 'Continue' : 'Skip for now'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );

  const renderPersonalizationStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Personalize your experience</h2>
        <p className="text-lg text-gray-600">
          Tell us about your brand so we can create better content for you
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Business Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="w-5 h-5 mr-2" />
              Business Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Name
              </label>
              <Input
                value={preferences.businessName}
                onChange={(e) => setPreferences(prev => ({ ...prev, businessName: e.target.value }))}
                placeholder="Enter your business name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={preferences.description}
                onChange={(e) => setPreferences(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of your business or brand"
                className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Brand Tone */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              Brand Tone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {tones.map((tone) => (
                <motion.div
                  key={tone.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setPreferences(prev => ({ ...prev, tone: tone.id }))}
                  className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                    preferences.tone === tone.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`font-medium ${preferences.tone === tone.id ? 'text-blue-900' : 'text-gray-700'}`}>
                        {tone.name}
                      </div>
                      <div className="text-sm text-gray-500">{tone.description}</div>
                    </div>
                    {preferences.tone === tone.id && (
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Niche Selection */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Your Niche (Select up to 3)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {niches.map((niche) => {
              const Icon = niche.icon;
              const isSelected = preferences.selectedNiches.includes(niche.id);
              
              return (
                <motion.div
                  key={niche.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (isSelected || preferences.selectedNiches.length < 3) {
                      handleNicheToggle(niche.id);
                    }
                  }}
                  className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50' 
                      : preferences.selectedNiches.length >= 3
                        ? 'border-gray-200 opacity-50 cursor-not-allowed'
                        : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <Icon className={`w-6 h-6 mx-auto mb-2 ${isSelected ? 'text-blue-600' : 'text-gray-500'}`} />
                    <span className={`text-sm font-medium ${isSelected ? 'text-blue-900' : 'text-gray-700'}`}>
                      {niche.name}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Content Types */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Camera className="w-5 h-5 mr-2" />
            Content Types
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {contentTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = preferences.contentTypes.includes(type.id);
              
              return (
                <motion.div
                  key={type.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleContentTypeToggle(type.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-gray-500'}`} />
                    <div>
                      <div className={`font-medium ${isSelected ? 'text-blue-900' : 'text-gray-700'}`}>
                        {type.name}
                      </div>
                      <div className="text-sm text-gray-500">{type.description}</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={handlePrevious}
          className="px-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={completeSignupMutation.isPending}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-medium"
        >
          {completeSignupMutation.isPending ? 'Setting up...' : 'Complete Setup'}
          <Send className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </motion.div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderSignUpStep();
      case 1:
        return renderVerificationStep();
      case 2:
        return renderPlanSelectionStep();
      case 3:
        return renderSocialConnectionStep();
      case 4:
        return renderPersonalizationStep();
      default:
        return renderSignUpStep();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentStep={currentStep} />
      
      <div className="pt-8 pb-12 px-4 sm:px-6 lg:px-8">
        <ProgressBar currentStep={currentStep} />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {renderCurrentStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}