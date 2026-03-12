import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, SkipForward, SkipBack, Book, Crown, Clock, Users, Star, ChevronDown, ChevronUp } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { useSubscription } from "@/hooks/useSubscription";
import { UpgradeModal } from "@/components/UpgradeModal";
import StarfieldBackground from "@/components/starfield-background";
const eternalChaseCover = '/media/book-covers/eternal-chase-cover-alt.jpg';
const spiralGalaxyCover = '/media/book-covers/spiral-galaxy-book-cover.png';
const ascensionsEdgeCover = '/media/book-covers/eternal-chase-ascensions-edge.png';
const infiniteDawnCover = '/media/book-covers/infinite-dawn-3.png';
const trilogyImage = '/media/book-covers/trilogy-alt.png';
import AmbientSoundController from '@/components/AmbientSoundController';
import { audiobookTracks, getChaptersByBookId, getFreeContentByBookId } from '@/lib/audiobook-data';
import AudioPlayer from '@/components/AudioPlayer';
import NarrativeBreadcrumbTrail from '@/components/NarrativeBreadcrumbTrail';

export default function Trilogy() {
  const { language } = useLanguage();
  const { hasAccess } = useSubscription();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioPlayerVisible, setAudioPlayerVisible] = useState(false);
  const [currentAudioFile, setCurrentAudioFile] = useState('');
  const [currentAudioTitle, setCurrentAudioTitle] = useState('');

  // Calculate real data from authentic audiobook tracks
  const eternalChaseChapters = getChaptersByBookId('eternal-chase');
  const spiralGalaxyChapters = getChaptersByBookId('spiral-galaxy');
  const ascensionsEdgeChapters = getChaptersByBookId('ascensions-edge');
  const infiniteDawnTeasers = getChaptersByBookId('infinite-dawn');

  const content = {
    en: {
      title: "The Eternal Chase Trilogy",
      subtitle: "A Complete Cosmic Romance Saga",
      books: {
        book1: {
          title: "Book 1: Eternal Chase",
          description: "Where love transcends dimensions and the journey begins",
          chapters: eternalChaseChapters.length,
          duration: "Professional Narration",
          status: "Complete"
        },
        book2: {
          title: "Book 2: Spiral Galaxy War", 
          description: "Love tested across the cosmic expanse of a spiral galaxy",
          chapters: spiralGalaxyChapters.length,
          duration: "Professional Narration", 
          status: "Complete"
        },
        book3: {
          title: "Book 3: Ascension's Edge",
          description: "The final battle for cosmic ascension",
          chapters: ascensionsEdgeChapters.length,
          duration: "Professional Narration",
          status: "Complete"
        },
        book4: {
          title: "Book 4: Infinite Dawn (Preview)",
          description: "What lies beyond ascension - coming soon",
          chapters: infiniteDawnTeasers.length,
          duration: "Exclusive Preview",
          status: "Coming Soon"
        }
      },
      features: {
        professional: "Professional Voice Acting",
        bilingual: "English & Spanish Audio",
        exclusive: "Behind-the-Scenes Content",
        interactive: "Interactive Story Elements"
      },
      upgrade: "Upgrade to Premium",
      listen: "Listen Now",
      preview: "Preview",
      locked: "Premium Only"
    },
    es: {
      title: "La Trilogía Eternal Chase",
      subtitle: "Una Saga Completa de Romance Cósmico", 
      books: {
        book1: {
          title: "Libro 1: Persecución Eterna",
          description: "Donde el amor trasciende dimensiones y comienza el viaje",
          chapters: eternalChaseChapters.length,
          duration: "Narración Profesional",
          status: "Completo"
        },
        book2: {
          title: "Libro 2: Guerra de la Galaxia Espiral",
          description: "Amor puesto a prueba a través de la expansión cósmica de una galaxia espiral", 
          chapters: spiralGalaxyChapters.length,
          duration: "Narración Profesional",
          status: "Completo"
        },
        book3: {
          title: "Libro 3: El Filo de la Ascensión", 
          description: "La batalla final por la ascensión cósmica",
          chapters: ascensionsEdgeChapters.length,
          duration: "Narración Profesional",
          status: "Completo"
        },
        book4: {
          title: "Libro 4: Amanecer Infinito (Adelanto)",
          description: "Lo que yace más allá de la ascensión - próximamente",
          chapters: infiniteDawnTeasers.length,
          duration: "Adelanto Exclusivo",
          status: "Próximamente"
        }
      },
      features: {
        professional: "Actuación de Voz Profesional",
        bilingual: "Audio en Inglés y Español", 
        exclusive: "Contenido Exclusivo",
        interactive: "Elementos Interactivos"
      },
      upgrade: "Actualizar a Premium",
      listen: "Escuchar Ahora", 
      preview: "Vista Previa",
      locked: "Solo Premium"
    }
  };

  const text = content[language];
  
  const trilogyData = {
    book1: {
      id: "eternal-chase",
      cover: eternalChaseCover,
      tracks: getChaptersByBookId('eternal-chase').map((track, index) => ({
        id: track.id,
        title: track.title,
        duration: track.duration,
        free: index === 0, // Only S1E1: Chapter 1: The Signal Calls free
        fileName: track.fileName
      }))
    },
    book2: {
      id: "spiral-galaxy", 
      cover: spiralGalaxyCover,
      tracks: getChaptersByBookId('spiral-galaxy').map((track, index) => ({
        id: track.id,
        title: track.title,
        duration: track.duration,
        free: index === 0, // Only Chapter 1 free for Book 2
        fileName: track.fileName
      }))
    },
    book3: {
      id: "ascensions-edge",
      cover: ascensionsEdgeCover,
      tracks: getChaptersByBookId('ascensions-edge').map((track, index) => ({
        id: track.id,
        title: track.title,
        duration: track.duration,
        free: index === 0, // Only Chapter 1 free
        fileName: track.fileName
      }))
    },
    book4: {
      id: "infinite-dawn",
      cover: infiniteDawnCover,
      tracks: getChaptersByBookId('infinite-dawn').map((track, index) => ({
        id: track.id,
        title: track.title,
        duration: track.duration,
        free: false, // Premium only
        fileName: track.fileName
      }))
    }
  };

  const SeasonCard = ({ bookKey, bookData }: { bookKey: keyof typeof text.books; bookData: any }) => {
    const book = text.books[bookKey];
    const episodes = bookData.tracks;
    const freeEpisodeCount = episodes.filter((e: any) => e.free).length;
    const seasonNumber = bookKey === 'book1' ? 1 : bookKey === 'book2' ? 2 : bookKey === 'book3' ? 3 : 4;
    const isInfiniteDawn = bookKey === 'book4';

    return (
      <Card className="holographic-border bg-gradient-to-br from-space-dark/80 to-cosmic-purple/20 hover:from-space-dark/90 hover:to-cosmic-purple/30 transition-all duration-500">
        <CardHeader className="pb-4">
          <div className="flex gap-6">
            <div className="w-32 h-48 rounded-lg overflow-hidden shadow-2xl relative">
              <img 
                src={bookData.cover}
                alt={book.title}
                className="w-full h-full object-cover"
              />
              <div className={`absolute top-2 left-2 ${isInfiniteDawn ? 'bg-purple-500/90 text-white' : 'bg-cosmic-gold/90 text-space-dark'} px-2 py-1 rounded text-xs font-bold`}>
                {isInfiniteDawn ? 'PREVIEW' : `SEASON ${seasonNumber}`}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Badge className="bg-electric-blue/20 text-bright-blue border-electric-blue/30">
                  Season {seasonNumber}
                </Badge>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  {book.status}
                </Badge>
              </div>
              
              <CardTitle className="text-2xl font-orbitron text-cosmic-gold mb-2">
                {book.title}
              </CardTitle>
              <CardDescription className="text-gray-300 mb-4 text-base">
                {book.description}
              </CardDescription>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-bright-blue font-bold text-lg">{book.chapters}</div>
                  <div className="text-xs text-gray-400">Episodes</div>
                </div>
                <div className="text-center">
                  <div className="text-cosmic-gold font-bold text-lg">{book.duration}</div>
                  <div className="text-xs text-gray-400">Total Runtime</div>
                </div>
                <div className="text-center">
                  <div className="text-green-400 font-bold text-lg">{freeEpisodeCount}</div>
                  <div className="text-xs text-gray-400">Free Episodes</div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={() => setSelectedBook(selectedBook === bookData.id ? null : bookData.id)}
                  className={`${isInfiniteDawn ? 'bg-purple-500/20 hover:bg-purple-500/40 text-purple-400' : 'bg-electric-blue/20 hover:bg-electric-blue/40 text-bright-blue'} border border-current`}
                >
                  {selectedBook === bookData.id ? (
                    <>
                      <ChevronUp className="w-4 h-4 mr-2" />
                      Hide Episodes
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      {isInfiniteDawn ? `Preview Season ${seasonNumber}` : `Watch Season ${seasonNumber}`}
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline"
                  className="border-cosmic-gold/50 text-cosmic-gold hover:bg-cosmic-gold/10"
                >
                  <Book className="w-4 h-4 mr-2" />
                  Season Details
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>

        {selectedBook === bookData.id && (
          <CardContent className="pt-0 border-t border-cosmic-gold/20 animate-in slide-in-from-top-2 duration-300">
            <div className="space-y-3 mt-4">
              {/* Free Special Content for Book 1 */}
              {bookKey === 'book1' && (
                <div className="mb-6">
                  <h4 className="font-semibold text-cosmic-gold mb-3">Free Content:</h4>
                  <div className="space-y-2">
                    {getFreeContentByBookId('eternal-chase').map((track: any) => (
                      <div 
                        key={track.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-cosmic-gold/10 border border-cosmic-gold/30 cursor-pointer hover:bg-cosmic-gold/20 transition-all"
                        onClick={() => {
                          setCurrentTrack(track.id);
                          setCurrentAudioFile(track.fileName);
                          setCurrentAudioTitle(track.title[language]);
                          setAudioPlayerVisible(true);
                          setIsPlaying(true);
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-cosmic-gold/20 flex items-center justify-center">
                            <Star className="w-4 h-4 text-cosmic-gold" />
                          </div>
                          <div>
                            <div className="font-medium text-cosmic-gold">{track.title[language]}</div>
                            <div className="text-sm text-gray-400">{track.description[language]}</div>
                          </div>
                        </div>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          Free
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Special Content for Book 4 - Infinite Dawn Preview */}
              {bookKey === 'book4' && (
                <div className="mb-6">
                  <h4 className="font-semibold text-purple-400 mb-3">Exclusive Preview Content:</h4>
                  <div className="space-y-2">
                    {book.tracks.map((track: any, index: number) => (
                      <div 
                        key={track.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-purple-500/10 border border-purple-500/30 cursor-pointer hover:bg-purple-500/20 transition-all"
                        onClick={() => {
                          setCurrentTrack(track.id);
                          setCurrentAudioFile(track.fileName);
                          setCurrentAudioTitle(track.title[language]);
                          setAudioPlayerVisible(true);
                          setIsPlaying(true);
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                            <Star className="w-4 h-4 text-purple-400" />
                          </div>
                          <div>
                            <div className="font-medium text-purple-400">{track.title[language]}</div>
                            <div className="text-sm text-gray-400">Next saga preview - What lies beyond ascension?</div>
                          </div>
                        </div>
                        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                          Exclusive
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Special Content for Book 3 */}
              {bookKey === 'book3' && (
                <div className="mb-6">
                  <h4 className="font-semibold text-cosmic-gold mb-3">Free Content:</h4>
                  <div className="space-y-2">
                    {getFreeContentByBookId('ascensions-edge').map((track: any) => (
                      <div 
                        key={track.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-cosmic-gold/10 border border-cosmic-gold/30 cursor-pointer hover:bg-cosmic-gold/20 transition-all"
                        onClick={() => {
                          setCurrentTrack(track.id);
                          setCurrentAudioFile(track.fileName);
                          setCurrentAudioTitle(track.title[language]);
                          setAudioPlayerVisible(true);
                          setIsPlaying(true);
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-cosmic-gold/20 flex items-center justify-center">
                            <Star className="w-4 h-4 text-cosmic-gold" />
                          </div>
                          <div>
                            <div className="font-medium text-cosmic-gold">{track.title[language]}</div>
                            <div className="text-sm text-gray-400">{track.description[language]}</div>
                          </div>
                        </div>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          Free
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Special Content for Book 2 */}
              {bookKey === 'book2' && (
                <div className="mb-6">
                  <h4 className="font-semibold text-cosmic-gold mb-3">Special Content:</h4>
                  <div className="space-y-2">
                    {getFreeContentByBookId('spiral-galaxy').map((track: any) => (
                      <div 
                        key={track.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-cosmic-gold/10 border border-cosmic-gold/30 cursor-pointer hover:bg-cosmic-gold/20 transition-all"
                        onClick={() => {
                          setCurrentTrack(track.id);
                          setCurrentAudioFile(track.fileName);
                          setCurrentAudioTitle(track.title[language]);
                          setAudioPlayerVisible(true);
                          setIsPlaying(true);
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-cosmic-gold/20 flex items-center justify-center">
                            <Star className="w-4 h-4 text-cosmic-gold" />
                          </div>
                          <div>
                            <div className="font-medium text-cosmic-gold">{track.title[language]}</div>
                            <div className="text-sm text-gray-400">{track.description[language]}</div>
                          </div>
                        </div>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          Free
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-bright-blue">Season {seasonNumber} Episodes:</h4>
                <Badge className="bg-space-dark/50 text-gray-300">
                  {episodes.length} Episodes • {book.duration}
                </Badge>
              </div>
              {episodes.map((episode: any, index: number) => (
                <div 
                  key={episode.id}
                  className={`flex items-center justify-between p-4 rounded-lg transition-all duration-300 border-l-4 ${
                    !episode.free && !hasAccess 
                      ? 'bg-gray-800/50 opacity-60 border-l-gray-600' 
                      : 'bg-space-dark/50 hover:bg-electric-blue/10 cursor-pointer border-l-cosmic-gold'
                  }`}
                  onClick={() => {
                    if (episode.free || hasAccess) {
                      setCurrentTrack(episode.id);
                      setCurrentAudioFile(episode.fileName);
                      setCurrentAudioTitle(episode.title[language]);
                      setAudioPlayerVisible(true);
                      setIsPlaying(true);
                    } else {
                      setShowUpgrade(true);
                    }
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-cosmic-gold/20 flex items-center justify-center text-cosmic-gold font-bold">
                      S{seasonNumber}E{index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-white text-lg">{episode.title[language]}</div>
                      <div className="text-sm text-gray-400 flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {episode.duration}
                        {episode.free && <span className="text-green-400">• Free Episode</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!episode.free && !hasAccess ? (
                      <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                        <Crown className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                    ) : (
                      <Button 
                        size="sm" 
                        className="bg-cosmic-gold/20 hover:bg-cosmic-gold/40 text-cosmic-gold"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentTrack(episode.id);
                          setCurrentAudioFile(episode.fileName);
                          setCurrentAudioTitle(episode.title[language]);
                          setAudioPlayerVisible(true);
                          setIsPlaying(true);
                        }}
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Play
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-space-dark via-deep-purple/10 to-cosmic-purple/5 py-20 px-4">
      <StarfieldBackground />
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Back to Main Page Button */}
        <div className="mb-8">
          <a 
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-space-dark/50 hover:bg-space-dark/70 text-bright-blue border border-electric-blue/30 rounded-lg transition-all duration-300 hover:border-electric-blue/50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {language === 'en' ? 'Back to Main Portal' : 'Volver al Portal Principal'}
          </a>
        </div>
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-7xl font-orbitron font-black mb-6 bg-gradient-to-r from-cosmic-gold via-bright-gold to-electric-blue bg-clip-text text-transparent">
            {text.title}
          </h1>
          <p className="text-xl text-bright-blue max-w-3xl mx-auto mb-8">
            {text.subtitle}
          </p>
          
          {/* Complete Audiobook Trilogy Hero Image */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="relative rounded-2xl overflow-hidden holographic-border">
              <img 
                src={trilogyImage} 
                alt="The Eternal Chase: Complete Audiobook Trilogy" 
                className="w-full h-auto object-cover object-top"
                style={{ height: '400px' }}
              />

            </div>
          </div>
          
          {/* Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
            <div className="bg-space-dark/50 rounded-lg p-4 border border-electric-blue/20">
              <Users className="w-6 h-6 text-electric-blue mx-auto mb-2" />
              <div className="text-sm text-gray-300">{text.features.professional}</div>
            </div>
            <div className="bg-space-dark/50 rounded-lg p-4 border border-cosmic-gold/20">
              <Book className="w-6 h-6 text-cosmic-gold mx-auto mb-2" />
              <div className="text-sm text-gray-300">{text.features.bilingual}</div>
            </div>
            <div className="bg-space-dark/50 rounded-lg p-4 border border-purple-400/20">
              <Crown className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <div className="text-sm text-gray-300">{text.features.exclusive}</div>
            </div>
            <div className="bg-space-dark/50 rounded-lg p-4 border border-green-400/20">
              <Star className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <div className="text-sm text-gray-300">{text.features.interactive}</div>
            </div>
          </div>
        </div>

        {/* Seasons */}
        <div className="space-y-8">
          <SeasonCard bookKey="book1" bookData={trilogyData.book1} />
          <SeasonCard bookKey="book2" bookData={trilogyData.book2} />
          <SeasonCard bookKey="book3" bookData={trilogyData.book3} />
          
          {/* Book 4: Infinite Dawn Preview - Premium Only */}
          {hasAccess && (
            <SeasonCard bookKey="book4" bookData={trilogyData.book4} />
          )}
        </div>

        {/* Premium CTA */}
        {!hasAccess && (
          <div className="mt-16 text-center">
            <Card className="holographic-border bg-gradient-to-br from-purple-900/50 to-blue-900/50 max-w-2xl mx-auto">
              <CardContent className="p-8">
                <Crown className="w-12 h-12 text-cosmic-gold mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-cosmic-gold mb-4">Unlock All 3 Seasons</h3>
                <p className="text-gray-300 mb-6">
                  Stream all {eternalChaseChapters.length + spiralGalaxyChapters.length + aiyannaChapters.length} authentic episodes, behind-the-scenes content, and exclusive director's commentary
                </p>
                <Button 
                  onClick={() => setShowUpgrade(true)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3"
                >
                  {text.upgrade} - $9.99/month
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <UpgradeModal 
        isOpen={showUpgrade}
        onClose={() => setShowUpgrade(false)}
      />

      {/* Audio Player */}
      {audioPlayerVisible && (
        <AudioPlayer
          title={currentAudioTitle}
          audioFile={currentAudioFile}
          isVisible={audioPlayerVisible}
          onClose={() => {
            setAudioPlayerVisible(false);
            setIsPlaying(false);
          }}
        />
      )}
      
      {/* Ambient Sound Controller */}
      <AmbientSoundController />
    </div>
  );
}