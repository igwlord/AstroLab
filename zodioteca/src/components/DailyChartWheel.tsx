import React from 'react';

interface HouseCusp {
  house: number;
  degree: number; // Grado astrológico (0-360)
  sign: string;
}

export interface PlanetData {
  name: string;
  symbol: string;
  degree: number; // Grado astrológico (0-360)
  sign: string;
  retrograde?: boolean;
  color: string;
}

interface DailyChartWheelProps {
  size?: number;
  className?: string;
  // FASE 2: Casas astrológicas
  houses?: HouseCusp[];
  // FASE 3: Planetas
  planets?: PlanetData[];
}

/**
 * DAILY CHART WHEEL - Representación gráfica de la carta astrológica del día
 * 
 * Sistema de coordenadas:
 * - 0° = Ascendente (9:00 posición, lado izquierdo)
 * - 90° = Medio Cielo (12:00 posición, arriba)
 * - 180° = Descendente (3:00 posición, lado derecho)
 * - 270° = Fondo del Cielo (6:00 posición, abajo)
 * 
 * Anillos (desde el centro hacia afuera):
 * 1. Centro: Información del día
 * 2. Anillo interior: Planetas posicionados
 * 3. Anillo medio: Casas astrológicas (1-12)
 * 4. Anillo exterior: Signos zodiacales (Aries-Piscis)
 */
const DailyChartWheel: React.FC<DailyChartWheelProps> = ({ 
  size = 600,
  className = '',
  houses = [],
  planets = []
}) => {
  // ============================================
  // CONSTANTES DE DISEÑO
  // ============================================
  
  const CENTER_X = size / 2;
  const CENTER_Y = size / 2;
  
  // Radios de los círculos concéntricos (en porcentaje del tamaño)
  const RADIUS_INNER = size * 0.15;      // Centro (15%)
  const RADIUS_PLANETS = size * 0.25;    // Zona de planetas (25%)
  const RADIUS_HOUSES = size * 0.35;     // Líneas de casas (35%)
  const RADIUS_SIGNS_INNER = size * 0.40; // Borde interno signos (40%)
  const RADIUS_SIGNS_OUTER = size * 0.48; // Borde externo signos (48%)
  
  // ============================================
  // FUNCIONES DE CONVERSIÓN DE COORDENADAS
  // ============================================
  
  /**
   * Convierte grados astrológicos a radianes
   * En astrología: 0° = Ascendente (izquierda), aumenta en sentido antihorario
   * En SVG: 0° = derecha, aumenta en sentido horario
   * @param astrologicalDegree - Grado astrológico (0-360)
   * @returns Radianes para SVG
   */
  const astroToRadians = (astrologicalDegree: number): number => {
    // Convertir de astrológico a matemático:
    // - Astrológico 0° (Asc) = Matemático 180° (izquierda)
    // - Rotar 180° y luego invertir dirección
    const mathDegree = 180 - astrologicalDegree;
    return (mathDegree * Math.PI) / 180;
  };
  
  /**
   * Calcula coordenadas cartesianas desde el centro
   * @param degree - Grado astrológico (0-360)
   * @param radius - Radio desde el centro
   * @returns Coordenadas {x, y} en el SVG
   */
  const polarToCartesian = (degree: number, radius: number): { x: number; y: number } => {
    const radian = astroToRadians(degree);
    return {
      x: CENTER_X + radius * Math.cos(radian),
      y: CENTER_Y - radius * Math.sin(radian), // Negativo porque SVG Y crece hacia abajo
    };
  };
  
  // ============================================
  // JERARQUÍA VISUAL DE PLANETAS
  // ============================================
  
  /**
   * Tamaño del planeta según su jerarquía
   * Luminares (Sol/Luna) más grandes, transpersonales más pequeños
   * Ajustado para móviles si size < 450px
   */
  const getPlanetSize = (planetName: string): number => {
    const isMobile = size < 450;
    const scale = isMobile ? 0.7 : 1; // 70% en móviles
    
    if (planetName === 'Sol' || planetName === 'Luna') return 16 * scale;      // Luminares: 1.6x
    if (['Mercurio', 'Venus', 'Marte'].includes(planetName)) return 14 * scale; // Personales: 1.4x
    if (['Júpiter', 'Saturno'].includes(planetName)) return 12 * scale;         // Sociales: 1.2x
    return 10 * scale; // Transpersonales: 1.0x
  };

  /**
   * Opacidad del planeta según su jerarquía
   * Transpersonales semi-transparentes para menor peso visual
   */
  const getPlanetOpacity = (planetName: string): number => {
    if (['Urano', 'Neptuno', 'Plutón'].includes(planetName)) return 0.7;
    return 1.0;
  };

  /**
   * Filtro SVG según el tipo de planeta
   * Sol = glow dorado, Luna = glow plateado
   */
  const getPlanetFilter = (planetName: string): string => {
    if (planetName === 'Sol') return 'url(#goldenGlow)';
    if (planetName === 'Luna') return 'url(#silverGlow)';
    return '';
  };

  // ============================================
  // OPTIMIZACIÓN: Memoizar planetas ordenados
  // Evita re-sorts innecesarios en cada render
  // ============================================
  const sortedPlanets = React.useMemo(
    () => [...planets].sort((a, b) => a.degree - b.degree),
    [planets]
  );

  // ============================================
  // DATOS DE LOS SIGNOS ZODIACALES
  // Colores SÓLIDOS sin transparencia - Paleta HSL vibrante
  // ============================================
  
  // Símbolos con variation selector U+FE0E para forzar renderizado de texto (no emoji)
  const zodiacSigns = [
    { name: 'Aries', symbol: '♈︎', emoji: '🐏', color: '#E53935', element: 'fuego' },      // Rojo sólido
    { name: 'Tauro', symbol: '♉︎', emoji: '🐂', color: '#FB8C00', element: 'tierra' },     // Naranja sólido
    { name: 'Géminis', symbol: '♊︎', emoji: '👯', color: '#FDD835', element: 'aire' },     // Amarillo sólido
    { name: 'Cáncer', symbol: '♋︎', emoji: '🦀', color: '#7CB342', element: 'agua' },      // Verde sólido
    { name: 'Leo', symbol: '♌︎', emoji: '🦁', color: '#43A047', element: 'fuego' },        // Verde esmeralda
    { name: 'Virgo', symbol: '♍︎', emoji: '👸', color: '#00897B', element: 'tierra' },     // Verde azulado
    { name: 'Libra', symbol: '♎︎', emoji: '⚖️', color: '#00ACC1', element: 'aire' },       // Cyan sólido
    { name: 'Escorpio', symbol: '♏︎', emoji: '🦂', color: '#1E88E5', element: 'agua' },    // Azul sólido
    { name: 'Sagitario', symbol: '♐︎', emoji: '🏹', color: '#3949AB', element: 'fuego' },  // Índigo sólido
    { name: 'Capricornio', symbol: '♑︎', emoji: '🐐', color: '#5E35B1', element: 'tierra' }, // Púrpura sólido
    { name: 'Acuario', symbol: '♒︎', emoji: '🏺', color: '#8E24AA', element: 'aire' },     // Magenta sólido
    { name: 'Piscis', symbol: '♓︎', emoji: '🐟', color: '#D81B60', element: 'agua' },      // Rosa sólido
  ];
  
  // ============================================
  // RENDERIZADO
  // ============================================
  
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="drop-shadow-2xl"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={`Carta astrológica diaria con ${sortedPlanets.length} planetas, 12 casas y signos zodiacales para ${new Date().toLocaleDateString('es-ES')}`}
      >
        {/* ============================================ */}
        {/* FONDO Y GRADIENTES */}
        {/* ============================================ */}
        
        <defs>
          {/* Gradiente radial INVERTIDO - oscuro en bordes, claro en centro */}
          <radialGradient id="bgGradient">
            <stop offset="0%" stopColor="#1a1a2e" stopOpacity="0.3" />
            <stop offset="70%" stopColor="#0f0f1e" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#0a0a18" stopOpacity="0.95" />
          </radialGradient>
          
          {/* Filtro de brillo violeta para símbolos zodiacales (mayor contraste) */}
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
            <feGaussianBlur in="SourceAlpha" stdDeviation="5" result="blur"/>
            <feFlood floodColor="#E8E8E8" floodOpacity="0.7"/>
            <feComposite in2="blur" operator="in" result="glowColor"/>
            <feMerge>
              <feMergeNode in="glowColor"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          {/* Filtro de halo radial para texto central */}
          <filter id="textHalo">
            <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
            <feFlood floodColor="#FFD36A" floodOpacity="0.8"/>
            <feComposite in2="coloredBlur" operator="in"/>
            <feMerge>
              <feMergeNode/>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          {/* Gradiente dorado para elementos destacados */}
          <radialGradient id="goldenRadial">
            <stop offset="0%" stopColor="#FFD36A" stopOpacity="1" />
            <stop offset="100%" stopColor="#FFA726" stopOpacity="0.7" />
          </radialGradient>
          
          {/* Filtro para outer ring glow */}
          <filter id="outerRingGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur"/>
            <feFlood floodColor="#7c3aed" floodOpacity="0.6"/>
            <feComposite in2="blur" operator="in" result="glowColor"/>
            <feMerge>
              <feMergeNode in="glowColor"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Círculo de fondo principal - Fondo limpio estilo clásico */}
        <circle
          cx={CENTER_X}
          cy={CENTER_Y}
          r={RADIUS_SIGNS_OUTER}
          fill="#ffffff"
          className="dark:fill-[#1a1a2e]"
          stroke="#718096"
          strokeWidth="2"
        />
        
        {/* Outer ring glow - marco luminoso sutil */}
        <circle
          cx={CENTER_X}
          cy={CENTER_Y}
          r={RADIUS_SIGNS_OUTER - 2}
          fill="none"
          stroke="#7c3aed"
          strokeWidth="1"
          opacity="0.4"
          filter="url(#outerRingGlow)"
          className="dark:stroke-purple-500"
        />
        
        {/* ============================================ */}
        {/* CÍRCULOS CONCÉNTRICOS (Guías) */}
        {/* ============================================ */}
        
        {/* Círculos concéntricos - Estilo clásico Astrodienst */}
        
        {/* Círculo interior (centro) */}
        <circle
          cx={CENTER_X}
          cy={CENTER_Y}
          r={RADIUS_INNER}
          fill="none"
          stroke="#718096"
          strokeWidth="1"
          className="dark:stroke-gray-600"
        />
        
        {/* Círculo de planetas */}
        <circle
          cx={CENTER_X}
          cy={CENTER_Y}
          r={RADIUS_PLANETS}
          fill="none"
          stroke="#718096"
          strokeWidth="1"
          className="dark:stroke-gray-600"
        />
        
        {/* Círculo de casas - Más grueso */}
        <circle
          cx={CENTER_X}
          cy={CENTER_Y}
          r={RADIUS_HOUSES}
          fill="none"
          stroke="#4a5568"
          strokeWidth="2"
          className="dark:stroke-gray-500"
        />
        
        {/* Círculo interno de signos */}
        <circle
          cx={CENTER_X}
          cy={CENTER_Y}
          r={RADIUS_SIGNS_INNER}
          fill="none"
          stroke="#4a5568"
          strokeWidth="2"
          className="dark:stroke-gray-500"
        />
        
        {/* Círculo externo de signos */}
        <circle
          cx={CENTER_X}
          cy={CENTER_Y}
          r={RADIUS_SIGNS_OUTER}
          fill="none"
          stroke="#2d3748"
          strokeWidth="2"
          className="dark:stroke-gray-400"
        />
        
        {/* ============================================ */}
        {/* EJES CARDINALES (ASC-DSC, MC-IC) */}
        {/* Cruz dorada semi-transparente en 0° Aries, Cáncer, Libra, Capricornio */}
        {/* ============================================ */}
        
        {/* Eje horizontal: 0° Aries (izq) - 0° Libra (der) */}
        <line
          x1={polarToCartesian(0, RADIUS_INNER).x}
          y1={polarToCartesian(0, RADIUS_INNER).y}
          x2={polarToCartesian(180, RADIUS_INNER).x}
          y2={polarToCartesian(180, RADIUS_INNER).y}
          stroke="#FFD700"
          strokeWidth="1.5"
          strokeOpacity="0.3"
          strokeDasharray="4,4"
        />
        
        {/* Eje vertical: 0° Cáncer (arriba) - 0° Capricornio (abajo) */}
        <line
          x1={polarToCartesian(90, RADIUS_INNER).x}
          y1={polarToCartesian(90, RADIUS_INNER).y}
          x2={polarToCartesian(270, RADIUS_INNER).x}
          y2={polarToCartesian(270, RADIUS_INNER).y}
          stroke="#FFD700"
          strokeWidth="1.5"
          strokeOpacity="0.3"
          strokeDasharray="4,4"
        />
        
        {/* ============================================ */}
        {/* ANILLO EXTERIOR - SIGNOS ZODIACALES */}
        {/* Estilo clásico Astrodienst: fondo limpio, solo símbolos y líneas */}
        {/* ============================================ */}
        
        {zodiacSigns.map((sign, index) => {
          const startDegree = index * 30; // Cada signo ocupa 30°
          const middleDegree = startDegree + 15; // Centro del signo para el símbolo
          
          // Posición del símbolo (en el anillo exterior)
          const symbolPos = polarToCartesian(middleDegree, (RADIUS_SIGNS_INNER + RADIUS_SIGNS_OUTER) / 2);
          
          return (
            <g key={sign.name}>
              {/* Línea divisoria entre signos - Estilo clásico */}
              <line
                x1={polarToCartesian(startDegree, RADIUS_SIGNS_INNER).x}
                y1={polarToCartesian(startDegree, RADIUS_SIGNS_INNER).y}
                x2={polarToCartesian(startDegree, RADIUS_SIGNS_OUTER).x}
                y2={polarToCartesian(startDegree, RADIUS_SIGNS_OUTER).y}
                stroke="#4a5568"
                strokeWidth="1.5"
                strokeOpacity="0.5"
              />
              
              {/* Símbolo del signo - Plano sin efectos - Responsivo */}
              <text
                x={symbolPos.x}
                y={symbolPos.y}
                textAnchor="middle"
                dominantBaseline="central"
                className="font-bold"
                fill="#ffffff"
                opacity="0.9"
                style={{ 
                  fontSize: size < 450 ? '18px' : '26px',
                  fontWeight: 400,
                  fontFamily: '"Zodiac Symbols", "Zodiac Symbols Fallback", "Noto Sans Symbols 2", "Segoe UI Symbol", Arial, sans-serif',
                  WebkitTextStrokeWidth: '1px',
                  WebkitTextStrokeColor: '#ffffff',
                  paintOrder: 'stroke fill'
                }}
              >
                {sign.symbol}
                <title>{sign.name} - {sign.element}</title>
              </text>
            </g>
          );
        })}
        
        {/* ============================================ */}
        {/* SISTEMA DE CASAS ASTROLÓGICAS (12 casas) */}
        {/* Líneas radiales desde el centro según cúspides */}
        {/* ============================================ */}
        
        {houses.length === 12 ? (
          // Si tenemos datos reales de casas, usarlos
          houses.map((house) => {
            const inner = polarToCartesian(house.degree, RADIUS_INNER);
            const outer = polarToCartesian(house.degree, RADIUS_HOUSES);
            // Posicionar números cerca del borde del círculo interno (más hacia afuera)
            const radiusMultiplier = size < 450 ? 0.85 : 0.90;
            const middle = polarToCartesian(house.degree + 15, RADIUS_INNER * radiusMultiplier);
            
            // Destacar las casas angulares (1, 4, 7, 10)
            const isAngular = [1, 4, 7, 10].includes(house.house);
            
            return (
              <g key={house.house}>
                {/* Línea de la cúspide */}
                <line
                  x1={inner.x}
                  y1={inner.y}
                  x2={outer.x}
                  y2={outer.y}
                  stroke={isAngular ? "#2b6cb0" : "#718096"}
                  strokeWidth={isAngular ? 2 : 1}
                  className={isAngular ? "dark:stroke-blue-400" : "dark:stroke-gray-600"}
                  strokeOpacity={isAngular ? 0.8 : 0.5}
                />
                
                {/* Número de casa - responsivo */}
                <text
                  x={middle.x}
                  y={middle.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="font-bold"
                  fill={isAngular ? "#2b6cb0" : "#4a5568"}
                  style={{ fontSize: size < 450 ? '10px' : '14px' }}
                >
                  {house.house}
                </text>
              </g>
            );
          })
        ) : (
          // Si no hay datos, usar casas por defecto (cada 30°)
          Array.from({ length: 12 }, (_, i) => {
            const degree = i * 30; // Casas iguales de 30° cada una
            const inner = polarToCartesian(degree, RADIUS_INNER);
            const outer = polarToCartesian(degree, RADIUS_HOUSES);
            // Posicionar números cerca del borde del círculo interno (más hacia afuera)
            const radiusMultiplier = size < 450 ? 0.85 : 0.90;
            const middle = polarToCartesian(degree + 15, RADIUS_INNER * radiusMultiplier);
            const houseNumber = i + 1;
            
            // Destacar las casas angulares (1, 4, 7, 10)
            const isAngular = [1, 4, 7, 10].includes(houseNumber);
            
            return (
              <g key={houseNumber}>
                {/* Línea de la cúspide */}
                <line
                  x1={inner.x}
                  y1={inner.y}
                  x2={outer.x}
                  y2={outer.y}
                  stroke={isAngular ? "#2b6cb0" : "#718096"}
                  strokeWidth={isAngular ? 2 : 1}
                  className={isAngular ? "dark:stroke-blue-400" : "dark:stroke-gray-600"}
                  strokeOpacity={isAngular ? 0.8 : 0.5}
                />
                
                {/* Número de casa - responsivo */}
                <text
                  x={middle.x}
                  y={middle.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="font-bold"
                  fill={isAngular ? "#2b6cb0" : "#4a5568"}
                  style={{ fontSize: size < 450 ? '10px' : '14px' }}
                >
                  {houseNumber}
                </text>
              </g>
            );
          })
        )}
        
        {/* ============================================ */}
        {/* PLANETAS - Posicionados en sus grados exactos */}
        {/* Estilo Astrodienst: símbolos con colores tradicionales */}
        {/* ============================================ */}
        
        {sortedPlanets.length > 0 && sortedPlanets.map((planet) => {
          // Posicionar planeta en el círculo de planetas
          const pos = polarToCartesian(planet.degree, RADIUS_PLANETS);
          
          // Jerarquía visual según tipo de planeta
          const planetSize = getPlanetSize(planet.name);
          const planetOpacity = getPlanetOpacity(planet.name);
          const planetFilter = getPlanetFilter(planet.name);
          
          return (
            <g key={planet.name} opacity={planetOpacity}>
              {/* Círculo de fondo para el planeta */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={planetSize}
                fill="#ffffff"
                className="dark:fill-gray-800 cursor-pointer hover:opacity-100 transition-opacity"
                stroke={planet.color}
                strokeWidth={planet.name === 'Sol' || planet.name === 'Luna' ? '3' : '2'}
                opacity="0.95"
                filter={planetFilter}
              >
                <title>{planet.name} - {planet.degree.toFixed(1)}° en {planet.sign}</title>
              </circle>
              
              {/* Símbolo del planeta */}
              <text
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="central"
                className="font-bold cursor-pointer pointer-events-none"
                fill={planet.color}
                filter={planetFilter}
                style={{ 
                  fontSize: `${planetSize + 4}px`,
                  fontWeight: 400,
                  fontFamily: '"Zodiac Symbols", "Zodiac Symbols Fallback", "Noto Sans Symbols 2", "Segoe UI Symbol", Arial, sans-serif',
                  WebkitTextStrokeWidth: '1px',
                  WebkitTextStrokeColor: planet.color,
                  paintOrder: 'stroke fill'
                }}
              >
                {planet.symbol}
                <title>
                  {planet.name} en {planet.degree.toFixed(1)}° de {planet.sign}{planet.retrograde ? ' (retrógrado)' : ''}
                </title>
              </text>
              
              {/* Indicador de retrógrado */}
              {planet.retrograde && (
                <text
                  x={pos.x + planetSize + 3}
                  y={pos.y - planetSize + 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="font-bold pointer-events-none"
                  fill="#FF4444"
                  style={{ fontSize: '11px', fontWeight: 'bold' }}
                >
                  ℞
                </text>
              )}
              
              {/* Línea conectora desde el planeta hasta su grado en el borde */}
              <line
                x1={pos.x}
                y1={pos.y}
                x2={polarToCartesian(planet.degree, RADIUS_HOUSES - 5).x}
                y2={polarToCartesian(planet.degree, RADIUS_HOUSES - 5).y}
                stroke={planet.color}
                strokeWidth="1"
                strokeOpacity="0.25"
                strokeDasharray="2,2"
                className="pointer-events-none"
              />
            </g>
          );
        })}
        
        {/* ============================================ */}
        {/* CENTRO - INFORMACIÓN DEL DÍA */}
        {/* Estilo simple y clásico */}
        {/* ============================================ */}
        
        <g>
          {/* Texto "HOY" simple */}
          <text
            x={CENTER_X}
            y={CENTER_Y}
            textAnchor="middle"
            dominantBaseline="central"
            className="font-bold"
            fill="#2d3748"
            style={{ 
              fontSize: '18px',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
          >
            {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
          </text>
        </g>
        
        {/* ============================================ */}
        {/* MARCAS DE GRADOS - TODAS VISIBLES (cada 1°) */}
        {/* Marcas claras para precisión astrológica */}
        {/* ============================================ */}
        
        {Array.from({ length: 360 }, (_, i) => i).map((degree) => {
          const isMajor = degree % 30 === 0; // Marca mayor cada 30° (cambio de signo)
          const isMedium = degree % 5 === 0 && !isMajor; // Marca media cada 5°
          
          // Saltear las marcas mayores donde ya hay líneas divisorias
          if (isMajor) return null;
          
          // Diferentes longitudes según importancia
          let innerRadius, strokeWidth;
          
          if (isMedium) {
            // Cada 5°: línea más larga y visible
            innerRadius = RADIUS_SIGNS_INNER - 8;
            strokeWidth = 1;
          } else {
            // Cada 1°: línea corta
            innerRadius = RADIUS_SIGNS_INNER - 4;
            strokeWidth = 0.5;
          }
          
          const start = polarToCartesian(degree, innerRadius);
          const end = polarToCartesian(degree, RADIUS_SIGNS_INNER);
          
          return (
            <line
              key={degree}
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke="#718096"
              strokeWidth={strokeWidth}
              className="dark:stroke-gray-500"
              opacity={isMedium ? 0.7 : 0.4}
            />
          );
        })}
      </svg>
      
      {/* Leyenda inferior (fuera del SVG) */}
      <div className="absolute -bottom-8 left-0 right-0 text-center text-xs text-gray-500 dark:text-gray-400">
        Carta del Cielo - {new Date().toLocaleDateString('es-ES')}
      </div>
    </div>
  );
};

// ⚡ React.memo con comparación custom para evitar re-renders innecesarios
export default React.memo(DailyChartWheel, (prevProps, nextProps) => {
  // Solo re-render si props realmente cambian
  return (
    prevProps.size === nextProps.size &&
    prevProps.className === nextProps.className &&
    JSON.stringify(prevProps.planets) === JSON.stringify(nextProps.planets) &&
    JSON.stringify(prevProps.houses) === JSON.stringify(nextProps.houses)
  );
});
