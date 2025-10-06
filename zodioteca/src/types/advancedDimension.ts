/**
 * Dimensiones Astrológicas Avanzadas
 * Técnicas que exploran diferentes dimensiones del alma y la práctica astrológica
 */

export interface AdvancedDimension {
  id: string;
  name: string;
  icon: string;
  subtitle: string;
  description: string;
  interpretation: string;
  exercises: {
    title: string;
    icon: string;
    description: string;
  }[];
  frequency: string; // Frecuencia solfeggio asociada
  chakra?: string;
  duration?: string;
  gradient: string;
  border: string;
  textColor: string;
}

export const ADVANCED_DIMENSIONS: AdvancedDimension[] = [
  {
    id: 'draconica',
    name: 'Dracónica',
    icon: '🐉',
    subtitle: 'Carta Dracónica',
    description: 'La carta dracónica es una carta natal basada en el eje nodal lunar, en la cual el Nodo Norte se coloca en 0° de Aries. Representa una dimensión del alma, conectada con el propósito espiritual, la memoria del alma, y los patrones kármicos profundos.',
    interpretation: 'Es como una "carta del alma" que muestra motivaciones más allá de lo consciente. Comparándola con la carta natal tropical, puedes ver los contrastes entre tu personalidad actual y tu esencia espiritual.',
    exercises: [
      {
        title: 'Meditación de los Nodos',
        icon: '🌿',
        description: 'Siéntate en silencio y medita sobre los conceptos de Nodo Norte y Nodo Sur en tu carta dracónica. Visualiza qué legado vienes a transformar y qué cualidades debes integrar.'
      },
      {
        title: 'Diario del Alma',
        icon: '📝',
        description: 'Escribe durante una semana cómo tus acciones reflejan tu carta natal tropical vs. tu carta dracónica. Observa las tensiones o alineaciones.'
      }
    ],
    frequency: '963 Hz',
    chakra: 'Corona',
    duration: '20-30 minutos',
    gradient: 'from-purple-600 to-indigo-700',
    border: 'border-purple-400',
    textColor: 'text-purple-700'
  },
  {
    id: 'horaria',
    name: 'Horaria',
    icon: '🕰️',
    subtitle: 'Astrología Horaria',
    description: 'Es una técnica antigua que responde a una pregunta específica mediante una carta levantada para el momento exacto en que se formula la pregunta. No requiere la carta natal del consultante.',
    interpretation: 'La carta responde de forma clara si la pregunta es genuina. Se analizan casas, regencias, dignidades, y aspectos, como si el cielo respondiera en tiempo real.',
    exercises: [
      {
        title: 'El Diario de las Preguntas',
        icon: '🔮',
        description: 'Cada vez que tengas una pregunta importante, anota la hora exacta y dibuja (o haz en una app) la carta horaria. Interprétala o haz journaling de tu intuición.'
      },
      {
        title: 'Check-in emocional',
        icon: '🧘‍♂️',
        description: 'Antes de formular la pregunta, haz una pausa de respiración consciente para alinear tu energía. Esto ayuda a que la pregunta sea auténtica.'
      }
    ],
    frequency: '741 Hz',
    chakra: 'Tercer Ojo',
    duration: '15-20 minutos',
    gradient: 'from-blue-600 to-cyan-700',
    border: 'border-blue-400',
    textColor: 'text-blue-700'
  },
  {
    id: 'electiva',
    name: 'Electiva',
    icon: '🕯️',
    subtitle: 'Astrología Electiva',
    description: 'Es la rama que se encarga de elegir el mejor momento astrológico para realizar una acción importante: bodas, operaciones, mudanzas, lanzamientos, etc.',
    interpretation: 'Se elige un momento donde los planetas favorecen el propósito del evento, alineando intención y cosmos.',
    exercises: [
      {
        title: 'Calendario Lunar Intencional',
        icon: '📅',
        description: 'Planifica acciones personales importantes en sintonía con la Luna (por ejemplo, iniciar proyectos en Luna creciente).'
      },
      {
        title: 'Ritual de Intención',
        icon: '✨',
        description: 'Cuando inicies algo en un momento electivo, acompáñalo de un pequeño ritual (vela, afirmación, objeto simbólico).'
      }
    ],
    frequency: '528 Hz',
    chakra: 'Plexo Solar',
    duration: '10-15 minutos',
    gradient: 'from-yellow-500 to-orange-600',
    border: 'border-yellow-400',
    textColor: 'text-yellow-700'
  },
  {
    id: 'astrocartografia',
    name: 'Astrocartografía',
    icon: '🌍',
    subtitle: 'Mapa Astrológico Mundial',
    description: 'Técnica que muestra cómo se expresan los planetas en diferentes partes del mundo. Se usa para encontrar lugares que favorezcan amor, trabajo, sanación, transformación, etc.',
    interpretation: 'Cada línea planetaria en el mapa indica una experiencia dominante en ese lugar. Por ejemplo, una línea de Venus puede indicar donde encuentras amor o belleza.',
    exercises: [
      {
        title: 'Mapa del Alma',
        icon: '🗺️',
        description: 'Imprime tu mapa astrocartográfico. Marca las líneas más importantes (Sol, Luna, Venus, Saturno) y reflexiona sobre tu relación con esos lugares.'
      },
      {
        title: 'Viaje Interno Guiado',
        icon: '🧳',
        description: 'Si no puedes viajar físicamente, haz una visualización guiada hacia un lugar donde tengas una línea importante y siente cómo influye tu energía.'
      }
    ],
    frequency: '396 Hz',
    chakra: 'Raíz',
    duration: '25-30 minutos',
    gradient: 'from-green-600 to-teal-700',
    border: 'border-green-400',
    textColor: 'text-green-700'
  },
  {
    id: 'sinastra',
    name: 'Sinastría',
    icon: '💞',
    subtitle: 'Compatibilidad Astrológica',
    description: 'Técnica que compara dos cartas natales para analizar la compatibilidad, dinámica y aprendizaje en una relación.',
    interpretation: 'Revela cómo los planetas de una persona afectan a la otra y viceversa. Se observan aspectos entre planetas personales, casas activadas, nodos, etc.',
    exercises: [
      {
        title: 'Cartas Astrológicas del Corazón',
        icon: '💌',
        description: 'Compara tu carta con la de una pareja, familiar o amigo. Escribe una carta a esa persona desde la comprensión astrológica, sin juicio.'
      },
      {
        title: 'Rueda de Espejos',
        icon: '🔁',
        description: 'Reflexiona sobre qué te muestra la otra persona sobre ti mismo a través los aspectos tensos o armónicos.'
      }
    ],
    frequency: '639 Hz',
    chakra: 'Corazón',
    duration: '20-25 minutos',
    gradient: 'from-pink-500 to-rose-600',
    border: 'border-pink-400',
    textColor: 'text-pink-700'
  },
  {
    id: 'compuesta',
    name: 'Carta Compuesta',
    icon: '♾️',
    subtitle: 'Identidad de la Relación',
    description: 'Una carta simbólica que surge al promediar dos cartas natales. Representa la "identidad de la relación" como un ente propio, más allá de las personas involucradas.',
    interpretation: 'Se analizan casas, aspectos y planetas como si la relación misma fuera una persona.',
    exercises: [
      {
        title: 'Teatro del Vínculo',
        icon: '🎭',
        description: 'Crea una especie de personaje con los rasgos de la carta compuesta. ¿Qué necesita esa "persona-relación" para crecer?'
      },
      {
        title: 'Mandala de la Relación',
        icon: '💠',
        description: 'Dibuja un mandala representando las energías de la carta compuesta. Esto activa la integración simbólica.'
      }
    ],
    frequency: '852 Hz',
    chakra: 'Tercer Ojo',
    duration: '30-40 minutos',
    gradient: 'from-indigo-600 to-violet-700',
    border: 'border-indigo-400',
    textColor: 'text-indigo-700'
  },
  {
    id: 'davison',
    name: 'Carta Davison',
    icon: '🪐',
    subtitle: 'Punto Medio Espacio-Temporal',
    description: 'Similar a la compuesta, pero en vez de un promedio simbólico, toma el punto medio real en tiempo y espacio entre los dos nacimientos. La carta resultante se interpreta como una entidad viva, con destino y evolución propia.',
    interpretation: 'La carta Davison tiene tránsitos, progresiones y evolución en el tiempo. Es útil para ver el "camino conjunto" de una relación.',
    exercises: [
      {
        title: 'Línea del Tiempo Compartida',
        icon: '🔭',
        description: 'Investiga tránsitos importantes a la carta Davison a lo largo de tu relación. ¿Qué eventos ocurrieron en esos momentos?'
      },
      {
        title: 'Collage del Destino Relacional',
        icon: '🎨',
        description: 'Crea un collage visual que represente los arquetipos principales del Davison (Sol, Luna, Ascendente, etc.).'
      }
    ],
    frequency: '417 Hz',
    chakra: 'Sacro',
    duration: '25-35 minutos',
    gradient: 'from-amber-600 to-orange-700',
    border: 'border-amber-400',
    textColor: 'text-amber-700'
  }
];
