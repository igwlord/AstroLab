import React from 'react';
import type { ChartWithStatus } from '../services/chartStorage';

interface NatalChartWheelProps {
  chart: ChartWithStatus;
  size?: number;
  className?: string;
}

/**
 * NATAL CHART WHEEL - Representación gráfica de la carta natal
 * 
 * Sistema de coordenadas (ZODÍACO FIJO - convención Astro.com/tradicional):
 * - 0° ARIES = 9:00 posición (lado izquierdo)
 * - Zodíaco FIJO: Aries siempre a la izquierda, crece antihorario
 * - Casas ROTAN según hora de nacimiento (longitudes eclípticas absolutas)
 * - ASC (Casa 1) marca el horizonte este en el momento del nacimiento
 * - MC (Casa 10) marca la culminación del meridiano
 * 
 * Anillos (desde el centro hacia afuera):
 * 1. Centro: Información de la persona
 * 2. Anillo interior: Planetas posicionados por longitud eclíptica
 * 3. Anillo medio: Casas astrológicas (1-12) con cúspides reales
 * 4. Anillo exterior: Signos zodiacales (Aries-Piscis) FIJOS
 */
const NatalChartWheel: React.FC<NatalChartWheelProps> = React.memo(({ 
  chart,
  size = 600,
  className = ''
}) => {
  // ============================================
  // CONSTANTES DE DISEÑO
  // ============================================
  
  const CENTER_X = React.useMemo(() => size / 2, [size]);
  const CENTER_Y = React.useMemo(() => size / 2, [size]);
  
  // Radios de los círculos concéntricos (en porcentaje del tamaño)
  const RADIUS_INNER = React.useMemo(() => size * 0.15, [size]);      // Centro (15%)
  const RADIUS_PLANETS = React.useMemo(() => size * 0.25, [size]);    // Zona de planetas (25%)
  const RADIUS_HOUSES = React.useMemo(() => size * 0.35, [size]);     // Líneas de casas (35%)
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
        {/* FASE 3: CASAS ASTROLÓGICAS */}
        {/* ============================================ */}
        {chart.data.houses.map((house) => {
          const cuspAbs = normalize(house.cusp); // Longitud eclíptica absoluta (0° Aries)
          const cuspRad = absToRad(cuspAbs);
          
          // Línea de cúspide: desde el centro hasta el círculo de signos
          const cuspOuterX = CENTER_X + RADIUS_SIGNS_INNER * Math.cos(cuspRad);
          const cuspOuterY = CENTER_Y - RADIUS_SIGNS_INNER * Math.sin(cuspRad);
          
          // Determinar si es una cúspide angular (1, 4, 7, 10)
          const isAngular = [1, 4, 7, 10].includes(house.number);
          const isASC = house.number === 1; // Ascendente
          const isMC = house.number === 10; // Medio Cielo
          
          // Color y grosor según tipo
          let strokeColor = '#a78bfa';
          let strokeWidth = 1;
          let opacity = 0.5;
          
          if (isASC || isMC) {
            strokeColor = '#fbbf24'; // Dorado para ASC y MC
            strokeWidth = 3;
            opacity = 1;
          } else if (isAngular) {
            strokeColor = '#c084fc';
            strokeWidth = 2;
            opacity = 0.7;
          }
          
          // Calcular MIDPOINT robusto con wrap-around 0°/360°
          const nextN = (house.number % 12) + 1;
          const nextAbs = normalize(getCusp(nextN));
          const span = deltaPos(cuspAbs, nextAbs);      // Ancho angular de la casa (siempre positivo)
          const midAbs = normalize(cuspAbs + span / 2);  // Punto medio absoluto
          
          const numberRadius = RADIUS_HOUSES * 0.85;
          const numberRad = absToRad(midAbs);
          const numberX = CENTER_X + numberRadius * Math.cos(numberRad);
          const numberY = CENTER_Y - numberRadius * Math.sin(numberRad);
          
          return (
            <g key={`house-${house.number}`}>
              {/* Línea de cúspide */}
              <line
                x1={CENTER_X}
                y1={CENTER_Y}
                x2={cuspOuterX}
                y2={cuspOuterY}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                opacity={opacity}
              />
              
              {/* Número de casa */}
              <text
                x={numberX}
                y={numberY}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#e9d5ff"
                fontSize={size < 450 ? "10" : "12"}
                fontWeight={isAngular ? "bold" : "normal"}
                opacity="0.9"
              >
                {house.number}
              </text>
              
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
        {/* FASE 5: ASPECTOS (líneas entre planetas) */}
        {/* ============================================ */}
        {chart.data.aspects && chart.data.aspects.map((aspect, index) => {
          // Encontrar las posiciones de los dos planetas
          const planet1 = chart.data.planets.find(p => p.name === aspect.planet1);
          const planet2 = chart.data.planets.find(p => p.name === aspect.planet2);
          
          if (!planet1 || !planet2) return null;
          
          // Calcular coordenadas de ambos planetas (usando longitud eclíptica absoluta)
          const p1Rad = absToRad(planet1.longitude);
          const p1X = CENTER_X + RADIUS_PLANETS * Math.cos(p1Rad);
          const p1Y = CENTER_Y - RADIUS_PLANETS * Math.sin(p1Rad);
          
          const p2Rad = absToRad(planet2.longitude);
          const p2X = CENTER_X + RADIUS_PLANETS * Math.cos(p2Rad);
          const p2Y = CENTER_Y - RADIUS_PLANETS * Math.sin(p2Rad);
          
          // Colores según tipo de aspecto
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
          const opacity = Math.max(0.2, 1 - (Math.abs(aspect.orb) / maxOrb));
          
          // Grosor según importancia del aspecto
          let strokeWidth = 1;
          if (['conjunction', 'conjuncion', 'opposition', 'oposicion'].includes(aspect.type.toLowerCase())) {
            strokeWidth = 2;
          } else if (['trine', 'trigono', 'square', 'cuadratura'].includes(aspect.type.toLowerCase())) {
            strokeWidth = 1.5;
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
              opacity={opacity * 0.4} // Reducir opacidad general para no saturar
              strokeDasharray={aspect.type.toLowerCase().includes('sextil') ? '5,3' : ''}
            />
          );
        })}
        
        {/* ============================================ */}
        {/* FASE 4: PLANETAS */}
        {/* ============================================ */}
        {chart.data.planets.map((planet) => {
          // Longitud eclíptica absoluta (0° Aries)
          const planetRad = absToRad(planet.longitude);
          
          // Posición del planeta en el círculo de planetas
          const planetX = CENTER_X + RADIUS_PLANETS * Math.cos(planetRad);
          const planetY = CENTER_Y - RADIUS_PLANETS * Math.sin(planetRad);
          
          // Obtener símbolo y color
          const symbol = planetSymbols[planet.name] || '?';
          const color = planetColors[planet.name] || '#ffffff';
          
          // Tamaño según jerarquía
          let fontSize = 14;
          if (planet.name === 'Sol' || planet.name === 'Luna') {
            fontSize = size < 450 ? 16 : 20;
          } else if (['Mercurio', 'Venus', 'Marte'].includes(planet.name)) {
            fontSize = size < 450 ? 14 : 18;
          } else if (['Júpiter', 'Saturno'].includes(planet.name)) {
            fontSize = size < 450 ? 12 : 16;
          } else {
            fontSize = size < 450 ? 10 : 14;
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
                  <tspan fontSize={fontSize * 0.6} dy="-0.5em">℞</tspan>
                )}
              </text>
              
              {/* Grado del planeta (opcional, pequeño) */}
              <text
                x={planetX}
                y={planetY + (fontSize * 0.8)}
                textAnchor="middle"
                fill={color}
                fontSize={size < 450 ? "7" : "8"}
                opacity="0.6"
              >
                {Math.floor(planet.degree)}°
              </text>
            </g>
          );
        })}
        
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
