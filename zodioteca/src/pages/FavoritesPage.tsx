/**
 * FavoritesPage - Página principal de Favoritos
 * 
 * Versión 2.0 - Sistema de navegación directa
 * 
 * Características:
 * - 📊 Grid responsive (1-2-3-4 columnas)
 * - 🔍 Filtros por chips (tipo)
 * - � Navegación directa a contenido original
 * - 📱 Optimizado mobile
 * - 📈 Estadísticas de uso (calculadas localmente)
 * - 💾 Export/Import JSON
 * - 🎭 Estado vacío elegante
 * - ♿ Accesibilidad completa
 * - 🚫 Sin modales pesados, sin drag & drop
 */

import { useState, useCallback, useMemo } from 'react';
import type { FC } from 'react';
// import { useNavigate } from 'react-router-dom'; // Reservado para navegación con hash
import { useFavorites } from '../store/useFavorites';
import FavoriteCard from '../components/FavoriteCard';
import type { FavoriteType } from '../types/favorites';

// ============================================
// TIPOS LOCALES
// ============================================

type FilterType = 'all' | FavoriteType;

interface FilterChip {
  id: FilterType;
  label: string;
  icon: string;
}

// ============================================
// CONSTANTES
// ============================================

const FILTER_CHIPS: FilterChip[] = [
  { id: 'all', label: 'Todos', icon: '⭐' },
  { id: 'glossary-sign', label: 'Signos', icon: '♈' },
  { id: 'glossary-house', label: 'Casas', icon: '🏠' },
  { id: 'glossary-planet', label: 'Planetas', icon: '🪐' },
  { id: 'chart-aspect', label: 'Aspectos', icon: '📐' },
  { id: 'chart-shape', label: 'Formas', icon: '🔴' },
  { id: 'frequency-exercise', label: 'Ejercicios', icon: '🧘' },
];

// ============================================
// COMPONENTE
// ============================================

const FavoritesPage: FC = () => {
  // Hook para navegación (reservado para futuras mejoras: scroll con hash)
  // const navigate = useNavigate();
  const { list, remove, togglePin, exportToJSON, importFromJSON } = useFavorites();
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [showStats, setShowStats] = useState(false);
  
  // =========== FILTRADO ===========
  
  const filteredItems = useMemo(() => {
    if (selectedFilter === 'all') {
      return list();
    }
    return list({ type: selectedFilter as FavoriteType });
  }, [selectedFilter, list]);
  
  // =========== ESTADÍSTICAS CALCULADAS ===========
  
  // Calcular stats localmente (sin decay scoring complejo)
  const stats = useMemo(() => {
    const allItems = list();
    return {
      total: allItems.length,
      pinned: allItems.filter(item => item.pinned).length,
      byScope: {
        global: allItems.filter(item => item.scope === 'global').length,
        chart: allItems.filter(item => item.scope === 'chart').length,
      },
      byType: allItems.reduce((acc, item) => {
        acc[item.type] = (acc[item.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
  }, [list]);
  
  // =========== ACCIONES ===========
  
  const handleExport = useCallback(() => {
    const json = exportToJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `favoritos-astrolab-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [exportToJSON]);
  
  const handleImport = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const result = importFromJSON(content);
        
        if (result.success) {
          alert(`✅ Importados ${result.imported} favoritos`);
        } else {
          alert(`❌ Error: ${result.errors.join(', ')}`);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, [importFromJSON]);
  
  // =========== ESTADO VACÍO ===========
  
  if (filteredItems.length === 0 && selectedFilter === 'all') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
            <span className="text-6xl sm:text-7xl mb-6 animate-bounce">⭐</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-purple-900 dark:text-white mb-4">
              Aún no tenés favoritos
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8 leading-relaxed">
              Guardá tus contenidos favoritos desde el glosario, tu carta natal, frecuencias y más. 
              Aparecerán aquí para acceso rápido.
            </p>
            
            {/* Plantillas sugeridas */}
            <div className="w-full max-w-2xl">
              <h3 className="text-lg font-semibold text-purple-900 dark:text-white mb-4">
                💡 Sugerencias para empezar
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/50 dark:bg-purple-900/20 backdrop-blur-sm p-4 rounded-xl border border-purple-200 dark:border-purple-700">
                  <span className="text-3xl mb-2 block">🔴</span>
                  <h4 className="font-bold text-purple-900 dark:text-white mb-1">Forma Racimo</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Energía focalizada, especialización profunda
                  </p>
                </div>
                
                <div className="bg-white/50 dark:bg-purple-900/20 backdrop-blur-sm p-4 rounded-xl border border-purple-200 dark:border-purple-700">
                  <span className="text-3xl mb-2 block">📐</span>
                  <h4 className="font-bold text-purple-900 dark:text-white mb-1">Oposición Sol-Luna</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Tensión creativa entre consciente e inconsciente
                  </p>
                </div>
                
                <div className="bg-white/50 dark:bg-purple-900/20 backdrop-blur-sm p-4 rounded-xl border border-purple-200 dark:border-purple-700">
                  <span className="text-3xl mb-2 block">🧘</span>
                  <h4 className="font-bold text-purple-900 dark:text-white mb-1">Respiración 4-7-8</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Técnica de relajación y equilibrio energético
                  </p>
                </div>
                
                <div className="bg-white/50 dark:bg-purple-900/20 backdrop-blur-sm p-4 rounded-xl border border-purple-200 dark:border-purple-700">
                  <span className="text-3xl mb-2 block">♈</span>
                  <h4 className="font-bold text-purple-900 dark:text-white mb-1">Tu Signo Solar</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Identidad esencial y propósito de vida
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // =========== RENDER PRINCIPAL ===========
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-purple-900 dark:text-white mb-2 flex items-center gap-3">
                <span>⭐</span>
                Mis Favoritos
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {stats.total} {stats.total === 1 ? 'elemento guardado' : 'elementos guardados'}
                {stats.pinned > 0 && ` • ${stats.pinned} anclado${stats.pinned > 1 ? 's' : ''}`}
              </p>
            </div>
            
            {/* Acciones */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowStats(!showStats)}
                className="px-4 py-2 bg-white/50 dark:bg-purple-800/30 text-purple-700 dark:text-purple-200 rounded-lg hover:bg-white/70 dark:hover:bg-purple-700/40 transition-colors text-sm font-medium"
              >
                📊 Stats
              </button>
              
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-white/50 dark:bg-purple-800/30 text-purple-700 dark:text-purple-200 rounded-lg hover:bg-white/70 dark:hover:bg-purple-700/40 transition-colors text-sm font-medium"
                title="Exportar favoritos"
              >
                💾
              </button>
              
              <button
                onClick={handleImport}
                className="px-4 py-2 bg-white/50 dark:bg-purple-800/30 text-purple-700 dark:text-purple-200 rounded-lg hover:bg-white/70 dark:hover:bg-purple-700/40 transition-colors text-sm font-medium"
                title="Importar favoritos"
              >
                📥
              </button>
            </div>
          </div>
          
          {/* Estadísticas expandibles */}
          {showStats && (
            <div className="bg-white/50 dark:bg-purple-900/20 backdrop-blur-sm p-6 rounded-xl border border-purple-200 dark:border-purple-700 mb-6 animate-fadeIn">
              <h3 className="text-lg font-bold text-purple-900 dark:text-white mb-4">📊 Estadísticas de Uso</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.total}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.pinned}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Anclados</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {stats.byScope.global || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Globales</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {stats.byScope.chart || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Por Carta</div>
                </div>
              </div>
              
              {/* Tipos por categoría */}
              {Object.keys(stats.byType).length > 0 && (
                <div className="mt-4 pt-4 border-t border-purple-200 dark:border-purple-700">
                  <h4 className="text-sm font-semibold text-purple-900 dark:text-white mb-2">� Por Tipo</h4>
                  <div className="space-y-1">
                    {Object.entries(stats.byType).slice(0, 5).map(([type, count]) => (
                      <div key={type} className="text-sm text-gray-600 dark:text-gray-400 flex justify-between">
                        <span>{type}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Filtros - Dropdown en móvil, chips en desktop */}
          
          {/* Versión móvil (< 640px): Dropdown selector */}
          <div className="sm:hidden">
            <label htmlFor="filter-select" className="sr-only">
              Filtrar favoritos
            </label>
            <select
              id="filter-select"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value as FilterType)}
              className="w-full px-4 py-3 rounded-xl text-base font-medium 
                bg-white/80 dark:bg-gray-800/80 
                text-gray-900 dark:text-white
                border-2 border-purple-200 dark:border-purple-700
                focus:border-purple-500 dark:focus:border-purple-400
                focus:ring-2 focus:ring-purple-500/20
                shadow-sm
                transition-all
                cursor-pointer
                appearance-none
                bg-no-repeat
                bg-[length:1.5em]
                bg-[right_0.75rem_center]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`
              }}
            >
              {FILTER_CHIPS.map((chip) => (
                <option key={chip.id} value={chip.id}>
                  {chip.icon} {chip.label}
                </option>
              ))}
            </select>
          </div>

          {/* Versión desktop (≥ 640px): Chips horizontales */}
          <div className="hidden sm:flex flex-wrap gap-2">
            {FILTER_CHIPS.map((chip) => (
              <button
                key={chip.id}
                onClick={() => setSelectedFilter(chip.id)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-all
                  ${selectedFilter === chip.id
                    ? 'bg-purple-600 text-white shadow-lg scale-105'
                    : 'bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                <span className="mr-2">{chip.icon}</span>
                {chip.label}
              </button>
            ))}
          </div>
        </header>
        
        {/* Grid de Favoritos - Las cards navegan directamente al hacer click */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredItems.map((item) => (
              <FavoriteCard
                key={item.id}
                item={item}
                onRemove={() => remove(item.id)}
                onTogglePin={() => togglePin(item.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <span className="text-5xl mb-4 block">🔍</span>
            <p className="text-gray-600 dark:text-gray-400">
              No hay favoritos con el filtro "{FILTER_CHIPS.find(c => c.id === selectedFilter)?.label}"
            </p>
            <button
              onClick={() => setSelectedFilter('all')}
              className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Ver todos
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
