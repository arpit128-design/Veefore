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
            
            {/* Transparent VeeFore Logo with Cool Animation */}
            <div className="relative w-32 h-32 flex items-center justify-center">
              <div className="relative w-28 h-28 flex items-center justify-center">
                {/* Rotating outer ring */}
                <div className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-spin-slow">
                  <div className="absolute inset-0 rounded-full bg-black/80 backdrop-blur-sm m-0.5" />
                </div>
                
                {/* Inner pulsing ring */}
                <div className="absolute inset-3 rounded-full border border-white/10 bg-transparent animate-pulse-glow">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/5 via-purple-400/5 to-pink-400/5" />
                </div>
                
                {/* Floating particles around logo */}
                <div className="absolute -inset-4">
                  <div className="absolute top-2 left-6 w-1 h-1 bg-blue-400 rounded-full animate-float-1" />
                  <div className="absolute top-6 right-4 w-1 h-1 bg-purple-400 rounded-full animate-float-2" />
                  <div className="absolute bottom-4 left-4 w-1 h-1 bg-pink-400 rounded-full animate-float-3" />
                  <div className="absolute bottom-6 right-6 w-1 h-1 bg-cyan-400 rounded-full animate-float-1" />
                </div>
                
                {/* Center "VF" letters with glow */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <span className="text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text font-bold text-2xl tracking-wider animate-text-glow">
                      VF
                    </span>
                    {/* Text shadow glow */}
                    <span className="absolute inset-0 text-blue-400/20 font-bold text-2xl tracking-wider blur-sm">
                      VF
                    </span>
                  </div>
                </div>
                
                {/* Outer shimmer effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
              </div>
            </div>
          </motion.div>

          {/* Loading Text - Centered */}
          <div className="flex flex-col items-center justify-center text-center">
            <motion.h2 
              className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              VeeFore
            </motion.h2>
            
            <motion.p 
              className="text-white/70 text-lg text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              {message}
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
}