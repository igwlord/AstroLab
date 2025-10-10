import type { ZodiacFrequencies } from '../types/zodiacFrequency';

/**
 * Datos de las 12 Frecuencias Zodiacales
 * Cada signo incluye su chakra, frecuencia sagrada y ejercicio holístico
 */

export const ZODIAC_FREQUENCIES: ZodiacFrequencies = [
  {
    id: 'aries',
    name: 'Aries',
    symbol: '♈',
    element: 'fuego',
    dates: '21 Mar - 19 Abr',
    chakra: {
      name: 'Raíz (Muladhara)',
      location: 'Base de la columna'
    },
    frequency: 396,
    audioFile: '/media/396.mp3',
    color: {
      primary: 'Rojo intenso',
      gradient: 'from-red-600 via-red-500 to-orange-600',
      hex: '#DC2626'
    },
    exercise: {
      title: 'Anclaje de Fuego',
      description: 'Imaginá una luz roja encendiéndose en la base de tu columna. Sentí la fuerza de la tierra sosteniéndote.',
      affirmation: 'Estoy presente. Mi energía avanza con decisión y confianza.'
    }
  },
  {
    id: 'tauro',
    name: 'Tauro',
    symbol: '♉',
    element: 'tierra',
    dates: '20 Abr - 20 May',
    chakra: {
      name: 'Corazón (Anahata)',
      location: 'Centro del pecho'
    },
    frequency: 528,
    audioFile: '/media/528.mp3',
    color: {
      primary: 'Verde esmeralda',
      secondary: 'Rosa pálido',
      gradient: 'from-emerald-500 via-green-400 to-teal-500',
      hex: '#10B981'
    },
    exercise: {
      title: 'Apertura del Corazón',
      description: 'Colocá una mano sobre tu pecho y respirá lento. Con cada exhalación, soltá tensiones y abrí espacio al placer simple.',
      affirmation: 'Merezco abundancia, calma y belleza en mi vida.'
    }
  },
  {
    id: 'geminis',
    name: 'Géminis',
    symbol: '♊',
    element: 'aire',
    dates: '21 May - 20 Jun',
    chakra: {
      name: 'Garganta (Vishuddha)',
      location: 'Centro de la garganta'
    },
    frequency: 741,
    audioFile: '/media/741.mp3',
    color: {
      primary: 'Amarillo brillante',
      gradient: 'from-yellow-400 via-amber-300 to-yellow-500',
      hex: '#FBBF24'
    },
    exercise: {
      title: 'Espiral de Claridad',
      description: 'Visualizá una espiral amarilla girando en tu garganta. Inhalá claridad, exhalá autenticidad.',
      affirmation: 'Mi voz es mi verdad, y mis palabras crean armonía.'
    }
  },
  {
    id: 'cancer',
    name: 'Cáncer',
    symbol: '♋',
    element: 'agua',
    dates: '21 Jun - 22 Jul',
    chakra: {
      name: 'Corazón (Anahata)',
      location: 'Centro del pecho'
    },
    frequency: 639,
    audioFile: '/media/639.mp3',
    color: {
      primary: 'Plateado',
      secondary: 'Blanco perla',
      gradient: 'from-gray-300 via-slate-200 to-gray-400',
      hex: '#CBD5E1'
    },
    exercise: {
      title: 'Refugio Interior',
      description: 'Sentí el pecho expandirse con ternura. Dejá que tu respiración te conecte con tu hogar interior.',
      affirmation: 'Me cuido, me abrazo, soy mi propio refugio.'
    }
  },
  {
    id: 'leo',
    name: 'Leo',
    symbol: '♌',
    element: 'fuego',
    dates: '23 Jul - 22 Ago',
    chakra: {
      name: 'Plexo Solar (Manipura)',
      location: 'Ombligo'
    },
    frequency: 444,
    audioFile: '/media/444.mp3',
    color: {
      primary: 'Dorado',
      gradient: 'from-yellow-500 via-amber-400 to-yellow-600',
      hex: '#F59E0B'
    },
    exercise: {
      title: 'Sol Interior',
      description: 'Cerrá los ojos e imaginá un sol dorado irradiando desde tu ombligo. Sentí su calor como poder personal.',
      affirmation: 'Soy luz, soy creación, brillo sin miedo.'
    }
  },
  {
    id: 'virgo',
    name: 'Virgo',
    symbol: '♍',
    element: 'tierra',
    dates: '23 Ago - 22 Sep',
    chakra: {
      name: 'Plexo Solar (Manipura)',
      location: 'Ombligo'
    },
    frequency: 528,
    audioFile: '/media/528.mp3',
    color: {
      primary: 'Verde oliva',
      secondary: 'Marrón claro',
      gradient: 'from-lime-600 via-green-700 to-emerald-600',
      hex: '#65A30D'
    },
    exercise: {
      title: 'Orden Energético',
      description: 'Inhalá orden, exhalá perfección. Visualizá cómo la energía dorada se acomoda dentro tuyo.',
      affirmation: 'Transformo lo caótico en armonía. Cada detalle vibra en propósito.'
    }
  },
  {
    id: 'libra',
    name: 'Libra',
    symbol: '♎',
    element: 'aire',
    dates: '23 Sep - 22 Oct',
    chakra: {
      name: 'Corazón (Anahata)',
      location: 'Centro del pecho'
    },
    frequency: 285,
    audioFile: '/media/285.mp3',
    color: {
      primary: 'Rosa suave',
      secondary: 'Verde pastel',
      gradient: 'from-pink-300 via-rose-200 to-pink-400',
      hex: '#F9A8D4'
    },
    exercise: {
      title: 'Equilibrio del Ser',
      description: 'Colocá tus manos en posición de equilibrio frente al pecho. Respirás paz, exhalás armonía.',
      affirmation: 'Encuentro belleza en el equilibrio, amor en cada reflejo.'
    }
  },
  {
    id: 'escorpio',
    name: 'Escorpio',
    symbol: '♏',
    element: 'agua',
    dates: '23 Oct - 21 Nov',
    chakra: {
      name: 'Sacro (Svadhisthana)',
      location: 'Abdomen bajo'
    },
    frequency: 417,
    audioFile: '/media/417.mp3',
    color: {
      primary: 'Púrpura medio',
      secondary: 'Violeta',
      gradient: 'from-purple-700 via-violet-600 to-purple-800',
      hex: '#7C3AED'
    },
    exercise: {
      title: 'Transformación Profunda',
      description: 'Sentí el agua fluir en tu abdomen. Soltá lo viejo, abrazá lo transformador.',
      affirmation: 'Renazco con cada emoción. Mi poder está en mi profundidad.'
    }
  },
  {
    id: 'sagitario',
    name: 'Sagitario',
    symbol: '♐',
    element: 'fuego',
    dates: '22 Nov - 21 Dic',
    chakra: {
      name: 'Tercer Ojo (Ajna)',
      location: 'Entre las cejas'
    },
    frequency: 852,
    audioFile: '/media/852.mp3',
    color: {
      primary: 'Púrpura',
      secondary: 'Azul marino',
      gradient: 'from-purple-600 via-indigo-600 to-blue-700',
      hex: '#7C3AED'
    },
    exercise: {
      title: 'Visión Expandida',
      description: 'Fijá la vista en un punto, respirá visión. Imaginá una flecha de luz abriéndose hacia el horizonte.',
      affirmation: 'Veo más allá. Mi intuición guía mi expansión.'
    }
  },
  {
    id: 'capricornio',
    name: 'Capricornio',
    symbol: '♑',
    element: 'tierra',
    dates: '22 Dic - 19 Ene',
    chakra: {
      name: 'Raíz (Muladhara)',
      location: 'Base de la columna'
    },
    frequency: 432,
    audioFile: '/media/432.mp3',
    color: {
      primary: 'Marrón tierra',
      secondary: 'Marrón cálido',
      gradient: 'from-amber-700 via-orange-800 to-amber-900',
      hex: '#B45309'
    },
    exercise: {
      title: 'Raíces de Propósito',
      description: 'Apoyá tus pies firmes en el suelo. Visualizá raíces de luz que bajan hasta el centro de la Tierra.',
      affirmation: 'Estoy firme en mi propósito. Cada paso es una construcción sagrada.'
    }
  },
  {
    id: 'acuario',
    name: 'Acuario',
    symbol: '♒',
    element: 'aire',
    dates: '20 Ene - 18 Feb',
    chakra: {
      name: 'Garganta + Corona',
      location: 'Garganta y coronilla'
    },
    frequency: 888,
    audioFile: '/media/888.mp3',
    color: {
      primary: 'Azul eléctrico',
      secondary: 'Turquesa',
      gradient: 'from-cyan-500 via-blue-500 to-sky-600',
      hex: '#06B6D4'
    },
    exercise: {
      title: 'Canal de Inspiración',
      description: 'Inhalá ideas nuevas, exhalá libertad. Sentí una corriente de luz turquesa que conecta mente y cielo.',
      affirmation: 'Soy canal de inspiración. Vibro con la frecuencia del cambio.'
    }
  },
  {
    id: 'piscis',
    name: 'Piscis',
    symbol: '♓',
    element: 'agua',
    dates: '19 Feb - 20 Mar',
    chakra: {
      name: 'Corona (Sahasrara)',
      location: 'Coronilla'
    },
    frequency: 963,
    audioFile: '/media/963.mp3',
    color: {
      primary: 'Violeta',
      secondary: 'Azul marino',
      gradient: 'from-violet-600 via-purple-600 to-indigo-700',
      hex: '#8B5CF6'
    },
    exercise: {
      title: 'Unidad Cósmica',
      description: 'Cerrá los ojos y disolvé tus límites. Dejá que una luz violeta te envuelva por completo.',
      affirmation: 'Soy unidad. Me uno al todo en compasión y silencio.'
    }
  }
];

/**
 * Obtener frecuencia aleatoria del día
 */
export const getFrequencyOfTheDay = (): typeof ZODIAC_FREQUENCIES[0] => {
  const today = new Date().getDate();
  const index = today % ZODIAC_FREQUENCIES.length;
  return ZODIAC_FREQUENCIES[index];
};

/**
 * Buscar frecuencia por ID
 */
export const getFrequencyById = (id: string) => {
  return ZODIAC_FREQUENCIES.find(freq => freq.id === id);
};
