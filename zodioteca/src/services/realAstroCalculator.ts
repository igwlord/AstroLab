import { logger } from '../utils/logger';
/**
 * Calculador Astronómico Real usando astronomy-engine
 * Calcula posiciones planetarias precisas para cualquier fecha/ubicación
 */

import * as Astronomy from 'astronomy-engine';
import { calculateAsteroids, type AsteroidPosition } from './asteroidsCalculator';
import { calculateSensitivePoints, type SensitivePoint } from './sensitivePointsCalculator';
import { calculateLunarNodes, type LunarNode } from './lunarNodesCalculator';
import { calculateAspectsAdvanced, type EnhancedAspect } from './aspectsCalculator';
import { calculateArabicParts, type ArabicPart } from './arabicPartsCalculator';
import { calculateHemispheres, type HemispheresResult } from './hemispheresCalculator';
import { useSettingsStore } from '../store/useSettings';
import type { HouseSystem } from '../types/houseSystem';
// 🎯 Swiss Ephemeris lazy loaded para evitar duplicar carga de 12 MB
// Se carga dinámicamente cuando se necesita calcular casas Placidus

export interface PlanetPosition {
  name: string;
  sign: string;
  degree: number;
  retrograde: boolean;
  house: number;
  longitude: number;
}

export interface HousePosition {
  number: number;
  sign: string;
  degree: number;
  cusp: number;
}

export interface Aspect {
  planet1: string;
  planet2: string;
  type: string;
  angle: number;
  orb: number;
  applying: boolean;
  // Campos extendidos (opcionales para compatibilidad)
  exactness?: number;
  category?: 'mayor' | 'menor';
  nature?: 'armonico' | 'tenso' | 'neutral';
  symbol?: string;
}

export interface NatalChart {
  date: Date;
  location: string;
  latitude: number;
  longitude: number;
  timezone: string;
  planets: PlanetPosition[];
  asteroids?: AsteroidPosition[]; // 🆕 Asteroides opcionales
  arabicParts?: ArabicPart[]; // 🆕 Partes Árabes opcionales (FASE 5)
  sensitivePoints?: SensitivePoint[]; // 🆕 Chiron & Lilith
  lunarNodes?: LunarNode[]; // 🆕 Nodos Lunares (Norte y Sur)
  hemispheres?: HemispheresResult; // 🆕 Análisis de Hemisferios (FASE 6)
  advancedPoints?: Array<{ name: string; longitude: number; sign?: string; degree?: number; house?: number }>; // 🆕 Vértex, Anti-Vértex (FASE 7)
  houses: HousePosition[];
  ascendant: { sign: string; degree: number };
  midheaven: { sign: string; degree: number };
  aspects: Aspect[]; // Ahora con campos extendidos
}

// Re-exportar tipos
export type { AsteroidPosition, SensitivePoint, LunarNode, EnhancedAspect, ArabicPart, HemispheresResult };

const ZODIAC_SIGNS = [
  'Aries', 'Tauro', 'Géminis', 'Cáncer',
  'Leo', 'Virgo', 'Libra', 'Escorpio',
  'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
];

function getPlanetName(body: Astronomy.Body): string {
  switch (body) {
    case Astronomy.Body.Sun: return 'Sol';
    case Astronomy.Body.Moon: return 'Luna';
    case Astronomy.Body.Mercury: return 'Mercurio';
    case Astronomy.Body.Venus: return 'Venus';
    case Astronomy.Body.Mars: return 'Marte';
    case Astronomy.Body.Jupiter: return 'Júpiter';
    case Astronomy.Body.Saturn: return 'Saturno';
    case Astronomy.Body.Uranus: return 'Urano';
    case Astronomy.Body.Neptune: return 'Neptuno';
    case Astronomy.Body.Pluto: return 'Plutón';
    default: return 'Desconocido';
  }
}

function eclipticToZodiac(longitude: number): { sign: string; degree: number } {
  const normalizedLon = ((longitude % 360) + 360) % 360;
  const signIndex = Math.floor(normalizedLon / 30);
  const degree = normalizedLon % 30;

  return {
    sign: ZODIAC_SIGNS[signIndex],
    degree: Math.round(degree * 100) / 100
  };
}

function calculateRetrograde(body: Astronomy.Body, date: Date): boolean {
  // Calcular velocidad aparente comparando posición en intervalos más cortos (12 horas)
  // para mayor precisión en detectar estaciones
  const currentPos = Astronomy.Ecliptic(Astronomy.GeoVector(body, date, false));
  const halfDay = new Date(date.getTime() + 12 * 60 * 60 * 1000); // +12 horas
  const nextPos = Astronomy.Ecliptic(Astronomy.GeoVector(body, halfDay, false));

  // Calcular diferencia de longitud considerando el cruce de 0° Aries
  let diff = nextPos.elon - currentPos.elon;
  
  // Ajustar si hay cruce de 360° → 0°
  if (diff > 180) {
    diff -= 360;
  } else if (diff < -180) {
    diff += 360;
  }

  // Si la longitud disminuye (diff negativo), está retrógrado
  return diff < 0;
}

/**
 * Calcula una cúspide de casa intermedia usando PLACIDUS SIMPLIFICADO
 * Usa interpolación temporal del arco diurno/nocturno
 * Basado en la implementación de Swiss Ephemeris simplificada
 * 
 * Para latitudes extremas (>66°), usar Porphyry como fallback
 */
/**
 * 🎯 Calcula casas usando diferentes sistemas
 */
async function calculateHouses(
  date: Date, 
  latitude: number, 
  longitude: number,
  system: HouseSystem = 'placidus'
): Promise<{
  houses: HousePosition[];
  ascendant: { sign: string; degree: number };
  midheaven: { sign: string; degree: number };
}> {
  // ⚡ Dynamic import - solo carga SwissEph cuando se necesita
  const { dateToJulian } = await import('./swissEphemerisCalculator');
  const jd = dateToJulian(date);
  
  switch (system) {
    case 'placidus':
      return await calculatePlacidusSystem(jd, latitude, longitude);
    case 'koch':
      return await calculateKochSystem(jd, latitude, longitude);
    case 'whole-sign':
      return await calculateWholeSignSystem(jd, latitude, longitude);
    case 'equal-house':
      return await calculateEqualHouseSystem(jd, latitude, longitude);
    case 'porphyry':
      return await calculatePorphyrySystem(jd, latitude, longitude);
    case 'campanus':
      return await calculateCampanusSystem(jd, latitude, longitude);
    default:
      return await calculatePlacidusSystem(jd, latitude, longitude);
  }
}

/**
 * Sistema Placidus (actual)
 */
async function calculatePlacidusSystem(jd: number, latitude: number, longitude: number) {
  // ⚡ Dynamic import - solo carga SwissEph cuando se necesita
  const { calculatePlacidusHouses } = await import('./swissEphemerisCalculator');
  const result = await calculatePlacidusHouses(jd, latitude, longitude);
  const houses: HousePosition[] = result.houses.map((h: any) => ({
    number: h.number,
    sign: h.sign || 'Aries',
    degree: h.degree || 0,
    cusp: h.longitude || 0
  }));
  return {
    houses,
    ascendant: { sign: result.ascendant.sign, degree: result.ascendant.degree },
    midheaven: { sign: result.midheaven.sign, degree: result.midheaven.degree }
  };
}

/**
 * Sistema Koch - Similar a Placidus con diferente trisección
 */
async function calculateKochSystem(jd: number, latitude: number, longitude: number) {
  // ⚡ Dynamic import - solo carga SwissEph cuando se necesita
  const { calculatePlacidusHouses } = await import('./swissEphemerisCalculator');
  // Koch usa mismo ASC/MC que Placidus pero diferente división
  const placidus = await calculatePlacidusHouses(jd, latitude, longitude);
  const asc = placidus.ascendant.longitude;
  const mc = placidus.midheaven.longitude;
  
  // Cálculo simplificado de Koch (trisección del arco semidiurno)
  const houses: HousePosition[] = [];
  for (let i = 0; i < 12; i++) {
    let cusp: number;
    if (i === 0) cusp = asc;
    else if (i === 9) cusp = mc;
    else if (i < 9) {
      // Interpolación entre ASC y MC para casas 2-9
      const fraction = i / 9;
      cusp = asc + ((mc - asc + 360) % 360) * fraction;
    } else {
      // Casas 10-12 espejo de 1-3
      cusp = (mc + (i - 9) * 30) % 360;
    }
    cusp = cusp % 360;
    houses.push({
      number: i + 1,
      sign: getZodiacSign(cusp),
      degree: cusp % 30,
      cusp
    });
  }
  
  return {
    houses,
    ascendant: { sign: placidus.ascendant.sign, degree: placidus.ascendant.degree },
    midheaven: { sign: placidus.midheaven.sign, degree: placidus.midheaven.degree }
  };
}

/**
 * Whole Sign - Cada signo = 1 casa
 */
async function calculateWholeSignSystem(jd: number, latitude: number, longitude: number) {
  // ⚡ Dynamic import
  const { calculatePlacidusHouses } = await import('./swissEphemerisCalculator');
  const placidus = await calculatePlacidusHouses(jd, latitude, longitude);
  const asc = placidus.ascendant.longitude;
  
  // El ASC determina la casa 1, cada casa es un signo completo
  const houses: HousePosition[] = [];
  for (let i = 0; i < 12; i++) {
    const cusp = (Math.floor(asc / 30) * 30 + i * 30) % 360;
    houses.push({
      number: i + 1,
      sign: getZodiacSign(cusp),
      degree: 0, // Siempre empieza en 0° del signo
      cusp
    });
  }
  
  return {
    houses,
    ascendant: { sign: placidus.ascendant.sign, degree: placidus.ascendant.degree },
    midheaven: { sign: placidus.midheaven.sign, degree: placidus.midheaven.degree }
  };
}

/**
 * Equal House - 30° desde el ASC
 */
async function calculateEqualHouseSystem(jd: number, latitude: number, longitude: number) {
  // ⚡ Dynamic import
  const { calculatePlacidusHouses } = await import('./swissEphemerisCalculator');
  const placidus = await calculatePlacidusHouses(jd, latitude, longitude);
  const asc = placidus.ascendant.longitude;
  
  const houses: HousePosition[] = [];
  for (let i = 0; i < 12; i++) {
    const cusp = (asc + i * 30) % 360;
    houses.push({
      number: i + 1,
      sign: getZodiacSign(cusp),
      degree: cusp % 30,
      cusp
    });
  }
  
  return {
    houses,
    ascendant: { sign: placidus.ascendant.sign, degree: placidus.ascendant.degree },
    midheaven: { sign: placidus.midheaven.sign, degree: placidus.midheaven.degree }
  };
}

/**
 * Porphyry - División de cuadrantes en tercios
 */
async function calculatePorphyrySystem(jd: number, latitude: number, longitude: number) {
  // ⚡ Dynamic import
  const { calculatePlacidusHouses } = await import('./swissEphemerisCalculator');
  const placidus = await calculatePlacidusHouses(jd, latitude, longitude);
  const asc = placidus.ascendant.longitude;
  const mc = placidus.midheaven.longitude;
  const dsc = (asc + 180) % 360;
  const ic = (mc + 180) % 360;
  
  const houses: HousePosition[] = [];
  
  // Cuadrante 1: ASC → MC (casas 1, 2, 3)
  const q1Arc = ((mc - asc + 360) % 360) / 3;
  houses.push({ number: 1, cusp: asc, sign: getZodiacSign(asc), degree: asc % 30 });
  houses.push({ number: 2, cusp: (asc + q1Arc) % 360, sign: getZodiacSign((asc + q1Arc) % 360), degree: ((asc + q1Arc) % 360) % 30 });
  houses.push({ number: 3, cusp: (asc + 2 * q1Arc) % 360, sign: getZodiacSign((asc + 2 * q1Arc) % 360), degree: ((asc + 2 * q1Arc) % 360) % 30 });
  
  // Cuadrante 2: MC → DSC (casas 4, 5, 6)
  const q2Arc = ((dsc - mc + 360) % 360) / 3;
  houses.push({ number: 4, cusp: mc, sign: getZodiacSign(mc), degree: mc % 30 });
  houses.push({ number: 5, cusp: (mc + q2Arc) % 360, sign: getZodiacSign((mc + q2Arc) % 360), degree: ((mc + q2Arc) % 360) % 30 });
  houses.push({ number: 6, cusp: (mc + 2 * q2Arc) % 360, sign: getZodiacSign((mc + 2 * q2Arc) % 360), degree: ((mc + 2 * q2Arc) % 360) % 30 });
  
  // Cuadrante 3: DSC → IC (casas 7, 8, 9)
  const q3Arc = ((ic - dsc + 360) % 360) / 3;
  houses.push({ number: 7, cusp: dsc, sign: getZodiacSign(dsc), degree: dsc % 30 });
  houses.push({ number: 8, cusp: (dsc + q3Arc) % 360, sign: getZodiacSign((dsc + q3Arc) % 360), degree: ((dsc + q3Arc) % 360) % 30 });
  houses.push({ number: 9, cusp: (dsc + 2 * q3Arc) % 360, sign: getZodiacSign((dsc + 2 * q3Arc) % 360), degree: ((dsc + 2 * q3Arc) % 360) % 30 });
  
  // Cuadrante 4: IC → ASC (casas 10, 11, 12)
  const q4Arc = ((asc - ic + 360) % 360) / 3;
  houses.push({ number: 10, cusp: ic, sign: getZodiacSign(ic), degree: ic % 30 });
  houses.push({ number: 11, cusp: (ic + q4Arc) % 360, sign: getZodiacSign((ic + q4Arc) % 360), degree: ((ic + q4Arc) % 360) % 30 });
  houses.push({ number: 12, cusp: (ic + 2 * q4Arc) % 360, sign: getZodiacSign((ic + 2 * q4Arc) % 360), degree: ((ic + 2 * q4Arc) % 360) % 30 });
  
  return {
    houses,
    ascendant: { sign: placidus.ascendant.sign, degree: placidus.ascendant.degree },
    midheaven: { sign: placidus.midheaven.sign, degree: placidus.midheaven.degree }
  };
}

/**
 * Campanus - Basado en el primer vertical
 */
async function calculateCampanusSystem(jd: number, latitude: number, longitude: number) {
  // ⚡ Dynamic import
  const { calculatePlacidusHouses } = await import('./swissEphemerisCalculator');
  // Campanus es similar a Placidus pero usa proyección en ecuador celeste
  // Por simplicidad, usamos aproximación basada en Placidus con offset
  const placidus = await calculatePlacidusHouses(jd, latitude, longitude);
  
  // Offset de ~5-10° para simular proyección campanus
  const campanusOffset = 7 * Math.sin(latitude * Math.PI / 180);
  
  const houses: HousePosition[] = placidus.houses.map((h: any, i: number) => {
    const offset = i < 6 ? campanusOffset : -campanusOffset;
    const cusp = ((h.longitude || 0) + offset + 360) % 360;
    return {
      number: h.number,
      sign: getZodiacSign(cusp),
      degree: cusp % 30,
      cusp
    };
  });
  
  return {
    houses,
    ascendant: { sign: placidus.ascendant.sign, degree: placidus.ascendant.degree },
    midheaven: { sign: placidus.midheaven.sign, degree: placidus.midheaven.degree }
  };
}

/**
 * Helper: Convierte longitud eclíptica a signo zodiacal
 */
function getZodiacSign(longitude: number): string {
  const signs = [
    'Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo',
    'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
  ];
  return signs[Math.floor(longitude / 30) % 12];
}

function assignHouse(longitude: number, houses: HousePosition[]): number {
  // Encontrar en qué casa está el planeta
  for (let i = 0; i < houses.length; i++) {
    const currentHouse = houses[i];
    const nextHouse = houses[(i + 1) % 12];

    if (currentHouse.cusp <= nextHouse.cusp) {
      if (longitude >= currentHouse.cusp && longitude < nextHouse.cusp) {
        return currentHouse.number;
      }
    } else {
      // Cruce del 0° de Aries
      if (longitude >= currentHouse.cusp || longitude < nextHouse.cusp) {
        return currentHouse.number;
      }
    }
  }
  return 1; // Fallback
}

/**
 * Calcula aspectos usando el nuevo sistema avanzado
 * Lee configuración del usuario para incluir aspectos menores
 */
function calculateAspects(planets: PlanetPosition[]): Aspect[] {
  // Leer configuración
  const settings = useSettingsStore.getState().astro;
  
  // Usar el calculador avanzado con settings del usuario
  const enhancedAspects = calculateAspectsAdvanced(planets, {
    includeMajor: true,
    includeMinor: settings.showAllMinorAspects || settings.showQuincunx
  });
  
  // Filtrar Quincunx si solo está activado ese y no todos los menores
  let filteredAspects = enhancedAspects;
  if (settings.showQuincunx && !settings.showAllMinorAspects) {
    filteredAspects = enhancedAspects.filter(
      a => a.category === 'mayor' || a.type === 'Quincunx'
    );
  }
  
  // Convertir a formato Aspect (compatible con versión anterior)
  return filteredAspects.map(ea => ({
    planet1: ea.planet1,
    planet2: ea.planet2,
    type: ea.type,
    angle: ea.angle,
    orb: ea.orb,
    applying: ea.applying,
    exactness: ea.exactness,
    category: ea.category,
    nature: ea.nature,
    symbol: ea.symbol
  }));
}

export async function calculateNatalChart(
  birthDate: Date,
  latitude: number,
  longitude: number,
  location: string,
  houseSystem: HouseSystem = 'placidus'
): Promise<NatalChart> {
  logger.log('=== CÁLCULO ASTRONÓMICO REAL ===');
  logger.log('Fecha:', birthDate.toISOString());
  logger.log('Ubicación:', { latitude, longitude, location });
  logger.log('Sistema de casas:', houseSystem);

  // Calcular posiciones planetarias
  const planets: PlanetPosition[] = [];
  const bodies = [
    Astronomy.Body.Sun,
    Astronomy.Body.Moon,
    Astronomy.Body.Mercury,
    Astronomy.Body.Venus,
    Astronomy.Body.Mars,
    Astronomy.Body.Jupiter,
    Astronomy.Body.Saturn,
    Astronomy.Body.Uranus,
    Astronomy.Body.Neptune,
    Astronomy.Body.Pluto
  ];

  // Calcular casas con el sistema seleccionado
  const { houses, ascendant, midheaven } = await calculateHouses(birthDate, latitude, longitude, houseSystem);

  for (const body of bodies) {
    try {
      const ecliptic = Astronomy.Ecliptic(Astronomy.GeoVector(body, birthDate, false));
      const lon = ecliptic.elon;
      const zodiac = eclipticToZodiac(lon);
      const retrograde = body !== 'Sun' && body !== 'Moon' ? calculateRetrograde(body, birthDate) : false;
      const house = assignHouse(lon, houses);

      planets.push({
        name: getPlanetName(body),
        sign: zodiac.sign,
        degree: zodiac.degree,
        longitude: lon,
        retrograde,
        house
      });
    } catch (error) {
      logger.error(`Error calculando ${body}:`, error);
    }
  }

  // Leer configuración del usuario
  const settings = useSettingsStore.getState().astro;

  // Calcular asteroides (Ceres, Pallas, Juno, Vesta)
  let asteroids: AsteroidPosition[] | undefined;
  if (settings.showAsteroids) {
    try {
      const houseCusps = houses.map((h: HousePosition) => h.cusp);
      asteroids = await calculateAsteroids(birthDate, houseCusps);
      logger.log('✅ Asteroides calculados:', asteroids.length);
    } catch (error) {
      logger.error('❌ Error calculando asteroides:', error);
      asteroids = undefined;
    }
  }

  // Calcular puntos sensibles (Chiron & Lilith)
  let sensitivePoints: SensitivePoint[] | undefined;
  if (settings.showChiron || settings.lilithType) {
    try {
      const houseCusps = houses.map((h: HousePosition) => h.cusp);
      sensitivePoints = await calculateSensitivePoints(
        birthDate,
        houseCusps,
        { 
          includeChiron: settings.showChiron,
          lilithType: settings.lilithType
        }
      );
      logger.log('✅ Puntos sensibles calculados:', sensitivePoints.length);
    } catch (error) {
      logger.error('❌ Error calculando puntos sensibles:', error);
      sensitivePoints = undefined;
    }
  }

  // Calcular nodos lunares (Norte y Sur)
  let lunarNodes: LunarNode[] | undefined;
  if (settings.showLunarNodes) {
    try {
      const houseCusps = houses.map((h: HousePosition) => h.cusp);
      lunarNodes = await calculateLunarNodes(
        birthDate,
        houseCusps,
        settings.lunarNodesType
      );
      logger.log('✅ Nodos lunares calculados:', lunarNodes.length);
    } catch (error) {
      logger.error('❌ Error calculando nodos lunares:', error);
      lunarNodes = undefined;
    }
  }

  // Calcular Partes Árabes (FASE 5)
  let arabicParts: ArabicPart[] | undefined;
  if (settings.showArabicParts) {
    try {
      const houseCusps = houses.map((h: HousePosition) => h.cusp);
      const ascendantLongitude = houseCusps[0]; // Ascendente = cúspide de casa 1
      
      // Convertir PlanetPosition[] a formato simple para el calculador
      const planetLongitudes = planets.map(p => ({
        name: p.name,
        longitude: p.longitude
      }));
      
      arabicParts = await calculateArabicParts(
        planetLongitudes,
        ascendantLongitude,
        houseCusps
      );
      logger.log('✅ Partes Árabes calculadas:', arabicParts.length);
    } catch (error) {
      logger.error('❌ Error calculando Partes Árabes:', error);
      arabicParts = undefined;
    }
  }

  // Calcular Análisis de Hemisferios (FASE 6)
  let hemispheres: HemispheresResult | undefined;
  if (settings.showHemispheres) {
    try {
      // Convertir PlanetPosition[] a formato simple para el calculador
      const planetsForHemispheres = planets.map(p => ({
        name: p.name,
        house: p.house
      }));
      
      hemispheres = await calculateHemispheres(planetsForHemispheres);
      logger.log('✅ Análisis de Hemisferios calculado');
    } catch (error) {
      logger.error('❌ Error calculando Hemisferios:', error);
      hemispheres = undefined;
    }
  }

  // 🆕 Calcular puntos avanzados adicionales (Vértex, validación de otros puntos)
  // Este cálculo complementa los puntos ya calculados arriba
  let advancedPoints: Array<{ name: string; longitude: number; sign?: string; degree?: number; house?: number }> | undefined;
  if (settings.showVertexAntiVertex) {
    try {
      const { calculateAdvancedChart } = await import('./advancedAstroCalculator');
      
      // ⚡ Dynamic import - Convertir fecha a Día Juliano
      const { dateToJulian } = await import('./swissEphemerisCalculator');
      const julianDay = dateToJulian(birthDate);
      
      const houseCusps = houses.map(h => h.cusp);
      const sunPlanet = planets.find(p => p.name === 'Sol');
      const moonPlanet = planets.find(p => p.name === 'Luna');
      
      const advancedData = await calculateAdvancedChart(
        {
          julianDay,
          latitude,
          longitude,
          houseCusps,
          ascendantLongitude: houseCusps[0],
          sunLongitude: sunPlanet?.longitude,
          moonLongitude: moonPlanet?.longitude,
        },
        {
          calculateAsteroids: false, // Ya calculados arriba
          calculateChiron: false,     // Ya calculado arriba
          calculateMidheaven: false,  // Ya calculado arriba
          calculatePartOfFortune: false, // Ya calculado en arabicParts
          calculateNodes: false,      // Ya calculados arriba
          calculateVertex: true,      // ✅ Calcular Vértex
        }
      );
      
      // Convertir puntos avanzados al formato esperado
      advancedPoints = [];
      if (advancedData.specialPoints.vertex) {
        advancedPoints.push({
          name: 'Vértex',
          longitude: advancedData.specialPoints.vertex.longitude,
          sign: advancedData.specialPoints.vertex.sign,
          degree: advancedData.specialPoints.vertex.degree,
          house: advancedData.specialPoints.vertex.house,
        });
      }
      if (advancedData.specialPoints.antiVertex) {
        advancedPoints.push({
          name: 'Anti-Vértex',
          longitude: advancedData.specialPoints.antiVertex.longitude,
          sign: advancedData.specialPoints.antiVertex.sign,
          degree: advancedData.specialPoints.antiVertex.degree,
          house: advancedData.specialPoints.antiVertex.house,
        });
      }
      
      logger.log('✅ Puntos avanzados calculados (Vértex):', advancedPoints.length);
    } catch (error) {
      logger.error('❌ Error calculando puntos avanzados:', error);
      advancedPoints = undefined;
    }
  }

  // 🎯 Calcular aspectos SOLO con puntos seleccionados
  // INCLUIR: Planetas principales + Quirón + Lilith + Parte de la Fortuna + Vértex
  // EXCLUIR: Asteroides, Nodos, Anti-Vértex, otras partes árabes
  const allPoints: PlanetPosition[] = [...planets];
  
  // ❌ NO agregar asteroides (Ceres, Pallas, Juno, Vesta)
  // if (asteroids) { ... }
  
  // ✅ Agregar puntos sensibles (Quirón, Lilith) - SÍ incluir
  if (sensitivePoints) {
    sensitivePoints.forEach(sp => {
      allPoints.push({
        name: sp.name,
        longitude: sp.longitude,
        sign: sp.sign,
        degree: sp.degree,
        house: sp.house,
        retrograde: sp.retrograde
      });
    });
  }
  
  // ❌ NO agregar nodos lunares (Nodo Norte, Nodo Sur)
  // if (lunarNodes) { ... }
  
  // ✅ Agregar SOLO Parte de la Fortuna (filtrar otras partes árabes)
  if (arabicParts) {
    const fortuna = arabicParts.find(ap => ap.name === 'Parte de la Fortuna');
    if (fortuna) {
      allPoints.push({
        name: fortuna.name,
        longitude: fortuna.longitude,
        sign: fortuna.sign,
        degree: fortuna.degree,
        house: fortuna.house,
        retrograde: false
      });
    }
  }
  
  // ✅ Agregar SOLO Vértex (NO Anti-Vértex)
  if (advancedPoints) {
    const vertex = advancedPoints.find(ap => ap.name === 'Vértex');
    if (vertex) {
      allPoints.push({
        name: vertex.name,
        longitude: vertex.longitude,
        sign: vertex.sign || '',
        degree: vertex.degree || 0,
        house: vertex.house || 0,
        retrograde: false
      });
    }
  }
  
  // Calcular aspectos con TODOS los puntos
  const aspects = calculateAspects(allPoints);

  return {
    date: birthDate,
    location,
    latitude,
    longitude,
    timezone: 'UTC', // TODO: usar timezone real
    planets,
    asteroids, // 🆕 Incluir asteroides
    sensitivePoints, // 🆕 Incluir Chiron y Lilith
    lunarNodes, // 🆕 Incluir Nodos Lunares
    arabicParts, // 🆕 Incluir Partes Árabes (FASE 5)
    hemispheres, // 🆕 Incluir Análisis de Hemisferios (FASE 6)
    advancedPoints, // 🆕 Incluir Vértex y Anti-Vértex (FASE 7)
    houses,
    ascendant,
    midheaven,
    aspects
  };
}

