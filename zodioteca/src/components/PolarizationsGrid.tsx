import React, { useState } from 'react';
import { POLARIZATIONS, INTEGRATION_EXERCISE } from '../types/polarization';
import type { Polarization } from '../types/polarization';
import PolarizationModal from './PolarizationModal';

const PolarizationsGrid: React.FC = () => {
  const [selectedPolarization, setSelectedPolarization] = useState<Polarization | null>(null);
  const [filter, setFilter] = useState<'all' | 'type' | 'example'>('all');

  const filteredPolarizations = POLARIZATIONS.filter(pol => 
    filter === 'all' || pol.category === filter
  );

  const getPolarizationGradient = (name: string) => {
    const gradients: { [key: string]: string } = {
      'Polarización por Planeta': 'from-indigo-600 to-purple-700',
      'Polarización por Signo': 'from-blue-600 to-indigo-700',
      'Polarización por Elemento': 'from-red-500 to-orange-600',
      'Polarización por Modalidad': 'from-yellow-500 to-amber-600',
      'Neptuno Polarizado': 'from-violet-600 to-purple-700',
      'Saturno Polarizado': 'from-gray-800 to-gray-900',
      'Marte Polarizado': 'from-red-600 to-rose-700',
      'Venus Polarizado': 'from-pink-500 to-rose-600'
    };
    return gradients[name] || 'from-purple-600 to-pink-600';
  };

  const typeCount = POLARIZATIONS.filter(p => p.category === 'type').length;
  const exampleCount = POLARIZATIONS.filter(p => p.category === 'example').length;

  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-6">
      {/* Descripción */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-3 sm:p-4 md:p-5 lg:p-6 rounded-lg">
        <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2 text-purple-900 dark:text-purple-200 flex items-center gap-1.5 sm:gap-2">
          ⚖️ ¿Qué son las Polarizaciones Planetarias?
        </h3>
        <p className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
          Una <strong>polarización</strong> ocurre cuando un planeta, signo, elemento o modalidad toma 
          demasiada fuerza en la carta natal<span className="hidden sm:inline">. Puede ser por acumulación de planetas en un mismo signo/elemento, 
          o porque un planeta recibe múltiples aspectos tensos convirtiéndose en un <strong>"foco" de la dinámica</strong></span>.
        </p>
        <div className="bg-white/50 dark:bg-gray-800/50 p-2 sm:p-3 md:p-4 rounded-lg mt-2 sm:mt-3">
          <h4 className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1 sm:mb-2">🎯 Efectos de la Polarización</h4>
          <p className="text-[10px] sm:text-xs md:text-sm text-gray-700 dark:text-gray-300">
            La polarización genera un <strong>desequilibrio energético</strong>: es el área donde la persona 
            vive más aprendizajes<span className="hidden sm:inline"> y desafíos, y a la vez donde tiene <strong>más potencial de maestría</strong> 
            si logra integrar conscientemente esa energía</span>.
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-3 sm:flex gap-1.5 sm:gap-2 sm:flex-wrap px-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-base font-medium transition-all ${
            filter === 'all'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Todas ({POLARIZATIONS.length})
        </button>
        <button
          onClick={() => setFilter('type')}
          className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-base font-medium transition-all ${
            filter === 'type'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Tipos ({typeCount})
        </button>
        <button
          onClick={() => setFilter('example')}
          className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-base font-medium transition-all ${
            filter === 'example'
              ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Ejemplos ({exampleCount})
        </button>
      </div>

      {/* Grid de Polarizaciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        {filteredPolarizations.map((polarization) => (
          <button
            key={polarization.name}
            data-id={polarization.name.toLowerCase()}
            onClick={() => setSelectedPolarization(polarization)}
            className={`bg-gradient-to-br ${getPolarizationGradient(polarization.name)} text-white p-3 sm:p-4 md:p-5 lg:p-6 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex flex-col items-center gap-1.5 sm:gap-2 md:gap-3 text-left`}
          >
            <span className="text-4xl sm:text-5xl md:text-6xl">{polarization.symbol}</span>
            <div className="text-center w-full">
              <h3 className="font-bold text-xs sm:text-sm leading-tight">{polarization.name}</h3>
              <p className="text-[10px] sm:text-xs opacity-90 mt-1 sm:mt-2">{polarization.chakra}</p>
            </div>
            <span className="text-[10px] sm:text-xs bg-white/20 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full mt-auto">
              {polarization.category === 'type' ? 'Tipo' : 'Ejemplo'}
            </span>
          </button>
        ))}
      </div>

      {/* Ejercicio Holístico de Integración */}
      <div className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 p-6 rounded-lg border-2 border-green-400 dark:border-green-700">
        <h3 className="text-xl font-semibold mb-3 text-green-900 dark:text-green-200 flex items-center gap-2">
          🧘 {INTEGRATION_EXERCISE.title}
        </h3>
        <ol className="space-y-2 text-gray-700 dark:text-gray-300">
          {INTEGRATION_EXERCISE.steps.map((step, index) => (
            <li key={index}>
              <strong>{index + 1}.</strong> {step}
            </li>
          ))}
        </ol>
      </div>

      {/* Tabla de Signos Opuestos */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
        <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-4 text-lg">
          🔄 Ejes de Signos Opuestos (para integración)
        </h4>
        <div className="grid md:grid-cols-2 gap-3 text-sm">
          <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
            <strong className="text-gray-700 dark:text-gray-300">♈ Aries ↔ ♎ Libra</strong>
            <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">Yo vs. Nosotros</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
            <strong className="text-gray-700 dark:text-gray-300">♉ Tauro ↔ ♏ Escorpio</strong>
            <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">Estabilidad vs. Transformación</p>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
            <strong className="text-gray-700 dark:text-gray-300">♊ Géminis ↔ ♐ Sagitario</strong>
            <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">Información vs. Sabiduría</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <strong className="text-gray-700 dark:text-gray-300">♋ Cáncer ↔ ♑ Capricornio</strong>
            <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">Hogar vs. Carrera</p>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
            <strong className="text-gray-700 dark:text-gray-300">♌ Leo ↔ ♒ Acuario</strong>
            <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">Individual vs. Colectivo</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
            <strong className="text-gray-700 dark:text-gray-300">♍ Virgo ↔ ♓ Piscis</strong>
            <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">Orden vs. Caos Creativo</p>
          </div>
        </div>
      </div>

      {/* Elementos y su balance */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">
          🔥 Elementos y su Equilibrio
        </h4>
        <div className="grid md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-2xl">🔥</span>
            <div>
              <strong className="text-gray-700 dark:text-gray-300">Fuego:</strong>
              <span className="text-gray-600 dark:text-gray-400"> Acción, entusiasmo → Exceso: impulsividad</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-2xl">🌍</span>
            <div>
              <strong className="text-gray-700 dark:text-gray-300">Tierra:</strong>
              <span className="text-gray-600 dark:text-gray-400"> Realismo, trabajo → Exceso: rigidez</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-2xl">💨</span>
            <div>
              <strong className="text-gray-700 dark:text-gray-300">Aire:</strong>
              <span className="text-gray-600 dark:text-gray-400"> Mente, comunicación → Exceso: dispersión</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-2xl">💧</span>
            <div>
              <strong className="text-gray-700 dark:text-gray-300">Agua:</strong>
              <span className="text-gray-600 dark:text-gray-400"> Emociones, intuición → Exceso: hipersensibilidad</span>
            </div>
          </div>
        </div>
      </div>

      {/* Nota */}
      <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border-l-4 border-amber-500">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <strong>💡 Clave:</strong> La polarización no es "mala" – es un <strong>área de maestría potencial</strong>. 
          El desafío está en reconocer el desequilibrio y trabajar conscientemente la energía opuesta complementaria 
          para lograr integración y balance.
        </p>
      </div>

      {/* Modal */}
      <PolarizationModal
        polarization={selectedPolarization}
        isOpen={selectedPolarization !== null}
        onClose={() => setSelectedPolarization(null)}
      />
    </div>
  );
};

export default PolarizationsGrid;
