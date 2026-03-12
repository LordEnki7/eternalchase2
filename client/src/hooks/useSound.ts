import { useCallback, useRef, useState } from 'react';

interface SoundOptions {
  volume?: number;
  loop?: boolean;
  onEnd?: () => void;
}

interface UseSound {
  play: () => void;
  pause: () => void;
  stop: () => void;
  setVolume: (volume: number) => void;
  isPlaying: boolean;
  duration: number;
  currentTime: number;
}

export function useSound(url: string, options: SoundOptions = {}): UseSound {
  const { volume = 1, loop = false, onEnd } = options;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // Initialize audio element
  const initAudio = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(url);
      audioRef.current.volume = volume;
      audioRef.current.loop = loop;
      
      // Event listeners
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current?.duration || 0);
      });
      
      audioRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(audioRef.current?.currentTime || 0);
      });
      
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        onEnd?.();
      });
      
      audioRef.current.addEventListener('play', () => {
        setIsPlaying(true);
      });
      
      audioRef.current.addEventListener('pause', () => {
        setIsPlaying(false);
      });
    }
    return audioRef.current;
  }, [url, volume, loop, onEnd]);

  const play = useCallback(() => {
    const audio = initAudio();
    audio.play().catch(console.error);
  }, [initAudio]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, newVolume));
    }
  }, []);

  return {
    play,
    pause,
    stop,
    setVolume,
    isPlaying,
    duration,
    currentTime,
  };
}

// Preload sound for instant playback
export function usePreloadedSound(url: string, options: SoundOptions = {}): UseSound {
  const sound = useSound(url, options);
  
  // Preload the audio
  useCallback(() => {
    const audio = new Audio(url);
    audio.preload = 'auto';
    audio.load();
  }, [url])();
  
  return sound;
}