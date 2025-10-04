/**
 * Tipos para el formulario de Carta Natal
 * Basado en especificaciones de astro.com
 */

export type ExtraOptions = {
  houseSystem: 'Placidus' | 'WholeSign' | 'Koch' | 'Equal';
  asteroids: {
    ceres: boolean;
    pallas: boolean;
    juno: boolean;
    vesta: boolean;
    chiron: boolean;
  };
  aspects: {
    conjunction: boolean;
    opposition: boolean;
    trine: boolean;
    square: boolean;
    sextile: boolean;
    quincunx: boolean;
  };
  aspectOrbs: number; // en grados, default 6
  lilith: {
    mean: boolean;
    true: boolean;
  };
  nodes: {
    mean: boolean;
    true: boolean;
  };
  polarizations: boolean;
  arabicParts: boolean;
  parallelDeclinations: boolean;
};

export type FormValue = {
  name: string;
  surname?: string;
  gender?: 'female' | 'male' | 'other' | 'event';
  isSelf?: boolean; // "soy yo"
  birth: {
    day: number;
    month: number;
    year: number;
    time?: { hour: number; minute: number };
    timeAccuracy: 'exact' | 'approx' | 'unknown';
  };
  location: {
    countryCode: string; // ISO-3166-1 alpha-2
    region?: string; // provincia/estado
    city?: string;
    neighborhood?: string;
    lat?: number;
    lon?: number; // si el usuario ingresa coordenadas
    tzId?: string; // IANA (ej: "America/Argentina/Buenos_Aires")
  };
  settings: ExtraOptions;
};

export type NatalChartFormProps = {
  defaultValues?: Partial<FormValue>;
  onSubmit: (data: FormValue) => void;
  onCancel?: () => void;
};

export const DEFAULT_SETTINGS: ExtraOptions = {
  houseSystem: 'Placidus',
  asteroids: {
    ceres: false,
    pallas: false,
    juno: false,
    vesta: false,
    chiron: true,
  },
  aspects: {
    conjunction: true,
    opposition: true,
    trine: true,
    square: true,
    sextile: true,
    quincunx: false,
  },
  aspectOrbs: 6,
  lilith: {
    mean: true,
    true: false,
  },
  nodes: {
    mean: true,
    true: false,
  },
  polarizations: false,
  arabicParts: false,
  parallelDeclinations: false,
};
