import { useState, useEffect } from 'react';
import { Play, Lock, Clock, CheckCircle, Star, Headphones } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { AudioTrack } from '@/lib/audiobook-data';

interface AudioTrackCardProps {
  track: AudioTrack;
  index: number;
  onPlay: (track: AudioTrack) => void;
  language: 'en' | 'es';
  isAuthenticated: boolean;
}

interface ChapterProgress {
  completed: boolean;
  progress: number; // 0-100
  lastPlayed: Date | null;
  rating: number; // 1-5 stars
}

export default function AudioTrackCard({ track, index, onPlay, language, isAuthenticated }: AudioTrackCardProps) {
  // During development/building phase - make everything accessible
  const isLocked = false; // !isAuthenticated;
  
  const [chapterProgress, setChapterProgress] = useState<ChapterProgress>(() => {
    const saved = localStorage.getItem(`chapter-progress-${track.id}`);
    return saved ? JSON.parse(saved) : {
      completed: false,
      progress: 0,
      lastPlayed: null,
      rating: 0
    };
  });
  
  const [isHovered, setIsHovered] = useState(false);

  const content = {
    en: {
      completed: "Completed",
      inProgress: "In Progress",
      notStarted: "Not Started",
      rate: "Rate Chapter",
      lastPlayed: "Last played"
    },
    es: {
      completed: "Completado",
      inProgress: "En Progreso", 
      notStarted: "No Iniciado",
      rate: "Calificar Capítulo",
      lastPlayed: "Última reproducción"
    }
  };

  const text = content[language];

  const updateProgress = (newProgress: number) => {
    const updated = {
      ...chapterProgress,
      progress: newProgress,
      completed: newProgress >= 95,
      lastPlayed: new Date()
    };
    setChapterProgress(updated);
    localStorage.setItem(`chapter-progress-${track.id}`, JSON.stringify(updated));
  };

  const setRating = (rating: number) => {
    const updated = { ...chapterProgress, rating };
    setChapterProgress(updated);
    localStorage.setItem(`chapter-progress-${track.id}`, JSON.stringify(updated));
  };

  const handlePlay = () => {
    updateProgress(Math.max(chapterProgress.progress, 5)); // Mark as started
    onPlay(track);
    
    // Create cosmic sound effect
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(440, audioContext.currentTime + 0.3);
    
    gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  const getStatusColor = () => {
    if (chapterProgress.completed) return "text-green-400 border-green-400/50";
    if (chapterProgress.progress > 0) return "text-yellow-400 border-yellow-400/50";
    return "text-purple-300 border-purple-500/30";
  };

  const getStatusIcon = () => {
    if (chapterProgress.completed) return <CheckCircle className="w-4 h-4" />;
    if (chapterProgress.progress > 0) return <Play className="w-4 h-4" />;
    return <Headphones className="w-4 h-4" />;
  };

  return (
    <div 
      className={`bg-gradient-to-br from-purple-900/30 to-blue-900/20 border rounded-lg p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${getStatusColor()}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Progress bar */}
      {chapterProgress.progress > 0 && (
        <div className="mb-3">
          <Progress 
            value={chapterProgress.progress} 
            className="h-2 bg-gray-700"
          />
        </div>
      )}
      
      {/* Status indicator */}
      {chapterProgress.completed && (
        <div className="absolute top-2 right-2 bg-green-500/80 rounded-full p-1">
          <CheckCircle className="w-3 h-3 text-white" />
        </div>
      )}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full flex items-center justify-center text-sm font-bold text-purple-300">
            {track.chapterNumber || index + 1}
          </div>
          <div>
            <h4 className="font-semibold text-purple-300 text-sm">
              {track.title[language]}
            </h4>
            <p className="text-gray-400 text-xs">
              {track.description[language]}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {track.duration && (
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
              <Clock className="w-3 h-3 mr-1" />
              {track.duration}
            </Badge>
          )}
          {isLocked && (
            <Lock className="w-4 h-4 text-amber-400" />
          )}
        </div>
      </div>
      
      {/* Interactive rating system (appears on hover) */}
      {isHovered && chapterProgress.progress > 0 && (
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs text-gray-400">{text.rate}:</span>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((rating) => (
              <Star
                key={rating}
                className={`w-3 h-3 cursor-pointer transition-all duration-200 ${
                  rating <= chapterProgress.rating
                    ? 'text-cosmic-gold fill-current'
                    : 'text-gray-500 hover:text-cosmic-gold/50'
                }`}
                onClick={() => setRating(rating)}
              />
            ))}
          </div>
        </div>
      )}

      <Button
        onClick={handlePlay}
        disabled={isLocked}
        className={`w-full ${
          isLocked 
            ? 'bg-gray-600/50 hover:bg-gray-600/50 text-gray-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white'
        } transition-all duration-300 flex items-center justify-center space-x-2`}
      >
        {isLocked ? (
          <>
            <Lock className="w-4 h-4" />
            <span>{language === 'en' ? 'Premium Required' : 'Premium Requerido'}</span>
          </>
        ) : (
          <>
            {getStatusIcon()}
            <span>
              {chapterProgress.completed 
                ? (language === 'en' ? 'Replay Chapter' : 'Repetir Capítulo')
                : chapterProgress.progress > 0 
                  ? (language === 'en' ? 'Continue Chapter' : 'Continuar Capítulo')
                  : (language === 'en' ? 'Play Chapter' : 'Reproducir Capítulo')
              }
            </span>
          </>
        )}
      </Button>
      
      {/* Last played indicator */}
      {chapterProgress.lastPlayed && isHovered && (
        <div className="mt-2 text-xs text-gray-500 text-center">
          {text.lastPlayed}: {new Date(chapterProgress.lastPlayed).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}