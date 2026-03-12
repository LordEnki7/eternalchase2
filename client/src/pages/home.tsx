import { useState } from "react";
import { useLocation } from "wouter";
import StarfieldBackground from "@/components/starfield-background";
const galaxyVideo = '/media/galaxy-background.mp4';
const eternalChaseCover = '/media/book-covers/eternal-chase-cover-alt.jpg';
const spiralGalaxyCover = '/media/book-covers/spiral-galaxy-book-cover.png';
const ascensionsEdgeCover = '/media/book-covers/eternal-chase-ascensions-edge.png';
const aiyannaChroniclesImage = '/media/book-covers/aiyanna-chronicles-main.png';
import CosmicNavigation from "@/components/cosmic-navigation";
import HeroSection from "@/components/hero-section";
import TrilogyShowcase from "@/components/trilogy-showcase";
import EnhancedChapterAccess from "@/components/EnhancedChapterAccess";
import { audiobookTracks, type AudioTrack } from "@/lib/audiobook-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CharacterGallery from "@/components/character-gallery";
import LoreVault from "@/components/lore-vault";
import UniverseLore from "@/components/UniverseLore";
// Removed PageTransition to prevent darkening transitions
import CosmicShop from "@/components/cosmic-shop";
import ContactSection from "@/components/contact-section";
import { SubscriptionModal } from "@/components/SubscriptionModal";
import InteractiveStarMap from "@/components/InteractiveStarMap";
import { StarMapTooltips } from "@/components/StarMapTooltips";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { Button } from "@/components/ui/button";
import { Crown, LogOut, Settings, ShoppingBag, Users, Languages, Heart, Play, BookOpen, Star } from "lucide-react";
import UserJourneyTracker from '@/components/UserJourneyTracker';
import VoiceOverToggle from '@/components/VoiceOverToggle';
import PerformanceMonitor from '@/components/PerformanceMonitor';
import AmbientSoundController from '@/components/AmbientSoundController';

export default function Home() {
  const { language, toggleLanguage } = useLanguage();
  const { user } = useAuth();
  const { hasAccess, isActive, subscriptionStatus } = useSubscription();
  const [showSubscription, setShowSubscription] = useState(false);
  const [, navigate] = useLocation();
  const [currentlyPlaying, setCurrentlyPlaying] = useState<HTMLAudioElement | null>(null);
  const [currentChapterId, setCurrentChapterId] = useState<string | null>(null);

  // Type guard for user properties
  const userProfile = user as any;

  // Organize audiobook data for Enhanced Chapter Access
  const organizedBooks = [
    {
      id: 'eternal-chase',
      title: { en: 'Book 1: The Pursuit for Love', es: 'Libro 1: La Búsqueda del Amor' },
      subtitle: { 
        en: 'The original cosmic love story where love transcends dimensions',
        es: 'La historia de amor cósmica original donde el amor trasciende dimensiones'
      },
      coverImage: eternalChaseCover,
      totalChapters: audiobookTracks.filter((track: AudioTrack) => track.bookId === 'eternal-chase').length,
      totalDuration: '1h 15m',
      color: 'cosmic-gold',
      chapters: audiobookTracks.filter((track: AudioTrack) => track.bookId === 'eternal-chase').map(track => ({
        id: track.id,
        title: track.title,
        duration: track.duration || '45:30',
        fileName: track.fileName,
        description: { 
          en: 'Experience this pivotal chapter in the cosmic love story',
          es: 'Experimenta este capítulo crucial en la historia de amor cósmico'
        }
      }))
    },
    {
      id: 'spiral-galaxy',
      title: { en: 'Book 2: Spiral Galaxy War', es: 'Libro 2: Guerra de la Galaxia Espiral' },
      subtitle: { 
        en: 'The cosmic war that threatens all existence across the galaxy',
        es: 'La guerra cósmica que amenaza toda existencia a través de la galaxia'
      },
      coverImage: spiralGalaxyCover,
      totalChapters: audiobookTracks.filter((track: AudioTrack) => track.bookId === 'spiral-galaxy').length,
      totalDuration: '52m',
      color: 'electric-blue',
      chapters: audiobookTracks.filter((track: AudioTrack) => track.bookId === 'spiral-galaxy').map(track => ({
        id: track.id,
        title: track.title,
        duration: track.duration || '52:15',
        fileName: track.fileName,
        description: { 
          en: 'Dive deeper into the galactic conflict and cosmic romance',
          es: 'Sumérgete más profundamente en el conflicto galáctico y el romance cósmico'
        }
      }))
    },
    {
      id: 'ascensions-edge',
      title: { en: 'Book 3: Ascension\'s Edge', es: 'Libro 3: El Filo de la Ascensión' },
      subtitle: { 
        en: 'The final battle for cosmic ascension and ultimate transformation',
        es: 'La batalla final por la ascensión cósmica y la transformación definitiva'
      },
      coverImage: ascensionsEdgeCover,
      totalChapters: audiobookTracks.filter((track: AudioTrack) => track.bookId === 'ascensions-edge').length,
      totalDuration: '44m',
      color: 'purple-400',
      chapters: audiobookTracks.filter((track: AudioTrack) => track.bookId === 'ascensions-edge').map(track => ({
        id: track.id,
        title: track.title,
        duration: track.duration || '48:45',
        fileName: track.fileName,
        description: { 
          en: 'Witness the epic conclusion where love transcends all boundaries',
          es: 'Sé testigo de la conclusión épica donde el amor trasciende todos los límites'
        }
      }))
    }
  ];

  const handleStopAudio = () => {
    if (currentlyPlaying) {
      currentlyPlaying.pause();
      currentlyPlaying.currentTime = 0;
      currentlyPlaying.remove(); // Ensure complete cleanup
      setCurrentlyPlaying(null);
      setCurrentChapterId(null);
      console.log('Audio stopped and cleaned up');
      
      // Resume theme music when manually stopped
      const themeAudioElement = document.querySelector('#theme-audio') as HTMLAudioElement;
      if (themeAudioElement) {
        themeAudioElement.play().catch(e => console.log('Theme resume failed:', e));
      }
    }
    
    // Backup: Stop any other playing audio elements
    const allAudioElements = document.querySelectorAll('audio:not(#theme-audio)');
    allAudioElements.forEach(audioEl => {
      const audioElement = audioEl as HTMLAudioElement;
      if (!audioElement.paused) {
        audioElement.pause();
        audioElement.currentTime = 0;
        console.log('Stopped orphaned audio element');
      }
    });
  };

  const handlePlayChapter = (chapter: any) => {
    console.log('Playing chapter:', chapter);
    
    // If the same chapter is clicked while playing, stop it
    if (currentChapterId === chapter.id && currentlyPlaying) {
      handleStopAudio();
      return;
    }
    
    // Stop theme music when audiobook starts
    const themeAudioElement = document.querySelector('#theme-audio') as HTMLAudioElement;
    if (themeAudioElement) {
      themeAudioElement.pause();
    }
    
    // Create audio element to play the chapter
    const audioSrc = chapter.fileName.replace('@assets/', '/attached_assets/');
    console.log('Attempting to play audio from:', audioSrc);
    
    const audio = new Audio(audioSrc);
    
    // CRITICAL: Stop any currently playing audio first (prevents multiple simultaneous playback)
    if (currentlyPlaying) {
      currentlyPlaying.pause();
      currentlyPlaying.currentTime = 0;
      currentlyPlaying.remove(); // Remove from DOM to ensure cleanup
    }
    
    // Also ensure no other audio elements are playing (backup check)
    const allAudioElements = document.querySelectorAll('audio');
    allAudioElements.forEach(audioEl => {
      const audioElement = audioEl as HTMLAudioElement;
      if (!audioElement.paused) {
        audioElement.pause();
        audioElement.currentTime = 0;
      }
    });
    
    setCurrentlyPlaying(audio);
    setCurrentChapterId(chapter.id);
    
    console.log(`Now playing: ${chapter.title.en} (ID: ${chapter.id})`);
    console.log('Stopped any previous audio to prevent conflicts');
    
    // Add error handling
    audio.addEventListener('error', (e) => {
      console.error('Audio loading failed:', { 
        src: audioSrc, 
        error: audio.error,
        networkState: audio.networkState,
        readyState: audio.readyState 
      });
      setCurrentlyPlaying(null);
      setCurrentChapterId(null);
    });
    
    // Play the new audio
    audio.play().catch(error => {
      console.error('Audio playback error:', error);
      setCurrentlyPlaying(null);
      setCurrentChapterId(null);
    });
    
    // Add event listeners for better user experience
    audio.addEventListener('loadedmetadata', () => {
      const minutes = Math.floor(audio.duration / 60);
      const seconds = Math.floor(audio.duration % 60);
      console.log(`Chapter duration: ${minutes}:${seconds.toString().padStart(2, '0')}`);
    });
    
    audio.addEventListener('ended', () => {
      console.log('Chapter playback ended');
      setCurrentlyPlaying(null);
      setCurrentChapterId(null);
      // Resume theme music when audiobook ends
      const themeAudioElement = document.querySelector('#theme-audio') as HTMLAudioElement;
      if (themeAudioElement) {
        themeAudioElement.play().catch(e => console.log('Theme resume failed:', e));
      }
    });
  };

  return (
    <div className="min-h-screen text-starlight overflow-x-hidden relative">
        <StarfieldBackground />
        
        {/* Galaxy Video Background Silhouette */}
        <div className="fixed inset-0 opacity-10 pointer-events-none z-0">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover"
            style={{
              filter: 'brightness(0.3) contrast(1.8) saturate(0.7)'
            }}
          >
            <source src={galaxyVideo} type="video/mp4" />
          </video>
        </div>
      
      {/* Top Navigation Bar */}
      <div className="fixed top-5 left-5 right-5 z-50 flex justify-between items-center">
        {/* User Info */}
        <div className="flex items-center gap-4">
          {userProfile && (
            <div className="holographic-border bg-space-dark/80 px-4 py-2 rounded-lg flex items-center gap-3">
              {userProfile.profileImageUrl && (
                <img 
                  src={userProfile.profileImageUrl} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
              <div>
                <div className="text-sm font-medium text-white">
                  {userProfile.firstName || userProfile.email}
                </div>
                {hasAccess ? (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                    <Crown className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                ) : (
                  <Badge 
                    className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs cursor-pointer hover:bg-purple-500/30"
                    onClick={() => setShowSubscription(true)}
                  >
                    Upgrade to Premium
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Voice Over Toggle */}
          <VoiceOverToggle />
          
          {/* Stop Audio Button */}
          {currentlyPlaying && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleStopAudio}
              className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <rect x="6" y="4" width="8" height="12" rx="1"/>
              </svg>
              Stop Audio
            </Button>
          )}
          
          {/* Bookstore Link */}
          <a 
            href="/bookstore"
            className="holographic-border bg-space-dark/50 px-4 py-2 rounded-lg hover:bg-cosmic-gold/20 transition-all duration-300 text-cosmic-gold text-sm font-medium"
          >
            📚 Book Store
          </a>
          
          {/* Cosmic Shop Link */}
          <a 
            href="/shop"
            className="holographic-border bg-space-dark/50 px-4 py-2 rounded-lg hover:bg-cosmic-gold/20 transition-all duration-300 text-cosmic-gold text-sm font-medium"
          >
            🛒 Cosmic Shop
          </a>
          
          {/* Trilogy Link */}
          <a 
            href="/trilogy"
            className="holographic-border bg-space-dark/50 px-4 py-2 rounded-lg hover:bg-electric-blue/20 transition-all duration-300 text-bright-blue text-sm font-medium"
          >
            📚 Trilogy
          </a>
          
          {/* Young Adult Collection Link */}
          <a 
            href="/young-adult"
            className="holographic-border bg-space-dark/50 px-4 py-2 rounded-lg hover:bg-purple-500/20 transition-all duration-300 text-purple-400 text-sm font-medium"
          >
            💫 Young Adult
          </a>
          


          {/* Language Toggle */}
          <button 
            onClick={() => {
              console.log('Language button clicked, current language:', language);
              toggleLanguage();
            }}
            className="holographic-border bg-space-dark/50 px-4 py-2 rounded-lg hover:bg-electric-blue/20 transition-all duration-300 text-white"
          >
            <Languages className="w-4 h-4 mr-2 inline" />
            {language === 'en' ? 'EN → ES' : 'ES → EN'}
          </button>

          {/* Premium/Subscription Button */}
          {!hasAccess && (
            <Button 
              onClick={() => setShowSubscription(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Crown className="w-4 h-4 mr-2" />
              Get Premium
            </Button>
          )}

          {/* Logout */}
          <Button 
            variant="outline" 
            onClick={() => window.location.href = "/api/logout"}
            className="border-red-400/50 text-red-300 hover:bg-red-500/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
      
      <CosmicNavigation />
      
      {/* User Journey Tracker */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <UserJourneyTracker />
      </div>
      
      {/* Performance Monitor (only in development) */}
      <PerformanceMonitor enabled={import.meta.env.DEV} />
      
      <main>
        <HeroSection />
        <div className="relative">
          <InteractiveStarMap />
          <StarMapTooltips language={language} />
        </div>
        {/* Book Navigation Section */}
        <section id="books" className="py-20 relative z-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-orbitron font-black mb-6 bg-gradient-to-r from-cosmic-gold via-bright-gold to-electric-blue bg-clip-text text-transparent drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
                {language === 'en' ? 'Explore the Universe' : 'Explora el Universo'}
              </h2>
              <p className="text-xl text-bright-blue max-w-3xl mx-auto font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]">
                {language === 'en' 
                  ? 'Choose your journey through the cosmic realms of love and adventure'
                  : 'Elige tu viaje a través de los reinos cósmicos del amor y la aventura'
                }
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Main Trilogy */}
              <Card className="holographic-border bg-gradient-to-br from-gray-900/98 via-space-dark/95 to-electric-blue/20 hover:from-black/100 hover:to-electric-blue/30 transition-all duration-500 group border-2 border-cosmic-gold/50 backdrop-blur-sm h-auto min-h-[650px] flex flex-col">
                <CardContent className="p-6 bg-black/30 rounded-lg flex-1 flex flex-col">
                  <div className="text-center flex flex-col justify-between h-full">
                    <div className="space-y-4">
                      <div className="w-32 h-48 mx-auto rounded-lg overflow-hidden shadow-2xl border-2 border-cosmic-gold/30">
                        <img 
                          src={eternalChaseCover} 
                          alt="Eternal Chase Book 1 Cover"
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h3 className="text-2xl lg:text-3xl font-orbitron font-bold text-cosmic-gold drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] shadow-2xl">
                        {language === 'en' ? 'The Eternal Chase Trilogy' : 'La Trilogía Eternal Chase'}
                      </h3>
                      <p className="text-white font-semibold drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] text-base lg:text-lg leading-relaxed">
                        {language === 'en'
                          ? 'Stream 3 complete seasons with 36 episodes of cosmic romance and interdimensional adventure'
                          : 'Transmite 3 temporadas completas con 36 episodios de romance cósmico y aventura interdimensional'
                        }
                      </p>
                    </div>
                    
                    <div className="space-y-4 mt-6">
                      <div className="flex flex-wrap justify-center gap-2">
                        <Badge className="bg-cosmic-gold/20 text-cosmic-gold border-cosmic-gold/30 px-3 py-1">
                          3 Seasons
                        </Badge>
                        <Badge className="bg-electric-blue/20 text-bright-blue border-electric-blue/30 px-3 py-1">
                          36 Episodes
                        </Badge>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-3 py-1">
                          29h Runtime
                        </Badge>
                      </div>
                      <Button 
                        onClick={() => navigate('/trilogy')}
                        className="w-full bg-cosmic-gold/20 hover:bg-cosmic-gold/40 text-cosmic-gold border border-current group-hover:scale-105 transition-all duration-300 py-3"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        {language === 'en' ? 'Watch All Seasons' : 'Ver Todas las Temporadas'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Aiyanna Collection */}
              <Card className="holographic-border bg-gradient-to-br from-gray-900/98 via-space-dark/95 to-purple-900/20 hover:from-black/100 hover:to-purple-900/30 transition-all duration-500 group border-2 border-purple-400/50 backdrop-blur-sm h-auto min-h-[650px] flex flex-col">
                <CardContent className="p-6 bg-black/30 rounded-lg flex-1 flex flex-col">
                  <div className="text-center flex flex-col justify-between h-full">
                    <div className="space-y-4">
                      <div className="w-32 h-48 mx-auto rounded-lg overflow-hidden shadow-2xl border-2 border-purple-400/30 hover:border-purple-400/60 transition-all duration-300">
                        <img 
                          src={aiyannaChroniclesImage} 
                          alt="The Aiyanna Chronicles" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <h3 className="text-2xl lg:text-3xl font-orbitron font-bold text-purple-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] shadow-2xl">
                        {language === 'en' ? "Young Adult Collection" : "Colección Juvenil"}
                      </h3>
                      <p className="text-white font-semibold drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] text-base lg:text-lg leading-relaxed">
                        {language === 'en'
                          ? 'Follow young Lyra before she became the cosmic hero - 7 characters, epic growth'
                          : 'Sigue a la joven Lyra antes de convertirse en heroína cósmica - 7 personajes, crecimiento épico'
                        }
                      </p>
                    </div>
                    
                    <div className="space-y-4 mt-6">
                      <div className="flex flex-wrap justify-center gap-2">
                        <Badge className="bg-purple-400/20 text-purple-400 border-purple-400/30 px-3 py-1">
                          7 Books
                        </Badge>
                        <Badge className="bg-pink-400/20 text-pink-400 border-pink-400/30 px-3 py-1">
                          34h Audio
                        </Badge>
                        <Badge className="bg-cyan-400/20 text-cyan-400 border-cyan-400/30 px-3 py-1">
                          Young Adult
                        </Badge>
                      </div>
                      <Button 
                        onClick={() => navigate('/young-adult')}
                        className="w-full bg-purple-400/20 hover:bg-purple-400/40 text-purple-400 border border-current group-hover:scale-105 transition-all duration-300 py-3"
                      >
                        <Star className="w-4 h-4 mr-2" />
                        {language === 'en' ? "Explore Young Adult Section" : "Explorar Sección Juvenil"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Access Features */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-space-dark/50 rounded-lg border border-cosmic-gold/20">
                <Crown className="w-8 h-8 text-cosmic-gold mx-auto mb-3" />
                <h4 className="font-bold text-cosmic-gold mb-2">Premium Content</h4>
                <p className="text-sm text-gray-300">
                  {language === 'en' 
                    ? 'Access exclusive chapters, behind-the-scenes content, and author commentary'
                    : 'Accede a capítulos exclusivos, contenido exclusivo y comentarios del autor'
                  }
                </p>
              </div>
              <div className="text-center p-6 bg-space-dark/50 rounded-lg border border-electric-blue/20">
                <Users className="w-8 h-8 text-electric-blue mx-auto mb-3" />
                <h4 className="font-bold text-electric-blue mb-2">Multi-Voice Acting</h4>
                <p className="text-sm text-gray-300">
                  {language === 'en'
                    ? 'Each character brought to life with professional voice actors'
                    : 'Cada personaje cobra vida con actores de voz profesionales'
                  }
                </p>
              </div>
              <div className="text-center p-6 bg-space-dark/50 rounded-lg border border-purple-400/20">
                <Languages className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <h4 className="font-bold text-purple-400 mb-2">Bilingual Audio</h4>
                <p className="text-sm text-gray-300">
                  {language === 'en'
                    ? 'Complete audiobooks available in both English and Spanish'
                    : 'Audiolibros completos disponibles en inglés y español'
                  }
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Book Covers Showcase */}
        <section className="py-20 relative z-40">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-orbitron font-black mb-6 bg-gradient-to-r from-cosmic-gold via-bright-gold to-electric-blue bg-clip-text text-transparent">
                {language === 'en' ? 'Official Book Covers' : 'Portadas Oficiales'}
              </h2>
              <p className="text-xl text-bright-blue max-w-3xl mx-auto font-medium">
                {language === 'en' 
                  ? 'Experience the cosmic romance through stunning visual storytelling'
                  : 'Experimenta el romance cósmico a través de una narrativa visual impresionante'
                }
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {/* Book 1 - Eternal Chase */}
              <div className="group cosmic-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="relative overflow-hidden rounded-2xl shadow-2xl border-2 border-cosmic-gold/30 hover:border-cosmic-gold/60 transition-all duration-500">
                  <img 
                    src={eternalChaseCover}
                    alt="Eternal Chase: The Pursuit for Love"
                    className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-2xl font-orbitron font-bold text-cosmic-gold mb-2">
                      {language === 'en' ? 'Book 1: The Pursuit for Love' : 'Libro 1: La Búsqueda del Amor'}
                    </h3>
                    <p className="text-white/90 text-sm">
                      {language === 'en' 
                        ? 'Where love transcends dimensions and the cosmic journey begins'
                        : 'Donde el amor trasciende dimensiones y comienza el viaje cósmico'
                      }
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Book 2 - Spiral Galaxy */}
              <div className="group cosmic-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="relative overflow-hidden rounded-2xl shadow-2xl border-2 border-purple-400/30 hover:border-purple-400/60 transition-all duration-500">
                  <img 
                    src={spiralGalaxyCover}
                    alt="Spiral Galaxy Book Cover"
                    className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-2xl font-orbitron font-bold text-purple-400 mb-2">
                      {language === 'en' ? 'Book 2: Spiral Galaxy' : 'Libro 2: Galaxia Espiral'}
                    </h3>
                    <p className="text-white/90 text-sm">
                      {language === 'en' 
                        ? 'Love tested across the cosmic expanse of a spiral galaxy'
                        : 'Amor puesto a prueba a través de la expansión cósmica de una galaxia espiral'
                      }
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Book 3 - Ascension's Edge */}
              <div className="group cosmic-fade-in" style={{ animationDelay: '0.6s' }}>
                <div className="relative overflow-hidden rounded-2xl shadow-2xl border-2 border-electric-blue/30 hover:border-electric-blue/60 transition-all duration-500">
                  <img 
                    src={ascensionsEdgeCover}
                    alt="Eternal Chase: Ascension's Edge"
                    className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-2xl font-orbitron font-bold text-electric-blue mb-2">
                      {language === 'en' ? 'Book 3: Ascension\'s Edge' : 'Libro 3: El Borde de la Ascensión'}
                    </h3>
                    <p className="text-white/90 text-sm">
                      {language === 'en' 
                        ? 'The epic finale where love transcends the cosmos and reality reshapes itself'
                        : 'El final épico donde el amor trasciende el cosmos y la realidad se remodela'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <TrilogyShowcase />
        
        {/* Neural Archive Access Section */}
        <section id="audiobooks" className="py-20 relative z-40">
          <div className="max-w-7xl mx-auto px-4">
            <EnhancedChapterAccess 
              books={organizedBooks}
              onPlayChapter={handlePlayChapter}
              currentLanguage={language}
            />
            
            {/* Young Adult Section Teaser */}
            <div className="mt-16 text-center">
              <div className="bg-space-dark/60 border border-purple-400/30 rounded-2xl p-8 max-w-2xl mx-auto">
                <h3 className="font-orbitron text-2xl font-bold text-purple-400 mb-4">
                  {language === 'en' ? 'Looking for Young Adult Content?' : '¿Buscas Contenido Juvenil?'}
                </h3>
                <p className="text-gray-300 mb-6">
                  {language === 'en' 
                    ? 'Discover Aiyanna\'s complete journey in our dedicated Young Adult section with age-appropriate cosmic adventures.'
                    : 'Descubre el viaje completo de Aiyanna en nuestra sección dedicada para jóvenes adultos con aventuras cósmicas apropiadas para la edad.'
                  }
                </p>
                <Button 
                  onClick={() => window.location.href = '/young-adult'}
                  className="bg-purple-400/20 hover:bg-purple-400/40 border border-purple-400"
                >
                  {language === 'en' ? 'Visit Young Adult Section' : 'Visitar Sección Juvenil'}
                </Button>
              </div>
            </div>
          </div>
        </section>

        <CharacterGallery />
        <UniverseLore />
        <LoreVault />
        <CosmicShop />
        <ContactSection />
      </main>
      
      {/* Footer with Star Map */}
      <footer className="py-20 px-4 border-t border-electric-blue/30 relative z-10 overflow-hidden">
        {/* Galaxy Video Background in Footer */}
        <div className="absolute inset-0 opacity-20">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover"
            style={{
              filter: 'brightness(0.5) contrast(1.2) saturate(0.8)'
            }}
          >
            <source src={galaxyVideo} type="video/mp4" />
          </video>
        </div>
        
        {/* Grid Overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full grid grid-cols-8 grid-rows-6">
            {Array.from({ length: 48 }).map((_, i) => (
              <div key={i} className="border border-cosmic-gold/10" />
            ))}
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="mb-8">
            <div className="font-orbitron text-4xl font-bold text-cosmic-gold mb-2">ETERNAL CHASE</div>
            <div className="font-orbitron text-lg text-electric-blue mb-4">Galaxy Altherra Portal</div>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Navigate the cosmic realms where love transcends dimensions and heroes forge their destiny among the stars.
            </p>
          </div>
          
          {/* Galactic Coordinates */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center">
              <div className="text-cosmic-gold font-mono text-lg font-bold">DARANTHI</div>
              <div className="text-gray-500 text-sm">20.0°, 20.0°</div>
            </div>
            <div className="text-center">
              <div className="text-cosmic-gold font-mono text-lg font-bold">ORYON</div>
              <div className="text-gray-500 text-sm">80.0°, 18.0°</div>
            </div>
            <div className="text-center">
              <div className="text-cosmic-gold font-mono text-lg font-bold">NYTHRA</div>
              <div className="text-gray-500 text-sm">15.0°, 55.0°</div>
            </div>
            <div className="text-center">
              <div className="text-cosmic-gold font-mono text-lg font-bold">ICARION</div>
              <div className="text-gray-500 text-sm">75.0°, 88.0°</div>
            </div>
          </div>
          
          <div className="border-t border-electric-blue/20 pt-8">
            <p className="text-gray-400 mb-6">© 2025 Shawn Rulz. All rights reserved across all dimensions.</p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-cosmic-gold transition-colors flex items-center gap-2">
                <span className="w-2 h-2 bg-cosmic-gold rounded-full"></span>
                Privacy Policy
              </a>
              <a href="#" className="hover:text-cosmic-gold transition-colors flex items-center gap-2">
                <span className="w-2 h-2 bg-electric-blue rounded-full"></span>
                Terms of Service
              </a>
              <a href="#" className="hover:text-cosmic-gold transition-colors flex items-center gap-2">
                <span className="w-2 h-2 bg-bright-gold rounded-full"></span>
                Cosmic Guidelines
              </a>
              <a href="#" className="hover:text-cosmic-gold transition-colors flex items-center gap-2">
                <span className="w-2 h-2 bg-cosmic-purple rounded-full"></span>
                Support Portal
              </a>
            </div>
          </div>
        </div>
      </footer>

      <SubscriptionModal 
        isOpen={showSubscription} 
        onClose={() => setShowSubscription(false)} 
      />
      
      {/* Ambient Sound Controller */}
      <AmbientSoundController />
    </div>
  );
}
