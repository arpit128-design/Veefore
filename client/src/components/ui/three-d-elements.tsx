import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

// 3D Floating Sphere with Interactive Physics
export const FloatingSphere = ({ 
  size = 100, 
  color = '#6366f1', 
  delay = 0,
  interactive = true 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 });
  
  const rotateX = useTransform(springY, [-300, 300], [15, -15]);
  const rotateY = useTransform(springX, [-300, 300], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  return (
    <motion.div
      className="relative"
      style={{ 
        width: size, 
        height: size,
        rotateX,
        rotateY,
        perspective: 1000
      }}
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        y: 0,
        rotateZ: [0, 360]
      }}
      transition={{ 
        duration: 0.8, 
        delay,
        rotateZ: { duration: 20, repeat: Infinity, ease: "linear" }
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        mouseX.set(0);
        mouseY.set(0);
      }}
    >
      {/* Main Sphere */}
      <motion.div
        className="w-full h-full rounded-full relative overflow-hidden"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${color}aa, ${color}44, ${color}22)`,
          boxShadow: `0 0 ${size/2}px ${color}33, inset 0 0 ${size/4}px ${color}66`
        }}
        animate={{
          scale: isHovered ? 1.1 : 1,
          boxShadow: isHovered 
            ? `0 0 ${size}px ${color}66, inset 0 0 ${size/3}px ${color}88`
            : `0 0 ${size/2}px ${color}33, inset 0 0 ${size/4}px ${color}66`
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Glossy Highlight */}
        <div 
          className="absolute top-3 left-3 w-1/3 h-1/3 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
            filter: 'blur(2px)'
          }}
        />
        
        {/* Internal Glow Rings */}
        <motion.div 
          className="absolute inset-4 rounded-full border-2 border-white/20"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute inset-8 rounded-full border border-white/10"
          animate={{ rotate: -360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
      
      {/* Orbiting Particles */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white/60 rounded-full"
          style={{
            top: '50%',
            left: '50%',
            marginTop: -1,
            marginLeft: -1
          }}
          animate={{
            x: [0, Math.cos(i * (Math.PI * 2 / 3)) * (size/2 + 20)],
            y: [0, Math.sin(i * (Math.PI * 2 / 3)) * (size/2 + 20)],
            scale: [1, 0.5, 1],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: "linear",
            delay: i * 0.5
          }}
        />
      ))}
    </motion.div>
  );
};

// 3D Cube with Holographic Effect
export const HolographicCube = ({ 
  size = 80, 
  color = '#8b5cf6',
  rotationSpeed = 10 
}) => {
  return (
    <motion.div
      className="relative"
      style={{ 
        width: size, 
        height: size,
        perspective: 1000,
        transformStyle: 'preserve-3d'
      }}
      initial={{ opacity: 0, rotateX: 45, rotateY: 45 }}
      animate={{ 
        opacity: 1,
        rotateX: [45, 405],
        rotateY: [45, 405]
      }}
      transition={{ 
        duration: rotationSpeed,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      {/* Cube Faces */}
      {[
        { transform: `translateZ(${size/2}px)`, bg: `${color}88` },
        { transform: `rotateY(90deg) translateZ(${size/2}px)`, bg: `${color}66` },
        { transform: `rotateY(180deg) translateZ(${size/2}px)`, bg: `${color}44` },
        { transform: `rotateY(-90deg) translateZ(${size/2}px)`, bg: `${color}66` },
        { transform: `rotateX(90deg) translateZ(${size/2}px)`, bg: `${color}55` },
        { transform: `rotateX(-90deg) translateZ(${size/2}px)`, bg: `${color}55` }
      ].map((face, i) => (
        <div
          key={i}
          className="absolute inset-0 border border-white/20"
          style={{
            transform: face.transform,
            background: face.bg,
            backdropFilter: 'blur(10px)'
          }}
        />
      ))}
      
      {/* Holographic Glow */}
      <div 
        className="absolute inset-0 rounded-lg"
        style={{
          boxShadow: `0 0 ${size}px ${color}44`,
          background: `radial-gradient(circle, transparent 60%, ${color}22 100%)`
        }}
      />
    </motion.div>
  );
};

// Animated Geometric Patterns
export const GeometricPattern = ({ 
  pattern = 'hexagon',
  size = 60,
  color = '#06b6d4',
  animate = true 
}) => {
  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: { duration: 2, ease: "easeInOut" }
    }
  };

  const hexagonPath = "M30 5 L50 18 L50 42 L30 55 L10 42 L10 18 Z";
  const trianglePath = "M30 10 L50 50 L10 50 Z";
  const circlePath = "M30 10 A20 20 0 1 1 29.9 10";

  const getPath = () => {
    switch(pattern) {
      case 'triangle': return trianglePath;
      case 'circle': return circlePath;
      default: return hexagonPath;
    }
  };

  return (
    <motion.div
      className="relative"
      style={{ width: size, height: size }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 60 60"
        className="absolute inset-0"
      >
        <motion.path
          d={getPath()}
          fill="none"
          stroke={color}
          strokeWidth="2"
          variants={pathVariants}
          initial="hidden"
          animate={animate ? "visible" : "hidden"}
          style={{
            filter: `drop-shadow(0 0 10px ${color}66)`
          }}
        />
        
        {/* Inner Glow */}
        <motion.path
          d={getPath()}
          fill={`${color}22`}
          stroke="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.6, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </svg>
      
      {/* Pulsing Center Dot */}
      <motion.div 
        className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full"
        style={{ 
          background: color,
          marginTop: -4,
          marginLeft: -4,
          boxShadow: `0 0 10px ${color}`
        }}
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  );
};

// Particle System
export const ParticleField = ({ 
  count = 50,
  color = '#ffffff',
  speed = 1 
}) => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
    delay: number;
  }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: (Math.random() * 10 + 5) / speed,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);
  }, [count, speed]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            background: color,
            boxShadow: `0 0 ${particle.size * 2}px ${color}`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

// 3D Card Container
export const ThreeDCard = ({ 
  children, 
  className = "",
  glowColor = "#6366f1",
  tiltIntensity = 10 
}) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    setRotateX((-mouseY / rect.height) * tiltIntensity);
    setRotateY((mouseX / rect.width) * tiltIntensity);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      className={`relative ${className}`}
      style={{
        perspective: 1000,
        transformStyle: 'preserve-3d'
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX,
        rotateY,
        scale: isHovered ? 1.02 : 1
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div 
        className="relative bg-background/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
        style={{
          boxShadow: isHovered 
            ? `0 25px 50px ${glowColor}40, 0 0 0 1px ${glowColor}20`
            : `0 10px 30px rgba(0,0,0,0.3), 0 0 0 1px ${glowColor}10`
        }}
      >
        {/* Holographic overlay */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `linear-gradient(45deg, transparent 30%, ${glowColor}40 50%, transparent 70%)`,
            transform: isHovered ? 'translateX(100%)' : 'translateX(-100%)',
            transition: 'transform 0.6s ease'
          }}
        />
        {children}
      </div>
    </motion.div>
  );
};