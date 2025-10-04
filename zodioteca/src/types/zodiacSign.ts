export interface ZodiacSign {
  id: string;
  symbol: string;
  name: string;
  dateRange: string;
  description: string;
  dailyManifestation: string;
  polarity: 'positiva' | 'negativa';
  modality: 'cardinal' | 'fija' | 'mutable';
  element: 'fuego' | 'tierra' | 'aire' | 'agua';
  ruler: string;
  naturalHouse: string;
  color: string;
  chakra: string;
  frequency: string;
  holisticExercise: string;
}

export const ZODIAC_SIGNS: ZodiacSign[] = [
  {
    id: 'aries',
    symbol: '♈',
    name: 'Aries',
    dateRange: '21 de marzo – 19 de abril',
    description: 'Aries es el primer signo del zodíaco, el pionero. Representa el nacimiento, el impulso vital y la chispa que enciende todo proceso. Su energía es de fuego cardinal: iniciativa, acción inmediata, coraje para abrir caminos. Son personas directas, espontáneas, competitivas, con gran capacidad de liderazgo. Pueden ser impacientes, impetuosos y poco tolerantes a la espera, ya que viven en el presente y necesitan movimiento constante. El arquetipo es el guerrero, que enfrenta la vida con valentía.',
    dailyManifestation: 'La persona Aries suele ser la primera en proponer un plan, iniciar un proyecto o defender una causa. Si siente injusticia, reacciona de inmediato.',
    polarity: 'positiva',
    modality: 'cardinal',
    element: 'fuego',
    ruler: 'Marte',
    naturalHouse: 'Casa I (la identidad)',
    color: 'rojo intenso',
    chakra: 'raíz (Muladhara)',
    frequency: '396 Hz',
    holisticExercise: 'Realizar 10 minutos de ejercicio físico (correr, saltar, boxeo suave) mientras se repite: "Honro mi energía y actúo con conciencia".'
  },
  {
    id: 'tauro',
    symbol: '♉',
    name: 'Tauro',
    dateRange: '20 de abril – 20 de mayo',
    description: 'Tauro es el signo de la estabilidad, la perseverancia y la conexión con lo tangible. Como tierra fija, representa lo sólido, lo duradero, lo que construye raíces. Valora la comodidad, la belleza, la sensualidad y los placeres físicos. Son personas constantes, pacientes y confiables, pero pueden volverse tercas y demasiado apegadas a lo material o a lo seguro. El arquetipo es el constructor y el guardián de los valores.',
    dailyManifestation: 'Tauro es quien disfruta cocinar lentamente, invertir en bienes duraderos, cuidar de sus pertenencias y crear ambientes confortables.',
    polarity: 'negativa',
    modality: 'fija',
    element: 'tierra',
    ruler: 'Venus',
    naturalHouse: 'Casa II (recursos y valores)',
    color: 'verde esmeralda o rosa pálido',
    chakra: 'corazón (Anahata)',
    frequency: '528 Hz',
    holisticExercise: 'Preparar una comida consciente, agradeciendo cada ingrediente, y comer lentamente enfocándose en el sabor y la textura.'
  },
  {
    id: 'geminis',
    symbol: '♊',
    name: 'Géminis',
    dateRange: '21 de mayo – 20 de junio',
    description: 'Géminis es aire mutable, el signo de la comunicación, la mente y la curiosidad. Representa la dualidad, la capacidad de adaptarse y de ver la vida desde múltiples perspectivas. Son personas rápidas mentalmente, versátiles, sociables, ingeniosas y con facilidad para el lenguaje. Su desafío es la dispersión y la falta de profundidad, ya que tienden a querer abarcarlo todo. El arquetipo es el mensajero o el eterno estudiante.',
    dailyManifestation: 'Géminis es quien inicia conversaciones en cualquier lugar, aprende de todo y siempre está probando algo nuevo.',
    polarity: 'positiva',
    modality: 'mutable',
    element: 'aire',
    ruler: 'Mercurio',
    naturalHouse: 'Casa III (comunicación y aprendizaje)',
    color: 'amarillo brillante',
    chakra: 'garganta (Vishuddha)',
    frequency: '741 Hz',
    holisticExercise: 'Escribir 3 ideas creativas al despertar y compartir una con otra persona antes de que termine el día.'
  },
  {
    id: 'cancer',
    symbol: '♋',
    name: 'Cáncer',
    dateRange: '21 de junio – 22 de julio',
    description: 'Cáncer es agua cardinal, símbolo del hogar, la familia, las raíces y las emociones profundas. Representa el mundo interno, la sensibilidad y la necesidad de protección y cuidado. Son personas empáticas, protectoras, intuitivas, pero pueden caer en apegos emocionales, nostalgia y susceptibilidad. El arquetipo es la madre o el nutridor.',
    dailyManifestation: 'Cáncer cuida de su familia, crea espacios cálidos y está atento a las necesidades emocionales de los demás.',
    polarity: 'negativa',
    modality: 'cardinal',
    element: 'agua',
    ruler: 'Luna',
    naturalHouse: 'Casa IV (hogar y raíces)',
    color: 'plateado o blanco perla',
    chakra: 'corazón (Anahata)',
    frequency: '639 Hz',
    holisticExercise: 'Hacer una meditación colocando una mano en el corazón y otra en el abdomen, respirando profundamente y repitiendo: "Me contengo y me nutro con amor".'
  },
  {
    id: 'leo',
    symbol: '♌',
    name: 'Leo',
    dateRange: '23 de julio – 22 de agosto',
    description: 'Leo es fuego fijo, signo del brillo, la creatividad y el liderazgo. Representa la autoexpresión, la confianza y la capacidad de inspirar a otros. Son personas magnéticas, generosas, apasionadas, con necesidad de reconocimiento. Pueden caer en el orgullo o la vanidad si no trabajan su humildad. El arquetipo es el rey o el artista.',
    dailyManifestation: 'Leo es quien organiza eventos, se sube a un escenario, brilla en lo que hace y contagia entusiasmo.',
    polarity: 'positiva',
    modality: 'fija',
    element: 'fuego',
    ruler: 'Sol',
    naturalHouse: 'Casa V (creatividad y placer)',
    color: 'dorado',
    chakra: 'plexo solar (Manipura)',
    frequency: '528 Hz',
    holisticExercise: 'Practicar 5 minutos de respiración de fuego (kapalabhati) afirmando: "Brillo desde mi autenticidad".'
  },
  {
    id: 'virgo',
    symbol: '♍',
    name: 'Virgo',
    dateRange: '23 de agosto – 22 de septiembre',
    description: 'Virgo es tierra mutable, signo de la organización, el análisis y el servicio. Representa la mente práctica, la atención al detalle y la búsqueda de perfección. Son personas meticulosas, trabajadoras, útiles para los demás, enfocadas en la salud. Pueden caer en la crítica excesiva o en la autoexigencia. El arquetipo es el sanador o el alquimista del detalle.',
    dailyManifestation: 'Virgo organiza rutinas, limpia, planifica, ayuda a otros a mejorar procesos.',
    polarity: 'negativa',
    modality: 'mutable',
    element: 'tierra',
    ruler: 'Mercurio',
    naturalHouse: 'Casa VI (salud y trabajo)',
    color: 'verde oliva o marrón claro',
    chakra: 'plexo solar (Manipura)',
    frequency: '528 Hz',
    holisticExercise: 'Escribir una lista de 3 tareas realistas y realizarlas con atención plena.'
  },
  {
    id: 'libra',
    symbol: '♎',
    name: 'Libra',
    dateRange: '23 de septiembre – 22 de octubre',
    description: 'Libra es aire cardinal, el signo del equilibrio, la justicia y las relaciones. Representa la armonía, la estética y la necesidad de compartir. Son personas diplomáticas, sociables, con buen gusto, pero pueden dudar al tomar decisiones por querer complacer a todos. El arquetipo es el mediador o el artista del balance.',
    dailyManifestation: 'Libra crea ambientes agradables, busca acuerdos y evita el conflicto directo.',
    polarity: 'positiva',
    modality: 'cardinal',
    element: 'aire',
    ruler: 'Venus',
    naturalHouse: 'Casa VII (pareja y asociaciones)',
    color: 'rosa suave o verde pastel',
    chakra: 'corazón (Anahata)',
    frequency: '639 Hz',
    holisticExercise: 'Elegir conscientemente una acción diaria que embellezca el entorno (florero, arte, música armónica).'
  },
  {
    id: 'escorpio',
    symbol: '♏',
    name: 'Escorpio',
    dateRange: '23 de octubre – 21 de noviembre',
    description: 'Escorpio es agua fija, el signo de la intensidad, el misterio y la transformación. Representa el poder de la muerte y renacimiento, la pasión y la capacidad de ver lo oculto. Son personas profundas, magnéticas, con gran fuerza interior, pero pueden ser celosas o posesivas. El arquetipo es el alquimista o el fénix.',
    dailyManifestation: 'Escorpio se involucra en procesos de crisis, psicología, investigación o sexualidad con intensidad.',
    polarity: 'negativa',
    modality: 'fija',
    element: 'agua',
    ruler: 'Marte (tradicional), Plutón (moderno)',
    naturalHouse: 'Casa VIII (transformación y sexualidad)',
    color: 'negro, granate o púrpura oscuro',
    chakra: 'sacro (Svadhisthana)',
    frequency: '417 Hz',
    holisticExercise: 'Escribir lo que se desea transformar y quemar el papel en un ritual consciente.'
  },
  {
    id: 'sagitario',
    symbol: '♐',
    name: 'Sagitario',
    dateRange: '22 de noviembre – 21 de diciembre',
    description: 'Sagitario es fuego mutable, signo de la expansión, los viajes y la búsqueda de sentido. Representa la filosofía, la espiritualidad y el optimismo. Son personas aventureras, libres, con gran fe y entusiasmo, pero pueden ser excesivas o imprudentes. El arquetipo es el explorador o el filósofo.',
    dailyManifestation: 'Sagitario estudia nuevas culturas, viaja, comparte conocimiento y contagia entusiasmo.',
    polarity: 'positiva',
    modality: 'mutable',
    element: 'fuego',
    ruler: 'Júpiter',
    naturalHouse: 'Casa IX (filosofía y viajes)',
    color: 'púrpura o azul marino',
    chakra: 'tercer ojo (Ajna)',
    frequency: '852 Hz',
    holisticExercise: 'Leer cada día un texto espiritual o reflexivo durante 10 minutos y escribir una conclusión práctica.'
  },
  {
    id: 'capricornio',
    symbol: '♑',
    name: 'Capricornio',
    dateRange: '22 de diciembre – 19 de enero',
    description: 'Capricornio es tierra cardinal, signo de la responsabilidad, la disciplina y el logro. Representa la ambición, la vocación y la construcción a largo plazo. Son personas constantes, trabajadoras, organizadas, pero pueden ser frías, rígidas o demasiado materialistas. El arquetipo es el estratega o el arquitecto.',
    dailyManifestation: 'Capricornio planifica proyectos, establece metas y trabaja arduamente para alcanzarlas.',
    polarity: 'negativa',
    modality: 'cardinal',
    element: 'tierra',
    ruler: 'Saturno',
    naturalHouse: 'Casa X (vocación y estatus)',
    color: 'gris oscuro, marrón o negro',
    chakra: 'raíz (Muladhara)',
    frequency: '396 Hz',
    holisticExercise: 'Escribir la meta más importante del mes y diseñar un plan realista paso a paso.'
  },
  {
    id: 'acuario',
    symbol: '♒',
    name: 'Acuario',
    dateRange: '20 de enero – 18 de febrero',
    description: 'Acuario es aire fijo, el signo de la innovación, la originalidad y la conciencia colectiva. Representa la independencia, la libertad y la visión de futuro. Son personas diferentes, rebeldes, humanitarias, pero pueden ser excéntricas o desapegadas emocionalmente. El arquetipo es el visionario o el revolucionario.',
    dailyManifestation: 'Acuario rompe moldes, propone ideas nuevas y conecta con comunidades.',
    polarity: 'positiva',
    modality: 'fija',
    element: 'aire',
    ruler: 'Saturno (tradicional), Urano (moderno)',
    naturalHouse: 'Casa XI (amistades y grupos)',
    color: 'azul eléctrico o turquesa',
    chakra: 'garganta (Vishuddha) + corona (Sahasrara)',
    frequency: '741 Hz / 963 Hz',
    holisticExercise: 'Cambiar un hábito rutinario por uno nuevo y creativo (ej. nuevo camino al trabajo).'
  },
  {
    id: 'piscis',
    symbol: '♓',
    name: 'Piscis',
    dateRange: '19 de febrero – 20 de marzo',
    description: 'Piscis es agua mutable, el signo de la espiritualidad, la compasión y los sueños. Representa lo inconsciente, la sensibilidad extrema y la unión con lo divino. Son personas empáticas, artísticas, místicas, pero pueden caer en evasión o confusión. El arquetipo es el místico o el sanador universal.',
    dailyManifestation: 'Piscis conecta con el arte, la música, la meditación y ayuda a los necesitados.',
    polarity: 'negativa',
    modality: 'mutable',
    element: 'agua',
    ruler: 'Júpiter (tradicional), Neptuno (moderno)',
    naturalHouse: 'Casa XII (espiritualidad y karmas)',
    color: 'violeta o azul marino',
    chakra: 'corona (Sahasrara)',
    frequency: '963 Hz',
    holisticExercise: '5 minutos de meditación visualizando agua fluyendo, liberando tensiones y conectando con la unidad.'
  }
];
