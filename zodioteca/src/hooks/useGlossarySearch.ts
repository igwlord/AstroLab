import { useState, useCallback } from 'react';
import type { SearchResult } from '../components/GlossarySearch';
import { GLOSSARY_CATEGORIES } from '../types/glossary';
import { logger } from '../utils/logger';

// Cache global del índice de búsqueda (compartido entre instancias)
let searchIndexCache: SearchResult[] | null = null;
let loadPromise: Promise<SearchResult[]> | null = null;

/**
 * Hook para cargar y buscar en el índice de glosario de forma lazy
 * Carga los datos SOLO cuando se necesitan (primer búsqueda)
 * Cachea resultados para búsquedas posteriores
 */
export function useGlossarySearch() {
  const [searchIndex, setSearchIndex] = useState<SearchResult[] | null>(searchIndexCache);
  const [isLoadingIndex, setIsLoadingIndex] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carga el índice de búsqueda completo con lazy imports
   */
  const loadSearchIndex = useCallback(async (): Promise<SearchResult[]> => {
    // Si ya está en cache, devolverlo
    if (searchIndexCache) {
      logger.info('[useGlossarySearch] Usando índice desde cache');
      setSearchIndex(searchIndexCache);
      return searchIndexCache;
    }

    // Si ya se está cargando, esperar a esa promesa
    if (loadPromise) {
      logger.info('[useGlossarySearch] Esperando carga en progreso...');
      return loadPromise;
    }

    // Iniciar nueva carga
    setIsLoadingIndex(true);
    setError(null);
    logger.info('[useGlossarySearch] Cargando índice de búsqueda...');

    loadPromise = (async () => {
      try {
        const content: SearchResult[] = [];

        // Helper para obtener info de categoría
        const getCategoryInfo = (categoryId: string) => {
          const cat = GLOSSARY_CATEGORIES.find(c => c.id === categoryId);
          return {
            name: cat?.name || categoryId,
            icon: cat?.icon || '📖'
          };
        };

        // Lazy import de cada tipo de dato
        const [
          { ZODIAC_SIGNS },
          { PLANETS },
          { HOUSES },
          { HOUSE_SYSTEMS_GLOSSARY },
          { ASPECTS },
          { MOON_SIGNS },
          { ASCENDANTS },
          { ASTEROIDS },
          { CELESTIAL_BODIES },
          { CONFIGURATIONS },
          { RELATIONAL_TECHNIQUES },
          { DIGNITIES },
          { POLARIZATIONS },
          { ADVANCED_DIMENSIONS },
          { COORDINATE_SYSTEMS },
          CHART_SHAPES_GLOSSARY
        ] = await Promise.all([
          import('../types/zodiacSign'),
          import('../types/planet'),
          import('../types/house'),
          import('../types/houseSystem'),
          import('../types/aspect'),
          import('../types/moonSign'),
          import('../types/ascendant'),
          import('../types/asteroid'),
          import('../types/celestialBody'),
          import('../types/configuration'),
          import('../types/relational'),
          import('../types/dignity'),
          import('../types/polarization'),
          import('../types/advancedDimension'),
          import('../types/coordinateSystem'),
          import('../data/chartShapesGlossary')
        ]);

        // Indexar signos zodiacales
        ZODIAC_SIGNS.forEach(sign => {
          const catInfo = getCategoryInfo('signs');
          content.push({
            id: `sign-${sign.id}`,
            title: sign.name,
            category: 'signs',
            categoryName: catInfo.name,
            categoryIcon: catInfo.icon,
            snippet: `${sign.element} • ${sign.modality} • ${sign.dateRange}`,
            matchType: 'title'
          });
        });

        // Indexar planetas
        PLANETS.forEach(planet => {
          const catInfo = getCategoryInfo('planets');
          content.push({
            id: `planet-${planet.name.toLowerCase()}`,
            title: planet.name,
            category: 'planets',
            categoryName: catInfo.name,
            categoryIcon: catInfo.icon,
            snippet: planet.description.substring(0, 100) + '...',
            matchType: 'title'
          });
        });

        // Indexar casas
        HOUSES.forEach(house => {
          const catInfo = getCategoryInfo('houses');
          content.push({
            id: `house-${house.number}`,
            title: `Casa ${house.number}`,
            category: 'houses',
            categoryName: catInfo.name,
            categoryIcon: catInfo.icon,
            snippet: house.description.substring(0, 100) + '...',
            matchType: 'title'
          });
        });

        // Indexar sistemas de casas
        Object.values(HOUSE_SYSTEMS_GLOSSARY).forEach(system => {
          const catInfo = getCategoryInfo('house-systems');
          content.push({
            id: `house-system-${system.id}`,
            title: system.name,
            category: 'house-systems',
            categoryName: catInfo.name,
            categoryIcon: catInfo.icon,
            snippet: `${system.subtitle} • ${system.type} • ${system.era}`,
            matchType: 'title'
          });
        });

        // Indexar aspectos
        ASPECTS.forEach(aspect => {
          const catInfo = getCategoryInfo('aspects');
          content.push({
            id: `aspect-${aspect.name.toLowerCase()}`,
            title: aspect.name,
            category: 'aspects',
            categoryName: catInfo.name,
            categoryIcon: catInfo.icon,
            snippet: `${aspect.angle}° • ${aspect.description.substring(0, 50)}...`,
            matchType: 'title'
          });
        });

        // Indexar lunas
        MOON_SIGNS.forEach(moon => {
          const catInfo = getCategoryInfo('lunar');
          content.push({
            id: `moon-${moon.sign.toLowerCase()}`,
            title: `Luna en ${moon.sign}`,
            category: 'lunar',
            categoryName: catInfo.name,
            categoryIcon: catInfo.icon,
            snippet: moon.description.substring(0, 100) + '...',
            matchType: 'title'
          });
        });

        // Indexar ascendentes
        ASCENDANTS.forEach(asc => {
          const catInfo = getCategoryInfo('ascendants');
          content.push({
            id: `ascendant-${asc.sign.toLowerCase()}`,
            title: `Ascendente en ${asc.sign}`,
            category: 'ascendants',
            categoryName: catInfo.name,
            categoryIcon: catInfo.icon,
            snippet: asc.description.substring(0, 100) + '...',
            matchType: 'title'
          });
        });

        // Indexar asteroides
        ASTEROIDS.forEach(asteroid => {
          const catInfo = getCategoryInfo('asteroids');
          content.push({
            id: `asteroid-${asteroid.name.toLowerCase()}`,
            title: asteroid.name,
            category: 'asteroids',
            categoryName: catInfo.name,
            categoryIcon: catInfo.icon,
            snippet: asteroid.mythology.substring(0, 100) + '...',
            matchType: 'title'
          });
        });

        // Indexar cuerpos celestes
        CELESTIAL_BODIES.forEach(body => {
          const catInfo = getCategoryInfo('celestial');
          content.push({
            id: `celestial-${body.name.toLowerCase()}`,
            title: body.name,
            category: 'celestial',
            categoryName: catInfo.name,
            categoryIcon: catInfo.icon,
            snippet: body.mythology.substring(0, 100) + '...',
            matchType: 'title'
          });
        });

        // Indexar dimensiones avanzadas
        ADVANCED_DIMENSIONS.forEach(dim => {
          const catInfo = getCategoryInfo('advanced');
          content.push({
            id: `advanced-${dim.id}`,
            title: dim.name,
            category: 'advanced',
            categoryName: catInfo.name,
            categoryIcon: catInfo.icon,
            snippet: dim.description.substring(0, 100) + '...',
            matchType: 'title'
          });
        });

        // Indexar configuraciones
        CONFIGURATIONS.forEach(config => {
          const catInfo = getCategoryInfo('configurations');
          content.push({
            id: `configuration-${config.name.toLowerCase()}`,
            title: config.name,
            category: 'configurations',
            categoryName: catInfo.name,
            categoryIcon: catInfo.icon,
            snippet: config.description.substring(0, 100) + '...',
            matchType: 'title'
          });
        });

        // Indexar técnicas relacionales
        RELATIONAL_TECHNIQUES.forEach(tech => {
          const catInfo = getCategoryInfo('relational');
          content.push({
            id: `relational-${tech.name.toLowerCase()}`,
            title: tech.name,
            category: 'relational',
            categoryName: catInfo.name,
            categoryIcon: catInfo.icon,
            snippet: tech.description.substring(0, 100) + '...',
            matchType: 'title'
          });
        });

        // Indexar dignidades
        DIGNITIES.forEach(dignity => {
          const catInfo = getCategoryInfo('dignities');
          content.push({
            id: `dignity-${dignity.name.toLowerCase()}`,
            title: dignity.name,
            category: 'dignities',
            categoryName: catInfo.name,
            categoryIcon: catInfo.icon,
            snippet: dignity.description.substring(0, 100) + '...',
            matchType: 'title'
          });
        });

        // Indexar polarizaciones
        POLARIZATIONS.forEach(polar => {
          const catInfo = getCategoryInfo('polarizations');
          content.push({
            id: `polarization-${polar.name.toLowerCase()}`,
            title: polar.name,
            category: 'polarizations',
            categoryName: catInfo.name,
            categoryIcon: catInfo.icon,
            snippet: polar.description.substring(0, 100) + '...',
            matchType: 'title'
          });
        });

        // Indexar sistemas de coordenadas
        COORDINATE_SYSTEMS.forEach(coord => {
          const catInfo = getCategoryInfo('coordinates');
          content.push({
            id: `coordinate-${coord.name.toLowerCase()}`,
            title: coord.name,
            category: 'coordinates',
            categoryName: catInfo.name,
            categoryIcon: catInfo.icon,
            snippet: coord.name,
            matchType: 'title'
          });
        });

        // Indexar formas de carta
        Object.values(CHART_SHAPES_GLOSSARY.default || CHART_SHAPES_GLOSSARY).forEach(shape => {
          const catInfo = getCategoryInfo('chart-shapes');
          content.push({
            id: `chart-shape-${shape.id}`,
            title: shape.name,
            category: 'chart-shapes',
            categoryName: catInfo.name,
            categoryIcon: catInfo.icon,
            snippet: shape.name,
            matchType: 'title'
          });
        });

        logger.info(`[useGlossarySearch] ✅ Índice cargado: ${content.length} entradas`);
        
        // Guardar en cache
        searchIndexCache = content;
        setSearchIndex(content);
        setIsLoadingIndex(false);
        loadPromise = null;
        
        return content;
      } catch (err) {
        logger.error('[useGlossarySearch] Error cargando índice:', err);
        setError('Error al cargar el índice de búsqueda');
        setIsLoadingIndex(false);
        loadPromise = null;
        throw err;
      }
    })();

    return loadPromise;
  }, []);

  /**
   * Limpiar cache (útil para testing)
   */
  const clearCache = useCallback(() => {
    searchIndexCache = null;
    setSearchIndex(null);
    logger.info('[useGlossarySearch] Cache limpiado');
  }, []);

  return {
    searchIndex,
    isLoadingIndex,
    error,
    loadSearchIndex,
    clearCache
  };
}
