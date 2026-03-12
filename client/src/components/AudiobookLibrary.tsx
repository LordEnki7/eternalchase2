import { useState } from 'react';
import { Play, Headphones, Clock, Book } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { useSubscription } from '@/hooks/useSubscription';
import { useContentAccess } from '@/hooks/useContentAccess';
import { FreeContentBanner } from '@/components/FreeContentBanner';
import { UpgradeModal } from '@/components/UpgradeModal';
import { audiobookTracks, getTracksByType, getChaptersByBookId, getSpecialContentByBookId, type AudioTrack } from '@/lib/audiobook-data';
import AudioPlayer from './AudioPlayer';
import ProgressTracker from './ProgressTracker';
import AchievementNotification from './AchievementNotification';
import { Button } from '@/components/ui/button';

export default function AudiobookLibrary() {
  const { language } = useLanguage();
  const { hasAccess, hasPremiumAccess } = useSubscription();
  const { canAccessChapter } = useContentAccess();
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState<string | null>(null);

  const introTracks = getTracksByType('intro');
  const prologueTracks = getTracksByType('prologue');
  const fullBookTracks = getTracksByType('full-book');
  const book1Chapters = getChaptersByBookId('pursuit-for-love');
  const book2Chapters = getChaptersByBookId('spiral-war');
  const book2SpecialContent = getSpecialContentByBookId('spiral-war');
  const book3Chapters = getChaptersByBookId('ascensions-edge');
  const book3SpecialContent = getSpecialContentByBookId('ascensions-edge');
  const teaserTracks = getTracksByType('teaser');
  const spanishBook1Tracks = getChaptersByBookId('pursuit-for-love-spanish');
  const spanishBook2Tracks = getChaptersByBookId('spiral-war-spanish');
  const spanishBook3Tracks = getChaptersByBookId('ascensions-edge-spanish');
  const spanishBook3Special = getSpecialContentByBookId('ascensions-edge-spanish');
  const spanishTeaserTracks = getChaptersByBookId('infinite-dawn-spanish');
  const aiyannaStories = getChaptersByBookId('aiyanna-stories');
  const aiyannaBook2 = getChaptersByBookId('aiyanna-book2');
  const aiyannaBook3 = getChaptersByBookId('aiyanna-book3');

  const content = {
    en: {
      title: "AUDIOBOOK LIBRARY",
      subtitle: "Immerse yourself in the cosmic soundscape",
      intro: "Series Introduction",
      prologue: "Prologue",
      book1Chapters: "Book 1: Chapters",
      book2Chapters: "Book 2: The Spiral War Chapters",
      book2Special: "Book 2: Special Content & Epilogue",
      book3Chapters: "Book 3: Ascension's Edge Chapters",
      book3Special: "Book 3: Epilogue & Special Content",
      nextSaga: "Next Saga: Infinite Dawn Teaser",
      spanishBook1: "Spanish Book 1: Eternal Chase",
      spanishBook2: "Spanish Book 2: The Spiral War",
      spanishBook3: "Spanish Book 3: Ascension's Edge",
      spanishBook3Special: "Spanish Book 3: Epilogue & Special Content",
      spanishNextSaga: "Spanish Next Saga: Infinite Dawn Teaser",
      aiyannaStories: "Book 1: Aiyanna Tragedy The Fall Of Kairon",
      aiyannaBook2: "Book 2: Aiyanna Architects of Resonance The Fractured Song",
      aiyannaBook3: "Book 3: Architects of Resonance The Whispers of a New World",
      fullBooks: "Complete Audiobooks",
      play: "Play",
      duration: "Duration",
      premium: "Premium Content",
      unlock: "Subscribe to Unlock"
    },
    es: {
      title: "BIBLIOTECA DE AUDIOLIBROS",
      subtitle: "Sumérgete en el paisaje sonoro cósmico",
      intro: "Introducción de la Serie",
      prologue: "Prólogo",
      book1Chapters: "Libro 1: Capítulos",
      book2Chapters: "Libro 2: Capítulos de la Guerra Espiral",
      book2Special: "Libro 2: Contenido Especial y Epílogo",
      book3Chapters: "Libro 3: Capítulos del Filo de la Ascensión",
      book3Special: "Libro 3: Epílogo y Contenido Especial",
      nextSaga: "Próxima Saga: Adelanto del Amanecer Infinito",
      spanishBook1: "Español Libro 1: Persecución Eterna",
      spanishBook2: "Español Libro 2: La Guerra Espiral",
      spanishBook3: "Español Libro 3: El Filo de la Ascensión",
      spanishBook3Special: "Español Libro 3: Epílogo y Contenido Especial",
      spanishNextSaga: "Español Próxima Saga: Adelanto del Amanecer Infinito",
      aiyannaStories: "Libro 1: Aiyanna Tragedia La Caída De Kairon",
      aiyannaBook2: "Libro 2: Aiyanna Arquitectos de Resonancia La Canción Fracturada",
      aiyannaBook3: "Libro 3: Arquitectos de Resonancia Los Susurros de un Nuevo Mundo",
      fullBooks: "Audiolibros Completos",
      play: "Reproducir",
      duration: "Duración",
      premium: "Contenido Premium",
      unlock: "Suscríbete para Desbloquear"
    }
  };

  const text = content[language];

  const playTrack = (track: AudioTrack) => {
    setCurrentTrack(track);
    setIsPlayerVisible(true);
  };

  const handleAchievementUnlocked = (achievement: string) => {
    setCurrentAchievement(achievement);
  };

  const TrackCard = ({ track, chapterNumber = 1, bookId = 'book-1', isPremium = false }: { track: AudioTrack; chapterNumber?: number; bookId?: string; isPremium?: boolean }) => {
    const canPlay = !isPremium || hasPremiumAccess || canAccessChapter(bookId, chapterNumber);

    return (
      <div className={`holographic-border bg-space-dark/50 rounded-lg p-6 ${canPlay ? 'hover:bg-space-dark/70' : 'opacity-60'} transition-all duration-300`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-orbitron text-lg font-bold text-cosmic-gold mb-2">
              {track.title[language]}
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              {track.description[language]}
            </p>
          </div>
          
          <div className="ml-4 flex-shrink-0">
            {track.type === 'intro' && <Book className="w-6 h-6 text-bright-blue" />}
            {track.type === 'prologue' && <Clock className="w-6 h-6 text-cosmic-purple" />}
            {track.type === 'full-book' && <Headphones className="w-6 h-6 text-cosmic-gold" />}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {track.duration && (
              <span className="text-sm text-gray-400">
                {text.duration}: {track.duration}
              </span>
            )}
            {isPremium && !hasPremiumAccess && (
              <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
                {text.premium}
              </span>
            )}
          </div>

          <Button
            onClick={() => canPlay ? playTrack(track) : null}
            disabled={!canPlay}
            variant={canPlay ? "default" : "secondary"}
            size="sm"
            className={`
              ${canPlay 
                ? 'bg-electric-blue/20 hover:bg-electric-blue/40 text-bright-blue' 
                : 'bg-gray-600/20 text-gray-500 cursor-not-allowed'
              }
              border border-current transition-all duration-300
            `}
          >
            <Play className="w-4 h-4 mr-2" />
            {canPlay ? text.play : text.unlock}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-orbitron text-4xl md:text-5xl font-bold text-cosmic-gold mb-4">
            {text.title}
          </h2>
          <p className="text-lg text-bright-blue max-w-2xl mx-auto">
            {text.subtitle}
          </p>
        </div>

        {/* Progress Tracker */}
        <ProgressTracker 
          currentChapter={currentTrack?.id}
          bookId={currentTrack?.bookId}
          onAchievementUnlocked={handleAchievementUnlocked}
        />

        {/* Introduction Tracks */}
        {introTracks.length > 0 && (
          <div className="mb-12">
            <h3 className="font-orbitron text-2xl font-bold text-bright-gold mb-6">
              <Book className="inline-block w-6 h-6 mr-2" />
              {text.intro}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {introTracks.map(track => (
                <TrackCard key={track.id} track={track} />
              ))}
            </div>
          </div>
        )}

        {/* Prologue Tracks */}
        {prologueTracks.length > 0 && (
          <div className="mb-12">
            <h3 className="font-orbitron text-2xl font-bold text-bright-gold mb-6">
              <Clock className="inline-block w-6 h-6 mr-2" />
              {text.prologue}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {prologueTracks.map(track => (
                <TrackCard key={track.id} track={track} />
              ))}
            </div>
          </div>
        )}

        {/* Book 1 Chapter Tracks - First 3 Free */}
        {book1Chapters.length > 0 && (
          <div className="mb-12">
            <h3 className="font-orbitron text-2xl font-bold text-bright-gold mb-6">
              <Book className="inline-block w-6 h-6 mr-2" />
              {text.book1Chapters}
            </h3>
            {!hasPremiumAccess && (
              <FreeContentBanner 
                bookId="book-1" 
                chapterNumber={4} 
                contentType="audiobook"
                onUpgrade={() => setShowUpgradeModal(true)}
              />
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {book1Chapters.map((track, index) => {
                const chapterNumber = index + 1;
                const isFree = chapterNumber <= 3; // First 3 chapters free
                return (
                  <TrackCard 
                    key={track.id} 
                    track={track} 
                    chapterNumber={chapterNumber}
                    bookId="book-1"
                    isPremium={!isFree} 
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Book 2 Chapter Tracks - Premium Only */}
        {book2Chapters.length > 0 && (
          <div className="mb-12">
            <h3 className="font-orbitron text-2xl font-bold text-bright-gold mb-6">
              <Book className="inline-block w-6 h-6 mr-2" />
              {text.book2Chapters}
            </h3>
            {!hasPremiumAccess && (
              <FreeContentBanner 
                bookId="book-2" 
                chapterNumber={1} 
                contentType="audiobook"
                onUpgrade={() => setShowUpgradeModal(true)}
              />
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {book2Chapters.map((track, index) => (
                <TrackCard 
                  key={track.id} 
                  track={track} 
                  chapterNumber={index + 1}
                  bookId="book-2"
                  isPremium={true} 
                />
              ))}
            </div>
          </div>
        )}

        {/* Book 2 Special Content */}
        {book2SpecialContent.length > 0 && (
          <div className="mb-12">
            <h3 className="font-orbitron text-2xl font-bold text-bright-gold mb-6">
              <Book className="inline-block w-6 h-6 mr-2" />
              {text.book2Special}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {book2SpecialContent.map((track: AudioTrack) => (
                <TrackCard key={track.id} track={track} isPremium={true} />
              ))}
            </div>
          </div>
        )}

        {/* Book 3 Chapter Tracks */}
        {book3Chapters.length > 0 && (
          <div className="mb-12">
            <h3 className="font-orbitron text-2xl font-bold text-bright-gold mb-6">
              <Book className="inline-block w-6 h-6 mr-2" />
              {text.book3Chapters}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {book3Chapters.map((track: AudioTrack) => (
                <TrackCard key={track.id} track={track} isPremium={true} />
              ))}
            </div>
          </div>
        )}

        {/* Book 3 Special Content */}
        {book3SpecialContent.length > 0 && (
          <div className="mb-12">
            <h3 className="font-orbitron text-2xl font-bold text-bright-gold mb-6">
              <Book className="inline-block w-6 h-6 mr-2" />
              {text.book3Special}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {book3SpecialContent.map((track: AudioTrack) => (
                <TrackCard key={track.id} track={track} isPremium={true} />
              ))}
            </div>
          </div>
        )}

        {/* Next Saga Teaser */}
        {teaserTracks.length > 0 && (
          <div className="mb-12">
            <h3 className="font-orbitron text-2xl font-bold text-cosmic-purple mb-6">
              <Book className="inline-block w-6 h-6 mr-2" />
              {text.nextSaga}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {teaserTracks.map((track: AudioTrack) => (
                <TrackCard key={track.id} track={track} isPremium={true} />
              ))}
            </div>
          </div>
        )}

        {/* Spanish Book 1 */}
        {spanishBook1Tracks.length > 0 && (
          <div className="mb-12">
            <h3 className="font-orbitron text-2xl font-bold text-amber-400 mb-6">
              <Book className="inline-block w-6 h-6 mr-2" />
              {text.spanishBook1}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {spanishBook1Tracks.map((track: AudioTrack) => (
                <TrackCard key={track.id} track={track} isPremium={true} />
              ))}
            </div>
          </div>
        )}

        {/* Spanish Book 2 */}
        {spanishBook2Tracks.length > 0 && (
          <div className="mb-12">
            <h3 className="font-orbitron text-2xl font-bold text-amber-400 mb-6">
              <Book className="inline-block w-6 h-6 mr-2" />
              {text.spanishBook2}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {spanishBook2Tracks.map((track: AudioTrack) => (
                <TrackCard key={track.id} track={track} isPremium={true} />
              ))}
            </div>
          </div>
        )}

        {/* Spanish Book 3 */}
        {spanishBook3Tracks.length > 0 && (
          <div className="mb-12">
            <h3 className="font-orbitron text-2xl font-bold text-amber-400 mb-6">
              <Book className="inline-block w-6 h-6 mr-2" />
              {text.spanishBook3}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {spanishBook3Tracks.map((track: AudioTrack) => (
                <TrackCard key={track.id} track={track} isPremium={true} />
              ))}
            </div>
          </div>
        )}

        {/* Spanish Book 3 Special Content */}
        {spanishBook3Special.length > 0 && (
          <div className="mb-12">
            <h3 className="font-orbitron text-2xl font-bold text-amber-400 mb-6">
              <Book className="inline-block w-6 h-6 mr-2" />
              {text.spanishBook3Special}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {spanishBook3Special.map((track: AudioTrack) => (
                <TrackCard key={track.id} track={track} isPremium={true} />
              ))}
            </div>
          </div>
        )}

        {/* Spanish Next Saga Teaser */}
        {spanishTeaserTracks.length > 0 && (
          <div className="mb-12">
            <h3 className="font-orbitron text-2xl font-bold text-amber-400 mb-6">
              <Book className="inline-block w-6 h-6 mr-2" />
              {text.spanishNextSaga}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {spanishTeaserTracks.map((track: AudioTrack) => (
                <TrackCard key={track.id} track={track} isPremium={true} />
              ))}
            </div>
          </div>
        )}

        {/* Full Books */}
        {fullBookTracks.length > 0 && (
          <div className="mb-12">
            <h3 className="font-orbitron text-2xl font-bold text-bright-gold mb-6">
              <Headphones className="inline-block w-6 h-6 mr-2" />
              {text.fullBooks}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fullBookTracks.map(track => (
                <TrackCard key={track.id} track={track} isPremium={true} />
              ))}
            </div>
          </div>
        )}

        {/* Young Adult: Aiyanna's Stories - Book 1 */}
        {aiyannaStories.length > 0 && (
          <div className="mb-12">
            <h3 className="font-orbitron text-2xl font-bold text-purple-400 mb-6">
              <Book className="inline-block w-6 h-6 mr-2" />
              {text.aiyannaStories}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {aiyannaStories.map((track: AudioTrack) => (
                <TrackCard key={track.id} track={track} isPremium={true} />
              ))}
            </div>
          </div>
        )}

        {/* Young Adult: Aiyanna Book 2 - Architects of Resonance */}
        {aiyannaBook2.length > 0 && (
          <div className="mb-12">
            <h3 className="font-orbitron text-2xl font-bold text-amber-400 mb-6">
              <Book className="inline-block w-6 h-6 mr-2" />
              {text.aiyannaBook2}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {aiyannaBook2.map((track: AudioTrack) => (
                <TrackCard key={track.id} track={track} isPremium={true} />
              ))}
            </div>
          </div>
        )}

        {/* Young Adult: Aiyanna Book 3 - The Final Journey */}
        {aiyannaBook3.length > 0 && (
          <div className="mb-12">
            <h3 className="font-orbitron text-2xl font-bold text-cyan-400 mb-6">
              <Book className="inline-block w-6 h-6 mr-2" />
              {text.aiyannaBook3}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {aiyannaBook3.map((track: AudioTrack) => (
                <TrackCard key={track.id} track={track} isPremium={true} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Audio Player */}
      <AudioPlayer
        title={currentTrack?.title[language]}
        isVisible={isPlayerVisible}
        onClose={() => setIsPlayerVisible(false)}
        audioFile={currentTrack?.fileName}
        trackId={currentTrack?.id}
      />

      {/* Upgrade Modal */}
      <UpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)} 
      />
      
      {/* Achievement Notification */}
      <AchievementNotification
        achievement={currentAchievement}
        onClose={() => setCurrentAchievement(null)}
      />
    </section>
  );
}