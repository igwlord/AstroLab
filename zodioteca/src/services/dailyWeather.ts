/**
 * 🌌 SERVICIO DE CLIMA ASTROLÓGICO DIARIO
 * 
 * Proporciona un resumen astrológico del cielo actual usando cálculos locales.
 * Reutiliza calculateNatalChart para obtener posiciones planetarias precisas.
 * 
 * Características:
 * - Cache de 6 horas en localStorage
 * - Cálculo geocéntrico (lat/lon 0,0)
 * - Fase lunar automática
 * - Resumen interpretativo generado
 * - Elemento dominante del día
 */

import { calculateNatalChart, type NatalChart, type PlanetPosition, type Aspect } from './realAstroCalculator';
import { logger } from '../utils/logger';
import { 
  sunTemplates, 
  moonTemplates, 
  moonPhaseTemplates, 
  elementAdviceTemplates,
  mercuryRetrogradeTemplates 
} from '../data/textTemplates';
import { getRandom } from '../utils/randomPicker';

// ===========================
// CONSTANTES Y CONFIGURACIÓN
// ===========================

const CACHE_KEY = 'daily_weather_cache_v8'; // v8: diseño responsivo (poético móvil, técnico desktop)
const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 horas en milisegundos

// ===========================
// INTERFACES
// ===========================

export interface MoonPhase {
  name: 'nueva' | 'creciente' | 'llena' | 'menguante';
  emoji: string;
  percentage: number;
  description: string;
}

export interface DominantElement {
  element: 'fuego' | 'tierra' | 'aire' | 'agua';
  percentage: number;
  description: string;
  emoji: string;
}

export interface DailyWeather {
  timestamp: number;
  date: string;
  
  // Planetas principales
  sun: PlanetPosition | undefined;
  moon: PlanetPosition | undefined;
  moonPhase: MoonPhase;
  
  // Planetas personales
  mercury: PlanetPosition | undefined;
  venus: PlanetPosition | undefined;
  mars: PlanetPosition | undefined;
  
  // Planetas sociales
  jupiter: PlanetPosition | undefined;
  saturn: PlanetPosition | undefined;
  
  // Planetas generacionales
  uranus: PlanetPosition | undefined;
  neptune: PlanetPosition | undefined;
  pluto: PlanetPosition | undefined;
  
  // Aspectos exactos del día (orbe < 3°)
  mainAspects: Aspect[];
  
  // Análisis
  dominantElement: DominantElement;
  summary: string;
  advice: string;
}

interface WeatherCache {
  data: DailyWeather;
  cachedAt: number;
}

// ===========================
// FUNCIONES DE CACHE
// ===========================

/**
 * Obtener clima desde cache si es válido
 */
function getCachedWeather(): DailyWeather | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    
    const { data, cachedAt }: WeatherCache = JSON.parse(cached);
    
    // Verificar si el cache sigue siendo válido (< 6 horas)
    if (Date.now() - cachedAt < CACHE_DURATION) {
      logger.log('✅ Usando clima desde cache (válido por', Math.round((CACHE_DURATION - (Date.now() - cachedAt)) / 1000 / 60), 'minutos más)');
      return data;
    }
    
    logger.log('⏰ Cache expirado, recalculando...');
    return null;
  } catch (error) {
    logger.error('❌ Error leyendo cache:', error);
    return null;
  }
}

/**
 * Guardar clima en cache
 */
function setCachedWeather(data: DailyWeather): void {
  try {
    const cache: WeatherCache = {
      data,
      cachedAt: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    logger.log('💾 Clima guardado en cache (válido por 6 horas)');
  } catch (error) {
    logger.error('❌ Error guardando cache:', error);
  }
}

/**
 * Limpiar cache (útil para forzar actualización)
 */
export function clearWeatherCache(): void {
  localStorage.removeItem(CACHE_KEY);
  logger.log('🗑️ Cache de clima eliminado');
}

// ===========================
// CÁLCULOS ASTRONÓMICOS
// ===========================

/**
 * Calcular fase lunar basada en diferencia angular Sol-Luna
 */
function calculateMoonPhase(sun: PlanetPosition | undefined, moon: PlanetPosition | undefined): MoonPhase {
  if (!sun || !moon) {
    return {
      name: 'nueva',
      emoji: '🌑',
      percentage: 0,
      description: 'Luna Nueva',
    };
  }
  
  // Diferencia angular entre Luna y Sol (en longitud eclíptica)
  let diff = moon.longitude - sun.longitude;
  if (diff < 0) diff += 360;
  
  const percentage = Math.round((diff / 360) * 100);
  
  // Determinar fase según el ángulo
  if (diff < 45 || diff >= 315) {
    return {
      name: 'nueva',
      emoji: '🌑',
      percentage,
      description: 'Luna Nueva - Nuevos comienzos',
    };
  } else if (diff < 135) {
    return {
      name: 'creciente',
      emoji: '🌓',
      percentage,
      description: 'Luna Creciente - Expansión',
    };
  } else if (diff < 225) {
    return {
      name: 'llena',
      emoji: '🌕',
      percentage,
      description: 'Luna Llena - Culminación',
    };
  } else {
    return {
      name: 'menguante',
      emoji: '🌗',
      percentage,
      description: 'Luna Menguante - Liberación',
    };
  }
}

/**
 * Calcular elemento dominante del día
 */
function calculateDominantElement(planets: PlanetPosition[]): DominantElement {
  const elementCounts: Record<string, number> = {
    fuego: 0,
    tierra: 0,
    aire: 0,
    agua: 0,
  };
  
  const elementMap: Record<string, 'fuego' | 'tierra' | 'aire' | 'agua'> = {
    'Aries': 'fuego', 'Leo': 'fuego', 'Sagitario': 'fuego',
    'Tauro': 'tierra', 'Virgo': 'tierra', 'Capricornio': 'tierra',
    'Géminis': 'aire', 'Libra': 'aire', 'Acuario': 'aire',
    'Cáncer': 'agua', 'Escorpio': 'agua', 'Piscis': 'agua',
  };
  
  // Contar planetas por elemento (peso diferenciado)
  // Solo Sol, Luna y planetas personales (no transpersonales)
  const weights: Record<string, number> = {
    'Sol': 3,
    'Luna': 3,
    'Mercurio': 2,
    'Venus': 2,
    'Marte': 2,
    'Júpiter': 1,
    'Saturno': 1,
    // Urano, Neptuno, Plutón NO se cuentan (transpersonales)
  };
  
  for (const planet of planets) {
    // Ignorar planetas transpersonales
    if (!weights[planet.name]) {
      continue;
    }
    
    const element = elementMap[planet.sign];
    if (element) {
      const weight = weights[planet.name];
      elementCounts[element] += weight;
    }
  }
  
  // Encontrar elemento dominante
  const total = Object.values(elementCounts).reduce((a, b) => a + b, 0);
  const dominantEntry = Object.entries(elementCounts).sort((a, b) => b[1] - a[1])[0];
  const [element, count] = dominantEntry;
  const percentage = Math.round((count / total) * 100);
  
  const descriptions: Record<string, { text: string; emoji: string }> = {
    fuego: { text: 'Acción, creatividad e impulso', emoji: '🔥' },
    tierra: { text: 'Practicidad, estabilidad y manifestación', emoji: '🌍' },
    aire: { text: 'Comunicación, ideas y conexión', emoji: '💨' },
    agua: { text: 'Emoción, intuición y profundidad', emoji: '💧' },
  };
  
  return {
    element: element as 'fuego' | 'tierra' | 'aire' | 'agua',
    percentage,
    description: descriptions[element]?.text || '',
    emoji: descriptions[element]?.emoji || '✨',
  };
}

/**
 * Generar resumen interpretativo del día usando plantillas aleatorias
 */
function generateDailySummary(
  sun: PlanetPosition | undefined,
  moon: PlanetPosition | undefined,
  moonPhase: MoonPhase,
  mercury: PlanetPosition | undefined,
  dominantElement: DominantElement
): string {
  if (!sun || !moon) {
    return 'Calculando clima astrológico del día...';
  }
  
  // Seleccionar frases aleatorias de las plantillas
  const sunText = getRandom(sunTemplates[sun.sign] || sunTemplates['Aries']);
  const moonText = getRandom(moonTemplates[moon.sign] || moonTemplates['Aries']);
  const phaseText = getRandom(moonPhaseTemplates[moonPhase.name] || moonPhaseTemplates['nueva']);
  
  // Construir resumen con plantillas (nuevo sistema híbrido)
  let summary = `${sunText}. ${moonText} (${moonPhase.emoji} ${moonPhase.name}). ${phaseText}. `;
  
  // Mencionar Mercurio retrógrado si aplica
  if (mercury?.retrograde) {
    const mercuryText = getRandom(mercuryRetrogradeTemplates);
    summary += `${mercuryText} en ${mercury.sign}. `;
  }
  
  // Explicar elemento dominante CON CONTEXTO de por qué domina (usando plantillas)
  const elementAdvice = getRandom(elementAdviceTemplates[dominantElement.element] || elementAdviceTemplates['fuego']);
  summary += `Con ${dominantElement.percentage}% de energía ${dominantElement.emoji} ${dominantElement.element}, ${elementAdvice}`;
  
  return summary;
}

/**
 * Generar consejo del día basado en Luna y aspectos
 */
function generateDailyAdvice(
  moon: PlanetPosition | undefined,
  moonPhase: MoonPhase,
  mainAspects: Aspect[]
): string {
  if (!moon) {
    return 'Observa el cielo y confía en tu intuición.';
  }
  
  const adviceBySign: Record<string, string> = {
    'Aries': 'Día ideal para iniciar proyectos con valentía',
    'Tauro': 'Conecta con lo tangible y disfruta la simplicidad',
    'Géminis': 'Conversa, aprende y comparte ideas',
    'Cáncer': 'Cuida tus emociones y tu espacio personal',
    'Leo': 'Expresa tu creatividad sin miedo a brillar',
    'Virgo': 'Organiza, analiza y perfecciona los detalles',
    'Libra': 'Busca armonía en tus relaciones',
    'Escorpio': 'Profundiza y transforma lo que ya no sirve',
    'Sagitario': 'Expande tu mente y tu espíritu',
    'Capricornio': 'Construye con disciplina y paciencia',
    'Acuario': 'Innova y conecta con tu comunidad',
    'Piscis': 'Medita y conecta con tu intuición',
  };
  
  let advice = adviceBySign[moon.sign] || 'Sigue tu intuición';
  
  // Ajustar según fase lunar
  if (moonPhase.name === 'nueva') {
    advice += '. Tiempo de nuevos comienzos';
  } else if (moonPhase.name === 'llena') {
    advice += '. Momento de cosecha y celebración';
  }
  
  // Mencionar aspecto principal si existe
  if (mainAspects.length > 0) {
    const aspect = mainAspects[0];
    advice += `. Atención a la conexión entre ${aspect.planet1} y ${aspect.planet2}`;
  }
  
  return advice + '.';
}

// ===========================
// FUNCIÓN PRINCIPAL
// ===========================

/**
 * Obtener el clima astrológico del día
 * Usa cache de 6 horas, calcula si no existe o expiró
 */
export async function getDailyAstrologicalWeather(forceRefresh = false): Promise<DailyWeather> {
  logger.log('🌌 Obteniendo clima astrológico del día...');
  
  // Intentar usar cache si no se fuerza actualización
  if (!forceRefresh) {
    const cached = getCachedWeather();
    if (cached) return cached;
  } else {
    logger.log('🔄 Forzando actualización del clima...');
  }
  
  // Calcular nuevo clima
  const now = new Date();
  
  try {
    // Usar cálculo geocéntrico (lat/lon 0,0) para posiciones generales
    logger.log('📊 Calculando posiciones planetarias...');
    const chart: NatalChart = await calculateNatalChart(
      now,
      0,  // Latitud 0 (Ecuador)
      0,  // Longitud 0 (Greenwich)
      'Tránsitos del Día'
    );
    
    // Extraer planetas
    const sun = chart.planets.find(p => p.name === 'Sol');
    const moon = chart.planets.find(p => p.name === 'Luna');
    const mercury = chart.planets.find(p => p.name === 'Mercurio');
    const venus = chart.planets.find(p => p.name === 'Venus');
    const mars = chart.planets.find(p => p.name === 'Marte');
    const jupiter = chart.planets.find(p => p.name === 'Júpiter');
    const saturn = chart.planets.find(p => p.name === 'Saturno');
    const uranus = chart.planets.find(p => p.name === 'Urano');
    const neptune = chart.planets.find(p => p.name === 'Neptuno');
    const pluto = chart.planets.find(p => p.name === 'Plutón');
    
    // Calcular fase lunar
    const moonPhase = calculateMoonPhase(sun, moon);
    
    // Filtrar aspectos exactos (orbe < 3°)
    const mainAspects = chart.aspects
      .filter(a => a.orb < 3)
      .sort((a, b) => a.orb - b.orb)
      .slice(0, 3); // Solo los 3 más exactos
    
    // Calcular elemento dominante
    const dominantElement = calculateDominantElement(chart.planets);
    
    // Generar resumen y consejo
    const summary = generateDailySummary(sun, moon, moonPhase, mercury, dominantElement);
    const advice = generateDailyAdvice(moon, moonPhase, mainAspects);
    
    // Construir objeto de clima
    const weather: DailyWeather = {
      timestamp: now.getTime(),
      date: now.toLocaleDateString('es-ES', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      sun,
      moon,
      moonPhase,
      mercury,
      venus,
      mars,
      jupiter,
      saturn,
      uranus,
      neptune,
      pluto,
      mainAspects,
      dominantElement,
      summary,
      advice,
    };
    
    // Guardar en cache
    setCachedWeather(weather);
    
    logger.log('✅ Clima astrológico calculado exitosamente');
    logger.log('☀️ Sol:', sun?.sign, sun?.degree.toFixed(1) + '°');
    logger.log('🌙 Luna:', moon?.sign, moon?.degree.toFixed(1) + '°', moonPhase.emoji);
    logger.log('🎯 Elemento dominante:', dominantElement.emoji, dominantElement.element, `(${dominantElement.percentage}%)`);
    
    return weather;
    
  } catch (error) {
    logger.error('❌ Error calculando clima astrológico:', error);
    throw error;
  }
}
