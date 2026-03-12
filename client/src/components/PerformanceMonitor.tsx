import { useState, useEffect } from 'react';
import { Activity, Gauge, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  loadTime: number;
}

interface PerformanceMonitorProps {
  enabled?: boolean;
}

export default function PerformanceMonitor({ enabled = false }: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memoryUsage: 0,
    loadTime: 0
  });

  useEffect(() => {
    if (!enabled) return;

    const startTime = performance.now();
    setMetrics(prev => ({ ...prev, loadTime: startTime }));

    let frameCount = 0;
    let lastTime = performance.now();
    
    const measureFPS = () => {
      const currentTime = performance.now();
      frameCount++;
      
      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        setMetrics(prev => ({ ...prev, fps }));
        frameCount = 0;
        lastTime = currentTime;
      }
      
      if (enabled) {
        requestAnimationFrame(measureFPS);
      }
    };

    // Start FPS monitoring
    requestAnimationFrame(measureFPS);

    // Memory usage monitoring
    const updateMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const usage = Math.round(memory.usedJSHeapSize / 1024 / 1024 * 100) / 100;
        setMetrics(prev => ({ ...prev, memoryUsage: usage }));
      }
    };

    const memoryInterval = setInterval(updateMemory, 2000);

    return () => {
      clearInterval(memoryInterval);
    };
  }, [enabled]);

  if (!enabled) return null;

  const getPerformanceColor = (fps: number) => {
    if (fps >= 55) return 'text-green-400';
    if (fps >= 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <Card className="fixed bottom-4 right-4 bg-space-dark/90 backdrop-blur-sm border-electric-blue/30 z-50">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-4 h-4 text-cosmic-gold" />
          <h3 className="text-xs font-orbitron font-bold text-cosmic-gold">
            Performance
          </h3>
          <Badge variant="outline" className="text-xs border-electric-blue/50 text-electric-blue">
            DEV
          </Badge>
        </div>
        
        <div className="space-y-1 text-xs">
          <div className="flex items-center justify-between gap-4">
            <span className="text-gray-400">FPS:</span>
            <span className={getPerformanceColor(metrics.fps)}>
              {metrics.fps}
            </span>
          </div>
          
          <div className="flex items-center justify-between gap-4">
            <span className="text-gray-400">Memory:</span>
            <span className="text-electric-blue">
              {metrics.memoryUsage}MB
            </span>
          </div>
          
          <div className="flex items-center justify-between gap-4">
            <span className="text-gray-400">Load:</span>
            <span className="text-cosmic-gold">
              {Math.round(performance.now())}ms
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}