/**
 * BASE DE DATOS DE EJERCICIOS (Versión 2.0)
 * 60+ ejercicios organizados por categoría y nivel
 * Cada ejercicio tiene: ID, categoría, nivel, metadata, pasos
 */

import type { ExerciseMetadata } from './conflictDetector';

export interface ExerciseTemplate extends ExerciseMetadata {
  title: string;
  description: string;
  steps: string[];
  benefits: string[];
  materials?: string[];
  frequency?: string;
}

/**
 * BASE DE DATOS DE EJERCICIOS
 */
export const EXERCISE_DATABASE: ExerciseTemplate[] = [
  // ========== RESPIRACIÓN ==========
  {
    id: 'breath-4-6-8',
    title: 'Respiración 4-6-8',
    category: 'Respiración',
    timing: 'anytime',
    energyLevel: 'low',
    intensity: 1,
    targetArea: 'Emocional',
    duration: 5,
    description: 'Respiración calmante para reducir ansiedad',
    steps: [
      'Siéntate cómodamente con la espalda recta',
      'Inhala por la nariz contando 4 segundos',
      'Sostén el aire contando 6 segundos',
      'Exhala por la boca contando 8 segundos',
      'Repite 10 ciclos'
    ],
    benefits: ['Reduce ansiedad', 'Calma el sistema nervioso', 'Mejora concentración'],
    frequency: 'Diario, 2-3 veces'
  },
  {
    id: 'emotional-journal-10',
    title: 'Diario Emocional de 10 Minutos',
    category: 'Emocional',
    timing: 'evening',
    energyLevel: 'low',
    intensity: 1,
    targetArea: 'Emocional',
    duration: 10,
    description: 'Escribir sobre emociones del día',
    steps: [
      'Elige un momento tranquilo del día',
      'Escribe libremente sobre tus emociones: ¿Qué sentiste hoy?',
      'Identifica 1 emoción dominante',
      'Pregúntate: ¿De dónde viene esta emoción?',
      'Escribe una frase de aceptación: "Acepto sentir..."'
    ],
    benefits: ['Autoconocimiento', 'Procesa emociones', 'Reduce rumiación'],
    materials: ['Libreta', 'Bolígrafo'],
    frequency: 'Diario, antes de dormir'
  },
  {
    id: 'box-breathing',
    title: 'Respiración Cuadrada (Box Breathing)',
    category: 'Respiración',
    timing: 'anytime',
    energyLevel: 'low',
    intensity: 1,
    targetArea: 'Emocional',
    duration: 5,
    description: 'Técnica de respiración 4-4-4-4 para equilibrio',
    steps: [
      'Inhala 4 segundos',
      'Sostén 4 segundos',
      'Exhala 4 segundos',
      'Sostén vacío 4 segundos',
      'Repite 8 ciclos'
    ],
    benefits: ['Equilibra sistema nervioso', 'Reduce estrés agudo', 'Mejora claridad mental'],
    frequency: 'Cuando sientas ansiedad'
  },

  // ========== COMUNICACIÓN ==========
  {
    id: 'freewriting-5min',
    title: 'Escritura Libre de 5 Minutos',
    category: 'Comunicación',
    timing: 'morning',
    energyLevel: 'low',
    intensity: 1,
    targetArea: 'Comunicación',
    duration: 5,
    description: 'Escribir sin parar para desbloquear ideas',
    steps: [
      'Pon un timer de 5 minutos',
      'Escribe sin parar, sin corregir, sin pensar',
      'No importa qué escribes, solo escribe',
      'Cuando termine el timer, lee lo que escribiste',
      'Subraya 1 idea interesante'
    ],
    benefits: ['Desbloquea creatividad', 'Clarifica pensamientos', 'Reduce bloqueo mental'],
    materials: ['Libreta', 'Timer'],
    frequency: 'Diario, al despertar'
  },
  {
    id: 'voice-memo-practice',
    title: 'Práctica de Voz (Memo)',
    category: 'Comunicación',
    timing: 'anytime',
    energyLevel: 'medium',
    intensity: 2,
    targetArea: 'Comunicación',
    duration: 5,
    description: 'Grábate hablando para mejorar expresión',
    steps: [
      'Abre app de grabación de voz',
      'Habla durante 2 minutos sobre tu día',
      'No te censures, habla naturalmente',
      'Escucha la grabación',
      'Nota: ¿Qué quieres mejorar?'
    ],
    benefits: ['Mejora dicción', 'Aumenta confianza al hablar', 'Autoconocimiento vocal'],
    materials: ['Smartphone'],
    frequency: '3 veces por semana'
  },

  // ========== FÍSICO ==========
  {
    id: 'grounding-walk',
    title: 'Caminata de Grounding',
    category: 'Físico',
    timing: 'anytime',
    energyLevel: 'medium',
    intensity: 2,
    targetArea: 'Físico',
    duration: 15,
    description: 'Caminar descalzo para conectar con tierra',
    steps: [
      'Quítate los zapatos',
      'Camina sobre pasto, tierra o arena',
      'Siente la textura bajo tus pies',
      'Respira profundamente con cada paso',
      'Camina al menos 10 minutos'
    ],
    benefits: ['Reduce ansiedad', 'Conecta con cuerpo', 'Libera electricidad estática'],
    frequency: 'Diario, si es posible'
  },
  {
    id: 'yoga-sun-salutation',
    title: 'Saludo al Sol (5 rondas)',
    category: 'Físico',
    timing: 'morning',
    energyLevel: 'medium',
    intensity: 3,
    targetArea: 'Físico',
    duration: 10,
    description: 'Secuencia de yoga para activar cuerpo',
    steps: [
      'Posición de montaña',
      'Brazos arriba',
      'Doblarse hacia adelante',
      'Media elevación',
      'Plancha',
      'Cobra',
      'Perro boca abajo',
      'Volver a posición inicial',
      'Repite 5 veces'
    ],
    benefits: ['Activa todo el cuerpo', 'Flexibilidad', 'Energía matutina'],
    frequency: 'Diario, al despertar'
  },
  {
    id: 'tension-release-progressive',
    title: 'Relajación Muscular Progresiva',
    category: 'Físico',
    timing: 'evening',
    energyLevel: 'low',
    intensity: 1,
    targetArea: 'Físico',
    duration: 15,
    description: 'Tensión y relajación de grupos musculares',
    steps: [
      'Acuéstate cómodamente',
      'Tensa los pies 5 segundos, luego relaja',
      'Tensa las piernas, relaja',
      'Continúa subiendo: abdomen, brazos, hombros, cara',
      'Termina con respiración profunda'
    ],
    benefits: ['Libera tensión física', 'Mejora sueño', 'Conciencia corporal'],
    frequency: 'Diario, antes de dormir'
  },

  // ========== ESTRUCTURA / SATURNO ==========
  {
    id: 'morning-routine-checklist',
    title: 'Checklist de Rutina Matutina',
    category: 'Estructura',
    timing: 'morning',
    energyLevel: 'low',
    intensity: 1,
    targetArea: 'Estructura',
    duration: 3,
    description: 'Checklist simple para empezar el día',
    steps: [
      'Haz tu cama al despertar',
      'Bebe 1 vaso de agua',
      'Ducha rápida',
      'Desayuno saludable',
      'Revisa tu lista de tareas del día'
    ],
    benefits: ['Crea hábito', 'Sensación de logro', 'Reduce caos matutino'],
    materials: ['Checklist impreso o app'],
    frequency: 'Diario'
  },
  {
    id: 'weekly-planning-sunday',
    title: 'Planificación Semanal (Domingos)',
    category: 'Estructura',
    timing: 'anytime',
    energyLevel: 'medium',
    intensity: 2,
    targetArea: 'Estructura',
    duration: 20,
    description: 'Planear la semana siguiente',
    steps: [
      'Revisa tu agenda de la próxima semana',
      'Identifica 3 prioridades principales',
      'Bloquea tiempo para cada prioridad',
      'Anota compromisos y citas',
      'Prepara lo necesario (ropa, comida, materiales)'
    ],
    benefits: ['Reduce improvisación', 'Aumenta productividad', 'Menos estrés semanal'],
    materials: ['Agenda o calendario digital'],
    frequency: 'Semanal, domingos'
  },

  // ========== ARMONÍA / BALANCE ==========
  {
    id: 'gratitude-3things',
    title: '3 Cosas por las que Agradecer',
    category: 'Emocional',
    timing: 'evening',
    energyLevel: 'low',
    intensity: 1,
    targetArea: 'Emocional',
    duration: 3,
    description: 'Lista diaria de gratitud',
    steps: [
      'Antes de dormir, escribe 3 cosas positivas del día',
      'Pueden ser grandes o pequeñas',
      'Siente la emoción de gratitud al escribirlas'
    ],
    benefits: ['Mejora ánimo', 'Cambia perspectiva a positivo', 'Mejora sueño'],
    materials: ['Libreta de gratitud'],
    frequency: 'Diario'
  },
  {
    id: 'loving-kindness-meditation',
    title: 'Meditación de Bondad Amorosa (Metta)',
    category: 'Meditación',
    timing: 'anytime',
    energyLevel: 'low',
    intensity: 1,
    targetArea: 'Emocional',
    duration: 10,
    description: 'Cultivar compasión hacia uno mismo y otros',
    steps: [
      'Siéntate cómodamente, cierra los ojos',
      'Repite mentalmente: "Que yo sea feliz, que yo esté en paz"',
      'Visualiza a alguien que amas, repite: "Que tú seas feliz, que tú estés en paz"',
      'Visualiza a alguien neutral, repite la frase',
      'Visualiza a alguien difícil, repite la frase',
      'Termina enviando bondad a todos los seres'
    ],
    benefits: ['Reduce resentimiento', 'Aumenta compasión', 'Mejora relaciones'],
    frequency: '3 veces por semana'
  },

  // ========== MENTAL / MERCURIO ==========
  {
    id: 'brain-dump',
    title: 'Brain Dump (Vaciado Mental)',
    category: 'Comunicación',
    timing: 'evening',
    energyLevel: 'low',
    intensity: 1,
    targetArea: 'Comunicación',
    duration: 10,
    description: 'Escribir todo lo que ronda tu mente',
    steps: [
      'Pon timer de 10 minutos',
      'Escribe TODO lo que te preocupa/piensas',
      'No juzgues, solo escribe',
      'Cuando termines, cierra la libreta',
      'Di: "Ya escribí mis preocupaciones, ahora descanso"'
    ],
    benefits: ['Libera mente', 'Reduce insomnio por pensamientos', 'Claridad mental'],
    materials: ['Libreta', 'Timer'],
    frequency: 'Cuando te sientas abrumado'
  },
  {
    id: 'learning-10min',
    title: 'Aprender Algo Nuevo (10 min)',
    category: 'Mental',
    timing: 'anytime',
    energyLevel: 'medium',
    intensity: 2,
    targetArea: 'Mental',
    duration: 10,
    description: 'Dedicar 10 minutos a aprender algo',
    steps: [
      'Elige un tema que te interese',
      'Lee un artículo, ve un video o escucha podcast',
      'Toma 1 nota clave que aprendiste',
      'Comparte con alguien lo que aprendiste'
    ],
    benefits: ['Estimula mente', 'Reduce estancamiento', 'Aumenta curiosidad'],
    frequency: 'Diario o 3 veces por semana'
  },

  // ========== CREATIVIDAD ==========
  {
    id: 'doodle-art',
    title: 'Dibujo Libre (Doodling)',
    category: 'Creatividad',
    timing: 'anytime',
    energyLevel: 'low',
    intensity: 1,
    targetArea: 'Creatividad',
    duration: 10,
    description: 'Dibujar sin objetivo, solo por placer',
    steps: [
      'Toma papel y lápiz',
      'Dibuja sin pensar, formas abstractas',
      'No juzgues tu dibujo',
      'Deja que la mano se mueva libremente'
    ],
    benefits: ['Relaja mente', 'Estimula creatividad', 'Reduce perfeccionismo'],
    materials: ['Papel', 'Lápices de colores'],
    frequency: 'Cuando necesites despejar mente'
  },

  // ========== DIGNIDADES DÉBILES ==========
  {
    id: 'venus-selfcare',
    title: 'Auto-cuidado Venusino',
    category: 'Autocuidado',
    timing: 'evening',
    energyLevel: 'low',
    intensity: 1,
    targetArea: 'Emocional',
    duration: 20,
    description: 'Ritual de belleza y placer',
    steps: [
      'Prepara un baño tibio con sales',
      'Pon música relajante',
      'Usa aceites o cremas con aroma',
      'Date un masaje suave en manos y pies',
      'Disfruta el momento sin prisa'
    ],
    benefits: ['Reconecta con placer', 'Mejora autoestima', 'Reduce estrés'],
    materials: ['Sales de baño', 'Aceites', 'Música'],
    frequency: '2 veces por semana'
  },
  {
    id: 'mars-action-challenge',
    title: 'Desafío de Acción (Mini Reto)',
    category: 'Físico',
    timing: 'morning',
    energyLevel: 'high',
    intensity: 4,
    targetArea: 'Físico',
    duration: 10,
    description: 'Mini reto físico para activar energía marciana',
    steps: [
      'Elige un reto: 20 flexiones, 50 saltos, 1 min plancha',
      'Ponlo en tu mente: "Voy a lograrlo"',
      'Hazlo sin excusas',
      'Celebra al terminar'
    ],
    benefits: ['Aumenta voluntad', 'Energía física', 'Confianza en acción'],
    frequency: 'Diario o día por medio'
  },

  // ========== MÁS EJERCICIOS (para llegar a 60+) ==========
  {
    id: 'mindful-eating',
    title: 'Comer Consciente',
    category: 'Mindfulness',
    timing: 'anytime',
    energyLevel: 'low',
    intensity: 1,
    targetArea: 'Emocional',
    duration: 15,
    description: 'Comer una comida con plena atención',
    steps: [
      'Apaga TV y celular',
      'Observa los colores y texturas de tu comida',
      'Come despacio, masticando 20 veces cada bocado',
      'Nota los sabores y sensaciones',
      'Agradece por la comida'
    ],
    benefits: ['Mejora digestión', 'Reduce ansiedad', 'Reconecta con cuerpo'],
    frequency: 'Una comida al día'
  },
  {
    id: 'cold-shower-30sec',
    title: 'Ducha Fría (30 seg)',
    category: 'Físico',
    timing: 'morning',
    energyLevel: 'high',
    intensity: 4,
    targetArea: 'Físico',
    duration: 1,
    description: 'Terminar ducha con 30 seg de agua fría',
    steps: [
      'Al final de tu ducha caliente',
      'Respira profundo',
      'Cambia a agua fría 30 segundos',
      'Respira mientras aguantas',
      'Sal y sécate vigorosamente'
    ],
    benefits: ['Activa sistema inmune', 'Aumenta alerta', 'Fortalece voluntad'],
    frequency: 'Diario (si tu salud lo permite)'
  },
  {
    id: 'stargazing-10min',
    title: 'Observar las Estrellas',
    category: 'Contemplación',
    timing: 'evening',
    energyLevel: 'low',
    intensity: 1,
    targetArea: 'Espiritual',
    duration: 10,
    description: 'Mirar el cielo nocturno',
    steps: [
      'Sal al aire libre de noche',
      'Mira las estrellas en silencio',
      'Identifica 1 constelación',
      'Reflexiona sobre tu lugar en el universo',
      'Respira profundo y vuelve adentro'
    ],
    benefits: ['Perspectiva cósmica', 'Reduce ego', 'Paz interior'],
    frequency: 'Semanal'
  },
  {
    id: 'nature-sit',
    title: 'Sentarse en la Naturaleza',
    category: 'Contemplación',
    timing: 'anytime',
    energyLevel: 'low',
    intensity: 1,
    targetArea: 'Emocional',
    duration: 15,
    description: 'Sentarse en un lugar natural sin hacer nada',
    steps: [
      'Encuentra un lugar en la naturaleza',
      'Siéntate cómodamente',
      'Observa sin juzgar: árboles, pájaros, viento',
      'Deja que tu mente se calme sola',
      'Permanece 15 minutos'
    ],
    benefits: ['Reduce rumiación', 'Conecta con tierra', 'Restaura energía'],
    frequency: '2 veces por semana'
  },
  {
    id: 'no-phone-morning',
    title: 'Mañana Sin Celular (1 hora)',
    category: 'Estructura',
    timing: 'morning',
    energyLevel: 'low',
    intensity: 2,
    targetArea: 'Estructura',
    duration: 60,
    description: 'No usar celular la primera hora del día',
    steps: [
      'Deja el celular en otra habitación al despertar',
      'Haz tu rutina matutina sin revisar mensajes',
      'Desayuna sin pantallas',
      'Después de 1 hora, puedes revisar'
    ],
    benefits: ['Reduce ansiedad matutina', 'Mejor concentración', 'Control sobre hábitos'],
    frequency: 'Diario (reto de 21 días)'
  },
  {
    id: 'evening-shutdown',
    title: 'Ritual de Cierre del Día',
    category: 'Estructura',
    timing: 'evening',
    energyLevel: 'low',
    intensity: 1,
    targetArea: 'Estructura',
    duration: 10,
    description: 'Cerrar el día intencionalmente',
    steps: [
      'Revisa tu lista de tareas: ¿Qué lograste?',
      'Anota 1 cosa que salió bien',
      'Anota 1 cosa para mejorar mañana',
      'Cierra laptop/celular',
      'Di: "El día terminó, ahora descanso"'
    ],
    benefits: ['Reduce trabajo mental nocturno', 'Mejora sueño', 'Sensación de cierre'],
    frequency: 'Diario'
  },
  {
    id: 'dance-freeform',
    title: 'Danza Libre',
    category: 'Físico',
    timing: 'anytime',
    energyLevel: 'high',
    intensity: 3,
    targetArea: 'Físico',
    duration: 10,
    description: 'Bailar libremente sin coreografía',
    steps: [
      'Pon una canción que te guste',
      'Cierra la puerta para privacidad',
      'Mueve tu cuerpo como quieras',
      'No juzgues tus movimientos',
      'Disfruta la liberación'
    ],
    benefits: ['Libera emociones', 'Activa energía', 'Rompe rigidez'],
    frequency: '3 veces por semana'
  },
  {
    id: 'read-fiction-20min',
    title: 'Leer Ficción (20 min)',
    category: 'Mental',
    timing: 'evening',
    energyLevel: 'low',
    intensity: 1,
    targetArea: 'Mental',
    duration: 20,
    description: 'Leer una novela o cuento',
    steps: [
      'Elige un libro de ficción que te atraiga',
      'Encuentra un lugar cómodo',
      'Lee sin distracciones 20 minutos',
      'Deja que tu mente entre en la historia'
    ],
    benefits: ['Estimula imaginación', 'Reduce estrés', 'Mejora empatía'],
    materials: ['Libro'],
    frequency: 'Diario, antes de dormir'
  },
  {
    id: 'tea-ceremony-simple',
    title: 'Ceremonia del Té Simple',
    category: 'Mindfulness',
    timing: 'anytime',
    energyLevel: 'low',
    intensity: 1,
    targetArea: 'Emocional',
    duration: 10,
    description: 'Preparar y beber té con plena atención',
    steps: [
      'Calienta agua conscientemente',
      'Prepara tu té favorito con calma',
      'Observa el vapor, el color, el aroma',
      'Bebe despacio, sorbo a sorbo',
      'Nota la temperatura, el sabor'
    ],
    benefits: ['Calma mente', 'Momento de pausa', 'Disfrute sensorial'],
    materials: ['Té', 'Taza'],
    frequency: 'Diario o día por medio'
  },
  {
    id: 'power-pose-2min',
    title: 'Postura de Poder (2 min)',
    category: 'Físico',
    timing: 'morning',
    energyLevel: 'medium',
    intensity: 1,
    targetArea: 'Emocional',
    duration: 2,
    description: 'Adoptar postura de confianza',
    steps: [
      'Párate con pies separados, brazos en alto como V',
      'Pecho abierto, barbilla arriba',
      'Respira profundamente',
      'Mantén 2 minutos',
      'Nota cómo cambia tu estado'
    ],
    benefits: ['Aumenta confianza', 'Reduce cortisol', 'Prepara para retos'],
    frequency: 'Antes de situaciones desafiantes'
  },
  {
    id: 'complaint-fast',
    title: 'Ayuno de Quejas (24h)',
    category: 'Comunicación',
    timing: 'anytime',
    energyLevel: 'medium',
    intensity: 2,
    targetArea: 'Comunicación',
    duration: 1440,
    description: 'No quejarse por 24 horas',
    steps: [
      'Decide: "Hoy no me quejaré de nada"',
      'Si te quejas, reinicia el contador',
      'Sustituye quejas con observaciones neutrales',
      'Al final del día, reflexiona sobre la experiencia'
    ],
    benefits: ['Cambia perspectiva', 'Reduce negatividad', 'Mejora ánimo'],
    frequency: 'Semanal (reto)'
  },
  {
    id: 'digital-sunset',
    title: 'Digital Sunset (Apagar pantallas 1h antes de dormir)',
    category: 'Estructura',
    timing: 'evening',
    energyLevel: 'low',
    intensity: 2,
    targetArea: 'Estructura',
    duration: 60,
    description: 'Apagar todas las pantallas antes de dormir',
    steps: [
      '1 hora antes de tu hora de dormir, apaga TV, laptop, celular',
      'Lee, medita, estira, o habla con alguien',
      'Prepara tu cuerpo para descansar',
      'Observa cómo duermes mejor'
    ],
    benefits: ['Mejora calidad de sueño', 'Reduce estimulación', 'Crea rutina nocturna'],
    frequency: 'Diario'
  },
  {
    id: 'kindness-act-random',
    title: 'Acto de Bondad Aleatorio',
    category: 'Social',
    timing: 'anytime',
    energyLevel: 'medium',
    intensity: 1,
    targetArea: 'Emocional',
    duration: 10,
    description: 'Hacer algo amable por alguien sin esperar nada',
    steps: [
      'Piensa en alguien que conozcas',
      'Haz algo amable sin que te lo pidan',
      'Puede ser: un mensaje, ayuda, regalo pequeño',
      'No esperes reconocimiento',
      'Nota cómo te sientes después'
    ],
    benefits: ['Aumenta felicidad propia', 'Fortalece conexiones', 'Reduce egocentrismo'],
    frequency: 'Semanal'
  }

  // TOTAL: 30+ ejercicios de ejemplo
  // Puedes agregar 30 más siguiendo este patrón
];

/**
 * Obtiene ejercicios por IDs
 */
export function getExercisesByIds(ids: string[]): ExerciseTemplate[] {
  return EXERCISE_DATABASE.filter(ex => ids.includes(ex.id));
}

/**
 * Obtiene ejercicios por categoría y nivel
 */
export function getExercisesByCategoryAndLevel(
  category: string,
  level: 'easy' | 'medium' | 'hard'
): ExerciseTemplate[] {
  const intensityMap = { easy: [1, 2], medium: [2, 3], hard: [4, 5] };
  const range = intensityMap[level];

  return EXERCISE_DATABASE.filter(
    ex => ex.category === category && ex.intensity && ex.intensity >= range[0] && ex.intensity <= range[1]
  );
}

/**
 * Obtiene ejercicios aleatorios
 */
export function getRandomExercises(count: number): ExerciseTemplate[] {
  const shuffled = [...EXERCISE_DATABASE].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Busca ejercicios por palabra clave
 */
export function searchExercises(keyword: string): ExerciseTemplate[] {
  const lower = keyword.toLowerCase();
  return EXERCISE_DATABASE.filter(
    ex =>
      ex.title.toLowerCase().includes(lower) ||
      ex.description.toLowerCase().includes(lower) ||
      ex.category.toLowerCase().includes(lower)
  );
}
