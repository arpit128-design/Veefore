import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkle: number;
}

export const OptimizedSpaceBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number>();
  const starsRef = useRef<Star[]>([]);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize canvas size once
    const initializeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Create stars only once
      const count = 120; // Optimized count
      starsRef.current = [];
      for (let i = 0; i < count; i++) {
        starsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.7 + 0.3,
          twinkle: Math.random() * Math.PI * 2
        });
      }
    };

    // Optimized animation loop
    let lastFrameTime = 0;
    const animate = (currentTime: number) => {
      // Limit to 24fps for better performance
      if (currentTime - lastFrameTime < 42) {
        animationIdRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrameTime = currentTime;

      timeRef.current += 0.02;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw optimized stars
      starsRef.current.forEach((star, index) => {
        // Simplified twinkling
        star.twinkle += 0.015;
        const twinkleOpacity = star.opacity * (0.8 + 0.2 * Math.sin(star.twinkle));

        // Main star
        ctx.fillStyle = `rgba(255, 255, 255, ${twinkleOpacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Minimal glow for large stars only
        if (star.size > 2.5) {
          ctx.fillStyle = `rgba(255, 255, 255, ${twinkleOpacity * 0.15})`;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 1.3, 0, Math.PI * 2);
          ctx.fill();
        }

        // Simple drift
        star.x -= 0.1;
        if (star.x < -10) {
          star.x = canvas.width + 10;
          star.y = Math.random() * canvas.height;
        }
      });

      animationIdRef.current = requestAnimationFrame(animate);
    };

    // Debounced resize handler
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;
        
        // Only resize if significant change
        if (Math.abs(canvas.width - newWidth) > 100 || Math.abs(canvas.height - newHeight) > 100) {
          initializeCanvas();
        }
      }, 250);
    };

    initializeCanvas();
    animate(0);
    
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  return (
    <>
      {/* Optimized canvas background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ 
          zIndex: -1,
          willChange: 'auto',
          imageRendering: 'pixelated'
        }}
      />
      
      {/* Static gradient overlay */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: -2,
          background: `
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(120, 200, 255, 0.1) 0%, transparent 50%),
            linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)
          `
        }}
      />
    </>
  );
};