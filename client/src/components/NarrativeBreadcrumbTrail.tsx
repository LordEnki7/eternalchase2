import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Lock, 
  Unlock, 
  Star, 
  Eye, 
  Heart, 
  Zap, 
  Crown,
  ChevronRight,
  Play,
  CheckCircle,
  Circle,
  Sparkles
} from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { useSubscription } from "@/hooks/useSubscription";
import { audiobookTracks } from "@/lib/audiobook-data";

interface ChapterInsight {
  id: string;
  chapterKey: string;
  type: 'character' | 'lore' | 'romance' | 'cosmic' | 'foreshadowing';
  title: { en: string; es: string };
  description: { en: string; es: string };
  unlockCondition: 'complete' | 'premium' | 'replay';
  icon: typeof BookOpen;
}

interface ChapterProgress {
  chapterId: string;
  completed: boolean;
  listenedAt?: Date;
  completionPercentage: number;
  insightsUnlocked: string[];
}

const CHAPTER_INSIGHTS: ChapterInsight[] = [
  {
    id: 'lyra-first-glimpse',
    chapterKey: 'eternal-chase-1',
    type: 'character',
    title: { en: 'Lyra\'s Awakening', es: 'El Despertar de Lyra' },
    description: { en: 'The moment Lyra first senses the cosmic pull that will define her destiny', es: 'El momento en que Lyra siente por primera vez la atracción cósmica que definirá su destino' },
    unlockCondition: 'complete',
    icon: Heart
  },
  {
    id: 'dimensional-theory',
    chapterKey: 'eternal-chase-2',
    type: 'lore',
    title: { en: 'Dimensional Mechanics', es: 'Mecánicas Dimensionales' },
    description: { en: 'Understanding how love transcends physical boundaries between worlds', es: 'Entendiendo cómo el amor trasciende las barreras físicas entre mundos' },
    unlockCondition: 'premium',
    icon: Zap
  },
  {
    id: 'kael-motivation',
    chapterKey: 'eternal-chase-3',
    type: 'romance',
    title: { en: 'Kael\'s Sacrifice', es: 'El Sacrificio de Kael' },
    description: { en: 'The deeper meaning behind Kael\'s willingness to cross dimensions', es: 'El significado más profundo detrás de la voluntad de Kael de cruzar dimensiones' },
    unlockCondition: 'complete',
    icon: Crown
  },
  {
    id: 'source-connection',
    chapterKey: 'eternal-chase-4',
    type: 'cosmic',
    title: { en: 'The Source\'s Design', es: 'El Diseño de la Fuente' },
    description: { en: 'How the cosmic entity orchestrates events across multiple timelines', es: 'Cómo la entidad cósmica orquesta eventos a través de múltiples líneas temporales' },
    unlockCondition: 'premium',
    icon: Star
  },
  {
    id: 'spiral-war-seeds',
    chapterKey: 'eternal-chase-10',
    type: 'foreshadowing',
    title: { en: 'Seeds of War', es: 'Semillas de Guerra' },
    description: { en: 'Early hints of the galactic conflict that will reshape everything', es: 'Pistas tempranas del conflicto galáctico que lo cambiará todo' },
    unlockCondition: 'replay',
    icon: Eye
  }
];

export default function NarrativeBreadcrumbTrail() {
  const { language } = useLanguage();
  const { hasAccess } = useSubscription();
  const [userProgress, setUserProgress] = useState<ChapterProgress[]>([]);
  const [selectedInsight, setSelectedInsight] = useState<ChapterInsight | null>(null);
  const [journeyView, setJourneyView] = useState<'linear' | 'cosmic'>('linear');

  const text = {
    en: {
      title: "Your Narrative Journey",
      subtitle: "Track your progression through the cosmic saga",
      overallProgress: "Overall Progress",
      chaptersCompleted: "Chapters Completed",
      insightsUnlocked: "Insights Unlocked",
      viewLinear: "Linear View",
      viewCosmic: "Cosmic Map",
      unlockPremium: "Unlock Premium Insights",
      replayToUnlock: "Replay Chapter to Unlock",
      completeToUnlock: "Complete Chapter to Unlock",
      insightTypes: {
        character: "Character Development",
        lore: "World Building",
        romance: "Love Story",
        cosmic: "Cosmic Mysteries",
        foreshadowing: "Future Connections"
      }
    },
    es: {
      title: "Tu Viaje Narrativo",
      subtitle: "Rastrea tu progreso a través de la saga cósmica",
      overallProgress: "Progreso General",
      chaptersCompleted: "Capítulos Completados",
      insightsUnlocked: "Perspectivas Desbloqueadas",
      viewLinear: "Vista Lineal",
      viewCosmic: "Mapa Cósmico",
      unlockPremium: "Desbloquear Perspectivas Premium",
      replayToUnlock: "Repetir Capítulo para Desbloquear",
      completeToUnlock: "Completar Capítulo para Desbloquear",
      insightTypes: {
        character: "Desarrollo de Personajes",
        lore: "Construcción del Mundo",
        romance: "Historia de Amor",
        cosmic: "Misterios Cósmicos",
        foreshadowing: "Conexiones Futuras"
      }
    }
  };

  const content = text[language];

  // Calculate progress from authentic audiobook tracks
  const allChapters = audiobookTracks.filter(track => track.type === 'chapter');
  const completedChapters = userProgress.filter(p => p.completed).length;
  const totalInsights = CHAPTER_INSIGHTS.length;
  const unlockedInsights = userProgress.reduce((acc, p) => acc + p.insightsUnlocked.length, 0);
  const overallProgress = allChapters.length > 0 ? (completedChapters / allChapters.length) * 100 : 0;

  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('narrative-progress');
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    } else {
      // Initialize with some sample progress for demonstration
      const initialProgress: ChapterProgress[] = allChapters.slice(0, 3).map((chapter, index) => ({
        chapterId: chapter.id,
        completed: index < 2,
        completionPercentage: index < 2 ? 100 : 45,
        insightsUnlocked: index < 2 ? CHAPTER_INSIGHTS.filter(i => i.chapterKey === chapter.id && i.unlockCondition === 'complete').map(i => i.id) : []
      }));
      setUserProgress(initialProgress);
    }
  }, []);

  // Save progress to localStorage when it changes
  useEffect(() => {
    if (userProgress.length > 0) {
      localStorage.setItem('narrative-progress', JSON.stringify(userProgress));
    }
  }, [userProgress]);

  const getChapterProgress = (chapterId: string): ChapterProgress | undefined => {
    return userProgress.find(p => p.chapterId === chapterId);
  };

  const isInsightUnlocked = (insight: ChapterInsight): boolean => {
    const chapterProgress = userProgress.find(p => p.chapterId === insight.chapterKey);
    if (!chapterProgress) return false;

    switch (insight.unlockCondition) {
      case 'complete':
        return chapterProgress.completed;
      case 'premium':
        return chapterProgress.completed && hasAccess;
      case 'replay':
        return chapterProgress.insightsUnlocked.includes(insight.id);
      default:
        return false;
    }
  };

  const getInsightIcon = (type: ChapterInsight['type']) => {
    switch (type) {
      case 'character': return Heart;
      case 'lore': return BookOpen;
      case 'romance': return Sparkles;
      case 'cosmic': return Star;
      case 'foreshadowing': return Eye;
      default: return Circle;
    }
  };

  const ChapterNode = ({ chapter, index }: { chapter: any; index: number }) => {
    const progress = getChapterProgress(chapter.id);
    const isCompleted = progress?.completed || false;
    const completionPercentage = progress?.completionPercentage || 0;
    const chapterInsights = CHAPTER_INSIGHTS.filter(i => i.chapterKey === chapter.id);
    const unlockedCount = chapterInsights.filter(isInsightUnlocked).length;

    return (
      <div className="relative">
        {/* Connection Line */}
        {index < allChapters.length - 1 && (
          <div className="absolute top-8 left-8 w-full h-0.5 bg-gradient-to-r from-cosmic-gold/50 to-electric-blue/50 z-0" />
        )}
        
        {/* Chapter Node */}
        <div className="relative z-10 flex items-center gap-4">
          <div className={`
            w-16 h-16 rounded-full border-2 flex items-center justify-center
            ${isCompleted 
              ? 'bg-cosmic-gold/20 border-cosmic-gold text-cosmic-gold' 
              : 'bg-space-dark/50 border-electric-blue/50 text-electric-blue/70'
            }
          `}>
            {isCompleted ? (
              <CheckCircle className="w-8 h-8" />
            ) : (
              <Circle className="w-8 h-8" />
            )}
          </div>
          
          <Card className="flex-1 holographic-border bg-gradient-to-br from-space-dark/80 to-cosmic-purple/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-bright-blue">
                  {chapter.title || `Chapter ${chapter.chapterNumber}`}
                </h3>
                <div className="flex items-center gap-2">
                  {chapterInsights.length > 0 && (
                    <Badge variant="outline" className="text-cosmic-gold border-cosmic-gold/50">
                      {unlockedCount}/{chapterInsights.length} insights
                    </Badge>
                  )}
                  {!isCompleted && (
                    <Button size="sm" variant="ghost" className="text-electric-blue">
                      <Play className="w-4 h-4 mr-1" />
                      Continue
                    </Button>
                  )}
                </div>
              </div>
              
              {completionPercentage > 0 && (
                <div className="space-y-2">
                  <Progress value={completionPercentage} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    {completionPercentage}% complete
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Insights for this chapter */}
        {chapterInsights.length > 0 && (
          <div className="ml-20 mt-2 space-y-2">
            {chapterInsights.map(insight => {
              const IconComponent = getInsightIcon(insight.type);
              const unlocked = isInsightUnlocked(insight);
              
              return (
                <TooltipProvider key={insight.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div 
                        className={`
                          flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all
                          ${unlocked 
                            ? 'bg-cosmic-gold/10 border-cosmic-gold/30 hover:bg-cosmic-gold/20' 
                            : 'bg-space-dark/30 border-muted/30 hover:bg-space-dark/50'
                          }
                        `}
                        onClick={() => unlocked && setSelectedInsight(insight)}
                      >
                        <div className={`p-2 rounded-full ${unlocked ? 'bg-cosmic-gold/20' : 'bg-muted/20'}`}>
                          {unlocked ? (
                            <IconComponent className="w-4 h-4 text-cosmic-gold" />
                          ) : (
                            <Lock className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-medium ${unlocked ? 'text-cosmic-gold' : 'text-muted-foreground'}`}>
                            {insight.title[language]}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {content.insightTypes[insight.type]}
                          </p>
                        </div>
                        {!unlocked && (
                          <Badge variant="outline" className="text-xs">
                            {insight.unlockCondition === 'premium' ? content.unlockPremium :
                             insight.unlockCondition === 'replay' ? content.replayToUnlock :
                             content.completeToUnlock}
                          </Badge>
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{unlocked ? insight.description[language] : 'Complete requirements to unlock'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Progress Overview */}
      <Card className="holographic-border bg-gradient-to-br from-space-dark/80 to-cosmic-purple/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-bright-blue">{content.title}</h2>
              <p className="text-muted-foreground">{content.subtitle}</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant={journeyView === 'linear' ? 'default' : 'outline'}
                onClick={() => setJourneyView('linear')}
                size="sm"
              >
                {content.viewLinear}
              </Button>
              <Button 
                variant={journeyView === 'cosmic' ? 'default' : 'outline'}
                onClick={() => setJourneyView('cosmic')}
                size="sm"
              >
                {content.viewCosmic}
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-cosmic-gold">{content.overallProgress}</h3>
              <Progress value={overallProgress} className="h-3" />
              <p className="text-sm text-muted-foreground">{Math.round(overallProgress)}%</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-electric-blue">{content.chaptersCompleted}</h3>
              <p className="text-2xl font-bold text-bright-blue">{completedChapters}/{allChapters.length}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-cosmic-purple">{content.insightsUnlocked}</h3>
              <p className="text-2xl font-bold text-bright-blue">{unlockedInsights}/{totalInsights}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Journey Map */}
      <Card className="holographic-border bg-gradient-to-br from-space-dark/80 to-cosmic-purple/20">
        <CardContent className="p-6">
          {journeyView === 'linear' ? (
            <div className="space-y-8">
              {allChapters.slice(0, 10).map((chapter, index) => (
                <ChapterNode key={chapter.id} chapter={chapter} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Star className="w-16 h-16 text-cosmic-gold mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-bright-blue mb-2">Cosmic Map View</h3>
              <p className="text-muted-foreground">
                Interactive constellation view coming soon - explore chapters as connected star systems
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Insight Detail Modal */}
      {selectedInsight && (
        <Card className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-2xl mx-auto holographic-border bg-gradient-to-br from-space-dark/95 to-cosmic-purple/30 backdrop-blur-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-cosmic-gold/20">
                  <selectedInsight.icon className="w-6 h-6 text-cosmic-gold" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-cosmic-gold">
                    {selectedInsight.title[language]}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {content.insightTypes[selectedInsight.type]}
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedInsight(null)}
              >
                ×
              </Button>
            </div>
            <p className="text-bright-blue leading-relaxed">
              {selectedInsight.description[language]}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}