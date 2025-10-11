import React from 'react';
import CHART_SHAPES_GLOSSARY from '../data/chartShapesGlossary';
import ChartShapeGlossaryCard from './ChartShapeGlossaryCard';

const ChartShapesGrid: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* Header con descripción */}
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl p-6 mb-6 border-2 border-purple-300 dark:border-purple-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-3">
          <span className="text-3xl">🌀</span>
          Formas de Carta Natal
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Las <strong>7 Formas de Carta Natal</strong> según Marc Edmund Jones representan patrones geométricos formados por la distribución de los planetas en el zodíaco. 
          Cada forma revela un arquetipo psicológico único, un camino de desarrollo personal y un modo específico de relacionarse con la vida.
        </p>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-2">
          Haz clic en cada forma para explorar su perfil psicológico, sombras, camino de evolución, ejemplos históricos y ejercicios de integración.
        </p>
      </div>

      {/* Grid de formas */}
      <div className="space-y-4">
        {CHART_SHAPES_GLOSSARY.map(shape => (
          <ChartShapeGlossaryCard key={shape.id} shape={shape} />
        ))}
      </div>

      {/* Footer informativo */}
      <div className="mt-8 bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          <span className="font-semibold text-purple-700 dark:text-purple-400">💡 Nota:</span> Para descubrir la forma de tu carta natal, 
          genera tu carta en la sección <strong>Carta Natal</strong> y navega a la pestaña <strong>"Forma"</strong>.
        </p>
      </div>
    </div>
  );
};

export default ChartShapesGrid;
