import { useEffect, useRef } from 'react';

export function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const stars: Array<{ x: number; y: number; size: number; speed: number; opacity: number }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createStars = (count: number) => {
      stars.length = 0;
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speed: Math.random() * 0.5 + 0.1,
          opacity: Math.random() * 0.8 + 0.2
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw stars
      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
        
        // Move stars
        star.x -= star.speed;
        if (star.x < 0) {
          star.x = canvas.width;
          star.y = Math.random() * canvas.height;
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    resize();
    createStars(200);
    animate();

    window.addEventListener('resize', () => {
      resize();
      createStars(200);
    });

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <>
      {/* Dark Space Base Layer */}
      <div className="fixed inset-0 bg-black z-0"></div>
      
      {/* Animated Star Field Background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-1"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #0f172a 50%, #000000 100%)' }}
      />
      
      {/* Nebula Background Effects */}
      <div className="fixed top-20 left-20 w-96 h-96 nebula-glow rounded-full opacity-30 animate-drift z-1"></div>
      <div className="fixed bottom-40 right-20 w-64 h-64 nebula-glow rounded-full opacity-20 animate-drift z-1" style={{ animationDelay: '-10s' }}></div>
    </>
  );
}
