/**
 * Calculador de Análisis de Hemisferios
 * 
 * Analiza la distribución de planetas en los 4 hemisferios de la carta natal:
 * - Oriental (Este) vs Occidental (Oeste) - Eje Ascendente-Descendente
 * - Septentrional (Norte) vs Meridional (Sur) - Eje MC-IC
 * 
 * Esta distribución revela tendencias de personalidad y orientación vital.
 */

export interface HemisphereAnalysis {
  hemisphere: 'oriental' | 'occidental' | 'septentrional' | 'meridional';
  name: string;
  planetCount: number;
  planets: string[];
  percentage: number;
  description: string;
  interpretation: string;
}

export interface QuadrantAnalysis {
  quadrant: 1 | 2 | 3 | 4;
  name: string;
  planetCount: number;
  planets: string[];
  percentage: number;
  houses: number[];
  description: string;
  interpretation: string;
}

export interface HemispheresResult {
  horizontalAxis: {
    oriental: HemisphereAnalysis;
    occidental: HemisphereAnalysis;
    emphasis: 'oriental' | 'occidental' | 'equilibrado';
  };
  verticalAxis: {
    septentrional: HemisphereAnalysis;
    meridional: HemisphereAnalysis;
    emphasis: 'septentrional' | 'meridional' | 'equilibrado';
  };
  quadrants: QuadrantAnalysis[];
  dominantQuadrant: QuadrantAnalysis;
  summary: string;
}

/**
 * Determina en qué hemisferio horizontal está un planeta
 * Oriental (Este): Casas 10-11-12-1-2-3 (desde MC hasta Descendente)
 * Occidental (Oeste): Casas 4-5-6-7-8-9 (desde IC hasta Ascendente)
 */
function getHorizontalHemisphere(house: number): 'oriental' | 'occidental' {
  // Casas 10, 11, 12, 1, 2, 3 = Oriental (Este)
  // Casas 4, 5, 6, 7, 8, 9 = Occidental (Oeste)
  if (house >= 10 || house <= 3) {
    return 'oriental';
  } else {
    return 'occidental';
  }
}

/**
 * Determina en qué hemisferio vertical está un planeta
 * Septentrional (Norte): Casas 1-2-3-4-5-6 (bajo el horizonte)
 * Meridional (Sur): Casas 7-8-9-10-11-12 (sobre el horizonte)
 */
function getVerticalHemisphere(house: number): 'septentrional' | 'meridional' {
  // Casas 1-6 = Septentrional (Norte, bajo horizonte)
  // Casas 7-12 = Meridional (Sur, sobre horizonte)
  if (house <= 6) {
    return 'septentrional';
  } else {
    return 'meridional';
  }
}

/**
 * Determina en qué cuadrante está un planeta
 * Cuadrante I: Casas 1-2-3 (Oriental + Septentrional)
 * Cuadrante II: Casas 10-11-12 (Oriental + Meridional)
 * Cuadrante III: Casas 7-8-9 (Occidental + Meridional)
 * Cuadrante IV: Casas 4-5-6 (Occidental + Septentrional)
 */
function getQuadrant(house: number): 1 | 2 | 3 | 4 {
  if (house >= 1 && house <= 3) return 1;
  if (house >= 10 && house <= 12) return 2;
  if (house >= 7 && house <= 9) return 3;
  if (house >= 4 && house <= 6) return 4;
  return 1; // fallback
}

/**
 * Calcula el análisis de hemisferios
 */
export async function calculateHemispheres(
  planets: { name: string; house: number }[]
): Promise<HemispheresResult> {
  const totalPlanets = planets.length;

  // Inicializar contadores
  const oriental: string[] = [];
  const occidental: string[] = [];
  const septentrional: string[] = [];
  const meridional: string[] = [];

  const quadrant1: string[] = [];
  const quadrant2: string[] = [];
  const quadrant3: string[] = [];
  const quadrant4: string[] = [];

  // Clasificar planetas
  planets.forEach((planet) => {
    const house = planet.house;
    const name = planet.name;

    // Hemisferios horizontales
    if (getHorizontalHemisphere(house) === 'oriental') {
      oriental.push(name);
    } else {
      occidental.push(name);
    }

    // Hemisferios verticales
    if (getVerticalHemisphere(house) === 'septentrional') {
      septentrional.push(name);
    } else {
      meridional.push(name);
    }

    // Cuadrantes
    const quadrant = getQuadrant(house);
    if (quadrant === 1) quadrant1.push(name);
    else if (quadrant === 2) quadrant2.push(name);
    else if (quadrant === 3) quadrant3.push(name);
    else if (quadrant === 4) quadrant4.push(name);
  });

  // Calcular porcentajes
  const orientalPercent = (oriental.length / totalPlanets) * 100;
  const occidentalPercent = (occidental.length / totalPlanets) * 100;
  const septentrionalPercent = (septentrional.length / totalPlanets) * 100;
  const meridionalPercent = (meridional.length / totalPlanets) * 100;

  // Determinar énfasis
  const horizontalEmphasis = 
    Math.abs(orientalPercent - occidentalPercent) < 20 
      ? 'equilibrado' 
      : orientalPercent > occidentalPercent 
        ? 'oriental' 
        : 'occidental';

  const verticalEmphasis = 
    Math.abs(septentrionalPercent - meridionalPercent) < 20 
      ? 'equilibrado' 
      : septentrionalPercent > meridionalPercent 
        ? 'septentrional' 
        : 'meridional';

  // Crear análisis de hemisferios
  const orientalAnalysis: HemisphereAnalysis = {
    hemisphere: 'oriental',
    name: 'Oriental (Este)',
    planetCount: oriental.length,
    planets: oriental,
    percentage: orientalPercent,
    description: 'Hemisferio del amanecer - Desde MC hasta Descendente (Casas 10-3)',
    interpretation: oriental.length > totalPlanets / 2
      ? 'Personalidad AUTO-DETERMINADA. Tendencia a crear tu propio destino, iniciativa personal, independencia. Las circunstancias se pliegan a tu voluntad.'
      : 'Menor influencia oriental. Más receptivo a las circunstancias externas.'
  };

  const occidentalAnalysis: HemisphereAnalysis = {
    hemisphere: 'occidental',
    name: 'Occidental (Oeste)',
    planetCount: occidental.length,
    planets: occidental,
    percentage: occidentalPercent,
    description: 'Hemisferio del ocaso - Desde IC hasta Ascendente (Casas 4-9)',
    interpretation: occidental.length > totalPlanets / 2
      ? 'Personalidad RELACIONAL. Tendencia a definirte a través de otros, colaboración, dependencia de relaciones. Tu destino está ligado a asociaciones.'
      : 'Menor influencia occidental. Más independiente en tus decisiones.'
  };

  const septentrionalAnalysis: HemisphereAnalysis = {
    hemisphere: 'septentrional',
    name: 'Septentrional (Norte)',
    planetCount: septentrional.length,
    planets: septentrional,
    percentage: septentrionalPercent,
    description: 'Hemisferio nocturno - Bajo el horizonte (Casas 1-6)',
    interpretation: septentrional.length > totalPlanets / 2
      ? 'Orientación SUBJETIVA e INTERNA. Vida privada, introspección, desarrollo personal. Mayor importancia a lo íntimo que a lo público.'
      : 'Menor énfasis interno. Más orientado hacia el mundo exterior.'
  };

  const meridionalAnalysis: HemisphereAnalysis = {
    hemisphere: 'meridional',
    name: 'Meridional (Sur)',
    planetCount: meridional.length,
    planets: meridional,
    percentage: meridionalPercent,
    description: 'Hemisferio diurno - Sobre el horizonte (Casas 7-12)',
    interpretation: meridional.length > totalPlanets / 2
      ? 'Orientación OBJETIVA y EXTERNA. Vida pública, reconocimiento social, proyección en el mundo. Mayor importancia a lo colectivo.'
      : 'Menor énfasis externo. Más centrado en el mundo interior.'
  };

  // Análisis de cuadrantes
  const quadrants: QuadrantAnalysis[] = [
    {
      quadrant: 1,
      name: 'Cuadrante I (Este-Norte)',
      planetCount: quadrant1.length,
      planets: quadrant1,
      percentage: (quadrant1.length / totalPlanets) * 100,
      houses: [1, 2, 3],
      description: 'Oriental + Septentrional',
      interpretation: 'AUTO-CONSCIENCIA. Desarrollo del yo, iniciativa personal en el mundo privado. "Yo soy".'
    },
    {
      quadrant: 2,
      name: 'Cuadrante II (Este-Sur)',
      planetCount: quadrant2.length,
      planets: quadrant2,
      percentage: (quadrant2.length / totalPlanets) * 100,
      houses: [10, 11, 12],
      description: 'Oriental + Meridional',
      interpretation: 'AUTO-PROYECCIÓN. Manifestación del yo en el mundo, carrera, objetivos. "Yo hago".'
    },
    {
      quadrant: 3,
      name: 'Cuadrante III (Oeste-Sur)',
      planetCount: quadrant3.length,
      planets: quadrant3,
      percentage: (quadrant3.length / totalPlanets) * 100,
      houses: [7, 8, 9],
      description: 'Occidental + Meridional',
      interpretation: 'CONSCIENCIA UNIVERSAL. Relaciones públicas, colaboración social, expandir horizontes. "Nosotros somos".'
    },
    {
      quadrant: 4,
      name: 'Cuadrante IV (Oeste-Norte)',
      planetCount: quadrant4.length,
      planets: quadrant4,
      percentage: (quadrant4.length / totalPlanets) * 100,
      houses: [4, 5, 6],
      description: 'Occidental + Septentrional',
      interpretation: 'CONSCIENCIA SUBJETIVA. Hogar, familia, servicio. Desarrollo a través de vínculos íntimos. "Nosotros hacemos".'
    }
  ];

  // Determinar cuadrante dominante
  const dominantQuadrant = quadrants.reduce((prev, current) => 
    current.planetCount > prev.planetCount ? current : prev
  );

  // Generar resumen
  const summary = generateSummary(
    horizontalEmphasis,
    verticalEmphasis,
    dominantQuadrant
  );

  return {
    horizontalAxis: {
      oriental: orientalAnalysis,
      occidental: occidentalAnalysis,
      emphasis: horizontalEmphasis
    },
    verticalAxis: {
      septentrional: septentrionalAnalysis,
      meridional: meridionalAnalysis,
      emphasis: verticalEmphasis
    },
    quadrants,
    dominantQuadrant,
    summary
  };
}

/**
 * Genera un resumen interpretativo del análisis
 */
function generateSummary(
  horizontalEmphasis: string,
  verticalEmphasis: string,
  dominantQuadrant: QuadrantAnalysis
): string {
  let summary = '';

  // Horizontal
  if (horizontalEmphasis === 'oriental') {
    summary += '🌅 Tu carta muestra un fuerte énfasis ORIENTAL (Este), indicando una personalidad auto-determinada e independiente. ';
  } else if (horizontalEmphasis === 'occidental') {
    summary += '🌇 Tu carta muestra un fuerte énfasis OCCIDENTAL (Oeste), indicando una personalidad relacional que se desarrolla a través de otros. ';
  } else {
    summary += '⚖️ Tu carta muestra equilibrio en el eje horizontal (Este-Oeste), combinando independencia con capacidad relacional. ';
  }

  // Vertical
  if (verticalEmphasis === 'septentrional') {
    summary += '🌙 El énfasis SEPTENTRIONAL (Norte) revela una orientación hacia la vida privada e interior. ';
  } else if (verticalEmphasis === 'meridional') {
    summary += '☀️ El énfasis MERIDIONAL (Sur) revela una orientación hacia la vida pública y el reconocimiento social. ';
  } else {
    summary += '⚖️ Equilibrio en el eje vertical (Norte-Sur) indica balance entre vida pública y privada. ';
  }

  // Cuadrante dominante
  summary += `\n\n🎯 El Cuadrante ${dominantQuadrant.quadrant} es el más activo con ${dominantQuadrant.planetCount} planetas (${dominantQuadrant.percentage.toFixed(1)}%). ${dominantQuadrant.interpretation}`;

  return summary;
}
