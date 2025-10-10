/**
 * Sistema de casas astrológicas
 */
export type HouseSystem = 
  | 'placidus'
  | 'koch'
  | 'whole-sign'
  | 'equal-house'
  | 'porphyry'
  | 'campanus';

/**
 * Información sobre cada sistema de casas
 */
export interface HouseSystemInfo {
  id: HouseSystem;
  name: string;
  description: string;
  accuracy: 'alta' | 'media';
  useCases: string[];
  pros: string[];
  cons: string[];
}

/**
 * Metadata extendida para el glosario de sistemas de casas
 */
export interface HouseSystemGlossary {
  id: HouseSystem;
  name: string;
  subtitle: string;
  symbol: string; // Emoji o símbolo visual
  type: 'temporal' | 'espacial' | 'zodiacal'; // Tipo de división
  era: 'antiguo' | 'medieval' | 'renacentista' | 'moderno'; // Época histórica
  century: string; // Siglo de origen
  author: string; // Autor/Astrólogo que lo desarrolló
  origin: string; // Descripción del origen histórico
  astronomicalBasis: string; // Base astronómica detallada
  philosophicalApproach: string; // Enfoque filosófico e interpretativo
  technicalAdvantages: string[]; // Ventajas técnicas
  technicalDisadvantages: string[]; // Desventajas técnicas
  latitudeRange: string; // Rango de latitud óptimo
  recommendedFor: string[]; // Usos recomendados
  color: string; // Color distintivo para UI
}

/**
 * Configuración completa de sistemas de casas
 */
export const HOUSE_SYSTEMS: Record<HouseSystem, HouseSystemInfo> = {
  'placidus': {
    id: 'placidus',
    name: 'Placidus',
    description: 'Sistema más popular en astrología occidental moderna. Divide el espacio del cielo en base al tiempo que tarda en ascender cada grado.',
    accuracy: 'alta',
    useCases: [
      'Cartas natales personales',
      'Astrología psicológica',
      'Interpretación moderna'
    ],
    pros: [
      'Precisión matemática',
      'Más usado mundialmente',
      'Mejor para latitudes medias'
    ],
    cons: [
      'Problemas en latitudes extremas (>66°)',
      'Matemáticamente complejo'
    ]
  },
  'koch': {
    id: 'koch',
    name: 'Koch',
    description: 'Similar a Placidus pero con diferente método de trisección. Popular en Europa.',
    accuracy: 'alta',
    useCases: [
      'Astrología europea',
      'Cartas natales detalladas',
      'Análisis temporal'
    ],
    pros: [
      'Precisión similar a Placidus',
      'Mejor manejo de latitudes extremas',
      'Enfoque en el nacimiento individual'
    ],
    cons: [
      'Menos popular que Placidus',
      'Interpretación más compleja'
    ]
  },
  'whole-sign': {
    id: 'whole-sign',
    name: 'Whole Sign',
    description: 'Sistema antiguo usado por astrólogos helénicos. Cada signo completo es una casa.',
    accuracy: 'media',
    useCases: [
      'Astrología helénica/tradicional',
      'Predicciones temporales',
      'Lectura simplificada'
    ],
    pros: [
      'Simplicidad extrema',
      'Raíces históricas',
      'Funciona en cualquier latitud'
    ],
    cons: [
      'Menos precisión personal',
      'No refleja rotación terrestre',
      'Menos popular en occidente'
    ]
  },
  'equal-house': {
    id: 'equal-house',
    name: 'Equal House',
    description: 'Divide el círculo en 12 partes iguales de 30° desde el Ascendente.',
    accuracy: 'media',
    useCases: [
      'Astrología védica adaptada',
      'Principiantes',
      'Latitudes extremas'
    ],
    pros: [
      'Extremadamente simple',
      'Sin problemas en polos',
      'Fácil de calcular'
    ],
    cons: [
      'Ignora el MC real',
      'Menos precisión temporal',
      'Poco usado profesionalmente'
    ]
  },
  'porphyry': {
    id: 'porphyry',
    name: 'Porphyry',
    description: 'Divide el espacio entre ASC-MC y MC-DSC en tres partes iguales.',
    accuracy: 'media',
    useCases: [
      'Fallback para latitudes extremas',
      'Astrología renacentista',
      'Cartas horarias'
    ],
    pros: [
      'Funciona en cualquier latitud',
      'Matemáticamente elegante',
      'Raíces antiguas'
    ],
    cons: [
      'Menos preciso que Placidus',
      'Poco usado actualmente',
      'Interpretación limitada'
    ]
  },
  'campanus': {
    id: 'campanus',
    name: 'Campanus',
    description: 'Sistema basado en el primer vertical. Proyecta casas en el ecuador celeste.',
    accuracy: 'alta',
    useCases: [
      'Astrología medieval',
      'Cartas locacionales',
      'Astrocartografía'
    ],
    pros: [
      'Precisión espacial única',
      'Bueno para relocación',
      'Perspectiva geométrica diferente'
    ],
    cons: [
      'Problemas en latitudes extremas',
      'Interpretación compleja',
      'Poco conocido'
    ]
  }
};

/**
 * Sistema de casas por defecto
 */
export const DEFAULT_HOUSE_SYSTEM: HouseSystem = 'placidus';

/**
 * Metadata completa para el glosario de sistemas de casas
 * Incluye información histórica, astronómica y filosófica detallada
 */
export const HOUSE_SYSTEMS_GLOSSARY: Record<HouseSystem, HouseSystemGlossary> = {
  'placidus': {
    id: 'placidus',
    name: 'Placidus',
    subtitle: 'Sistema temporal de Tito Placido',
    symbol: '⏰',
    type: 'temporal',
    era: 'renacentista',
    century: 'Siglo XVII (1603-1668)',
    author: 'Placidus de Titis, monje y matemático italiano',
    origin: 'Derivado del trabajo de Ptolomeo y perfeccionado por Placidus de Titis (1603–1668), monje y matemático italiano. Se convirtió en el sistema estándar de la astrología occidental moderna desde el siglo XIX.',
    astronomicalBasis: 'Placidus divide el arco diurno y nocturno del movimiento de los planetas en el horizonte en tres partes iguales, midiendo el tiempo que tarda un punto del zodíaco en elevarse desde el Ascendente hasta el Medio Cielo. Las cúspides intermedias (casas 11 y 12, 2 y 3) se obtienen dividiendo estos tiempos de ascensión o descenso en proporciones iguales.',
    philosophicalApproach: 'Placidus se basa en la idea de que la experiencia humana se desarrolla **en el tiempo**, no en el espacio abstracto. Representa una astrología **existencial y psicológica**, donde las casas simbolizan procesos temporales del desarrollo de la conciencia. Es el sistema por excelencia de la **astrología humanista y moderna**, usada por Dane Rudhyar, Liz Greene y Robert Hand.',
    technicalAdvantages: [
      'Refleja fielmente el movimiento real de la Tierra en su rotación, integrando el factor *tiempo* en la estructura de la carta',
      'Mantiene coherencia geométrica entre el horizonte (Ascendente) y el meridiano (Medio Cielo)',
      'Muy compatible con tránsitos y progresiones debido a su naturaleza temporal',
      'El más ampliamente usado y estudiado en astrología moderna'
    ],
    technicalDisadvantages: [
      'A latitudes superiores a 66° (cerca de los polos), el sistema se vuelve inoperante, generando casas extremadamente distorsionadas o invertidas',
      'Puede producir casas desiguales que confunden a principiantes',
      'Requiere cálculos trigonométricos complejos'
    ],
    latitudeRange: '0° - 66° (óptimo en latitudes medias 30°-50°)',
    recommendedFor: [
      'Cartas natales personales',
      'Astrología psicológica y humanista',
      'Tránsitos y progresiones',
      'Interpretación moderna occidental'
    ],
    color: '#8B5CF6' // Purple
  },
  
  'koch': {
    id: 'koch',
    name: 'Koch',
    subtitle: 'Sistema de Casas de Nacimiento (1962)',
    symbol: '🕐',
    type: 'temporal',
    era: 'moderno',
    century: 'Siglo XX (1962)',
    author: 'Walter Koch, astrólogo alemán',
    origin: 'Desarrollado por el astrólogo alemán Walter Koch en 1962, quien buscaba un método más exacto para correlacionar acontecimientos biográficos con tránsitos y direcciones. Fue diseñado específicamente para la era computacional.',
    astronomicalBasis: 'Similar a Placidus, pero con un ajuste en la proyección del arco diurno desde el Ascendente hacia el Medio Cielo. Las cúspides se obtienen dividiendo el tiempo que tarda un punto del ecuador celeste en pasar del Ascendente al MC, usando un sistema trigonométrico distinto (basado en la ascensión oblicua del punto medio).',
    philosophicalApproach: 'El sistema Koch parte de la idea de que la **carta natal es un campo de energía temporal único**, determinado por el instante exacto del nacimiento. Se asocia con una visión **psicológica evolutiva**, donde cada casa simboliza un nivel de maduración de la conciencia a lo largo del tiempo. Para muchos astrólogos contemporáneos (como Bruno Huber o Michael Harding), Koch expresa con más fidelidad la *dinámica del alma encarnando en el tiempo*.',
    technicalAdvantages: [
      'Mayor coherencia para la sincronización de eventos vitales (sinastría temporal)',
      'Precisión en la correspondencia entre casas y ritmos de vida medidos en tiempo real',
      'Mejor adaptación a software y cálculos modernos (fue diseñado para la era computacional)',
      'Popular en Europa Central y del Este'
    ],
    technicalDisadvantages: [
      'Como Placidus, falla a latitudes extremas',
      'Algunos astrólogos critican que su base matemática es demasiado compleja y poco intuitiva',
      'Menos documentación y literatura disponible que Placidus'
    ],
    latitudeRange: '0° - 66° (óptimo en latitudes medias)',
    recommendedFor: [
      'Astrología europea contemporánea',
      'Sincronización de eventos biográficos',
      'Direcciones y progresiones temporales',
      'Análisis psicológico evolutivo'
    ],
    color: '#EC4899' // Pink
  },
  
  'whole-sign': {
    id: 'whole-sign',
    name: 'Whole Sign',
    subtitle: 'Casas por Signos Completos (Helenístico)',
    symbol: '🔄',
    type: 'zodiacal',
    era: 'antiguo',
    century: 'Siglo II a.C.',
    author: 'Astrólogos helenísticos (tradición greco-egipcia)',
    origin: 'Sistema más antiguo conocido, utilizado por los astrólogos helenísticos (s. II a.C.) y posteriormente en la tradición védica (Jyotish). Fue el sistema dominante durante casi 1000 años antes de ser reemplazado por métodos cuadrantes en la Edad Media.',
    astronomicalBasis: 'El signo zodiacal que contiene el Ascendente se convierte **íntegramente** en la Casa I. El siguiente signo en orden zodiacal es la Casa II, y así sucesivamente. Cada casa ocupa un signo completo de 30°. Las cúspides se identifican con el inicio de cada signo, no con una coordenada eclíptica particular.',
    philosophicalApproach: 'Whole Sign representa una **visión simbólica del cosmos**, donde la vida humana se integra en un orden natural perfecto: *cada signo es una casa, cada casa una manifestación del zodíaco*. Encarna la astrología del destino y la totalidad —no tanto el proceso psicológico, sino la estructura kármica y temática del alma. Es el sistema preferido en astrología tradicional, horaria, helenística y védica, donde prima la coherencia del arquetipo sobre la precisión matemática.',
    technicalAdvantages: [
      'Extremadamente estable y funcional en cualquier latitud (incluso en los polos)',
      'Simplicidad absoluta: no requiere cálculos trigonométricos',
      'Los planetas y signos mantienen proporciones coherentes, lo que facilita la interpretación arquetípica',
      'Raíces históricas profundas y documentadas'
    ],
    technicalDisadvantages: [
      'Se pierde precisión en cúspides intermedias (planetas cerca del Ascendente pueden quedar fuera de la casa esperada)',
      'No refleja directamente el movimiento diurno ni los tiempos de ascensión',
      'El MC puede caer en cualquier casa (no siempre en Casa 10)'
    ],
    latitudeRange: 'Universal (0° - 90°)',
    recommendedFor: [
      'Astrología helenística y tradicional',
      'Astrología horaria y electiva',
      'Jyotish (Astrología védica adaptada)',
      'Interpretación arquetípica y kármica'
    ],
    color: '#F59E0B' // Amber/Orange
  },
  
  'equal-house': {
    id: 'equal-house',
    name: 'Equal House',
    subtitle: 'Casas Iguales desde el Ascendente',
    symbol: '📐',
    type: 'espacial',
    era: 'antiguo',
    century: 'Antigüedad (mencionado por Ptolomeo)',
    author: 'Claudio Ptolomeo y reintroducido en el siglo XIX',
    origin: 'Usado desde la antigüedad (ya descrito por Claudio Ptolomeo) y reintroducido en el siglo XIX por astrólogos británicos. Ganó popularidad en el movimiento de astrología humanista del siglo XX.',
    astronomicalBasis: 'La cúspide de la Casa I se fija en el grado exacto del Ascendente. A partir de allí, se marcan casas cada 30° de arco a lo largo de la eclíptica. Es decir, todas las casas son idénticas en tamaño (30°), manteniendo el Ascendente como referencia inicial.',
    philosophicalApproach: 'El sistema Equal House propone una astrología **racional y equilibrada**, donde cada área de la vida (casa) tiene igual peso. Se asocia con visiones humanistas y terapéuticas: todas las experiencias humanas son igualmente necesarias y proporcionadas. Favorece la claridad pedagógica y es ideal para la enseñanza de astrología y el trabajo con clientes no técnicos.',
    technicalAdvantages: [
      'Muy fácil de calcular e interpretar',
      'No presenta distorsiones en latitudes altas',
      'Equilibra la estructura espacial del cielo, representando simetría y equilibrio',
      'Excelente para principiantes y enseñanza'
    ],
    technicalDisadvantages: [
      'No considera el tiempo real de ascensión de los signos (pérdida de "ritmo temporal")',
      'Puede separar el Medio Cielo de la cúspide de la Casa X, alterando el vínculo simbólico entre profesión y destino',
      'Menos usado profesionalmente'
    ],
    latitudeRange: 'Universal (0° - 90°)',
    recommendedFor: [
      'Enseñanza y aprendizaje de astrología',
      'Astrología terapéutica humanista',
      'Latitudes extremas (>66°)',
      'Trabajo con clientes principiantes'
    ],
    color: '#10B981' // Green
  },
  
  'porphyry': {
    id: 'porphyry',
    name: 'Porphyry',
    subtitle: 'Sistema Espacial Proporcional',
    symbol: '⚖️',
    type: 'espacial',
    era: 'antiguo',
    century: 'Siglo III d.C.',
    author: 'Porfirio de Tiro, filósofo neoplatónico',
    origin: 'Desarrollado por Porfirio de Tiro (s. III d.C.), filósofo neoplatónico y discípulo de Plotino. Combina el rigor matemático con el simbolismo espiritual del neoplatonismo.',
    astronomicalBasis: 'Divide el arco del ecuador celeste comprendido entre el Ascendente y el Medio Cielo (MC) en tres partes iguales, tanto en el hemisferio oriental como occidental. A diferencia de Placidus o Koch, su división es **espacial**, no temporal.',
    philosophicalApproach: 'Porphyry combina el rigor matemático con el simbolismo neoplatónico. Cada casa representa un nivel de manifestación del alma en el mundo sensible. Es un sistema intermedio, que busca unir la geometría del cosmos con la filosofía espiritual del equilibrio entre lo celeste y lo terreno.',
    technicalAdvantages: [
      'Más estable que Placidus en latitudes altas',
      'Mantiene coherencia angular con el horizonte y meridiano',
      'Cálculo sencillo, compatible con software modernos y sistemas antiguos',
      'Equilibrio entre simplicidad y precisión'
    ],
    technicalDisadvantages: [
      'No refleja tiempos diurnos ni movimientos reales',
      'Considerado "geométrico" más que dinámico',
      'Poco usado en la práctica moderna'
    ],
    latitudeRange: '0° - 75° (mejor que Placidus en latitudes altas)',
    recommendedFor: [
      'Fallback para latitudes extremas',
      'Astrología renacentista y neoplatónica',
      'Cartas horarias y electivas',
      'Estudios filosóficos y espirituales'
    ],
    color: '#6366F1' // Indigo
  },
  
  'campanus': {
    id: 'campanus',
    name: 'Campanus',
    subtitle: 'Sistema del Primer Vertical',
    symbol: '🌐',
    type: 'espacial',
    era: 'medieval',
    century: 'Siglo XIII',
    author: 'Campanus de Novara, astrólogo medieval',
    origin: 'Atribuido al astrólogo medieval Campanus de Novara (siglo XIII). Fue muy usado por astrólogos renacentistas que buscaban integrar matemáticas, astronomía y metafísica (como Regiomontanus y Tycho Brahe).',
    astronomicalBasis: 'Divide la esfera celeste en 12 sectores iguales a partir del **punto del observador** (el horizonte local y el meridiano). Cada casa se obtiene al dividir el círculo vertical que pasa por el cenit y nadir en 12 sectores iguales de longitud horaria.',
    philosophicalApproach: 'Campanus simboliza la astrología de la **percepción y el espacio vivido**: cómo el individuo experimenta el cielo desde su punto exacto en la Tierra. Cada casa representa una orientación del alma en el espacio consciente. Integra la experiencia subjetiva del observador con la geometría celeste objetiva.',
    technicalAdvantages: [
      'Altamente geométrico, basado en la esfera local real del observador',
      'Refleja el espacio tridimensional real del cielo, no sólo la proyección eclíptica',
      'Funciona bien en latitudes medias y altas',
      'Único en su enfoque del primer vertical'
    ],
    technicalDisadvantages: [
      'Cálculo complejo sin software moderno',
      'Puede alterar la distribución natural de signos en casas',
      'Poco conocido y documentado en la actualidad'
    ],
    latitudeRange: '0° - 70° (problemas en latitudes extremas)',
    recommendedFor: [
      'Astrología medieval y renacentista',
      'Cartas locacionales y astrocartografía',
      'Estudios de percepción espacial',
      'Investigación astronómica-astrológica'
    ],
    color: '#EF4444' // Red
  }
};
