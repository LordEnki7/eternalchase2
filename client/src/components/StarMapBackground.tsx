import { useEffect, useRef } from 'react';
const galaxyVideo = '/media/galaxy-background.mp4';

interface StarMapBackgroundProps {
  opacity?: number;
  animated?: boolean;
  className?: string;
}

export default function StarMapBackground({ 
  opacity = 0.2, 
  animated = true,
  className = ""
}: StarMapBackgroundProps) {
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animated || !backgroundRef.current) return;

    const element = backgroundRef.current;
    let animationId: number;

    const animate = () => {
      const time = Date.now() * 0.0001;
      const scale = 1 + Math.sin(time) * 0.02;
      const rotation = Math.sin(time * 0.5) * 0.5;
      
      element.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [animated]);

  return (
    <div 
      ref={backgroundRef}
      className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 overflow-hidden ${className}`}
      style={{ opacity }}
    >
      <video 
        autoPlay 
        muted 
        loop 
        playsInline
        className="w-full h-full object-cover"
        style={{
          filter: 'brightness(0.4) contrast(1.5) saturate(0.8)',
          transform: animated ? undefined : 'none'
        }}
      >
        <source src={galaxyVideo} type="video/mp4" />
      </video>
    </div>
  );
}