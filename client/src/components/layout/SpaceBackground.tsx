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

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createStars();
    };

    const createStars = () => {
      stars.length = 0;
      const count = 300; // More stars for better visibility
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

    const animate = () => {
      time += 0.016;
      
      // Set canvas to full size and clear
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw bright, visible stars
      stars.forEach((star, index) => {
        // Enhanced twinkling effect
        star.twinkle += 0.03;
        const twinkleOpacity = Math.max(0.6, star.opacity * (0.7 + 0.3 * Math.sin(star.twinkle)));

        // Main bright white star
        ctx.fillStyle = `rgba(255, 255, 255, ${twinkleOpacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Add glow effect
        ctx.fillStyle = `rgba(255, 255, 255, ${twinkleOpacity * 0.3})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
        ctx.fill();

        // Colored accent stars
        if (index % 4 === 0) {
          ctx.fillStyle = `rgba(6, 182, 212, ${twinkleOpacity * 0.8})`;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 0.7, 0, Math.PI * 2);
          ctx.fill();
        }

        if (index % 6 === 0) {
          ctx.fillStyle = `rgba(251, 191, 36, ${twinkleOpacity * 0.7})`;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 0.5, 0, Math.PI * 2);
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
    animate();
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

      {/* Visible Animated Stars for Space Effect */}
      <div className="space-stars fixed inset-0 pointer-events-none" style={{ zIndex: 5 }}>
        <div className="absolute w-2 h-2 bg-white rounded-full animate-pulse" style={{ top: '15%', left: '25%', animationDelay: '0s' }} />
        <div className="absolute w-3 h-3 bg-cyan-400 rounded-full animate-pulse" style={{ top: '35%', left: '65%', animationDelay: '0.5s' }} />
        <div className="absolute w-2 h-2 bg-yellow-300 rounded-full animate-pulse" style={{ top: '75%', left: '45%', animationDelay: '1s' }} />
        <div className="absolute w-3 h-3 bg-blue-300 rounded-full animate-pulse" style={{ top: '55%', left: '85%', animationDelay: '1.5s' }} />
        <div className="absolute w-2 h-2 bg-white rounded-full animate-pulse" style={{ top: '25%', left: '15%', animationDelay: '2s' }} />
        <div className="absolute w-2 h-2 bg-cyan-300 rounded-full animate-pulse" style={{ top: '65%', left: '25%', animationDelay: '2.5s' }} />
        <div className="absolute w-3 h-3 bg-yellow-400 rounded-full animate-pulse" style={{ top: '45%', left: '75%', animationDelay: '3s' }} />
        <div className="absolute w-2 h-2 bg-white rounded-full animate-pulse" style={{ top: '85%', left: '35%', animationDelay: '0.3s' }} />
        <div className="absolute w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ top: '20%', left: '80%', animationDelay: '1.2s' }} />
        <div className="absolute w-3 h-3 bg-white rounded-full animate-pulse" style={{ top: '60%', left: '55%', animationDelay: '1.8s' }} />
        <div className="absolute w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ top: '40%', left: '30%', animationDelay: '2.2s' }} />
        <div className="absolute w-2 h-2 bg-yellow-300 rounded-full animate-pulse" style={{ top: '80%', left: '70%', animationDelay: '2.8s' }} />
        <div className="absolute w-3 h-3 bg-white rounded-full animate-pulse" style={{ top: '30%', left: '50%', animationDelay: '0.8s' }} />
        <div className="absolute w-2 h-2 bg-blue-300 rounded-full animate-pulse" style={{ top: '70%', left: '10%', animationDelay: '1.6s' }} />
        <div className="absolute w-2 h-2 bg-cyan-300 rounded-full animate-pulse" style={{ top: '50%', left: '90%', animationDelay: '2.4s' }} />
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