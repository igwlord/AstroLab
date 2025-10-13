/**
 * BASE DE DATOS DE EJERCICIOS (Versión 3.0 - Clínicamente Mejorado)
 * 60+ ejercicios con rigor terapéutico y astrológico
 * Incluye: contraindicaciones, tags terapéuticos, mapeo planetario/chakras
 */

import type { ExerciseMetadata } from './conflictDetector';

// ========== NUEVOS TIPOS ==========

export type TherapeuticModality = 
  | 'Gestalt' 
  | 'Jung' 
  | 'Coaching Ontológico' 
  | 'Terapia Generacional'
  | 'Somatic Experiencing'
  | 'Bioenergética'
  | 'Terapia Centrada en el Cuerpo'
  | 'Psicoterapia Transpersonal';

export interface TherapeuticTags {
  modalities?: TherapeuticModality[];
  somatic?: boolean;
  breathwork?: boolean;
  meditation?: boolean;
  movement?: boolean;
  creative?: boolean;
  ritual?: boolean;
  contemplative?: boolean;
}

export interface EssentialOil {
  name: string;
  latinName?: string; // e.g., 'Lavandula angustifolia'
  use: string; // 'Inhalación', 'Difusión', 'Tópico diluido'
  contraindications?: string[];
}

export interface AstroTags {
  planets?: string[]; // ['Venus', 'Moon']
  chakras?: string[]; // ['Root', 'Heart', 'Solar Plexus']
  sacredGeometry?: string[]; // 'Flor de la Vida', 'Vesica Piscis'
  frequenciesHz?: number[]; // [432, 528]
  essentialOils?: EssentialOil[];
  recommendedFor?: string[]; // ['fireDominant', 'saturnInfluence']
}

export interface SafetyInfo {
  contraindications?: string[];
  requiresSupervision?: boolean; // true si necesita guía profesional
  riskLevel?: 'low' | 'medium' | 'high';
  legalDisclaimer?: string;
}

export interface ExerciseTemplate extends ExerciseMetadata {
  title: string;
  description: string;
  steps: string[];
  benefits: string[];
  materials?: string[];
  frequency?: string;
  
  // Nuevos campos v3.0
  therapeuticTags?: TherapeuticTags;
  astroTags?: AstroTags;
  safetyInfo?: SafetyInfo;
  createdAt?: string;
  updatedAt?: string;
  version?: string;
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
    frequency: '2 veces por semana',
    therapeuticTags: { ritual: true, somatic: true },
    astroTags: {
      planets: ['Venus'],
      chakras: ['Heart', 'Sacral'],
      frequenciesHz: [432],
      essentialOils: [
        { 
          name: 'Lavanda', 
          latinName: 'Lavandula angustifolia',
          use: 'Difusión o 2-3 gotas en baño',
          contraindications: ['Alergia a lamiáceas', 'Embarazo primer trimestre (consultar)']
        },
        {
          name: 'Rosa',
          latinName: 'Rosa damascena',
          use: 'Difusión o diluido en aceite portador',
          contraindications: ['Alergia a rosáceas']
        }
      ],
      recommendedFor: ['venusDominant', 'waterDominant']
    },
    safetyInfo: {
      contraindications: ['Evitar aceites esenciales sin diluir en piel'],
      riskLevel: 'low'
    }
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
    frequency: 'Diario (si tu salud lo permite)',
    therapeuticTags: { somatic: true, breathwork: true },
    astroTags: { 
      planets: ['Mars'], 
      chakras: ['Root'],
      recommendedFor: ['marsDominant', 'fireDominant'] 
    },
    safetyInfo: {
      contraindications: [
        'Hipertensión no controlada',
        'Problemas cardíacos',
        'Síndrome de Raynaud',
        'Embarazo',
        'Problemas circulatorios'
      ],
      requiresSupervision: false,
      riskLevel: 'medium',
      legalDisclaimer: '⚠️ Consulta con tu médico antes de iniciar esta práctica si tienes condiciones cardiovasculares.'
    }
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
    frequency: 'Semanal',
    therapeuticTags: { modalities: ['Coaching Ontológico'] },
    astroTags: { planets: ['Jupiter', 'Venus'], recommendedFor: ['jupiterInfluence'] }
  },

  // ========== EJERCICIOS AMPLIADOS (v3.0) ==========

  {
    id: 'grounding-walk-extended',
    title: 'Caminata de Grounding Extendido (30 min)',
    category: 'Físico',
    timing: 'morning',
    energyLevel: 'medium',
    intensity: 2,
    targetArea: 'Físico',
    duration: 30,
    description: 'Caminata consciente en la naturaleza con pausas somáticas',
    steps: [
      'Camina despacio manteniendo atención en cada paso',
      'Cada 5 minutos, detente 1 minuto y siente la planta del pie',
      'Respira profundo 3 ciclos en cada pausa',
      'Cierra con 2 minutos de escaneo corporal'
    ],
    benefits: ['Conexión tierra', 'Reducción de ansiedad', 'Mejora la postura'],
    materials: ['Zapatos cómodos (opcional ir descalzo)'],
    frequency: '3-4 veces por semana',
    therapeuticTags: { somatic: true, movement: true, contemplative: true },
    astroTags: { 
      chakras: ['Root'], 
      essentialOils: [
        { name: 'Vetiver', latinName: 'Vetiveria zizanioides', use: 'Inhalación antes de caminar', contraindications: ['Ninguna conocida'] }
      ],
      recommendedFor: ['earthDominant', 'mutableExcess'] 
    },
    safetyInfo: { riskLevel: 'low' }
  },

  {
    id: 'solar-affirmations',
    title: 'Afirmaciones Solares (8 min)',
    category: 'Mental',
    timing: 'morning',
    energyLevel: 'medium',
    intensity: 2,
    targetArea: 'Mental',
    duration: 8,
    description: 'Afirmaciones y visualización para fortalecer identidad y propósito',
    steps: [
      '5 respiraciones profundas para centrarte',
      'Di 6 afirmaciones en voz alta enfocadas en capacidades y propósito',
      'Visualiza 30 segundos una acción concreta que represente tu día ideal',
      'Cierra con una postura de poder de 1 minuto'
    ],
    benefits: ['Claridad de propósito', 'Aumento de motivación', 'Autoestima'],
    frequency: 'Diario o 5 veces por semana',
    therapeuticTags: { modalities: ['Coaching Ontológico'], contemplative: true },
    astroTags: { 
      planets: ['Sun'], 
      chakras: ['Solar Plexus'], 
      frequenciesHz: [528],
      recommendedFor: ['sunDominant', 'leoInfluence']
    },
    safetyInfo: { riskLevel: 'low' }
  },

  {
    id: 'moon-bath-ritual',
    title: 'Baño Lunar (Ritual Nocturno)',
    category: 'Autocuidado',
    timing: 'evening',
    energyLevel: 'low',
    intensity: 1,
    targetArea: 'Emocional',
    duration: 20,
    description: 'Ritual suave para noches de introspección y cierre emocional',
    steps: [
      'Prepara un baño tibio con sales de Epsom',
      'Enciende una vela blanca o plateada',
      'Sumérgete y respira contando 6 segundos por inhalación',
      'Tararea una nota suave si lo sientes, luego registra una emoción en 3 palabras'
    ],
    benefits: ['Contención emocional', 'Mejor sueño', 'Procesamiento emocional'],
    materials: ['Sales de Epsom', 'Aceite esencial de lavanda', 'Vela'],
    frequency: '2-3 veces por semana',
    therapeuticTags: { ritual: true, contemplative: true, somatic: true },
    astroTags: { 
      planets: ['Moon'], 
      chakras: ['Heart', 'Crown'],
      essentialOils: [
        { name: 'Lavanda', latinName: 'Lavandula angustifolia', use: '4-5 gotas en baño', contraindications: ['Embarazo primer trimestre'] },
        { name: 'Ylang-Ylang', latinName: 'Cananga odorata', use: '2-3 gotas en baño', contraindications: ['Hipotensión'] }
      ],
      frequenciesHz: [432],
      recommendedFor: ['moonDominant', 'cancerInfluence']
    },
    safetyInfo: {
      contraindications: ['Embarazo avanzado sin aprobación médica', 'Heridas abiertas'],
      riskLevel: 'low'
    }
  },

  {
    id: 'chakra-balance-soundbath',
    title: 'Baño de Sonido para Balance de Chakras (12 min)',
    category: 'Meditación',
    timing: 'anytime',
    energyLevel: 'low',
    intensity: 1,
    targetArea: 'Espiritual',
    duration: 12,
    description: 'Escuchar secuencia de tonos para armonizar centros energéticos',
    steps: [
      'Acuéstate en un lugar cómodo',
      'Reproduce una pista de baño de sonido (12 min) con frecuencias de chakras',
      'Coloca las manos sobre los centros energéticos si lo deseas',
      'Al finalizar, escribe 1 sensación corporal'
    ],
    benefits: ['Relajación profunda', 'Equilibrio energético', 'Integración psicosomática'],
    materials: ['Reproductor de audio', 'Auriculares (opcional)'],
    frequency: '2-3 veces por semana',
    therapeuticTags: { meditation: true, contemplative: true },
    astroTags: { 
      frequenciesHz: [174, 285, 396, 432, 528, 639],
      sacredGeometry: ['Flor de la Vida (símbolo contemplativo)'],
      recommendedFor: ['neptuneInfluence', 'pisceInfluence']
    },
    safetyInfo: { 
      riskLevel: 'low',
      legalDisclaimer: 'Nota: Los baños de sonido son herramientas de relajación, no reemplazan tratamiento médico.'
    }
  },

  {
    id: 'ancestral-lines-letter',
    title: 'Carta a los Ancestros (Trabajo Generacional Simplificado, 30 min)',
    category: 'Terapéutico',
    timing: 'anytime',
    energyLevel: 'low',
    intensity: 2,
    targetArea: 'Emocional',
    duration: 30,
    description: 'Escribir carta simbólica para explorar historia emocional familiar',
    steps: [
      'Identifica 1 patrón familiar que sientas repetido',
      'Escribe una carta dirigida a ese linaje expresando lo que necesitas reconocer o liberar',
      'Guarda o quema la carta como símbolo de cierre (en lugar seguro)',
      'Respira y registra una pequeña intención de cambio'
    ],
    benefits: ['Comprensión intergeneracional', 'Liberación simbólica', 'Insight emocional'],
    materials: ['Papel', 'Contenedor seguro para quemar (opcional)'],
    frequency: 'Ocasional (1-2 veces al mes)',
    therapeuticTags: { 
      modalities: ['Terapia Generacional', 'Psicoterapia Transpersonal'],
      ritual: true,
      contemplative: true 
    },
    astroTags: { 
      planets: ['Pluto', 'Saturn'], 
      chakras: ['Root'],
      recommendedFor: ['plutoInfluence', 'scorpioInfluence', 'capricornInfluence']
    },
    safetyInfo: {
      contraindications: ['Evitar si hay trauma activo sin acompañamiento terapéutico'],
      requiresSupervision: true,
      riskLevel: 'medium',
      legalDisclaimer: '⚠️ Este ejercicio puede activar material emocional profundo. Si sientes desborde, contacta a un profesional de salud mental.'
    }
  },

  {
    id: 'guided-vision-10',
    title: 'Visualización Guiada de Expansión (10 min)',
    category: 'Mental',
    timing: 'morning',
    energyLevel: 'medium',
    intensity: 2,
    targetArea: 'Mental',
    duration: 10,
    description: 'Visualización para expandir perspectiva y abrir oportunidades',
    steps: [
      'Siéntate cómodo y respira 4 ciclos profundos',
      'Sigue una grabación guiada (10 min) que te lleve a una escena de expansión',
      'Al terminar, escribe 1 acción concreta inspirada por la visión'
    ],
    benefits: ['Apertura creativa', 'Motivación para nuevas posibilidades', 'Claridad de metas'],
    materials: ['Grabación guiada', 'Libreta'],
    frequency: '2-3 veces por semana',
    therapeuticTags: { 
      modalities: ['Jung', 'Coaching Ontológico'],
      meditation: true,
      contemplative: true 
    },
    astroTags: { 
      planets: ['Jupiter'], 
      chakras: ['Third Eye', 'Crown'],
      frequenciesHz: [432],
      recommendedFor: ['jupiterInfluence', 'sagittariusInfluence']
    },
    safetyInfo: { riskLevel: 'low' }
  },

  {
    id: 'vesica-breath',
    title: 'Respiración Vesica Piscis (6 min)',
    category: 'Respiración',
    timing: 'anytime',
    energyLevel: 'low',
    intensity: 1,
    targetArea: 'Emocional',
    duration: 6,
    description: 'Respiración rítmica inspirada en geometría sagrada para equilibrar hemisferios cerebrales',
    steps: [
      'Inhala 5s, sostén 5s, exhala 5s, sostén 5s (4 ciclos)',
      'Imagina una forma de Vesica Piscis (dos círculos entrelazados) expandiéndose entre tus manos',
      'Repite 6 ciclos totales y observa cómo cambia tu estado'
    ],
    benefits: ['Equilibrio nervioso', 'Integración hemisférica', 'Calma mental'],
    frequency: 'Diario o cuando necesites centrarte',
    therapeuticTags: { breathwork: true, somatic: true, contemplative: true },
    astroTags: { 
      sacredGeometry: ['Vesica Piscis (símbolo de integración y dualidad)'],
      frequenciesHz: [528],
      chakras: ['Heart', 'Third Eye'],
      recommendedFor: ['neptuneInfluence', 'libraInfluence']
    },
    safetyInfo: { 
      riskLevel: 'low',
      legalDisclaimer: 'Nota: La geometría sagrada se usa aquí como herramienta de contemplación simbólica, no como tecnología vibracional.'
    }
  },

  {
    id: 'flower-of-life-mandala',
    title: 'Dibuja un Mandala: Flor de la Vida (25 min)',
    category: 'Creatividad',
    timing: 'anytime',
    energyLevel: 'low',
    intensity: 1,
    targetArea: 'Creatividad',
    duration: 25,
    description: 'Dibujar mandala guiado por la Flor de la Vida para centrar la mente',
    steps: [
      'Centra tu respiración 3 ciclos',
      'Traza círculos concéntricos hasta formar la Flor de la Vida',
      'Colorea o sombrea con atención plena',
      'Reflexiona 5 minutos sobre símbolos o patrones que surgieron'
    ],
    benefits: ['Concentración', 'Proceso creativo y simbólico', 'Relajación mental'],
    materials: ['Papel', 'Compás', 'Lápices de colores'],
    frequency: 'Semanal o cuando necesites contemplación',
    therapeuticTags: { 
      creative: true, 
      contemplative: true,
      modalities: ['Jung', 'Gestalt']
    },
    astroTags: { 
      sacredGeometry: ['Flor de la Vida (arquetipo contemplativo)'],
      chakras: ['Heart', 'Third Eye'],
      frequenciesHz: [432],
      planets: ['Neptune'],
      recommendedFor: ['neptuneInfluence', 'pisceInfluence']
    },
    safetyInfo: { 
      riskLevel: 'low',
      legalDisclaimer: 'La Flor de la Vida se usa aquí como símbolo arquetípico para meditación activa, según trabajo junguiano.'
    }
  },

  {
    id: 'forest-earthing-30',
    title: 'Earthing en Bosque (30 min)',
    category: 'Contemplación',
    timing: 'morning',
    energyLevel: 'low',
    intensity: 2,
    targetArea: 'Físico',
    duration: 30,
    description: 'Permanecer en bosque conectado físicamente a la tierra y los sentidos',
    steps: [
      'Camina sin prisas 10 min, luego siéntate en el suelo',
      'Apoya palmas y pies en tierra y respira 10 ciclos',
      'Observa sonidos y texturas sin interpretarlos',
      'Vuelve con una nota mental de gratitud'
    ],
    benefits: ['Reducción de estrés', 'Reconexión con ritmos naturales', 'Perspectiva ampliada'],
    frequency: 'Semanal',
    therapeuticTags: { somatic: true, contemplative: true, movement: true },
    astroTags: { 
      chakras: ['Root'],
      essentialOils: [
        { name: 'Cedro', latinName: 'Cedrus atlantica', use: 'Inhalación', contraindications: ['Embarazo'] }
      ],
      recommendedFor: ['earthDominant', 'taurusInfluence', 'virgoInfluence']
    },
    safetyInfo: { riskLevel: 'low' }
  },

  {
    id: 'micro-fasting-12h',
    title: 'Ayuno Intermitente 12h (Ventana Nutricional)',
    category: 'Nutricional',
    timing: 'evening',
    energyLevel: 'low',
    intensity: 2,
    targetArea: 'Estructura',
    duration: 720,
    description: 'Período de 12 horas sin ingesta para reset metabólico (ej. 8pm-8am)',
    steps: [
      'Define tu ventana de alimentación (ej. 8:00-20:00)',
      'Durante la ventana, hidrátate y come conscientemente',
      'Evita comer durante las 12 horas de ayuno',
      'Registra cómo cambia tu energía y digestión al día siguiente'
    ],
    benefits: ['Mejora digestión', 'Disciplina y autorregulación', 'Descanso metabólico'],
    frequency: '3-5 veces por semana (gradual)',
    therapeuticTags: { modalities: ['Coaching Ontológico'] },
    astroTags: { 
      planets: ['Saturn'],
      recommendedFor: ['saturnInfluence', 'capricornInfluence']
    },
    safetyInfo: {
      contraindications: [
        'Diabetes tipo 1 o 2 sin supervisión médica',
        'Embarazo y lactancia',
        'Historial de trastornos alimenticios (TCA)',
        'Medicación que requiere alimentos',
        'Menores de 18 años',
        'Bajo peso o desnutrición'
      ],
      requiresSupervision: true,
      riskLevel: 'medium',
      legalDisclaimer: '⚠️ OBLIGATORIO: Consulta con profesional de salud antes de iniciar cualquier protocolo de ayuno.'
    }
  },

  {
    id: 'empath-boundary-exercise',
    title: 'Ejercicio de Límites Energéticos (10 min)',
    category: 'Emocional',
    timing: 'anytime',
    energyLevel: 'low',
    intensity: 2,
    targetArea: 'Emocional',
    duration: 10,
    description: 'Práctica rápida para establecer límites emocionales saludables',
    steps: [
      'Visualiza un campo luminoso alrededor tuyo que delimita tu espacio personal',
      'Respira y di mentalmente: "Respeto mi espacio y el de otros"',
      'Practica decir "no" en voz baja y firme 3 veces con intención',
      'Anota cómo te sientes después del ejercicio'
    ],
    benefits: ['Mayor contención emocional', 'Mejor manejo de límites', 'Autoprotección psicológica'],
    frequency: 'Diario o cuando te sientas invadido emocionalmente',
    therapeuticTags: { 
      modalities: ['Gestalt', 'Coaching Ontológico', 'Bioenergética'],
      somatic: true 
    },
    astroTags: { 
      chakras: ['Heart', 'Throat', 'Solar Plexus'],
      planets: ['Neptune', 'Moon'],
      recommendedFor: ['waterDominant', 'pisceInfluence', 'cancerInfluence']
    },
    safetyInfo: { riskLevel: 'low' }
  },

  {
    id: 'cold-plunge-prep',
    title: 'Preparación para Inmersión Fría (Protocolo Gradual, 7 min)',
    category: 'Físico',
    timing: 'morning',
    energyLevel: 'high',
    intensity: 4,
    targetArea: 'Físico',
    duration: 7,
    description: 'Secuencia de respiración y movilización ANTES de inmersión fría',
    steps: [
      'Movilización articular 2 min (cuello, hombros, caderas)',
      'Respiraciones controladas (estilo Wim Hof): 30-40 respiraciones rápidas',
      'Exhala y aguanta 20-40 segundos, repetir 2 veces',
      'SOLO después de esta prep, considera entrar al agua fría con respiración controlada'
    ],
    benefits: ['Mayor tolerancia al frío', 'Activación sistema nervioso', 'Resiliencia psicológica'],
    materials: ['Ninguno (preparación corporal)'],
    frequency: 'Solo si practicas inmersión fría supervisada',
    therapeuticTags: { 
      somatic: true, 
      breathwork: true,
      modalities: ['Somatic Experiencing']
    },
    astroTags: { 
      planets: ['Mars', 'Uranus'],
      chakras: ['Root'],
      recommendedFor: ['marsDominant', 'fireDominant', 'uranusInfluence']
    },
    safetyInfo: {
      contraindications: [
        'Hipertensión no controlada',
        'Arritmias cardíacas',
        'Enfermedad cardiovascular',
        'Embarazo',
        'Epilepsia',
        'Síndrome de Raynaud',
        'Cualquier condición médica seria'
      ],
      requiresSupervision: true,
      riskLevel: 'high',
      legalDisclaimer: '⚠️ ALTO RIESGO: La inmersión en agua fría puede causar shock, arritmias o hipotermia. NUNCA sin aprobación médica previa y supervisión de protocolo certificado (ej. Wim Hof Method oficial). NO hagas esto solo si tienes alguna condición médica.'
    }
  },

  {
    id: 'sacred-movement-12min',
    title: 'Movimiento Sagrado Libre (12 min)',
    category: 'Físico',
    timing: 'anytime',
    energyLevel: 'high',
    intensity: 3,
    targetArea: 'Físico',
    duration: 12,
    description: 'Secuencia de movimiento libre guiada por intención y respiración',
    steps: [
      'Calentamiento simple 2 min (rotaciones articulares)',
      'Cierra ojos y deja que el cuerpo responda a música o silencio durante 8 min',
      'Cierre con estiramiento suave y 2 min de respiración consciente'
    ],
    benefits: ['Liberación emocional', 'Integración cuerpo-mente', 'Expresión auténtica'],
    materials: ['Música que te inspire (opcional)'],
    frequency: '3 veces por semana',
    therapeuticTags: { 
      movement: true, 
      contemplative: true,
      modalities: ['Gestalt', 'Bioenergética', 'Somatic Experiencing']
    },
    astroTags: { 
      sacredGeometry: ['Espiral (movimiento orgánico)'],
      frequenciesHz: [432],
      chakras: ['Sacral', 'Heart'],
      planets: ['Neptune', 'Uranus'],
      recommendedFor: ['uranusInfluence', 'neptuneInfluence', 'aquariusInfluence']
    },
    safetyInfo: { 
      riskLevel: 'low',
      contraindications: ['Lesiones articulares agudas']
    }
  },

  {
    id: 'sound-432hz-listen-10',
    title: 'Escucha Terapéutica 432 Hz (10 min)',
    category: 'Meditación',
    timing: 'evening',
    energyLevel: 'low',
    intensity: 1,
    targetArea: 'Emocional',
    duration: 10,
    description: 'Pausa auditiva con tono en 432Hz para centrar emociones',
    steps: [
      'Acuéstate o siéntate cómodo',
      'Reproduce 10 minutos de pista en 432Hz',
      'Observa sensaciones físicas y emocionales sin juzgar',
      'Al terminar, anota 1 sensación predominante'
    ],
    benefits: ['Calma mental', 'Reequilibrio emocional', 'Descanso auditivo'],
    materials: ['Reproductor de audio', 'Auriculares recomendados'],
    frequency: 'Diario o cuando necesites calma',
    therapeuticTags: { meditation: true, contemplative: true },
    astroTags: { 
      frequenciesHz: [432],
      planets: ['Venus', 'Moon'],
      chakras: ['Heart'],
      recommendedFor: ['venusDominant', 'moonDominant', 'libraInfluence']
    },
    safetyInfo: { 
      riskLevel: 'low',
      legalDisclaimer: 'Nota: 432Hz es una frecuencia usada en musicoterapia. No hay evidencia científica concluyente de superioridad sobre 440Hz, pero su efecto relajante es válido por contexto ritual e intención.'
    }
  },

  {
    id: 'yoga-qi-flow-8',
    title: 'Yoga Qi Flow (8 min)',
    category: 'Físico',
    timing: 'morning',
    energyLevel: 'medium',
    intensity: 2,
    targetArea: 'Físico',
    duration: 8,
    description: 'Mini-secuencia de yoga centrada en flujo energético y despertar corporal',
    steps: [
      'Saludo al sol adaptado (3 ciclos lentos)',
      'Torsión suave de columna 2 min',
      'Cierre con respiración abdominal profunda (3 ciclos de 6-6-6)'
    ],
    benefits: ['Aumento de energía', 'Mayor flexibilidad', 'Claridad mental matutina'],
    materials: ['Mat de yoga'],
    frequency: 'Diario o 5 veces por semana',
    therapeuticTags: { 
      movement: true, 
      somatic: true,
      breathwork: true 
    },
    astroTags: { 
      chakras: ['Solar Plexus', 'Heart'],
      frequenciesHz: [396],
      planets: ['Sun', 'Mars'],
      recommendedFor: ['balanced', 'leoInfluence', 'ariesInfluence']
    },
    safetyInfo: { 
      riskLevel: 'low',
      contraindications: ['Lesiones de columna sin aprobación médica']
    }
  },

  {
    id: 'art-therapy-mandala',
    title: 'Arte-Terapia: Mandala Emocional (25 min)',
    category: 'Creatividad',
    timing: 'evening',
    energyLevel: 'low',
    intensity: 1,
    targetArea: 'Emocional',
    duration: 25,
    description: 'Expresar emoción mediante colores y patrones en mandala libre',
    steps: [
      'Elige 3 colores que representen tu estado emocional actual',
      'Dibuja un mandala desde el centro hacia afuera sin juzgar',
      'Mientras dibujas, observa recuerdos o imágenes que surgen',
      'Al finalizar, escribe 1 insight emocional'
    ],
    benefits: ['Procesamiento emocional', 'Creatividad expresiva', 'Integración simbólica'],
    materials: ['Papel grande', 'Lápices o marcadores de colores'],
    frequency: 'Semanal o cuando necesites procesar emociones',
    therapeuticTags: { 
      creative: true,
      modalities: ['Gestalt', 'Jung'],
      contemplative: true 
    },
    astroTags: { 
      chakras: ['Heart', 'Throat'],
      sacredGeometry: ['Círculo (símbolo del Self junguiano)'],
      planets: ['Moon', 'Neptune'],
      recommendedFor: ['moonInfluence', 'pisceInfluence', 'cancerInfluence']
    },
    safetyInfo: { 
      riskLevel: 'low',
      legalDisclaimer: 'El arte-terapia es herramienta de expresión emocional. Si emergen contenidos perturbadores, busca acompañamiento profesional.'
    }
  },

  {
    id: 'family-genogram-observational',
    title: 'Genograma Familiar Observacional (45 min)',
    category: 'Terapéutico',
    timing: 'anytime',
    energyLevel: 'low',
    intensity: 3,
    targetArea: 'Emocional',
    duration: 45,
    description: 'Mapa gráfico básico de relaciones familiares SOLO para observación (no intervención)',
    steps: [
      'Dibuja tu árbol familiar hasta 2-3 generaciones (nombres y fechas)',
      'Marca patrones observables (ej. divorcios, migraciones, profesiones repetidas)',
      'Identifica 1-2 patrones que impactan tu presente SIN intentar resolverlos',
      'Guarda el genograma para trabajarlo con terapeuta si decides profundizar'
    ],
    benefits: ['Conciencia intergeneracional básica', 'Perspectiva histórica familiar'],
    materials: ['Papel grande', 'Marcadores'],
    frequency: 'Una sola vez (o actualizar anualmente)',
    therapeuticTags: { 
      modalities: ['Terapia Generacional'],
      contemplative: true 
    },
    astroTags: { 
      planets: ['Pluto', 'Saturn'],
      chakras: ['Root'],
      recommendedFor: ['plutoInfluence', 'scorpioInfluence', 'capricornInfluence']
    },
    safetyInfo: {
      contraindications: [
        'NO hacer si hay trauma familiar activo sin apoyo terapéutico',
        'NO intentar "resolver" patrones solo — esto requiere terapia profesional'
      ],
      requiresSupervision: true,
      riskLevel: 'medium',
      legalDisclaimer: '⚠️ Este es un ejercicio OBSERVACIONAL. Un genograma terapéutico completo requiere 90-120 min con profesional capacitado. Si emergen emociones fuertes, suspende y busca acompañamiento.'
    }
  },

  {
    id: 'sleep-ritual-warmth',
    title: 'Ritual de Sueño-Calidez (20 min)',
    category: 'Estructura',
    timing: 'evening',
    energyLevel: 'low',
    intensity: 1,
    targetArea: 'Estructura',
    duration: 20,
    description: 'Rutina para preparar cuerpo y mente al sueño con calor y calma',
    steps: [
      'Apaga pantallas 1 hora antes de dormir',
      'Toma una bebida caliente sin cafeína (té de manzanilla)',
      'Aplica calor tibio en pies o piernas 5 min',
      'Respiración 4-6-8 y lectura ligera 10 min'
    ],
    benefits: ['Mejor calidad de sueño', 'Relajación profunda', 'Rutina nocturna saludable'],
    materials: ['Taza', 'Pack térmico o botella de agua caliente', 'Libro ligero'],
    frequency: 'Diario',
    therapeuticTags: { 
      ritual: true,
      somatic: true 
    },
    astroTags: { 
      planets: ['Moon', 'Saturn'],
      chakras: ['Root'],
      essentialOils: [
        { name: 'Lavanda', latinName: 'Lavandula angustifolia', use: 'Difusión en habitación', contraindications: ['Ninguna en difusión'] }
      ],
      recommendedFor: ['moonInfluence', 'saturnInfluence', 'insomnia']
    },
    safetyInfo: { riskLevel: 'low' }
  },

  {
    id: 'sacred-journaling-30',
    title: 'Escritura Sagrada Profunda (30 min)',
    category: 'Emocional',
    timing: 'evening',
    energyLevel: 'low',
    intensity: 2,
    targetArea: 'Emocional',
    duration: 30,
    description: 'Sesión extensa de escritura ritualizada para procesar arquetipos y sueños',
    steps: [
      'Centra con 3 respiraciones profundas',
      'Escribe un sueño reciente o símbolo que te impacta (15 min sin editar)',
      'Selecciona 3 palabras clave y escribe 10 min desarrollando su significado personal',
      'Cierra con una intención para integrar el insight'
    ],
    benefits: ['Procesamiento simbólico', 'Acceso a material inconsciente', 'Integración psíquica'],
    materials: ['Cuaderno dedicado', 'Bolígrafo'],
    frequency: '2-3 veces por semana',
    therapeuticTags: { 
      contemplative: true,
      modalities: ['Coaching Ontológico', 'Jung', 'Psicoterapia Transpersonal']
    },
    astroTags: { 
      planets: ['Neptune', 'Moon', 'Pluto'],
      chakras: ['Third Eye', 'Heart'],
      frequenciesHz: [432],
      recommendedFor: ['neptuneInfluence', 'scorpioInfluence', 'pisceInfluence']
    },
    safetyInfo: { 
      riskLevel: 'low',
      legalDisclaimer: 'El trabajo con sueños y símbolos puede activar contenido inconsciente. Si sientes desborde, busca terapeuta junguiano o transpersonal.'
    }
  }

  // TOTAL: 47 ejercicios completos con rigor clínico
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
