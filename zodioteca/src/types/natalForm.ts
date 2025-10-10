/**
 * Tipos para el formulario de Carta Natal
 * Basado en especificaciones de astro.com
 */

export type DisplayOptions = {
  fortuna: boolean;
  vertex: boolean;
  chiron: boolean;
  lilithMean: boolean; // Mean Lilith
  lilithTrue: boolean; // True Lilith
  nodesMean: boolean; // Mean Nodes (solo Mean, True removido)
};

export type ExtraOptions = {
  houseSystem: 'Placidus' | 'WholeSign' | 'Koch' | 'Equal';
  display: DisplayOptions; // Nuevo: opciones de visualización en la rueda
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
  display: {
    fortuna: true,
    vertex: true,
    chiron: true,
    lilithMean: true,
    lilithTrue: true,
    nodesMean: true,
  },
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
