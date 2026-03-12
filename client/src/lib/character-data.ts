const veraImagePath = "/media/characters/vera.png";
const grandmaAmaImagePath = "/media/characters/grandma-ama.png";
const ixoraImagePath = "/media/characters/ixora.png";
const kaelImagePath = "/media/characters/kael.png";
const lyraKaelImagePath = "/media/characters/lyra-and-kael.png";
const lyraImagePath = "/media/characters/lyra.png";
const mayaImagePath = "/media/characters/maya.png";
const rivenImagePath = "/media/characters/riven.png";
const architectImagePath = "/media/characters/the-architect.png";
const firstMindImagePath = "/media/characters/the-first-mind.png";
const heraldImagePath = "/media/characters/the-herald.png";
const sourceImagePath = "/media/characters/the-source.png";
const veloEntityImagePath = "/media/characters/the-velo-entity.png";

export interface Character {
  id: string;
  name: string;
  image?: string;
  element?: string;
  role?: string;
  stats?: Array<{ name: string; value: number; color?: string }>;
  quote: {
    en: string;
    es: string;
  };
  description: {
    en: string;
    es: string;
  };
  details: {
    en: string[];
    es: string[];
  };
}

export const characters: Character[] = [
  {
    id: "lyra",
    name: "LYRA",
    image: lyraImagePath,
    element: "Starborne",
    role: "Seeker",
    stats: [
      { name: "INTELLECT", value: 90, color: "text-cosmic-gold" },
      { name: "HEART", value: 100, color: "text-cosmic-gold" },
      { name: "COMBAT", value: 70, color: "text-cosmic-gold" },
      { name: "COSMIC BOND", value: 90, color: "text-cosmic-gold" }
    ],
    quote: {
      en: "Love transcends the boundaries of time and space.",
      es: "El amor trasciende las fronteras del tiempo y el espacio."
    },
    description: {
      en: "A powerful starborne seeker destined to reshape the cosmos through love.",
      es: "Una poderosa buscadora estelar destinada a remodelar el cosmos a través del amor."
    },
    details: {
      en: [
        "Origin: Isla Noctis",
        "Power: Cosmic Connection",
        "Destiny: Universal Balance"
      ],
      es: [
        "Origen: Isla Noctis",
        "Poder: Conexión Cósmica",
        "Destino: Balance Universal"
      ]
    }
  },
  {
    id: "kael",
    name: "KAEL",
    image: kaelImagePath,
    element: "Cosmic Warrior",
    role: "Protector",
    stats: [
      { name: "ENERGY", value: 85, color: "text-electric-blue" },
      { name: "INTELLIGENCE", value: 80, color: "text-electric-blue" },
      { name: "COMBAT", value: 95, color: "text-electric-blue" },
      { name: "LOVE", value: 100, color: "text-electric-blue" }
    ],
    quote: {
      en: "Confessing but fearless, a protector in love and deadly peril.",
      es: "Confesando pero sin miedo, un protector en el amor y peligro mortal."
    },
    description: {
      en: "A cosmic warrior torn between duty and love, wielding ancient powers.",
      es: "Un guerrero cósmico dividido entre el deber y el amor, empuñando poderes antiguos."
    },
    details: {
      en: [
        "Ship: Eclipse Vow",
        "Weapon: Memory Sword",
        "Bond: Eternal Love"
      ],
      es: [
        "Nave: Eclipse Vow",
        "Arma: Espada de Memoria",
        "Vínculo: Amor Eterno"
      ]
    }
  },
  {
    id: "lyra-kael-fusion",
    name: "LYRA + KAEL",
    image: lyraKaelImagePath,
    element: "Fusion",
    role: "United Destiny",
    quote: {
      en: "TWO SOULS, ONE DESTINY - REBORN IN LOVE.",
      es: "DOS ALMAS, UN DESTINO - RENACIDAS EN AMOR."
    },
    description: {
      en: "The cosmic fusion of two souls destined to reshape reality through their eternal bond.",
      es: "La fusión cósmica de dos almas destinadas a remodelar la realidad a través de su vínculo eterno."
    },
    details: {
      en: [
        "Power: Infinite Love",
        "Purpose: Cosmic Balance",
        "Legacy: New Creation"
      ],
      es: [
        "Poder: Amor Infinito",
        "Propósito: Balance Cósmico",
        "Legado: Nueva Creación"
      ]
    }
  },
  {
    id: "vera",
    name: "VERA",
    image: veraImagePath,
    element: "Earth",
    role: "Guardian",
    stats: [
      { name: "PROTECTION", value: 95, color: "text-green-400" },
      { name: "NATURE BOND", value: 90, color: "text-green-400" },
      { name: "DETERMINATION", value: 98, color: "text-green-400" }
    ],
    quote: {
      en: "I'll protect this land no matter what.",
      es: "Protegeré esta tierra sin importar qué."
    },
    description: {
      en: "Guardian of the natural realm, wielding ancient earth magic.",
      es: "Guardiana del reino natural, empuñando magia ancestral de la tierra."
    },
    details: {
      en: [
        "Domain: Natural Protection",
        "Weapon: Ancient Staff",
        "Oath: Land Guardian"
      ],
      es: [
        "Dominio: Protección Natural",
        "Arma: Bastón Ancestral",
        "Juramento: Guardiana de la Tierra"
      ]
    }
  },
  {
    id: "maya",
    name: "MAYA",
    image: mayaImagePath,
    element: "Light/Cosmic",
    role: "Cosmic Mystic",
    stats: [
      { name: "COSMIC ENERGY", value: 95, color: "text-cosmic-gold" },
      { name: "MYSTICAL POWER", value: 88, color: "text-cosmic-gold" }
    ],
    quote: {
      en: "At the heart of all creation lies the eternal flame of love.",
      es: "En el corazón de toda creación yace la llama eterna del amor."
    },
    description: {
      en: "A powerful cosmic mystic who channels the fundamental forces of creation.",
      es: "Una poderosa mística cósmica que canaliza las fuerzas fundamentales de la creación."
    },
    details: {
      en: [
        "Element: Light/Cosmic",
        "Origin: Unknown Realm",
        "Power: Universal Love"
      ],
      es: [
        "Elemento: Luz/Cósmico",
        "Origen: Reino Desconocido",
        "Poder: Amor Universal"
      ]
    }
  },
  {
    id: "grandma-ama",
    name: "GRANDMA AMA",
    image: grandmaAmaImagePath,
    element: "Spirit Flame",
    role: "Wisdom",
    quote: {
      en: "She burned for truth, and lit the path behind her.",
      es: "Ella ardió por la verdad, e iluminó el camino detrás de ella."
    },
    description: {
      en: "The wise guardian who guides heroes through cosmic trials with ancient knowledge.",
      es: "La sabia guardiana que guía a los héroes a través de pruebas cósmicas con conocimiento ancestral."
    },
    details: {
      en: [
        "Element: Spirit Flame",
        "Role: Ancient Guide",
        "Gift: Cosmic Wisdom"
      ],
      es: [
        "Elemento: Llama Espiritual",
        "Rol: Guía Ancestral",
        "Don: Sabiduría Cósmica"
      ]
    }
  },
  {
    id: "ixora",
    name: "IXORA",
    image: ixoraImagePath,
    element: "Fire",
    role: "Sorceress",
    quote: {
      en: "I will bring forth a new world from the flames.",
      es: "Traeré un nuevo mundo de las llamas."
    },
    description: {
      en: "A powerful fire sorceress wielding the destructive and creative power of flame.",
      es: "Una poderosa hechicera de fuego que empuña el poder destructivo y creativo de la llama."
    },
    details: {
      en: [
        "Element: Fire",
        "Power: Flame Creation",
        "Purpose: World Rebirth"
      ],
      es: [
        "Elemento: Fuego",
        "Poder: Creación de Llamas",
        "Propósito: Renacimiento Mundial"
      ]
    }
  },
  {
    id: "riven",
    name: "RIVEN",
    image: rivenImagePath,
    element: "Technology",
    role: "Tech Warrior",
    stats: [
      { name: "ENERGY", value: 92, color: "text-electric-blue" },
      { name: "INTELLIGENCE", value: 85, color: "text-electric-blue" },
      { name: "COMBAT", value: 96, color: "text-electric-blue" },
      { name: "LOVE", value: 74, color: "text-electric-blue" }
    ],
    quote: {
      en: "Confessing but fearless, a protector in love and deadly peril.",
      es: "Confesando pero sin miedo, un protector en el amor y peligro mortal."
    },
    description: {
      en: "A technologically enhanced warrior torn between duty and emotion.",
      es: "Un guerrero mejorado tecnológicamente dividido entre el deber y la emoción."
    },
    details: {
      en: [
        "Class: Tech Warrior",
        "Specialty: Protection",
        "Conflict: Love vs Duty"
      ],
      es: [
        "Clase: Guerrero Tecnológico",
        "Especialidad: Protección",
        "Conflicto: Amor vs Deber"
      ]
    }
  },
  {
    id: "architect",
    name: "THE ARCHITECT",
    image: architectImagePath,
    role: "Designer of Destiny",
    quote: {
      en: "Reality bends to my will, for I have seen the blueprints of existence.",
      es: "La realidad se dobla a mi voluntad, pues he visto los planos de la existencia."
    },
    description: {
      en: "The cosmic entity responsible for designing the fundamental structure of reality.",
      es: "La entidad cósmica responsable de diseñar la estructura fundamental de la realidad."
    },
    details: {
      en: [
        "Role: Cosmic Designer",
        "Domain: Reality Manipulation",
        "Power: Infinite"
      ],
      es: [
        "Rol: Diseñador Cósmico",
        "Dominio: Manipulación de la Realidad",
        "Poder: Infinito"
      ]
    }
  },
  {
    id: "first-mind",
    name: "THE FIRST MIND",
    image: firstMindImagePath,
    element: "Cosmic/Eternal",
    role: "Cosmic Consciousness",
    quote: {
      en: "At the dawn of the infinite, it dreamed of all to come.",
      es: "En el amanecer del infinito, soñó con todo lo que vendría."
    },
    description: {
      en: "The primordial consciousness that sparked the beginning of all existence.",
      es: "La conciencia primordial que desató el comienzo de toda existencia."
    },
    details: {
      en: [
        "Origin: Beginning of Time",
        "Nature: Pure Consciousness",
        "Purpose: Universal Awareness"
      ],
      es: [
        "Origen: Comienzo del Tiempo",
        "Naturaleza: Conciencia Pura",
        "Propósito: Conciencia Universal"
      ]
    }
  },
  {
    id: "herald",
    name: "THE HERALD",
    image: heraldImagePath,
    element: "Time Echo",
    role: "Judgment",
    quote: {
      en: "First to fall, last to forget.",
      es: "Primero en caer, último en olvidar."
    },
    description: {
      en: "An eternal witness bearing the burden of cosmic memory and judgment.",
      es: "Un testigo eterno que lleva la carga de la memoria y el juicio cósmico."
    },
    details: {
      en: [
        "Domain: Temporal Echoes",
        "Function: Memory Keeper",
        "Burden: Eternal Witness"
      ],
      es: [
        "Dominio: Ecos Temporales",
        "Función: Guardián de Memorias",
        "Carga: Testigo Eterno"
      ]
    }
  },
  {
    id: "source",
    name: "THE SOURCE",
    image: sourceImagePath,
    role: "Origin of All",
    quote: {
      en: "From nothing came everything, and to the Source all shall return.",
      es: "De la nada vino todo, y a la Fuente todo regresará."
    },
    description: {
      en: "The fundamental force from which all existence springs and to which all returns.",
      es: "La fuerza fundamental de la cual brota toda existencia y a la cual todo regresa."
    },
    details: {
      en: [
        "Origin of All.",
        "Memory of What Was.",
        "Destiny Yet To Be."
      ],
      es: [
        "Origen de Todo.",
        "Memoria de Lo Que Fue.",
        "Destino Por Venir."
      ]
    }
  },
  {
    id: "velo-entity",
    name: "THE VELO ENTITY",
    image: veloEntityImagePath,
    element: "Shadow",
    role: "Parasitic Force",
    quote: {
      en: "The shadow that feasts on love and betrayal.",
      es: "La sombra que se alimenta del amor y la traición."
    },
    description: {
      en: "A dark entity that corrupts emotions and feeds on the pain of broken bonds.",
      es: "Una entidad oscura que corrompe emociones y se alimenta del dolor de los lazos rotos."
    },
    details: {
      en: [
        "Nature: Parasitic Shadow",
        "Domain: Emotional Corruption",
        "Weakness: Pure Love"
      ],
      es: [
        "Naturaleza: Sombra Parasitaria",
        "Dominio: Corrupción Emocional",
        "Debilidad: Amor Puro"
      ]
    }
  },
  {
    id: "elena-mercer",
    name: "ELENA MERCER",
    image: "/elena-mercer.png",
    element: "Reality",
    role: "The Fracture Witness",
    stats: [
      { name: "SCIENCE", value: 98, color: "text-electric-blue" },
      { name: "PERCEPTION", value: 92, color: "text-electric-blue" },
      { name: "ANALYSIS", value: 95, color: "text-electric-blue" }
    ],
    quote: {
      en: "In every fracture lies the blueprint for what comes next.",
      es: "En cada fractura yace el plano de lo que viene después."
    },
    description: {
      en: "A brilliant scientist who documents the collapse of realities and bears witness to the multiverse's final moments.",
      es: "Una científica brillante que documenta el colapso de las realidades y es testigo de los momentos finales del multiverso."
    },
    details: {
      en: [
        "Class: Quantum Theorist",
        "Specialty: Reality Documentation",
        "Purpose: Convergence Theory"
      ],
      es: [
        "Clase: Teórica Cuántica",
        "Especialidad: Documentación de la Realidad",
        "Propósito: Teoría de la Convergencia"
      ]
    }
  },
  {
    id: "the-guide",
    name: "THE GUIDE",
    image: "/the-guide.png",
    element: "Ascension",
    role: "Echo of Failed Ascension",
    quote: {
      en: "I chose power. Learn from my fall.",
      es: "Elegí el poder. Aprende de mi caída."
    },
    description: {
      en: "A mysterious being connected to a previous failed ascension attempt, serving as both warning and wisdom.",
      es: "Un ser misterioso conectado a un intento previo de ascensión fallido, sirviendo tanto como advertencia como sabiduría."
    },
    details: {
      en: [
        "Origin: Previous Ascension",
        "Knowledge: Timeline Mastery",
        "Warning: Power's Price"
      ],
      es: [
        "Origen: Ascensión Previa",
        "Conocimiento: Maestría Temporal",
        "Advertencia: Precio del Poder"
      ]
    }
  },
  {
    id: "the-librarian",
    name: "THE LIBRARIAN",
    image: "/the-librarian.png",
    element: "Story",
    role: "Keeper of Infinite Stories",
    quote: {
      en: "Every ending births a new beginning. Choose wisely.",
      es: "Cada final da a luz un nuevo comienzo. Elige sabiamente."
    },
    description: {
      en: "Guardian of the cosmic library containing every possible timeline and outcome.",
      es: "Guardián de la biblioteca cósmica que contiene cada línea temporal y resultado posible."
    },
    details: {
      en: [
        "Domain: Cosmic Library",
        "Function: Story Preservation",
        "Choice: Timeline Selection"
      ],
      es: [
        "Dominio: Biblioteca Cósmica",
        "Función: Preservación de Historias",
        "Elección: Selección Temporal"
      ]
    }
  },
  {
    id: "the-mirror-master",
    name: "THE MIRROR MASTER",
    image: "/the-mirror-master.png",
    element: "Truth",
    role: "Reflection of Truth",
    quote: {
      en: "In my mirrors, you see not who you are, but who you choose to become.",
      es: "En mis espejos, no ves quién eres, sino quién eliges ser."
    },
    description: {
      en: "Master of the Hall of Mirrors, forcing heroes to confront their fractured selves and hidden truths.",
      es: "Maestro del Salón de los Espejos, obligando a los héroes a confrontar sus seres fracturados y verdades ocultas."
    },
    details: {
      en: [
        "Domain: Hall of Mirrors",
        "Power: Truth Revelation",
        "Purpose: Self-Confrontation"
      ],
      es: [
        "Dominio: Salón de Espejos",
        "Poder: Revelación de Verdades",
        "Propósito: Auto-Confrontación"
      ]
    }
  }
];
