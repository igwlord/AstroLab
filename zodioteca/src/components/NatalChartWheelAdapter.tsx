/**
 * Componente wrapper que mantiene compatibilidad con la API anterior
 * Convierte ChartWithStatus (formato legacy) a ChartData (nuevo formato)
 */

import React from 'react';
import type { ChartWithStatus } from '../services/chartStorage';
import NatalChartWheelV2 from './NatalChartWheelV2';
import type { NatalChartWheelProps as V2Props } from '../types/chartWheel';
import { adaptChartData } from '../utils/chartAdapter';

interface LegacyNatalChartWheelProps {
  chart: ChartWithStatus;
  size?: number;
  className?: string;
  // Nuevas props opcionales
  theme?: V2Props['theme'];
  mode?: V2Props['mode'];
  planetLabels?: V2Props['planetLabels'];
  debug?: V2Props['debug'];
}

const NatalChartWheelAdapter: React.FC<LegacyNatalChartWheelProps> = ({
  chart,
  size,
  className,
  theme = 'violet',
  mode = 'zodiacFixed',
  planetLabels = 'none',
  debug = false,
}) => {
  const adaptedData = React.useMemo(() => adaptChartData(chart), [chart]);

  return (
    <div className={className}>
      <NatalChartWheelV2
        data={adaptedData}
        size={size}
        theme={theme}
        mode={mode}
        planetLabels={planetLabels}
        debug={debug}
      />
    </div>
  );
};

export default NatalChartWheelAdapter;
