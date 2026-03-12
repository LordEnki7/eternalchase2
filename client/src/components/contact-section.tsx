import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { apiRequest } from "@/lib/queryClient";

export default function ContactSection() {
  const [email, setEmail] = useState("");
  const [cosmicAlignment, setCosmicAlignment] = useState("");
  const { toast } = useToast();
  const { language } = useLanguage();

  const newsletterMutation = useMutation({
    mutationFn: async (data: { email: string; cosmicAlignment: string; language: string }) => {
      return apiRequest("POST", "/api/newsletter/subscribe", data);
    },
    onSuccess: () => {
      toast({
        title: language === 'en' ? "Journey Initiated!" : "¡Viaje Iniciado!",
        description: language === 'en' 
          ? "Welcome to the Eternal Chase cosmic network." 
          : "Bienvenido a la red cósmica de Persecución Eterna.",
      });
      setEmail("");
      setCosmicAlignment("");
    },
    onError: (error: any) => {
      toast({
        title: language === 'en' ? "Cosmic Network Error" : "Error de Red Cósmica",
        description: error.message || (language === 'en' ? "Unable to join cosmic network" : "No se pudo unir a la red cósmica"),
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !cosmicAlignment) {
      toast({
        title: language === 'en' ? "Incomplete Data" : "Datos Incompletos",
        description: language === 'en' ? "Please fill in all cosmic fields" : "Por favor llena todos los campos cósmicos",
        variant: "destructive",
      });
      return;
    }

    newsletterMutation.mutate({ email, cosmicAlignment, language });
  };

  const content = {
    en: {
      title: "JOIN THE ETERNAL CHASE",
      subtitle: "Connect with fellow cosmic travelers and stay updated on new chronicles",
      emailPlaceholder: "Enter your cosmic frequency (email)",
      alignmentLabel: "Choose your cosmic alignment",
      alignments: [
        { value: "", label: "Choose your cosmic alignment" },
        { value: "light_seeker", label: "Light Seeker" },
        { value: "shadow_walker", label: "Shadow Walker" },
        { value: "cosmic_balance", label: "Cosmic Balance" },
        { value: "eternal_guardian", label: "Eternal Guardian" }
      ],
      submitButton: "Begin Your Journey",
      submittingButton: "Initiating Journey..."
    },
    es: {
      title: "ÚNETE A LA PERSECUCIÓN ETERNA",
      subtitle: "Conecta con otros viajeros cósmicos y mantente actualizado sobre nuevas crónicas",
      emailPlaceholder: "Ingresa tu frecuencia cósmica (email)",
      alignmentLabel: "Elige tu alineación cósmica",
      alignments: [
        { value: "", label: "Elige tu alineación cósmica" },
        { value: "light_seeker", label: "Buscador de Luz" },
        { value: "shadow_walker", label: "Caminante de Sombras" },
        { value: "cosmic_balance", label: "Balance Cósmico" },
        { value: "eternal_guardian", label: "Guardián Eterno" }
      ],
      submitButton: "Comienza tu Viaje",
      submittingButton: "Iniciando Viaje..."
    }
  };

  const text = content[language];

  return (
    <section id="contact" className="min-h-screen py-20 px-4 relative z-10">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-orbitron text-5xl font-bold mb-6 bg-gradient-to-r from-cosmic-gold to-bright-gold bg-clip-text text-transparent">
          {text.title}
        </h2>
        <p className="text-xl text-gray-300 mb-12">
          {text.subtitle}
        </p>
        
        <div className="holographic-border bg-space-dark/60 rounded-lg p-8 max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input 
                type="email" 
                placeholder={text.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-cosmic-purple/30 holographic-border rounded-lg text-starlight placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-electric-blue"
                required
              />
            </div>
            <div>
              <select 
                value={cosmicAlignment}
                onChange={(e) => setCosmicAlignment(e.target.value)}
                className="w-full px-4 py-3 bg-cosmic-purple/30 holographic-border rounded-lg text-starlight focus:outline-none focus:ring-2 focus:ring-electric-blue"
                required
              >
                {text.alignments.map((alignment) => (
                  <option key={alignment.value} value={alignment.value} className="bg-cosmic-purple">
                    {alignment.label}
                  </option>
                ))}
              </select>
            </div>
            <button 
              type="submit" 
              disabled={newsletterMutation.isPending}
              className="w-full holographic-border bg-electric-blue/20 hover:bg-electric-blue/40 py-3 rounded-lg text-lg font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50"
            >
              <i className="fas fa-rocket mr-2"></i>
              {newsletterMutation.isPending ? text.submittingButton : text.submitButton}
            </button>
          </form>
        </div>
        
        {/* Social Links */}
        <div className="flex justify-center space-x-8 mt-12">
          <a href="#" className="text-cosmic-gold hover:text-bright-gold transition-colors duration-300">
            <i className="fab fa-twitter text-2xl"></i>
          </a>
          <a href="#" className="text-cosmic-gold hover:text-bright-gold transition-colors duration-300">
            <i className="fab fa-discord text-2xl"></i>
          </a>
          <a href="#" className="text-cosmic-gold hover:text-bright-gold transition-colors duration-300">
            <i className="fab fa-youtube text-2xl"></i>
          </a>
          <a href="#" className="text-cosmic-gold hover:text-bright-gold transition-colors duration-300">
            <i className="fab fa-instagram text-2xl"></i>
          </a>
        </div>
      </div>
    </section>
  );
}
