import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface SpaceLoaderProps {
  message?: string;
  progress?: number;
  className?: string;
}

export function SpaceLoader({ 
  message = "Loading VeeFore", 
  progress = 0, 
  className = "" 
}: SpaceLoaderProps) {
  // Generate stars data once and memoize for performance
  const stars = useMemo(() => 
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() > 0.8 ? 'w-1 h-1' : 'w-0.5 h-0.5',
      delay: Math.random() * 4,
      duration: 2 + Math.random() * 2
    })), []
  );

  return (
    <div className={`fixed inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 overflow-hidden ${className}`}>
      {/* Optimized CSS-based Stars Background */}
      <div className="absolute inset-0">
        {stars.map((star) => (
          <div
            key={star.id}
            className={`absolute ${star.size} bg-white rounded-full animate-pulse`}
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Additional subtle twinkling layer */}
      <div className="absolute inset-0 opacity-60">
        {stars.slice(0, 15).map((star) => (
          <div
            key={`twinkle-${star.id}`}
            className="absolute w-px h-px bg-blue-200 rounded-full animate-ping"
            style={{
              left: `${(star.left + 10) % 100}%`,
              top: `${(star.top + 15) % 100}%`,
              animationDelay: `${star.delay + 1}s`,
              animationDuration: `${star.duration + 1}s`,
            }}
          />
        ))}
      </div>

      {/* Central Logo Animation */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          {/* VeeFore Logo with Animation */}
          <motion.div
            className="relative mb-8"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Orbital Rings - CSS Animation for better performance */}
            <div className="absolute inset-0 w-32 h-32 border-2 border-blue-400/30 rounded-full animate-spin-slow" />
            <div className="absolute inset-4 w-24 h-24 border border-purple-400/20 rounded-full animate-spin-reverse" />
            
            {/* VeeFore Logo */}
            <div className="relative w-32 h-32 flex items-center justify-center">
              <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full animate-pulse-slow">
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  V
                </span>
              </div>
              
              {/* Pulsing Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-xl animate-pulse-glow" />
            </div>
          </motion.div>

          {/* Loading Text */}
          <motion.h2 
            className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            VeeFore
          </motion.h2>
          
          <motion.p 
            className="text-white/70 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            {message}
          </motion.p>
        </div>
      </div>
    </div>
  );
}