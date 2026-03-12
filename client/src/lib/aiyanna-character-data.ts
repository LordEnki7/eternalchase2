const aiyannaImagePath = "/media/characters/aiyanna.png";
const aiyannaVideoPath = "/media/young-aiyanna-waving.mp4";
const paisleyImagePath = "/media/characters/paisley.png";
const tariqImagePath = "/media/characters/tariq.png";
const zarekImagePath = "/media/characters/zarek.png";
const ixoraImagePath = "/media/characters/ixora.png";
const elenaImagePath = "/media/characters/elena-mercer.png";
const veraImagePath = "/media/characters/vera.png";

export interface AiyannaCharacter {
  id: string;
  name: {
    en: string;
    es: string;
  };
  description: {
    en: string;
    es: string;
  };
  abilities: {
    en: string;
    es: string;
  };
  quote: {
    en: string;
    es: string;
  };
  imageUrl: string;
  videoUrl?: string;
  hasVideo?: boolean;
}

// Young Aiyanna Saga (YA Sub-Series) - Complete character roster
// All seven characters from the Young Aiyanna Saga
// Using direct server path that works

export const aiyannaCharacters: AiyannaCharacter[] = [
  {
    id: 'aiyanna',
    name: {
      en: 'Aiyanna / Young Lyra',
      es: 'Aiyanna / Lyra Joven'
    },
    description: {
      en: 'Age 12, born with a mark tied to the Source. Origin: Planet Amara, raised on Earth by Grandma Ama. Witnessed her parents\' death through a hidden cosmic mirror. Curious, brave, and often misunderstood, she struggles with cosmic visions that show her destiny to reshape reality itself.',
      es: 'Edad 12, nacida con una marca ligada a la Fuente. Origen: Planeta Amara, criada en la Tierra por la Abuela Ama. Presenció la muerte de sus padres a través de un espejo cósmico oculto. Curiosa, valiente y a menudo incomprendida, lucha con visiones cósmicas que le muestran su destino de remodelar la realidad misma.'
    },
    abilities: {
      en: 'Source Touch / Vision - Born with cosmic visions and Source-marked destiny, will become the Cosmic Conduit who bears Starfire element',
      es: 'Toque de la Fuente / Visión - Nacida con visiones cósmicas y destino marcado por la Fuente, se convertirá en el Conducto Cósmico que porta el elemento Fuego Estelar'
    },
    quote: {
      en: "I can see things... things that haven't happened yet.",
      es: "Puedo ver cosas... cosas que aún no han pasado."
    },
    imageUrl: "",
    videoUrl: "/attached_assets/Aiyanna animation_1754208252967.mp4",
    hasVideo: true
  },
  {
    id: 'paisley',
    name: {
      en: 'Paisley',
      es: 'Paisley'
    },
    description: {
      en: "Aiyanna's best friend - funny, skeptical, but fiercely loyal. The grounded voice of reason who keeps Aiyanna anchored during her early visions. Uses humor to hide her fears about the strange things happening around her best friend. Her logical nature helps balance Aiyanna's mystical experiences.",
      es: 'La mejor amiga de Aiyanna: divertida, escéptica, pero ferozmente leal. La voz calmada de la razón que mantiene a Aiyanna tranquila durante sus primeras visiones. Usa el humor para ocultar sus miedos sobre las cosas extrañas que suceden alrededor de su mejor amiga. Su naturaleza lógica ayuda a equilibrar las experiencias místicas de Aiyanna.'
    },
    abilities: {
      en: 'Steadfast Light - Grounded logic, fierce loyalty, emotional stability, humor as protective shield against cosmic uncertainty',
      es: 'Luz Constante - Lógica firme, lealtad feroz, estabilidad emocional, humor como escudo protector contra la incertidumbre cósmica'
    },
    quote: {
      en: "Okay, that's definitely not normal... but I'm still with you.",
      es: "Está bien, eso definitivamente no es normal... pero aún estoy contigo."
    },
    imageUrl: paisleyImagePath,
    videoUrl: "/attached_assets/Paisley Animation_1754203397090.mp4",
    hasVideo: true
  },
  {
    id: 'tariq',
    name: {
      en: 'Tariq',
      es: 'Tariq'
    },
    description: {
      en: 'Childhood friend and aspiring explorer with dreams of discovering the stars. Adventurous, protective, and kind-hearted. Unlocks latent powers after a close call in Book 2, revealing he has cosmic potential tied to stellar navigation and dimensional exploration.',
      es: 'Amigo de la infancia y aspirante a explorador con sueños de descubrir las estrellas. Aventurero, protector y de buen corazón. Desbloquea poderes latentes después de un momento crítico en el Libro 2, revelando que tiene potencial cósmico ligado a la navegación estelar y la exploración dimensional.'
    },
    abilities: {
      en: 'Star Navigation - Cosmic exploration instincts, latent stellar powers, dimensional awareness, protective courage in crisis moments',
      es: 'Navegación Estelar - Instintos de exploración cósmica, poderes estelares latentes, conciencia dimensional, coraje protector en momentos de crisis'
    },
    quote: {
      en: "I'll follow you to the edge of the universe if I have to.",
      es: "Te seguiré hasta el borde del universo si es necesario."
    },
    imageUrl: tariqImagePath,
    videoUrl: "/attached_assets/Tariq Animation_1754204565418.mp4",
    hasVideo: true
  },
  {
    id: 'zarek',
    name: {
      en: 'Zarek',
      es: 'Zarek'
    },
    description: {
      en: 'The mysterious new kid from a different dimension. Guarded, strategic, and secretive, but fiercely loyal once trust is earned. Can sense fractures in time and space, making him invaluable for detecting dimensional threats. His arrival signals the beginning of greater cosmic dangers.',
      es: 'El nuevo chico misterioso de una dimensión diferente. Cauteloso, estratégico y reservado, pero ferozmente leal una vez que se gana la confianza. Puede sentir fracturas en el tiempo y el espacio, haciéndolo invaluable para detectar amenazas dimensionales. Su llegada señala el comienzo de peligros cósmicos mayores.'
    },
    abilities: {
      en: 'Fracture Sense - Dimensional origin awareness, time and space fracture detection, strategic thinking, guarded loyalty',
      es: 'Sentido de Fractura - Conciencia de origen dimensional, detección de fracturas de tiempo y espacio, pensamiento estratégico, lealtad cautelosa'
    },
    quote: {
      en: "I know what's coming... and we need to be ready.",
      es: "Sé lo que viene... y necesitamos estar listos."
    },
    imageUrl: zarekImagePath,
    videoUrl: "/attached_assets/Zarek animation_1754205158717.mp4",
    hasVideo: true
  },
  {
    id: 'ixora',
    name: {
      en: 'Ixora',
      es: 'Ixora'
    },
    description: {
      en: 'Cosmic empath who bonds with Lyra through dreams. Becomes a major force in the multiverse\'s healing. Might be a future version of someone from the YA storyline.',
      es: 'Empática cósmica que se conecta con Lyra a través de sueños. Se convierte en una fuerza importante en la sanación del multiverso. Podría ser una versión futura de alguien de la historia juvenil.'
    },
    abilities: {
      en: 'Dream Connection - Cosmic empathy, multiverse healing, potential future-self manifestation',
      es: 'Conexión de Sueños - Empatía cósmica, sanación del multiverso, manifestación potencial del yo futuro'
    },
    quote: {
      en: "Through dreams, all souls connect across time and space.",
      es: "A través de los sueños, todas las almas se conectan a través del tiempo y el espacio."
    },
    imageUrl: ixoraImagePath,
    videoUrl: "/attached_assets/IXORA animation_1754205868574.mp4",
    hasVideo: true
  },
  {
    id: 'elena',
    name: {
      en: 'Elena Mercer',
      es: 'Elena Mercer'
    },
    description: {
      en: 'Founder of the Convergence Institute with the power to perceive multiple timelines. Originally a marine biologist, she gained perception through Lyra\'s mark and now helps stitch realities back together. Her scientific background combined with mystical awareness makes her invaluable for understanding cosmic threats.',
      es: 'Fundadora del Instituto de Convergencia con el poder de percibir múltiples líneas temporales. Originalmente bióloga marina, obtuvo percepción a través de la marca de Lyra y ahora ayuda a coser las realidades de vuelta. Su trasfondo científico combinado con conciencia mística la hace invaluable para entender amenazas cósmicas.'
    },
    abilities: {
      en: 'Timeline Perception - Multiple timeline viewing, scientific analysis, reality stitching, Institute leadership, cosmic threat assessment',
      es: 'Percepción de Línea Temporal - Visualización de múltiples líneas temporales, análisis científico, cosido de realidad, liderazgo del Instituto, evaluación de amenazas cósmicas'
    },
    quote: {
      en: "I can see all the ways this could go wrong... and the one way it might go right.",
      es: "Puedo ver todas las formas en que esto podría salir mal... y la única forma en que podría salir bien."
    },
    imageUrl: elenaImagePath,
    videoUrl: "/attached_assets/Elena Mercer animation_1754207244773.mp4",
    hasVideo: true
  },
  {
    id: 'vera',
    name: {
      en: 'Vera',
      es: 'Vera'
    },
    description: {
      en: 'Reality refugee and Leader of Last Harbor, a sanctuary for displaced souls across dimensions. Witnessed her home world dissolve and is now dedicated to saving others from similar fates. A collapse survivor with deep community-building skills, she brings wisdom born from loss and the strength to forge hope from despair.',
      es: 'Refugiada de la realidad y Líder de Último Puerto, un santuario para almas desplazadas a través de dimensiones. Presenció la disolución de su mundo natal y ahora se dedica a salvar a otros de destinos similares. Una superviviente del colapso con profundas habilidades de construcción comunitaria, aporta sabiduría nacida de la pérdida y la fuerza para forjar esperanza desde la desesperación.'
    },
    abilities: {
      en: 'Sanctuary Leadership - Dimensional collapse survival, community building, refugee wisdom, Last Harbor management, hope cultivation',
      es: 'Liderazgo de Santuario - Supervivencia del colapso dimensional, construcción comunitaria, sabiduría de refugiada, gestión de Último Puerto, cultivo de esperanza'
    },
    quote: {
      en: "I\'ve seen worlds die, but I\'ve also seen love survive the impossible.",
      es: "He visto mundos morir, pero también he visto al amor sobrevivir lo imposible."
    },
    imageUrl: veraImagePath,
    videoUrl: "/attached_assets/Vera animation_1754206397993.mp4",
    hasVideo: true
  }
];