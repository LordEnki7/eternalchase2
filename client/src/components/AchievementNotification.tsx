import { useState, useEffect } from 'react';
import { Trophy, X, Star } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

interface AchievementNotificationProps {
  achievement: string | null;
  onClose: () => void;
}

export default function AchievementNotification({ achievement, onClose }: AchievementNotificationProps) {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  const achievements = {
    en: {
      first_chapter: {
        title: "First Step into the Cosmos",
        description: "You've taken your first step into the Eternal Chase universe!",
        icon: "🌟"
      },
      chapter_marathon: {
        title: "Chapter Marathon",
        description: "You've explored 10 chapters! The cosmic journey continues.",
        icon: "🚀"
      },
      book_complete: {
        title: "Book Completion",
        description: "Congratulations! You've completed an entire book.",
        icon: "📚"
      },
      trilogy_master: {
        title: "Trilogy Master",
        description: "You've completed the entire trilogy! You are a true cosmic explorer.",
        icon: "👑"
      },
      night_reader: {
        title: "Night Owl Reader",
        description: "Reading under the cosmic stars! Late night dedication achieved.",
        icon: "🌙"
      },
      speed_reader: {
        title: "Speed Explorer",
        description: "You're racing through the cosmos at lightspeed!",
        icon: "⚡"
      },
      character_expert: {
        title: "Character Expert",
        description: "You know the cosmic beings better than anyone!",
        icon: "🎭"
      }
    },
    es: {
      first_chapter: {
        title: "Primer Paso al Cosmos",
        description: "¡Has dado tu primer paso en el universo de Eternal Chase!",
        icon: "🌟"
      },
      chapter_marathon: {
        title: "Maratón de Capítulos",
        description: "¡Has explorado 10 capítulos! El viaje cósmico continúa.",
        icon: "🚀"
      },
      book_complete: {
        title: "Libro Completado",
        description: "¡Felicitaciones! Has completado un libro entero.",
        icon: "📚"
      },
      trilogy_master: {
        title: "Maestro de la Trilogía",
        description: "¡Has completado toda la trilogía! Eres un verdadero explorador cósmico.",
        icon: "👑"
      },
      night_reader: {
        title: "Lector Nocturno",
        description: "¡Leyendo bajo las estrellas cósmicas! Dedicación nocturna lograda.",
        icon: "🌙"
      },
      speed_reader: {
        title: "Explorador Veloz",
        description: "¡Estás corriendo por el cosmos a la velocidad de la luz!",
        icon: "⚡"
      },
      character_expert: {
        title: "Experto en Personajes",
        description: "¡Conoces a los seres cósmicos mejor que nadie!",
        icon: "🎭"
      }
    }
  };

  useEffect(() => {
    if (achievement) {
      setIsVisible(true);
      
      // Play achievement sound
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Achievement sound - ascending cosmic chime
      oscillator.frequency.setValueAtTime(523, audioContext.currentTime); // C5
      oscillator.frequency.exponentialRampToValueAtTime(783, audioContext.currentTime + 0.3); // G5
      oscillator.frequency.exponentialRampToValueAtTime(1047, audioContext.currentTime + 0.6); // C6
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1);

      // Auto-close after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for animation to complete
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);

  if (!achievement || !achievements[language][achievement as keyof typeof achievements[typeof language]]) {
    return null;
  }

  const achievementData = achievements[language][achievement as keyof typeof achievements[typeof language]];

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className="bg-gradient-to-br from-cosmic-gold/20 to-electric-blue/20 border border-cosmic-gold/50 rounded-xl p-6 max-w-sm shadow-2xl backdrop-blur-sm">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-cosmic-gold/30 to-electric-blue/30 rounded-full flex items-center justify-center mr-4 animate-pulse">
              <Trophy className="w-6 h-6 text-cosmic-gold" />
            </div>
            <div>
              <h3 className="font-orbitron text-lg font-bold text-cosmic-gold">
                {language === 'en' ? 'Achievement Unlocked!' : '¡Logro Desbloqueado!'}
              </h3>
            </div>
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center">
          <div className="text-4xl mb-2">{achievementData.icon}</div>
          <h4 className="font-orbitron text-xl font-bold text-bright-gold mb-2">
            {achievementData.title}
          </h4>
          <p className="text-gray-300 text-sm">
            {achievementData.description}
          </p>
        </div>

        {/* Cosmic effect */}
        <div className="absolute inset-0 rounded-xl opacity-20 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cosmic-gold to-transparent animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-electric-blue to-transparent animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-cosmic-gold to-transparent animate-pulse" style={{ animationDelay: '0.25s' }}></div>
          <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-electric-blue to-transparent animate-pulse" style={{ animationDelay: '0.75s' }}></div>
        </div>

        {/* Stars animation */}
        <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <Star
              key={i}
              className="absolute w-2 h-2 text-cosmic-gold fill-current animate-ping"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}