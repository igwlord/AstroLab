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
import type { SearchableItem } from '../components/ChartSearchBar';
import type { ChartTab } from '../components/ChartTabsNavigation';

// Helper functions
import {
  getMoonStressExplanation,
  getMercuryManifestationBySign,
  getMercuryRetrogradeImpact,
  getNodeNorthExplanation,
  getNodeSouthPatterns,
  getNodeSouthTrap,
  getNodesIntegration,
  getChironWoundBySign,
  getChironGift,
  getChironHealingPath,
  getLilithRepressionBySign,
  getLilithPowerExpression,
  getLilithRepressionSigns,
  getLilithIntegrationWork,
  getVenusRelationshipStyle,
  getMarsActionStyle,
  getJupiterManifestationBySign,
  getSaturnManifestationBySign,
  getUranusManifestationBySign,
  getNeptuneManifestationBySign,
  getPlutoManifestationBySign
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
  content: ReactElement;
  sidebarSections: Array<{ id: string; label: string }>;
  keywords: string[];
}

export default function ExerciseChartPage() {
  const navigate = useNavigate();
  const { currentPlan: plan } = useExercisePlanStore();
  
  // ALL HOOKS MUST BE BEFORE ANY CONDITIONAL RETURNS
  const [activeTab, setActiveTab] = useState<'all' | 'planet' | 'point'>('all');
  const [selectedItem, setSelectedItem] = useState<ChartItem | null>(null);
  
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
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-3">
                💝 Necesidades Emocionales
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Con Luna en {translateSign(moon.sign)}, buscas seguridad y estabilidad emocional.
                Para sentirte en paz, necesitas ambientes predecibles y relaciones de confianza.
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
                    {stressInfo.factors.map((factor: string, i: number) => (
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
          ...(mercury.retrograde ? [{ id: 'retrogrado', label: '⏪ Retrógrado' }] : [])
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
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-3">
                🎯 Propósito de Vida (Nodo Norte en {translateSign(north.sign)})
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {northExplanation}
              </p>
            </div>

            <div id="nodo-sur" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-3">
                🔄 Patrón Kármico (Nodo Sur en {translateSign(south.sign)})
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                {southTrap}
              </p>
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">
                  Patrones a integrar:
                </h4>
                <ul className="list-disc list-inside space-y-1 text-orange-700 dark:text-orange-300 text-sm">
                  {southPatterns.map((pattern: string, i: number) => (
                    <li key={i}>{pattern}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div id="integracion" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-3">
                ⚖️ Camino de Integración
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {integration}
              </p>
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
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-3">
                🩹 La Herida (Quirón en {translateSign(chiron.sign)})
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {wound}
              </p>
            </div>

            <div id="don" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-3">
                ✨ El Don del Sanador
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {gift}
              </p>
            </div>

            <div id="sanacion" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-3">
                🌱 Camino de Sanación
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {healing}
              </p>
            </div>
          </div>
        )
      });
    }

    // 5. LILITH
    if (chartAnalysis.lilith) {
      const lilith = chartAnalysis.lilith;
      const repression = getLilithRepressionBySign(lilith.sign);
      const power = getLilithPowerExpression(lilith.sign);
      const signs = getLilithRepressionSigns();
      const integration = getLilithIntegrationWork(lilith.sign, lilith.house);
      
      items.push({
        id: 'lilith',
        icon: '⚸',
        title: `Lilith en ${translateSign(lilith.sign)}`,
        subtitle: `Casa ${lilith.house}`,
        category: 'point',
        preview: repression,
        keywords: ['lilith', 'sombra', 'poder', translateSign(lilith.sign).toLowerCase()],
        sidebarSections: [
          { id: 'represion', label: '🌑 Poder Reprimido' },
          { id: 'senales', label: '🚨 Señales' },
          { id: 'liberacion', label: '🔥 Liberación' }
        ],
        content: (
          <div className="space-y-6">
            <div id="represion" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-3">
                🌑 El Poder Reprimido (Lilith en {translateSign(lilith.sign)})
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                {repression}
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {power}
              </p>
            </div>

            <div id="senales" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-3">
                🚨 Señales de Represión
              </h3>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                <ol className="list-decimal list-inside space-y-2 text-purple-700 dark:text-purple-300 text-sm">
                  {signs.map((sign: string, i: number) => (
                    <li key={i}>{sign}</li>
                  ))}
                </ol>
              </div>
            </div>

            <div id="liberacion" className="scroll-mt-20">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-3">
                🔥 Camino de Liberación
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {integration}
              </p>
            </div>
          </div>
        )
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
          { id: 'amor', label: '❤️ Estilo de Amor' }
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
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-3">
                ❤️ Estilo de Amor
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {relationshipStyle}
              </p>
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
          { id: 'accion', label: '🎯 Estilo de Acción' }
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
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-3">
                🎯 Estilo de Acción
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {actionStyle}
              </p>
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
          { id: 'expansion', label: '🌟 Expansión' }
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
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-3">
                🌟 Expansión y Abundancia
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {jupiterManifestation}
              </p>
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
          { id: 'limites', label: '🏔️ Límites y Disciplina' }
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
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-3">
                🏔️ Límites y Disciplina
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {saturnManifestation}
              </p>
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
          { id: 'revolucion', label: '🔥 Revolución e Innovación' }
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
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-3">
                🔥 Revolución e Innovación
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {uranusManifestation}
              </p>
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
          { id: 'espiritualidad', label: '🙏 Espiritualidad' }
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
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-3">
                🙏 Espiritualidad y Disolución
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {neptuneManifestation}
              </p>
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
          { id: 'transformacion', label: '🔮 Transformación' }
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
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-3">
                🔮 Transformación y Poder
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {plutoManifestation}
              </p>
            </div>
          </div>
        )
      });
    }

    return items;
  }, [plan]);

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
