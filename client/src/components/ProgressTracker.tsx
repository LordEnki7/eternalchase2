import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Book, Headphones } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

interface ProgressData {
  chaptersCompleted: number;
  totalChapters: number;
  booksCompleted: number;
  totalBooks: number;
  listeningTime: number; // in minutes
  achievements: string[];
}

interface ProgressTrackerProps {
  currentChapter?: string;
  bookId?: string;
  onAchievementUnlocked?: (achievement: string) => void;
}

export default function ProgressTracker({ 
  currentChapter, 
  bookId, 
  onAchievementUnlocked 
}: ProgressTrackerProps) {
  const { language } = useLanguage();
  const [progress, setProgress] = useState<ProgressData>(() => {
    const saved = localStorage.getItem('eternal-chase-progress');
    return saved ? JSON.parse(saved) : {
      chaptersCompleted: 0,
      totalChapters: 50, // Total across trilogy
      booksCompleted: 0,
      totalBooks: 3,
      listeningTime: 0,
      achievements: []
    };
  });

  const content = {
    en: {
      title: "Cosmic Journey Progress",
      chaptersRead: "Chapters Explored",
      booksCompleted: "Books Completed",
      listeningTime: "Listening Time",
      achievements: "Cosmic Achievements",
      readingStreak: "Reading Streak",
      minutes: "minutes",
      hours: "hours",  
      achievements_list: {
        first_chapter: "🌟 First Step into the Cosmos",
        chapter_marathon: "🚀 Chapter Marathon (10 chapters)",
        book_complete: "📚 Book Completion",
        trilogy_master: "👑 Trilogy Master",
        night_reader: "🌙 Night Owl Reader",
        speed_reader: "⚡ Speed Explorer",
        character_expert: "🎭 Character Expert"
      }
    },
    es: {
      title: "Progreso del Viaje Cósmico", 
      chaptersRead: "Capítulos Explorados",
      booksCompleted: "Libros Completados",
      listeningTime: "Tiempo de Escucha",
      achievements: "Logros Cósmicos",
      readingStreak: "Racha de Lectura",
      minutes: "minutos",
      hours: "horas",
      achievements_list: {
        first_chapter: "🌟 Primer Paso al Cosmos",
        chapter_marathon: "🚀 Maratón de Capítulos (10 capítulos)",
        book_complete: "📚 Libro Completado",
        trilogy_master: "👑 Maestro de la Trilogía",
        night_reader: "🌙 Lector Nocturno",
        speed_reader: "⚡ Explorador Veloz",
        character_expert: "🎭 Experto en Personajes"
      }
    }
  };

  const text = content[language];

  // Update progress when chapter changes
  useEffect(() => {
    if (currentChapter && bookId) {
      setProgress(prevProgress => {
        const newProgress = { ...prevProgress };
        
        // Check for new achievements
        const newAchievements = [];
        
        // First chapter achievement
        if (newProgress.chaptersCompleted === 0 && !newProgress.achievements.includes('first_chapter')) {
          newAchievements.push('first_chapter');
        }
        
        // Increment chapters
        newProgress.chaptersCompleted += 1;
        
        // Chapter marathon achievement
        if (newProgress.chaptersCompleted >= 10 && !newProgress.achievements.includes('chapter_marathon')) {
          newAchievements.push('chapter_marathon');
        }
        
        // Book completion achievement
        const chaptersPerBook = Math.floor(newProgress.totalChapters / 3);
        if (newProgress.chaptersCompleted % chaptersPerBook === 0 && !newProgress.achievements.includes('book_complete')) {
          newAchievements.push('book_complete');
          newProgress.booksCompleted += 1;
        }
        
        // Trilogy master achievement
        if (newProgress.booksCompleted === 3 && !newProgress.achievements.includes('trilogy_master')) {
          newAchievements.push('trilogy_master');
        }
        
        // Add new achievements
        newProgress.achievements = [...newProgress.achievements, ...newAchievements];
        
        // Trigger achievement callbacks
        newAchievements.forEach(achievement => {
          onAchievementUnlocked?.(achievement);
        });
        
        // Save to localStorage
        localStorage.setItem('eternal-chase-progress', JSON.stringify(newProgress));
        
        return newProgress;
      });
    }
  }, [currentChapter, bookId, onAchievementUnlocked]);

  // Update listening time
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prevProgress => {
        const newProgress = { ...prevProgress, listeningTime: prevProgress.listeningTime + 1 };
        localStorage.setItem('eternal-chase-progress', JSON.stringify(newProgress));
        return newProgress;
      });
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const chapterProgress = (progress.chaptersCompleted / progress.totalChapters) * 100;
  const bookProgress = (progress.booksCompleted / progress.totalBooks) * 100;
  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} ${text.minutes}`;
    const hours = Math.floor(minutes / 60);
    return `${hours} ${text.hours}`;
  };

  return (
    <div className="bg-gradient-to-br from-cosmic-purple/20 to-electric-blue/10 border border-cosmic-gold/30 rounded-xl p-6 mb-8">
      <div className="flex items-center mb-6">
        <Trophy className="w-6 h-6 text-cosmic-gold mr-3" />
        <h3 className="font-orbitron text-xl font-bold text-cosmic-gold">
          {text.title}
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chapter Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-300 flex items-center">
              <Book className="w-4 h-4 mr-2" />
              {text.chaptersRead}
            </span>
            <span className="text-cosmic-gold font-bold">
              {progress.chaptersCompleted}/{progress.totalChapters}
            </span>
          </div>
          <Progress 
            value={chapterProgress} 
            className="h-3 bg-cosmic-purple/30"
          />
        </div>

        {/* Book Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-300 flex items-center">
              <Star className="w-4 h-4 mr-2" />
              {text.booksCompleted}
            </span>
            <span className="text-cosmic-gold font-bold">
              {progress.booksCompleted}/{progress.totalBooks}
            </span>
          </div>
          <Progress 
            value={bookProgress} 
            className="h-3 bg-cosmic-purple/30"
          />
        </div>

        {/* Listening Time */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-300 flex items-center">
              <Headphones className="w-4 h-4 mr-2" />
              {text.listeningTime}
            </span>
            <span className="text-bright-blue font-bold">
              {formatTime(progress.listeningTime)}
            </span>
          </div>
        </div>

        {/* Achievements */}
        <div className="space-y-3">
          <span className="text-gray-300 flex items-center">
            <Trophy className="w-4 h-4 mr-2" />
            {text.achievements}
          </span>
          <div className="flex flex-wrap gap-2">
            {progress.achievements.map((achievement, index) => (
              <Badge 
                key={index}
                className="bg-cosmic-gold/20 text-cosmic-gold border-cosmic-gold/30 text-xs animate-pulse"
              >
                {text.achievements_list[achievement as keyof typeof text.achievements_list]}
              </Badge>
            ))}
            {progress.achievements.length === 0 && (
              <span className="text-gray-500 text-sm">
                {language === 'en' ? 'Start your journey to unlock achievements' : 'Comienza tu viaje para desbloquear logros'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}