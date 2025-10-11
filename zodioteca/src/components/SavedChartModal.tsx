import { Fragment, useState, useMemo } from 'react';
import type { FC } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Trash2, FileDown, Edit3 } from 'lucide-react';
import type { ChartWithStatus } from '../services/chartStorage';
import { adaptChartData } from '../utils/chartAdapter';
import ChartViewTabs from './ChartViewTabs';
import NatalChartWheelPro from './NatalChartWheelPro';
import ChartShapeWheel from './ChartShapeWheel';
import ChartShapeStats from './ChartShapeStats';
import DominancesTable from './DominancesTable';
import { detectChartShape } from '../utils/chartShapeAnalyzer';
import type { PlanetPosition } from '../types/chartShape';

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

  const handleExportPDF = () => {
    // TODO: Implementar exportación a PDF
    alert('📄 Exportación a PDF próximamente...');
  };

  // Formatear fecha
  const formattedDate = new Date(chart.data.birthData.date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

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
              <Dialog.Panel className="w-full max-w-7xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-2xl transition-all">
                {/* Header */}
                <div className="relative border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-yellow-50 dark:from-purple-900/20 dark:to-yellow-900/20 px-4 sm:px-6 py-4">
                  <div className="flex items-start justify-between">
                  <div className="flex-1">
                      <Dialog.Title className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {chart.data.personName}
                      </Dialog.Title>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-gray-600 dark:text-gray-300">
                        <span className="flex items-center gap-1">
                          📅 {formattedDate}
                        </span>
                        <span className="hidden sm:inline">•</span>
                        <span className="flex items-center gap-1">
                          🕐 {chart.data.birthData.time}
                        </span>
                        <span className="hidden sm:inline">•</span>
                        <span className="flex items-center gap-1">
                          📍 {chart.data.birthData.location || 'Sin ubicación'}
                        </span>
                      </div>
                  </div>                    {/* Close button */}
                    <button
                      onClick={onClose}
                      className="ml-4 rounded-lg p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      aria-label="Cerrar"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Tabs */}
                <div className="px-4 sm:px-6 pt-4">
                  <ChartViewTabs activeTab={activeTab} onTabChange={setActiveTab} />
                </div>

                {/* Content */}
                <div className="px-4 sm:px-6 py-4 max-h-[60vh] sm:max-h-[70vh] overflow-y-auto">
                  {/* Tab: Carta */}
                  {activeTab === 'chart' && (
                    <div className="flex justify-center py-4">
                      <NatalChartWheelPro data={adaptedChart} />
                    </div>
                  )}

                  {/* Tab: Aspectos */}
                  {activeTab === 'aspects' && adaptedChart.aspects && (
                    <div className="py-4">
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                          Aspectos ({adaptedChart.aspects.length})
                        </h3>
                        {adaptedChart.aspects.length === 0 ? (
                          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                            No se encontraron aspectos en esta carta
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {adaptedChart.aspects.map((aspect, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between bg-white dark:bg-gray-700 rounded-lg p-3 text-sm"
                              >
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {aspect.planet1} - {aspect.planet2}
                                </span>
                                <span className="text-purple-600 dark:text-purple-400">
                                  {aspect.type}
                                </span>
                                <span className="text-gray-600 dark:text-gray-300">
                                  Orbe: {aspect.orb.toFixed(2)}°
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tab: Forma */}
                  {activeTab === 'shape' && shapePattern && (
                    <div className="flex flex-col xl:flex-row gap-3 sm:gap-4 lg:gap-5 xl:gap-6 py-4">
                      <div className="flex-1 flex justify-center p-2 sm:p-3 lg:p-4">
                        <ChartShapeWheel data={adaptedChart} />
                      </div>
                      <div className="w-full xl:w-96 2xl:w-[420px] max-h-[500px] sm:max-h-[650px] xl:max-h-[800px] overflow-y-auto">
                        <ChartShapeStats pattern={shapePattern} />
                      </div>
                    </div>
                  )}

                  {/* Tab: Posiciones */}
                  {activeTab === 'positions' && (
                    <div className="py-4">
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                          Posiciones Planetarias
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {adaptedChart.planets.map((planet, idx) => (
                            <div
                              key={idx}
                              className="bg-white dark:bg-gray-700 rounded-lg p-3"
                            >
                              <div className="font-semibold text-gray-900 dark:text-white mb-1">
                                {planet.name}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-300">
                                {planet.longitude.toFixed(2)}°
                                {planet.retrograde && <span className="ml-1 text-red-500">℞</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab: Dominancias */}
                  {activeTab === 'dominances' && (
                    <div className="py-4">
                      <DominancesTable 
                        planets={chart.data.planets}
                      />
                    </div>
                  )}

                  {/* Tab: Polarizaciones */}
                  {activeTab === 'polarizations' && (
                    <div className="py-4 text-center text-gray-500 dark:text-gray-400">
                      <p className="text-lg">🚧 Polarizaciones próximamente...</p>
                      <p className="text-sm mt-2">Este análisis estará disponible en una futura actualización</p>
                    </div>
                  )}
                </div>

                {/* Footer con acciones */}
                <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-4 sm:px-6 py-4">
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    {/* Acciones principales */}
                    <div className="flex-1 flex flex-wrap gap-2">
                      {onEdit && (
                        <button
                          onClick={handleEdit}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                          <span>Editar</span>
                        </button>
                      )}
                      
                      <button
                        onClick={handleExportPDF}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors"
                      >
                        <FileDown className="w-4 h-4" />
                        <span>Exportar PDF</span>
                      </button>
                    </div>

                    {/* Acción destructiva */}
                    {onDelete && (
                      <button
                        onClick={handleDelete}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Eliminar</span>
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
