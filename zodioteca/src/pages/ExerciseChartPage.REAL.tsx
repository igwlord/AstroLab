/**
 * EXERCISE CHART PAGE - Full Implementation with Real Data
 * 
 * Versión completa integrada con chartAnalysis backend
 * Simplificada para 5 elementos esenciales disponibles
 * 
 * Status: PRODUCTION READY
 */

import { useState, useMemo, useCallback, useEffect } from 'react';
import type { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useExercisePlanStore } from '../store/useExercisePlanStore';
import ChartAnalysisCard from '../components/ChartAnalysisCard';
import ChartSearchBar from '../components/ChartSearchBar';
import ChartTabsNavigation from '../components/ChartTabsNavigation';
import ChartAnalysisModal from '../components/ChartAnalysisModal';
import ChartItemModal from '../components/ChartItemModal';
import AxisAnalysisCard from '../components/AxisAnalysisCard';
import AxisAnalysisModal from '../components/AxisAnalysisModal';
import type { SearchableItem } from '../components/ChartSearchBar';
import type { ChartTab } from '../components/ChartTabsNavigation';
import type { AxisAnalysis } from '../services/exercises/chartAnalyzer';
import { buildLilithSections } from '../utils/modalSectionBuilder';

// Helper functions
import {
  getMoonStressExplanation,
  getMercuryManifestationBySign,
  getMercuryRetrogradeImpact,
  getMercuryConflictStyle,
  getMercuryWritingStyle,
  getMercuryCommonMistakes,
  getNodeNorthExplanation,
  getNodeSouthPatterns,
  getNodeSouthTrap,
  getNodesIntegration,
  getChironWoundBySign,
  getChironGift,
  getChironHealingPath,
  getLilithRepressionBySign,
  getLilithPowerExpression,
  getVenusRelationshipStyle,
  getVenusRedFlags,
  getVenusLoveLanguage,
  getVenusIdealPartner,
  getMarsActionStyle,
  getMarsAngerStyle,
  getMarsSexualStyle,
  getMarsEnergizingActivities,
  getJupiterManifestationBySign,
  getJupiterLuckAreas,
  getJupiterExcessWarnings,
  getSaturnManifestationBySign,
  getSaturnLifeLessons,
  getSaturnFears,
  getUranusManifestationBySign,
  getUranusBreakthroughAreas,
  getNeptuneManifestationBySign,
  getNeptuneSpiritualGifts,
  getNeptuneIllusionRisks,
  getPlutoManifestationBySign,
  getPlutoPowerAreas
} from '../utils/interpretationHelpers';

// Translation helpers
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
  category: 'planet' | 'point';
  dignityBadge?: {
    type: 'domicile' | 'exaltation' | 'detriment' | 'fall' | 'neutral';
    label: string;
    color: string;
  };
  preview: string;
  isNew?: boolean;
  isImportant?: boolean;
  content?: ReactElement; // Ahora opcional si usamos modalData
  sidebarSections?: Array<{ id: string; label: string }>; // Ahora opcional
  keywords: string[];
  // Nuevo sistema de modal
  modalData?: {
    sign: string;
    house: number;
    repression: string;
    power: string;
  };
}

export default function ExerciseChartPage() {
  const navigate = useNavigate();
  const { currentPlan: plan } = useExercisePlanStore();
  
  // ALL HOOKS MUST BE BEFORE ANY CONDITIONAL RETURNS
  const [activeTab, setActiveTab] = useState<'all' | 'planet' | 'point' | 'axis'>('all');
  const [selectedItem, setSelectedItem] = useState<ChartItem | null>(null);
  const [selectedAxis, setSelectedAxis] = useState<AxisAnalysis | null>(null);
  
  // Build chart items - ONLY if plan exists, otherwise return empty array
  const chartItems: ChartItem[] = useMemo(() => {
    if (!plan) return [];
    
    const chartAnalysis = plan.chartAnalysis;
    console.log('🔍 [ExerciseChartPage] chartAnalysis completo:', chartAnalysis);
    console.log('🔍 [ExerciseChartPage] nodes:', chartAnalysis.nodes);
    console.log('🔍 [ExerciseChartPage] chiron:', chartAnalysis.chiron);
    console.log('🔍 [ExerciseChartPage] lilith:', chartAnalysis.lilith);
    const items: ChartItem[] = [];

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

    // 1. LUNA
    if (chartAnalysis.moon) {
      const moon = chartAnalysis.moon;
      const stressInfo = moon.aspects 
        ? getMoonStressExplanation(moon.aspects)
        : { level: 'bajo' as const, explanation: 'Luna en configuración estable.', factors: [] };
      
      items.push({
        id: 'luna',
        icon: '☽',
        title: `Luna en ${translateSign(moon.sign)}`,
        subtitle: `Casa ${moon.house} • Estrés: ${moon.stressScore}/10`,
        category: 'planet',
        dignityBadge: getDignityBadge('Moon'),
        preview: `Tu Luna en ${translateSign(moon.sign)} busca seguridad emocional. Nivel de estrés: ${stressInfo.level}.`,
        isImportant: moon.stressScore >= 6,
        keywords: ['luna', 'emociones', translateSign(moon.sign).toLowerCase(), `casa ${moon.house}`],
        sidebarSections: [
          { id: 'config', label: '🌙 Configuración' },
          { id: 'necesidades', label: '💝 Necesidades' },
          { id: 'estres', label: '⚠️ Nivel de Estrés' },
          { id: 'aspectos', label: '🔗 Aspectos' }
        ],
        content: (
          <div className="space-y-6">
            <div id="config" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-3">
                🌙 Configuración Lunar
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Tu Luna está en <strong>{translateSign(moon.sign)}</strong> en la <strong>Casa {moon.house}</strong>.
                {moon.dignity?.description && (
                  <span className="block mt-2 text-sm italic text-gray-600 dark:text-gray-400">
                    {moon.dignity.description}
                  </span>
                )}
              </p>
            </div>

            <div id="necesidades" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-4 flex items-center gap-2">
                <span>💝</span>
                <span>Necesidades Emocionales</span>
              </h3>
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 
                             border border-pink-200/50 dark:border-pink-700/30 rounded-xl p-6 
                             hover:shadow-lg transition-all duration-200">
                <div className="flex items-start gap-4">
                  <span className="text-4xl">🫂</span>
                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed flex-1">
                    Con Luna en {translateSign(moon.sign)}, buscas seguridad y estabilidad emocional.
                    Para sentirte en paz, necesitas ambientes predecibles y relaciones de confianza.
                  </p>
                </div>
              </div>
            </div>

            <div id="estres" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-4 flex items-center gap-2">
                <span>⚠️</span>
                <span>Nivel de Estrés: {stressInfo.level} ({moon.stressScore}/10)</span>
              </h3>
              
              {/* Explicación principal */}
              <div className={`bg-gradient-to-br ${
                moon.stressScore >= 7 
                  ? 'from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-200/50 dark:border-red-700/30'
                  : moon.stressScore >= 4
                  ? 'from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-yellow-200/50 dark:border-yellow-700/30'
                  : 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/50 dark:border-green-700/30'
              } border rounded-xl p-6 mb-4 hover:shadow-lg transition-all duration-200`}>
                <div className="flex items-start gap-4">
                  <span className="text-4xl">
                    {moon.stressScore >= 7 ? '😰' : moon.stressScore >= 4 ? '😟' : '😌'}
                  </span>
                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed flex-1">
                    {stressInfo.explanation}
                  </p>
                </div>
              </div>

              {/* Factores de estrés en cards */}
              {stressInfo.factors.length > 0 && (
                <>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                    <span>🔍</span>
                    <span>Factores de estrés:</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {stressInfo.factors.map((factor: string, i: number) => {
                      const factorIcons = ['💥', '⚡', '🌪️', '🔥', '💢', '⚠️'];
                      
                      return (
                        <div 
                          key={i}
                          className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/10 dark:to-red-900/10 
                                     border border-orange-200/50 dark:border-orange-800/30 rounded-lg p-4 
                                     hover:shadow-md transition-all duration-200 group"
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-xl group-hover:scale-110 transition-transform duration-200">
                              {factorIcons[i % factorIcons.length]}
                            </span>
                            <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed flex-1">
                              {factor}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            <div id="aspectos" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-3">
                🔗 Aspectos Lunares
              </h3>
              <div className="grid grid-cols-2 gap-4">
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
            </div>
          </div>
        )
      });
    }

    // 2. MERCURIO
    if (chartAnalysis.mercury) {
      const mercury = chartAnalysis.mercury;
      const manifestation = getMercuryManifestationBySign(mercury.sign);
      const retroText = mercury.retrograde ? getMercuryRetrogradeImpact(true) : null;
      
      items.push({
        id: 'mercurio',
        icon: '☿',
        title: `Mercurio en ${translateSign(mercury.sign)}`,
        subtitle: `Casa ${mercury.house}${mercury.retrograde ? ' • Retrógrado' : ''}`,
        category: 'planet',
        dignityBadge: getDignityBadge('Mercury'),
        preview: manifestation.communication,
        keywords: ['mercurio', 'comunicación', translateSign(mercury.sign).toLowerCase(), `casa ${mercury.house}`],
        sidebarSections: [
          { id: 'comunicacion', label: '💬 Comunicación' },
          { id: 'aprendizaje', label: '📚 Aprendizaje' },
          { id: 'mental', label: '🧠 Procesos Mentales' },
          { id: 'conflictos', label: '⚔️ En Conflictos' },
          { id: 'escritura', label: '✍️ Escritura' },
          { id: 'errores', label: '⚠️ Errores Comunes' },
          ...(mercury.retrograde ? [{ id: 'retrogrado', label: '⏪ Retrógrado' }] : [])
        ],
        content: (
          <div className="space-y-6">
            <div id="comunicacion" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-4 flex items-center gap-2">
                <span>💬</span>
                <span>Estilo de Comunicación</span>
              </h3>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 
                             border border-blue-200/50 dark:border-blue-700/30 rounded-xl p-6 
                             hover:shadow-lg transition-all duration-200">
                <div className="flex items-start gap-4">
                  <span className="text-4xl">🗣️</span>
                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed flex-1">
                    {manifestation.communication}
                  </p>
                </div>
              </div>
            </div>

            <div id="aprendizaje" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-4 flex items-center gap-2">
                <span>📚</span>
                <span>Estilo de Aprendizaje</span>
              </h3>
              <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 
                             border border-green-200/50 dark:border-green-700/30 rounded-xl p-6 
                             hover:shadow-lg transition-all duration-200">
                <div className="flex items-start gap-4">
                  <span className="text-4xl">📖</span>
                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed flex-1">
                    {manifestation.learning}
                  </p>
                </div>
              </div>
            </div>

            <div id="mental" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-4 flex items-center gap-2">
                <span>🧠</span>
                <span>Procesos Mentales</span>
              </h3>
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 
                             border border-purple-200/50 dark:border-purple-700/30 rounded-xl p-6 
                             hover:shadow-lg transition-all duration-200">
                <div className="flex items-start gap-4">
                  <span className="text-4xl">💭</span>
                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed flex-1">
                    {manifestation.mentalProcesses}
                  </p>
                </div>
              </div>
            </div>

            <div id="conflictos" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-4 flex items-center gap-2">
                <span>⚔️</span>
                <span>Tu Comunicación en Conflictos</span>
              </h3>
              <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 
                             border border-red-200/50 dark:border-red-700/30 rounded-xl p-6 
                             hover:shadow-lg transition-all duration-200">
                <div className="flex items-start gap-4">
                  <span className="text-4xl">🔥</span>
                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed flex-1">
                    {getMercuryConflictStyle(mercury.sign)}
                  </p>
                </div>
              </div>
            </div>

            <div id="escritura" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-4 flex items-center gap-2">
                <span>✍️</span>
                <span>Tu Estilo de Escritura</span>
              </h3>
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 
                             border border-amber-200/50 dark:border-amber-700/30 rounded-xl p-6 
                             hover:shadow-lg transition-all duration-200">
                <div className="flex items-start gap-4">
                  <span className="text-4xl">📝</span>
                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed flex-1">
                    {getMercuryWritingStyle(mercury.sign)}
                  </p>
                </div>
              </div>
            </div>

            <div id="errores" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-4 flex items-center gap-2">
                <span>⚠️</span>
                <span>Errores Comunes que Debes Evitar</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getMercuryCommonMistakes(mercury.sign).map((mistake, i) => (
                  <div key={i} 
                       className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 
                                 border border-gray-200/50 dark:border-gray-700/30 rounded-xl p-5 
                                 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">⚡</span>
                      <p className="text-gray-800 dark:text-gray-200 leading-relaxed flex-1 text-sm">
                        {mistake}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {mercury.retrograde && retroText && (
              <div id="retrogrado" className="scroll-mt-20">
                <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-3">
                  ⏪ Mercurio Retrógrado
                </h3>
                <div className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300">
                  {retroText.split('\n\n').map((paragraph: string, i: number) => (
                    <p key={i} className="mb-3">{paragraph}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      });
    }

    // 3. NODOS LUNARES
    if (chartAnalysis.nodes?.north) {
      const north = chartAnalysis.nodes.north;
      const south = chartAnalysis.nodes.south;
      const northExplanation = getNodeNorthExplanation(north.sign);
      const southTrap = getNodeSouthTrap(south.sign);
      const southPatterns = getNodeSouthPatterns(south.sign);
      const integration = getNodesIntegration(chartAnalysis.nodes);
      
      items.push({
        id: 'nodos',
        icon: '☊',
        title: `Nodo Norte en ${translateSign(north.sign)}`,
        subtitle: `Casa ${north.house}`,
        category: 'point',
        preview: northExplanation,
        isNew: true,
        keywords: ['nodo norte', 'propósito', translateSign(north.sign).toLowerCase()],
        sidebarSections: [
          { id: 'proposito', label: '🎯 Propósito' },
          { id: 'nodo-sur', label: '🔄 Patrón Kármico' },
          { id: 'integracion', label: '⚖️ Integración' }
        ],
        content: (
          <div className="space-y-6">
            <div id="proposito" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-4 flex items-center gap-2">
                <span>🎯</span>
                <span>Propósito de Vida (Nodo Norte en {translateSign(north.sign)})</span>
              </h3>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 
                             border border-blue-200/50 dark:border-blue-700/30 rounded-xl p-6 
                             hover:shadow-lg transition-all duration-200">
                <div className="flex items-start gap-4">
                  <span className="text-4xl">✨</span>
                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed flex-1">
                    {northExplanation}
                  </p>
                </div>
              </div>
            </div>

            <div id="nodo-sur" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-4 flex items-center gap-2">
                <span>🔄</span>
                <span>Patrón Kármico (Nodo Sur en {translateSign(south.sign)})</span>
              </h3>
              
              {/* Explicación principal */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 
                             border border-orange-200/50 dark:border-orange-700/30 rounded-xl p-5 mb-4">
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                  {southTrap}
                </p>
              </div>

              {/* Patrones en grid */}
              <h4 className="font-semibold text-orange-900 dark:text-orange-200 mb-3 flex items-center gap-2">
                <span>⚠️</span>
                <span>Patrones a integrar:</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {southPatterns.map((pattern: string, i: number) => {
                  const icons = ['🔁', '⏪', '🎭', '🔒', '🌀', '⛓️'];
                  
                  return (
                    <div 
                      key={i}
                      className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/10 dark:to-yellow-900/10 
                                 border border-amber-200/50 dark:border-amber-800/30 rounded-lg p-4 
                                 hover:shadow-md transition-all duration-200 group"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-xl group-hover:scale-110 transition-transform duration-200">
                          {icons[i % icons.length]}
                        </span>
                        <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed flex-1">
                          {pattern}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div id="integracion" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-4 flex items-center gap-2">
                <span>⚖️</span>
                <span>Camino de Integración</span>
              </h3>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 
                             border border-purple-200/50 dark:border-purple-700/30 rounded-xl p-6 
                             hover:shadow-lg transition-all duration-200">
                <div className="flex items-start gap-4">
                  <span className="text-4xl">🌉</span>
                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed flex-1">
                    {integration}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      });
    }

    // 4. QUIRÓN
    if (chartAnalysis.chiron) {
      const chiron = chartAnalysis.chiron;
      const wound = getChironWoundBySign(chiron.sign);
      const gift = getChironGift(chiron.sign, chiron.house);
      const healing = getChironHealingPath(chiron.sign, chiron.house);
      
      items.push({
        id: 'quiron',
        icon: '⚷',
        title: `Quirón en ${translateSign(chiron.sign)}`,
        subtitle: `Casa ${chiron.house}`,
        category: 'point',
        preview: wound,
        keywords: ['quirón', 'herida', 'sanación', translateSign(chiron.sign).toLowerCase()],
        sidebarSections: [
          { id: 'herida', label: '🩹 La Herida' },
          { id: 'don', label: '✨ El Don' },
          { id: 'sanacion', label: '🌱 Sanación' }
        ],
        content: (
          <div className="space-y-6">
            <div id="herida" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-4 flex items-center gap-2">
                <span>🩹</span>
                <span>La Herida (Quirón en {translateSign(chiron.sign)})</span>
              </h3>
              <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 
                             border border-red-200/50 dark:border-red-700/30 rounded-xl p-6 
                             hover:shadow-lg transition-all duration-200">
                <div className="flex items-start gap-4">
                  <span className="text-4xl">💔</span>
                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed flex-1">
                    {wound}
                  </p>
                </div>
              </div>
            </div>

            <div id="don" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-4 flex items-center gap-2">
                <span>✨</span>
                <span>El Don del Sanador</span>
              </h3>
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 
                             border border-emerald-200/50 dark:border-emerald-700/30 rounded-xl p-6 
                             hover:shadow-lg transition-all duration-200">
                <div className="flex items-start gap-4">
                  <span className="text-4xl">🎁</span>
                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed flex-1">
                    {gift}
                  </p>
                </div>
              </div>
            </div>

            <div id="sanacion" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-4 flex items-center gap-2">
                <span>🌱</span>
                <span>Camino de Sanación</span>
              </h3>
              
              {/* Parsear los 5 pasos del texto de healing */}
              <div className="space-y-4">
                {healing.split('\n\n').slice(1, -1).map((step: string, idx: number) => {
                  const match = step.match(/\d+\.\s\*\*(.*?)\*\*:\s*(.*)/);
                  if (!match) return null;
                  
                  const title = match[1];
                  const content = match[2];
                  
                  // Iconos para cada paso de sanación
                  const stepIcons = ['👁️', '⛔', '🤝', '💫', '🌟'];
                  const stepColors = [
                    'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200/50 dark:border-blue-700/30',
                    'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200/50 dark:border-orange-700/30',
                    'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/50 dark:border-green-700/30',
                    'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200/50 dark:border-purple-700/30',
                    'from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-yellow-200/50 dark:border-yellow-700/30'
                  ];
                  
                  return (
                    <div 
                      key={idx}
                      className={`bg-gradient-to-br ${stepColors[idx]} 
                                 border rounded-xl p-5 
                                 hover:shadow-lg transition-all duration-200`}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <span className="text-3xl">{stepIcons[idx]}</span>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                            {idx + 1}. {title}
                          </h4>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {content}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {/* Nota final sobre el proceso cíclico */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 
                               border border-indigo-200/50 dark:border-indigo-700/30 rounded-xl p-5 mt-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">♾️</span>
                    <div>
                      <h4 className="font-bold text-indigo-900 dark:text-indigo-200 mb-2">
                        Proceso Cíclico
                      </h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {healing.split('\n\n').slice(-1)[0]}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      });
    }

    // 5. LILITH (usando nuevo sistema de modal)
    if (chartAnalysis.lilith) {
      const lilith = chartAnalysis.lilith;
      const repression = getLilithRepressionBySign(lilith.sign);
      const power = getLilithPowerExpression(lilith.sign);
      
      items.push({
        id: 'lilith',
        icon: '⚸',
        title: `Lilith en ${translateSign(lilith.sign)}`,
        subtitle: `Casa ${lilith.house}`,
        category: 'point',
        preview: repression,
        keywords: ['lilith', 'sombra', 'poder', translateSign(lilith.sign).toLowerCase()],
        modalData: {
          sign: translateSign(lilith.sign),
          house: lilith.house,
          repression,
          power
        }
      });
    }

    // 6. VENUS
    if (chartAnalysis.venus) {
      const venus = chartAnalysis.venus;
      const relationshipStyle = getVenusRelationshipStyle(venus.sign);
      
      items.push({
        id: 'venus',
        icon: '♀',
        title: `Venus en ${translateSign(venus.sign)}`,
        subtitle: `Casa ${venus.house} • Amor y Valores`,
        category: 'planet',
        dignityBadge: getDignityBadge('Venus'),
        preview: `Tu Venus en ${translateSign(venus.sign)} define tu estilo de amor y valores.`,
        isImportant: false,
        keywords: ['venus', 'amor', 'relaciones', 'valores', translateSign(venus.sign).toLowerCase(), `casa ${venus.house}`],
        sidebarSections: [
          { id: 'config', label: '💝 Configuración' },
          { id: 'amor', label: '❤️ Estilo de Amor' },
          { id: 'redflags', label: '🚩 Red Flags' },
          { id: 'lenguaje', label: '💬 Lenguaje de Amor' },
          { id: 'pareja', label: '✨ Pareja Ideal' }
        ],
        content: (
          <div className="space-y-6">
            <div id="config" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-3">
                💝 Configuración de Venus
              </h3>
              <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-4 space-y-2">
                <p><span className="font-semibold text-purple-700 dark:text-purple-300">Signo:</span> {translateSign(venus.sign)}</p>
                <p><span className="font-semibold text-purple-700 dark:text-purple-300">Casa:</span> {venus.house}</p>
                {venus.dignity && (
                  <p><span className="font-semibold text-purple-700 dark:text-purple-300">Dignidad:</span> {venus.dignity.type === 'domicile' ? 'Domicilio' : venus.dignity.type === 'exaltation' ? 'Exaltación' : venus.dignity.type === 'detriment' ? 'Detrimento' : 'Caída'} - {venus.dignity.strength}/10</p>
                )}
              </div>
            </div>

            <div id="amor" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-4 flex items-center gap-2">
                <span>❤️</span>
                <span>Estilo de Amor</span>
              </h3>
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 
                             border border-pink-200/50 dark:border-pink-700/30 rounded-xl p-6 
                             hover:shadow-lg transition-all duration-200">
                <div className="flex items-start gap-4">
                  <span className="text-4xl">💕</span>
                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed flex-1">
                    {relationshipStyle}
                  </p>
                </div>
              </div>
            </div>

            <div id="redflags" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-4 flex items-center gap-2">
                <span>🚩</span>
                <span>Red Flags de tu Venus</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getVenusRedFlags(venus.sign).map((flag, i) => (
                  <div key={i} 
                       className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 
                                 border border-red-200/50 dark:border-red-700/30 rounded-xl p-5 
                                 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">🚨</span>
                      <p className="text-gray-800 dark:text-gray-200 leading-relaxed flex-1 text-sm">
                        {flag}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div id="lenguaje" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-4 flex items-center gap-2">
                <span>💬</span>
                <span>Tu Lenguaje de Amor</span>
              </h3>
              <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-purple-900/20 dark:to-fuchsia-900/20 
                             border border-purple-200/50 dark:border-purple-700/30 rounded-xl p-6 
                             hover:shadow-lg transition-all duration-200">
                <div className="flex items-start gap-4">
                  <span className="text-4xl">💝</span>
                  <div className="text-gray-800 dark:text-gray-200 leading-relaxed flex-1 prose prose-sm max-w-none">
                    {getVenusLoveLanguage(venus.sign).split('\n\n').map((paragraph: string, i: number) => (
                      <p key={i} className="mb-2 last:mb-0">{paragraph}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div id="pareja" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-4 flex items-center gap-2">
                <span>✨</span>
                <span>Tu Pareja Ideal</span>
              </h3>
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 
                             border border-amber-200/50 dark:border-amber-700/30 rounded-xl p-6 
                             hover:shadow-lg transition-all duration-200">
                <div className="flex items-start gap-4">
                  <span className="text-4xl">🌟</span>
                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed flex-1">
                    {getVenusIdealPartner(venus.sign)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      });
    }

    // 7. MARTE
    if (chartAnalysis.mars) {
      const mars = chartAnalysis.mars;
      const actionStyle = getMarsActionStyle(mars.sign);
      
      items.push({
        id: 'marte',
        icon: '♂',
        title: `Marte en ${translateSign(mars.sign)}`,
        subtitle: `Casa ${mars.house} • Acción y Deseo`,
        category: 'planet',
        dignityBadge: getDignityBadge('Mars'),
        preview: `Tu Marte en ${translateSign(mars.sign)} define cómo actúas y expresas tu energía.`,
        isImportant: false,
        keywords: ['marte', 'acción', 'deseo', 'energía', translateSign(mars.sign).toLowerCase(), `casa ${mars.house}`],
        sidebarSections: [
          { id: 'config', label: '⚔️ Configuración' },
          { id: 'accion', label: '🎯 Estilo de Acción' },
          { id: 'rabia', label: '😤 Expresión de Rabia' },
          { id: 'sexual', label: '🔥 Estilo Sexual' },
          { id: 'energia', label: '⚡ Actividades Energizantes' }
        ],
        content: (
          <div className="space-y-6">
            <div id="config" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-3">
                ⚔️ Configuración de Marte
              </h3>
              <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-4 space-y-2">
                <p><span className="font-semibold text-purple-700 dark:text-purple-300">Signo:</span> {translateSign(mars.sign)}</p>
                <p><span className="font-semibold text-purple-700 dark:text-purple-300">Casa:</span> {mars.house}</p>
                {mars.dignity && (
                  <p><span className="font-semibold text-purple-700 dark:text-purple-300">Dignidad:</span> {mars.dignity.type === 'domicile' ? 'Domicilio' : mars.dignity.type === 'exaltation' ? 'Exaltación' : mars.dignity.type === 'detriment' ? 'Detrimento' : 'Caída'} - {mars.dignity.strength}/10</p>
                )}
              </div>
            </div>

            <div id="accion" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-4 flex items-center gap-2">
                <span>🎯</span>
                <span>Estilo de Acción</span>
              </h3>
              <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 
                             border border-red-200/50 dark:border-red-700/30 rounded-xl p-6 
                             hover:shadow-lg transition-all duration-200">
                <div className="flex items-start gap-4">
                  <span className="text-4xl">⚔️</span>
                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed flex-1">
                    {actionStyle}
                  </p>
                </div>
              </div>
            </div>

            <div id="rabia" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-4 flex items-center gap-2">
                <span>😤</span>
                <span>Cómo Expresas tu Rabia</span>
              </h3>
              <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 
                             border border-orange-200/50 dark:border-orange-700/30 rounded-xl p-6 
                             hover:shadow-lg transition-all duration-200">
                <div className="flex items-start gap-4">
                  <span className="text-4xl">💥</span>
                  <div className="text-gray-800 dark:text-gray-200 leading-relaxed flex-1 prose prose-sm max-w-none">
                    {getMarsAngerStyle(mars.sign).split('\n\n').map((paragraph: string, i: number) => (
                      <p key={i} className="mb-2 last:mb-0">{paragraph}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div id="sexual" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-4 flex items-center gap-2">
                <span>🔥</span>
                <span>Tu Estilo Sexual</span>
              </h3>
              <div className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 
                             border border-rose-200/50 dark:border-rose-700/30 rounded-xl p-6 
                             hover:shadow-lg transition-all duration-200">
                <div className="flex items-start gap-4">
                  <span className="text-4xl">💋</span>
                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed flex-1">
                    {getMarsSexualStyle(mars.sign)}
                  </p>
                </div>
              </div>
            </div>

            <div id="energia" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-4 flex items-center gap-2">
                <span>⚡</span>
                <span>Actividades que te Energizan</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getMarsEnergizingActivities(mars.sign).map((activity, i) => (
                  <div key={i} 
                       className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 
                                 border border-green-200/50 dark:border-green-700/30 rounded-xl p-5 
                                 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">🏃</span>
                      <p className="text-gray-800 dark:text-gray-200 leading-relaxed flex-1 text-sm">
                        {activity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      });
    }

    // 8. JÚPITER
    if (chartAnalysis.jupiter) {
      const jupiter = chartAnalysis.jupiter;
      const jupiterManifestation = getJupiterManifestationBySign(jupiter.sign);
      
      items.push({
        id: 'jupiter',
        icon: '♃',
        title: `Júpiter en ${translateSign(jupiter.sign)}`,
        subtitle: `Casa ${jupiter.house} • Expansión y Abundancia`,
        category: 'planet',
        dignityBadge: getDignityBadge('Jupiter'),
        preview: `Tu Júpiter en ${translateSign(jupiter.sign)} define tu forma de expandirte y crecer.`,
        isImportant: false,
        keywords: ['júpiter', 'jupiter', 'expansión', 'abundancia', 'suerte', translateSign(jupiter.sign).toLowerCase(), `casa ${jupiter.house}`],
        sidebarSections: [
          { id: 'config', label: '🎯 Configuración' },
          { id: 'expansion', label: '🌟 Expansión' },
          { id: 'suerte', label: '🍀 Áreas de Suerte' },
          { id: 'excesos', label: '⚠️ Advertencias de Exceso' }
        ],
        content: (
          <div className="space-y-6">
            <div id="config" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-3">
                🎯 Configuración de Júpiter
              </h3>
              <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-4 space-y-2">
                <p><span className="font-semibold text-purple-700 dark:text-purple-300">Signo:</span> {translateSign(jupiter.sign)}</p>
                <p><span className="font-semibold text-purple-700 dark:text-purple-300">Casa:</span> {jupiter.house}</p>
                {jupiter.dignity && (
                  <p><span className="font-semibold text-purple-700 dark:text-purple-300">Dignidad:</span> {jupiter.dignity.type === 'domicile' ? 'Domicilio' : jupiter.dignity.type === 'exaltation' ? 'Exaltación' : jupiter.dignity.type === 'detriment' ? 'Detrimento' : 'Caída'} - {jupiter.dignity.strength}/10</p>
                )}
              </div>
            </div>

            <div id="expansion" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-4 flex items-center gap-2">
                <span>🌟</span>
                <span>Expansión y Abundancia</span>
              </h3>
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 
                             border border-yellow-200/50 dark:border-yellow-700/30 rounded-xl p-6 
                             hover:shadow-lg transition-all duration-200">
                <div className="flex items-start gap-4">
                  <span className="text-4xl">✨</span>
                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed flex-1">
                    {jupiterManifestation}
                  </p>
                </div>
              </div>
            </div>

            <div id="suerte" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-4 flex items-center gap-2">
                <span>🍀</span>
                <span>Áreas donde Tienes Suerte Natural</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getJupiterLuckAreas(jupiter.sign).map((area, i) => (
                  <div key={i} 
                       className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 
                                 border border-green-200/50 dark:border-green-700/30 rounded-xl p-5 
                                 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">🎯</span>
                      <p className="text-gray-800 dark:text-gray-200 leading-relaxed flex-1 text-sm">
                        {area}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div id="excesos" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-4 flex items-center gap-2">
                <span>⚠️</span>
                <span>Advertencias: Excesos Jupiterianos</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getJupiterExcessWarnings(jupiter.sign).map((warning, i) => (
                  <div key={i} 
                       className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 
                                 border border-orange-200/50 dark:border-orange-700/30 rounded-xl p-5 
                                 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">⚡</span>
                      <p className="text-gray-800 dark:text-gray-200 leading-relaxed flex-1 text-sm">
                        {warning}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      });
    }

    // 9. SATURNO
    if (chartAnalysis.saturn) {
      const saturn = chartAnalysis.saturn;
      const saturnManifestation = getSaturnManifestationBySign(saturn.sign);
      
      items.push({
        id: 'saturno',
        icon: '♄',
        title: `Saturno en ${translateSign(saturn.sign)}`,
        subtitle: `Casa ${saturn.house} • Límites y Maestría`,
        category: 'planet',
        dignityBadge: getDignityBadge('Saturn'),
        preview: `Tu Saturno en ${translateSign(saturn.sign)} define tus límites y estructura.`,
        isImportant: false,
        keywords: ['saturno', 'saturn', 'límites', 'disciplina', 'maestría', translateSign(saturn.sign).toLowerCase(), `casa ${saturn.house}`],
        sidebarSections: [
          { id: 'config', label: '🪐 Configuración' },
          { id: 'limites', label: '🏔️ Límites y Disciplina' },
          { id: 'lecciones', label: '📖 Lecciones de Vida' },
          { id: 'miedos', label: '😨 Miedos a Trabajar' }
        ],
        content: (
          <div className="space-y-6">
            <div id="config" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-3">
                🪐 Configuración de Saturno
              </h3>
              <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-4 space-y-2">
                <p><span className="font-semibold text-purple-700 dark:text-purple-300">Signo:</span> {translateSign(saturn.sign)}</p>
                <p><span className="font-semibold text-purple-700 dark:text-purple-300">Casa:</span> {saturn.house}</p>
                {saturn.dignity && (
                  <p><span className="font-semibold text-purple-700 dark:text-purple-300">Dignidad:</span> {saturn.dignity.type === 'domicile' ? 'Domicilio' : saturn.dignity.type === 'exaltation' ? 'Exaltación' : saturn.dignity.type === 'detriment' ? 'Detrimento' : 'Caída'} - {saturn.dignity.strength}/10</p>
                )}
              </div>
            </div>

            <div id="limites" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-4 flex items-center gap-2">
                <span>🏔️</span>
                <span>Límites y Disciplina</span>
              </h3>
              <div className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 
                             border border-gray-200/50 dark:border-gray-700/30 rounded-xl p-6 
                             hover:shadow-lg transition-all duration-200">
                <div className="flex items-start gap-4">
                  <span className="text-4xl">⛰️</span>
                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed flex-1">
                    {saturnManifestation}
                  </p>
                </div>
              </div>
            </div>

            <div id="lecciones" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-4 flex items-center gap-2">
                <span>📖</span>
                <span>Tu Lección de Madurez</span>
              </h3>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 
                             border border-blue-200/50 dark:border-blue-700/30 rounded-xl p-6 
                             hover:shadow-lg transition-all duration-200">
                <div className="flex items-start gap-4">
                  <span className="text-4xl">🎓</span>
                  <div className="text-gray-800 dark:text-gray-200 leading-relaxed flex-1 prose prose-sm max-w-none">
                    {getSaturnLifeLessons(saturn.sign).split('\n\n').map((paragraph: string, i: number) => (
                      <p key={i} className="mb-2 last:mb-0">{paragraph}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div id="miedos" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-4 flex items-center gap-2">
                <span>😨</span>
                <span>Miedos Saturnianos a Trabajar</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getSaturnFears(saturn.sign).map((fear, i) => (
                  <div key={i} 
                       className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 
                                 border border-purple-200/50 dark:border-purple-700/30 rounded-xl p-5 
                                 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">🌑</span>
                      <p className="text-gray-800 dark:text-gray-200 leading-relaxed flex-1 text-sm">
                        {fear}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      });
    }

    // 10. URANO
    if (chartAnalysis.uranus) {
      const uranus = chartAnalysis.uranus;
      const uranusManifestation = getUranusManifestationBySign(uranus.sign);
      
      items.push({
        id: 'urano',
        icon: '♅',
        title: `Urano en ${translateSign(uranus.sign)}`,
        subtitle: `Casa ${uranus.house} • Revolución e Innovación`,
        category: 'planet',
        dignityBadge: getDignityBadge('Uranus'),
        preview: `Tu Urano en ${translateSign(uranus.sign)} define tu forma de innovar y revolucionar.`,
        isImportant: false,
        keywords: ['urano', 'uranus', 'revolución', 'innovación', 'cambio', translateSign(uranus.sign).toLowerCase(), `casa ${uranus.house}`],
        sidebarSections: [
          { id: 'config', label: '⚡ Configuración' },
          { id: 'revolucion', label: '🔥 Revolución e Innovación' },
          { id: 'ruptura', label: '💥 Áreas de Ruptura' }
        ],
        content: (
          <div className="space-y-6">
            <div id="config" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-3">
                ⚡ Configuración de Urano
              </h3>
              <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-4 space-y-2">
                <p><span className="font-semibold text-purple-700 dark:text-purple-300">Signo:</span> {translateSign(uranus.sign)}</p>
                <p><span className="font-semibold text-purple-700 dark:text-purple-300">Casa:</span> {uranus.house}</p>
                {uranus.dignity && (
                  <p><span className="font-semibold text-purple-700 dark:text-purple-300">Dignidad:</span> {uranus.dignity.type === 'domicile' ? 'Domicilio' : uranus.dignity.type === 'exaltation' ? 'Exaltación' : uranus.dignity.type === 'detriment' ? 'Detrimento' : 'Caída'} - {uranus.dignity.strength}/10</p>
                )}
              </div>
            </div>

            <div id="revolucion" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-4 flex items-center gap-2">
                <span>🔥</span>
                <span>Revolución e Innovación</span>
              </h3>
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 
                             border border-cyan-200/50 dark:border-cyan-700/30 rounded-xl p-6 
                             hover:shadow-lg transition-all duration-200">
                <div className="flex items-start gap-4">
                  <span className="text-4xl">⚡</span>
                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed flex-1">
                    {uranusManifestation}
                  </p>
                </div>
              </div>
            </div>

            <div id="ruptura" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-4 flex items-center gap-2">
                <span>💥</span>
                <span>Áreas de Ruptura y Liberación</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getUranusBreakthroughAreas(uranus.sign).map((area, i) => (
                  <div key={i} 
                       className="bg-gradient-to-br from-electric-50 to-sky-50 dark:from-sky-900/20 dark:to-blue-900/20 
                                 border border-sky-200/50 dark:border-sky-700/30 rounded-xl p-5 
                                 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">🔓</span>
                      <p className="text-gray-800 dark:text-gray-200 leading-relaxed flex-1 text-sm">
                        {area}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      });
    }

    // 11. NEPTUNO
    if (chartAnalysis.neptune) {
      const neptune = chartAnalysis.neptune;
      const neptuneManifestation = getNeptuneManifestationBySign(neptune.sign);
      
      items.push({
        id: 'neptuno',
        icon: '♆',
        title: `Neptuno en ${translateSign(neptune.sign)}`,
        subtitle: `Casa ${neptune.house} • Espiritualidad e Ilusión`,
        category: 'planet',
        dignityBadge: getDignityBadge('Neptune'),
        preview: `Tu Neptuno en ${translateSign(neptune.sign)} define tu conexión espiritual.`,
        isImportant: false,
        keywords: ['neptuno', 'neptune', 'espiritualidad', 'ilusión', 'disolución', translateSign(neptune.sign).toLowerCase(), `casa ${neptune.house}`],
        sidebarSections: [
          { id: 'config', label: '🌊 Configuración' },
          { id: 'espiritualidad', label: '🙏 Espiritualidad' },
          { id: 'dones', label: '✨ Dones Espirituales' },
          { id: 'ilusiones', label: '🌫️ Riesgos de Ilusión' }
        ],
        content: (
          <div className="space-y-6">
            <div id="config" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-3">
                🌊 Configuración de Neptuno
              </h3>
              <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-4 space-y-2">
                <p><span className="font-semibold text-purple-700 dark:text-purple-300">Signo:</span> {translateSign(neptune.sign)}</p>
                <p><span className="font-semibold text-purple-700 dark:text-purple-300">Casa:</span> {neptune.house}</p>
                {neptune.dignity && (
                  <p><span className="font-semibold text-purple-700 dark:text-purple-300">Dignidad:</span> {neptune.dignity.type === 'domicile' ? 'Domicilio' : neptune.dignity.type === 'exaltation' ? 'Exaltación' : neptune.dignity.type === 'detriment' ? 'Detrimento' : 'Caída'} - {neptune.dignity.strength}/10</p>
                )}
              </div>
            </div>

            <div id="espiritualidad" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-4 flex items-center gap-2">
                <span>🙏</span>
                <span>Espiritualidad y Disolución</span>
              </h3>
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 
                             border border-teal-200/50 dark:border-teal-700/30 rounded-xl p-6 
                             hover:shadow-lg transition-all duration-200">
                <div className="flex items-start gap-4">
                  <span className="text-4xl">🌊</span>
                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed flex-1">
                    {neptuneManifestation}
                  </p>
                </div>
              </div>
            </div>

            <div id="dones" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-4 flex items-center gap-2">
                <span>✨</span>
                <span>Tus Dones Espirituales</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getNeptuneSpiritualGifts(neptune.sign).map((gift, i) => (
                  <div key={i} 
                       className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 
                                 border border-purple-200/50 dark:border-purple-700/30 rounded-xl p-5 
                                 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">🌟</span>
                      <p className="text-gray-800 dark:text-gray-200 leading-relaxed flex-1 text-sm">
                        {gift}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div id="ilusiones" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-4 flex items-center gap-2">
                <span>🌫️</span>
                <span>Riesgos de Ilusión a Evitar</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getNeptuneIllusionRisks(neptune.sign).map((risk, i) => (
                  <div key={i} 
                       className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 
                                 border border-gray-200/50 dark:border-gray-700/30 rounded-xl p-5 
                                 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">⚠️</span>
                      <p className="text-gray-800 dark:text-gray-200 leading-relaxed flex-1 text-sm">
                        {risk}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      });
    }

    // 12. PLUTÓN
    if (chartAnalysis.pluto) {
      const pluto = chartAnalysis.pluto;
      const plutoManifestation = getPlutoManifestationBySign(pluto.sign);
      
      items.push({
        id: 'pluton',
        icon: '♇',
        title: `Plutón en ${translateSign(pluto.sign)}`,
        subtitle: `Casa ${pluto.house} • Transformación Profunda`,
        category: 'planet',
        dignityBadge: getDignityBadge('Pluto'),
        preview: `Tu Plutón en ${translateSign(pluto.sign)} define tus transformaciones profundas.`,
        isImportant: false,
        keywords: ['plutón', 'pluto', 'transformación', 'poder', 'muerte', 'renacimiento', translateSign(pluto.sign).toLowerCase(), `casa ${pluto.house}`],
        sidebarSections: [
          { id: 'config', label: '💀 Configuración' },
          { id: 'transformacion', label: '🔮 Transformación' },
          { id: 'poder', label: '⚡ Poder Personal' }
        ],
        content: (
          <div className="space-y-6">
            <div id="config" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-3">
                💀 Configuración de Plutón
              </h3>
              <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-4 space-y-2">
                <p><span className="font-semibold text-purple-700 dark:text-purple-300">Signo:</span> {translateSign(pluto.sign)}</p>
                <p><span className="font-semibold text-purple-700 dark:text-purple-300">Casa:</span> {pluto.house}</p>
                {pluto.dignity && (
                  <p><span className="font-semibold text-purple-700 dark:text-purple-300">Dignidad:</span> {pluto.dignity.type === 'domicile' ? 'Domicilio' : pluto.dignity.type === 'exaltation' ? 'Exaltación' : pluto.dignity.type === 'detriment' ? 'Detrimento' : 'Caída'} - {pluto.dignity.strength}/10</p>
                )}
              </div>
            </div>

            <div id="transformacion" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-4 flex items-center gap-2">
                <span>🔮</span>
                <span>Transformación y Poder</span>
              </h3>
              <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-purple-900/20 dark:to-fuchsia-900/20 
                             border border-purple-200/50 dark:border-purple-700/30 rounded-xl p-6 
                             hover:shadow-lg transition-all duration-200">
                <div className="flex items-start gap-4">
                  <span className="text-4xl">♇</span>
                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed flex-1">
                    {plutoManifestation}
                  </p>
                </div>
              </div>
            </div>

            <div id="poder" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-4 flex items-center gap-2">
                <span>⚡</span>
                <span>Tu Poder Personal</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getPlutoPowerAreas(pluto.sign).map((power, i) => (
                  <div key={i} 
                       className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 
                                 border border-red-200/50 dark:border-red-700/30 rounded-xl p-5 
                                 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">💪</span>
                      <p className="text-gray-800 dark:text-gray-200 leading-relaxed flex-1 text-sm">
                        {power}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      });
    }

    return items;
  }, [plan]);

  // Convert to searchable items
  // Get axes from chartAnalysis
  const axes: AxisAnalysis[] = useMemo(() => {
    if (!plan?.chartAnalysis?.axes) return [];
    return plan.chartAnalysis.axes;
  }, [plan]);

  // Create searchable items including axes
  const searchableItems: SearchableItem[] = useMemo(() => {
    const chartSearchableItems = chartItems.map(item => ({
      id: item.id,
      title: item.title,
      subtitle: item.subtitle,
      keywords: item.keywords,
      category: item.category as 'planet' | 'point' | 'aspect' | 'concentration'
    }));
    
    const axesSearchableItems = axes.map((axis, index) => ({
      id: `axis-${index}`,
      title: axis.theme,
      subtitle: `${axis.planets[0]} - ${axis.planets[1]}`,
      keywords: [axis.theme.toLowerCase(), axis.planets[0].toLowerCase(), axis.planets[1].toLowerCase(), 'eje', 'aspecto'],
      category: 'aspect' as const
    }));
    
    return [...chartSearchableItems, ...axesSearchableItems];
  }, [chartItems, axes]);

  // Filtered items and axes from search
  const [filteredItems, setFilteredItems] = useState<ChartItem[]>(chartItems);
  const [filteredAxes, setFilteredAxes] = useState<AxisAnalysis[]>(axes);

  // Update filtered items when chartItems or axes change
  useEffect(() => {
    setFilteredItems(chartItems);
    setFilteredAxes(axes);
  }, [chartItems, axes]);

  // Handle search results
  const handleSearch = useCallback((results: SearchableItem[]) => {
    const resultIds = new Set(results.map(r => r.id));
    setFilteredItems(chartItems.filter(item => resultIds.has(item.id)));
    setFilteredAxes(axes.filter((_, index) => resultIds.has(`axis-${index}`)));
  }, [chartItems, axes]);

  // Apply tab filter
  const displayedItems = useMemo(() => {
    if (activeTab === 'all') return filteredItems;
    return filteredItems.filter(item => item.category === activeTab);
  }, [filteredItems, activeTab]);
  
  const displayedAxes = useMemo(() => {
    if (activeTab === 'all' || activeTab === 'axis') return filteredAxes;
    return [];
  }, [filteredAxes, activeTab]);

  // Tabs configuration
  const tabs: ChartTab[] = useMemo(() => [
    { id: 'all', label: 'Todos', icon: '✨', count: chartItems.length + axes.length, color: 'purple' },
    { id: 'planet', label: 'Planetas', icon: '🪐', count: chartItems.filter(i => i.category === 'planet').length, color: 'blue' },
    { id: 'point', label: 'Puntos', icon: '⚡', count: chartItems.filter(i => i.category === 'point').length, color: 'pink' },
    { id: 'axis', label: 'Ejes', icon: '⚖️', count: axes.length, color: 'amber' }
  ], [chartItems, axes]);

  // NOW check for plan after all hooks
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
            Ir a Análisis
          </button>
        </div>
      </div>
    );
  }

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
              Análisis personalizado basado en tu configuración astral única
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
            onChange={(tabId) => setActiveTab(tabId as 'all' | 'planet' | 'point' | 'axis')}
          />
        </div>

        {/* Results Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {/* Render regular chart items */}
            {(activeTab === 'all' || activeTab === 'planet' || activeTab === 'point') && displayedItems.map(item => (
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
            
            {/* Render axis cards */}
            {displayedAxes.map((axis, index) => (
              <motion.div
                key={`axis-${index}`}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <AxisAnalysisCard
                  axis={axis}
                  onClick={() => setSelectedAxis(axis)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {displayedItems.length === 0 && displayedAxes.length === 0 && (
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
                setFilteredAxes(axes);
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
            Mostrando {displayedItems.length + displayedAxes.length} de {chartItems.length + axes.length} elementos
          </p>
        </div>
      </div>

      {/* Modal for chart items */}
      {selectedItem && (
        <>
          {/* Nuevo modal para Lilith */}
          {selectedItem.id === 'lilith' && selectedItem.modalData ? (
            <ChartItemModal
              isOpen={!!selectedItem}
              onClose={() => setSelectedItem(null)}
              title={selectedItem.title}
              subtitle={selectedItem.subtitle}
              icon={selectedItem.icon}
              sections={buildLilithSections(
                selectedItem.modalData.sign,
                selectedItem.modalData.house,
                selectedItem.modalData.repression,
                selectedItem.modalData.power
              )}
            />
          ) : (
            /* Modal antiguo para el resto */
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
        </>
      )}
      
      {/* Modal for axes */}
      {selectedAxis && (
        <AxisAnalysisModal
          axis={selectedAxis}
          isOpen={!!selectedAxis}
          onClose={() => setSelectedAxis(null)}
        />
      )}
    </div>
  );
}
