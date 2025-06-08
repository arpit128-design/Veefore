import { motion } from 'framer-motion';

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
  return (
    <div className={`fixed inset-0 bg-gradient-to-b from-space-navy via-space-navy to-cosmic-blue overflow-hidden ${className}`}>
      {/* Animated Stars Background */}
      <div className="absolute inset-0">
        {Array.from({ length: 100 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
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
            {/* Orbital Rings */}
            <motion.div 
              className="absolute inset-0 w-32 h-32 border-2 border-blue-400/30 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
              className="absolute inset-4 w-24 h-24 border border-purple-400/20 rounded-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            />
            
            {/* VeeFore Logo */}
            <div className="relative w-32 h-32 flex items-center justify-center">
              <motion.img
                src="/veefore-logo.png"
                alt="VeeFore Logo"
                className="w-20 h-20 object-contain"
                animate={{
                  scale: [1, 1.1, 1],
                  filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Pulsing Glow */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-xl"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.7, 0.3]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
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