import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import type { FC } from 'react';
import { useI18n } from '../i18n';
import { useSupabase } from '../context/SupabaseContext';
import { supabase } from '../services/supabaseService';
import { logger } from '../utils/logger';
import AuthModal from '../components/AuthModal';
import LoadingSpinner from '../components/LoadingSpinner';

// ⚡ FASE 3: Lazy load SavedChartModal (15.85 KB)
const SavedChartModal = lazy(() => import('../components/SavedChartModal'));
import {
  getLocalCharts,
  deleteChartLocal,
  exportChartsToJSON,
  importChartsFromJSON,
  type ChartWithStatus,
  type SyncStatus,
} from '../services/chartStorage';
import {
  Cloud,
  CloudOff,
  RefreshCw,
  Trash2,
  Upload,
  CheckCircle,
  AlertTriangle,
  Loader,
  FileDown,
  FileUp,
} from 'lucide-react';

const SavedChartsPage: FC = () => {
  const { t } = useI18n();
  const { user, isAuthenticated, isLoading: isConnecting, signOut, showAuthModal, setShowAuthModal } = useSupabase();
  const userEmail = user?.email || null;
  
  const [charts, setCharts] = useState<ChartWithStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [selectedCharts, setSelectedCharts] = useState<Set<string>>(new Set());
  const [viewingChart, setViewingChart] = useState<ChartWithStatus | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cargar cartas
  const loadCharts = async () => {
    setLoading(true);
    try {
      if (isAuthenticated) {
        // Cargar desde Supabase
        const { data: serverCharts, error } = await supabase.getCharts();
        if (error) {
          logger.error('Error loading from Supabase:', error);
          const localCharts = getLocalCharts();
          setCharts(localCharts.map(c => ({ ...c, syncStatus: 'local-only' as SyncStatus })));
        } else {
          setCharts((serverCharts || []).map(c => ({ ...c, syncStatus: 'synced' as SyncStatus })));
        }
      } else {
        const localCharts = getLocalCharts();
        setCharts(localCharts.map(c => ({ ...c, syncStatus: 'local-only' as SyncStatus })));
      }
    } catch (error) {
      logger.error('Error loading charts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCharts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Sincronizar todas
  const handleSyncAll = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    setSyncing(true);
    try {
      const localCharts = getLocalCharts();
      const { data: serverCharts, error } = await supabase.syncCharts(localCharts);
      
      if (error) {
        alert('Error al sincronizar: ' + error);
      } else {
        setCharts((serverCharts || []).map(c => ({ ...c, syncStatus: 'synced' as SyncStatus })));
        alert('✅ Sincronización completa');
      }
    } catch (error) {
      logger.error('Error syncing:', error);
      alert('Error al sincronizar cartas');
    } finally {
      setSyncing(false);
    }
  };

  // Sincronizar seleccionadas
  const handleSyncSelected = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    setSyncing(true);
    try {
      const toSync = charts.filter(c => selectedCharts.has(c.id));
      for (const chart of toSync) {
        await supabase.saveChart(chart);
      }
      setSelectedCharts(new Set());
      await loadCharts();
      alert('✅ Cartas sincronizadas');
    } catch (error) {
      logger.error('Error syncing selected:', error);
      alert('Error al sincronizar cartas seleccionadas');
    } finally {
      setSyncing(false);
    }
  };

  // Ver carta
  const handleViewChart = (chart: ChartWithStatus) => {
    setViewingChart(chart);
  };

  // Eliminar carta
  const handleDelete = async (chartId: string) => {
    if (!confirm('¿Eliminar esta carta? Esta acción no se puede deshacer.')) return;
    
    deleteChartLocal(chartId);
    await loadCharts();
  };

  // Toggle selección
  const toggleSelect = (chartId: string) => {
    const newSelected = new Set(selectedCharts);
    if (newSelected.has(chartId)) {
      newSelected.delete(chartId);
    } else {
      newSelected.add(chartId);
    }
    setSelectedCharts(newSelected);
  };

  // Seleccionar todas
  const toggleSelectAll = () => {
    if (selectedCharts.size === charts.length) {
      setSelectedCharts(new Set());
    } else {
      setSelectedCharts(new Set(charts.map(c => c.id)));
    }
  };

  // Exportar
  const handleExport = () => {
    exportChartsToJSON();
  };

  // Importar
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const count = await importChartsFromJSON(file);
      alert(`✅ ${count} cartas importadas exitosamente`);
      await loadCharts();
    } catch (error) {
      logger.error('Error importing:', error);
      alert('❌ Error al importar cartas');
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Icono de estado
  const getStatusIcon = (status: SyncStatus) => {
    switch (status) {
      case 'synced':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'local-only':
        return <CloudOff className="w-5 h-5 text-gray-500" />;
      case 'drive-only':
        return <Cloud className="w-5 h-5 text-blue-600" />;
      case 'conflict':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
    }
  };

  // Texto de estado
  const getStatusText = (status: SyncStatus) => {
    switch (status) {
      case 'synced':
        return 'Sincronizado';
      case 'local-only':
        return 'Solo local';
      case 'drive-only':
        return 'Solo en Drive';
      case 'conflict':
        return 'Conflicto';
    }
  };

  const stats = {
    total: charts.length,
    local: charts.filter(c => c.syncStatus === 'local-only').length,
    drive: charts.filter(c => c.syncStatus === 'drive-only').length,
    synced: charts.filter(c => c.syncStatus === 'synced').length,
    conflicts: charts.filter(c => c.syncStatus === 'conflict').length,
  };

  return (
    <>
      {/* Modal de visualización mejorado */}
      {viewingChart && (
        <Suspense fallback={<LoadingSpinner />}>
          <SavedChartModal
            chart={viewingChart}
            isOpen={true}
            onClose={() => setViewingChart(null)}
            onDelete={handleDelete}
          />
        </Suspense>
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="mb-4 sm:mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-900 dark:text-purple-100 mb-1 sm:mb-2 truncate">
              {t('dashboard.savedCharts.title')}
            </h1>
            <p className="text-sm sm:text-base text-purple-700 dark:text-purple-300">
              {charts.length} cartas guardadas
            </p>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
            {/* Botón Supabase Auth */}
            {isAuthenticated ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="text-right hidden sm:block">
                  <div className="text-xs sm:text-sm font-medium text-purple-900 dark:text-purple-100">{userEmail}</div>
                  <div className="text-[10px] sm:text-xs text-purple-600 dark:text-purple-400">Conectado</div>
                </div>
                <button
                  onClick={signOut}
                  className="p-1.5 sm:p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  aria-label="Cerrar Sesión"
                >
                  <Cloud className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                disabled={isConnecting}
                className="flex items-center gap-1.5 sm:gap-2 bg-blue-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-xs sm:text-sm"
              >
                {isConnecting ? (
                  <Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                ) : (
                  <Cloud className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
                <span className="hidden sm:inline">Iniciar</span> Sesión
              </button>
            )}

            {/* Botón Exportar */}
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 sm:gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors text-xs sm:text-sm"
            >
              <FileDown className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Exportar</span>
            </button>

            {/* Botón Importar */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 sm:gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors text-xs sm:text-sm"
            >
              <FileUp className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Importar</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </div>
        </div>

        {/* Stats */}
        {isAuthenticated && (
          <div className="mt-4 sm:mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
            <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg border border-purple-100 dark:border-purple-700">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-purple-900 dark:text-purple-100">{stats.total}</div>
              <div className="text-xs sm:text-sm text-purple-600 dark:text-purple-400">Total</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-600">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-700 dark:text-gray-300">{stats.local}</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Solo local</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg border border-blue-200 dark:border-blue-700">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-blue-700 dark:text-blue-400">{stats.drive}</div>
              <div className="text-xs sm:text-sm text-blue-600 dark:text-blue-400">Solo Drive</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg border border-green-200 dark:border-green-700">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-700 dark:text-green-400">{stats.synced}</div>
              <div className="text-xs sm:text-sm text-green-600 dark:text-green-400">Sincronizados</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg border border-orange-200 dark:border-orange-700 col-span-2 sm:col-span-1">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-orange-700 dark:text-orange-400">{stats.conflicts}</div>
              <div className="text-xs sm:text-sm text-orange-600 dark:text-orange-400">Conflictos</div>
            </div>
          </div>
        )}
      </div>

      {/* Sync Toolbar */}
      {isAuthenticated && charts.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg border border-purple-100 dark:border-purple-700 mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={toggleSelectAll}
              className="text-xs sm:text-sm text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-purple-100"
            >
              {selectedCharts.size === charts.length ? 'Deseleccionar' : 'Seleccionar'} todas
            </button>
            {selectedCharts.size > 0 && (
              <span className="text-xs sm:text-sm text-purple-600 dark:text-purple-400">
                {selectedCharts.size} seleccionadas
              </span>
            )}
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            {selectedCharts.size > 0 && (
              <button
                onClick={handleSyncSelected}
                disabled={syncing}
                className="flex items-center gap-1.5 sm:gap-2 bg-purple-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 text-xs sm:text-sm flex-1 sm:flex-initial"
              >
                {syncing ? (
                  <Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
                Sincronizar seleccionadas
              </button>
            )}

            <button
              onClick={handleSyncAll}
              disabled={syncing || loading}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {syncing ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <RefreshCw className="w-5 h-5" />
              )}
              Sincronizar todas
            </button>
          </div>
        </div>
      )}

      {/* Lista de cartas */}
      {loading ? (
        <div className="text-center py-16">
          <Loader className="w-12 h-12 mx-auto text-purple-600 animate-spin mb-4" />
          <p className="text-purple-600">Cargando cartas...</p>
        </div>
      ) : charts.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-lg border border-purple-100 text-center">
          <span className="text-6xl mb-4 block">📊</span>
          <h2 className="text-2xl font-semibold text-purple-900 mb-2">
            No hay cartas guardadas
          </h2>
          <p className="text-purple-700 mb-6">
            Crea tu primera carta natal y guárdala para verla aquí
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {charts.map((chart) => (
            <div
              key={chart.id}
              className={`bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow border-2 ${
                selectedCharts.has(chart.id) ? 'border-purple-500' : 'border-transparent'
              }`}
            >
              {/* Checkbox */}
              {isAuthenticated && (
                <div className="flex items-start justify-between mb-3">
                  <input
                    type="checkbox"
                    checked={selectedCharts.has(chart.id)}
                    onChange={() => toggleSelect(chart.id)}
                    className="w-5 h-5 text-purple-600 rounded"
                  />
                  <div className="flex items-center gap-2">
                    {getStatusIcon(chart.syncStatus)}
                    <span className="text-xs text-gray-600">{getStatusText(chart.syncStatus)}</span>
                  </div>
                </div>
              )}

              {/* Info */}
              <h3 className="font-semibold text-purple-900 mb-1 text-lg">
                {chart.data.personName || 'Sin nombre'}
              </h3>
              <p className="text-sm text-purple-600 mb-2">
                {(() => {
                  const [year, month, day] = chart.data.birthData.date.split('-').map(Number);
                  const localDate = new Date(year, month - 1, day);
                  return localDate.toLocaleDateString('es-ES');
                })()} · {chart.data.birthData.time}
              </p>
              <p className="text-xs text-gray-500 mb-4">
                {chart.data.birthData.location || `${chart.data.birthData.latitude.toFixed(2)}°, ${chart.data.birthData.longitude.toFixed(2)}°`}
              </p>

              {/* Timestamps */}
              <div className="text-xs text-gray-500 mb-4 space-y-1">
                <div>Creado: {new Date(chart.metadata.createdAt).toLocaleDateString('es-ES')}</div>
                {chart.metadata.syncedAt && (
                  <div>Sync: {new Date(chart.metadata.syncedAt).toLocaleDateString('es-ES')}</div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button 
                  onClick={() => handleViewChart(chart)}
                  className="flex-1 bg-purple-100 text-purple-700 px-3 py-2 rounded hover:bg-purple-200 transition-colors text-sm font-medium"
                >
                  Ver
                </button>
                <button
                  onClick={() => handleDelete(chart.id)}
                  className="bg-red-100 text-red-700 px-3 py-2 rounded hover:bg-red-200 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de autenticación */}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
    </>
  );
};

export default SavedChartsPage;