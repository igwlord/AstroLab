/**
 * Fallback específico para Dashboard con animación suave
 * Muestra skeleton mientras carga el componente lazy
 */
import DashboardSkeleton from './skeletons/DashboardSkeleton';

const DashboardLoadingFallback = () => {
  return (
    <div className="animate-fadeIn">
      <DashboardSkeleton />
    </div>
  );
};

export default DashboardLoadingFallback;
