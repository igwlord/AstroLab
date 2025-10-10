import React, { useState } from 'react';
import type { HouseSystemGlossary } from '../types/houseSystem';
import StandardModal from './StandardModal';

interface HouseSystemModalProps {
  system: HouseSystemGlossary | null;
  isOpen: boolean;
  onClose: () => void;
}

const HouseSystemModal: React.FC<HouseSystemModalProps> = ({ system, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'astronomy' | 'philosophy' | 'technical'>('overview');

  if (!isOpen || !system) return null;

  const getTypeStyles = (type: string) => {
    const styles = {
      temporal: {
        gradient: 'from-blue-600 via-indigo-600 to-violet-600',
        bg: 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
        badge: 'bg-blue-500/20 text-blue-700 dark:text-blue-300',
        icon: '⏰',
        border: 'border-blue-300 dark:border-blue-700'
      },
      espacial: {
        gradient: 'from-green-600 via-emerald-600 to-teal-600',
        bg: 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
        badge: 'bg-green-500/20 text-green-700 dark:text-green-300',
        icon: '📐',
        border: 'border-green-300 dark:border-green-700'
      },
      zodiacal: {
        gradient: 'from-orange-600 via-amber-600 to-yellow-600',
        bg: 'bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20',
        badge: 'bg-orange-500/20 text-orange-700 dark:text-orange-300',
        icon: '♈',
        border: 'border-orange-300 dark:border-orange-700'
      }
    };

    return styles[type as keyof typeof styles] || styles.temporal;
  };

  const getEraBadge = (era: string) => {
    const badges = {
      antiguo: { icon: '🏺', label: 'Antiguo', color: 'bg-amber-500/20 text-amber-700 dark:text-amber-300' },
      medieval: { icon: '⚔️', label: 'Medieval', color: 'bg-slate-500/20 text-slate-700 dark:text-slate-300' },
      renacentista: { icon: '🎨', label: 'Renacentista', color: 'bg-purple-500/20 text-purple-700 dark:text-purple-300' },
      moderno: { icon: '🚀', label: 'Moderno', color: 'bg-blue-500/20 text-blue-700 dark:text-blue-300' }
    };
    return badges[era as keyof typeof badges] || badges.antiguo;
  };

  const typeStyle = getTypeStyles(system.type);
  const eraBadge = getEraBadge(system.era);
  const typeName = system.type === 'temporal' ? 'Temporal' : system.type === 'espacial' ? 'Espacial' : 'Zodiacal';

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: '📋' },
    { id: 'astronomy', label: 'Astronomía', icon: '🔭' },
    { id: 'philosophy', label: 'Filosofía', icon: '💭' },
    { id: 'technical', label: 'Técnico', icon: '⚙️' }
  ];

  return (
    <StandardModal
      isOpen={isOpen}
      onClose={onClose}
      title={system.name}
      subtitle={system.subtitle}
      icon={system.symbol}
      gradientColors={typeStyle.gradient}
    >
      <div className={`${typeStyle.bg} modal-content`}>
        {/* Header visual del sistema */}
        <div className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${typeStyle.gradient} p-6 sm:p-8 text-white shadow-2xl`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="text-6xl sm:text-8xl font-black opacity-90">
                {system.symbol}
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold">{system.name}</div>
                <div className="text-base sm:text-xl opacity-90">{system.subtitle}</div>
              </div>
            </div>
            <div className="text-4xl sm:text-6xl opacity-40">
              {typeStyle.icon}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-xs sm:text-sm font-medium">
              {typeStyle.icon} {typeName}
            </span>
            <span className={`px-3 py-1 backdrop-blur rounded-full text-xs sm:text-sm font-medium ${eraBadge.color}`}>
              {eraBadge.icon} {eraBadge.label}
            </span>
            <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-xs sm:text-sm font-medium">
              {system.century}
            </span>
          </div>
          <div className="mt-3 text-sm sm:text-base opacity-90 font-semibold">
            👤 {system.author}
          </div>
        </div>

        {/* Tabs de navegación */}
        <div className="flex gap-1 sm:gap-2 overflow-x-auto pb-2 -mx-2 px-2 hide-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'overview' | 'astronomy' | 'philosophy' | 'technical')}
              className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? `bg-gradient-to-r ${typeStyle.gradient} text-white shadow-lg scale-105`
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <span className="mr-1.5">{tab.icon}</span>
              <span className="hidden xs:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Contenido según tab activo */}
        {activeTab === 'overview' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Origen histórico */}
            <section>
              <h3 className="modal-h3 text-purple-900 dark:text-purple-100 flex items-center gap-2">
                <span className="modal-icon-md">📜</span>
                Origen Histórico
              </h3>
              <p className="modal-text text-gray-700 dark:text-gray-300 text-base sm:text-lg leading-relaxed">
                {system.origin}
              </p>
            </section>

            {/* Características principales */}
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              <div className={`modal-card border-l-4 ${typeStyle.border}`}>
                <h4 className="modal-h4 flex items-center gap-2">
                  <span>📊</span> Tipo de División
                </h4>
                <p className="modal-text">
                  <strong className={typeStyle.badge.split(' ')[1]}>{typeName}</strong>
                  <br/>
                  {system.type === 'temporal' && 'Basado en el tiempo de ascensión de los grados zodiacales'}
                  {system.type === 'espacial' && 'Basado en la división geométrica del espacio celeste'}
                  {system.type === 'zodiacal' && 'Cada signo zodiacal completo representa una casa'}
                </p>
              </div>

              <div className={`modal-card border-l-4 ${typeStyle.border}`}>
                <h4 className="modal-h4 flex items-center gap-2">
                  <span>🌍</span> Rango de Latitud
                </h4>
                <p className="modal-text">
                  <strong>{system.latitudeRange}</strong>
                  <br/>
                  <span className="text-xs sm:text-sm opacity-75">
                    Indica las latitudes geográficas donde el sistema funciona óptimamente
                  </span>
                </p>
              </div>
            </div>

            {/* Usos recomendados */}
            <section className={`modal-section ${typeStyle.bg} border-2 ${typeStyle.border}`}>
              <h4 className="modal-h4 flex items-center gap-2">
                <span>🎯</span> Usos Recomendados
              </h4>
              <ul className="space-y-2 modal-text">
                {system.recommendedFor.map((use, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-lg">✓</span>
                    <span>{use}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}

        {activeTab === 'astronomy' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Base astronómica */}
            <section>
              <h3 className="modal-h3 text-purple-900 dark:text-purple-100 flex items-center gap-2">
                <span className="modal-icon-md">🔭</span>
                Base Astronómica
              </h3>
              <p className="modal-text text-gray-700 dark:text-gray-300 text-base sm:text-lg leading-relaxed whitespace-pre-line">
                {system.astronomicalBasis}
              </p>
            </section>

            {/* Visualización conceptual */}
            <div className={`modal-section ${typeStyle.bg} border-2 ${typeStyle.border}`}>
              <h4 className="modal-h4 flex items-center gap-2">
                <span>🌐</span> Método de Cálculo
              </h4>
              <div className="space-y-3 modal-text">
                <p>
                  <strong>Tipo:</strong> Sistema {typeName}
                </p>
                {system.type === 'temporal' && (
                  <p className="text-sm">
                    Los sistemas temporales miden el <strong>tiempo</strong> que tarda cada punto del zodíaco 
                    en ascender desde el horizonte hasta el meridiano. Esto significa que las casas tienen 
                    tamaños desiguales, reflejando el movimiento real de la Tierra.
                  </p>
                )}
                {system.type === 'espacial' && (
                  <p className="text-sm">
                    Los sistemas espaciales dividen el <strong>espacio</strong> ecuatorial o eclíptico en 
                    secciones iguales o proporcionales, sin considerar el factor temporal. Esto resulta 
                    en una geometría más simétrica pero menos dinámica.
                  </p>
                )}
                {system.type === 'zodiacal' && (
                  <p className="text-sm">
                    Los sistemas zodiacales alinean cada <strong>casa</strong> con un <strong>signo completo</strong> 
                    de 30°. Esto crea una correspondencia directa entre las energías zodiacales y las áreas 
                    de vida, simplificando enormemente los cálculos.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'philosophy' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Enfoque filosófico */}
            <section>
              <h3 className="modal-h3 text-purple-900 dark:text-purple-100 flex items-center gap-2">
                <span className="modal-icon-md">💭</span>
                Enfoque Filosófico e Interpretativo
              </h3>
              <p className="modal-text text-gray-700 dark:text-gray-300 text-base sm:text-lg leading-relaxed whitespace-pre-line">
                {system.philosophicalApproach}
              </p>
            </section>

            {/* Contexto cultural */}
            <section className={`modal-section ${typeStyle.bg} border-2 ${typeStyle.border}`}>
              <h4 className="modal-h4 flex items-center gap-2">
                <span>{eraBadge.icon}</span> Contexto Cultural: {eraBadge.label}
              </h4>
              <p className="modal-text text-sm">
                {system.era === 'antiguo' && (
                  <>
                    En la antigüedad, la astrología era inseparable de la filosofía natural, la religión y la 
                    medicina. Los sistemas de casas reflejaban una cosmovisión donde el cielo y la tierra 
                    estaban profundamente conectados, y cada posición celeste tenía significado divino.
                  </>
                )}
                {system.era === 'medieval' && (
                  <>
                    Durante la Edad Media, la astrología se integró con la escolástica cristiana y la filosofía 
                    aristotélica. Los sistemas de casas buscaban precisión matemática para predecir eventos 
                    mundanos, horarios y médicos, combinando rigor científico con simbolismo sagrado.
                  </>
                )}
                {system.era === 'renacentista' && (
                  <>
                    El Renacimiento revivió el interés por textos clásicos y buscó armonizar la astrología 
                    con el humanismo, el neoplatonismo y las nuevas ciencias. Los sistemas de casas 
                    reflejaban una búsqueda de belleza geométrica y correspondencia entre microcosmos y macrocosmos.
                  </>
                )}
                {system.era === 'moderno' && (
                  <>
                    En la era moderna, la astrología se ha transformado en una herramienta psicológica y de 
                    autoconocimiento. Los sistemas de casas modernos priorizan la precisión empírica, la 
                    compatibilidad con software y la resonancia con experiencias biográficas individuales.
                  </>
                )}
              </p>
            </section>
          </div>
        )}

        {activeTab === 'technical' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Ventajas técnicas */}
            <section className={`modal-section ${typeStyle.bg} border-l-4 ${typeStyle.border}`}>
              <h4 className="modal-h4 flex items-center gap-2">
                <span>✅</span> Ventajas Técnicas
              </h4>
              <ul className="space-y-2 modal-text">
                {system.technicalAdvantages.map((advantage, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 text-lg">✓</span>
                    <span>{advantage}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Desventajas técnicas */}
            <section className={`modal-section bg-red-50/50 dark:bg-red-900/10 border-l-4 border-red-300 dark:border-red-700`}>
              <h4 className="modal-h4 flex items-center gap-2">
                <span>⚠️</span> Limitaciones Técnicas
              </h4>
              <ul className="space-y-2 modal-text">
                {system.technicalDisadvantages.map((disadvantage, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-red-600 dark:text-red-400 text-lg">✗</span>
                    <span>{disadvantage}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Recomendaciones prácticas */}
            <section className="modal-section bg-blue-50/50 dark:bg-blue-900/10 border-2 border-blue-300 dark:border-blue-700">
              <h4 className="modal-h4 flex items-center gap-2">
                <span>💡</span> Recomendaciones Prácticas
              </h4>
              <div className="space-y-3 modal-text text-sm">
                <p>
                  <strong>Cuándo usar {system.name}:</strong>
                </p>
                <ul className="space-y-1.5 ml-4">
                  {system.recommendedFor.slice(0, 3).map((use, index) => (
                    <li key={index} className="list-disc">{use}</li>
                  ))}
                </ul>
                
                <p className="mt-3">
                  <strong>Latitudes óptimas:</strong> {system.latitudeRange}
                </p>

                {system.latitudeRange.includes('66°') && system.id !== 'whole-sign' && system.id !== 'equal-house' && (
                  <p className="text-xs p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg border border-yellow-300 dark:border-yellow-700">
                    ⚠️ <strong>Nota:</strong> En latitudes extremas (&gt;66°), considera usar Whole Sign o Equal House 
                    para evitar distorsiones matemáticas.
                  </p>
                )}
              </div>
            </section>
          </div>
        )}

        {/* Footer con link al configurador */}
        <div className="mt-6 pt-4 border-t border-gray-300 dark:border-gray-700">
          <p className="text-xs sm:text-sm text-center text-gray-600 dark:text-gray-400">
            💡 Puedes cambiar el sistema de casas usado en tus cartas natales{' '}
            <a 
              href="/natal-chart" 
              className="text-purple-600 dark:text-purple-400 font-semibold hover:underline"
            >
              generando una nueva carta
            </a>
            {' '}→ Botón Config (⚙️) → Sistema de Casas
          </p>
        </div>
      </div>
    </StandardModal>
  );
};

export default HouseSystemModal;
