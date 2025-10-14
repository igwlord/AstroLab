import { Fragment, useState, useMemo } from 'react';
import type { FC } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Trash2, Edit3 } from '../utils/icons';
import type { ChartWithStatus } from '../services/chartStorage';
import { adaptChartData } from '../utils/chartAdapter';
import ChartViewTabs from './ChartViewTabs';
import NatalChartWheelPro from './NatalChartWheelPro';
import ChartShapeWheel from './ChartShapeWheel';
import ChartShapeStats from './ChartShapeStats';
import DominancesTable from './DominancesTable';
import AspectsTableGrid from './AspectsTableGrid';
import PositionsTable from './PositionsTable';
import PolarizationsChartView from './PolarizationsChartView';
import { detectChartShape } from '../utils/chartShapeAnalyzer';
import type { PlanetPosition } from '../types/chartShape';
import type { NatalChart } from '../services/realAstroCalculator';

// Helper: Obtener offset del signo (0° Aries = 0°, 0° Tauro = 30°, etc.)
const getSignOffset = (sign: string): number => {
  const signs = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'];
  const index = signs.indexOf(sign);
  return index >= 0 ? index * 30 : 0;
};

interface SavedChartModalProps {
  chart: ChartWithStatus;
  isOpen: boolean;
  onClose: () => void;
  onDelete?: (chartId: string) => void;
  onEdit?: (chart: ChartWithStatus) => void;
}

const SavedChartModal: FC<SavedChartModalProps> = ({
  chart,
  isOpen,
  onClose,
  onDelete,
  onEdit,
}) => {
  const [activeTab, setActiveTab] = useState<
    'chart' | 'aspects' | 'shape' | 'positions' | 'dominances' | 'polarizations'
  >('chart');

  // Adaptar datos para componentes
  const adaptedChart = useMemo(() => adaptChartData(chart), [chart]);

  // Detectar forma de carta para tab "shape"
  const shapePattern = useMemo(() => {
    if (activeTab !== 'shape') return null;
    
    // Convertir planets array al formato PlanetPosition
    const planetPositions: PlanetPosition[] = chart.data.planets.map((p) => ({
      name: p.name || (p as {planet?: string}).planet || 'Unknown',
      longitude: p.longitude || 0,
    }));
    
    return detectChartShape(planetPositions);
  }, [chart.data.planets, activeTab]);

  // Handlers
  const handleDelete = () => {
    const chartName = chart.data.personName || 'esta carta';
    if (onDelete && confirm(`¿Eliminar ${chartName}? Esta acción no se puede deshacer.`)) {
      onDelete(chart.id);
      onClose();
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(chart);
      onClose();
    }
  };

  // Formatear fecha - Evitar conversión UTC que causa cambio de día
  const formattedDate = useMemo(() => {
    const dateStr = chart.data.birthData.date;
    // Si viene en formato YYYY-MM-DD, parsearlo localmente
    const [year, month, day] = dateStr.split('-').map(Number);
    const localDate = new Date(year, month - 1, day);
    
    return localDate.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, [chart.data.birthData.date]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        {/* Full-screen container */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-6xl transform overflow-hidden rounded-xl bg-white dark:bg-gray-900 shadow-2xl transition-all">
                {/* Header - Más compacto */}
                <div className="relative border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-yellow-50 dark:from-purple-900/20 dark:to-yellow-900/20 px-3 sm:px-4 py-2 sm:py-3">
                  <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                      <Dialog.Title className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-0.5 truncate">
                        {chart.data.personName}
                      </Dialog.Title>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2 text-xs text-gray-600 dark:text-gray-300">
                        <span className="flex items-center gap-1">
                          📅 {formattedDate}
                        </span>
                        <span className="hidden sm:inline">•</span>
                        <span className="flex items-center gap-1">
                          🕐 {chart.data.birthData.time}
                        </span>
                        <span className="hidden sm:inline">•</span>
                        <span className="flex items-center gap-1 truncate">
                          📍 {chart.data.birthData.location || 'Sin ubicación'}
                        </span>
                      </div>
                  </div>
                    {/* Close button - Más pequeño */}
                    <button
                      onClick={onClose}
                      className="ml-2 rounded-lg p-1.5 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
                      aria-label="Cerrar"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Tabs - Más compactos */}
                <div className="px-3 sm:px-4 pt-2">
                  <ChartViewTabs activeTab={activeTab} onTabChange={setActiveTab} />
                </div>

                {/* Content - Más altura disponible */}
                <div className="px-3 sm:px-4 py-2 max-h-[65vh] sm:max-h-[72vh] overflow-y-auto">
                  {/* Tab: Carta - Solo rueda, sin tabla */}
                  {activeTab === 'chart' && (
                    <div className="flex justify-center py-2">
                      <div className="w-full max-w-4xl">
                        <NatalChartWheelPro 
                          data={adaptedChart} 
                          showDataTable={false}
                          showPlanetDegrees={true}
                        />
                      </div>
                    </div>
                  )}

                  {/* Tab: Aspectos - Mismo componente que en crear carta */}
                  {activeTab === 'aspects' && (
                    <div className="py-2">
                      <AspectsTableGrid aspects={chart.data.aspects || []} />
                    </div>
                  )}

                  {/* Tab: Forma - Mismo estilo que crear carta */}
                  {activeTab === 'shape' && shapePattern && (
                    <div className="flex flex-col xl:flex-row gap-3 sm:gap-4 lg:gap-5 xl:gap-6 py-2">
                      {/* Rueda de forma - Agrandada */}
                      <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-900 rounded-xl p-2 sm:p-3 lg:p-4 shadow-lg border border-purple-100 dark:border-purple-700">
                        <ChartShapeWheel data={adaptedChart} size={600} />
                      </div>
                      {/* Panel de estadísticas - Layout mejorado */}
                      <div className="w-full xl:w-96 2xl:w-[420px] bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-purple-100 dark:border-purple-700 overflow-y-auto max-h-[500px] sm:max-h-[650px] xl:max-h-[800px]">
                        <ChartShapeStats pattern={shapePattern} />
                      </div>
                    </div>
                  )}

                  {/* Tab: Posiciones - Mismo componente que en crear carta */}
                  {activeTab === 'positions' && (() => {
                    // Obtener ASC y MC desde houses (casa 1 y casa 10)
                    // Las houses pueden tener diferentes estructuras dependiendo de cómo se guardaron
                    type HouseData = {number?: number; cusp?: number; longitude?: number; degree?: number; sign?: string};
                    const house1 = chart.data.houses?.[0] ?? chart.data.houses?.find((h: HouseData) => h.number === 1);
                    const house10 = chart.data.houses?.[9] ?? chart.data.houses?.find((h: HouseData) => h.number === 10);
                    
                    // Calcular ascendant: puede estar en cusp, longitude, o calculado desde degree + signOffset
                    const ascendant = house1?.cusp ?? 
                                     house1?.longitude ?? 
                                     (house1?.degree !== undefined && house1?.sign ? 
                                       house1.degree + getSignOffset(house1.sign) : 0);
                    
                    // Calcular midheaven: puede estar en cusp, longitude, o calculado desde degree + signOffset  
                    const midheaven = house10?.cusp ?? 
                                     house10?.longitude ?? 
                                     (house10?.degree !== undefined && house10?.sign ? 
                                       house10.degree + getSignOffset(house10.sign) : 0);
                    
                    return (
                      <div className="py-2">
                        <PositionsTable 
                          planets={chart.data.planets.map(p => {
                            const hasLongitude = 'longitude' in p && typeof p.longitude === 'number';
                            const hasSignDegree = 'sign' in p && 'degree' in p;
                            
                            return {
                              ...p,
                              ecliptic: hasLongitude 
                                ? p.longitude as number
                                : (hasSignDegree ? (p as {degree: number, sign: string}).degree + getSignOffset((p as {sign: string}).sign) : 0),
                              latitude: 0,
                              speed: 0
                            };
                          })}
                          ascendant={ascendant}
                          midheaven={midheaven}
                        />
                      </div>
                    );
                  })()}

                  {/* Tab: Dominancias - Más compacto */}
                  {activeTab === 'dominances' && (
                    <div className="py-2">
                      <DominancesTable 
                        planets={chart.data.planets}
                      />
                    </div>
                  )}

                  {/* Tab: Polarizaciones - Mismo sistema gráfico que crear carta */}
                  {activeTab === 'polarizations' && (() => {
                    // Adaptar datos de carta guardada al formato NatalChart
                    const natalChart: NatalChart = {
                      date: new Date(chart.data.birthData.date),
                      location: chart.data.birthData.location || 'Ubicación desconocida',
                      latitude: chart.data.birthData.latitude,
                      longitude: chart.data.birthData.longitude,
                      timezone: chart.data.birthData.timezone,
                      planets: chart.data.planets,
                      houses: chart.data.houses,
                      ascendant: chart.data.houses?.[0] 
                        ? { 
                            sign: chart.data.houses[0].sign || 'Aries', 
                            degree: chart.data.houses[0].degree || 0 
                          }
                        : { sign: 'Aries', degree: 0 },
                      midheaven: chart.data.houses?.[9]
                        ? { 
                            sign: chart.data.houses[9].sign || 'Capricornio', 
                            degree: chart.data.houses[9].degree || 0 
                          }
                        : { sign: 'Capricornio', degree: 0 },
                      aspects: chart.data.aspects || []
                    };

                    return (
                      <div className="py-2">
                        <PolarizationsChartView chart={natalChart} />
                      </div>
                    );
                  })()}
                </div>

                {/* Footer con acciones - Solo iconos en móvil */}
                <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-3 sm:px-4 py-2 sm:py-3">
                  <div className="flex items-center justify-between gap-2">
                    {/* Acciones principales - lado izquierdo */}
                    <div className="flex items-center gap-2">
                      {onEdit && (
                        <button
                          onClick={handleEdit}
                          className="inline-flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
                          title="Editar carta"
                        >
                          <Edit3 className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                          <span className="hidden sm:inline">Editar</span>
                        </button>
                      )}
                    </div>

                    {/* Acción destructiva - lado derecho */}
                    {onDelete && (
                      <button
                        onClick={handleDelete}
                        className="inline-flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
                        title="Eliminar carta"
                      >
                        <Trash2 className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                        <span className="hidden sm:inline">Eliminar</span>
                      </button>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SavedChartModal;
