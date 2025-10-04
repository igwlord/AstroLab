export interface House {
  id: string;
  number: number;
  name: string;
  title: string;
  description: string;
  dailyManifestation: string;
  naturalSign: string;
  naturalRuler: string;
  color: string;
  chakra: string;
  frequency: string;
  holisticExercise: string;
  category: 'angular' | 'succedent' | 'cadent';
}

export const HOUSES: House[] = [
  {
    id: 'casa-1',
    number: 1,
    name: 'Casa I',
    title: 'Identidad y Apariencia',
    description: 'La Casa I es la puerta de entrada de la carta natal. Representa la identidad externa, la manera en que los demás nos perciben, el cuerpo físico y la personalidad inicial. Es la máscara, pero también la semilla del yo consciente. Marca el tono de la vida y es clave para el desarrollo personal.',
    dailyManifestation: 'Se refleja en la forma de vestir, el estilo de comunicación inmediata, la energía vital que proyectamos al conocer a alguien.',
    naturalSign: 'Aries',
    naturalRuler: 'Marte',
    color: 'rojo',
    chakra: 'raíz',
    frequency: '396 Hz',
    holisticExercise: 'Mirarse al espejo cada mañana, respirar profundo y afirmar: "Honro quién soy y me presento auténtico al mundo".',
    category: 'angular'
  },
  {
    id: 'casa-2',
    number: 2,
    name: 'Casa II',
    title: 'Recursos, Valores y Autoestima',
    description: 'La Casa II se relaciona con el dinero, las posesiones materiales y los valores internos. Representa cómo generamos, administramos y disfrutamos nuestros recursos. También muestra nuestra autoestima y lo que consideramos valioso en la vida.',
    dailyManifestation: 'La forma de gastar dinero, el estilo de alimentación, la manera de cuidar o desapegarse de lo material.',
    naturalSign: 'Tauro',
    naturalRuler: 'Venus',
    color: 'verde esmeralda',
    chakra: 'corazón',
    frequency: '528 Hz',
    holisticExercise: 'Escribir una lista de 5 cosas que valoras profundamente y agradecer por ellas cada día.',
    category: 'succedent'
  },
  {
    id: 'casa-3',
    number: 3,
    name: 'Casa III',
    title: 'Comunicación, Hermanos y Aprendizaje',
    description: 'La Casa III habla de la mente práctica, la comunicación diaria, los estudios básicos y los vínculos con hermanos o vecinos. Representa cómo pensamos, hablamos y nos relacionamos en lo inmediato.',
    dailyManifestation: 'Estilo de hablar, escribir, conducir, socializar en la comunidad.',
    naturalSign: 'Géminis',
    naturalRuler: 'Mercurio',
    color: 'amarillo',
    chakra: 'garganta',
    frequency: '741 Hz',
    holisticExercise: 'Practicar journaling diario con afirmaciones positivas o escribir cartas a mano.',
    category: 'cadent'
  },
  {
    id: 'casa-4',
    number: 4,
    name: 'Casa IV',
    title: 'Hogar, Raíces y Familia',
    description: 'La Casa IV representa el origen, la infancia, la familia, el hogar y las raíces emocionales. Es el lugar de la seguridad interna, la intimidad y el refugio. También marca la relación con la madre o figura nutricia.',
    dailyManifestation: 'El ambiente del hogar, el estilo de vida familiar, la nostalgia por el pasado.',
    naturalSign: 'Cáncer',
    naturalRuler: 'Luna',
    color: 'blanco perlado o plateado',
    chakra: 'corazón',
    frequency: '639 Hz',
    holisticExercise: 'Encender una vela en casa agradeciendo a los ancestros y repitiendo: "Honro mis raíces y construyo seguridad en mí".',
    category: 'angular'
  },
  {
    id: 'casa-5',
    number: 5,
    name: 'Casa V',
    title: 'Creatividad, Placer e Hijos',
    description: 'La Casa V habla de la autoexpresión, la creatividad, el romance, el juego y los hijos. Representa la capacidad de disfrutar, de brillar y de crear algo único. También refleja hobbies, deportes y formas de diversión.',
    dailyManifestation: 'El arte, los juegos, la forma de enamorarse, la pasión por actividades recreativas.',
    naturalSign: 'Leo',
    naturalRuler: 'Sol',
    color: 'dorado',
    chakra: 'plexo solar',
    frequency: '528 Hz',
    holisticExercise: 'Pintar, bailar o cantar libremente 15 minutos sin juicio, solo disfrutando.',
    category: 'succedent'
  },
  {
    id: 'casa-6',
    number: 6,
    name: 'Casa VI',
    title: 'Salud, Rutinas y Trabajo Diario',
    description: 'La Casa VI representa la vida cotidiana, el trabajo práctico, las rutinas, la organización y la salud. Indica cómo cuidamos el cuerpo y cómo servimos a otros. También habla de la relación con colegas.',
    dailyManifestation: 'Hábitos de alimentación, rutinas de ejercicio, manejo del estrés.',
    naturalSign: 'Virgo',
    naturalRuler: 'Mercurio',
    color: 'verde oliva',
    chakra: 'plexo solar',
    frequency: '528 Hz',
    holisticExercise: 'Establecer un ritual diario saludable (ej. beber agua al despertar, estiramientos).',
    category: 'cadent'
  },
  {
    id: 'casa-7',
    number: 7,
    name: 'Casa VII',
    title: 'Parejas y Asociaciones',
    description: 'La Casa VII es la casa de la pareja, las asociaciones y los vínculos de espejo. Representa cómo nos vinculamos en relaciones íntimas y profesionales, y qué buscamos en un otro. También habla de contratos y sociedades.',
    dailyManifestation: 'Forma de relacionarse en pareja, de negociar o de comprometerse con alguien.',
    naturalSign: 'Libra',
    naturalRuler: 'Venus',
    color: 'rosa suave',
    chakra: 'corazón',
    frequency: '639 Hz',
    holisticExercise: 'Escribir una carta a tu "otro ideal" (pareja, socio, amigo) describiendo cómo te gustaría que sea esa relación.',
    category: 'angular'
  },
  {
    id: 'casa-8',
    number: 8,
    name: 'Casa VIII',
    title: 'Transformación, Muerte y Sexualidad',
    description: 'La Casa VIII representa la transformación profunda, la sexualidad, los recursos compartidos y la muerte simbólica. Habla de lo oculto, la magia, el poder y las herencias. Su energía es intensa y regeneradora.',
    dailyManifestation: 'Cómo se viven los cambios radicales, la intimidad sexual, los vínculos con dinero compartido.',
    naturalSign: 'Escorpio',
    naturalRuler: 'Plutón (moderno) / Marte (tradicional)',
    color: 'negro o granate',
    chakra: 'sacro',
    frequency: '417 Hz',
    holisticExercise: 'Hacer un ritual de purificación: escribir algo que quieras soltar, quemarlo y enterrar las cenizas.',
    category: 'succedent'
  },
  {
    id: 'casa-9',
    number: 9,
    name: 'Casa IX',
    title: 'Filosofía, Viajes y Espiritualidad',
    description: 'La Casa IX habla de la expansión de la conciencia, la filosofía, los viajes largos, los estudios superiores y la espiritualidad. Representa la búsqueda de sentido y el contacto con lo lejano.',
    dailyManifestation: 'Viajes, estudios universitarios, religión, apertura cultural.',
    naturalSign: 'Sagitario',
    naturalRuler: 'Júpiter',
    color: 'púrpura',
    chakra: 'tercer ojo',
    frequency: '852 Hz',
    holisticExercise: 'Leer un libro espiritual o filosófico durante 20 minutos y escribir un aprendizaje clave.',
    category: 'cadent'
  },
  {
    id: 'casa-10',
    number: 10,
    name: 'Casa X',
    title: 'Vocación y Reputación',
    description: 'La Casa X representa la carrera, la vocación, el estatus social y la imagen pública. Es el punto más alto de la carta natal (Medio Cielo). Refleja logros, metas y la forma en que el mundo nos reconoce.',
    dailyManifestation: 'Profesión, rol en la sociedad, éxito, reconocimiento.',
    naturalSign: 'Capricornio',
    naturalRuler: 'Saturno',
    color: 'gris oscuro o negro',
    chakra: 'raíz',
    frequency: '396 Hz',
    holisticExercise: 'Escribir un plan de acción para una meta profesional y dar un primer paso ese mismo día.',
    category: 'angular'
  },
  {
    id: 'casa-11',
    number: 11,
    name: 'Casa XI',
    title: 'Amistades y Proyectos Colectivos',
    description: 'La Casa XI es la casa de las amistades, los grupos y los proyectos colectivos. Representa la visión de futuro, la innovación y la participación en causas sociales. También muestra los sueños y aspiraciones.',
    dailyManifestation: 'Estilo de amistades, compromiso con grupos, proyectos comunitarios.',
    naturalSign: 'Acuario',
    naturalRuler: 'Urano (moderno) / Saturno (tradicional)',
    color: 'azul eléctrico',
    chakra: 'garganta y corona',
    frequency: '741/963 Hz',
    holisticExercise: 'Reunirse con un grupo afín para compartir ideas y crear un proyecto colectivo.',
    category: 'succedent'
  },
  {
    id: 'casa-12',
    number: 12,
    name: 'Casa XII',
    title: 'Inconsciente, Espiritualidad y Karma',
    description: 'La Casa XII representa el inconsciente, la espiritualidad, los karmas y los espacios de reclusión. Es la casa del retiro, la meditación, los sueños y la conexión con lo trascendental. También muestra limitaciones, autoengaños y secretos.',
    dailyManifestation: 'Soledad, conexión espiritual, retiros, hospitalizaciones o refugios.',
    naturalSign: 'Piscis',
    naturalRuler: 'Neptuno (moderno) / Júpiter (tradicional)',
    color: 'violeta',
    chakra: 'corona',
    frequency: '963 Hz',
    holisticExercise: '15 minutos de meditación visualizando luz violeta que limpia el aura y conecta con lo divino.',
    category: 'cadent'
  }
];
