import { motion } from 'framer-motion';
import { Sparkles, Rocket, Target, TrendingUp, Instagram, Palette } from 'lucide-react';

export function FloatingRocket() {
  return (
    <motion.div
      className="absolute top-20 right-20 z-10"
      animate={{
        y: [0, -20, 0],
        rotate: [0, 5, -5, 0],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
        <Rocket className="w-8 h-8 text-white" />
      </div>
    </motion.div>
  );
}

export function FloatingSparkles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: 0,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
            scale: [0.5, 1.2, 0.5],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut"
          }}
        >
          <Sparkles className="w-4 h-4 text-blue-400" />
        </motion.div>
      ))}
    </div>
  );
}

export function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gradient-to-br from-purple-400 to-pink-500 opacity-20"
          style={{
            width: 20 + Math.random() * 40,
            height: 20 + Math.random() * 40,
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
          }}
          animate={{
            x: [0, 50, -50, 0],
            y: [0, -30, 30, 0],
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
}

export function FloatingIcons() {
  const icons = [Target, TrendingUp, Instagram, Palette];
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map((Icon, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: 20 + (i * 25) + '%',
            top: 10 + (i * 15) + '%',
          }}
          animate={{
            y: [0, -15, 0],
            rotate: [0, 10, -10, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 5 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        >
          <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <Icon className="w-6 h-6 text-white/70" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}