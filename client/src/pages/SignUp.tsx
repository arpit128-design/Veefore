import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocation, Link } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, User, Mail, Check, X, ArrowLeft, Rocket } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useDeviceWaitlistStatus } from '@/hooks/useDeviceWaitlistStatus';
import { AccessRestrictedModal } from '@/components/AccessRestrictedModal';
import { motion } from 'framer-motion';

const signUpSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character')
}).refine((data) => {
  // Additional password validation
  return data.password.length >= 8;
}, {
  message: "Password must meet all requirements",
  path: ["password"],
});

type SignUpForm = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [signupData, setSignupData] = useState<SignUpForm | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [developmentOtp, setDevelopmentOtp] = useState<string | null>(null);
  const [showAccessRestrictedModal, setShowAccessRestrictedModal] = useState(false);
  const [accessRestrictedMessage, setAccessRestrictedMessage] = useState('');
  const { toast } = useToast();
  const deviceStatus = useDeviceWaitlistStatus();

  const form = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { fullName: '', email: '', password: '' }
  });

  const watchedPassword = form.watch('password');

  // Pre-fill email for early access users
  useEffect(() => {
    if (deviceStatus.userEmail) {
      form.setValue('email', deviceStatus.userEmail);
    }
  }, [deviceStatus.userEmail, form]);

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
        if (result.requiresWaitlist) {
          toast({
            title: "Join our waitlist",
            description: "You need to join our waitlist first to create an account.",
            variant: "destructive"
          });
          return;
        }
        throw new Error(result.message || 'Failed to send verification email');
      }

      setSignupData(data);
      setShowVerification(true);
      setDevelopmentOtp(result.developmentOtp);

      toast({
        title: "Verification email sent!",
        description: "Please check your email for the verification code."
      });
    } catch (error: any) {
      console.error('Sign-up error:', error);
      toast({
        title: "Sign-up failed",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async () => {
    if (!signupData || verificationCode.length !== 6) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: signupData.email,
          code: verificationCode
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Invalid verification code');
      }

      // Sign in with custom token
      const token = await result.user.getIdToken();
      const verifyResponse = await fetch('/api/auth/verify-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!verifyResponse.ok) {
        throw new Error('Account verification failed');
      }

      toast({
        title: "Account created successfully!",
        description: "Welcome to VeeFore! Your starter plan trial has been activated."
      });

      setLocation('/dashboard');
    } catch (error: any) {
      console.error('Verification error:', error);
      toast({
        title: "Verification failed",
        description: error.message || "Please check your code and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      // Verify token with backend
      const token = await userCredential.user.getIdToken();
      const response = await fetch('/api/auth/verify-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Access denied' }));
        await auth.signOut();
        
        setAccessRestrictedMessage("Access restricted. Please sign up with your approved email address.");
        setShowAccessRestrictedModal(true);
        return;
      }

      toast({
        title: "Account created successfully!",
        description: "Welcome to VeeFore! Your starter plan trial has been activated."
      });

      setLocation('/dashboard');
    } catch (error: any) {
      console.error('Google Sign-Up Error:', error);
      
      if (error.code === 'auth/popup-closed-by-user') {
        toast({
          title: "Sign-up cancelled",
          description: "You can try again anytime.",
          variant: "default"
        });
      } else {
        toast({
          title: "Google Sign-Up Error",
          description: error.message || "Failed to sign up with Google. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (showVerification) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
              <p className="text-gray-600">
                We've sent a verification code to {signupData?.email}
              </p>
            </div>

            {/* Development OTP Display */}
            {developmentOtp && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-yellow-800 text-sm font-medium">Development Mode</span>
                </div>
                <p className="text-yellow-700 text-sm">
                  Your verification code: <span className="font-mono font-bold text-lg">{developmentOtp}</span>
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Code
                </label>
                <Input
                  type="text"
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  className="text-center text-2xl tracking-widest"
                />
              </div>

              <Button
                onClick={handleVerification}
                disabled={isLoading || verificationCode.length !== 6}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-medium transition-colors"
              >
                {isLoading ? 'Verifying...' : 'Verify Email'}
              </Button>

              <button
                type="button"
                onClick={() => {
                  setShowVerification(false);
                  setSignupData(null);
                  setVerificationCode('');
                }}
                className="w-full text-gray-600 hover:text-gray-800 text-sm transition-colors"
              >
                ← Back to Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="min-h-screen bg-gray-50 flex flex-col"
    >
      {/* Navigation Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => setLocation('/')}
                className="text-gray-600 hover:text-gray-900 flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">VeeFore</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-green-400 to-blue-500 text-white p-12 flex-col justify-center">
        <div className="max-w-md">
          <div className="flex items-center mb-8">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-3">
              <span className="text-blue-600 font-bold text-xl">V</span>
            </div>
            <span className="text-2xl font-bold">VeeFore</span>
          </div>
          
          <div className="w-48 h-48 mx-auto mb-8">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <circle cx="100" cy="100" r="80" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
              <circle cx="100" cy="70" r="15" fill="white"/>
              <circle cx="85" cy="85" r="8" fill="white"/>
              <circle cx="115" cy="85" r="8" fill="white"/>
              <path d="M70 120 Q100 140 130 120" stroke="white" strokeWidth="3" fill="none"/>
              <path d="M60 100 Q100 80 140 100" stroke="white" strokeWidth="2" fill="none"/>
            </svg>
          </div>
          
          <h1 className="text-4xl font-bold mb-6 text-center">
            Let's create your account
          </h1>
          
          <p className="text-lg text-center text-green-100">
            Sign up with social and add your first social account in one step
          </p>
        </div>
      </div>

      {/* Right side - Sign up form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="text-sm text-gray-600 mb-2">Step 1 of 4</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Let's create your account</h2>
              <p className="text-gray-600">Sign up with social and add your first social account in one step</p>
            </div>

            {/* Social sign up options */}
            <div className="flex justify-center space-x-4 mb-6">
              <button
                onClick={handleGoogleSignUp}
                disabled={isLoading}
                className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition-colors"
              >
                <FcGoogle className="w-6 h-6" />
              </button>
              <button
                disabled={isLoading}
                className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition-colors"
              >
                <FaLinkedin className="w-6 h-6" />
              </button>
              <button
                disabled={isLoading}
                className="w-12 h-12 bg-gray-800 hover:bg-gray-900 text-white rounded-lg flex items-center justify-center transition-colors"
              >
                <FaTwitter className="w-6 h-6" />
              </button>
            </div>

            <div className="text-center text-gray-500 mb-6">or</div>

            <form onSubmit={form.handleSubmit(handleEmailSignUp)} className="space-y-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full name
                </label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  {...form.register('fullName')}
                  className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {form.formState.errors.fullName && (
                  <p className="mt-2 text-sm text-red-600">{form.formState.errors.fullName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Business email address
                </label>
                <p className="text-sm text-gray-600 mb-2">Note that you will be required to verify this email address.</p>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...form.register('email')}
                  className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {form.formState.errors.email && (
                  <p className="mt-2 text-sm text-red-600">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    {...form.register('password')}
                    className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Password requirements */}
                <div className="mt-3 space-y-2">
                  <p className="text-sm text-gray-600">Passwords must contain:</p>
                  {passwordRequirements.map((req, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      {req.test(watchedPassword || '') ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <X className="w-4 h-4 text-red-600" />
                      )}
                      <span className={`text-sm ${req.test(watchedPassword || '') ? 'text-green-600' : 'text-red-600'}`}>
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>

                {form.formState.errors.password && (
                  <p className="mt-2 text-sm text-red-600">{form.formState.errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-medium transition-colors"
              >
                {isLoading ? 'Creating Account...' : 'Create My Account'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              By creating an account, I agree to{' '}
              <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                VeeFore's Terms
              </Link>
              , including the payment terms and{' '}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                Privacy Policy
              </Link>
            </div>

            <div className="mt-6 text-center">
              <span className="text-gray-600">Already have an account? </span>
              <Link href="/signin" className="text-blue-600 hover:text-blue-500 font-medium">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Access Restricted Modal */}
      <AccessRestrictedModal
        isOpen={showAccessRestrictedModal}
        onClose={() => setShowAccessRestrictedModal(false)}
        message={accessRestrictedMessage}
      />
      </div>
    </motion.div>
  );
}