import React from 'react';
import type { ChartData } from '../types/chartWheel';
import { normalize, deltaPos, absToRad, polar, degMin } from '../utils/chartGeometry';
import { useThemeStore } from '../store/useTheme';
import { normalizeAspectKey, getAspectStyle, ASPECTS_STANDARD, getAspectUI } from '../constants/aspectsStandard';

/**
 * NatalChartWheelPro - Implementación EXACTA según rudea astro modelo.md
 * Replica pixel-perfect la geometría de Astro-Seek
 * Soporta modo claro con fondo pastel
 */

import type { DisplayOptions } from '../types/natalForm';

interface NatalChartWheelProProps {
  data: ChartData;
  size?: number;
  showPlanetDegrees?: boolean; // Mostrar deg° min′ junto a planetas
  showDataTable?: boolean; // Tabla inferior con datos detallados
  displayOptions?: DisplayOptions; // Opciones de qué mostrar en la rueda
}

const NatalChartWheelPro: React.FC<NatalChartWheelProProps> = ({
  data,
  size = 1100,
  showPlanetDegrees = true,
  showDataTable = true,
  displayOptions,
}) => {
  const [isZoomModalOpen, setIsZoomModalOpen] = React.useState(false);
  const [aspectsLevel, setAspectsLevel] = React.useState<'basic' | 'standard' | 'complete'>('standard');
  const { isDark } = useThemeStore();
  
  const cx = size / 2;
  const cy = size / 2;
  const R = size / 2;

  // RADIOS EXACTOS - Casas cerca del centro, Signos afuera (ORDEN NATURAL)
  const R_ASPECTS = 0.40 * R;      // Anillo de aspectos (centro) - ACHICADO
  const R_PLANETS = 0.55 * R;      // Anillo de planetas
  const R_HOUSES_INNER = 0.65 * R; // Inicio del anillo de casas (cerca del centro)
  const R_HOUSES_OUTER = 0.75 * R; // Fin del anillo de casas
  const R_SIGNS_INNER = 0.80 * R;  // Signos van afuera (inicio) - AGRANDADO
  const R_SIGNS_OUTER = 0.98 * R;  // Borde externo de signos (más cerca del borde) - AGRANDADO

  // Longitudes de ticks
  const LEN_TICK_1 = Math.max(2, 0.008 * R);
  const LEN_TICK_5 = Math.max(3, 0.015 * R);
  const LEN_TICK_10 = Math.max(4, 0.025 * R);

  const R_SIGN_SYMBOL = (R_SIGNS_INNER + R_SIGNS_OUTER) / 2;

  // Tamaños de texto
  const LABEL_SIZE = Math.max(8, Math.min(0.022 * size, 12));
  const SIGN_SIZE = Math.max(14, Math.min(0.030 * size, 24));
  const HOUSE_NUMBER_SIZE = Math.max(9, Math.min(0.018 * size, 12));
  const PLANET_SIZE = Math.max(12, Math.min(0.026 * size, 22));
  const PLANET_LABEL_SIZE = Math.max(7, Math.min(0.018 * size, 12));

  // Símbolos - Estilo moderno bold (más parecidos a la imagen)
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
    // Puntos Avanzados (español e inglés para compatibilidad)
    'Nodo Norte': '☊',
    'Nodo Sur': '☋',
    Quirón: '⚷',
    Chiron: '⚷', // Alias inglés
    'Parte de la Fortuna': '⊕',
    Vértex: 'Vx',
    'Anti-Vértex': 'AVx',
    // Asteroides
    Ceres: '⚳',
    Pallas: '⚴',
    Juno: '⚵',
    Vesta: '⚶',
    // Lilith (español e inglés)
    Lilith: '⚸',
    'Lilith (Mean)': '⚸',
  };

  // PALETA DRAMÁTICA VIOLETA/DORADO
  const THEME = {
    background: isDark ? 'radial-gradient(circle, #1a1a2e 0%, #0a0a18 100%)' : 'radial-gradient(circle, #FFF8F5 0%, #FFE5D9 100%)',
    ticks: isDark ? '#d4af37' : '#9333EA', // Dorado (oscuro) / Púrpura (claro)
    ticksOpacity: [0.3, 0.5, 0.7], // 1°, 5°, 10°
    degLabels: isDark ? '#f4e5b8' : '#4B5563', // Dorado claro (oscuro) / Gris oscuro (claro)
    signDividers: isDark ? '#8b7355' : '#7C3AED', // Dorado oscuro / Púrpura
    signSymbols: isDark ? '#ffd700' : '#7C3AED', // Dorado brillante / Púrpura
    houseLines: {
      angular: isDark ? '#d4af37' : '#9333EA', // Dorado / Púrpura
      succedent: isDark ? '#b8962e' : '#A855F7', // Dorado medio / Púrpura claro
      cadent: isDark ? '#8b7355' : '#C084FC', // Dorado oscuro / Púrpura muy claro
    },
    houseNumbers: {
      fill: isDark ? '#ffd700' : '#7C3AED',
      bg: isDark ? 'rgba(26, 26, 46, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    },
    axes: {
      color: isDark ? '#ffd700' : '#9333EA',
      labelColor: isDark ? '#f4e5b8' : '#1F2937',
    },
    planets: {
      glyph: isDark ? '#e6d5ff' : '#6B21A8', // Violeta claro / Púrpura oscuro
      label: isDark ? '#d4af37' : '#4B5563', // Dorado / Gris oscuro
    },
    aspects: {
      // Los colores de aspectos se mantienen iguales en ambos modos (ya son distintivos)
      conjunction: '#8B5CF6', // Púrpura
      opposition: '#EF4444', // Rojo
      square: '#F59E0B', // Naranja
      trine: '#10B981', // Verde
      sextil: '#3B82F6', // Azul
      semisextile: '#6366F1', // Índigo
      quincunx: '#EAB308', // Amarillo
      semisquare: '#F97316', // Naranja claro
      sesquisquare: '#F43F5E', // Rosa
    },
    table: {
      bg: isDark ? 'rgba(26, 26, 46, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      text: isDark ? '#f4e5b8' : '#1F2937',
      accent: isDark ? '#d4af37' : '#9333EA',
    },
  };

  // const ASPECT_COLORS: Record<string, string> = THEME.aspects; // replaced by standard

  // (AspectConfig legacy eliminado; ahora usamos estilos del estándar centralizado)

  // ============================================
  // 1. CORONA DE TICKS (360 grados) - APUNTAN HACIA ADENTRO
  // ============================================
  const renderTicks = () => {
    const ticks: React.ReactElement[] = [];

    for (let deg = 0; deg < 360; deg++) {
      const rad = absToRad(deg);
      const is10 = deg % 10 === 0;
      const is5 = deg % 5 === 0 && !is10;

      const len = is10 ? LEN_TICK_10 : is5 ? LEN_TICK_5 : LEN_TICK_1;
      const opacityIndex = is10 ? 2 : is5 ? 1 : 0;
      const opacity = THEME.ticksOpacity[opacityIndex];
      const strokeWidth = is10 ? 1.2 : is5 ? 0.9 : 0.6;

      // Ticks hacia ADENTRO desde el borde externo de signos
      const [x1, y1] = polar(cx, cy, R_SIGNS_OUTER, rad);
      const [x2, y2] = polar(cx, cy, R_SIGNS_OUTER - len, rad);

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

    return (
      <g id="ticks">
        {ticks}
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
          fontSize={SIGN_SIZE * 1.2}
          fill={THEME.signSymbols}
          textAnchor="middle"
          dominantBaseline="middle"
          fontWeight="900"
          style={{ 
            filter: 'drop-shadow(0 0 3px rgba(212, 175, 55, 0.5))',
            fontFamily: 'Arial, sans-serif',
            strokeWidth: '0.5px',
            stroke: THEME.signSymbols,
            paintOrder: 'stroke fill',
          }}
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

      // Línea de cúspide: TODAS las líneas dentro del anillo de casas (HOUSES_INNER a HOUSES_OUTER)
      const [x1, y1] = polar(cx, cy, R_HOUSES_INNER, rad);
      const [x2, y2] = polar(cx, cy, R_HOUSES_OUTER, rad); 

      lines.push(
        <line
          key={`house-line-${house.number}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={color}
          strokeWidth={strokeWidth}
          opacity={isAngular ? 0.9 : 0.7}
          style={isAngular ? { filter: 'drop-shadow(0 0 2px rgba(212, 175, 55, 0.4))' } : {}}
        />
      );

      // Número de casa en midpoint (en el centro del anillo de casas, donde las flechas)
      const nextHouse = data.houses[(idx + 1) % 12];
      const span = deltaPos(cusp, nextHouse.cusp);
      const midDeg = normalize(cusp + span / 2);
      const radMid = absToRad(midDeg);
      // Posición en el centro del anillo de casas (entre HOUSES_INNER y HOUSES_OUTER)
      const [xNum, yNum] = polar(cx, cy, (R_HOUSES_INNER + R_HOUSES_OUTER) / 2, radMid);

      numbers.push(
        <text
          key={`house-num-${house.number}`}
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
      );

      // Etiquetas ASC/MC/DSC/IC (MÁS ADENTRO - en el borde interior del anillo de signos)
      if (house.number === 1) {
        const [xAsc, yAsc] = polar(cx, cy, R_SIGNS_INNER - 0.02 * R, rad);
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
        const [xMc, yMc] = polar(cx, cy, R_SIGNS_INNER - 0.02 * R, rad);
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
        const [xDsc, yDsc] = polar(cx, cy, R_SIGNS_INNER - 0.02 * R, rad);
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
        const [xIc, yIc] = polar(cx, cy, R_SIGNS_INNER - 0.02 * R, rad);
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
      // Obtener configuración desde el estándar centralizado
      const key = normalizeAspectKey(aspect.type);
      if (!key) return;
      const cfg = getAspectStyle(key);

  // (sin filtro por niveles por ahora; se puede mapear por kind major/minor si se desea)

      const p1 = data.planets.find((p) => p.name === aspect.planet1);
      const p2 = data.planets.find((p) => p.name === aspect.planet2);

      if (!p1 || !p2) return;

      const rad1 = absToRad(p1.longitude);
      const rad2 = absToRad(p2.longitude);

      const [x1, y1] = polar(cx, cy, R_ASPECTS, rad1);
      const [x2, y2] = polar(cx, cy, R_ASPECTS, rad2);

      // Ajustar opacidad basada en orbe (aspectos más exactos = más visibles)
      const orbFactor = Math.max(0, 1 - Math.abs(aspect.orb) / 8);
      const finalOpacity = cfg.opacity * (0.5 + orbFactor * 0.5);

      aspectLines.push(
        <line
          key={`aspect-${idx}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={cfg.color}
          strokeWidth={cfg.strokeWidth}
          strokeDasharray={cfg.dashArray}
          opacity={finalOpacity}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <title>{aspect.type} {aspect.planet1}-{aspect.planet2} (orbe: {Math.abs(aspect.orb).toFixed(1)}°)</title>
        </line>
      );
    });

    return <g id="aspects">{aspectLines}</g>;
  };

  // ============================================
  // 5. PLANETAS (con grados y minutos + ANTI-COLISIÓN estilo Astro-Seek)
  // ============================================
  const renderPlanets = () => {
    const planetGlyphs: React.ReactElement[] = [];

    // PASO 1: Detectar planetas cercanos y asignar capas (como Astro-Seek)
    interface PlanetWithLayer {
      planet: typeof data.planets[0];
      layer: number; // 0=interior, 1=medio, 2=exterior
      radius: number;
    }

    const planetsWithLayers: PlanetWithLayer[] = [];
    
    // Filtrar planetas basados en displayOptions
    let filteredPlanets = [...data.planets];
    if (displayOptions) {
      filteredPlanets = filteredPlanets.filter(planet => {
        const name = planet.name.toLowerCase();
        
        // Fortuna
        if (name.includes('fortuna') && !displayOptions.fortuna) return false;
        
        // Vertex
        if (name.includes('vertex') && !displayOptions.vertex) return false;
        
        // Chiron
        if (name.includes('chiron') && !displayOptions.chiron) return false;
        
        // Lilith True
        if (name.includes('lilith') && name.includes('true') && !displayOptions.lilithTrue) return false;
        
        // Nodes True
        if ((name.includes('nodo') || name.includes('node')) && 
            name.includes('true') && !displayOptions.nodesTrue) return false;
        
        return true;
      });
    }
    
    const sortedPlanets = filteredPlanets.sort((a, b) => a.longitude - b.longitude);

    sortedPlanets.forEach((planet, index) => {
      // Calcular distancia angular con vecinos
      const prev = sortedPlanets[(index - 1 + sortedPlanets.length) % sortedPlanets.length];
      const next = sortedPlanets[(index + 1) % sortedPlanets.length];
      
      const distPrev = Math.min(
        Math.abs(planet.longitude - prev.longitude),
        360 - Math.abs(planet.longitude - prev.longitude)
      );
      const distNext = Math.min(
        Math.abs(planet.longitude - next.longitude),
        360 - Math.abs(planet.longitude - next.longitude)
      );

      // Si está muy cerca de vecinos (< 12°), usar capas alternas
      const COLLISION_THRESHOLD = 12;
      let layer = 0;

      if (distPrev < COLLISION_THRESHOLD || distNext < COLLISION_THRESHOLD) {
        // Alternar capas para evitar superposición
        layer = index % 3; // 0, 1, 2 rotando
      }

      // Radios para cada capa (como en Astro-Seek: 3 anillos concéntricos)
      const layerRadii = [
        R_PLANETS - 0.04 * R, // Capa interna
        R_PLANETS,            // Capa media (default)
        R_PLANETS + 0.04 * R, // Capa externa
      ];

      planetsWithLayers.push({
        planet,
        layer,
        radius: layerRadii[layer],
      });
    });

    // PASO 2: Renderizar planetas con sus capas asignadas
    planetsWithLayers.forEach(({ planet, radius }) => {
      const rad = absToRad(planet.longitude);
      const [x, y] = polar(cx, cy, radius, rad);

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

      // Mostrar grados y minutos si está activado (SIN símbolo de signo)
      if (showPlanetDegrees) {
        const { deg, min } = degMin(planet.longitude);

        const label = `${deg}°${min.toString().padStart(2, '0')}′`;
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
  // 6. TABLA DE ASPECTOS PROFESIONAL (estilo Astro-Seek exacto)
  // ============================================
  const renderAspectsGrid = () => {
    if (!showDataTable || !data.aspects || data.aspects.length === 0) return null;

    // Símbolos de aspectos se obtienen inline vía getAspectUI(normalizeAspectKey(...))

    const planetNames = data.planets.map(p => p.name);

    return (
      <div 
        className="mt-8 mx-auto p-6 rounded-2xl shadow-2xl"
        style={{
          background: 'radial-gradient(circle at 50% 30%, #1A0033, #0B0018)',
          maxWidth: '900px',
        }}
      >
        <h3 
          className="text-xl font-bold mb-6 text-center"
          style={{ 
            color: '#FFD700',
            textShadow: '0 0 10px rgba(255, 215, 0, 0.5)'
          }}
        >
          Tabla de Aspectos
        </h3>
        
        {/* Tabla en formato Astro-Seek */}
        <div className="overflow-x-auto">
          <table 
            className="mx-auto"
            style={{ 
              borderCollapse: 'separate',
              borderSpacing: '2px',
            }}
          >
            {/* Encabezado superior (planetas horizontales) */}
            <thead>
              <tr>
                <th style={{ width: '60px', height: '60px' }}></th>
                {planetNames.slice(0, -1).map((planet) => (
                  <th
                    key={planet}
                    style={{
                      backgroundColor: 'rgba(30, 20, 50, 0.8)',
                      border: '1px solid rgba(255, 215, 0, 0.4)',
                      color: '#EDE6FF',
                      width: '50px',
                      height: '50px',
                      textAlign: 'center',
                      verticalAlign: 'middle',
                      padding: '8px',
                      borderRadius: '4px',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                      <span style={{ fontSize: '20px', color: '#FFD700' }}>
                        {PLANET_SYMBOLS[planet] || '●'}
                      </span>
                      <span style={{ fontSize: '9px', color: '#D4AF37' }}>
                        {planet}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            
            {/* Cuerpo de la tabla (solo mitad inferior - forma de escalera) */}
            <tbody>
              {planetNames.slice(1).map((planet1, rowIndex) => {
                const actualRowIndex = rowIndex + 1; // +1 porque empezamos desde el segundo planeta
                
                return (
                  <tr key={planet1}>
                    {/* Encabezado lateral (planeta vertical) */}
                    <td
                      style={{
                        backgroundColor: 'rgba(30, 20, 50, 0.8)',
                        border: '1px solid rgba(255, 215, 0, 0.4)',
                        color: '#EDE6FF',
                        width: '60px',
                        height: '50px',
                        textAlign: 'center',
                        verticalAlign: 'middle',
                        padding: '8px',
                        borderRadius: '4px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                        <span style={{ fontSize: '20px', color: '#FFD700' }}>
                          {PLANET_SYMBOLS[planet1] || '●'}
                        </span>
                        <span style={{ fontSize: '9px', color: '#D4AF37' }}>
                          {planet1}
                        </span>
                      </div>
                    </td>
                    
                    {/* Celdas de aspectos (solo hasta la columna actual - forma triangular) */}
                    {planetNames.slice(0, actualRowIndex).map((planet2) => {
                      // Buscar si existe un aspecto entre estos dos planetas
                      const aspect = data.aspects?.find(
                        a => (a.planet1 === planet1 && a.planet2 === planet2) ||
                             (a.planet1 === planet2 && a.planet2 === planet1)
                      );
                      
                      const k = aspect ? normalizeAspectKey(aspect.type) : null;
                      const aspectSymbol = k ? getAspectUI(k).symbol : null;
                      const color = k ? getAspectUI(k).color : '#A38BFF';
                      
                      return (
                        <td
                          key={`${planet1}-${planet2}`}
                          style={{
                            backgroundColor: aspectSymbol 
                              ? `${color}25` 
                              : 'rgba(15, 10, 30, 0.6)',
                            border: '1px solid rgba(255, 215, 0, 0.3)',
                            width: '50px',
                            height: '50px',
                            textAlign: 'center',
                            verticalAlign: 'middle',
                            padding: '4px',
                            borderRadius: '4px',
                          }}
                        >
                          {aspectSymbol && (
                            <div style={{ 
                              display: 'flex', 
                              flexDirection: 'column', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              height: '100%'
                            }}>
                              <span 
                                style={{ 
                                  fontSize: '22px',
                                  fontWeight: 'bold',
                                  color: color,
                                  textShadow: `0 0 8px ${color}80`,
                                  lineHeight: '1'
                                }}
                              >
                                {aspectSymbol}
                              </span>
                              {aspect && (
                                <span 
                                  style={{ 
                                    fontSize: '9px',
                                    color: '#D4AF37',
                                    opacity: 0.8,
                                    marginTop: '2px'
                                  }}
                                >
                                  {Math.abs(aspect.orb).toFixed(1)}°
                                </span>
                              )}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Leyenda de aspectos */}
        <div 
          className="mt-6 flex flex-wrap justify-center gap-6 text-sm"
          style={{ 
            borderTop: '1px solid rgba(255, 215, 0, 0.3)',
            paddingTop: '16px'
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl" style={{ color: ASPECTS_STANDARD.conjunction.color, textShadow: `0 0 8px ${ASPECTS_STANDARD.conjunction.color}80` }}>☌</span>
            <span style={{ color: '#EDE6FF' }}>Conjunción</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl" style={{ color: ASPECTS_STANDARD.opposition.color, textShadow: `0 0 8px ${ASPECTS_STANDARD.opposition.color}80` }}>☍</span>
            <span style={{ color: '#EDE6FF' }}>Oposición</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl" style={{ color: ASPECTS_STANDARD.trine.color, textShadow: `0 0 8px ${ASPECTS_STANDARD.trine.color}80` }}>△</span>
            <span style={{ color: '#EDE6FF' }}>Trígono</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl" style={{ color: ASPECTS_STANDARD.square.color, textShadow: `0 0 8px ${ASPECTS_STANDARD.square.color}80` }}>□</span>
            <span style={{ color: '#EDE6FF' }}>Cuadratura</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl" style={{ color: ASPECTS_STANDARD.sextile.color, textShadow: `0 0 8px ${ASPECTS_STANDARD.sextile.color}80` }}>✶</span>
            <span style={{ color: '#EDE6FF' }}>Sextil</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="natal-chart-wheel-pro flex flex-col items-center">
        {/* Control de niveles de aspectos - Movido arriba */}
        <div className="flex gap-2 mb-4 flex-wrap justify-center print:hidden">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
            Aspectos:
          </span>
          <button
            onClick={() => setAspectsLevel('basic')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              aspectsLevel === 'basic'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            📊 Básico
          </button>
          <button
            onClick={() => setAspectsLevel('standard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              aspectsLevel === 'standard'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            📈 Estándar
          </button>
          <button
            onClick={() => setAspectsLevel('complete')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              aspectsLevel === 'complete'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            🔬 Completo
          </button>
          
          {/* Botón de zoom móvil */}
          <button
            onClick={() => setIsZoomModalOpen(true)}
            className="md:hidden px-3 py-1.5 rounded-lg font-semibold text-xs shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-2 border-purple-400"
          >
            🔍 Ver en grande
          </button>
        </div>

        {/* Contenedor con leyenda y rueda */}
        <div className="flex gap-6 justify-center items-start w-full flex-col lg:flex-row">
          {/* Leyenda de aspectos - Solo visible en desktop */}
          <div className="hidden lg:block bg-white dark:bg-gray-900 rounded-xl p-4 shadow-lg border border-purple-300 dark:border-purple-700 min-w-[220px]">
            <h4 className="text-sm font-bold text-purple-900 dark:text-purple-100 mb-3 flex items-center gap-2">
              <span>🎨</span>
              Colores de Aspectos
            </h4>
            
            {/* Aspectos Básicos */}
            <div className="space-y-2 mb-3">
              <p className="text-xs font-semibold text-gray-800 dark:text-gray-400 uppercase">Básicos</p>
              <div className="flex items-center gap-2">
                <span className="text-sm opacity-60" style={{ color: THEME.aspects.conjunction }}>☌</span>
                <div className="w-8 h-0.5" style={{ backgroundColor: THEME.aspects.conjunction }}></div>
                <span className="text-xs text-gray-900 dark:text-gray-300 font-medium">Conjunción</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm opacity-60" style={{ color: ASPECTS_STANDARD.opposition.color }}>☍</span>
                <div className="w-8 h-0.5" style={{ backgroundColor: ASPECTS_STANDARD.opposition.color }}></div>
                <span className="text-xs text-gray-900 dark:text-gray-300 font-medium">Oposición</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm opacity-60" style={{ color: ASPECTS_STANDARD.square.color }}>□</span>
                <div className="w-8 h-0.5" style={{ backgroundColor: ASPECTS_STANDARD.square.color }}></div>
                <span className="text-xs text-gray-900 dark:text-gray-300 font-medium">Cuadratura</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm opacity-60" style={{ color: ASPECTS_STANDARD.trine.color }}>△</span>
                <div className="w-8 h-0.5" style={{ backgroundColor: ASPECTS_STANDARD.trine.color }}></div>
                <span className="text-xs text-gray-900 dark:text-gray-300 font-medium">Trígono</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm opacity-60" style={{ color: ASPECTS_STANDARD.sextile.color }}>✶</span>
                <div className="w-8 h-0.5" style={{ backgroundColor: ASPECTS_STANDARD.sextile.color }}></div>
                <span className="text-xs text-gray-900 dark:text-gray-300 font-medium">Sextil</span>
              </div>
            </div>

            {/* Aspectos Estándar */}
            {(aspectsLevel === 'standard' || aspectsLevel === 'complete') && (
              <div className="space-y-2 mb-3 pt-3 border-t border-gray-300 dark:border-gray-700">
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-400 uppercase">Estándar</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm opacity-60" style={{ color: ASPECTS_STANDARD.semisquare.color }}>∠</span>
                  <svg width="32" height="2" className="flex-shrink-0">
                    <line x1="0" y1="1" x2="32" y2="1" stroke={ASPECTS_STANDARD.semisquare.color} strokeWidth="2" strokeDasharray="3,2" />
                  </svg>
                  <span className="text-xs text-gray-900 dark:text-gray-300 font-medium">Semicuadratura</span>
                </div>
              </div>
            )}

            {/* Aspectos Completos */}
            {aspectsLevel === 'complete' && (
              <div className="space-y-2 pt-3 border-t border-gray-300 dark:border-gray-700">
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-400 uppercase">Menores</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm opacity-60" style={{ color: ASPECTS_STANDARD.semisextile.color }}>⚺</span>
                  <svg width="32" height="2" className="flex-shrink-0">
                    <line x1="0" y1="1" x2="32" y2="1" stroke={ASPECTS_STANDARD.semisextile.color} strokeWidth="2" strokeDasharray="2,3" />
                  </svg>
                  <span className="text-xs text-gray-900 dark:text-gray-300 font-medium">Semisextil</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm opacity-60" style={{ color: ASPECTS_STANDARD.quincunx.color }}>⚻</span>
                  <svg width="32" height="2" className="flex-shrink-0">
                    <line x1="0" y1="1" x2="32" y2="1" stroke={ASPECTS_STANDARD.quincunx.color} strokeWidth="2" strokeDasharray="2,3" />
                  </svg>
                  <span className="text-xs text-gray-900 dark:text-gray-300 font-medium">Quincuncio</span>
                </div>
              </div>
            )}

            {/* Nota sobre grosor */}
            <div className="mt-4 p-2 bg-purple-100 dark:bg-purple-900/20 rounded text-[10px] text-gray-800 dark:text-gray-400 font-medium">
              💡 Líneas más gruesas = aspectos más importantes
            </div>
            
            {/* Link al glosario */}
            <a 
              href="/glossary?categoria=aspects" 
              className="mt-2 block text-center text-[10px] text-purple-700 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300 font-semibold underline transition-colors"
            >
              📖 Leer más sobre aspectos
            </a>
          </div>

          {/* SVG centrado - clickeable en móvil */}
          <div 
            className="flex justify-center w-full cursor-pointer md:cursor-default"
            onClick={() => {
              if (window.innerWidth < 768) {
                setIsZoomModalOpen(true);
              }
            }}
          >
            <svg
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
              xmlns="http://www.w3.org/2000/svg"
              style={{ background: 'transparent' }}
              className="max-w-full h-auto"
            >
            {/* Fondo degradado - modo oscuro (violeta) / modo claro (pastel) */}
            <defs>
              <radialGradient id="bg-gradient" cx="50%" cy="50%" r="50%">
                {isDark ? (
                  <>
                    <stop offset="0%" stopColor="#1a1a2e" />
                    <stop offset="100%" stopColor="#0a0a18" />
                  </>
                ) : (
                  <>
                    <stop offset="0%" stopColor="#FFF8F5" />
                    <stop offset="30%" stopColor="#FFE5D9" />
                    <stop offset="70%" stopColor="#D4F1F4" />
                    <stop offset="100%" stopColor="#F8E6F1" />
                  </>
                )}
              </radialGradient>
            </defs>
            <circle cx={cx} cy={cy} r={R} fill="url(#bg-gradient)" />

            {/* Círculos concéntricos principales - SOLO los necesarios */}
            <g id="structure-circles">
              {/* Círculo de aspectos (centro) */}
              <circle cx={cx} cy={cy} r={R_ASPECTS} fill="none" stroke={THEME.ticks} strokeWidth={0.8} opacity={0.15} />
              
              {/* Anillo de CASAS (cerca del centro) */}
              <circle cx={cx} cy={cy} r={R_HOUSES_INNER} fill="none" stroke={THEME.ticks} strokeWidth={2} opacity={0.4} />
              <circle cx={cx} cy={cy} r={R_HOUSES_OUTER} fill="none" stroke={THEME.ticks} strokeWidth={2} opacity={0.4} />
              
              {/* Anillo de SIGNOS (exterior) */}
              <circle cx={cx} cy={cy} r={R_SIGNS_INNER} fill="none" stroke={THEME.ticks} strokeWidth={2} opacity={0.4} />
              <circle cx={cx} cy={cy} r={R_SIGNS_OUTER} fill="none" stroke={THEME.ticks} strokeWidth={2} opacity={0.4} />
            </g>

            {renderTicks()}
            {renderSigns()}
            {renderHouses()}
            {renderAspects()}
            {renderPlanets()}
          </svg>
        </div>
        </div>

        {renderAspectsGrid()}
      </div>

      {/* Modal de Zoom para móviles */}
      {isZoomModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setIsZoomModalOpen(false)}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <button
              onClick={() => setIsZoomModalOpen(false)}
              className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 backdrop-blur-sm transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="overflow-auto max-h-full max-w-full" onClick={(e) => e.stopPropagation()}>
              <svg
                width={800}
                height={800}
                viewBox={`0 0 ${size} ${size}`}
                xmlns="http://www.w3.org/2000/svg"
                style={{ background: 'transparent' }}
                className="min-w-[600px]"
              >
                <defs>
                  <radialGradient id="bg-gradient-zoom" cx="50%" cy="50%" r="50%">
                    {isDark ? (
                      <>
                        <stop offset="0%" stopColor="#1a1a2e" />
                        <stop offset="100%" stopColor="#0a0a18" />
                      </>
                    ) : (
                      <>
                        <stop offset="0%" stopColor="#FFF8F5" />
                        <stop offset="30%" stopColor="#FFE5D9" />
                        <stop offset="70%" stopColor="#D4F1F4" />
                        <stop offset="100%" stopColor="#F8E6F1" />
                      </>
                    )}
                  </radialGradient>
                </defs>
                <circle cx={cx} cy={cy} r={R} fill="url(#bg-gradient-zoom)" />

                <g id="structure-circles">
                  <circle cx={cx} cy={cy} r={R_ASPECTS} fill="none" stroke={THEME.ticks} strokeWidth={0.8} opacity={0.15} />
                  <circle cx={cx} cy={cy} r={R_HOUSES_INNER} fill="none" stroke={THEME.ticks} strokeWidth={2} opacity={0.4} />
                  <circle cx={cx} cy={cy} r={R_HOUSES_OUTER} fill="none" stroke={THEME.ticks} strokeWidth={2} opacity={0.4} />
                  <circle cx={cx} cy={cy} r={R_SIGNS_INNER} fill="none" stroke={THEME.ticks} strokeWidth={2} opacity={0.4} />
                  <circle cx={cx} cy={cy} r={R_SIGNS_OUTER} fill="none" stroke={THEME.ticks} strokeWidth={2} opacity={0.4} />
                </g>

                {renderTicks()}
                {renderSigns()}
                {renderHouses()}
                {renderAspects()}
                {renderPlanets()}
              </svg>
            </div>
            
            <p className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/70 text-sm">
              Pellizca para hacer zoom • Arrastra para mover
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default NatalChartWheelPro;
