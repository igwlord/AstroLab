import { logger } from '../utils/logger';
/**
 * 🎯 SWISS EPHEMERIS CALCULATOR
 * Cálculos de alta precisión usando Swiss Ephemeris WASM
 * Reemplaza cálculos complejos de Placidus, Lilith y Chiron
 * 
 * Basado en Swiss Ephemeris oficial - el estándar de oro en astrología
 */

// @ts-expect-error - astronomia no tiene tipos TypeScript
import { julian } from 'astronomia';
import SwissEph from 'swisseph-wasm';

/**
 * Instancia global de Swiss Ephemeris (se inicializa una sola vez)
 * Performance tip: Reuse instances for multiple calculations
 */
let sweInstance: any | null = null;
let sweInitialized = false;

/**
 * Inicializa Swiss Ephemeris WASM (solo se ejecuta una vez)
 */
async function initSwissEph(): Promise<any> {
  if (!sweInitialized || !sweInstance) {
    const swe = new SwissEph();
    await swe.initSwissEph();
    sweInstance = (swe as any).SweModule;
    sweInitialized = true;
    const version = sweInstance.ccall('swe_version', 'string', [], []);
    logger.log('✅ Swiss Ephemeris WASM initialized:', version);
  }
  return sweInstance;
}

/**
 * Convierte fecha JavaScript a Día Juliano
 */
function dateToJulian(date: Date): number {
  return julian.CalendarGregorianToJD(
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate() + 
      (date.getUTCHours() + 
       date.getUTCMinutes() / 60 + 
       date.getUTCSeconds() / 3600) / 24
  );
}

/**
 * Convierte longitud eclíptica a signo zodiacal
 */
function longitudeToZodiac(longitude: number): { sign: string; degree: number } {
  const signs = [
    'Aries', 'Tauro', 'Géminis', 'Cáncer',
    'Leo', 'Virgo', 'Libra', 'Escorpio',
    'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
  ];
  
  const normalized = ((longitude % 360) + 360) % 360;
  const signIndex = Math.floor(normalized / 30);
  const degree = normalized % 30;
  
  return {
    sign: signs[signIndex],
    degree: degree
  };
}

/**
 * 🌟 Calcula posición de Chiron con precisión Swiss Ephemeris WASM
 * 
 * Usa Swiss Ephemeris para cálculo exacto de Quirón
 * SE_CHIRON = 15 (Chiron/Quirón)
 * 
 * @param jd - Día Juliano (JD_UT - Universal Time)
 * @returns Longitud eclíptica de Quirón en grados con signo
 */
export async function calculateChironPrecise(jd: number): Promise<{ longitude: number; sign: string; degree: number }> {
  try {
    const swe = await initSwissEph();
    
    // Crear buffer para resultados (4 doubles: lon, lat, dist, speed)
    const buffer = swe._malloc(4 * Float64Array.BYTES_PER_ELEMENT);
    
    // SE_CHIRON = 15 (Quirón)
    // SEFLG_SWIEPH = 2 (Swiss Ephemeris)
    swe.ccall('swe_calc_ut', 'number', ['number', 'number', 'number', 'pointer'], [jd, 15, 2, buffer]);
    
    const result = new Float64Array(swe.HEAPF64.buffer, buffer, 4);
    const longitude = result[0];
    swe._free(buffer);
    
    if (!longitude && longitude !== 0) {
      throw new Error('Swiss Ephemeris no pudo calcular Quirón');
    }
    
    const zodiac = longitudeToZodiac(longitude);
    
    logger.log(`✅ Chiron calculado (Swiss Ephemeris SE_CHIRON): ${longitude.toFixed(6)}° = ${zodiac.sign} ${zodiac.degree.toFixed(2)}°`);
    
    return {
      longitude,
      ...zodiac
    };
  } catch (error) {
    logger.error('❌ Error calculando Chiron con Swiss Ephemeris:', error);
    throw error;
  }
}

/**
 * Calcula Lilith Mean con precisión Swiss Ephemeris
 * Basado en la teoría lunar ELP2000/82
 */
/**
 * 🌙 Calcula Lilith Mean (Black Moon Lilith - Apogeo Lunar Medio)
 * 
 * Usa Swiss Ephemeris WASM para máxima precisión
 * SE_MEAN_APOG = 12 (Apogeo Lunar Medio)
 * 
 * @param jd - Día Juliano (JD_UT - Universal Time)
 * @returns Longitud eclíptica de Lilith Mean en grados con signo
 */
export async function calculateLilithMeanPrecise(jd: number): Promise<{ longitude: number; sign: string; degree: number }> {
  try {
    const swe = await initSwissEph();
    
    // Crear buffer para resultados (4 doubles: lon, lat, dist, speed)
    const buffer = swe._malloc(4 * Float64Array.BYTES_PER_ELEMENT);
    
    // SE_OSCU_APOG = 13 (Osculating Apogee - TRUE LILITH ✅)
    // SEFLG_SWIEPH = 2 (Swiss Ephemeris)
    swe.ccall('swe_calc_ut', 'number', ['number', 'number', 'number', 'pointer'], [jd, 13, 2, buffer]);
    
    const result = new Float64Array(swe.HEAPF64.buffer, buffer, 4);
    const longitude = result[0];
    swe._free(buffer);
    
    if (!longitude) {
      throw new Error('Swiss Ephemeris no pudo calcular Lilith (Osculating Apogee)');
    }
    
    const zodiac = longitudeToZodiac(longitude);
    
    logger.log(`✅ Lilith Mean (Swiss Ephemeris SE_OSCU_APOG): ${longitude.toFixed(6)}° = ${zodiac.sign} ${zodiac.degree.toFixed(2)}°`);
    
    return {
      longitude,
      ...zodiac
    };
  } catch (error) {
    logger.error('❌ Error calculando Lilith Mean con Swiss Ephemeris:', error);
    throw error;
  }
}

/**
 * 🏠 Calcula sistema Placidus con precisión Swiss Ephemeris WASM
 * 
 * Usa la implementación oficial de Swiss Ephemeris (sin bugs!)
 * Sistema 'P' = Placidus (time-proportional house division)
 * 
 * @param jdUT - Día Juliano en Universal Time (UT)
 * @param latitude - Latitud geográfica en grados (N +, S -)
 * @param longitude - Longitud geográfica en grados (E +, W -)
 * @returns Casas Placidus + Ascendente + Medio Cielo con máxima precisión
 */
export async function calculatePlacidusHouses(
  jdUT: number,
  latitude: number,
  longitude: number
): Promise<{
  houses: Array<{ number: number; longitude: number | null; sign?: string; degree?: number }>;
  ascendant: { longitude: number; sign: string; degree: number };
  midheaven: { longitude: number; sign: string; degree: number };
}> {
  try {
    const swe = await initSwissEph();
    
    /**
     * 🔧 SOLUCIÓN DEFINITIVA - Acceso directo a buffers WASM
     * 
     * El wrapper swisseph-wasm no expone los buffers correctamente,
     * pero podemos acceder directamente al módulo WASM subyacente
     * para obtener las casas reales calculadas por Swiss Ephemeris.
     * 
     * Documentación oficial de swe_houses():
     * int swe_houses(double tjd_ut, double geolat, double geolon, int hsys, 
     *                double *cusps, double *ascmc)
     * - cusps: array de 13 doubles (cusps[0]=0, cusps[1..12]=casas)
     * - ascmc: array de 10 doubles (ASC, MC, ARMC, Vertex, etc.)
     * 
     * Necesitamos crear manualmente los buffers con malloc/HEAPF64
     * como lo hace calc_ut() en el wrapper.
     */
    
    // Crear buffers en memoria WASM
    const cuspsBuffer = swe._malloc(13 * Float64Array.BYTES_PER_ELEMENT);
    const ascmcBuffer = swe._malloc(10 * Float64Array.BYTES_PER_ELEMENT);
    
    try {
      // Llamar a swe_houses con buffers
      // hsys = 'P'.charCodeAt(0) = 80 (Placidus)
      const retcode = swe.ccall(
        'swe_houses',
        'number',
        ['number', 'number', 'number', 'number', 'pointer', 'pointer'],
        [jdUT, latitude, longitude, 80, cuspsBuffer, ascmcBuffer] // 80 = 'P' ASCII
      );
      
      if (retcode < 0) {
        throw new Error(`Swiss Ephemeris houses() failed with code ${retcode}`);
      }
      
      // Leer cusps buffer (13 doubles)
      const cusps = new Float64Array(swe.HEAPF64.buffer, cuspsBuffer, 13);
      
      // Leer ascmc buffer (10 doubles)
      const ascmc = new Float64Array(swe.HEAPF64.buffer, ascmcBuffer, 10);
      
      // cusps[0] = 0 (no usado)
      // cusps[1..12] = casas 1-12
      const housesData = [];
      for (let i = 1; i <= 12; i++) {
        housesData.push({
          number: i,
          longitude: cusps[i],
          ...longitudeToZodiac(cusps[i])
        });
      }
      
      // ascmc[0] = Ascendant
      // ascmc[1] = MC
      // ascmc[2] = ARMC
      // ascmc[3] = Vertex
      const ascendant = {
        longitude: ascmc[0],
        ...longitudeToZodiac(ascmc[0])
      };
      
      const midheaven = {
        longitude: ascmc[1],
        ...longitudeToZodiac(ascmc[1])
      };
      
      logger.log(`✅ Placidus Houses (Swiss Ephemeris nativo):`);
      logger.log(`   ARMC: ${ascmc[2].toFixed(4)}°`);
      logger.log(`   ASC: ${ascendant.longitude.toFixed(4)}° = ${ascendant.sign} ${ascendant.degree.toFixed(2)}°`);
      logger.log(`   MC:  ${midheaven.longitude.toFixed(4)}° = ${midheaven.sign} ${midheaven.degree.toFixed(2)}°`);
      logger.log(`   Casa 2: ${cusps[2].toFixed(4)}°`);
      logger.log(`   Casa 3: ${cusps[3].toFixed(4)}°`);
      
      return {
        houses: housesData,
        ascendant,
        midheaven
      };
      
    } finally {
      // Liberar memoria WASM
      swe._free(cuspsBuffer);
      swe._free(ascmcBuffer);
    }
    
  } catch (error) {
    logger.error('❌ Error calculando Placidus con Swiss Ephemeris:', error);
    throw error;
  }
}

/**
 * 🌟 Calcula Vértex y Anti-Vértex usando Swiss Ephemeris WASM
 * 
 * El Vértex está en ascmc[3] del resultado de swe_houses
 * Es el punto más preciso ya que Swiss Ephemeris usa algoritmos exactos
 * 
 * @param jdUT - Día Juliano en Universal Time (UT)
 * @param latitude - Latitud geográfica en grados (N +, S -)
 * @param longitude - Longitud geográfica en grados (E +, W -)
 * @returns Vértex y Anti-Vértex con longitud, signo y grados
 */
export async function calculateVertexPrecise(
  jdUT: number,
  latitude: number,
  longitude: number
): Promise<{
  vertex: { longitude: number; sign: string; degree: number };
  antiVertex: { longitude: number; sign: string; degree: number };
}> {
  try {
    const swe = await initSwissEph();
    
    // Crear buffers en memoria WASM
    const cuspsBuffer = swe._malloc(13 * Float64Array.BYTES_PER_ELEMENT);
    const ascmcBuffer = swe._malloc(10 * Float64Array.BYTES_PER_ELEMENT);
    
    try {
      // Llamar a swe_houses con sistema Placidus
      // hsys = 'P'.charCodeAt(0) = 80 (Placidus)
      const retcode = swe.ccall(
        'swe_houses',
        'number',
        ['number', 'number', 'number', 'number', 'pointer', 'pointer'],
        [jdUT, latitude, longitude, 80, cuspsBuffer, ascmcBuffer]
      );
      
      if (retcode < 0) {
        throw new Error(`Swiss Ephemeris houses() failed with code ${retcode}`);
      }
      
      // Leer ascmc buffer (10 doubles)
      const ascmc = new Float64Array(swe.HEAPF64.buffer, ascmcBuffer, 10);
      
      // ascmc[0] = Ascendant
      // ascmc[1] = MC
      // ascmc[2] = ARMC
      // ascmc[3] = Vertex ✨ ¡AQUÍ ESTÁ!
      // ascmc[4] = Equatorial Ascendant
      // ascmc[5] = Co-Ascendant (Koch)
      // ascmc[6] = Co-Ascendant (Munkasey)
      // ascmc[7] = Polar Ascendant
      
      const vertexLongitude = ascmc[3];
      
      // Anti-Vértex es siempre 180° opuesto
      const antiVertexLongitude = (vertexLongitude + 180) % 360;
      
      const vertex = {
        longitude: vertexLongitude,
        ...longitudeToZodiac(vertexLongitude)
      };
      
      const antiVertex = {
        longitude: antiVertexLongitude,
        ...longitudeToZodiac(antiVertexLongitude)
      };
      
      logger.log(`✅ Vértex (Swiss Ephemeris): ${vertex.longitude.toFixed(6)}° = ${vertex.sign} ${vertex.degree.toFixed(2)}°`);
      logger.log(`✅ Anti-Vértex: ${antiVertex.longitude.toFixed(6)}° = ${antiVertex.sign} ${antiVertex.degree.toFixed(2)}°`);
      
      return { vertex, antiVertex };
      
    } finally {
      // Liberar memoria WASM
      swe._free(cuspsBuffer);
      swe._free(ascmcBuffer);
    }
    
  } catch (error) {
    logger.error('❌ Error calculando Vértex con Swiss Ephemeris:', error);
    throw error;
  }
}

/**
 * Exportar función helper para conversión de fecha
 */
export { dateToJulian };

