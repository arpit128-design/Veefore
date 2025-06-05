import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useRef } from "react";

export function NetworkMap() {
  const { user, token } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { data: referralData } = useQuery({
    queryKey: ['referrals', user?.id],
    queryFn: () => fetch('/api/referrals', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(res => res.json()),
    enabled: !!user?.id && !!token
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const orbitRadius = 80;
    
    let animationId: number;
    let angle = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw connection lines
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.3)';
      ctx.lineWidth = 1;
      
      // Draw orbital paths
      ctx.beginPath();
      ctx.arc(centerX, centerY, orbitRadius, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, orbitRadius * 1.5, 0, Math.PI * 2);
      ctx.stroke();

      // Draw central user node
      ctx.fillStyle = '#00D4FF';
      ctx.shadowColor = '#00D4FF';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw orbiting referral nodes
      const nodeCount = Math.min(referralData?.stats?.totalReferrals || 5, 12);
      for (let i = 0; i < nodeCount; i++) {
        const nodeAngle = (angle + (i * (360 / nodeCount)) * Math.PI / 180);
        const radius = i % 2 === 0 ? orbitRadius : orbitRadius * 1.5;
        const x = centerX + Math.cos(nodeAngle) * radius;
        const y = centerY + Math.sin(nodeAngle) * radius;
        
        // Connection line to center
        ctx.strokeStyle = 'rgba(0, 212, 255, 0.5)';
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.stroke();
        
        // Referral node
        const nodeColors = ['#F59E0B', '#10B981', '#8B5CF6', '#EF4444', '#06B6D4'];
        ctx.fillStyle = nodeColors[i % nodeColors.length];
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
      }

      angle += 0.01;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [referralData]);

  return (
    <Card className="content-card holographic">
      <CardHeader>
        <CardTitle className="text-xl font-orbitron font-semibold neon-text text-nebula-purple">
          Your Galactic Network
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={300}
            height={240}
            className="w-full h-60 rounded-lg bg-cosmic-blue border border-electric-cyan/20"
          />
          
          {/* Network Stats */}
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="text-lg font-bold text-solar-gold">
                {referralData?.stats?.totalReferrals || 0}
              </div>
              <div className="text-asteroid-silver">Active Satellites</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-electric-cyan">
                {referralData?.stats?.totalEarned || 0}
              </div>
              <div className="text-asteroid-silver">Network Credits</div>
            </div>
          </div>

          {/* Network Growth */}
          <div className="mt-4 p-3 rounded-lg bg-electric-cyan/10 border border-electric-cyan/30">
            <div className="flex items-center justify-between text-sm">
              <span className="text-asteroid-silver">Network Growth:</span>
              <span className="text-green-400 font-medium">+24% this month</span>
            </div>
            <div className="w-full bg-space-gray rounded-full h-2 mt-2">
              <div className="bg-electric-cyan h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
