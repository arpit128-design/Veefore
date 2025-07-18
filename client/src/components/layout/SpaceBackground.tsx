import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkle: number;
}

export function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const stars: Star[] = [];
    let time = 0;

    let resizeTimeout: NodeJS.Timeout;
    const resize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;
        
        // Only resize if dimensions changed significantly to prevent excessive recreations
        if (Math.abs(canvas.width - newWidth) > 50 || Math.abs(canvas.height - newHeight) > 50) {
          canvas.width = newWidth;
          canvas.height = newHeight;
          createStars();
        }
      }, 150);
    };

    const createStars = () => {
      stars.length = 0;
      const count = 150; // Reduced for better performance
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 4 + 2, // Bigger stars: 2-6px
          opacity: Math.random() * 0.6 + 0.4, // Brighter: 0.4-1.0
          twinkle: Math.random() * Math.PI * 2
        });
      }
      console.log('[SPACE] Created', count, 'stars at canvas size:', canvas.width, 'x', canvas.height);
    };

    let lastTime = 0;
    const animate = (currentTime: number) => {
      // Throttle to 30fps for better performance
      if (currentTime - lastTime < 33) {
        animationId = requestAnimationFrame(animate);
        return;
      }
      lastTime = currentTime;
      
      time += 0.016;
      
      // Set canvas to full size and clear
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw bright, visible stars
      stars.forEach((star, index) => {
        // Enhanced twinkling effect (reduced calculation frequency)
        star.twinkle += 0.02;
        const twinkleOpacity = Math.max(0.6, star.opacity * (0.7 + 0.3 * Math.sin(star.twinkle)));

        // Main bright white star
        ctx.fillStyle = `rgba(255, 255, 255, ${twinkleOpacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Simplified glow effect (only for larger stars)
        if (star.size > 3) {
          ctx.fillStyle = `rgba(255, 255, 255, ${twinkleOpacity * 0.2})`;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 1.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Reduced colored accent stars
        if (index % 6 === 0) {
          ctx.fillStyle = `rgba(6, 182, 212, ${twinkleOpacity * 0.6})`;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 0.7, 0, Math.PI * 2);
          ctx.fill();
        }

        // Drift movement
        star.x -= 0.2;
        if (star.x < -20) {
          star.x = canvas.width + 20;
          star.y = Math.random() * canvas.height;
        }
      });

      ctx.restore();
      animationId = requestAnimationFrame(animate);
    };

    resize();
    animate(0);
    console.log('[SPACE] Animation started');

    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <>
      {/* Dark Space Base Layer */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{ 
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #0f172a 50%, #000000 100%)',
          zIndex: -10
        }}
      ></div>

      {/* White Starfield - Small Moving Stars */}
      <div className="space-stars fixed inset-0 pointer-events-none" style={{ zIndex: 5 }}>
        {Array.from({ length: 100 }, (_, i) => {
          const sizes = ['w-px h-px', 'w-0.5 h-0.5', 'w-1 h-1'];
          const animations = ['animate-starlight', 'animate-starlight-fast', 'animate-starlight-slow', 'animate-stellar-pulse', 'animate-cosmic-drift'];
          const size = sizes[i % sizes.length];
          const animation = animations[i % animations.length];
          
          // Use multiple mathematical operations to create truly random distribution
          const seed1 = (i * 3571 + Math.sin(i) * 10000) % 100;
          const seed2 = (i * 7919 + Math.cos(i) * 10000) % 100;
          const seed3 = (i * 2741 + Math.sin(i * 1.3) * 10000) % 100;
          const seed4 = (i * 5009 + Math.cos(i * 2.1) * 10000) % 100;
          
          const top = Math.abs((seed1 + seed3 * 0.7) % 100);
          const left = Math.abs((seed2 + seed4 * 0.9) % 100);
          const delay = (i * 0.05 + Math.sin(i * 0.1)) % 3;
          
          return (
            <div 
              key={i}
              className={`absolute ${size} bg-white rounded-full ${animation}`}
              style={{ 
                top: `${top}%`, 
                left: `${left}%`, 
                animationDelay: `${Math.abs(delay)}s` 
              }} 
            />
          );
        })}
      </div>

      {/* Shooting Stars - Positioned between background and content */}
      <div className="shooting-stars fixed inset-0 pointer-events-none" style={{ zIndex: 4 }}>
        {Array.from({ length: 1 }, (_, i) => (
          <div
            key={i}
            className="shooting-star"
            style={{
              left: `${Math.random() * 30}%`,
              top: `${Math.random() * 40}%`,
              animationDelay: `${i * 15 + Math.random() * 10}s`,
              animationDuration: `${5 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>
      
      {/* Animated Star Field Background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none w-full h-full"
        style={{ 
          zIndex: -5,
          width: '100vw',
          height: '100vh'
        }}
      />
      
      {/* Nebula Background Effects */}
      <div 
        className="fixed top-20 left-20 w-96 h-96 nebula-glow rounded-full opacity-30 animate-drift pointer-events-none"
        style={{ zIndex: -8 }}
      ></div>
      <div 
        className="fixed bottom-40 right-20 w-64 h-64 nebula-glow rounded-full opacity-20 animate-drift pointer-events-none" 
        style={{ animationDelay: '-10s', zIndex: -8 }}
      ></div>
    </>
  );
}