import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SpaceLoader } from '@/components/ui/space-loader';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate minimum loading time for smooth transition
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black"
        >
          <SpaceLoader />
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface AuthPageSkeletonProps {
  title: string;
}

export function AuthPageSkeleton({ title }: AuthPageSkeletonProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-black">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
          {/* Logo skeleton */}
          <div className="text-center mb-8">
            <div className="h-8 bg-white/20 rounded-lg mb-4 mx-auto w-32 animate-pulse"></div>
            <div className="h-4 bg-white/10 rounded mx-auto w-24 animate-pulse"></div>
          </div>

          {/* Title skeleton */}
          <div className="text-center mb-6">
            <div className="h-6 bg-white/20 rounded mx-auto w-48 animate-pulse mb-2"></div>
            <div className="h-4 bg-white/10 rounded mx-auto w-64 animate-pulse"></div>
          </div>

          {/* Form skeleton */}
          <div className="space-y-4">
            <div className="h-12 bg-white/10 rounded-lg animate-pulse"></div>
            <div className="h-12 bg-white/10 rounded-lg animate-pulse"></div>
            <div className="h-12 bg-white/10 rounded-lg animate-pulse"></div>
            <div className="h-12 bg-blue-500/20 rounded-lg animate-pulse"></div>
          </div>

          {/* Divider skeleton */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-white/20"></div>
            <div className="px-4 h-4 bg-white/10 rounded w-8 animate-pulse"></div>
            <div className="flex-1 h-px bg-white/20"></div>
          </div>

          {/* Social button skeleton */}
          <div className="h-12 bg-white/10 rounded-lg animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}