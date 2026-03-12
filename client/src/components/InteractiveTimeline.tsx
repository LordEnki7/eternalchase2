import { useState } from 'react';
import { Play, Lock, Calendar, Star, BookOpen } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface TimelineEvent {
  id: string;
  title: { en: string; es: string };
  description: { en: string; es: string };
  date: string;
  type: 'book' | 'chapter' | 'character' | 'cosmic-event';
  bookId?: string;
  chapterNumber?: number;
  isCompleted?: boolean;
  progress?: number;
  isLocked?: boolean;
}

interface InteractiveTimelineProps {
  events: TimelineEvent[];
  onEventClick?: (event: TimelineEvent) => void;
}

export default function InteractiveTimeline({ events, onEventClick }: InteractiveTimelineProps) {
  const { language } = useLanguage();
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);

  const content = {
    en: {
      title: "COSMIC TIMELINE",
      subtitle: "Explore the chronological journey through the Eternal Chase universe",
      completed: "Completed",
      inProgress: "In Progress", 
      locked: "Locked",
      unlockNext: "Complete previous events to unlock",
      play: "Experience Event",
      viewDetails: "View Details"
    },
    es: {
      title: "LÍNEA TEMPORAL CÓSMICA",
      subtitle: "Explora el viaje cronológico a través del universo de Eternal Chase",
      completed: "Completado",
      inProgress: "En Progreso",
      locked: "Bloqueado",
      unlockNext: "Completa eventos anteriores para desbloquear",
      play: "Experimentar Evento",
      viewDetails: "Ver Detalles"
    }
  };

  const text = content[language];

  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'book': return <BookOpen className="w-5 h-5" />;
      case 'chapter': return <Play className="w-5 h-5" />;
      case 'character': return <Star className="w-5 h-5" />;
      case 'cosmic-event': return <Calendar className="w-5 h-5" />;
      default: return <Calendar className="w-5 h-5" />;
    }
  };

  const getEventColor = (event: TimelineEvent) => {
    if (event.isLocked) return "border-gray-600 bg-gray-800/50";
    if (event.isCompleted) return "border-green-500 bg-green-900/30";
    if (event.progress && event.progress > 0) return "border-yellow-500 bg-yellow-900/30";
    return "border-purple-500 bg-purple-900/30";
  };

  const getEventTextColor = (event: TimelineEvent) => {
    if (event.isLocked) return "text-gray-500";
    if (event.isCompleted) return "text-green-400";
    if (event.progress && event.progress > 0) return "text-yellow-400";
    return "text-purple-300";
  };

  const handleEventClick = (event: TimelineEvent) => {
    if (event.isLocked) return;
    setSelectedEvent(event);
    onEventClick?.(event);
    
    // Create cosmic interaction sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(523, audioContext.currentTime); // C5
    oscillator.frequency.exponentialRampToValueAtTime(659, audioContext.currentTime + 0.2); // E5
    
    gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.4);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.4);
  };

  return (
    <section className="py-20 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-orbitron text-4xl font-bold mb-6 bg-gradient-to-r from-cosmic-gold to-bright-gold bg-clip-text text-transparent">
            {text.title}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {text.subtitle}
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-cosmic-gold via-electric-blue to-cosmic-purple"></div>
          
          <div className="space-y-8">
            {events.map((event, index) => (
              <div
                key={event.id}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'justify-start' : 'justify-end'
                }`}
              >
                {/* Timeline node */}
                <div className="absolute left-1/2 transform -translate-x-1/2 z-20">
                  <div 
                    className={`w-6 h-6 rounded-full border-4 ${getEventColor(event)} cursor-pointer hover:scale-110 transition-all duration-300`}
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-cosmic-gold/50 to-electric-blue/50 animate-pulse"></div>
                  </div>
                </div>

                {/* Event card */}
                <div 
                  className={`w-5/12 ${
                    index % 2 === 0 ? 'mr-auto pr-8' : 'ml-auto pl-8'
                  }`}
                >
                  <div 
                    className={`border rounded-xl p-6 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-lg ${getEventColor(event)}`}
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="flex items-center mb-3">
                      <div className={`mr-3 ${getEventTextColor(event)}`}>
                        {getEventIcon(event.type)}
                      </div>
                      <div>
                        <h3 className={`font-orbitron text-lg font-bold ${getEventTextColor(event)}`}>
                          {event.title[language]}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {event.date}
                        </p>
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm mb-4">
                      {event.description[language]}
                    </p>

                    {/* Progress bar for in-progress events */}
                    {event.progress && event.progress > 0 && !event.isCompleted && (
                      <div className="mb-4">
                        <Progress 
                          value={event.progress} 
                          className="h-2 bg-gray-700"
                        />
                        <p className="text-xs text-gray-400 mt-1">
                          {event.progress}% {text.completed.toLowerCase()}
                        </p>
                      </div>
                    )}

                    {/* Status badges */}
                    <div className="flex justify-between items-center">
                      <div>
                        {event.isLocked && (
                          <Badge className="bg-gray-600/50 text-gray-400 border-gray-600/50 text-xs">
                            <Lock className="w-3 h-3 mr-1" />
                            {text.locked}
                          </Badge>
                        )}
                        {event.isCompleted && (
                          <Badge className="bg-green-500/30 text-green-400 border-green-500/50 text-xs">
                            {text.completed}
                          </Badge>
                        )}
                        {event.progress && event.progress > 0 && !event.isCompleted && (
                          <Badge className="bg-yellow-500/30 text-yellow-400 border-yellow-500/50 text-xs">
                            {text.inProgress}
                          </Badge>
                        )}
                      </div>

                      {!event.isLocked && (
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEventClick(event);
                          }}
                          className="bg-cosmic-gold/20 hover:bg-cosmic-gold/40 text-cosmic-gold border-cosmic-gold/50"
                        >
                          <Play className="w-3 h-3 mr-1" />
                          {text.play}
                        </Button>
                      )}
                    </div>

                    {/* Locked message */}
                    {event.isLocked && (
                      <p className="text-xs text-gray-500 mt-2 italic">
                        {text.unlockNext}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}