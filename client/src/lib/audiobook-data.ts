// Authentic Audiobook configuration for the Eternal Chase trilogy - All Real Audio Files
export interface AudioTrack {
  id: string;
  title: {
    en: string;
    es: string;
  };
  description: {
    en: string;
    es: string;
  };
  fileName: string;
  duration?: string;
  bookId?: string;
  chapterNumber?: number;
  type: 'intro' | 'prologue' | 'chapter' | 'full-book' | 'compilation' | 'epilogue' | 'special' | 'teaser';
}

export const audiobookTracks: AudioTrack[] = [
  // === SERIES INTRODUCTION - FREE CONTENT ===
  {
    id: 'final-trilogy-intro',
    title: {
      en: 'Now Entering the Final Trilogy Intro',
      es: 'Ahora Entrando al Intro de la Trilogía Final'
    },
    description: {
      en: 'Essential introduction to the complete Eternal Chase trilogy experience',
      es: 'Introducción esencial a la experiencia completa de la trilogía Eternal Chase'
    },
    fileName: '@assets/audiobooks/english/series-intros/Now Entering te Final Trilogy Intro_1753633285053.wav',
    duration: '4:18',
    bookId: 'spiral-galaxy',
    type: 'intro'
  },
  {
    id: 'prologue-before-chase',
    title: {
      en: 'Prologue: Before the Chase',
      es: 'Prólogo: Antes de la Persecución'
    },
    description: {
      en: 'The cosmic events that set everything in motion - discover the origins',
      es: 'Los eventos cósmicos que pusieron todo en movimiento - descubre los orígenes'
    },
    fileName: '@assets/audiobooks/english/series-intros/Prologue Before the Chase_1753633285053.wav',
    duration: '1:56',
    bookId: 'eternal-chase',
    type: 'prologue'
  },

  // === ETERNAL CHASE TRILOGY - MAIN SERIES ===
  
  // Book 1: The Pursuit for Love - Correct Chapter Order
  {
    id: 'book1-ch1-signal-calls',
    title: {
      en: 'Chapter 1: The Signal Calls',
      es: 'Capítulo 1: La Señal Llama'
    },
    description: {
      en: 'A mysterious signal calls across the cosmic void',
      es: 'Una señal misteriosa llama a través del vacío cósmico'
    },
    fileName: '@assets/audiobooks/english/book1-eternal-chase/Chapter 1 The Signal Calls.wav',
    duration: '3:55',
    bookId: 'eternal-chase',
    chapterNumber: 1,
    type: 'chapter'
  },
  {
    id: 'book1-ch2-stranger-shore',
    title: {
      en: 'Chapter 2: The Stranger on the Shore',
      es: 'Capítulo 2: El Extraño en la Orilla'
    },
    description: {
      en: 'A mysterious stranger appears on the cosmic shore',
      es: 'Un extraño misterioso aparece en la orilla cósmica'
    },
    fileName: '@assets/audiobooks/english/Chapter 2 — The Stranger on the Shore_1753633471744.wav',
    duration: '2:06',
    bookId: 'eternal-chase',
    chapterNumber: 2,
    type: 'chapter'
  },
  {
    id: 'book1-ch3-across-veil',
    title: {
      en: 'Chapter 3: Across the Veil (Finalized with Ship Crash)',
      es: 'Capítulo 3: A Través del Velo (Finalizado con Choque de Nave)'
    },
    description: {
      en: 'Crossing the dimensional veil ends in catastrophic ship crash',
      es: 'Cruzar el velo dimensional termina en choque catastrófico de nave'
    },
    fileName: '@assets/audiobooks/english/Chapter 3 — Across the Veil (Finalized with Ship Crash)_1753633471747.wav',
    duration: '9:15',
    bookId: 'eternal-chase',
    chapterNumber: 3,
    type: 'chapter'
  },
  {
    id: 'book1-ch4-shadows-bloodlines',
    title: {
      en: 'Chapter 4: Shadows and Bloodlines',
      es: 'Capítulo 4: Sombras y Linajes'
    },
    description: {
      en: 'Ancient bloodlines and dark shadows reveal hidden truths',
      es: 'Linajes antiguos y sombras oscuras revelan verdades ocultas'
    },
    fileName: '@assets/audiobooks/english/Chapter 4 — Shadows and Bloodlines_1753633471748.wav',
    duration: '3:17',
    bookId: 'eternal-chase',
    chapterNumber: 4,
    type: 'chapter'
  },
  {
    id: 'book1-ch5-echoes-power',
    title: {
      en: 'Chapter 5: Echoes of Power',
      es: 'Capítulo 5: Ecos del Poder'
    },
    description: {
      en: 'The echoes of ancient power begin to awaken',
      es: 'Los ecos del poder antiguo comienzan a despertar'
    },
    fileName: '@assets/audiobooks/english/Chapter 5 — Echoes of Power_1753633471749.wav',
    duration: '4:10',
    bookId: 'eternal-chase',
    chapterNumber: 5,
    type: 'chapter'
  },
  {
    id: 'book1-ch6-new-frontiers',
    title: {
      en: 'Chapter 6: New Frontiers, New Foes',
      es: 'Capítulo 6: Nuevas Fronteras, Nuevos Enemigos'
    },
    description: {
      en: 'Exploring uncharted territories brings dangerous new enemies',
      es: 'Explorar territorios inexplorados trae peligrosos nuevos enemigos'
    },
    fileName: '@assets/audiobooks/english/Chapter 6 — New Frontiers, New Foes_1753633551476.wav',
    duration: '3:34',
    bookId: 'eternal-chase',
    chapterNumber: 6,
    type: 'chapter'
  },
  {
    id: 'book1-ch7-into-fire',
    title: {
      en: 'Chapter 7: Into the Fire',
      es: 'Capítulo 7: Al Fuego'
    },
    description: {
      en: 'Heroes venture into the cosmic fire of battle',
      es: 'Los héroes se aventuran al fuego cósmico de la batalla'
    },
    fileName: '@assets/audiobooks/english/Chapter 7 — Into the Fire_1753633551477.wav',
    duration: '5:28',
    bookId: 'eternal-chase',
    chapterNumber: 7,
    type: 'chapter'
  },
  {
    id: 'book1-ch8-fractures-flames',
    title: {
      en: 'Chapter 8: Fractures and Flames',
      es: 'Capítulo 8: Fracturas y Llamas'
    },
    description: {
      en: 'Reality fractures as cosmic flames consume everything',
      es: 'La realidad se fractura mientras las llamas cósmicas consumen todo'
    },
    fileName: '@assets/audiobooks/english/Chapter 8 — Fractures and Flames_1753633551477.wav',
    duration: '2:38',
    bookId: 'eternal-chase',
    chapterNumber: 8,
    type: 'chapter'
  },
  {
    id: 'book1-ch9-echoes-infinite',
    title: {
      en: 'Chapter 9: Echoes of the Infinite',
      es: 'Capítulo 9: Ecos del Infinito'
    },
    description: {
      en: 'The infinite cosmos echoes with the sounds of destiny',
      es: 'El cosmos infinito resuena con los sonidos del destino'
    },
    fileName: '@assets/audiobooks/english/Chapter 9 — Echoes of the Infinite_1753633551478.wav',
    duration: '3:04',
    bookId: 'eternal-chase',
    chapterNumber: 9,
    type: 'chapter'
  },
  {
    id: 'book1-ch10-starborn-reawakening',
    title: {
      en: 'Chapter 10: The Starborn Reawakening',
      es: 'Capítulo 10: El Renacimiento de los Nacidos de las Estrellas'
    },
    description: {
      en: 'The starborn powers reawaken in their full cosmic glory',
      es: 'Los poderes nacidos de las estrellas renacen en toda su gloria cósmica'
    },
    fileName: '@assets/audiobooks/english/Chapter 10 — The Starborn Reawakening_1753633551479.wav',
    duration: '4:03',
    bookId: 'eternal-chase',
    chapterNumber: 10,
    type: 'chapter'
  },
  {
    id: 'book1-ch11-veil-memory',
    title: {
      en: 'Chapter 11: Veil of Memory, Voice of the Deep',
      es: 'Capítulo 11: Velo de la Memoria, Voz de las Profundidades'
    },
    description: {
      en: 'Memories hidden behind veils reveal the voice of cosmic depths',
      es: 'Memorias ocultas tras velos revelan la voz de las profundidades cósmicas'
    },
    fileName: '@assets/audiobooks/english/Chapter 11 —  Veil of Memory, Voice of the Deep_1753633664616.wav',
    duration: '4:23',
    bookId: 'eternal-chase',
    chapterNumber: 11,
    type: 'chapter'
  },
  {
    id: 'book1-ch12-union-forbidden',
    title: {
      en: 'Chapter 12: The Union Forbidden',
      es: 'Capítulo 12: La Unión Prohibida'
    },
    description: {
      en: 'A forbidden cosmic union threatens the fabric of reality',
      es: 'Una unión cósmica prohibida amenaza el tejido de la realidad'
    },
    fileName: '@assets/audiobooks/english/Chapter 12 — The Union Forbidden_1753633664617.wav',
    duration: '5:01',
    bookId: 'eternal-chase',
    chapterNumber: 12,
    type: 'chapter'
  },
  {
    id: 'book1-ch13-path-betrayal',
    title: {
      en: 'Chapter 13: The Path of Betrayal',
      es: 'Capítulo 13: El Sendero de la Traición'
    },
    description: {
      en: 'Betrayal cuts deep as allies turn against each other',
      es: 'La traición corta profundo mientras los aliados se vuelven unos contra otros'
    },
    fileName: '@assets/audiobooks/english/Chapter 13 — The Path of Betrayal_1753633664618.wav',
    duration: '4:39',
    bookId: 'eternal-chase',
    chapterNumber: 13,
    type: 'chapter'
  },
  {
    id: 'book1-ch14-ashes-choir',
    title: {
      en: 'Chapter 14: Ashes of the Choir',
      es: 'Capítulo 14: Cenizas del Coro'
    },
    description: {
      en: 'The cosmic choir lies in ashes as harmony falls to discord',
      es: 'El coro cósmico yace en cenizas mientras la armonía cae en discordia'
    },
    fileName: '@assets/audiobooks/english/Chapter 14 —  Ashes of the Choir_1753633664618.wav',
    duration: '4:41',
    bookId: 'eternal-chase',
    chapterNumber: 14,
    type: 'chapter'
  },
  {
    id: 'book1-ch15-place-fall',
    title: {
      en: 'Chapter 15: The Place of Their Fall',
      es: 'Capítulo 15: El Lugar de su Caída'
    },
    description: {
      en: 'The sacred place where heroes meet their ultimate test',
      es: 'El lugar sagrado donde los héroes enfrentan su prueba definitiva'
    },
    fileName: '@assets/audiobooks/english/Chapter 15 — The Place of Their Fall_1753633664619.wav',
    duration: '4:41',
    bookId: 'eternal-chase',
    chapterNumber: 15,
    type: 'chapter'
  },
  {
    id: 'book1-ch16-broken-throne',
    title: {
      en: 'Chapter 16: The Broken Throne',
      es: 'Capítulo 16: El Trono Roto'
    },
    description: {
      en: 'The cosmic throne lies shattered, power scattered across dimensions',
      es: 'El trono cósmico yace destrozado, el poder esparcido por las dimensiones'
    },
    fileName: '@assets/audiobooks/english/Chapter 16 — The Broken Throne_1753633664619.wav',
    duration: '4:04',
    bookId: 'eternal-chase',
    chapterNumber: 16,
    type: 'chapter'
  },
  {
    id: 'book1-ch17-echoes-first-light',
    title: {
      en: 'Chapter 17: Echoes of Light',
      es: 'Capítulo 17: Ecos de Luz'
    },
    description: {
      en: 'The final echoes of the first light illuminate the path forward',
      es: 'Los ecos finales de la primera luz iluminan el camino hacia adelante'
    },
    fileName: '@assets/audiobooks/english/Chapter 17 Echoes of Light_1753633664620.wav',
    duration: '3:58',
    bookId: 'eternal-chase',
    chapterNumber: 17,
    type: 'chapter'
  },

  // Book 2: Spiral Galaxy War - Free intro content
  {
    id: 'book2-cosmic-threads-ignited',
    title: {
      en: 'Cosmic Threads Ignited (Chapters 1-3 Breakdown)',
      es: 'Hilos Cósmicos Encendidos (Desglose de Capítulos 1-3)'
    },
    description: {
      en: 'Free breakdown of the first three chapters - essential introduction to the Spiral Galaxy War',
      es: 'Desglose gratuito de los primeros tres capítulos - introducción esencial a la Guerra de la Galaxia Espiral'
    },
    fileName: '@assets/Chapters 1-3 Cosmic Threads Ignited_1753634240430.wav',
    duration: '8:30',
    bookId: 'spiral-galaxy',
    type: 'special'
  },
  
  // Book 2: Main Chapters
  {
    id: 'book2-ch1-fractured-light',
    title: {
      en: 'Chapter 1: Fractured Light',
      es: 'Capítulo 1: Luz Fracturada'
    },
    description: {
      en: 'The spiral war begins with shattered realities and broken bonds',
      es: 'La guerra espiral comienza con realidades destrozadas y vínculos rotos'
    },
    fileName: '@assets/Chapter 1 Fractured Light_1753634045944.wav',
    duration: '2:27',
    bookId: 'spiral-galaxy',
    chapterNumber: 1,
    type: 'chapter'
  },
  {
    id: 'book2-ch2-heart-source',
    title: {
      en: 'Chapter 2: The Heart of the Source',
      es: 'Capítulo 2: El Corazón de la Fuente'
    },
    description: {
      en: 'The true nature of the cosmic Source is revealed',
      es: 'La verdadera naturaleza de la Fuente cósmica se revela'
    },
    fileName: '@assets/Chapter 2 The Heart of the Source_1753634045944.wav',
    duration: '3:31',
    bookId: 'spiral-galaxy',
    chapterNumber: 2,
    type: 'chapter'
  },
  {
    id: 'book2-ch3-shadows-echoes',
    title: {
      en: 'Chapter 3: Shadows and Echoes',
      es: 'Capítulo 3: Sombras y Ecos'
    },
    description: {
      en: 'Past and present collide in haunting reflections',
      es: 'Pasado y presente colisionan en reflexiones inquietantes'
    },
    fileName: '@assets/Chapter 3 Shadows and Echoes_1753634045945.wav',
    duration: '2:30',
    bookId: 'spiral-galaxy',
    chapterNumber: 3,
    type: 'chapter'
  },
  {
    id: 'book2-ch4-juducar-wrath',
    title: {
      en: 'Chapter 4: The Juducar\'s Wrath',
      es: 'Capítulo 4: La Ira del Juducar'
    },
    description: {
      en: 'Ancient cosmic judges unleash their terrible judgment',
      es: 'Antiguos jueces cósmicos desatan su terrible juicio'
    },
    fileName: '@assets/Chapter 4 The Juducars\' Wrath_1753634045945.wav',
    duration: '2:34',
    bookId: 'spiral-galaxy',
    chapterNumber: 4,
    type: 'chapter'
  },
  {
    id: 'book2-ch5-threads-fate',
    title: {
      en: 'Chapter 5: The Threads of Fate',
      es: 'Capítulo 5: Los Hilos del Destino'
    },
    description: {
      en: 'Destiny weaves together as cosmic forces align',
      es: 'El destino se entreteje mientras las fuerzas cósmicas se alinean'
    },
    fileName: '@assets/Chapter 5 The Threads of Fate_1753634045946.wav',
    duration: '2:00',
    bookId: 'spiral-galaxy',
    chapterNumber: 5,
    type: 'chapter'
  },
  {
    id: 'book2-ch6-ember-trust',
    title: {
      en: 'Chapter 6: Ember of Trust - Deep Patient Electric',
      es: 'Capítulo 6: Brasa de Confianza - Profundo Paciente Eléctrico'
    },
    description: {
      en: 'Trust burns like an ember in the electric depths of patience',
      es: 'La confianza arde como una brasa en las profundidades eléctricas de la paciencia'
    },
    fileName: '@assets/Chapter 6 Ember of Trust-Deep Patient Electric_1753634072732.wav',
    duration: '3:37',
    bookId: 'spiral-galaxy',
    chapterNumber: 6,
    type: 'chapter'
  },
  {
    id: 'book2-ch7-spirals-edge',
    title: {
      en: 'Chapter 7: Spiral\'s Edge',
      es: 'Capítulo 7: El Borde de la Espiral'
    },
    description: {
      en: 'Standing at the edge of the cosmic spiral where realities converge',
      es: 'De pie en el borde de la espiral cósmica donde las realidades convergen'
    },
    fileName: '@assets/Chapter 7 Spiral\'s Edge_1753634072733.wav',
    duration: '2:29',
    bookId: 'spiral-galaxy',
    chapterNumber: 7,
    type: 'chapter'
  },
  {
    id: 'book2-ch8-crossroads-fate',
    title: {
      en: 'Chapter 8: Crossroads of Fate',
      es: 'Capítulo 8: Encrucijadas del Destino'
    },
    description: {
      en: 'Critical decisions must be made at the crossroads of destiny',
      es: 'Se deben tomar decisiones críticas en las encrucijadas del destino'
    },
    fileName: '@assets/Chapter 8 Crossroads of Fate_1753634072735.wav',
    duration: '2:14',
    bookId: 'spiral-galaxy',
    chapterNumber: 8,
    type: 'chapter'
  },
  {
    id: 'book2-ch9-lost-connection',
    title: {
      en: 'Chapter 9: The Lost Connection',
      es: 'Capítulo 9: La Conexión Perdida'
    },
    description: {
      en: 'Vital connections are severed as the spiral war intensifies',
      es: 'Las conexiones vitales se cortan mientras la guerra espiral se intensifica'
    },
    fileName: '@assets/Chapter 9 The Lost Connection_1753634072737.wav',
    duration: '4:05',
    bookId: 'spiral-galaxy',
    chapterNumber: 9,
    type: 'chapter'
  },
  {
    id: 'book2-ch10-threads-fate-reckoning',
    title: {
      en: 'Chapter 10: Threads of Fate - The Reckoning',
      es: 'Capítulo 10: Hilos del Destino - El Ajuste de Cuentas'
    },
    description: {
      en: 'The threads of fate converge for the ultimate reckoning',
      es: 'Los hilos del destino convergen para el ajuste de cuentas final'
    },
    fileName: '@assets/Chapter 10 Threads of Fate - The Reckoning_1753634072738.wav',
    duration: '2:45',
    bookId: 'spiral-galaxy',
    chapterNumber: 10,
    type: 'chapter'
  },
  {
    id: 'book2-ch11-quiet-before-storm',
    title: {
      en: 'Chapter 11: Quiet Before the Storm',
      es: 'Capítulo 11: Calma Antes de la Tormenta'
    },
    description: {
      en: 'An eerie calm descends before the final cosmic battle',
      es: 'Una calma inquietante desciende antes de la batalla cósmica final'
    },
    fileName: '@assets/Chapter 11 Quiet Before the Storm_1753634240428.wav',
    duration: '3:10',
    bookId: 'spiral-galaxy',
    chapterNumber: 11,
    type: 'chapter'
  },
  {
    id: 'book2-ch12-reckoning-chase',
    title: {
      en: 'Chapter 12: The Reckoning Chase',
      es: 'Capítulo 12: La Persecución del Ajuste de Cuentas'
    },
    description: {
      en: 'The final chase begins as all forces converge for the reckoning',
      es: 'La persecución final comienza mientras todas las fuerzas convergen para el ajuste de cuentas'
    },
    fileName: '@assets/Chapter 12 The Reckoning Chase_1753634240429.wav',
    duration: '3:56',
    bookId: 'spiral-galaxy',
    chapterNumber: 12,
    type: 'chapter'
  },
  {
    id: 'book2-ch13-inferno-reflection',
    title: {
      en: 'Chapter 13: Inferno and Reflection',
      es: 'Capítulo 13: Infierno y Reflexión'
    },
    description: {
      en: 'The cosmic inferno forces deep reflection on the path ahead',
      es: 'El infierno cósmico fuerza una profunda reflexión sobre el camino por delante'
    },
    fileName: '@assets/Chapter 13 Inferno and Reflection_1754099165999.wav',
    duration: '2:53',
    bookId: 'spiral-galaxy',
    chapterNumber: 13,
    type: 'chapter'
  },
  {
    id: 'book2-ch14-embers-destiny',
    title: {
      en: 'Chapter 14: Embers of Destiny',
      es: 'Capítulo 14: Brasas del Destino'
    },
    description: {
      en: 'From the ashes of war, destiny\'s embers ignite a new future',
      es: 'De las cenizas de la guerra, las brasas del destino encienden un nuevo futuro'
    },
    fileName: '@assets/Chapter 14 Embers of Destiny_1753634240430.wav',
    duration: '2:23',
    bookId: 'spiral-galaxy',
    chapterNumber: 14,
    type: 'chapter'
  },
  // Book 2: Special Content
  {
    id: 'book2-epilogue-shadows-source',
    title: {
      en: 'Epilogue Teaser: Shadows of the Source',
      es: 'Adelanto del Epílogo: Sombras de la Fuente'
    },
    description: {
      en: 'A tantalizing glimpse into the shadows cast by the Source itself',
      es: 'Un vistazo tentador a las sombras proyectadas por la propia Fuente'
    },
    fileName: '@assets/Epilogue Teaser Shadows of the Source_1753634240431.wav',
    duration: '3:25',
    bookId: 'spiral-galaxy',
    type: 'epilogue'
  },
  {
    id: 'book2-puzzle-guide',
    title: {
      en: 'Puzzle Guide and Decode Key for Shadows of the Source Teaser',
      es: 'Guía de Rompecabezas y Clave de Decodificación para el Adelanto de Sombras de la Fuente'
    },
    description: {
      en: 'Essential guide to decode the mysteries hidden in the epilogue teaser',
      es: 'Guía esencial para decodificar los misterios ocultos en el adelanto del epílogo'
    },
    fileName: '@assets/Puzzle Guide and Decode Key for Shadows of the Source Teaser_1753634240431.wav',
    duration: '2:18',
    bookId: 'spiral-galaxy',
    type: 'special'
  },

  // === BOOK 3: ETERNAL CHASE ASCENSION'S EDGE ===
  
  // Chapter 1: Fractured Reflections (2 parts) - NOTE: Files missing, will show error but keep structure
  {
    id: 'book3-ch1-part1',
    title: {
      en: 'Chapter 1: Fractured Reflections Part One',
      es: 'Capítulo 1: Reflexiones Fracturadas Parte Uno'
    },
    description: {
      en: 'The beginning of the final confrontation',
      es: 'El comienzo de la confrontación final'
    },
    fileName: '@assets/audiobooks/english/book3-ascensions-edge/CHAPTER 1 FRACTURED REFLECTIONS Part One_1754104474669.wav',
    duration: '3:57',
    bookId: 'ascensions-edge',
    chapterNumber: 1,
    type: 'chapter'
  },
  {
    id: 'book3-ch1-part2',
    title: {
      en: 'Chapter 1: Fractured Reflections Part Two',
      es: 'Capítulo 1: Reflexiones Fracturadas Parte Dos'
    },
    description: {
      en: 'The fractured reality continues to unfold',
      es: 'La realidad fracturada continúa desarrollándose'
    },
    fileName: '@assets/audiobooks/english/book3-ascensions-edge/CHAPTER 1 FRACTURED REFLECTIONS Part two_1754104578517.wav',
    duration: '3:28',
    bookId: 'ascensions-edge',
    chapterNumber: 1,
    type: 'chapter'
  },

  // Chapter 2: The Architect's Gambit (2 parts)
  {
    id: 'book3-ch2-part1',
    title: {
      en: 'Chapter 2: The Architect\'s Gambit Part One',
      es: 'Capítulo 2: La Estratagema del Arquitecto Parte Uno'
    },
    description: {
      en: 'The Architect reveals their master plan',
      es: 'El Arquitecto revela su plan maestro'
    },
    fileName: '@assets/audiobooks/english/book3-ascensions-edge/CHAPTER 2 THE ARCHITECT\'S GAMBIT Part One_1754104958376.wav',
    duration: '3:57',
    bookId: 'ascensions-edge',
    chapterNumber: 2,
    type: 'chapter'
  },
  {
    id: 'book3-ch2-part2',
    title: {
      en: 'Chapter 2: The Architect\'s Gambit Part Two',
      es: 'Capítulo 2: La Estratagema del Arquitecto Parte Dos'
    },
    description: {
      en: 'The gambit reaches its climax',
      es: 'La estratagema alcanza su clímax'
    },
    fileName: '@assets/audiobooks/english/book3-ascensions-edge/CHAPTER 2 THE ARCHITECT\'S GAMBIT Part Two_1753634625850.wav',
    duration: '1:38',
    bookId: 'ascensions-edge',
    chapterNumber: 2,
    type: 'chapter'
  },
  
  // Chapter 3: Hunters in the Void
  {
    id: 'book3-ch3',
    title: {
      en: 'Chapter 3: Hunters in the Void',
      es: 'Capítulo 3: Cazadores en el Vacío'
    },
    description: {
      en: 'Ancient hunters emerge from the cosmic void',
      es: 'Cazadores antiguos emergen del vacío cósmico'
    },
    fileName: '@assets/audiobooks/english/book3-ascensions-edge/CHAPTER 3 HUNTERS IN THE VOID_1753634625850.wav',
    duration: '4:38',
    bookId: 'ascensions-edge',
    chapterNumber: 3,
    type: 'chapter'
  },
  
  // Chapter 4: The Burden of Godhood
  {
    id: 'book3-ch4',
    title: {
      en: 'Chapter 4: The Burden of Godhood',
      es: 'Capítulo 4: La Carga de la Divinidad'
    },
    description: {
      en: 'The weight of cosmic power becomes clear',
      es: 'El peso del poder cósmico se hace evidente'
    },
    fileName: '@assets/audiobooks/english/book3-ascensions-edge/CHAPTER 4 THE BURDEN OF GODHOOD_1753634625851.wav',
    duration: '4:28',
    bookId: 'ascensions-edge',
    chapterNumber: 4,
    type: 'chapter'
  },
  
  // Chapter 5: Veils Between Worlds
  {
    id: 'book3-ch5',
    title: {
      en: 'Chapter 5: Veils Between Worlds',
      es: 'Capítulo 5: Velos Entre Mundos'
    },
    description: {
      en: 'The barriers between realities begin to thin',
      es: 'Las barreras entre realidades comienzan a adelgazarse'
    },
    fileName: '@assets/audiobooks/english/book3-ascensions-edge/CHAPTER 5 VEILS BETWEEN WORLDS_1753634625851.wav',
    duration: '4:40',
    bookId: 'ascensions-edge',
    chapterNumber: 5,
    type: 'chapter'
  },
  
  // Chapter 6: The Price of Remembering
  {
    id: 'book3-ch6',
    title: {
      en: 'Chapter 6: The Price of Remembering',
      es: 'Capítulo 6: El Precio de Recordar'
    },
    description: {
      en: 'Memory comes with a devastating cost',
      es: 'La memoria viene con un costo devastador'
    },
    fileName: '@assets/audiobooks/english/book3-ascensions-edge/CHAPTER 6 THE PRICE OF REMEMBERING_1753634625852.wav',
    duration: '4:45',
    bookId: 'ascensions-edge',
    chapterNumber: 6,
    type: 'chapter'
  },
  
  // Chapter 7: The Unmaking
  {
    id: 'book3-ch7',
    title: {
      en: 'Chapter 7: The Unmaking',
      es: 'Capítulo 7: El Deshacer'
    },
    description: {
      en: 'Reality itself begins to unravel',
      es: 'La realidad misma comienza a desenredarse'
    },
    fileName: '@assets/audiobooks/english/book3-ascensions-edge/CHAPTER 7 THE UNMAKING_1753634764160.wav',
    duration: '4:26',
    bookId: 'ascensions-edge',
    chapterNumber: 7,
    type: 'chapter'
  },
  
  // Chapter 8: Fractured Heavens
  {
    id: 'book3-ch8',
    title: {
      en: 'Chapter 8: Fractured Heavens',
      es: 'Capítulo 8: Cielos Fracturados'
    },
    description: {
      en: 'The celestial realm tears apart',
      es: 'El reino celestial se desgarra'
    },
    fileName: '@assets/audiobooks/english/book3-ascensions-edge/CHAPTER 8 FRACTURED HEAVENS_1753634764161.wav',
    duration: '2:36',
    bookId: 'ascensions-edge',
    chapterNumber: 8,
    type: 'chapter'
  },
  
  // Chapter 9: The Last Horizon (2 parts)
  {
    id: 'book3-ch9-part1',
    title: {
      en: 'Chapter 9: The Last Horizon Part One',
      es: 'Capítulo 9: El Último Horizonte Parte Uno'
    },
    description: {
      en: 'The final boundary approaches',
      es: 'El límite final se acerca'
    },
    fileName: '@assets/audiobooks/english/book3-ascensions-edge/CHAPTER 9 THE LAST HORIZON Part One_1753634764161.wav',
    duration: '3:58',
    bookId: 'ascensions-edge',
    chapterNumber: 9,
    type: 'chapter'
  },
  {
    id: 'book3-ch9-part2',
    title: {
      en: 'Chapter 9: The Last Horizon Part Two',
      es: 'Capítulo 9: El Último Horizonte Parte Dos'
    },
    description: {
      en: 'The horizon reveals its ultimate truth',
      es: 'El horizonte revela su verdad última'
    },
    fileName: '@assets/audiobooks/english/book3-ascensions-edge/CHAPTER 9 THE LAST HORIZON Part Two_1753634764162.wav',
    duration: '2:07',
    bookId: 'ascensions-edge',
    chapterNumber: 9,
    type: 'chapter'
  },
  
  // Chapter 10: Ascension's Edge (2 parts)
  {
    id: 'book3-ch10-part1',
    title: {
      en: 'Chapter 10: Ascension\'s Edge Part One',
      es: 'Capítulo 10: El Filo de la Ascensión Parte Uno'
    },
    description: {
      en: 'The moment of transcendence begins',
      es: 'El momento de la trascendencia comienza'
    },
    fileName: '@assets/audiobooks/english/book3-ascensions-edge/CHAPTER 10 ASCENSION\'S EDGE Part One_1753634764162.wav',
    duration: '2:07',
    bookId: 'ascensions-edge',
    chapterNumber: 10,
    type: 'chapter'
  },
  {
    id: 'book3-ch10-part2',
    title: {
      en: 'Chapter 10: Ascension\'s Edge Part Two',
      es: 'Capítulo 10: El Filo de la Ascensión Parte Dos'
    },
    description: {
      en: 'The final ascension is achieved',
      es: 'La ascensión final se logra'
    },
    fileName: '@assets/audiobooks/english/book3-ascensions-edge/CHAPTER 10 ASCENSION\'S EDGE Part Two_1753634764163.wav',
    duration: '2:33',
    bookId: 'ascensions-edge',
    chapterNumber: 10,
    type: 'chapter'
  },

  // Book 3 Epilogue: Beyond the Veil
  {
    id: 'book3-epilogue-beyond-veil',
    title: {
      en: 'Epilogue: Beyond the Veil',
      es: 'Epílogo: Más Allá del Velo'
    },
    description: {
      en: 'The final journey beyond the cosmic veil',
      es: 'El viaje final más allá del velo cósmico'
    },
    fileName: '@assets/audiobooks/english/book3-ascensions-edge/EPILOGUE BEYOND THE VEIL_1753634764163.wav',
    duration: '2:03',
    bookId: 'ascensions-edge',
    chapterNumber: 11,
    type: 'epilogue'
  },

  // === AIYANNA SAGA - YOUNG ADULT PREQUEL SERIES ===
  
  // Aiyanna Book 1: The Dream Again - Opening Chapter
  {
    id: 'aiyanna-ch1-dream-again',
    title: {
      en: 'Chapter 1: The Dream Again',
      es: 'Capítulo 1: El Sueño Otra Vez'
    },
    description: {
      en: 'The sea glowed beneath her feet - Aiyanna\'s mystical journey begins',
      es: 'El mar brillaba bajo sus pies - comienza el viaje místico de Aiyanna'
    },
    fileName: '@assets/Chapter 1 The Dream Again The sea glowed beneath her feet_1753988027279.wav',
    duration: '4:50',
    bookId: 'aiyanna-stories',
    chapterNumber: 1,
    type: 'chapter'
  },
  

  // Chapter 2: The Glowing Tide (2 parts)
  {
    id: 'aiyanna-ch2-glowing-tide-part1',
    title: {
      en: 'Chapter 2: The Glowing Tide Part 1',
      es: 'Capítulo 2: La Marea Brillante Parte 1'
    },
    description: {
      en: 'The cosmic tide begins to reveal its mysteries',
      es: 'La marea cósmica comienza a revelar sus misterios'
    },
    fileName: '@assets/audiobooks/english/Chapter 2 The Glowing Tide Part 1_1753764693819.wav',
    duration: '6:15',
    bookId: 'aiyanna-stories',
    chapterNumber: 2,
    type: 'chapter'
  },
  {
    id: 'aiyanna-ch2-glowing-tide-part2',
    title: {
      en: 'Chapter 2: The Glowing Tide Part 2',
      es: 'Capítulo 2: La Marea Brillante Parte 2'
    },
    description: {
      en: 'The tide\'s power crescendos as Aiyanna learns to navigate its flow',
      es: 'El poder de la marea aumenta mientras Aiyanna aprende a navegar su flujo'
    },
    fileName: '@assets/audiobooks/english/Chapter 2 The Glowing Tide Part 2_1753764702786.wav',
    duration: '7:20',
    bookId: 'aiyanna-stories',
    chapterNumber: 2,
    type: 'chapter'
  },
  
  // Chapter 3: Shadows and Bloodlines
  {
    id: 'aiyanna-ch3-shadows-bloodlines',
    title: {
      en: 'Chapter 3: Shadows and Bloodlines',
      es: 'Capítulo 3: Sombras y Linajes'
    },
    description: {
      en: 'Ancient bloodlines and shadow forces converge',
      es: 'Linajes antiguos y fuerzas sombrias convergen'
    },
    fileName: '@assets/audiobooks/english/Chapter 3 Shadows and Echoes_1753634045945.wav',
    duration: '6:45',
    bookId: 'aiyanna-stories',
    chapterNumber: 3,
    type: 'chapter'
  },
  {
    id: 'aiyanna-ch5-fractures-flames',
    title: {
      en: 'Chapter 5: Fractures and Flames',
      es: 'Capítulo 5: Fracturas y Llamas'
    },
    description: {
      en: 'Reality begins to fracture as cosmic flames ignite Aiyanna\'s power',
      es: 'La realidad comienza a fracturarse mientras las llamas cósmicas encienden el poder de Aiyanna'
    },
    fileName: '@assets/audiobooks/english/Chapter 5 The Threads of Fate_1753634045946.wav',
    duration: '9:15',
    bookId: 'aiyanna-stories',
    chapterNumber: 5,
    type: 'chapter'
  },
  {
    id: 'aiyanna-ch6-starborn-reawakening',
    title: {
      en: 'Chapter 6: The Starborn Reawakening',
      es: 'Capítulo 6: El Renacimiento de los Nacidos de las Estrellas'
    },
    description: {
      en: 'Aiyanna awakens to her true starborn heritage and cosmic destiny',
      es: 'Aiyanna despierta a su verdadero linaje estelar y destino cósmico'
    },
    fileName: '@assets/audiobooks/english/Chapter 10 — The Starborn Reawakening_1753633551479.wav',
    duration: '12:30',
    bookId: 'aiyanna-stories',
    chapterNumber: 6,
    type: 'chapter'
  },
  {
    id: 'aiyanna-ch3-null-shadow-part2',
    title: {
      en: 'Chapter 3: The Null\'s Shadow Part Two',
      es: 'Capítulo 3: La Sombra del Vacío Parte Dos'
    },
    description: {
      en: 'The shadow deepens as Aiyanna faces the void',
      es: 'La sombra se profundiza mientras Aiyanna enfrenta el vacío'
    },
    fileName: '@assets/audiobooks/english/Chapter 3 The Null\'s Shadow Part two_1753640853824.wav',
    duration: '5:30',
    bookId: 'aiyanna-stories',
    chapterNumber: 3,
    type: 'chapter'
  },
  {
    id: 'aiyanna-ch3-null-shadow-part3',
    title: {
      en: 'Chapter 3: The Null\'s Shadow Part Three',
      es: 'Capítulo 3: La Sombra del Vacío Parte Tres'
    },
    description: {
      en: 'Confronting the heart of the Null\'s darkness',
      es: 'Confrontando el corazón de la oscuridad del Vacío'
    },
    fileName: '@assets/audiobooks/english/Chapter 3 The Null\'s Shadow Part Three_1753640853822.wav',
    duration: '7:15',
    bookId: 'aiyanna-stories',
    chapterNumber: 3,
    type: 'chapter'
  },
  {
    id: 'aiyanna-ch3-null-shadow-part4',
    title: {
      en: 'Chapter 3: The Null\'s Shadow Part Four',
      es: 'Capítulo 3: La Sombra del Vacío Parte Cuatro'
    },
    description: {
      en: 'The battle against the shadow intensifies',
      es: 'La batalla contra la sombra se intensifica'
    },
    fileName: '@assets/audiobooks/english/Chapter 3 The Null\'s Shadow Part four_1753640853821.wav',
    duration: '6:20',
    bookId: 'aiyanna-stories',
    chapterNumber: 3,
    type: 'chapter'
  },
  {
    id: 'aiyanna-ch3-null-shadow-part5',
    title: {
      en: 'Chapter 3: The Null\'s Shadow Part Five',
      es: 'Capítulo 3: La Sombra del Vacío Parte Cinco'
    },
    description: {
      en: 'The shadow\'s final revelation and Aiyanna\'s triumph',
      es: 'La revelación final de la sombra y el triunfo de Aiyanna'
    },
    fileName: '@assets/audiobooks/english/Chapter 3 The Null\'s Shadow Part five_1753640853820.wav',
    duration: '8:10',
    bookId: 'aiyanna-stories',
    chapterNumber: 3,
    type: 'chapter'
  },
  
  // Chapter 4: The Whispering Shard (4 parts)
  {
    id: 'aiyanna-ch4-whispering-shard-part1',
    title: {
      en: 'Chapter 4: The Whispering Shard Part One',
      es: 'Capítulo 4: El Fragmento Susurrante Parte Uno'
    },
    description: {
      en: 'Discovery of the ancient shard that holds cosmic secrets',
      es: 'Descubrimiento del fragmento antiguo que guarda secretos cósmicos'
    },
    fileName: '@assets/audiobooks/english/Chapter 4 The Whispering Shard Part One_1753641177052.wav',
    duration: '5:45',
    bookId: 'aiyanna-stories',
    chapterNumber: 4,
    type: 'chapter'
  },
  {
    id: 'aiyanna-ch4-whispering-shard-part2',
    title: {
      en: 'Chapter 4: The Whispering Shard Part Two',
      es: 'Capítulo 4: El Fragmento Susurrante Parte Dos'
    },
    description: {
      en: 'The shard\'s whispers reveal hidden truths about the cosmos',
      es: 'Los susurros del fragmento revelan verdades ocultas sobre el cosmos'
    },
    fileName: '@assets/audiobooks/english/Chapter 4 The Whispering Shard Part two_1753641177054.wav',
    duration: '6:30',
    bookId: 'aiyanna-stories',
    chapterNumber: 4,
    type: 'chapter'
  },
  {
    id: 'aiyanna-ch4-whispering-shard-part3',
    title: {
      en: 'Chapter 4: The Whispering Shard Part Three',
      es: 'Capítulo 4: El Fragmento Susurrante Parte Tres'
    },
    description: {
      en: 'Unlocking the shard\'s power and understanding its purpose',
      es: 'Desbloqueando el poder del fragmento y entendiendo su propósito'
    },
    fileName: '@assets/audiobooks/english/Chapter 4 The Whispering Shard Part Three_1753641177053.wav',
    duration: '7:05',
    bookId: 'aiyanna-stories',
    chapterNumber: 4,
    type: 'chapter'
  },
  {
    id: 'aiyanna-ch4-whispering-shard-part4',
    title: {
      en: 'Chapter 4: The Whispering Shard Part Four',
      es: 'Capítulo 4: El Fragmento Susurrante Parte Cuatro'
    },
    description: {
      en: 'The shard\'s final whisper and its transformative impact',
      es: 'El susurro final del fragmento y su impacto transformador'
    },
    fileName: '@assets/audiobooks/english/Chapter 4 The Whispering Shard Part four_1753641177051.wav',
    duration: '8:25',
    bookId: 'aiyanna-stories',
    chapterNumber: 4,
    type: 'chapter'
  },
  
  // Chapter 5: The Archive of Whispers (3 parts)
  {
    id: 'aiyanna-ch5-archive-whispers-part1',
    title: {
      en: 'Chapter 5: The Archive of Whispers Part One',
      es: 'Capítulo 5: El Archivo de Susurros Parte Uno'
    },
    description: {
      en: 'Entering the mystical archive that holds the universe\'s memories',
      es: 'Entrando al archivo místico que guarda las memorias del universo'
    },
    fileName: '@assets/audiobooks/english/Chapter 5 The Archive of Whispers Part One_1753641303823.wav',
    duration: '2:03',
    bookId: 'aiyanna-stories',
    chapterNumber: 5,
    type: 'chapter'
  },
  {
    id: 'aiyanna-ch5-archive-whispers-part2',
    title: {
      en: 'Chapter 5: The Archive of Whispers Part Two',
      es: 'Capítulo 5: El Archivo de Susurros Parte Dos'
    },
    description: {
      en: 'Navigating the depths of cosmic knowledge and ancient wisdom',
      es: 'Navegando las profundidades del conocimiento cósmico y la sabiduría antigua'
    },
    fileName: '@assets/audiobooks/english/Chapter 5 THe Archive of Whispers Part Two_1753641303824.wav',
    duration: '8:15',
    bookId: 'aiyanna-stories',
    chapterNumber: 5,
    type: 'chapter'
  },
  {
    id: 'aiyanna-ch5-archive-whispers-part3',
    title: {
      en: 'Chapter 5: The Archive of Whispers Part Three',
      es: 'Capítulo 5: El Archivo de Susurros Parte Tres'
    },
    description: {
      en: 'The archive\'s ultimate revelation and its impact on Aiyanna\'s destiny',
      es: 'La revelación final del archivo y su impacto en el destino de Aiyanna'
    },
    fileName: '@assets/audiobooks/english/Chapter 5 The Archive of Whispers Part Three_1753641303824.wav',
    duration: '6:55',
    bookId: 'aiyanna-stories',
    chapterNumber: 5,
    type: 'chapter'
  },
  
  // Chapter 6: The Resonance of Trisolar (2 parts)
  {
    id: 'aiyanna-ch6-resonance-trisolar-part1',
    title: {
      en: 'Chapter 6: The Resonance of Trisolar Part One',
      es: 'Capítulo 6: La Resonancia de Trisolar Parte Uno'
    },
    description: {
      en: 'Connecting with the triple star system\'s cosmic harmonies',
      es: 'Conectando con las armonías cósmicas del sistema de triple estrella'
    },
    fileName: '@assets/audiobooks/english/Chapter 6 The Resonance of Trisolar Part One_1753641303825.wav',
    duration: '9:20',
    bookId: 'aiyanna-stories',
    chapterNumber: 6,
    type: 'chapter'
  },
  {
    id: 'aiyanna-ch6-resonance-trisolar-part2',
    title: {
      en: 'Chapter 6: The Resonance of Trisolar Part Two',
      es: 'Capítulo 6: La Resonancia de Trisolar Parte Dos'
    },
    description: {
      en: 'Mastering the Trisolar resonance and understanding its true power',
      es: 'Dominando la resonancia Trisolar y entendiendo su verdadero poder'
    },
    fileName: '@assets/audiobooks/english/Chapter 6 The Resonance of Trisolar Part two_1753641303825.wav',
    duration: '8:40',
    bookId: 'aiyanna-stories',
    chapterNumber: 6,
    type: 'chapter'
  },
  {
    id: 'aiyanna-epilogue-resonance-legacy',
    title: {
      en: 'Epilogue: The Resonance Legacy',
      es: 'Epílogo: El Legado de la Resonancia'
    },
    description: {
      en: 'The conclusion of Aiyanna\'s transformation and the legacy she creates',
      es: 'La conclusión de la transformación de Aiyanna y el legado que crea'
    },
    fileName: '@assets/Epilogue The Resonance Legacy_1753652166064.wav',
    duration: '5:30',
    bookId: 'aiyanna-stories',
    type: 'epilogue'
  },

  // === BOOK 2: AIYANNA ARCHITECTS OF RESONANCE - THE FRACTURED SONG ===
  
  // Epilogue: The Song of Tomorrow (First)
  {
    id: 'book2-epilogue-song-tomorrow',
    title: {
      en: 'Epilogue: The Song of Tomorrow',
      es: 'Epílogo: La Canción del Mañana'
    },
    description: {
      en: 'The hopeful conclusion that sets up the future of the cosmos',
      es: 'La conclusión esperanzadora que establece el futuro del cosmos'
    },
    fileName: '@assets/audiobooks/english/Epilogue The Song of Tomorrow_1753651995023.wav',
    duration: '6:30',
    bookId: 'book2-fractured-song',
    type: 'epilogue'
  },
  
  // Chapter 1: The Song of Defiance
  {
    id: 'book2-ch1-song-defiance',
    title: {
      en: 'Chapter 1: The Song of Defiance',
      es: 'Capítulo 1: La Canción de la Rebeldía'
    },
    description: {
      en: 'Aiyanna begins her defiant stand against the cosmic forces',
      es: 'Aiyanna comienza su resistencia desafiante contra las fuerzas cósmicas'
    },
    fileName: '@assets/Chapter 1 The Song of Defiance_1753989743208.wav',
    duration: '8:45',
    bookId: 'book2-fractured-song',
    chapterNumber: 1,
    type: 'chapter'
  },
  // Chapter 2: The Shattered Sanctuary
  {
    id: 'book2-ch2-shattered-sanctuary',
    title: {
      en: 'Chapter 2: The Shattered Sanctuary',
      es: 'Capítulo 2: El Santuario Fragmentado'
    },
    description: {
      en: 'The sacred places of power lie in ruins as the battle escalates',
      es: 'Los lugares sagrados del poder yacen en ruinas mientras la batalla se intensifica'
    },
    fileName: '@assets/audiobooks/english/Chapter 2 The Shattered Sanctuary_1753651995021.wav',
    duration: '9:20',
    bookId: 'book2-fractured-song',
    chapterNumber: 2,
    type: 'chapter'
  },
  // Chapter 3: The Path of Echoes
  {
    id: 'book2-ch3-path-echoes',
    title: {
      en: 'Chapter 3: The Path of Echoes',
      es: 'Capítulo 3: El Sendero de los Ecos'
    },
    description: {
      en: 'Following the ancient pathways that connect all realities',
      es: 'Siguiendo los senderos antiguos que conectan todas las realidades'
    },
    fileName: '@assets/audiobooks/english/Chapter 3 he Path of Echoes_1753651995021.wav',
    duration: '7:30',
    bookId: 'book2-fractured-song',
    chapterNumber: 3,
    type: 'chapter'
  },
  
  // Chapter 4: The Veil of Silence
  {
    id: 'book2-ch4-veil-silence',
    title: {
      en: 'Chapter 4: The Veil of Silence',
      es: 'Capítulo 4: El Velo del Silencio'
    },
    description: {
      en: 'In the realm beyond sound, the final truths are revealed',
      es: 'En el reino más allá del sonido, se revelan las verdades finales'
    },
    fileName: '@assets/audiobooks/english/Chapter 4 The Song of the Silent Ones_1753652166062.wav',
    duration: '8:15',
    bookId: 'book2-fractured-song',
    chapterNumber: 4,
    type: 'chapter'
  },
  
  // Chapter 5: The Unseen Horizon
  {
    id: 'book2-ch5-unseen-horizon',
    title: {
      en: 'Chapter 5: The Unseen Horizon',
      es: 'Capítulo 5: El Horizonte Invisible'
    },
    description: {
      en: 'The climactic conclusion as Aiyanna faces her ultimate destiny',
      es: 'La conclusión climática mientras Aiyanna enfrenta su destino final'
    },
    fileName: '@assets/audiobooks/english/Chapter 5 The Unseen Horizon_1753651995022.wav',
    duration: '10:45',
    bookId: 'book2-fractured-song',
    chapterNumber: 5,
    type: 'chapter'
  },
  
  // Prologue: The Fractured Song (At the end)
  {
    id: 'book2-prologue-fractured-song',
    title: {
      en: 'Prologue: The Fractured Song - Aiyanna Architects of Resonance Book Two',
      es: 'Prólogo: La Canción Fracturada - Aiyanna Arquitectos de Resonancia Libro Dos'
    },
    description: {
      en: 'The bridge that connects the trilogy and sets up the cosmic journey ahead',
      es: 'El puente que conecta la trilogía y establece el viaje cósmico por delante'
    },
    fileName: '@assets/audiobooks/english/PROLOG~1_1753766544101.WAV',
    duration: '5:45',
    bookId: 'book2-fractured-song',
    type: 'prologue'
  },


  // === BOOK 3: ARCHITECTS OF RESONANCE - THE WHISPERS OF A NEW WORLD ===
  
  // Epilogue: The Resonance Legacy (At the front)
  {
    id: 'book3-epilogue-resonance-legacy',
    title: {
      en: 'Epilogue: The Resonance Legacy',
      es: 'Epílogo: El Legado de la Resonancia'
    },
    description: {
      en: 'The conclusion of Aiyanna\'s transformation and the legacy she creates',
      es: 'La conclusión de la transformación de Aiyanna y el legado que crea'
    },
    fileName: '@assets/audiobooks/english/Epilogue The Resonance Legacy_1753652166064.wav',
    duration: '6:30',
    bookId: 'book3-whispers-new-world',
    type: 'epilogue'
  },
  
  // Chapter 1: The Resonance of Trisolar
  {
    id: 'book3-ch1-resonance-trisolar',
    title: {
      en: 'Chapter 1: The Resonance of Trisolar',
      es: 'Capítulo 1: La Resonancia de Trisolar'
    },
    description: {
      en: 'Aiyanna enters the cosmic realm of Trisolar where resonance shapes reality',
      es: 'Aiyanna entra al reino cósmico de Trisolar donde la resonancia forma la realidad'
    },
    fileName: '@assets/audiobooks/english/Chapter 1 The Resonance of Trisolar_1753652166060.wav',
    duration: '8:45',
    bookId: 'book3-whispers-new-world',
    chapterNumber: 1,
    type: 'chapter'
  },
  
  // Chapter 2: The Labyrinth of Echoes
  {
    id: 'book3-ch2-labyrinth-echoes',
    title: {
      en: 'Chapter 2: The Labyrinth of Echoes',
      es: 'Capítulo 2: El Laberinto de Ecos'
    },
    description: {
      en: 'Navigating through the maze where past and future echo through dimensions',
      es: 'Navegando por el laberinto donde el pasado y futuro resuenan a través de dimensiones'
    },
    fileName: '@assets/audiobooks/english/Chapter 2 The Labyrinth of Echoes_1753652166061.wav',
    duration: '9:15',
    bookId: 'book3-whispers-new-world',
    chapterNumber: 2,
    type: 'chapter'
  },
  
  // Chapter 3: The Mirror Chamber
  {
    id: 'book3-ch3-mirror-chamber',
    title: {
      en: 'Chapter 3: The Mirror Chamber',
      es: 'Capítulo 3: La Cámara de Espejos'
    },
    description: {
      en: 'Confronting truth and illusion in the chamber where reality reflects itself',
      es: 'Enfrentando verdad e ilusión en la cámara donde la realidad se refleja a sí misma'
    },
    fileName: '@assets/audiobooks/english/Chapter 3 The Mirror Chamber_1753652166061.wav',
    duration: '7:30',
    bookId: 'book3-whispers-new-world',
    chapterNumber: 3,
    type: 'chapter'
  },
  
  // Chapter 4: The Song of the Silent Ones
  {
    id: 'book3-ch4-song-silent-ones',
    title: {
      en: 'Chapter 4: The Song of the Silent Ones',
      es: 'Capítulo 4: La Canción de los Silenciosos'
    },
    description: {
      en: 'Learning the ancient song from those who speak without words',
      es: 'Aprendiendo la canción antigua de aquellos que hablan sin palabras'
    },
    fileName: '@assets/audiobooks/english/Chapter 4 The Song of the Silent Ones_1753652166062.wav',
    duration: '8:20',
    bookId: 'book3-whispers-new-world',
    chapterNumber: 4,
    type: 'chapter'
  },
  
  // Chapter 5: The Dawn of Resonance
  {
    id: 'book3-ch5-dawn-resonance',
    title: {
      en: 'Chapter 5: The Dawn of Resonance',
      es: 'Capítulo 5: El Amanecer de la Resonancia'
    },
    description: {
      en: 'The climactic awakening as Aiyanna masters the ultimate resonance',
      es: 'El despertar climático mientras Aiyanna domina la resonancia definitiva'
    },
    fileName: '@assets/audiobooks/english/Chapter 5 The Dawn of Resonance_1753652166064.wav',
    duration: '0:34',
    bookId: 'book3-whispers-new-world',
    chapterNumber: 5,
    type: 'chapter'
  },

  // === FREE CONTENT - PROLOGUE BRIDGE ===
  
  // Prologue: The Fractured Song - Book Two (Free Content - Bridge between Book 1 and 2)
  {
    id: 'prologue-fractured-song-book2',
    title: {
      en: 'Prologue: The Fractured Song - Aiyanna Architects of Resonance Book Two',
      es: 'Prólogo: La Canción Fracturada - Aiyanna Arquitectos de Resonancia Libro Dos'
    },
    description: {
      en: 'Free to listen - Introduction to Book Two of the Aiyanna Trilogy',
      es: 'Gratis para escuchar - Introducción al Libro Dos de la Trilogía Aiyanna'
    },
    fileName: '@assets/PROLOG~1_1753766544101.WAV',
    duration: '4:45',
    bookId: 'book1-bridge',
    type: 'prologue'
  },

  // === ALTERNATE SERIES TRACKS ===
  
  // Alternative character perspectives and special episodes
  {
    id: 'dream-again-opening',
    title: {
      en: 'The Dream Again: Opening',
      es: 'El Sueño Otra Vez: Apertura'
    },
    description: {
      en: 'The sea glowed beneath her feet as the cosmic dream begins anew',
      es: 'El mar brillaba bajo sus pies mientras el sueño cósmico comienza de nuevo'
    },
    fileName: '@assets/Chapter 1 The Dream Again The sea glowed beneath her feet_1753640853819.wav',
    bookId: 'special-episodes',
    type: 'special'
  },
  {
    id: 'nulls-shadow-collection',
    title: {
      en: 'The Null\'s Shadow: Complete Arc',
      es: 'La Sombra del Nulo: Arco Completo'
    },
    description: {
      en: 'The complete five-part arc exploring the mysterious Null\'s Shadow',
      es: 'El arco completo de cinco partes explorando la misteriosa Sombra del Nulo'
    },
    fileName: '@assets/Chapter 3 The Null\'s Shadow Part One_1753640853821.wav',
    bookId: 'special-episodes',
    type: 'compilation'
  },
  {
    id: 'whispering-shard-complete',
    title: {
      en: 'The Whispering Shard: Full Story',
      es: 'El Fragmento Susurrante: Historia Completa'
    },
    description: {
      en: 'The complete four-part story of the mysterious whispering shard',
      es: 'La historia completa de cuatro partes del misterioso fragmento susurrante'
    },
    fileName: '@assets/Chapter 4 The Whispering Shard Part One_1753641177052.wav',
    bookId: 'special-episodes',
    type: 'compilation'
  },
  {
    id: 'archive-whispers-full',
    title: {
      en: 'The Archive of Whispers: Complete Collection',
      es: 'El Archivo de Susurros: Colección Completa'
    },
    description: {
      en: 'The full three-part exploration of the Archive of Whispers',
      es: 'La exploración completa de tres partes del Archivo de Susurros'
    },
    fileName: '@assets/Chapter 5 The Archive of Whispers Part One_1753641303823.wav',
    bookId: 'special-episodes',
    type: 'compilation'
  },

  // === SPANISH LANGUAGE AUDIOBOOKS ===
  
  // Spanish versions of main chapters
  {
    id: 'spanish-ch1-luz-fracturada',
    title: {
      en: 'Chapter 1: Fractured Light (Spanish)',
      es: 'Capítulo 1: Luz Fracturada'
    },
    description: {
      en: 'Spanish narration of the opening chapter with fractured cosmic light',
      es: 'Narración en español del capítulo de apertura con luz cósmica fracturada'
    },
    fileName: '@assets/Capítulo 1 Luz Fracturada_1753640178618.wav',
    bookId: 'eternal-chase-spanish',
    chapterNumber: 1,
    type: 'chapter'
  },
  {
    id: 'spanish-ch3-sombras-ecos',
    title: {
      en: 'Chapter 3: Shadows and Echoes (Spanish)',
      es: 'Capítulo 3: Sombras y Ecos'
    },
    description: {
      en: 'Spanish narration exploring the interplay of shadows and cosmic echoes',
      es: 'Narración en español explorando la interacción de sombras y ecos cósmicos'
    },
    fileName: '@assets/Capítulo 3 Sombras y Ecos_1753640178619.wav',
    bookId: 'eternal-chase-spanish',
    chapterNumber: 3,
    type: 'chapter'
  },
  {
    id: 'spanish-ch5-ecos-poder',
    title: {
      en: 'Chapter 5: Echoes of Power (Spanish)',
      es: 'Capítulo 5: Ecos del Poder'
    },
    description: {
      en: 'Spanish narration of the power awakening and cosmic echoes',
      es: 'Narración en español del despertar del poder y ecos cósmicos'
    },
    fileName: '@assets/Capítulo 5 — Ecos del Poder_1753635311803.wav',
    bookId: 'eternal-chase-spanish',
    chapterNumber: 5,
    type: 'chapter'
  },
  {
    id: 'spanish-ch7-el-deshacer',
    title: {
      en: 'Chapter 7: The Unmaking (Spanish)',
      es: 'Capítulo 7: El Deshacer'
    },
    description: {
      en: 'Spanish narration of reality\'s unraveling in the cosmic war',
      es: 'Narración en español del desenredo de la realidad en la guerra cósmica'
    },
    fileName: '@assets/CAPÍTULO 7 EL DESHACER_1753640574002.wav',
    bookId: 'eternal-chase-spanish',
    chapterNumber: 7,
    type: 'chapter'
  },
  {
    id: 'spanish-ch9-conexion-perdida',
    title: {
      en: 'Chapter 9: The Lost Connection (Spanish)',
      es: 'Capítulo 9: La Conexión Perdida'
    },
    description: {
      en: 'Spanish narration of the critical lost connection that changes everything',
      es: 'Narración en español de la conexión perdida crítica que lo cambia todo'
    },
    fileName: '@assets/Capítulo 9 La Conexión Perdida_1753640178622.wav',
    bookId: 'eternal-chase-spanish',
    chapterNumber: 9,
    type: 'chapter'
  },
  {
    id: 'spanish-epilogue-mas-alla-velo',
    title: {
      en: 'Epilogue: Beyond the Veil (Spanish)',
      es: 'Epílogo: Más Allá del Velo'
    },
    description: {
      en: 'Spanish narration of the journey beyond the cosmic veil',
      es: 'Narración en español del viaje más allá del velo cósmico'
    },
    fileName: '@assets/EPÍLOGO MÁS ALLÁ DEL VELO_1753640574005.wav',
    bookId: 'eternal-chase-spanish',
    type: 'epilogue'
  },

  // === NEXT SAGA PREVIEW ===
  
  // Infinite Dawn Saga Preview
  {
    id: 'infinite-dawn-prologue-teaser',
    title: {
      en: 'PREVIEW: Eternal Chase - Infinite Dawn Prologue',
      es: 'ADELANTO: Persecución Eterna - Prólogo del Amanecer Infinito'
    },
    description: {
      en: 'First glimpse into the next saga: "Echoes of Tomorrow" - What lies beyond ascension?',
      es: 'Primer vistazo a la siguiente saga: "Ecos del Mañana" - ¿Qué yace más allá de la ascensión?'
    },
    fileName: '@assets/TEASER INFINATE DAWN PROLOGUE ECHOES OF TOMORROW_1753634764164.wav',
    bookId: 'infinite-dawn',
    type: 'teaser'
  },
  {
    id: 'ecos-manana-prologo',
    title: {
      en: 'Echoes of Tomorrow Prologue (Spanish)',
      es: 'Prólogo: Ecos del Mañana'
    },
    description: {
      en: 'Spanish version of the next saga\'s prologue teaser',
      es: 'Versión en español del avance del prólogo de la siguiente saga'
    },
    fileName: '@assets/PRÓLOGO ECOS DEL MAÑANA_1753640574006.wav',
    bookId: 'infinite-dawn-spanish',
    type: 'teaser'
  }
];

// Export book collections for easy navigation
export const bookCollections = {
  'eternal-chase': {
    title: { en: 'Eternal Chase', es: 'Persecución Eterna' },
    description: { en: 'The original love story across dimensions', es: 'La historia de amor original a través de dimensiones' }
  },
  'spiral-galaxy': {
    title: { en: 'Spiral Galaxy War', es: 'Guerra de la Galaxia Espiral' },
    description: { en: 'The cosmic war that threatens all existence', es: 'La guerra cósmica que amenaza toda existencia' }
  },
  'ascensions-edge': {
    title: { en: 'Eternal Chase: Ascension\'s Edge', es: 'Persecución Eterna: El Filo de la Ascensión' },
    description: { en: 'The final battle for cosmic ascension', es: 'La batalla final por la ascensión cósmica' }
  },
  'aiyanna-book1': {
    title: { en: 'Aiyanna: The Resonance of Trisolar', es: 'Aiyanna: La Resonancia de Trisolar' },
    description: { en: 'Young Aiyanna\'s journey begins', es: 'El viaje de la joven Aiyanna comienza' }
  },
  'infinite-dawn': {
    title: { en: 'Eternal Chase: Infinite Dawn (Preview)', es: 'Persecución Eterna: Amanecer Infinito (Adelanto)' },
    description: { en: 'The next saga begins beyond ascension', es: 'La siguiente saga comienza más allá de la ascensión' }
  },
  'special-episodes': {
    title: { en: 'Special Episodes', es: 'Episodios Especiales' },
    description: { en: 'Alternative perspectives and bonus content', es: 'Perspectivas alternativas y contenido adicional' }
  },
  'eternal-chase-spanish': {
    title: { en: 'Eternal Chase (Spanish)', es: 'Persecución Eterna (Español)' },
    description: { en: 'Spanish narration of the main series', es: 'Narración en español de la serie principal' }
  },
  'aiyanna-stories': {
    title: { en: 'Aiyanna Chronicles', es: 'Crónicas de Aiyanna' },
    description: { en: 'Young Adult sci-fi romance featuring Aiyanna\'s complete journey', es: 'Romance de ciencia ficción juvenil con el viaje completo de Aiyanna' }
  },
  'book2-fractured-song': {
    title: { en: 'Book 2: The Fractured Song', es: 'Libro 2: La Canción Fracturada' },
    description: { en: 'Confronting the Null Order and mastering cosmic powers', es: 'Enfrentando la Orden del Nulo y dominando poderes cósmicos' }
  },
  'book3-whispers-new-world': {
    title: { en: 'Book 3: Whispers of a New World', es: 'Libro 3: Susurros de un Nuevo Mundo' },
    description: { en: 'The epic conclusion in Trisolar and the final transformation', es: 'La conclusión épica en Trisolar y la transformación final' }
  },
  'free-content': {
    title: { en: 'Free Content', es: 'Contenido Gratuito' },
    description: { en: 'Free epilogue content for all listeners', es: 'Contenido gratuito de epílogo para todos los oyentes' }
  },
  'book1-bridge': {
    title: { en: 'Book 1 to Book 2 Bridge', es: 'Puente del Libro 1 al Libro 2' },
    description: { en: 'Free prologue connecting Book 1 to Book 2', es: 'Prólogo gratuito que conecta el Libro 1 con el Libro 2' }
  }

};

// Utility functions for component compatibility
export const getChaptersByBookId = (bookId: string): AudioTrack[] => {
  // For Book 1 (eternal-chase), only return numbered chapters for main episode list
  if (bookId === 'eternal-chase') {
    return audiobookTracks.filter(track => 
      track.bookId === bookId && track.type === 'chapter'
    ).sort((a, b) => (a.chapterNumber || 0) - (b.chapterNumber || 0));
  }
  
  // For Book 2 (spiral-galaxy), only return numbered chapters for main episode list
  if (bookId === 'spiral-galaxy') {
    return audiobookTracks.filter(track => 
      track.bookId === bookId && track.type === 'chapter'
    ).sort((a, b) => (a.chapterNumber || 0) - (b.chapterNumber || 0));
  }
  
  // For other books, only return numbered chapters
  return audiobookTracks.filter(track => 
    track.bookId === bookId && track.type === 'chapter'
  ).sort((a, b) => (a.chapterNumber || 0) - (b.chapterNumber || 0));
};

export const getTracksByType = (type: AudioTrack['type']): AudioTrack[] => {
  return audiobookTracks.filter(track => track.type === type);
};

export const getSpecialContentByBookId = (bookId: string): AudioTrack[] => {
  return audiobookTracks.filter(track => 
    track.bookId === bookId && ['compilation', 'special', 'epilogue'].includes(track.type)
  );
};

export const getFreeContentByBookId = (bookId: string): AudioTrack[] => {
  return audiobookTracks.filter(track => 
    track.bookId === bookId && ['special', 'intro', 'epilogue', 'prologue'].includes(track.type)
  );
};

export const getTrackByBookId = (bookId: string): AudioTrack | undefined => {
  return audiobookTracks.find(track => track.bookId === bookId);
};

// Book ID mappings for backward compatibility
export const getTracksByBookId = (bookId: string): AudioTrack[] => {
  // Map old book IDs to new ones
  const bookIdMapping: { [key: string]: string } = {
    'pursuit-for-love': 'eternal-chase',
    'spiral-war': 'spiral-galaxy',
    'ascensions-edge': 'aiyanna-book1',
    'pursuit-for-love-spanish': 'eternal-chase-spanish',
    'spiral-war-spanish': 'eternal-chase-spanish',
    'ascensions-edge-spanish': 'eternal-chase-spanish',
    'aiyanna-stories': 'aiyanna-book1',
    'aiyanna-book2': 'special-episodes',
    'aiyanna-book3': 'special-episodes',
    'infinite-dawn-spanish': 'infinite-dawn-spanish'
  };

  const mappedBookId = bookIdMapping[bookId] || bookId;
  return audiobookTracks.filter(track => track.bookId === mappedBookId);
};