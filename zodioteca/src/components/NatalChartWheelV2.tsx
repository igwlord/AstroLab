/**
 * NATAL CHART WHEEL - Versión production-ready
 * 
 * Implementa el Plan Maestro (PLAN_MAESTRO_RUEDA_ASTRO_SEEK.md) con:
 * - Sistema Fixed Zodiac (0° Aries izquierda, antihorario)
 * - Geometría exacta Astro-Seek
 * - Temas classic/violet
 * - Validación estricta de datos
 * - Export SVG/PNG
 */

import React, { useRef, useCallback } from 'react';
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
  getSignSymbol,
} from '../utils/chartGeometry';
import {
  getTheme,
  PLANET_SYMBOLS,
  SPECIAL_POINT_SYMBOLS,
  getPlanetColor,
} from '../utils/chartThemes';

const NatalChartWheel: React.FC<NatalChartWheelProps> = ({
  data,
  size = 640,
  theme = 'violet',
  mode = 'zodiacFixed',
  planetLabels = 'none',
  debug = false,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const currentTheme = getTheme(theme);

  // Validar datos
  React.useEffect(() => {
    try {
      validateChartData(data);
    } catch (error) {
      console.error('[NatalChartWheel] Validation error:', error);
    }
  }, [data]);

  // ============================================
  // CONSTANTES GEOMÉTRICAS (según auditoría §2)
  // ============================================
  const R = size / 2;
  const cx = R;
  const cy = R;

  const R_INNER = R * 0.32;
  const R_ASPECTS = R * 0.52;
  const R_PLANETS = R * 0.60;
  const R_HOUSE_NUMBERS = R * 0.72;
  const R_SIGNS_INNER = R * 0.84;
  const R_SIGNS_OUTER = R * 0.92;
  const R_TICKS_INNER = R * 0.93;
  const R_TICKS_OUTER = R * 1.00;

  // Longitudes de ticks
  const LEN_TICK_1 = Math.max(2, R * 0.012);
  const LEN_TICK_5 = Math.max(3, R * 0.020);
  const LEN_TICK_10 = Math.max(4, R * 0.030);

  // Tamaños de fuente (escalados)
  const SIGN_SIZE = Math.max(14, Math.min(24, size * 0.030));
  const DEG_LABEL_SIZE = Math.max(8, Math.min(12, size * 0.022));
  const HOUSE_NUMBER_SIZE = Math.max(9, Math.min(12, size * 0.018));
  const PLANET_SIZE = Math.max(12, Math.min(22, size * 0.026));

  // ============================================
  // HELPER: Offset por modo ascRelative
  // ============================================
  const getASC = (): number => {
    const house1 = data.houses.find((h) => h.number === 1);
    return house1 ? house1.cusp : 0;
  };

  const degToRad = (absDeg: number): number => {
    if (mode === 'ascRelative') {
      return absToRad(normalize(absDeg - getASC()));
    }
    return absToRad(absDeg);
  };

  // ============================================
  // TICKS (360 grados con jerarquía 1°/5°/10°)
  // ============================================
  const renderTicks = () => {
    const ticks = [];
    const labels = [];

    for (let deg = 0; deg < 360; deg++) {
      const is10 = deg % 10 === 0;
      const is5 = deg % 5 === 0 && !is10;
      const len = is10 ? LEN_TICK_10 : is5 ? LEN_TICK_5 : LEN_TICK_1;
      const opacity = is10 ? currentTheme.ticksOpacity[2] : is5 ? currentTheme.ticksOpacity[1] : currentTheme.ticksOpacity[0];
      const strokeWidth = is10 ? 1.2 : is5 ? 0.9 : 0.7;

      const rad = degToRad(deg);
      const [x1, y1] = [cx + R_TICKS_INNER * Math.cos(rad), cy - R_TICKS_INNER * Math.sin(rad)];
      const [x2, y2] = [cx + (R_TICKS_INNER + len) * Math.cos(rad), cy - (R_TICKS_INNER + len) * Math.sin(rad)];

      ticks.push(
        <line
          key={`tick-${deg}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={currentTheme.ticksColor}
          strokeWidth={strokeWidth}
          opacity={opacity}
        />
      );

      // Etiquetas 0/10/20 por signo (reinician cada 30°)
      if (is10) {
        const degInSign = deg % 30;
        if ([0, 10, 20].includes(degInSign)) {
          const labelR = R_TICKS_INNER + len + R * 0.012;
          const [lx, ly] = [cx + labelR * Math.cos(rad), cy - labelR * Math.sin(rad)];
          labels.push(
            <text
              key={`label-${deg}`}
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={currentTheme.ticksColor}
              fontSize={DEG_LABEL_SIZE}
              opacity={0.7}
            >
              {degInSign}°
            </text>
          );
        }
      }
    }

    return (
      <g id="ticks">
        {ticks}
        {labels}
      </g>
    );
  };

  // ============================================
  // SIGNOS (12 sectores con símbolos)
  // ============================================
  const renderSigns = () => {
    const signs: React.ReactElement[] = [];
    const symbols = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

    for (let i = 0; i < 12; i++) {
      const startDeg = i * 30;
      const midDeg = startDeg + 15;

      // Línea divisoria
      const rad = degToRad(startDeg);
      const [x1, y1] = [cx + R_SIGNS_INNER * Math.cos(rad), cy - R_SIGNS_INNER * Math.sin(rad)];
      const [x2, y2] = [cx + R_SIGNS_OUTER * Math.cos(rad), cy - R_SIGNS_OUTER * Math.sin(rad)];

      signs.push(
        <line
          key={`sign-line-${i}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={currentTheme.signsColor}
          strokeWidth={1}
          opacity={0.4}
        />
      );

      // Símbolo del signo
      const symbolR = (R_SIGNS_INNER + R_SIGNS_OUTER) / 2;
      const symbolRad = degToRad(midDeg);
      const [sx, sy] = [cx + symbolR * Math.cos(symbolRad), cy - symbolR * Math.sin(symbolRad)];

      signs.push(
        <text
          key={`sign-symbol-${i}`}
          x={sx}
          y={sy}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={currentTheme.signsColor}
          fontSize={SIGN_SIZE}
          opacity={0.8}
        >
          {symbols[i]}
        </text>
      );
    }

    return <g id="signs">{signs}</g>;
  };

  // ============================================
  // CASAS (líneas y números)
  // ============================================
  const renderHouses = () => {
    const lines: React.ReactElement[] = [];
    const numbers: React.ReactElement[] = [];
    const axes: React.ReactElement[] = [];

    data.houses.forEach((house) => {
      const cusp = house.cusp;
      const rad = degToRad(cusp);

      // Tipo de casa
      const isAngular = [1, 4, 7, 10].includes(house.number);
      const isSuccedent = [2, 5, 8, 11].includes(house.number);

      const strokeWidth = isAngular
        ? currentTheme.houseLinesWidth.angular
        : isSuccedent
        ? currentTheme.houseLinesWidth.succedent
        : currentTheme.houseLinesWidth.cadent;

      const strokeColor = isAngular
        ? currentTheme.houseLinesColor.angular
        : isSuccedent
        ? currentTheme.houseLinesColor.succedent
        : currentTheme.houseLinesColor.cadent;

      // Línea desde centro hasta borde interno de signos
      const [x2, y2] = [cx + R_SIGNS_INNER * Math.cos(rad), cy - R_SIGNS_INNER * Math.sin(rad)];

      lines.push(
        <line
          key={`house-line-${house.number}`}
          x1={cx}
          y1={cy}
          x2={x2}
          y2={y2}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          opacity={0.7}
        />
      );

      // Etiquetas de ejes (ASC/DSC/MC/IC)
      if (house.number === 1) {
        const [ax, ay] = [cx + R_TICKS_OUTER * 1.05 * Math.cos(rad), cy - R_TICKS_OUTER * 1.05 * Math.sin(rad)];
        axes.push(
          <text
            key="axis-ASC"
            x={ax}
            y={ay}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={currentTheme.axesColor}
            fontSize={DEG_LABEL_SIZE}
            fontWeight="bold"
          >
            ASC
          </text>
        );
      }

      if (house.number === 10) {
        const [ax, ay] = [cx + R_TICKS_OUTER * 1.05 * Math.cos(rad), cy - R_TICKS_OUTER * 1.05 * Math.sin(rad)];
        axes.push(
          <text
            key="axis-MC"
            x={ax}
            y={ay}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={currentTheme.axesColor}
            fontSize={DEG_LABEL_SIZE}
            fontWeight="bold"
          >
            MC
          </text>
        );
      }

      // Número de casa en midpoint
      const nextHouse = data.houses.find((h) => h.number === (house.number % 12) + 1);
      if (nextHouse) {
        const midDeg = mid(cusp, nextHouse.cusp);
        const midRad = degToRad(midDeg);
        const [nx, ny] = [cx + R_HOUSE_NUMBERS * Math.cos(midRad), cy - R_HOUSE_NUMBERS * Math.sin(midRad)];

        numbers.push(
          <text
            key={`house-number-${house.number}`}
            x={nx}
            y={ny}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={currentTheme.houseLinesColor.angular}
            fontSize={HOUSE_NUMBER_SIZE}
            fontWeight="bold"
            opacity={0.7}
          >
            {house.number}
          </text>
        );
      }
    });

    return (
      <g id="houses">
        {lines}
        {numbers}
        {axes}
      </g>
    );
  };

  // ============================================
  // ASPECTOS (red interna)
  // ============================================
  const renderAspects = () => {
    if (!data.aspects || data.aspects.length === 0) return null;

    const lines: React.ReactElement[] = [];

    data.aspects.forEach((aspect, idx) => {
      // Buscar planetas/puntos
      const allBodies = [...data.planets, ...(data.points || [])];
      const body1 = allBodies.find((b) => b.name === aspect.planet1);
      const body2 = allBodies.find((b) => b.name === aspect.planet2);

      if (!body1 || !body2) return;

      const [x1, y1] = absToCoords(cx, cy, R_ASPECTS, degToRad(body1.longitude));
      const [x2, y2] = absToCoords(cx, cy, R_ASPECTS, degToRad(body2.longitude));

      const color = currentTheme.aspectsColor[aspect.type] || currentTheme.aspectsColor.conjunction;
      const maxOrb = 10;
      const opacity = Math.max(0.15, Math.min(0.6, 1 - Math.abs(aspect.orb) / maxOrb));

      lines.push(
        <line
          key={`aspect-${idx}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={color}
          strokeWidth={0.8}
          opacity={opacity}
        />
      );
    });

    return <g id="aspects">{lines}</g>;
  };

  // ============================================
  // PLANETAS (con anti-colisión)
  // ============================================
  const renderPlanets = () => {
    const glyphs: React.ReactElement[] = [];
    const allBodies = [...data.planets, ...(data.points || [])];

    // Anti-colisión: detectar cercanos (<10°) y escalonar radios
    const bodiesWithRadius = allBodies.map((body, idx) => {
      let level = 0;
      const nearby = allBodies.filter((other, otherIdx) => {
        if (otherIdx >= idx) return false;
        const delta = Math.abs(deltaPos(other.longitude, body.longitude));
        return delta < 10 || delta > 350;
      });
      level = nearby.length % 3;
      return { ...body, radius: R_PLANETS + level * (R * 0.03) };
    });

    bodiesWithRadius.forEach((body) => {
      const isPlanet = 'retrograde' in body;
      const symbol = isPlanet ? PLANET_SYMBOLS[body.name] || '?' : SPECIAL_POINT_SYMBOLS[body.name] || '?';
      const color = isPlanet ? getPlanetColor(body.name, theme) : currentTheme.planetsColor;

      const rad = degToRad(body.longitude);
      const [px, py] = [cx + body.radius * Math.cos(rad), cy - body.radius * Math.sin(rad)];

      glyphs.push(
        <g key={`body-${body.name}`}>
          <text
            x={px}
            y={py}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={color}
            fontSize={PLANET_SIZE}
            fontWeight="bold"
          >
            {symbol}
            {'retrograde' in body && body.retrograde && (
              <tspan fontSize={PLANET_SIZE * 0.5} dx="0.1em" dy="-0.4em">
                ℞
              </tspan>
            )}
          </text>

          {/* Etiquetas inline (opcional) */}
          {planetLabels === 'inline' && isPlanet && (
            <text
              x={px}
              y={py + PLANET_SIZE * 0.9}
              textAnchor="middle"
              fill={color}
              fontSize={DEG_LABEL_SIZE * 0.8}
              opacity={0.7}
            >
              {(() => {
                const { deg, min } = degMin(body.longitude);
                const signIdx = getSignIndex(body.longitude);
                const signSym = getSignSymbol(signIdx);
                return `${deg}° ${min}′ ${signSym}`;
              })()}
            </text>
          )}
        </g>
      );
    });

    return <g id="planets">{glyphs}</g>;
  };

  // ============================================
  // EXPORT FUNCTIONS
  // ============================================
  const exportSVG = useCallback((): string => {
    if (!svgRef.current) return '';
    const serializer = new XMLSerializer();
    return serializer.serializeToString(svgRef.current);
  }, []);

  const exportPNG = useCallback(
    async (dpi: number = 2): Promise<Blob | null> => {
      if (!svgRef.current) return null;

      const svgString = exportSVG();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      canvas.width = size * dpi;
      canvas.height = size * dpi;

      const img = new Image();
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      return new Promise((resolve) => {
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          URL.revokeObjectURL(url);
          canvas.toBlob((blob) => resolve(blob), 'image/png');
        };
        img.onerror = () => {
          URL.revokeObjectURL(url);
          resolve(null);
        };
        img.src = url;
      });
    },
    [exportSVG, size]
  );

  // ============================================
  // RENDER
  // ============================================
  const backgroundStyle =
    theme === 'violet'
      ? { background: 'radial-gradient(circle at center, #1a1a2e 0%, #0a0a18 100%)' }
      : { background: '#FAFAFA' };

  return (
    <div className="natal-chart-wheel" style={{ width: size, height: size, ...backgroundStyle }}>
      <svg ref={svgRef} width={size} height={size} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
        {/* Círculo de fondo */}
        <circle cx={cx} cy={cy} r={R_SIGNS_OUTER} fill="none" stroke={currentTheme.ticksColor} strokeWidth={2} opacity={0.2} />

        {/* Orden de dibujo (según §8) */}
        {renderTicks()}
        {renderSigns()}
        {renderHouses()}
        {renderAspects()}
        {renderPlanets()}

        {/* Debug overlay */}
        {debug && (
          <g id="debug">
            <circle cx={cx} cy={cy} r={R_INNER} stroke={currentTheme.debugColor} strokeWidth={1} fill="none" opacity={0.5} />
            <circle cx={cx} cy={cy} r={R_ASPECTS} stroke={currentTheme.debugColor} strokeWidth={1} fill="none" opacity={0.5} />
            <line x1={cx} y1={cy} x2={cx + R_SIGNS_OUTER} y2={cy} stroke={currentTheme.debugColor} strokeWidth={2} opacity={0.8} />
          </g>
        )}
      </svg>

      {/* Botones de export */}
      <div className="mt-2 flex gap-2 justify-center">
        <button
          onClick={() => window.print()}
          className="px-3 py-1 text-xs bg-violet-600 hover:bg-violet-700 text-white rounded"
        >
          🖨️ Imprimir
        </button>
        <button
          onClick={async () => {
            const blob = await exportPNG();
            if (blob) {
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'natal-chart.png';
              a.click();
              URL.revokeObjectURL(url);
            }
          }}
          className="px-3 py-1 text-xs bg-violet-600 hover:bg-violet-700 text-white rounded"
        >
          📥 Descargar PNG
        </button>
      </div>
    </div>
  );
};

NatalChartWheel.displayName = 'NatalChartWheel';

export default NatalChartWheel;
export { type NatalChartWheelProps };
