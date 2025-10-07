/**
 * Tipos estrictos para el componente NatalChartWheel
 * Basado en el plan maestro (PLAN_MAESTRO_RUEDA_ASTRO_SEEK.md)
 */

// ========================================
// Tipos base
// ========================================

export type HouseNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface House {
  /** Número de casa (1-12) */
  number: HouseNumber;
  /** Cúspide en grados absolutos (0-360) */
  cusp: number;
}

export interface Planet {
  /** Nombre del planeta (Sol, Luna, Mercurio, etc.) */
  name: string;
  /** Longitud eclíptica absoluta en grados (0-360) */
  longitude: number;
  /** Indica si el planeta está retrógrado */
  retrograde?: boolean;
}

export type SpecialPointName = 'Node' | 'Lilith' | 'Fortune' | 'Chiron' | 'Vertex';

export interface SpecialPoint {
  /** Nombre del punto especial */
  name: SpecialPointName;
  /** Longitud eclíptica absoluta en grados (0-360) */
  longitude: number;
}

export type AspectType = 'conjunction' | 'opposition' | 'square' | 'trine' | 'sextil';

export interface Aspect {
  /** Nombre del primer planeta/punto */
  planet1: string;
  /** Nombre del segundo planeta/punto */
  planet2: string;
  /** Tipo de aspecto */
  type: AspectType;
  /** Orbe en grados (valor absoluto) */
  orb: number;
}

export interface ChartData {
  /** Array de 12 casas con cúspides */
  houses: House[];
  /** Planetas principales */
  planets: Planet[];
  /** Puntos especiales opcionales (Nodos, Lilith, etc.) */
  points?: SpecialPoint[];
  /** Aspectos calculados */
  aspects?: Aspect[];
}

// ========================================
// Props del componente
// ========================================

export type ThemeType = 'classic' | 'violet';
export type ModeType = 'zodiacFixed' | 'ascRelative';
export type PlanetLabelsType = 'none' | 'inline';

export interface NatalChartWheelProps {
  /** Datos de la carta natal */
  data: ChartData;
  /** Tamaño del SVG en píxeles (default: 640) */
  size?: number;
  /** Tema de colores (default: 'violet') */
  theme?: ThemeType;
  /** Modo de visualización (default: 'zodiacFixed') */
  mode?: ModeType;
  /** Etiquetas de planetas (default: 'none') */
  planetLabels?: PlanetLabelsType;
  /** Modo debug con overlay de retícula (default: false) */
  debug?: boolean;
}

// ========================================
// Tipos internos para rendering
// ========================================

export interface Theme {
  background: string;
  ticksColor: string;
  ticksOpacity: [number, number, number]; // 1°, 5°, 10°
  signsColor: string;
  houseLinesColor: {
    angular: string;
    succedent: string;
    cadent: string;
  };
  houseLinesWidth: {
    angular: number;
    succedent: number;
    cadent: number;
  };
  aspectsColor: {
    conjunction: string;
    opposition: string;
    square: string;
    trine: string;
    sextil: string;
  };
  planetsColor: string;
  axesColor: string;
  debugColor: string;
}

// ========================================
// Validación de datos
// ========================================

export class ChartDataValidationError extends Error {
  constructor(message: string) {
    super(`ChartData validation failed: ${message}`);
    this.name = 'ChartDataValidationError';
  }
}

/**
 * Valida que los datos de la carta sean correctos
 * @throws {ChartDataValidationError} Si los datos son inválidos
 */
export function validateChartData(data: ChartData): void {
  // Validar houses
  if (!Array.isArray(data.houses)) {
    throw new ChartDataValidationError('houses must be an array');
  }

  if (data.houses.length !== 12) {
    throw new ChartDataValidationError(`houses must have exactly 12 elements, got ${data.houses.length}`);
  }

  const houseNumbers = new Set<number>();
  const houseCusps = new Set<number>();

  data.houses.forEach((house, idx) => {
    if (!house.number || house.number < 1 || house.number > 12) {
      throw new ChartDataValidationError(`houses[${idx}].number must be 1-12, got ${house.number}`);
    }

    if (houseNumbers.has(house.number)) {
      throw new ChartDataValidationError(`duplicate house number: ${house.number}`);
    }
    houseNumbers.add(house.number);

    if (typeof house.cusp !== 'number') {
      throw new ChartDataValidationError(`houses[${idx}].cusp must be a number, got ${typeof house.cusp}`);
    }

    const normalizedCusp = ((house.cusp % 360) + 360) % 360;
    if (houseCusps.has(normalizedCusp)) {
      throw new ChartDataValidationError(`duplicate house cusp: ${normalizedCusp}° (house ${house.number})`);
    }
    houseCusps.add(normalizedCusp);
  });

  // Verificar que existe la cúspide 10 (MC)
  const house10 = data.houses.find(h => h.number === 10);
  if (!house10) {
    throw new ChartDataValidationError('house 10 (MC) is required');
  }

  // Validar planets
  if (!Array.isArray(data.planets)) {
    throw new ChartDataValidationError('planets must be an array');
  }

  if (data.planets.length === 0) {
    throw new ChartDataValidationError('planets array cannot be empty');
  }

  const planetNames = new Set<string>();

  data.planets.forEach((planet, idx) => {
    if (!planet.name || typeof planet.name !== 'string') {
      throw new ChartDataValidationError(`planets[${idx}].name must be a non-empty string`);
    }

    if (planetNames.has(planet.name)) {
      throw new ChartDataValidationError(`duplicate planet name: ${planet.name}`);
    }
    planetNames.add(planet.name);

    if (typeof planet.longitude !== 'number') {
      throw new ChartDataValidationError(`planets[${idx}].longitude must be a number, got ${typeof planet.longitude}`);
    }

    if (planet.longitude < 0 || planet.longitude >= 360) {
      throw new ChartDataValidationError(
        `planets[${idx}].longitude must be in range [0, 360), got ${planet.longitude}`
      );
    }
  });

  // Validar points (opcional)
  if (data.points) {
    if (!Array.isArray(data.points)) {
      throw new ChartDataValidationError('points must be an array');
    }

    data.points.forEach((point, idx) => {
      if (!point.name) {
        throw new ChartDataValidationError(`points[${idx}].name is required`);
      }

      const validNames: SpecialPointName[] = ['Node', 'Lilith', 'Fortune', 'Chiron', 'Vertex'];
      if (!validNames.includes(point.name)) {
        throw new ChartDataValidationError(
          `points[${idx}].name must be one of ${validNames.join(', ')}, got ${point.name}`
        );
      }

      if (typeof point.longitude !== 'number') {
        throw new ChartDataValidationError(`points[${idx}].longitude must be a number`);
      }

      if (point.longitude < 0 || point.longitude >= 360) {
        throw new ChartDataValidationError(
          `points[${idx}].longitude must be in range [0, 360), got ${point.longitude}`
        );
      }
    });
  }

  // Validar aspects (opcional)
  if (data.aspects) {
    if (!Array.isArray(data.aspects)) {
      throw new ChartDataValidationError('aspects must be an array');
    }

    const allNames = new Set([...planetNames, ...(data.points?.map(p => p.name) || [])]);

    data.aspects.forEach((aspect, idx) => {
      if (!aspect.planet1 || typeof aspect.planet1 !== 'string') {
        throw new ChartDataValidationError(`aspects[${idx}].planet1 must be a non-empty string`);
      }

      if (!aspect.planet2 || typeof aspect.planet2 !== 'string') {
        throw new ChartDataValidationError(`aspects[${idx}].planet2 must be a non-empty string`);
      }

      if (!allNames.has(aspect.planet1)) {
        throw new ChartDataValidationError(
          `aspects[${idx}].planet1 "${aspect.planet1}" not found in planets or points`
        );
      }

      if (!allNames.has(aspect.planet2)) {
        throw new ChartDataValidationError(
          `aspects[${idx}].planet2 "${aspect.planet2}" not found in planets or points`
        );
      }

      const validTypes: AspectType[] = ['conjunction', 'opposition', 'square', 'trine', 'sextil'];
      if (!validTypes.includes(aspect.type)) {
        throw new ChartDataValidationError(
          `aspects[${idx}].type must be one of ${validTypes.join(', ')}, got ${aspect.type}`
        );
      }

      if (typeof aspect.orb !== 'number' || aspect.orb < 0) {
        throw new ChartDataValidationError(`aspects[${idx}].orb must be a non-negative number, got ${aspect.orb}`);
      }
    });
  }
}

/**
 * Valida los datos de forma segura, retornando un objeto con el resultado
 */
export function safeValidateChartData(data: ChartData): { valid: boolean; error?: string } {
  try {
    validateChartData(data);
    return { valid: true };
  } catch (error) {
    if (error instanceof ChartDataValidationError) {
      return { valid: false, error: error.message };
    }
    return { valid: false, error: 'Unknown validation error' };
  }
}
