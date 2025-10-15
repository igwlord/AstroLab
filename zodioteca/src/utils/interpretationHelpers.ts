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
