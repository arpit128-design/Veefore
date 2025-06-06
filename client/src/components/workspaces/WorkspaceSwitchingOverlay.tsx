import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Workspace } from '@shared/schema';

interface WorkspaceSwitchingOverlayProps {
  isVisible: boolean;
  currentWorkspace: Workspace | null;
  targetWorkspace: Workspace | null;
}

export function WorkspaceSwitchingOverlay({ 
  isVisible, 
  currentWorkspace, 
  targetWorkspace 
}: WorkspaceSwitchingOverlayProps) {
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    if (isVisible) {
      setAnimationPhase(0);
      const timer1 = setTimeout(() => setAnimationPhase(1), 500);
      const timer2 = setTimeout(() => setAnimationPhase(2), 1000);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backdropFilter: 'blur(10px)' }}
        >
          {/* Background overlay with translucent effect */}
          <div className="absolute inset-0 bg-cosmic-void/80 backdrop-blur-lg"></div>
          
          {/* Animated particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-electric-cyan rounded-full"
                initial={{ 
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  opacity: 0,
                  scale: 0
                }}
                animate={{ 
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0]
                }}
                transition={{ 
                  duration: 2,
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            ))}
          </div>

          {/* Main switching content */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative z-10 text-center max-w-md mx-auto p-8"
          >
            {/* Cosmic rings animation */}
            <div className="relative mb-8">
              <motion.div
                className="w-32 h-32 mx-auto relative"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute inset-0 border-4 border-electric-cyan/30 rounded-full"></div>
                <div className="absolute inset-2 border-2 border-nebula-purple/50 rounded-full"></div>
                <div className="absolute inset-4 border border-solar-gold/40 rounded-full"></div>
              </motion.div>
              
              {/* Center workspace icon */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <div className="w-16 h-16 workspace-planet rounded-full animate-glow"></div>
              </motion.div>
            </div>

            {/* Text content with phase-based animations */}
            <AnimatePresence mode="wait">
              {animationPhase === 0 && (
                <motion.div
                  key="phase0"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <h2 className="text-3xl font-orbitron font-bold neon-text text-electric-cyan">
                    Switching Workspace
                  </h2>
                  <p className="text-asteroid-silver">
                    Preparing to switch from {currentWorkspace?.name}
                  </p>
                </motion.div>
              )}

              {animationPhase === 1 && (
                <motion.div
                  key="phase1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <h2 className="text-3xl font-orbitron font-bold neon-text text-nebula-purple">
                    Transitioning Data
                  </h2>
                  <p className="text-asteroid-silver">
                    Loading isolated workspace environment...
                  </p>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-cosmic-blue rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-electric-cyan to-nebula-purple"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </motion.div>
              )}

              {animationPhase === 2 && (
                <motion.div
                  key="phase2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <h2 className="text-3xl font-orbitron font-bold neon-text text-solar-gold">
                    Welcome to {targetWorkspace?.name}
                  </h2>
                  <p className="text-asteroid-silver">
                    Workspace successfully activated with isolated data
                  </p>
                  
                  {/* Success checkmark */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="mx-auto w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center"
                  >
                    <motion.svg
                      className="w-6 h-6 text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <motion.path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </motion.svg>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Floating elements */}
            <div className="absolute -top-10 -left-10">
              <motion.div
                className="w-4 h-4 bg-electric-cyan rounded-full"
                animate={{ 
                  y: [-10, 10, -10],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            
            <div className="absolute -bottom-10 -right-10">
              <motion.div
                className="w-6 h-6 bg-nebula-purple rounded-full"
                animate={{ 
                  y: [10, -10, 10],
                  opacity: [0.3, 0.8, 0.3]
                }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}