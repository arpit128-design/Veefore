import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocation, Link } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, ArrowLeft, Rocket, Check, X } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
// VeeFore logo will be text-based

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

type SignInForm = z.infer<typeof signInSchema>;

export default function SignIn() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' }
  });

  // Early access system removed - no pre-filling needed

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
        const errorData = await response.json().catch(() => ({ message: 'Authentication failed' }));
        await auth.signOut();
        
        toast({
          title: "Authentication failed",
          description: errorData.message || "Please try again.",
          variant: "destructive"
        });
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
            {/* VeeFore Rocket Mascot */}
            <div className="text-white text-8xl">
              <Rocket className="w-32 h-32" />
            </div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="w-24 h-3 bg-red-400 rounded-full opacity-50"></div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Welcome Back to VeeFore
          </h2>
          <p className="text-gray-600 text-lg">
            Continue your AI-powered social media journey
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
                  <Rocket className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">VeeFore</span>
              </Link>
            </div>
            <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm">
              Back to Home
            </Link>
          </div>
        </div>

        {/* Main Content - Scrollable */}
        <div className="flex-1 px-8 py-8 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="max-w-md mx-auto">
              <div className="mb-8">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <div className="text-white text-3xl">👋</div>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                  Sign in to your account
                </h1>
                <p className="text-gray-600 text-center">
                  Welcome back! Please enter your details.
                </p>
              </div>

              {/* Google Sign In */}
              <div className="mb-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full h-12 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FcGoogle className="w-5 h-5 mr-3" />
                  Continue with Google
                </Button>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">or</span>
                </div>
              </div>

              {/* Email/Password Form */}
              <form onSubmit={form.handleSubmit(handleEmailSignIn)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business email address
                  </label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    {...form.register('email')}
                    className="w-full h-12 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500"
                  />
                  {form.formState.errors.email && (
                    <p className="mt-2 text-sm text-red-600">{form.formState.errors.email.message}</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      {...form.register('password')}
                      className="w-full h-12 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500 pr-12"
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
                  className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </Button>
              </form>

              <div className="text-center mt-6">
                <p className="text-xs text-gray-500 mb-4">
                  By signing in, you agree to our{' '}
                  <Link href="/terms-of-service" className="text-blue-600 hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy-policy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </Link>
                </p>
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link href="/signup" className="text-blue-600 hover:underline font-medium">
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}