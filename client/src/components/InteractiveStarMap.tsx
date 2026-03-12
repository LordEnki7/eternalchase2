import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/hooks/use-language';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Zap, Eye, Navigation, BookOpen, Sparkles, ArrowLeft, Home, Info, ZoomIn, ZoomOut, RotateCcw, Move, X } from 'lucide-react';
import { Link } from 'wouter';
import { HelpTooltip } from '@/components/HelpTooltip';
import CoordinateTracker from '@/components/CoordinateTracker';
const galaxyVideo = '/media/galaxy-background.mp4';

interface StarMapLocation {
  id: string;
  name: {
    en: string;
    es: string;
  };
  position: {
    x: number; // Percentage from left
    y: number; // Percentage from top
  };
  description: {
    en: string;
    es: string;
  };
  significance: {
    en: string;
    es: string;
  };
  type: 'cluster' | 'expanse' | 'portal' | 'rift' | 'veil';
  color: string;
  icon: React.ComponentType<any>;
}

const starMapLocations: StarMapLocation[] = [
  {
    id: 'daranthi-cluster',
    name: {
      en: 'Daranthi Cluster',
      es: 'Cúmulo Daranthi'
    },
    position: { x: 20, y: 20 },
    description: {
      en: 'A mysterious stellar cluster containing ancient artifacts and energy signatures that predate known civilizations.',
      es: 'Un misterioso cúmulo estelar que contiene artefactos antiguos y firmas de energía que preceden a las civilizaciones conocidas.'
    },
    significance: {
      en: 'Home to the first Source resonance discoveries and the birthplace of Aiyanna\'s cosmic journey.',
      es: 'Hogar de los primeros descubrimientos de resonancia de la Fuente y el lugar de nacimiento del viaje cósmico de Aiyanna.'
    },
    type: 'cluster',
    color: '#06b6d4',
    icon: Sparkles
  },
  {
    id: 'oryon-expanse',
    name: {
      en: 'Oryon Expanse',
      es: 'Expansión Oryon'
    },
    position: { x: 80, y: 18 },
    description: {
      en: 'A vast region of space containing the ruins of the precursor civilizations that may have seeded the Source itself.',
      es: 'Una vasta región del espacio que contiene las ruinas de las civilizaciones precursoras que pueden haber sembrado la Fuente misma.'
    },
    significance: {
      en: 'Contains divine codes and forgotten technologies crucial to understanding the Architects of Resonance.',
      es: 'Contiene códigos divinos y tecnologías olvidadas cruciales para entender a los Arquitectos de Resonancia.'
    },
    type: 'expanse',
    color: '#ef4444',
    icon: BookOpen
  },
  {
    id: 'gates-nythra',
    name: {
      en: 'Gates of Nythra',
      es: 'Puertas de Nythra'
    },
    position: { x: 15, y: 55 },
    description: {
      en: 'Ancient dimensional gateways that serve as entry points to hidden realms and alternate dimensions.',
      es: 'Antiguos portales dimensionales que sirven como puntos de entrada a reinos ocultos y dimensiones alternativas.'
    },
    significance: {
      en: 'Critical passage points used during the Spiral War and key to dimensional navigation.',
      es: 'Puntos de paso críticos utilizados durante la Guerra Espiral y clave para la navegación dimensional.'
    },
    type: 'portal',
    color: '#8b5cf6',
    icon: Navigation
  },
  {
    id: 'portals-mournspire',
    name: {
      en: 'Portals of Mournspire',
      es: 'Portales de Mournspire'
    },
    position: { x: 85, y: 65 },
    description: {
      en: 'Dimensional gateways connecting multiple realities, serving as crucial pathways during cosmic conflicts.',
      es: 'Portales dimensionales que conectan múltiples realidades, sirviendo como vías cruciales durante conflictos cósmicos.'
    },
    significance: {
      en: 'Used by Lyra and her allies to escape the Null Order and access the Trisolar dimension.',
      es: 'Utilizados por Lyra y sus aliados para escapar de la Orden Nula y acceder a la dimensión Trisolar.'
    },
    type: 'portal',
    color: '#06b6d4',
    icon: Eye
  },
  {
    id: 'ithan-rift',
    name: {
      en: 'Ithan Rift',
      es: 'Fisura Ithan'
    },
    position: { x: 12, y: 85 },
    description: {
      en: 'A dangerous cosmic anomaly that tears through space-time, creating unstable passages between dimensions.',
      es: 'Una peligrosa anomalía cósmica que rasga el espacio-tiempo, creando pasajes inestables entre dimensiones.'
    },
    significance: {
      en: 'Site of major battles during the cosmic war and a testing ground for dimensional technology.',
      es: 'Sitio de grandes batallas durante la guerra cósmica y campo de pruebas para tecnología dimensional.'
    },
    type: 'rift',
    color: '#f97316',
    icon: Zap
  },
  {
    id: 'veil-icarion',
    name: {
      en: 'Veil of Icarion',
      es: 'Velo de Icarion'
    },
    position: { x: 75, y: 88 },
    description: {
      en: 'A mystical barrier that conceals ancient secrets and serves as the final frontier to cosmic enlightenment.',
      es: 'Una barrera mística que oculta secretos antiguos y sirve como la frontera final hacia la iluminación cósmica.'
    },
    significance: {
      en: 'The location where Aiyanna faces her ultimate transformation into an Architect of Resonance.',
      es: 'El lugar donde Aiyanna enfrenta su transformación definitiva en una Arquitecta de Resonancia.'
    },
    type: 'veil',
    color: '#22d3ee',
    icon: MapPin
  }
];

export default function InteractiveStarMap() {
  const { language } = useLanguage();
  const { playCosmicChime, playPortalActivation, playButtonHover } = useSoundEffects();
  const [selectedLocation, setSelectedLocation] = useState<StarMapLocation | null>(null);
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const LOCK_PAN = true; // Disable panning to keep map stationary
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [nearestLocation, setNearestLocation] = useState<{
    name: string;
    distance: number;
    bearing: number;
  } | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const content = {
    en: {
      title: "Star Map of the Galaxy Altherra",
      subtitle: "Navigate the Cosmic Realms of Eternal Chase",
      explore: "Explore Location",
      close: "Close",
      significance: "Cosmic Significance",
      type: "Location Type",
      coordinates: "Galactic Coordinates"
    },
    es: {
      title: "Mapa Estelar de la Galaxia Altherra",
      subtitle: "Navega los Reinos Cósmicos de Eternal Chase",
      explore: "Explorar Ubicación",
      close: "Cerrar",
      significance: "Significado Cósmico",
      type: "Tipo de Ubicación",
      coordinates: "Coordenadas Galácticas"
    }
  };

  const text = content[language as keyof typeof content];

  const typeLabels = {
    cluster: language === 'en' ? 'Stellar Cluster' : 'Cúmulo Estelar',
    expanse: language === 'en' ? 'Cosmic Expanse' : 'Expansión Cósmica',
    portal: language === 'en' ? 'Dimensional Portal' : 'Portal Dimensional',
    rift: language === 'en' ? 'Space-Time Rift' : 'Fisura Espacio-Temporal',
    veil: language === 'en' ? 'Mystical Veil' : 'Velo Místico'
  };

  useEffect(() => {
    // Add cosmic animation effects
    const handleMouseMove = (e: MouseEvent) => {
      if (!mapRef.current) return;
      
      const rect = mapRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      mapRef.current.style.setProperty('--mouse-x', `${x}%`);
      mapRef.current.style.setProperty('--mouse-y', `${y}%`);
    };

    const mapElement = mapRef.current;
    if (mapElement) {
      mapElement.addEventListener('mousemove', handleMouseMove);
      return () => mapElement.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  // Zoom locked at 100% - no zoom in/out functionality
  const MIN_ZOOM = 1.0;    // Fixed at 100%
  const MAX_ZOOM = 1.0;    // Fixed at 100%
  const LOCK_ZOOM = true;  // Locked at 100% zoom

  // Zoom and pan handlers
  const handleZoom = (delta: number, centerX?: number, centerY?: number) => {
    if (LOCK_ZOOM) return; // Don't allow zooming if locked
    
    const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoomLevel + delta));
    setZoomLevel(newZoom);
    
    // Adjust pan position to zoom towards cursor/center
    if (centerX !== undefined && centerY !== undefined) {
      const zoomFactor = newZoom / zoomLevel;
      setPanPosition(prev => ({
        x: centerX + (prev.x - centerX) * zoomFactor,
        y: centerY + (prev.y - centerY) * zoomFactor
      }));
    }
  };

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const centerX = e.clientX - rect.left - rect.width / 2;
    const centerY = e.clientY - rect.top - rect.height / 2;
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    
    handleZoom(delta, centerX, centerY);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (LOCK_PAN) return; // Don't allow panning if locked
    if (e.button === 0) { // Left mouse button only
      setIsDragging(true);
      setDragStart({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y });
    }
  };

  const handleMapMouseMove = (e: React.MouseEvent) => {
    const mapElement = mapRef.current;
    if (mapElement && !isDragging) {
      const rect = mapElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      mapElement.style.setProperty('--mouse-x', `${x}%`);
      mapElement.style.setProperty('--mouse-y', `${y}%`);
      
      // Update mouse position for coordinate tracking
      setMousePosition({ x, y });
      
      // Calculate nearest location
      let nearest = null;
      let minDistance = Infinity;
      
      starMapLocations.forEach(location => {
        const dx = location.position.x - x;
        const dy = location.position.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < minDistance) {
          minDistance = distance;
          const bearing = (Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360;
          nearest = {
            name: location.name[language as keyof typeof location.name],
            distance: minDistance * 2.5, // Convert to parsecs scale
            bearing
          };
        }
      });
      
      setNearestLocation(nearest);
    }

    if (isDragging && !LOCK_PAN) {
      setPanPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      container.removeEventListener('wheel', handleWheel);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [zoomLevel, panPosition, isDragging, dragStart]);

  // Escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedLocation) {
        setSelectedLocation(null);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [selectedLocation]);

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Bright Cosmic Background - No darkening effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-space-dark/60 via-cosmic-purple/60 to-space-dark/60" />
      <div className="absolute inset-0 starfield-animation opacity-90" />
      
      {/* Bright cosmic glow overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-cosmic-gold/15 via-transparent to-transparent" />
      
      {/* Additional starlight enhancement */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-electric-blue/5 to-transparent" />
      


      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button
                variant="outline"
                className="border-cosmic-gold/50 text-cosmic-gold hover:bg-cosmic-gold/20 bg-space-dark/50 flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                {language === 'en' ? 'Home Portal' : 'Portal Principal'}
              </Button>
            </Link>
            <HelpTooltip
              title={language === 'en' ? 'Home Portal' : 'Portal Principal'}
              content={language === 'en' 
                ? "Return to the main Eternal Chase portal with trilogy overview, character galleries, and subscription options."
                : "Regresa al portal principal de Eternal Chase con resumen de la trilogía, galerías de personajes y opciones de suscripción."
              }
              position="bottom"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <HelpTooltip
              title={language === 'en' ? 'Young Adult' : 'Joven Adulto'}
              content={language === 'en' 
                ? "Return to the Young Adult section featuring Aiyanna's complete saga with character cards and audiobook chapters."
                : "Regresa a la sección Joven Adulto con la saga completa de Aiyanna, tarjetas de personajes y capítulos de audiolibros."
              }
              position="bottom"
            />
            <Link href="/young-adult">
              <Button
                variant="outline"
                className="border-electric-blue/50 text-electric-blue hover:bg-electric-blue/20 bg-space-dark/50 flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {language === 'en' ? 'Back to Young Adult' : 'Volver a Joven Adulto'}
              </Button>
            </Link>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h2 className="font-orbitron text-6xl font-black relative">
              <span className="absolute inset-0 text-bright-gold opacity-20 blur-sm scale-105">
                {text.title}
              </span>
              <span className="relative text-bright-gold drop-shadow-[0_0_20px_rgba(255,215,0,0.8)] drop-shadow-[0_4px_8px_rgba(0,0,0,1)]">
                {text.title}
              </span>
            </h2>
            <HelpTooltip
              title={language === 'en' ? 'Star Map Guide' : 'Guía del Mapa Estelar'}
              content={language === 'en' 
                ? "Interactive galactic map showing 6 major cosmic locations from the Eternal Chase universe. Click on pulsing markers to explore each location's lore and significance to Aiyanna's journey."
                : "Mapa galáctico interactivo que muestra 6 ubicaciones cósmicas principales del universo Eternal Chase. Haz clic en los marcadores pulsantes para explorar la historia y el significado de cada ubicación en el viaje de Aiyanna."
              }
              position="bottom"
              className="mt-4"
            />
          </div>
          <p className="text-xl text-electric-blue font-medium max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
            {text.subtitle}
          </p>
        </div>

        {/* Help Panel */}
        <div className="mb-8 bg-gradient-to-br from-space-dark/50 via-cosmic-purple/20 to-space-dark/50 border border-cosmic-gold/20 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h3 className="font-orbitron text-lg font-bold text-cosmic-gold mb-3 flex items-center gap-2">
                <Navigation className="w-5 h-5" />
                {language === 'en' ? 'Navigation Guide' : 'Guía de Navegación'}
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-electric-blue rounded-full animate-pulse" />
                    <span className="text-gray-300">
                      {language === 'en' 
                        ? 'Hover over markers for quick info' 
                        : 'Pasa sobre marcadores para info rápida'
                      }
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-cosmic-gold rounded-full animate-pulse" />
                    <span className="text-gray-300">
                      {language === 'en' 
                        ? 'Click markers for detailed lore' 
                        : 'Haz clic en marcadores para historia detallada'
                      }
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Eye className="w-4 h-4 text-electric-blue" />
                    <span className="text-gray-300">
                      {language === 'en' 
                        ? 'Mouse movement creates cosmic illumination' 
                        : 'Movimiento del ratón crea iluminación cósmica'
                      }
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Navigation className="w-4 h-4 text-cosmic-gold" />
                    <span className="text-gray-300">
                      {language === 'en' 
                        ? 'Fixed view for optimal exploration' 
                        : 'Vista fija para exploración óptima'
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <HelpTooltip
              title={language === 'en' ? 'Interactive Features' : 'Características Interactivas'}
              content={language === 'en' 
                ? "This interactive Star Map features cosmic illumination that follows your cursor, clickable location markers with detailed lore, and enhanced tooltips. Each location contains rich backstory about Aiyanna's journey through the galaxy."
                : "Este Mapa Estelar interactivo presenta iluminación cósmica que sigue tu cursor, marcadores de ubicación clicables con historia detallada, y tooltips mejorados. Cada ubicación contiene historia rica sobre el viaje de Aiyanna por la galaxia."
              }
              position="left"
            />
          </div>
        </div>

        {/* Map Status Display - No Controls Needed */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-3 bg-gradient-to-r from-space-dark/80 via-cosmic-purple/40 to-space-dark/80 border border-cosmic-gold/30 rounded-xl p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm text-gray-300 font-mono">
                100% {language === 'en' ? 'Fixed Scale' : 'Escala Fija'}
              </span>
            </div>
            <div className="w-px h-4 bg-cosmic-gold/20" />
            <div className="flex items-center gap-2">
              <Navigation className="w-3 h-3 text-electric-blue" />
              <span className="text-xs text-gray-400">
                {language === 'en' ? 'Click markers to explore' : 'Haz clic en marcadores para explorar'}
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Star Map */}
        <div 
          ref={containerRef}
          className="relative overflow-hidden rounded-2xl border-4 border-cosmic-gold/30 shadow-2xl"
          style={{ cursor: LOCK_PAN ? 'default' : (isDragging ? 'grabbing' : 'grab') }}
        >
          <div 
            ref={mapRef}
            className="relative w-full aspect-square max-w-4xl mx-auto group select-none overflow-hidden"
            style={{
              transform: 'none',
              transformOrigin: 'center center'
            }}
            onMouseMove={handleMapMouseMove}
            onMouseDown={handleMouseDown}
          >
            {/* Galaxy Video Background */}
            <video 
              autoPlay 
              muted 
              loop 
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                filter: 'brightness(0.6) contrast(1.4) saturate(1.2)'
              }}
            >
              <source src={galaxyVideo} type="video/mp4" />
            </video>
            
            {/* Interactive mouse gradient overlay */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(251, 191, 36, 0.15) 0%, transparent 50%)`
              }}
            />
            {/* Grid Overlay */}
            <div className="absolute inset-0 opacity-30">
              <div className="w-full h-full grid grid-cols-6 grid-rows-6 border-cosmic-gold/20">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div key={i} className="border border-cosmic-gold/10" />
                ))}
              </div>
            </div>

            {/* Location Markers */}
            {starMapLocations.map((location) => {
              const IconComponent = location.icon;
              const isHovered = hoveredLocation === location.id;
              const isSelected = selectedLocation?.id === location.id;
              
              return (
                <div
                  key={location.id}
                  className="absolute cursor-pointer z-20"
                  style={{
                    left: `${location.position.x}%`,
                    top: `${location.position.y}%`,
                    transform: `translate(-50%, -50%) scale(${1 / zoomLevel})`,
                    transformOrigin: 'center'
                  }}
                  onMouseEnter={() => {
                    setHoveredLocation(location.id);
                    playButtonHover(); // Subtle hover sound
                  }}
                  onMouseLeave={() => setHoveredLocation(null)}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.nativeEvent?.stopImmediatePropagation();
                    
                    // Play cosmic location activation sound
                    if (location.type === 'portal' || location.type === 'rift') {
                      playPortalActivation();
                    } else {
                      playCosmicChime();
                    }
                    
                    console.log('Location marker clicked:', location.name.en);
                    
                    // Create a simple in-page notification instead of popup
                    const notification = document.createElement('div');
                    notification.style.cssText = `
                      position: fixed;
                      top: 50%;
                      left: 50%;
                      transform: translate(-50%, -50%);
                      background: linear-gradient(135deg, #1a1a2e, #16213e);
                      border: 2px solid #ffd700;
                      border-radius: 12px;
                      padding: 20px;
                      color: white;
                      z-index: 10000;
                      max-width: 400px;
                      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                      font-family: Arial, sans-serif;
                    `;
                    
                    notification.innerHTML = `
                      <h3 style="color: #ffd700; margin-bottom: 10px; font-size: 18px;">${location.name[language as keyof typeof location.name]}</h3>
                      <p style="margin-bottom: 10px; line-height: 1.4;">${location.description[language as keyof typeof location.description]}</p>
                      <p style="color: #00bfff; font-size: 14px; margin-bottom: 10px;">Type: ${typeLabels[location.type]}</p>
                      <p style="color: #ccc; font-size: 12px; margin-bottom: 15px;">Coordinates: ${location.position.x.toFixed(1)}°, ${location.position.y.toFixed(1)}°</p>
                      <button onclick="this.parentElement.remove()" style="
                        background: #ffd700;
                        color: #1a1a2e;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 6px;
                        cursor: pointer;
                        font-weight: bold;
                      ">Close</button>
                    `;
                    
                    document.body.appendChild(notification);
                    
                    // Auto-remove after 10 seconds
                    setTimeout(() => {
                      if (notification.parentElement) {
                        notification.remove();
                      }
                    }, 10000);
                  }}
                >
                  {/* Pulsing Ring */}
                  <div 
                    className={`absolute inset-0 rounded-full border-2 animate-ping transition-all duration-300 pointer-events-none ${
                      isHovered || isSelected ? 'scale-150' : 'scale-100'
                    }`}
                    style={{ borderColor: location.color }}
                  />
                  
                  {/* Main Marker */}
                  <div 
                    className={`relative w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 backdrop-blur-sm ${
                      isHovered || isSelected 
                        ? 'scale-125 shadow-lg' 
                        : 'scale-100'
                    }`}
                    style={{ 
                      borderColor: location.color,
                      backgroundColor: `${location.color}20`,
                      boxShadow: isHovered || isSelected ? `0 0 20px ${location.color}` : 'none'
                    }}
                  >
                    <IconComponent 
                      className="w-6 h-6" 
                      style={{ color: location.color }}
                    />
                  </div>

                  {/* Enhanced Hover Tooltip */}
                  {isHovered && !selectedLocation && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-30">
                      <div className="bg-gradient-to-br from-space-dark to-cosmic-purple/40 border border-cosmic-gold/30 rounded-lg px-4 py-3 whitespace-nowrap shadow-xl backdrop-blur-sm max-w-xs">
                        <p className="text-sm font-bold text-cosmic-gold mb-1">
                          {location.name[language as keyof typeof location.name]}
                        </p>
                        <p className="text-xs text-gray-300 mb-2">
                          {typeLabels[location.type]}
                        </p>
                        <p className="text-xs text-electric-blue font-medium">
                          {language === 'en' ? 'Click to explore details' : 'Haz clic para explorar'}
                        </p>
                        <p className="text-xs text-gray-500 font-mono mt-1">
                          {location.position.x.toFixed(1)}°, {location.position.y.toFixed(1)}°
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Central Galaxy Label - Hidden to avoid duplication with map image */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0">
              <div className="text-center">
                <h3 className="font-orbitron text-4xl font-bold text-white tracking-wider">
                  ALTHERRA
                </h3>
                <h4 className="font-orbitron text-2xl font-bold text-white tracking-wider">
                  GALAXY
                </h4>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(typeLabels).map(([type, label]) => {
            const location = starMapLocations.find(loc => loc.type === type);
            if (!location) return null;
            
            const IconComponent = location.icon;
            
            return (
              <div 
                key={type}
                className="flex items-center gap-3 p-3 bg-space-dark/60 backdrop-blur-sm border border-cosmic-gold/20 rounded-lg hover:border-cosmic-gold/40 transition-all duration-300"
              >
                <div 
                  className="w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0"
                  style={{ 
                    borderColor: location.color,
                    backgroundColor: `${location.color}20`
                  }}
                >
                  <IconComponent 
                    className="w-4 h-4" 
                    style={{ color: location.color }}
                  />
                </div>
                <span className="text-sm text-gray-300 font-medium">
                  {label}
                </span>
              </div>
            );
          })}
        </div>


      </div>
    </section>
  );
}