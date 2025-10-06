export interface Ascendant {
  sign: string;
  symbol: string;
  description: string;
  manifestation: string;
  shadows: string;
  ruler: string;
  color: string;
  chakra: string;
  frequency: number;
  exercise: string;
}

export const ASCENDANTS: Ascendant[] = [
  {
    sign: 'Aries',
    symbol: '♈',
    description: 'Personas directas, enérgicas y valientes. Se muestran al mundo con impulso, iniciativa y espíritu competitivo. Transmiten dinamismo y pasión.',
    manifestation: 'Suelen ser los primeros en actuar, liderar o tomar decisiones rápidas.',
    shadows: 'Impaciencia, impulsividad, agresividad.',
    ruler: 'Marte → su posición en la carta es clave',
    color: 'Rojo',
    chakra: 'Raíz',
    frequency: 396,
    exercise: 'Hacer ejercicio físico diario para canalizar la energía y repetir: "Soy acción consciente".'
  },
  {
    sign: 'Tauro',
    symbol: '♉',
    description: 'Transmiten calma, seguridad y sensualidad. Su presencia es estable, confiable y conectada con lo material y lo natural.',
    manifestation: 'Disfrutan de la comida, la comodidad y proyectan solidez.',
    shadows: 'Terquedad, apego al confort.',
    ruler: 'Venus',
    color: 'Verde esmeralda',
    chakra: 'Corazón',
    frequency: 528,
    exercise: 'Caminar descalzo sobre la tierra conectando con la respiración.'
  },
  {
    sign: 'Géminis',
    symbol: '♊',
    description: 'Personas curiosas, inquietas y comunicativas. Se presentan con simpatía, frescura y adaptabilidad.',
    manifestation: 'Hablan mucho, preguntan, buscan movimiento e intercambio.',
    shadows: 'Dispersión, superficialidad, nerviosismo.',
    ruler: 'Mercurio',
    color: 'Amarillo',
    chakra: 'Garganta',
    frequency: 741,
    exercise: 'Escribir cada mañana lo que sienten y leerlo en voz alta.'
  },
  {
    sign: 'Cáncer',
    symbol: '♋',
    description: 'De apariencia sensible, protectora y maternal. Su energía es cálida y acogedora, aunque reservada al inicio.',
    manifestation: 'Cuidan a los demás, proyectan ternura y generan confianza.',
    shadows: 'Susceptibilidad, apego a la familia.',
    ruler: 'Luna',
    color: 'Plateado/Blanco',
    chakra: 'Corazón',
    frequency: 639,
    exercise: 'Encender una vela blanca en casa y agradecer por el propio hogar.'
  },
  {
    sign: 'Leo',
    symbol: '♌',
    description: 'Personas magnéticas, expresivas y creativas. Suelen atraer miradas y transmitir seguridad y vitalidad.',
    manifestation: 'Buscan brillar, ser reconocidos y liderar.',
    shadows: 'Orgullo, dramatismo, egocentrismo.',
    ruler: 'Sol',
    color: 'Dorado',
    chakra: 'Plexo Solar',
    frequency: 528,
    exercise: 'Practicar danza libre o expresión artística frente al espejo.'
  },
  {
    sign: 'Virgo',
    symbol: '♍',
    description: 'De apariencia ordenada, analítica y servicial. Transmiten modestia, practicidad y atención al detalle.',
    manifestation: 'Cuidan la salud, organizan, planifican y observan mucho.',
    shadows: 'Crítica, autoexigencia, nerviosismo.',
    ruler: 'Mercurio',
    color: 'Verde oliva',
    chakra: 'Plexo Solar',
    frequency: 528,
    exercise: 'Limpiar o ordenar un espacio con plena consciencia.'
  },
  {
    sign: 'Libra',
    symbol: '♎',
    description: 'Atractivos, diplomáticos y sociables. Se muestran con gracia, armonía y búsqueda de equilibrio.',
    manifestation: 'Buscan compañía, relaciones y belleza en todo lo que hacen.',
    shadows: 'Indecisión, necesidad de aprobación.',
    ruler: 'Venus',
    color: 'Rosa suave',
    chakra: 'Corazón',
    frequency: 639,
    exercise: 'Armonizar un espacio con flores, aromas o música.'
  },
  {
    sign: 'Escorpio',
    symbol: '♏',
    description: 'De mirada profunda e intensa, generan magnetismo y misterio. Se presentan como reservados y poderosos.',
    manifestation: 'Inspiran respeto, atraen experiencias transformadoras.',
    shadows: 'Celos, posesividad, manipulación.',
    ruler: 'Plutón (moderno) / Marte (tradicional)',
    color: 'Negro / Granate',
    chakra: 'Sacro',
    frequency: 417,
    exercise: 'Escribir un miedo y quemarlo como símbolo de liberación.'
  },
  {
    sign: 'Sagitario',
    symbol: '♐',
    description: 'Alegres, optimistas y aventureros. Se muestran abiertos, simpáticos y con energía expansiva.',
    manifestation: 'Suelen viajar, reírse fuerte, hablar de filosofía o compartir entusiasmo.',
    shadows: 'Exceso, falta de compromiso.',
    ruler: 'Júpiter',
    color: 'Púrpura',
    chakra: 'Tercer Ojo',
    frequency: 852,
    exercise: 'Leer 10 minutos un texto espiritual o filosófico cada día.'
  },
  {
    sign: 'Capricornio',
    symbol: '♑',
    description: 'Serios, responsables y disciplinados. Se presentan como confiables, maduros y enfocados en el logro.',
    manifestation: 'Transmiten autoridad, se muestran trabajadores y con objetivos claros.',
    shadows: 'Frialdad, rigidez, ambición excesiva.',
    ruler: 'Saturno',
    color: 'Gris oscuro',
    chakra: 'Raíz',
    frequency: 396,
    exercise: 'Escribir un plan de acción para una meta concreta y dar el primer paso hoy.'
  },
  {
    sign: 'Acuario',
    symbol: '♒',
    description: 'Originales, creativos y diferentes. Proyectan independencia, rebeldía y visión de futuro.',
    manifestation: 'Se relacionan con grupos, defienden ideales y buscan innovación.',
    shadows: 'Desapego, frialdad, excentricidad excesiva.',
    ruler: 'Urano (moderno) / Saturno (tradicional)',
    color: 'Azul eléctrico',
    chakra: 'Garganta + Corona',
    frequency: 741,
    exercise: 'Probar un hábito nuevo (rutina distinta, aprender algo diferente).'
  },
  {
    sign: 'Piscis',
    symbol: '♓',
    description: 'Sensibles, compasivos y soñadores. Se muestran empáticos, artísticos y espirituales. Su aura suele ser etérea.',
    manifestation: 'Buscan ayudar, inspirar, conectar con lo invisible.',
    shadows: 'Evasión, indecisión, confusión.',
    ruler: 'Neptuno (moderno) / Júpiter (tradicional)',
    color: 'Violeta',
    chakra: 'Corona',
    frequency: 963,
    exercise: '15 minutos de meditación visualizando agua violeta que limpia y conecta con la unidad.'
  }
];
