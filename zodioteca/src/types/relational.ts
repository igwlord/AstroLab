export interface RelationalTechnique {
  name: string;
  symbol: string;
  description: string;
  keyAspects: string;
  practicalExample: string;
  shadows: string;
  chakras: string;
  frequency: number | string;
  exercise: string;
  category: 'main' | 'additional';
}

export const RELATIONAL_TECHNIQUES: RelationalTechnique[] = [
  {
    name: 'Sinastría',
    symbol: '💫',
    description: 'Es la comparación directa entre dos cartas natales. Se analizan los aspectos entre planetas y cómo los planetas de una persona caen en las casas de la otra. Es la técnica más usada para estudiar compatibilidad.',
    keyAspects: 'Sol – Luna (conexión vital) • Venus – Marte (atracción y pasión) • Saturno – planetas personales (compromiso, pruebas kármicas) • Nodos Lunares (vínculos de destino) • Casas activadas (muestran dónde influye el otro)',
    practicalExample: 'Marte de A conjunción a Venus de B → atracción inmediata. Saturno de A cuadratura al Sol de B → relación con lecciones de disciplina y compromiso.',
    shadows: 'Dependencias, obsesiones (Plutón), relaciones difíciles de cortar (Nodos + Saturno).',
    chakras: 'Corazón, Sacro, Corona',
    frequency: '639 / 417',
    exercise: 'Meditación en pareja con respiración sincronizada y afirmación: "Somos espejos y aprendemos juntos".',
    category: 'main'
  },
  {
    name: 'Carta Compuesta',
    symbol: '🔮',
    description: 'La carta compuesta se calcula tomando el punto medio entre los planetas de dos personas. No es una carta individual, sino la carta de la relación como entidad propia.',
    keyAspects: 'La identidad de la pareja (Sol compuesto) • La dinámica emocional (Luna compuesta) • El propósito y dirección (MC compuesto) • Las casas revelan las áreas que la pareja vivirá intensamente',
    practicalExample: 'Sol compuesto en Casa X → pareja con foco en proyectos profesionales. Luna compuesta en Casa IV → vínculo basado en hogar y familia.',
    shadows: 'La pareja puede sentirse atrapada en una "personalidad propia" que no refleja a cada individuo.',
    chakras: 'Corazón (amor compartido), Plexo Solar (identidad de la pareja)',
    frequency: 528,
    exercise: 'Crear juntos un altar simbólico con un objeto que represente la unión y meditar frente a él 10 minutos diarios.',
    category: 'main'
  },
  {
    name: 'Carta Davison',
    symbol: '🌌',
    description: 'La carta Davison se calcula tomando el punto medio real entre las fechas, horas y lugares de nacimiento de dos personas. Es una carta astronómicamente válida, a diferencia de la compuesta.',
    keyAspects: 'El "destino" o propósito de la relación • Eventos importantes que la pareja vivirá • Es más predictiva que la compuesta',
    practicalExample: 'Nodo Norte en Casa VII en Davison → relación destinada a aprender el compromiso. Venus en conjunción al Sol en Davison → vínculo donde el amor es central.',
    shadows: 'Puede revelar relaciones kármicas difíciles de evitar.',
    chakras: 'Corona (destino), Corazón (amor)',
    frequency: 963,
    exercise: 'Visualizar un cordón de luz que une ambos corazones y coronas, repitiendo: "Aceptamos nuestro camino compartido".',
    category: 'main'
  },
  {
    name: 'Astrocartografía Relacional',
    symbol: '🗺️',
    description: 'Muestra los lugares en el mundo donde la relación se activa más intensamente. Permite encontrar locaciones geográficas favorables para el vínculo.',
    keyAspects: 'Líneas planetarias activadas en mapas • Ubicaciones donde la pareja prospera • Ciudades que favorecen aspectos específicos de la relación',
    practicalExample: 'Venus de A línea MC en una ciudad → esa ciudad favorece el amor de la pareja. Júpiter cruzando la ubicación → expansión y oportunidades.',
    shadows: 'Idealizar lugares sin trabajar internamente la relación.',
    chakras: 'Raíz (conexión con la tierra), Corona (expansión)',
    frequency: 741,
    exercise: 'Visualizar juntos un mapa del mundo y poner luz dorada en los lugares que los llaman, pidiendo claridad sobre futuros viajes.',
    category: 'additional'
  },
  {
    name: 'Tránsitos a la Compuesta/Davison',
    symbol: '⏰',
    description: 'Permiten ver los momentos de crisis o expansión en la relación. Se analizan los tránsitos actuales sobre la carta compuesta o Davison para entender ciclos relacionales.',
    keyAspects: 'Saturno en tránsito (pruebas, maduración) • Júpiter en tránsito (expansión, oportunidades) • Plutón en tránsito (transformaciones profundas) • Urano (cambios inesperados)',
    practicalExample: 'Saturno en tránsito por Casa VII de la compuesta → pruebas en pareja, momento de definir compromiso. Júpiter sobre Venus compuesto → época de amor y abundancia.',
    shadows: 'Culpar a los tránsitos sin asumir responsabilidad en la relación.',
    chakras: 'Plexo Solar (voluntad), Corazón (amor)',
    frequency: '528 / 396',
    exercise: 'Llevar un diario compartido donde cada uno escribe cómo siente los ciclos actuales de la relación, leyéndolo en luna llena.',
    category: 'additional'
  },
  {
    name: 'Sinastría Kármica',
    symbol: '🔗',
    description: 'Se analizan Nodos, Lilith, Saturno y Quirón para ver aprendizajes de otras vidas. Muestra los vínculos del alma y las lecciones repetidas.',
    keyAspects: 'Nodos Lunares (camino del alma) • Lilith (sombra y deseo reprimido) • Saturno (deudas kármicas, lecciones) • Quirón (heridas compartidas para sanar)',
    practicalExample: 'Nodo Sur de A conjunción al Sol de B → relación con memorias pasadas, sensación de reconocimiento inmediato. Quirón de A sobre Luna de B → sanación emocional mutua.',
    shadows: 'Justificar patrones tóxicos con "karma", no trabajar activamente en la sanación.',
    chakras: 'Corona (memoria del alma), Corazón (sanación)',
    frequency: '963 / 417',
    exercise: 'Meditación guiada juntos recordando el momento en que se conocieron, preguntándose: "¿Qué vine a aprender/enseñar en esta relación?"',
    category: 'additional'
  }
];
