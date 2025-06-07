import { motion } from 'framer-motion';

// Animated stars component
const AnimatedStar = ({ delay = 0, size = 1, x = 0, y = 0 }: any) => (
  <motion.div
    className="absolute bg-white rounded-full"
    style={{
      width: size,
      height: size,
      left: `${x}%`,
      top: `${y}%`,
    }}
    animate={{
      opacity: [0.3, 1, 0.3],
      scale: [1, 1.5, 1],
    }}
    transition={{
      duration: 2 + delay,
      repeat: Infinity,
      delay: delay,
      ease: "easeInOut"
    }}
  />
);

// Floating nebula clouds
const NebulaCloud = ({ delay = 0, size = 200, x = 0, y = 0, color = "blue" }: any) => (
  <motion.div
    className={`absolute rounded-full blur-3xl opacity-20`}
    style={{
      width: size,
      height: size,
      left: `${x}%`,
      top: `${y}%`,
      background: `radial-gradient(circle, var(--${color}-500) 0%, transparent 70%)`
    }}
    animate={{
      scale: [1, 1.3, 1],
      opacity: [0.1, 0.3, 0.1],
      rotate: [0, 180, 360],
    }}
    transition={{
      duration: 20 + delay,
      repeat: Infinity,
      delay: delay,
      ease: "easeInOut"
    }}
  />
);

// Shooting star effect
const ShootingStar = ({ delay = 0 }: any) => (
  <motion.div
    className="absolute h-0.5 bg-gradient-to-r from-white via-blue-300 to-transparent"
    style={{
      width: 100,
      left: '-100px',
      top: `${Math.random() * 50}%`,
    }}
    animate={{
      x: [0, window.innerWidth + 200],
      opacity: [0, 1, 0],
    }}
    transition={{
      duration: 3,
      delay: delay,
      ease: "easeOut"
    }}
  />
);

export function SpaceBackground() {
  // Generate random positions for stars
  const stars = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 3,
  }));

  // Generate nebula clouds
  const nebulae = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 300 + 150,
    delay: Math.random() * 10,
    color: ['cyan', 'slate', 'yellow', 'blue'][Math.floor(Math.random() * 4)],
  }));

  // Generate shooting stars
  const shootingStars = Array.from({ length: 3 }, (_, i) => ({
    id: i,
    delay: i * 8 + Math.random() * 5,
  }));

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-black" />
      
      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-slate-900/20 via-cyan-900/20 to-yellow-900/20"
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{ backgroundSize: "200% 200%" }}
      />

      {/* Stars */}
      {stars.map((star) => (
        <AnimatedStar
          key={star.id}
          x={star.x}
          y={star.y}
          size={star.size}
          delay={star.delay}
        />
      ))}

      {/* Nebula clouds */}
      {nebulae.map((nebula) => (
        <NebulaCloud
          key={nebula.id}
          x={nebula.x}
          y={nebula.y}
          size={nebula.size}
          delay={nebula.delay}
          color={nebula.color}
        />
      ))}

      {/* Shooting stars */}
      {shootingStars.map((star) => (
        <ShootingStar
          key={star.id}
          delay={star.delay}
        />
      ))}

      {/* Central cosmic glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, transparent 70%)"
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Particle field */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </div>
  );
}