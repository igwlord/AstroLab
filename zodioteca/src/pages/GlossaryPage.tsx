import { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { useI18n } from '../i18n';
import { createGlossaryParser, GlossaryParser } from '../utils/parseGlossary';
import type { GlossaryEntry } from '../types/glossary';
import { GLOSSARY_CATEGORIES } from '../types/glossary';
import { ZODIAC_SIGNS } from '../types/zodiacSign';
import { PLANETS } from '../types/planet';
import { HOUSES } from '../types/house';
import { ASPECTS } from '../types/aspect';
import { MOON_SIGNS } from '../types/moonSign';
import { ASCENDANTS } from '../types/ascendant';
import { ASTEROIDS } from '../types/asteroid';
import { CELESTIAL_BODIES } from '../types/celestialBody';
import { CONFIGURATIONS } from '../types/configuration';
import { RELATIONAL_TECHNIQUES } from '../types/relational';
import { DIGNITIES } from '../types/dignity';
import { POLARIZATIONS } from '../types/polarization';
import { ADVANCED_DIMENSIONS } from '../types/advancedDimension';
import GlossaryEntryComponent from '../components/GlossaryEntry';
import GlossarySearch from '../components/GlossarySearch';
import LoadingSpinner from '../components/LoadingSpinner';

// Lazy load grids - reduce initial bundle by ~30 KB
const ZodiacSignsGrid = lazy(() => import('../components/ZodiacSignsGrid'));
const PlanetsGrid = lazy(() => import('../components/PlanetsGrid'));
const HousesGrid = lazy(() => import('../components/HousesGrid'));
const AspectsGrid = lazy(() => import('../components/AspectsGrid'));
const MoonSignsGrid = lazy(() => import('../components/MoonSignsGrid'));
const AscendantsGrid = lazy(() => import('../components/AscendantsGrid'));
const AsteroidsGrid = lazy(() => import('../components/AsteroidsGrid'));
const CelestialBodiesGrid = lazy(() => import('../components/CelestialBodiesGrid'));
const AdvancedDimensionsGrid = lazy(() => import('../components/AdvancedDimensionsGrid'));
const ConfigurationsGrid = lazy(() => import('../components/ConfigurationsGrid'));
const RelationalGrid = lazy(() => import('../components/RelationalGrid'));
const DignitiesGrid = lazy(() => import('../components/DignitiesGrid'));
const PolarizationsGrid = lazy(() => import('../components/PolarizationsGrid'));

const GlossaryPage: React.FC = () => {
  const { t } = useI18n();
  const [parser, setParser] = useState<GlossaryParser | null>(null);
  const [entries, setEntries] = useState<GlossaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('signs');
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set());

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
        console.error('Error loading glossary:', err);
        setError('Error al cargar el glosario. Por favor, intenta más tarde.');
      } finally {
        setLoading(false);
      }
    };

    loadGlossary();
  }, []);

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
  const entryCounts = useMemo(() => {
    const counts: { [key: string]: number } = {};
    
    GLOSSARY_CATEGORIES.forEach(category => {
      if (category.id === 'all') {
        counts[category.id] = entries.length;
      } else if (category.id === 'signs') {
        // Para la categoría de signos, contamos los 12 signos del zodíaco
        counts[category.id] = ZODIAC_SIGNS.length;
      } else if (category.id === 'planets') {
        // Para la categoría de planetas, contamos los 10 planetas
        counts[category.id] = PLANETS.length;
      } else if (category.id === 'houses') {
        // Para la categoría de casas, contamos las 12 casas
        counts[category.id] = HOUSES.length;
      } else if (category.id === 'aspects') {
        // Para la categoría de aspectos, contamos los 10 aspectos
        counts[category.id] = ASPECTS.length;
      } else if (category.id === 'lunar') {
        // Para la categoría de lunas, contamos las 12 lunas
        counts[category.id] = MOON_SIGNS.length;
      } else if (category.id === 'ascendants') {
        // Para la categoría de ascendentes, contamos los 12 ascendentes
        counts[category.id] = ASCENDANTS.length;
      } else if (category.id === 'asteroids') {
        // Para la categoría de asteroides, contamos los 7 asteroides
        counts[category.id] = ASTEROIDS.length;
      } else if (category.id === 'celestial') {
        // Para la categoría de otros cuerpos celestes, contamos los 11 cuerpos
        counts[category.id] = CELESTIAL_BODIES.length;
      } else if (category.id === 'advanced') {
        // Para la categoría de dimensiones astrológicas, contamos las 7 dimensiones
        counts[category.id] = ADVANCED_DIMENSIONS.length;
      } else if (category.id === 'configurations') {
        // Para la categoría de configuraciones, contamos las 7 configuraciones
        counts[category.id] = CONFIGURATIONS.length;
      } else if (category.id === 'relational') {
        // Para la categoría relacional, contamos las 6 técnicas
        counts[category.id] = RELATIONAL_TECHNIQUES.length;
      } else if (category.id === 'dignities') {
        // Para la categoría de dignidades, contamos las 9 dignidades
        counts[category.id] = DIGNITIES.length;
      } else if (category.id === 'polarizations') {
        // Para la categoría de polarizaciones, contamos las 8 polarizaciones
        counts[category.id] = POLARIZATIONS.length;
      } else {
        counts[category.id] = entries.filter(entry => entry.category === category.id).length;
      }
    });

    return counts;
  }, [entries]);

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
        <h1 className="text-3xl font-bold text-purple-900 mb-2">
          {t('glossary.title')}
        </h1>
        <p className="text-purple-700 text-sm">
          Explora nuestro glosario completo con términos astrológicos y prácticas holísticas.
        </p>
      </div>

      {/* Search Bar - Full Width (ocultar si es la categoría de signos, planetas, casas, aspectos, lunas, ascendentes, asteroides, celestial, dimensiones avanzadas, configuraciones, relacional, dignidades o polarizaciones) */}
      {selectedCategory !== 'signs' && selectedCategory !== 'planets' && selectedCategory !== 'houses' && selectedCategory !== 'aspects' && selectedCategory !== 'lunar' && selectedCategory !== 'ascendants' && selectedCategory !== 'asteroids' && selectedCategory !== 'celestial' && selectedCategory !== 'advanced' && selectedCategory !== 'configurations' && selectedCategory !== 'relational' && selectedCategory !== 'dignities' && selectedCategory !== 'polarizations' && (
        <div className="mb-6">
          <GlossarySearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            placeholder={t('glossary.search')}
          />
        </div>
      )}

      {/* Categories - Horizontal Scrollable Tabs */}
      <div className="mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-purple-100">
          {GLOSSARY_CATEGORIES.map(category => {
            const count = entryCounts[category.id] || 0;
            const isActive = selectedCategory === category.id;
            
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                disabled={count === 0 && category.id !== 'all'}
                className={`
                  flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                  transition-all duration-200
                  ${isActive 
                    ? 'bg-purple-600 text-white shadow-lg scale-105' 
                    : count === 0 && category.id !== 'all'
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-purple-700 border-2 border-purple-200 hover:border-purple-400 hover:shadow-md'
                  }
                `}
              >
                <span className="text-lg">{category.icon}</span>
                <span>{category.name}</span>
                {count > 0 && (
                  <span className={`
                    ml-1 px-2 py-0.5 rounded-full text-xs font-semibold
                    ${isActive ? 'bg-purple-500' : 'bg-purple-100 text-purple-700'}
                  `}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results header and actions (ocultar si es la categoría de signos, planetas, casas, aspectos, lunas, ascendentes, asteroides, celestial, dimensiones avanzadas, configuraciones, relacional, dignidades o polarizaciones) */}
      {selectedCategory !== 'signs' && selectedCategory !== 'planets' && selectedCategory !== 'houses' && selectedCategory !== 'aspects' && selectedCategory !== 'lunar' && selectedCategory !== 'ascendants' && selectedCategory !== 'asteroids' && selectedCategory !== 'celestial' && selectedCategory !== 'advanced' && selectedCategory !== 'configurations' && selectedCategory !== 'relational' && selectedCategory !== 'dignities' && selectedCategory !== 'polarizations' && (
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

      {/* Results Grid - Lazy loaded for performance */}
      <Suspense fallback={<div className="flex justify-center py-8"><LoadingSpinner /></div>}>
        {selectedCategory === 'signs' ? (
          /* Mostrar grid de signos zodiacales */
          <div>
            <ZodiacSignsGrid />
          </div>
        ) : selectedCategory === 'planets' ? (
          /* Mostrar grid de planetas */
          <div>
            <PlanetsGrid />
          </div>
        ) : selectedCategory === 'houses' ? (
          /* Mostrar grid de casas */
          <div>
            <HousesGrid />
          </div>
        ) : selectedCategory === 'aspects' ? (
          /* Mostrar grid de aspectos */
          <div>
            <AspectsGrid />
          </div>
        ) : selectedCategory === 'lunar' ? (
          /* Mostrar grid de lunas */
          <div>
            <MoonSignsGrid />
          </div>
        ) : selectedCategory === 'ascendants' ? (
          /* Mostrar grid de ascendentes */
          <div>
            <AscendantsGrid />
          </div>
        ) : selectedCategory === 'asteroids' ? (
          /* Mostrar grid de asteroides */
          <div>
            <AsteroidsGrid />
          </div>
        ) : selectedCategory === 'celestial' ? (
          /* Mostrar grid de otros cuerpos celestes */
          <div>
            <CelestialBodiesGrid />
          </div>
        ) : selectedCategory === 'advanced' ? (
          /* Mostrar grid de dimensiones astrológicas avanzadas */
          <div>
            <AdvancedDimensionsGrid />
          </div>
        ) : selectedCategory === 'configurations' ? (
          /* Mostrar grid de configuraciones planetarias */
          <div>
            <ConfigurationsGrid />
          </div>
        ) : selectedCategory === 'relational' ? (
          /* Mostrar grid de astrología relacional */
          <div>
            <RelationalGrid />
          </div>
        ) : selectedCategory === 'dignities' ? (
          /* Mostrar grid de dignidades planetarias */
          <div>
            <DignitiesGrid />
          </div>
        ) : selectedCategory === 'polarizations' ? (
          /* Mostrar grid de polarizaciones planetarias */
          <div>
            <PolarizationsGrid />
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
      {filteredEntries.length > 0 && selectedCategory !== 'signs' && selectedCategory !== 'planets' && selectedCategory !== 'houses' && selectedCategory !== 'aspects' && selectedCategory !== 'lunar' && selectedCategory !== 'ascendants' && selectedCategory !== 'asteroids' && selectedCategory !== 'celestial' && selectedCategory !== 'advanced' && selectedCategory !== 'configurations' && selectedCategory !== 'relational' && selectedCategory !== 'dignities' && selectedCategory !== 'polarizations' && (
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