import React from 'react';
import type { ChartData } from '../types/chartWheel';
import { normalize, deltaPos, absToRad, polar, degMin, getSignIndex, getSignSymbol } from '../utils/chartGeometry';

/**
 * NatalChartWheelPro - Implementación EXACTA según rudea astro modelo.md
 * Replica pixel-perfect la geometría de Astro-Seek
 */

interface NatalChartWheelProProps {
  data: ChartData;
  size?: number;
  showPlanetDegrees?: boolean; // Mostrar deg° min′ junto a planetas
  showDataTable?: boolean; // Tabla inferior con datos detallados
}

const NatalChartWheelPro: React.FC<NatalChartWheelProProps> = ({
  data,
  size = 640,
  showPlanetDegrees = true,
  showDataTable = true,
}) => {
  const cx = size / 2;
  const cy = size / 2;
  const R = size / 2;

  // Función para imprimir/exportar a PDF
  const handlePrintPDF = () => {
    window.print();
  };

  // RADIOS EXACTOS según documento
  // const R_INNER = 0.32 * R; // Para futuro uso en disco central
  const R_ASPECTS = 0.52 * R;
  const R_PLANETS = 0.60 * R;
  const R_HOUSE_NUMBERS = 0.72 * R;
  const R_SIGNS_INNER = 0.84 * R;
  const R_SIGNS_OUTER = 0.92 * R;
  const R_TICKS_INNER = 0.93 * R;
  const R_TICKS_OUTER = 1.00 * R;

  // Longitudes de ticks
  const LEN_TICK_1 = Math.max(2, 0.012 * R);
  const LEN_TICK_5 = Math.max(3, 0.020 * R);
  const LEN_TICK_10 = Math.max(4, 0.030 * R);

  const R_DEG_LABELS = R_TICKS_INNER + LEN_TICK_10 + 0.012 * R;
  const R_SIGN_SYMBOL = (R_SIGNS_INNER + R_SIGNS_OUTER) / 2;

  // Tamaños de texto
  const LABEL_SIZE = Math.max(8, Math.min(0.022 * size, 12));
  const SIGN_SIZE = Math.max(14, Math.min(0.030 * size, 24));
  const HOUSE_NUMBER_SIZE = Math.max(9, Math.min(0.018 * size, 12));
  const PLANET_SIZE = Math.max(12, Math.min(0.026 * size, 22));
  const PLANET_LABEL_SIZE = Math.max(7, Math.min(0.018 * size, 12));

  // Símbolos
  const SIGN_SYMBOLS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
  const PLANET_SYMBOLS: Record<string, string> = {
    Sol: '☉',
    Luna: '☽',
    Mercurio: '☿',
    Venus: '♀',
    Marte: '♂',
    Júpiter: '♃',
    Saturno: '♄',
    Urano: '♅',
    Neptuno: '♆',
    Plutón: '♇',
  };

  // PALETA DRAMÁTICA VIOLETA/DORADO
  const THEME = {
    background: 'radial-gradient(circle, #1a1a2e 0%, #0a0a18 100%)',
    ticks: '#d4af37', // Dorado
    ticksOpacity: [0.3, 0.5, 0.7], // 1°, 5°, 10°
    degLabels: '#f4e5b8', // Dorado claro
    signDividers: '#8b7355', // Dorado oscuro
    signSymbols: '#ffd700', // Dorado brillante
    houseLines: {
      angular: '#d4af37', // Dorado para angulares
      succedent: '#b8962e', // Dorado medio
      cadent: '#8b7355', // Dorado oscuro
    },
    houseNumbers: {
      fill: '#ffd700',
      bg: 'rgba(26, 26, 46, 0.95)',
    },
    axes: {
      color: '#ffd700',
      labelColor: '#f4e5b8',
    },
    planets: {
      glyph: '#e6d5ff', // Violeta claro
      label: '#d4af37', // Dorado
    },
    aspects: {
      conjunction: '#9d8df1', // Violeta medio
      opposition: '#ff6b9d', // Rosa
      square: '#ff6b9d', // Rosa
      trine: '#4ec9ff', // Cyan
      sextil: '#7ee8fa', // Cyan claro
    },
    table: {
      bg: 'rgba(26, 26, 46, 0.95)',
      text: '#f4e5b8',
      accent: '#d4af37',
    },
  };

  const ASPECT_COLORS: Record<string, string> = THEME.aspects;

  // ============================================
  // 1. CORONA DE TICKS (360 grados)
  // ============================================
  const renderTicks = () => {
    const ticks: React.ReactElement[] = [];
    const labels: React.ReactElement[] = [];

    for (let deg = 0; deg < 360; deg++) {
      const rad = absToRad(deg);
      const is10 = deg % 10 === 0;
      const is5 = deg % 5 === 0 && !is10;

      const len = is10 ? LEN_TICK_10 : is5 ? LEN_TICK_5 : LEN_TICK_1;
      const opacityIndex = is10 ? 2 : is5 ? 1 : 0;
      const opacity = THEME.ticksOpacity[opacityIndex];
      const strokeWidth = is10 ? 1.2 : is5 ? 0.9 : 0.6;

      const [x1, y1] = polar(cx, cy, R_TICKS_INNER, rad);
      const [x2, y2] = polar(cx, cy, R_TICKS_INNER + len, rad);

      ticks.push(
        <line
          key={`tick-${deg}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={THEME.ticks}
          strokeWidth={strokeWidth}
          opacity={opacity}
        />
      );
    }

    // Etiquetas 0/10/20 por cada signo (36 etiquetas)
    for (let signIdx = 0; signIdx < 12; signIdx++) {
      for (const degInSign of [0, 10, 20]) {
        const absDeg = signIdx * 30 + degInSign;
        const rad = absToRad(absDeg);
        const [x, y] = polar(cx, cy, R_DEG_LABELS, rad);

        labels.push(
          <text
            key={`label-${absDeg}`}
            x={x}
            y={y}
            fontSize={LABEL_SIZE}
            fill={THEME.degLabels}
            textAnchor="middle"
            dominantBaseline="middle"
            opacity={0.9}
            fontWeight="500"
          >
            {degInSign}°
          </text>
        );
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
  // 2. SIGNOS (12 sectores)
  // ============================================
  const renderSigns = () => {
    const signs: React.ReactElement[] = [];
    const dividers: React.ReactElement[] = [];

    for (let i = 0; i < 12; i++) {
      const startDeg = i * 30;
      const midDeg = startDeg + 15;

      // Línea divisoria
      const radStart = absToRad(startDeg);
      const [x1, y1] = polar(cx, cy, R_SIGNS_INNER, radStart);
      const [x2, y2] = polar(cx, cy, R_SIGNS_OUTER, radStart);

      dividers.push(
        <line
          key={`sign-div-${i}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={THEME.signDividers}
          strokeWidth={1.0}
          opacity={0.6}
        />
      );

      // Símbolo del signo
      const radMid = absToRad(midDeg);
      const [x, y] = polar(cx, cy, R_SIGN_SYMBOL, radMid);

      signs.push(
        <text
          key={`sign-${i}`}
          x={x}
          y={y}
          fontSize={SIGN_SIZE}
          fill={THEME.signSymbols}
          textAnchor="middle"
          dominantBaseline="middle"
          fontWeight="bold"
          style={{ filter: 'drop-shadow(0 0 3px rgba(212, 175, 55, 0.5))' }}
        >
          {SIGN_SYMBOLS[i]}
        </text>
      );
    }

    return (
      <g id="signs">
        {dividers}
        {signs}
      </g>
    );
  };

  // ============================================
  // 3. CASAS (cúspides y números)
  // ============================================
  const renderHouses = () => {
    const lines: React.ReactElement[] = [];
    const numbers: React.ReactElement[] = [];
    const axesLabels: React.ReactElement[] = [];

    data.houses.forEach((house, idx) => {
      const cusp = house.cusp;
      const rad = absToRad(cusp);

      // Jerarquía de grosores
      const isAngular = [1, 4, 7, 10].includes(house.number);
      const isSuccedent = [2, 5, 8, 11].includes(house.number);

      const strokeWidth = isAngular ? 2.4 : isSuccedent ? 1.6 : 1.1;
      const color = isAngular
        ? THEME.houseLines.angular
        : isSuccedent
        ? THEME.houseLines.succedent
        : THEME.houseLines.cadent;

      // Línea desde centro hasta borde interno de signos
      const [x2, y2] = polar(cx, cy, R_SIGNS_INNER, rad);

      lines.push(
        <line
          key={`house-line-${house.number}`}
          x1={cx}
          y1={cy}
          x2={x2}
          y2={y2}
          stroke={color}
          strokeWidth={strokeWidth}
          opacity={isAngular ? 0.9 : 0.7}
          style={isAngular ? { filter: 'drop-shadow(0 0 2px rgba(212, 175, 55, 0.4))' } : {}}
        />
      );

      // Número de casa en midpoint
      const nextHouse = data.houses[(idx + 1) % 12];
      const span = deltaPos(cusp, nextHouse.cusp);
      const midDeg = normalize(cusp + span / 2);
      const radMid = absToRad(midDeg);
      const [xNum, yNum] = polar(cx, cy, R_HOUSE_NUMBERS, radMid);

      numbers.push(
        <g key={`house-num-${house.number}`}>
          <circle
            cx={xNum}
            cy={yNum}
            r={HOUSE_NUMBER_SIZE * 0.85}
            fill={THEME.houseNumbers.bg}
            stroke={THEME.houseNumbers.fill}
            strokeWidth={1.5}
            opacity={0.95}
          />
          <text
            x={xNum}
            y={yNum}
            fontSize={HOUSE_NUMBER_SIZE}
            fill={THEME.houseNumbers.fill}
            textAnchor="middle"
            dominantBaseline="middle"
            fontWeight="bold"
          >
            {house.number}
          </text>
        </g>
      );

      // Etiquetas ASC/MC/DSC/IC
      if (house.number === 1) {
        const [xAsc, yAsc] = polar(cx, cy, R_TICKS_OUTER + 12, rad);
        axesLabels.push(
          <text
            key="asc-label"
            x={xAsc}
            y={yAsc}
            fontSize={LABEL_SIZE * 1.1}
            fill={THEME.axes.labelColor}
            textAnchor="middle"
            dominantBaseline="middle"
            fontWeight="bold"
            style={{ filter: 'drop-shadow(0 0 4px rgba(212, 175, 55, 0.6))' }}
          >
            ASC
          </text>
        );
      }
      if (house.number === 10) {
        const [xMc, yMc] = polar(cx, cy, R_TICKS_OUTER + 12, rad);
        axesLabels.push(
          <text
            key="mc-label"
            x={xMc}
            y={yMc}
            fontSize={LABEL_SIZE * 1.1}
            fill={THEME.axes.labelColor}
            textAnchor="middle"
            dominantBaseline="middle"
            fontWeight="bold"
            style={{ filter: 'drop-shadow(0 0 4px rgba(212, 175, 55, 0.6))' }}
          >
            MC
          </text>
        );
      }
      if (house.number === 7) {
        const [xDsc, yDsc] = polar(cx, cy, R_TICKS_OUTER + 12, rad);
        axesLabels.push(
          <text
            key="dsc-label"
            x={xDsc}
            y={yDsc}
            fontSize={LABEL_SIZE * 1.1}
            fill={THEME.axes.labelColor}
            textAnchor="middle"
            dominantBaseline="middle"
            fontWeight="bold"
            style={{ filter: 'drop-shadow(0 0 4px rgba(212, 175, 55, 0.6))' }}
          >
            DSC
          </text>
        );
      }
      if (house.number === 4) {
        const [xIc, yIc] = polar(cx, cy, R_TICKS_OUTER + 12, rad);
        axesLabels.push(
          <text
            key="ic-label"
            x={xIc}
            y={yIc}
            fontSize={LABEL_SIZE * 1.1}
            fill={THEME.axes.labelColor}
            textAnchor="middle"
            dominantBaseline="middle"
            fontWeight="bold"
            style={{ filter: 'drop-shadow(0 0 4px rgba(212, 175, 55, 0.6))' }}
          >
            IC
          </text>
        );
      }
    });

    return (
      <g id="houses">
        {lines}
        {numbers}
        {axesLabels}
      </g>
    );
  };

  // ============================================
  // 4. ASPECTOS (malla interna)
  // ============================================
  const renderAspects = () => {
    if (!data.aspects) return null;

    const aspectLines: React.ReactElement[] = [];

    data.aspects.forEach((aspect, idx) => {
      const p1 = data.planets.find((p) => p.name === aspect.planet1);
      const p2 = data.planets.find((p) => p.name === aspect.planet2);

      if (!p1 || !p2) return;

      const rad1 = absToRad(p1.longitude);
      const rad2 = absToRad(p2.longitude);

      const [x1, y1] = polar(cx, cy, R_ASPECTS, rad1);
      const [x2, y2] = polar(cx, cy, R_ASPECTS, rad2);

      const color = ASPECT_COLORS[aspect.type] || '#B6B6C9';
      const opacity = Math.max(0.15, Math.min(1 - Math.abs(aspect.orb) / 10, 0.6));

      aspectLines.push(
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

    return <g id="aspects">{aspectLines}</g>;
  };

  // ============================================
  // 5. PLANETAS (con grados y minutos)
  // ============================================
  const renderPlanets = () => {
    const planetGlyphs: React.ReactElement[] = [];

    data.planets.forEach((planet) => {
      const rad = absToRad(planet.longitude);
      const [x, y] = polar(cx, cy, R_PLANETS, rad);

      const symbol = PLANET_SYMBOLS[planet.name] || '●';

      // Glifo del planeta
      planetGlyphs.push(
        <text
          key={`planet-${planet.name}`}
          x={x}
          y={y}
          fontSize={PLANET_SIZE}
          fill={THEME.planets.glyph}
          textAnchor="middle"
          dominantBaseline="middle"
          fontWeight="bold"
          style={{ filter: 'drop-shadow(0 0 3px rgba(230, 213, 255, 0.5))' }}
        >
          {symbol}
        </text>
      );

      // Mostrar grados y minutos si está activado
      if (showPlanetDegrees) {
        const { deg, min } = degMin(planet.longitude);
        const signIdx = getSignIndex(planet.longitude);
        const signSymbol = getSignSymbol(signIdx);

        const label = `${deg}°${min.toString().padStart(2, '0')}′ ${signSymbol}`;
        const labelY = y + PLANET_SIZE * 0.9;

        planetGlyphs.push(
          <text
            key={`planet-label-${planet.name}`}
            x={x}
            y={labelY}
            fontSize={PLANET_LABEL_SIZE}
            fill={THEME.planets.label}
            textAnchor="middle"
            dominantBaseline="hanging"
            fontWeight="500"
          >
            {label}
            {planet.retrograde && (
              <tspan dx="0.1em" dy="-0.4em" fontSize={PLANET_LABEL_SIZE * 0.8}>
                ℞
              </tspan>
            )}
          </text>
        );
      }
    });

    return <g id="planets">{planetGlyphs}</g>;
  };

  // ============================================
  // 6. TABLA DE DATOS (inferior)
  // ============================================
  const renderDataTable = () => {
    if (!showDataTable) return null;

    return (
      <div
        className="mt-6 rounded-lg shadow-xl p-6 max-w-4xl mx-auto border"
        style={{
          background: THEME.table.bg,
          borderColor: THEME.table.accent,
        }}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {data.planets.map((planet) => {
            const { deg, min } = degMin(planet.longitude);
            const signIdx = getSignIndex(planet.longitude);
            const signSymbol = getSignSymbol(signIdx);

            return (
              <div
                key={planet.name}
                className="flex items-center gap-2 p-3 rounded border"
                style={{
                  backgroundColor: 'rgba(212, 175, 55, 0.05)',
                  borderColor: 'rgba(212, 175, 55, 0.2)',
                }}
              >
                <span
                  className="text-xl"
                  style={{ color: THEME.planets.glyph }}
                >
                  {PLANET_SYMBOLS[planet.name] || '●'}
                </span>
                <div>
                  <div
                    className="font-medium text-sm"
                    style={{ color: THEME.table.text }}
                  >
                    {planet.name}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: THEME.table.accent }}
                  >
                    {deg}°{min.toString().padStart(2, '0')}′ {signSymbol}
                    {planet.retrograde && ' ℞'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {data.aspects && data.aspects.length > 0 && (
          <div className="mt-5">
            <h4
              className="font-bold mb-3"
              style={{ color: THEME.table.accent }}
            >
              Aspectos
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {data.aspects.map((aspect, idx) => (
                <div
                  key={idx}
                  className="text-sm p-3 rounded border"
                  style={{
                    backgroundColor: 'rgba(212, 175, 55, 0.05)',
                    borderColor: 'rgba(212, 175, 55, 0.2)',
                    color: THEME.table.text,
                  }}
                >
                  <span className="font-medium">
                    <span style={{ color: THEME.planets.glyph }}>
                      {PLANET_SYMBOLS[aspect.planet1] || aspect.planet1}
                    </span>{' '}
                    <span style={{ color: ASPECT_COLORS[aspect.type] }}>
                      {aspect.type}
                    </span>{' '}
                    <span style={{ color: THEME.planets.glyph }}>
                      {PLANET_SYMBOLS[aspect.planet2] || aspect.planet2}
                    </span>
                  </span>
                  <span
                    className="ml-2"
                    style={{ color: THEME.table.accent, opacity: 0.7 }}
                  >
                    orbe: {aspect.orb.toFixed(1)}°
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="natal-chart-wheel-pro flex flex-col items-center">
      {/* Botón de imprimir PDF */}
      <button
        onClick={handlePrintPDF}
        className="mb-4 px-6 py-2 rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-200 print:hidden"
        style={{
          background: 'linear-gradient(135deg, #d4af37 0%, #f4e5b8 100%)',
          color: '#1a1a2e',
          border: '2px solid #d4af37',
        }}
      >
        📄 Imprimir PDF
      </button>

      {/* SVG centrado */}
      <div className="flex justify-center w-full">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          xmlns="http://www.w3.org/2000/svg"
          style={{ background: 'transparent' }}
        >
          {/* Fondo degradado violeta */}
          <defs>
            <radialGradient id="bg-gradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1a1a2e" />
              <stop offset="100%" stopColor="#0a0a18" />
            </radialGradient>
          </defs>
          <circle cx={cx} cy={cy} r={R} fill="url(#bg-gradient)" />
          <circle cx={cx} cy={cy} r={R} fill="none" stroke={THEME.ticks} strokeWidth={1.5} opacity={0.3} />

          {renderTicks()}
          {renderSigns()}
          {renderHouses()}
          {renderAspects()}
          {renderPlanets()}
        </svg>
      </div>

      {renderDataTable()}
    </div>
  );
};

export default NatalChartWheelPro;
