import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocation, Link } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useDeviceWaitlistStatus } from '@/hooks/useDeviceWaitlistStatus';
import { AccessRestrictedModal } from '@/components/AccessRestrictedModal';
import { PageTransition, AuthPageSkeleton } from '@/components/ui/page-transition';

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

type SignInForm = z.infer<typeof signInSchema>;

export default function SignIn() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAccessRestrictedModal, setShowAccessRestrictedModal] = useState(false);
  const [accessRestrictedMessage, setAccessRestrictedMessage] = useState('');
  const { toast } = useToast();
  const deviceStatus = useDeviceWaitlistStatus();

  const form = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' }
  });

  // Pre-fill email for early access users
  useEffect(() => {
    if (deviceStatus.userEmail) {
      form.setValue('email', deviceStatus.userEmail);
    }
  }, [deviceStatus.userEmail, form]);

  const handleEmailSignIn = async (data: SignInForm) => {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      
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
        const errorData = await response.json().catch(() => ({ message: 'Authentication failed' }));
        throw new Error(errorData.message || 'Authentication failed');
      }

      toast({
        title: "Welcome back!",
        description: "Successfully signed in to your account."
      });

      setLocation('/dashboard');
    } catch (error: any) {
      console.error('Sign-in error:', error);
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        toast({
          title: "Invalid credentials",
          description: "Please check your email and password.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Sign-in failed",
          description: error.message || "An unexpected error occurred. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
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
        
        setAccessRestrictedMessage("Access restricted. Please sign in with your approved email address.");
        setShowAccessRestrictedModal(true);
        return;
      }

      toast({
        title: "Welcome back!",
        description: "Successfully signed in with Google."
      });

      setLocation('/dashboard');
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-blue-600 to-purple-700 text-white p-12 flex-col justify-center">
        <div className="max-w-md">
          <div className="flex items-center mb-8">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-3">
              <span className="text-blue-600 font-bold text-xl">V</span>
            </div>
            <span className="text-2xl font-bold">VeeFore</span>
          </div>
          
          <h1 className="text-4xl font-bold mb-6 leading-tight">
            Gets social.<br />
            Knows your brand.<br />
            Ready to jam.
          </h1>
          
          <p className="text-lg text-blue-100 mb-8">
            Meet VeeFore — your AI-powered social media assistant. Built on real-time social media conversations and set to your brand voice, it's ready to help you spot post-worthy trends, write posts tailored to your brand, and build campaign strategies based on what's happening online right now.
          </p>
          
          <p className="text-blue-200">
            Free for a limited time.
          </p>
        </div>
      </div>

      {/* Right side - Sign in form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in</h2>
            </div>

            <form onSubmit={form.handleSubmit(handleEmailSignIn)} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    {...form.register('email')}
                    className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                {form.formState.errors.email && (
                  <p className="mt-2 text-sm text-red-600">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
                    Forgot password?
                  </Link>
                </div>
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
                {form.formState.errors.password && (
                  <p className="mt-2 text-sm text-red-600">{form.formState.errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-medium transition-colors"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>

            <div className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-md font-medium transition-colors"
              >
                <FcGoogle className="w-5 h-5 mr-2" />
                Single sign on
              </Button>
            </div>

            <div className="mt-8 text-center">
              <Link href="/signup" className="text-blue-600 hover:text-blue-500 font-medium">
                Sign up
              </Link>
            </div>

            <div className="mt-6 text-center text-sm text-gray-600">
              By selecting Sign in, I agree to{' '}
              <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                VeeFore's Terms
              </Link>
              , including the payment terms, and{' '}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                Privacy Policy
              </Link>
            </div>

            <div className="mt-4 text-center">
              <span className="text-blue-600 hover:text-blue-500 cursor-pointer text-sm">
                Use Social Sign In
              </span>
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
    </PageTransition>
  );
}