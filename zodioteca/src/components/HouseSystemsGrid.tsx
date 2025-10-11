import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HOUSE_SYSTEMS_GLOSSARY } from '../types/houseSystem';
import type { HouseSystemGlossary } from '../types/houseSystem';
import LoadingSpinner from './LoadingSpinner';

// ⚡ FASE 3: Lazy load HouseSystemModal (16.96 KB)
const HouseSystemModal = lazy(() => import('./HouseSystemModal'));

const HouseSystemsGrid: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [selectedSystem, setSelectedSystem] = useState<HouseSystemGlossary | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'temporal' | 'espacial' | 'zodiacal'>('all');
  const [selectedEra, setSelectedEra] = useState<'all' | 'antiguo' | 'medieval' | 'renacentista' | 'moderno'>('all');
  const [highlightedSystem, setHighlightedSystem] = useState<string | null>(null);

  // Auto-abrir modal si viene con parámetro 'sistema' en la URL
  useEffect(() => {
    const sistemaParam = searchParams.get('sistema');
    if (sistemaParam && HOUSE_SYSTEMS_GLOSSARY[sistemaParam as keyof typeof HOUSE_SYSTEMS_GLOSSARY]) {
      const system = HOUSE_SYSTEMS_GLOSSARY[sistemaParam as keyof typeof HOUSE_SYSTEMS_GLOSSARY];
      setSelectedSystem(system);
      setIsModalOpen(true);
      setHighlightedSystem(sistemaParam);
      
      // Scroll suave al sistema después de un breve delay
      setTimeout(() => {
        const element = document.querySelector(`[data-id="${sistemaParam}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);

      // Quitar highlight después de 3 segundos
      setTimeout(() => {
        setHighlightedSystem(null);
      }, 3000);
    }
  }, [searchParams]);

  const handleSystemClick = (system: HouseSystemGlossary) => {
    setSelectedSystem(system);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedSystem(null), 300);
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      temporal: '⏰',
      espacial: '📐',
      zodiacal: '♈'
    };
    return icons[type as keyof typeof icons] || '🏛️';
  };

  const getTypeColor = (type: string) => {
    const colors = {
      temporal: 'from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700',
      espacial: 'from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700',
      zodiacal: 'from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700'
    };
    return colors[type as keyof typeof colors] || 'from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700';
  };

  const getEraBadge = (era: string) => {
    const badges = {
      antiguo: { icon: '🏺', label: 'Antiguo', color: 'bg-amber-500/20 text-amber-700 dark:text-amber-300' },
      medieval: { icon: '⚔️', label: 'Medieval', color: 'bg-slate-500/20 text-slate-700 dark:text-slate-300' },
      renacentista: { icon: '🎨', label: 'Renac.', color: 'bg-purple-500/20 text-purple-700 dark:text-purple-300' },
      moderno: { icon: '🚀', label: 'Moderno', color: 'bg-blue-500/20 text-blue-700 dark:text-blue-300' }
    };
    return badges[era as keyof typeof badges] || badges.antiguo;
  };

  // Convertir objeto a array y filtrar
  const systemsArray = Object.values(HOUSE_SYSTEMS_GLOSSARY);
  const filteredSystems = systemsArray.filter(system => {
    const typeMatch = selectedFilter === 'all' || system.type === selectedFilter;
    const eraMatch = selectedEra === 'all' || system.era === selectedEra;
    return typeMatch && eraMatch;
  });

  // Contador por tipo
  const countByType = (type: string) => 
    type === 'all' ? systemsArray.length : systemsArray.filter(s => s.type === type).length;

  const countByEra = (era: string) => 
    era === 'all' ? systemsArray.length : systemsArray.filter(s => s.era === era).length;

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* Título e introducción */}
      <div className="text-center space-y-2 sm:space-y-3 md:space-y-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent px-2">
          🏛️ Sistemas de División de Casas
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-3 sm:px-4">
          Descubre los diferentes métodos matemáticos y astronómicos para calcular las 12 casas astrológicas.
          <span className="hidden sm:inline"> Cada sistema ofrece una perspectiva única sobre cómo dividir la esfera celeste.</span>
        </p>
      </div>

      {/* Filtros por tipo */}
      <div className="space-y-3">
        <div className="flex justify-center gap-1.5 sm:gap-2 md:gap-3 flex-wrap px-2">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
              selectedFilter === 'all'
                ? 'bg-purple-600 text-white shadow-lg scale-105'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30'
            }`}
          >
            🏛️ <span className="hidden xs:inline">Todos </span>({countByType('all')})
          </button>
          <button
            onClick={() => setSelectedFilter('temporal')}
            className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
              selectedFilter === 'temporal'
                ? 'bg-blue-600 text-white shadow-lg scale-105'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/30'
            }`}
          >
            ⏰ <span className="hidden xs:inline">Temporales </span>({countByType('temporal')})
          </button>
          <button
            onClick={() => setSelectedFilter('espacial')}
            className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
              selectedFilter === 'espacial'
                ? 'bg-green-600 text-white shadow-lg scale-105'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-900/30'
            }`}
          >
            📐 <span className="hidden xs:inline">Espaciales </span>({countByType('espacial')})
          </button>
          <button
            onClick={() => setSelectedFilter('zodiacal')}
            className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
              selectedFilter === 'zodiacal'
                ? 'bg-orange-600 text-white shadow-lg scale-105'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-orange-900/30'
            }`}
          >
            ♈ <span className="hidden xs:inline">Zodiacales </span>({countByType('zodiacal')})
          </button>
        </div>

        {/* Filtros por época */}
        <div className="flex justify-center gap-1.5 sm:gap-2 md:gap-3 flex-wrap px-2">
          <button
            onClick={() => setSelectedEra('all')}
            className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold transition-all ${
              selectedEra === 'all'
                ? 'bg-gray-600 text-white shadow-lg scale-105'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Todas las épocas ({countByEra('all')})
          </button>
          <button
            onClick={() => setSelectedEra('antiguo')}
            className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold transition-all ${
              selectedEra === 'antiguo'
                ? 'bg-amber-600 text-white shadow-lg scale-105'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-amber-50 dark:hover:bg-amber-900/20'
            }`}
          >
            🏺 Antiguo ({countByEra('antiguo')})
          </button>
          <button
            onClick={() => setSelectedEra('medieval')}
            className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold transition-all ${
              selectedEra === 'medieval'
                ? 'bg-slate-600 text-white shadow-lg scale-105'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-slate-900/20'
            }`}
          >
            ⚔️ Medieval ({countByEra('medieval')})
          </button>
          <button
            onClick={() => setSelectedEra('renacentista')}
            className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold transition-all ${
              selectedEra === 'renacentista'
                ? 'bg-purple-600 text-white shadow-lg scale-105'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'
            }`}
          >
            🎨 Renac. ({countByEra('renacentista')})
          </button>
          <button
            onClick={() => setSelectedEra('moderno')}
            className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold transition-all ${
              selectedEra === 'moderno'
                ? 'bg-blue-600 text-white shadow-lg scale-105'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
            }`}
          >
            🚀 Moderno ({countByEra('moderno')})
          </button>
        </div>
      </div>

      {/* Grid de sistemas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        {filteredSystems.map((system) => {
          const eraBadge = getEraBadge(system.era);
          return (
            <button
              key={system.id}
              data-id={system.id}
              onClick={() => handleSystemClick(system)}
              className={`
                group relative overflow-hidden rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6
                bg-gradient-to-br ${getTypeColor(system.type)}
                text-white shadow-lg hover:shadow-2xl
                transform hover:scale-105 transition-all duration-300
                cursor-pointer text-left
                ${highlightedSystem === system.id ? 'ring-4 ring-yellow-400 animate-pulse' : ''}
              `}
            >
              {/* Patrón de fondo animado */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300">
                <div className="absolute inset-0" style={{
                  backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
                  backgroundSize: '20px 20px'
                }}></div>
              </div>

              {/* Contenido */}
              <div className="relative z-10 space-y-2 sm:space-y-3">
                {/* Header con símbolo y badges */}
                <div className="flex items-start justify-between">
                  <div className="text-4xl sm:text-5xl group-hover:scale-110 transition-transform duration-300">
                    {system.symbol}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold ${eraBadge.color} backdrop-blur-sm`}>
                      {eraBadge.icon} {eraBadge.label}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-white/20 backdrop-blur-sm">
                      {getTypeIcon(system.type)} {system.type === 'temporal' ? 'Temporal' : system.type === 'espacial' ? 'Espacial' : 'Zodiacal'}
                    </span>
                  </div>
                </div>

                {/* Nombre y subtítulo */}
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-1">{system.name}</h3>
                  <p className="text-xs sm:text-sm opacity-90">{system.subtitle}</p>
                </div>

                {/* Autor y época */}
                <div className="space-y-1 text-xs sm:text-sm opacity-90">
                  <p className="font-semibold">{system.author}</p>
                  <p className="text-xs">{system.century}</p>
                </div>

                {/* Rango de latitud */}
                <div className="pt-2 border-t border-white/20">
                  <p className="text-xs font-semibold opacity-75">📍 Latitud: {system.latitudeRange}</p>
                </div>

                {/* Indicador de click */}
                <div className="flex items-center justify-center pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                    Click para más info →
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Leyenda de tipos */}
      <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 backdrop-blur-sm">
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-purple-900 dark:text-purple-100 mb-3 sm:mb-4 text-center">
          Clasificación por Tipo de División
        </h3>
        <div className="grid md:grid-cols-3 gap-3 sm:gap-4">
          <div className="flex flex-col items-center space-y-2 p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg sm:rounded-xl">
            <span className="text-3xl sm:text-4xl">⏰</span>
            <span className="text-sm sm:text-base font-bold text-blue-700 dark:text-blue-300">Temporales</span>
            <span className="text-xs sm:text-sm text-center text-gray-600 dark:text-gray-400">
              Dividen según el tiempo de ascensión (Placidus, Koch)
            </span>
          </div>
          <div className="flex flex-col items-center space-y-2 p-3 sm:p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg sm:rounded-xl">
            <span className="text-3xl sm:text-4xl">📐</span>
            <span className="text-sm sm:text-base font-bold text-green-700 dark:text-green-300">Espaciales</span>
            <span className="text-xs sm:text-sm text-center text-gray-600 dark:text-gray-400">
              Dividen el espacio ecuatorialmente (Equal, Porphyry, Campanus)
            </span>
          </div>
          <div className="flex flex-col items-center space-y-2 p-3 sm:p-4 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-lg sm:rounded-xl">
            <span className="text-3xl sm:text-4xl">♈</span>
            <span className="text-sm sm:text-base font-bold text-orange-700 dark:text-orange-300">Zodiacales</span>
            <span className="text-xs sm:text-sm text-center text-gray-600 dark:text-gray-400">
              Un signo completo = una casa (Whole Sign)
            </span>
          </div>
        </div>
      </div>

      {/* Modal detallado */}
      {selectedSystem && (
        <Suspense fallback={<LoadingSpinner />}>
          <HouseSystemModal
            system={selectedSystem}
            isOpen={isModalOpen}
            onClose={closeModal}
          />
        </Suspense>
      )}
    </div>
  );
};

export default HouseSystemsGrid;
