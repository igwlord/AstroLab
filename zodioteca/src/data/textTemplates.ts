/**
 * 📚 PLANTILLAS TEXTUALES PARA REPORTES DIARIOS
 * 
 * Sistema modular de frases que se combinan aleatoriamente para generar
 * reportes variados del "clima astral" del día.
 * 
 * Cada categoría tiene múltiples frases para evitar repetición.
 */

// ===========================
// ☀️ SOL POR SIGNO
// ===========================
export const sunTemplates: Record<string, string[]> = {
  Aries: [
    "El Sol en Aries impulsa la acción con confianza y determinación",
    "La energía ariana enciende la chispa del comienzo y la valentía",
    "Hoy el Sol activa el fuego cardinal: iniciar es el verbo del día"
  ],
  Tauro: [
    "El Sol en Tauro busca estabilidad, placer y conexión con la materia",
    "La energía taurina invita a disfrutar con calma y concretar con paciencia",
    "Hoy el Sol ancla en lo tangible: construir desde la tierra"
  ],
  Géminis: [
    "El Sol en Géminis favorece la comunicación, el aprendizaje y la versatilidad",
    "La energía geminiana activa el intercambio de ideas y la curiosidad",
    "Hoy el Sol multiplica perspectivas: dialogar y conectar son la clave"
  ],
  Cáncer: [
    "El Sol en Cáncer profundiza las emociones y la conexión con el hogar",
    "La energía canceriana nutre, protege y crea espacios de intimidad",
    "Hoy el Sol activa la sensibilidad: cuidar y ser cuidado"
  ],
  Leo: [
    "El Sol en Leo irradia creatividad, calidez y presencia magnética",
    "La energía leonina invita a brillar con autenticidad y generosidad",
    "Hoy el Sol potencia la expresión: mostrar tu luz sin miedo"
  ],
  Virgo: [
    "El Sol en Virgo organiza, analiza y perfecciona los detalles",
    "La energía virginiana busca precisión, servicio y mejora continua",
    "Hoy el Sol afina procesos: discernir y optimizar"
  ],
  Libra: [
    "El Sol en Libra busca equilibrio, belleza y conexión armoniosa",
    "La energía librana invita al diálogo, la diplomacia y el arte",
    "Hoy el Sol favorece la justicia, las relaciones y la estética"
  ],
  Escorpio: [
    "El Sol en Escorpio transforma, profundiza y revela lo oculto",
    "La energía escorpiana invita a la introspección y la regeneración",
    "Hoy el Sol penetra las sombras: mirar dentro para renacer"
  ],
  Sagitario: [
    "El Sol en Sagitario expande horizontes y busca significado",
    "La energía sagitariana impulsa la aventura, la filosofía y la libertad",
    "Hoy el Sol enciende la visión: explorar mundos nuevos"
  ],
  Capricornio: [
    "El Sol en Capricornio construye con disciplina y propósito",
    "La energía capricorniana busca logros concretos y estructura sólida",
    "Hoy el Sol activa la ambición constructiva: escalar con responsabilidad"
  ],
  Acuario: [
    "El Sol en Acuario innova, libera y conecta con lo colectivo",
    "La energía acuariana rompe moldes y crea sistemas nuevos",
    "Hoy el Sol electrifica ideas: revolucionar con conciencia"
  ],
  Piscis: [
    "El Sol en Piscis disuelve fronteras y conecta con lo trascendente",
    "La energía pisciana fluye con compasión, arte e intuición",
    "Hoy el Sol invita a lo místico: sentir más allá de lo visible"
  ]
};

// ===========================
// 🌙 LUNA POR SIGNO
// ===========================
export const moonTemplates: Record<string, string[]> = {
  Aries: [
    "La Luna en Aries enciende el fuego interno y pide acción inmediata",
    "Las emociones fluyen con intensidad e impulso pionero",
    "Hoy el corazón quiere avanzar sin demora ni vacilación"
  ],
  Tauro: [
    "La Luna en Tauro calma, enraíza y busca placer sensorial",
    "Las emociones piden estabilidad, disfrute y conexión con el cuerpo",
    "Hoy el corazón necesita seguridad y belleza tangible"
  ],
  Géminis: [
    "La Luna en Géminis activa la curiosidad emocional y la comunicación",
    "Las emociones buscan variedad, aprendizaje y ligereza",
    "Hoy el corazón quiere conversar, aprender y moverse"
  ],
  Cáncer: [
    "La Luna en Cáncer profundiza la sensibilidad y el instinto de protección",
    "Las emociones fluyen con fuerza materna y necesidad de hogar",
    "Hoy el corazón pide refugio, intimidad y conexión familiar"
  ],
  Leo: [
    "La Luna en Leo ilumina el orgullo emocional y la expresión dramática",
    "Las emociones buscan reconocimiento, calidez y celebración",
    "Hoy el corazón quiere brillar y ser visto con admiración"
  ],
  Virgo: [
    "La Luna en Virgo organiza las emociones con análisis y cuidado",
    "Las emociones buscan orden, utilidad y perfeccionamiento",
    "Hoy el corazón necesita sentirse útil y en control"
  ],
  Libra: [
    "La Luna en Libra busca armonía emocional y conexión relacional",
    "Las emociones fluyen con diplomacia, belleza y búsqueda de equilibrio",
    "Hoy el corazón pide compañía, estética y paz interior"
  ],
  Escorpio: [
    "La Luna en Escorpio intensifica las emociones y pide transformación",
    "Las emociones penetran profundo, exigiendo verdad y regeneración",
    "Hoy el corazón bucea en las sombras para sanar y renacer"
  ],
  Sagitario: [
    "La Luna en Sagitario expande las emociones con optimismo y aventura",
    "Las emociones buscan libertad, significado y nuevas experiencias",
    "Hoy el corazón quiere explorar territorios emocionales desconocidos"
  ],
  Capricornio: [
    "La Luna en Capricornio estructura las emociones con madurez y pragmatismo",
    "Las emociones buscan control, responsabilidad y logros concretos",
    "Hoy el corazón necesita metas claras y reconocimiento del esfuerzo"
  ],
  Acuario: [
    "La Luna en Acuario distancia las emociones para verlas con perspectiva",
    "Las emociones buscan libertad, originalidad y conexión grupal",
    "Hoy el corazón quiere innovar y romper patrones emocionales antiguos"
  ],
  Piscis: [
    "La Luna en Piscis disuelve fronteras emocionales y conecta con lo invisible",
    "Las emociones fluyen con compasión, intuición y sensibilidad extrema",
    "Hoy el corazón se abre a lo místico y necesita espacios de retiro"
  ]
};

// ===========================
// 🌗 FASES LUNARES
// ===========================
export const moonPhaseTemplates: Record<string, string[]> = {
  nueva: [
    "En Luna Nueva, es momento de plantar intenciones y comenzar ciclos",
    "La oscuridad lunar invita a sembrar en silencio lo que quieres ver crecer",
    "Fase de inicio: introspección fértil y nuevos comienzos invisibles"
  ],
  creciente: [
    "La Luna Creciente impulsa el desarrollo y la manifestación progresiva",
    "Fase de expansión: actuar con foco mientras la luz aumenta",
    "El impulso gana fuerza, es momento de construir sobre lo sembrado"
  ],
  llena: [
    "La Luna Llena ilumina lo oculto y marca el punto de máxima revelación",
    "Fase de culminación: celebrar logros y reconocer lo que emerge",
    "La plenitud lunar trae claridad total y resultados visibles"
  ],
  menguante: [
    "La Luna Menguante invita a soltar, limpiar y cerrar procesos",
    "Fase de liberación: reflexionar, descansar y preparar nuevo ciclo",
    "El descenso lunar pide dejar ir lo que ya cumplió su propósito"
  ]
};

// ===========================
// 🔥💨💧🌍 CONSEJOS POR ELEMENTO
// ===========================
export const elementAdviceTemplates: Record<string, string[]> = {
  fuego: [
    "el día llama a la acción audaz, pero sin quemar etapas ni puentes",
    "tu pasión es faro hoy, pero no incendio: actúa con propósito claro",
    "la energía ígnea pide movimiento valiente con dirección consciente"
  ],
  tierra: [
    "el día invita a construir con paciencia y disfrutar lo tangible",
    "tu constancia es tu superpoder: paso a paso, con los pies en la tierra",
    "la energía telúrica pide manifestación concreta y goce sensorial"
  ],
  aire: [
    "el día favorece el diálogo, las ideas nuevas y las conexiones mentales",
    "tu mente es tu aliada: comparte pensamientos y abre perspectivas",
    "la energía aérea pide comunicación clara y flexibilidad intelectual"
  ],
  agua: [
    "el cielo profundiza emociones, intuición y empatía sin ahogarse",
    "tu sensibilidad es tu guía: escucha el corazón pero con discernimiento",
    "la energía acuática pide fluir con las emociones sin perder rumbo"
  ]
};

// ===========================
// 🔗 ASPECTOS PRINCIPALES
// ===========================
export const aspectTypeTemplates: Record<string, string[]> = {
  armonico: [
    "Los aspectos armónicos del día facilitan el flujo natural de energías",
    "Las configuraciones celestes favorecen la sincronicidad y la apertura",
    "El cielo conspira a favor: las puertas se abren con menor resistencia"
  ],
  tenso: [
    "Los aspectos tensos del día traen desafíos que impulsan crecimiento",
    "Las configuraciones celestes generan fricción constructiva",
    "El cielo activa tensiones que, bien canalizadas, fortalecen y transforman"
  ],
  mixto: [
    "Los aspectos mixtos del día combinan facilidades y desafíos en equilibrio",
    "Las configuraciones celestes ofrecen tanto oportunidades como obstáculos",
    "El cielo presenta un tablero complejo: navegar con conciencia es clave"
  ]
};

// ===========================
// ☿️ MERCURIO RETRÓGRADO
// ===========================
export const mercuryRetrogradeTemplates: string[] = [
  "Con Mercurio retrógrado, es momento de revisar, reflexionar y corregir errores del pasado",
  "Mercurio retrocede invitando a repensar comunicaciones, contratos y decisiones",
  "El mensajero celeste pide pausa: revisar antes de avanzar, releer antes de enviar"
];
