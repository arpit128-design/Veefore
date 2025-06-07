import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleDirection: number;
  color: string;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  life: number;
  maxLife: number;
}

interface CosmicParticle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
  pulse: number;
  pulseSpeed: number;
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
    const shootingStars: ShootingStar[] = [];
    const cosmicParticles: CosmicParticle[] = [];
    let time = 0;

    const colors = {
      white: 'rgba(255, 255, 255, ',
      cyan: 'rgba(6, 182, 212, ',
      gold: 'rgba(251, 191, 36, ',
      purple: 'rgba(124, 58, 237, ',
      blue: 'rgba(59, 130, 246, '
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createStars(150);
      createCosmicParticles(30);
    };

    const createStars = (count: number) => {
      stars.length = 0;
      for (let i = 0; i < count; i++) {
        const colorKeys = Object.keys(colors);
        const randomColor = colors[colorKeys[Math.floor(Math.random() * colorKeys.length)] as keyof typeof colors];
        
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 0.5,
          speed: Math.random() * 0.3 + 0.05,
          opacity: Math.random() * 0.8 + 0.2,
          twinkleSpeed: Math.random() * 0.02 + 0.01,
          twinkleDirection: Math.random() > 0.5 ? 1 : -1,
          color: randomColor
        });
      }
    };

    const createCosmicParticles = (count: number) => {
      cosmicParticles.length = 0;
      for (let i = 0; i < count; i++) {
        const colorKeys = Object.keys(colors);
        const randomColor = colors[colorKeys[Math.floor(Math.random() * colorKeys.length)] as keyof typeof colors];
        
        cosmicParticles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5 + 0.3,
          speedX: (Math.random() - 0.5) * 0.2,
          speedY: (Math.random() - 0.5) * 0.2,
          opacity: Math.random() * 0.6 + 0.1,
          color: randomColor,
          pulse: 0,
          pulseSpeed: Math.random() * 0.03 + 0.01
        });
      }
    };

    const createShootingStar = () => {
      if (Math.random() < 0.002) { // 0.2% chance per frame
        shootingStars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * (canvas.height * 0.6),
          length: Math.random() * 80 + 20,
          speed: Math.random() * 6 + 3,
          angle: Math.random() * Math.PI / 4 + Math.PI / 6, // 30-60 degrees
          opacity: 1,
          life: 0,
          maxLife: Math.random() * 60 + 30
        });
      }
    };

    const drawStar = (star: Star) => {
      // Twinkling effect
      star.opacity += star.twinkleDirection * star.twinkleSpeed;
      if (star.opacity <= 0.1 || star.opacity >= 1) {
        star.twinkleDirection *= -1;
      }
      star.opacity = Math.max(0.1, Math.min(1, star.opacity));

      // Draw star with glow effect
      const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 3);
      gradient.addColorStop(0, star.color + star.opacity + ')');
      gradient.addColorStop(0.5, star.color + (star.opacity * 0.3) + ')');
      gradient.addColorStop(1, star.color + '0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
      ctx.fill();

      // Core star
      ctx.fillStyle = star.color + star.opacity + ')';
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawShootingStar = (shootingStar: ShootingStar) => {
      const x2 = shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length;
      const y2 = shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length;

      const gradient = ctx.createLinearGradient(shootingStar.x, shootingStar.y, x2, y2);
      gradient.addColorStop(0, `rgba(255, 255, 255, ${shootingStar.opacity})`);
      gradient.addColorStop(0.7, `rgba(6, 182, 212, ${shootingStar.opacity * 0.6})`);
      gradient.addColorStop(1, 'rgba(6, 182, 212, 0)');

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(shootingStar.x, shootingStar.y);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // Head glow
      const headGradient = ctx.createRadialGradient(shootingStar.x, shootingStar.y, 0, shootingStar.x, shootingStar.y, 8);
      headGradient.addColorStop(0, `rgba(255, 255, 255, ${shootingStar.opacity})`);
      headGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.fillStyle = headGradient;
      ctx.beginPath();
      ctx.arc(shootingStar.x, shootingStar.y, 8, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawCosmicParticle = (particle: CosmicParticle) => {
      // Pulsing effect
      particle.pulse += particle.pulseSpeed;
      const pulseOpacity = particle.opacity * (0.5 + 0.5 * Math.sin(particle.pulse));

      // Nebula-like glow
      const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.size * 4);
      gradient.addColorStop(0, particle.color + pulseOpacity + ')');
      gradient.addColorStop(0.5, particle.color + (pulseOpacity * 0.2) + ')');
      gradient.addColorStop(1, particle.color + '0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * 4, 0, Math.PI * 2);
      ctx.fill();
    };

    const animate = () => {
      time += 0.016; // ~60fps
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create cosmic background gradient
      const bgGradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height)
      );
      bgGradient.addColorStop(0, 'rgba(15, 23, 42, 0.1)');
      bgGradient.addColorStop(0.5, 'rgba(30, 41, 59, 0.05)');
      bgGradient.addColorStop(1, 'rgba(0, 0, 0, 0.1)');
      
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Animate and draw cosmic particles
      cosmicParticles.forEach(particle => {
        drawCosmicParticle(particle);
        
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Wrap around screen
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
      });

      // Animate and draw stars
      stars.forEach(star => {
        drawStar(star);
        
        // Slow horizontal drift
        star.x -= star.speed;
        if (star.x < -10) {
          star.x = canvas.width + 10;
          star.y = Math.random() * canvas.height;
        }
      });

      // Create and animate shooting stars
      createShootingStar();
      shootingStars.forEach((shootingStar, index) => {
        drawShootingStar(shootingStar);
        
        // Update shooting star position and life
        shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
        shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
        shootingStar.life++;
        
        // Fade out towards end of life
        if (shootingStar.life > shootingStar.maxLife * 0.7) {
          shootingStar.opacity -= 0.02;
        }
        
        // Remove dead shooting stars
        if (shootingStar.life > shootingStar.maxLife || shootingStar.opacity <= 0) {
          shootingStars.splice(index, 1);
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
      {/* Dark Space Base Layer - Ensure this covers everything */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{ 
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #0f172a 50%, #000000 100%)',
          zIndex: -1
        }}
      ></div>
      
      {/* Animated Star Field Background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: -1 }}
      />
      
      {/* Nebula Background Effects */}
      <div 
        className="fixed top-20 left-20 w-96 h-96 nebula-glow rounded-full opacity-30 animate-drift pointer-events-none"
        style={{ zIndex: -1 }}
      ></div>
      <div 
        className="fixed bottom-40 right-20 w-64 h-64 nebula-glow rounded-full opacity-20 animate-drift pointer-events-none" 
        style={{ animationDelay: '-10s', zIndex: -1 }}
      ></div>
    </>
  );
}
