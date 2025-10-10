/**
 * Zodiac Symbol Component
 * Renders zodiac symbols as inline SVG for guaranteed cross-browser compatibility
 * Fallback to Unicode character if SVG not supported
 */

interface ZodiacSymbolProps {
  sign: string;
  className?: string;
  style?: React.CSSProperties;
}

const ZODIAC_PATHS: Record<string, string> = {
  // SVG paths for each zodiac symbol (simplified for performance)
  'Aries': 'M12 2L14 8L18 12L14 16L12 22L10 16L6 12L10 8L12 2Z',
  'Tauro': 'M12 2C8 2 4 6 4 10C4 14 8 18 12 18C16 18 20 14 20 10C20 6 16 2 12 2ZM12 14L8 18L12 22L16 18L12 14Z',
  'Géminis': 'M6 4H18M6 12H18M6 20H18M8 4V20M16 4V20',
  'Cáncer': 'M4 12C4 8 6 4 10 4C14 4 16 8 16 12M16 12C16 16 14 20 10 20C6 20 4 16 4 12',
  'Leo': 'M12 4C8 4 4 8 4 12C4 16 8 20 12 20M12 4L18 10M18 10C20 12 20 16 18 18C16 20 14 20 12 18',
  'Virgo': 'M4 4V16C4 18 6 20 8 20C10 20 12 18 12 16V4M12 12H16C18 12 20 14 20 16C20 18 18 20 16 20',
  'Libra': 'M4 12H20M8 8H16C18 8 20 10 20 12',
  'Escorpio': 'M4 4V14C4 16 6 18 8 18M12 4V14C12 16 14 18 16 18M16 18L20 22M16 18L20 14',
  'Sagitario': 'M4 20L20 4M20 4V12M20 4H12M16 8L20 4L16 0',
  'Capricornio': 'M4 4V14C4 16 6 18 8 18M12 4V12C12 18 18 18 18 12V4M18 12C18 16 16 20 12 20',
  'Acuario': 'M4 8L8 12L12 8L16 12L20 8M4 16L8 20L12 16L16 20L20 16',
  'Piscis': 'M4 12H20M6 4C6 8 4 12 6 16M18 4C18 8 20 12 18 16',
};

const ZODIAC_UNICODE: Record<string, string> = {
  'Aries': '♈',
  'Tauro': '♉',
  'Géminis': '♊',
  'Cáncer': '♋',
  'Leo': '♌',
  'Virgo': '♍',
  'Libra': '♎',
  'Escorpio': '♏',
  'Sagitario': '♐',
  'Capricornio': '♑',
  'Acuario': '♒',
  'Piscis': '♓',
};

export const ZodiacSymbol: React.FC<ZodiacSymbolProps> = ({ sign, className = '', style = {} }) => {
  const path = ZODIAC_PATHS[sign];
  const unicode = ZODIAC_UNICODE[sign] || '•';

  // If we have an SVG path, render SVG
  if (path) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`inline-block ${className}`}
        style={{ width: '1em', height: '1em', verticalAlign: '-0.125em', ...style }}
        role="img"
        aria-label={sign}
      >
        <path d={path} />
        <title>{sign}</title>
      </svg>
    );
  }

  // Fallback to Unicode character
  return (
    <span className={className} style={style} title={sign}>
      {unicode}
    </span>
  );
};

export default ZodiacSymbol;
