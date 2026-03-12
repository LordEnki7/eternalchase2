import { Book, Coffee, Gem, Star, Globe, PenTool, Zap, Crown, Package } from "lucide-react";
const tshirtImage = '/media/images/tshirt-design.png';
const journalImage = '/media/images/image-1.png';
const hoodieImage = '/media/characters/shop-tshirt-model.png';
const waterBottleImage = '/media/characters/shop-hoodie-model.png';

interface PlaceholderProps {
  type: string;
  className?: string;
}

export function ShopPlaceholder({ type, className = "w-full h-48" }: PlaceholderProps) {
  const getPlaceholderContent = () => {
    switch (type) {
      case 'cosmic-journal':
        return (
          <div className="relative rounded-lg overflow-hidden">
            <img 
              src={journalImage} 
              alt="Cosmic Journey Journal" 
              className={className + " object-cover"}
            />
          </div>
        );
      

      case 'lyra-pendant':
        return (
          <svg className={className} viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="crystalGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" style={{stopColor: '#64ffda', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#1a1a2e', stopOpacity: 1}} />
              </radialGradient>
            </defs>
            <rect width="300" height="200" fill="#0a0a1a" />
            <path d="M150 40 Q130 50 140 70 Q150 80 160 70 Q170 50 150 40" fill="url(#crystalGrad)" stroke="#ffd700" strokeWidth="2" />
            <circle cx="150" cy="60" r="8" fill="#ffffff" opacity="0.8" />
            <circle cx="150" cy="60" r="4" fill="#64ffda" />
            <path d="M130 70 Q150 100 170 70" stroke="#c0c0c0" strokeWidth="3" fill="none" />
            <circle cx="145" cy="55" r="2" fill="#ffffff" opacity="0.9" />
            <circle cx="155" cy="65" r="1.5" fill="#ffffff" opacity="0.7" />
            <text x="150" y="130" fill="#ffd700" fontSize="14" textAnchor="middle" fontWeight="bold">LYRA'S</text>
            <text x="150" y="150" fill="#64ffda" fontSize="12" textAnchor="middle">CRYSTAL PENDANT</text>
          </svg>
        );
      
      case 'memory-crystal':
        return (
          <svg className={className} viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="memoryGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" style={{stopColor: '#c77dff', stopOpacity: 1}} />
                <stop offset="50%" style={{stopColor: '#7209b7', stopOpacity: 0.8}} />
                <stop offset="100%" style={{stopColor: '#1a1a2e', stopOpacity: 1}} />
              </radialGradient>
            </defs>
            <rect width="300" height="200" fill="#0a0a1a" />
            <polygon points="150,30 130,60 130,120 150,150 170,120 170,60" fill="url(#memoryGrad)" stroke="#ffd700" strokeWidth="2" />
            <polygon points="150,45 140,65 140,105 150,125 160,105 160,65" fill="#ffffff" opacity="0.3" />
            <rect x="120" y="150" width="60" height="20" rx="10" fill="#2a2a3e" stroke="#64ffda" strokeWidth="1" />
            <circle cx="130" cy="160" r="2" fill="#64ffda" />
            <circle cx="150" cy="160" r="2" fill="#ffd700" />
            <circle cx="170" cy="160" r="2" fill="#ff6b9d" />
            <text x="150" y="190" fill="#c77dff" fontSize="12" textAnchor="middle">MEMORY CRYSTAL</text>
          </svg>
        );
      
      case 'starship-model':
        return (
          <svg className={className} viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="shipGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{stopColor: '#64ffda', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#ffd700', stopOpacity: 1}} />
              </linearGradient>
            </defs>
            <rect width="300" height="200" fill="#0a0a1a" />
            <polygon points="50,100 120,80 200,90 250,100 200,110 120,120" fill="url(#shipGrad)" />
            <polygon points="120,80 140,70 180,75 200,90 180,95 140,90" fill="#ffffff" opacity="0.6" />
            <circle cx="80" cy="100" r="8" fill="#ff6b9d" />
            <circle cx="100" cy="100" r="6" fill="#64ffda" />
            <rect x="160" y="85" width="30" height="10" fill="#2a2a3e" />
            <polygon points="230,95 250,100 230,105" fill="#ff4444" />
            <text x="150" y="150" fill="#64ffda" fontSize="12" textAnchor="middle" fontWeight="bold">STARSHIP MODEL</text>
          </svg>
        );
      
      case 'signed-trilogy':
        return (
          <svg className={className} viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bookGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: '#ffd700', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#ff6b9d', stopOpacity: 1}} />
              </linearGradient>
            </defs>
            <rect width="300" height="200" fill="#0a0a1a" />
            <rect x="60" y="40" width="40" height="120" fill="url(#bookGrad)" rx="4" />
            <rect x="110" y="45" width="40" height="120" fill="#64ffda" rx="4" />
            <rect x="160" y="50" width="40" height="120" fill="#c77dff" rx="4" />
            <rect x="65" y="50" width="30" height="2" fill="#1a1a2e" />
            <rect x="115" y="55" width="30" height="2" fill="#1a1a2e" />
            <rect x="165" y="60" width="30" height="2" fill="#1a1a2e" />
            <path d="M220 100 Q230 90 240 100 Q230 110 220 100" stroke="#ffd700" strokeWidth="2" fill="none" />
            <text x="150" y="190" fill="#ffd700" fontSize="12" textAnchor="middle" fontWeight="bold">SIGNED TRILOGY</text>
          </svg>
        );
      
      case 'cosmic-globe':
        return (
          <svg className={className} viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="globeGrad" cx="50%" cy="40%" r="60%">
                <stop offset="0%" style={{stopColor: '#64ffda', stopOpacity: 0.8}} />
                <stop offset="100%" style={{stopColor: '#1a1a2e', stopOpacity: 1}} />
              </radialGradient>
            </defs>
            <rect width="300" height="200" fill="#0a0a1a" />
            <circle cx="150" cy="90" r="50" fill="url(#globeGrad)" stroke="#ffd700" strokeWidth="2" />
            <circle cx="130" cy="70" r="3" fill="#ffd700" />
            <circle cx="170" cy="80" r="2" fill="#ff6b9d" />
            <circle cx="160" cy="110" r="2.5" fill="#64ffda" />
            <path d="M100 90 Q150 70 200 90" stroke="#c77dff" strokeWidth="2" fill="none" opacity="0.6" />
            <path d="M110 110 Q150 120 190 110" stroke="#64ffda" strokeWidth="2" fill="none" opacity="0.4" />
            <rect x="130" y="140" width="40" height="20" fill="#2a2a3e" stroke="#ffd700" strokeWidth="1" />
            <text x="150" y="180" fill="#64ffda" fontSize="12" textAnchor="middle">INTERACTIVE GLOBE</text>
          </svg>
        );
      
      case 'navigator-bundle':
        return (
          <svg className={className} viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bundleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: '#2a4365', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#1a1a2e', stopOpacity: 1}} />
              </linearGradient>
            </defs>
            <rect width="300" height="200" fill="url(#bundleGrad)" />
            <rect x="50" y="50" width="200" height="100" rx="10" fill="#2a2a3e" stroke="#ffd700" strokeWidth="2" />
            <rect x="70" y="70" width="40" height="30" fill="#64ffda" opacity="0.6" />
            <circle cx="130" cy="85" r="8" fill="#ffd700" />
            <rect x="150" y="75" width="30" height="20" fill="#c77dff" opacity="0.6" />
            <circle cx="210" cy="85" r="6" fill="#ff6b9d" />
            <rect x="70" y="110" width="160" height="25" fill="#3d1a78" opacity="0.4" />
            <text x="150" y="125" fill="#ffd700" fontSize="10" textAnchor="middle">NAVIGATOR BUNDLE</text>
            <text x="150" y="170" fill="#64ffda" fontSize="12" textAnchor="middle" fontWeight="bold">STARTER PACK</text>
          </svg>
        );
      
      case 'eternal-chase-tshirt':
        return (
          <div className="relative rounded-lg overflow-hidden">
            <img 
              src={tshirtImage} 
              alt="Eternal Chase T-Shirt" 
              className={className + " object-cover"}
            />
          </div>
        );
      
      case 'celestial-armor-hoodie':
        return (
          <div className="relative rounded-lg overflow-hidden">
            <img 
              src={hoodieImage} 
              alt="Celestial Armor Hoodie" 
              className={className + " object-cover"}
            />
          </div>
        );
      
      case 'ascension-edge-water-bottle':
        return (
          <div className="relative rounded-lg overflow-hidden">
            <img 
              src={waterBottleImage} 
              alt="Ascension Edge Water Bottle" 
              className={className + " object-cover"}
            />
          </div>
        );
      
      case 'architect-bundle':
        return (
          <svg className={className} viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="ultimateGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" style={{stopColor: '#ffd700', stopOpacity: 1}} />
                <stop offset="50%" style={{stopColor: '#c77dff', stopOpacity: 0.8}} />
                <stop offset="100%" style={{stopColor: '#1a1a2e', stopOpacity: 1}} />
              </radialGradient>
            </defs>
            <rect width="300" height="200" fill="#0a0a1a" />
            <rect x="40" y="40" width="220" height="120" rx="15" fill="url(#ultimateGrad)" stroke="#ffd700" strokeWidth="3" />
            <circle cx="100" cy="80" r="12" fill="#64ffda" />
            <rect x="130" y="70" width="40" height="20" fill="#ff6b9d" opacity="0.8" />
            <polygon points="200,70 220,85 200,100 180,85" fill="#ffffff" opacity="0.9" />
            <rect x="60" y="110" width="180" height="30" fill="#7209b7" opacity="0.6" />
            <text x="150" y="125" fill="#ffd700" fontSize="12" textAnchor="middle" fontWeight="bold">ULTIMATE</text>
            <text x="150" y="135" fill="#ffd700" fontSize="10" textAnchor="middle">COLLECTION</text>
            <circle cx="80" cy="50" r="3" fill="#ffd700" />
            <circle cx="220" cy="50" r="3" fill="#ffd700" />
            <circle cx="80" cy="150" r="3" fill="#ffd700" />
            <circle cx="220" cy="150" r="3" fill="#ffd700" />
            <text x="150" y="180" fill="#c77dff" fontSize="12" textAnchor="middle">ARCHITECT BUNDLE</text>
          </svg>
        );
      
      default:
        return (
          <svg className={className} viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="200" fill="#1a1a2e" />
            <circle cx="150" cy="100" r="30" fill="#64ffda" opacity="0.3" />
            <Package className="w-12 h-12" style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#ffd700'}} />
          </svg>
        );
    }
  };

  return (
    <div className="relative rounded-lg overflow-hidden">
      {getPlaceholderContent()}
    </div>
  );
}