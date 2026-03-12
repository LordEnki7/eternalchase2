export interface Book {
  id: string;
  title: {
    en: string;
    es: string;
  };
  subtitle: {
    en: string;
    es: string;
  };
  description: {
    en: string;
    es: string;
  };
  chapters: Array<{
    id: string;
    title: {
      en: string;
      es: string;
    };
    description: {
      en: string;
      es: string;
    };
  }>;
  status: 'available' | 'preorder' | 'coming-soon';
  audiobook: {
    available: boolean;
    duration: string;
    narrator: string;
    previewUrl?: string;
  };
  coverImage?: string;
  releaseDate: string;
  themes: {
    en: string[];
    es: string[];
  };
}

export const eternelChaseTriology: Book[] = [
  {
    id: "pursuit-for-love",
    title: {
      en: "Eternal Chase: The Pursuit for Love",
      es: "Persecución Eterna: La Búsqueda del Amor"
    },
    subtitle: {
      en: "Book One of the Eternal Chase Trilogy",
      es: "Libro Uno de la Trilogía Persecución Eterna"
    },
    description: {
      en: "The cosmic love story begins when Kael intercepts a mysterious signal from Lyra on the forbidden island of Isla Noctis. Two souls across different worlds discover their destinies are intertwined in a universe-spanning romance that challenges the very foundations of reality.",
      es: "La historia de amor cósmica comienza cuando Kael intercepta una señal misteriosa de Lyra en la isla prohibida de Isla Noctis. Dos almas de mundos diferentes descubren que sus destinos están entrelazados en un romance que abarca el universo y desafía los cimientos mismos de la realidad."
    },
    chapters: [
      {
        id: "chapter1",
        title: {
          en: "Chapter 1: The Signal Calls",
          es: "Capítulo 1: La Señal Llama"
        },
        description: {
          en: "Kael discovers a living frequency from the forbidden world of Isla Noctis, leading him to the mysterious Lyra.",
          es: "Kael descubre una frecuencia viva del mundo prohibido de Isla Noctis, llevándolo a la misteriosa Lyra."
        }
      },
      {
        id: "chapter2",
        title: {
          en: "Chapter 2: The Stranger on the Shore",
          es: "Capítulo 2: El Extraño en la Orilla"
        },
        description: {
          en: "Lyra finds Kael washed ashore and their first encounter sparks a connection that transcends worlds.",
          es: "Lyra encuentra a Kael varado en la orilla y su primer encuentro despierta una conexión que trasciende mundos."
        }
      },
      {
        id: "chapter3",
        title: {
          en: "Chapter 3: Across the Veil",
          es: "Capítulo 3: A Través del Velo"
        },
        description: {
          en: "The cosmic forces that separate their worlds begin to unravel as love defies universal law.",
          es: "Las fuerzas cósmicas que separan sus mundos comienzan a desenredarse mientras el amor desafía la ley universal."
        }
      }
    ],
    status: 'available',
    audiobook: {
      available: true,
      duration: "8h 42m",
      narrator: "Shawn Rulz",
      previewUrl: "@assets/Chapter 1 The Song of Defiance_1753651995020.wav"
    },
    releaseDate: "2025",
    themes: {
      en: ["Cosmic Romance", "Interdimensional Love", "Destiny vs Choice", "Afrofuturism"],
      es: ["Romance Cósmico", "Amor Interdimensional", "Destino vs Elección", "Afrofuturismo"]
    }
  },
  {
    id: "spiral-galaxy",
    title: {
      en: "Eternal Chase: Spiral Galaxy",
      es: "Persecución Eterna: Galaxia Espiral"
    },
    subtitle: {
      en: "Book Two of the Eternal Chase Trilogy",
      es: "Libro Dos de la Trilogía Persecución Eterna"
    },
    description: {
      en: "As reality fractures and the Broken Spiral spreads its hunger across dimensions, Kael, Lyra, and Riven must navigate twisted realms where time loops back on itself and memories bleed into the present. The cost of love becomes the price of existence itself.",
      es: "Mientras la realidad se fractura y la Espiral Rota extiende su hambre a través de las dimensiones, Kael, Lyra y Riven deben navegar reinos retorcidos donde el tiempo se dobla sobre sí mismo y las memorias sangran en el presente. El costo del amor se convierte en el precio de la existencia misma."
    },
    chapters: [
      {
        id: "chapter1",
        title: {
          en: "Chapter 1: Fractured Light",
          es: "Capítulo 1: Luz Fracturada"
        },
        description: {
          en: "Riven awakens in the Broken Spiral, a realm where time folds and realities overlap like shattered glass.",
          es: "Riven despierta en la Espiral Rota, un reino donde el tiempo se dobla y las realidades se superponen como vidrio roto."
        }
      },
      {
        id: "chapter2",
        title: {
          en: "Chapter 2: The Heart of the Source",
          es: "Capítulo 2: El Corazón de la Fuente"
        },
        description: {
          en: "Kael and Lyra enter the City of Light and Code, facing the Source's consciousness and the Choir's rebellion.",
          es: "Kael y Lyra entran en la Ciudad de Luz y Código, enfrentando la conciencia de la Fuente y la rebelión del Coro."
        }
      },
      {
        id: "chapter3",
        title: {
          en: "Chapter 3: Shadows and Echoes",
          es: "Capítulo 3: Sombras y Ecos"
        },
        description: {
          en: "Riven faces corrupted Judicars while wielding the cosmic thread that can bind fractured realities.",
          es: "Riven enfrenta Judicars corruptos mientras empuña el hilo cósmico que puede unir realidades fracturadas."
        }
      }
    ],
    status: 'available',
    audiobook: {
      available: true,
      duration: "9h 15m",
      narrator: "Shawn Rulz",
      previewUrl: "@assets/CHAPTER 1FRACTURED REFLECTIONS Part One_1753634625849.wav"
    },
    releaseDate: "2025",
    themes: {
      en: ["Reality Fractures", "Cosmic Threads", "Guilt & Redemption", "Temporal Chaos"],
      es: ["Fracturas de Realidad", "Hilos Cósmicos", "Culpa y Redención", "Caos Temporal"]
    }
  },
  {
    id: "ascensions-edge", 
    title: {
      en: "Eternal Chase: Ascension's Edge",
      es: "Persecución Eterna: El Borde de la Ascensión"
    },
    subtitle: {
      en: "Book Three of the Eternal Chase Trilogy",
      es: "Libro Tres de la Trilogía Persecución Eterna"
    },
    description: {
      en: "In the final chapter, Elena Mercer witnesses reality fracturing as three cosmic beings walk between worlds. The Source is dying, and our heroes must choose between saving existence as it is or allowing creation to be reborn. The ultimate sacrifice awaits at Ascension's Edge.",
      es: "En el capítulo final, Elena Mercer es testigo de la fractura de la realidad mientras tres seres cósmicos caminan entre mundos. La Fuente está muriendo, y nuestros héroes deben elegir entre salvar la existencia tal como es o permitir que la creación renazca. El sacrificio final aguarda en el Borde de la Ascensión."
    },
    chapters: [
      {
        id: "prologue",
        title: {
          en: "Prologue: Echoes of Tomorrow",
          es: "Prólogo: Ecos del Mañana"
        },
        description: {
          en: "Elena Mercer witnesses reality splitting as three cosmic figures appear through dimensional rifts.",
          es: "Elena Mercer es testigo de la división de la realidad mientras tres figuras cósmicas aparecen a través de grietas dimensionales."
        }
      },
      {
        id: "chapter1",
        title: {
          en: "Chapter 1: Fractured Reflections",
          es: "Capítulo 1: Reflejos Fracturados"
        },
        description: {
          en: "Our heroes find themselves separated across pocket dimensions, each facing their deepest fears and truths.",
          es: "Nuestros héroes se encuentran separados a través de dimensiones de bolsillo, cada uno enfrentando sus miedos y verdades más profundos."
        }
      },
      {
        id: "chapter2",
        title: {
          en: "Chapter 2: The Architect's Gambit",
          es: "Capítulo 2: La Jugada del Arquitecto"
        },
        description: {
          en: "Grandma reveals her true identity as Architect Selene and the devastating plan to reset creation itself.",
          es: "La Abuela revela su verdadera identidad como la Arquitecta Selene y el plan devastador para reiniciar la creación misma."
        }
      }
    ],
    status: 'available',
    audiobook: {
      available: true,
      duration: "10h 28m",
      narrator: "Shawn Rulz",
      previewUrl: "@assets/CHAPTER 10 ASCENSION'S EDGE Part One_1753634764162.wav"
    },
    releaseDate: "2025",
    themes: {
      en: ["Universal Sacrifice", "Creation vs Destruction", "Cosmic Rebirth", "Final Choices"],
      es: ["Sacrificio Universal", "Creación vs Destrucción", "Renacimiento Cósmico", "Decisiones Finales"]
    }
  }
];

export const audiobookFeatures = {
  en: {
    title: "IMMERSIVE AUDIOBOOK EXPERIENCE",
    subtitle: "Dive deep into the cosmic soundscape",
    features: [
      {
        icon: "fas fa-headphones",
        title: "Cinematic Audio",
        description: "Epic orchestral themes and ambient cosmic soundscapes"
      },
      {
        icon: "fas fa-microphone",
        title: "Author Narration",
        description: "Personally narrated by Shawn Rulz with emotional depth"
      },
      {
        icon: "fas fa-music",
        title: "Character Themes",
        description: "Unique musical motifs for each cosmic being"
      },
      {
        icon: "fas fa-volume-up",
        title: "Sound Effects",
        description: "Immersive cosmic sounds and dimensional rifts"
      }
    ]
  },
  es: {
    title: "EXPERIENCIA DE AUDIOLIBRO INMERSIVA",
    subtitle: "Sumérgete profundamente en el paisaje sonoro cósmico",
    features: [
      {
        icon: "fas fa-headphones",
        title: "Audio Cinematográfico",
        description: "Temas orquestales épicos y paisajes sonoros cósmicos ambientales"
      },
      {
        icon: "fas fa-microphone",
        title: "Narración del Autor",
        description: "Narrado personalmente por Shawn Rulz con profundidad emocional"
      },
      {
        icon: "fas fa-music",
        title: "Temas de Personajes",
        description: "Motivos musicales únicos para cada ser cósmico"
      },
      {
        icon: "fas fa-volume-up",
        title: "Efectos de Sonido",
        description: "Sonidos cósmicos inmersivos y grietas dimensionales"
      }
    ]
  }
};