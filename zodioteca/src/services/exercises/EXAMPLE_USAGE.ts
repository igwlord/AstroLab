/**
 * EJEMPLO DE USO DEL SISTEMA DE RECOMENDACIÓN v3.0
 * Documentación práctica con casos de uso reales
 */

import { 
  recommendExercisesForChart, 
  generateMicroRoutine,
  formatRecommendationForUser,
  type ClientContext 
} from './exerciseRecommender';

// ========== CASO 1: Cliente con Venus y Luna dominantes, estado estable ==========

const exampleContext1: ClientContext = {
  planets: ['Venus', 'Moon'],
  elements: { 
    earth: 2, 
    water: 4,  // Agua dominante
    fire: 1, 
    air: 1 
  },
  modalities: { 
    fixed: 4,   // Muy fijo
    mutable: 2, 
    cardinal: 1 
  },
  houseDominance: [4, 8, 12], // Casas emocionales/profundas
  ascendant: 'Taurus',
  moonSign: 'Cancer',
  currentState: 'stable',
  energyLevel: 'normal',
  medicalConditions: [], // Sin condiciones médicas
  therapeuticPreferences: ['Gestalt', 'Jung']
};

console.log('\n🌟 CASO 1: Venus-Luna dominante, agua alta, estable\n');
console.log('=' .repeat(60));

const recommendations1 = recommendExercisesForChart(exampleContext1, { limit: 8 });

recommendations1.forEach((rec) => {
  console.log(formatRecommendationForUser(rec));
});

// Generar micro-rutina de 3 ejercicios
const routine1 = generateMicroRoutine(recommendations1);
if (routine1) {
  console.log('\n🎯 MICRO-RUTINA SUGERIDA (3 ejercicios):\n');
  console.log(`1. INICIO (Grounding): ${routine1.grounding.title} (${routine1.grounding.duration} min)`);
  console.log(`2. TRABAJO: ${routine1.work.title} (${routine1.work.duration} min)`);
  console.log(`3. CIERRE: ${routine1.closure.title} (${routine1.closure.duration} min)`);
  const totalTime = (routine1.grounding.duration || 0) + (routine1.work.duration || 0) + (routine1.closure.duration || 0);
  console.log(`   TOTAL: ${totalTime} minutos`);
}

// ========== CASO 2: Cliente con Marte-Sol, fuego alto, EN CRISIS ==========

const exampleContext2: ClientContext = {
  planets: ['Mars', 'Sun'],
  elements: { 
    fire: 5,    // FUEGO MUY ALTO
    earth: 1, 
    air: 2, 
    water: 0 
  },
  modalities: { 
    cardinal: 5, 
    fixed: 2, 
    mutable: 1 
  },
  houseDominance: [1, 5, 9],
  ascendant: 'Aries',
  moonSign: 'Leo',
  currentState: 'crisis',      // ⚠️ EN CRISIS
  energyLevel: 'high',         // Energía alta pero desregulada
  medicalConditions: [],
  therapeuticPreferences: ['Somatic Experiencing', 'Bioenergética']
};

console.log('\n\n🔥 CASO 2: Marte-Sol, fuego extremo, EN CRISIS\n');
console.log('=' .repeat(60));

const recommendations2 = recommendExercisesForChart(exampleContext2, { limit: 8 });

recommendations2.forEach((rec) => {
  console.log(formatRecommendationForUser(rec));
});

const routine2 = generateMicroRoutine(recommendations2);
if (routine2) {
  console.log('\n🎯 MICRO-RUTINA SUGERIDA:\n');
  console.log(`1. INICIO: ${routine2.grounding.title} (${routine2.grounding.duration} min)`);
  console.log(`2. TRABAJO: ${routine2.work.title} (${routine2.work.duration} min)`);
  console.log(`3. CIERRE: ${routine2.closure.title} (${routine2.closure.duration} min)`);
}

// ========== CASO 3: Cliente con Saturno-Plutón, CON CONDICIONES MÉDICAS ==========

const exampleContext3: ClientContext = {
  planets: ['Saturn', 'Pluto'],
  elements: { 
    earth: 3, 
    water: 3, 
    fire: 1, 
    air: 1 
  },
  modalities: { 
    fixed: 4, 
    cardinal: 2, 
    mutable: 2 
  },
  houseDominance: [8, 10, 12],
  ascendant: 'Capricorn',
  moonSign: 'Scorpio',
  currentState: 'stable',
  energyLevel: 'depleted',     // Energía baja
  medicalConditions: [         // ⚠️ CONDICIONES MÉDICAS
    'hipertensión',
    'problemas cardíacos'
  ],
  therapeuticPreferences: ['Terapia Generacional', 'Jung']
};

console.log('\n\n🛡️ CASO 3: Saturno-Plutón, energía baja, CON condiciones médicas\n');
console.log('=' .repeat(60));

const recommendations3 = recommendExercisesForChart(exampleContext3, { limit: 8 });

console.log('\n⚠️ NOTA: El sistema filtra automáticamente ejercicios contraindicados.\n');

recommendations3.forEach((rec) => {
  console.log(formatRecommendationForUser(rec));
});

// ========== CASO 4: Cliente con Mutable alto (dispersión) ==========

const exampleContext4: ClientContext = {
  planets: ['Mercury', 'Jupiter'],
  elements: { 
    air: 3, 
    fire: 2, 
    earth: 1, 
    water: 2 
  },
  modalities: { 
    mutable: 6,  // ⚠️ MUTABLE MUY ALTO (dispersión)
    cardinal: 1, 
    fixed: 1 
  },
  houseDominance: [3, 6, 9, 12], // Casas mutables
  ascendant: 'Gemini',
  moonSign: 'Sagittarius',
  currentState: 'stable',
  energyLevel: 'high',
  medicalConditions: [],
  therapeuticPreferences: ['Coaching Ontológico']
};

console.log('\n\n🌀 CASO 4: Mutable extremo (dispersión), necesita GROUNDING\n');
console.log('=' .repeat(60));

const recommendations4 = recommendExercisesForChart(exampleContext4, { limit: 8 });

recommendations4.forEach((rec) => {
  console.log(formatRecommendationForUser(rec));
});

console.log('\n\n✅ SISTEMA DE RECOMENDACIÓN v3.0 - Ejemplos completados\n');

// ========== EXPLICACIÓN DE SCORING ==========

console.log('\n📊 SISTEMA DE SCORING EXPLICADO:\n');
console.log('=' .repeat(60));
console.log(`
+3 puntos:  Match directo de planeta (ej. ejercicio Venus → cliente Venus dominante)
+2 puntos:  Match de elemento dominante (ej. ejercicio para waterDominant → cliente agua alta)
+2 puntos:  Match de chakra/casa (ej. ejercicio Heart chakra → cliente casa 4 fuerte)
+2 puntos:  Grounding si fuego/mutable alto (protección contra dispersión)
+2 puntos:  Ejercicio bajo requerimiento si cliente agotado
+1 punto:   Modalidad terapéutica alineada (ej. Gestalt → terapeuta Gestalt)

-2 puntos:  Intensidad alta si cliente en crisis (protección)
-3 puntos:  Contraindicación médica detectada (seguridad crítica)
-1 punto:   Ejercicio muy largo si chart muy fijo (evitar resistencia)

WARNINGS:
⚠️  Se agregan advertencias si:
    - Hay contraindicación médica
    - Ejercicio requiere supervisión profesional
    - Riesgo medio/alto detectado
`);

console.log('\n📚 USO RECOMENDADO:\n');
console.log(`
1. Analiza la carta natal con tu sistema existente
2. Extrae ChartDominance (planetas, elementos, modalidades, casas)
3. Agrega ClientContext (estado actual, nivel energía, condiciones médicas)
4. Llama a recommendExercisesForChart()
5. Revisa warnings antes de recomendar
6. Opcional: genera micro-rutina con generateMicroRoutine()
7. Presenta al cliente con formatRecommendationForUser()
`);

console.log('\n🎯 PRÓXIMOS PASOS:\n');
console.log(`
- Integra con tu analizador de cartas natal existente
- Añade UI para mostrar recomendaciones con reasons
- Implementa tracking de adherencia (¿cliente hizo el ejercicio?)
- Crea feedback loop (¿le sirvió? → ajusta scoring)
- Expande EXERCISE_DATABASE con más variantes
`);
