export interface MoonSign {
  sign: string;
  description: string;
  manifestation: string;
  shadows: string;
  element: string;
  color: string;
  chakra: string;
  frequency: number;
  exercise: string;
}

export const MOON_SIGNS: MoonSign[] = [
  {
    sign: 'Aries',
    description: 'La Luna en Aries es impulsiva, directa y apasionada. Emocionalmente responde de manera rápida, con entusiasmo, pero también con enojo o impaciencia. Busca independencia emocional y no tolera sentirse limitada.',
    manifestation: 'Reacciona rápido, toma la iniciativa, expresa lo que siente de inmediato.',
    shadows: 'Egoísmo, dificultad para esperar o contenerse.',
    element: 'Fuego',
    color: 'Rojo',
    chakra: 'Raíz',
    frequency: 396,
    exercise: 'Practicar boxeo suave o caminata rápida descargando tensiones emocionales.'
  },
  {
    sign: 'Tauro',
    description: 'La Luna en Tauro busca seguridad, calma y estabilidad emocional. Disfruta del confort, la comida, el placer sensorial y lo predecible. Es fiel y paciente, pero puede ser terca y demasiado apegada a lo material.',
    manifestation: 'Apego a rutinas, gusto por el arte, la música y los placeres simples.',
    shadows: 'Pereza, apego, resistencia al cambio.',
    element: 'Tierra',
    color: 'Verde esmeralda',
    chakra: 'Corazón',
    frequency: 528,
    exercise: 'Comer conscientemente, agradeciendo los sabores y texturas.'
  },
  {
    sign: 'Géminis',
    description: 'La Luna en Géminis es curiosa, mental y comunicativa. Vive sus emociones a través de la palabra, necesita hablar para procesar lo que siente. Cambiante, adaptable, puede dispersarse.',
    manifestation: 'Hablar mucho de lo que siente, escribir, necesidad de interacción.',
    shadows: 'Nerviosismo, superficialidad emocional.',
    element: 'Aire',
    color: 'Amarillo',
    chakra: 'Garganta',
    frequency: 741,
    exercise: 'Escribir un diario emocional y leerlo en voz alta.'
  },
  {
    sign: 'Cáncer',
    description: 'La Luna en Cáncer es profundamente sensible, protectora, hogareña y maternal. Vive la vida a través de la familia y los recuerdos. Busca pertenencia y refugio emocional.',
    manifestation: 'Necesidad de hogar, apego familiar, memoria poderosa.',
    shadows: 'Apego excesivo, susceptibilidad, manipulación emocional.',
    element: 'Agua',
    color: 'Plateado/Blanco',
    chakra: 'Corazón',
    frequency: 639,
    exercise: 'Meditación con la mano en el pecho, respirando profundamente y agradeciendo a los ancestros.'
  },
  {
    sign: 'Leo',
    description: 'La Luna en Leo necesita brillar, ser reconocida y sentirse especial. Expresa sus emociones con dramatismo, pasión y creatividad. Busca amor y admiración.',
    manifestation: 'Disfruta de expresarse, cantar, actuar, liderar.',
    shadows: 'Egocentrismo, orgullo, dramatismo excesivo.',
    element: 'Fuego',
    color: 'Dorado',
    chakra: 'Plexo Solar',
    frequency: 528,
    exercise: 'Danza libre frente al espejo, afirmando: "Me permito brillar con autenticidad".'
  },
  {
    sign: 'Virgo',
    description: 'La Luna en Virgo es práctica, analítica y servicial. Busca sentirse útil y encontrar orden en lo cotidiano. Vive sus emociones a través de rutinas y detalles.',
    manifestation: 'Necesidad de organizar, limpiar, servir a otros.',
    shadows: 'Autoexigencia, crítica excesiva, ansiedad.',
    element: 'Tierra',
    color: 'Verde oliva',
    chakra: 'Plexo Solar',
    frequency: 528,
    exercise: 'Organizar un espacio pequeño con consciencia plena y gratitud.'
  },
  {
    sign: 'Libra',
    description: 'La Luna en Libra busca armonía, equilibrio y belleza en sus relaciones. Es diplomática, agradable y necesita compartir para sentirse plena.',
    manifestation: 'Rodearse de arte, música, espacios bellos, estar con pareja o amigos.',
    shadows: 'Dependencia de otros, indecisión.',
    element: 'Aire',
    color: 'Rosa suave',
    chakra: 'Corazón',
    frequency: 639,
    exercise: 'Decorar un rincón del hogar con flores o arte y meditar allí 10 minutos.'
  },
  {
    sign: 'Escorpio',
    description: 'La Luna en Escorpio es intensa, profunda y apasionada. Vive las emociones de manera extrema, entre la fusión y el control. Capaz de regenerarse tras crisis.',
    manifestation: 'Emociones secretas, poderosas; gran intuición.',
    shadows: 'Celos, manipulación, obsesión.',
    element: 'Agua',
    color: 'Granate/Negro',
    chakra: 'Sacro',
    frequency: 417,
    exercise: 'Escribir aquello que se desea transformar y quemar el papel como ritual.'
  },
  {
    sign: 'Sagitario',
    description: 'La Luna en Sagitario es optimista, aventurera, filosófica. Necesita libertad emocional y expansión. Busca experiencias que den sentido a la vida.',
    manifestation: 'Viajar, estudiar, filosofar, compartir entusiasmo.',
    shadows: 'Excesos, falta de compromiso, dispersión.',
    element: 'Fuego',
    color: 'Púrpura',
    chakra: 'Tercer Ojo',
    frequency: 852,
    exercise: 'Leer un texto inspirador y luego meditar 10 minutos sobre su enseñanza práctica.'
  },
  {
    sign: 'Capricornio',
    description: 'La Luna en Capricornio es disciplinada, reservada y ambiciosa. Busca seguridad emocional a través de logros y estructura. Puede parecer fría, pero es leal y protectora.',
    manifestation: 'Necesidad de estabilidad material, trabajo responsable, autocontrol.',
    shadows: 'Rigidez, represión emocional, pesimismo.',
    element: 'Tierra',
    color: 'Gris/Negro',
    chakra: 'Raíz',
    frequency: 396,
    exercise: 'Escribir un objetivo concreto y diseñar un plan en 3 pasos para alcanzarlo.'
  },
  {
    sign: 'Acuario',
    description: 'La Luna en Acuario es independiente, humanitaria e innovadora. Vive sus emociones con desapego y busca ideales colectivos.',
    manifestation: 'Necesidad de grupos, causas sociales, ideas revolucionarias.',
    shadows: 'Frialdad, rebeldía, dificultad para intimar.',
    element: 'Aire',
    color: 'Azul eléctrico/Turquesa',
    chakra: 'Garganta + Corona',
    frequency: 741,
    exercise: 'Hacer algo diferente en la rutina (camino nuevo, actividad distinta) para liberar creatividad.'
  },
  {
    sign: 'Piscis',
    description: 'La Luna en Piscis es sensible, compasiva, soñadora y espiritual. Se conecta con lo invisible y lo místico. Necesita unión, amor incondicional y expresión artística.',
    manifestation: 'Intuición, empatía, conexión con el arte y lo espiritual.',
    shadows: 'Evasión, victimismo, confusión.',
    element: 'Agua',
    color: 'Violeta/Azul marino',
    chakra: 'Corona',
    frequency: 963,
    exercise: '10 minutos de meditación visualizando un mar violeta que limpia y conecta con lo divino.'
  }
];
