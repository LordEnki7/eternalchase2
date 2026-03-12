import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import CosmicParticles from '@/components/CosmicParticles';

interface Character {
  id: string;
  name: string | { en: string; es: string };
  image?: string;
  imageUrl?: string;
  element?: string;
  role?: string;
  abilities?: { en: string; es: string };
  stats?: Array<{ name: string; value: number; color?: string }>;
  quote: {
    en: string;
    es: string;
  };
  description: {
    en: string;
    es: string;
  };
  details?: {
    en: string[];
    es: string[];
  };
  videoUrl?: string;
  hasVideo?: boolean;
}

interface CharacterCardProps {
  character: Character;
}

export default function CharacterCard({ character }: CharacterCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const { language } = useLanguage();

  // Handle different name formats
  const characterName = typeof character.name === 'string' ? character.name : character.name[language];
  const characterImage = character.image || character.imageUrl;
  
  const quote = character.quote[language];


  const description = character.description[language];
  const details = character.details?.[language] || [];

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
    
    // Voice over integration
    if (typeof window !== 'undefined' && (window as any).speakText) {
      const textToSpeak = isFlipped ? characterName : quote;
      (window as any).speakText(textToSpeak);
    }
  };

  return (
    <div 
      className="card-flip h-auto min-h-[600px] cursor-pointer relative overflow-hidden"
      onClick={handleCardClick}
    >
      <div className={`card-inner ${isFlipped ? 'transform rotate-y-180' : ''}`}>
        {/* Front of card - Trading Card Style */}
        <div className="card-front w-full h-[600px] [backface-visibility:hidden]">
          <div className="bg-gradient-to-b from-amber-600 via-amber-700 to-amber-800 p-6 rounded-2xl shadow-2xl border-8 border-amber-500 h-full">
            <div className="bg-black rounded-xl overflow-hidden h-full flex flex-col relative">
              {/* Character Name at Top */}
              <div className="absolute top-4 left-4 right-4 z-10">
                <h3 className="font-orbitron text-3xl font-bold text-amber-400 text-center tracking-wider drop-shadow-2xl">
                  {characterName.toUpperCase()}
                </h3>
              </div>
              
              {/* Character Image/Video - Full Card */}
              <div className="flex-1 relative group">

                {character.hasVideo && character.videoUrl ? (
                  <div className="w-full h-full bg-red-500 border-4 border-yellow-400">
                    <div className="text-white p-2 text-xs">Video Area: {character.id}</div>
                    <video 
                      muted 
                      loop 
                      playsInline
                      preload="auto"
                      controls
                      className="w-full h-full object-cover cursor-pointer"
                      src={character.videoUrl}
                      onMouseEnter={(e) => {
                        console.log('HOVER: Playing video for:', character.id);
                        const video = e.target as HTMLVideoElement;
                        video.play().catch(err => console.error('Play failed:', err));
                      }}
                      onMouseLeave={(e) => {
                        console.log('HOVER END: Pausing video for:', character.id);
                        const video = e.target as HTMLVideoElement;
                        video.pause();
                        video.currentTime = 0;
                      }}
                      onError={(e) => {
                        console.error('VIDEO ERROR:', character.id, character.videoUrl, e);
                      }}
                      onLoadedData={() => {
                        console.log('VIDEO LOADED:', character.id);
                      }}
                      onCanPlay={() => {
                        console.log('VIDEO CAN PLAY:', character.id);
                      }}
                    >
                      <source src={character.videoUrl} type="video/mp4" />
                    </video>
                  </div>
                ) : characterImage ? (
                  <img 
                    src={characterImage} 
                    alt={characterName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-cosmic-gold/20 to-electric-blue/20 flex items-center justify-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-cosmic-gold to-bright-gold rounded-full flex items-center justify-center">
                      <span className="text-4xl font-orbitron font-bold text-space-dark">
                        {characterName.substring(0, 2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Stats and Info at Bottom */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent p-6">
                {character.stats && (
                  <div className="space-y-3 mb-4">
                    {character.stats.map((stat, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-amber-400 font-orbitron font-bold text-lg tracking-wide">
                          {stat.name}
                        </span>
                        <div className="flex-1 mx-4 bg-gray-800 rounded-full h-3 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-full transition-all duration-300"
                            style={{ width: `${stat.value}%` }}
                          />
                        </div>
                        <span className="text-cyan-400 font-bold text-lg w-8">
                          {stat.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Quote */}
                <div className="text-center">
                  <p className="text-amber-300 text-lg italic font-medium leading-relaxed">
                    "{quote}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back of card - Trading Card Style */}
        <div className="card-back absolute inset-0 w-full h-[600px] [backface-visibility:hidden] rotate-y-180">
          <div className="bg-gradient-to-b from-amber-600 via-amber-700 to-amber-800 p-6 rounded-2xl shadow-2xl border-8 border-amber-500 h-full">
            <div className="bg-black rounded-xl p-8 h-full flex flex-col">
              <h3 className="font-orbitron text-3xl font-bold text-amber-400 mb-6 text-center tracking-wider">
                {characterName.toUpperCase()}
              </h3>
              
              <div className="flex-1 flex flex-col gap-6">
                {character.element && character.role && (
                  <div className="text-center">
                    <p className="text-2xl text-amber-300 font-orbitron font-bold mb-2">
                      {character.element}
                    </p>
                    <p className="text-xl text-cyan-400 font-semibold">
                      {character.role}
                    </p>
                  </div>
                )}

                {character.stats && (
                  <div className="space-y-4">
                    <h4 className="text-amber-400 font-orbitron font-bold text-xl text-center">ABILITIES</h4>
                    {character.stats.map((stat, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-amber-400 font-orbitron font-bold text-lg tracking-wide">
                          {stat.name}
                        </span>
                        <div className="flex-1 mx-4 bg-gray-800 rounded-full h-3 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-full transition-all duration-300"
                            style={{ width: `${stat.value}%` }}
                          />
                        </div>
                        <span className="text-cyan-400 font-bold text-lg w-8">
                          {stat.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="text-center">
                  <p className="text-amber-300 text-xl italic font-medium leading-relaxed">
                    "{quote}"
                  </p>
                </div>

                <div className="text-center space-y-2">
                  {details.map((detail, index) => (
                    <div key={index} className="text-cyan-300 text-lg font-medium">
                      {detail}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
