import React, { useMemo } from 'react';
import type { ChartData } from '../types/chartWheel';
import type { ShapePattern, PlanetPosition } from '../types/chartShape';
import { detectChartShape } from '../utils/chartShapeAnalyzer';
import { absToRad, polar } from '../utils/chartGeometry';
import { useThemeStore } from '../store/useTheme';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

/**
 * ChartShapeWheel - Visualización simplificada enfocada en Chart Shape Analysis
 * Muestra la distribución planetaria y el patrón detectado (Bowl, Bucket, Locomotive, etc.)
 */

interface ChartShapeWheelProps {
  data: ChartData;
  size?: number;
}

const ChartShapeWheel: React.FC<ChartShapeWheelProps> = ({
  data,
  size = 600, // Reducido de 800 a 600
}) => {
  const { isDark } = useThemeStore();
  const [isZoomModalOpen, setIsZoomModalOpen] = React.useState(false);
  
  const cx = size / 2;
  const cy = size / 2;
  const R = size / 2;

  // Radios simplificados (sin casas, enfocado en planetas y signos)
  const R_PLANETS = 0.60 * R;
  const R_SIGNS_INNER = 0.75 * R;
  const R_SIGNS_OUTER = 0.98 * R;
  const R_SIGN_SYMBOL = (R_SIGNS_INNER + R_SIGNS_OUTER) / 2;

  // Tamaños - Planetas más grandes
  const SIGN_SIZE = Math.max(16, Math.min(0.035 * size, 28));
  const PLANET_SIZE = Math.max(18, Math.min(0.040 * size, 32)); // Aumentado de 14-24 a 18-32

  // Símbolos
  const SIGN_SYMBOLS = ['♈︎', '♉︎', '♊︎', '♋︎', '♌︎', '♍︎', '♎︎', '♏︎', '♐︎', '♑︎', '♒︎', '♓︎'];
  const PLANET_SYMBOLS: Record<string, string> = {
    Sol: '☉︎', Luna: '☽︎', Mercurio: '☿︎', Venus: '♀︎', Marte: '♂︎',
    Júpiter: '♃︎', Saturno: '♄︎', Urano: '♅︎', Neptuno: '♆︎', Plutón: '♇︎',
    'Nodo Norte': '☊︎', 'Nodo Sur': '☋︎', Quirón: '⚷︎', Chiron: '⚷︎',
    'Parte de la Fortuna': '⊕︎', Lilith: '⚸︎', Vértex: 'Vx', 'Anti-Vértex': 'AVx',
  };

  // Tema
  const THEME = {
    background: isDark ? 'radial-gradient(circle, #1a1a2e 0%, #0a0a18 100%)' : 'radial-gradient(circle, #FFF8F5 0%, #FFE5D9 100%)',
    signSymbols: isDark ? '#ffd700' : '#7C3AED',
    signDividers: isDark ? '#8b7355' : '#7C3AED',
    planetSymbols: isDark ? '#ffffff' : '#4B5563',
    hemisphereLine: isDark ? '#666666' : '#9CA3AF',
    hemisphereLabel: isDark ? '#888888' : '#6B7280',
    patternFill: isDark ? 'rgba(255, 215, 0, 0.15)' : 'rgba(124, 58, 237, 0.15)',
    patternStroke: isDark ? '#ffd700' : '#7C3AED',
  };

  // Conversión de planetas a formato PlanetPosition
  const planetPositions: PlanetPosition[] = useMemo(() => {
    return data.planets.map(p => ({
      name: p.name,
      longitude: p.longitude,
    }));
  }, [data.planets]);

  // Detectar patrón
  const shapePattern: ShapePattern = useMemo(() => {
    return detectChartShape(planetPositions);
  }, [planetPositions]);

  // Renderizar área sombreada según el patrón
  const renderPatternArea = () => {
    const sorted = [...planetPositions].sort((a, b) => a.longitude - b.longitude);
    
    if (sorted.length < 2) return null;

    const start = sorted[0].longitude;
    const end = sorted[sorted.length - 1].longitude;
    
    // Crear path del área ocupada
    const startAngle = absToRad(start);
    const endAngle = absToRad(end);
    
    const [p1x, p1y] = polar(cx, cy, R_PLANETS + 50, startAngle);
    const [p2x, p2y] = polar(cx, cy, R_PLANETS + 50, endAngle);
    
    const largeArcFlag = (end - start) > 180 ? 1 : 0;

    return (
      <path
        d={`M ${cx},${cy} L ${p1x},${p1y} A ${R_PLANETS + 50} ${R_PLANETS + 50} 0 ${largeArcFlag} 1 ${p2x},${p2y} Z`}
        fill={THEME.patternFill}
        stroke={THEME.patternStroke}
        strokeWidth={2}
        strokeDasharray="5 5"
        opacity={0.6}
      />
    );
  };

  // Renderizar líneas de hemisferios
  const renderHemisphereLines = () => {
    return (
      <g>
        {/* Línea horizontal (Norte/Sur) */}
        <line
          x1={cx - R_SIGNS_INNER}
          y1={cy}
          x2={cx + R_SIGNS_INNER}
          y2={cy}
          stroke={THEME.hemisphereLine}
          strokeWidth={1.5}
          strokeDasharray="8 4"
          opacity={0.5}
        />
        {/* Línea vertical (Este/Oeste) */}
        <line
          x1={cx}
          y1={cy - R_SIGNS_INNER}
          x2={cx}
          y2={cy + R_SIGNS_INNER}
          stroke={THEME.hemisphereLine}
          strokeWidth={1.5}
          strokeDasharray="8 4"
          opacity={0.5}
        />
        {/* Labels de hemisferios */}
        <text x={cx + R_SIGNS_INNER - 30} y={cy - 10} fontSize={12} fill={THEME.hemisphereLabel} fontWeight="500">
          Este
        </text>
        <text x={cx - R_SIGNS_INNER + 10} y={cy - 10} fontSize={12} fill={THEME.hemisphereLabel} fontWeight="500">
          Oeste
        </text>
        <text x={cx + 5} y={cy - R_SIGNS_INNER + 20} fontSize={12} fill={THEME.hemisphereLabel} fontWeight="500">
          Norte
        </text>
        <text x={cx + 5} y={cy + R_SIGNS_INNER - 10} fontSize={12} fill={THEME.hemisphereLabel} fontWeight="500">
          Sur
        </text>
      </g>
    );
  };

  // Renderizar signos zodiacales
  const renderSigns = () => {
    return SIGN_SYMBOLS.map((symbol, i) => {
      const long = i * 30;
      const angleStart = absToRad(long);
      const angleMid = absToRad(long + 15);

      const [p1x, p1y] = polar(cx, cy, R_SIGNS_INNER, angleStart);
      const [p2x, p2y] = polar(cx, cy, R_SIGNS_OUTER, angleStart);
      const [pSymbolX, pSymbolY] = polar(cx, cy, R_SIGN_SYMBOL, angleMid);

      return (
        <g key={`sign-${i}`}>
          {/* Línea divisora */}
          <line
            x1={p1x}
            y1={p1y}
            x2={p2x}
            y2={p2y}
            stroke={THEME.signDividers}
            strokeWidth={1.5}
            opacity={0.4}
          />
          {/* Símbolo del signo */}
          <text
            x={pSymbolX}
            y={pSymbolY}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={SIGN_SIZE}
            fill={THEME.signSymbols}
            fontWeight="600"
            style={{ fontFamily: '"Zodiac Symbols", "Noto Sans Symbols 2", "Segoe UI Symbol", Arial, sans-serif' }}
          >
            {symbol}
          </text>
        </g>
      );
    });
  };

  // Renderizar planetas
  const renderPlanets = () => {
    return data.planets.map((planet, idx) => {
      const angle = absToRad(planet.longitude);
      const [posX, posY] = polar(cx, cy, R_PLANETS, angle);
      const symbol = PLANET_SYMBOLS[planet.name] || planet.name.substring(0, 2);

      return (
        <g key={`planet-${idx}`}>
          <circle
            cx={posX}
            cy={posY}
            r={PLANET_SIZE / 2}
            fill={isDark ? '#1a1a2e' : '#ffffff'}
            stroke={THEME.planetSymbols}
            strokeWidth={1.5}
          />
          <text
            x={posX}
            y={posY}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={PLANET_SIZE * 0.7}
            fill={THEME.planetSymbols}
            fontWeight="600"
            style={{ fontFamily: '"Zodiac Symbols", "Noto Sans Symbols 2", "Segoe UI Symbol", Arial, sans-serif' }}
          >
            {symbol}
          </text>
        </g>
      );
    });
  };

  const svgContent = (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${size} ${size}`}
      preserveAspectRatio="xMidYMid meet"
      style={{ background: THEME.background }}
      className="rounded-lg shadow-2xl"
    >
      {/* Círculo exterior */}
      <circle
        cx={cx}
        cy={cy}
        r={R_SIGNS_OUTER}
        fill="none"
        stroke={isDark ? '#444' : '#D1D5DB'}
        strokeWidth={2}
      />
      
      {/* Área del patrón detectado */}
      {renderPatternArea()}
      
      {/* Líneas de hemisferios */}
      {renderHemisphereLines()}
      
      {/* Signos zodiacales */}
      {renderSigns()}
      
      {/* Planetas */}
      {renderPlanets()}
      
      {/* Label central con tipo de patrón */}
      <text
        x={cx}
        y={cy - 15}
        textAnchor="middle"
        fontSize={14}
        fill={isDark ? '#ffd700' : '#7C3AED'}
        fontWeight="700"
      >
        {shapePattern.name}
      </text>
      <text
        x={cx}
        y={cy + 8}
        textAnchor="middle"
        fontSize={10}
        fill={THEME.hemisphereLabel}
        fontWeight="500"
      >
        Span: {shapePattern.span.toFixed(1)}° • Gap: {shapePattern.maxGap.toFixed(1)}°
      </text>
    </svg>
  );

  return (
    <div className="chart-shape-wheel-container flex flex-col items-center">
      {/* Título compacto */}
      <h3 className="text-xs sm:text-sm lg:text-base font-semibold text-purple-300 mb-1 sm:mb-2">
        Forma
      </h3>
      
      {/* Vista normal - Más grande */}
      <div 
        className="chart-wheel-wrapper cursor-pointer w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] lg:w-[540px] lg:h-[540px] xl:w-[600px] xl:h-[600px]" 
        onClick={() => setIsZoomModalOpen(true)}
      >
        {svgContent}
      </div>

      {/* Modal de zoom */}
      {isZoomModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setIsZoomModalOpen(false)}
        >
          <div 
            className="relative max-w-[95vw] max-h-[95vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsZoomModalOpen(false)}
              className="absolute top-4 right-4 z-10 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Cerrar
            </button>
            <TransformWrapper
              initialScale={1}
              minScale={0.5}
              maxScale={4}
            >
              <TransformComponent>
                {svgContent}
              </TransformComponent>
            </TransformWrapper>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartShapeWheel;
