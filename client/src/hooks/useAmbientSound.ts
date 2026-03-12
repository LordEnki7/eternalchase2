import { useEffect, useRef, useState, useCallback } from 'react';

interface AmbientSoundOptions {
  volume?: number;
  fadeInDuration?: number;
  fadeOutDuration?: number;
  loop?: boolean;
}

export function useAmbientSound(soundUrl: string, options: AmbientSoundOptions = {}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(options.volume || 0.3);

  const {
    fadeInDuration = 2000,
    fadeOutDuration = 1000,
    loop = true
  } = options;

  const initAudio = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(soundUrl);
      audioRef.current.loop = loop;
      audioRef.current.volume = 0;
      audioRef.current.preload = 'auto';
    }
    return audioRef.current;
  }, [soundUrl, loop]);

  const fadeIn = useCallback((audio: HTMLAudioElement, targetVolume: number, duration: number) => {
    audio.volume = 0;
    const startTime = Date.now();
    const fadeStep = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      audio.volume = targetVolume * progress;
      
      if (progress < 1) {
        fadeTimeoutRef.current = setTimeout(fadeStep, 16);
      }
    };
    fadeStep();
  }, []);

  const fadeOut = useCallback((audio: HTMLAudioElement, duration: number, onComplete?: () => void) => {
    const startVolume = audio.volume;
    const startTime = Date.now();
    const fadeStep = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      audio.volume = startVolume * (1 - progress);
      
      if (progress < 1) {
        fadeTimeoutRef.current = setTimeout(fadeStep, 16);
      } else {
        audio.pause();
        onComplete?.();
      }
    };
    fadeStep();
  }, []);

  const play = useCallback(() => {
    const audio = initAudio();
    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current);
    }
    
    audio.play().then(() => {
      setIsPlaying(true);
      fadeIn(audio, volume, fadeInDuration);
    }).catch(console.error);
  }, [initAudio, volume, fadeInDuration, fadeIn]);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !isPlaying) return;

    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current);
    }

    fadeOut(audio, fadeOutDuration, () => {
      setIsPlaying(false);
    });
  }, [isPlaying, fadeOutDuration, fadeOut]);

  const setVolumeLevel = useCallback((newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current && isPlaying) {
      audioRef.current.volume = newVolume;
    }
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return {
    play,
    stop,
    isPlaying,
    setVolume: setVolumeLevel,
    volume
  };
}