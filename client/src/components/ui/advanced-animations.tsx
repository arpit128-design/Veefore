import { motion, useAnimation, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

// Staggered Text Animation
export const AnimatedText = ({ 
  text, 
  className = "",
  delay = 0,
  duration = 0.8,
  stagger = 0.1 
}) => {
  const words = text.split(' ');
  
  return (
    <div className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 50, rotateX: -90 }}
          animate={{ 
            opacity: 1, 
            y: 0, 
            rotateX: 0,
            transition: {
              duration,
              delay: delay + i * stagger,
              ease: "easeOut"
            }
          }}
          className="inline-block mr-2"
          style={{ transformOrigin: 'bottom' }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
};

// Morphing Icon Animation
export const MorphingIcon = ({ 
  icons, 
  size = 24, 
  color = "currentColor",
  interval = 2000 
}) => {
  const [currentIcon, setCurrentIcon] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIcon((prev) => (prev + 1) % icons.length);
    }, interval);
    
    return () => clearInterval(timer);
  }, [icons.length, interval]);
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {icons.map((Icon, index) => (
        <motion.div
          key={index}
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            opacity: currentIcon === index ? 1 : 0,
            scale: currentIcon === index ? 1 : 0.8,
            rotate: currentIcon === index ? 0 : 180
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <Icon size={size} color={color} />
        </motion.div>
      ))}
    </div>
  );
};

// Liquid Loading Animation
export const LiquidLoader = ({ 
  progress = 0, 
  size = 100, 
  color = "#6366f1" 
}) => {
  return (
    <div 
      className="relative rounded-full border-2 border-white/20 overflow-hidden"
      style={{ width: size, height: size }}
    >
      <motion.div
        className="absolute bottom-0 left-0 right-0"
        style={{
          background: `linear-gradient(180deg, ${color}ff 0%, ${color}aa 100%)`,
          borderRadius: '50% 50% 0 0'
        }}
        animate={{
          height: `${progress}%`,
          borderRadius: progress > 50 ? '0 0 50% 50%' : '50% 50% 0 0'
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      
      {/* Liquid Surface Animation */}
      <motion.div
        className="absolute left-0 right-0"
        style={{
          top: `${100 - progress}%`,
          height: 4,
          background: `${color}dd`,
          borderRadius: '50%'
        }}
        animate={{
          scaleY: [1, 1.2, 1],
          opacity: [0.8, 1, 0.8]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Percentage Text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span 
          className="text-sm font-bold text-white"
          key={progress}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {Math.round(progress)}%
        </motion.span>
      </div>
    </div>
  );
};

// Holographic Button
export const HolographicButton = ({ 
  children, 
  onClick, 
  className = "",
  glowColor = "#6366f1",
  disabled = false 
}) => {
  const [isPressed, setIsPressed] = useState(false);
  
  return (
    <motion.button
      className={`relative overflow-hidden rounded-xl px-6 py-3 font-semibold text-white ${className}`}
      style={{
        background: `linear-gradient(135deg, ${glowColor}aa 0%, ${glowColor}66 100%)`,
        border: `1px solid ${glowColor}44`,
        backdropFilter: 'blur(10px)'
      }}
      onClick={onClick}
      disabled={disabled}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      whileHover={{ 
        scale: 1.02,
        boxShadow: `0 10px 30px ${glowColor}66, 0 0 0 1px ${glowColor}88`
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      {/* Holographic Sweep */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(45deg, transparent 30%, ${glowColor}88 50%, transparent 70%)`,
        }}
        animate={{
          x: isPressed ? '100%' : '-100%'
        }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
      
      {/* Content */}
      <span className="relative z-10">{children}</span>
      
      {/* Bottom Glow */}
      <div 
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-1"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${glowColor}ff 50%, transparent 100%)`,
          filter: 'blur(2px)'
        }}
      />
    </motion.button>
  );
};

// Scroll Reveal Animation
export const ScrollReveal = ({ 
  children, 
  direction = 'up', 
  delay = 0,
  duration = 0.6 
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  
  const directions = {
    up: { y: 50, x: 0 },
    down: { y: -50, x: 0 },
    left: { x: 50, y: 0 },
    right: { x: -50, y: 0 }
  };
  
  return (
    <motion.div
      ref={ref}
      initial={{ 
        opacity: 0, 
        ...directions[direction],
        scale: 0.9
      }}
      animate={isInView ? { 
        opacity: 1, 
        x: 0, 
        y: 0, 
        scale: 1 
      } : {}}
      transition={{ 
        duration, 
        delay, 
        ease: "easeOut" 
      }}
    >
      {children}
    </motion.div>
  );
};

// Magnetic Element
export const MagneticElement = ({ 
  children, 
  strength = 20,
  className = "" 
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const elementRef = useRef(null);
  
  const handleMouseMove = (e) => {
    if (!elementRef.current) return;
    
    const rect = elementRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) * 0.1;
    const deltaY = (e.clientY - centerY) * 0.1;
    
    setPosition({ 
      x: Math.max(-strength, Math.min(strength, deltaX)), 
      y: Math.max(-strength, Math.min(strength, deltaY)) 
    });
  };
  
  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };
  
  return (
    <motion.div
      ref={elementRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      {children}
    </motion.div>
  );
};

// Typewriter Effect
export const TypewriterText = ({ 
  text, 
  speed = 50, 
  delay = 0,
  className = "",
  cursor = true 
}) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      let index = 0;
      const interval = setInterval(() => {
        if (index <= text.length) {
          setDisplayText(text.substring(0, index));
          index++;
        } else {
          setIsComplete(true);
          clearInterval(interval);
        }
      }, speed);
      
      return () => clearInterval(interval);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [text, speed, delay]);
  
  return (
    <span className={className}>
      {displayText}
      {cursor && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ 
            duration: 0.8, 
            repeat: isComplete ? 0 : Infinity,
            repeatType: "reverse" 
          }}
          className="ml-1"
        >
          |
        </motion.span>
      )}
    </span>
  );
};

// Glitch Effect
export const GlitchText = ({ 
  text, 
  className = "",
  intensity = 1 
}) => {
  return (
    <div className={`relative ${className}`}>
      <motion.span 
        className="relative z-10"
        animate={{
          textShadow: [
            "0 0 0 transparent",
            `${2 * intensity}px 0 0 #ff0000, ${-2 * intensity}px 0 0 #00ffff`,
            "0 0 0 transparent"
          ]
        }}
        transition={{
          duration: 0.1,
          repeat: Infinity,
          repeatType: "reverse",
          times: [0, 0.5, 1]
        }}
      >
        {text}
      </motion.span>
      
      {/* Glitch layers */}
      <motion.span 
        className="absolute inset-0 text-red-500 opacity-70"
        animate={{
          x: [0, intensity * 2, 0],
          opacity: [0, 0.7, 0]
        }}
        transition={{
          duration: 0.15,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        {text}
      </motion.span>
      
      <motion.span 
        className="absolute inset-0 text-cyan-500 opacity-70"
        animate={{
          x: [0, -intensity * 2, 0],
          opacity: [0, 0.7, 0]
        }}
        transition={{
          duration: 0.2,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        {text}
      </motion.span>
    </div>
  );
};