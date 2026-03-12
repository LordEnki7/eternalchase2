import { useLanguage } from "@/hooks/use-language";
import StarMapBackground from "@/components/StarMapBackground";

export default function HeroSection() {
  const { language } = useLanguage();

  const content = {
    en: {
      title: "ETERNAL CHASE",
      subtitle: "The Pursuit for Love",
      description: "Journey through a three-book cosmic saga where love transcends space and time. Follow Lyra and Kael's eternal chase across fractured realities in this epic audiobook trilogy.",
      enterButton: "Explore the Trilogy",
      soundtrackButton: "Listen to Audiobooks"
    },
    es: {
      title: "PERSECUCIÓN ETERNA",
      subtitle: "La Búsqueda del Amor",
      description: "Viaja a través de una saga cósmica de tres libros donde el amor trasciende el espacio y el tiempo. Sigue la persecución eterna de Lyra y Kael a través de realidades fracturadas en esta trilogía épica de audiolibros.",
      enterButton: "Explorar la Trilogía",
      soundtrackButton: "Escuchar Audiolibros"
    }
  };

  const text = content[language];

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center text-center px-4 relative z-10 overflow-hidden">
      {/* Star Map Background Layer */}
      <StarMapBackground opacity={0.15} animated={true} className="z-0" />
      <div className="max-w-6xl mx-auto cosmic-fade-in">
        {/* Cosmic energy orb */}
        <div className="w-32 h-32 mx-auto mb-8 relative cosmic-float">
          <div className="absolute inset-0 bg-cosmic-gold rounded-full animate-cosmic-pulse energy-glow"></div>
          <div className="absolute inset-4 bg-bright-gold rounded-full animate-pulse"></div>
          <div className="absolute inset-8 bg-starlight rounded-full animate-float"></div>
        </div>
        
        <h1 
          className="font-orbitron text-6xl md:text-8xl font-black mb-6 relative z-20"
          style={{
            color: 'white',
            textShadow: `
              0 0 30px rgba(59, 130, 246, 0.8),
              0 0 60px rgba(249, 115, 22, 0.6),
              0 4px 8px rgba(0, 0, 0, 0.9),
              2px 2px 4px rgba(0, 0, 0, 0.8)
            `,
            WebkitTextStroke: '1px rgba(255, 255, 255, 0.1)'
          }}
        >
          {text.title}
        </h1>
        <p className="text-2xl md:text-3xl mb-4 text-bright-blue font-light">
          {text.subtitle}
        </p>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-12 text-gray-300 leading-relaxed">
          {text.description}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button 
            onClick={() => {
              const trilogySection = document.getElementById('trilogy');
              if (trilogySection) {
                trilogySection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="holographic-border bg-electric-blue/20 hover:bg-electric-blue/40 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 hover:scale-105"
          >
            <i className="fas fa-play mr-2"></i>
            {text.enterButton}
          </button>
          <button 
            onClick={() => {
              const audiobookSection = document.getElementById('audiobooks');
              if (audiobookSection) {
                audiobookSection.scrollIntoView({ behavior: 'smooth' });
              } else {
                // If no audiobooks section, navigate to Young Adult page
                window.location.href = '/young-adult';
              }
            }}
            className="holographic-border bg-cosmic-gold/20 hover:bg-cosmic-gold/40 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 hover:scale-105"
          >
            <i className="fas fa-volume-up mr-2"></i>
            {text.soundtrackButton}
          </button>
        </div>
      </div>
    </section>
  );
}
