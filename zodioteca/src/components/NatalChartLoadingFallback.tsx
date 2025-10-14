/**
 * Fallback específico para NatalChartPage con animación suave
 * Muestra skeleton mientras carga el componente lazy
 */
import NatalChartSkeleton from './skeletons/NatalChartSkeleton';

const NatalChartLoadingFallback = () => {
  return (
    <div className="animate-fadeIn">
      <NatalChartSkeleton />
    </div>
  );
};

export default NatalChartLoadingFallback;
