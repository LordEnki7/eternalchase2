import { useState } from 'react';
import { useLanguage } from '@/hooks/use-language';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Book, Users, Crown, Sparkles } from 'lucide-react';
import PageTransition from './PageTransition';

interface UniverseLoreProps {
  className?: string;
}

export default function UniverseLore({ className = "" }: UniverseLoreProps) {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');

  const mainTrilogyCharacters = [
    {
      id: 'lyra',
      name: 'Lyra (formerly Aiyanna)',
      role: language === 'en' ? 'Cosmic Conduit / Source-bearer' : 'Conducto Cósmico / Portadora de la Fuente',
      origin: language === 'en' ? 'Planet Amara, raised on Earth' : 'Planeta Amara, criada en la Tierra',
      element: language === 'en' ? 'Starfire / Love' : 'Fuego Estelar / Amor',
      description: language === 'en' 
        ? 'As Aiyanna, she witnessed her parents\' death through a hidden cosmic mirror. Reborn as Lyra when the Source chose her. Her journey defines the trilogy—from awakening through sacrifice to ascension.'
        : 'Como Aiyanna, presenció la muerte de sus padres a través de un espejo cósmico oculto. Renació como Lyra cuando la Fuente la eligió. Su viaje define la trilogía: del despertar a través del sacrificio hasta la ascensión.'
    },
    {
      id: 'kael',
      name: 'Kael',
      role: language === 'en' ? 'Warrior of the Spiral Wars' : 'Guerrero de las Guerras Espirales',
      origin: language === 'en' ? 'Planet Virex' : 'Planeta Virex',
      element: language === 'en' ? 'Gravity Blade / Honor' : 'Hoja de Gravedad / Honor',
      description: language === 'en'
        ? 'Raised in elite defense academies, trained to fight but never loved. Meeting Lyra changed him. Together, they become one in the Fusion Card as Ascended Love.'
        : 'Criado en academias de defensa de élite, entrenado para luchar pero nunca amó. Conocer a Lyra lo cambió. Juntos, se convierten en uno en la Carta de Fusión como Amor Ascendido.'
    },
    {
      id: 'riven',
      name: 'Riven',
      role: language === 'en' ? 'Fractured Catalyst / Source Absorber' : 'Catalizador Fracturado / Absorbedor de la Fuente',
      origin: language === 'en' ? 'Unstable dimension' : 'Dimensión inestable',
      element: language === 'en' ? 'Fracture / Identity' : 'Fractura / Identidad',
      description: language === 'en'
        ? 'Split across realities, holds contradictions and chaos within. His arc climaxes with him absorbing aspects of the Source no other could endure.'
        : 'Dividido a través de realidades, contiene contradicciones y caos en su interior. Su arco culmina con él absorbiendo aspectos de la Fuente que ningún otro podría soportar.'
    }
  ];

  const youngAdultCharacters = [
    {
      id: 'aiyanna',
      name: 'Aiyanna (Young Lyra)',
      age: '12',
      element: language === 'en' ? 'Source Touch / Vision' : 'Toque de la Fuente / Visión',
      description: language === 'en'
        ? 'Born with a mark tied to the Source. Curious, brave, and often misunderstood. Her visions show her cosmic destiny.'
        : 'Nacida con una marca ligada a la Fuente. Curiosa, valiente y a menudo incomprendida. Sus visiones muestran su destino cósmico.'
    },
    {
      id: 'paisley',
      name: 'Paisley',
      traits: language === 'en' ? 'Loyal, funny, skeptical' : 'Leal, divertida, escéptica',
      description: language === 'en'
        ? 'Grounded voice of reason who keeps Aiyanna anchored during early visions.'
        : 'Voz calmada de la razón que mantiene a Aiyanna tranquila durante sus primeras visiones.'
    },
    {
      id: 'tariq',
      name: 'Tariq',
      traits: language === 'en' ? 'Adventurous, protective, kind' : 'Aventurero, protector, amable',
      description: language === 'en'
        ? 'Childhood friend and aspiring explorer. Unlocks latent powers after a close call in Book 2.'
        : 'Amigo de la infancia y aspirante a explorador. Desbloquea poderes latentes después de un momento crítico en el Libro 2.'
    },
    {
      id: 'zarek',
      name: 'Zarek',
      traits: language === 'en' ? 'Guarded, strategic, secretive' : 'Cauteloso, estratégico, reservado',
      description: language === 'en'
        ? 'The mysterious new kid from a different dimension. Can sense fractures in time and space.'
        : 'El nuevo chico misterioso de una dimensión diferente. Puede sentir fracturas en el tiempo y el espacio.'
    }
  ];

  const multiversalEntities = [
    {
      id: 'velo-entity',
      name: language === 'en' ? 'The Velo Entity' : 'La Entidad Velo',
      role: language === 'en' ? 'Antagonist / Devourer of Choice' : 'Antagonista / Devorador de Elección',
      element: language === 'en' ? 'Void / Control' : 'Vacío / Control',
      description: language === 'en'
        ? 'Emerged from cracks in reality as choice began to erode. Represents entropy and the fear of uncertainty.'
        : 'Surgió de las grietas en la realidad cuando la elección comenzó a erosionarse. Representa la entropía y el miedo a la incertidumbre.'
    },
    {
      id: 'architect',
      name: language === 'en' ? 'The Architect' : 'La Arquitecta',
      role: language === 'en' ? 'Original Cosmic Designer' : 'Diseñadora Cósmica Original',
      element: language === 'en' ? 'Light / Pattern' : 'Luz / Patrón',
      description: language === 'en'
        ? 'Ancient female creator who helped forge the Source structure. Vanished after the first collapse.'
        : 'Antigua creadora femenina que ayudó a forjar la estructura de la Fuente. Desapareció después del primer colapso.'
    },
    {
      id: 'star-map-altherra',
      name: language === 'en' ? 'The Star Map of Altherra' : 'El Mapa Estelar de Altherra',
      role: language === 'en' ? 'Celestial Navigation System' : 'Sistema de Navegación Celestial',
      element: language === 'en' ? 'Galactic Light Network' : 'Red de Luz Galáctica',
      description: language === 'en'
        ? 'A sprawling, living star chart crafted by the lost Helari cartographers. Responds to the presence of Source-bearers and maps safe routes and unstable zones across the 50-million-light-year sprawl.'
        : 'Un extenso mapa estelar viviente creado por los perdidos cartógrafos Helari. Responde a la presencia de portadores de la Fuente y mapea rutas seguras y zonas inestables a través de la extensión de 50 millones de años luz.'
    },
    {
      id: 'portals-mournspire',
      name: language === 'en' ? 'The Portals of Mournspire' : 'Los Portales de Mournspire',
      role: language === 'en' ? 'Dimensional Gateways' : 'Portales Dimensionales',
      element: language === 'en' ? 'Wormhole / Memory' : 'Agujero de Gusano / Memoria',
      description: language === 'en'
        ? 'Ancient ruins now cracked and forbidden. Once used to move armies and ideas in the Spiral War, these dimensional gateways are now guarded by Velo fragments. Only the brave dare traverse them.'
        : 'Ruinas antiguas ahora agrietadas y prohibidas. Una vez utilizados para mover ejércitos e ideas en la Guerra Espiral, estos portales dimensionales ahora están custodiados por fragmentos de Velo. Solo los valientes se atreven a atravesarlos.'
    },
    {
      id: 'lost-civilizations-oryon',
      name: language === 'en' ? 'The Lost Civilizations of Oryon' : 'Las Civilizaciones Perdidas de Oryon',
      role: language === 'en' ? 'Precursor Species' : 'Especies Precursoras',
      element: language === 'en' ? 'Echo / Forgotten Technologies' : 'Eco / Tecnologías Olvidadas',
      description: language === 'en'
        ? 'Advanced societies from planets swallowed in the Source eruption. These precursor civilizations may have seeded parts of the Source itself. Their scattered ruins hold cryptic messages, ancient traps, and divine codes waiting to be deciphered.'
        : 'Sociedades avanzadas de planetas engullidos en la erupción de la Fuente. Estas civilizaciones precursoras pueden haber sembrado partes de la Fuente misma. Sus ruinas dispersas contienen mensajes crípticos, trampas antiguas y códigos divinos esperando ser descifrados.'
    }
  ];

  return (
    <PageTransition className={`py-20 ${className}`}>
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 cosmic-fade-in">
          <h2 className="text-5xl font-orbitron font-bold text-cosmic-gold mb-6">
            {language === 'en' ? 'Eternal Universe Compendium' : 'Compendio del Universo Eterno'}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {language === 'en' 
              ? 'Explore the rich tapestry of characters that define the Eternal Chase universe—from the main trilogy to the Young Adult sub-series, each soul chasing love, truth, or power across dimensions.'
              : 'Explora el rico tapiz de personajes que definen el universo de Eternal Chase: desde la trilogía principal hasta la sub-serie de Jóvenes Adultos, cada alma persiguiendo amor, verdad o poder a través de dimensiones.'
            }
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-12 bg-space-dark/50 holographic-border">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-cosmic-gold data-[state=active]:text-black font-orbitron"
            >
              <Book className="w-4 h-4 mr-2" />
              {language === 'en' ? 'Overview' : 'Resumen'}
            </TabsTrigger>
            <TabsTrigger 
              value="main-trilogy"
              className="data-[state=active]:bg-cosmic-gold data-[state=active]:text-black font-orbitron"
            >
              <Crown className="w-4 h-4 mr-2" />
              {language === 'en' ? 'Main Trilogy' : 'Trilogía Principal'}
            </TabsTrigger>
            <TabsTrigger 
              value="young-adult"
              className="data-[state=active]:bg-cosmic-gold data-[state=active]:text-black font-orbitron"
            >
              <Users className="w-4 h-4 mr-2" />
              {language === 'en' ? 'Young Adult' : 'Jóvenes Adultos'}
            </TabsTrigger>
            <TabsTrigger 
              value="entities"
              className="data-[state=active]:bg-cosmic-gold data-[state=active]:text-black font-orbitron"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {language === 'en' ? 'Cosmic Entities' : 'Entidades Cósmicas'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="cosmic-slide-up">
            <Card className="holographic-border bg-space-dark/80">
              <CardHeader>
                <CardTitle className="text-3xl font-orbitron text-cosmic-gold text-center">
                  {language === 'en' ? 'Universe Structure' : 'Estructura del Universo'}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-orbitron text-bright-blue mb-4">
                      {language === 'en' ? 'The Main Trilogy' : 'La Trilogía Principal'}
                    </h3>
                    <p className="leading-relaxed">
                      {language === 'en'
                        ? 'The core saga following Lyra\'s journey from cosmic awakening to universal ascension. These characters blend biographical detail with mythic context, showing the evolution from individual struggles to cosmic responsibilities.'
                        : 'La saga central que sigue el viaje de Lyra desde el despertar cósmico hasta la ascensión universal. Estos personajes mezclan detalles biográficos con contexto mítico, mostrando la evolución desde luchas individuales hasta responsabilidades cósmicas.'
                      }
                    </p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-orbitron text-bright-blue mb-4">
                      {language === 'en' ? 'Young Adult Sub-Series' : 'Sub-Serie de Jóvenes Adultos'}
                    </h3>
                    <p className="leading-relaxed">
                      {language === 'en'
                        ? 'The Rise of Aiyanna chronicles the early adventures of young Lyra and her companions. These stories explore the characters\' origins and the awakening of their cosmic abilities during their formative years.'
                        : 'El Ascenso de Aiyanna narra las primeras aventuras de la joven Lyra y sus compañeros. Estas historias exploran los orígenes de los personajes y el despertar de sus habilidades cósmicas durante sus años formativos.'
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="main-trilogy" className="cosmic-slide-up">
            <div className="grid gap-6">
              {mainTrilogyCharacters.map((character, index) => (
                <Card key={character.id} className="holographic-border bg-space-dark/80 cosmic-float" style={{ animationDelay: `${index * 0.2}s` }}>
                  <CardHeader>
                    <CardTitle className="text-2xl font-orbitron text-cosmic-gold flex items-center gap-3">
                      {character.name}
                      <Badge className="bg-cosmic-purple/20 text-purple-300 border-purple-500/30">
                        {character.role}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-bright-blue font-semibold">
                          {language === 'en' ? 'Origin:' : 'Origen:'}
                        </span>
                        <span className="text-gray-300 ml-2">{character.origin}</span>
                      </div>
                      <div>
                        <span className="text-bright-blue font-semibold">
                          {language === 'en' ? 'Element:' : 'Elemento:'}
                        </span>
                        <span className="text-gray-300 ml-2">{character.element}</span>
                      </div>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{character.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="young-adult" className="cosmic-slide-up">
            <div className="grid md:grid-cols-2 gap-6">
              {youngAdultCharacters.map((character, index) => (
                <Card key={character.id} className="holographic-border bg-space-dark/80 cosmic-float" style={{ animationDelay: `${index * 0.15}s` }}>
                  <CardHeader>
                    <CardTitle className="text-xl font-orbitron text-cosmic-gold">
                      {character.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {'age' in character && (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        {language === 'en' ? 'Age' : 'Edad'}: {character.age}
                      </Badge>
                    )}
                    {'element' in character && (
                      <div className="text-sm">
                        <span className="text-bright-blue font-semibold">
                          {language === 'en' ? 'Element:' : 'Elemento:'}
                        </span>
                        <span className="text-gray-300 ml-2">{character.element}</span>
                      </div>
                    )}
                    {'traits' in character && (
                      <div className="text-sm">
                        <span className="text-bright-blue font-semibold">
                          {language === 'en' ? 'Traits:' : 'Rasgos:'}
                        </span>
                        <span className="text-gray-300 ml-2">{character.traits}</span>
                      </div>
                    )}
                    <p className="text-gray-300 leading-relaxed">{character.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="entities" className="cosmic-slide-up">
            <div className="grid gap-6">
              {multiversalEntities.map((entity, index) => (
                <Card key={entity.id} className="holographic-border bg-space-dark/80 cosmic-float" style={{ animationDelay: `${index * 0.3}s` }}>
                  <CardHeader>
                    <CardTitle className="text-2xl font-orbitron text-cosmic-gold flex items-center gap-3">
                      {entity.name}
                      <Badge className={`${
                        entity.id === 'star-map-altherra' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                        entity.id === 'portals-mournspire' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
                        entity.id === 'lost-civilizations-oryon' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                        'bg-red-500/20 text-red-400 border-red-500/30'
                      }`}>
                        {entity.role}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm">
                      <span className="text-bright-blue font-semibold">
                        {language === 'en' ? 'Element:' : 'Elemento:'}
                      </span>
                      <span className="text-gray-300 ml-2">{entity.element}</span>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{entity.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
}