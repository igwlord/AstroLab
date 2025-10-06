export interface Planet {
  id: string;
  symbol: string;
  name: string;
  description: string;
  dailyManifestation: string;
  rhythm: 'personal' | 'social' | 'transpersonal';
  rulership: string;
  exaltation: string;
  naturalHouse: string;
  color: string;
  chakra: string;
  frequency: string;
  holisticExercise: string;
  category: 'personal' | 'social' | 'transpersonal';
}

export const PLANETS: Planet[] = [
  {
    id: 'sol',
    symbol: '☉',
    name: 'Sol',
    description: 'El Sol representa la identidad, la esencia, la vitalidad y el propósito central de la persona. Es el núcleo del yo, la conciencia y la manera en que brillamos en el mundo. En la carta natal, indica dónde está nuestra voluntad y el sentido de dirección. Su energía es radiante, masculina, generadora de vida, pero puede caer en exceso de ego o autoritarismo si no está equilibrado.',
    dailyManifestation: 'La persona expresa su Sol cuando lidera, crea, se afirma y busca reconocimiento por ser ella misma.',
    rhythm: 'personal',
    rulership: 'Leo',
    exaltation: 'Aries',
    naturalHouse: 'Casa V',
    color: 'dorado/amarillo brillante',
    chakra: 'plexo solar (Manipura)',
    frequency: '528 Hz',
    holisticExercise: 'Meditar frente al sol al amanecer o visualizar una esfera dorada en el plexo repitiendo: "Brillo desde mi verdad".',
    category: 'personal'
  },
  {
    id: 'luna',
    symbol: '☽',
    name: 'Luna',
    description: 'La Luna refleja el mundo emocional, el inconsciente, los recuerdos y la manera en que buscamos seguridad y contención. Representa la infancia, la madre, los hábitos y la sensibilidad. Es receptiva, nutritiva y mutable, pero puede volverse dependiente o fluctuante si no se integra con conciencia.',
    dailyManifestation: 'La persona vive su Luna en sus respuestas emocionales, su necesidad de pertenencia, su memoria afectiva y la forma de cuidar.',
    rhythm: 'personal',
    rulership: 'Cáncer',
    exaltation: 'Tauro',
    naturalHouse: 'Casa IV',
    color: 'plateado, blanco perlado',
    chakra: 'corazón (Anahata)',
    frequency: '639 Hz',
    holisticExercise: 'Cada noche escribir un diario emocional y agradecer tres cosas que dieron seguridad durante el día.',
    category: 'personal'
  },
  {
    id: 'mercurio',
    symbol: '☿',
    name: 'Mercurio',
    description: 'Mercurio es el mensajero del zodíaco, regente de la mente, la comunicación, el aprendizaje y el pensamiento lógico. Representa cómo procesamos información, cómo nos expresamos y cómo aprendemos. Puede volverse disperso, nervioso o superficial si no se centra.',
    dailyManifestation: 'Escribir, hablar, estudiar, enviar mensajes, razonar.',
    rhythm: 'personal',
    rulership: 'Géminis y Virgo',
    exaltation: 'Virgo',
    naturalHouse: 'Casa III y VI',
    color: 'amarillo o gris claro',
    chakra: 'garganta (Vishuddha)',
    frequency: '741 Hz',
    holisticExercise: 'Escribir una página libre cada mañana (journaling) y leer en voz alta un texto inspirador para entrenar la claridad mental y verbal.',
    category: 'personal'
  },
  {
    id: 'venus',
    symbol: '♀',
    name: 'Venus',
    description: 'Venus es el planeta del amor, las relaciones, la belleza, los valores y el placer. Representa cómo nos vinculamos, qué disfrutamos y cómo atraemos lo que deseamos. Su energía busca armonía, equilibrio y gozo. Puede caer en superficialidad, complacencia o dependencia afectiva.',
    dailyManifestation: 'Venus aparece en nuestras elecciones estéticas, en las relaciones y en lo que valoramos.',
    rhythm: 'personal',
    rulership: 'Tauro y Libra',
    exaltation: 'Piscis',
    naturalHouse: 'Casa II y VII',
    color: 'verde esmeralda, rosa',
    chakra: 'corazón (Anahata)',
    frequency: '528/639 Hz',
    holisticExercise: 'Preparar un espacio bello con flores, velas o arte, sentarse allí y repetir: "Elijo lo que me nutre y me da armonía".',
    category: 'personal'
  },
  {
    id: 'marte',
    symbol: '♂',
    name: 'Marte',
    description: 'Marte es el planeta de la acción, la fuerza vital, la energía sexual y el deseo. Representa la capacidad de defendernos, tomar decisiones y perseguir metas. Su energía es directa, activa y combativa. Puede derivar en violencia, ira o impulsividad si no se canaliza con conciencia.',
    dailyManifestation: 'Marte se ve en la forma en que tomamos iniciativa, hacemos deporte, defendemos lo nuestro o enfrentamos conflictos.',
    rhythm: 'personal',
    rulership: 'Aries (tradicional también Escorpio)',
    exaltation: 'Capricornio',
    naturalHouse: 'Casa I y VIII',
    color: 'rojo intenso',
    chakra: 'raíz (Muladhara)',
    frequency: '396 Hz',
    holisticExercise: 'Realizar 15 minutos de actividad física (yoga dinámico, boxeo, caminata fuerte) enfocando la intención en liberar tensión.',
    category: 'personal'
  },
  {
    id: 'jupiter',
    symbol: '♃',
    name: 'Júpiter',
    description: 'Júpiter es el gran expansor, planeta de la abundancia, la sabiduría, la filosofía y la espiritualidad. Representa la fe, el optimismo, la enseñanza y la justicia. Es generoso, expansivo y protector. Puede caer en exceso, derroche o dogmatismo.',
    dailyManifestation: 'Júpiter aparece en los viajes, los estudios superiores, la apertura a nuevas culturas o filosofías.',
    rhythm: 'social',
    rulership: 'Sagitario (tradicional también Piscis)',
    exaltation: 'Cáncer',
    naturalHouse: 'Casa IX y XII',
    color: 'azul profundo o púrpura',
    chakra: 'tercer ojo (Ajna)',
    frequency: '852 Hz',
    holisticExercise: 'Meditar con un texto sagrado o inspirador durante 10 minutos y luego escribir una reflexión práctica.',
    category: 'social'
  },
  {
    id: 'saturno',
    symbol: '♄',
    name: 'Saturno',
    description: 'Saturno es el planeta del tiempo, la disciplina, la responsabilidad y las estructuras. Representa los límites, las pruebas, el karma y la madurez. Su energía es lenta, seria, exigente y concreta. Puede traer frustración, rigidez o miedo si no se acepta como maestro.',
    dailyManifestation: 'Saturno se ve en la forma en que asumimos compromisos, enfrentamos responsabilidades y perseveramos en metas.',
    rhythm: 'social',
    rulership: 'Capricornio (tradicional también Acuario)',
    exaltation: 'Libra',
    naturalHouse: 'Casa X y XI',
    color: 'gris, negro, marrón',
    chakra: 'raíz (Muladhara)',
    frequency: '396 Hz',
    holisticExercise: 'Escribir la meta más importante del mes y diseñar un plan con pasos concretos para alcanzarla.',
    category: 'social'
  },
  {
    id: 'urano',
    symbol: '♅',
    name: 'Urano',
    description: 'Urano es el planeta de la revolución, la originalidad, la innovación y lo inesperado. Representa los cambios súbitos, la liberación y la conciencia de lo colectivo. Su energía es disruptiva, creativa y visionaria. Puede traer inestabilidad, rebeldía sin causa o desapego.',
    dailyManifestation: 'Urano se nota en ideas nuevas, cambios radicales de vida, tecnología, astrología, ciencia.',
    rhythm: 'transpersonal',
    rulership: 'Acuario',
    exaltation: 'Escorpio (no tradicional)',
    naturalHouse: 'Casa XI',
    color: 'azul eléctrico o turquesa',
    chakra: 'garganta + corona',
    frequency: '741 / 963 Hz',
    holisticExercise: 'Romper la rutina con un cambio creativo, como probar una nueva actividad o modificar un hábito.',
    category: 'transpersonal'
  },
  {
    id: 'neptuno',
    symbol: '♆',
    name: 'Neptuno',
    description: 'Neptuno es el planeta de la espiritualidad, los sueños, la compasión y las ilusiones. Representa la conexión con lo divino, el arte, la música y la disolución del ego. Puede traer inspiración y empatía, pero también confusión, evasión o autoengaño.',
    dailyManifestation: 'Neptuno se expresa en el arte, la meditación, la sensibilidad extrema y la capacidad de soñar.',
    rhythm: 'transpersonal',
    rulership: 'Piscis',
    exaltation: 'Cáncer (no tradicional)',
    naturalHouse: 'Casa XII',
    color: 'violeta o azul marino',
    chakra: 'corona (Sahasrara)',
    frequency: '963 Hz',
    holisticExercise: '10 minutos de meditación con música suave, visualizando cómo se disuelven las tensiones en un océano de luz.',
    category: 'transpersonal'
  },
  {
    id: 'pluton',
    symbol: '♇',
    name: 'Plutón',
    description: 'Plutón es el planeta del poder, la transformación profunda, la muerte y renacimiento. Representa lo oculto, lo inconsciente, las crisis y la capacidad de regeneración. Su energía es intensa, poderosa y a menudo difícil de manejar. Puede traer obsesión, destrucción o manipulación si no se integra.',
    dailyManifestation: 'Plutón aparece en crisis vitales, procesos de sanación profunda, psicología, espiritualidad y sexualidad intensa.',
    rhythm: 'transpersonal',
    rulership: 'Escorpio',
    exaltation: 'Aries (no tradicional)',
    naturalHouse: 'Casa VIII',
    color: 'negro, granate oscuro',
    chakra: 'sacro (Svadhisthana)',
    frequency: '417 Hz',
    holisticExercise: 'Escribir un miedo profundo en un papel, meditar sobre él, y luego destruir el papel como símbolo de liberación.',
    category: 'transpersonal'
  }
];
