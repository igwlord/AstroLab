import { useState, useEffect, useMemo, useCallback } from 'react';

/**
 * Interfaz para definir un filtro de sección
 */
interface SectionFilter {
  id: string;
  label: string;
  icon: string;
  keywords: string[];
  ariaLabel?: string;
}

/**
 * Constantes del componente
 */
const STORAGE_KEY = 'lastActiveChartFilter';
const DEFAULT_FILTER = 'all';

/**
 * Componente de filtro de secciones para la carta natal
 * Permite filtrar visualmente las secciones sin modificar el DOM
 * 
 * @component
 */
export default function ChartSectionFilter() {
  // Estado del filtro activo con inicialización desde localStorage
  const [activeFilter, setActiveFilter] = useState<string>(() => {
    if (typeof window === 'undefined') return DEFAULT_FILTER;
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_FILTER;
  });
  
  // Definición memoizada de filtros para evitar recreaciones
  const filters: SectionFilter[] = useMemo(() => [
    { 
      id: 'all', 
      label: 'Todo', 
      icon: '📊', 
      keywords: [],
      ariaLabel: 'Mostrar todas las secciones'
    },
    { 
      id: 'basic', 
      label: 'Básico', 
      icon: '⭐', 
      keywords: ['Planetas', 'Casas', 'Ascendente'],
      ariaLabel: 'Filtrar información básica: Planetas, Casas y Ascendente'
    },
    { 
      id: 'aspects', 
      label: 'Aspectos', 
      icon: '⚡', 
      keywords: ['Aspectos'],
      ariaLabel: 'Filtrar aspectos planetarios'
    },
    { 
      id: 'nodes', 
      label: 'Nodos', 
      icon: '☯️', 
      keywords: ['Nodos Lunares'],
      ariaLabel: 'Filtrar nodos lunares'
    },
    { 
      id: 'deep', 
      label: 'Profundo', 
      icon: '🔮', 
      keywords: ['Puntos Sensibles', 'Asteroides', 'Partes Árabes'],
      ariaLabel: 'Filtrar información profunda: Puntos sensibles, Asteroides y Partes Árabes'
    },
    { 
      id: 'synthesis', 
      label: 'Síntesis', 
      icon: '📈', 
      keywords: ['Elementos', 'Modalidades', 'Polaridades', 'Cuadrantes', 'Hemisferios'],
      ariaLabel: 'Filtrar síntesis: Elementos, Modalidades y análisis globales'
    },
  ], []);

  /**
   * Función para aplicar el filtro visual a las secciones
   */
  const applyFilter = useCallback((filterId: string) => {
    const sections = document.querySelectorAll<HTMLElement>('[data-chart-section]');
    
    sections.forEach((section) => {
      const sectionName = section.getAttribute('data-chart-section') || '';
      
      // Mostrar todas las secciones si el filtro es 'all'
      if (filterId === 'all') {
        section.style.display = '';
        section.setAttribute('aria-hidden', 'false');
        return;
      }

      // Buscar el filtro actual
      const currentFilter = filters.find(f => f.id === filterId);
      
      // Determinar si la sección debe mostrarse
      const shouldShow = currentFilter?.keywords.some(keyword => 
        sectionName.toLowerCase().includes(keyword.toLowerCase())
      ) ?? false;

      // Aplicar display y aria-hidden para accesibilidad
      section.style.display = shouldShow ? '' : 'none';
      section.setAttribute('aria-hidden', shouldShow ? 'false' : 'true');
    });
  }, [filters]);

  // Persistir el filtro activo en localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, activeFilter);
  }, [activeFilter]);

  // Aplicar el filtro cuando cambie
  useEffect(() => {
    applyFilter(activeFilter);
  }, [activeFilter, applyFilter]);

  return (
    <nav 
      className="print:hidden sticky top-0 z-50 bg-gradient-to-r from-purple-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-b-2 border-purple-300 dark:border-purple-700 shadow-lg backdrop-blur-sm"
      role="navigation"
      aria-label="Filtro de secciones de carta natal"
    >
      <div className="container mx-auto px-2 sm:px-4 py-3">
        {/* Título con semántica correcta */}
        <header className="text-center mb-3">
          <h2 className="text-sm sm:text-base font-bold text-purple-900 dark:text-purple-100">
            🎯 Filtrar Secciones
          </h2>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Toca una categoría para enfocar tu lectura
          </p>
        </header>

        {/* Grupo de filtros con roles ARIA */}
        <div 
          className="overflow-x-auto overflow-y-hidden pb-2 scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-transparent"
          role="group"
          aria-label="Opciones de filtro"
        >
          <div className="flex gap-2 justify-start sm:justify-center min-w-max sm:min-w-0">
            {filters.map((filter) => {
              const isActive = activeFilter === filter.id;
              
              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setActiveFilter(filter.id)}
                  aria-label={filter.ariaLabel}
                  aria-pressed={isActive}
                  className={`
                    flex flex-col items-center justify-center
                    px-4 py-3 sm:px-6 sm:py-4
                    rounded-xl sm:rounded-2xl
                    font-semibold text-xs sm:text-sm
                    transition-all duration-300 ease-out
                    whitespace-nowrap
                    min-w-[80px] sm:min-w-[100px]
                    focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                    ${isActive 
                      ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-xl scale-110 sm:scale-125 -translate-y-1' 
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-gray-700 hover:scale-105 shadow-md'
                    }
                  `}
                >
                  {/* Icono decorativo */}
                  <span className="text-2xl sm:text-3xl mb-1" aria-hidden="true">
                    {filter.icon}
                  </span>
                  
                  {/* Label visible */}
                  <span className="text-[10px] sm:text-xs font-bold">
                    {filter.label}
                  </span>
                  
                  {/* Indicador visual de estado activo */}
                  {isActive && (
                    <span 
                      className="mt-1 w-8 h-1 bg-white rounded-full" 
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Indicador de scroll horizontal para móviles */}
        <div 
          className="sm:hidden flex justify-center mt-2"
          role="status"
          aria-live="polite"
          aria-label="Indicador de scroll horizontal"
        >
          <div className="flex gap-1.5 items-center">
            <span className="w-1 h-1 rounded-full bg-purple-400 animate-pulse" aria-hidden="true" />
            <span className="text-[10px] text-purple-600 dark:text-purple-400">
              ← Desliza →
            </span>
            <span className="w-1 h-1 rounded-full bg-purple-400 animate-pulse" aria-hidden="true" />
          </div>
        </div>
      </div>
    </nav>
  );
}
