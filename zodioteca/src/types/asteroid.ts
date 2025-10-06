export interface Asteroid {
  name: string;
  symbol: string;
  mythology: string;
  function: string;
  manifestation: string;
  shadows: string;
  relations: string;
  color: string;
  chakra: string;
  frequency: number;
  stone: string;
  exercise: string;
}

export const ASTEROIDS: Asteroid[] = [
  {
    name: 'Ceres',
    symbol: '🌾',
    mythology: 'Ceres (Deméter en la mitología griega) es la diosa de la agricultura, los ciclos y la fertilidad. Su mito central es la pérdida y el reencuentro con su hija Perséfone, lo que simboliza los procesos de nutrición, pérdida y regeneración.',
    function: 'Ceres muestra cómo cuidamos, cómo nutrimos a otros y cómo necesitamos ser cuidados. Habla del alimento físico, pero también del emocional y espiritual. Marca la relación con la maternidad y con el ciclo vida-muerte-renacimiento.',
    manifestation: 'Personas con Ceres fuerte suelen ser cuidadoras, nutricionistas, psicólogas, docentes o madres/padres muy presentes. El área de la carta donde está Ceres muestra cómo nos vinculamos con el cuidado y cómo sanamos heridas de abandono.',
    shadows: 'Sobreprotección, dependencia emocional, dificultad en soltar. Problemas de alimentación, trastornos alimenticios.',
    relations: 'En Casa IV intensifica el rol maternal. Con Venus → nutrición a través del placer. Con Saturno → duelos difíciles, sensación de carencia.',
    color: 'Verde suave',
    chakra: 'Corazón',
    frequency: 528,
    stone: 'Jade, Aventurina',
    exercise: 'Cocinar un alimento nutritivo de manera consciente, bendecirlo antes de comerlo y agradecer a la tierra por el sustento.'
  },
  {
    name: 'Palas Atenea',
    symbol: '🦉',
    mythology: 'Atenea fue la diosa griega de la sabiduría, la estrategia y las artes. Nació de la cabeza de Zeus, lo que simboliza la unión entre la inteligencia racional y la intuición creativa.',
    function: 'Palas muestra la capacidad de resolver problemas, de usar la lógica y la intuición de manera equilibrada. Representa el talento artístico, la visión estratégica y la conexión entre mente y espíritu.',
    manifestation: 'Personas con Palas fuerte destacan como estrategas, artistas, científicas, arquitectos o mediadores. Es clave en temas de sanación (Palas está asociada también con patrones genéticos y el cuerpo).',
    shadows: 'Exceso de racionalidad, bloqueo emocional. Uso manipulador de la inteligencia.',
    relations: 'En Casa X: talento estratégico en la carrera. Con Mercurio → mente brillante. Con Neptuno → creatividad visionaria.',
    color: 'Azul índigo',
    chakra: 'Tercer Ojo',
    frequency: 852,
    stone: 'Lapislázuli, Sodalita',
    exercise: 'Escribir un problema actual, meditar visualizando luz índigo en el entrecejo y dejar que aparezca una solución intuitiva.'
  },
  {
    name: 'Juno',
    symbol: '💍',
    mythology: 'Juno (Hera en la mitología griega) fue la esposa de Zeus. Representa el matrimonio, la unión y los pactos de compromiso. Su energía está ligada a los contratos y la fidelidad.',
    function: 'Juno muestra cómo vivimos los compromisos, qué buscamos en una pareja y qué exigimos de un socio. Habla de lealtad, acuerdos y alianzas.',
    manifestation: 'Personas con Juno fuerte suelen estar enfocadas en relaciones comprometidas, fidelidad, matrimonios duraderos o lucha por la igualdad en vínculos.',
    shadows: 'Celos, dependencia emocional, exigencia excesiva. Dificultad para sostener relaciones si no hay igualdad.',
    relations: 'En Casa VII: tema central de vida en pareja. Con Saturno → compromiso serio y duradero. Con Urano → uniones poco convencionales.',
    color: 'Rosa/Dorado',
    chakra: 'Corazón',
    frequency: 639,
    stone: 'Cuarzo rosa',
    exercise: 'Escribir una carta de compromiso contigo mismo sobre cómo deseas relacionarte en amor y lealtad.'
  },
  {
    name: 'Vesta',
    symbol: '🔥',
    mythology: 'Vesta (Hestia en la mitología griega) era la diosa del fuego del hogar y del templo. Representa la llama interior, la devoción y la pureza espiritual.',
    function: 'Vesta indica dónde ponemos nuestra atención con devoción, qué área de vida cuidamos como un fuego sagrado. Representa concentración, espiritualidad y servicio.',
    manifestation: 'Personas con Vesta fuerte son dedicadas, se enfocan en proyectos espirituales, religiosos o de ayuda.',
    shadows: 'Aislamiento, represión sexual, fanatismo.',
    relations: 'En Casa XII: retiro espiritual. Con Marte → sublimación de energía sexual en servicio. Con Saturno → disciplina devocional.',
    color: 'Naranja brillante',
    chakra: 'Sacro',
    frequency: 417,
    stone: 'Cornalina',
    exercise: 'Encender una vela, meditar en silencio frente a ella y repetir: "Mi fuego interior me guía".'
  },
  {
    name: 'Hygiea',
    symbol: '⚕️',
    mythology: 'Hygiea era la diosa griega de la salud y la higiene. Su culto estaba vinculado con la medicina preventiva y los rituales de purificación.',
    function: 'En la carta natal representa la forma en que cuidamos nuestra salud, los hábitos de limpieza y la relación con la medicina y la prevención.',
    manifestation: 'Personas con Hygiea fuerte suelen trabajar en salud, terapias alternativas o nutrición.',
    shadows: 'Obsesión con la limpieza, miedo a la enfermedad.',
    relations: 'En Casa VI: énfasis en la salud y rutinas. Con Quirón → sanación profunda.',
    color: 'Verde oliva',
    chakra: 'Plexo Solar',
    frequency: 528,
    stone: 'Malaquita',
    exercise: 'Realizar un baño de limpieza energética con sal marina y hierbas.'
  },
  {
    name: 'Eros',
    symbol: '❤️‍🔥',
    mythology: 'Eros es el dios del deseo, la atracción y la unión erótica. Su energía está ligada al magnetismo sexual, pero también a la creatividad.',
    function: 'Eros muestra cómo deseamos, cómo expresamos pasión y qué nos atrae intensamente.',
    manifestation: 'Personas con Eros fuerte tienen gran magnetismo, pasión y creatividad inspirada en lo erótico.',
    shadows: 'Obsesión, confusión entre sexo y amor.',
    relations: 'En Casa V: creatividad y romances apasionados. Con Venus → sensualidad armónica. Con Plutón → deseo transformador.',
    color: 'Rojo carmesí',
    chakra: 'Sacro',
    frequency: 417,
    stone: 'Granate, Rubí',
    exercise: 'Practicar danza sensual y libre para desbloquear energía creativa y sexual.'
  },
  {
    name: 'Psique',
    symbol: '💫',
    mythology: 'Psique representa el alma y la sensibilidad extrema. En el mito, se une con Eros, simbolizando la integración del amor humano con lo divino.',
    function: 'Psique muestra cómo sentimos la vulnerabilidad del alma, nuestra capacidad de amar incondicionalmente y nuestra sensibilidad espiritual.',
    manifestation: 'Personas con Psique fuerte son profundamente sensibles, empáticas, artísticas o místicas.',
    shadows: 'Idealización, victimismo, falta de límites.',
    relations: 'En Casa XII: conexión mística. Con Neptuno → espiritualidad y arte.',
    color: 'Violeta',
    chakra: 'Corona',
    frequency: 963,
    stone: 'Amatista',
    exercise: 'Meditar 15 minutos visualizando luz violeta entrando por la coronilla, conectando con el alma.'
  }
];
