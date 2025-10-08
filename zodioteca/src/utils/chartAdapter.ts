/**
 * Funciones de adaptación para convertir formatos legacy a nuevos tipos
 */

import type { ChartWithStatus } from '../services/chartStorage';
import type { ChartData, House, Planet, Aspect, HouseNumber, AspectType, SpecialPoint } from '../types/chartWheel';

/**
 * Convierte ChartWithStatus a ChartData
 */
export function adaptChartData(chart: ChartWithStatus): ChartData {
  // Convertir casas
  const houses: House[] = chart.data.houses.map((house) => ({
    number: house.number as HouseNumber,
    cusp: house.cusp,
  }));

  // Convertir planetas
  const planets: Planet[] = chart.data.planets.map((planet) => ({
    name: planet.name,
    longitude: planet.longitude,
    retrograde: planet.retrograde,
  }));

  // Convertir aspectos (si existen)
  const aspects: Aspect[] | undefined = chart.data.aspects
    ? chart.data.aspects.map((aspect) => ({
        planet1: aspect.planet1,
        planet2: aspect.planet2,
        type: aspect.type as AspectType,
        orb: aspect.orb,
      }))
    : undefined;

  // Agregar puntos especiales si existen en los datos
  const points: SpecialPoint[] = [];
  
  // ❌ NO agregar asteroides (Ceres, Pallas, Juno, Vesta) - NO van en rueda ni tabla
  // if ('asteroids' in chart.data && Array.isArray(chart.data.asteroids)) { ... }
  
  // ✅ Puntos sensibles (Quirón, Lilith) - SÍ van en rueda y tabla
  if ('sensitivePoints' in chart.data && Array.isArray(chart.data.sensitivePoints)) {
    chart.data.sensitivePoints.forEach((point) => {
      planets.push({
        name: point.name,
        longitude: point.longitude,
        retrograde: point.retrograde
      });
    });
  }
  
  // ✅ Nodos Lunares - SÍ van en rueda (NO en tabla, se filtra después)
  if ('lunarNodes' in chart.data && Array.isArray(chart.data.lunarNodes)) {
    chart.data.lunarNodes.forEach((node) => {
      planets.push({
        name: node.name,
        longitude: node.longitude,
        retrograde: node.retrograde
      });
    });
  }
  
  // ✅ SOLO Parte de la Fortuna - SÍ va en rueda y tabla
  if ('arabicParts' in chart.data && Array.isArray(chart.data.arabicParts)) {
    const fortuna = chart.data.arabicParts.find(part => part.name === 'Parte de la Fortuna');
    if (fortuna) {
      planets.push({
        name: fortuna.name,
        longitude: fortuna.longitude,
        retrograde: false
      });
    }
  }
  
  // ✅ SOLO Vértex (NO Anti-Vértex) - SÍ va en rueda y tabla
  if ('advancedPoints' in chart.data && Array.isArray(chart.data.advancedPoints)) {
    const vertex = chart.data.advancedPoints.find(point => point.name === 'Vértex');
    if (vertex) {
      planets.push({
        name: vertex.name,
        longitude: vertex.longitude,
        retrograde: false
      });
    }
  }

  return {
    houses,
    planets,
    points: points.length > 0 ? points : undefined,
    aspects,
  };
}
