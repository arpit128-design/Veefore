import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SpaceLoaderProps {
  message?: string;
  progress?: number;
  className?: string;
}

export function SpaceLoader({ 
  message = "Initializing Cosmic Systems", 
  progress = 0, 
  className = "" 
}: SpaceLoaderProps) {
  const [dots, setDots] = useState('');
  const [currentPhase, setCurrentPhase] = useState(0);
  
  const phases = [
    "Connecting to VeeFore Network",
    "Calibrating AI Engines",
    "Synchronizing Data Streams",
    "Launching Mission Control",
    "Systems Ready"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const phaseInterval = setInterval(() => {
      setCurrentPhase(prev => (prev + 1) % phases.length);
    }, 2000);
    return () => clearInterval(phaseInterval);
  }, []);

  return (
    <div className={`fixed inset-0 bg-gradient-to-b from-space-black via-deep-purple to-cosmic-blue overflow-hidden ${className}`}>
      {/* Animated Stars Background */}
      <div className="absolute inset-0">
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-0.5 bg-white rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-electric-cyan rounded-full opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, 50, -50, 0],
              y: [0, -30, 30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Central Loading Area */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-8">
          
          {/* 3D Rotating Galaxy */}
          <div className="relative w-32 h-32 mx-auto">
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-electric-cyan/30"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute top-0 left-1/2 w-2 h-2 bg-electric-cyan rounded-full transform -translate-x-1/2 -translate-y-1/2" />
            </motion.div>
            
            <motion.div
              className="absolute inset-2 rounded-full border-2 border-neon-pink/40"
              animate={{ rotate: -360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-neon-pink rounded-full transform -translate-x-1/2 -translate-y-1/2" />
            </motion.div>
            
            <motion.div
              className="absolute inset-4 rounded-full border border-purple-500/50"
              animate={{ rotate: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute top-0 left-1/2 w-1 h-1 bg-purple-400 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
            </motion.div>

            {/* Central Core */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-6 h-6 bg-gradient-to-r from-electric-cyan to-neon-pink rounded-full blur-sm" />
            </motion.div>
          </div>

          {/* Holographic Text */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-2xl font-bold bg-gradient-to-r from-electric-cyan via-neon-pink to-purple-400 bg-clip-text text-transparent">
              {message}
            </h2>
            
            <AnimatePresence mode="wait">
              <motion.p
                key={currentPhase}
                className="text-electric-cyan/80 text-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {phases[currentPhase]}{dots}
              </motion.p>
            </AnimatePresence>
          </motion.div>

          {/* Progress Bar */}
          <div className="w-80 mx-auto space-y-3">
            <div className="relative h-2 bg-gray-800/50 rounded-full overflow-hidden backdrop-blur-sm">
              <motion.div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-electric-cyan to-neon-pink rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress + (currentPhase * 20), 100)}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ['-100%', '300%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </div>
            
            <div className="flex justify-between text-xs text-gray-400">
              <span>Mission Progress</span>
              <span>{Math.min(progress + (currentPhase * 20), 100)}%</span>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="relative">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={`float-${i}`}
                className="absolute w-3 h-3 bg-gradient-to-r from-electric-cyan/40 to-transparent rounded-full"
                style={{
                  left: `${30 + i * 20}%`,
                  top: '50%',
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* Loading Pulse Effect */}
          <motion.div
            className="absolute inset-0 rounded-full border border-electric-cyan/20"
            animate={{
              scale: [1, 2, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        </div>
      </div>

      {/* Corner Decorations */}
      <div className="absolute top-8 left-8">
        <motion.div
          className="w-16 h-16 border-l-2 border-t-2 border-electric-cyan/30"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
      
      <div className="absolute top-8 right-8">
        <motion.div
          className="w-16 h-16 border-r-2 border-t-2 border-neon-pink/30"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
      </div>
      
      <div className="absolute bottom-8 left-8">
        <motion.div
          className="w-16 h-16 border-l-2 border-b-2 border-purple-400/30"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        />
      </div>
      
      <div className="absolute bottom-8 right-8">
        <motion.div
          className="w-16 h-16 border-r-2 border-b-2 border-electric-cyan/30"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
        />
      </div>
    </div>
  );
}

// Simplified version for smaller loading states
export function MiniSpaceLoader({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <motion.div
        className="w-8 h-8 rounded-full border-2 border-electric-cyan/30 border-t-electric-cyan"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-1 rounded-full border border-neon-pink/40"
        animate={{ rotate: -360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        <div className="w-2 h-2 bg-gradient-to-r from-electric-cyan to-neon-pink rounded-full" />
      </motion.div>
    </div>
  );
}