import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { apiRequest } from "@/lib/queryClient";
const eternalChaseCover = '/media/book-covers/eternal-chase-cover-alt.jpg';
const spiralGalaxyCover = '/media/book-covers/spiral-galaxy-book-cover.png';
const ascensionsEdgeCover = '/media/book-covers/eternal-chase-ascensions-edge.png';
const trilogyImage = '/media/book-covers/trilogy-alt.png';

interface ShopItem {
  id: string;
  name: {
    en: string;
    es: string;
  };
  description: {
    en: string;
    es: string;
  };
  price: number;
  type: string;
  icon: string;
  gradient: string;
}

export default function CosmicShop() {
  const [purchasingItem, setPurchasingItem] = useState<string | null>(null);
  const { toast } = useToast();
  const { language } = useLanguage();

  const shopItems: ShopItem[] = [
    {
      id: "audiobook-trilogy",
      name: {
        en: "Complete Audiobook Trilogy",
        es: "Trilogía Completa de Audiolibros"
      },
      description: {
        en: "All three Eternal Chase audiobooks narrated by Shawn Rulz (28+ hours)",
        es: "Los tres audiolibros de Persecución Eterna narrados por Shawn Rulz (28+ horas)"
      },
      price: 45,
      type: "audiobook_bundle",
      icon: "fas fa-headphones",
      gradient: "from-cosmic-gold to-bright-gold"
    },
    {
      id: "pursuit-audiobook",
      name: {
        en: "The Pursuit for Love - Audiobook",
        es: "La Búsqueda del Amor - Audiolibro"
      },
      description: {
        en: "Book 1 audiobook with cinematic soundscape (8h 42m)",
        es: "Audiolibro del Libro 1 con paisaje sonoro cinematográfico (8h 42m)"
      },
      price: 18,
      type: "audiobook",
      icon: "fas fa-play-circle",
      gradient: "from-cosmic-purple to-electric-blue"
    },
    {
      id: "spiral-war-audiobook",
      name: {
        en: "The Spiral War - Audiobook",
        es: "La Guerra Espiral - Audiolibro"
      },
      description: {
        en: "Book 2 audiobook featuring fractured reality soundscapes (9h 15m)",
        es: "Audiolibro del Libro 2 con paisajes sonoros de realidad fracturada (9h 15m)"
      },
      price: 19,
      type: "audiobook",
      icon: "fas fa-play-circle",
      gradient: "from-electric-blue to-cosmic-violet"
    },
    {
      id: "ascensions-edge-audiobook",
      name: {
        en: "Ascension's Edge - Audiobook",
        es: "El Borde de la Ascensión - Audiolibro"
      },
      description: {
        en: "Book 3 audiobook with cosmic rebirth themes (10h 28m)",
        es: "Audiolibro del Libro 3 con temas de renacimiento cósmico (10h 28m)"
      },
      price: 20,
      type: "audiobook",
      icon: "fas fa-play-circle",
      gradient: "from-cosmic-violet to-bright-gold"
    },
    {
      id: "stellar-pack",
      name: {
        en: "Spiral Galaxy - Official Cover Art",
        es: "Galaxia Espiral - Arte de Portada Oficial"
      },
      description: {
        en: "Book 2 official cover as premium digital collectible",
        es: "Portada oficial del Libro 2 como coleccionable digital premium"
      },
      price: 15,
      type: "digital_art",
      icon: "fas fa-image",
      gradient: "from-purple-400 to-cosmic-purple"
    },
    {
      id: "cosmic-soundtrack",
      name: {
        en: "Eternal Soundtrack Collection",
        es: "Colección de Banda Sonora Eterna"
      },
      description: {
        en: "Epic orchestral themes and ambient cosmic soundscapes",
        es: "Temas orquestales épicos y paisajes sonoros cósmicos ambientales"
      },
      price: 25,
      type: "soundtrack",
      icon: "fas fa-music",
      gradient: "from-cosmic-gold to-bright-gold"
    },
    {
      id: "lyra-kael-poster",
      name: {
        en: "Eternal Chase - Official Cover Art",
        es: "Persecución Eterna - Arte de Portada Oficial"
      },
      description: {
        en: "Book 1 official cover as premium digital collectible",
        es: "Portada oficial del Libro 1 como coleccionable digital premium"
      },
      price: 30,
      type: "digital_art",
      icon: "fas fa-palette",
      gradient: "from-cosmic-gold to-bright-gold"
    },
    {
      id: "cosmic-avatar",
      name: {
        en: "Ascension's Edge - Official Cover Art",
        es: "El Borde de la Ascensión - Arte de Portada Oficial"
      },
      description: {
        en: "Book 3 official cover as premium digital collectible",
        es: "Portada oficial del Libro 3 como coleccionable digital premium"
      },
      price: 35,
      type: "digital_art",
      icon: "fas fa-image",
      gradient: "from-electric-blue to-bright-blue"
    }
  ];

  const purchaseMutation = useMutation({
    mutationFn: async (data: { itemId: string; email: string }) => {
      const item = shopItems.find(i => i.id === data.itemId);
      if (!item) throw new Error("Item not found");

      return apiRequest("POST", "/api/shop/purchase", {
        email: data.email,
        itemType: item.type,
        itemName: item.name.en,
        cosmicPrice: item.price
      });
    },
    onSuccess: () => {
      toast({
        title: language === 'en' ? "Cosmic Item Acquired!" : "¡Objeto Cósmico Adquirido!",
        description: language === 'en' 
          ? "Your cosmic inventory has been updated."
          : "Tu inventario cósmico ha sido actualizado.",
      });
      setPurchasingItem(null);
    },
    onError: (error: any) => {
      toast({
        title: language === 'en' ? "Purchase Failed" : "Compra Fallida",
        description: error.message || (language === 'en' ? "Cosmic marketplace temporarily unavailable" : "Mercado cósmico temporalmente no disponible"),
        variant: "destructive",
      });
      setPurchasingItem(null);
    },
  });

  const handlePurchase = (itemId: string) => {
    const email = prompt(language === 'en' ? "Enter your cosmic frequency (email):" : "Ingresa tu frecuencia cósmica (email):");
    if (!email) return;

    setPurchasingItem(itemId);
    purchaseMutation.mutate({ itemId, email });
  };

  const content = {
    en: {
      title: "COSMIC MARKETPLACE",
      subtitle: "Acquire rare digital collectibles from across the galaxy",
      currency: "COSMIC",
      acquireButton: "Acquire",
      processingButton: "Processing..."
    },
    es: {
      title: "MERCADO CÓSMICO",
      subtitle: "Adquiere coleccionables digitales raros de toda la galaxia",
      currency: "CÓSMICO",
      acquireButton: "Adquirir",
      processingButton: "Procesando..."
    }
  };

  const text = content[language];

  return (
    <section id="shop" className="min-h-screen py-20 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-orbitron text-5xl font-bold mb-6 bg-gradient-to-r from-cosmic-gold to-bright-gold bg-clip-text text-transparent">
            {text.title}
          </h2>
          <p className="text-xl text-gray-300">
            {text.subtitle}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {shopItems.map((item) => (
            <div key={item.id} className="holographic-border bg-space-dark/80 rounded-lg p-6 hover:scale-105 transition-all duration-300 group">
              {/* Special badge for audiobooks */}
              {item.type.includes('audiobook') && (
                <div className="absolute top-2 right-2 bg-cosmic-gold px-2 py-1 rounded-full text-xs font-bold text-space-dark z-10">
                  AUDIO
                </div>
              )}
              
              <div className={`w-full h-48 bg-gradient-to-br ${item.gradient} rounded-lg mb-4 flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 bg-starfield opacity-20 group-hover:opacity-40 transition-opacity"></div>
                
                {/* Show actual book covers for digital art items */}
                {item.id === "lyra-kael-poster" && (
                  <img 
                    src={eternalChaseCover} 
                    alt="Eternal Chase Cover"
                    className="w-full h-full object-cover rounded-lg opacity-90 hover:opacity-100 transition-opacity"
                  />
                )}
                
                {item.id === "stellar-pack" && (
                  <img 
                    src={spiralGalaxyCover} 
                    alt="Spiral Galaxy Cover"
                    className="w-full h-full object-cover rounded-lg opacity-90 hover:opacity-100 transition-opacity"
                  />
                )}
                
                {item.id === "cosmic-avatar" && (
                  <img 
                    src={ascensionsEdgeCover} 
                    alt="Ascension's Edge Cover"
                    className="w-full h-full object-cover rounded-lg opacity-90 hover:opacity-100 transition-opacity"
                  />
                )}
                
                {item.id === "audiobook-trilogy" && (
                  <img 
                    src={trilogyImage} 
                    alt="Complete Audiobook Trilogy"
                    className="w-full h-full object-cover rounded-lg opacity-90 hover:opacity-100 transition-opacity"
                  />
                )}
                
                {/* Individual audiobook placeholders */}
                {item.id === "pursuit-audiobook" && (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-cosmic-purple/20 to-electric-blue/20 rounded-lg">
                    <i className="fas fa-headphones text-3xl text-cosmic-purple mb-2"></i>
                    <div className="text-center">
                      <div className="text-xs font-bold text-cosmic-purple">AUDIOBOOK</div>
                      <div className="text-xs text-gray-300">Book 1</div>
                      <div className="text-xs text-gray-400">8h 42m</div>
                    </div>
                  </div>
                )}
                
                {item.id === "spiral-war-audiobook" && (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-electric-blue/20 to-cosmic-violet/20 rounded-lg">
                    <i className="fas fa-headphones text-3xl text-electric-blue mb-2"></i>
                    <div className="text-center">
                      <div className="text-xs font-bold text-electric-blue">AUDIOBOOK</div>
                      <div className="text-xs text-gray-300">Book 2</div>
                      <div className="text-xs text-gray-400">9h 15m</div>
                    </div>
                  </div>
                )}
                
                {item.id === "ascensions-edge-audiobook" && (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-cosmic-violet/20 to-bright-gold/20 rounded-lg">
                    <i className="fas fa-headphones text-3xl text-cosmic-violet mb-2"></i>
                    <div className="text-center">
                      <div className="text-xs font-bold text-cosmic-violet">AUDIOBOOK</div>
                      <div className="text-xs text-gray-300">Book 3</div>
                      <div className="text-xs text-gray-400">10h 28m</div>
                    </div>
                  </div>
                )}
                
                {/* Soundtrack placeholder */}
                {item.id === "cosmic-soundtrack" && (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-cosmic-gold/20 to-bright-gold/20 rounded-lg">
                    <i className="fas fa-music text-4xl text-cosmic-gold mb-2"></i>
                    <div className="text-center">
                      <div className="text-xs font-bold text-cosmic-gold">SOUNDTRACK</div>
                      <div className="text-xs text-gray-300">Epic Collection</div>
                      <div className="text-xs text-gray-400">Orchestral Themes</div>
                    </div>
                    {/* Music notes animation */}
                    <div className="absolute top-2 right-2 text-cosmic-gold opacity-50">
                      <i className="fas fa-music text-xs animate-pulse"></i>
                    </div>
                  </div>
                )}
                
                {/* Default icon for remaining items */}
                {!["lyra-kael-poster", "stellar-pack", "cosmic-avatar", "audiobook-trilogy", "pursuit-audiobook", "spiral-war-audiobook", "ascensions-edge-audiobook", "cosmic-soundtrack"].includes(item.id) && (
                  <i className={`${item.icon} text-4xl ${
                    item.gradient.includes('cosmic-gold') ? 'text-space-dark' : 'text-starlight'
                  } animate-float relative z-10`}></i>
                )}
                
                {/* Audio preview button for audiobooks */}
                {item.type.includes('audiobook') && (
                  <button className="absolute bottom-2 right-2 w-8 h-8 bg-starlight/20 rounded-full flex items-center justify-center hover:bg-starlight/40 transition-all z-10">
                    <i className="fas fa-play text-xs text-starlight"></i>
                  </button>
                )}
              </div>
              
              <h3 className="font-orbitron text-lg font-bold text-cosmic-gold mb-2">
                {item.name[language]}
              </h3>
              <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                {item.description[language]}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-bright-gold">
                  {item.price} {text.currency}
                </span>
                <button 
                  className="holographic-border bg-electric-blue/20 hover:bg-electric-blue/40 px-3 py-2 rounded text-xs transition-all duration-300 disabled:opacity-50"
                  onClick={() => handlePurchase(item.id)}
                  disabled={purchasingItem === item.id}
                >
                  {purchasingItem === item.id ? text.processingButton : text.acquireButton}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
