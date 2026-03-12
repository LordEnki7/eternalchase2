import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Check, Star, Zap } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  const { language } = useLanguage();
  
  const content = {
    en: {
      title: "Upgrade to Premium",
      subtitle: "Unlock the Complete Cosmic Journey",
      price: "$9.99/month",
      features: [
        "87+ professional audiobook tracks",
        "Multi-voice character narration",
        "Interactive audio drama scenes",
        "Author's exclusive commentary",
        "Premium Discord community access",
        "Monthly live Q&A sessions",
        "Concept art & behind-the-scenes",
        "15% discount on cosmic merchandise"
      ],
      upgrade: "Upgrade Now",
      signIn: "Sign In to Upgrade",
      cancel: "Maybe Later",
      currentAccess: "Current Free Access:",
      freeFeatures: [
        "First 3 chapters of Book 1",
        "Character galleries",
        "Interactive Star Map",
        "Young Adult section browsing"
      ]
    },
    es: {
      title: "Actualizar a Premium",
      subtitle: "Desbloquea el Viaje Cósmico Completo",
      price: "$9.99/mes",
      features: [
        "87+ pistas de audiolibros profesionales",
        "Narración multi-voz de personajes",
        "Escenas de audio drama interactivo",
        "Comentarios exclusivos del autor",
        "Acceso a comunidad Discord premium",
        "Sesiones mensuales de preguntas en vivo",
        "Arte conceptual y contenido exclusivo",
        "15% descuento en mercancía cósmica"
      ],
      upgrade: "Actualizar Ahora",
      signIn: "Iniciar Sesión para Actualizar",
      cancel: "Tal Vez Después",
      currentAccess: "Acceso Gratuito Actual:",
      freeFeatures: [
        "Primeros 3 capítulos del Libro 1",
        "Galerías de personajes",
        "Mapa Estelar Interactivo",
        "Navegación de sección juvenil"
      ]
    }
  };

  const text = content[language];

  const handleUpgrade = () => {
    // Redirect to sign-in for upgrade process
    window.location.href = '/api/login';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gradient-to-br from-gray-900 to-black border-cosmic-gold/20">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-cosmic-gold to-bright-gold bg-clip-text text-transparent">
            <Crown className="inline mr-2 h-6 w-6 text-cosmic-gold" />
            {text.title}
          </DialogTitle>
          <p className="text-center text-gray-300 mt-2">{text.subtitle}</p>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 py-6">
          {/* Premium Features */}
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-cosmic-gold mb-2">{text.price}</div>
              <Badge className="bg-cosmic-gold/20 text-cosmic-gold border-cosmic-gold/30">
                <Star className="w-3 h-3 mr-1" />
                Premium Access
              </Badge>
            </div>

            <div className="space-y-3">
              {text.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-400" />
                  </div>
                  <span className="text-gray-300 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Current Free Access */}
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-lg font-bold text-bright-blue mb-2">{text.currentAccess}</div>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                Free Plan
              </Badge>
            </div>

            <div className="space-y-3">
              {text.freeFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-blue-400" />
                  </div>
                  <span className="text-gray-400 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-4 border-t border-gray-700">
          <Button 
            onClick={handleUpgrade}
            className="w-full bg-gradient-to-r from-cosmic-gold to-bright-gold text-space-dark hover:from-bright-gold hover:to-cosmic-gold font-bold text-lg py-3"
          >
            <Zap className="w-4 h-4 mr-2" />
            {text.signIn}
          </Button>
          
          <Button 
            onClick={onClose}
            variant="outline"
            className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            {text.cancel}
          </Button>
        </div>

        <div className="text-center text-xs text-gray-500 mt-2">
          <span className="w-2 h-2 bg-green-400 rounded-full inline-block mr-2"></span>
          Cancel anytime • Instant access • Secure payments
        </div>
      </DialogContent>
    </Dialog>
  );
}