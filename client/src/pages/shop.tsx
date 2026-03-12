import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Star, Crown, Sparkles, Book, Shirt, Coffee, Gem, ArrowLeft, Home } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { useSubscription } from "@/hooks/useSubscription";
import { Link } from "wouter";
import { ShopPlaceholder } from "@/components/ShopPlaceholders";

export default function Shop() {
  const { language } = useLanguage();
  const { hasPremiumAccess } = useSubscription();
  const [cart, setCart] = useState<string[]>([]);

  const content = {
    en: {
      title: "Cosmic Artifacts Collection",
      subtitle: "Official Eternal Chase Merchandise",
      tabs: {
        accessories: "Cosmic Accessories",
        collectibles: "Premium Collectibles", 
        exclusive: "Exclusive Artifacts",
        bundles: "Ultimate Bundles"
      },
      addToCart: "Add to Cart",
      buyNow: "Buy Now",
      premiumDiscount: "Premium 15% OFF",
      limitedEdition: "Limited Edition",
      inStock: "In Stock",
      outOfStock: "Out of Stock"
    },
    es: {
      title: "Colección de Artefactos Cósmicos",
      subtitle: "Mercancía Oficial de Eternal Chase",
      tabs: {
        accessories: "Accesorios Cósmicos",
        collectibles: "Coleccionables Premium",
        exclusive: "Artefactos Exclusivos", 
        bundles: "Paquetes Definitivos"
      },
      addToCart: "Agregar al Carrito",
      buyNow: "Comprar Ahora",
      premiumDiscount: "Premium 15% DESC",
      limitedEdition: "Edición Limitada",
      inStock: "En Stock",
      outOfStock: "Agotado"
    }
  };

  const text = content[language];

  const merchandiseData = {
    accessories: [
      {
        id: "cosmic-journal",
        name: { en: "Cosmic Journey Journal", es: "Diario del Viaje Cósmico" },
        description: { en: "Hardcover notebook with constellation maps and character quotes", es: "Cuaderno de tapa dura con mapas de constelaciones y citas de personajes" },
        price: 24.99,
        category: "stationery",
        inStock: true,
        featured: true
      },
      {
        id: "eternal-chase-tshirt",
        name: { en: "Eternal Chase Official T-Shirt", es: "Camiseta Oficial de Eternal Chase" },
        description: { en: "Premium cotton tee featuring Lyra and Kael's cosmic love design", es: "Camiseta de algodón premium con el diseño del amor cósmico de Lyra y Kael" },
        price: 29.99,
        category: "apparel",
        inStock: true,
        featured: true
      },
      {
        id: "celestial-armor-hoodie",
        name: { en: "Celestial Armor Hoodie (Unisex)", es: "Sudadera con Capucha Armadura Celestial (Unisex)" },
        description: { en: "Embossed geometric armor print with hidden zipper pocket and Aiyanna sigil. Available in Star Black, Eclipse Gray, or Kairon Crimson", es: "Estampado de armadura geométrica en relieve con bolsillo oculto y sigilo de Aiyanna. Disponible en Negro Estelar, Gris Eclipse o Carmesí Kairon" },
        price: 59.99,
        category: "apparel",
        inStock: true,
        featured: true,
        limitedEdition: true
      },
      {
        id: "ascension-edge-water-bottle",
        name: { en: "Ascension Edge Water Bottle (Insulated Steel)", es: "Botella de Agua Ascension Edge (Acero Aislado)" },
        description: { en: "Matte black vacuum-insulated 24oz bottle with laser-etched spiral galaxy emblem and engraved quote. Leakproof lid, ships in gift box", es: "Botella de 24oz aislada al vacío negra mate con emblema de galaxia espiral grabado y cita grabada. Tapa a prueba de fugas, se envía en caja de regalo" },
        price: 34.99,
        category: "lifestyle",
        inStock: true,
        featured: true
      }
    ],
    collectibles: [
      {
        id: "lyra-pendant",
        name: { en: "Lyra's Crystal Pendant Replica", es: "Réplica del Colgante de Cristal de Lyra" },
        description: { en: "Sterling silver with LED crystal core, includes charging base", es: "Plata esterlina con núcleo de cristal LED, incluye base de carga" },
        price: 89.99,
        category: "jewelry",
        inStock: true,
        featured: true,
        limitedEdition: true
      },
      {
        id: "memory-crystal",
        name: { en: "Memory Singer Crystal Display", es: "Exhibidor de Cristal del Cantor de Memoria" },
        description: { en: "Light-up display piece with authentic sound effects", es: "Pieza de exhibición iluminada con efectos de sonido auténticos" },
        price: 124.99,
        category: "display",
        inStock: true,
        featured: false
      },
      {
        id: "starship-model",
        name: { en: "Eternal Chase Starship Model", es: "Modelo de Nave Estelar Eternal Chase" },
        description: { en: "Hand-painted collector's model with removable parts", es: "Modelo de coleccionista pintado a mano con partes removibles" },
        price: 79.99,
        category: "models",
        inStock: false,
        featured: false
      }
    ],
    exclusive: [
      {
        id: "signed-trilogy",
        name: { en: "Signed First Edition Trilogy Set", es: "Set de Trilogía Primera Edición Firmada" },
        description: { en: "Author-signed hardcover set, limited to 500 copies worldwide", es: "Set de tapa dura firmado por el autor, limitado a 500 copias mundialmente" },
        price: 299.99,
        category: "books",
        inStock: true,
        featured: true,
        limitedEdition: true,
        premiumOnly: true
      },
      {
        id: "cosmic-globe",
        name: { en: "Galaxy Altherra Interactive Globe", es: "Globo Interactivo de la Galaxia Altherra" },
        description: { en: "Touch-responsive star map with voice narration", es: "Mapa estelar táctil con narración de voz" },
        price: 189.99,
        category: "interactive",
        inStock: true,
        featured: true,
        premiumOnly: true
      }
    ],
    bundles: [
      {
        id: "navigator-bundle",
        name: { en: "Cosmic Navigator Starter Pack", es: "Pack de Inicio Navegador Cósmico" },
        description: { en: "Journal, tea blend, character pins, and digital wallpapers", es: "Diario, mezcla de té, pins de personajes y fondos digitales" },
        price: 54.99,
        originalPrice: 61.97,
        category: "bundle",
        inStock: true,
        featured: true
      },
      {
        id: "architect-bundle",
        name: { en: "Architect of Resonance Ultimate Collection", es: "Colección Definitiva Arquitecto de Resonancia" },
        description: { en: "Everything in Navigator Pack plus Lyra's pendant and signed book", es: "Todo en el Pack Navigator más el colgante de Lyra y libro firmado" },
        price: 399.99,
        originalPrice: 450.97,
        category: "bundle",
        inStock: true,
        featured: true,
        premiumOnly: true
      }
    ]
  };

  const addToCart = (itemId: string) => {
    setCart([...cart, itemId]);
  };

  const getPremiumPrice = (price: number) => {
    return hasPremiumAccess ? (price * 0.85).toFixed(2) : price.toFixed(2);
  };

  const ProductCard = ({ item, showPremiumDiscount = true }: { item: any; showPremiumDiscount?: boolean }) => {
    const canPurchase = !item.premiumOnly || hasPremiumAccess;
    const discountedPrice = parseFloat(getPremiumPrice(item.price));
    const savings = (item.price - discountedPrice).toFixed(2);

    return (
      <Card className="holographic-border bg-space-dark/50 hover:bg-space-dark/70 transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="relative">
            <ShopPlaceholder 
              type={item.id} 
              className="w-full h-48 rounded-lg mb-4"
            />
            <div className="absolute top-2 right-2 flex flex-col gap-1">
              {item.limitedEdition && (
                <Badge className="bg-cosmic-gold/20 text-cosmic-gold border-cosmic-gold/30 text-xs">
                  <Star className="w-3 h-3 mr-1" />
                  {text.limitedEdition}
                </Badge>
              )}
              {item.premiumOnly && (
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                  <Crown className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              )}
            </div>
          </div>
          
          <CardTitle className="text-lg font-orbitron text-cosmic-gold">
            {item.name[language]}
          </CardTitle>
          <CardDescription className="text-gray-300 text-sm">
            {item.description[language]}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col">
              {hasPremiumAccess && showPremiumDiscount && item.price > discountedPrice ? (
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-green-400">
                    ${discountedPrice}
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    ${item.price.toFixed(2)}
                  </span>
                  <Badge className="bg-green-500/20 text-green-400 text-xs">
                    {text.premiumDiscount}
                  </Badge>
                </div>
              ) : (
                <span className="text-lg font-bold text-bright-blue">
                  ${item.originalPrice ? `${item.price.toFixed(2)}` : item.price.toFixed(2)}
                </span>
              )}
              {item.originalPrice && (
                <span className="text-sm text-gray-400 line-through">
                  ${item.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            
            <Badge 
              className={`${item.inStock 
                ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                : 'bg-red-500/20 text-red-400 border-red-500/30'
              }`}
            >
              {item.inStock ? text.inStock : text.outOfStock}
            </Badge>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => addToCart(item.id)}
              disabled={!item.inStock || !canPurchase}
              className="flex-1 bg-electric-blue/20 hover:bg-electric-blue/40 text-bright-blue border border-current"
              size="sm"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {text.addToCart}
            </Button>
            <Button
              disabled={!item.inStock || !canPurchase}
              className="bg-cosmic-gold/20 hover:bg-cosmic-gold/40 text-cosmic-gold border border-current"
              size="sm"
            >
              {text.buyNow}
            </Button>
          </div>

          {!canPurchase && (
            <p className="text-xs text-purple-300 mt-2 text-center">
              Premium membership required
            </p>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-space-dark via-deep-purple/10 to-cosmic-purple/5 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back to Main Page Button */}
        <div className="mb-8">
          <Link href="/">
            <Button
              variant="outline"
              className="border-cosmic-gold/50 text-cosmic-gold hover:bg-cosmic-gold/20 bg-space-dark/50 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {language === 'en' ? 'Back to Main Portal' : 'Volver al Portal Principal'}
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-orbitron font-black mb-6 bg-gradient-to-r from-cosmic-gold via-bright-gold to-electric-blue bg-clip-text text-transparent">
            {text.title}
          </h1>
          <p className="text-xl text-bright-blue max-w-2xl mx-auto">
            {text.subtitle}
          </p>
        </div>

        {/* Shopping Cart Counter */}
        {cart.length > 0 && (
          <div className="fixed top-4 right-4 z-50">
            <Button className="bg-cosmic-gold/20 hover:bg-cosmic-gold/40 text-cosmic-gold">
              <ShoppingCart className="w-4 h-4 mr-2" />
              {cart.length} items
            </Button>
          </div>
        )}

        {/* Product Categories */}
        <Tabs defaultValue="accessories" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-space-dark/50 rounded-lg p-1">
            <TabsTrigger value="accessories" className="flex items-center gap-2">
              <Coffee className="w-4 h-4" />
              {text.tabs.accessories}
            </TabsTrigger>
            <TabsTrigger value="collectibles" className="flex items-center gap-2">
              <Gem className="w-4 h-4" />
              {text.tabs.collectibles}
            </TabsTrigger>
            <TabsTrigger value="exclusive" className="flex items-center gap-2">
              <Crown className="w-4 h-4" />
              {text.tabs.exclusive}
            </TabsTrigger>
            <TabsTrigger value="bundles" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              {text.tabs.bundles}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="accessories" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {merchandiseData.accessories.map(item => (
                <ProductCard key={item.id} item={item} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="collectibles" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {merchandiseData.collectibles.map(item => (
                <ProductCard key={item.id} item={item} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="exclusive" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {merchandiseData.exclusive.map(item => (
                <ProductCard key={item.id} item={item} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="bundles" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {merchandiseData.bundles.map(item => (
                <ProductCard key={item.id} item={item} showPremiumDiscount={false} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}