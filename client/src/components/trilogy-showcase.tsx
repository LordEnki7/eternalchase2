import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { eternelChaseTriology, audiobookFeatures } from "@/lib/trilogy-data";
import { getTrackByBookId } from "@/lib/audiobook-data";
import AudioPlayer from "./AudioPlayer";
import type { Book } from "@/lib/trilogy-data";
const trilogyImage = '/media/book-covers/trilogy-alt.png';

export default function TrilogyShowcase() {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showAudioFeatures, setShowAudioFeatures] = useState(false);
  const [audioPlayerVisible, setAudioPlayerVisible] = useState(false);
  const [currentAudioTitle, setCurrentAudioTitle] = useState("");
  const [currentAudioFile, setCurrentAudioFile] = useState("@assets/audiobooks/english/Prologue Before the Chase_1753633285053.wav");
  const { language } = useLanguage();

  const content = {
    en: {
      title: "THE ETERNAL CHASE TRILOGY",
      subtitle: "Three Books. One Epic Cosmic Love Story.",
      audiobook: "Audiobook Available",
      readMore: "Explore Book",
      closeModal: "Close",
      chapters: "Chapters",
      themes: "Themes",
      narrator: "Narrator",
      duration: "Duration",
      status: {
        available: "Available Now",
        preorder: "Pre-order",
        "coming-soon": "Coming Soon"
      },
      listenPreview: "Listen Preview",
      buyAudiobook: "Get Audiobook"
    },
    es: {
      title: "LA TRILOGÍA PERSECUCIÓN ETERNA",
      subtitle: "Tres Libros. Una Historia de Amor Cósmica Épica.",
      audiobook: "Audiolibro Disponible",
      readMore: "Explorar Libro",
      closeModal: "Cerrar",
      chapters: "Capítulos",
      themes: "Temas",
      narrator: "Narrador",
      duration: "Duración",
      status: {
        available: "Disponible Ahora",
        preorder: "Pre-orden",
        "coming-soon": "Próximamente"
      },
      listenPreview: "Escuchar Vista Previa",
      buyAudiobook: "Obtener Audiolibro"
    }
  };

  const text = content[language];
  const audioFeatures = audiobookFeatures[language];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-cosmic-gold';
      case 'preorder': return 'text-bright-blue';
      case 'coming-soon': return 'text-cosmic-purple';
      default: return 'text-gray-400';
    }
  };

  return (
    <section id="trilogy" className="min-h-screen py-20 px-4 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-orbitron text-5xl font-bold mb-6 bg-gradient-to-r from-cosmic-gold to-bright-gold bg-clip-text text-transparent">
            {text.title}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            {text.subtitle}
          </p>
          
          {/* Complete Audiobook Trilogy Hero Image */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="relative rounded-2xl overflow-hidden holographic-border">
              <img 
                src={trilogyImage} 
                alt="The Eternal Chase: Complete Audiobook Trilogy" 
                className="w-full h-auto object-cover"
              />

            </div>
          </div>
          
          {/* Audiobook Features Toggle */}
          <button 
            onClick={() => setShowAudioFeatures(!showAudioFeatures)}
            className="holographic-border bg-cosmic-gold/20 hover:bg-cosmic-gold/40 px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-300 hover:scale-105 mb-12"
          >
            <i className="fas fa-headphones mr-2"></i>
            {audioFeatures.title}
          </button>

          {/* Audiobook Features */}
          {showAudioFeatures && (
            <div className="holographic-border bg-space-dark/80 rounded-lg p-8 mb-12 max-w-4xl mx-auto">
              <h3 className="font-orbitron text-2xl font-bold text-cosmic-gold mb-4">
                {audioFeatures.subtitle}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {audioFeatures.features.map((feature, index) => (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cosmic-gold to-bright-gold rounded-full flex items-center justify-center">
                      <i className={`${feature.icon} text-2xl text-space-dark`}></i>
                    </div>
                    <h4 className="font-orbitron text-lg font-semibold text-bright-gold mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-gray-300">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Trilogy Books Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {eternelChaseTriology.map((book, index) => (
            <div 
              key={book.id}
              className="holographic-border bg-space-dark/80 rounded-lg overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedBook(book)}
            >
              {/* Book Number Badge */}
              <div className="absolute top-4 left-4 w-12 h-12 bg-cosmic-gold rounded-full flex items-center justify-center font-orbitron font-bold text-space-dark text-xl z-10">
                {index + 1}
              </div>

              {/* Book Cover Area */}
              <div className="h-64 bg-gradient-to-br from-cosmic-purple via-electric-blue to-cosmic-gold flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-starfield opacity-30"></div>
                <div className="relative z-10 text-center p-6">
                  <h3 className="font-orbitron text-xl font-bold text-starlight mb-2">
                    {book.title[language]}
                  </h3>
                  <p className="text-sm text-gray-200 opacity-80">
                    {book.subtitle[language]}
                  </p>
                </div>
              </div>

              {/* Book Info */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-sm font-semibold ${getStatusColor(book.status)}`}>
                    {text.status[book.status]}
                  </span>
                  {book.audiobook.available && (
                    <div className="flex items-center text-xs text-bright-blue">
                      <i className="fas fa-headphones mr-1"></i>
                      {text.audiobook}
                    </div>
                  )}
                </div>

                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                  {book.description[language]}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{book.releaseDate}</span>
                  <button className="text-cosmic-gold hover:text-bright-gold text-sm font-semibold">
                    {text.readMore} →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Book Detail Modal */}
        {selectedBook && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[100]">
            <div className="holographic-border bg-space-dark/95 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                {/* Modal Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-orbitron text-3xl font-bold text-cosmic-gold mb-2">
                      {selectedBook.title[language]}
                    </h3>
                    <p className="text-lg text-bright-blue">
                      {selectedBook.subtitle[language]}
                    </p>
                  </div>
                  <button 
                    onClick={() => setSelectedBook(null)}
                    className="text-gray-400 hover:text-starlight text-2xl"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>

                {/* Book Description */}
                <p className="text-gray-300 mb-8 leading-relaxed">
                  {selectedBook.description[language]}
                </p>

                {/* Audiobook Info */}
                {selectedBook.audiobook.available && (
                  <div className="holographic-border bg-cosmic-purple/20 rounded-lg p-6 mb-8">
                    <h4 className="font-orbitron text-xl font-bold text-cosmic-gold mb-4">
                      <i className="fas fa-headphones mr-2"></i>
                      {text.audiobook}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <span className="text-sm text-gray-400">{text.narrator}:</span>
                        <p className="text-bright-blue font-semibold">{selectedBook.audiobook.narrator}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-400">{text.duration}:</span>
                        <p className="text-bright-blue font-semibold">{selectedBook.audiobook.duration}</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => {
                          const audioTrack = getTrackByBookId(selectedBook.id);
                          setCurrentAudioTitle(`${selectedBook.title[language]} - ${text.audiobook}`);
                          setCurrentAudioFile(audioTrack?.fileName || '@assets/Prologue Before the Chase_1753633285053.wav');
                          setAudioPlayerVisible(true);
                        }}
                        className="holographic-border bg-electric-blue/20 hover:bg-electric-blue/40 px-4 py-2 rounded transition-all"
                      >
                        <i className="fas fa-play mr-2"></i>
                        {text.listenPreview}
                      </button>
                      <button className="holographic-border bg-cosmic-gold/20 hover:bg-cosmic-gold/40 px-4 py-2 rounded transition-all">
                        <i className="fas fa-shopping-cart mr-2"></i>
                        {text.buyAudiobook}
                      </button>
                    </div>
                  </div>
                )}

                {/* Chapters */}
                <div className="mb-8">
                  <h4 className="font-orbitron text-xl font-bold text-bright-gold mb-4">
                    {text.chapters}
                  </h4>
                  <div className="space-y-3">
                    {selectedBook.chapters.map((chapter, index) => (
                      <div key={chapter.id} className="holographic-border bg-space-navy/40 rounded-lg p-4">
                        <h5 className="font-orbitron text-lg font-semibold text-cosmic-gold mb-2">
                          {chapter.title[language]}
                        </h5>
                        <p className="text-gray-300 text-sm">
                          {chapter.description[language]}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Themes */}
                <div>
                  <h4 className="font-orbitron text-xl font-bold text-bright-gold mb-4">
                    {text.themes}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedBook.themes[language].map((theme, index) => (
                      <span 
                        key={index}
                        className="holographic-border bg-cosmic-violet/30 px-3 py-1 rounded-full text-sm text-bright-blue"
                      >
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Audio Player */}
        <AudioPlayer 
          title={currentAudioTitle}
          isVisible={audioPlayerVisible}
          onClose={() => setAudioPlayerVisible(false)}
          audioFile={currentAudioFile}
        />
      </div>
    </section>
  );
}