import { useState } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/use-language';
import { audiobookTracks, type AudioTrack } from '@/lib/audiobook-data';

export default function OrganizedAudiobooks() {
  const { language } = useLanguage();
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [audioElements, setAudioElements] = useState<Map<string, HTMLAudioElement>>(new Map());

  // Organize audiobooks by book - Main Eternal Chase trilogy for adult audience
  const organizedBooks = [
    {
      id: 'eternal-chase',
      title: { en: 'Book 1: The Pursuit for Love', es: 'Libro 1: La Búsqueda del Amor' },
      description: { 
        en: 'The original cosmic love story where love transcends dimensions',
        es: 'La historia de amor cósmica original donde el amor trasciende dimensiones'
      },
      color: 'cosmic-gold',
      chapters: audiobookTracks.filter((book: AudioTrack) => book.bookId === 'eternal-chase')
    },
    {
      id: 'spiral-galaxy',
      title: { en: 'Book 2: Spiral Galaxy War', es: 'Libro 2: Guerra de la Galaxia Espiral' },
      description: { 
        en: 'The cosmic war that threatens all existence across the galaxy',
        es: 'La guerra cósmica que amenaza toda existencia a través de la galaxia'
      },
      color: 'electric-blue',
      chapters: audiobookTracks.filter((book: AudioTrack) => book.bookId === 'spiral-galaxy')
    },
    {
      id: 'ascensions-edge',
      title: { en: 'Book 3: Ascension\'s Edge', es: 'Libro 3: El Filo de la Ascensión' },
      description: { 
        en: 'The final battle for cosmic ascension and ultimate transformation',
        es: 'La batalla final por la ascensión cósmica y la transformación definitiva'
      },
      color: 'purple-400',
      chapters: audiobookTracks.filter((book: AudioTrack) => book.bookId === 'ascensions-edge')
    }
  ];

  const playAudio = async (chapterId: string, audioSrc: string) => {
    // Stop currently playing audio
    if (currentlyPlaying && audioElements.has(currentlyPlaying)) {
      const currentAudio = audioElements.get(currentlyPlaying);
      currentAudio?.pause();
    }

    if (currentlyPlaying === chapterId) {
      setCurrentlyPlaying(null);
      return;
    }

    // Create or get audio element
    let audio = audioElements.get(chapterId);
    if (!audio) {
      audio = new Audio(audioSrc.replace('@assets/', '/attached_assets/'));
      audio.addEventListener('ended', () => setCurrentlyPlaying(null));
      audio.addEventListener('error', (e) => {
        console.error('Audio loading error:', { src: audio?.src, error: e, networkState: audio?.networkState, readyState: audio?.readyState });
        setCurrentlyPlaying(null);
      });
      setAudioElements(prev => new Map(prev).set(chapterId, audio!));
    }

    try {
      await audio.play();
      setCurrentlyPlaying(chapterId);
    } catch (error) {
      console.error('Audio playback error:', error);
      setCurrentlyPlaying(null);
    }
  };

  const sortChapters = (chapters: AudioTrack[], bookId: string) => {
    // Get all related content including prologues for this book
    let allChapters = [...chapters];
    
    // Add prologues that belong to this book
    const relatedPrologues = audiobookTracks.filter(track => 
      track.type === 'prologue' && track.bookId === bookId
    );
    
    // Only add prologues that aren't already in the chapters list
    const existingIds = new Set(allChapters.map(ch => ch.id));
    const uniquePrologues = relatedPrologues.filter(p => !existingIds.has(p.id));
    allChapters = [...allChapters, ...uniquePrologues];
    
    return allChapters.sort((a, b) => {
      // Prologues first
      if (a.type === 'prologue' && b.type !== 'prologue') return -1;
      if (b.type === 'prologue' && a.type !== 'prologue') return 1;
      
      // Then chapters by number
      if (a.type === 'chapter' && b.type === 'chapter') {
        return (a.chapterNumber || 0) - (b.chapterNumber || 0);
      }
      
      // Epilogues last
      if (a.type === 'epilogue' && b.type !== 'epilogue') return 1;
      if (b.type === 'epilogue' && a.type !== 'epilogue') return -1;
      
      return 0;
    });
  };

  return (
    <div className="space-y-12">
      {organizedBooks.map((book, bookIndex) => (
        <div key={book.id} className="cosmic-fade-in" style={{ animationDelay: `${bookIndex * 0.2}s` }}>
          <Card className={`bg-space-dark/60 border-2 border-${book.color}/30 hover:border-${book.color}/60 transition-all duration-500`}>
            <CardContent className="p-8">
              {/* Book Header */}
              <div className="text-center mb-8">
                <h3 className={`font-orbitron text-2xl md:text-3xl font-bold mb-4 text-${book.color}`}>
                  {book.title[language]}
                </h3>
                <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                  {book.description[language]}
                </p>
                <Badge variant="outline" className={`mt-4 border-${book.color} text-${book.color}`}>
                  {sortChapters(book.chapters, book.id).length} {language === 'en' ? 'Chapters' : 'Capítulos'}
                </Badge>
              </div>

              {/* Chapters Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortChapters(book.chapters, book.id).map((chapter, index) => (
                  <Card key={chapter.id} className="bg-space-navy/50 border border-gray-600/30 hover:border-gray-400/50 transition-all duration-300">
                    <CardContent className="p-6">
                      {/* Chapter Type Badge */}
                      <div className="flex justify-between items-start mb-4">
                        <Badge 
                          variant={chapter.type === 'prologue' ? 'default' : chapter.type === 'epilogue' ? 'secondary' : 'outline'}
                          className="text-xs"
                        >
                          {chapter.type === 'prologue' ? (language === 'en' ? 'Prologue' : 'Prólogo') :
                           chapter.type === 'epilogue' ? (language === 'en' ? 'Epilogue' : 'Epílogo') :
                           `${language === 'en' ? 'Chapter' : 'Capítulo'} ${chapter.chapterNumber}`}
                        </Badge>
                        <span className="text-xs text-gray-400">{chapter.duration}</span>
                      </div>

                      {/* Chapter Title */}
                      <h4 className="font-semibold text-white mb-3 text-sm leading-relaxed">
                        {chapter.title[language]}
                      </h4>

                      {/* Chapter Description */}
                      <p className="text-gray-400 text-xs mb-4 line-clamp-3">
                        {chapter.description[language]}
                      </p>

                      {/* Play Button */}
                      <Button
                        onClick={() => playAudio(chapter.id, chapter.fileName)}
                        variant={currentlyPlaying === chapter.id ? "default" : "outline"}
                        size="sm"
                        className="w-full"
                      >
                        {currentlyPlaying === chapter.id ? (
                          <>
                            <Pause className="w-4 h-4 mr-2" />
                            {language === 'en' ? 'Playing...' : 'Reproduciendo...'}
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            {language === 'en' ? 'Play Chapter' : 'Reproducir Capítulo'}
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}