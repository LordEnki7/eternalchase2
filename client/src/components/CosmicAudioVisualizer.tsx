import { useEffect, useRef, useState } from 'react';

interface CosmicAudioVisualizerProps {
  audioElement?: HTMLAudioElement | null;
  isPlaying: boolean;
  className?: string;
}

export default function CosmicAudioVisualizer({ 
  audioElement, 
  isPlaying, 
  className = "" 
}: CosmicAudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  useEffect(() => {
    if (!audioElement) return;

    // Create audio context and analyser
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaElementSource(audioElement);
    
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    analyserRef.current = analyser;
    dataArrayRef.current = dataArray;

    return () => {
      if (audioContext.state !== 'closed') {
        audioContext.close();
      }
    };
  }, [audioElement]);

  useEffect(() => {
    if (!isPlaying) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas || !analyserRef.current || !dataArrayRef.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      if (!analyserRef.current || !dataArrayRef.current) return;

      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      
      const width = canvas.width;
      const height = canvas.height;
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, width, height);
      
      const barWidth = (width / dataArrayRef.current.length) * 2.5;
      let barHeight;
      let x = 0;
      
      for (let i = 0; i < dataArrayRef.current.length; i++) {
        barHeight = (dataArrayRef.current[i] / 255) * height;
        
        // Create cosmic gradient
        const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
        gradient.addColorStop(0, '#FFD700'); // Cosmic gold
        gradient.addColorStop(0.5, '#00BFFF'); // Electric blue
        gradient.addColorStop(1, '#9370DB'); // Purple
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, height - barHeight, barWidth, barHeight);
        
        x += barWidth + 1;
      }
      
      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={60}
      className={`rounded-lg ${className}`}
      style={{ background: 'rgba(0, 0, 0, 0.3)' }}
    />
  );
}