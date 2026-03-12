import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";

export default function LoreVault() {
  const [openChapter, setOpenChapter] = useState<string | null>("chapter1");
  const { language } = useLanguage();

  const content = {
    en: {
      title: "LORE VAULT",
      subtitle: "Explore the deep mysteries of the Eternal Chase universe",
      chapters: [
        {
          id: "chapter1",
          title: "Chapter 1: The Signal Calls",
          content: "The stars above Earth's outer rim glittered like secrets waiting to be uncovered. Kael sat alone in the observation chamber of the Eclipse Vow, bathed in the low blue glow of the cosmos outside and the pulsing red light on his display screen. For weeks, he had been chasing a spectral frequency — not military, not mechanical, but...alive."
        },
        {
          id: "chapter2",
          title: "Chapter 2: The Stranger on the Shore",
          content: "Lyra woke to the sound of the sea arguing with itself. The waves were restless, crashing harder than usual, their rhythm jagged and unpredictable. She wrapped her shawl around her shoulders and stepped outside her cottage. The dawn was strange — half-golden, half-storm."
        },
        {
          id: "chapter3",
          title: "Chapter 3: Across the Veil",
          content: "The Eclipse Vow drifted in high orbit above Planet 187-K, cloaked from every scanner in the system. Kael stood at the launch bay, helmet in hand, eyes locked on the glowing island far below. The signal thrummed through his neural link like a second heartbeat."
        }
      ]
    },
    es: {
      title: "BÓVEDA DEL SABER",
      subtitle: "Explora los profundos misterios del universo de Persecución Eterna",
      chapters: [
        {
          id: "chapter1",
          title: "Capítulo 1: La Señal Llama",
          content: "Las estrellas sobre el borde exterior de la Tierra brillaban como secretos esperando ser descubiertos. Kael se sentó solo en la cámara de observación del Eclipse Vow, bañado en el resplandor azul bajo del cosmos exterior y la luz roja pulsante en su pantalla de visualización."
        },
        {
          id: "chapter2",
          title: "Capítulo 2: El Extraño en la Orilla",
          content: "Lyra despertó al sonido del mar discutiendo consigo mismo. Las olas estaban inquietas, chocando más fuerte de lo usual, su ritmo irregular e impredecible. Se envolvió el chal alrededor de los hombros y salió de su cabaña."
        },
        {
          id: "chapter3",
          title: "Capítulo 3: A Través del Velo",
          content: "El Eclipse Vow se deslizó en órbita alta sobre el Planeta 187-K, oculto de todo escáner en el sistema. Kael se paró en la bahía de lanzamiento, casco en mano, ojos fijos en la isla brillante muy abajo."
        }
      ]
    }
  };

  const text = content[language];

  const toggleChapter = (chapterId: string) => {
    setOpenChapter(openChapter === chapterId ? null : chapterId);
  };

  return (
    <section id="lore" className="min-h-screen py-20 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-orbitron text-5xl font-bold mb-6 bg-gradient-to-r from-cosmic-gold to-bright-gold bg-clip-text text-transparent">
            {text.title}
          </h2>
          <p className="text-xl text-gray-300">
            {text.subtitle}
          </p>
        </div>
        
        <div className="space-y-6">
          {text.chapters.map((chapter) => (
            <div key={chapter.id} className="holographic-border bg-space-dark/60 rounded-lg overflow-hidden">
              <button 
                className="w-full px-6 py-4 text-left hover:bg-electric-blue/10 transition-all duration-300 flex justify-between items-center"
                onClick={() => toggleChapter(chapter.id)}
              >
                <h3 className="font-orbitron text-xl font-semibold text-cosmic-gold">
                  {chapter.title}
                </h3>
                <i className={`fas transition-transform duration-300 ${
                  openChapter === chapter.id ? 'fa-chevron-up' : 'fa-chevron-down'
                } text-bright-blue`}></i>
              </button>
              {openChapter === chapter.id && (
                <div className="px-6 pb-6 text-gray-300 border-t border-electric-blue/30">
                  <p className="mt-4 leading-relaxed">
                    {chapter.content}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
