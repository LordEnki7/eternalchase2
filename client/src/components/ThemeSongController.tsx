import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-language';
import { useGlobalAudio } from '@/hooks/useGlobalAudio';
import CosmicAudioVisualizer from '@/components/CosmicAudioVisualizer';
const themeSongUrl = '/media/cosmic-hearts-align.mp3';

export default function ThemeSongController() {
  const { language } = useLanguage();
  const { isAudiobookPlaying, themeMusicPaused } = useGlobalAudio();
  const audioRef = useRef<HTMLAudioElement>(null);
  const autoResumeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3); // Start at 30% volume
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [userPaused, setUserPaused] = useState(false); // Track if user manually paused

  const content = {
    en: {
      title: "Cosmic Hearts Align",
      subtitle: "Official Eternal Chase Theme Song",
      play: "Play Theme",
      pause: "Pause Theme",
      expand: "Show Player",
      collapse: "Hide Player",
      volume: "Volume"
    },
    es: {
      title: "Corazones Cósmicos Se Alinean",
      subtitle: "Canción Tema Oficial de Eternal Chase", 
      play: "Reproducir Tema",
      pause: "Pausar Tema",
      expand: "Mostrar Reproductor",
      collapse: "Ocultar Reproductor",
      volume: "Volumen"
    }
  };

  const text = content[language];

  // Auto-start theme music on load (unless user previously paused it)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || userPaused) return;

    // Auto-start after a short delay to ensure everything is loaded
    const startTimer = setTimeout(() => {
      if (!isAudiobookPlaying && !themeMusicPaused) {
        audio.play().then(() => {
          setIsPlaying(true);
        }).catch(error => {
          console.log('Auto-play prevented by browser:', error);
        });
      }
    }, 1000);

    return () => clearTimeout(startTimer);
  }, []);

  // Handle audiobook playing state changes - IMMEDIATE STOP when audiobook plays
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isAudiobookPlaying || themeMusicPaused) {
      // IMMEDIATELY pause theme music when audiobook starts - no delay
      audio.pause();
      setIsPlaying(false);
      console.log('Theme music stopped - audiobook is playing');
      
      // Clear any existing auto-resume timer
      if (autoResumeTimerRef.current) {
        clearTimeout(autoResumeTimerRef.current);
        autoResumeTimerRef.current = null;
      }
    } else if (!userPaused) {
      // Set timer to auto-resume theme music after 3 minutes of no audiobook
      autoResumeTimerRef.current = setTimeout(() => {
        if (!isAudiobookPlaying && !themeMusicPaused && !userPaused) {
          audio.play().then(() => {
            setIsPlaying(true);
            console.log('Theme music auto-resumed after silence period');
          }).catch(error => {
            console.log('Auto-resume prevented by browser:', error);
          });
        }
      }, 180000); // 3 minutes = 180000ms
    }

    return () => {
      if (autoResumeTimerRef.current) {
        clearTimeout(autoResumeTimerRef.current);
        autoResumeTimerRef.current = null;
      }
    };
  }, [isAudiobookPlaying, themeMusicPaused, userPaused]);

  // Standard audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
    audio.muted = isMuted;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      // Auto-restart if not manually paused and NO audiobook playing
      if (!userPaused && !isAudiobookPlaying && !themeMusicPaused) {
        setTimeout(() => {
          // Double-check no audiobook started during the delay
          if (!isAudiobookPlaying && !themeMusicPaused) {
            audio.play().then(() => {
              setIsPlaying(true);
              console.log('Theme music restarted after completion');
            }).catch(error => {
              console.log('Auto-restart prevented by browser:', error);
            });
          }
        }, 2000); // 2 second pause between loops
      }
    };
    
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [volume, isMuted, userPaused, isAudiobookPlaying, themeMusicPaused]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      setUserPaused(true); // Mark as manually paused
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
        setUserPaused(false); // Mark as manually started
      }).catch(error => {
        console.error('Failed to play theme music:', error);
      });
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <audio ref={audioRef} src={themeSongUrl} preload="metadata" />
      
      {/* Compact Player */}
      {!isExpanded && (
        <Card className="bg-space-dark/90 border-cosmic-gold/30 backdrop-blur-sm">
          <CardContent className="p-3 flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={togglePlay}
              className="text-cosmic-gold hover:bg-cosmic-gold/20"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            
            <div className="flex flex-col min-w-0">
              <div className="text-sm font-medium text-cosmic-gold truncate">
                {text.title}
              </div>
              <div className="text-xs text-gray-400 truncate">
                {text.subtitle}
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(true)}
              className="text-gray-400 hover:text-cosmic-gold"
            >
              <Music className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Expanded Player */}
      {isExpanded && (
        <Card className="bg-space-dark/95 border-cosmic-gold/30 backdrop-blur-sm w-80">
          <CardContent className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-orbitron font-bold text-cosmic-gold text-sm truncate">
                  {text.title}
                </h3>
                <p className="text-xs text-gray-400 truncate">
                  {text.subtitle}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
                className="text-gray-400 hover:text-cosmic-gold"
              >
                <VolumeX className="w-4 h-4" />
              </Button>
            </div>

            {/* Audio Visualizer */}
            <div className="mb-4">
              <CosmicAudioVisualizer 
                audioElement={audioRef.current}
                isPlaying={isPlaying}
                className="w-full"
              />
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
              <Button
                variant="ghost"
                size="sm"
                onClick={togglePlay}
                className="text-cosmic-gold hover:bg-cosmic-gold/20"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                <span className="ml-2 text-sm">
                  {isPlaying ? text.pause : text.play}
                </span>
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMute}
                  className="text-gray-400 hover:text-cosmic-gold"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={1}
                  step={0.1}
                  onValueChange={handleVolumeChange}
                  className="w-20"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}