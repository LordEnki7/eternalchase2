import { useState, useEffect } from 'react';
import { HelpCircle, X, Navigation, ZoomIn, MousePointer, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface TooltipStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  target?: string;
}

interface StarMapTooltipsProps {
  language: 'en' | 'es';
}

export function StarMapTooltips({ language }: StarMapTooltipsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenTutorial, setHasSeenTutorial] = useState(false);

  const tooltips: Record<string, TooltipStep[]> = {
    en: [
      {
        id: 'welcome',
        title: 'Welcome to Galaxy Altherra',
        description: 'Navigate through the cosmic realms of the Eternal Chase universe. Click on glowing locations to discover their secrets.',
        icon: <Map className="w-5 h-5" />,
        position: 'center'
      },
      {
        id: 'navigation',
        title: 'Navigation Controls',
        description: 'Use your mouse to pan around the galaxy. Click and drag to explore different regions.',
        icon: <MousePointer className="w-5 h-5" />,
        position: 'top-left'
      },
      {
        id: 'zoom',
        title: 'Zoom Controls',
        description: 'Use the zoom buttons or scroll wheel to get closer views of locations. Zoom range: 70% - 200%.',
        icon: <ZoomIn className="w-5 h-5" />,
        position: 'top-right'
      },
      {
        id: 'locations',
        title: 'Interactive Locations',
        description: 'Blinking markers indicate key locations in Aiyanna\'s journey. Click them to learn about their cosmic significance.',
        icon: <Navigation className="w-5 h-5" />,
        position: 'bottom-left'
      },
      {
        id: 'legend',
        title: 'Location Types',
        description: 'Check the legend at the bottom to understand different location types: Clusters, Gateways, Rifts, and Veils.',
        icon: <HelpCircle className="w-5 h-5" />,
        position: 'bottom-right'
      }
    ],
    es: [
      {
        id: 'welcome',
        title: 'Bienvenido a la Galaxia Altherra',
        description: 'Navega por los reinos cósmicos del universo de Eternal Chase. Haz clic en las ubicaciones brillantes para descubrir sus secretos.',
        icon: <Map className="w-5 h-5" />,
        position: 'center'
      },
      {
        id: 'navigation',
        title: 'Controles de Navegación',
        description: 'Usa tu ratón para moverte por la galaxia. Haz clic y arrastra para explorar diferentes regiones.',
        icon: <MousePointer className="w-5 h-5" />,
        position: 'top-left'
      },
      {
        id: 'zoom',
        title: 'Controles de Zoom',
        description: 'Usa los botones de zoom o la rueda del ratón para obtener vistas más cercanas. Rango de zoom: 70% - 200%.',
        icon: <ZoomIn className="w-5 h-5" />,
        position: 'top-right'
      },
      {
        id: 'locations',
        title: 'Ubicaciones Interactivas',
        description: 'Los marcadores parpadeantes indican ubicaciones clave en el viaje de Aiyanna. Haz clic para conocer su significado cósmico.',
        icon: <Navigation className="w-5 h-5" />,
        position: 'bottom-left'
      },
      {
        id: 'legend',
        title: 'Tipos de Ubicación',
        description: 'Revisa la leyenda en la parte inferior para entender los diferentes tipos: Cúmulos, Portales, Fisuras y Velos.',
        icon: <HelpCircle className="w-5 h-5" />,
        position: 'bottom-right'
      }
    ]
  };

  const currentTooltips = tooltips[language];

  useEffect(() => {
    const hasSeenKey = 'starmap_tutorial_seen';
    const seen = localStorage.getItem(hasSeenKey);
    setHasSeenTutorial(!!seen);
    
    // Auto-show tutorial for first-time users
    if (!seen) {
      setTimeout(() => setIsOpen(true), 1000);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < currentTooltips.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setCurrentStep(0);
    localStorage.setItem('starmap_tutorial_seen', 'true');
    setHasSeenTutorial(true);
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setIsOpen(true);
  };

  const getPositionClasses = (position: string) => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'center':
        return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
      default:
        return 'top-4 left-4';
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={handleRestart}
        variant="outline"
        size="sm"
        className="fixed bottom-6 right-6 z-50 bg-black/80 border-purple-500/50 text-purple-300 hover:bg-purple-900/50 hover:text-purple-100"
      >
        <HelpCircle className="w-4 h-4 mr-2" />
        {language === 'en' ? 'Help' : 'Ayuda'}
      </Button>
    );
  }

  const currentTooltip = currentTooltips[currentStep];

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 z-40" />
      
      {/* Tooltip */}
      <Card className={`fixed z-50 max-w-sm cosmic-fade-in ${getPositionClasses(currentTooltip.position)} bg-black/90 border-purple-500/50 text-white`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="text-purple-400">
                {currentTooltip.icon}
              </div>
              <h3 className="font-semibold text-purple-300">
                {currentTooltip.title}
              </h3>
            </div>
            <Button
              onClick={handleClose}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <p className="text-sm text-gray-300 mb-4">
            {currentTooltip.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex space-x-1">
              {currentTooltips.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentStep ? 'bg-purple-400' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
            
            <div className="flex space-x-2">
              <Button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                variant="outline"
                size="sm"
                className="border-purple-500/50 text-purple-300 hover:bg-purple-900/50"
              >
                {language === 'en' ? 'Back' : 'Atrás'}
              </Button>
              <Button
                onClick={handleNext}
                variant="outline"
                size="sm"
                className="border-purple-500/50 text-purple-300 hover:bg-purple-900/50"
              >
                {currentStep === currentTooltips.length - 1 
                  ? (language === 'en' ? 'Finish' : 'Finalizar')
                  : (language === 'en' ? 'Next' : 'Siguiente')
                }
              </Button>
            </div>
          </div>
          
          <div className="text-xs text-gray-500 mt-2 text-center">
            {currentStep + 1} / {currentTooltips.length}
          </div>
        </CardContent>
      </Card>
    </>
  );
}