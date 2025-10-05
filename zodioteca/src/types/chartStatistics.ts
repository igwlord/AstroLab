// Tipos para las estadísticas de la carta natal

export interface ModalityStats {
  cardinal: {
    count: number;
    percentage: number;
    signs: string[];
  };
  fixed: {
    count: number;
    percentage: number;
    signs: string[];
  };
  mutable: {
    count: number;
    percentage: number;
    signs: string[];
  };
}

export interface ElementStats {
  fire: {
    count: number;
    percentage: number;
    signs: string[];
  };
  earth: {
    count: number;
    percentage: number;
    signs: string[];
  };
  air: {
    count: number;
    percentage: number;
    signs: string[];
  };
  water: {
    count: number;
    percentage: number;
    signs: string[];
  };
}

export interface PolarityStats {
  masculine: {
    count: number;
    percentage: number;
    signs: string[];
  };
  feminine: {
    count: number;
    percentage: number;
    signs: string[];
  };
}

export interface QuadrantStats {
  first: {
    count: number;
    percentage: number;
    houses: number[];
  };
  second: {
    count: number;
    percentage: number;
    houses: number[];
  };
  third: {
    count: number;
    percentage: number;
    houses: number[];
  };
  fourth: {
    count: number;
    percentage: number;
    houses: number[];
  };
}

export interface ChartStatistics {
  modalities: ModalityStats;
  elements: ElementStats;
  polarities: PolarityStats;
  quadrants: QuadrantStats;
}
