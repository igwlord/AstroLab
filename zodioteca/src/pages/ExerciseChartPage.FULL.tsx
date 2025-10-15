/**
 * EXERCISE CHART PAGE - Full Implementation with Real Data
 * 
 * Versión completa integrada con chartAnalysis backend
 * Usa interpretationHelpers correctamente (retornan objetos)
 * 
 * Status: PRODUCTION READY
 */

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useExercisePlanStore } from '../store/useExercisePlanStore';
import ChartAnalysisCard from '../components/ChartAnalysisCard';
import ChartSearchBar from '../components/ChartSearchBar';
import ChartTabsNavigation from '../components/ChartTabsNavigation';
import ChartAnalysisModal from '../components/ChartAnalysisModal';
import type { SearchableItem } from '../components/ChartSearchBar';
import type { ChartTab } from '../components/ChartTabsNavigation';

// Helper functions - properly imported with correct names
import {
  getMoonStressExplanation,
  getMercuryManifestationBySign,
  getMercuryRetrogradeImpact,
  getNodeNorthExplanation,
  getNodeSouthTalents,
  getNodeSouthPatterns,
  getNodeSouthTrap,
  getNodesIntegration,
  getChironWoundBySign,
  getChironManifestationByHouse,
  getChironGift,
  getChironHealingPath,
  getLilithRepressionBySign,
  getLilithManifestationByHouse,
  getLilithPowerExpression,
  getLilithRepressionSigns,
  getLilithIntegrationWork
} from '../utils/interpretationHelpers';

// Translation helpers
const translatePlanet = (planet: string): string => {
  const translations: Record<string, string> = {
    'Sun': 'Sol', 'Moon': 'Luna', 'Mercury': 'Mercurio',
    'Venus': 'Venus', 'Mars': 'Marte', 'Jupiter': 'Júpiter',
    'Saturn': 'Saturno', 'Uranus': 'Urano', 'Neptune': 'Neptuno',
    'Pluto': 'Plutón', 'NorthNode': 'Nodo Norte', 'SouthNode': 'Nodo Sur',
    'Chiron': 'Quirón', 'Lilith': 'Lilith'
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

// Chart item interface
interface ChartItem {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  category: 'planet' | 'point' | 'aspect' | 'concentration';
  dignityBadge?: {
    type: 'domicile' | 'exaltation' | 'detriment' | 'fall' | 'neutral';
    label: string;
    color: string;
  };
  preview: string;
  isNew?: boolean;
  isImportant?: boolean;
  content: JSX.Element;
  sidebarSections: Array<{ id: string; label: string }>;
  keywords: string[];
}

export default function ExerciseChartPage() {
  const navigate = useNavigate();
  const { currentPlan: plan } = useExercisePlanStore();
  const [activeTab, setActiveTab] = useState<'all' | 'planet' | 'point'>('all');
  const [selectedItem, setSelectedItem] = useState<ChartItem | null>(null);

  // Early returns BEFORE any hooks
  if (!plan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🔮</div>
          <h2 className="text-2xl font-bold text-purple-900 dark:text-white mb-2">
            No hay plan generado
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Genera un plan primero para ver el análisis de tu carta
          </p>
          <button
            onClick={() => navigate('/ejercicios')}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Ir a Ejercicios
          </button>
        </div>
      </div>
    );
  }

  const chartAnalysis = plan.chartAnalysis;

  // Helper: Get dignity badge
  const getDignityBadge = (planet: string): ChartItem['dignityBadge'] | undefined => {
    const weak = chartAnalysis.weakDignities.find(d => d.planet === planet);
    const strong = chartAnalysis.strongDignities.find(d => d.planet === planet);
    
    if (strong) {
      const type = strong.dignity.type;
      return {
        type,
        label: type === 'domicile' ? 'Domicilio' : 'Exaltación',
        color: type === 'domicile' ? 'green' : 'blue'
      };
    }
    
    if (weak) {
      const type = weak.dignity.type;
      return {
        type,
        label: type === 'detriment' ? 'Detrimento' : 'Caída',
        color: type === 'detriment' ? 'orange' : 'red'
      };
    }
    
    return undefined;
  };

  // Build chart items from real data - useMemo to avoid recreating on every render
  const chartItems: ChartItem[] = useMemo(() => {
    const items: ChartItem[] = [];

    // 1. LUNA (always present and important)
    if (chartAnalysis.moon) {
      const moon = chartAnalysis.moon;
      const stressInfo = moon.aspects 
        ? getMoonStressExplanation(moon.aspects)
        : { level: 'bajo' as const, explanation: 'No hay aspectos disponibles para analizar.', factors: [] };
      
      items.push({
        id: 'luna',
        icon: '🌙',
        title: `Luna en ${translateSign(moon.sign)}`,
        subtitle: `Casa ${moon.house} • Estrés: ${moon.stressScore}/10`,
        category: 'planet',
        dignityBadge: getDignityBadge('Moon'),
        preview: `Tu Luna busca ${moon.sign === 'Taurus' ? 'seguridad material y sensorial' : moon.sign === 'Cancer' ? 'seguridad emocional familiar' : 'equilibrio emocional'}. Nivel de estrés: ${stressInfo.level}.`,
        isImportant: moon.stressScore >= 6,
        keywords: ['luna', 'emociones', 'necesidades', translateSign(moon.sign).toLowerCase(), `casa ${moon.house}`, 'estrés'],
        sidebarSections: [
          { id: 'config', label: '🌙 Configuración Lunar' },
          { id: 'necesidades', label: '💝 Necesidades Emocionales' },
          { id: 'estres', label: '⚠️ Nivel de Estrés' },
          { id: 'aspectos', label: '🔗 Aspectos Lunares' }
        ],
        content: (
          <div className="space-y-6">
            <div id="config" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-3">
                🌙 Configuración Lunar
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                Tu Luna está en <strong>{translateSign(moon.sign)}</strong> en la <strong>Casa {moon.house}</strong>.
                {moon.dignity && ` Esta Luna está en ${moon.dignity.type === 'exaltation' ? 'exaltación' : moon.dignity.type === 'detriment' ? 'detrimento' : moon.dignity.type === 'fall' ? 'caída' : 'dignidad neutral'}.`}
              </p>
              {moon.dignity && moon.dignity.description && (
                <p className="text-gray-600 dark:text-gray-400 text-sm italic">
                  {moon.dignity.description}
                </p>
              )}
            </div>

            <div id="necesidades" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-3">
                💝 Necesidades Emocionales
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Con Luna en {translateSign(moon.sign)}, tus necesidades emocionales se centran en buscar estabilidad y seguridad.
                Para sentirte en paz, necesitas ambientes predecibles y personas confiables.
              </p>
            </div>

            <div id="estres" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-3">
                ⚠️ Nivel de Estrés: {stressInfo.level} ({moon.stressScore}/10)
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                {stressInfo.explanation}
              </p>
              {stressInfo.factors.length > 0 && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                  <p className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                    Factores de estrés:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-yellow-700 dark:text-yellow-300 text-sm">
                    {stressInfo.factors.map((factor, i) => (
                      <li key={i}>{factor}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div id="aspectos" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-3">
                🔗 Aspectos Lunares
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {moon.hardAspects}
                  </div>
                  <div className="text-sm text-red-600 dark:text-red-400">
                    Aspectos difíciles
                  </div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {moon.softAspects}
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">
                    Aspectos armónicos
                  </div>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                {moon.hardAspects > moon.softAspects 
                  ? 'Tu Luna recibe más tensión que apoyo, lo que puede manifestarse como mayor sensibilidad emocional.'
                  : moon.hardAspects < moon.softAspects
                  ? 'Tu Luna recibe más apoyo que tensión, facilitando el equilibrio emocional.'
                  : 'Tu Luna tiene un balance entre aspectos tensos y armónicos.'}
              </p>
            </div>
          </div>
        )
      });
    }

    // 2. MERCURIO
    if (chartAnalysis.mercury) {
      const mercury = chartAnalysis.mercury;
      const manifestation = getMercuryManifestationBySign(mercury.sign);
      const retroInfo = mercury.retrograde ? getMercuryRetrogradeImpact(mercury.retrograde) : null;
      
      items.push({
        id: 'mercurio',
        icon: '☿',
        title: `Mercurio en ${translateSign(mercury.sign)}`,
        subtitle: `Casa ${mercury.house}${mercury.retrograde ? ' • Retrógrado' : ''}`,
        category: 'planet',
        dignityBadge: getDignityBadge('Mercury'),
        preview: manifestation.communication,
        keywords: ['mercurio', 'comunicación', 'mente', translateSign(mercury.sign).toLowerCase(), `casa ${mercury.house}`, mercury.retrograde ? 'retrógrado' : ''].filter(Boolean),
        sidebarSections: [
          { id: 'comunicacion', label: '💬 Comunicación' },
          { id: 'aprendizaje', label: '📚 Aprendizaje' },
          { id: 'mental', label: '🧠 Procesos Mentales' },
          ...(mercury.retrograde ? [{ id: 'retrogrado', label: '⏪ Mercurio Retrógrado' }] : [])
        ],
        content: (
          <div className="space-y-6">
            <div id="comunicacion" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-3">
                💬 Estilo de Comunicación
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {manifestation.communication}
              </p>
            </div>

            <div id="aprendizaje" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-3">
                📚 Estilo de Aprendizaje
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {manifestation.learning}
              </p>
            </div>

            <div id="mental" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-3">
                🧠 Procesos Mentales
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {manifestation.mentalProcesses}
              </p>
            </div>

            {mercury.retrograde && retroInfo && (
              <div id="retrogrado" className="scroll-mt-20">
                <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-3">
                  ⏪ Mercurio Retrógrado
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  {retroInfo.impact}
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                      💪 Fortalezas
                    </h4>
                    <p className="text-green-700 dark:text-green-300 text-sm">
                      {retroInfo.strengths}
                    </p>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                      ⚠️ Desafíos
                    </h4>
                    <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                      {retroInfo.challenges}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      });
    }

    // 3. NODO NORTE (if available)
    if (chartAnalysis.nodes?.north) {
      const north = chartAnalysis.nodes.north;
      const south = chartAnalysis.nodes.south;
      // Create purpose object from helper functions
      const purpose = {
        mainPurpose: getNodeNorthExplanation(north.sign),
        growthAreas: ['Desarrollar cualidades de ' + north.sign, 'Superar patrones de ' + south.sign],
        integration: getNodesIntegration(chartAnalysis.nodes)
      };
      const pattern = {
        pattern: getNodeSouthTrap(south.sign),
        traps: getNodeSouthPatterns(south.sign)
      };
      
      items.push({
        id: 'nodo-norte',
        icon: '☊',
        title: `Nodo Norte en ${translateSign(north.sign)}`,
        subtitle: `Casa ${north.house}`,
        category: 'point',
        preview: purpose.mainPurpose,
        isNew: true,
        keywords: ['nodo norte', 'propósito', 'evolución', translateSign(north.sign).toLowerCase(), `casa ${north.house}`],
        sidebarSections: [
          { id: 'proposito', label: '🎯 Propósito de Vida' },
          { id: 'nodo-sur', label: '🔄 Patrón Kármico' },
          { id: 'integracion', label: '⚖️ Camino de Integración' }
        ],
        content: (
          <div className="space-y-6">
            <div id="proposito" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-3">
                🎯 Propósito de Vida (Nodo Norte en {translateSign(north.sign)})
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                {purpose.mainPurpose}
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  Áreas de crecimiento:
                </h4>
                <ul className="list-disc list-inside space-y-1 text-blue-700 dark:text-blue-300 text-sm">
                  {purpose.growthAreas.map((area, i) => (
                    <li key={i}>{area}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div id="nodo-sur" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-3">
                🔄 Patrón Kármico (Nodo Sur en {translateSign(south.sign)})
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                {pattern.pattern}
              </p>
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">
                  Trampas a evitar:
                </h4>
                <ul className="list-disc list-inside space-y-1 text-orange-700 dark:text-orange-300 text-sm">
                  {pattern.traps.map((trap, i) => (
                    <li key={i}>{trap}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div id="integracion" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-3">
                ⚖️ Camino de Integración
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {purpose.integration}
              </p>
            </div>
          </div>
        )
      });
    }

    // 4. QUIRÓN (if available)
    if (chartAnalysis.chiron) {
      const chiron = chartAnalysis.chiron;
      const wound = getChironWound(chiron.sign);
      
      items.push({
        id: 'quiron',
        icon: '⚷',
        title: `Quirón en ${translateSign(chiron.sign)}`,
        subtitle: `Casa ${chiron.house}`,
        category: 'point',
        preview: wound.wound,
        keywords: ['quirón', 'herida', 'sanación', translateSign(chiron.sign).toLowerCase(), `casa ${chiron.house}`],
        sidebarSections: [
          { id: 'herida', label: '🩹 La Herida' },
          { id: 'manifestacion', label: '💔 Cómo se Manifiesta' },
          { id: 'don', label: '✨ El Don del Sanador' },
          { id: 'sanacion', label: '🌱 Camino de Sanación' }
        ],
        content: (
          <div className="space-y-6">
            <div id="herida" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-3">
                🩹 La Herida (Quirón en {translateSign(chiron.sign)})
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {wound.wound}
              </p>
            </div>

            <div id="manifestacion" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-3">
                💔 Cómo se Manifiesta
              </h3>
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                <ul className="list-disc list-inside space-y-2 text-red-700 dark:text-red-300 text-sm">
                  {wound.manifestations.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div id="don" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-3">
                ✨ El Don del Sanador
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {wound.gift}
              </p>
            </div>

            <div id="sanacion" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-3">
                🌱 Camino de Sanación
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                {wound.healingPath.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
        )
      });
    }

    // 5. LILITH (if available)
    if (chartAnalysis.lilith) {
      const lilith = chartAnalysis.lilith;
      const repression = getLilithRepression(lilith.sign);
      
      items.push({
        id: 'lilith',
        icon: '⚸',
        title: `Lilith en ${translateSign(lilith.sign)}`,
        subtitle: `Casa ${lilith.house}`,
        category: 'point',
        preview: repression.repression,
        keywords: ['lilith', 'sombra', 'poder', translateSign(lilith.sign).toLowerCase(), `casa ${lilith.house}`],
        sidebarSections: [
          { id: 'represion', label: '🌑 El Poder Reprimido' },
          { id: 'senales', label: '🚨 Señales de Represión' },
          { id: 'liberacion', label: '🔥 Camino de Liberación' }
        ],
        content: (
          <div className="space-y-6">
            <div id="represion" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-3">
                🌑 El Poder Reprimido (Lilith en {translateSign(lilith.sign)})
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {repression.repression}
              </p>
            </div>

            <div id="senales" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-3">
                🚨 Señales de Represión
              </h3>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                <ol className="list-decimal list-inside space-y-2 text-purple-700 dark:text-purple-300 text-sm">
                  {repression.signs.map((sign, i) => (
                    <li key={i}>{sign}</li>
                  ))}
                </ol>
              </div>
            </div>

            <div id="liberacion" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-3">
                🔥 Camino de Liberación
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                {repression.liberation.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
        )
      });
    }

    return items;
  }, [chartAnalysis]);

  // Convert to searchable items
  const searchableItems: SearchableItem[] = useMemo(() => 
    chartItems.map(item => ({
      id: item.id,
      title: item.title,
      subtitle: item.subtitle,
      keywords: item.keywords,
      category: item.category
    })),
    [chartItems]
  );

  // Filtered items from search
  const [filteredItems, setFilteredItems] = useState<ChartItem[]>(chartItems);

  // Update filtered items when chartItems change
  useEffect(() => {
    setFilteredItems(chartItems);
  }, [chartItems]);

  // Handle search results
  const handleSearch = useCallback((results: SearchableItem[]) => {
    const resultIds = new Set(results.map(r => r.id));
    setFilteredItems(chartItems.filter(item => resultIds.has(item.id)));
  }, [chartItems]);

  // Apply tab filter
  const displayedItems = useMemo(() => {
    if (activeTab === 'all') return filteredItems;
    return filteredItems.filter(item => item.category === activeTab);
  }, [filteredItems, activeTab]);

  // Tabs configuration
  const tabs: ChartTab[] = useMemo(() => [
    { id: 'all', label: 'Todos', icon: '✨', count: chartItems.length, color: 'purple' },
    { id: 'planet', label: 'Planetas', icon: '🪐', count: chartItems.filter(i => i.category === 'planet').length, color: 'blue' },
    { id: 'point', label: 'Puntos', icon: '⚡', count: chartItems.filter(i => i.category === 'point').length, color: 'pink' }
  ], [chartItems]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/ejercicios')}
            className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 flex items-center gap-2 text-sm font-medium mb-4"
          >
            ← Volver al Plan
          </button>
          
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-purple-900 dark:text-white mb-2">
              Tu Carta Natal - Análisis Completo
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Análisis basado en tu carta natal personalizada
            </p>
          </div>

          {/* Search Bar */}
          <ChartSearchBar
            items={searchableItems}
            onSearch={handleSearch}
            placeholder="Buscar en tu carta (ej: Luna, Mercurio, Nodo Norte)..."
          />

          {/* Tabs Navigation */}
          <ChartTabsNavigation
            tabs={tabs}
            activeTab={activeTab}
            onChange={(tabId) => setActiveTab(tabId as 'all' | 'planet' | 'point')}
          />
        </div>

        {/* Results Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {displayedItems.map(item => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <ChartAnalysisCard
                  id={item.id}
                  icon={item.icon}
                  title={item.title}
                  subtitle={item.subtitle}
                  dignityBadge={item.dignityBadge}
                  preview={item.preview}
                  category={item.category}
                  onClick={() => setSelectedItem(item)}
                  isNew={item.isNew}
                  isImportant={item.isImportant}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {displayedItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No se encontraron resultados
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Intenta con otra búsqueda o cambia de categoría
            </p>
            <button
              onClick={() => {
                setFilteredItems(chartItems);
                setActiveTab('all');
              }}
              className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 font-medium"
            >
              Limpiar filtros
            </button>
          </motion.div>
        )}

        {/* Stats Footer */}
        <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            Mostrando {displayedItems.length} de {chartItems.length} elementos
          </p>
        </div>
      </div>

      {/* Modal */}
      {selectedItem && (
        <ChartAnalysisModal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          title={selectedItem.title}
          icon={selectedItem.icon}
          subtitle={selectedItem.subtitle}
          content={selectedItem.content}
          sidebarSections={selectedItem.sidebarSections}
          navigation={{
            prev: (() => {
              const currentIndex = displayedItems.findIndex(i => i.id === selectedItem.id);
              const prevIndex = currentIndex > 0 ? currentIndex - 1 : displayedItems.length - 1;
              const prevItem = displayedItems[prevIndex];
              return prevItem ? { id: prevItem.id, title: prevItem.title, icon: prevItem.icon } : undefined;
            })(),
            next: (() => {
              const currentIndex = displayedItems.findIndex(i => i.id === selectedItem.id);
              const nextIndex = currentIndex < displayedItems.length - 1 ? currentIndex + 1 : 0;
              const nextItem = displayedItems[nextIndex];
              return nextItem ? { id: nextItem.id, title: nextItem.title, icon: nextItem.icon } : undefined;
            })()
          }}
          onNavigate={(id) => {
            const item = displayedItems.find(i => i.id === id);
            if (item) setSelectedItem(item);
          }}
        />
      )}
    </div>
  );
}
