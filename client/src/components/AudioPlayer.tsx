import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from 'lucide-react';
import { useGlobalAudio } from '@/hooks/useGlobalAudio';

interface AudioPlayerProps {
  title?: string;
  isVisible?: boolean;
  onClose?: () => void;
  audioFile?: string;
  trackId?: string;
  track?: any; // Add track data directly
}

export default function AudioPlayer({ 
  title = "Eternal Chase Audiobook", 
  isVisible = false, 
  onClose, 
  audioFile = '@assets/Prologue Before the Chase_1753633285053.wav',
  trackId,
  track
}: AudioPlayerProps) {
  const { setAudiobookPlaying } = useGlobalAudio();
  
  // Use track data if available, otherwise fallback to audioFile prop
  const actualAudioFile = track?.fileName || audioFile;
  const actualTitle = track?.title?.en || title;
  

  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleError = (e: Event) => {
      const target = e.target as HTMLAudioElement;
      console.error('Audio loading error:', {
        src: target.src,
        error: target.error,
        networkState: target.networkState,
        readyState: target.readyState
      });
      // Don't throw unhandled errors
    };
    const handleLoadStart = () => {
      // Reset state when new audio loads
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setAudiobookPlaying(false);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [actualAudioFile]);

  const togglePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
        setAudiobookPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
        setAudiobookPlaying(true);
      }
    } catch (error) {
      console.error('Audio playback error:', error);
      setIsPlaying(false);
      setAudiobookPlaying(false);
      // Handle audio playback errors gracefully
    }
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const newVolume = value[0];
    audio.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const skipTime = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.currentTime += seconds;
  };

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto">
      <div className="holographic-border bg-space-dark/95 backdrop-blur-sm rounded-lg p-4">
        {/* Audio Element */}
        <audio 
          ref={audioRef} 
          src={actualAudioFile.startsWith('@assets/') ? `/attached_assets/${actualAudioFile.replace('@assets/', '')}` : actualAudioFile}
          preload="metadata"
          crossOrigin="anonymous"
        />
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-orbitron text-sm font-bold text-cosmic-gold truncate">
            {actualTitle}
          </h4>
          {onClose && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              ×
            </Button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={1}
            onValueChange={handleSeek}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => skipTime(-30)}
              className="text-gray-300 hover:text-white"
            >
              <SkipBack className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={togglePlayPause}
              className="text-cosmic-gold hover:text-bright-gold"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => skipTime(30)}
              className="text-gray-300 hover:text-white"
            >
              <SkipForward className="w-4 h-4" />
            </Button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMute}
              className="text-gray-300 hover:text-white"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              max={1}
              step={0.1}
              onValueChange={handleVolumeChange}
              className="w-16"
            />
          </div>
        </div>
      </div>
    </div>
  );
}