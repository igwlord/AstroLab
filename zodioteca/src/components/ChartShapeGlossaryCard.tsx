import React, { useState, useEffect } from 'react';
import type { ChartShapeGlossaryEntry } from '../data/chartShapesGlossary';
import FavoriteToggleButton from './FavoriteToggleButton';

interface ChartShapeGlossaryCardProps {
  shape: ChartShapeGlossaryEntry;
  autoExpand?: boolean;
}

const ChartShapeGlossaryCard: React.FC<ChartShapeGlossaryCardProps> = ({ shape, autoExpand = false }) => {
  const [expanded, setExpanded] = useState(false);

  // Auto-expandir si viene desde favoritos
  useEffect(() => {
    if (autoExpand) {
      setExpanded(true);
    }
  }, [autoExpand]);

  return (
    <div 
      data-shape-id={shape.id}
      className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-purple-200 dark:border-purple-700"
    >
      <div className="absolute top-2 right-2 z-20">
        <FavoriteToggleButton
          item={{
            type: 'chart-shape',
            scope: 'global',
            title: shape.name,
            icon: shape.emoji,
            route: `/glossary?categoria=chart-shapes#shape-${shape.id}`,
            targetId: shape.id,
            tags: shape.keywords,
            pinned: false
          }}
          size="sm"
          variant="amber"
        />
      </div>
      {/* Header con emoji y nombre */}
      <div 
        className="p-6 cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-5xl" aria-hidden="true">{shape.emoji}</span>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {shape.name}
              </h3>
              <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
                {shape.shortDescription}
              </p>
            </div>
          </div>
          <button
            className="ml-4 p-2 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors"
            aria-label={expanded ? 'Colapsar' : 'Expandir'}
          >
            <svg
              className={`w-6 h-6 text-purple-600 dark:text-purple-400 transition-transform duration-300 ${
                expanded ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Keywords siempre visibles */}
        <div className="flex flex-wrap gap-2 mt-4">
          {shape.keywords.map((keyword, idx) => (
            <span
              key={idx}
              className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>

      {/* Contenido expandible */}
      {expanded && (
        <div className="px-6 pb-6 space-y-6 animate-in slide-in-from-top duration-300">
          {/* Descripción completa */}
          <section>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="text-purple-600 dark:text-purple-400">📖</span>
              Descripción
            </h4>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {shape.fullDescription.split('\n\n').map((para, idx) => (
                <p key={idx} className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {para}
                </p>
              ))}
            </div>
          </section>

          {/* Perfil Psicológico */}
          <section className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="text-blue-600 dark:text-blue-400">🧠</span>
              Perfil Psicológico
            </h4>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {shape.psychologicalProfile.split('\n\n').map((para, idx) => (
                <p key={idx} className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {para.split('\n').map((line, lineIdx) => (
                    <React.Fragment key={lineIdx}>
                      {line.startsWith('•') ? (
                        <span className="block ml-4 before:content-['•'] before:mr-2 before:text-blue-600 dark:before:text-blue-400">
                          {line.substring(1).trim()}
                        </span>
                      ) : (
                        line
                      )}
                      {lineIdx < para.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </p>
              ))}
            </div>
          </section>

          {/* Sombra */}
          <section className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="text-amber-600 dark:text-amber-400">🌓</span>
              La Sombra
            </h4>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {shape.shadow.split('\n\n').map((para, idx) => (
                <p key={idx} className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {para}
                </p>
              ))}
            </div>
          </section>

          {/* Evolución */}
          <section className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="text-green-600 dark:text-green-400">🌱</span>
              Camino de Evolución
            </h4>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {shape.evolution.split('\n\n').map((para, idx) => (
                <p key={idx} className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {para}
                </p>
              ))}
            </div>
          </section>

          {/* Ejemplos Históricos */}
          {shape.historicalExamples.length > 0 && (
            <section className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="text-purple-600 dark:text-purple-400">⭐</span>
                Ejemplos Históricos
              </h4>
              <ul className="space-y-2">
                {shape.historicalExamples.map((example, idx) => (
                  <li key={idx} className="text-gray-700 dark:text-gray-300 leading-relaxed flex items-start gap-2">
                    <span className="text-purple-600 dark:text-purple-400 mt-1">▸</span>
                    <span>{example}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Ejercicio de Integración */}
          <section className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg p-5 border-2 border-purple-300 dark:border-purple-600">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="text-purple-600 dark:text-purple-400">✨</span>
              {shape.integrationExercise.title}
            </h4>
            <ol className="space-y-3">
              {shape.integrationExercise.steps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 dark:bg-purple-500 text-white text-sm font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="text-gray-800 dark:text-gray-200 leading-relaxed flex-1">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        </div>
      )}
    </div>
  );
};

export default ChartShapeGlossaryCard;
