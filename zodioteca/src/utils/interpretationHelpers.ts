/**
 * HELPERS DE INTERPRETACIÓN ASTROLÓGICA
 * Funciones que convierten posiciones astrológicas en explicaciones comprensibles
 * Para uso en ExerciseChartPage.tsx
 */

// ============================================
// NODOS LUNARES - PROPÓSITO EVOLUTIVO
// ============================================

/**
 * Explica el Nodo Norte según el signo
 */
export function getNodeNorthExplanation(sign: string): string {
  const explanations: Record<string, string> = {
    'Aries': 'Tu alma viene a desarrollar independencia, coraje y la capacidad de iniciar cosas por ti mismo/a. Necesitas aprender a confiar en tus instintos y actuar con valentía.',
    'Taurus': 'Tu alma viene a desarrollar estabilidad, presencia en el cuerpo y conexión con lo material. Necesitas aprender a valorarte y crear seguridad desde dentro.',
    'Gemini': 'Tu alma viene a desarrollar comunicación, curiosidad y flexibilidad mental. Necesitas aprender a compartir información y conectar con tu entorno inmediato.',
    'Cancer': 'Tu alma viene a desarrollar nutrición emocional, conexión con la familia y la capacidad de cuidar. Necesitas aprender a sentir y expresar emociones auténticas.',
    'Leo': 'Tu alma viene a desarrollar autoexpresión creativa, alegría y liderazgo desde el corazón. Necesitas aprender a brillar y compartir tus dones únicos.',
    'Virgo': 'Tu alma viene a desarrollar servicio práctico, discernimiento y atención al detalle. Necesitas aprender a perfeccionar tus habilidades y ayudar de forma tangible.',
    'Libra': 'Tu alma viene a desarrollar relaciones equilibradas, diplomacia y la capacidad de cooperar. Necesitas aprender a considerar al otro sin perderte a ti mismo/a.',
    'Scorpio': 'Tu alma viene a desarrollar profundidad emocional, transformación y poder personal. Necesitas aprender a soltar control y renacer de tus crisis.',
    'Sagittarius': 'Tu alma viene a desarrollar fe, aventura y búsqueda de significado. Necesitas aprender a confiar en el proceso y expandir tu visión del mundo.',
    'Capricorn': 'Tu alma viene a desarrollar responsabilidad, estructura y autoridad genuina. Necesitas aprender a construir algo duradero y asumir tu poder público.',
    'Aquarius': 'Tu alma viene a desarrollar innovación, conciencia colectiva y tu contribución única. Necesitas aprender a ser auténticamente diferente y servir a la humanidad.',
    'Pisces': 'Tu alma viene a desarrollar compasión universal, conexión espiritual y rendición. Necesitas aprender a confiar en lo invisible y disolver fronteras.'
  };
  return explanations[sign] || 'Tu camino evolutivo te pide desarrollar nuevas cualidades.';
}

/**
 * Explica la dirección evolutiva del Nodo Norte según casa
 */
export function getNodeNorthDirection(_sign: string, house: number): string {
  const houseThemes: Record<number, string> = {
    1: 'Desarrolla tu identidad única y aprende a ponerte primero. Tu evolución pasa por ser más auténtico/a y menos dependiente de otros.',
    2: 'Construye tu seguridad material y autoestima desde dentro. Tu evolución pasa por valorar tus recursos y talentos propios.',
    3: 'Comunica, aprende y conecta con tu entorno inmediato. Tu evolución pasa por curiosidad intelectual y relaciones cercanas.',
    4: 'Crea un hogar emocional interno y conecta con tus raíces. Tu evolución pasa por nutrirte a ti mismo/a y a tu familia.',
    5: 'Expresa tu creatividad y alegría sin miedo al juicio. Tu evolución pasa por brillar y compartir tu luz única.',
    6: 'Sirve de forma práctica y cuida tu salud. Tu evolución pasa por la rutina saludable y el servicio humilde.',
    7: 'Desarrolla relaciones equilibradas y aprende el arte de la colaboración. Tu evolución pasa por considerar genuinamente al otro.',
    8: 'Transforma profundamente y comparte recursos. Tu evolución pasa por la intimidad emocional y el poder compartido.',
    9: 'Expande tu consciencia a través de filosofía, viajes o espiritualidad. Tu evolución pasa por buscar significado más allá de lo cotidiano.',
    10: 'Construye tu legado público y asume responsabilidad. Tu evolución pasa por tu contribución visible al mundo.',
    11: 'Conecta con comunidad y persigue tu visión del futuro. Tu evolución pasa por contribuir al colectivo desde tu unicidad.',
    12: 'Desarrolla compasión universal y conexión espiritual. Tu evolución pasa por soltar el ego y servir desde lo invisible.'
  };
  return houseThemes[house] || 'Esta área de vida es central para tu evolución.';
}

/**
 * Lista talentos innatos del Nodo Sur
 */
export function getNodeSouthTalents(sign: string): string[] {
  const talents: Record<string, string[]> = {
    'Aries': ['Independencia natural', 'Coraje innato', 'Capacidad de liderar', 'Acción rápida'],
    'Taurus': ['Estabilidad emocional', 'Conexión con lo material', 'Paciencia', 'Sentido de valor propio'],
    'Gemini': ['Habilidad comunicativa', 'Mente flexible', 'Curiosidad natural', 'Adaptabilidad'],
    'Cancer': ['Intuición emocional', 'Capacidad de nutrir', 'Sensibilidad', 'Memoria emocional'],
    'Leo': ['Creatividad natural', 'Carisma', 'Generosidad', 'Autoconfianza'],
    'Virgo': ['Ojo para el detalle', 'Habilidad analítica', 'Servicio natural', 'Perfeccionismo sano'],
    'Libra': ['Diplomacia natural', 'Sentido estético', 'Habilidad para mediar', 'Gracia social'],
    'Scorpio': ['Profundidad emocional', 'Poder personal', 'Capacidad de transformar', 'Magnetismo'],
    'Sagittarius': ['Optimismo natural', 'Fe', 'Visión amplia', 'Amor por la aventura'],
    'Capricorn': ['Disciplina', 'Responsabilidad natural', 'Ambición constructiva', 'Autoridad'],
    'Aquarius': ['Originalidad', 'Pensamiento innovador', 'Conciencia social', 'Desapego'],
    'Pisces': ['Compasión infinita', 'Intuición espiritual', 'Creatividad artística', 'Empatía']
  };
  return talents[sign] || ['Talentos desarrollados en vidas pasadas'];
}

/**
 * Lista patrones a soltar del Nodo Sur
 */
export function getNodeSouthPatterns(sign: string): string[] {
  const patterns: Record<string, string[]> = {
    'Aries': ['Actuar sin considerar consecuencias', 'Egocentrismo', 'Impulsividad excesiva', 'Competitividad destructiva'],
    'Taurus': ['Apego a posesiones', 'Resistencia al cambio', 'Terquedad', 'Búsqueda excesiva de comodidad'],
    'Gemini': ['Dispersión mental', 'Superficialidad', 'Incapacidad de profundizar', 'Racionalización excesiva'],
    'Cancer': ['Dependencia emocional', 'Vivir en el pasado', 'Sobre-protección', 'Victimización'],
    'Leo': ['Necesidad de validación constante', 'Drama innecesario', 'Orgullo excesivo', 'Egocentrismo'],
    'Virgo': ['Crítica excesiva', 'Perfeccionismo paralizante', 'Preocupación por detalles', 'Auto-sacrificio'],
    'Libra': ['Co-dependencia', 'Evitar conflictos a toda costa', 'Perder identidad en relaciones', 'Indecisión'],
    'Scorpio': ['Control obsesivo', 'Manipulación', 'Miedo a la vulnerabilidad', 'Intensidad destructiva'],
    'Sagittarius': ['Escapismo', 'Exceso de optimismo ingenuo', 'Evitar responsabilidades', 'Predicar sin practicar'],
    'Capricorn': ['Rigidez emocional', 'Workaholic', 'Frialdad', 'Exceso de control'],
    'Aquarius': ['Desapego emocional', 'Rebelión por rebelión', 'Sentirse superior', 'Evitar intimidad'],
    'Pisces': ['Escapismo a través de fantasías', 'Victimización', 'Falta de límites', 'Confusión']
  };
  return patterns[sign] || ['Patrones antiguos que ya no sirven'];
}

/**
 * Explica la trampa kármica del Nodo Sur
 */
export function getNodeSouthTrap(sign: string): string {
  const traps: Record<string, string> = {
    'Aries': 'La trampa es quedarte en la acción impulsiva sin considerar a otros. Sentirte solo/a porque nunca pides ayuda ni te permites recibir.',
    'Taurus': 'La trampa es quedarte en la zona de confort material, evitando transformación profunda. Aferrarte a posesiones o relaciones que ya no te nutren.',
    'Gemini': 'La trampa es dispersarte en mil ideas sin profundizar en ninguna. Evitar compromisos profundos por miedo a perder libertad mental.',
    'Cancer': 'La trampa es quedarte en el rol de cuidador/a sin desarrollar tu autoridad pública. Vivir a través de tu familia sin construir tu propio legado.',
    'Leo': 'La trampa es necesitar constantemente validación externa. Crear drama para sentir que existes, en lugar de servir desde el corazón.',
    'Virgo': 'La trampa es perderte en los detalles y la perfección sin ver el panorama completo. Servir sin permitirte recibir.',
    'Libra': 'La trampa es perderte en las relaciones, siempre buscando tu otra mitad. Evitar conflicto hasta perder tu identidad.',
    'Scorpio': 'La trampa es quedarte en el control y la intensidad emocional. Manipular por miedo a ser vulnerable o perder poder.',
    'Sagittarius': 'La trampa es escapar hacia ideales lejanos sin comprometerte con lo cotidiano. Predicar sin encarnar lo que enseñas.',
    'Capricorn': 'La trampa es aislarte en la ambición profesional, evitando emociones. Construir un imperio externo con un desierto emocional interno.',
    'Aquarius': 'La trampa es aislarte en tu diferencia, sintiéndote superior. Pertenecer a grupos pero evitar intimidad real.',
    'Pisces': 'La trampa es perderte en el mundo espiritual o en fantasías, evitando responsabilidad práctica. Ser víctima de las circunstancias.'
  };
  return traps[sign] || 'Evita quedarte en patrones cómodos pero limitantes.';
}

/**
 * Integración narrativa de los Nodos
 */
export function getNodesIntegration(nodes: { north: { sign: string; house: number }; south: { sign: string; house: number } }): string {
  return `Tu viaje evolutivo va desde ${nodes.south.sign} (zona de confort) hacia ${nodes.north.sign} (destino). 
  
  En vidas pasadas o en la primera mitad de esta vida, desarrollaste las cualidades de ${nodes.south.sign} en el área de Casa ${nodes.south.house}. Ahora tienes esos dones naturalmente, pero quedarte ahí te estanca.
  
  Tu alma te pide dar un salto evolutivo hacia ${nodes.north.sign} en Casa ${nodes.north.house}. Esto puede sentirse incómodo al principio porque son cualidades que NO dominas aún, pero ese es precisamente tu trabajo: desarrollarlas.
  
  El equilibrio está en USAR los talentos del Nodo Sur PARA SERVIR al desarrollo del Nodo Norte, no en abandonar uno por el otro, sino en integrarlos.`;
}

// ============================================
// QUIRÓN - HERIDA SANADORA
// ============================================

/**
 * Explica la herida de Quirón según signo
 */
export function getChironWoundBySign(sign: string): string {
  const wounds: Record<string, string> = {
    'Aries': 'Herida de identidad y derecho a existir. Dudas sobre si mereces ocupar espacio o si eres suficiente tal como eres.',
    'Taurus': 'Herida de valor personal y seguridad material. Dudas sobre tu propio valor o miedo a no tener suficiente.',
    'Gemini': 'Herida de comunicación y aprendizaje. Sentir que tu voz no importa o que no eres lo suficientemente inteligente.',
    'Cancer': 'Herida de nutrición emocional y pertenencia. Sensación de no haber sido suficientemente cuidado/a o de no pertenecer.',
    'Leo': 'Herida de autoexpresión y reconocimiento. Miedo al rechazo si muestras quien realmente eres.',
    'Virgo': 'Herida de perfección e imperfección. Sentir que nunca eres lo suficientemente bueno/a o útil.',
    'Libra': 'Herida de relaciones y reciprocidad. Dificultad para encontrar balance entre dar y recibir en relaciones.',
    'Scorpio': 'Herida de confianza y poder. Traición temprana que te hace difícil confiar o sentirte seguro/a.',
    'Sagittarius': 'Herida de significado y fe. Pérdida de fe en la vida o dificultad para encontrar tu verdad.',
    'Capricorn': 'Herida de autoridad y reconocimiento. Sentir que tu esfuerzo nunca es suficiente o que no mereces éxito.',
    'Aquarius': 'Herida de pertenencia y diferencia. Sentirte demasiado diferente para pertenecer realmente.',
    'Pisces': 'Herida de víctima y salvador. Tendencia a sacrificarte por otros hasta perderte a ti mismo/a.'
  };
  return wounds[sign] || 'Herida profunda que, una vez sanada, se convierte en tu don más grande.';
}

/**
 * Explica cómo se manifiesta Quirón según casa
 */
export function getChironManifestationByHouse(house: number): string {
  const manifestations: Record<number, string> = {
    1: 'La herida se manifiesta en tu identidad y cómo te presentas al mundo. Dudas sobre quién eres realmente.',
    2: 'La herida se manifiesta en tu autoestima y seguridad material. Dudas sobre tu valor propio.',
    3: 'La herida se manifiesta en comunicación y aprendizaje. Miedo a expresarte o sentirte escuchado/a.',
    4: 'La herida se manifiesta en hogar y familia. Dolor relacionado con tu origen o sentido de pertenencia.',
    5: 'La herida se manifiesta en creatividad y autoexpresión. Miedo a brillar o mostrar tus dones.',
    6: 'La herida se manifiesta en salud y servicio. Tendencia a sobre-dar o descuidar tu propio cuerpo.',
    7: 'La herida se manifiesta en relaciones íntimas. Patrones repetitivos de dolor en parejas.',
    8: 'La herida se manifiesta en intimidad profunda y poder compartido. Miedo a la vulnerabilidad total.',
    9: 'La herida se manifiesta en búsqueda de significado. Crisis de fe o dificultad para encontrar tu verdad.',
    10: 'La herida se manifiesta en tu carrera y rol público. Sentir que nunca serás suficientemente exitoso/a.',
    11: 'La herida se manifiesta en amistad y pertenencia grupal. Sentirte el extraño/a incluso en comunidad.',
    12: 'La herida se manifiesta en conexión espiritual. Dolor profundo que conecta con el sufrimiento universal.'
  };
  return manifestations[house] || 'La herida se activa en esta área específica de tu vida.';
}

/**
 * Explica el don que surge de sanar Quirón
 */
export function getChironGift(sign: string, house: number): string {
  return `Tu herida de Quirón en ${sign} (Casa ${house}) es dolorosa, pero una vez que la trabajes conscientemente, se convierte en tu medicina. 

Precisamente porque has experimentado este dolor profundamente, puedes ayudar a otros que sufren de forma similar. Tu herida sanadora te da:

1. Empatía profunda con quienes sufren de la misma manera
2. Sabiduría que solo viene de haber atravesado el dolor
3. Capacidad de guiar a otros en su sanación

El don no es que la herida desaparezca completamente, sino que aprendes a vivir con ella de forma consciente y a transformarla en servicio a otros.`;
}

/**
 * Camino de sanación de Quirón
 */
export function getChironHealingPath(sign: string, house: number): string {
  return `Para sanar tu Quirón en ${sign} (Casa ${house}), necesitas:

1. **Reconocer la herida**: El primer paso es admitir que existe y dejar de minimizarla.

2. **Dejar de compensar**: Muchas veces sobrecompensamos la herida (si es en Leo, tratamos de ser el más brillante; si es en Virgo, el más perfecto). Esto solo profundiza el dolor.

3. **Buscar ayuda**: Quirón representa donde necesitas a otro sanador. No puedes sanar esta herida solo/a.

4. **Aceptar la imperfección**: La herida nunca sana al 100%. Aprendes a vivir con ella de forma consciente.

5. **Convertirte en sanador**: Una vez que has trabajado tu herida, puedes ayudar genuinamente a otros con dolor similar.

El proceso es cíclico: cada vez que Quirón transite sobre su posición natal (cada 50 años) o forme aspectos importantes, la herida se reactiva pero con más sabiduría cada vez.`;
}

// ============================================
// LILITH - SOMBRA Y PODER REPRIMIDO
// ============================================

/**
 * Explica la represión de Lilith según signo
 */
export function getLilithRepressionBySign(sign: string): string {
  const repressions: Record<string, string> = {
    'Aries': 'Represión de tu rabia, asertividad y derecho a tomar espacio. Te enseñaron que tu fuerza era "demasiado".',
    'Taurus': 'Represión de tu sensualidad, placer y conexión con tu cuerpo. Te enseñaron que el placer físico era pecado.',
    'Gemini': 'Represión de tu voz incisiva y tu curiosidad sexual. Te enseñaron a callarte lo que realmente piensas.',
    'Cancer': 'Represión de tus necesidades emocionales y tu poder femenino. Te enseñaron a cuidar pero nunca recibir.',
    'Leo': 'Represión de tu magnetismo sexual y tu luz única. Te enseñaron que brillar era vanidad o egoísmo.',
    'Virgo': 'Represión de tu sexualidad y tu poder crítico. Te enseñaron que debías ser "pura" y servir sin cuestionamientos.',
    'Libra': 'Represión de tu capacidad de decir "no" y tu sexualidad fuera del matrimonio. Te enseñaron a complacer siempre.',
    'Scorpio': 'Represión de tu intensidad sexual y tu poder de transformación. Te enseñaron que tu profundidad era peligrosa.',
    'Sagittarius': 'Represión de tu libertad sexual y filosófica. Te enseñaron que debías conformarte con dogmas establecidos.',
    'Capricorn': 'Represión de tu ambición femenina y tu sexualidad fuera de normas. Te enseñaron que el poder no era para ti.',
    'Aquarius': 'Represión de tu sexualidad no convencional y tu rebeldía. Te enseñaron que debías encajar en la normalidad.',
    'Pisces': 'Represión de tu sexualidad mística y tus límites. Te enseñaron a ser víctima o mártir sexual.'
  };
  return repressions[sign] || 'Represión de una parte fundamental de tu poder femenino salvaje.';
}

/**
 * Explica cómo se manifiesta la sombra de Lilith según casa
 */
export function getLilithManifestationByHouse(house: number): string {
  const manifestations: Record<number, string> = {
    1: 'La represión afecta tu identidad y presencia. Miedo a mostrarte demasiado poderoso/a o sexual.',
    2: 'La represión afecta tu relación con dinero y placer. Culpa al recibir o disfrutar de recursos materiales.',
    3: 'La represión afecta tu comunicación. Autocensura de pensamientos "inapropiados" o demasiado directos.',
    4: 'La represión viene del hogar. Mensajes familiares sobre lo que es "apropiado" que interiorizaste.',
    5: 'La represión afecta tu creatividad y expresión sexual. Miedo a ser "demasiado" en el romance o arte.',
    6: 'La represión se manifiesta en servicio compulsivo. Usar el trabajo para evitar tu poder sexual.',
    7: 'La represión se proyecta en parejas. Atraes a quienes expresan tu sombra reprimida.',
    8: 'La represión afecta intimidad profunda. Miedo al poder que surge de la fusión sexual-emocional total.',
    9: 'La represión afecta tu filosofía de vida. Conflicto entre dogmas aprendidos y tu verdad salvaje.',
    10: 'La represión afecta tu carrera. Miedo a usar tu poder seductor o magnético profesionalmente.',
    11: 'La represión afecta tus amistades. Ser "la rara" del grupo por tus ideas sobre sexualidad o poder.',
    12: 'La represión es profunda e inconsciente. Lilith en el closet espiritual, emergiendo en sueños.'
  };
  return manifestations[house] || 'La represión se activa poderosamente en esta área de vida.';
}

/**
 * Explica el poder que surge de integrar Lilith
 */
export function getLilithPowerExpression(sign: string): string {
  const powers: Record<string, string> = {
    'Aries': 'Tu poder integrado es rabia sagrada que protege límites. Asertividad sin disculpas. Liderazgo femenino que no pide permiso.',
    'Taurus': 'Tu poder integrado es sensualidad sin vergüenza. Placer como acto sagrado. Conexión profunda con tu cuerpo como templo.',
    'Gemini': 'Tu poder integrado es comunicación sin filtros. Decir verdades incómodas. Inteligencia sexual y verbal sin censura.',
    'Cancer': 'Tu poder integrado es nutrición desde tu plenitud, no tu vacío. Decir "no" a quienes solo toman. Madre oscura que protege ferozmente.',
    'Leo': 'Tu poder integrado es magnetismo sexual sin disculpas. Creatividad salvaje. Ser el centro sin necesitar validación.',
    'Virgo': 'Tu poder integrado es discernimiento brutal. Sexualidad consciente pero libre. Perfeccionismo aplicado a tu placer, no tu represión.',
    'Libra': 'Tu poder integrado es decir "no" con gracia. Relaciones desde el deseo, no el deber. Belleza erótica sin necesidad de agradar.',
    'Scorpio': 'Tu poder integrado es alquimia sexual-espiritual. Muerte-renacimiento consciente. Poder de transformar a otros con tu presencia.',
    'Sagittarius': 'Tu poder integrado es libertad sexual-filosófica total. Verdad sin dogmas. Aventura erótica como camino espiritual.',
    'Capricorn': 'Tu poder integrado es ambición femenina sin culpa. Usar tu sexualidad para escalar sin victimismo. CEO y diosa sexual simultáneamente.',
    'Aquarius': 'Tu poder integrado es sexualidad queer/no convencional. Romper tabúes. Usar tu rareza como superpoder.',
    'Pisces': 'Tu poder integrado es sexualidad mística. Límites claros con compasión. Chamana sexual que sana a través del éxtasis.'
  };
  return powers[sign] || 'Tu poder integrado transforma la represión en expresión sagrada de tu esencia salvaje.';
}

/**
 * Señales de que Lilith está reprimida
 */
export function getLilithRepressionSigns(): string[] {
  return [
    '1. Rabia inexplicable que explotas en momentos inapropiados',
    '2. Atracción por personas "prohibidas" o relaciones destructivas',
    '3. Fantasías sexuales que te dan culpa o vergüenza',
    '4. Dificultad extrema para poner límites (especialmente con hombres)',
    '5. Envidia de mujeres que expresan poder o sexualidad libremente',
    '6. Sabotaje justo cuando estás por lograr algo importante',
    '7. Sentir que debes elegir entre ser "buena" o ser poderosa',
    '8. Proyectar tu sombra: juzgar en otras lo que reprimes en ti'
  ];
}

/**
 * Trabajo de integración de Lilith
 */
export function getLilithIntegrationWork(sign: string, house: number): string {
  return `Para integrar tu Lilith en ${sign} (Casa ${house}), necesitas:

**1. Reconocer la represión**: 
¿Qué te enseñaron que era "demasiado" en ti? ¿Qué parte de tu poder femenino/sexual aprendiste a esconder?

**2. Sentir la rabia**:
Lilith reprimida se convierte en rabia. Antes de integrar, necesitas SENTIR y VALIDAR tu enojo por haber sido silenciada.

**3. Recuperar lo prohibido**:
Permítete gradualmente expresar lo que fue reprimido. No desde la reacción, sino desde la elección consciente.

**4. Establecer límites sagrados**:
Lilith integrada es una maestra de límites. Aprende a decir "no" sin explicaciones, especialmente a demandas patriarcales.

**5. Celebrar tu poder**:
La integración completa es cuando puedes expresar tu poder/sexualidad/rabia sin culpa ni vergüenza, simplemente como parte de tu naturaleza.

Lilith no se "sana" como Quirón. Lilith se LIBERA. Es poder que reclamas, no herida que curas.`;
}

// ============================================
// ASPECTOS - DINÁMICAS PLANETARIAS
// ============================================

/**
 * Nombres de los aspectos en español
 */
export const aspectNames: Record<string, string> = {
  'conjunction': 'Conjunción',
  'opposition': 'Oposición',
  'trine': 'Trígono',
  'square': 'Cuadratura',
  'sextile': 'Sextil',
  'quincunx': 'Quincuncio',
  'semisextile': 'Semisextil',
  'semisquare': 'Semicuadratura',
  'sesquiquadrate': 'Sesquicuadratura'
};

/**
 * Explica qué significa cada tipo de aspecto
 */
export function getAspectTypeExplanation(type: string): string {
  const explanations: Record<string, string> = {
    'conjunction': '🌑 **Conjunción (0°)**: Fusión total. Los planetas actúan como uno solo, amplificándose mutuamente. Puede ser armonioso o tenso dependiendo de la naturaleza de los planetas.',
    'opposition': '⚖️ **Oposición (180°)**: Polaridad y tensión que busca balance. Ves un extremo en ti y el opuesto en otros. Pide integración de opuestos.',
    'square': '🔲 **Cuadratura (90°)**: Fricción creativa. Genera tensión que impulsa acción. Incómoda pero necesaria para crecer. Motor de transformación.',
    'trine': '🔺 **Trígono (120°)**: Fluidez natural. Los planetas se entienden y fluyen sin esfuerzo. Talento innato, pero cuidado: puede generar pereza.',
    'sextile': '✨ **Sextil (60°)**: Oportunidad que requiere acción. Fluye si lo activas conscientemente. Talento que necesitas cultivar.',
    'quincunx': '🔄 **Quincuncio (150°)**: Ajuste constante. Planetas en signos que no se entienden. Requiere adaptación creativa y flexibilidad.',
    'semisextile': '↗️ **Semisextil (30°)**: Conexión sutil. Crecimiento a través de pequeños ajustes. Menos intenso pero persistente.',
    'semisquare': '◼️ **Semicuadratura (45°)**: Fricción menor pero irritante. Como tener una piedrita en el zapato. Impulsa acción.',
    'sesquiquadrate': '⬛ **Sesquicuadratura (135°)**: Tensión creciente. Similar a la cuadratura pero más sutil. Frustración que madura con el tiempo.'
  };
  return explanations[type] || 'Conexión especial entre dos planetas.';
}

/**
 * Explica un aspecto específico entre dos planetas
 */
export function getSpecificAspectExplanation(planetA: string, planetB: string, type: string): string {
  // Normalizar nombres de planetas
  const p1 = planetA.toLowerCase().replace('sun', 'sol').replace('moon', 'luna');
  const p2 = planetB.toLowerCase().replace('sun', 'sol').replace('moon', 'luna');
  
  const key = `${p1}-${p2}-${type}`;
  
  // Aspectos más comunes (expandir según necesidad)
  const specificExplanations: Record<string, string> = {
    // Sol-Luna
    'sol-luna-conjunction': 'Tu identidad (Sol) y emociones (Luna) están fusionadas. Lo que sientes ES quien eres. Gran autenticidad pero dificultad para separar necesidades de identidad.',
    'sol-luna-opposition': 'Tu identidad consciente y necesidades emocionales están en polos opuestos. Conflicto entre lo que quieres ser y lo que necesitas para sentirte seguro/a.',
    'sol-luna-square': 'Fricción entre tu voluntad y tus emociones. Tu mente dice una cosa, tu corazón otra. Motor de crecimiento pero agotador.',
    'sol-luna-trine': 'Armonía natural entre identidad y emociones. Te sientes cómodo/a en tu piel. Facilidad para expresar sentimientos.',
    'sol-luna-sextile': 'Oportunidad de integrar voluntad y emociones. Fluye si trabajas conscientemente la conexión mente-corazón.',
    
    // Sol-Mercurio (siempre conjunción o semi-sextil por cercanía astronómica)
    'sol-mercurio-conjunction': 'Tu identidad y tu mente están fusionadas. Piensas mucho sobre ti mismo/a. Gran capacidad analítica pero posible subjetividad excesiva.',
    
    // Luna-Venus
    'luna-venus-conjunction': 'Necesitas belleza, armonía y amor para sentirte emocionalmente seguro/a. Don para crear ambientes amorosos.',
    'luna-venus-square': 'Conflicto entre lo que necesitas emocionalmente y lo que valoras en relaciones. Posible sobre-dar o necesidad de validación afectiva.',
    'luna-venus-trine': 'Talento natural para relaciones nutritivas. Facilidad para dar y recibir afecto. Gracia emocional.',
    
    // Agregar más según necesidad...
  };
  
  return specificExplanations[key] || `${aspectNames[type] || 'Aspecto'} entre ${planetA} y ${planetB}. Esta combinación crea una dinámica única en tu carta.`;
}

/**
 * Categoriza si el aspecto es duro o suave
 */
export function isHardAspect(type: string): boolean {
  const hardAspects = ['square', 'opposition', 'quincunx', 'semisquare', 'sesquiquadrate'];
  return hardAspects.includes(type);
}

/**
 * Genera lista de ejercicios relevantes para un aspecto
 */
export function getAspectExercises(planetA: string, planetB: string, _type: string, isHard: boolean): string[] {
  const exercises: string[] = [];
  
  if (isHard) {
    exercises.push(`Día de ${planetA}: Trabaja conscientemente la energía de este planeta`);
    exercises.push(`Día de ${planetB}: Integra la energía complementaria`);
    exercises.push('Días de integración: Ejercicios específicos para balancear la tensión');
  } else {
    exercises.push(`Días de ${planetA} y ${planetB}: Activa conscientemente este talento natural`);
    exercises.push('Ejercicios para evitar la complacencia y cultivar el don');
  }
  
  return exercises;
}

// ============================================
// CASAS - ÁREAS DE VIDA
// ============================================

/**
 * Explica el tema de cada casa
 */
export function getHouseExplanation(house: number): string {
  const explanations: Record<number, string> = {
    1: '**Casa 1 - Identidad y Apariencia**: Cómo te presentas al mundo, tu cuerpo físico, tu manera de iniciar cosas. Tu "yo" más visible.',
    2: '**Casa 2 - Recursos y Valores**: Tu relación con dinero, posesiones, talentos innatos. Lo que valoras y cómo generas seguridad material.',
    3: '**Casa 3 - Comunicación y Aprendizaje**: Tu mente, hermanos, entorno inmediato, estudios básicos. Cómo procesas y compartes información.',
    4: '**Casa 4 - Hogar y Raíces**: Tu familia de origen, hogar emocional, ancestros. Tu base interna y donde te sientes seguro/a.',
    5: '**Casa 5 - Creatividad y Placer**: Tu expresión creativa, romance, hijos, juego. Cómo brillas y qué te trae alegría.',
    6: '**Casa 6 - Salud y Servicio**: Tu rutina diaria, trabajo, salud física, mascotas. Cómo sirves y cuidas tu cuerpo.',
    7: '**Casa 7 - Relaciones y Asociaciones**: Parejas, socios, matrimonio. Lo que proyectas en otros y cómo te relacionas uno-a-uno.',
    8: '**Casa 8 - Transformación y Recursos Compartidos**: Intimidad profunda, sexualidad, muerte-renacimiento, herencias. Poder compartido.',
    9: '**Casa 9 - Filosofía y Expansión**: Estudios superiores, viajes lejanos, espiritualidad, tu búsqueda de significado. Tu verdad personal.',
    10: '**Casa 10 - Carrera y Legado**: Tu vocación pública, reputación, logros visibles. Cómo contribuyes al mundo.',
    11: '**Casa 11 - Comunidad y Visión**: Amistades, grupos, causas sociales. Tu tribu elegida y tu visión del futuro.',
    12: '**Casa 12 - Espiritualidad e Inconsciente**: Tu mundo interior, espiritualidad, lo oculto, el auto-sabotaje. Tu conexión con lo invisible.'
  };
  return explanations[house] || `Casa ${house}: Área específica de experiencia vital.`;
}

/**
 * Explica el nivel de estrés de la Luna
 */
export function getMoonStressExplanation(aspects: Array<{ planet: string; type: string; isHard: boolean }>): {
  level: 'bajo' | 'medio' | 'alto' | 'crítico';
  explanation: string;
  factors: string[];
} {
  const hardAspects = aspects.filter(a => a.isHard);
  const totalAspects = aspects.length;
  const ratio = totalAspects > 0 ? hardAspects.length / totalAspects : 0;
  
  let level: 'bajo' | 'medio' | 'alto' | 'crítico';
  let explanation: string;
  const factors: string[] = [];
  
  if (ratio >= 0.7) {
    level = 'crítico';
    explanation = 'Tu Luna está bajo presión intensa. Más del 70% de sus aspectos son tensos, lo que significa que tus necesidades emocionales enfrentan conflictos constantes.';
  } else if (ratio >= 0.5) {
    level = 'alto';
    explanation = 'Tu Luna está significativamente aspectada por tensiones. Tus emociones y necesidades de seguridad enfrentan desafíos regulares.';
  } else if (ratio >= 0.3) {
    level = 'medio';
    explanation = 'Tu Luna tiene un balance entre aspectos fluidos y tensos. Hay desafíos emocionales pero también recursos internos.';
  } else {
    level = 'bajo';
    explanation = 'Tu Luna está mayormente apoyada por aspectos armoniosos. Tus necesidades emocionales fluyen con relativa facilidad.';
  }
  
  // Agregar factores específicos
  hardAspects.forEach(aspect => {
    factors.push(`${aspectNames[aspect.type] || 'Aspecto tenso'} con ${aspect.planet}: genera tensión específica`);
  });
  
  return { level, explanation, factors };
}

// ============================================
// PLANETAS - ANÁLISIS PROFUNDO
// ============================================

/**
 * Explica cómo se manifiesta Mercurio según signo
 */
export function getMercuryManifestationBySign(sign: string): {
  communication: string;
  learning: string;
  mentalProcesses: string;
} {
  const manifestations: Record<string, { communication: string; learning: string; mentalProcesses: string }> = {
    'Aries': {
      communication: 'Directa, impulsiva y sin rodeos. Dices lo que piensas sin filtrar. Pueden surgir conflictos por franqueza excesiva.',
      learning: 'Rápido pero impaciente. Prefieres aprender haciendo. Te aburres con teoría lenta.',
      mentalProcesses: 'Mente rápida y decisiva. Piensas en acción. Pocas veces te quedas quieto mentalmente.'
    },
    'Taurus': {
      communication: 'Pausada, práctica y concreta. Te tomas tu tiempo para hablar. Valoras la palabra dada.',
      learning: 'Lento pero sólido. Necesitas tocar, ver, sentir. Una vez que aprendes, nunca olvidas.',
      mentalProcesses: 'Mente práctica y estable. Piensas en términos tangibles. Resistente al cambio mental.'
    },
    'Gemini': {
      communication: 'Rápida, versátil y social. Hablas mucho y con todos. Disfrutas el intercambio de ideas.',
      learning: 'Veloz y multitarea. Aprendes varias cosas a la vez. Necesitas variedad constante.',
      mentalProcesses: 'Mente ágil y curiosa. Piensas en conexiones. Puedes dispersarte fácilmente.'
    },
    'Cancer': {
      communication: 'Emocional, indirecta y protectora. Hablas desde el sentir. Puedes ser evasivo cuando te sientes vulnerable.',
      learning: 'A través de emociones y memoria. Recuerdas lo que te tocó el corazón. Necesitas sentirte seguro para aprender.',
      mentalProcesses: 'Mente receptiva e intuitiva. Piensas con el corazón. Tu memoria está ligada a emociones.'
    },
    'Leo': {
      communication: 'Dramática, expresiva y cálida. Hablas para inspirar. Te gusta ser escuchado y aplaudido.',
      learning: 'Creativo y a través del juego. Aprendes mejor cuando te diviertes. Necesitas reconocimiento por tus logros.',
      mentalProcesses: 'Mente creativa y orgullosa. Piensas en grande. Tu ego puede interferir con la objetividad.'
    },
    'Virgo': {
      communication: 'Precisa, analítica y crítica. Hablas con detalle. Puedes caer en exceso de crítica.',
      learning: 'Metódico y perfeccionista. Necesitas entender cada paso. Excelente para sistemas complejos.',
      mentalProcesses: 'Mente analítica y discriminadora. Piensas en detalles. Puedes perder el panorama completo.'
    },
    'Libra': {
      communication: 'Diplomática, equilibrada y considerada. Hablas pensando en el otro. Puedes evitar conflictos necesarios.',
      learning: 'A través de relaciones y comparación. Necesitas dialogar para entender. Aprendes mejor en pareja o grupo.',
      mentalProcesses: 'Mente equilibrada y comparativa. Piensas en pros y contras. Puedes caer en indecisión.'
    },
    'Scorpio': {
      communication: 'Intensa, profunda y estratégica. Hablas poco pero con peso. Guardas secretos naturalmente.',
      learning: 'Investigando y profundizando. Necesitas llegar al fondo. No te conformas con lo superficial.',
      mentalProcesses: 'Mente penetrante y obsesiva. Piensas en profundidad. Puedes rumiar ideas oscuras.'
    },
    'Sagittarius': {
      communication: 'Directa, optimista y filosófica. Hablas de grandes ideas. Puedes ser demasiado franco o exagerado.',
      learning: 'A través de experiencias y viajes. Necesitas libertad para explorar. Aprendes el "por qué" de las cosas.',
      mentalProcesses: 'Mente expansiva y abstracta. Piensas en significados. Puedes perder el sentido práctico.'
    },
    'Capricorn': {
      communication: 'Seria, estructurada y pragmática. Hablas con autoridad. Puedes ser demasiado rígido o pesimista.',
      learning: 'Sistemático y orientado a resultados. Necesitas ver la utilidad práctica. Aprendes con disciplina.',
      mentalProcesses: 'Mente estratégica y ambiciosa. Piensas a largo plazo. Puedes ser demasiado serio.'
    },
    'Aquarius': {
      communication: 'Original, desapegada e innovadora. Hablas de ideas vanguardistas. Puedes parecer frío o distante.',
      learning: 'A través de conceptos y patrones. Necesitas libertad intelectual. Aprendes de forma no convencional.',
      mentalProcesses: 'Mente inventiva y rebelde. Piensas fuera de la caja. Puedes desconectarte de lo emocional.'
    },
    'Pisces': {
      communication: 'Poética, empática y confusa. Hablas en imágenes y metáforas. Puedes ser vago o evasivo.',
      learning: 'A través de absorción osmótica. Captas el ambiente. Necesitas inspiración emocional o espiritual.',
      mentalProcesses: 'Mente intuitiva y difusa. Piensas en simbolismos. Puedes perder claridad racional.'
    }
  };
  
  return manifestations[sign] || {
    communication: 'Tu estilo comunicativo es único.',
    learning: 'Tu forma de aprender es particular.',
    mentalProcesses: 'Tu mente procesa información de manera específica.'
  };
}

/**
 * Explica el impacto de Mercurio retrógrado
 */
export function getMercuryRetrogradeImpact(isRetro: boolean): string {
  if (!isRetro) {
    return 'Mercurio directo te permite comunicar con claridad y procesar información hacia afuera. Tu mente fluye de forma lineal.';
  }
  
  return `**Mercurio Retrógrado** significa que tu mente se dirige hacia ADENTRO. 

**Esto NO es malo**, pero requiere conciencia:

• **Comunicación:** Revisas tus palabras internamente antes de hablar. Puedes parecer más callado o reflexivo.
• **Aprendizaje:** Aprendes re-visitando, re-pensando, re-leyendo. Tu comprensión profundiza con el tiempo.
• **Procesos mentales:** Tu mente trabaja en bucles. Piensas una cosa, la vuelves a pensar de otra forma. Gran capacidad de revisión.

**Desafíos:**
- Dificultad para expresarte con claridad inmediata
- Tendencia a la rumiación mental
- Malentendidos en comunicación con otros
- Necesidad de más tiempo para procesar

**Dones:**
- Profundidad de pensamiento
- Capacidad de revisar y perfeccionar ideas
- Pensamiento original (no lineal)
- Gran editor interno`;
}

/**
 * Cómo te comunicas en conflictos según Mercurio
 */
export function getMercuryConflictStyle(sign: string): string {
  const styles: Record<string, string> = {
    'Aries': 'Confrontas directamente y sin miedo. Dices lo que piensas en el momento, lo que puede escalar tensiones. Respetas a quien te debate de frente. Peligro: herir sin querer por franqueza excesiva.',
    'Taurus': 'Te cierras y te vuelves terco. Prefieres el silencio a la discusión acalorada. Cuando hablas, es con calma pero inflexible. Peligro: resentimiento acumulado por no expresarte a tiempo.',
    'Gemini': 'Intelectualizas el conflicto y argumentas con lógica. Puedes ser sarcástico o evasivo. Prefieres debatir ideas que emociones. Peligro: parecer frío o no tomarte en serio el problema.',
    'Cancer': 'Te vuelves indirecto y te refugias en tu caparazón. Hablas con rodeos o guardas silencio pasivo-agresivo. Necesitas sentirte seguro para abrirte. Peligro: comunicación poco clara que confunde al otro.',
    'Leo': 'Te expresas con drama y exiges ser escuchado. Puedes hacer el conflicto "sobre ti". Necesitas que reconozcan tu punto antes de ceder. Peligro: orgullo que impide disculparse.',
    'Virgo': 'Analizas cada detalle y señalas errores lógicos. Puedes ser excesivamente crítico. Tu mente busca "soluciones" más que empatía. Peligro: que el otro se sienta atacado o juzgado.',
    'Libra': 'Evitas el conflicto directo y buscas mediación. Hablas con diplomacia excesiva o guardas tu verdad por "mantener la paz". Peligro: acumular resentimientos o que no te tomen en serio.',
    'Scorpio': 'Guardas silencio estratégico o hablas con intensidad penetrante. Puedes usar información sensible como arma. Necesitas tiempo para procesar antes de confrontar. Peligro: resentimiento profundo o venganza verbal.',
    'Sagittarius': 'Eres brutalmente honesto y filosófico. Puedes minimizar el conflicto con humor o exagerar para hacer un punto. Prefieres "hablar las cosas" abiertamente. Peligro: herir sin intención por franqueza.',
    'Capricorn': 'Te vuelves frío, distante y autoritario. Hablas con control y seriedad. Puedes cerrar la conversación si la ves "improductiva". Peligro: parecer insensible o demasiado racional.',
    'Aquarius': 'Te desapegas emocionalmente y debates con lógica fría. Puedes "congelar" al otro con distancia mental. Prefieres resolver con razón, no con sentimientos. Peligro: que el otro sienta que no te importa.',
    'Pisces': 'Te confundes, evades o te victimizas. Puedes llorar o retirarte. Necesitas espacio para sentir antes de hablar. Tu comunicación es difusa y emocional. Peligro: no ser claro o manipular con culpa.'
  };
  
  return styles[sign] || 'Tu estilo de comunicación en conflictos es único y requiere conciencia.';
}

/**
 * Estilo de escritura natural según Mercurio
 */
export function getMercuryWritingStyle(sign: string): string {
  const styles: Record<string, string> = {
    'Aries': 'Frases cortas y directas. Escribes rápido y sin editar mucho. Estilo urgente, imperativos, signos de exclamación. Vas al grano sin rodeos.',
    'Taurus': 'Prosa sensorial y descriptiva. Escribes despacio pero con belleza. Usas metáforas físicas, textura en las palabras. Estilo sólido y concreto.',
    'Gemini': 'Ligero, ingenioso y conversacional. Escribes como hablas: rápido, con variedad de temas. Excelente para redes sociales, artículos cortos, diálogos.',
    'Cancer': 'Emotivo y nostálgico. Escribes desde el sentir. Tus palabras evocan recuerdos y emociones. Estilo íntimo, como un diario o carta personal.',
    'Leo': 'Dramático y expresivo. Escribes para impactar y ser memorable. Usas palabras grandes, metáforas brillantes. Estilo que pide atención y aplauso.',
    'Virgo': 'Preciso, detallado y pulido. Editas compulsivamente. Tu escritura es clara, organizada, útil. Excelente para manuales, instructivos, análisis.',
    'Libra': 'Elegante y equilibrado. Escribes con ritmo armónico. Usas lenguaje cortés, considerado. Excelente para mediación, relaciones públicas, poesía lírica.',
    'Scorpio': 'Intenso y penetrante. Escribes con profundidad psicológica. Tus palabras tienen peso y subtexto. Excelente para misterio, thriller, psicología.',
    'Sagittarius': 'Filosófico y expansivo. Escribes sobre grandes ideas con humor. Tus textos inspiran y amplían perspectivas. Estilo aventurero y optimista.',
    'Capricorn': 'Formal, estructurado y autoritario. Escribes con seriedad y propósito. Tu estilo es profesional, jerárquico. Excelente para negocios, academia.',
    'Aquarius': 'Original y conceptual. Escribes ideas vanguardistas con desapego. Tu estilo es único, a veces críptico. Excelente para ciencia ficción, manifiestos.',
    'Pisces': 'Poético y simbólico. Escribes en imágenes y metáforas fluidas. Tu prosa es onírica, difusa. Excelente para poesía, fantasía, espiritualidad.'
  };
  
  return styles[sign] || 'Tu estilo de escritura refleja tu proceso mental único.';
}

/**
 * Errores comunes de comunicación según Mercurio
 */
export function getMercuryCommonMistakes(sign: string): string[] {
  const mistakes: Record<string, string[]> = {
    'Aries': [
      'Interrumpir antes de que el otro termine',
      'Ser demasiado directo y herir sin querer',
      'No escuchar por estar pensando tu respuesta',
      'Imponer tu punto sin considerar otras perspectivas'
    ],
    'Taurus': [
      'Cerrarte y no comunicar lo que sientes',
      'Ser terco y no cambiar de opinión aunque tengas razón contraria',
      'Demorar demasiado en responder o tomar decisiones',
      'Aferrarte a ideas obsoletas por resistencia al cambio'
    ],
    'Gemini': [
      'Hablar demasiado y no profundizar',
      'Ser inconsistente en tus opiniones',
      'Dispersarte y no terminar ideas',
      'Usar sarcasmo cuando deberías ser serio'
    ],
    'Cancer': [
      'Comunicar con indirectas en vez de ser claro',
      'Tomar todo personal y ofenderte fácilmente',
      'Guardar silencios pasivo-agresivos',
      'Evadir confrontación necesaria'
    ],
    'Leo': [
      'Monopolizar conversaciones hablando de ti',
      'No admitir errores por orgullo',
      'Exagerar para llamar la atención',
      'Ofenderte si no te elogian al hablar'
    ],
    'Virgo': [
      'Ser excesivamente crítico y señalar cada error',
      'Perderte en detalles sin ver el panorama',
      'Corregir a otros incluso cuando no te piden opinión',
      'Paralizar decisiones por sobrepensar'
    ],
    'Libra': [
      'Evitar decir tu verdadera opinión por quedar bien',
      'Ser indeciso y cambiar de postura constantemente',
      'No poner límites claros',
      'Acumular resentimientos por no confrontar'
    ],
    'Scorpio': [
      'Guardar secretos y no compartir información importante',
      'Usar el silencio como castigo',
      'Manipular conversaciones para obtener poder',
      'Ser vengativo verbalmente cuando te sientes herido'
    ],
    'Sagittarius': [
      'Ser brutalmente honesto sin considerar sensibilidades',
      'Exagerar o prometer demasiado',
      'Imponer tu filosofía sin escuchar otras visiones',
      'Minimizar problemas reales con optimismo excesivo'
    ],
    'Capricorn': [
      'Ser demasiado serio y no mostrar emociones',
      'Cerrar conversaciones que consideras "improductivas"',
      'Hablar con autoridad incluso cuando no la tienes',
      'Pesimismo que aplasta el entusiasmo ajeno'
    ],
    'Aquarius': [
      'Desapegarte emocionalmente cuando deberías conectar',
      'Ser tan racional que ignoras sentimientos',
      'Rebelarte automáticamente contra toda opinión convencional',
      'Parecer frío o distante en temas emocionales'
    ],
    'Pisces': [
      'Ser vago y poco claro en tu comunicación',
      'Victimizarte en vez de expresar límites',
      'Absorber la energía del otro y perder tu punto',
      'Evadir confrontación con confusión o lágrimas'
    ]
  };
  
  return mistakes[sign] || [
    'Cada Mercurio tiene sus desafíos comunicativos',
    'La clave es reconocerlos y trabajarlos conscientemente'
  ];
}

/**
 * Explica cómo Venus se manifiesta en relaciones según signo
 */
export function getVenusRelationshipStyle(sign: string): string {
  const styles: Record<string, string> = {
    'Aries': 'Amas con pasión e intensidad. Te enamoras rápido y persigues lo que quieres. Necesitas emoción y novedad en el amor.',
    'Taurus': 'Amas con lealtad y sensualidad. Valoras la estabilidad y el placer físico. Necesitas seguridad y afecto tangible.',
    'Gemini': 'Amas con curiosidad y variedad. Te enamoras de la mente. Necesitas conversación y novedad mental constante.',
    'Cancer': 'Amas con nutrición y emotividad. Cuidas a quien amas. Necesitas seguridad emocional y reciprocidad.',
    'Leo': 'Amas con generosidad y drama. Das todo tu corazón. Necesitas admiración, romance y ser el centro de atención.',
    'Virgo': 'Amas con servicio y atención al detalle. Demuestras amor siendo útil. Necesitas perfección y te cuesta relajarte en el amor.',
    'Libra': 'Amas con diplomacia y búsqueda de armonía. Valoras la belleza relacional. Necesitas equilibrio y te cuesta estar solo/a.',
    'Scorpio': 'Amas con intensidad y totalidad. Buscas fusión profunda. Necesitas intimidad emocional-sexual completa o nada.',
    'Sagittarius': 'Amas con libertad y aventura. Valoras la independencia mutua. Necesitas espacio y te aburres con rutina.',
    'Capricorn': 'Amas con compromiso y seriedad. Construyes relaciones duraderas. Necesitas respeto y te cuesta mostrar vulnerabilidad.',
    'Aquarius': 'Amas con amistad y desapego. Valoras la conexión mental. Necesitas libertad y te cuesta con las emociones intensas.',
    'Pisces': 'Amas con devoción y compasión. Te entregas completamente. Necesitas conexión espiritual y te cuesta con límites.'
  };
  return styles[sign] || 'Tu forma de amar es única y especial.';
}

/**
 * Red flags en relaciones según Venus
 */
export function getVenusRedFlags(sign: string): string[] {
  const flags: Record<string, string[]> = {
    'Aries': [
      'Pierde interés rápido si no hay emoción constante',
      'Puede ser egoísta o pensar solo en sus necesidades',
      'Busca conquista más que relación estable',
      'Puede ser demasiado directo/a y herir sin querer'
    ],
    'Taurus': [
      'Posesivo/a y celoso/a de forma obsesiva',
      'Terco/a hasta el punto de no escuchar razones',
      'Puede aferrarse a relaciones muertas por comodidad',
      'Materialista: valora demasiado lo tangible'
    ],
    'Gemini': [
      'Inconsistente emocionalmente (hoy sí, mañana no)',
      'Puede tener múltiples intereses amorosos simultáneos',
      'Evade compromiso profundo con charla superficial',
      'Aburre fácilmente y busca novedad constante'
    ],
    'Cancer': [
      'Dependiente emocional y necesitado/a de validación',
      'Manipula con culpa o victimización',
      'Sobreprotector hasta asfixiar al otro',
      'Guarda rencores y saca temas del pasado'
    ],
    'Leo': [
      'Necesita atención constante o se siente rechazado/a',
      'Ego herido fácilmente, drama por cosas pequeñas',
      'Puede ser controlador/a disfrazado de "cuidado"',
      'Competitivo en la relación en vez de colaborativo'
    ],
    'Virgo': [
      'Excesivamente crítico/a con la pareja',
      'Perfeccionista imposible de complacer',
      'Puede ser frío/a emocionalmente (todo es mental)',
      'Sirve hasta resentirse y luego explota'
    ],
    'Libra': [
      'Evita conflictos necesarios hasta que explotan',
      'Indeciso/a crónico/a, no sabe lo que quiere',
      'Puede ser infiel por no saber decir "no"',
      'Dependiente de estar en pareja (no tolera soledad)'
    ],
    'Scorpio': [
      'Celos obsesivos y necesidad de control total',
      'Manipulador/a emocional y vengativo/a',
      'Desconfía constantemente (interroga, revisa)',
      'Intensidad que asfixia: todo o nada, sin término medio'
    ],
    'Sagittarius': [
      'Compromiso-fóbico, huye ante profundidad',
      'Brutalmente honesto/a sin considerar sensibilidades',
      'Puede ser infiel justificándolo con "libertad"',
      'Minimiza problemas reales con optimismo vacío'
    ],
    'Capricorn': [
      'Frío/a emocionalmente, prioriza trabajo sobre amor',
      'Controlador/a y autoritario/a en la relación',
      'Puede usar el amor como transacción o estatus',
      'Le cuesta expresar afecto y vulnerabilidad'
    ],
    'Aquarius': [
      'Desapegado/a emocionalmente hasta parecer insensible',
      'Puede intelectualizar todo sin sentir',
      'Necesita tanta libertad que no hay "relación"',
      'Rebelde: hace lo opuesto por principio'
    ],
    'Pisces': [
      'Víctima crónica que manipula con culpa',
      'Límites difusos: absorbe todo del otro',
      'Puede escapar con fantasías, mentiras o adicciones',
      'Se sacrifica esperando que el otro "adivine" y retribuya'
    ]
  };
  
  return flags[sign] || [
    'Cada Venus tiene sus desafíos relacionales',
    'La clave es reconocerlos y trabajarlos conscientemente'
  ];
}

/**
 * Lenguaje de amor predominante según Venus
 */
export function getVenusLoveLanguage(sign: string): string {
  const languages: Record<string, string> = {
    'Aries': '**Tiempo de calidad en acción**: Aventuras juntos, deportes, actividades emocionantes. Amas haciendo cosas, no hablando de ellas. Te sientes amado/a cuando alguien se aventura contigo.',
    'Taurus': '**Toque físico + Regalos**: Necesitas afecto tangible: abrazos, masajes, comida rica. Te sientes amado/a con gestos concretos que puedes ver, tocar, saborear. La sensualidad es tu idioma.',
    'Gemini': '**Palabras de afirmación + Comunicación**: Necesitas conversación constante, textos, compartir ideas. Te sientes amado/a cuando alguien te escucha, te hace reír, te estimula mentalmente.',
    'Cancer': '**Actos de servicio + Tiempo de calidad**: Necesitas que te cuiden y nutran. Te sientes amado/a cuando alguien te prepara comida, te da seguridad, te hace sentir en casa.',
    'Leo': '**Palabras de afirmación + Regalos**: Necesitas elogios, reconocimiento, celebración. Te sientes amado/a cuando alguien te hace sentir especial, te admira públicamente, te sorprende.',
    'Virgo': '**Actos de servicio**: Te sientes amado/a cuando alguien te ayuda, te facilita la vida, te demuestra amor con acciones útiles. Para ti amor = servicio mutuo y apoyo práctico.',
    'Libra': '**Tiempo de calidad + Regalos**: Necesitas experiencias hermosas juntos, belleza compartida. Te sientes amado/a con salidas románticas, detalles estéticos, armonía relacional.',
    'Scorpio': '**Toque físico + Intimidad emocional**: Necesitas fusión total: sexo profundo + vulnerabilidad psicológica. Te sientes amado/a cuando alguien se desnuda emocionalmente contigo.',
    'Sagittarius': '**Tiempo de calidad + Libertad**: Necesitas aventuras, viajes, experiencias nuevas juntos. Te sientes amado/a cuando alguien te da espacio pero también te acompaña a explorar.',
    'Capricorn': '**Actos de servicio + Compromiso**: Necesitas estabilidad, acciones que demuestren seriedad. Te sientes amado/a cuando alguien construye futuro contigo con hechos, no palabras.',
    'Aquarius': '**Tiempo de calidad intelectual + Libertad**: Necesitas amistad profunda con independencia mutua. Te sientes amado/a cuando alguien respeta tu espacio y te desafía mentalmente.',
    'Pisces': '**Toque físico + Palabras de afirmación**: Necesitas ternura, romanticismo, conexión espiritual. Te sientes amado/a con gestos poéticos, empatía profunda, fusión emocional.'
  };
  
  return languages[sign] || 'Tu lenguaje de amor es único y merece ser reconocido.';
}

/**
 * Características de pareja ideal según Venus
 */
export function getVenusIdealPartner(sign: string): string {
  const ideals: Record<string, string> = {
    'Aries': 'Alguien **valiente, directo/a y apasionado/a**. Que te desafíe, te siga el ritmo y no se asuste de tu intensidad. Que sea independiente pero presente. Que te haga sentir vivo/a.',
    'Taurus': 'Alguien **estable, sensual y leal**. Que valore el placer físico, la belleza y la seguridad. Que sea paciente, constante y demuestre amor con hechos tangibles. Que construya contigo.',
    'Gemini': 'Alguien **inteligente, versátil y comunicativo/a**. Que te haga reír, te estimule mentalmente y no sea aburrido/a. Que acepte tu necesidad de variedad y conversación constante.',
    'Cancer': 'Alguien **nutritivo/a, emocional y protector/a**. Que te haga sentir seguro/a, que valore la familia y la intimidad. Que sea empático/a y recíproco/a en cuidados mutuos.',
    'Leo': 'Alguien **admirador/a, generoso/a y brillante**. Que te celebre, te haga sentir especial y comparta tu amor por la vida. Que sea leal, orgulloso/a de ti y te dé romance dramático.',
    'Virgo': 'Alguien **útil, ordenado/a y confiable**. Que aprecie tu atención al detalle, que mejore contigo mutuamente. Que sea inteligente, humilde y demuestre amor con acciones prácticas.',
    'Libra': 'Alguien **armonioso/a, elegante y diplomático/a**. Que valore la belleza, la justicia y el equilibrio. Que sea sociable, romántico/a y busque crear una relación estética y balanceada.',
    'Scorpio': 'Alguien **intenso/a, leal y profundo/a**. Que no tenga miedo de tu oscuridad, que se fusione totalmente contigo. Que sea apasionado/a sexual y emocionalmente, sin superficialidades.',
    'Sagittarius': 'Alguien **libre, aventurero/a y filosófico/a**. Que viaje contigo (literal y metafóricamente), que ría, que busque significado. Que no te ate pero tampoco te abandone.',
    'Capricorn': 'Alguien **ambicioso/a, maduro/a y responsable**. Que construya futuro sólido, que respete tu carrera. Que sea serio/a en compromiso pero también te ayude a soltar el control.',
    'Aquarius': 'Alguien **original, independiente y mental**. Que sea tu amigo/a primero, que respete tu libertad radical. Que comparta tu visión de futuro y no te agobie con demandas emocionales.',
    'Pisces': 'Alguien **compasivo/a, espiritual y artístico/a**. Que entienda tu sensibilidad, que te ancle sin limitarte. Que comparta tu mundo de fantasía pero también te traiga a tierra.'
  };
  
  return ideals[sign] || 'Tu pareja ideal es única y específica a tu Venus.';
}

/**
 * Explica cómo Marte expresa su energía según signo
 */
export function getMarsActionStyle(sign: string): string {
  const styles: Record<string, string> = {
    'Aries': 'Actúas con rapidez y valentía. Eres el guerrero natural. Tu rabia es directa y explosiva, pero pasa rápido. Necesitas acción física constante.',
    'Taurus': 'Actúas con persistencia y paciencia. Eres lento para empezar pero imparable una vez en movimiento. Tu rabia se acumula hasta explotar. Necesitas trabajar tu cuerpo.',
    'Gemini': 'Actúas con versatilidad y comunicación. Eres rápido mentalmente pero disperso en acción. Tu rabia es verbal y sarcástica. Necesitas variedad de estímulos.',
    'Cancer': 'Actúas desde las emociones. Eres protector y defensivo. Tu rabia es pasivo-agresiva o manipuladora. Necesitas sentirte seguro para actuar.',
    'Leo': 'Actúas con creatividad y orgullo. Eres el líder natural. Tu rabia es dramática y orgullosa. Necesitas reconocimiento por tus acciones.',
    'Virgo': 'Actúas con precisión y eficiencia. Eres el ejecutor perfeccionista. Tu rabia es crítica y controlada. Necesitas sentir que sirves de forma útil.',
    'Libra': 'Actúas buscando equilibrio (Marte en detrimento). Te cuesta decidir y actuar. Tu rabia se reprime por miedo al conflicto. Necesitas armonía para moverte.',
    'Scorpio': 'Actúas con intensidad y estrategia. Eres el guerrero invisible. Tu rabia es contenida y luego devastadora. Necesitas poder y control.',
    'Sagittarius': 'Actúas con optimismo y expansión. Eres el aventurero. Tu rabia es franca y pasajera. Necesitas libertad y significado en tu acción.',
    'Capricorn': 'Actúas con disciplina y ambición (Marte en exaltación). Eres el ejecutor estratégico. Tu rabia es fría y calculada. Necesitas estructura y logro.',
    'Aquarius': 'Actúas con innovación y rebeldía. Eres el reformador. Tu rabia es desapegada y racional. Necesitas libertad y causa colectiva.',
    'Pisces': 'Actúas con compasión y confusión. Eres el mártir. Tu rabia se reprime hasta convertirse en victimización. Necesitas inspiración espiritual para moverte.'
  };
  return styles[sign] || 'Tu forma de actuar tiene un estilo único.';
}

/**
 * Cómo expresa la rabia según Marte
 */
export function getMarsAngerStyle(sign: string): string {
  const styles: Record<string, string> = {
    'Aries': '**Rabia explosiva e inmediata**. Estallas al instante sin filtro. Tu rabia es honesta, directa, ruidosa. Gritas, confrontas, puede haber agresión física. **Positivo**: Pasa rápido, no guardas rencor. **Peligro**: Herir sin intención, violencia impulsiva.',
    'Taurus': '**Rabia acumulada que explota**. Aguantas, aguantas... hasta que no puedes más. Tu rabia es lenta pero devastadora. **Positivo**: Das muchas oportunidades. **Peligro**: Cuando explotas, destruyes todo, y luego te cuesta perdonar.',
    'Gemini': '**Rabia verbal y sarcástica**. No golpeas, atacas con palabras hirientes. Debates agresivamente, usas el intelecto como arma. **Positivo**: No hay violencia física. **Peligro**: Tus palabras pueden destruir psicológicamente al otro.',
    'Cancer': '**Rabia pasivo-agresiva**. No confrontas directamente. Guardas silencio, te retiras, manipulas con culpa. Lloras o explotas emocionalmente. **Positivo**: Evitas violencia directa. **Peligro**: Confusión, resentimiento prolongado, manipulación emocional.',
    'Leo': '**Rabia dramática y orgullosa**. Cuando te enojas, es un show. Gritas, demandas respeto, tu ego herido ruge. **Positivo**: Es claro que estás enojado/a. **Peligro**: Orgullo que impide disculparte, drama que agota a los demás.',
    'Virgo': '**Rabia crítica y contenida**. No explotas, pero tu crítica constante destruye. Señalas cada error con precisión quirúrgica. **Positivo**: Control, no hay violencia. **Peligro**: Tu crítica hiere profundamente y acumulas resentimiento interno.',
    'Scorpio': '**Rabia silenciosa y vengativa**. Guardas tu rabia en lo profundo, planeas tu venganza. Cuando atacas, es letal y estratégico. **Positivo**: Control total. **Peligro**: Resentimiento crónico, venganza desproporcionada, autodestrucción.',
    'Sagittarius': '**Rabia filosófica y exagerada**. Te enojas con franqueza brutal, dices verdades hirientes, luego lo minimizas con humor. **Positivo**: No guardas rencor. **Peligro**: Herir sin considerar consecuencias, exagerar todo.',
    'Capricorn': '**Rabia fría y calculada**. No gritas, te vuelves de hielo. Cortas comunicación, castigas con distancia. **Positivo**: Control absoluto, no hay escándalo. **Peligro**: Crueldad fría, rencor duradero, usar autoridad para castigar.',
    'Aquarius': '**Rabia desapegada y racional**. Te enojas con argumentos lógicos fríos. Desconectas emocionalmente. **Positivo**: No hay drama emocional. **Peligro**: Parecer insensible, deshumanizar al otro, rebelarte sin empatía.',
    'Libra': '**Rabia reprimida que acumula**. Evitas conflicto hasta que explotas desproporcionadamente. **Positivo**: Das muchas oportunidades. **Peligro**: Explosión inesperada, no poner límites a tiempo, resentimiento oculto.',
    'Pisces': '**Rabia confusa y victimizada**. Lloras, te confundes, te retiras. Manipulas con culpa o te autosaboteas. **Positivo**: No eres agresivo/a. **Peligro**: No expresar límites claros, victimización, adicciones como escape.'
  };
  
  return styles[sign] || 'Tu forma de expresar rabia es única y necesita ser reconocida.';
}

/**
 * Estilo sexual según Marte
 */
export function getMarsSexualStyle(sign: string): string {
  const styles: Record<string, string> = {
    'Aries': '**Directo, rápido, intenso**. Eres el iniciador/a. Te gusta la conquista, la espontaneidad, la pasión física directa. Prefieres sexo enérgico y sin muchos preliminares. Riesgo: ir demasiado rápido, no conectar emocionalmente.',
    'Taurus': '**Sensual, lento, placentero**. Valoras los cinco sentidos: tacto, aroma, sabor. Necesitas tiempo, comodidad, belleza. El sexo es arte sensorial. Riesgo: rutina, posesividad, priorizar placer sobre conexión.',
    'Gemini': '**Mental, versátil, juguetón**. Te excita la conversación, el ingenio, la variedad. Necesitas estimulación mental antes que física. Riesgo: dispersión, no conectar profundamente, sexo superficial.',
    'Cancer': '**Emocional, protector, íntimo**. Necesitas seguridad emocional para abrirte sexualmente. El sexo es fusión emocional. Valoras la ternura. Riesgo: dependencia emocional, dificultad para separar sexo de amor.',
    'Leo': '**Dramático, generoso, performativo**. El sexo es teatro: quieres ser admirado/a, dar placer generosamente. Necesitas romance y pasión. Riesgo: ego, necesitar validación constante, hacer el sexo sobre ti.',
    'Virgo': '**Técnico, atento, servicial**. Quieres hacerlo "bien". Eres detallista, quieres satisfacer al otro. Riesgo: sobrepensar, no relajarte, crítica interna excesiva, inhibición.',
    'Libra': '**Romántico, estético, equilibrado**. El sexo debe ser bello, armonioso. Valoras el placer mutuo, la seducción elegante. Riesgo: evitar lo "sucio", no expresar deseos reales, complacer en exceso.',
    'Scorpio': '**Intenso, transformador, total**. El sexo es fusión psicológica-física completa. Necesitas profundidad, tabúes, control/entrega. Riesgo: obsesión, celos, no separar sexo de poder.',
    'Sagittarius': '**Libre, aventurero, espontáneo**. Te gusta la exploración, nuevas experiencias, risas. El sexo es juego y aventura. Riesgo: compromiso-fobia, sexualizar sin conectar, exceso de franqueza.',
    'Capricorn': '**Controlado, ambicioso, duradero**. El sexo mejora con el tiempo. Eres resistente, disciplinado/a. Riesgo: demasiado serio/a, inhibición, usar sexo como estatus o control.',
    'Aquarius': '**Experimental, mental, desapegado**. Te interesan las ideas sexuales, lo no convencional. Necesitas libertad. Riesgo: desconexión emocional, intelectualizar el sexo, frialdad.',
    'Pisces': '**Místico, entregado, fusional**. El sexo es conexión espiritual. Te entregas totalmente, valoras la fantasía. Riesgo: límites difusos, confusión, idealización, escapismo.'
  };
  
  return styles[sign] || 'Tu sexualidad marciana es única y merece ser honrada.';
}

/**
 * Actividades que energizan según Marte
 */
export function getMarsEnergizingActivities(sign: string): string[] {
  const activities: Record<string, string[]> = {
    'Aries': [
      'Deportes competitivos (artes marciales, running, crossfit)',
      'Actividades de riesgo o adrenalina',
      'Liderar proyectos o iniciar cosas nuevas',
      'Cualquier actividad física intensa y rápida'
    ],
    'Taurus': [
      'Jardinería, cocinar, trabajar con las manos',
      'Caminatas en naturaleza, senderismo lento',
      'Masajes, yoga, ejercicio sensorial',
      'Construir o crear algo tangible y duradero'
    ],
    'Gemini': [
      'Deportes que requieren coordinación (tenis, ping-pong)',
      'Debates, juegos mentales, aprender habilidades nuevas',
      'Actividades sociales variadas',
      'Escribir, comunicarte, enseñar'
    ],
    'Cancer': [
      'Natación, deportes acuáticos',
      'Cocinar para otros, cuidar de alguien/algo',
      'Actividades en familia o grupo cercano',
      'Decorar, crear espacios de refugio'
    ],
    'Leo': [
      'Teatro, danza, performance, cualquier escenario',
      'Deportes donde brilles (golf, atletismo)',
      'Crear arte, proyectos creativos',
      'Organizar eventos, liderar con carisma'
    ],
    'Virgo': [
      'Yoga, pilates, ejercicio preciso',
      'Organizar, limpiar, optimizar sistemas',
      'Voluntariado, servir de forma útil',
      'Aprender técnicas que perfeccionen habilidades'
    ],
    'Libra': [
      'Danza, deportes estéticos (patinaje, gimnasia)',
      'Actividades sociales, networking',
      'Arte colaborativo, mediación',
      'Cualquier actividad que busque balance'
    ],
    'Scorpio': [
      'Deportes intensos (buceo, escalada, artes marciales)',
      'Investigación profunda, terapia',
      'Transformar situaciones o espacios',
      'Sexo consciente, prácticas de poder personal'
    ],
    'Sagittarius': [
      'Viajes, aventuras, exploración',
      'Deportes al aire libre (trekking, equitación)',
      'Estudiar filosofía, enseñar',
      'Cualquier actividad que expanda horizontes'
    ],
    'Capricorn': [
      'Montañismo, ejercicio estructurado (gym)',
      'Trabajo productivo con metas claras',
      'Construir carrera, alcanzar logros',
      'Cualquier actividad con disciplina y resultados medibles'
    ],
    'Aquarius': [
      'Deportes innovadores o grupales',
      'Activismo, causas sociales',
      'Tecnología, inventar, experimentar',
      'Cualquier actividad que rompa moldes'
    ],
    'Pisces': [
      'Natación, yoga, danza libre',
      'Meditación, arte, música',
      'Ayudar a otros, trabajo espiritual',
      'Cualquier actividad que conecte con lo invisible'
    ]
  };
  
  return activities[sign] || [
    'Actividades únicas que canalizan tu energía marciana',
    'Explora lo que te hace sentir vivo/a y poderoso/a'
  ];
}

/**
 * Explica cómo Júpiter expande la conciencia según signo
 */
export function getJupiterManifestationBySign(sign: string): string {
  const manifestations: Record<string, string> = {
    'Aries': 'Júpiter en Aries expande tu valentía y espíritu pionero. Crees en ti mismo y en tu capacidad de liderazgo. Tu optimismo es directo y entusiasta. Riesgo: impulsividad excesiva, arrogancia, iniciar demasiadas cosas sin terminarlas.',
    'Taurus': 'Júpiter en Tauro expande tu capacidad de disfrutar placeres materiales y belleza. Optimismo práctico y fe en la abundancia concreta. Riesgo: exceso de apego material, gula, acumulación sin sentido, pereza por exceso de comodidad.',
    'Gemini': 'Júpiter en Géminis expande tu curiosidad y comunicación. Crees en el conocimiento y las conexiones. Tu optimismo es mental y versátil. Riesgo: dispersión excesiva, superficialidad, hablar sin profundidad, relativismo moral.',
    'Cancer': 'Júpiter en Cáncer expande tu capacidad emocional y protectora (Júpiter en exaltación). Optimismo familiar y fe en el cuidado. Tu generosidad es nutritiva. Riesgo: sobreprotección, dependencia emocional, exceso de empatía que agota.',
    'Leo': 'Júpiter en Leo expande tu creatividad y autoexpresión. Crees en tu brillo personal y en la vida como celebración. Tu optimismo es dramático y generoso. Riesgo: ego inflado, narcisismo, necesidad excesiva de atención y reconocimiento.',
    'Virgo': 'Júpiter en Virgo expande tu capacidad de servicio y perfeccionamiento. Optimismo práctico aplicado a la mejora continua. Riesgo: exceso de crítica disfrazada de ayuda, perfeccionismo paralizante, servir hasta el agotamiento.',
    'Libra': 'Júpiter en Libra expande tu capacidad relacional y diplomática. Crees en la justicia y la armonía. Tu optimismo busca equilibrio. Riesgo: dependencia de parejas, evitar conflictos necesarios, justicia que se vuelve indecisión.',
    'Scorpio': 'Júpiter en Escorpio expande tu intensidad y poder transformador. Optimismo profundo sobre la regeneración. Fe en lo oculto y lo tabú. Riesgo: exceso de control, manipulación justificada, obsesión con poder, tocar fondos innecesarios.',
    'Sagittarius': 'Júpiter en Sagitario expande tu búsqueda de significado y aventura (Júpiter en domicilio). Optimismo natural y fe filosófica. Riesgo: exceso de idealismo, dogmatismo, escapismo constante, promesas que no cumples.',
    'Capricorn': 'Júpiter en Capricornio expande tu ambición y responsabilidad. Optimismo estructurado y fe en el esfuerzo sostenido. Riesgo: rigidez moral, pesimismo disfrazado de realismo, ambición que aplasta emociones.',
    'Aquarius': 'Júpiter en Acuario expande tu visión colectiva y reformadora. Optimismo sobre el futuro y la humanidad. Fe en la innovación. Riesgo: desapego emocional excesivo, idealismo frío, rebeldía sin causa clara.',
    'Pisces': 'Júpiter en Piscis expande tu compasión y espiritualidad (Júpiter en domicilio). Optimismo místico y fe en lo invisible. Riesgo: escapismo espiritual, victimización, confusión entre compasión y martirización, adicciones.'
  };
  return manifestations[sign] || 'Júpiter expande tu conciencia de forma única.';
}

/**
 * Áreas de suerte natural según Júpiter
 */
export function getJupiterLuckAreas(sign: string): string[] {
  const areas: Record<string, string[]> = {
    'Aries': [
      'Iniciativas audaces que otros temen intentar',
      'Deportes, competencias, liderazgo pionero',
      'Emprendimientos rápidos e innovadores',
      'Situaciones que requieren valentía instantánea'
    ],
    'Taurus': [
      'Negocios, inversiones, acumulación de riqueza',
      'Arte, belleza, diseño, gastronomía',
      'Bienes raíces, trabajo con la tierra',
      'Placeres sensoriales y estabilidad material'
    ],
    'Gemini': [
      'Comunicación, escritura, enseñanza',
      'Networking, conexiones múltiples',
      'Aprendizaje rápido de múltiples temas',
      'Comercio, ventas, medios de comunicación'
    ],
    'Cancer': [
      'Familia, hogar, bienes raíces residenciales',
      'Cuidado, nutrición, maternidad/paternidad',
      'Negocios familiares o de alimentación',
      'Conexión emocional, empatía natural'
    ],
    'Leo': [
      'Creatividad, artes, entretenimiento',
      'Liderazgo carismático, performance',
      'Niños, educación, juego',
      'Situaciones donde puedes brillar y ser reconocido'
    ],
    'Virgo': [
      'Salud, bienestar, medicina alternativa',
      'Organización, optimización de sistemas',
      'Servicio útil, trabajo detallado',
      'Análisis, investigación, perfeccionamiento'
    ],
    'Libra': [
      'Relaciones, matrimonio, asociaciones',
      'Justicia, mediación, diplomacia',
      'Arte, diseño, belleza relacional',
      'Situaciones que requieren equilibrio y fairness'
    ],
    'Scorpio': [
      'Investigación profunda, psicología, terapia',
      'Finanzas compartidas, herencias, inversiones',
      'Transformación, crisis como oportunidad',
      'Sexualidad, ocultismo, poder oculto'
    ],
    'Sagittarius': [
      'Viajes, extranjero, culturas lejanas',
      'Educación superior, filosofía, espiritualidad',
      'Aventuras, deportes de riesgo',
      'Enseñanza de sabiduría y expansión de conciencia'
    ],
    'Capricorn': [
      'Carrera, autoridad, logros profesionales',
      'Estructuras duraderas, legacy',
      'Gobierno, organizaciones grandes',
      'Éxito por disciplina y paciencia'
    ],
    'Aquarius': [
      'Tecnología, innovación, futurismo',
      'Grupos, comunidades, causas sociales',
      'Amistad, networking horizontal',
      'Reformas, revoluciones pacíficas'
    ],
    'Pisces': [
      'Espiritualidad, misticismo, arte visionario',
      'Compasión, servicio desinteresado',
      'Música, danza, poesía, sanación',
      'Conexión con lo invisible y trascendente'
    ]
  };
  
  return areas[sign] || [
    'Explora áreas que naturalmente expanden tu conciencia',
    'Tu suerte jupiteriana es única'
  ];
}

/**
 * Errores de exceso jupiteriano según signo
 */
export function getJupiterExcessWarnings(sign: string): string[] {
  const warnings: Record<string, string[]> = {
    'Aries': [
      'Impulsividad extrema: saltar sin red de seguridad',
      'Arrogancia y falta de humildad',
      'Iniciar 10 proyectos y no terminar ninguno',
      'Agresividad justificada como "autenticidad"'
    ],
    'Taurus': [
      'Gula y exceso de placeres (comida, lujo)',
      'Acumulación material sin sentido o propósito',
      'Pereza disfrazada de "disfrutar la vida"',
      'Apego tóxico a posesiones y comodidad'
    ],
    'Gemini': [
      'Dispersión mental: sabes de todo, maestro de nada',
      'Hablar sin parar sin profundizar nunca',
      'Relativismo moral extremo (todo es válido)',
      'Superficialidad justificada como "versatilidad"'
    ],
    'Cancer': [
      'Sobreprotección que asfixia a otros',
      'Dependencia emocional extrema',
      'Exceso de empatía que te agota completamente',
      'Infantilización de personas adultas'
    ],
    'Leo': [
      'Ego inflado y narcisismo desmedido',
      'Necesidad compulsiva de atención constante',
      'Generosidad para ser admirado (no genuina)',
      'Drama excesivo que agota a los demás'
    ],
    'Virgo': [
      'Crítica disfrazada de "ayuda constructiva"',
      'Perfeccionismo paralizante en todo',
      'Servir hasta el martirio y resentimiento',
      'Análisis excesivo que mata la espontaneidad'
    ],
    'Libra': [
      'Dependencia de pareja para sentirte completo',
      'Evitar todo conflicto hasta que explota',
      'Indecisión crónica paralizante',
      'Justicia obsesiva sin compasión'
    ],
    'Scorpio': [
      'Control obsesivo de todo y todos',
      'Manipulación justificada como "estrategia"',
      'Obsesión con poder que destruye relaciones',
      'Tocar fondos innecesariamente por drama'
    ],
    'Sagittarius': [
      'Escapismo constante (nunca estar presente)',
      'Dogmatismo filosófico o religioso',
      'Prometer demasiado y cumplir poco',
      'Idealismo que ignora realidades prácticas'
    ],
    'Capricorn': [
      'Ambición que aplasta todo (incluida tu humanidad)',
      'Rigidez moral extrema y juicio constante',
      'Pesimismo disfrazado de "realismo"',
      'Trabajar hasta la autodestrucción'
    ],
    'Aquarius': [
      'Desapego emocional extremo (parecer robot)',
      'Idealismo frío sin empatía real',
      'Rebeldía por rebeldía sin propósito',
      'Superioridad intelectual que aliena'
    ],
    'Pisces': [
      'Escapismo espiritual (evitar responsabilidades)',
      'Victimización crónica y martirización',
      'Adicciones justificadas como "sensibilidad"',
      'Confusión entre compasión y permitir abusos'
    ]
  };
  
  return warnings[sign] || [
    'Júpiter puede expandir tanto lo positivo como lo negativo',
    'Mantén consciencia de tus excesos'
  ];
}

/**
 * Explica cómo Saturno estructura y limita según signo
 */
export function getSaturnManifestationBySign(sign: string): string {
  const manifestations: Record<string, string> = {
    'Aries': 'Saturno en Aries limita tu espontaneidad y valentía (Saturno en caída). Miedo a actuar o a liderar. Aprendes disciplina en la acción tras mucha frustración. Necesitas autorizar tu propio impulso sin culpa.',
    'Taurus': 'Saturno en Tauro limita tu seguridad material y sensual. Miedo a la escasez o al placer. Aprendes disciplina en construir valor real y duradero. Necesitas confiar en tu capacidad de generar abundancia sostenible.',
    'Gemini': 'Saturno en Géminis limita tu comunicación y aprendizaje. Miedo a hablar o a no saber suficiente. Aprendes disciplina mental y comunicación precisa. Necesitas autorizar tu voz y tu curiosidad sin perfectionism.',
    'Cancer': 'Saturno en Cáncer limita tu expresión emocional y necesidad de cuidado (Saturno en detrimento). Frialdad emocional o miedo a necesitar. Aprendes a nutrir con límites sanos. Necesitas permitirte vulnerabilidad estructurada.',
    'Leo': 'Saturno en Leo limita tu autoexpresión y brillo personal (Saturno en detrimento). Miedo a brillar o a ser visto. Aprendes a crear con disciplina y humildad. Necesitas autorizar tu creatividad sin depender de validación externa.',
    'Virgo': 'Saturno en Virgo estructura tu perfeccionismo y servicio. Disciplina natural en el detalle y la eficiencia. Riesgo: exceso de crítica y rigidez. Aprendes que la imperfección es parte del proceso.',
    'Libra': 'Saturno en Libra estructura tus relaciones y sentido de justicia (Saturno en exaltación). Disciplina en compromiso y equilibrio. Aprendes a relacionarte con madurez. Riesgo: frialdad relacional, miedo a la intimidad.',
    'Scorpio': 'Saturno en Escorpio limita tu intensidad y control. Miedo al poder o a la pérdida de control. Aprendes disciplina en la transformación profunda. Necesitas soltar control y confiar en los ciclos de muerte-renacimiento.',
    'Sagittarius': 'Saturno en Sagitario limita tu expansión y optimismo. Miedo a creer o a explorar. Aprendes disciplina en la búsqueda de significado. Necesitas autorizar tu fe y tu filosofía personal sin dogmatismo.',
    'Capricorn': 'Saturno en Capricornio estructura tu ambición y responsabilidad (Saturno en domicilio). Disciplina natural y autoridad genuina. Riesgo: exceso de dureza contigo y con otros. Aprendes que el éxito incluye humanidad.',
    'Aquarius': 'Saturno en Acuario estructura tu rebeldía y visión colectiva (Saturno en domicilio). Disciplina en la innovación sostenible. Aprendes a reformar con estrategia. Riesgo: desapego emocional, frialdad ideológica.',
    'Pisces': 'Saturno en Piscis limita tu espiritualidad y compasión. Miedo a confiar en lo invisible. Aprendes disciplina espiritual sin escapismo. Necesitas estructurar tu compasión para que no te agote.'
  };
  return manifestations[sign] || 'Saturno te estructura de forma única.';
}

/**
 * Lecciones de madurez según Saturno
 */
export function getSaturnLifeLessons(sign: string): string {
  const lessons: Record<string, string> = {
    'Aries': '**Autorizar tu acción sin culpa**. Aprendes que actuar con decisión no es egoísmo. La lección es encontrar disciplina en tu impulso sin matarlo. Madurez = acción consciente sin impulsividad destructiva.',
    'Taurus': '**Confiar en tu capacidad de generar valor**. Aprendes que la seguridad viene de ti, no de lo externo. La lección es construir abundancia sostenible sin apego tóxico. Madurez = valorarte sin depender de posesiones.',
    'Gemini': '**Autorizar tu voz y tu mente**. Aprendes que tu curiosidad es válida. La lección es comunicar con precisión sin miedo a no saber todo. Madurez = hablar con autoridad ganada, no prestada.',
    'Cancer': '**Vulnerabilidad con límites sanos**. Aprendes que necesitar no es debilidad. La lección es nutrir sin sacrificarte. Madurez = cuidar desde la fortaleza, no desde el vacío que busca llenar.',
    'Leo': '**Brillar con humildad genuina**. Aprendes que tu creatividad no necesita validación externa. La lección es crear por el amor al arte, no por el aplauso. Madurez = autoridad creativa sin ego.',
    'Virgo': '**Aceptar la imperfección como parte del proceso**. Aprendes que el perfeccionismo paraliza. La lección es servir sin resentimiento. Madurez = excelencia sin crítica destructiva.',
    'Libra': '**Relacionarte desde la plenitud, no desde la necesidad**. Aprendes que el compromiso sano incluye límites. La lección es ser justo sin evitar conflictos necesarios. Madurez = relaciones maduras y equitativas.',
    'Scorpio': '**Soltar control y confiar en los ciclos**. Aprendes que el poder real es interno. La lección es transformarte sin manipular. Madurez = muerte-renacimiento consciente sin venganza.',
    'Sagittarius': '**Fe estructurada sin dogmatismo**. Aprendes que la libertad incluye responsabilidad. La lección es expandirte con raíces. Madurez = sabiduría ganada, no idealismo ingenuo.',
    'Capricorn': '**Éxito que incluye humanidad**. Aprendes que la ambición sin emociones es vacía. La lección es liderar con compasión. Madurez = autoridad genuina sin dureza innecesaria.',
    'Aquarius': '**Reformar con estrategia y empatía**. Aprendes que la innovación sostenible requiere estructura. La lección es ser visionario sin desapego frío. Madurez = revolucionar con humanidad.',
    'Pisces': '**Compasión con límites claros**. Aprendes que ayudar sin estructura te agota. La lección es espiritualidad disciplinada. Madurez = servir sin martirización, confiar sin escapismo.'
  };
  
  return lessons[sign] || 'Saturno te enseña a madurar de forma única.';
}

/**
 * Miedos saturnianos a trabajar según signo
 */
export function getSaturnFears(sign: string): string[] {
  const fears: Record<string, string[]> = {
    'Aries': [
      'Miedo a actuar (parálisis por sobrepensar)',
      'Miedo a liderar (no sentirte suficiente)',
      'Miedo al conflicto o la confrontación',
      'Miedo a ser egoísta si priorizas tus necesidades'
    ],
    'Taurus': [
      'Miedo a la escasez material extrema',
      'Miedo al cambio (apego a lo conocido)',
      'Miedo a perder seguridad o comodidad',
      'Miedo al placer (culpa por disfrutar)'
    ],
    'Gemini': [
      'Miedo a hablar o expresar ideas',
      'Miedo a no saber suficiente',
      'Miedo a ser juzgado por tu curiosidad',
      'Miedo a comprometerte con una sola cosa'
    ],
    'Cancer': [
      'Miedo a necesitar (parecer débil)',
      'Miedo al abandono emocional',
      'Miedo a no ser suficientemente nutritivo',
      'Miedo a la vulnerabilidad genuina'
    ],
    'Leo': [
      'Miedo a brillar (ser juzgado o envidiado)',
      'Miedo a no ser especial o reconocido',
      'Miedo al ridículo público',
      'Miedo a no ser amado si no impresionas'
    ],
    'Virgo': [
      'Miedo a no ser perfecto o útil',
      'Miedo al caos o la falta de control',
      'Miedo a ser criticado o juzgado',
      'Miedo a ser una carga para otros'
    ],
    'Libra': [
      'Miedo a la soledad o estar sin pareja',
      'Miedo al conflicto y al rechazo',
      'Miedo a tomar decisiones incorrectas',
      'Miedo a la injusticia dirigida hacia ti'
    ],
    'Scorpio': [
      'Miedo a perder control de tu vida',
      'Miedo a la traición o la vulnerabilidad',
      'Miedo a no tener poder o influencia',
      'Miedo a la transformación (morir internamente)'
    ],
    'Sagittarius': [
      'Miedo a la limitación o al encierro',
      'Miedo a perder la fe o el significado',
      'Miedo al compromiso duradero',
      'Miedo a que la vida sea aburrida o sin sentido'
    ],
    'Capricorn': [
      'Miedo al fracaso profesional o social',
      'Miedo a la irresponsabilidad (tuya o ajena)',
      'Miedo a no ser respetado o tomado en serio',
      'Miedo a la vulnerabilidad emocional'
    ],
    'Aquarius': [
      'Miedo a perder tu libertad o individualidad',
      'Miedo a la dependencia emocional',
      'Miedo a ser "normal" o convencional',
      'Miedo a la intimidad profunda'
    ],
    'Pisces': [
      'Miedo a la realidad dura sin escapes',
      'Miedo a poner límites (parecer cruel)',
      'Miedo a perder la conexión espiritual',
      'Miedo a la responsabilidad material'
    ]
  };
  
  return fears[sign] || [
    'Saturno te muestra tus miedos para que los enfrentes',
    'La madurez viene de trabajar conscientemente con ellos'
  ];
}

/**
 * Explica cómo Urano revoluciona según signo
 */
export function getUranusManifestationBySign(sign: string): string {
  const manifestations: Record<string, string> = {
    'Aries': 'Urano en Aries revoluciona la acción y el liderazgo. Innovador en iniciativas, pionero tecnológico. Cambios súbitos en tu identidad y forma de actuar. Aprendes a liderar el cambio sin impulsividad destructiva.',
    'Taurus': 'Urano en Tauro revoluciona lo material y lo sensual. Innovación en finanzas, tecnología aplicada a la tierra. Cambios drásticos en tu seguridad. Aprendes a soltar apegos y redefinir valor.',
    'Gemini': 'Urano en Géminis revoluciona la comunicación y el aprendizaje. Mente brillante e innovadora. Cambios súbitos en ideas y conexiones. Aprendes a comunicar verdades disruptivas sin dispersarte.',
    'Cancer': 'Urano en Cáncer revoluciona la familia y las emociones. Estructuras familiares no convencionales. Cambios drásticos en tu hogar. Aprendes a nutrir con libertad y sin ataduras emocionales.',
    'Leo': 'Urano en Leo revoluciona la creatividad y la autoexpresión. Artista innovador, líder rebelde. Cambios súbitos en tu identidad creativa. Aprendes a brillar sin ego y a crear desde la autenticidad radical.',
    'Virgo': 'Urano en Virgo revoluciona el servicio y la salud. Innovación en métodos, salud alternativa. Cambios drásticos en rutinas y trabajo. Aprendes a servir desde la libertad, no desde la obligación.',
    'Libra': 'Urano en Libra revoluciona las relaciones y la justicia. Relaciones no convencionales, nuevas formas de asociación. Cambios súbitos en parejas. Aprendes a relacionarte con libertad total.',
    'Scorpio': 'Urano en Escorpio revoluciona el poder y la sexualidad. Transformación radical, sexualidad liberada. Cambios drásticos en tu poder personal. Aprendes a renacer completamente y soltar control.',
    'Sagittarius': 'Urano en Sagitario revoluciona filosofías y creencias. Visión futurista, espiritualidad innovadora. Cambios súbitos en tu fe. Aprendes a creer en lo imposible y expandirte sin dogmas.',
    'Capricorn': 'Urano en Capricornio revoluciona estructuras y autoridad. Destrucción de sistemas obsoletos. Cambios drásticos en tu carrera. Aprendes a construir nuevas formas de poder sin rigidez.',
    'Aquarius': 'Urano en Acuario revoluciona la colectividad y la tecnología (Urano en domicilio). Genio innovador, visionario social. Cambios radicales en tu tribu. Aprendes a ser el futuro sin desapegarte de la humanidad.',
    'Pisces': 'Urano en Piscis revoluciona la espiritualidad y la compasión. Misticismo futurista, arte visionario. Cambios súbitos en tu fe. Aprendes a disolver fronteras y conectar con lo cósmico sin perderte.'
  };
  return manifestations[sign] || 'Urano te revoluciona de forma única.';
}

/**
 * Áreas de ruptura y liberación según Urano
 */
export function getUranusBreakthroughAreas(sign: string): string[] {
  const areas: Record<string, string[]> = {
    'Aries': [
      'Revolucionar tu identidad y forma de actuar',
      'Liberar tu valentía de condicionamientos',
      'Innovar en liderazgo y emprendimiento',
      'Romper con roles tradicionales de género'
    ],
    'Taurus': [
      'Revolucionar tu relación con el dinero',
      'Liberar apegos materiales tóxicos',
      'Innovar en finanzas o tecnología de la tierra',
      'Romper con seguridad que limita crecimiento'
    ],
    'Gemini': [
      'Revolucionar tu forma de pensar y comunicar',
      'Liberar tu mente de dogmas y límites',
      'Innovar en medios, redes o educación',
      'Romper con formas convencionales de aprender'
    ],
    'Cancer': [
      'Revolucionar tus estructuras familiares',
      'Liberar patrones emocionales heredados',
      'Innovar en hogar y conceptos de familia',
      'Romper con dependencias emocionales'
    ],
    'Leo': [
      'Revolucionar tu expresión creativa',
      'Liberar tu brillo de necesidad de aprobación',
      'Innovar en arte, performance o liderazgo',
      'Romper con ego y crear desde autenticidad'
    ],
    'Virgo': [
      'Revolucionar tu trabajo y servicio',
      'Liberar perfeccionismo paralizante',
      'Innovar en salud, tecnología o sistemas',
      'Romper con rutinas que no te sirven'
    ],
    'Libra': [
      'Revolucionar tus relaciones y asociaciones',
      'Liberar dependencia de pareja',
      'Innovar en justicia, arte o diplomacia',
      'Romper con necesidad de agradar'
    ],
    'Scorpio': [
      'Revolucionar tu relación con el poder',
      'Liberar control obsesivo',
      'Innovar en psicología, sexualidad o finanzas',
      'Romper con miedos profundos y traumas'
    ],
    'Sagittarius': [
      'Revolucionar tus creencias y filosofías',
      'Liberar dogmas religiosos o ideológicos',
      'Innovar en educación, viajes o espiritualidad',
      'Romper con limitaciones geográficas o mentales'
    ],
    'Capricorn': [
      'Revolucionar estructuras de autoridad',
      'Liberar rigidez y control excesivo',
      'Innovar en carrera, gobierno o sistemas',
      'Romper con ambición que aplasta humanidad'
    ],
    'Aquarius': [
      'Revolucionar tu visión colectiva',
      'Liberar desapego emocional extremo',
      'Innovar en tecnología o causas sociales',
      'Romper con rebeldía sin propósito'
    ],
    'Pisces': [
      'Revolucionar tu espiritualidad',
      'Liberar escapismo y victimización',
      'Innovar en arte místico o sanación',
      'Romper con confusión y encontrar claridad espiritual'
    ]
  };
  
  return areas[sign] || [
    'Urano te llama a revolucionar áreas específicas de tu vida',
    'La liberación es el camino'
  ];
}

/**
 * Explica cómo Neptuno disuelve fronteras según signo
 */
export function getNeptuneManifestationBySign(sign: string): string {
  const manifestations: Record<string, string> = {
    'Aries': 'Neptuno en Aries disuelve el ego y la acción. Guerrero espiritual, líder místico. Confusión en tu identidad o idealismo excesivo. Aprendes a actuar desde la rendición sin perder tu fuego.',
    'Taurus': 'Neptuno en Tauro disuelve la seguridad material. Confusión sobre qué es realmente valioso. Idealismo sobre abundancia o pérdidas por ilusión. Aprendes que la verdadera riqueza es espiritual.',
    'Gemini': 'Neptuno en Géminis disuelve la lógica y la comunicación. Mente poética, canal creativo. Confusión mental o mentiras que crees verdad. Aprendes a comunicar lo invisible con claridad.',
    'Cancer': 'Neptuno en Cáncer disuelve fronteras emocionales. Empatía profunda, médium natural. Confusión sobre tus emociones vs las de otros. Aprendes a nutrir desde la compasión sin absorber dolor ajeno.',
    'Leo': 'Neptuno en Leo disuelve el ego creativo. Artista inspirado, performer místico. Confusión sobre tu identidad o ego inflado espiritualmente. Aprendes a crear desde el canal divino sin apego personal.',
    'Virgo': 'Neptuno en Virgo disuelve el perfeccionismo y el servicio. Sanador holístico, servidor compasivo. Confusión en tu trabajo o servir hasta la victimización. Aprendes que el servicio real incluye límites.',
    'Libra': 'Neptuno en Libra disuelve fronteras relacionales. Amor incondicional, artista relacional. Confusión sobre quién eres en relaciones o idealización de parejas. Aprendes a amar sin perderte.',
    'Scorpio': 'Neptuno en Escorpio disuelve el control y el poder. Místico profundo, sanador de sombras. Confusión sobre tu poder o manipulación sutil. Aprendes a rendirte al misterio y confiar en la muerte-renacimiento.',
    'Sagittarius': 'Neptuno en Sagitario disuelve creencias y filosofías. Buscador espiritual, maestro místico. Confusión sobre qué creer o idealismo filosófico. Aprendes que la verdad última está más allá de toda creencia.',
    'Capricorn': 'Neptuno en Capricornio disuelve estructuras y autoridad. Líder compasivo, CEO espiritual. Confusión sobre tu rol público o desilusión con sistemas. Aprendes a construir desde la inspiración divina.',
    'Aquarius': 'Neptuno en Acuario disuelve fronteras colectivas. Visionario humanitario, canal de futuro. Confusión sobre tu misión o idealismo utópico. Aprendes que la verdadera revolución es amor universal.',
    'Pisces': 'Neptuno en Piscis disuelve todo límite (Neptuno en domicilio). Místico puro, artista visionario. Confusión total o riesgo de adicciones y escapismo. Aprendes a estar en el mundo sin ser del mundo.'
  };
  return manifestations[sign] || 'Neptuno te disuelve de forma única.';
}

/**
 * Dones espirituales según Neptuno
 */
export function getNeptuneSpiritualGifts(sign: string): string[] {
  const gifts: Record<string, string[]> = {
    'Aries': [
      'Guerrero espiritual: actuar desde la rendición',
      'Liderazgo inspirado divinamente',
      'Valentía mística sin ego',
      'Canalizar acción desde la gracia'
    ],
    'Taurus': [
      'Abundancia espiritual manifestada',
      'Sensualidad sagrada y belleza divina',
      'Crear valor desde la inspiración',
      'Encarnar lo celestial en lo material'
    ],
    'Gemini': [
      'Comunicar lo invisible con palabras',
      'Poeta, canal literario divino',
      'Mente que conecta cielo y tierra',
      'Traducir misterios a lenguaje humano'
    ],
    'Cancer': [
      'Empatía profunda y sanación emocional',
      'Médium natural, intuición extrema',
      'Nutrir desde la compasión infinita',
      'Crear hogar sagrado para todos'
    ],
    'Leo': [
      'Artista inspirado divinamente',
      'Performance como ritual sagrado',
      'Creatividad sin apego personal',
      'Brillar siendo canal de lo divino'
    ],
    'Virgo': [
      'Sanación holística y medicina sagrada',
      'Servicio como acto de devoción',
      'Perfección sin crítica (solo amor)',
      'Trabajar con propósito espiritual'
    ],
    'Libra': [
      'Amor incondicional en relaciones',
      'Arte como oración visual',
      'Diplomacia inspirada por paz divina',
      'Belleza que refleja lo celestial'
    ],
    'Scorpio': [
      'Místico de las sombras profundas',
      'Alquimista: transformar dolor en oro',
      'Poder espiritual sin manipulación',
      'Morir y renacer conscientemente'
    ],
    'Sagittarius': [
      'Maestro espiritual y filósofo místico',
      'Fe que trasciende todas las religiones',
      'Viajar entre mundos y dimensiones',
      'Enseñar sabiduría canalizada'
    ],
    'Capricorn': [
      'Construir templos en el mundo material',
      'Liderazgo compasivo y autoridad espiritual',
      'Manifestar visiones divinas en estructuras',
      'CEO espiritual que sirve al todo'
    ],
    'Aquarius': [
      'Visionar el futuro espiritual de la humanidad',
      'Canal de tecnología sagrada',
      'Amor universal sin fronteras',
      'Revolucionar desde la consciencia crística'
    ],
    'Pisces': [
      'Místico puro: disolver en lo divino',
      'Artista visionario de otros reinos',
      'Compasión infinita y sanación universal',
      'Ser puente entre cielo y tierra'
    ]
  };
  
  return gifts[sign] || [
    'Neptuno te otorga dones espirituales únicos',
    'Cultívalos con práctica y discernimiento'
  ];
}

/**
 * Riesgos de ilusión neptuniana según signo
 */
export function getNeptuneIllusionRisks(sign: string): string[] {
  const risks: Record<string, string[]> = {
    'Aries': [
      'Idealizar tu valentía (creerte invencible)',
      'Confusión sobre tu identidad real',
      'Martirización guerrera (sacrificio sin sentido)',
      'Adicción a la adrenalina espiritual'
    ],
    'Taurus': [
      'Ilusión sobre abundancia (comprar sin tener)',
      'Adicciones materiales (comida, lujo, compras)',
      'Confusión sobre tu valor real',
      'Idealizar seguridad que no existe'
    ],
    'Gemini': [
      'Mentiras que crees como verdad',
      'Confusión mental crónica',
      'Dispersión espiritual (probar todo, dominar nada)',
      'Comunicar desde ilusión, no desde verdad'
    ],
    'Cancer': [
      'Absorber emociones ajenas hasta enfermarte',
      'Víctima emocional crónica',
      'Confusión: ¿qué siento yo vs los demás?',
      'Idealizar familia o personas nutritivas'
    ],
    'Leo': [
      'Ego espiritual ("soy especial elegido")',
      'Confusión sobre tu grandeza real',
      'Adicción a ser admirado como gurú',
      'Performance sin sustancia espiritual'
    ],
    'Virgo': [
      'Servir hasta la victimización y agotamiento',
      'Confusión sobre límites de tu servicio',
      'Adicción a ser "el sanador perfecto"',
      'Hipocondría o enfermedades psicosomáticas'
    ],
    'Libra': [
      'Idealizar parejas (ver ángeles donde hay humanos)',
      'Perderte completamente en relaciones',
      'Confusión sobre quién eres sin el otro',
      'Adicción a estar enamorado (no a la persona)'
    ],
    'Scorpio': [
      'Manipulación sutil disfrazada de espiritualidad',
      'Confusión entre poder espiritual y control',
      'Adicciones profundas (sexo, drogas, drama)',
      'Tocar fondos innecesarios "para transformarte"'
    ],
    'Sagittarius': [
      'Dogmatismo espiritual ("mi verdad es LA verdad")',
      'Escapismo constante (nunca estar presente)',
      'Confusión entre fe y negación de realidad',
      'Adicción a experiencias místicas sin integrar'
    ],
    'Capricorn': [
      'Desilusión total con sistemas (cinismo)',
      'Confusión sobre tu autoridad real',
      'Adicción al trabajo "espiritual"',
      'Idealizar logros sin disfrutar el camino'
    ],
    'Aquarius': [
      'Idealismo utópico sin acción real',
      'Confusión: ¿estoy desapegado o huyendo?',
      'Adicción a ser "diferente" o especial',
      'Rebeldía espiritual sin discernimiento'
    ],
    'Pisces': [
      'Escapismo total de la realidad',
      'Adicciones severas de todo tipo',
      'Confusión completa (no saber qué es real)',
      'Victimización extrema y martirización'
    ]
  };
  
  return risks[sign] || [
    'Neptuno puede confundir tanto como iluminar',
    'Mantén discernimiento y pies en la tierra'
  ];
}

/**
 * Explica cómo Plutón transforma según signo
 */
export function getPlutoManifestationBySign(sign: string): string {
  const manifestations: Record<string, string> = {
    'Aries': 'Plutón en Aries transforma la identidad y el liderazgo. Guerrero alquímico, líder que renace de sus cenizas. Poder personal intenso. Aprendes a morir y renacer en cada acción sin miedo.',
    'Taurus': 'Plutón en Tauro transforma lo material y lo sensual. Alquimia de recursos, poder económico. Pérdidas que enseñan desapego. Aprendes que el verdadero poder es interno, no externo.',
    'Gemini': 'Plutón en Géminis transforma la mente y la comunicación. Investigador profundo, comunicador de verdades ocultas. Obsesión mental. Aprendes a usar tu mente para transformar, no para controlar.',
    'Cancer': 'Plutón en Cáncer transforma la familia y las emociones. Sanador de linajes, guardián de secretos familiares. Intensidad emocional extrema. Aprendes a sanar tu árbol genealógico y liberar patrones.',
    'Leo': 'Plutón en Leo transforma la creatividad y el ego. Creador transformador, líder de masas. Poder creativo intenso o ego oscuro. Aprendes a crear desde el poder sin aplastar a otros.',
    'Virgo': 'Plutón en Virgo transforma el servicio y la salud. Sanador de lo invisible, obsesión con pureza. Crisis de salud transformadoras. Aprendes que el verdadero servicio es empoderar, no controlar.',
    'Libra': 'Plutón en Libra transforma las relaciones y la justicia. Relaciones intensas que te transforman. Poder relacional. Aprendes que el amor real incluye muerte y renacimiento mutuo.',
    'Scorpio': 'Plutón en Escorpio transforma el poder y la sexualidad (Plutón en domicilio). Brujo natural, sanador de sombras. Intensidad máxima. Aprendes a morir completamente y renacer desde el poder divino.',
    'Sagittarius': 'Plutón en Sagitario transforma creencias y filosofías. Buscador obsesivo de verdad, filósofo transformador. Crisis de fe. Aprendes que la verdad última destruye todas las mentiras cómodas.',
    'Capricorn': 'Plutón en Capricornio transforma estructuras y autoridad. Destructor de sistemas, constructor de nuevos paradigmas. Poder público intenso. Aprendes que el verdadero poder es servir la evolución colectiva.',
    'Aquarius': 'Plutón en Acuario transforma la colectividad y la tecnología. Revolucionario profundo, agente de cambio radical. Poder de transformar masas. Aprendes que la revolución real es muerte del viejo mundo.',
    'Pisces': 'Plutón en Piscis transforma la espiritualidad y la compasión. Místico oscuro, sanador de lo invisible. Poder espiritual intenso. Aprendes que la verdadera rendición es muerte del ego separado.'
  };
  return manifestations[sign] || 'Plutón te transforma de forma única.';
}

/**
 * Poder personal y transformación según Plutón
 */
export function getPlutoPowerAreas(sign: string): string[] {
  const areas: Record<string, string[]> = {
    'Aries': [
      'Poder de iniciar cambios radicales',
      'Transformar tu identidad completamente',
      'Liderazgo que regenera sistemas',
      'Fuerza para enfrentar miedos directamente'
    ],
    'Taurus': [
      'Poder de crear valor duradero',
      'Transformar recursos y finanzas',
      'Alquimia material: hacer oro de nada',
      'Fuerza para soltar apegos y renacer'
    ],
    'Gemini': [
      'Poder de comunicar verdades ocultas',
      'Transformar ideas en movimientos',
      'Investigación profunda que revela secretos',
      'Fuerza mental para penetrar misterios'
    ],
    'Cancer': [
      'Poder emocional profundo',
      'Transformar dolor familiar en sanación',
      'Nutrir regeneración en otros',
      'Fuerza para proteger lo vulnerable'
    ],
    'Leo': [
      'Poder creativo transformador',
      'Transformar ego en servicio',
      'Liderazgo que regenera comunidades',
      'Fuerza para brillar desde la sombra integrada'
    ],
    'Virgo': [
      'Poder de sanación profunda',
      'Transformar crisis en oportunidades',
      'Perfeccionar sistemas con intensidad',
      'Fuerza para servir sin victimización'
    ],
    'Libra': [
      'Poder relacional transformador',
      'Transformar dinámicas de poder en parejas',
      'Justicia implacable pero compasiva',
      'Fuerza para equilibrar sin evitar sombras'
    ],
    'Scorpio': [
      'Poder total de muerte-renacimiento',
      'Transformar todo lo que tocas',
      'Alquimista maestro de sombras',
      'Fuerza para enfrentar lo tabú'
    ],
    'Sagittarius': [
      'Poder de expandir consciencia colectiva',
      'Transformar creencias limitantes',
      'Enseñar verdades que liberan',
      'Fuerza para explorar lo desconocido'
    ],
    'Capricorn': [
      'Poder de destruir y construir imperios',
      'Transformar estructuras obsoletas',
      'Autoridad regenerativa',
      'Fuerza para liderar cambios sistémicos'
    ],
    'Aquarius': [
      'Poder de revolucionar masas',
      'Transformar paradigmas colectivos',
      'Tecnología que regenera sociedad',
      'Fuerza para romper cadenas invisibles'
    ],
    'Pisces': [
      'Poder de sanación universal',
      'Transformar sufrimiento en compasión',
      'Disolver ego completamente',
      'Fuerza para rendirse y renacer espiritualmente'
    ]
  };
  
  return areas[sign] || [
    'Plutón te otorga poder transformador único',
    'Úsalo con consciencia y responsabilidad'
  ];
}

// ============================================
// EJES ARQUETÍPICOS - ANÁLISIS INTEGRADO
// ============================================

import type { AspectType, AxisCategory } from '../services/exercises/chartAnalyzer';

/**
 * Explica la importancia de un eje de forma contextual
 */
export function getAxisImportance(
  theme: string,
  aspectType: AspectType,
  houses: [number, number]
): string[] {
  // Base según tema del eje
  const baseImportance: Record<string, string[]> = {
    'Autoridad': [
      'Integra tu identidad personal (Sol) con estructura y límites (Saturno)',
      'Define criterios de responsabilidad sin caer en autoexigencia destructiva'
    ],
    'Seguridad Emocional': [
      'Equilibra necesidades emocionales (Luna) con disciplina y madurez (Saturno)',
      'Construye seguridad interna sin depender de validación externa'
    ],
    'Sensibilidad': [
      'Regula tu sensibilidad emocional (Luna) y límites energéticos (Neptuno)',
      'Evita la fuga emocional o disolución en contextos demandantes'
    ],
    'Intensidad Emocional': [
      'Gestiona emociones intensas (Luna-Plutón) sin reprimir ni explotar',
      'Transforma patrones emocionales profundos heredados de tu linaje'
    ],
    'Poder Personal': [
      'Integra tu identidad consciente (Sol) con tu poder transformador (Plutón)',
      'Evita la oscilación entre ego inflado y sensación de impotencia'
    ],
    'Acción y Poder': [
      'Canaliza tu energía de acción (Marte) con poder transformador (Plutón)',
      'Evita la frustración crónica o la agresividad descontrolada'
    ],
    'Amor y Límites': [
      'Equilibra tu capacidad de amar (Venus) con límites realistas (Saturno)',
      'Aprende a recibir amor sin sentirte indigno/a o bloqueado/a'
    ],
    'Comunicación Herida': [
      'Sana tu forma de comunicar (Mercurio) integrando tu herida (Quirón)',
      'Tu forma de pensar y hablar puede convertirse en tu mayor don sanador'
    ],
    'Acción Contenida': [
      'Integra tu impulso de acción (Marte) con disciplina y timing (Saturno)',
      'Aprende a actuar con estrategia sin caer en frustración o pasividad'
    ],
    'Relaciones y Abundancia': [
      'Expande tu capacidad de amar (Venus) y recibir abundancia (Júpiter)',
      'Disfruta relaciones generosas sin caer en exceso o idealización'
    ],
    'Confianza': [
      'Desarrolla confianza en ti mismo/a (Sol) con optimismo realista (Júpiter)',
      'Evita el ego inflado o la falta de fe en tus capacidades'
    ],
    'Pensamiento Expansivo': [
      'Amplía tu forma de pensar (Mercurio) con visión filosófica (Júpiter)',
      'Conecta ideas prácticas con significado más amplio'
    ]
  };

  const base = baseImportance[theme] || [
    'Este eje integra dos fuerzas arquetípicas en tu psique',
    'Trabajarlo conscientemente transforma tu vida cotidiana'
  ];

  // Modificador según tipo de aspecto
  let aspectMod = '';
  if (aspectType === 'opposition') {
    aspectMod = 'Tensión entre dos polos opuestos que piden integración consciente. El desafío es no identificarte con un extremo y proyectar el otro.';
  } else if (aspectType === 'square') {
    aspectMod = 'Fricción interna que genera crecimiento a través del conflicto. El desafío es usar la tensión como motor, no como bloqueo.';
  } else if (aspectType === 'conjunction') {
    aspectMod = 'Fusión de energías que pueden potenciarse o interferirse. El desafío es integrarlas sin que una anule a la otra.';
  } else if (aspectType === 'trine') {
    aspectMod = 'Flujo natural que facilita la integración pero puede volverse pasivo. El desafío es activar conscientemente este don.';
  } else {
    aspectMod = 'Oportunidad de conexión que requiere intención consciente para activarse.';
  }

  // Modificador según casas
  const angular = [1, 4, 7, 10];
  const sensitive = [8, 12];
  let houseMod = '';
  
  if (houses.some(h => angular.includes(h))) {
    houseMod = 'Este eje se manifiesta en áreas visibles y estructurantes de tu vida. Su impacto es directo y evidente en tu realidad cotidiana.';
  } else if (houses.some(h => sensitive.includes(h))) {
    houseMod = 'Este eje opera en áreas profundas e internas de tu psique. Su trabajo es menos visible externamente pero transformador a nivel del alma.';
  } else {
    houseMod = 'Este eje se manifiesta en tu día a día de forma sutil pero constante. Observarlo te da pistas sobre patrones recurrentes.';
  }

  return [...base, aspectMod, houseMod];
}

/**
 * Sugiere ejercicios prácticos según el eje y su categoría
 */
export function getAxisExercises(theme: string, category: AxisCategory): string[] {
  const exercises: Record<string, string[]> = {
    'Autoridad': [
      'Agenda 10 minutos diarios de planificación realista (máximo 3 tareas viables)',
      'Ejercicio "No-Sí": Di NO a una demanda menor y SÍ a una prioridad personal cada día',
      'Bitácora de logros semanales con evidencia observable (qué hiciste, no qué "deberías" hacer)'
    ],
    'Seguridad Emocional': [
      'Ritual de check-in emocional: 3 minutos al despertar identificando tu estado sin juzgarlo',
      'Ejercicio "Ancla": Identifica 3 recursos internos que nadie puede quitarte (habilidad, cualidad, memoria)',
      'Práctica de límites: Una vez por semana, di "no" a algo que drene tu energía emocional'
    ],
    'Sensibilidad': [
      'Respiración 4-7-8 por 3 ciclos ante sobrecarga emocional (inhala 4, retén 7, exhala 8)',
      'Higiene sensorial: 15 minutos sin pantallas antes de dormir + música o silencio',
      'Diario emocional: 3 etiquetas de emoción + 1 acción concreta de autocuidado'
    ],
    'Intensidad Emocional': [
      'Técnica de "contenedor emocional": Visualiza un lugar seguro donde depositar emociones intensas temporalmente',
      'Ejercicio de rastreo corporal: Identifica dónde sientes la emoción en tu cuerpo y respírala',
      'Ritual de liberación semanal: Escribe lo que necesitas soltar y quémalo o entiérralo simbólicamente'
    ],
    'Poder Personal': [
      'Afirmación diaria frente al espejo: "Tengo el poder de elegir mis respuestas"',
      'Ejercicio de decisiones menores: Toma 3 decisiones pequeñas al día sin consultar a nadie',
      'Registro de momentos de poder: Anota 1 situación semanal donde ejerciste tu poder con integridad'
    ],
    'Acción y Poder': [
      'Entrenamiento físico consciente: 20 minutos de ejercicio sintiendo tu fuerza (no por estética)',
      'Visualización de poder: 5 minutos imaginando tu energía fluyendo sin obstáculos',
      'Ritual de cierre: Al terminar el día, nombra una acción concreta que completaste'
    ],
    'Amor y Límites': [
      'Práctica de recepción: Acepta 1 cumplido sin minimizarlo o devolverlo inmediatamente',
      'Ejercicio de límites amorosos: Comunica 1 necesidad tuya en una relación sin disculparte',
      'Ritual de auto-amor: 10 minutos semanales haciendo algo que te dé placer sin "productividad"'
    ],
    'Comunicación Herida': [
      'Escritura terapéutica: 15 minutos de escritura libre sin censura sobre lo que "no puedes decir"',
      'Práctica de escucha profunda: Escucha a alguien 5 minutos sin interrumpir ni aconsejar',
      'Ejercicio de voz: Lee en voz alta un texto que te emocione, sintiendo tu voz resonar'
    ],
    'Acción Contenida': [
      'Planificación estratégica: Antes de actuar, pregúntate "¿Es el momento adecuado?"',
      'Ejercicio de pausa consciente: 3 respiraciones antes de responder en situaciones tensas',
      'Ritual de acción: Elige 1 meta semanal y da 1 paso concreto sin auto-sabotaje'
    ],
    'Relaciones y Abundancia': [
      'Diario de gratitud relacional: Anota 3 cosas que aprecias de alguien cercano',
      'Ejercicio de generosidad: Ofrece algo (tiempo, atención, regalo) sin esperar retorno',
      'Ritual de abundancia: Celebra 1 "ganancia" semanal (material, emocional, relacional)'
    ],
    'Confianza': [
      'Afirmación diaria: "Confío en mi proceso y en mi capacidad de aprender"',
      'Ejercicio de riesgo menor: Haz algo nuevo que te de un poco de miedo cada semana',
      'Registro de éxitos: Anota 3 cosas que lograste esta semana, por pequeñas que sean'
    ],
    'Pensamiento Expansivo': [
      'Lectura expansiva: Lee sobre un tema completamente fuera de tu área de confort',
      'Ejercicio de perspectiva: Mira un problema desde 3 ángulos distintos (lógico, emocional, filosófico)',
      'Ritual de conexión: Escribe cómo tus acciones cotidianas se conectan con un propósito mayor'
    ]
  };

  const baseExercises = exercises[theme] || [
    'Define un ritual breve de anclaje para este eje (5-10 minutos diarios)',
    'Realiza una acción observable relacionada al eje cada día',
    'Revisión semanal: ¿Qué patrón relacionado al eje observaste esta semana?'
  ];

  // Agregar nota según categoría
  const categoryNotes: Record<AxisCategory, string> = {
    core: '💎 Eje fundamental: Trabájalo de forma consistente, es estructurante para tu vida.',
    internal: '🌊 Eje interno: Requiere introspección honesta y paciencia con tu proceso.',
    challenge: '⚡ Eje de desafío: La fricción es el motor. No evites la tensión, úsala para crecer.',
    expansion: '✨ Eje de expansión: Disfruta el proceso. El crecimiento aquí puede ser más fluido.'
  };

  return [...baseExercises, '', categoryNotes[category]];
}

/**
 * Determina urgencia según score del eje
 */
export function getAxisUrgency(score: number): 'Alta' | 'Media' | 'Baja' {
  if (score >= 15) return 'Alta';
  if (score >= 10) return 'Media';
  return 'Baja';
}

/**
 * Descripción breve del eje para UI
 */
export function getAxisDescription(theme: string): string {
  const descriptions: Record<string, string> = {
    'Autoridad': 'Identidad y estructura — Quién eres vs. qué debes ser',
    'Seguridad Emocional': 'Emociones y límites — Sentir profundo con madurez',
    'Sensibilidad': 'Sentir y disolver — Regular tu porosidad emocional',
    'Intensidad Emocional': 'Profundidad transformadora — Emociones que mueven todo',
    'Poder Personal': 'Ser y transformar — Tu fuerza vital consciente',
    'Acción y Poder': 'Deseo y fuerza — Canalizar energía con propósito',
    'Amor y Límites': 'Afecto y realismo — Amar sin perder tus fronteras',
    'Comunicación Herida': 'Palabra sanadora — Tu voz como medicina',
    'Acción Contenida': 'Impulso y estrategia — Actuar en el momento justo',
    'Relaciones y Abundancia': 'Amor y generosidad — Expandir tu capacidad de dar y recibir',
    'Confianza': 'Fe en ti mismo/a — Creer en tu proceso de crecimiento',
    'Pensamiento Expansivo': 'Ideas y significado — Conectar lo cotidiano con lo trascendente'
  };
  return descriptions[theme] || 'Eje de integración personal';
}
