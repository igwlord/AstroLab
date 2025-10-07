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

  // RADIOS EXACTOS - Casas cerca del centro, Signos afuera (ORDEN NATURAL)
  const R_ASPECTS = 0.52 * R;      // Anillo de aspectos (centro)
  const BASE_R = 0.66 * R;         // Radio base para planetas (según especificación)
  const LANE_STEP = 0.03 * R;      // Separación entre carriles de planetas
  const R_HOUSES_INNER = 0.70 * R; // Inicio del anillo de casas (cerca del centro)
  const R_HOUSES_OUTER = 0.78 * R; // Fin del anillo de casas
  const R_SIGNS_INNER = 0.82 * R;  // Signos van afuera (inicio) - MÁS ANCHO
  const R_SIGNS_OUTER = 0.96 * R;  // Borde externo de signos (más cerca del borde) - MÁS ANCHO
  const R_SIGN_SYMBOL = 0.89 * R;  // Radio para símbolos de signos (centrados en el nuevo ancho)

  // Longitudes de ticks
  const LEN_TICK_1 = Math.max(2, 0.01 * R);   // 1° tick
  const LEN_TICK_5 = Math.max(3, 0.015 * R);  // 5° tick
  const LEN_TICK_10 = Math.max(4, 0.025 * R); // 10° tick (marca fuerte)
  
  // Parámetros de colisión de planetas
  const MIN_ANG_SEP = 6;           // Separación mínima angular en grados
  const MAX_CLUSTER_SPREAD = 8;    // Apertura total extra por cluster
  // const GLYPH_SIZE = 20;        // Tamaño del glifo en px (reservado para bounding box collision)

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

      const strokeWidth = isAngular ? 3.0 : isSuccedent ? 2.0 : 1.5;
      const color = isAngular
        ? THEME.houseLines.angular
        : isSuccedent
        ? THEME.houseLines.succedent
        : THEME.houseLines.cadent;

      // Líneas de cúspide: TODAS van desde R_HOUSES_INNER hasta R_SIGNS_INNER
      // - Ángulos (ASC/MC/DSC/IC): Más largas, atraviesan hasta el anillo de signos
      // - Otras casas: Desde el anillo de casas hasta el inicio de signos
      const [x1, y1] = polar(cx, cy, R_HOUSES_INNER, rad); // Todas desde el borde interno de casas
      
      const [x2, y2] = isAngular 
        ? polar(cx, cy, R_SIGNS_OUTER, rad)  // Ángulos: atraviesan TODO el anillo de signos
        : polar(cx, cy, R_SIGNS_INNER, rad); // Otras: hasta el inicio del anillo de signos

      lines.push(
        <line
          key={`house-line-${house.number}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={color}
          strokeWidth={strokeWidth}
          opacity={isAngular ? 1.0 : 0.85}
          style={isAngular ? { filter: 'drop-shadow(0 0 2px rgba(212, 175, 55, 0.4))' } : {}}
        />
      );

      // Número de casa en midpoint (en el centro del anillo de casas, cerca del centro)
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

      // Etiquetas ASC/MC/DSC/IC (FUERA del borde externo, en el anillo de signos)
      if (house.number === 1) {
        const [xAsc, yAsc] = polar(cx, cy, R_SIGNS_OUTER + 0.03 * R, rad);
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
        const [xMc, yMc] = polar(cx, cy, R_SIGNS_OUTER + 0.03 * R, rad);
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
        const [xDsc, yDsc] = polar(cx, cy, R_SIGNS_OUTER + 0.03 * R, rad);
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
        const [xIc, yIc] = polar(cx, cy, R_SIGNS_OUTER + 0.03 * R, rad);
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
  // 5. PLANETAS (con algoritmo profesional de colisión)
  // ============================================
  
  // Utilidades para ángulos circulares
  const wrap360 = (deg: number): number => ((deg % 360) + 360) % 360;
  
  const circularMean = (angles: number[]): number => {
    const n = angles.length;
    if (n === 0) return 0;
    
    // Convertir a coordenadas cartesianas, promediar y volver a polar
    let sumX = 0, sumY = 0;
    angles.forEach(a => {
      const rad = (a * Math.PI) / 180;
      sumX += Math.cos(rad);
      sumY += Math.sin(rad);
    });
    const meanRad = Math.atan2(sumY / n, sumX / n);
    return wrap360((meanRad * 180) / Math.PI);
  };
  
  const spreadAngles = (angles: number[], spread: number): number[] => {
    const n = angles.length;
    if (n === 1) return angles;
    
    const c = circularMean(angles);
    const half = spread / 2;
    return angles.map((_, i) => {
      const t = -half + (i * (spread / (n - 1)));
      return wrap360(c + t);
    });
  };
  
  const renderPlanets = () => {
    const planetGlyphs: React.ReactElement[] = [];
    const leaderLines: React.ReactElement[] = [];

    // PASO 1: Preparar todos los cuerpos (planetas)
    interface Body {
      name: string;
      lambdaDeg: number;
    }
    
    const bodies: Body[] = data.planets.map(p => ({
      name: p.name,
      lambdaDeg: p.longitude
    }));
    
    // Ordenar por longitud
    bodies.sort((a, b) => a.lambdaDeg - b.lambdaDeg);

    // PASO 2: Clusterizar por proximidad
    const clusters: Body[][] = [];
    let currentCluster: Body[] = [bodies[0]];
    
    for (let i = 1; i < bodies.length; i++) {
      const prev = currentCluster[currentCluster.length - 1].lambdaDeg;
      const here = bodies[i].lambdaDeg;
      const d = Math.min(Math.abs(here - prev), 360 - Math.abs(here - prev));
      
      if (d < MIN_ANG_SEP) {
        currentCluster.push(bodies[i]);
      } else {
        clusters.push(currentCluster);
        currentCluster = [bodies[i]];
      }
    }
    clusters.push(currentCluster);

    // PASO 3: Layout de cada cluster
    interface PlacedBody {
      name: string;
      lane: number;
      thetaDrawDeg: number;
      thetaTrueDeg: number;
      x: number;
      y: number;
    }
    
    const placed: PlacedBody[] = [];
    const laneOrder = [0, 1, -1, 2, -2, 3, -3, 4, -4]; // Carriles alternados
    
    for (const cluster of clusters) {
      if (cluster.length === 1) {
        // Solo un planeta, sin spread
        const body = cluster[0];
        const lane = 0;
        const r = BASE_R + lane * LANE_STEP;
        const θ = absToRad(body.lambdaDeg);
        
        placed.push({
          name: body.name,
          lane,
          thetaDrawDeg: body.lambdaDeg,
          thetaTrueDeg: body.lambdaDeg,
          x: cx + r * Math.cos(θ),
          y: cy - r * Math.sin(θ)
        });
      } else {
        // Cluster con múltiples planetas
        const thetas = spreadAngles(
          cluster.map(b => b.lambdaDeg), 
          MAX_CLUSTER_SPREAD
        );
        
        for (let i = 0; i < cluster.length; i++) {
          const body = cluster[i];
          const lane = laneOrder[i] ?? 0;
          const r = BASE_R + lane * LANE_STEP;
          const θ = absToRad(thetas[i]);
          
          placed.push({
            name: body.name,
            lane,
            thetaDrawDeg: thetas[i],
            thetaTrueDeg: body.lambdaDeg,
            x: cx + r * Math.cos(θ),
            y: cy - r * Math.sin(θ)
          });
          
          // Leader line si hubo spread angular
          if (Math.abs(thetas[i] - body.lambdaDeg) > 0.5) {
            const θTrue = absToRad(body.lambdaDeg);
            const xTrue = cx + BASE_R * Math.cos(θTrue);
            const yTrue = cy - BASE_R * Math.sin(θTrue);
            
            leaderLines.push(
              <line
                key={`leader-${body.name}`}
                x1={cx + r * Math.cos(θ)}
                y1={cy - r * Math.sin(θ)}
                x2={xTrue}
                y2={yTrue}
                stroke={THEME.planets.label}
                strokeWidth={0.5}
                opacity={0.4}
                strokeDasharray="2,2"
              />
            );
          }
        }
      }
    }

    // PASO 4: Renderizar planetas
    placed.forEach(({ name, x, y }) => {
      const planet = data.planets.find(p => p.name === name);
      if (!planet) return;
      
      const symbol = PLANET_SYMBOLS[name] || '●';

      // Glifo del planeta
      planetGlyphs.push(
        <text
          key={`planet-${name}`}
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
            key={`planet-label-${name}`}
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

    return (
      <g id="planets">
        {leaderLines}
        {planetGlyphs}
      </g>
    );
  };

  // ============================================
  // 6. TABLA DE ASPECTOS PROFESIONAL (estilo Astro-Seek exacto)
  // ============================================
  const renderAspectsGrid = () => {
    if (!showDataTable || !data.aspects || data.aspects.length === 0) return null;

    // Símbolos de aspectos
    const ASPECT_SYMBOLS: Record<string, string> = {
      'conjunction': '☌',
      'conjuncion': '☌',
      'opposition': '☍',
      'oposicion': '☍',
      'trine': '△',
      'trigono': '△',
      'square': '□',
      'cuadratura': '□',
      'sextile': '⚹',
      'sextil': '⚹',
    };

    // Símbolos de puntos especiales
    const SPECIAL_SYMBOLS: Record<string, string> = {
      'Node': '☊',
      'Nodo Norte': '☊',
      'Lilith': '⚸',
      'Chiron': '⚷',
      'Fortune': '⊗',
      'Fortuna': '⊗',
      'Vertex': '⚹',
      'ASC': 'AC',
      'MC': 'MC',
    };

    // Combinar planetas + puntos especiales + ASC/MC
    const allBodies: Array<{ name: string; longitude: number; house?: number }> = [
      ...data.planets.map(p => ({ 
        name: p.name, 
        longitude: p.longitude,
        house: data.houses.find(h => {
          const nextHouse = data.houses.find(h2 => h2.number === (h.number % 12) + 1);
          if (!nextHouse) return false;
          const span = deltaPos(h.cusp, nextHouse.cusp);
          const inHouse = deltaPos(h.cusp, p.longitude) < span;
          return inHouse;
        })?.number
      }))
    ];

    // Agregar puntos especiales si existen
    if (data.points) {
      data.points.forEach(point => {
        allBodies.push({ 
          name: point.name, 
          longitude: point.longitude,
          house: data.houses.find(h => {
            const nextHouse = data.houses.find(h2 => h2.number === (h.number % 12) + 1);
            if (!nextHouse) return false;
            const span = deltaPos(h.cusp, nextHouse.cusp);
            const inHouse = deltaPos(h.cusp, point.longitude) < span;
            return inHouse;
          })?.number
        });
      });
    }

    // Agregar ASC (Casa 1) y MC (Casa 10)
    const ascHouse = data.houses.find(h => h.number === 1);
    const mcHouse = data.houses.find(h => h.number === 10);
    
    if (ascHouse) {
      allBodies.push({ name: 'ASC', longitude: ascHouse.cusp, house: 1 });
    }
    if (mcHouse) {
      allBodies.push({ name: 'MC', longitude: mcHouse.cusp, house: 10 });
    }

    const allNames = allBodies.map(b => b.name);

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
            {/* Encabezado superior (planetas + puntos especiales horizontales) */}
            <thead>
              <tr>
                <th style={{ width: '80px', height: '60px' }}></th>
                {allNames.slice(0, -1).map((name) => (
                  <th
                    key={name}
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
                      <span style={{ fontSize: '18px', color: '#FFD700' }}>
                        {PLANET_SYMBOLS[name] || SPECIAL_SYMBOLS[name] || '●'}
                      </span>
                      <span style={{ fontSize: '8px', color: '#D4AF37' }}>
                        {name}
                      </span>
                    </div>
                  </th>
                ))}
                <th 
                  style={{
                    backgroundColor: 'rgba(30, 20, 50, 0.8)',
                    border: '1px solid rgba(255, 215, 0, 0.4)',
                    color: '#EDE6FF',
                    width: '50px',
                    textAlign: 'center',
                    fontSize: '10px',
                    padding: '8px',
                    borderRadius: '4px',
                  }}
                >
                  Casa
                </th>
              </tr>
            </thead>
            
            {/* Cuerpo de la tabla (solo mitad inferior - forma de escalera) */}
            <tbody>
              {allBodies.slice(1).map((body1, rowIndex) => {
                const actualRowIndex = rowIndex + 1;
                const { name: name1, house: house1 } = body1;
                
                return (
                  <tr key={name1}>
                    {/* Encabezado lateral (planeta/punto vertical) */}
                    <td
                      style={{
                        backgroundColor: 'rgba(30, 20, 50, 0.8)',
                        border: '1px solid rgba(255, 215, 0, 0.4)',
                        color: '#EDE6FF',
                        width: '80px',
                        height: '50px',
                        textAlign: 'center',
                        verticalAlign: 'middle',
                        padding: '8px',
                        borderRadius: '4px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                        <span style={{ fontSize: '18px', color: '#FFD700' }}>
                          {PLANET_SYMBOLS[name1] || SPECIAL_SYMBOLS[name1] || '●'}
                        </span>
                        <span style={{ fontSize: '8px', color: '#D4AF37' }}>
                          {name1}
                        </span>
                      </div>
                    </td>
                    
                    {/* Celdas de aspectos (solo hasta la columna actual - forma triangular) */}
                    {allNames.slice(0, actualRowIndex).map((name2) => {
                      // Buscar si existe un aspecto entre estos dos cuerpos
                      const aspect = data.aspects?.find(
                        a => (a.planet1 === name1 && a.planet2 === name2) ||
                             (a.planet1 === name2 && a.planet2 === name1)
                      );
                      
                      const aspectSymbol = aspect ? ASPECT_SYMBOLS[aspect.type.toLowerCase()] : null;
                      const color = aspect ? ASPECT_COLORS[aspect.type] : '#A38BFF';
                      
                      return (
                        <td
                          key={`${name1}-${name2}`}
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
                    
                    {/* Columna de Casa */}
                    <td
                      style={{
                        backgroundColor: 'rgba(30, 20, 50, 0.8)',
                        border: '1px solid rgba(255, 215, 0, 0.4)',
                        color: '#FFD700',
                        width: '50px',
                        height: '50px',
                        textAlign: 'center',
                        verticalAlign: 'middle',
                        padding: '8px',
                        borderRadius: '4px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                      }}
                    >
                      {house1 || '-'}
                    </td>
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
            <span className="text-2xl" style={{ color: ASPECT_COLORS.conjunction, textShadow: `0 0 8px ${ASPECT_COLORS.conjunction}80` }}>☌</span>
            <span style={{ color: '#EDE6FF' }}>Conjunción</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl" style={{ color: ASPECT_COLORS.opposition, textShadow: `0 0 8px ${ASPECT_COLORS.opposition}80` }}>☍</span>
            <span style={{ color: '#EDE6FF' }}>Oposición</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl" style={{ color: ASPECT_COLORS.trine, textShadow: `0 0 8px ${ASPECT_COLORS.trine}80` }}>△</span>
            <span style={{ color: '#EDE6FF' }}>Trígono</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl" style={{ color: ASPECT_COLORS.square, textShadow: `0 0 8px ${ASPECT_COLORS.square}80` }}>□</span>
            <span style={{ color: '#EDE6FF' }}>Cuadratura</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl" style={{ color: ASPECT_COLORS.sextil, textShadow: `0 0 8px ${ASPECT_COLORS.sextil}80` }}>⚹</span>
            <span style={{ color: '#EDE6FF' }}>Sextil</span>
          </div>
        </div>
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

      {renderAspectsGrid()}
    </div>
  );
};

export default NatalChartWheelPro;
