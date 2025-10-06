export interface Dignity {
  name: string;
  symbol: string;
  description: string;
  example: string;
  shadows: string;
  color: string;
  chakra: string;
  frequency: number | string;
  exercise: string;
  category: 'essential' | 'accidental';
}

export const DIGNITIES: Dignity[] = [
  {
    name: 'Domicilio (Regencia)',
    symbol: '🏠',
    description: 'Un planeta está en domicilio cuando se encuentra en el signo que rige naturalmente. Aquí tiene plena fuerza, actúa con naturalidad y sus cualidades fluyen armónicamente.',
    example: 'Marte en Aries → acción directa y clara. Venus en Tauro → amor sensual y estable.',
    shadows: 'Exceso de confianza, energía "sobresaturada".',
    color: 'Dorado',
    chakra: 'Plexo Solar',
    frequency: 528,
    exercise: 'Identificar un talento natural y usarlo conscientemente para ayudar a otra persona.',
    category: 'essential'
  },
  {
    name: 'Exaltación',
    symbol: '🌟',
    description: 'El planeta se encuentra en un signo donde su energía se potencia, aunque no sea su domicilio. Funciona como un invitado de honor: brilla, pero con cierto riesgo de exceso.',
    example: 'Sol en Aries → vitalidad, liderazgo fuerte. Luna en Tauro → estabilidad emocional.',
    shadows: 'Orgullo, exageración.',
    color: 'Blanco brillante',
    chakra: 'Corazón',
    frequency: 639,
    exercise: 'Practicar gratitud diaria reconociendo los "regalos" que la vida ofrece sin caer en arrogancia.',
    category: 'essential'
  },
  {
    name: 'Exilio (Detrimento)',
    symbol: '⚖️',
    description: 'Un planeta está en exilio cuando se encuentra en el signo opuesto a su domicilio. Allí su energía se debilita o se manifiesta de manera incómoda.',
    example: 'Marte en Libra → dificultad para actuar con decisión; busca aprobación externa. Venus en Aries → amor impetuoso, poco paciente.',
    shadows: 'Sentir que se actúa "fuera de lugar", dificultad para expresar cualidades naturales.',
    color: 'Gris',
    chakra: 'Raíz',
    frequency: 396,
    exercise: 'Escribir sobre un área de la vida donde sientas inseguridad y practicar afirmaciones de confianza para equilibrarla.',
    category: 'essential'
  },
  {
    name: 'Caída',
    symbol: '📉',
    description: 'El planeta está en el signo opuesto a su exaltación. Aquí se siente débil, incómodo, sin poder brillar. Es como estar en una casa extraña que no lo reconoce.',
    example: 'Sol en Libra → dificultad para afirmar la identidad propia; Luna en Escorpio → emociones intensas y difíciles de gestionar.',
    shadows: 'Inseguridad, sensación de vacío o carencia en el área representada.',
    color: 'Azul oscuro',
    chakra: 'Plexo Solar y Corazón',
    frequency: 417,
    exercise: 'Hacer una lista de logros personales pasados para reforzar la autoestima en esa área vulnerable.',
    category: 'essential'
  },
  {
    name: 'Recepción Mutua',
    symbol: '🔄',
    description: 'Ocurre cuando dos planetas están en el signo del otro, apoyándose mutuamente. Aunque uno esté en exilio, la energía fluye gracias al "intercambio de fuerzas".',
    example: 'Sol en Acuario y Urano en Leo. Cada uno potencia al otro aunque no estén en su lugar natural.',
    shadows: 'Dependencia mutua, dificultad para actuar sin la otra energía.',
    color: 'Verde jade',
    chakra: 'Corazón',
    frequency: 528,
    exercise: 'Trabajar en cooperación con otra persona en un proyecto, reconociendo el valor del intercambio mutuo.',
    category: 'essential'
  },
  {
    name: 'Triplicidad',
    symbol: '🔥',
    description: 'Cada elemento (fuego, tierra, aire, agua) tiene tres signos regidos por distintos planetas en diferentes momentos (día/noche). Un planeta gana fuerza si está en su triplicidad.',
    example: 'Marte en Leo (fuego) → fuerte en expresividad y acción.',
    shadows: 'Confiar demasiado en la comodidad elemental.',
    color: 'Depende del elemento (rojo fuego, verde tierra, azul aire, violeta agua)',
    chakra: 'Según el elemento',
    frequency: 432,
    exercise: 'Trabajar con el elemento de tu triplicidad (fuego → vela; agua → meditación con agua; aire → respiración; tierra → caminar descalzo).',
    category: 'accidental'
  },
  {
    name: 'Decanatos',
    symbol: '📜',
    description: 'Cada signo se divide en 3 partes de 10°. Cada decanato tiene un regente secundario que matiza al signo.',
    example: 'Aries 0°–10° regido por Marte (impulsivo), Aries 10°–20° regido por Sol (vital), Aries 20°–30° regido por Venus (más armónico).',
    shadows: 'Enfocarse solo en un matiz del signo y olvidar la totalidad.',
    color: 'Según regente del decanato',
    chakra: 'Depende',
    frequency: 528,
    exercise: 'Investigar en qué decanato está tu Sol y trabajar afirmaciones que refuercen ese matiz.',
    category: 'accidental'
  },
  {
    name: 'Términos / Límites',
    symbol: '📏',
    description: 'Sistema de astrología helenística/medieval que subdivide cada signo en partes regidas por planetas. Reflejan matices finos de poder planetario.',
    example: 'Un planeta en el "término" de Saturno puede adquirir más disciplina.',
    shadows: 'Difícil de interpretar si no se estudia en profundidad.',
    color: 'Marrón tierra',
    chakra: 'Raíz',
    frequency: 396,
    exercise: 'Trabajar con límites conscientes: poner un horario claro para una actividad y respetarlo.',
    category: 'accidental'
  },
  {
    name: 'Faces (Faz/Decan)',
    symbol: '🎭',
    description: 'Subdivisiones de 10° regidas por planetas que dan un tono más sutil. Menos influyente que decanatos y términos, pero útil en astrología tradicional.',
    example: 'Una Luna en la face de Mercurio → mente más analítica en lo emocional.',
    shadows: 'Dispersión, perderse en matices pequeños.',
    color: 'Violeta claro',
    chakra: 'Tercer Ojo',
    frequency: 852,
    exercise: 'Meditar 5 minutos visualizando un color que represente la "fase" donde está tu planeta.',
    category: 'accidental'
  }
];
