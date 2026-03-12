import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { Play, Heart, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const lyraCard = "/media/characters/lyra.png";
const kaelCard = "/media/characters/kael.png";
const lyraKaelCard = "/media/characters/lyra-and-kael.png";
const grandmaAmaCard = "/media/characters/grandma-ama.png";
const ixoraCard = "/media/characters/ixora.png";
const mayaCard = "/media/characters/maya.png";
const rivenCard = "/media/characters/riven.png";
const architectCard = "/media/characters/the-architect.png";
const firstMindCard = "/media/characters/the-first-mind.png";
const heraldCard = "/media/characters/the-herald.png";
const sourceCard = "/media/characters/the-source.png";

export default function CharacterGallery() {
  const { language } = useLanguage();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [likedCharacters, setLikedCharacters] = useState<Set<number>>(new Set());

  const content = {
    en: {
      title: "COSMIC CHRONICLES",
      subtitle: "Meet the legendary beings whose destinies intertwine across the stars",
      playVoice: "Play Voice",
      addFavorite: "Add to Favorites",
      viewDetails: "View Details",
      cosmicPower: "Cosmic Power",
      element: "Element"
    },
    es: {
      title: "CRÓNICAS CÓSMICAS", 
      subtitle: "Conoce a los seres legendarios cuyos destinos se entrelazan a través de las estrellas",
      playVoice: "Reproducir Voz",
      addFavorite: "Añadir a Favoritos",
      viewDetails: "Ver Detalles",
      cosmicPower: "Poder Cósmico",
      element: "Elemento"
    }
  };

  const text = content[language];

  // Enhanced character data with interactive elements
  const characterData = [
    {
      image: lyraCard,
      name: { en: "Lyra", es: "Lyra" },
      element: { en: "Light & Time", es: "Luz y Tiempo" },
      power: { en: "Temporal Manipulation", es: "Manipulación Temporal" },
      quote: { en: "Every choice echoes across eternity", es: "Cada elección resuena a través de la eternidad" },
      voicePreview: "lyra-preview.wav"
    },
    {
      image: kaelCard,
      name: { en: "Kael", es: "Kael" },
      element: { en: "Shadow & Space", es: "Sombra y Espacio" },
      power: { en: "Dimensional Rifts", es: "Fisuras Dimensionales" },
      quote: { en: "In darkness, we find our true strength", es: "En la oscuridad, encontramos nuestra verdadera fuerza" },
      voicePreview: "kael-preview.wav"
    },
    {
      image: lyraKaelCard,
      name: { en: "Lyra & Kael", es: "Lyra y Kael" },
      element: { en: "Unity", es: "Unidad" },
      power: { en: "Cosmic Resonance", es: "Resonancia Cósmica" },
      quote: { en: "Together, we transcend all boundaries", es: "Juntos, trascendemos todos los límites" },
      voicePreview: "unity-preview.wav"
    },
    {
      image: grandmaAmaCard,
      name: { en: "Grandma Ama", es: "Abuela Ama" },
      element: { en: "Wisdom", es: "Sabiduría" },
      power: { en: "Ancient Knowledge", es: "Conocimiento Ancestral" },
      quote: { en: "The old ways hold the keys to tomorrow", es: "Las viejas costumbres guardan las llaves del mañana" },
      voicePreview: "ama-preview.wav"
    },
    {
      image: ixoraCard,
      name: { en: "Ixora", es: "Ixora" },
      element: { en: "Nature & Growth", es: "Naturaleza y Crecimiento" },
      power: { en: "Life Force Manipulation", es: "Manipulación de Fuerza Vital" },
      quote: { en: "From the smallest seed, galaxies bloom", es: "De la semilla más pequeña, florecen galaxias" },
      voicePreview: "ixora-preview.wav"
    },
    {
      image: mayaCard,
      name: { en: "Maya", es: "Maya" },
      element: { en: "Mind & Illusion", es: "Mente e Ilusión" },
      power: { en: "Reality Perception", es: "Percepción de la Realidad" },
      quote: { en: "What is real? What you choose to see", es: "¿Qué es real? Lo que eliges ver" },
      voicePreview: "maya-preview.wav"
    },
    {
      image: rivenCard,
      name: { en: "Riven", es: "Riven" },
      element: { en: "Chaos & Change", es: "Caos y Cambio" },
      power: { en: "Entropy Control", es: "Control de Entropía" },
      quote: { en: "In chaos lies infinite possibility", es: "En el caos yace la posibilidad infinita" },
      voicePreview: "riven-preview.wav"
    },
    {
      image: architectCard,
      name: { en: "The Architect", es: "El Arquitecto" },
      element: { en: "Creation", es: "Creación" },
      power: { en: "Reality Construction", es: "Construcción de Realidad" },
      quote: { en: "I design the very fabric of existence", es: "Diseño la misma estructura de la existencia" },
      voicePreview: "architect-preview.wav"
    },
    {
      image: firstMindCard,
      name: { en: "The First Mind", es: "La Primera Mente" },
      element: { en: "Origin", es: "Origen" },
      power: { en: "Primordial Consciousness", es: "Conciencia Primordial" },
      quote: { en: "Before thought, there was intention", es: "Antes del pensamiento, hubo intención" },
      voicePreview: "firstmind-preview.wav"
    },
    {
      image: heraldCard,
      name: { en: "The Herald", es: "El Heraldo" },
      element: { en: "Message", es: "Mensaje" },
      power: { en: "Cosmic Communication", es: "Comunicación Cósmica" },
      quote: { en: "I carry words that shape worlds", es: "Llevo palabras que dan forma a mundos" },
      voicePreview: "herald-preview.wav"
    },
    {
      image: sourceCard,
      name: { en: "The Source", es: "La Fuente" },
      element: { en: "Everything", es: "Todo" },
      power: { en: "Infinite Potential", es: "Potencial Infinito" },
      quote: { en: "I am the alpha and omega of all stories", es: "Soy el alfa y omega de todas las historias" },
      voicePreview: "source-preview.wav"
    }
  ];

  const toggleLike = (index: number) => {
    setLikedCharacters(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const playVoicePreview = (voiceFile: string) => {
    // Create cosmic sound effect for voice preview
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(220, audioContext.currentTime + 0.5);
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
    
    console.log(`Playing voice preview: ${voiceFile}`);
  };

  return (
    <section id="characters" className="min-h-screen py-20 px-4 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 cosmic-fade-in">
          <h2 className="font-orbitron text-5xl font-bold mb-6 bg-gradient-to-r from-cosmic-gold to-bright-gold bg-clip-text text-transparent">
            {text.title}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {text.subtitle}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 relative z-10">
          {characterData.map((character, index) => (
            <div 
              key={index} 
              className="group cursor-pointer transform hover:scale-105 transition-all duration-500 hover:z-10"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-cosmic-purple/20 to-electric-blue/10 border border-cosmic-gold/30">
                <img 
                  src={character.image}
                  alt={character.name[language]}
                  className="w-full h-auto object-cover rounded-2xl transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Interactive Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-all duration-500 rounded-2xl ${
                  hoveredCard === index ? 'opacity-100' : 'opacity-0'
                }`}>
                  
                  {/* Character Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-orbitron text-lg font-bold text-cosmic-gold mb-2">
                      {character.name[language]}
                    </h3>
                    
                    <div className="flex gap-2 mb-3">
                      <Badge className="bg-electric-blue/30 text-electric-blue border-electric-blue/50 text-xs">
                        {text.element}: {character.element[language]}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-300 mb-3 italic">
                      "{character.quote[language]}"
                    </p>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          playVoicePreview(character.voicePreview);
                        }}
                        className="bg-cosmic-gold/20 hover:bg-cosmic-gold/40 text-cosmic-gold border-cosmic-gold/50 flex-1"
                      >
                        <Play className="w-3 h-3 mr-1" />
                        {text.playVoice}
                      </Button>
                      
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(index);
                        }}
                        className={`${
                          likedCharacters.has(index)
                            ? 'bg-red-500/30 text-red-400 border-red-500/50'
                            : 'bg-gray-500/20 text-gray-400 border-gray-500/50'
                        } hover:bg-red-500/40`}
                      >
                        <Heart className={`w-3 h-3 ${likedCharacters.has(index) ? 'fill-current' : ''}`} />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Cosmic Power Indicator */}
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className="w-3 h-3 text-cosmic-gold fill-current animate-pulse" 
                          style={{ animationDelay: `${i * 0.1}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Liked Indicator */}
                {likedCharacters.has(index) && (
                  <div className="absolute top-4 left-4 bg-red-500/80 rounded-full p-2 animate-pulse">
                    <Heart className="w-4 h-4 text-white fill-current" />
                  </div>
                )}
                
                {/* Cosmic Energy Effect */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-br from-cosmic-gold/10 via-transparent to-electric-blue/10 animate-pulse"></div>
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cosmic-gold to-transparent animate-pulse"></div>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-electric-blue to-transparent animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                </div>
                
                {/* Cosmic glow effect on hover */}
                <div className="absolute -inset-1 bg-gradient-to-r from-cosmic-gold via-electric-blue to-cosmic-gold rounded-2xl opacity-0 group-hover:opacity-75 blur-lg transition-all duration-300 -z-10"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
