import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useAmbientSound } from '@/hooks/useAmbientSound';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface SoundProfile {
  url: string;
  volume: number;
  description: string;
}

const SOUND_PROFILES: Record<string, SoundProfile> = {
  '/': {
    url: '/sounds/cosmic-deep-space.mp3',
    volume: 0.25,
    description: 'Deep space ambience with distant stars'
  },
  '/trilogy': {
    url: '/sounds/cosmic-orchestral.mp3', 
    volume: 0.2,
    description: 'Epic orchestral undertones'
  },
  '/young-adult': {
    url: '/sounds/cosmic-mystical.mp3',
    volume: 0.3,
    description: 'Mystical energy resonance'
  },
  '/shop': {
    url: '/sounds/cosmic-marketplace.mp3',
    volume: 0.25,
    description: 'Marketplace energy with crystalline chimes'
  }
};

export default function AmbientSoundController() {
  const [location] = useLocation();
  const [isEnabled, setIsEnabled] = useState(false);
  const [globalVolume, setGlobalVolume] = useState(0.3);
  const [showControls, setShowControls] = useState(false);
  
  // Get current sound profile
  const currentProfile = SOUND_PROFILES[location] || SOUND_PROFILES['/'];
  
  const ambientSound = useAmbientSound(currentProfile.url, {
    volume: globalVolume * currentProfile.volume,
    fadeInDuration: 3000,
    fadeOutDuration: 2000
  });

  // Handle route changes
  useEffect(() => {
    if (isEnabled) {
      // Stop current sound and start new one for the route
      ambientSound.stop();
      setTimeout(() => {
        ambientSound.play();
      }, 500); // Small delay for smooth transition
    }
  }, [location, isEnabled]);

  // Handle enable/disable
  useEffect(() => {
    if (isEnabled) {
      ambientSound.play();
    } else {
      ambientSound.stop();
    }
  }, [isEnabled]);

  // Update volume when global volume changes
  useEffect(() => {
    ambientSound.setVolume(globalVolume * currentProfile.volume);
  }, [globalVolume, currentProfile.volume]);

  const toggleAmbientSound = () => {
    setIsEnabled(!isEnabled);
  };

  const handleVolumeChange = (value: number[]) => {
    setGlobalVolume(value[0]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Main toggle button */}
      <Button
        onClick={toggleAmbientSound}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
        className={`w-12 h-12 rounded-full transition-all duration-300 ${
          isEnabled 
            ? 'bg-cosmic-gold/20 hover:bg-cosmic-gold/40 text-cosmic-gold border border-cosmic-gold/30' 
            : 'bg-space-dark/80 hover:bg-space-dark/90 text-gray-400 border border-gray-600/30'
        }`}
        title={isEnabled ? 'Disable ambient sounds' : 'Enable ambient sounds'}
      >
        {isEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
      </Button>

      {/* Volume controls - show on hover */}
      {showControls && isEnabled && (
        <div 
          className="absolute bottom-16 right-0 bg-space-dark/95 backdrop-blur-sm border border-cosmic-gold/30 rounded-lg p-4 min-w-64 transform transition-all duration-300"
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
        >
          <div className="text-xs text-cosmic-gold font-semibold mb-2">
            Ambient Sound Control
          </div>
          
          <div className="text-xs text-gray-300 mb-3">
            {currentProfile.description}
          </div>
          
          <div className="flex items-center gap-3">
            <VolumeX className="w-4 h-4 text-gray-400" />
            <Slider
              value={[globalVolume]}
              onValueChange={handleVolumeChange}
              max={1}
              min={0}
              step={0.1}
              className="flex-1"
            />
            <Volume2 className="w-4 h-4 text-cosmic-gold" />
          </div>
          
          <div className="text-xs text-gray-400 mt-2 text-center">
            Volume: {Math.round(globalVolume * 100)}%
          </div>
        </div>
      )}
    </div>
  );
}