import { useEffect, useRef } from "react";

interface ParticleCanvasProps {
  running: boolean;
}

export const ParticleCanvas = ({ running }: ParticleCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    let width = (canvas.width = canvas.clientWidth);
    let height = (canvas.height = canvas.clientHeight);

    const particles = Array.from({ length: 80 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.2,
      vy: -(0.2 + Math.random() * 0.5),
      alpha: 0.3 + Math.random() * 0.7
    }));

    let animationId: number;
    
    function resize() {
      width = canvas.width = canvas.clientWidth;
      height = canvas.height = canvas.clientHeight;
    }
    
    window.addEventListener("resize", resize);

    function loop() {
      ctx.clearRect(0, 0, width, height);
      
      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "hsl(var(--background) / 0.9)");
      gradient.addColorStop(1, "hsl(var(--card) / 0.9)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      
      // Particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        
        ctx.beginPath();
        ctx.fillStyle = `hsl(var(--primary) / ${p.alpha * 0.5})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      
      animationId = requestAnimationFrame(loop);
    }

    if (running) loop();
    
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, [running]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full rounded-lg"
      style={{ background: "transparent" }}
    />
  );
};