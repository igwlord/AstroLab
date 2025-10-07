/**
 * Funciones de adaptación para convertir formatos legacy a nuevos tipos
 */

import type { ChartWithStatus } from '../services/chartStorage';
import type { ChartData, House, Planet, Aspect, HouseNumber, AspectType } from '../types/chartWheel';

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

  // Puntos especiales (pendiente - se agregarán cuando estén en los datos)
  const points = undefined;

  return {
    houses,
    planets,
    points,
    aspects,
  };
}
