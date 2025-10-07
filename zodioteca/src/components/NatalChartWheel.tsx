import React, { useRef } from 'react';
import type { NatalChartWheelProps } from '../types/chartWheel';
import { validateChartData } from '../types/chartWheel';
import { 
  normalize, 
  deltaPos, 
  absToRad, 
  mid, 
  absToCoords, 
  degMin, 
  getSignIndex, 
  getSignSymbol 
} from '../utils/chartGeometry';
import { 
  getTheme, 
  PLANET_SYMBOLS, 
  SPECIAL_POINT_SYMBOLS, 
  getPlanetColor 
} from '../utils/chartThemes';

/**
 * NATAL CHART WHEEL - Representación gráfica de la carta natal
 * 
 * Sistema de coordenadas (ZODÍACO FIJO - convención Astro-Seek):
 * - 0° ARIES = 9:00 posición (lado izquierdo), aumenta ANTIHORARIO
 * - Zodíaco FIJO: Aries siempre a la izquierda
 * - Casas ROTAN según hora/lugar de nacimiento (longitudes eclípticas absolutas)
 * - ASC (Casa 1) marca el horizonte este; MC (Casa 10) marca la culminación
 * 
 * Radios (según PLAN_MAESTRO_RUEDA_ASTRO_SEEK.md):
 * - inner: 0.32, aspects: 0.52, planets: 0.60, houseNum: 0.72
 * - signsIn: 0.84, signsOut: 0.92, ticksIn: 0.93, ticksOut: 1.00
 */
const NatalChartWheel: React.FC<NatalChartWheelProps> = React.memo(({ 
  data,
  size = 640,
  theme = 'violet',
  mode = 'zodiacFixed',
  planetLabels = 'none',
  debug = false
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  // Validar datos al montar
  React.useEffect(() => {
    try {
      validateChartData(data);
    } catch (error) {
      console.error('[NatalChartWheel] Validation error:', error);
    }
  }, [data]);
  // ============================================
  // CONSTANTES DE DISEÑO
  // ============================================
  
  const CENTER_X = React.useMemo(() => size / 2, [size]);
  const CENTER_Y = React.useMemo(() => size / 2, [size]);
  
  // Radios de los círculos concéntricos (CORREGIDO según Astro-Seek)
  const RADIUS_INNER = React.useMemo(() => size * 0.15, [size]);       // Centro vacío (15%)
  const RADIUS_PLANETS = React.useMemo(() => size * 0.25, [size]);     // Planetas CERCA del centro (25%)
  const RADIUS_HOUSES = React.useMemo(() => size * 0.35, [size]);      // Números de casas MÁS AFUERA (35%)
  const RADIUS_SIGNS_INNER = React.useMemo(() => size * 0.40, [size]); // Borde interno signos (40%)
  const RADIUS_SIGNS_OUTER = React.useMemo(() => size * 0.48, [size]); // Borde externo signos (48%)
  
  // ============================================
  // FUNCIONES DE CONVERSIÓN DE COORDENADAS
  // ============================================
  
  /**
   * Normaliza grados al rango [0, 360)
   */
  const normalize = (deg: number): number => ((deg % 360) + 360) % 360;
  
  /**
   * Calcula diferencia angular positiva (ancho de arco desde "from" hasta "to")
   * Siempre retorna valor positivo [0, 360)
   */
  const deltaPos = (from: number, to: number): number => normalize(to - from);
  
  /**
   * Busca cúspide por número de casa (1-12)
   * @returns Longitud eclíptica absoluta (0° Aries) o 0 si no existe
   */
  const getCusp = (houseNumber: number): number => 
    chart.data.houses.find(h => h.number === houseNumber)?.cusp ?? 0;
  
  /**
   * Convierte longitud eclíptica ABSOLUTA (0° Aries) a radianes para SVG
   * Sistema: 0° Aries a la IZQUIERDA (9h), crece antihorario
   * Compatible con Astro.com y convención clásica (zodíaco fijo)
   */
  const absToRad = (absoluteDegree: number): number => {
    // 0° Aries absoluto = 180° matemático (izquierda en SVG)
    const mathDegree = 180 - normalize(absoluteDegree);
    return (mathDegree * Math.PI) / 180;
  };
  
  // ============================================
  // DATOS DE LOS SIGNOS ZODIACALES
  // ============================================
  
  const zodiacSigns = [
    { name: 'Aries', symbol: '♈', color: '#E53935' },
    { name: 'Tauro', symbol: '♉', color: '#FB8C00' },
    { name: 'Géminis', symbol: '♊', color: '#FDD835' },
    { name: 'Cáncer', symbol: '♋', color: '#7CB342' },
    { name: 'Leo', symbol: '♌', color: '#43A047' },
    { name: 'Virgo', symbol: '♍', color: '#00897B' },
    { name: 'Libra', symbol: '♎', color: '#00ACC1' },
    { name: 'Escorpio', symbol: '♏', color: '#1E88E5' },
    { name: 'Sagitario', symbol: '♐', color: '#3949AB' },
    { name: 'Capricornio', symbol: '♑', color: '#5E35B1' },
    { name: 'Acuario', symbol: '♒', color: '#8E24AA' },
    { name: 'Piscis', symbol: '♓', color: '#D81B60' },
  ];
  
  // ============================================
  // SÍMBOLOS Y COLORES DE PLANETAS
  // ============================================
  
  const planetSymbols: { [key: string]: string } = {
    'Sol': '☉',
    'Luna': '☽',
    'Mercurio': '☿',
    'Venus': '♀',
    'Marte': '♂',
    'Júpiter': '♃',
    'Saturno': '♄',
    'Urano': '♅',
    'Neptuno': '♆',
    'Plutón': '♇'
  };
  
  const planetColors: { [key: string]: string } = {
    'Sol': '#FFD700',
    'Luna': '#C0C0C0',
    'Mercurio': '#FFA500',
    'Venus': '#FF69B4',
    'Marte': '#FF4444',
    'Júpiter': '#4169E1',
    'Saturno': '#8B7355',
    'Urano': '#00CED1',
    'Neptuno': '#9370DB',
    'Plutón': '#8B0000'
  };
  
  // ============================================
  // RENDERIZADO
  // ============================================
  
  return (
    <div className={`relative mx-auto ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="drop-shadow-2xl"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ============================================ */}
        {/* FONDO Y GRADIENTES */}
        {/* ============================================ */}
        
        <defs>
          {/* Gradiente radial de fondo */}
          <radialGradient id="bgGradient">
            <stop offset="0%" stopColor="#1a1a2e" stopOpacity="0.3" />
            <stop offset="70%" stopColor="#0f0f1e" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#0a0a18" stopOpacity="0.95" />
          </radialGradient>
          
          {/* Filtro de brillo para símbolos */}
          <filter id="symbolGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2.5" result="blur"/>
            <feFlood floodColor="#bfaaff" floodOpacity="0.7"/>
            <feComposite in2="blur" operator="in" result="glowColor"/>
            <feMerge>
              <feMergeNode in="glowColor"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          {/* Filtro de brillo dorado para Sol */}
          <filter id="goldenGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="5" result="blur"/>
            <feFlood floodColor="#FFD700" floodOpacity="0.8"/>
            <feComposite in2="blur" operator="in" result="glowColor"/>
            <feMerge>
              <feMergeNode in="glowColor"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          {/* Filtro de brillo plateado para Luna */}
          <filter id="silverGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur"/>
            <feFlood floodColor="#C0C0C0" floodOpacity="0.6"/>
            <feComposite in2="blur" operator="in" result="glowColor"/>
            <feMerge>
              <feMergeNode in="glowColor"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Fondo circular con gradiente */}
        <circle
          cx={CENTER_X}
          cy={CENTER_Y}
          r={RADIUS_SIGNS_OUTER}
          fill="url(#bgGradient)"
          stroke="#8b5cf6"
          strokeWidth="2"
          opacity="0.9"
        />
        
        {/* ============================================ */}
        {/* CÍRCULOS CONCÉNTRICOS GUÍA */}
        {/* ============================================ */}
        
        {/* Círculo interior (centro) */}
        <circle
          cx={CENTER_X}
          cy={CENTER_Y}
          r={RADIUS_INNER}
          fill="none"
          stroke="#6b21a8"
          strokeWidth="1"
          opacity="0.3"
        />
        
        {/* Círculo de planetas */}
        <circle
          cx={CENTER_X}
          cy={CENTER_Y}
          r={RADIUS_PLANETS}
          fill="none"
          stroke="#7c3aed"
          strokeWidth="1"
          opacity="0.4"
        />
        
        {/* Círculo de casas */}
        <circle
          cx={CENTER_X}
          cy={CENTER_Y}
          r={RADIUS_HOUSES}
          fill="none"
          stroke="#8b5cf6"
          strokeWidth="2"
          opacity="0.5"
        />
        
        {/* Círculo interno de signos */}
        <circle
          cx={CENTER_X}
          cy={CENTER_Y}
          r={RADIUS_SIGNS_INNER}
          fill="none"
          stroke="#a78bfa"
          strokeWidth="2"
          opacity="0.6"
        />
        
        {/* Círculo externo de signos */}
        <circle
          cx={CENTER_X}
          cy={CENTER_Y}
          r={RADIUS_SIGNS_OUTER}
          fill="none"
          stroke="#8b5cf6"
          strokeWidth="2"
          opacity="0.8"
        />
        
        {/* ============================================ */}
        {/* GRADUACIÓN PROFESIONAL (Estilo Astro-Seek) */}
        {/* ============================================ */}
        <g id="degree-ticks" opacity="0.7">
          {/* Configuración visual de ticks */}
          {(() => {
            const TICK_COLOR = '#a78bfa';
            const MINOR_LEN  = Math.max(3, size * 0.010);  // Tick cada 5°
            const MAJOR_LEN  = Math.max(6, size * 0.020);  // Tick cada 10°
            const TICK_W     = 0.6;
            const TICK_BASE_OPAC = 0.5;
            
            // Radio base: borde EXTERNO de signos (hacia AFUERA como Astro-Seek)
            const TICKS_R_BASE = RADIUS_SIGNS_OUTER;
            
            return (
              <>
                {/* Ticks cada 5° (72 ticks totales: 360/5 = 72) */}
                {Array.from({ length: 72 }, (_, i) => {
                  const absDeg = i * 5; // Solo cada 5°
                  const degInSign = absDeg % 30; // Grado dentro del signo (0-29)
                  
                  // Determinar tipo de tick
                  const is10 = degInSign % 10 === 0;
                  
                  const len = is10 ? MAJOR_LEN : MINOR_LEN;
                  const opacity = TICK_BASE_OPAC * (is10 ? 1.3 : 1);
                  
                  const rad = absToRad(absDeg);
                  
                  // Tick hacia AFUERA desde el borde externo de signos (como Astro-Seek)
                  const xInner = CENTER_X + TICKS_R_BASE * Math.cos(rad);
                  const yInner = CENTER_Y - TICKS_R_BASE * Math.sin(rad);
                  const xOuter = CENTER_X + (TICKS_R_BASE + len) * Math.cos(rad);
                  const yOuter = CENTER_Y - (TICKS_R_BASE + len) * Math.sin(rad);
                  
                  return (
                    <line
                      key={`tick-${absDeg}`}
                      x1={xInner}
                      y1={yInner}
                      x2={xOuter}
                      y2={yOuter}
                      stroke={TICK_COLOR}
                      strokeWidth={is10 ? TICK_W * 1.4 : TICK_W}
                      opacity={opacity}
                    />
                  );
                })}
              </>
            );
          })()}
        </g>
        
        {/* ============================================ */}
        {/* FASE 2: SIGNOS ZODIACALES (Zodíaco Fijo) */}
        {/* ============================================ */}
        {zodiacSigns.map((sign, index) => {
          const startAbs = index * 30; // Cada signo ocupa 30° (0° Aries, 30° Tauro, ...)
          const midAbs = startAbs + 15; // Punto medio del signo
          
          // Calcular posiciones para las líneas divisorias
          const startRad = absToRad(startAbs);
          const innerX = CENTER_X + RADIUS_SIGNS_INNER * Math.cos(startRad);
          const innerY = CENTER_Y - RADIUS_SIGNS_INNER * Math.sin(startRad);
          const outerX = CENTER_X + RADIUS_SIGNS_OUTER * Math.cos(startRad);
          const outerY = CENTER_Y - RADIUS_SIGNS_OUTER * Math.sin(startRad);
          
          // Calcular posición del símbolo (en el medio del segmento)
          const symbolRadius = (RADIUS_SIGNS_INNER + RADIUS_SIGNS_OUTER) / 2;
          const symbolRad = absToRad(midAbs);
          const symbolX = CENTER_X + symbolRadius * Math.cos(symbolRad);
          const symbolY = CENTER_Y - symbolRadius * Math.sin(symbolRad);
          
          return (
            <g key={sign.name}>
              {/* Línea divisoria entre signos */}
              <line
                x1={innerX}
                y1={innerY}
                x2={outerX}
                y2={outerY}
                stroke={sign.color}
                strokeWidth="1"
                opacity="0.3"
              />
              
              {/* Símbolo del signo */}
              <text
                x={symbolX}
                y={symbolY}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={sign.color}
                fontSize={size < 450 ? "16" : "20"}
                fontWeight="bold"
                opacity="0.8"
                filter="url(#symbolGlow)"
              >
                {sign.symbol}
              </text>
            </g>
          );
        })}
        
        {/* ============================================ */}
        {/* FASE 3: CASAS ASTROLÓGICAS (Estilo Astro-Seek) */}
        {/* ============================================ */}
        {chart.data.houses.map((house) => {
          const cuspAbs = normalize(house.cusp); // Longitud eclíptica absoluta (0° Aries)
          const cuspRad = absToRad(cuspAbs);
          
          // Línea de cúspide: desde RADIUS_INNER hasta RADIUS_SIGNS_INNER (NO hasta el centro)
          const cuspInnerX = CENTER_X + RADIUS_INNER * Math.cos(cuspRad);
          const cuspInnerY = CENTER_Y - RADIUS_INNER * Math.sin(cuspRad);
          const cuspOuterX = CENTER_X + RADIUS_SIGNS_INNER * Math.cos(cuspRad);
          const cuspOuterY = CENTER_Y - RADIUS_SIGNS_INNER * Math.sin(cuspRad);
          
          // Determinar si es una cúspide angular (1, 4, 7, 10)
          const isAngular = [1, 4, 7, 10].includes(house.number);
          const isASC = house.number === 1; // Ascendente
          const isMC = house.number === 10; // Medio Cielo
          
          // Color y grosor según tipo (más visible como Astro-Seek)
          let strokeColor = '#a78bfa';
          let strokeWidth = 1.5;
          let opacity = 0.6;
          
          if (isASC || isMC) {
            strokeColor = '#fbbf24'; // Dorado para ASC y MC
            strokeWidth = 3.5;
            opacity = 1;
          } else if (isAngular) {
            strokeColor = '#c084fc';
            strokeWidth = 2.5;
            opacity = 0.8;
          }
          
          // Calcular MIDPOINT robusto con wrap-around 0°/360°
          const nextN = (house.number % 12) + 1;
          const nextAbs = normalize(getCusp(nextN));
          const span = deltaPos(cuspAbs, nextAbs);      // Ancho angular de la casa (siempre positivo)
          const midAbs = normalize(cuspAbs + span / 2);  // Punto medio absoluto
          
          // Números de casa ENTRE planetas y signos (como Astro-Seek)
          const numberRadius = (RADIUS_PLANETS + RADIUS_SIGNS_INNER) / 2;
          const numberRad = absToRad(midAbs);
          const numberX = CENTER_X + numberRadius * Math.cos(numberRad);
          const numberY = CENTER_Y - numberRadius * Math.sin(numberRad);
          
          return (
            <g key={`house-${house.number}`}>
              {/* Línea de cúspide (NO llega al centro) */}
              <line
                x1={cuspInnerX}
                y1={cuspInnerY}
                x2={cuspOuterX}
                y2={cuspOuterY}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                opacity={opacity}
              />
              
              {/* Número de casa con recuadro (estilo Astro-Seek) */}
              <g>
                {/* Recuadro de fondo */}
                <rect
                  x={numberX - (size < 450 ? 7 : 9)}
                  y={numberY - (size < 450 ? 7 : 9)}
                  width={size < 450 ? 14 : 18}
                  height={size < 450 ? 14 : 18}
                  fill="#1a1a2e"
                  stroke="#e9d5ff"
                  strokeWidth="0.5"
                  opacity="0.8"
                  rx="2"
                />
                {/* Número */}
                <text
                  x={numberX}
                  y={numberY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#e9d5ff"
                  fontSize={size < 450 ? "9" : "11"}
                  fontWeight={isAngular ? "bold" : "normal"}
                  opacity="1"
                >
                  {house.number}
                </text>
              </g>
              
              {/* Etiqueta especial para ASC */}
              {isASC && (
                <text
                  x={cuspOuterX + (size < 450 ? 15 : 20)}
                  y={cuspOuterY}
                  fill="#fbbf24"
                  fontSize={size < 450 ? "10" : "12"}
                  fontWeight="bold"
                  opacity="0.9"
                >
                  ASC
                </text>
              )}
              
              {/* Etiqueta especial para MC */}
              {isMC && (
                <text
                  x={cuspOuterX}
                  y={cuspOuterY - (size < 450 ? 15 : 20)}
                  textAnchor="middle"
                  fill="#fbbf24"
                  fontSize={size < 450 ? "10" : "12"}
                  fontWeight="bold"
                  opacity="0.9"
                >
                  MC
                </text>
              )}
            </g>
          );
        })}
        
        {/* ============================================ */}
        {/* FASE 5: ASPECTOS (Estilo Astro-Seek - muy sutiles) */}
        {/* ============================================ */}
        {chart.data.aspects && chart.data.aspects.map((aspect, index) => {
          // Encontrar las posiciones de los dos planetas
          const planet1 = chart.data.planets.find(p => p.name === aspect.planet1);
          const planet2 = chart.data.planets.find(p => p.name === aspect.planet2);
          
          if (!planet1 || !planet2) return null;
          
          // Calcular coordenadas de ambos planetas (ahora en el anillo exterior)
          const p1Rad = absToRad(planet1.longitude);
          const p1X = CENTER_X + RADIUS_PLANETS * Math.cos(p1Rad);
          const p1Y = CENTER_Y - RADIUS_PLANETS * Math.sin(p1Rad);
          
          const p2Rad = absToRad(planet2.longitude);
          const p2X = CENTER_X + RADIUS_PLANETS * Math.cos(p2Rad);
          const p2Y = CENTER_Y - RADIUS_PLANETS * Math.sin(p2Rad);
          
          // Colores según tipo de aspecto (más sutiles)
          const aspectColors: { [key: string]: string } = {
            'conjunction': '#FF0000',      // Rojo intenso
            'conjuncion': '#FF0000',
            'opposition': '#FF6B6B',       // Rojo claro
            'oposicion': '#FF6B6B',
            'trine': '#4ECDC4',            // Azul verdoso
            'trigono': '#4ECDC4',
            'square': '#FF9F1C',           // Naranja
            'cuadratura': '#FF9F1C',
            'sextile': '#95E1D3',          // Verde agua
            'sextil': '#95E1D3'
          };
          
          const color = aspectColors[aspect.type.toLowerCase()] || '#a78bfa';
          
          // Opacidad según orbe (más cercano al exacto = más opaco)
          const maxOrb = 10; // Orbe máximo típico
          const opacity = Math.max(0.15, 1 - (Math.abs(aspect.orb) / maxOrb));
          
          // Grosor más fino (estilo Astro-Seek)
          let strokeWidth = 0.8;
          if (['conjunction', 'conjuncion', 'opposition', 'oposicion'].includes(aspect.type.toLowerCase())) {
            strokeWidth = 1.2;
          } else if (['trine', 'trigono', 'square', 'cuadratura'].includes(aspect.type.toLowerCase())) {
            strokeWidth = 1;
          }
          
          return (
            <line
              key={`aspect-${index}`}
              x1={p1X}
              y1={p1Y}
              x2={p2X}
              y2={p2Y}
              stroke={color}
              strokeWidth={strokeWidth}
              opacity={opacity * 0.2} // MUY sutiles como Astro-Seek
              strokeDasharray={aspect.type.toLowerCase().includes('sextil') ? '5,3' : ''}
            />
          );
        })}
        
        {/* ============================================ */}
        {/* FASE 4: PLANETAS con ANTI-COLISIÓN (Estilo Astro-Seek) */}
        {/* ============================================ */}
        {(() => {
          // Función de anti-colisión: ajusta radios para planetas muy cercanos
          const planetsWithRadius = chart.data.planets.map((planet, index) => {
            let adjustedRadius = RADIUS_PLANETS;
            
            // Buscar planetas cercanos (dentro de 10° de diferencia)
            const nearbyPlanets = chart.data.planets.filter((other, otherIndex) => {
              if (index === otherIndex) return false;
              const diff = Math.abs(normalize(planet.longitude - other.longitude));
              return diff < 10 || diff > 350; // Muy cerca o al otro lado del 0°
            });
            
            // Si hay planetas cercanos, alternar radios para separarlos
            if (nearbyPlanets.length > 0) {
              const offset = (index % 3) * (size * 0.03); // Alternancia de radios
              adjustedRadius = RADIUS_PLANETS + offset;
            }
            
            return { ...planet, adjustedRadius };
          });
          
          return planetsWithRadius.map((planet) => {
            // Longitud eclíptica absoluta (0° Aries)
            const planetRad = absToRad(planet.longitude);
            
            // Posición del planeta con radio ajustado (anti-colisión)
            const planetX = CENTER_X + planet.adjustedRadius * Math.cos(planetRad);
            const planetY = CENTER_Y - planet.adjustedRadius * Math.sin(planetRad);
          
          // Obtener símbolo y color
          const symbol = planetSymbols[planet.name] || '?';
          const color = planetColors[planet.name] || '#ffffff';
          
          // Calcular signo zodiacal donde está el planeta
          const signIndex = Math.floor(planet.longitude / 30);
          const signSymbol = zodiacSigns[signIndex]?.symbol || '';
          
          // Calcular grados y minutos DENTRO DEL SIGNO (0-29°)
          const degreeInSign = planet.longitude % 30; // Grado dentro del signo
          const degrees = Math.floor(degreeInSign);
          const minutes = Math.floor((degreeInSign - degrees) * 60);
          
          // Tamaño según jerarquía (MÁS GRANDES como Astro-Seek)
          let fontSize = 14;
          let degreeSize = 8;
          if (planet.name === 'Sol' || planet.name === 'Luna') {
            fontSize = size < 450 ? 18 : 24;
            degreeSize = size < 450 ? 9 : 10;
          } else if (['Mercurio', 'Venus', 'Marte'].includes(planet.name)) {
            fontSize = size < 450 ? 16 : 20;
            degreeSize = size < 450 ? 8 : 9;
          } else if (['Júpiter', 'Saturno'].includes(planet.name)) {
            fontSize = size < 450 ? 14 : 18;
            degreeSize = size < 450 ? 7 : 8;
          } else {
            fontSize = size < 450 ? 12 : 16;
            degreeSize = size < 450 ? 7 : 8;
          }
          
          // Filtro especial para Sol y Luna
          let filter = '';
          if (planet.name === 'Sol') filter = 'url(#goldenGlow)';
          if (planet.name === 'Luna') filter = 'url(#silverGlow)';
          
          // Opacidad para planetas transpersonales
          const opacity = ['Urano', 'Neptuno', 'Plutón'].includes(planet.name) ? 0.7 : 1.0;
          
          return (
            <g key={`planet-${planet.name}`}>
              {/* Símbolo del planeta */}
              <text
                x={planetX}
                y={planetY}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={color}
                fontSize={fontSize}
                fontWeight="bold"
                opacity={opacity}
                filter={filter}
              >
                {symbol}
                {planet.retrograde && (
                  <tspan fontSize={fontSize * 0.5} dy="-0.5em">℞</tspan>
                )}
              </text>
              
              {/* Información completa: Grado + minutos + signo (como Astro-Seek) */}
              <text
                x={planetX}
                y={planetY + (fontSize * 0.9)}
                textAnchor="middle"
                fill={color}
                fontSize={degreeSize}
                opacity="0.8"
                fontWeight="500"
              >
                {degrees}° {signSymbol} {minutes}'
              </text>
            </g>
          );
        });
        })()}
        
        {/* ============================================ */}
        {/* TEXTO CENTRAL - Información de la persona */}
        {/* ============================================ */}
        
        <text
          x={CENTER_X}
          y={CENTER_Y - 10}
          textAnchor="middle"
          fill="#e9d5ff"
          fontSize={size < 450 ? "12" : "14"}
          fontWeight="bold"
          opacity="0.9"
        >
          {chart.data.personName}
        </text>
        <text
          x={CENTER_X}
          y={CENTER_Y + 10}
          textAnchor="middle"
          fill="#c4b5fd"
          fontSize={size < 450 ? "10" : "12"}
          opacity="0.7"
        >
          {new Date(chart.data.birthData.date).toLocaleDateString('es-ES', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
          })}
        </text>
        
      </svg>
      
      {/* Leyenda pequeña */}
      <div className="mt-2 text-center">
        <p className="text-xs text-purple-300 dark:text-purple-400">
          Carta Natal de {chart.data.personName}
        </p>
      </div>
    </div>
  );
});

NatalChartWheel.displayName = 'NatalChartWheel';

export default NatalChartWheel;
