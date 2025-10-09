// Centralized aspects visual standard per user's spec

export type AspectKey =
  | 'conjunction'
  | 'semisextile'
  | 'semisquare'
  | 'sextile'
  | 'square'
  | 'trine'
  | 'quincunx'
  | 'opposition';

export interface AspectStandard {
  angle: number;
  symbol: string;
  color: string; // HEX
  relation: 'Fusión' | 'Conexión' | 'Tensión' | 'Fluidez' | 'Desafío' | 'Afinidad' | 'Divergencia' | 'Confrontación';
  kind: 'major' | 'minor';
}

export const ASPECTS_STANDARD: Record<AspectKey, AspectStandard> = {
  conjunction: { angle: 0,   symbol: '☌', color: '#FF0000', relation: 'Fusión',        kind: 'major' },
  semisextile: { angle: 30,  symbol: '⚺', color: '#0070C0', relation: 'Conexión',      kind: 'minor' },
  semisquare:  { angle: 45,  symbol: '∠', color: '#C00000', relation: 'Tensión',       kind: 'minor' },
  sextile:     { angle: 60,  symbol: '✶', color: '#00B0F0', relation: 'Fluidez',       kind: 'major' },
  square:      { angle: 90,  symbol: '□', color: '#FF0000', relation: 'Desafío',       kind: 'major' },
  trine:       { angle: 120, symbol: '△', color: '#0070C0', relation: 'Afinidad',      kind: 'major' },
  quincunx:    { angle: 150, symbol: '⚻', color: '#00B050', relation: 'Divergencia',   kind: 'minor' },
  opposition:  { angle: 180, symbol: '☍', color: '#C00000', relation: 'Confrontación', kind: 'major' },
};

// Normalize varied input names into canonical AspectKey
export function normalizeAspectKey(raw: string | undefined | null): AspectKey | null {
  if (!raw) return null;
  const s = raw
    .toLowerCase()
    .normalize('NFD').replace(/\p{Diacritic}/gu, '') // remove accents
    .replace(/\s+/g, '')
    .replace(/[-_]/g, '');

  if (s === 'conjunction' || s === 'conjuncion') return 'conjunction';
  if (s === 'opposition' || s === 'oposicion') return 'opposition';
  if (s === 'square' || s === 'cuadratura') return 'square';
  if (s === 'trine' || s === 'trigono') return 'trine';
  if (s === 'sextile' || s === 'sextil') return 'sextile';
  if (s === 'semisextile' || s === 'semisextil') return 'semisextile';
  if (s === 'semisquare' || s === 'semicuadratura' || s === 'semicuadrado') return 'semisquare';
  if (s === 'quincunx' || s === 'quincuncio') return 'quincunx';
  return null;
}

export interface AspectStyle {
  color: string;
  strokeWidth: number;
  dashArray?: string;
  opacity: number; // base opacity before any orb factor
}

export function getAspectStyle(key: AspectKey): AspectStyle {
  const base = ASPECTS_STANDARD[key];
  const isMajor = base.kind === 'major';
  const color = base.color;

  // Visual rules from the spec
  if (key === 'quincunx') {
    return { color, strokeWidth: 1.2, dashArray: '3,3', opacity: 0.65 };
  }

  if (key === 'semisextile') {
    return { color, strokeWidth: 1.2, opacity: 0.6 };
  }
  if (key === 'semisquare') {
    return { color, strokeWidth: 1.6, opacity: 0.7 };
  }

  if (key === 'trine' || key === 'sextile') {
    return { color, strokeWidth: isMajor ? 1.4 : 1.2, opacity: 0.7 };
  }

  // Reds (tension/active): opposition, square, conjunction
  if (key === 'opposition' || key === 'square' || key === 'conjunction') {
    return { color, strokeWidth: isMajor ? 1.8 : 1.6, opacity: 0.8 };
  }

  // Fallback
  return { color, strokeWidth: 1.5, opacity: 0.7 };
}

export function getAspectUI(key: AspectKey) {
  const a = ASPECTS_STANDARD[key];
  return { symbol: a.symbol, color: a.color };
}
