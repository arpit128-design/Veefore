import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';

interface OptimizedSpaceBackgroundProps {
  particleCount?: number;
  className?: string;
}

const OptimizedSpaceBackground = memo(({ particleCount = 25, className = "" }: OptimizedSpaceBackgroundProps) => {
  // Memoize particle positions to prevent recalculation on each render
  const particles = useMemo(() => {
    return Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 4 + 3,
      delay: Math.random() * 2,
    }));
  }, [particleCount]);

  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Static gradient background - no animation for better performance */}
      <div className="absolute inset-0 bg-gradient-to-br from-space-black via-cosmic-void to-space-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent" />
      
      {/* Optimized particles with reduced animation complexity */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute bg-white rounded-full opacity-30"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          animate={{
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
});

OptimizedSpaceBackground.displayName = 'OptimizedSpaceBackground';

export { OptimizedSpaceBackground };