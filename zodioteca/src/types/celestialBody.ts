export interface CelestialBody {
  name: string;
  symbol: string;
  mythology: string;
  astrology: string;
  manifestation: string;
  shadows: string;
  relations: string;
  color: string;
  chakra: string;
  frequency: number | string;
  stone: string;
  exercise: string;
  category: 'shadow' | 'healer' | 'centaur' | 'transneptunian' | 'comet';
}

export const CELESTIAL_BODIES: CelestialBody[] = [
  {
    name: 'Lilith (Luna Negra)',
    symbol: '🌑',
    mythology: 'Lilith, figura mítica hebrea, fue la primera mujer creada antes de Eva. Representa lo reprimido, la independencia radical y la sombra femenina.',
    astrology: 'En la carta natal, muestra dónde sentimos rechazo, exclusión, deseo reprimido o fuerza indomable. Es el "lado oscuro" de la psique, pero también la fuerza de emancipación.',
    manifestation: 'En mujeres: independencia, sexualidad libre, no conformismo. En hombres: relación con lo femenino reprimido.',
    shadows: 'Rebeldía destructiva, culpa, sensación de vacío.',
    relations: 'En Casa I: identidad intensa y disruptiva. En Casa VII: relaciones intensas, no convencionales.',
    color: 'Negro, Granate',
    chakra: 'Sacro',
    frequency: 417,
    stone: 'Obsidiana',
    exercise: 'Meditar frente a un espejo en la oscuridad con una vela negra, aceptando la propia sombra y afirmando: "Acepto mi poder completo".',
    category: 'shadow'
  },
  {
    name: 'Quirón',
    symbol: '🧙‍♂️',
    mythology: 'Centauro sabio, maestro de héroes, que pese a ser sanador no pudo curar su propia herida.',
    astrology: 'Representa la herida profunda de cada persona y la capacidad de transformarla en sabiduría y servicio a otros.',
    manifestation: 'Muestra dónde sentimos dolor recurrente, pero también donde podemos sanar y guiar.',
    shadows: 'Victimismo, perpetuar la herida.',
    relations: 'En Casa VI → sanación a través del trabajo y la salud. Con Luna → heridas emocionales.',
    color: 'Violeta',
    chakra: 'Corazón + Corona',
    frequency: '639 / 963',
    stone: 'Amatista',
    exercise: 'Escribir sobre una herida de la infancia y luego transformar ese recuerdo en un aprendizaje o consejo para otros.',
    category: 'healer'
  },
  {
    name: 'Pholus',
    symbol: '🐎',
    mythology: 'Centauro que representa "la pequeña causa con grandes consecuencias". Seres mitad hombre mitad caballo, representan el puente entre lo animal y lo espiritual.',
    astrology: 'Catalizador de cambios inesperados. Simboliza arquetipos de trauma, poder y evolución.',
    manifestation: 'Eventos pequeños que desencadenan transformaciones masivas en la vida.',
    shadows: 'Comportamientos compulsivos, repetir patrones familiares.',
    relations: 'Con Plutón → transformaciones radicales. En Casa VIII → crisis transformadoras.',
    color: 'Marrón y Rojo oscuro',
    chakra: 'Raíz y Sacro',
    frequency: 396,
    stone: 'Granate',
    exercise: 'Identificar un patrón familiar repetitivo y escribir una nueva forma de romper ese ciclo.',
    category: 'centaur'
  },
  {
    name: 'Nessus',
    symbol: '🐴',
    mythology: 'Centauro asociado al poder, abuso y el ciclo de daño y sanación.',
    astrology: 'Muestra donde hay patrones de poder tóxicos que deben trascenderse. Representa el karma familiar y los ciclos de abuso.',
    manifestation: 'Revela dinámicas de poder en relaciones, patrones de víctima-victimario que necesitan sanación.',
    shadows: 'Abuso de poder, venganza, patrones destructivos heredados.',
    relations: 'Con Plutón → traumas profundos. En Casa VII → dinámicas de poder en pareja.',
    color: 'Rojo oscuro',
    chakra: 'Raíz y Sacro',
    frequency: 417,
    stone: 'Granate',
    exercise: 'Identificar un patrón de poder disfuncional y escribir cómo transformarlo en empoderamiento consciente.',
    category: 'centaur'
  },
  {
    name: 'Eris',
    symbol: '🌌',
    mythology: 'Diosa de la discordia en la mitología griega. Su manzana dorada desató la Guerra de Troya.',
    astrology: 'Representa conflictos que revelan verdades ocultas. Es el arquetipo de lo excluido que exige reconocimiento.',
    manifestation: 'Se expresa a nivel colectivo y generacional. Revela injusticias y llama a la acción.',
    shadows: 'Sensación de fuerzas externas incontrolables, conflictos disruptivos.',
    relations: 'Con Marte → conflictos necesarios. En Casa XI → luchas sociales.',
    color: 'Violeta oscuro',
    chakra: 'Corona',
    frequency: 963,
    stone: 'Moldavita',
    exercise: 'Meditación grupal enfocada en la unión con el inconsciente colectivo.',
    category: 'transneptunian'
  },
  {
    name: 'Sedna',
    symbol: '🌊',
    mythology: 'Diosa inuit del mar. Su mito habla de traición y sacrificio, convirtiéndose en la madre del océano.',
    astrology: 'Representa resiliencia profunda, conexión con el océano inconsciente. Traición que se transforma en poder.',
    manifestation: 'Experiencias de abandono que llevan a una conexión espiritual profunda.',
    shadows: 'Sentimiento de traición, víctima de circunstancias extremas.',
    relations: 'Con Neptuno → espiritualidad profunda. En Casa XII → conexión mística.',
    color: 'Azul marino profundo',
    chakra: 'Corona',
    frequency: 963,
    stone: 'Aguamarina',
    exercise: 'Meditar visualizando el océano profundo, permitiendo que las heridas se disuelvan en el agua.',
    category: 'transneptunian'
  },
  {
    name: 'Haumea',
    symbol: '🥚',
    mythology: 'Diosa hawaiana de la fertilidad y el parto. Representa creación y regeneración constante.',
    astrology: 'Simboliza creatividad profunda y regeneración. El poder de crear y recrearse constantemente.',
    manifestation: 'Capacidad de reinventarse, fertilidad creativa, nacimientos de nuevas etapas.',
    shadows: 'Agotamiento por exceso de creatividad, dificultad para descansar.',
    relations: 'Con Venus → creatividad artística. En Casa V → fertilidad y creación.',
    color: 'Verde jade',
    chakra: 'Sacro',
    frequency: 417,
    stone: 'Jade',
    exercise: 'Ritual de renacimiento: escribir lo que deseas crear y plantarlo simbólicamente en la tierra.',
    category: 'transneptunian'
  },
  {
    name: 'Makemake',
    symbol: '🌿',
    mythology: 'Dios polinesio creador de la humanidad, asociado con la naturaleza y la vida.',
    astrology: 'Representa la conexión con la naturaleza, el instinto primario de supervivencia y protección del planeta.',
    manifestation: 'Activismo ecológico, conexión profunda con la Tierra, supervivencia.',
    shadows: 'Desconexión de la naturaleza, miedo a la escasez.',
    relations: 'Con Tierra → conciencia ecológica. En Casa II → recursos naturales.',
    color: 'Verde bosque',
    chakra: 'Raíz',
    frequency: 396,
    stone: 'Turmalina verde',
    exercise: 'Pasar tiempo en la naturaleza, descalzo sobre la tierra, conectando con el espíritu de Gaia.',
    category: 'transneptunian'
  },
  {
    name: 'Orcus',
    symbol: '⚖️',
    mythology: 'Dios romano del inframundo, asociado con juramentos inquebrantables y el destino inevitable.',
    astrology: 'Representa juramentos, lo inevitable, el karma. Las promesas que trascienden la vida.',
    manifestation: 'Situaciones kármicas, compromisos profundos, consecuencias de acciones pasadas.',
    shadows: 'Sensación de estar atrapado por el destino, karma pesado.',
    relations: 'Con Saturno → karma y responsabilidad. En Casa VIII → legados y muerte.',
    color: 'Negro profundo',
    chakra: 'Raíz',
    frequency: 396,
    stone: 'Obsidiana',
    exercise: 'Escribir un juramento sagrado contigo mismo sobre cómo vivirás tu vida con integridad.',
    category: 'transneptunian'
  },
  {
    name: 'Cometas',
    symbol: '☄️',
    mythology: 'Mensajeros celestiales, presagios de cambio en todas las culturas antiguas.',
    astrology: 'Energías disruptivas que entran en la vida como señales de cambio. Representan giros súbitos y despertar espiritual.',
    manifestation: 'Experiencias extraordinarias, eventos inesperados que marcan la vida.',
    shadows: 'Inestabilidad, exceso de sensibilidad.',
    relations: 'Con Urano → cambios súbitos. En Casa IX → viajes transformadores.',
    color: 'Azul celeste brillante',
    chakra: 'Tercer Ojo',
    frequency: 852,
    stone: 'Cuarzo cristal',
    exercise: 'Observar el cielo nocturno en silencio y visualizar un cometa trayendo claridad y un nuevo comienzo.',
    category: 'comet'
  }
];
