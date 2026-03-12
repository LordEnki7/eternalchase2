import { useState } from 'react';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Headphones, ShoppingCart, Star, Truck } from 'lucide-react';
import { motion } from 'framer-motion';

const eternalChaseImage = '/media/book-covers/eternal-chase-cover-alt.jpg';
const spiralGalaxyImage = '/media/book-covers/spiral-galaxy-book-cover.png';
const ascensionsEdgeImage = '/media/book-covers/eternal-chase-ascensions-edge.png';
const aiyannaCoverImage = '/media/book-covers/aiyanna-book1-tragedy-fall-kairon.png';

interface BookProduct {
  id: string;
  title: string;
  author: string;
  description: string;
  cover: string;
  prices: {
    hardcover: number;
    paperback: number;
    digital: number;
    audiobook: number;
  };
  features: string[];
  category: 'main-trilogy' | 'young-adult';
}

const bookProducts: BookProduct[] = [
  {
    id: 'eternal-chase-1',
    title: 'Eternal Chase: The Pursuit for Love',
    author: 'S.C. Jensen',
    description: 'The epic beginning of a cosmic love story that spans galaxies. When Kael follows a mysterious signal to find Lyra on the forbidden world of Isla Noctis, their connection ignites a chase across the stars.',
    cover: eternalChaseImage,
    prices: {
      hardcover: 24.99,
      paperback: 16.99,
      digital: 9.99,
      audiobook: 19.99
    },
    features: ['Premium hardcover binding', 'Full-color character cards included', 'Professional narration', '87 audio tracks'],
    category: 'main-trilogy'
  },
  {
    id: 'spiral-galaxy-2',
    title: 'Eternal Chase: Spiral War',
    author: 'S.C. Jensen',
    description: 'The conflict escalates across dimensional boundaries as Lyra and Kael face the ancient forces that seek to control the cosmic balance. Love becomes their greatest weapon.',
    cover: spiralGalaxyImage,
    prices: {
      hardcover: 24.99,
      paperback: 16.99,
      digital: 9.99,
      audiobook: 19.99
    },
    features: ['Premium hardcover binding', 'Exclusive galaxy map', 'Professional narration', 'Extended epilogue'],
    category: 'main-trilogy'
  },
  {
    id: 'ascensions-edge-3',
    title: "Eternal Chase: Ascension's Edge",
    author: 'S.C. Jensen',
    description: 'The stunning conclusion where ultimate sacrifices are made and cosmic destinies are fulfilled. Witness the final battle that will determine the fate of all existence.',
    cover: ascensionsEdgeImage,
    prices: {
      hardcover: 24.99,
      paperback: 16.99,
      digital: 9.99,
      audiobook: 19.99
    },
    features: ['Premium hardcover binding', 'Collector\'s dust jacket', 'Professional narration', 'Bonus behind-the-scenes content'],
    category: 'main-trilogy'
  },
  {
    id: 'aiyanna-tragedy-1',
    title: 'Aiyanna Tragedy: The Fall of Kairon',
    author: 'S.C. Jensen',
    description: 'Discover the origins of young Aiyanna (Lyra) in this captivating prequel series. Witness her transformation from an innocent child to a cosmic force of nature.',
    cover: aiyannaCoverImage,
    prices: {
      hardcover: 22.99,
      paperback: 14.99,
      digital: 8.99,
      audiobook: 17.99
    },
    features: ['Young Adult edition', 'Character evolution guide', 'Spanish audio available', 'Trading card collection'],
    category: 'young-adult'
  }
];

export default function Bookstore() {
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'main-trilogy' | 'young-adult'>('all');

  const translations = {
    en: {
      title: 'Eternal Chase Bookstore',
      subtitle: 'Own the complete saga in physical and digital formats',
      mainTrilogy: 'Main Trilogy',
      youngAdult: 'Young Adult Series',
      allBooks: 'All Books',
      hardcover: 'Hardcover',
      paperback: 'Paperback',
      digital: 'Digital Book',
      audiobook: 'Audiobook',
      addToCart: 'Add to Cart',
      buyNow: 'Buy Now',
      freeShipping: 'Free Shipping',
      instantDownload: 'Instant Download',
      professionalNarration: 'Professional Narration',
      bundleDiscount: 'Bundle Discount Available'
    },
    es: {
      title: 'Librería Eternal Chase',
      subtitle: 'Posee la saga completa en formatos físicos y digitales',
      mainTrilogy: 'Trilogía Principal',
      youngAdult: 'Serie Juvenil',
      allBooks: 'Todos los Libros',
      hardcover: 'Tapa Dura',
      paperback: 'Tapa Blanda',
      digital: 'Libro Digital',
      audiobook: 'Audiolibro',
      addToCart: 'Agregar al Carrito',
      buyNow: 'Comprar Ahora',
      freeShipping: 'Envío Gratis',
      instantDownload: 'Descarga Instantánea',
      professionalNarration: 'Narración Profesional',
      bundleDiscount: 'Descuento por Paquete Disponible'
    }
  };

  const trans = translations[language as keyof typeof translations];

  const filteredBooks = selectedCategory === 'all' 
    ? bookProducts 
    : bookProducts.filter(book => book.category === selectedCategory);

  const handlePurchase = (bookId: string, format: string, price: number) => {
    const book = bookProducts.find(b => b.id === bookId);
    if (!book) return;

    // Navigate to checkout with product details
    const checkoutData = {
      itemId: `${bookId}-${format}`,
      itemType: format === 'hardcover' || format === 'paperback' ? `${format}_book` : format,
      itemName: `${book.title} (${format})`,
      price: price,
      requiresShipping: format === 'hardcover' || format === 'paperback'
    };

    // Store checkout data in sessionStorage and redirect
    sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData));
    window.location.href = '/checkout';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      {/* Cosmic background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 mb-4">
            {trans.title}
          </h1>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto">
            {trans.subtitle}
          </p>
        </motion.div>

        {/* Category Filter */}
        <div className="flex justify-center mb-8">
          <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as any)} className="w-full max-w-md">
            <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border border-purple-500/20">
              <TabsTrigger value="all" className="text-purple-200">{trans.allBooks}</TabsTrigger>
              <TabsTrigger value="main-trilogy" className="text-purple-200">{trans.mainTrilogy}</TabsTrigger>
              <TabsTrigger value="young-adult" className="text-purple-200">{trans.youngAdult}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Book Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBooks.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm hover:border-purple-400/40 transition-all duration-300 h-full">
                <CardHeader>
                  <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-lg">
                    <img 
                      src={book.cover} 
                      alt={book.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    {book.category === 'young-adult' && (
                      <Badge className="absolute top-2 right-2 bg-pink-500/90 text-white">
                        Young Adult
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-purple-100 text-lg leading-tight">
                    {book.title}
                  </CardTitle>
                  <CardDescription className="text-purple-300">
                    by {book.author}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <p className="text-purple-200 text-sm mb-4 line-clamp-3">
                    {book.description}
                  </p>

                  {/* Format Options */}
                  <div className="space-y-3">
                    {/* Hardcover */}
                    <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-purple-400" />
                        <span className="text-purple-200 text-sm">{trans.hardcover}</span>
                        <Truck className="w-3 h-3 text-green-400" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-purple-100 font-semibold">${book.prices.hardcover}</span>
                        <Button 
                          size="sm" 
                          onClick={() => handlePurchase(book.id, 'hardcover', book.prices.hardcover)}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          {trans.buyNow}
                        </Button>
                      </div>
                    </div>

                    {/* Paperback */}
                    <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-blue-400" />
                        <span className="text-purple-200 text-sm">{trans.paperback}</span>
                        <Truck className="w-3 h-3 text-green-400" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-purple-100 font-semibold">${book.prices.paperback}</span>
                        <Button 
                          size="sm" 
                          onClick={() => handlePurchase(book.id, 'paperback', book.prices.paperback)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {trans.buyNow}
                        </Button>
                      </div>
                    </div>

                    {/* Digital */}
                    <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-green-400" />
                        <span className="text-purple-200 text-sm">{trans.digital}</span>
                        <Star className="w-3 h-3 text-yellow-400" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-purple-100 font-semibold">${book.prices.digital}</span>
                        <Button 
                          size="sm" 
                          onClick={() => handlePurchase(book.id, 'digital_book', book.prices.digital)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {trans.buyNow}
                        </Button>
                      </div>
                    </div>

                    {/* Audiobook */}
                    <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Headphones className="w-4 h-4 text-pink-400" />
                        <span className="text-purple-200 text-sm">{trans.audiobook}</span>
                        <Star className="w-3 h-3 text-yellow-400" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-purple-100 font-semibold">${book.prices.audiobook}</span>
                        <Button 
                          size="sm" 
                          onClick={() => handlePurchase(book.id, 'audiobook', book.prices.audiobook)}
                          className="bg-pink-600 hover:bg-pink-700"
                        >
                          {trans.buyNow}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter>
                  <div className="w-full">
                    <div className="flex flex-wrap gap-1 mb-3">
                      {book.features.slice(0, 2).map((feature, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs border-purple-400/40 text-purple-300">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="text-xs text-purple-400 space-y-1">
                      <div className="flex items-center gap-1">
                        <Truck className="w-3 h-3" />
                        <span>{trans.freeShipping} (Physical books)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        <span>{trans.instantDownload} (Digital)</span>
                      </div>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Special Offers */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <Card className="bg-gradient-to-r from-purple-900/50 via-pink-900/50 to-purple-900/50 border-purple-400/40 max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold text-purple-100 mb-4">
                {trans.bundleDiscount}
              </h3>
              <p className="text-purple-200 mb-4">
                Purchase the complete trilogy and save 25% on your order!
              </p>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                onClick={() => {
                  // Handle bundle purchase
                  const bundleData = {
                    itemId: 'trilogy-bundle',
                    itemType: 'bundle',
                    itemName: 'Complete Eternal Chase Trilogy Bundle',
                    price: 59.99,
                    requiresShipping: false
                  };
                  sessionStorage.setItem('checkoutData', JSON.stringify(bundleData));
                  window.location.href = '/checkout';
                }}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Buy Complete Trilogy - $59.99
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}