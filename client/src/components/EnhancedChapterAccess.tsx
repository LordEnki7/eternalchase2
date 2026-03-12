import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Clock, BookOpen, ChevronDown, ChevronUp, Headphones, Zap, Cpu, Radio, Wifi } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Chapter {
  id: string;
  title: { en: string; es: string };
  duration: string;
  fileName: string;
  description?: { en: string; es: string };
  chapterNumber?: number;
}

interface Book {
  id: string;
  title: { en: string; es: string };
  subtitle?: { en: string; es: string };
  coverImage: string;
  totalChapters: number;
  totalDuration: string;
  chapters: Chapter[];
  color: string;
}

interface EnhancedChapterAccessProps {
  books: Book[];
  onPlayChapter: (chapter: Chapter) => void;
  currentLanguage: 'en' | 'es';
}

export default function EnhancedChapterAccess({ 
  books, 
  onPlayChapter, 
  currentLanguage 
}: EnhancedChapterAccessProps) {
  const [expandedBook, setExpandedBook] = useState<string | null>(null);
  const [hoveredChapter, setHoveredChapter] = useState<string | null>(null);
  const [scanningBook, setScanningBook] = useState<string | null>(null);
  const [glitchEffect, setGlitchEffect] = useState(false);

  const toggleBook = (bookId: string) => {
    setScanningBook(bookId);
    setTimeout(() => {
      setExpandedBook(expandedBook === bookId ? null : bookId);
      setScanningBook(null);
    }, 800);
  };

  // Trigger random glitch effects
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.1) {
        setGlitchEffect(true);
        setTimeout(() => setGlitchEffect(false), 200);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 relative">
      {/* Futuristic Header with Holographic Effects */}
      <div className="text-center space-y-6 mb-12 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/5 to-purple-500/10 rounded-3xl blur-3xl animate-pulse" />
        
        <div className={cn(
          "relative transition-all duration-300",
          glitchEffect && "animate-pulse scale-105"
        )}>
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full flex items-center justify-center animate-spin-slow">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent flex-1 max-w-32" />
            <Radio className="w-6 h-6 text-cyan-400 animate-pulse" />
            <div className="h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent flex-1 max-w-32" />
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center animate-spin-slow">
              <Wifi className="w-6 h-6 text-white" />
            </div>
          </div>

          <h2 className={cn(
            "text-4xl md:text-5xl font-bold font-orbitron relative",
            "bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent",
            "drop-shadow-[0_0_20px_rgba(0,255,255,0.3)]",
            glitchEffect && "animate-bounce"
          )}>
            <span className="relative">
              {currentLanguage === 'en' ? 'NEURAL ARCHIVE ACCESS' : 'ACCESO AL ARCHIVO NEURAL'}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 blur-lg -z-10 animate-pulse" />
            </span>
          </h2>
          
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm font-mono text-green-400 tracking-wider uppercase">
              {currentLanguage === 'en' ? 'SYSTEMS ONLINE' : 'SISTEMAS EN LÍNEA'}
            </span>
          </div>
        </div>

        <p className="text-lg text-cyan-200/80 max-w-2xl mx-auto font-light tracking-wide">
          {currentLanguage === 'en' 
            ? 'Interface with the quantum-encrypted Eternal Chase universe through advanced neural pathway streaming'
            : 'Interfaz con el universo Eternal Chase encriptado cuánticamente a través de transmisión de vías neurales avanzadas'
          }
        </p>
      </div>

      {/* Futuristic Book Grid */}
      <div className="grid gap-8">
        {books.map((book, index) => (
          <Card 
            key={book.id}
            className={cn(
              "group overflow-hidden transition-all duration-700 hover:shadow-2xl relative",
              "bg-gradient-to-br from-slate-900/80 via-blue-900/20 to-purple-900/20",
              "border-2 border-cyan-500/30 hover:border-cyan-400/60",
              "backdrop-blur-xl",
              scanningBook === book.id && "animate-pulse border-cyan-400 shadow-cyan-400/50 shadow-2xl"
            )}
            style={{
              background: `
                linear-gradient(135deg, 
                  rgba(15, 23, 42, 0.9) 0%, 
                  rgba(30, 58, 138, 0.3) 30%,
                  rgba(88, 28, 135, 0.2) 70%,
                  rgba(15, 23, 42, 0.9) 100%
                ),
                radial-gradient(circle at 20% 20%, rgba(6, 182, 212, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)
              `
            }}
          >
            <CardContent className="p-0 relative">
              {/* Scanning Effect */}
              {scanningBook === book.id && (
                <div className="absolute inset-0 z-10">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent animate-pulse" />
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 animate-pulse" />
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 animate-pulse" />
                </div>
              )}

              {/* Book Header */}
              <div className="flex items-center p-6 cursor-pointer relative z-20" onClick={() => toggleBook(book.id)}>
                {/* Holographic Book Cover */}
                <div className="relative mr-6 group-hover:scale-110 transition-all duration-500">
                  <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400/30 to-blue-600/30 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg animate-pulse opacity-50" />
                  
                  <img 
                    src={book.coverImage} 
                    alt={book.title[currentLanguage]}
                    className={cn(
                      "w-20 h-28 object-cover rounded-lg shadow-2xl relative z-10",
                      "border border-cyan-400/50 hover:border-cyan-300",
                      "transition-all duration-500 filter hover:brightness-110 hover:contrast-110"
                    )}
                  />
                  
                  {/* Holographic Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-transparent to-purple-400/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Neural Interface Icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="w-8 h-8 bg-cyan-400/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <Zap className="w-4 h-4 text-cyan-300 animate-pulse" />
                    </div>
                  </div>

                  {/* Corner Accents */}
                  <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400 rounded-tl-lg opacity-70" />
                  <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400 rounded-tr-lg opacity-70" />
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400 rounded-bl-lg opacity-70" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400 rounded-br-lg opacity-70" />
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-4">
                    <h3 className={cn(
                      "text-xl md:text-2xl font-bold font-orbitron transition-all duration-300",
                      "text-cyan-100 group-hover:text-cyan-300",
                      "drop-shadow-[0_0_10px_rgba(6,182,212,0.3)]",
                      scanningBook === book.id && "animate-pulse text-cyan-400"
                    )}>
                      {book.title[currentLanguage]}
                    </h3>
                    
                    <Badge 
                      variant="secondary" 
                      className={cn(
                        "bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border border-cyan-400/40",
                        "backdrop-blur-sm hover:from-cyan-400/30 hover:to-blue-500/30 transition-all duration-300",
                        "shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                      )}
                    >
                      <Cpu className="w-3 h-3 mr-1 animate-pulse" />
                      <span className="font-mono text-xs tracking-wider">
                        {book.totalChapters} SECTORS
                      </span>
                    </Badge>
                  </div>
                  
                  {book.subtitle && (
                    <p className="text-cyan-200/70 text-sm md:text-base font-light tracking-wide">
                      {book.subtitle[currentLanguage]}
                    </p>
                  )}
                  
                  {/* Status Indicators */}
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2 text-cyan-300/80">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <Clock className="w-4 h-4" />
                      <span className="font-mono tracking-wider">{book.totalDuration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-300/80">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                      <Radio className="w-4 h-4" />
                      <span className="font-mono tracking-wider text-xs">
                        {currentLanguage === 'en' ? 'NEURAL STREAM' : 'FLUJO NEURAL'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-300/80">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                      <Wifi className="w-4 h-4" />
                      <span className="font-mono tracking-wider text-xs">QUANTUM</span>
                    </div>
                  </div>
                </div>

                {/* Neural Interface Button */}
                <div className="ml-4 relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "bg-gradient-to-r from-cyan-500/10 to-blue-600/10 hover:from-cyan-400/20 hover:to-blue-500/20",
                      "border border-cyan-400/30 hover:border-cyan-300/50",
                      "backdrop-blur-sm transition-all duration-300",
                      "hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]",
                      scanningBook === book.id && "animate-pulse border-cyan-400 shadow-cyan-400/50"
                    )}
                  >
                    <div className="relative">
                      {expandedBook === book.id ? (
                        <ChevronUp className="w-5 h-5 text-cyan-300" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-cyan-300" />
                      )}
                      <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-sm animate-pulse" />
                    </div>
                  </Button>
                  
                  {/* Status Indicator */}
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                </div>
              </div>

              {/* Neural Chapter Interface */}
              {expandedBook === book.id && (
                <div className="border-t border-cyan-500/30 bg-gradient-to-b from-slate-800/50 to-slate-900/80 backdrop-blur-xl">
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                        <Cpu className="w-4 h-4 text-white animate-pulse" />
                      </div>
                      <h4 className="text-lg font-mono font-bold text-cyan-300 tracking-wider uppercase">
                        {currentLanguage === 'en' ? 'Neural Pathway Access' : 'Acceso de Vías Neurales'}
                      </h4>
                      <div className="flex-1 h-px bg-gradient-to-r from-cyan-400/50 to-transparent" />
                      <div className="text-xs font-mono text-cyan-400/70 tracking-wider">
                        {currentLanguage === 'en' ? 'SECTORS AVAILABLE' : 'SECTORES DISPONIBLES'}
                      </div>
                    </div>
                    
                    <div className="grid gap-3 max-h-96 overflow-y-auto custom-scrollbar">
                      {book.chapters.map((chapter, index) => (
                        <div
                          key={chapter.id}
                          className={cn(
                            "group/chapter flex items-center gap-4 p-4 rounded-xl transition-all duration-300 cursor-pointer",
                            "bg-gradient-to-r from-slate-800/60 to-slate-700/40 hover:from-cyan-900/40 hover:to-blue-900/40",
                            "border border-slate-600/30 hover:border-cyan-400/50",
                            "backdrop-blur-sm relative overflow-hidden",
                            hoveredChapter === chapter.id && "border-cyan-400/70 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                          )}
                          onMouseEnter={() => setHoveredChapter(chapter.id)}
                          onMouseLeave={() => setHoveredChapter(null)}
                          onClick={() => onPlayChapter(chapter)}
                        >
                          {/* Holographic Play Button */}
                          <div className="flex-shrink-0 relative">
                            <div className={cn(
                              "w-12 h-12 rounded-full flex items-center justify-center relative",
                              "bg-gradient-to-br from-cyan-500/20 via-blue-500/30 to-purple-500/20",
                              "group-hover/chapter:from-cyan-400/40 group-hover/chapter:via-blue-400/50 group-hover/chapter:to-purple-400/40",
                              "border border-cyan-400/30 group-hover/chapter:border-cyan-300/60",
                              "transition-all duration-300 hover:scale-110",
                              "shadow-[0_0_15px_rgba(6,182,212,0.2)] group-hover/chapter:shadow-[0_0_25px_rgba(6,182,212,0.4)]",
                              hoveredChapter === chapter.id && "animate-pulse"
                            )}>
                              <Play className="w-5 h-5 text-cyan-300 ml-0.5 group-hover/chapter:text-cyan-200 transition-colors" />
                              
                              {/* Rotating Ring Effect */}
                              <div className="absolute inset-0 rounded-full border border-cyan-400/20 animate-spin-slow" />
                              <div className="absolute inset-1 rounded-full border border-blue-400/20 animate-spin-slow" style={{ animationDirection: 'reverse' }} />
                            </div>
                            

                          </div>

                          <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-mono text-cyan-400/70 tracking-wider">
                                  SECTOR
                                </span>
                                <div className="w-px h-4 bg-cyan-400/30" />
                              </div>
                              <h5 className={cn(
                                "text-base font-medium font-orbitron tracking-wide truncate transition-all duration-300",
                                "text-cyan-100 group-hover/chapter:text-cyan-300",
                                "drop-shadow-[0_0_8px_rgba(6,182,212,0.2)]",
                                hoveredChapter === chapter.id && "text-cyan-200 animate-pulse"
                              )}>
                                {chapter.title[currentLanguage]}
                              </h5>
                            </div>
                            
                            {chapter.description && (
                              <p className="text-sm text-cyan-200/60 line-clamp-1 font-light">
                                {chapter.description[currentLanguage]}
                              </p>
                            )}

                            {/* Neural Activity Indicator */}
                            <div className="flex items-center gap-2 text-xs">
                              <div className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                <span className="font-mono text-green-400/70 tracking-wider">READY</span>
                              </div>
                              <div className="w-px h-3 bg-slate-500/30" />
                              <span className="font-mono text-blue-400/70 tracking-wider">NEURAL-SYNC</span>
                            </div>
                          </div>

                          {/* Duration Display */}
                          <div className="flex-shrink-0 flex flex-col items-end gap-1">
                            <div className="flex items-center gap-2 text-cyan-300/80">
                              <Clock className="w-3 h-3" />
                              <span className="text-sm font-mono tracking-wider">{chapter.duration}</span>
                            </div>
                            <div className="text-xs font-mono text-slate-400/70 tracking-wider">
                              {currentLanguage === 'en' ? 'DURATION' : 'DURACIÓN'}
                            </div>
                          </div>

                          {/* Scanning Line Effect */}
                          {hoveredChapter === chapter.id && (
                            <div className="absolute inset-0 pointer-events-none">
                              <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-transparent via-cyan-400 to-transparent animate-pulse" />
                              <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-transparent via-cyan-400 to-transparent animate-pulse" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Neural Interface Status */}
      <div className="text-center mt-12 p-8 rounded-2xl bg-gradient-to-br from-slate-900/80 via-blue-900/20 to-purple-900/20 border border-cyan-400/30 backdrop-blur-xl relative overflow-hidden">
        {/* Background Grid Effect */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }} />
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm font-mono text-green-400 tracking-wider uppercase">
              {currentLanguage === 'en' ? 'Neural Interface Active' : 'Interfaz Neural Activa'}
            </span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          </div>
          
          <p className="text-cyan-200/80 font-light tracking-wide max-w-2xl mx-auto">
            {currentLanguage === 'en' 
              ? 'Experience the complete cosmic journey through quantum-encrypted neural pathways with multi-dimensional audio synthesis and real-time consciousness streaming'
              : 'Experimenta el viaje cósmico completo a través de vías neurales encriptadas cuánticamente con síntesis de audio multidimensional y transmisión de conciencia en tiempo real'
            }
          </p>

          <div className="flex items-center justify-center gap-6 mt-6 text-xs font-mono">
            <div className="flex items-center gap-2 text-cyan-400/70">
              <Radio className="w-3 h-3" />
              <span>QUANTUM-SYNC</span>
            </div>
            <div className="flex items-center gap-2 text-blue-400/70">
              <Wifi className="w-3 h-3" />
              <span>NEURAL-LINK</span>
            </div>
            <div className="flex items-center gap-2 text-purple-400/70">
              <Zap className="w-3 h-3" />
              <span>BIO-INTERFACE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}