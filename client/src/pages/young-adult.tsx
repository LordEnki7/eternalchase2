import { useState, useEffect } from 'react';
import { Book, User, Headphones, Star, Sparkles, ChevronDown, ChevronUp, Clock, Play, Lock, Award, MapPin, Zap, Shield, Gamepad2, Trophy, Target, Swords, Waves } from 'lucide-react';
import { Link } from 'wouter';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';
import { useAuth } from '@/hooks/useAuth';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { aiyannaCharacters } from '@/lib/aiyanna-character-data';
// Using local enhanced CharacterCard with gaming features
import { getChaptersByBookId, audiobookTracks } from '@/lib/audiobook-data';
import AudioPlayer from '@/components/AudioPlayer';
// Removed PageTransition to prevent darkening transitions (see replit.md)
import StarfieldBackground from '@/components/starfield-background';
const galaxyVideo = '/media/galaxy-background-2.mp4';
const aiyannaTrilogyImage = '/media/book-covers/aiyanna-chronicles-main.png';
const aiyannaVideo = '/media/young-aiyanna-waving.mp4';
const book1Cover = '/media/book-covers/aiyanna-book1-tragedy-fall-kairon.png';
const book2Cover = '/media/book-covers/aiyanna-book2.png';
const book3Cover = '/media/book-covers/aiyanna-book3.png';
import UserJourneyTracker from '@/components/UserJourneyTracker';
import VoiceOverToggle from '@/components/VoiceOverToggle';
import CosmicParticles from '@/components/CosmicParticles';
import InteractiveStarMap from '@/components/InteractiveStarMap';
import { StarMapTooltips } from '@/components/StarMapTooltips';
import type { AudioTrack } from '@/lib/audiobook-data';
import AudioTrackCard from '@/components/AudioTrackCard';
import DynamicThemeController from '@/components/DynamicThemeController';

// Character images are already imported in aiyanna-character-data.ts

export default function YoungAdult() {
  const { language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const { playCyberWhoosh, playCosmicChime, playButtonHover } = useSoundEffects();
  const [selectedTrack, setSelectedTrack] = useState<AudioTrack | null>(null);
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
  const [book1Expanded, setBook1Expanded] = useState(true); // Expand by default to show audio files
  const [book2Expanded, setBook2Expanded] = useState(false);
  const [book3Expanded, setBook3Expanded] = useState(false);
  
  // Gaming state
  const [discoveredCharacters, setDiscoveredCharacters] = useState<Set<string>>(new Set());
  const [completedTracks, setCompletedTracks] = useState<Set<string>>(new Set());
  const [achievements, setAchievements] = useState<Array<{id: string, title: string, timestamp: number}>>([]);
  const [showAchievement, setShowAchievement] = useState<{title: string, show: boolean}>({title: '', show: false});
  const [exploredHotspots, setExploredHotspots] = useState<Set<string>>(new Set());
  
  // Resonance Raiders Game State
  const [resonanceLevel, setResonanceLevel] = useState(1);
  const [resonancePoints, setResonancePoints] = useState(0);
  const [echoFragments, setEchoFragments] = useState(0);
  const [glyphsCollected, setGlyphsCollected] = useState<Set<string>>(new Set());
  const [activeMissions, setActiveMissions] = useState<Array<{id: string, title: string, progress: number, maxProgress: number}>>([]);
  const [gameMode, setGameMode] = useState<'explore' | 'missions' | 'inventory'>('explore');
  
  // Audio player state
  const [audioPlayerVisible, setAudioPlayerVisible] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [currentAudioFile, setCurrentAudioFile] = useState<string>('');
  const [currentAudioTitle, setCurrentAudioTitle] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);

  // Character images are handled via the imageUrl property in character data

  const aiyannaStories = getChaptersByBookId('aiyanna-stories');
  const aiyannaBook2 = getChaptersByBookId('book2-fractured-song');
  const aiyannaBook3 = getChaptersByBookId('book3-whispers-new-world');



  // Handle track play
  const handleTrackPlay = (track: AudioTrack) => {
    setSelectedTrack(track);
    setCurrentTrack(track.id);
    setCurrentAudioFile(track.fileName.replace('@assets/', '/attached_assets/'));
    setCurrentAudioTitle(track.title[language]);
    setAudioPlayerVisible(true);
    setIsPlaying(true);
    
    // Track progress
    if (!completedTracks.has(track.id)) {
      setCompletedTracks(prev => new Set([...Array.from(prev), track.id]));
      triggerAchievement(`Chapter Completed: ${track.title[language]}`);
      playCosmicChime();
    }
  };

  // Character discovery handler
  const handleCharacterDiscovery = (characterId: string) => {
    if (!discoveredCharacters.has(characterId)) {
      setDiscoveredCharacters(prev => new Set([...Array.from(prev), characterId]));
      const character = aiyannaCharacters.find(c => c.id === characterId);
      if (character) {
        triggerAchievement(`Character Discovered: ${character.name[language]}`);
        playCyberWhoosh();
      }
    }
  };

  // Star map hotspot handler
  const handleHotspotExploration = (hotspotId: string) => {
    if (!exploredHotspots.has(hotspotId)) {
      setExploredHotspots(prev => new Set([...Array.from(prev), hotspotId]));
      triggerAchievement(`Location Explored: ${hotspotId}`);
      playCosmicChime();
    }
  };

  // Achievement trigger function
  const triggerAchievement = (title: string) => {
    const newAchievement = {
      id: Date.now().toString(),
      title,
      timestamp: Date.now()
    };
    setAchievements(prev => [...prev, newAchievement]);
    setShowAchievement({title, show: true});
    
    // Hide achievement after 3 seconds
    setTimeout(() => {
      setShowAchievement({title: '', show: false});
    }, 3000);
  };

  // Calculate overall progress
  const totalTracks = aiyannaStories.length + aiyannaBook2.length + aiyannaBook3.length;
  const totalCharacters = aiyannaCharacters.length;
  const totalHotspots = 5; // Number of interactive hotspots on star map
  
  const overallProgress = Math.round(
    ((completedTracks.size / totalTracks) * 40 + 
     (discoveredCharacters.size / totalCharacters) * 40 + 
     (exploredHotspots.size / totalHotspots) * 20)
  );

  // Resonance Raiders Game Data
  const availableGlyphs = [
    { id: 'speed', name: 'Velocity Glyph', icon: '⚡', power: 'Enhanced movement speed', rarity: 'common' },
    { id: 'shield', name: 'Barrier Glyph', icon: '🛡️', power: 'Protective resonance field', rarity: 'rare' },
    { id: 'pulse', name: 'Echo Pulse', icon: '🌊', power: 'Sonic detection ability', rarity: 'common' },
    { id: 'harmony', name: 'Harmonic Convergence', icon: '🎵', power: 'Amplifies all other glyphs', rarity: 'legendary' },
    { id: 'void', name: 'Void Touch', icon: '🌑', power: 'Resist Velo corruption', rarity: 'epic' },
    { id: 'crystal', name: 'Crystal Resonance', icon: '💎', power: 'Enhanced echo collection', rarity: 'rare' }
  ];

  const gameMissions = [
    { id: 'first-echo', title: 'Collect First Echo Fragment', progress: echoFragments, maxProgress: 1, reward: 'Speed Glyph' },
    { id: 'character-discovery', title: 'Discover All Characters', progress: discoveredCharacters.size, maxProgress: aiyannaCharacters.length, reward: 'Harmony Glyph' },
    { id: 'story-listener', title: 'Complete 3 Audio Chapters', progress: completedTracks.size, maxProgress: 3, reward: 'Echo Pulse Glyph' },
    { id: 'explorer', title: 'Explore All Star Map Locations', progress: exploredHotspots.size, maxProgress: 5, reward: 'Void Touch Glyph' }
  ];

  // Gaming functions
  const collectEchoFragment = () => {
    setEchoFragments(prev => prev + 1);
    setResonancePoints(prev => prev + 10);
    if (echoFragments === 0) {
      setGlyphsCollected(prev => new Set([...Array.from(prev), 'speed']));
      triggerAchievement('First Echo Fragment Collected! Speed Glyph Unlocked');
    }
  };

  const checkMissionCompletion = () => {
    gameMissions.forEach(mission => {
      if (mission.progress >= mission.maxProgress && !glyphsCollected.has(mission.reward.toLowerCase().replace(' ', ''))) {
        const glyphId = mission.reward.toLowerCase().replace(/\s+/g, '');
        setGlyphsCollected(prev => new Set([...Array.from(prev), glyphId]));
        triggerAchievement(`Mission Complete: ${mission.title}! ${mission.reward} Unlocked`);
      }
    });
  };

  // Check for mission completion on state changes
  useEffect(() => {
    checkMissionCompletion();
  }, [discoveredCharacters.size, completedTracks.size, exploredHotspots.size, echoFragments]);

  // Enhanced Character Card component with discovery animations
  const CharacterCard = ({ character, index }: { character: any, index: number }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isDiscovered, setIsDiscovered] = useState(discoveredCharacters.has(character.id));

    useEffect(() => {
      setIsDiscovered(discoveredCharacters.has(character.id));
    }, [discoveredCharacters, character.id]);

    const handleMouseEnter = () => {
      console.log(`Hovering over character: ${character.name.en}`);
      setIsHovered(true);
      if (!isDiscovered) {
        handleCharacterDiscovery(character.id);
      }
      playButtonHover();
    };

    const handleMouseLeave = () => {
      console.log(`Mouse left character: ${character.name.en}`);
      setIsHovered(false);
    };

    return (
      <div 
        className={`relative group transition-all duration-500 ${isDiscovered ? 'animate-pulse-glow' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: 'pointer' }}
      >
        {/* Discovery glow effect */}
        {isDiscovered && (
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 via-purple-400 to-blue-400 rounded-2xl blur opacity-30 animate-pulse"></div>
        )}
        
        <Card className={`relative h-[580px] bg-space-dark/90 border-purple-400/50 overflow-hidden transition-all duration-300 ${isHovered ? 'border-amber-400/70 shadow-lg shadow-amber-400/20' : 'hover:border-amber-400/70'}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-amber-400 font-orbitron">
              {character.name[language]}
              {isDiscovered && <Award className="inline-block w-5 h-5 ml-2 text-amber-400" />}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-4 space-y-4">
            {/* Video/Image Area */}
            <div className="relative h-[380px] rounded-lg overflow-hidden bg-black/50">
              {character.hasVideo && character.videoUrl ? (
                <video
                  ref={(video) => {
                    if (video) {
                      if (isHovered) {
                        video.currentTime = 0;
                        video.play().catch(() => {});
                      } else {
                        video.pause();
                        video.currentTime = 0;
                      }
                    }
                  }}
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-contain transition-all duration-300"
                >
                  <source src={character.videoUrl} type="video/mp4" />
                </video>
              ) : (
                <img 
                  src={character.imageUrl} 
                  alt={character.name[language]}
                  className="w-full h-full object-cover"
                />
              )}
              
              {/* Discovery indicator */}
              {!isDiscovered && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-amber-400 text-lg font-orbitron">Hover to Discover</div>
                </div>
              )}
            </div>

            {/* Character Info */}
            {isDiscovered && (
              <div className="space-y-3 animate-fade-in">
                <div>
                  <h4 className="text-sm font-semibold text-purple-300 mb-1">Description</h4>
                  <p className="text-xs text-gray-300 line-clamp-3">{character.description[language]}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-purple-300 mb-1">Abilities</h4>
                  <p className="text-xs text-amber-300 line-clamp-2">{character.abilities[language]}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-purple-300 mb-1">Quote</h4>
                  <p className="text-xs text-gray-400 italic line-clamp-2">"{character.quote[language]}"</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const content = {
    en: {
      title: "Aiyanna's Chronicles",
      subtitle: "Young Adult Fantasy Trilogy",
      description: "Discover the childhood adventures of Aiyanna (young Lyra) on the mystical planet Kairon",
      aboutAiyanna: "About Aiyanna",
      aiyannaDescription: "Before she became Lyra, she was Aiyanna - a young girl on the planet Kairon who lost her parents in a cosmic tragedy. Follow her complete journey through the three-book saga: from discovery and friendship to confronting the Null Order and becoming an Architect of Resonance herself.",
      book2Description: "In 'Architects of Resonance,' Aiyanna faces the Null Order's assault on the Folded Archive. With the Core Resonance Sequence fragment, she must navigate through dimensional barriers while learning to master her cosmic powers and embrace her destiny as an Architect of Resonance.",
      book3Description: "The epic conclusion finds Aiyanna in Trisolar, battling through prison dimensions and mirror chambers. She discovers the final truth about the Architects, learns the complete Great Song, and faces the Splintering Flame in a battle that will determine the fate of all dimensions.",
      characters: "Character Gallery",
      audiobooks: "Audiobook Collection",
      chapters: "Chapters",
      specialContent: "Special Content",
      play: "Play",
      requiresSubscription: "Premium Content - Subscription Required",
      loginToAccess: "Sign in to access premium audiobooks",
      flipCard: "Click to flip"
    },
    es: {
      title: "Las Historias de Aiyanna",
      subtitle: "Colección Juvenil",
      description: "Descubre las aventuras de la infancia de Aiyanna (la joven Lyra) en el planeta místico Kairon",
      aboutAiyanna: "Acerca de Aiyanna",
      aiyannaDescription: "Antes de convertirse en Lyra, ella era Aiyanna - una niña en el planeta Kairon que perdió a sus padres en una tragedia cósmica. Sigue su viaje completo a través de la saga de tres libros: desde el descubrimiento y la amistad hasta enfrentar la Orden Nula y convertirse en una Arquitecta de Resonancia.",
      book2Description: "En 'Arquitectos de Resonancia,' Aiyanna enfrenta el asalto de la Orden Nula al Archivo Plegado. Con el fragmento de la Secuencia de Resonancia Central, debe navegar a través de barreras dimensionales mientras aprende a dominar sus poderes cósmicos y abraza su destino como Arquitecta de Resonancia.",
      book3Description: "La conclusión épica encuentra a Aiyanna en Trisolar, luchando a través de dimensiones prisión y cámaras de espejos. Descubre la verdad final sobre los Arquitectos, aprende la Gran Canción completa, y enfrenta la Llama Fragmentadora en una batalla que determinará el destino de todas las dimensiones.",
      characters: "Galería de Personajes",
      audiobooks: "Colección de Audiolibros",
      chapters: "Capítulos",
      specialContent: "Contenido Especial",
      play: "Reproducir",
      requiresSubscription: "Contenido Premium - Suscripción Requerida",
      loginToAccess: "Inicia sesión para acceder a audiolibros premium",
      flipCard: "Haz clic para voltear"
    }
  };

  const text = content[language as keyof typeof content];

  // Enhanced Track Card with progress tracking
  const TrackCard = ({ track, isPremium }: { track: AudioTrack; isPremium: boolean }) => {
    const isCompleted = completedTracks.has(track.id);
    
    const handlePlay = () => {
      handleTrackPlay(track);
    };

    return (
      <div className={`bg-black/20 backdrop-blur-sm border rounded-lg p-6 transition-all duration-300 hover:shadow-lg ${
        isCompleted ? 'border-amber-400/70 bg-amber-400/10' : 'border-purple-400/50 hover:border-amber-400/70'
      }`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-orbitron text-lg font-bold text-amber-400">
                {track.title[language]}
              </h4>
              {isCompleted && <Award className="w-5 h-5 text-amber-400" />}
            </div>
            <p className="text-gray-300 text-sm mb-3">
              {track.description[language]}
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Headphones className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 text-sm">
                {track.type === 'chapter' ? `Chapter ${track.chapterNumber}` : 'Special Content'}
              </span>
            </div>
            {track.duration && (
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4 text-amber-400" />
                <span className="text-amber-300 text-sm">{track.duration}</span>
              </div>
            )}
          </div>
          
          <button
            onClick={handlePlay}
            onMouseEnter={playButtonHover}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2"
          >
            <Headphones className="w-4 h-4" />
            <span>{text.play}</span>
          </button>
        </div>
      </div>
    );
  };

  // Interactive Star Map Hotspot component
  const StarMapHotspot = ({ id, x, y, label }: { id: string, x: string, y: string, label: string }) => {
    const isExplored = exploredHotspots.has(id);
    
    return (
      <button
        className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
          isExplored ? 'text-amber-400 scale-125' : 'text-purple-400 hover:text-amber-400 hover:scale-110'
        }`}
        style={{ left: x, top: y }}
        onClick={() => handleHotspotExploration(id)}
        onMouseEnter={playButtonHover}
      >
        <div className="relative">
          <MapPin className="w-6 h-6" />
          {isExplored && <Zap className="absolute -top-1 -right-1 w-3 h-3 text-amber-400" />}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 bg-black/80 rounded text-xs whitespace-nowrap">
            {label}
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="min-h-screen text-starlight overflow-x-hidden relative">
      <StarfieldBackground />
      
      {/* Achievement Notification */}
      {showAchievement.show && (
        <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-amber-600 to-purple-600 text-white px-6 py-3 rounded-lg shadow-xl animate-slide-in-right">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            <span className="font-semibold">{showAchievement.title}</span>
          </div>
        </div>
      )}

      {/* Progress Tracking Header */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="bg-black/40 backdrop-blur-sm border border-purple-400/50 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-orbitron font-bold text-amber-400">Journey Progress</h2>
            <div className="text-right">
              <div className="text-3xl font-bold text-amber-400">{overallProgress}%</div>
              <div className="text-sm text-purple-300">Complete</div>
            </div>
          </div>
          
          <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-amber-400 to-purple-400 h-3 rounded-full transition-all duration-1000"
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-amber-400">{completedTracks.size}/{totalTracks}</div>
              <div className="text-sm text-purple-300">Chapters</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-400">{discoveredCharacters.size}/{totalCharacters}</div>
              <div className="text-sm text-purple-300">Characters</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-400">{exploredHotspots.size}/{totalHotspots}</div>
              <div className="text-sm text-purple-300">Locations</div>
            </div>
          </div>
        </div>

        {/* Theme Controller */}
        <DynamicThemeController />

        {/* User Journey Tracker */}
        <UserJourneyTracker />

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-orbitron text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-amber-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              {text.title}
            </span>
          </h1>
          <p className="text-purple-300 text-xl mb-4">{text.subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">
              <Sparkles className="w-4 h-4 mr-2" />
              Young Adult Collection
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
              <Book className="w-4 h-4 mr-2" />
              {language === 'en' ? 'Books 2-3: Architects of Resonance' : 'Libros 2-3: Arquitectos de Resonancia'}
            </Badge>
          </div>
          
          {/* Trilogy Animation */}
          <div className="mb-8 mx-auto" style={{ maxWidth: 'calc(1024px - 216px)' }}>
            <div className="relative rounded-2xl holographic-border">
              <video 
                autoPlay 
                muted 
                loop 
                playsInline
                className="w-full h-auto object-cover"
                style={{ objectPosition: 'left center' }}
              >
                <source src="/attached_assets/AIYANNA CHRONICLES ANIMATION 2_1754269164034.mp4" type="video/mp4" />
              </video>

            </div>
            {/* Tagline */}
            <div className="text-center mt-6">
              <p className="text-2xl font-orbitron font-semibold text-amber-400 tracking-wide">
                Every legacy starts with a spark
              </p>
            </div>
          </div>
          
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            {text.description}
          </p>
        </div>

        {/* Galaxy Video Section with Interactive Hotspots */}
        <div className="relative mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-orbitron font-bold text-amber-400 mb-4">
              {language === 'en' ? 'Galaxy Altherra' : 'Galaxia Altherra'}
            </h2>
            <p className="text-gray-300 text-lg">
              {language === 'en' 
                ? 'Explore the cosmic realm where Aiyanna\'s journey unfolds' 
                : 'Explora el reino cósmico donde se desarrolla el viaje de Aiyanna'
              }
            </p>
          </div>
          
          <div className="relative rounded-2xl overflow-hidden border border-purple-400/50 shadow-2xl bg-black/30 backdrop-blur-sm">
            <video 
              autoPlay 
              muted 
              loop 
              playsInline
              className="w-full h-96 object-cover"
              style={{
                filter: 'brightness(0.8) contrast(1.2)',
                minHeight: '400px'
              }}
            >
              <source src={galaxyVideo} type="video/mp4" />
            </video>
            
            {/* Interactive Hotspots */}
            <StarMapHotspot 
              id="kairon-prime" 
              x="20%" 
              y="30%" 
              label="Kairon Prime" 
            />
            <StarMapHotspot 
              id="amara-nexus" 
              x="70%" 
              y="25%" 
              label="Amara Nexus" 
            />
            <StarMapHotspot 
              id="void-sector" 
              x="45%" 
              y="60%" 
              label="Void Sector" 
            />
            <StarMapHotspot 
              id="crystal-gardens" 
              x="80%" 
              y="70%" 
              label="Crystal Gardens" 
            />
            <StarMapHotspot 
              id="temporal-rift" 
              x="15%" 
              y="80%" 
              label="Temporal Rift" 
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-space-dark/30 via-transparent to-transparent"></div>
          </div>
        </div>

        {/* Resonance Raiders Game Hub */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-orbitron font-bold text-amber-400 mb-6">
              <Gamepad2 className="inline-block w-10 h-10 mr-3" />
              Resonance Raiders
            </h2>
            <p className="text-gray-300 text-lg mb-4">Become a seeker of lost Source Echoes across fractured planets</p>
            <div className="flex justify-center space-x-8 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">Level {resonanceLevel}</div>
                <div className="text-sm text-gray-400">Resonance Level</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-400">{resonancePoints}</div>
                <div className="text-sm text-gray-400">Resonance Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{echoFragments}</div>
                <div className="text-sm text-gray-400">Echo Fragments</div>
              </div>
            </div>
          </div>

          {/* Game Mode Tabs */}
          <div className="flex justify-center mb-8">
            <div className="flex bg-black/30 rounded-lg p-1">
              {['explore', 'missions', 'inventory'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setGameMode(mode as any)}
                  className={`px-6 py-2 rounded-md font-medium transition-all duration-300 ${
                    gameMode === mode 
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-400/50' 
                      : 'text-gray-400 hover:text-purple-300'
                  }`}
                >
                  {mode === 'explore' && <MapPin className="inline-block w-4 h-4 mr-2" />}
                  {mode === 'missions' && <Target className="inline-block w-4 h-4 mr-2" />}
                  {mode === 'inventory' && <Trophy className="inline-block w-4 h-4 mr-2" />}
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Game Content Panels */}
          {gameMode === 'missions' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {gameMissions.map((mission) => (
                <Card key={mission.id} className="bg-black/30 border-purple-400/50">
                  <CardHeader>
                    <CardTitle className="text-lg text-amber-400 flex items-center">
                      <Target className="w-5 h-5 mr-2" />
                      {mission.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">Progress</span>
                        <span className="text-purple-300">{mission.progress}/{mission.maxProgress}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-amber-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((mission.progress / mission.maxProgress) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-400">
                      Reward: <span className="text-amber-300">{mission.reward}</span>
                    </div>
                    {mission.progress >= mission.maxProgress && (
                      <Badge className="mt-2 bg-green-500/20 text-green-300 border-green-500/30">
                        <Trophy className="w-3 h-3 mr-1" />
                        Complete
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {gameMode === 'inventory' && (
            <div className="mb-8">
              <h3 className="text-2xl font-orbitron font-bold text-purple-400 mb-6 text-center">Collected Glyphs</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {availableGlyphs.map((glyph) => {
                  const isCollected = glyphsCollected.has(glyph.id);
                  return (
                    <Card key={glyph.id} className={`bg-black/30 border transition-all duration-300 ${
                      isCollected 
                        ? 'border-amber-400/70 shadow-lg shadow-amber-400/20' 
                        : 'border-gray-600/50 grayscale opacity-50'
                    }`}>
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl mb-2">{glyph.icon}</div>
                        <div className="text-sm font-medium text-amber-400">{glyph.name}</div>
                        <div className="text-xs text-gray-400 mt-1">{glyph.power}</div>
                        <Badge className={`mt-2 text-xs ${
                          glyph.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                          glyph.rarity === 'epic' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
                          glyph.rarity === 'rare' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                          'bg-gray-500/20 text-gray-300 border-gray-500/30'
                        }`}>
                          {glyph.rarity}
                        </Badge>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Character Gallery */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-orbitron font-bold text-amber-400 mb-6">{text.characters}</h2>
            <p className="text-gray-300 text-lg mb-8">Hover over characters to discover their stories and collect Echo Fragments</p>
            <div className="flex justify-center space-x-4">
              <Button 
                onClick={collectEchoFragment}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2 rounded-lg transition-all duration-300"
              >
                <Waves className="w-4 h-4 mr-2" />
                Collect Echo Fragment (+10 Resonance)
              </Button>
              
              <Link href="/resonance-raiders">
                <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-6 py-2 rounded-lg transition-all duration-300">
                  <Gamepad2 className="w-4 h-4 mr-2" />
                  Play Full Game
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {aiyannaCharacters.map((character, index) => (
              <CharacterCard key={character.id} character={character} index={index} />
            ))}
          </div>
        </div>

        {/* Audiobook Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-orbitron font-bold text-amber-400 mb-6">{text.audiobooks}</h2>
          </div>
          
          {/* Book 1: Aiyanna Stories */}
          <div className="mb-12">
            <div className="bg-black/30 backdrop-blur-sm border border-purple-400/50 rounded-xl overflow-hidden hover:border-amber-400/70 transition-all duration-300">
              <button
                onClick={() => setBook1Expanded(!book1Expanded)}
                onMouseEnter={playButtonHover}
                className="w-full p-6 text-left hover:bg-purple-900/20 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="text-2xl font-orbitron font-bold text-amber-400 mb-2">
                        Aiyanna Chronicles - Book 1
                      </h3>
                      <p className="text-purple-300">
                        {language === 'en' ? 'The Origin Story' : 'La Historia del Origen'}
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        {aiyannaStories.length} {text.chapters.toLowerCase()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">
                      <Headphones className="w-4 h-4 mr-2" />
                      Audiobook
                    </Badge>
                    {book1Expanded ? <ChevronUp className="w-6 h-6 text-amber-400" /> : <ChevronDown className="w-6 h-6 text-amber-400" />}
                  </div>
                </div>
              </button>

              {book1Expanded && (
                <div className="border-t border-purple-400/30 p-6">
                  <div className="grid gap-4">
                    {aiyannaStories
                      .sort((a, b) => (a.chapterNumber || 0) - (b.chapterNumber || 0))
                      .map((track, index) => (
                        <TrackCard
                          key={track.id}
                          track={track}
                          isPremium={false}
                        />
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Book 2: Architects of Resonance */}
          <div className="mb-12">
            <div className="bg-black/30 backdrop-blur-sm border border-purple-400/50 rounded-xl overflow-hidden hover:border-amber-400/70 transition-all duration-300">
              <button
                onClick={() => setBook2Expanded(!book2Expanded)}
                onMouseEnter={playButtonHover}
                className="w-full p-6 text-left hover:bg-purple-900/20 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img 
                        src="/attached_assets/Book 2 Aiyanna Architects of Ressonace The Fractured Song_1754066109760.png" 
                        alt="Architects of Resonance Book 2"
                        className="w-16 h-20 object-cover rounded-lg shadow-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="text-2xl font-orbitron font-bold text-amber-400 mb-2">
                        Book 2: Architects of Resonance
                      </h3>
                      <p className="text-purple-300">
                        {language === 'en' ? 'The Fractured Song' : 'La Canción Fracturada'}
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        {aiyannaBook2.length} {text.chapters.toLowerCase()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">
                      <Headphones className="w-4 h-4 mr-2" />
                      Audiobook
                    </Badge>
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                      <Lock className="w-4 h-4 mr-2" />
                      Premium
                    </Badge>
                    {book2Expanded ? <ChevronUp className="w-6 h-6 text-amber-400" /> : <ChevronDown className="w-6 h-6 text-amber-400" />}
                  </div>
                </div>
              </button>

              {book2Expanded && (
                <div className="border-t border-purple-400/30 p-6">
                  <div className="mb-4 p-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg border border-purple-400/50">
                    <p className="text-gray-300 text-center">
                      {text.book2Description}
                    </p>
                  </div>
                  <div className="grid gap-4">
                    {aiyannaBook2
                      .sort((a, b) => (a.chapterNumber || 0) - (b.chapterNumber || 0))
                      .map((track, index) => (
                        <TrackCard
                          key={track.id}
                          track={track}
                          isPremium={true}
                        />
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Book 3: The Whispers of a New World */}
          <div className="mb-12">
            <div className="bg-black/30 backdrop-blur-sm border border-purple-400/50 rounded-xl overflow-hidden hover:border-amber-400/70 transition-all duration-300">
              <button
                onClick={() => setBook3Expanded(!book3Expanded)}
                onMouseEnter={playButtonHover}
                className="w-full p-6 text-left hover:bg-purple-900/20 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img 
                        src="/attached_assets/Book 3 Architects of Resonance The Whispers of a New World_1754066194184.png" 
                        alt="Book 3: The Whispers of a New World"
                        className="w-16 h-20 object-cover rounded-lg shadow-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="text-2xl font-orbitron font-bold text-amber-400 mb-2">
                        Book 3: Architects of Resonance
                      </h3>
                      <p className="text-purple-300">
                        {language === 'en' ? 'The Whispers of a New World' : 'Los Susurros de un Nuevo Mundo'}
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        {aiyannaBook3.length} {text.chapters.toLowerCase()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">
                      <Headphones className="w-4 h-4 mr-2" />
                      Audiobook
                    </Badge>
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                      <Lock className="w-4 h-4 mr-2" />
                      Premium
                    </Badge>
                    {book3Expanded ? <ChevronUp className="w-6 h-6 text-amber-400" /> : <ChevronDown className="w-6 h-6 text-amber-400" />}
                  </div>
                </div>
              </button>

              {book3Expanded && (
                <div className="border-t border-purple-400/30 p-6">
                  <div className="mb-4 p-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg border border-purple-400/50">
                    <p className="text-gray-300 text-center">
                      {text.book3Description}
                    </p>
                  </div>
                  <div className="grid gap-4">
                    {aiyannaBook3
                      .sort((a, b) => (a.chapterNumber || 0) - (b.chapterNumber || 0))
                      .map((track, index) => (
                        <TrackCard
                          key={track.id}
                          track={track}
                          isPremium={true}
                        />
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Audio Player Component */}
        {audioPlayerVisible && (
          <AudioPlayer
            audioFile={currentAudioFile}
            title={currentAudioTitle}
            isVisible={audioPlayerVisible}
            onClose={() => setAudioPlayerVisible(false)}
          />
        )}
      </div>
    </div>
  );
} 
