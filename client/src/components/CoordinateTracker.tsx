import React, { useState, useEffect } from 'react';
import { Navigation, Target, Crosshair, MapPin } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

interface CoordinateTrackerProps {
  mousePosition: { x: number; y: number };
  zoomLevel: number;
  panPosition: { x: number; y: number };
  nearestLocation?: {
    name: string;
    distance: number;
    bearing: number;
  } | null;
}

export default function CoordinateTracker({ 
  mousePosition, 
  zoomLevel, 
  panPosition,
  nearestLocation 
}: CoordinateTrackerProps) {
  const { language } = useLanguage();
  const [animatedCoords, setAnimatedCoords] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);
  const [pulsePhase, setPulsePhase] = useState(0);

  // Convert screen coordinates to galactic coordinates
  const galacticX = ((mousePosition.x / 100) * 360 - 180).toFixed(1);
  const galacticY = ((1 - mousePosition.y / 100) * 180 - 90).toFixed(1);
  
  // Sector calculation based on galactic coordinates
  const sectorX = Math.floor((parseFloat(galacticX) + 180) / 60);
  const sectorY = Math.floor((parseFloat(galacticY) + 90) / 30);
  const sectorName = `${String.fromCharCode(65 + sectorX)}${sectorY + 1}`;

  useEffect(() => {
    setIsActive(mousePosition.x !== 0 || mousePosition.y !== 0);
    
    // Smooth coordinate animation
    const targetX = parseFloat(galacticX);
    const targetY = parseFloat(galacticY);
    
    const animateCoords = () => {
      setAnimatedCoords(prev => ({
        x: prev.x + (targetX - prev.x) * 0.15,
        y: prev.y + (targetY - prev.y) * 0.15
      }));
      
      // Update pulse phase for continuous animation
      setPulsePhase(prev => (prev + 0.1) % (2 * Math.PI));
    };

    const interval = setInterval(animateCoords, 16); // 60fps
    return () => clearInterval(interval);
  }, [galacticX, galacticY, mousePosition]);

  const content = {
    en: {
      coordinates: "Galactic Coordinates",
      sector: "Sector",
      zoom: "Zoom Level",
      elevation: "Elevation",
      bearing: "Bearing",
      distance: "Distance",
      nearest: "Nearest Location",
      parsecs: "parsecs",
      degrees: "°"
    },
    es: {
      coordinates: "Coordenadas Galácticas",
      sector: "Sector",
      zoom: "Nivel de Zoom",
      elevation: "Elevación",
      bearing: "Rumbo",
      distance: "Distancia",
      nearest: "Ubicación Cercana",
      parsecs: "parsecs",
      degrees: "°"
    }
  };

  const text = content[language as keyof typeof content];

  return (
    <div className={`fixed top-20 right-6 z-40 transition-all duration-500 ${
      isActive ? 'opacity-100 translate-x-0' : 'opacity-70 translate-x-2'
    }`}>
      <div className="bg-gradient-to-br from-space-dark/90 via-cosmic-purple/40 to-space-dark/90 border-2 border-cosmic-gold/50 rounded-xl p-4 backdrop-blur-md shadow-2xl min-w-64">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-cosmic-gold/20">
          <Navigation 
            className="w-5 h-5 text-cosmic-gold" 
            style={{ 
              filter: `brightness(${1 + Math.sin(pulsePhase) * 0.3})`,
              transform: `rotate(${Math.sin(pulsePhase * 0.5) * 5}deg)`
            }} 
          />
          <h3 className="font-orbitron text-sm font-bold text-cosmic-gold">
            {text.coordinates}
          </h3>
        </div>

        {/* Real-time Coordinates */}
        <div className="space-y-3">
          {/* Primary Coordinates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-space-dark/50 rounded-lg p-2 border border-electric-blue/30 relative overflow-hidden">
              <div className="text-xs text-gray-400 mb-1">X-Axis</div>
              <div 
                className="font-mono text-electric-blue font-bold text-lg transition-all duration-300"
                style={{ 
                  textShadow: `0 0 ${5 + Math.sin(pulsePhase) * 3}px rgba(59, 130, 246, 0.8)` 
                }}
              >
                {animatedCoords.x.toFixed(1)}{text.degrees}
              </div>
              <div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-electric-blue/10 to-transparent"
                style={{ 
                  transform: `translateX(${-100 + ((mousePosition.x / 10) % 200)}%)`,
                  transition: 'transform 0.3s ease-out'
                }}
              />
            </div>
            <div className="bg-space-dark/50 rounded-lg p-2 border border-cosmic-gold/30 relative overflow-hidden">
              <div className="text-xs text-gray-400 mb-1">Y-Axis</div>
              <div 
                className="font-mono text-cosmic-gold font-bold text-lg transition-all duration-300"
                style={{ 
                  textShadow: `0 0 ${5 + Math.sin(pulsePhase + 1) * 3}px rgba(251, 191, 36, 0.8)` 
                }}
              >
                {animatedCoords.y.toFixed(1)}{text.degrees}
              </div>
              <div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-cosmic-gold/10 to-transparent"
                style={{ 
                  transform: `translateX(${-100 + ((mousePosition.y / 10) % 200)}%)`,
                  transition: 'transform 0.3s ease-out'
                }}
              />
            </div>
          </div>

          {/* Sector Information */}
          <div className="bg-space-dark/50 rounded-lg p-3 border border-bright-gold/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400">{text.sector}</span>
              <Target className="w-4 h-4 text-bright-gold" />
            </div>
            <div 
              className="font-orbitron text-bright-gold font-bold text-xl transition-all duration-300"
              style={{ 
                textShadow: `0 0 ${8 + Math.sin(pulsePhase + 2) * 4}px rgba(255, 215, 0, 0.9)`,
                transform: `scale(${1 + Math.sin(pulsePhase * 2) * 0.05})`
              }}
            >
              {sectorName}
            </div>
          </div>

          {/* Navigation Stats */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Crosshair className="w-3 h-3 text-electric-blue" />
              <span className="text-gray-400">{text.zoom}:</span>
              <span className="text-electric-blue font-mono">
                {Math.round(zoomLevel * 100)}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-cosmic-gold animate-pulse" />
              <span className="text-gray-400">{text.elevation}:</span>
              <span className="text-cosmic-gold font-mono">
                {Math.abs(parseFloat(galacticY)).toFixed(0)}°
              </span>
            </div>
          </div>

          {/* Nearest Location */}
          {nearestLocation && (
            <div className="bg-gradient-to-r from-cosmic-purple/20 to-space-dark/50 rounded-lg p-3 border border-cosmic-purple/30 mt-3">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-cosmic-purple" />
                <span className="text-xs text-gray-400">{text.nearest}</span>
              </div>
              <div className="text-cosmic-purple font-medium text-sm mb-1">
                {nearestLocation.name}
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-500">{text.distance}: </span>
                  <span className="text-white font-mono">
                    {nearestLocation.distance.toFixed(1)} {text.parsecs}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">{text.bearing}: </span>
                  <span className="text-white font-mono">
                    {nearestLocation.bearing.toFixed(0)}°
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Coordinate Grid Reference */}
          <div className="border-t border-cosmic-gold/20 pt-2 mt-3">
            <div className="text-xs text-gray-500 text-center">
              {language === 'en' 
                ? 'Standard Galactic Grid Reference' 
                : 'Referencia de Cuadrícula Galáctica Estándar'
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}