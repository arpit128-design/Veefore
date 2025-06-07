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

      {/* Enhanced Starfield - 60 Twinkling Stars */}
      <div className="space-stars fixed inset-0 pointer-events-none" style={{ zIndex: 5 }}>
        {/* First Row of Stars */}
        <div className="absolute w-1 h-1 bg-white rounded-full animate-twinkle-fast" style={{ top: '5%', left: '8%', animationDelay: '0s' }} />
        <div className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-twinkle" style={{ top: '8%', left: '22%', animationDelay: '0.3s' }} />
        <div className="absolute w-1.5 h-1.5 bg-yellow-300 rounded-full animate-twinkle-slow" style={{ top: '12%', left: '38%', animationDelay: '0.6s' }} />
        <div className="absolute w-1 h-1 bg-blue-300 rounded-full animate-twinkle-fast" style={{ top: '7%', left: '55%', animationDelay: '0.9s' }} />
        <div className="absolute w-1 h-1 bg-white rounded-full animate-twinkle" style={{ top: '15%', left: '72%', animationDelay: '1.2s' }} />
        <div className="absolute w-1 h-1 bg-cyan-300 rounded-full animate-twinkle-slow" style={{ top: '10%', left: '88%', animationDelay: '1.5s' }} />
        <div className="absolute w-1.5 h-1.5 bg-yellow-400 rounded-full animate-twinkle-fast" style={{ top: '18%', left: '95%', animationDelay: '1.8s' }} />
        
        {/* Second Row */}
        <div className="absolute w-1 h-1 bg-white rounded-full animate-twinkle" style={{ top: '22%', left: '12%', animationDelay: '2.1s' }} />
        <div className="absolute w-1 h-1 bg-blue-400 rounded-full animate-twinkle-slow" style={{ top: '25%', left: '28%', animationDelay: '2.4s' }} />
        <div className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-twinkle-fast" style={{ top: '28%', left: '45%', animationDelay: '2.7s' }} />
        <div className="absolute w-1.5 h-1.5 bg-white rounded-full animate-twinkle" style={{ top: '20%', left: '62%', animationDelay: '3.0s' }} />
        <div className="absolute w-1 h-1 bg-yellow-300 rounded-full animate-twinkle-slow" style={{ top: '30%', left: '78%', animationDelay: '0.4s' }} />
        <div className="absolute w-1 h-1 bg-blue-300 rounded-full animate-twinkle-fast" style={{ top: '24%', left: '85%', animationDelay: '0.7s' }} />
        
        {/* Third Row */}
        <div className="absolute w-1 h-1 bg-cyan-300 rounded-full animate-twinkle" style={{ top: '35%', left: '5%', animationDelay: '1.0s' }} />
        <div className="absolute w-1.5 h-1.5 bg-white rounded-full animate-twinkle-fast" style={{ top: '38%', left: '18%', animationDelay: '1.3s' }} />
        <div className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-twinkle-slow" style={{ top: '42%', left: '35%', animationDelay: '1.6s' }} />
        <div className="absolute w-1 h-1 bg-blue-400 rounded-full animate-twinkle" style={{ top: '40%', left: '52%', animationDelay: '1.9s' }} />
        <div className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-twinkle-fast" style={{ top: '36%', left: '68%', animationDelay: '2.2s' }} />
        <div className="absolute w-1 h-1 bg-white rounded-full animate-twinkle-slow" style={{ top: '44%', left: '82%', animationDelay: '2.5s' }} />
        <div className="absolute w-1.5 h-1.5 bg-yellow-300 rounded-full animate-twinkle" style={{ top: '39%', left: '95%', animationDelay: '2.8s' }} />
        
        {/* Fourth Row */}
        <div className="absolute w-1 h-1 bg-blue-300 rounded-full animate-twinkle-fast" style={{ top: '48%', left: '10%', animationDelay: '0.2s' }} />
        <div className="absolute w-1 h-1 bg-white rounded-full animate-twinkle" style={{ top: '52%', left: '25%', animationDelay: '0.5s' }} />
        <div className="absolute w-1 h-1 bg-cyan-300 rounded-full animate-twinkle-slow" style={{ top: '55%', left: '42%', animationDelay: '0.8s' }} />
        <div className="absolute w-1.5 h-1.5 bg-yellow-400 rounded-full animate-twinkle-fast" style={{ top: '50%', left: '58%', animationDelay: '1.1s' }} />
        <div className="absolute w-1 h-1 bg-blue-400 rounded-full animate-twinkle" style={{ top: '54%', left: '75%', animationDelay: '1.4s' }} />
        <div className="absolute w-1 h-1 bg-white rounded-full animate-twinkle-slow" style={{ top: '48%', left: '90%', animationDelay: '1.7s' }} />
        
        {/* Fifth Row */}
        <div className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-twinkle" style={{ top: '62%', left: '7%', animationDelay: '2.0s' }} />
        <div className="absolute w-1.5 h-1.5 bg-white rounded-full animate-twinkle-fast" style={{ top: '65%', left: '20%', animationDelay: '2.3s' }} />
        <div className="absolute w-1 h-1 bg-yellow-300 rounded-full animate-twinkle-slow" style={{ top: '68%', left: '38%', animationDelay: '2.6s' }} />
        <div className="absolute w-1 h-1 bg-blue-300 rounded-full animate-twinkle" style={{ top: '60%', left: '55%', animationDelay: '2.9s' }} />
        <div className="absolute w-1 h-1 bg-cyan-300 rounded-full animate-twinkle-fast" style={{ top: '66%', left: '72%', animationDelay: '0.1s' }} />
        <div className="absolute w-1 h-1 bg-white rounded-full animate-twinkle-slow" style={{ top: '63%', left: '88%', animationDelay: '0.4s' }} />
        
        {/* Sixth Row */}
        <div className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-twinkle" style={{ top: '75%', left: '15%', animationDelay: '0.7s' }} />
        <div className="absolute w-1 h-1 bg-blue-400 rounded-full animate-twinkle-fast" style={{ top: '78%', left: '32%', animationDelay: '1.0s' }} />
        <div className="absolute w-1.5 h-1.5 bg-cyan-400 rounded-full animate-twinkle-slow" style={{ top: '72%', left: '48%', animationDelay: '1.3s' }} />
        <div className="absolute w-1 h-1 bg-white rounded-full animate-twinkle" style={{ top: '76%', left: '65%', animationDelay: '1.6s' }} />
        <div className="absolute w-1 h-1 bg-yellow-300 rounded-full animate-twinkle-fast" style={{ top: '80%', left: '82%', animationDelay: '1.9s' }} />
        
        {/* Seventh Row */}
        <div className="absolute w-1 h-1 bg-blue-300 rounded-full animate-twinkle-slow" style={{ top: '85%', left: '8%', animationDelay: '2.2s' }} />
        <div className="absolute w-1 h-1 bg-white rounded-full animate-twinkle" style={{ top: '88%', left: '25%', animationDelay: '2.5s' }} />
        <div className="absolute w-1 h-1 bg-cyan-300 rounded-full animate-twinkle-fast" style={{ top: '90%', left: '40%', animationDelay: '2.8s' }} />
        <div className="absolute w-1.5 h-1.5 bg-yellow-400 rounded-full animate-twinkle-slow" style={{ top: '87%', left: '58%', animationDelay: '0.3s' }} />
        <div className="absolute w-1 h-1 bg-blue-400 rounded-full animate-twinkle" style={{ top: '92%', left: '75%', animationDelay: '0.6s' }} />
        <div className="absolute w-1 h-1 bg-white rounded-full animate-twinkle-fast" style={{ top: '85%', left: '90%', animationDelay: '0.9s' }} />
        
        {/* Additional scattered stars for density */}
        <div className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-twinkle" style={{ top: '33%', left: '15%', animationDelay: '1.2s' }} />
        <div className="absolute w-1 h-1 bg-yellow-300 rounded-full animate-twinkle-fast" style={{ top: '58%', left: '8%', animationDelay: '1.5s' }} />
        <div className="absolute w-1 h-1 bg-blue-300 rounded-full animate-twinkle-slow" style={{ top: '45%', left: '93%', animationDelay: '1.8s' }} />
        <div className="absolute w-1 h-1 bg-white rounded-full animate-twinkle" style={{ top: '73%', left: '12%', animationDelay: '2.1s' }} />
        <div className="absolute w-1 h-1 bg-cyan-300 rounded-full animate-twinkle-fast" style={{ top: '27%', left: '92%', animationDelay: '2.4s' }} />
        <div className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-twinkle-slow" style={{ top: '83%', left: '28%', animationDelay: '2.7s' }} />
        <div className="absolute w-1 h-1 bg-blue-400 rounded-full animate-twinkle" style={{ top: '17%', left: '48%', animationDelay: '3.0s' }} />
        <div className="absolute w-1 h-1 bg-white rounded-full animate-twinkle-fast" style={{ top: '53%', left: '88%', animationDelay: '0.2s' }} />
        <div className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-twinkle-slow" style={{ top: '67%', left: '22%', animationDelay: '0.5s' }} />
        <div className="absolute w-1 h-1 bg-yellow-300 rounded-full animate-twinkle" style={{ top: '37%', left: '78%', animationDelay: '0.8s' }} />
        <div className="absolute w-1 h-1 bg-blue-300 rounded-full animate-twinkle-fast" style={{ top: '77%', left: '58%', animationDelay: '1.1s' }} />
        <div className="absolute w-1 h-1 bg-white rounded-full animate-twinkle-slow" style={{ top: '13%', left: '88%', animationDelay: '1.4s' }} />
        <div className="absolute w-1 h-1 bg-cyan-300 rounded-full animate-twinkle" style={{ top: '93%', left: '45%', animationDelay: '1.7s' }} />
        <div className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-twinkle-fast" style={{ top: '23%', left: '8%', animationDelay: '2.0s' }} />
        <div className="absolute w-1 h-1 bg-blue-400 rounded-full animate-twinkle-slow" style={{ top: '47%', left: '35%', animationDelay: '2.3s' }} />
        <div className="absolute w-1 h-1 bg-white rounded-full animate-twinkle" style={{ top: '87%', left: '68%', animationDelay: '2.6s' }} />
        <div className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-twinkle-fast" style={{ top: '57%', left: '95%', animationDelay: '2.9s' }} />
        <div className="absolute w-1 h-1 bg-yellow-300 rounded-full animate-twinkle-slow" style={{ top: '97%', left: '15%', animationDelay: '0.1s' }} />
        <div className="absolute w-1 h-1 bg-blue-300 rounded-full animate-twinkle" style={{ top: '3%', left: '65%', animationDelay: '0.4s' }} />
        <div className="absolute w-1 h-1 bg-white rounded-full animate-twinkle-fast" style={{ top: '43%', left: '18%', animationDelay: '0.7s' }} />
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