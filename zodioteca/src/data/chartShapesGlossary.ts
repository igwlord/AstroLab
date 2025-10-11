/**
 * Glosario de Formas de Carta Natal
 * Basado en los patrones de Marc Edmund Jones
 * Contenido pedagógico profundo para educación astrológica
 */

export interface ChartShapeGlossaryEntry {
  id: string;
  name: string;
  emoji: string;
  shortDescription: string;
  fullDescription: string;
  psychologicalProfile: string;
  shadow: string;
  evolution: string;
  historicalExamples: string[];
  integrationExercise: {
    title: string;
    steps: string[];
  };
  keywords: string[];
}

export const CHART_SHAPES_GLOSSARY: ChartShapeGlossaryEntry[] = [
  {
    id: 'bundle',
    name: 'Racimo (Bundle)',
    emoji: '🔴',
    shortDescription: 'Todos los planetas agrupados en menos de 120°. Energía concentrada y especializada.',
    fullDescription: `La forma Racimo se produce cuando la mayoría de los planetas se agrupan dentro de un arco menor a 120° del zodíaco. Toda la energía se concentra en una franja reducida, creando un campo vibratorio compacto, poderoso y coherente.

En la práctica, esta carta se percibe como "cerrada" o "focalizada": la persona vive su existencia desde un punto de vista muy particular y tiende a invertir toda su fuerza vital en pocos temas o áreas.`,
    psychologicalProfile: `La mente y el alma funcionan de forma **concentrada**. Estas personas no se dispersan fácilmente, sino que buscan profundidad y perfección en lo que hacen.

Suelen ser estudiosas, obsesivas o muy apasionadas. La vida interior gira en torno a un propósito dominante, a veces inconsciente, que canaliza toda la energía.

**Características clave:**
• Gran poder de enfoque y perseverancia
• Sentido de identidad fuerte
• Alta capacidad para desarrollar maestría o especialización
• Puede haber dificultad para cambiar de perspectiva o abrirse a lo nuevo`,
    shadow: `La misma concentración que da fuerza también puede volverse prisión.

El racimo puede generar **rigidez mental, aislamiento o intolerancia** hacia otras visiones.

La persona puede caer en el error de creer que su mundo es el único que existe.`,
    evolution: `El aprendizaje es **abrirse al resto del mandala zodiacal**, comprender que la totalidad existe más allá del propio foco.

Cuando el individuo logra abrir su conciencia, esa intensidad se convierte en un rayo de sabiduría: lo que antes era obsesión, se vuelve propósito iluminado.`,
    historicalExamples: [
      'Nikola Tesla: Concentró su energía en una búsqueda incansable del conocimiento eléctrico y espiritual',
    ],
    integrationExercise: {
      title: 'Expansión del Foco',
      steps: [
        'Dibujá un círculo dividido en 12 sectores (signos). Marcá dónde se concentra tu energía.',
        'Preguntate: ¿qué áreas de mi vida ignoro o desatiendo por estar tan enfocado en esta zona?',
        'Meditá imaginando que esa concentración se expande como una luz que comienza a irradiar hacia todo el zodíaco.',
      ],
    },
    keywords: ['Concentración', 'Especialización', 'Intensidad', 'Enfoque único', 'Maestría', 'Profundidad'],
  },
  {
    id: 'bowl',
    name: 'Cuenco (Bowl)',
    emoji: '🥣',
    shortDescription: 'Planetas en media rueda (180° o menos). Autocontención y propósito definido.',
    fullDescription: `En esta disposición, todos los planetas se ubican dentro de la mitad del zodíaco, dejando la otra mitad vacía.

El individuo vive "dentro de sí", con un fuerte sentido de identidad y misión. El hemisferio vacío representa lo que el alma busca completar o conquistar.`,
    psychologicalProfile: `El Cuenco simboliza **autocontención**.

La persona siente que su mundo interno basta para sosteners. Vive desde un eje claro, con una dirección bien definida.

Hay un propósito, una búsqueda o una causa que orienta toda la existencia.

**Características clave:**
• Reservado, prudente o protector
• Fuerte sentido de vocación o servicio
• El lado vacío actúa como un imán espiritual
• Busca explorar lo desconocido para lograr plenitud`,
    shadow: `La autarquía puede volverse **aislamiento**.

El "cuenco" puede cerrarse sobre sí mismo, generando una vida defensiva, con miedo a lo desconocido.`,
    evolution: `La expansión sucede cuando la persona **trasciende el borde del cuenco**, permitiendo que lo desconocido entre.

Al hacerlo, el recipiente se transforma en un **cáliz**: contenedor de sabiduría y amor.

El propósito se convierte en servicio.`,
    historicalExamples: [
      'Martin Luther King: Energía contenida y orientada hacia un ideal ético que se derrama hacia los demás',
      'Mahatma Gandhi: Propósito espiritual que transforma el cuenco personal en servicio universal',
    ],
    integrationExercise: {
      title: 'Del Cuenco al Cáliz',
      steps: [
        'Visualizá tu vida como un cuenco dorado. Dentro está tu propósito actual.',
        'Mirá el espacio vacío frente a él y preguntate: ¿qué cualidades o experiencias me faltan para sentirme completo?',
        'Escribí tres acciones concretas para integrar esa parte vacía.',
      ],
    },
    keywords: ['Contención', 'Autosuficiencia', 'Misión', 'Propósito definido', 'Vocación', 'Servicio'],
  },
  {
    id: 'bucket',
    name: 'Cubo (Bucket)',
    emoji: '🪣',
    shortDescription: 'Cuenco con un planeta aislado como "asa". Canalización hacia un punto focal.',
    fullDescription: `El Cuenco se transforma en Cubo cuando aparece un planeta aislado en el lado vacío del horóscopo. 

Ese planeta funciona como **asa o válvula**, un canal por donde toda la energía se proyecta hacia el mundo.`,
    psychologicalProfile: `La vida se organiza en torno a ese **planeta-asa**: es el punto de expresión, el "protagonista" de la historia.

Todo lo demás, consciente o no, gira en torno a ese tema.

La persona tiene una **vocación definida**, una causa o talento a través del cual se manifiesta su identidad profunda.

**Características clave:**
• Carismática, concentrada y con dirección clara
• El asa representa tanto su don como su desafío
• Fuerte identificación con un rol o propósito específico`,
    shadow: `Si la energía del asa se distorsiona o se bloquea, toda la vida parece trabarse.

El individuo puede caer en la **hiperidentificación** con ese rol: "yo soy mi trabajo", "yo soy mi misión".`,
    evolution: `La integración ocurre cuando el planeta-asa deja de ser un ego aislado y se convierte en un **canal consciente**.

Toda la energía interior fluye por él, sin esfuerzo ni control.`,
    historicalExamples: [
      'Sigmund Freud: Su Urano solitario fue el asa que liberó una revolución intelectual. Toda su energía emocional se expresó a través del pensamiento uraniano.',
    ],
    integrationExercise: {
      title: 'El Canal Consciente',
      steps: [
        'Identificá en qué área de tu vida sentís que todo se canaliza.',
        'Preguntate: ¿uso ese canal para controlar o para servir?',
        'Practicá una jornada en la que el "asa" se exprese sin exigencia, desde la espontaneidad.',
      ],
    },
    keywords: ['Dirección', 'Canalización', 'Foco único', 'Propósito dirigido', 'Vocación', 'Don'],
  },
  {
    id: 'locomotive',
    name: 'Locomotora (Locomotive)',
    emoji: '🚂',
    shortDescription: 'Planetas en 2/3 de la rueda. Impulso constante y determinación hacia el logro.',
    fullDescription: `Los planetas ocupan dos tercios de la rueda (unos 240°), dejando un tercio vacío.

Visualmente parece un tren avanzando: un planeta abre el movimiento (la "locomotora") y otro lo cierra (el "freno").`,
    psychologicalProfile: `Representa la personalidad **en marcha**.

Personas decididas, perseverantes, con metas claras. Sienten que su vida tiene dirección y propósito, y rara vez se detienen.

**Características clave:**
• Gran capacidad de logro, liderazgo y resistencia
• Orientadas al futuro y al progreso
• Motor interno inagotable
• Pueden vivir demasiado orientadas al futuro, incapaces de detenerse a disfrutar el presente`,
    shadow: `El impulso constante puede volverse **compulsión**.

El descanso, la pausa o la receptividad se perciben como debilidad.

Suelen sufrir de agotamiento o de sensación de vacío al detenerse.`,
    evolution: `Aprender el **arte del ritmo**, reconocer que el progreso no siempre es lineal.

Cuando la energía de la locomotora se hace consciente, la persona se vuelve una fuerza creativa que inspira y empuja a otros sin necesidad de imponer.`,
    historicalExamples: [
      'Elon Musk: Impulso constante hacia la innovación, con un motor interno inagotable',
      'Grandes pioneros: Muestran esta forma con determinación inquebrantable hacia sus visiones',
    ],
    integrationExercise: {
      title: 'El Arte del Ritmo',
      steps: [
        'Anotá tus metas actuales.',
        'Marcá cuáles provienen del deseo auténtico y cuáles del hábito de avanzar.',
        'Regalate un día sin objetivo. Observá qué emerge cuando no hay un "motor empujando".',
      ],
    },
    keywords: ['Impulso', 'Progreso', 'Determinación', 'Motor interno', 'Logro', 'Perseverancia'],
  },
  {
    id: 'seesaw',
    name: 'Balancín (Seesaw)',
    emoji: '⚖️',
    shortDescription: 'Dos grupos opuestos de planetas. Balance entre polaridades y dualidad interna.',
    fullDescription: `Los planetas se agrupan en dos sectores opuestos del zodíaco.

Hay dos mundos, dos polos, dos realidades que deben integrarse.

El Balancín simboliza la **dualidad interna**: mente y corazón, acción y reflexión, yo y otros, materia y espíritu.`,
    psychologicalProfile: `Estas personas viven entre extremos.

Tienen una percepción rica y compleja, capaces de ver ambos lados de una situación.

**Características clave:**
• Mediadores, artistas, psicólogos o negociadores natos
• Oscilan entre dos caminos o perspectivas
• Capacidad única de comprensión dual
• Pueden proyectar en los demás lo que no integran dentro suyo`,
    shadow: `Incertidumbre, duda, inestabilidad emocional.

A veces actúan según un polo y luego se arrepienten y van al otro.`,
    evolution: `El aprendizaje está en **reconocer que ambos polos son parte del mismo ser**.

No se trata de elegir, sino de unificar.

Cuando lo logran, se convierten en puentes entre mundos, en armonizadores naturales.`,
    historicalExamples: [
      'Carl Jung: Su vida fue un diálogo constante entre consciente e inconsciente, ciencia y alma',
    ],
    integrationExercise: {
      title: 'Unificación de Opuestos',
      steps: [
        'Escribí dos columnas: "lo que amo de mí" y "lo que rechazo".',
        'Trazá una línea entre cada par opuesto.',
        'Buscá el punto medio: ¿cómo podrían coexistir en armonía?',
      ],
    },
    keywords: ['Balance', 'Polaridad', 'Decisión', 'Dos caminos', 'Integración', 'Dualidad'],
  },
  {
    id: 'splash',
    name: 'Disperso (Splash)',
    emoji: '💫',
    shortDescription: 'Planetas distribuidos uniformemente. Versatilidad y múltiples talentos.',
    fullDescription: `Aquí los planetas están distribuidos casi uniformemente alrededor de la rueda.

No hay concentración ni vacío dominante.

Simboliza la **diversidad de experiencias y talentos**, una personalidad universal.`,
    psychologicalProfile: `Curiosos, adaptables, multifacéticos.

Pueden interesarse por mil cosas a la vez y aprender rápido.

**Características clave:**
• Generalistas con amplios horizontes intelectuales y espirituales
• Capacidad de comprender múltiples puntos de vista
• Conectan áreas que otros separan
• Mente tipo "Renaissance"`,
    shadow: `La dispersión.

Falta de foco o dirección clara.

Pueden comenzar mucho y terminar poco, o vivir con la sensación de no profundizar.`,
    evolution: `El camino es **encontrar un eje interno**, un hilo conductor que una la multiplicidad.

Cuando logran esto, se vuelven sabios, integradores, polímatas espirituales.`,
    historicalExamples: [
      'Leonardo da Vinci: Genio universal con curiosidad infinita',
      'Wolfgang Amadeus Mozart: Maestría en múltiples áreas del arte',
      'Richard Feynman: Científico con mente multifacética y creativa',
    ],
    integrationExercise: {
      title: 'El Hilo Conductor',
      steps: [
        'Hacé una lista de tus intereses actuales.',
        'Agrupalos por afinidad y buscá el tema que los une.',
        'Convertí esa palabra central en tu brújula durante una semana.',
      ],
    },
    keywords: ['Versatilidad', 'Diversidad', 'Universalidad', 'Multi-talento', 'Curiosidad', 'Adaptabilidad'],
  },
  {
    id: 'splay',
    name: 'Irregular (Splay)',
    emoji: '🌀',
    shortDescription: 'Distribución irregular sin patrón estándar. Individualismo y singularidad.',
    fullDescription: `Los planetas están dispuestos de manera irregular, en grupos desiguales y con huecos sin patrón claro.

El resultado es una carta "asimétrica", única, no clasificable.`,
    psychologicalProfile: `Personas excéntricas, creativas, autónomas.

No se ajustan a normas sociales ni patrones predecibles.

Pueden parecer caóticas, pero suelen tener un orden interno diferente al común.

**Características clave:**
• Inventores, artistas, visionarios o pioneros espirituales
• Valoran su libertad y originalidad por encima de todo
• Camino de vida poco común
• Genio creativo o singularidad radical`,
    shadow: `Aislamiento, rebeldía sin causa, sensación de no pertenecer.

Dificultad para cooperar o adaptarse.`,
    evolution: `Aprender a convivir con el mundo sin perder autenticidad.

Cuando logran integrar su diferencia como don, se convierten en **modelos de singularidad consciente**.`,
    historicalExamples: [
      'Salvador Dalí: Creatividad radical que rompió moldes',
      'Lady Gaga: Expresión única y universo propio',
      'Björk: Artista visionaria con estética singular',
    ],
    integrationExercise: {
      title: 'Don de la Singularidad',
      steps: [
        'Identificá tres aspectos de tu vida donde te sentís "raro" o fuera de lo común.',
        'Escribí cómo esas diferencias podrían ser dones al servicio de otros.',
        'Meditá con la idea: "Mi singularidad es una expresión de la totalidad".',
      ],
    },
    keywords: ['Individualismo', 'No convencional', 'Único', 'Independiente', 'Excéntrico', 'Visionario'],
  },
];

export default CHART_SHAPES_GLOSSARY;
