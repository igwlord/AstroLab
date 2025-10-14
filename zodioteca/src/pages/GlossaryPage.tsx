import { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n';
import { createGlossaryParser, GlossaryParser } from '../utils/parseGlossary';
import { logger } from '../utils/logger';
import type { GlossaryEntry } from '../types/glossary';
import { GLOSSARY_CATEGORIES } from '../types/glossary';
import GlossaryEntryComponent from '../components/GlossaryEntry';
import GlossarySearch, { type SearchResult } from '../components/GlossarySearch';
import GlossaryCategories from '../components/GlossaryCategories';
import { useGlossarySearch } from '../hooks/useGlossarySearch';
import LoadingSpinner from '../components/LoadingSpinner';

// Dynamic grid component map - loads only the selected category's grid
const GRID_COMPONENTS: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  'signs': lazy(() => import('../components/ZodiacSignsGrid')),
  'planets': lazy(() => import('../components/PlanetsGrid')),
  'houses': lazy(() => import('../components/HousesGrid')),
  'house-systems': lazy(() => import('../components/HouseSystemsGrid')),
  'aspects': lazy(() => import('../components/AspectsGrid')),
  'lunar': lazy(() => import('../components/MoonSignsGrid')),
  'ascendants': lazy(() => import('../components/AscendantsGrid')),
  'asteroids': lazy(() => import('../components/AsteroidsGrid')),
  'celestial': lazy(() => import('../components/CelestialBodiesGrid')),
  'advanced': lazy(() => import('../components/AdvancedDimensionsGrid')),
  'configurations': lazy(() => import('../components/ConfigurationsGrid')),
  'relational': lazy(() => import('../components/RelationalGrid')),
  'dignities': lazy(() => import('../components/DignitiesGrid')),
  'polarizations': lazy(() => import('../components/PolarizationsGrid')),
  'coordinates': lazy(() => import('../components/CoordinateSystemsGrid')),
  'chart-shapes': lazy(() => import('../components/ChartShapesGrid')),
};

const GlossaryPage: React.FC = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [parser, setParser] = useState<GlossaryParser | null>(null);
  const [entries, setEntries] = useState<GlossaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('signs');
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set());

  // Lazy load del índice de búsqueda (solo cuando se necesita)
  const { searchIndex, isLoadingIndex, loadSearchIndex } = useGlossarySearch();

  // Dynamically select grid component based on category (only loads selected grid)
  const CurrentGrid = useMemo(() => {
    return GRID_COMPONENTS[selectedCategory] || null;
  }, [selectedCategory]);

  // Set initial category from URL query params
  useEffect(() => {
    const categoryParam = searchParams.get('categoria');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  // Load glossary on mount
  useEffect(() => {
    const loadGlossary = async () => {
      try {
        setLoading(true);
        const glossaryParser = await createGlossaryParser();
        const parsedEntries = glossaryParser.parse();
        
        setParser(glossaryParser);
        setEntries(parsedEntries);
        setError(null);
      } catch (err) {
        logger.error('Error loading glossary:', err);
        setError('Error al cargar el glosario. Por favor, intenta más tarde.');
      } finally {
        setLoading(false);
      }
    };

    loadGlossary();
  }, []);

  // Lazy load search index cuando el usuario empiece a buscar
  useEffect(() => {
    // Solo cargar si hay texto de búsqueda y el índice no está cargado
    if (searchTerm.trim() && !searchIndex && !isLoadingIndex) {
      logger.info('[GlossaryPage] Usuario buscando, cargando índice...');
      loadSearchIndex();
    }
  }, [searchTerm, searchIndex, isLoadingIndex, loadSearchIndex]);
  
  // Agregar entradas genéricas del glosario al índice (si existe)
  const allSearchableContent = useMemo(() => {
    if (!searchIndex) return [];
    
    // Si no hay entries genéricos, solo devolver el índice pre-cargado
    if (entries.length === 0) return searchIndex;
    
    // Helper para obtener info de categoría
    const getCategoryInfo = (categoryId: string) => {
      const cat = GLOSSARY_CATEGORIES.find(c => c.id === categoryId);
      return {
        name: cat?.name || categoryId,
        icon: cat?.icon || '📖'
      };
    };
    
    // Combinar índice pre-cargado con entries genéricos
    const genericEntries: SearchResult[] = entries.map(entry => {
      const catInfo = getCategoryInfo(entry.category);
      return {
        id: `entry-${entry.id}`,
        title: entry.title,
        category: entry.category,
        categoryName: catInfo.name,
        categoryIcon: catInfo.icon,
        snippet: entry.content.substring(0, 100) + '...',
        matchType: 'title' as const
      };
    });
    
    return [...searchIndex, ...genericEntries];
  }, [searchIndex, entries]);

  // Buscar en todo el contenido indexado
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];

    const searchLower = searchTerm.toLowerCase().trim();
    
    return allSearchableContent
      .filter(item => {
        // Buscar en título
        if (item.title.toLowerCase().includes(searchLower)) return true;
        // Buscar en snippet/descripción
        if (item.snippet?.toLowerCase().includes(searchLower)) return true;
        return false;
      })
      .sort((a, b) => {
        // Priorizar coincidencias exactas en el título
        const aExact = a.title.toLowerCase() === searchLower;
        const bExact = b.title.toLowerCase() === searchLower;
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;

        // Priorizar coincidencias al inicio del título
        const aStarts = a.title.toLowerCase().startsWith(searchLower);
        const bStarts = b.title.toLowerCase().startsWith(searchLower);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;

        return 0;
      })
      .slice(0, 30); // Limitar a 30 resultados
  }, [searchTerm, allSearchableContent]);

  // Manejar clic en resultado de búsqueda
  const handleSearchResultClick = (result: SearchResult) => {
    // Extraer ID del resultado (después del primer guion)
    const id = result.id.split('-').slice(1).join('-');
    
    // Cambiar a la categoría correspondiente
    setSelectedCategory(result.category);
    
    // Limpiar búsqueda
    setSearchTerm('');
    
    // Esperar a que se renderice la nueva categoría y luego buscar el elemento
    const findAndClickElement = (attempts = 0) => {
      const maxAttempts = 10;
      
      if (attempts >= maxAttempts) {
        logger.warn(`No se pudo encontrar el elemento con data-id="${id}"`);
        return;
      }
      
      const element = document.querySelector(`[data-id="${id}"]`) as HTMLElement;
      
      if (element) {
        // Elemento encontrado, hacer scroll y clic
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
          element.click();
        }, 600);
      } else {
        // Elemento no encontrado, intentar de nuevo
        setTimeout(() => {
          findAndClickElement(attempts + 1);
        }, 100);
      }
    };
    
    // Iniciar la búsqueda después de un breve delay para que cambie la categoría
    setTimeout(() => {
      findAndClickElement();
    }, 100);
  };

  // Filter and search entries
  const filteredEntries = useMemo(() => {
    if (!parser) return [];

    let result = entries;

    // Filter out invalid/non-astrological entries (HTML tags, doctype, etc.)
    const invalidTerms = ['<!doctype', '<html>', '</html>', '<head>', '</head>', '<body>', '</body>', '<meta', '<link', '<script'];
    result = result.filter(entry => 
      !invalidTerms.some(term => entry.title.toLowerCase().includes(term))
    );

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(entry => entry.category === selectedCategory);
    }

    // Search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(entry => 
        entry.title.toLowerCase().includes(searchLower) ||
        entry.content.toLowerCase().includes(searchLower) ||
        entry.searchTerms.some(term => term.includes(searchLower))
      );
    }

    return result;
  }, [entries, selectedCategory, searchTerm, parser]);

  // Calculate entry counts by category
  // Usa searchIndex si está cargado, si no, valores hardcoded conocidos
  const entryCounts = useMemo(() => {
    const counts: { [key: string]: number } = {};
    
    // Si el índice de búsqueda está cargado, contar desde ahí
    if (searchIndex) {
      GLOSSARY_CATEGORIES.forEach(category => {
        if (category.id === 'all') {
          counts[category.id] = searchIndex.length + entries.length;
        } else {
          counts[category.id] = searchIndex.filter(item => item.category === category.id).length;
        }
      });
    } else {
      // Valores hardcoded hasta que se cargue el índice (lazy)
      const hardcodedCounts: { [key: string]: number } = {
        'all': entries.length,
        'signs': 12,
        'planets': 10,
        'houses': 12,
        'house-systems': 10,
        'aspects': 10,
        'lunar': 12,
        'ascendants': 12,
        'asteroids': 7,
        'celestial': 11,
        'advanced': 7,
        'configurations': 7,
        'relational': 6,
        'dignities': 9,
        'polarizations': 8,
        'coordinates': 5,
        'chart-shapes': 7
      };
      
      GLOSSARY_CATEGORIES.forEach(category => {
        counts[category.id] = hardcodedCounts[category.id] || 0;
      });
    }

    return counts;
  }, [searchIndex, entries]);

  // Toggle entry expansion
  const toggleEntry = (entryId: string) => {
    setExpandedEntries(prev => {
      const newSet = new Set(prev);
      if (newSet.has(entryId)) {
        newSet.delete(entryId);
      } else {
        newSet.add(entryId);
      }
      return newSet;
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-purple-700">Cargando glosario astrológico...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error al cargar el glosario</h2>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-purple-900">
            <span className="hidden sm:inline">{t('glossary.title')}</span>
            <span className="sm:hidden">Glosario</span>
          </h1>
          <button
            onClick={() => navigate('/reflexiones')}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl text-sm"
            title="Ver mis reflexiones astrológicas"
          >
            <span className="text-lg">💭</span>
            <span className="hidden sm:inline">Reflexiones</span>
          </button>
        </div>
        <p className="text-purple-700 text-sm">
          Explora nuestro glosario completo con términos astrológicos y prácticas holísticas.
        </p>
      </div>

      {/* Search Bar Global - Siempre visible y busca en todas las categorías */}
      <div className="mb-6">
        <GlossarySearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onResultClick={handleSearchResultClick}
          searchResults={searchResults}
          placeholder="Buscar en todo el glosario... (ej: ascendente, luna, marte)"
        />
      </div>

      {/* Categories - Hybrid Tabs Component */}
      <GlossaryCategories
        categories={GLOSSARY_CATEGORIES}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        entryCounts={entryCounts}
      />

      {/* Results header and actions (ocultar si es la categoría de signos, planetas, casas, aspectos, lunas, ascendentes, asteroides, celestial, dimensiones avanzadas, configuraciones, relacional, dignidades, polarizaciones, sistemas de casas, coordenadas o formas de carta natal) */}
      {selectedCategory !== 'signs' && selectedCategory !== 'planets' && selectedCategory !== 'houses' && selectedCategory !== 'aspects' && selectedCategory !== 'lunar' && selectedCategory !== 'ascendants' && selectedCategory !== 'asteroids' && selectedCategory !== 'celestial' && selectedCategory !== 'advanced' && selectedCategory !== 'configurations' && selectedCategory !== 'relational' && selectedCategory !== 'dignities' && selectedCategory !== 'polarizations' && selectedCategory !== 'house-systems' && selectedCategory !== 'coordinates' && selectedCategory !== 'chart-shapes' && (
        <div className="flex items-center justify-between mb-4 bg-purple-50 px-4 py-3 rounded-lg">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-purple-900">
              {filteredEntries.length} {filteredEntries.length === 1 ? 'término' : 'términos'}
            </h2>
            
            {searchTerm && (
              <span className="text-sm text-purple-600 bg-white px-3 py-1 rounded-full border border-purple-200">
                "{searchTerm}"
              </span>
            )}
          </div>

          {/* Quick actions */}
          <div className="flex items-center gap-2">
            {(searchTerm || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="text-sm text-purple-600 hover:text-purple-800 font-medium px-3 py-1 rounded-lg hover:bg-purple-100 transition-colors"
              >
                Limpiar filtros
              </button>
            )}
            
            <button
              onClick={() => {
                const filteredIds = filteredEntries.map(e => e.id);
                const allExpanded = filteredIds.every(id => expandedEntries.has(id));
                
                if (allExpanded) {
                  setExpandedEntries(prev => {
                    const newSet = new Set(prev);
                    filteredIds.forEach(id => newSet.delete(id));
                    return newSet;
                  });
                } else {
                  setExpandedEntries(prev => {
                    const newSet = new Set(prev);
                    filteredIds.forEach(id => newSet.add(id));
                    return newSet;
                  });
                }
              }}
              className="text-sm bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              {filteredEntries.every(e => expandedEntries.has(e.id)) ? 'Contraer todo' : 'Expandir todo'}
            </button>
          </div>
        </div>
      )}

      {/* Results Grid - Dynamic lazy loading (only loads selected category) */}
      <Suspense fallback={<div className="flex justify-center py-8"><LoadingSpinner /></div>}>
        {CurrentGrid ? (
          <div>
            <CurrentGrid />
          </div>
        ) : filteredEntries.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-purple-400 mb-4">
            <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.137 0-4.146.832-5.636 2.186M6 18h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-purple-800 mb-2">
            No se encontraron términos
          </h3>
          <p className="text-purple-600">
            Intenta con otras palabras clave o selecciona una categoría diferente.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredEntries.map((entry) => (
            <GlossaryEntryComponent
              key={entry.id}
              entry={entry}
              isExpanded={expandedEntries.has(entry.id)}
              onToggle={() => toggleEntry(entry.id)}
            />
          ))}
        </div>
      )}
      </Suspense>

      {/* Footer stats */}
      {filteredEntries.length > 0 && selectedCategory !== 'signs' && selectedCategory !== 'planets' && selectedCategory !== 'houses' && selectedCategory !== 'aspects' && selectedCategory !== 'lunar' && selectedCategory !== 'ascendants' && selectedCategory !== 'asteroids' && selectedCategory !== 'celestial' && selectedCategory !== 'advanced' && selectedCategory !== 'configurations' && selectedCategory !== 'relational' && selectedCategory !== 'dignities' && selectedCategory !== 'polarizations' && selectedCategory !== 'chart-shapes' && (
        <div className="mt-8 text-center py-4 border-t border-purple-200">
          <p className="text-sm text-purple-600 font-medium">
            Mostrando {filteredEntries.length} de {entries.length} términos totales
          </p>
        </div>
      )}
    </div>
  );
};

export default GlossaryPage;