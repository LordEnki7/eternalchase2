import { useCallback, useRef } from 'react';

interface SoundEffectOptions {
  volume?: number;
  playbackRate?: number;
}

export function useSoundEffects() {
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  const createAudioElement = useCallback((soundId: string, soundUrl: string) => {
    if (!audioRefs.current[soundId]) {
      const audio = new Audio(soundUrl);
      audio.preload = 'auto';
      audioRefs.current[soundId] = audio;
    }
    return audioRefs.current[soundId];
  }, []);

  const playSound = useCallback((soundId: string, soundUrl: string, options: SoundEffectOptions = {}) => {
    try {
      const audio = createAudioElement(soundId, soundUrl);
      audio.volume = options.volume || 0.3;
      audio.playbackRate = options.playbackRate || 1.0;
      
      // Reset to beginning if already playing
      audio.currentTime = 0;
      
      // Play the sound
      audio.play().catch(error => {
        console.log('Sound playback failed (user interaction required):', error);
      });
    } catch (error) {
      console.log('Sound effect error:', error);
    }
  }, [createAudioElement]);

  // Predefined sound effects with data URIs for cosmic sounds
  const playCyberWhoosh = useCallback(() => {
    // Create a synthetic cyber whoosh sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Whoosh frequency sweep
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.5);
    
    // Fade in and out
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.type = 'sine';
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  }, []);

  const playCosmicChime = useCallback(() => {
    // Create a cosmic chime using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Chime frequencies (cosmic chord)
    oscillator.frequency.setValueAtTime(528, audioContext.currentTime); // "Love frequency"
    
    // Bell-like envelope
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.5);
    
    oscillator.type = 'sine';
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1.5);
  }, []);

  const playPortalActivation = useCallback(() => {
    // Deep space portal sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();
    
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Portal deep resonance
    oscillator.frequency.setValueAtTime(60, audioContext.currentTime);
    oscillator.frequency.linearRampToValueAtTime(120, audioContext.currentTime + 0.8);
    
    // Low-pass filter for depth
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, audioContext.currentTime);
    filter.frequency.linearRampToValueAtTime(800, audioContext.currentTime + 0.8);
    
    // Deep rumble envelope
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.25, audioContext.currentTime + 0.2);
    gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.6);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
    
    oscillator.type = 'triangle';
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.8);
  }, []);

  const playButtonHover = useCallback(() => {
    // Subtle energy pulse
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.08, audioContext.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.type = 'sine';
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  }, []);

  return {
    playSound,
    playCyberWhoosh,
    playCosmicChime,
    playPortalActivation,
    playButtonHover
  };
}