import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Music, SkipForward, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/use-language';
import { useLocation } from 'wouter';
import { useGlobalAudio } from '@/hooks/useGlobalAudio';
import CosmicAudioVisualizer from '@/components/CosmicAudioVisualizer';
const eternalChaseTheme = '/media/cosmic-hearts-align.mp3';
const aiyannaTheme = '/media/cosmic-threads.mp3';

interface ThemeSong {
  id: string;
  title: { en: string; es: string };
  subtitle: { en: string; es: string };
  url: string;
  sections: string[];
  color: string;
  icon: string;
}

const themeSongs: ThemeSong[] = [
  {
    id: 'eternal-chase',
    title: { en: 'Cosmic Hearts Align', es: 'Corazones Cósmicos Se Alinean' },
    subtitle: { en: 'Main Trilogy Theme', es: 'Tema de la Trilogía Principal' },
    url: eternalChaseTheme,
    sections: ['/', '/trilogy', '/bookstore', '/shop'],
    color: 'cosmic-gold',
    icon: '💫'
  },
  {
    id: 'aiyanna',
    title: { en: 'Cosmic Threads', es: 'Hilos Cósmicos' },
    subtitle: { en: 'Aiyanna Chronicles Theme', es: 'Tema de las Crónicas de Aiyanna' },
    url: aiyannaTheme,
    sections: ['/young-adult'],
    color: 'purple-400',
    icon: '🌸'
  }
];

// Singleton check to prevent multiple theme controllers
let themeControllerInstance: boolean = false;

export default function DynamicThemeController() {
  const { language } = useLanguage();
  const [location] = useLocation();
  const { isAudiobookPlaying, themeMusicPaused } = useGlobalAudio();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ThemeSong>(themeSongs[0]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hasAutoStarted, setHasAutoStarted] = useState(false);
  const [userStopped, setUserStopped] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  // Prevent multiple instances
  useEffect(() => {
    if (themeControllerInstance) {
      return;
    }
    themeControllerInstance = true;
    
    return () => {
      themeControllerInstance = false;
    };
  }, []);

  const content = {
    en: {
      play: "Play Theme",
      pause: "Pause Theme",
      stop: "Stop Theme",
      expand: "Show Player",
      collapse: "Hide Player",
      volume: "Volume",
      switching: "Switching Theme...",
      nextTheme: "Switch Theme"
    },
    es: {
      play: "Reproducir Tema",
      pause: "Pausar Tema",
      stop: "Detener Tema",
      expand: "Mostrar Reproductor",
      collapse: "Ocultar Reproductor",
      volume: "Volumen",
      switching: "Cambiando Tema...",
      nextTheme: "Cambiar Tema"
    }
  };

  const text = content[language];

  // Auto-start theme music on initial page load (consolidated with theme switching)
  useEffect(() => {
    if (!hasAutoStarted && audioRef.current && !isAudiobookPlaying && !isPlaying && !userStopped) {
      // Auto-start after a delay to ensure everything is loaded
      const startTimer = setTimeout(() => {
        if (audioRef.current && !isAudiobookPlaying && !isPlaying && !userStopped) {
          // Stop all other theme songs first
          const allAudios = document.querySelectorAll('audio[data-theme-song]');
          allAudios.forEach(audioElement => {
            if (audioElement !== audioRef.current) {
              (audioElement as HTMLAudioElement).pause();
              (audioElement as HTMLAudioElement).currentTime = 0;
            }
          });
          
          audioRef.current.play().then(() => {
            setIsPlaying(true);
            setHasAutoStarted(true);
            console.log(`Initial auto-start: ${currentTheme.title.en}`);
          }).catch((error) => {
            console.log('Initial auto-play blocked or failed:', error);
          });
        }
      }, 1000);
      
      return () => clearTimeout(startTimer);
    }
  }, [hasAutoStarted, isAudiobookPlaying, isPlaying, userStopped, currentTheme.id]);

  // Determine current theme based on location
  useEffect(() => {
    const newTheme = themeSongs.find(theme => 
      theme.sections.some(section => {
        if (section === '/') {
          return location === '/';
        }
        return location.startsWith(section);
      })
    ) || themeSongs[0];

    if (newTheme.id !== currentTheme.id) {
      setIsTransitioning(true);
      
      // Stop all theme songs including current one
      const allAudios = document.querySelectorAll('audio[data-theme-song]');
      allAudios.forEach(audioElement => {
        (audioElement as HTMLAudioElement).pause();
        (audioElement as HTMLAudioElement).currentTime = 0;
      });
      
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsPlaying(false);
      
      setTimeout(() => {
        setCurrentTheme(newTheme);
        setCurrentTime(0);
        setIsTransitioning(false);
        setHasAutoStarted(false); // Reset to allow auto-start for new theme
        setUserStopped(false); // Reset user stop state when changing themes
        console.log(`Theme switched to: ${newTheme.title.en} - ready for auto-start`);
      }, 300);
    }
  }, [location, currentTheme.id, isAudiobookPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
    audio.muted = isMuted;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    const handleEnded = () => {
      setIsPlaying(false);
      // Auto-restart if no audiobook is playing AND user hasn't manually stopped
      if (!isAudiobookPlaying && !themeMusicPaused && !userStopped) {
        setTimeout(() => {
          if (audioRef.current && !isAudiobookPlaying && !userStopped) {
            audioRef.current.play().then(() => {
              setIsPlaying(true);
              console.log(`Auto-restarted theme: ${currentTheme.title.en}`);
            }).catch(error => {
              console.log('Auto-restart failed:', error);
            });
          }
        }, 2000); // 2 second pause between loops
      }
    };
    
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [volume, isMuted, currentTheme.id]);

  // Pause theme music when audiobook is playing
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if ((isAudiobookPlaying || themeMusicPaused) && isPlaying) {
      audio.pause();
      setIsPlaying(false);
      console.log('Dynamic theme music paused - audiobook playing');
    }
  }, [isAudiobookPlaying, themeMusicPaused, isPlaying]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) {
      console.log('No audio element found');
      return;
    }

    // Prevent rapid clicking but allow quick response
    if (isToggling) {
      console.log('Toggle already in progress, ignoring...');
      return;
    }

    if (isAudiobookPlaying || themeMusicPaused) {
      console.log('Blocked by audiobook or theme paused');
      return;
    }

    setIsToggling(true);

    try {
      if (isPlaying) {
        console.log('Pausing audio...');
        audio.pause();
        
        // Force stop all theme songs to ensure clean state
        const allAudios = document.querySelectorAll('audio[data-theme-song]');
        allAudios.forEach(audioElement => {
          const audioEl = audioElement as HTMLAudioElement;
          audioEl.pause();
        });
        
        setIsPlaying(false);
        setUserStopped(true);
        console.log(`Manual pause: ${currentTheme.title.en} - All audio stopped`);
      } else {
        console.log('Starting audio...');
        setUserStopped(false);
        
        // Stop all other theme songs completely
        const allAudios = document.querySelectorAll('audio[data-theme-song]');
        console.log(`Found ${allAudios.length} theme audio elements`);
        allAudios.forEach((audioElement, index) => {
          if (audioElement !== audio) {
            console.log(`Stopping other audio ${index}`);
            const audioEl = audioElement as HTMLAudioElement;
            audioEl.pause();
            audioEl.currentTime = 0;
            // Also ensure it's not in a playing state
            audioEl.load(); // Reset the audio element completely
          }
        });
        
        // Reset audio if at end
        if (audio.currentTime >= audio.duration) {
          audio.currentTime = 0;
        }
        
        await audio.play();
        setIsPlaying(true);
        console.log(`Manual play: ${currentTheme.title.en} - State updated`);
      }
    } catch (error) {
      console.error('Theme song playback error:', error);
      setIsPlaying(false);
    } finally {
      // Much shorter delay to prevent rapid clicking but allow responsive interaction
      setTimeout(() => {
        setIsToggling(false);
      }, 100);
    }
  };

  const stopMusic = () => {
    const audio = audioRef.current;
    if (!audio) {
      console.log('No audio element for stop');
      return;
    }

    if (isToggling) {
      console.log('Stop blocked - toggle in progress');
      return;
    }

    setIsToggling(true);
    console.log('Stopping music...');
    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
    setUserStopped(true);
    console.log(`Manual stop: ${currentTheme.title.en} - State reset`);
    
    setTimeout(() => {
      setIsToggling(false);
    }, 100);
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

  const switchToNextTheme = () => {
    const currentIndex = themeSongs.findIndex(t => t.id === currentTheme.id);
    const nextIndex = (currentIndex + 1) % themeSongs.length;
    const nextTheme = themeSongs[nextIndex];
    
    setIsTransitioning(true);
    const wasPlaying = isPlaying;
    
    // Stop all theme songs
    const allAudios = document.querySelectorAll('audio[data-theme-song]');
    allAudios.forEach(audioElement => {
      (audioElement as HTMLAudioElement).pause();
    });
    
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    
    setTimeout(() => {
      setCurrentTheme(nextTheme);
      setCurrentTime(0);
      setIsTransitioning(false);
      
      // Only restart if it was playing before and not blocked
      if (wasPlaying && !isAudiobookPlaying && !themeMusicPaused && audioRef.current) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          console.log(`Theme switched to: ${nextTheme.title.en}`);
        }).catch(error => {
          console.log('Switch play failed:', error);
        });
      }
    }, 300);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Check if we should show the controller on this page
  const shouldShowController = themeSongs.some(theme => 
    theme.sections.some(section => {
      if (section === '/') {
        return location === '/';
      }
      return location.startsWith(section);
    })
  );

  if (!shouldShowController) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <audio 
        ref={audioRef} 
        src={currentTheme.url} 
        preload="metadata" 
        key={currentTheme.id}
        data-theme-song={currentTheme.id}
      />
      
      {/* Compact Player */}
      {!isExpanded && (
        <Card className={`bg-space-dark/90 border-${currentTheme.color}/30 backdrop-blur-sm transition-all duration-300 ${isTransitioning ? 'scale-95 opacity-70' : ''}`}>
          <CardContent className="p-3 flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={togglePlay}
              className={`text-${currentTheme.color} hover:bg-${currentTheme.color}/20`}
              disabled={isTransitioning || isToggling}
            >
              {isTransitioning ? (
                <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>
            
            <div className="flex flex-col min-w-0">
              <div className={`text-sm font-medium text-${currentTheme.color} truncate flex items-center gap-1`}>
                <span>{currentTheme.icon}</span>
                {currentTheme.title[language]}
              </div>
              <div className="text-xs text-gray-400 truncate">
                {currentTheme.subtitle[language]}
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
        <Card className={`bg-space-dark/95 border-${currentTheme.color}/30 backdrop-blur-sm w-80 transition-all duration-300 ${isTransitioning ? 'scale-95 opacity-70' : ''}`}>
          <CardContent className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1 min-w-0">
                <div className={`font-orbitron font-bold text-${currentTheme.color} text-sm truncate flex items-center gap-2`}>
                  <span className="text-lg">{currentTheme.icon}</span>
                  {currentTheme.title[language]}
                </div>
                <p className="text-xs text-gray-400 truncate">
                  {currentTheme.subtitle[language]}
                </p>
                <Badge variant="outline" className={`mt-1 text-xs border-${currentTheme.color}/30 text-${currentTheme.color}`}>
                  {isTransitioning ? text.switching : (location.includes('young-adult') ? 'Young Adult' : 'Main Trilogy')}
                </Badge>
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
                isPlaying={isPlaying && !isTransitioning}
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
                disabled={isTransitioning}
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
                  onClick={togglePlay}
                  className={`text-${currentTheme.color} hover:bg-${currentTheme.color}/20`}
                  disabled={isTransitioning || isToggling}
                >
                  {isTransitioning ? (
                    <div className="w-5 h-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={stopMusic}
                  className="text-gray-400 hover:text-red-400"
                  disabled={isTransitioning}
                >
                  <Square className="w-4 h-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={switchToNextTheme}
                  className="text-gray-400 hover:text-cosmic-gold"
                  disabled={isTransitioning}
                >
                  <SkipForward className="w-4 h-4" />
                </Button>
              </div>

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