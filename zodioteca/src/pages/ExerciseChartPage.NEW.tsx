/**
 * PÁGINA: TU CARTA NATAL ANALIZADA - VERSIÓN 2.0 REDISEÑADA
 * Sistema organizado con tabs, búsqueda, cards y modal fullscreen
 * 
 * ARQUITECTURA:
 * - Header con navegación
 * - Buscador inteligente (ChartSearchBar)
 * - Tabs navegables (ChartTabsNavigation)
 * - Grid de cards (ChartAnalysisCard)
 * - Modal fullscreen (ChartAnalysisModal)
 */

import { useEffect, useState, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExercisePlanStore } from '../store/useExercisePlanStore';
import ChartAnalysisCard from '../components/ChartAnalysisCard';
import ChartSearchBar, { type SearchableItem } from '../components/ChartSearchBar';
import ChartTabsNavigation, { type ChartTab } from '../components/ChartTabsNavigation';
import ChartAnalysisModal, { type SidebarSection } from '../components/ChartAnalysisModal';
import { 
  getMoonStressExplanation,
  getMercuryManifestationBySign,
  getMercuryRetrogradeImpact,
  getVenusRelationshipStyle,
  getHouseExplanation,
} from '../utils/interpretationHelpers';

// ============================================================================
// TIPOS
// ============================================================================

interface ChartItem {
  id: string;
  category: 'overview' | 'planet' | 'point' | 'aspect' | 'concentration';
  icon: string;
  title: string;
  subtitle: string;
  preview: string;
  keywords: string[];
  content: ReactNode;
  dignity?: {
    type: 'domicile' | 'exaltation' | 'detriment' | 'fall' | 'neutral';
    label: string;
    color: string;
  };
  sidebarSections?: SidebarSection[];
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function ExerciseChartPage() {
  const navigate = useNavigate();
  const { currentPlan: plan } = useExercisePlanStore();

  // Estados
  const [activeTab, setActiveTab] = useState<string>('planets');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<SearchableItem[]>([]);

  // Redirigir si no hay plan
  useEffect(() => {
    if (!plan) {
      navigate('/ejercicios');
    }
  }, [plan, navigate]);

  if (!plan) return null;

  const { chartAnalysis } = plan;

  // ============================================================================
  // UTILIDADES DE TRADUCCIÓN
  // ============================================================================

  const translatePlanet = (planet: string): string => {
    const translations: Record<string, string> = {
      'Sun': 'Sol', 'Moon': 'Luna', 'Mercury': 'Mercurio', 'Venus': 'Venus',
      'Mars': 'Marte', 'Jupiter': 'Júpiter', 'Saturn': 'Saturno',
      'Uranus': 'Urano', 'Neptune': 'Neptuno', 'Pluto': 'Plutón',
      'Chiron': 'Quirón', 'Node': 'Nodo', 'Lilith': 'Lilith'
    };
    return translations[planet] || planet;
  };

  const translateSign = (sign: string): string => {
    const translations: Record<string, string> = {
      'Aries': 'Aries', 'Taurus': 'Tauro', 'Gemini': 'Géminis',
      'Cancer': 'Cáncer', 'Leo': 'Leo', 'Virgo': 'Virgo',
      'Libra': 'Libra', 'Scorpio': 'Escorpio', 'Sagittarius': 'Sagitario',
      'Capricorn': 'Capricornio', 'Aquarius': 'Acuario', 'Pisces': 'Piscis'
    };
    return translations[sign] || sign;
  };

  // ============================================================================
  // FUNCIÓN PARA OBTENER DIGNIDAD
  // ============================================================================

  const getDignityInfo = useCallback((planetName: string) => {
    const weak = chartAnalysis.weakDignities?.find(d => d.planet === planetName);
    const strong = chartAnalysis.strongDignities?.find(d => d.planet === planetName);
    
    if (weak) {
      const type = weak.dignity.type;
      const isDetriment = type === 'detriment';
      return {
        type: type as 'detriment' | 'fall',
        label: isDetriment ? 'Detrimento' : 'Caída',
        color: isDetriment ? 'orange' : 'red'
      };
    }
    
    if (strong) {
      const type = strong.dignity.type;
      const isDomicile = type === 'domicile';
      return {
        type: type as 'domicile' | 'exaltation',
        label: isDomicile ? 'Domicilio' : 'Exaltación',
        color: isDomicile ? 'green' : 'blue'
      };
    }
    
    return undefined;
  }, [chartAnalysis]);

  // ============================================================================
  // DATOS: ITEMS DE ANÁLISIS (PROTOTIPO CON 3 PLANETAS)
  // ============================================================================

  const chartItems: ChartItem[] = useMemo(() => {
    const items: ChartItem[] = [];

    // 🌙 LUNA
    if (chartAnalysis.moon) {
      const moon = chartAnalysis.moon;
      const dignity = getDignityInfo('Moon');
      
      items.push({
        id: 'moon',
        category: 'planet',
        icon: '🌙',
        title: `Luna en ${translateSign(moon.sign)}`,
        subtitle: `Casa ${moon.house}${moon.isRetrograde ? ' • Retrógrada' : ''}`,
        preview: `Nivel de estrés: ${moon.stressScore}/10. ${getMoonStressExplanation(moon.stressScore, []).split('.')[0]}.`,
        keywords: ['luna', 'moon', translateSign(moon.sign).toLowerCase(), `casa ${moon.house}`, 'emociones', 'necesidades'],
        dignity,
        content: (
          <div className="space-y-6">
            {/* Configuración */}
            <section id="config">
              <h3 className="text-xl font-bold text-purple-800 dark:text-purple-300 mb-3 flex items-center gap-2">
                <span>⚙️</span> Configuración Emocional
              </h3>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300">
                  Tu Luna en <strong>{translateSign(moon.sign)}</strong> representa tu mundo emocional 
                  y tus necesidades básicas. Está ubicada en la <strong>Casa {moon.house}</strong>, 
                  {getHouseExplanation(moon.house)}.
                </p>
              </div>
            </section>

            {/* Nivel de Estrés */}
            <section id="stress">
              <h3 className="text-xl font-bold text-purple-800 dark:text-purple-300 mb-3 flex items-center gap-2">
                <span>📊</span> Nivel de Estrés Emocional
              </h3>
              <div className={`border rounded-lg p-4 ${
                moon.stressScore >= 7 ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' :
                moon.stressScore >= 4 ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' :
                'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
              }`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-3xl font-bold">{moon.stressScore}/10</div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${
                          moon.stressScore >= 7 ? 'bg-red-500' :
                          moon.stressScore >= 4 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${moon.stressScore * 10}%` }}
                      />
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  {getMoonStressExplanation(moon.stressScore, moon.stressFactors || [])}
                </p>
              </div>
            </section>

            {/* Factores de Estrés */}
            {moon.stressFactors && moon.stressFactors.length > 0 && (
              <section id="factors">
                <h3 className="text-xl font-bold text-purple-800 dark:text-purple-300 mb-3 flex items-center gap-2">
                  <span>⚠️</span> Factores que Aumentan el Estrés
                </h3>
                <ul className="space-y-2">
                  {moon.stressFactors.map((factor, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                      <span className="text-amber-600 dark:text-amber-400">•</span>
                      <span className="text-gray-700 dark:text-gray-300">{factor}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Trabajo Específico */}
            <section id="work">
              <h3 className="text-xl font-bold text-purple-800 dark:text-purple-300 mb-3 flex items-center gap-2">
                <span>🎯</span> Trabajo Específico
              </h3>
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                <ol className="space-y-3">
                  <li className="flex gap-3">
                    <span className="font-bold text-purple-600 dark:text-purple-400">1.</span>
                    <span className="text-gray-700 dark:text-gray-300">
                      Identifica y valida tus necesidades emocionales sin juzgarlas
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-purple-600 dark:text-purple-400">2.</span>
                    <span className="text-gray-700 dark:text-gray-300">
                      Crea rutinas de autocuidado que nutran tu mundo interior
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-purple-600 dark:text-purple-400">3.</span>
                    <span className="text-gray-700 dark:text-gray-300">
                      Aprende a comunicar tus necesidades de forma clara y asertiva
                    </span>
                  </li>
                </ol>
              </div>
            </section>
          </div>
        ),
        sidebarSections: [
          { id: 'config', label: 'Configuración', icon: '⚙️' },
          { id: 'stress', label: 'Nivel de Estrés', icon: '📊' },
          { id: 'factors', label: 'Factores', icon: '⚠️' },
          { id: 'work', label: 'Trabajo', icon: '🎯' },
        ]
      });
    }

    // ☿️ MERCURIO
    if (chartAnalysis.mercury) {
      const mercury = chartAnalysis.mercury;
      const dignity = getDignityInfo('Mercury');
      
      items.push({
        id: 'mercury',
        category: 'planet',
        icon: '☿️',
        title: `Mercurio en ${translateSign(mercury.sign)}`,
        subtitle: `Casa ${mercury.house}${mercury.isRetrograde ? ' • Retrógrado' : ''}`,
        preview: `Tu mente ${getMercuryManifestationBySign(mercury.sign).split('.')[0].toLowerCase()}.`,
        keywords: ['mercurio', 'mercury', translateSign(mercury.sign).toLowerCase(), `casa ${mercury.house}`, 'comunicación', 'mente'],
        dignity,
        content: (
          <div className="space-y-6">
            {/* Configuración */}
            <section id="config">
              <h3 className="text-xl font-bold text-purple-800 dark:text-purple-300 mb-3 flex items-center gap-2">
                <span>⚙️</span> Tu Estilo Mental
              </h3>
              <div className="bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300">
                  Tu Mercurio en <strong>{translateSign(mercury.sign)}</strong> revela cómo procesas información,
                  te comunicas y aprendes. Está en la <strong>Casa {mercury.house}</strong>,
                  {getHouseExplanation(mercury.house)}.
                </p>
              </div>
            </section>

            {/* Manifestación */}
            <section id="manifestation">
              <h3 className="text-xl font-bold text-purple-800 dark:text-purple-300 mb-3 flex items-center gap-2">
                <span>✨</span> Cómo se Manifiesta
              </h3>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300">
                  {getMercuryManifestationBySign(mercury.sign)}
                </p>
              </div>
            </section>

            {/* Retrógrado */}
            {mercury.isRetrograde && (
              <section id="retrograde">
                <h3 className="text-xl font-bold text-purple-800 dark:text-purple-300 mb-3 flex items-center gap-2">
                  <span>🔄</span> Impacto de Mercurio Retrógrado
                </h3>
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                  <p className="text-gray-700 dark:text-gray-300">
                    {getMercuryRetrogradeImpact()}
                  </p>
                </div>
              </section>
            )}

            {/* Trabajo */}
            <section id="work">
              <h3 className="text-xl font-bold text-purple-800 dark:text-purple-300 mb-3 flex items-center gap-2">
                <span>🎯</span> Trabajo Específico
              </h3>
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                <ol className="space-y-3">
                  <li className="flex gap-3">
                    <span className="font-bold text-purple-600 dark:text-purple-400">1.</span>
                    <span className="text-gray-700 dark:text-gray-300">
                      Reconoce tu estilo único de pensamiento y valídalo
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-purple-600 dark:text-purple-400">2.</span>
                    <span className="text-gray-700 dark:text-gray-300">
                      Practica comunicación clara adaptada a tu audiencia
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-purple-600 dark:text-purple-400">3.</span>
                    <span className="text-gray-700 dark:text-gray-300">
                      Desarrolla métodos de aprendizaje que se alineen con tu naturaleza
                    </span>
                  </li>
                </ol>
              </div>
            </section>
          </div>
        ),
        sidebarSections: [
          { id: 'config', label: 'Estilo Mental', icon: '⚙️' },
          { id: 'manifestation', label: 'Manifestación', icon: '✨' },
          ...(mercury.isRetrograde ? [{ id: 'retrograde', label: 'Retrógrado', icon: '🔄' }] : []),
          { id: 'work', label: 'Trabajo', icon: '🎯' },
        ]
      });
    }

    // 💖 VENUS
    if (chartAnalysis.venus) {
      const venus = chartAnalysis.venus;
      const dignity = getDignityInfo('Venus');
      
      items.push({
        id: 'venus',
        category: 'planet',
        icon: '💖',
        title: `Venus en ${translateSign(venus.sign)}`,
        subtitle: `Casa ${venus.house}${venus.isRetrograde ? ' • Retrógrada' : ''}`,
        preview: `En amor y relaciones, ${getVenusRelationshipStyle(venus.sign).split('.')[0].toLowerCase()}.`,
        keywords: ['venus', translateSign(venus.sign).toLowerCase(), `casa ${venus.house}`, 'amor', 'relaciones', 'valores'],
        dignity,
        content: (
          <div className="space-y-6">
            {/* Configuración */}
            <section id="config">
              <h3 className="text-xl font-bold text-purple-800 dark:text-purple-300 mb-3 flex items-center gap-2">
                <span>⚙️</span> Tu Estilo en el Amor
              </h3>
              <div className="bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300">
                  Tu Venus en <strong>{translateSign(venus.sign)}</strong> define cómo das y recibes amor,
                  qué valoras en las relaciones y qué te hace sentir amado/a. Está en la <strong>Casa {venus.house}</strong>,
                  {getHouseExplanation(venus.house)}.
                </p>
              </div>
            </section>

            {/* Estilo Relacional */}
            <section id="relationship">
              <h3 className="text-xl font-bold text-purple-800 dark:text-purple-300 mb-3 flex items-center gap-2">
                <span>💕</span> Estilo Relacional
              </h3>
              <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300">
                  {getVenusRelationshipStyle(venus.sign)}
                </p>
              </div>
            </section>

            {/* Trabajo */}
            <section id="work">
              <h3 className="text-xl font-bold text-purple-800 dark:text-purple-300 mb-3 flex items-center gap-2">
                <span>🎯</span> Trabajo Específico
              </h3>
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                <ol className="space-y-3">
                  <li className="flex gap-3">
                    <span className="font-bold text-purple-600 dark:text-purple-400">1.</span>
                    <span className="text-gray-700 dark:text-gray-300">
                      Identifica qué necesitas para sentirte verdaderamente amado/a
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-purple-600 dark:text-purple-400">2.</span>
                    <span className="text-gray-700 dark:text-gray-300">
                      Comunica tus necesidades afectivas de forma clara
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-purple-600 dark:text-purple-400">3.</span>
                    <span className="text-gray-700 dark:text-gray-300">
                      Cultiva el amor propio respetando tus valores
                    </span>
                  </li>
                </ol>
              </div>
            </section>
          </div>
        ),
        sidebarSections: [
          { id: 'config', label: 'Estilo en Amor', icon: '⚙️' },
          { id: 'relationship', label: 'Estilo Relacional', icon: '💕' },
          { id: 'work', label: 'Trabajo', icon: '🎯' },
        ]
      });
    }

    return items;
  }, [chartAnalysis, getDignityInfo]);

  // ============================================================================
  // TABS CONFIGURATION
  // ============================================================================

  const tabs: ChartTab[] = useMemo(() => {
    const planetCount = chartItems.filter(i => i.category === 'planet').length;
    const pointCount = chartItems.filter(i => i.category === 'point').length;
    
    return [
      { id: 'planets', label: 'Planetas', icon: '🪐', count: planetCount, color: 'purple' },
      { id: 'points', label: 'Puntos', icon: '✨', count: pointCount, color: 'pink' },
    ];
  }, [chartItems]);

  // ============================================================================
  // FILTRADO
  // ============================================================================

  const filteredItems = useMemo(() => {
    let filtered = chartItems;

    // Filtrar por tab activo
    if (activeTab === 'planets') {
      filtered = filtered.filter(item => item.category === 'planet');
    } else if (activeTab === 'points') {
      filtered = filtered.filter(item => item.category === 'point');
    }

    // Filtrar por búsqueda
    if (searchResults.length > 0) {
      const searchIds = searchResults.map(r => r.id);
      filtered = filtered.filter(item => searchIds.includes(item.id));
    }

    return filtered;
  }, [chartItems, activeTab, searchResults]);

  // ============================================================================
  // NAVEGACIÓN MODAL
  // ============================================================================

  const selectedItem = useMemo(() => {
    return chartItems.find(item => item.id === selectedItemId);
  }, [chartItems, selectedItemId]);

  const navigation = useMemo(() => {
    if (!selectedItemId) return undefined;
    
    const currentIndex = chartItems.findIndex(item => item.id === selectedItemId);
    const prev = currentIndex > 0 ? chartItems[currentIndex - 1] : undefined;
    const next = currentIndex < chartItems.length - 1 ? chartItems[currentIndex + 1] : undefined;

    return {
      prev: prev ? { id: prev.id, title: prev.title, icon: prev.icon } : undefined,
      next: next ? { id: next.id, title: next.title, icon: next.icon } : undefined,
    };
  }, [chartItems, selectedItemId]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleSearch = useCallback((results: SearchableItem[]) => {
    setSearchResults(results);
  }, []);

  const handleCardClick = useCallback((itemId: string) => {
    setSelectedItemId(itemId);
  }, []);

  const handleModalClose = useCallback(() => {
    setSelectedItemId(null);
  }, []);

  const handleModalNavigate = useCallback((itemId: string) => {
    setSelectedItemId(itemId);
  }, []);

  // ============================================================================
  // RENDER
  // ============================================================================

  // Convertir items a formato de búsqueda
  const searchableItems: SearchableItem[] = useMemo(() => {
    return chartItems.map(item => ({
      id: item.id,
      title: item.title,
      subtitle: item.subtitle,
      keywords: item.keywords,
      category: item.category,
    }));
  }, [chartItems]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/ejercicios')}
            className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 flex items-center gap-2 text-sm font-medium mb-4"
          >
            ← Volver a Plan de Ejercicios
          </button>
          
          <h1 className="text-3xl md:text-4xl font-bold text-purple-900 dark:text-white mb-2 text-center">
            Tu Carta Natal Analizada
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
            Análisis profundo personalizado
          </p>

          {/* Búsqueda */}
          <ChartSearchBar
            items={searchableItems}
            onSearch={handleSearch}
          />
        </div>

        {/* Tabs */}
        <ChartTabsNavigation
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {/* Grid de Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-20 md:mb-0">
          {filteredItems.map((item) => (
            <ChartAnalysisCard
              key={item.id}
              id={item.id}
              icon={item.icon}
              title={item.title}
              subtitle={item.subtitle}
              dignityBadge={item.dignity}
              preview={item.preview}
              category={item.category}
              onClick={() => handleCardClick(item.id)}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No se encontraron resultados
            </p>
          </div>
        )}

        {/* Modal */}
        {selectedItem && (
          <ChartAnalysisModal
            isOpen={!!selectedItemId}
            onClose={handleModalClose}
            title={selectedItem.title}
            icon={selectedItem.icon}
            subtitle={selectedItem.subtitle}
            content={selectedItem.content}
            sidebarSections={selectedItem.sidebarSections}
            navigation={navigation}
            onNavigate={handleModalNavigate}
          />
        )}
      </div>
    </div>
  );
}
